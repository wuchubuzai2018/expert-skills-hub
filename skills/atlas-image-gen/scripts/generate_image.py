#!/usr/bin/env python3
"""Generate one image through Atlas Cloud with a single billable submit."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import sys
import time
from typing import Any
from urllib import error, parse, request


DEFAULT_API_BASE = "https://api.atlascloud.ai"
DEFAULT_MODEL = "openai/gpt-image-2/text-to-image"
USER_AGENT = "expert-skills-hub-atlas-image-gen/1.0"


class AtlasError(RuntimeError):
    """Raised when Atlas submission, polling, or output retrieval fails."""


def normalize_api_base(value: str) -> str:
    base = value.rstrip("/")
    if base.endswith("/api/v1"):
        return base
    if base.endswith("/v1"):
        base = base[: -len("/v1")]
    return f"{base}/api/v1"


def parse_atlas_data(body: Any) -> dict[str, Any]:
    if not isinstance(body, dict):
        raise AtlasError("Atlas response must be a JSON object")
    if body.get("code") not in (None, 0, 200, "0", "200"):
        message = body.get("msg") or body.get("message") or "unknown error"
        raise AtlasError(f"Atlas API error {body.get('code')}: {message}")
    data = body.get("data", body)
    if not isinstance(data, dict):
        raise AtlasError("Atlas response data must be an object")
    return data


def prediction_id(data: dict[str, Any]) -> str | None:
    value = data.get("id") or data.get("prediction_id") or data.get("predictionId")
    if not value and isinstance(data.get("prediction"), dict):
        value = data["prediction"].get("id")
    return str(value) if value else None


def output_url(value: Any) -> str | None:
    if isinstance(value, str) and value.startswith(("https://", "http://")):
        return value
    if isinstance(value, list):
        for item in value:
            found = output_url(item)
            if found:
                return found
    if isinstance(value, dict):
        for key in ("url", "image_url", "imageUrl", "outputs", "output", "result", "results"):
            if key in value:
                found = output_url(value[key])
                if found:
                    return found
    return None


def read_json(response: Any) -> dict[str, Any]:
    try:
        return json.loads(response.read().decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise AtlasError("Atlas returned invalid JSON") from exc


def submit_once(url: str, api_key: str, payload: dict[str, Any], timeout: float) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = request.Request(
        url,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with request.urlopen(req, timeout=timeout) as response:
            return read_json(response)
    except (error.HTTPError, error.URLError, TimeoutError) as exc:
        raise AtlasError(f"Atlas generation submit failed: {exc}") from exc


def poll_prediction(
    url: str,
    api_key: str,
    deadline: float,
    initial_delay: float,
) -> dict[str, Any]:
    delay = max(0.1, initial_delay)
    last_error: str | None = None
    while time.monotonic() < deadline:
        req = request.Request(
            url,
            method="GET",
            headers={"Authorization": f"Bearer {api_key}", "User-Agent": USER_AGENT},
        )
        try:
            remaining = max(1.0, deadline - time.monotonic())
            with request.urlopen(req, timeout=min(60.0, remaining)) as response:
                data = parse_atlas_data(read_json(response))
            status = str(data.get("status", "")).lower()
            if output_url(data):
                return data
            if status in {"failed", "error", "cancelled", "canceled"}:
                detail = data.get("error") or data.get("message") or "no detail"
                raise AtlasError(f"Atlas prediction ended with status {status}: {detail}")
        except AtlasError:
            raise
        except (error.HTTPError, error.URLError, TimeoutError) as exc:
            last_error = str(exc)

        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break
        time.sleep(min(delay, remaining))
        delay = min(delay * 1.5, 10.0)

    suffix = f"; last GET error: {last_error}" if last_error else ""
    raise AtlasError(f"Atlas prediction did not finish before timeout{suffix}")


def download_once(url: str, destination: Path, timeout: float) -> None:
    req = request.Request(url, method="GET", headers={"User-Agent": USER_AGENT})
    try:
        with request.urlopen(req, timeout=timeout) as response:
            content = response.read()
    except (error.HTTPError, error.URLError, TimeoutError) as exc:
        raise AtlasError(f"Atlas output download failed: {exc}") from exc
    if not content:
        raise AtlasError("Atlas output download was empty")
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)


def generate_image(
    *,
    prompt: str,
    output: Path,
    api_key: str,
    api_base: str = DEFAULT_API_BASE,
    model: str = DEFAULT_MODEL,
    size: str = "1024x1024",
    quality: str = "medium",
    output_format: str = "png",
    moderation: str = "low",
    timeout: float = 300.0,
    poll_interval: float = 2.0,
) -> dict[str, Any]:
    if timeout <= 0:
        raise AtlasError("timeout must be greater than zero")
    api_root = normalize_api_base(api_base)
    payload = {
        "model": model,
        "prompt": prompt,
        "size": size,
        "quality": quality,
        "output_format": output_format,
        "moderation": moderation,
    }
    started = time.monotonic()
    submit_body = submit_once(
        f"{api_root}/model/generateImage",
        api_key,
        payload,
        min(120.0, timeout),
    )
    data = parse_atlas_data(submit_body)
    task_id = prediction_id(data)
    result_url = output_url(data)
    if not result_url:
        if not task_id:
            raise AtlasError("Atlas submit response did not include a prediction id or output URL")
        data = poll_prediction(
            f"{api_root}/model/prediction/{parse.quote(task_id, safe='')}",
            api_key,
            started + timeout,
            poll_interval,
        )
        result_url = output_url(data)
    if not result_url:
        raise AtlasError("Atlas prediction did not include an output URL")
    remaining = max(1.0, started + timeout - time.monotonic())
    download_once(result_url, output, min(120.0, remaining))
    return {"prediction_id": task_id, "output": str(output), "model": model}


def default_output(output_format: str) -> Path:
    suffix = "jpg" if output_format == "jpeg" else "png"
    return Path(time.strftime(f"atlas-image-%Y%m%d-%H%M%S.{suffix}"))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate one image through Atlas Cloud")
    parser.add_argument("--prompt", "-p", required=True, help="Text-to-image prompt")
    parser.add_argument("--output", "-o", type=Path, help="Output image path")
    parser.add_argument("--model", default=os.environ.get("ATLASCLOUD_IMAGE_MODEL", DEFAULT_MODEL))
    parser.add_argument("--size", default="1024x1024")
    parser.add_argument("--quality", choices=("low", "medium", "high"), default="medium")
    parser.add_argument("--output-format", choices=("png", "jpeg"), default="png")
    parser.add_argument("--moderation", default="low")
    parser.add_argument("--timeout", type=float, default=300.0)
    parser.add_argument("--poll-interval", type=float, default=2.0)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    api_key = os.environ.get("ATLASCLOUD_API_KEY") or os.environ.get("ATLAS_CLOUD_API_KEY")
    if not api_key:
        print("错误: 请设置 ATLASCLOUD_API_KEY 环境变量", file=sys.stderr)
        return 2
    output = args.output or default_output(args.output_format)
    api_base = os.environ.get("ATLASCLOUD_API_BASE", DEFAULT_API_BASE)
    try:
        result = generate_image(
            prompt=args.prompt,
            output=output,
            api_key=api_key,
            api_base=api_base,
            model=args.model,
            size=args.size,
            quality=args.quality,
            output_format=args.output_format,
            moderation=args.moderation,
            timeout=args.timeout,
            poll_interval=args.poll_interval,
        )
    except AtlasError as exc:
        print(f"错误: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
