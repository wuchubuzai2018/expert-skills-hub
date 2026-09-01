import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock
from urllib import error


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "generate_image.py"
SPEC = importlib.util.spec_from_file_location("atlas_generate_image", SCRIPT)
generate_image = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(generate_image)


class FakeResponse:
    def __init__(self, body):
        self.body = body if isinstance(body, bytes) else json.dumps(body).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, traceback):
        return False

    def read(self):
        return self.body


class AtlasImageGenerationTests(unittest.TestCase):
    def test_single_submit_bounded_poll_and_download(self):
        responses = [
            FakeResponse({"code": 200, "data": {"id": "prediction/123"}}),
            FakeResponse({"code": 200, "data": {"status": "processing"}}),
            FakeResponse(
                {
                    "code": 200,
                    "data": {"status": "succeeded", "outputs": ["https://cdn.example/image.png"]},
                }
            ),
            FakeResponse(b"png-bytes"),
        ]
        with tempfile.TemporaryDirectory() as temp_dir:
            output = Path(temp_dir) / "image.png"
            with (
                mock.patch.object(generate_image.request, "urlopen", side_effect=responses) as urlopen,
                mock.patch.object(generate_image.time, "sleep"),
            ):
                result = generate_image.generate_image(
                    prompt="a red cube",
                    output=output,
                    api_key="test-key",
                    size="1024x1024",
                    quality="low",
                    timeout=10,
                    poll_interval=0.1,
                )

            self.assertEqual(result["prediction_id"], "prediction/123")
            self.assertEqual(output.read_bytes(), b"png-bytes")
            self.assertEqual(urlopen.call_count, 4)
            submit_request = urlopen.call_args_list[0].args[0]
            self.assertEqual(submit_request.get_method(), "POST")
            self.assertEqual(
                json.loads(submit_request.data.decode("utf-8")),
                {
                    "model": "openai/gpt-image-2/text-to-image",
                    "prompt": "a red cube",
                    "size": "1024x1024",
                    "quality": "low",
                    "output_format": "png",
                    "moderation": "low",
                },
            )
            poll_request = urlopen.call_args_list[2].args[0]
            self.assertIn("prediction%2F123", poll_request.full_url)

    def test_submit_error_is_not_retried(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            with mock.patch.object(
                generate_image.request,
                "urlopen",
                side_effect=error.URLError("network unavailable"),
            ) as urlopen:
                with self.assertRaisesRegex(generate_image.AtlasError, "submit failed"):
                    generate_image.generate_image(
                        prompt="a red cube",
                        output=Path(temp_dir) / "image.png",
                        api_key="test-key",
                        timeout=10,
                    )
            urlopen.assert_called_once()


if __name__ == "__main__":
    unittest.main()
