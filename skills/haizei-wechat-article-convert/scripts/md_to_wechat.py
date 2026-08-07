#!/usr/bin/env python3
"""
Markdown to WeChat Official Account Article Converter
将 Markdown 转换为微信公众号兼容的 HTML

Usage:
    python md_to_wechat.py input.md output.html --theme default
    python md_to_wechat.py input.md --list-themes
"""

import argparse
import sys
import markdown
from bs4 import BeautifulSoup
import re
from pathlib import Path
import webbrowser
import urllib.parse


# 预设主题样式
THEMES = {
    "default": {
        "name": "默认主题",
        "description": "简洁大方的默认样式",
        "colors": {
            "primary": "#1e6bb8",
            "text": "#3f3f3f",
            "bg": "#ffffff",
            "border": "#dfe6e9",
            "code_bg": "#f6f8fa"
        },
        "font_size": {
            "title": "22px",
            "h1": "28px",
            "h2": "24px",
            "h3": "20px",
            "body": "16px",
            "code": "14px"
        }
    },
    "orange": {
        "name": "活力橙",
        "description": "活力的橙色主题",
        "colors": {
            "primary": "#e67e22",
            "text": "#2c3e50",
            "bg": "#ffffff",
            "border": "#fad7a0",
            "code_bg": "#fef5e7"
        },
        "font_size": {
            "title": "22px",
            "h1": "28px",
            "h2": "24px",
            "h3": "20px",
            "body": "16px",
            "code": "14px"
        }
    },
    "grid": {
        "name": "格子主题",
        "description": "简约格子主题，带序号徽章和动画效果",
        "colors": {
            "primary": "#52c41a",  # 默认清新绿，可通过 --grid-color 参数修改
            "text": "#333333",
            "bg": "#ffffff",
            "border": "#d9f7be",
            "code_bg": "#f6ffed",
            "grid_line": "#f5f5f5"
        },
        "font_size": {
            "title": "22px",
            "h1": "28px",
            "h2": "24px",
            "h3": "20px",
            "body": "15px",
            "code": "14px"
        },
        "grid_background": False,
        "numbered_headings": True,
        "font_family": "Optima-Regular, PingFangTC-light"
    },
    "aurora": {
        "name": "极光靛紫",
        "description": "前沿科技感的极光紫主题，适合 AI、产品发布、创新趋势类内容",
        "colors": {
            "primary": "#6c5ce7",
            "text": "#2d3436",
            "bg": "#ffffff",
            "border": "#dfe3fd",
            "code_bg": "#f4f2ff"
        },
        "font_size": {
            "title": "22px",
            "h1": "28px",
            "h2": "24px",
            "h3": "20px",
            "body": "16px",
            "code": "14px"
        }
    }
}


def apply_inline_styles(html_content, theme_name="default"):
    """将 CSS 样式内联到 HTML 元素中（微信公众号兼容）"""
    soup = BeautifulSoup(html_content, 'html.parser')
    theme = THEMES.get(theme_name, THEMES["default"])
    colors = theme["colors"]
    font_sizes = theme["font_size"]

    # 检查是否有特殊字体设置
    font_family = theme.get("font_family", None)
    if font_family:
        font_style = f"font-family: {font_family};"
    else:
        font_style = ""

    # 检查是否需要格子背景和序号标题
    grid_bg = theme.get("grid_background", False)
    numbered_headings = theme.get("numbered_headings", False)

    # 如果有序号标题或格子背景，添加动画样式
    if numbered_headings or grid_bg:
        # 添加动画样式到文档头部（旋转+缩放+渐近渐出）
        style_tag = soup.new_tag('style')
        style_tag.string = """
        @keyframes pulse-rotate-fade {
            0% { transform: scale(1) rotate(0deg); opacity: 1; }
            25% { transform: scale(1.08) rotate(5deg); opacity: 0.95; }
            50% { transform: scale(1.1) rotate(0deg); opacity: 0.9; }
            75% { transform: scale(1.08) rotate(-5deg); opacity: 0.95; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .number-badge-animation {
            animation: pulse-rotate-fade 3s ease-in-out infinite;
        }
        """
        soup.insert(0, style_tag)

        # 创建虚线格子背景样式（超细+超淡，线条色随主题配色）
        grid_line = colors.get("grid_line", "#f5f5f5")
        grid_bg_style = f"""
            background-image:
                repeating-linear-gradient(0deg,
                    transparent, transparent 19px,
                    {grid_line} 19px, {grid_line} 20px,
                    transparent 20px, transparent 40px
                ),
                repeating-linear-gradient(90deg,
                    transparent, transparent 19px,
                    {grid_line} 19px, {grid_line} 20px,
                    transparent 20px, transparent 40px
                );
            background-size: 40px 40px;
        """
        # 创建全局容器并添加格子背景
        main_section = soup.new_tag('section')
        main_section['style'] = f"width: 100%; {grid_bg_style} background-color: {colors['bg']}; padding: 2px 12px;"

        # 将所有内容移动到这个容器中
        for tag in list(soup.children):
            if tag.name != 'style':  # 保留 style 标签在主容器外
                main_section.append(tag.extract())

        soup.append(main_section)
    else:
        main_section = soup

    # 应用到段落
    for p in main_section.find_all('p'):
        p_style = f"margin: 1.5em 0; line-height: 1.8; color: {colors['text']}; font-size: {font_sizes['body']};"
        if font_family:
            p_style += f" {font_style}"
        p['style'] = p_style

    # 应用到H2标题（带序号，横向居中显示）
    h2_counter = 1
    for h2 in main_section.find_all('h2'):
        if numbered_headings:
            # 创建序号标题的嵌套结构（横向布局，整体居中）
            outer_section = soup.new_tag('section')
            outer_section['style'] = f"display: flex; flex-direction: row; justify-content: center; align-items: center; margin: 1.8em 0 1em;"

            # 创建圆形序号（带动画）
            number_section = soup.new_tag('section')
            number_section['style'] = f"width: 38px; height: 38px; border-radius: 50%; background: {colors['primary']}; display: flex; justify-content: center; align-items: center; margin-right: 12px; flex-shrink: 0;"
            number_section['class'] = 'number-badge-animation'

            number_p = soup.new_tag('p')
            number_p['style'] = f"font-size: 16px; font-weight: bold; color: #FFFFFF; line-height: 38px; margin: 0;"
            number_p.string = f"{h2_counter:02d}"

            number_section.append(number_p)
            outer_section.append(number_section)

            # 标题文字
            title_section = soup.new_tag('section')
            title_style = f"font-size: {font_sizes['h2']}; font-weight: bold; color: #333333; line-height: 38px;"
            if font_family:
                title_style += f" {font_style}"
            title_section['style'] = title_style

            # 将h2的文本移动到title_section
            for content in h2.contents:
                title_section.append(content.extract())

            outer_section.append(title_section)

            # 替换原来的h2
            h2.replace_with(outer_section)

            h2_counter += 1
        else:
            # 普通标题样式（居中）
            h2_style = f"margin: 1.8em 0 1em; font-size: {font_sizes['h2']}; font-weight: bold; color: {colors['primary']}; text-align: center;"
            if font_family:
                h2_style += f" {font_style}"
            h2['style'] = h2_style

    # 应用到H1标题（居中显示）
    for h1 in main_section.find_all('h1'):
        h1_style = f"margin: 2em 0 1em; font-size: {font_sizes['h1']}; font-weight: bold; color: {colors['primary']}; border-bottom: 2px solid {colors['border']}; padding-bottom: 0.5em; text-align: center;"
        if font_family:
            h1_style += f" {font_style}"
        h1['style'] = h1_style

    # 应用到H3标题（带双圆点图标）
    for h3 in main_section.find_all('h3'):
        # 创建H3的外层容器
        outer_section = soup.new_tag('section')
        outer_section['style'] = "display: flex; align-items: flex-start; margin: 1.5em 0 0.8em;"

        # 创建图标容器
        icon_section = soup.new_tag('section')
        icon_section['style'] = "height: 28px; margin-right: 8px; display: flex; align-items: center; justify-content: center;"

        # 实心圆点
        solid_span = soup.new_tag('span')
        solid_span['style'] = "width: 9px; height: 9px; background: #252525; border-radius: 50%;"

        # 空心圆点
        hollow_span = soup.new_tag('span')
        hollow_span['style'] = "width: 9px; height: 9px; border: 1px solid #252525; border-radius: 50%; margin-left: -4px;"

        icon_section.append(solid_span)
        icon_section.append(hollow_span)
        outer_section.append(icon_section)

        # 标题文字容器
        text_section = soup.new_tag('section')
        text_style = f"font-weight: 600; font-size: 16px; color: rgb(37, 37, 37); line-height: 28px; flex: 1 1 0%;"
        if font_family:
            text_style += f" {font_style}"
        text_section['style'] = text_style

        # 将h3的文本移动到text_section
        for content in h3.contents:
            text_section.append(content.extract())

        outer_section.append(text_section)

        # 替换原来的h3
        h3.replace_with(outer_section)

    # 应用到列表（处理嵌套列表缩进）
    for ul in main_section.find_all('ul'):
        # 检查是否为嵌套列表（父级也是列表）
        is_nested = ul.find_parent(['ul', 'ol']) is not None
        if is_nested:
            # 嵌套列表增加更多缩进
            ul_style = f"margin: 0.5em 0; padding-left: 2em; color: {colors['text']};"
        else:
            # 顶级列表
            ul_style = f"margin: 1em 0; padding-left: 1.2em; color: {colors['text']};"
        if font_family:
            ul_style += f" {font_style}"
        ul['style'] = ul_style

    for ol in main_section.find_all('ol'):
        # 检查是否为嵌套列表
        is_nested = ol.find_parent(['ul', 'ol']) is not None
        if is_nested:
            # 嵌套列表增加更多缩进
            ol_style = f"margin: 0.5em 0; padding-left: 2em; color: {colors['text']};"
        else:
            # 顶级列表
            ol_style = f"margin: 1em 0; padding-left: 1.2em; color: {colors['text']};"
        if font_family:
            ol_style += f" {font_style}"
        ol['style'] = ol_style

    for li in main_section.find_all('li'):
        li_style = f"margin: 0.5em 0; line-height: 1.6; color: {colors['text']}; font-size: {font_sizes['body']};"
        li['style'] = li_style

    # 应用到引用块
    for blockquote in main_section.find_all('blockquote'):
        bq_style = f"margin: 1.5em 0; padding: 1em 1.5em; border-left: 4px solid {colors['primary']}; background-color: {colors['code_bg']}; color: {colors['text']};"
        if font_family:
            bq_style += f" {font_style}"
        blockquote['style'] = bq_style

    # 应用到代码块 - 使用微信公众号风格
    for pre in main_section.find_all('pre'):
        # 获取代码内容
        code_content = pre.get_text()

        # 创建新的代码块结构
        outer_section = soup.new_tag('section')
        outer_section['style'] = "color: rgb(0, 0, 0); font-family: 'PingFang SC'; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; margin-top: 12px; background-color: rgb(40, 44, 52); margin-bottom: 12px; border-radius: 5px;"

        # 顶部图标栏
        top_span = soup.new_tag('span')
        top_span['style'] = "display: block; height: 30px; background-color: rgb(40, 44, 52); border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; color: rgb(0, 0, 0); font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"

        icon_span = soup.new_tag('span')
        icon_span['style'] = "height: 30px; line-height: 30px; margin-left: 10px; display: block; background: url('https://mmbiz.qpic.cn/sz_mmbiz_png/RVqfiaDPokvsWbCehxC5Cn1Ot97QFia03TeyIJzh7ibqB03FDARqbNxqjJggCICCT7tb8GBwoBoMAHd1xwx6libjYw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=15&wx_lazy=1') left center / auto 14px no-repeat;"
        icon_span.string = '  '  # 占位符

        top_span.append(icon_span)
        outer_section.append(top_span)

        # pre 标签
        new_pre = soup.new_tag('pre')
        new_pre['style'] = "margin: 0px;"

        # code 标签
        new_code = soup.new_tag('code')
        new_code['style'] = "color: rgb(171, 178, 191); background: rgb(40, 44, 52); padding: 4px 15px 15px; display: block; overflow-x: auto; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; font-family: Consolas, Monaco, Menlo, monospace; font-size: 14px; line-height: 1.5;"
        new_code.string = code_content

        new_pre.append(new_code)
        outer_section.append(new_pre)

        # 替换原来的 pre 标签
        pre.replace_with(outer_section)

    # 应用到行内代码
    for code in main_section.find_all('code'):
        if code.parent.name != 'pre' and not any(parent.name == 'section' and 'background-color: rgb(40, 44, 52)' in parent.get('style', '') for parent in code.parents):
            code['style'] = f"background-color: {colors['code_bg']}; padding: 0.2em 0.4em; border-radius: 3px; font-family: 'Monaco', 'Menlo', monospace; font-size: {font_sizes['code']}; color: {colors['primary']};"

    # 应用到链接
    for a in main_section.find_all('a'):
        a['style'] = f"color: {colors['primary']}; text-decoration: none; border-bottom: 1px dashed {colors['primary']};"

    # 应用到表格
    for table in main_section.find_all('table'):
        table['style'] = f"border-collapse: collapse; width: 100%; margin: 1.5em 0;"
    for th in main_section.find_all('th'):
        th['style'] = f"border: 1px solid {colors['border']}; padding: 0.8em; background-color: {colors['code_bg']}; font-weight: bold; text-align: left;"
    for td in main_section.find_all('td'):
        td['style'] = f"border: 1px solid {colors['border']}; padding: 0.8em;"

    # 应用到图片
    local_images = []
    for img in main_section.find_all('img'):
        img['style'] = "max-width: 100%; height: auto; display: block; margin: 1.5em auto;"

        # 检测本地图片路径
        src = img.get('src', '')
        if src and not src.startswith(('http://', 'https://', 'data:')):
            # 这是一个本地图片路径
            local_images.append(src)
            # 添加一个占位符样式，表明这是本地图片
            img['data-local-image'] = 'true'
            img['alt'] = img.get('alt', src) + ' [本地图片需上传]'

    # 应用到水平线
    for hr in main_section.find_all('hr'):
        hr['style'] = f"border: none; border-top: 2px solid {colors['border']}; margin: 2em 0;"

    # 应用到强调 - 必须显式设置 display: inline 防止微信公众号换行
    for strong in main_section.find_all('strong'):
        strong['style'] = f"color: {colors['primary']}; font-weight: bold; display: inline;"
    for em in main_section.find_all('em'):
        em['style'] = "font-style: italic; display: inline;"
    for code in main_section.find_all('code'):
        # 内联代码也需要设置 display: inline
        if code.parent.name != 'pre' and not any(parent.name == 'section' and 'background-color: rgb(40, 44, 52)' in parent.get('style', '') for parent in code.parents):
            existing_style = code.get('style', '')
            if 'display' not in existing_style:
                code['style'] = existing_style + "; display: inline;" if existing_style else "display: inline;"

    return str(soup), local_images


def preprocess_markdown(markdown_content):
    """
    预处理 Markdown 内容，自动修复列表嵌套格式

    检测连续的有序列表项，并自动将其转换为嵌套列表结构

    Args:
        markdown_content: 原始 Markdown 内容

    Returns:
        str: 处理后的 Markdown 内容
    """
    lines = markdown_content.split('\n')
    processed_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]
        processed_lines.append(line)

        # 检测是否为无序列表项（以 - 或 * 开头）
        if re.match(r'^(\s*)([-*])\s+(.+)$', line):
            # 查看后续行，检测是否为连续的有序列表
            j = i + 1
            nested_lines = []

            # 有序列表的正则模式
            numbered_patterns = [
                r'^(\s*)\d+\.\s+',           # 1. 2. 3.
                r'^(\s*)[a-zA-Z]\.\s+',      # a. b. c.
                r'^(\s*)\d+\)\s+',           # 1) 2) 3)
                r'^(\s*)[a-zA-Z]\)\s+',      # a) b) c)
                r'^(\s*)[一二三四五六七八九十]+[、．.]\s+',  # 中文数字
            ]

            while j < len(lines):
                next_line = lines[j].strip()

                # 跳过空行
                if not next_line:
                    j += 1
                    continue

                # 检查是否为有序列表项
                is_numbered = False
                for pattern in numbered_patterns:
                    if re.match(pattern, next_line):
                        is_numbered = True
                        break

                if is_numbered:
                    # 是有序列表，添加 4 个空格缩进
                    original_line = lines[j]
                    # 如果是字母列表，转换为数字列表格式（1. 2. 3.）
                    letter_match = re.match(r'^(\s*)([a-zA-Z])\.\s+(.+)$', original_line)
                    if letter_match:
                        # 转换为数字列表
                        indent = letter_match.group(1)
                        content = letter_match.group(3)
                        nested_lines.append('    ' + indent + str(len(nested_lines) + 1) + '. ' + content)
                    else:
                        nested_lines.append('    ' + original_line)
                    j += 1
                elif re.match(r'^(\s*)([-*])\s+(.+)$', lines[j]):
                    # 遇到另一个无序列表项，停止
                    break
                else:
                    # 遇到其他内容，停止
                    break

            # 将嵌套的有序列表添加到处理后的行中
            if nested_lines:
                processed_lines.extend(nested_lines)
                i = j - 1  # -1 因为循环末尾会 +1

        i += 1

    return '\n'.join(processed_lines)


def convert_markdown_to_wechat(markdown_content, theme="default", grid_color=None):
    """
    将 Markdown 内容转换为微信公众号兼容的 HTML

    Args:
        markdown_content: Markdown 格式的文本内容
        theme: 主题名称 (default, orange, grid)
        grid_color: 格子主题配色 (green 或 blue)，仅当 theme=grid 时有效

    Returns:
        tuple: (微信公众号兼容的 HTML 代码, 本地图片路径列表)
    """
    # 配置 Markdown 扩展
    extensions = [
        'markdown.extensions.extra',      # 额外特性
        'markdown.extensions.codehilite', # 代码高亮
        'markdown.extensions.toc',        # 目录
        'markdown.extensions.tables',     # 表格
        'markdown.extensions.fenced_code',# 围栏代码块
    ]

    # 预处理 Markdown：自动修复列表嵌套
    markdown_content = preprocess_markdown(markdown_content)

    # 如果是格子主题，根据配色动态设置颜色
    if theme == "grid" and grid_color:
        if grid_color == "blue":
            # 大气蓝配色
            THEMES["grid"]["colors"]["primary"] = "#007AFF"
            THEMES["grid"]["colors"]["border"] = "#d6e4ff"
            THEMES["grid"]["colors"]["code_bg"] = "#f0f7ff"
            THEMES["grid"]["colors"]["grid_line"] = "#e6efff"
        elif grid_color == "orange":
            # 活力橙配色
            THEMES["grid"]["colors"]["primary"] = "#e67e22"
            THEMES["grid"]["colors"]["border"] = "#fad7a0"
            THEMES["grid"]["colors"]["code_bg"] = "#fef5e7"
            THEMES["grid"]["colors"]["grid_line"] = "#fdeeda"
        elif grid_color == "green":
            # 清新绿配色（默认）
            THEMES["grid"]["colors"]["primary"] = "#52c41a"
            THEMES["grid"]["colors"]["border"] = "#d9f7be"
            THEMES["grid"]["colors"]["code_bg"] = "#f6ffed"
            THEMES["grid"]["colors"]["grid_line"] = "#edf7e6"

    # 转换 Markdown 为 HTML
    md = markdown.Markdown(extensions=extensions)
    html_content = md.convert(markdown_content)

    # 应用内联样式，并获取本地图片列表
    styled_html, local_images = apply_inline_styles(html_content, theme)

    return styled_html, local_images


def add_wechat_header_footer(html_content, title=""):
    """添加微信公众号特有的尾部元素"""
    footer = """
    <section style="text-align: center; margin: 3em 0; padding: 2em; background-color: #f6f8fa; border-radius: 8px;">
        <p style="margin: 0; font-size: 16px; color: #3f3f3f; font-weight: bold;">感谢阅读</p>
        <p style="margin: 0.5em 0 0; font-size: 14px; color: #666;">如果觉得文章有帮助，欢迎点赞、分享和关注</p>
        <div style="margin-top: 1.5em; padding: 1em; border: 2px dashed #dfe6e9; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">长按识别二维码关注我们</p>
        </div>
    </section>
    """

    return html_content + footer


def create_preview_page(html_content, title="文章预览", local_images=None):
    """创建带复制按钮的预览页面"""
    # 转义HTML内容以便在JavaScript中使用
    escaped_html = html_content.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

    # 生成本地图片警告HTML
    local_images_warning = ""
    if local_images:
        images_list = "<br>".join([f"• {img}" for img in local_images])
        local_images_warning = f"""
            <div class="local-images-warning">
                <strong>⚠️ 检测到本地图片：</strong>
                以下图片使用了本地路径，在微信公众号中无法显示。<br>
                <div style="margin: 8px 0; font-size: 13px; line-height: 1.6;">
                    {images_list}
                </div>
                <strong style="margin-top: 8px;">💡 解决方案：</strong>
                1. 将图片上传到图床（如：七牛云、阿里云OSS、Cloudinary等）<br>
                2. 在公众号编辑器中删除本地图片，重新上传<br>
                3. 将图片URL替换本地路径后重新转换
            </div>
        """

    preview_html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }}
        .container {{
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0 0 10px 0;
            font-size: 28px;
        }}
        .header p {{
            margin: 0;
            opacity: 0.9;
            font-size: 14px;
        }}
        .preview-area {{
            padding: 30px;
            background: #f8f9fa;
        }}
        .button-group {{
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }}
        .copy-btn {{
            flex: 1;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(82, 196, 26, 0.3);
        }}
        .copy-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(82, 196, 26, 0.4);
        }}
        .copy-btn:active {{
            transform: translateY(0);
        }}
        .copy-btn.copied {{
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
            animation: pulse 0.5s;
        }}
        @keyframes pulse {{
            0%, 100% {{ transform: scale(1); }}
            50% {{ transform: scale(1.05); }}
        }}
        .instructions {{
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }}
        .instructions strong {{
            display: block;
            margin-bottom: 8px;
        }}
        .local-images-warning {{
            background: #fff3cd;
            border-left: 4px solid #ff6b6b;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }}
        .local-images-warning strong {{
            display: block;
            margin-bottom: 8px;
            color: #d63031;
        }}
        .content-frame {{
            background: white;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 20px;
            min-height: 200px;
            max-height: 600px;
            overflow-y: auto;
        }}
        .content-frame * {{
            max-width: 100%;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 微信公众号文章预览</h1>
            <p>点击下方按钮复制 HTML 代码</p>
        </div>
        <div class="preview-area">
            <div class="instructions">
                <strong>📋 使用说明：</strong>
                1. 点击"复制 HTML"按钮复制文章代码<br>
                2. 打开<a href="https://mp.weixin.qq.com" target="_blank" style="color: #667eea; font-weight: bold;">微信公众号后台</a><br>
                3. 在文章编辑器中粘贴 HTML 代码
            </div>
            {local_images_warning}
            <div class="button-group">
                <button class="copy-btn" onclick="copyHTML()">📋 复制 HTML 代码</button>
            </div>
            <div class="content-frame" id="content">
                {html_content}
            </div>
        </div>
    </div>
    <script>
        function getHTML() {{
            return document.getElementById('content').innerHTML;
        }}

        function flash(btn, text, ok) {{
            btn.textContent = text;
            btn.classList.toggle('copied', ok);
            setTimeout(() => {{
                btn.textContent = '📋 复制 HTML 代码';
                btn.classList.remove('copied');
            }}, 2000);
        }}

        async function copyHTML() {{
            const html = getHTML();
            const btn = document.querySelector('.copy-btn');

            // 1) 优先：Clipboard API 写富文本
            if (navigator.clipboard && window.ClipboardItem) {{
                try {{
                    const blob = new Blob([html], {{ type: 'text/html' }});
                    const item = new ClipboardItem({{ 'text/html': blob, 'text/plain': new Blob([html], {{ type: 'text/plain' }}) }});
                    await navigator.clipboard.write([item]);
                    flash(btn, '✅ 已复制富文本', true);
                    return;
                }} catch (err) {{
                    console.warn('ClipboardItem 写入失败，回退到 textarea:', err);
                }}
            }}

            // 2) 回退：textarea + execCommand('copy')
            const ta = document.createElement('textarea');
            ta.value = html;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.top = '0';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            let ok = false;
            try {{
                ok = document.execCommand('copy');
            }} catch (err) {{
                console.error('execCommand 失败:', err);
            }}
            document.body.removeChild(ta);

            if (ok) {{
                flash(btn, '✅ 已复制（文本模式）', true);
            }} else {{
                // 3) 终极回退：弹出可手动复制的弹窗
                const w = window.open('', '_blank', 'width=600,height=400');
                if (w) {{
                    w.document.write('<title>请手动复制以下 HTML</title><textarea style="width:100%;height:100%;font-size:12px;">' + html.replace(/</g, '&lt;') + '</textarea>');
                }}
                flash(btn, '❗ 请在新窗口手动复制', false);
            }}
        }}
    </script>
</body>
</html>"""
    return preview_html


def list_themes():
    """列出所有可用主题"""
    print("\n📨 可用主题列表:\n")
    for key, theme in THEMES.items():
        print(f"  • {key:12} - {theme['name']}: {theme['description']}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description='将 Markdown 转换为微信公众号兼容的 HTML'
    )
    parser.add_argument('input', help='输入的 Markdown 文件路径')
    parser.add_argument('output', nargs='?', help='输出的 HTML 文件路径（可选）')
    parser.add_argument('--theme', default='default', choices=THEMES.keys(),
                       help='选择主题 (默认: default)')
    parser.add_argument('--grid-color', choices=['green', 'blue', 'orange'],
                       help='格子主题配色：green(清新绿)、blue(大气蓝) 或 orange(活力橙)，仅当 theme=grid 时有效')
    parser.add_argument('--list-themes', action='store_true',
                       help='列出所有可用主题')
    parser.add_argument('--title', default='',
                       help='文章标题（用于显示在头部）')
    parser.add_argument('--no-header-footer', action='store_true',
                       help='不添加微信公众号头部和尾部')
    parser.add_argument('--preview', action='store_true',
                       help='在浏览器中打开预览页面（带复制按钮）')

    args = parser.parse_args()

    # 列出主题
    if args.list_themes:
        list_themes()
        return

    # 如果选择格子主题但未指定配色，提示用户选择
    if args.theme == "grid" and not args.grid_color:
        print("🎨 格子主题配色选择：")
        print("   1. 清新绿 (默认) - #52c41a")
        print("   2. 大气蓝         - #007AFF")
        print("   3. 活力橙         - #e67e22")
        print()

        # 交互式选择（仅在不使用 --preview 时）
        if not sys.stdin.isatty():
            # 非交互模式，使用默认绿色
            grid_color = "green"
            print("💡 检测到非交互模式，使用默认配色：清新绿\n")
        else:
            while True:
                choice = input("请选择配色 (输入 1/2/3，直接回车使用默认清新绿): ").strip()
                if not choice:
                    grid_color = "green"
                    print("✅ 使用清新绿配色\n")
                    break
                elif choice == "1":
                    grid_color = "green"
                    print("✅ 使用清新绿配色\n")
                    break
                elif choice == "2":
                    grid_color = "blue"
                    print("✅ 使用大气蓝配色\n")
                    break
                elif choice == "3":
                    grid_color = "orange"
                    print("✅ 使用活力橙配色\n")
                    break
                else:
                    print("❌ 无效选择，请输入 1、2 或 3\n")
    else:
        grid_color = args.grid_color

    # 读取输入文件
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"❌ 错误: 文件不存在 - {args.input}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, 'r', encoding='utf-8') as f:
        markdown_content = f.read()

    # 转换
    print(f"🔄 正在转换 Markdown → 微信公众号 HTML...")

    # 显示主题信息
    theme_name = THEMES[args.theme]['name']
    if args.theme == "grid" and grid_color:
        color_names = {"green": "清新绿", "blue": "大气蓝", "orange": "活力橙"}
        color_name = color_names.get(grid_color, "清新绿")
        theme_name = f"{theme_name}（{color_name}）"
    print(f"📨 使用主题: {theme_name}")

    html_content, local_images = convert_markdown_to_wechat(markdown_content, args.theme, grid_color)

    # 检查本地图片
    if local_images:
        print(f"\n⚠️  检测到 {len(local_images)} 个本地图片路径:")
        for i, img_path in enumerate(local_images, 1):
            print(f"   {i}. {img_path}")
        print("\n💡 本地图片处理建议:")
        print("   方案1: 上传图片到图床，使用图片 URL 替换本地路径")
        print("   方案2: 在微信公众号编辑器中手动上传图片")
        print("   方案3: 使用支持的图床服务 (如: imgur, cloudinary, 七牛云等)\n")

    # 添加头部和尾部（可选）
    if not args.no_header_footer:
        html_content = add_wechat_header_footer(html_content, args.title)

    # 输出结果
    if args.preview:
        # 生成预览页面
        preview_title = args.title if args.title else input_path.stem
        preview_html = create_preview_page(html_content, preview_title, local_images)

        # 保存预览页面
        preview_path = Path('/tmp/wechat-preview.html')
        with open(preview_path, 'w', encoding='utf-8') as f:
            f.write(preview_html)

        print(f"✅ 转换完成！正在打开浏览器预览...")

        # 在浏览器中打开
        webbrowser.open(f'file://{preview_path}')

        # 同时保存纯 HTML（可选）
        if args.output:
            output_path = Path(args.output)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"📄 纯 HTML 已保存到: {output_path}")
    elif args.output:
        output_path = Path(args.output)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"✅ 转换完成！HTML 已保存到: {output_path}")
    else:
        print("\n" + "="*60)
        print("转换结果（可直接复制到微信公众号编辑器）:")
        print("="*60 + "\n")
        print(html_content)
        print("\n" + "="*60)


if __name__ == '__main__':
    main()
