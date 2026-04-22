#!/usr/bin/env python3
"""
基于GPT Image 2 All的图片生成与编辑脚本（Python版）
使用API易国内代理服务

支持功能：
- 文生图：根据提示词生成图片
- 图生图：根据编辑指令修改已有图片
- 多图融合：参考多张图片融合

参数说明：
- -p, --prompt          图片描述或编辑指令文本（必需）
- -f, --filename       输出图片路径（可选，默认自动生成时间戳文件名）
- -r, --response-format 响应格式（可选：url/b64_json，默认url）
- -i, --input-image    输入图片路径（可选，可多张，最多5张）
- -k, --api-key       API密钥（可选，覆盖环境变量 APIYI_API_KEY）

使用示例：
【生成新图片】
  python generate_image.py -p "一只可爱的橘猫"
  python generate_image.py -p "横版 16:9 电影画幅，日落山脉" -f sunset.png
  python generate_image.py -p "竖版 9:16 手机海报，城市夜景" -f city.png

【编辑已有图片】
  python generate_image.py -p "转换成油画风格" -i original.png
  python generate_image.py -p "添加彩虹到天空" -i photo.jpg -f edited.png
  python generate_image.py -p "将背景换成海滩" -i portrait.png -f beach-bg.png

【多图融合】
  python generate_image.py -p "融合图1和图2的风格" -i ref1.png ref2.png -f merged.png

【环境变量】
  export APIYI_API_KEY="your-api-key"
"""

import os
import sys
import re
import json
import base64
import argparse
import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any, Union

try:
    import requests
except ImportError:
    print("错误: 需要安装 requests 库，请运行: pip install requests")
    sys.exit(1)


SUPPORTED_RESPONSE_FORMATS = ['url', 'b64_json']
DEFAULT_RESPONSE_FORMAT = 'url'

DEFAULT_TIMEOUT = 300


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='基于GPT Image 2 All的图片生成与编辑工具（Python版）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
尺寸说明（通过prompt描述，无显式size参数）：
  - 方形: 1024×1024 方图 / 1:1 方形构图
  - 横版: 横版 16:9 / 宽屏 16:9 电影画幅
  - 竖版: 竖版 9:16 / 手机海报 9:16
  - 超宽: 横幅 21:9 超宽银幕
  - 印刷: 4:3 标准画幅 / 3:2 经典画幅

运行示例:
  python scripts/generate_image.py -p "一只可爱的橘猫"
  python scripts/generate_image.py -p "横版 16:9 电影画幅，日落山脉" -f sunset.png
  python scripts/generate_image.py -p "转换成油画风格" -i original.png
  python scripts/generate_image.py -p "融合图1和图2的风格" -i ref1.png ref2.png -f merged.png
'''
    )
    parser.add_argument('-p', '--prompt', required=True, help='图片描述或编辑指令文本（必需）')
    parser.add_argument('-f', '--filename', default=None, help='输出图片路径 (默认: 自动生成时间戳文件名)')
    parser.add_argument('-r', '--response-format', default=DEFAULT_RESPONSE_FORMAT, 
                        choices=SUPPORTED_RESPONSE_FORMATS,
                        help='响应格式 (默认: url)')
    parser.add_argument('-i', '--input-image', nargs='+', default=None,
                        help='输入图片路径（编辑模式，可传多张，最多5张）')
    parser.add_argument('-k', '--api-key', default=None, help='API密钥（覆盖环境变量）')

    return parser.parse_args()


def get_api_key(args_key: Optional[str]) -> str:
    if args_key:
        return args_key
    api_key = os.environ.get('APIYI_API_KEY')
    if not api_key:
        print('错误: 未设置 APIYI_API_KEY 环境变量', file=sys.stderr)
        print('请前往 https://api.apiyi.com 注册申请API Key', file=sys.stderr)
        print('或使用 -k/--api-key 参数临时指定', file=sys.stderr)
        sys.exit(1)
    return api_key


def encode_image_to_base64(image_path: str) -> str:
    try:
        with open(image_path, 'rb') as f:
            return base64.b64encode(f.read()).decode()
    except Exception as e:
        print(f'错误: 无法读取图片文件 {image_path} - {e}', file=sys.stderr)
        sys.exit(1)


def generate_filename(prompt: str) -> str:
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d-%H-%M-%S')

    keywords = str(prompt).split()[:3]
    keyword_str = '-'.join(keywords) if keywords else 'image'

    keyword_str = ''.join(c if c.isalnum() or c in '-_.' else '-' for c in keyword_str)
    keyword_str = keyword_str.lower()[:30]

    return f'{timestamp}-{keyword_str}.png'


def add_timestamp_to_filename(file_path: str, timestamp: str) -> str:
    path = Path(file_path)
    name = path.stem
    ext = path.suffix
    new_name = f'{name}-{timestamp}{ext}'
    return str(path.parent / new_name)


def extract_image_url(content: str) -> Optional[str]:
    if not content:
        return None
    url_match = re.search(r'(https?://[^\s)]+\.(png|jpg|jpeg|webp))', content, re.IGNORECASE)
    if url_match:
        return url_match.group(1)
    b64_match = re.search(r'(data:image/[^;]+;base64,[A-Za-z0-9+/=]+)', content)
    if b64_match:
        return b64_match.group(1)
    return None


def download_image(url_string: str) -> bytes:
    try:
        response = requests.get(url_string, timeout=30)
        if response.status_code < 200 or response.status_code >= 300:
            print(f'错误: 下载图片失败 - HTTP {response.status_code}', file=sys.stderr)
            sys.exit(1)
        return response.content
    except requests.exceptions.Timeout:
        print('错误: 下载图片超时', file=sys.stderr)
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f'错误: 下载图片失败 - {e}', file=sys.stderr)
        sys.exit(1)


def download_base64_image(url_string: str) -> str:
    image_buffer = download_image(url_string)
    return base64.b64encode(image_buffer).decode()


def main():
    args = parse_args()

    timestamp = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')

    if args.response_format not in SUPPORTED_RESPONSE_FORMATS:
        print(f"错误: 不支持的响应格式 '{args.response_format}'", file=sys.stderr)
        print(f"支持的格式: {', '.join(SUPPORTED_RESPONSE_FORMATS)}", file=sys.stderr)
        sys.exit(1)

    if not args.filename:
        args.filename = generate_filename(args.prompt)
    else:
        resolved = Path(args.filename).resolve()
        if resolved.exists():
            adjusted = add_timestamp_to_filename(args.filename, timestamp)
            print(f'⚠️ 输出文件已存在，将避免覆盖并改为: {adjusted}')
            args.filename = adjusted

    api_key = get_api_key(args.api_key)
    url = 'https://api.apiyi.com/v1/chat/completions'

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }

    content = []
    mode_str = '生成图片'

    if args.input_image and len(args.input_image) > 0:
        if len(args.input_image) > 5:
            print(f'错误: 输入图片最多支持5张，当前为 {len(args.input_image)} 张', file=sys.stderr)
            sys.exit(1)

        for img_path in args.input_image:
            if not Path(img_path).exists():
                print(f'错误: 输入图片不存在: {img_path}', file=sys.stderr)
                sys.exit(1)
            image_base64 = encode_image_to_base64(img_path)
            data_url = f'data:image/png;base64,{image_base64}'
            content.append({
                'type': 'image_url',
                'image_url': {'url': data_url}
            })

        mode_str = '编辑图片' if len(args.input_image) == 1 else '多图融合'

        content = [
            {
                'type': 'text',
                'text': args.prompt,
            },
            *content,
        ]
    else:
        content = args.prompt

    payload = {
        'model': 'gpt-image-2-all',
        'messages': [
            {
                'role': 'user',
                'content': content,
            },
        ],
    }

    if args.response_format == 'b64_json':
        payload['response_format'] = {'type': 'b64_json'}

    print('🎨 图片生成已启动！')
    print(f'⏱️ 预计时间: 约60秒到300秒')
    print(f'正在{mode_str}...')
    print(f'提示词: {args.prompt}')

    print('image generation in progress...')

    start_time = datetime.datetime.now()

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=DEFAULT_TIMEOUT)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        print('错误: 请求超时，请稍后重试', file=sys.stderr)
        sys.exit(1)
    except requests.exceptions.HTTPError as e:
        print(f'错误: 请求失败 - {e}', file=sys.stderr)
        try:
            error_detail = e.response.json()
            print(f'错误详情: {json.dumps(error_detail, indent=2, ensure_ascii=False)}', file=sys.stderr)
        except:
            print(f'响应内容: {e.response.text}', file=sys.stderr)
        sys.exit(1)
    except requests.exceptions.RequestException as e:
        print(f'错误: 请求失败 - {e}', file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print('错误: 响应不是有效的JSON', file=sys.stderr)
        sys.exit(1)

    elapsed = (datetime.datetime.now() - start_time).total_seconds()
    print(f'⏱️ 生成完成，耗时 {elapsed:.1f}秒')

    response_content = None
    if data and data.get('choices') and len(data['choices']) > 0:
        choice = data['choices'][0]
        if choice.get('message'):
            response_content = choice['message'].get('content')

    if not response_content:
        print('错误: 响应中未找到内容', file=sys.stderr)
        print(f'完整响应: {json.dumps(data, indent=2, ensure_ascii=False)}', file=sys.stderr)
        sys.exit(1)

    image_data = None

    if args.response_format == 'b64_json':
        b64_match = re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)', response_content)
        if b64_match:
            image_data = b64_match.group(1)

    if not image_data:
        image_url = extract_image_url(response_content)
        if image_url:
            if image_url.startswith('data:'):
                image_data = image_url.replace('data:image/png;base64,', '')
            else:
                print('📥 正在下载图片...')
                image_data = download_base64_image(image_url)

    if not image_data:
        print('错误: 未能从响应中提取图片数据', file=sys.stderr)
        print(f'响应内容: {response_content}', file=sys.stderr)
        sys.exit(1)

    try:
        image_bytes = base64.b64decode(image_data)
    except Exception as e:
        print(f'错误: 图片数据解码失败 - {e}', file=sys.stderr)
        sys.exit(1)

    output_file = Path(args.filename).resolve()
    output_dir = output_file.parent
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file.write_bytes(image_bytes)

    print(f'✓ 图片已成功{mode_str}并保存到: {args.filename}')
    print('✅ 生成完成！')


if __name__ == '__main__':
    main()