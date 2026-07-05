# 01 · Cover（封面）

> 把 PPT 第一页做成"开发者控制台正在启动 + 拆解某个目标"的样子。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"（含 window-chrome + panel + corner + footer）。

## 核心原则

1. **3 段式排版**：顶部 boot log / 中部 12-col grid（ASCII 框 + hero 主标 + speaker box + 描述） / 底部命令行
2. **hero 主标题最大**（72-78px），用 Space Grotesk italic + 双层 text-shadow 辉光
3. **accent 单词**（如 "全链路实战"）单独 italic + green 双层辉光
4. **三色日志**：`[OK]` 绿 / `[WARN]` 粉 / `[INFO]` 青 / `[ERR]` 红
5. **speaker box**（可选）：用 contentEditable 让"演讲者姓名"可现场改写
6. **底部三色 legend**：AMBER/GREEN/PINK 解释含义
7. **强装饰**：闪烁光标 ▌ + ASCII 框（`╔═╗║╚═╝`）+ 双 radial gradient

---

## 变体 A：完整版（最丰富 · 对齐参考站 slide 1）

> 适用：技术分享 / 客户培训 / 公司内部演示

```html
<section class="slide" data-slide="1">
  <!-- chrome / panel / corner / footer 已由父模板提供 -->

  <div class="panel">
    <!-- ⬇️ Cover 完整布局 ⬇️ -->
    <div class="cover">

      <!-- A1. 顶部 boot log（4-6 行 [OK]/[WARN]） -->
      <div class="boot-log fade-item" style="--d:.03s;">
        <div><span class="log-ok">[  OK  ]</span> mount /dev/tencent-cloud on /[deck-slug]</div>
        <div><span class="log-ok">[  OK  ]</span> loading [project].kernel v2.4 ... <span class="log-a">ready</span></div>
        <div><span class="log-ok">[  OK  ]</span> attach modules: spec-kit ／ plugins ／ mcp ... <span class="log-a">ok</span></div>
        <div><span class="log-warn">[ WARN ]</span> classification: <span class="log-warn">internal // field-use only</span></div>
        <div><span class="log-ok">[  OK  ]</span> opening <span class="log-ok">[deck].md</span> <span style="color:var(--fg-dim);">--parts=5 --slides=30</span> ...</div>
      </div>

      <!-- A2. 12-col grid 主区（左：ASCII 框；中：hero；右空） -->
      <div class="grid12 cover-grid">

        <!-- 左列：col 1-2 → ASCII 框 + 卷期号 -->
        <div class="fade-item cover-ascii" style="--d:.1s; grid-column: 1 / span 2; align-self: start; padding-top: 8px;">
<pre class="ascii-frame">╔══════════╗
║ [DECK]   ║
║   FIELD  ║
║     01   ║
╚══════════╝</pre>
          <div class="vol-line">
            <span>VOL.01</span><br>
            <span>2026.Q2</span><br>
            <span style="color:var(--fg-dim);">[DOMAIN] ARCHITECT</span><br>
            <span style="color:var(--fg-dim);">FIELD GUIDE</span>
          </div>
        </div>

        <!-- 中右列：col 3-9 → kicker + hero + speaker + description + continue -->
        <div class="fade-item" style="--d:.17s; grid-column: 3 / span 7;">
          <div class="cover-cmd">
            <span class="log-ok">&gt;</span> ./decompile --target=[primary-obj] --scope=audience,team,stack,scenarios
          </div>

          <h1 class="cover-h1 fade-item" style="--d:.24s;">
            [主标<br>
            <span class="cover-h1-en">[English Label]</span><br>
            <span class="accent">[accent 单词]</span>]
          </h1>

          <!-- speaker box：演讲者姓名可现场编辑 -->
          <div class="speaker-box fade-item" style="--d:.31s;">
            <div class="speaker-row">
              <span class="speaker-tag">SPEAKER</span>
              <span class="speaker-sep">:</span>
              <span contenteditable="true" class="speaker-name speaker-name--accent" placeholder="[主讲]"></span>
              <span class="speaker-sep-soft">/</span>
              <span contenteditable="true" class="speaker-name" placeholder="[副讲]"></span>
            </div>
            <div class="speaker-row">
              <span class="speaker-author">Author:</span>
              <span class="speaker-name--accent">[nickname]</span>
              <span class="speaker-sep-soft">/</span>
              <span class="speaker-name">[真实姓名]<span class="speaker-dept">（[所在部门]）</span></span>
            </div>
          </div>

          <div class="cover-desc fade-item" style="--d:.38s;">
            <span class="log-a">/*</span> [一句话描述这场分享解决什么问题、面向谁、为什么现在做。
            可用 <span class="hl-key">关键概念 × 关键概念</span> 加粗。]
            <span class="log-a">*/</span>
          </div>

          <div class="cover-press fade-item" style="--d:.45s;">
            <span class="log-ok">&gt;</span> press
            <kbd class="kbd-key">→</kbd> or <kbd class="kbd-key">space</kbd> to continue<span class="blink">▌</span>
          </div>
        </div>
      </div>

      <!-- A3. 底部 footer line（命令 + 三色 legend） -->
      <div class="cover-footer fade-item" style="--d:.59s;">
        <div class="cover-footer-prompt">
          <span class="log-ok">[user]@[host]:~/[slug]$</span>
          <span>./start --from=part0/[chapter] --mode=live</span>
        </div>
        <div class="cover-footer-legend">
          <span><span class="legend-chip legend-amber">■</span> AMBER = 分类</span>
          <span><span class="legend-chip legend-green">■</span> GREEN = 当前章节</span>
          <span><span class="legend-chip legend-pink">■</span> PINK = 关键</span>
        </div>
      </div>
    </div>
    <!-- ⬆️ Cover 完整布局 ⬆️ -->
  </div>
</section>

<style>
  /* ===== Cover 专属样式（追加到基础模板） ===== */
  .cover {
    display: flex; flex-direction: column; height: 100%; padding: 0; position: relative;
  }
  /* 可选：cover 背景加 light-pillar 渐变柱（参考站用 three.js canvas） */
  .cover::before {
    content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 80% at 60% 50%, #00ff9c10 0%, transparent 50%),
      radial-gradient(ellipse 40% 60% at 70% 30%, #5ce1ff10 0%, transparent 60%);
    mix-blend-mode: screen;
  }

  /* boot log */
  .boot-log {
    position: relative; z-index: 1;
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .14em; color: var(--fg-dim); line-height: 1.9;
    margin-bottom: 28px;
  }
  .log-ok   { color: var(--green); }
  .log-warn { color: var(--pink); }
  .log-info { color: var(--cyan); }
  .log-err  { color: var(--red); }
  .log-a    { color: var(--amber); }

  /* cover grid */
  .cover-grid { flex: 1; }

  /* ASCII 框 */
  .ascii-frame {
    color: var(--green); font-size: 11px; line-height: 1.15; margin: 0;
    text-shadow: 0 0 10px rgba(0, 255, 156, .5);
    font-family: var(--font-mono);
  }
  .vol-line {
    font-size: 10px; letter-spacing: .22em; text-transform: uppercase;
    color: var(--amber); margin-top: 14px; line-height: 1.8;
    font-family: var(--font-mono);
  }

  /* 命令行（cover 顶部的小命令） */
  .cover-cmd {
    font-size: 11px; letter-spacing: .26em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 18px;
    font-family: var(--font-mono);
  }

  /* hero 标题 */
  .cover-h1 {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 78px; line-height: 1.05; letter-spacing: -2.5px;
    color: var(--fg); margin: 0;
  }
  .cover-h1 .accent {
    color: var(--green);
    text-shadow: 0 0 18px rgba(0,255,156,.55), 0 0 36px rgba(0,255,156,.2);
    font-family: var(--font-display); font-style: italic; font-weight: 500;
  }
  .cover-h1-en {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    color: var(--fg); font-size: 64px; letter-spacing: -2.5px;
  }

  /* speaker box */
  .speaker-box {
    margin-top: 28px;
    display: inline-flex; flex-direction: column; align-items: flex-start;
    gap: 9px; padding: 12px 18px 12px 14px;
    border: 1px solid var(--green); background: rgba(0,255,156,.06);
    box-shadow: 0 0 18px rgba(0,255,156,.18), inset 0 0 0 1px rgba(0,255,156,.08);
  }
  .speaker-row {
    display: flex; align-items: baseline; gap: 5px; width: 100%;
    font-family: var(--font-mono);
  }
  .speaker-tag {
    font-size: 10px; letter-spacing: .24em; text-transform: uppercase;
    color: var(--amber); padding: 4px 8px; border: 1px solid var(--amber);
    background: rgba(255,176,32,.08);
  }
  .speaker-sep { font-size: 12px; color: var(--fg-dim); letter-spacing: .05em; }
  .speaker-sep-soft { color: var(--fg-mute); font-size: 13px; }
  .speaker-name {
    display: inline-block; min-width: 1ch;
    color: var(--fg); font-family: var(--font-display);
    font-size: 19px; font-weight: 600; font-style: italic;
    letter-spacing: .02em; outline: none; white-space: pre;
  }
  .speaker-name--accent {
    color: var(--green);
    text-shadow: 0 0 8px rgba(0,255,156,.3);
    font-size: 24px;
  }
  .speaker-author { font-size: 10px; color: var(--amber); letter-spacing: .08em; text-transform: uppercase; }
  .speaker-dept { font-size: 11px; font-weight: 500; color: var(--fg-dim); letter-spacing: .02em; }

  /* 描述块（/* ... */ 注释样式） */
  .cover-desc {
    margin-top: 30px; max-width: 620px;
    font-size: 13.5px; line-height: 1.8; color: var(--fg-dim);
    border-left: 2px solid var(--green); padding-left: 16px;
    font-family: var(--font-mono);
  }

  /* continue 提示 */
  .cover-press {
    margin-top: 28px;
    font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
    color: var(--fg-dim); font-family: var(--font-mono);
  }
  .kbd-key {
    display: inline-block; padding: 2px 7px;
    border: 1px solid var(--rule); background: var(--bg-2);
    font-family: var(--font-mono); font-size: 10px; border-radius: 3px;
    color: var(--fg);
  }

  /* footer line（命令 + 三色 legend） */
  .cover-footer {
    position: relative; z-index: 1;
    padding-top: 18px; border-top: 1px dashed var(--rule);
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    font-family: var(--font-mono);
  }
  .cover-footer-prompt { font-size: 11px; letter-spacing: .14em; color: var(--fg-dim); }
  .cover-footer-legend {
    font-size: 10px; letter-spacing: .2em; color: var(--fg-dim);
    text-transform: uppercase; text-align: right;
  }
  .legend-chip { margin-right: 4px; }
  .legend-amber { color: var(--amber); }
  .legend-green { color: var(--green); }
  .legend-pink  { color: var(--pink); }
</style>
```

---

## 变体 B：极简版（无 hero 数字 / 无 chip）

适合：内部分享 / 技术分享 / 短 deck（≤10 页）

```html
<section class="slide" data-slide="1">
  <div class="panel">
    <div class="cover cover-mini">
      <div class="boot-log fade-item" style="--d:.05s;">
        <div><span class="log-ok">[  OK  ]</span> loading session ... <span class="log-a">ready</span></div>
        <div><span class="log-warn">[ WARN ]</span> recording</div>
      </div>

      <div class="cover-mini-body">
        <div class="fade-item" style="--d:.1s; font-size:11px; color:var(--cyan); letter-spacing:.26em; margin-bottom:24px;">
          ◆ TECHNICAL SHARE
        </div>
        <h1 class="fade-item" style="--d:.2s; font-family:var(--font-sans); font-weight:700; font-size:78px;
           letter-spacing:-.02em; margin-bottom:20px;">
          [主标题]<span class="blink">▌</span>
        </h1>
        <p class="fade-item" style="--d:.3s; font-size:16px; color:var(--fg-dim);">[副标题 / 日期 / 作者]</p>
      </div>

      <div class="cover-footer">
        <div class="cover-footer-prompt">
          <span class="log-ok">[user]@host:~/deck$</span> cat README.md | less
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cover-mini { display:flex; flex-direction:column; height:100%; padding:0; position:relative; }
  .cover-mini-body { flex:1; display:grid; place-items:center; text-align:center; }
</style>
```

---

## 变体 C：调研报告版（带 ASCII 框 + 大标题）

适合：调研报告 / 白皮书 / H1 总结

```html
<section class="slide" data-slide="1">
  <div class="panel">
    <div class="cover" style="justify-content:center; text-align:center;">
      <pre class="ascii-frame fade-item" style="--d:.05s; font-size:14px;">
┌─────────────────────────────────────┐
│  REPORT  ::  H1 2026  ::  FINAL      │
└─────────────────────────────────────┘</pre>

      <h1 class="fade-item" style="--d:.2s; font-family:var(--font-sans); font-weight:700;
         font-size:64px; letter-spacing:-.02em; margin:24px 0 16px;">
        [调研主题]<span class="blink">▌</span>
      </h1>

      <p class="fade-item" style="--d:.3s; font-size:15px; color:var(--fg-dim);">
        [副标题 / 数据范围 / 方法论]
      </p>

      <div class="cover-footer" style="justify-content:center;">
        <div class="cover-footer-prompt"><span class="log-ok">$</span> open report.pdf</div>
      </div>
    </div>
  </div>
</section>
```

---

## 变体 D：演讲主题版（带"议程预览"）

适合：TED 风格 / keynote / 4 个章节快速预览

```html
<section class="slide" data-slide="1">
  <div class="panel">
    <div class="cover" style="padding:80px;">
      <div style="font-size:11px; color:var(--cyan); letter-spacing:.26em; margin-bottom:24px;">◆ [EVENT NAME]</div>
      <h1 style="font-family:var(--font-sans); font-weight:700; font-size:64px;
                 letter-spacing:-.02em; margin-bottom:40px; line-height:1.1;">
        [演讲主题：<br/>3-5 个关键词组成的命题]
      </h1>

      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; margin-top:48px;">
        <div class="agenda-item agenda-c"><div>01</div><div style="margin-top:8px;">[章节 1]</div></div>
        <div class="agenda-item agenda-a"><div>02</div><div style="margin-top:8px;">[章节 2]</div></div>
        <div class="agenda-item agenda-p"><div>03</div><div style="margin-top:8px;">[章节 3]</div></div>
        <div class="agenda-item agenda-g"><div>04</div><div style="margin-top:8px;">[章节 4]</div></div>
      </div>
    </div>
  </div>
</section>

<style>
  .agenda-item {
    padding: 14px 16px; border-left: 2px solid;
    background: #ffffff06;
    font-size: 12px; color: var(--fg);
    font-family: var(--font-mono);
  }
  .agenda-item > div:first-child { font-size: 11px; letter-spacing: .2em; }
  .agenda-c { border-color: var(--cyan); }
  .agenda-c > div:first-child { color: var(--cyan); }
  .agenda-a { border-color: var(--amber); }
  .agenda-a > div:first-child { color: var(--amber); }
  .agenda-p { border-color: var(--pink); }
  .agenda-p > div:first-child { color: var(--pink); }
  .agenda-g { border-color: var(--green); }
  .agenda-g > div:first-child { color: var(--green); }
</style>
```

---

## Checklist

- [ ] **window-chrome / corner / footer 三件套都在**（每页必备）
- [ ] **slide-corner 内容正确**：`[ 01 / 37 ] COVER`
- [ ] **boot log 至少 4 行** 且含 1 行 `[ WARN ]`
- [ ] **hero 主标题含 1 个 accent 单词**（用 `<span class="accent">[词]</span>`）
- [ ] **变体 A 必有 speaker box**（含 SPEAKER tag + Author 行）
- [ ] **cover footer 必有 3 色 legend**（AMBER/GREEN/PINK 含义说明）
- [ ] **至少 1 个闪烁光标**（`<span class="blink">▌</span>`）
- [ ] **1440×900 视口下不溢出**（hero 字号 ≤ 78px，行距 ≥ 1.05）
- [ ] 字体四件套都已加载（JetBrains Mono + Space Grotesk + Noto Sans SC + Noto Serif SC）

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| 看起来不像"控制台启动" | 缺 boot log / ASCII 框 | 至少 4 行 `[OK]/[WARN]` + 1 个 `╔═╗` 框 |
| 演讲者姓名不知道怎么改 | 用了纯文本 | 改用 `<span contenteditable="true" class="speaker-name">` |
| hero 主标与 accent 单词冲突 | 都太大 | 主标 78px / accent 72px，间距 18px |
| 三色 legend 看不懂 | 没有示例说明 | 必须分别解释分类 / 当前章节 / 关键 |
| corner 不更新 | JS 没切换 | 用 base 模板的 `go()` 自动更新 |