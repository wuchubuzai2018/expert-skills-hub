# 00 · Design System（设计令牌 + 基础 HTML 底座）

> **第一份必读**。
> 所有 layout 都基于这套设计令牌 + 基础 HTML 底座。
> 下面 `<!DOCTYPE html>` 到 `</html>` 是**所有新 PPT 的起点**——任何 layout 模板都假设这段 HTML 已经在页面里。

## 设计哲学（一句话）

> **把 PPT 伪装成"正在被调试的开发者控制台"** —— 一切都是 IDE / 终端 / 调试器的瞬间截图；任何"营销感"的视觉（圆角 / 渐变填充 / 居中大段正文 / emoji）都属于反模式。

---

## 核心设计要素（每页必备 3 件套）

| 元素 | 实现 | 作用 |
|---|---|---|
| **window-chrome** | 三色圆点 + tab + 中央 notice + slide ref + REC + 闪烁光标 | 每页顶部必备 |
| **footer-chrome** | 命令行 + 翻页箭头按钮 | 每页底部必备 |
| **slide-corner** | `[ N / M ] LABEL` + 闪烁 ● REC | 每页右上必备 |
| **line-numbers** | 左侧 40px 灰底 01-30 行号列 | 模拟代码编辑器 |
| **panel 内部** | 36px 网格背景 + radial 暗角 + scanline | 提升纵深 |

完整色板 / 字号阶梯 / 行高 / 间距 token 全部就位。

---

## 完整基础 HTML 底座（对齐参考站点）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1440, initial-scale=1.0">
  <title>[DECK-TITLE]</title>

  <!-- 字体四件套（JetBrains Mono + Space Grotesk + Noto Sans SC + Noto Serif SC）-->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@500;700&display=swap" rel="stylesheet">

  <style>
    /* ============ 设计令牌 ============ */
    :root {
      /* —— 底色 ——————————————— */
      --bg:        #060a14;
      --bg-2:      #0a1020;
      --bg-3:      #0f1626;
      --grid:      #0e1a2a;
      --paper:     #060a14;   /* 用于覆盖 bg（部分 block 用） */
      --ink:       #d9e4f5;   /* 同 --fg 别名 */
      /* —— 描边 ——————————————— */
      --rule:      #1a2a44;
      --rule-soft: #122036;
      /* —— 前景文字 ———————————— */
      --fg:        #d9e4f5;
      --fg-dim:    #6b7a99;
      --fg-mute:   #3e4d6c;
      --cfe:       #cfe0ff;   /* 高亮文字色（亮蓝白） */
      /* —— 4 主色 + 2 辅色 ———————— */
      --green:     #00ff9c;
      --green-dim: #00b870;
      --cyan:      #5ce1ff;
      --amber:     #ffb020;
      --amber-dim: #aa7400;
      --pink:      #ff2e88;
      --red:       #ff4d5e;
      /* —— 主题装饰色（用于 pencil 等高亮） — */
      --pencil-glow:    #93c8a6;
      --pencil-glow-2:  #6ce1b0;
      --pencil-ink:     #0a1020;
      /* —— 字号阶梯 ——————————— */
      --slide-h1: 48px; --slide-h1-rwd: 40px;
      --slide-h2: 36px; --slide-h2-rwd: 30px;
      --slide-h3: 28px; --slide-h3-rwd: 24px;
      --slide-lead:    18px; --slide-lead-rwd:    16px;
      --slide-body:    15px; --slide-body-rwd:    14px;
      --slide-body-sm: 13.5px; --slide-body-sm-rwd: 12.5px;
      --slide-body-xs: 12px; --slide-body-xs-rwd: 11px;
      --slide-label:   11px; --slide-label-rwd:   10px;
      /* —— 行高 ———————————————— */
      --line-tight: 1.2;
      --line-normal: 1.5;
      --line-relax: 1.75;
      /* —— 间距 ———————————————— */
      --space-xs:  4px;
      --space-sm:  8px;
      --space-md: 12px;
      --space-lg: 16px;
      --space-xl: 24px;
      --space-2xl: 32px;
      --space-3xl: 40px;
      --space-4xl: 48px;
      /* —— 字体 ———————————————— */
      --font-mono:    'JetBrains Mono', ui-monospace, monospace;
      --font-sans:    'Noto Sans SC', 'PingFang SC', sans-serif;
      --font-serif:   'Noto Serif SC', 'Noto Sans SC', serif;
      --font-display: 'Space Grotesk', 'JetBrains Mono', sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 100%; height: 100%; overflow: hidden;
      background: var(--bg);
      color: var(--fg);
      font-family: var(--font-mono);
      font-size: 15px;
      line-height: var(--line-normal);
      -webkit-font-smoothing: antialiased;
    }

    /* ============ 全局背景：36px 网格 + 双 radial + 暗角 ============ */
    body::before {
      content: ''; position: fixed; inset: 0;
      background-image:
        linear-gradient(90deg, #ffffff0a 1px, transparent 1px),
        linear-gradient(0deg, #ffffff08 1px, transparent 1px);
      background-size: 36px 36px;
      pointer-events: none; z-index: 0;
    }
    body::after {
      content: ''; position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 800px 600px at 20% 0%, #5ce1ff08, transparent 60%),
        radial-gradient(ellipse 1000px 800px at 80% 100%, #00ff9c06, transparent 60%);
      pointer-events: none; z-index: 0;
    }

    /* ============ Slide 容器（每张幻灯片的根） ============ */
    .slide {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      padding: 20px 24px 24px;
      opacity: 0; pointer-events: none;
      transition: opacity .28s cubic-bezier(.16,1,.3,1);
    }
    .slide.active { opacity: 1; pointer-events: auto; z-index: 2; }

    /* slide 内部再叠一层：scanline（仿示波器）+ 暗角 */
    .slide::before {
      content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 6;
      mix-blend-mode: overlay; opacity: .85;
      background-image: repeating-linear-gradient(#ffffff05 0 1px, transparent 1px 3px);
    }
    .slide::after {
      content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 5;
      background: radial-gradient(120% 80% at 50% 40%, transparent 55%, #0000008c 100%);
    }

    /* ============ Window Chrome（每页顶部必备的 IDE 标题栏） ============ */
    .window-chrome {
      position: relative; z-index: 7;
      display: flex; align-items: center; gap: 8px;
      padding: 0 10px; height: 26px; flex-shrink: 0;
      border: 1px solid var(--rule); border-bottom: none;
      background: var(--bg-2);
      color: var(--fg-dim); font-family: var(--font-mono);
      font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
    }
    .window-chrome .dot {
      width: 10px; height: 10px; border-radius: 50%;
      border: 1px solid #ffffff26;
    }
    .window-chrome .dot--r { background: #ff5f57; }
    .window-chrome .dot--y { background: #febc2e; }
    .window-chrome .dot--g { background: #28c840; }
    .window-chrome .tab {
      display: inline-flex; align-items: center; height: 20px;
      margin-left: 6px; padding: 0 10px;
      color: var(--fg); background: var(--bg); border: 1px solid var(--rule);
      border-bottom-color: var(--bg);
      position: relative; top: 3px;
    }
    .window-chrome .notice {
      position: absolute; left: 50%; transform: translateX(-50%);
      color: var(--fg-dim); white-space: nowrap; pointer-events: auto;
      cursor: default;
    }
    .window-chrome .notice .url { color: var(--green); }
    .window-chrome .right {
      margin-left: auto; display: flex; align-items: center; gap: 14px;
    }
    .window-chrome .slide-ref {
      color: var(--fg-mute); cursor: pointer; user-select: all;
      background: 0 0; border-radius: 2px; padding: 1px 4px;
      transition: color .15s, background .15s;
    }
    .window-chrome .slide-ref:hover { color: var(--fg-dim); background: #ffffff0a; }

    /* ============ Slide Corner（右上 [ N / M ] LABEL） ============ */
    .slide-corner {
      position: absolute; top: -2px; right: 28px; z-index: 5;
      display: flex; align-items: center; gap: 8px;
      padding: 6px 10px;
      background: var(--bg-2); border: 1px solid var(--rule);
      font-family: var(--font-mono);
      font-size: 10px; letter-spacing: .18em; color: var(--fg-dim);
      text-transform: uppercase;
    }
    .slide-corner::before {
      content: "● REC"; color: var(--red);
      font-size: 9px; letter-spacing: .2em;
      animation: recblink 1.8s ease-in-out infinite;
    }
    @keyframes recblink { 0%,to { opacity: .3; } 50% { opacity: 1; } }

    /* ============ Panel（chrome 与 footer 之间的内容区） ============ */
    .panel {
      position: relative; z-index: 7; flex: 1; min-height: 0;
      display: flex; flex-direction: column; gap: var(--space-md);
      padding: 24px 32px 24px 64px;        /* 左边距 64px 留给行号 */
      border: 1px solid var(--rule); background: var(--bg-2);
      overflow: hidden auto;
    }
    /* panel 左侧行号列（40px 灰底 + repeating-linear-gradient 横线 + 数字 01-30） */
    .panel::before {
      content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 40px;
      background: var(--bg-3);
      border-right: 1px solid var(--rule);
      background-image: repeating-linear-gradient(
        to bottom, transparent 0 22px, var(--rule-soft) 22px 23px);
    }
    .panel::after {
      content: "01\a 02\a 03\a 04\a 05\a 06\a 07\a 08\a 09\a 10\a 11\a 12\a 13\a 14\a 15\a 16\a 17\a 18\a 19\a 20\a 21\a 22\a 23\a 24\a 25\a 26\a 27\a 28\a 29\a 30";
      white-space: pre; position: absolute; top: 0; left: 0; width: 40px;
      padding-top: 8px;
      font-family: var(--font-mono); font-size: 9px; line-height: 22px;
      text-align: center; color: var(--fg-mute);
      letter-spacing: .04em;
    }

    /* ============ Footer Chrome（每页底部命令栏） ============ */
    .footer-chrome {
      position: relative; z-index: 7; flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 28px;
      background: linear-gradient(#0000, #060a14e6);
      font-family: var(--font-mono); font-size: 10.5px;
      color: var(--fg-dim); letter-spacing: .18em; text-transform: uppercase;
    }
    .footer-chrome .nav-btns { pointer-events: auto; display: flex; gap: 0; }
    .footer-chrome .nav-btn {
      width: 32px; height: 26px;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--bg-2); color: var(--green);
      border: 1px solid var(--rule); cursor: pointer;
      font: inherit; font-size: 14px;
      transition: all .18s;
    }
    .footer-chrome .nav-btn:hover { background: var(--green); color: var(--bg); border-color: var(--green); box-shadow: 0 0 10px #00ff9c99; }

    /* ============ 进度条（页面顶端 2px） ============ */
    .progress-bar {
      position: fixed; top: 0; left: 0; right: 0; height: 2px;
      background: var(--grid); z-index: 50;
    }
    .progress-bar .fill {
      height: 100%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green), 0 0 18px #00ff9c80;
      transition: width .4s cubic-bezier(.2,.7,.2,1);
    }

    /* ============ 闪烁光标（可放在任意行内） ============ */
    .cursor, .blink {
      display: inline-block;
      color: var(--green);
      animation: blink 1.05s steps(2, end) infinite;
    }
    @keyframes blink { 0%,50% { opacity: 1; } 50.01%,to { opacity: 0; } }
    /* ▌ 字符型光标（推荐：彩色，不占布局空间） */
    .caret::after {
      content: "▌"; color: var(--green);
      margin-left: .15em; animation: blink 1.05s steps(2, end) infinite;
    }

    /* ============ 入场动画 ============ */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-item {
      animation: .5s cubic-bezier(.2,.7,.2,1) var(--d, .1s) 1 normal both running fadeUp;
    }
    /* 配合每张 slide 切换重放（如果 JS 替换 style.animation） */

    /* ============ 通用排版工具类 ============ */
    .accent        { color: var(--green); font-family: var(--font-display); font-style: italic; font-weight: 500; }
    .accent-c      { color: var(--cyan);  font-family: var(--font-display); font-style: italic; font-weight: 500; }
    .accent-a      { color: var(--amber); font-family: var(--font-display); font-style: italic; font-weight: 500; }
    .accent-p      { color: var(--pink);  font-family: var(--font-display); font-style: italic; font-weight: 500; }
    .underline-mark {
      color: var(--green);
      text-decoration: underline;
      text-decoration-color: var(--green);
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }
    .hl-key { color: var(--green); text-shadow: 0 0 8px #00ff9c66; }
    .hl-from { color: var(--pink);  text-decoration: line-through; text-decoration-color: var(--fg-mute); }
    .hl-to   { color: var(--green); font-weight: 700; }

    .kicker {
      font-family: var(--font-mono);
      font-size: 10.5px; letter-spacing: .22em; text-transform: uppercase;
      color: var(--green);
    }
    .kicker::before { content: "$ "; color: var(--amber); margin-right: 2px; font-weight: 700; }
    .part-label {
      font-family: var(--font-mono);
      font-size: 10.5px; letter-spacing: .22em; text-transform: uppercase;
      color: var(--green);
    }
    .h-title {
      font-family: var(--font-sans); font-weight: 700;
      font-size: 42px; line-height: 1.12; letter-spacing: -.9px;
    }

    /* ============ 12 栅格 / N 列 grid 工具 ============ */
    .grid12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; align-content: center; }
    .grid6  { display: grid; grid-template-columns: repeat(6,  1fr); gap: 16px; }
    .grid4  { display: grid; grid-template-columns: repeat(4,  1fr); gap: 16px; }
    .grid3  { display: grid; grid-template-columns: repeat(3,  1fr); gap: 20px; }
    .grid2  { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .split  { display: grid; grid-template-columns: 5fr 7fr; gap: 60px; }

    /* ============ 卡片通用条形装饰（左侧 3px accent） ============ */
    .card {
      position: relative;
      padding: 16px 18px 18px 22px;
      background: #ffffff06;
      border: 1px solid var(--rule);
    }
    .card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%;
      background: var(--accent, var(--green));
      box-shadow: 0 0 6px var(--accent, var(--green));
    }

    /* ============ chip / badge / pri 通用 ============ */
    .chip {
      display: inline-block;
      padding: 3px 10px; border: 1px solid;
      font-family: var(--font-mono); font-size: 10px; letter-spacing: .18em;
    }
    .chip-g { color: var(--green); border-color: #00ff9c55; background: #00ff9c14; }
    .chip-c { color: var(--cyan);  border-color: #5ce1ff55; background: #5ce1ff14; }
    .chip-a { color: var(--amber); border-color: #ffb02055; background: #ffb02014; }
    .chip-p { color: var(--pink);  border-color: #ff2e8855; background: #ff2e8814; }

    .pri-chip {
      display: inline-block; padding: 2px 8px;
      font: 600 9px/1 var(--font-mono); letter-spacing: .22em;
    }
    .pri-p0 { background: #ff2e8820; color: var(--pink);  border: 1px solid #ff2e8855; }
    .pri-p1 { background: #ffb02020; color: var(--amber); border: 1px solid #ffb02055; }
    .pri-p2 { background: #5ce1ff20; color: var(--cyan);  border: 1px solid #5ce1ff55; }
  </style>
</head>
<body>
  <!-- 全局进度条 -->
  <div class="progress-bar"><div class="progress-fill fill" style="width:0%;"></div></div>

  <!-- ⬇️ 在此循环 <section class="slide"> 内容 ⬇️ -->
  <section class="slide active" data-slide="1">
    <div class="window-chrome">
      <span class="dot dot--r"></span><span class="dot dot--y"></span><span class="dot dot--g"></span>
      <span class="tab">~/[deck-slug]/01.md</span>
      <span class="notice">线上 PPT 请访问 <span class="url">http://[YOUR-HOST]/#1</span></span>
      <span class="right">
        <span class="slide-ref">[ A5KM ]</span>
        <span>UTF-8</span><span>LF</span>
        <span>● LIVE</span>
        <span class="blink">▌</span>
      </span>
    </div>

    <div class="panel">
      <!-- 这里是 slide 的内容（每个 layout md 都给出） -->
    </div>

    <div class="slide-corner">[ 01 / 37 ] COVER</div>

    <div class="footer-chrome">
      <span>[your-prompt@host:~/deck]$ ./start --mode=live</span>
      <span class="nav-btns">
        <button class="nav-btn" data-nav="prev" title="上一页">‹</button>
        <button class="nav-btn" data-nav="next" title="下一页">›</button>
      </span>
    </div>
  </section>

  <script>
    /* ============ 翻页 + 进度条 + 全屏 + corner 更新 ============ */
    const slides = document.querySelectorAll('.slide');
    const fill = document.querySelector('.progress-fill');
    let cur = 0;

    function go(i) {
      cur = Math.max(0, Math.min(slides.length - 1, i));
      slides.forEach((s, k) => s.classList.toggle('active', k === cur));
      if (fill) fill.style.width = ((cur + 1) / slides.length * 100) + '%';
      // 同步更新 hash 用于分享深链
      history.replaceState(null, '', '#' + (cur + 1));
      // 重新触发 fade-item 动画
      slides[cur].querySelectorAll('.fade-item, [style*="animation"]').forEach(el => {
        const a = el.style.animation;
        el.style.animation = 'none'; void el.offsetWidth; el.style.animation = a;
      });
    }
    // hash 深链
    const init = parseInt(location.hash.slice(1), 10);
    if (!isNaN(init)) go(init - 1);

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   { e.preventDefault(); go(cur - 1); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End')  go(slides.length - 1);
      else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    });
    document.querySelectorAll('[data-nav]').forEach(b =>
      b.addEventListener('click', () => go(cur + (b.dataset.nav === 'next' ? 1 : -1))));
    if (fill) fill.style.width = ((cur + 1) / slides.length * 100) + '%';
  </script>
</body>
</html>
```

> **用法**：把上面整段保存为 `index.html` → 为每一页插入 `<section class="slide">…</section>`。
> 每个 layout 模板（01-15）都会假设这段 HTML 已经在页面里。

---

## 字号阶梯（按角色 · 与参考站一致）

| 角色 token | 值 | 用途 |
|---|---|---|
| `--slide-h1` | 48px | 章节大标 / cover 主标（参考站：78px cover / 42px content） |
| `--slide-h2` | 36px | 二级标题 |
| `--slide-h3` | 28px | 卡片标题 |
| `--slide-lead` | 18px | 重要段落 |
| `--slide-body` | 15px | 正文 |
| `--slide-body-sm` | 13.5px | 卡片正文 |
| `--slide-body-xs` | 12px | 描述 / kicker / 命令 |
| `--slide-label` | 11px | kicker / tag / chip |

**响应式** `--*-rwd` 在 ≤1420px 视口时自动缩水（如 36→30px）。<br>
**关键**：主体字号 9-17px（占 91%），靠**留白 + 颜色 + 字距**营造层次，无 32-48px 大段正文。

## 颜色用法对照

| 角色 | 颜色 | 典型场景 |
|---|---|---|
| 主强调 / 成功 | `--green` | 成功状态 / 当前态 / 关键 KPI / `[OK]` |
| 信息 / CTA | `--cyan` | kicker 标签 / 链接 / 副标 |
| 提示 / 待办 | `--amber` | warn / 进行中 / VOL 信息 |
| 警示 / 关键 | `--pink` | P0 / 错误 / 关键结论 |
| 文字 | `--fg` | 主文字（绝不纯白） |
| 次文字 | `--fg-dim` | 描述 / 解释 |
| 弱文字 | `--fg-mute` | 时间戳 / 路径 / chrome 装饰 |

## 字体四件套

| 字体 | 角色 | 关键样式 |
|---|---|---|
| **JetBrains Mono** | 代码 / 标签 / 数字 / chrome / 状态 | `font-family: var(--font-mono)` |
| **Space Grotesk** | 英文 hero / 大数字 / accent | `font-family: var(--font-display); font-style: italic` |
| **Noto Sans SC** | 中文主标 / 正文 | `font-family: var(--font-sans)` |
| **Noto Serif SC**（中文衬线）| toc 卡名 / 中文衬线标题 | `font-family: var(--font-serif)` |

## 排版铁律

1. **背景 `#060a14`**，绝不用纯黑
2. **每页都加 window-chrome + footer-chrome + slide-corner**（必备三件套，缺失则不像终端）
3. **关键节点加闪烁光标** `<span class="blink">▌</span>`（直接渲染字符更省布局空间）
4. **章节用 `PART 0N · LABEL` 格式**（如 `PART 02 · SDD`）
5. **数字用 Space Grotesk italic** + 700 + text-shadow 双层
6. **字距 0.18em~0.26em** 模拟等距感（kicker / chrome / tab）
7. **英文大写 + 中文大白字** 的标题组合
8. **三色日志**：`[OK]` 绿 / `[WARN]` 粉 / `[ERR]` 红 / `[INFO]` 青
9. **每页底部命令栏 prompt 用绿色**
10. **boot log 必含 1 行 `[WARN]`**（即使是占位）
11. **slide-corner 内容随页变化**：cover 用 `[ 01 / 37 ] COVER`，toc 用 `[ 02 / 37 ] INDEX`，part-cover 用 `[ 03 / 37 ] PART 0`

## 字距 + 行高

| 属性 | 值 | 用途 |
|---|---|---|
| `letter-spacing: 0.18em ~ 0.26em` | 宽字距 | 英文大写标签 / kicker |
| `letter-spacing: -0.01em ~ -0.03em` | 紧字距 | 中文主标 / 大数字 |
| `line-height: 1.5 ~ 1.7` | 标准 | 中文段落 |
| `line-height: 1.15` | 紧凑 | ASCII 框 / 数字 |
| `line-height: 1.8 ~ 1.9` | 宽松 | boot log / 终端输出 |

## 装饰元素

| 元素 | 出现率 | 用途 |
|---|---:|---|
| 闪烁光标 | 70% | 等待 / 输入感（CSS `steps(2)` 动画） |
| 36px 网格背景 | 100% | 全局（`body::before`） |
| 3px 装饰条 | 90% | 卡片左上（按 accent 色） |
| 绿色虚线分隔 | 80% | 章节切换视觉锚点 |
| 顶部命令栏 | 100% | 模拟代码编辑器 |
| 底部命令栏 | 100% | 强化"在 CLI 里"感 |
| box-shadow 8px 辉光 | 90% | 强调态卡片 |
| text-shadow 双层辉光 | 10% | 仅 cover hero |

## 反模式（绝对不要做）

- ❌ 用纯白 `#fff` 文字
- ❌ 用纯黑 `#000` 背景
- ❌ 用 emoji 作为视觉元素（用 `▸` `▍` `◆` `▌` 替代）
- ❌ 用圆角 ≥ 8px（保持 4px 硬核感）
- ❌ 用 `box-shadow` 模拟纸质卡片
- ❌ 用 Material Design / iOS 风格的悬浮按钮
- ❌ 用渐变背景色填充 hero
- ❌ 在终端命令栏里用中文（保持英文命令）
- ❌ 给中文标题加 18px 以上的圆角
- ❌ 用 32-48px 的大段正文

## 调试技巧（控制台直接用）

```javascript
// 关闭所有动画看布局
document.querySelectorAll('*').forEach(el => {
  el.style.animation = 'none';
  el.style.transition = 'none';
});

// 高亮 grid 布局
document.querySelectorAll('.grid12, .grid3, .grid4, .grid2, .split').forEach(el => {
  el.style.outline = '1px solid red';
});

// 关闭背景看文字对比
document.body.style.background = '#fff';

// 列出所有用到的颜色
const colors = new Set();
document.querySelectorAll('*').forEach(el => {
  const c = getComputedStyle(el).color;
  const b = getComputedStyle(el).backgroundColor;
  colors.add(c); colors.add(b);
});
console.log([...colors]);
```