#!/usr/bin/env python3
"""
PDF转图片脚本

功能：
将PDF文件的每一页转换为图片（PNG或JPG）
"""

import argparse
import os
import sys
import zipfile

try:
    import fitz  # PyMuPDF
except ImportError:
    print("错误：未安装pymupdf库，请执行：pip install pymupdf>=1.23.0")
    sys.exit(1)

# PDF最大页数限制
MAX_PAGES = 100


def pdf_to_images(
    pdf_path: str,
    output_dir: str,
    image_format: str = "png",
    dpi: int = 200
) -> list:
    """
    将PDF文件的每一页转换为图片

    参数:
        pdf_path: PDF文件路径
        output_dir: 图片输出目录
        image_format: 图片格式（png或jpg）
        dpi: 图片分辨率

    返回:
        生成的图片文件路径列表
    """
    # 打开PDF文件
    pdf_document = fitz.open(pdf_path)
    total_pages = len(pdf_document)

    # 检查页数限制
    if total_pages > MAX_PAGES:
        pdf_document.close()
        print(f"错误：PDF文件超过{MAX_PAGES}页（当前{total_pages}页），暂不支持转换")
        print(f"提示：请拆分PDF文件为多个小于{MAX_PAGES}页的文件后再转换")
        sys.exit(1)

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    print(f"正在处理PDF文件，共 {total_pages} 页...")

    image_paths = []
    zoom = dpi / 72.0  # 计算缩放比例

    for page_num in range(total_pages):
        page = pdf_document.load_page(page_num)
        mat = fitz.Matrix(zoom, zoom)  # 缩放矩阵
        pix = page.get_pixmap(matrix=mat)

        # 生成文件名
        file_ext = "png" if image_format.lower() == "png" else "jpg"
        filename = f"page_{page_num + 1:03d}.{file_ext}"
        image_path = os.path.join(output_dir, filename)

        # 保存图片
        if file_ext == "jpg":
            pix.save(image_path, jpg_quality=95)
        else:
            pix.save(image_path)

        image_paths.append(filename)
        print(f"已转换第 {page_num + 1}/{total_pages} 页 -> {filename}")

    pdf_document.close()
    print(f"图片转换完成，共生成 {len(image_paths)} 张图片")

    return image_paths


def create_zip(
    images_dir: str,
    zip_output: str
):
    """
    将图片目录打包成ZIP文件

    参数:
        images_dir: 图片目录路径
        zip_output: ZIP输出文件路径
    """
    print(f"\n正在创建ZIP压缩包...")

    # 检查图片目录是否存在
    if not os.path.exists(images_dir):
        print(f"错误：图片目录不存在 - {images_dir}")
        sys.exit(1)

    # 获取所有图片文件
    image_extensions = ('.png', '.jpg', '.jpeg', '.gif', '.bmp')
    image_files = sorted(
        [f for f in os.listdir(images_dir) if f.lower().endswith(image_extensions)]
    )

    if not image_files:
        print(f"错误：在目录 {images_dir} 中未找到图片文件")
        sys.exit(1)

    # 创建ZIP文件
    try:
        with zipfile.ZipFile(zip_output, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for image_file in image_files:
                image_path = os.path.join(images_dir, image_file)
                # 添加到ZIP，保持文件名
                zipf.write(image_path, image_file)
                print(f"  已添加: {image_file}")

        # 获取ZIP文件大小
        zip_size = os.path.getsize(zip_output)
        zip_size_mb = zip_size / (1024 * 1024)

        print(f"\nZIP压缩包创建成功！")
        print(f"文件路径: {zip_output}")
        print(f"包含文件: {len(image_files)} 个")
        print(f"文件大小: {zip_size_mb:.2f} MB")

    except Exception as e:
        print(f"错误：ZIP压缩包创建失败 - {str(e)}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="将PDF文件转换为图片"
    )
    parser.add_argument(
        '--input',
        required=True,
        help='输入PDF文件路径'
    )
    parser.add_argument(
        '--output-dir',
        default='images',
        help='图片输出目录（默认：images）'
    )
    parser.add_argument(
        '--image-format',
        choices=['png', 'jpg'],
        default='png',
        help='图片格式（png或jpg），默认为png'
    )
    parser.add_argument(
        '--dpi',
        type=int,
        default=200,
        help='图片分辨率（DPI），默认为200'
    )
    parser.add_argument(
        '--zip',
        action='store_true',
        help='生成ZIP压缩包'
    )
    parser.add_argument(
        '--zip-output',
        default='images.zip',
        help='ZIP压缩包输出路径（默认：images.zip）'
    )

    args = parser.parse_args()

    # 检查输入文件是否存在
    if not os.path.exists(args.input):
        print(f"错误：文件不存在 - {args.input}")
        sys.exit(1)

    # 检查是否为PDF文件
    if not args.input.lower().endswith('.pdf'):
        print("警告：输入文件可能不是PDF文件")

    # 转换PDF为图片
    try:
        image_paths = pdf_to_images(
            pdf_path=args.input,
            output_dir=args.output_dir,
            image_format=args.image_format,
            dpi=args.dpi
        )
    except Exception as e:
        print(f"错误：PDF转换失败 - {str(e)}")
        sys.exit(1)

    print("\n转换完成！")
    print(f"图片保存位置: {args.output_dir}")
    print(f"生成的图片文件: {', '.join(image_paths[:5])}{'...' if len(image_paths) > 5 else ''}")

    # 生成ZIP压缩包
    if args.zip:
        try:
            create_zip(
                images_dir=args.output_dir,
                zip_output=args.zip_output
            )
        except Exception as e:
            print(f"错误：ZIP压缩失败 - {str(e)}")
            sys.exit(1)


if __name__ == "__main__":
    main()
