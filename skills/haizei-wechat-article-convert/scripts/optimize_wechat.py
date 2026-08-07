#!/usr/bin/env python3
"""微信公众号 HTML 优化器：深色模式安全 + 排版升级 + 代码块修复。

用法：
    python3 optimize_wechat.py <input.html> [output.html]
"""
import pathlib
import re
import sys

CSS_OLD = "Optima-Regular, PingFangTC-light"
FONT_STACK = ('-apple-system, BlinkMacSystemFont, "Helvetica Neue", '
              '"PingFang SC", "Microsoft YaHei", sans-serif')

CODE_STACK = ('Menlo, Consolas, "Courier New", monospace')

P_STYLE = (
    "margin: 1em 0; line-height: 1.85; color: inherit; font-size: 16px; "
    f"font-family: {FONT_STACK}; letter-spacing: 0.03em; text-align: justify; "
    "white-space: pre-line; word-break: break-word;"
)

LI_STYLE = "margin: 0.45em 0; line-height: 1.75; color: inherit; font-size: 16px;"
UL_STYLE = (
    f"margin: 1em 0; padding-left: 1.2em; color: inherit; "
    f"font-family: {FONT_STACK};"
)
OL_STYLE = (
    f"margin: 0.5em 0; padding-left: 2em; color: inherit; "
    f"font-family: {FONT_STACK};"
)


def optimize(html: str) -> str:
    # 1) 去除微信不识别的 <style> 块（含 @keyframes / 动画 class）
    html = re.sub(r"<style>.*?</style>\s*", "", html, flags=re.DOTALL)

    # 2) 替换外层 section 的网格背景 + 白底为深色模式安全的容器
    html = re.sub(
        r'<section style="width: 100%;[^"]*">',
        f'<section style="width: 100%; box-sizing: border-box; padding: 4px 6px; '
        f'color: inherit; font-family: {FONT_STACK}; word-break: break-word;">',
        html, count=1,
    )

    # 3) 主标题样式
    html = re.sub(
        r'(<h1[^>]*style=")[^"]*(")',
        r'\1margin: 1.2em 0 1.4em; font-size: 26px; line-height: 1.45; '
        r'font-weight: 800; color: #0A84FF; border-bottom: 1px solid '
        r'rgba(127,127,127,0.3); padding: 0 0.2em 0.7em; text-align: center; '
        fr'font-family: {FONT_STACK}; letter-spacing: 0.02em;"',
        html,
    )

    # 4) 移除 <hr> 上下的原始 frontmatter <p>（已经被脚本误渲染）
    html = re.sub(
        r'<p[^>]*>title: AI Coding.*?</p>\s*<hr[^/]*/>',
        '<hr style="border: none; border-top: 1px solid rgba(127, 127, 127, 0.3); margin: 2.8em 0;"/>',
        html, flags=re.DOTALL,
    )

    # 5) 全局 p/li/ul/ol 内联样式（颜色继承 + 字号 + 字体）
    html = re.sub(
        r'(<p[^>]*?style=")[^"]*(?=">)',
        lambda m: m.group(1) + P_STYLE, html,
    )
    html = re.sub(
        r'(<li[^>]*?style=")[^"]*(?=">)',
        lambda m: m.group(1) + LI_STYLE, html,
    )
    html = re.sub(
        r'(<ul[^>]*?style=")[^"]*(?=">)',
        lambda m: m.group(1) + UL_STYLE, html,
    )
    html = re.sub(
        r'(<ol[^>]*?style=")[^"]*(?=">)',
        lambda m: m.group(1) + OL_STYLE, html,
    )

    # 6) blockquote：去浅蓝底，改半透明灰 + 圆角
    html = re.sub(
        r'(<blockquote[^>]*?style=")[^"]*(?=">)',
        'margin: 1.3em 0; padding: 0.85em 1em; border-left: 4px solid #0A84FF; '
        'background-color: rgba(127, 127, 127, 0.08); color: inherit; '
        f'border-radius: 0 8px 8px 0; font-family: {FONT_STACK};',
        html,
    )

    # 7) inline <code>：浅色背景 -> 半透明灰 + 文字继承
    html = re.sub(
        r'(<code[^>]*?style=")[^"]*(?=">)',
        'background-color: rgba(127, 127, 127, 0.14); padding: 0.15em 0.38em; '
        f'border-radius: 4px; font-family: {CODE_STACK}; font-size: 0.9em; '
        'line-height: 1.5; color: inherit; display: inline; '
        'box-decoration-break: clone; -webkit-box-decoration-break: clone;',
        html,
    )

    # 8) <strong> 强调：去掉固定蓝色，保留加粗
    html = re.sub(
        r'(<strong[^>]*?style=")[^"]*(?=">)',
        'color: inherit; font-weight: 700; display: inline;',
        html,
    )

    # 9) 表格
    html = re.sub(
        r'(<table[^>]*?style=")[^"]*(?=">)',
        'border-collapse: collapse; width: 100%; margin: 1.4em 0; '
        'font-size: 14px; line-height: 1.65; table-layout: fixed; word-break: break-word;',
        html,
    )
    html = re.sub(
        r'(<th[^>]*?style=")[^"]*(?=">)',
        'border: 1px solid rgba(127, 127, 127, 0.32); padding: 0.75em; '
        'background-color: rgba(10, 132, 255, 0.08); color: inherit; '
        'font-weight: 700; text-align: left;',
        html,
    )
    html = re.sub(
        r'(<td[^>]*?style=")[^"]*(?=">)',
        'border: 1px solid rgba(127, 127, 127, 0.32); padding: 0.75em; '
        'color: inherit; vertical-align: top;',
        html,
    )

    # 10) 图片
    html = re.sub(
        r'(<img[^>]*?style=")[^"]*(?=")',
        'max-width: 100%; height: auto; display: block; margin: 1.3em auto 1.6em; '
        'border-radius: 8px;',
        html,
    )

    # 11) <hr> 分隔线
    html = re.sub(
        r'(<hr[^>]*?style=")[^"]*(?=")',
        'border: none; border-top: 1px solid rgba(127, 127, 127, 0.3); margin: 2.8em 0;',
        html,
    )

    # 12) 章节大标题父 section：上下分隔线 + 改大蓝徽章
    html = re.sub(
        r'(<section style="display: flex; flex-direction: row; justify-content: center; align-items: center; )margin: 1\.8em 0 1em;',
        r'\1margin: 2.8em 0 1.4em; padding: 0.8em 0.2em; '
        r'border-top: 1px solid rgba(127, 127, 127, 0.28); '
        r'border-bottom: 1px solid rgba(127, 127, 127, 0.28);',
        html,
    )
    html = re.sub(
        r'<section style="display: flex; flex-direction: row; justify-content: center; align-items: center;',
        '<section style="display: flex; flex-direction: row; align-items: center;',
        html,
    )

    # 13) 徽章内部 section 尺寸/底色/字体
    html = re.sub(
        r'<section class="number-badge-animation" style="width: 38px; height: 38px; border-radius: 50%; background: #007AFF;',
        '<section style="width: 36px; height: 36px; border-radius: 50%; background: #0A84FF;',
        html,
    )
    html = re.sub(
        r'<section class="number-badge-animation" style="width: 38px; height: 38px; border-radius: 50%; background: #52c41a;',
        '<section style="width: 36px; height: 36px; border-radius: 50%; background: #0A84FF;',
        html,
    )
    # 徽章数字 <p>
    html = re.sub(
        r'<p style="font-size: 16px; font-weight: bold; color: #FFFFFF; line-height: 38px; margin: 0;">',
        '<p style="font-size: 15px; font-weight: 800; color: #FFFFFF; line-height: 36px; margin: 0; text-align: center;">',
        html,
    )
    # 章节大标题子 section 文本
    html = re.sub(
        r'(<section style="font-size: 24px; font-weight: bold; color: #333333; line-height: 38px;)[^>]*>',
        r'\1 font-size: 21px; font-weight: 800; color: inherit; line-height: 1.45; '
        fr'flex: 1; font-family: {FONT_STACK};">',
        html,
    )

    # 14) 小节标题父 section：加左侧蓝条
    html = re.sub(
        r'(<section style="display: flex; align-items: flex-start; )margin: 1\.5em 0 0\.8em;',
        r'\1margin: 2.1em 0 0.8em; padding: 0.55em 0 0.55em 0.8em; '
        r'border-left: 3px solid #0A84FF;',
        html,
    )
    # 隐藏的实心圆/空心圆（深色模式不可见）
    html = re.sub(
        r'<section style="height: 28px; margin-right: 8px; display: flex; align-items: center; justify-content: center;">',
        '<section style="display: none;">',
        html,
    )
    # 残留 #252525 圆点兜底
    html = re.sub(
        r'<span style="width: 9px; height: 9px; background: #252525; border-radius: 50%;"></span>',
        '<span style="width: 9px; height: 9px; background: #0A84FF; border-radius: 50%;"></span>',
        html,
    )
    html = re.sub(
        r'<span style="width: 9px; height: 9px; border: 1px solid #252525; border-radius: 50%; margin-left: -4px;"></span>',
        '<span style="width: 9px; height: 9px; border: 1px solid #0A84FF; border-radius: 50%; margin-left: -4px;"></span>',
        html,
    )
    # 小节标题文本
    html = re.sub(
        r'(<section style="font-weight: 600; font-size: 16px; color: rgb\(37, 37, 37\); line-height: 28px; flex: 1 1 0%;)[^>]*>',
        r'\1 font-weight: 700; font-size: 17px; color: inherit; line-height: 1.65; '
        fr'flex: 1 1 0%; font-family: {FONT_STACK};">',
        html,
    )

    # 15) 代码块外 section / 顶栏 / code 标签
    code_outer_old = (
        'color: rgb(0, 0, 0); font-family: \'PingFang SC\'; font-size: medium;'
        ' font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal;'
        ' font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start;'
        ' text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px;'
        ' -webkit-text-stroke-width: 0px; white-space: normal; text-decoration-thickness: initial;'
        ' text-decoration-style: initial; text-decoration-color: initial;'
        ' margin-top: 12px; background-color: rgb(40, 44, 52); margin-bottom: 12px; border-radius: 5px;'
    )
    code_outer_new = (
        'margin: 1.1em 0; background-color: #1F2329; border-radius: 8px; overflow: hidden; '
        'color: #E6EDF3; font-family: Menlo, Consolas, "Courier New", monospace; '
        'font-size: 14px; line-height: 1.65;'
    )
    html = html.replace(code_outer_old, code_outer_new)

    top_span_old = (
        'display: block; height: 30px; background-color: rgb(40, 44, 52); '
        'border-top-left-radius: 5px; border-top-right-radius: 5px; margin: 0px; '
        'color: rgb(0, 0, 0); font-style: normal; font-variant-ligatures: normal; '
        'font-variant-caps: normal; font-weight: 400; letter-spacing: normal; '
        'orphans: 2; text-align: start; text-indent: 0px; text-transform: none; '
        'widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; '
        'text-decoration-thickness: initial; text-decoration-style: initial; '
        'text-decoration-color: initial;'
    )
    html = html.replace(
        top_span_old,
        'display: block; height: 10px; background-color: #1F2329; margin: 0;',
    )

    # 顶部图标（外部 URL）移除
    icon_old = (
        "height: 30px; line-height: 30px; margin-left: 10px; display: block; "
        "background: url('https://mmbiz.qpic.cn/sz_mmbiz_png/"
        "RVqfiaDPokvsWbCehxC5Cn1Ot97QFia03TeyIJzh7ibqB03FDARqbNxqjJggCICCT7tb8GBwoBoMAHd1xwx6libjYw/"
        "640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=15&wx_lazy=1') left center / auto 14px no-repeat;"
    )
    html = html.replace(icon_old, "height: 10px; display: block;")

    code_inner_old = (
        'color: rgb(171, 178, 191); background: rgb(40, 44, 52); padding: 4px 15px 15px; '
        'display: block; overflow-x: auto; border-bottom-left-radius: 5px; '
        'border-bottom-right-radius: 5px; font-family: Consolas, Monaco, Menlo, monospace; '
        'font-size: 14px; line-height: 1.5;'
    )
    code_inner_new = (
        'color: #E6EDF3; background: #1F2329; padding: 4px 14px 16px; display: block; '
        'overflow-x: auto; border-radius: 0 0 8px 8px; '
        'font-family: Menlo, Consolas, "Courier New", monospace; font-size: 13px; '
        'line-height: 1.65; white-space: pre;'
    )
    html = html.replace(code_inner_old, code_inner_new)

    # 16) 删 alt 中的 "[本地图片需上传]" 后缀
    html = html.replace(" [本地图片需上传]", "")

    # 17) 移除文末二维码 / 感谢阅读卡片
    html = re.sub(
        r'<section style="text-align: center; margin: 3em 0; padding: 2em; background-color: #f6f8fa; border-radius: 8px;">.*?</section>\s*$',
        '', html, flags=re.DOTALL,
    )

    return html


def main() -> int:
    if len(sys.argv) < 2:
        print("用法: optimize_wechat.py <input.html> [output.html]")
        return 1
    src = pathlib.Path(sys.argv[1])
    dst = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else src
    html = src.read_text(encoding="utf-8")
    out = optimize(html)
    dst.write_text(out, encoding="utf-8")
    print(f"✅ 已优化: {dst}（{len(out.encode('utf-8'))//1024} KB）")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
