#!/usr/bin/env python3
"""
基于GPT Image 2官方正式版的图片生成与编辑脚本（Python版）
使用API易国内代理服务

支持功能：
- 文生图：根据提示词生成图片
- 图生图：根据编辑指令修改已有图片
- 多图融合：参考多张图片融合

参数说明：
- -p, --prompt             图片描述或编辑指令文本（必需）
- -f, --filename           输出图片路径（可选，默认自动生成时间戳文件名）
- -s, --size              输出尺寸（可选）
- -q, --quality           画质档位（可选：low/medium/high/auto，默认auto）
- -o, --output-format     输出格式（可选：png/jpeg/webp，默认png）
- -c, --output-compression 输出压缩率（可选：0-100，默认85）
- -i, --input-image       输入图片路径（可选，可多张，最多5张）
- -k, --api-key           API密钥（可选，覆盖环境变量 APIYI_API_KEY）

使用示例：
【生成新图片】
  python generate_image.py -p "一只可爱的橘猫"
  python generate_image.py -p "日落山脉" -s "2048x1152" -q "high" -f sunset.png
  python generate_image.py -p "城市夜景" -s "2160x3840" -q "high" -f city.png

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
from typing import Optional

try:
    import requests
except ImportError:
    print("错误: 需要安装 requests 库，请运行: pip install requests")
    sys.exit(1)


SUPPORTED_SIZES = ['1024x1024', '1536x1024', '1024x1536', '2048x2048', '2048x1152', '3840x2160', '2160x3840']
SUPPORTED_QUALITIES = ['auto', 'low', 'medium', 'high']
SUPPORTED_OUTPUT_FORMATS = ['png', 'jpeg', 'webp']
DEFAULT_TIMEOUT = 500


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='基于GPT Image 2官方正式版的图片生成与编辑工具（Python版）',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
尺寸说明：
  - 预设值: 1024x1024, 1536x1024, 1024x1536, 2048x2048, 2048x1152, 3840x2160, 2160x3840
  - 也支持自定义尺寸（最大边≤3840，两边16倍数，比例≤3:1）

运行示例:
  python scripts/generate_image.py -p "一只可爱的橘猫"
  python scripts/generate_image.py -p "日落山脉" -s "2048x1152" -q "high" -f sunset.png
  python scripts/generate_image.py -p "转换成油画风格" -i original.png
  python scripts/generate_image.py -p "融合图1和图2的风格" -i ref1.png ref2.png -f merged.png
'''
    )
    parser.add_argument('-p', '--prompt', required=True, help='图片描述或编辑指令文本（必需）')
    parser.add_argument('-f', '--filename', default=None, help='输出图片路径 (默认: 自动生成时间戳文件名)')
    parser.add_argument('-s', '--size', default=None, help='输出尺寸 (可选)')
    parser.add_argument('-q', '--quality', default='auto', choices=SUPPORTED_QUALITIES, help='画质档位 (默认: auto)')
    parser.add_argument('-o', '--output-format', default='png', choices=SUPPORTED_OUTPUT_FORMATS, help='输出格式 (默认: png)')
    parser.add_argument('-c', '--output-compression', type=int, default=None, help='输出压缩率 (0-100，仅jpeg/webp生效)')
    parser.add_argument('-i', '--input-image', nargs='+', default=None, help='输入图片路径（编辑模式，可传多张，最多5张）')
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


def encode_image_to_base64(image_path: str) -> bytes:
    try:
        with open(image_path, 'rb') as f:
            return f.read()
    except Exception as e:
        print(f'错误: 无法读取图片文件 {image_path} - {e}', file=sys.stderr)
        sys.exit(1)


def generate_filename(prompt: str, output_format: str = 'png') -> str:
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y-%m-%d-%H-%M-%S')

    keywords = str(prompt).split()[:3]
    keyword_str = '-'.join(keywords) if keywords else 'image'

    keyword_str = ''.join(c if c.isalnum() or c in '-_.' else '-' for c in keyword_str)
    keyword_str = keyword_str.lower()[:30]

    ext = output_format if output_format != 'jpeg' else 'jpg'
    return f'{timestamp}-{keyword_str}.{ext}'


def add_timestamp_to_filename(file_path: str, timestamp: str) -> str:
    path = Path(file_path)
    name = path.stem
    ext = path.suffix
    new_name = f'{name}-{timestamp}{ext}'
    return str(path.parent / new_name)


def main():
    args = parse_args()

    timestamp = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')

    if args.size and args.size not in SUPPORTED_SIZES:
        size_pattern = re.match(r'^(\d+)x(\d+)$', args.size)
        if not size_pattern:
            print(f"错误: 无效的尺寸格式 '{args.size}'", file=sys.stderr)
            print(f"支持的预设尺寸: {', '.join(SUPPORTED_SIZES)} 或自定义尺寸 (如 1920x1080)", file=sys.stderr)
            sys.exit(1)
        w = int(size_pattern.group(1))
        h = int(size_pattern.group(2))
        if w > 3840 or h > 3840:
            print('错误: 尺寸最大边不能超过3840', file=sys.stderr)
            sys.exit(1)
        if w % 16 != 0 or h % 16 != 0:
            print('错误: 尺寸两边必须能被16整除', file=sys.stderr)
            sys.exit(1)
        if max(w / h, h / w) > 3:
            print('错误: 尺寸比例不能超过3:1', file=sys.stderr)
            sys.exit(1)
        mp = (w * h) / 1000000
        if mp < 0.65 or mp > 8.3:
            print(f'错误: 总像素必须在0.65-8.3MP之间 (当前{mp:.2f}MP)', file=sys.stderr)
            sys.exit(1)

    if args.quality not in SUPPORTED_QUALITIES:
        print(f"错误: 不支持的画质 '{args.quality}'", file=sys.stderr)
        print(f"支持的画质: {', '.join(SUPPORTED_QUALITIES)}", file=sys.stderr)
        sys.exit(1)

    if args.output_format not in SUPPORTED_OUTPUT_FORMATS:
        print(f"错误: 不支持的输出格式 '{args.output_format}'", file=sys.stderr)
        print(f"支持的格式: {', '.join(SUPPORTED_OUTPUT_FORMATS)}", file=sys.stderr)
        sys.exit(1)

    if args.output_compression is not None:
        if args.output_compression < 0 or args.output_compression > 100:
            print('错误: 输出压缩率必须在0-100之间', file=sys.stderr)
            sys.exit(1)

    if not args.filename:
        args.filename = generate_filename(args.prompt, args.output_format)
    else:
        resolved = Path(args.filename).resolve()
        if resolved.exists():
            adjusted = add_timestamp_to_filename(args.filename, timestamp)
            print(f'⚠️ 输出文件已存在，将避免覆盖并改为: {adjusted}')
            args.filename = adjusted

    api_key = get_api_key(args.api_key)
    headers = {
        'Authorization': f'Bearer {api_key}',
    }

    mode_str = '生成图片'
    start_time = datetime.datetime.now()

    if args.input_image and len(args.input_image) > 0:
        if len(args.input_image) > 5:
            print(f'错误: 输入图片最多支持5张，当前为 {len(args.input_image)} 张', file=sys.stderr)
            sys.exit(1)

        for img_path in args.input_image:
            if not Path(img_path).exists():
                print(f'错误: 输入图片不存在: {img_path}', file=sys.stderr)
                sys.exit(1)

        mode_str = '编辑图片' if len(args.input_image) == 1 else '多图融合'

        url = 'https://api.apiyi.com/v1/images/edits'

        files_list = [
            ('model', (None, 'gpt-image-2')),
            ('prompt', (None, args.prompt)),
        ]

        if args.size:
            files_list.append(('size', (None, args.size)))
        if args.quality:
            files_list.append(('quality', (None, args.quality)))
        if args.output_format:
            files_list.append(('output_format', (None, args.output_format)))
        if args.output_compression is not None:
            files_list.append(('output_compression', (None, str(args.output_compression))))

        for img_path in args.input_image:
            img_data = encode_image_to_base64(img_path)
            file_name = Path(img_path).name
            suffix = Path(img_path).suffix[1:].lower()
            mime_type = f'image/{suffix}' if suffix in ['png', 'jpg', 'jpeg', 'webp'] else 'image/png'
            files_list.append(('image[]', (file_name, img_data, mime_type)))

        print('🎨 图片生成已启动！')
        print(f'⏱️ 预计时间: 约120-150秒，请耐心等待')
        print(f'正在{mode_str}...')
        print(f'提示词: {args.prompt}')

        if args.size:
            print(f'尺寸: {args.size}')
        if args.quality:
            print(f'画质: {args.quality}')

        print('image generation in progress...')

        try:
            response = requests.post(url, headers=headers, files=files_list, timeout=DEFAULT_TIMEOUT)
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
    else:
        url = 'https://api.apiyi.com/v1/images/generations'

        payload = {
            'model': 'gpt-image-2',
            'prompt': args.prompt,
        }

        if args.size:
            payload['size'] = args.size
        if args.quality:
            payload['quality'] = args.quality
        if args.output_format:
            payload['output_format'] = args.output_format
        if args.output_compression is not None:
            payload['output_compression'] = args.output_compression

        print('🎨 图片生成已启动！')
        print(f'⏱️ 预计时间: 约120-150秒，请耐心等待')
        print(f'正在{mode_str}...')
        print(f'提示词: {args.prompt}')

        if args.size:
            print(f'尺��: {args.size}')
        if args.quality:
            print(f'画质: {args.quality}')

        print('image generation in progress...')

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

    elapsed = (datetime.datetime.now() - start_time).total_seconds()
    print(f'⏱️ 生成完成，耗时 {elapsed:.1f}秒')

    b64_json = None
    if data and data.get('data') and len(data['data']) > 0:
        b64_json = data['data'][0].get('b64_json')

    if not b64_json:
        print('错误: 响应中未找到图片数据', file=sys.stderr)
        print(f'完整响应: {json.dumps(data, indent=2, ensure_ascii=False)}', file=sys.stderr)
        sys.exit(1)

    try:
        image_bytes = base64.b64decode(b64_json)
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