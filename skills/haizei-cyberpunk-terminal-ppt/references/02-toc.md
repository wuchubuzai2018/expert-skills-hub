# 02 · TOC（目录）

> 把目录页做成"cat report.md --chapters" 输出章节列表的样子。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"。

## 核心原则

1. **顶部小标题 + 大标题**：`cat report.md --chapters` 命令 + `current report · 章节导航` 标题
2. **12-col grid 章节卡片矩阵**：第 1 张 featured 卡片横跨 12 列（全宽高亮），其余按 6/6、4/8 分布
3. **每张卡 5 要素**：PART 编号 + 英文 kicker + 大数字（54px）+ 章节名（衬线 Noto Serif SC）+ 描述 + 页码范围
4. **current card 高亮**（`._active`）：背景翻转为绿色，文字翻转为黑色，附加 `• 当前` 标签
5. **底部 meta-bar**：命令统计（5 CHAPTERS · 30 SLIDES · 45 MIN）+ 三色 legend
6. **避免等距网格**：featured 宽卡 + 普通卡混排打破规整

---

## 变体 A：完整版（12-col · 对齐参考站 slide 2）

> 适用：5 个章节、突出当前章节

```html
<section class="slide" data-slide="2">
  <div class="panel">
    <!-- ⬇️ TOC 完整布局 ⬇️ -->
    <div class="toc">

      <!-- A1. 顶部标题 -->
      <div class="toc-header">
        <div class="kicker">cat report.md --chapters</div>
        <h2 class="h-title" style="margin-top:8px;">
          <span class="accent">current report</span> · 章节导航
        </h2>
        <div class="toc-divider"><span class="blink">▌</span></div>
      </div>

      <!-- A2. 12-col 卡片矩阵 -->
      <div class="grid12 toc-grid" style="margin-top:28px;">

        <!-- Featured 全宽卡（当前章节） -->
        <article class="toc-card toc-card--featured _active" style="grid-column: 1 / span 12; margin-bottom: 6px;">
          <div class="toc-kicker">PART / 00 <span class="toc-sym">—</span> EVOLUTION</div>
          <div class="toc-num">00<span class="toc-dot">.</span></div>
          <div class="toc-name">AI 编程范式演进</div>
          <div class="toc-desc">传统 AI 辅助 → Vibe Coding → SDD
            再到以 AI 中心分发任务的企业 Teams 工作流</div>
          <div class="toc-range">
            <span>→ 页 03-05</span>
            <span class="toc-cur">• 当前</span>
          </div>
        </article>

        <!-- 普通 6/6 卡 -->
        <article class="toc-card" style="grid-column: 1 / span 6; margin-bottom: 6px;">
          <div class="toc-kicker">PART / 01 <span class="toc-sym">—</span> END-TO-END</div>
          <div class="toc-num">01<span class="toc-dot">.</span></div>
          <div class="toc-name">全链路 AI 实战 · Harness 方法论</div>
          <div class="toc-desc">MCP 拉需求 / AI 设计 / Spec-kit / SDD
            AI 自动化测试 + CNB + Agent Skills + Harness</div>
          <div class="toc-range">
            <span>→ 页 06-17</span>
            <span class="toc-cur">• 当前</span>
          </div>
        </article>

        <article class="toc-card" style="grid-column: 7 / span 6; margin-bottom: 6px;">
          <div class="toc-kicker">PART / 02 <span class="toc-sym">—</span> TEAM</div>
          <div class="toc-num">02<span class="toc-dot">.</span></div>
          <div class="toc-name">AI 全栈团队</div>
          <div class="toc-desc">交付理念 · 三阶段转型不可跳级
            六工种能力重组：需求 → 架构 → 研发 → 质量 → PM → 运维</div>
          <div class="toc-range">
            <span>→ 页 18-21</span>
            <span class="toc-cur">• 当前</span>
          </div>
        </article>

        <!-- 普通 4/8 卡（错落） -->
        <article class="toc-card" style="grid-column: 1 / span 4;">
          <div class="toc-kicker">PART / 03 <span class="toc-sym">—</span> AUDIENCE</div>
          <div class="toc-num">03<span class="toc-dot">.</span></div>
          <div class="toc-name">落地场景 · 常见 Q&amp;A</div>
          <div class="toc-desc">决策层：价值证明 / ROI / 推进路径
            技术层：接入方式 / 治理边界 / 实施路径</div>
          <div class="toc-range">
            <span>→ 页 22-24</span>
            <span class="toc-cur">• 当前</span>
          </div>
        </article>

        <article class="toc-card" style="grid-column: 5 / span 8;">
          <div class="toc-kicker">PART / 04 <span class="toc-sym">—</span> ROADMAP</div>
          <div class="toc-num">04<span class="toc-dot">.</span></div>
          <div class="toc-name">AI Coding 落地路线图</div>
          <div class="toc-desc">协作 / PR / 重构 + 人机契约
            23 条需求 + 21 份 KM 实践，按 P0/P1/P2 推进</div>
          <div class="toc-range">
            <span>→ 页 25-29</span>
            <span class="toc-cur">• 当前</span>
          </div>
        </article>
      </div>

      <!-- A3. 底部 meta-bar（统计 + legend） -->
      <div class="toc-meta" style="margin-top:18px;">
        <span>$ wc -l *.md → <span class="meta-hl">5 CHAPTERS · 30 SLIDES · 45 MIN</span></span>
        <span>
          <span class="legend-amber">■</span> AMBER = 分类
          <span class="legend-green">■</span> GREEN = 当前章节
          <span class="legend-pink">■</span> PINK = 关键
        </span>
      </div>
    </div>
    <!-- ⬆️ TOC 完整布局 ⬆️ -->
  </div>
</section>

<style>
  /* ===== TOC 专属样式 ===== */
  .toc {
    display: flex; flex-direction: column; height: 100%; padding: 0;
  }
  .toc-header { animation: .5s cubic-bezier(.2,.7,.2,1) .03s 1 normal both running fadeUp; }
  .toc-divider {
    height: 0; width: 140px;
    border-top: 1px dashed var(--green);
    position: relative; margin-top: 14px;
    box-shadow: 0 0 8px rgba(0,255,156,.4);
  }
  .toc-divider .blink {
    position: absolute; right: -14px; top: -14px;
    color: var(--green); font-size: 12px;
  }

  .toc-grid { flex: 1; align-content: start; }

  /* TOC 卡片基础 */
  .toc-card {
    position: relative;
    border: 1px solid var(--rule); background: var(--bg-3);
    padding: 16px 18px;
    transition: transform .35s cubic-bezier(.2,.7,.2,1),
                box-shadow .35s, background .35s;
    animation: .5s cubic-bezier(.2,.7,.2,1) var(--d, .1s) 1 normal both running fadeUp;
  }
  .toc-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px var(--green), 0 0 40px #00ff9c66, inset 0 0 18px #ffffff1a;
  }
  /* 5 要素 */
  .toc-kicker {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: .24em; text-transform: uppercase;
    color: var(--amber);
  }
  .toc-sym { color: var(--fg-dim); }
  .toc-num {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    font-size: 54px; line-height: .95; letter-spacing: -2px;
    color: var(--green); text-shadow: 0 0 16px #00ff9c66;
    margin-top: 4px;
  }
  .toc-dot { color: var(--pink); }
  .toc-name {
    font-family: var(--font-serif); /* 用衬线强调"章节名" */
    font-size: 16px; font-weight: 700; letter-spacing: -.3px;
    color: var(--fg); margin-top: 9px;
  }
  .toc-desc {
    font-family: var(--font-mono);
    font-size: 10.4px; line-height: 1.58;
    color: var(--fg-dim); white-space: pre-line;
    margin: 9px 0 0;
  }
  .toc-range {
    font-family: var(--font-mono);
    font-size: 9.4px; letter-spacing: .16em; text-transform: uppercase;
    color: var(--fg-dim);
    border-top: 1px dashed var(--rule);
    display: flex; justify-content: space-between; gap: 10px;
    margin-top: 10px; padding-top: 8px;
  }
  .toc-cur {
    color: var(--amber); opacity: 0;
    transition: opacity .25s;
  }

  /* 高亮态（当前章节） */
  .toc-card._active {
    background: var(--green); color: var(--bg); border-color: var(--green);
    box-shadow: 0 0 0 1px var(--green), 0 0 40px #00ff9c66, inset 0 0 18px #ffffff1a;
    transform: translateY(-2px);
  }
  .toc-card._active .toc-kicker { color: var(--bg); font-weight: 600; }
  .toc-card._active .toc-sym    { color: var(--pink); }
  .toc-card._active .toc-num    { color: var(--bg); text-shadow: none; }
  .toc-card._active .toc-name   { color: var(--bg); }
  .toc-card._active .toc-desc   { color: var(--bg); opacity: .82; }
  .toc-card._active .toc-range  { color: var(--bg); opacity: .9; border-top-color: #060a1459; }
  .toc-card._active .toc-cur    { color: var(--pink); opacity: 1; font-weight: 600; }

  /* meta-bar */
  .toc-meta {
    border: 1px solid var(--rule); background: var(--bg-2);
    color: var(--fg-dim); letter-spacing: .08em;
    font-family: var(--font-mono); font-size: 10px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px;
    animation: .5s cubic-bezier(.2,.7,.2,1) .52s 1 normal both running fadeUp;
  }
  .toc-meta .meta-hl { color: var(--green); }
  .toc-meta .legend-amber { color: var(--amber); }
  .toc-meta .legend-green { color: var(--green); }
  .toc-meta .legend-pink  { color: var(--pink); }
</style>
```

---

## 变体 B：极简列表版（5 章节无矩阵）

适合：章节数 ≤ 5 / 每章很短 / 想保持单页极简

```html
<section class="slide" data-slide="2">
  <div class="panel">
    <div class="toc" style="padding:80px;">
      <div class="kicker">cat report.md --chapters</div>
      <h2 class="h-title" style="margin-top:8px;">目录<span class="blink">▌</span></h2>

      <ol class="toc-list" style="margin-top:40px;">
        <li><span style="color:var(--cyan);">01</span> [章节 1]</li>
        <li><span style="color:var(--amber);">02</span> [章节 2]</li>
        <li><span style="color:var(--pink);">03</span> [章节 3]</li>
        <li><span style="color:var(--green);">04</span> [章节 4]</li>
        <li><span style="color:var(--cyan);">05</span> [章节 5]</li>
      </ol>
    </div>
  </div>
</section>

<style>
  .toc-list {
    list-style: none; counter-reset: part;
    font-size: 17px; line-height: 2.4;
    font-family: var(--font-sans);
  }
  .toc-list li { display: flex; align-items: baseline; gap: 24px; }
  .toc-list li span:first-child {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: .2em; min-width: 32px;
  }
</style>
```

---

## 变体 C：N 章节自适应网格版（无 current 高亮）

适合：章节数 ≥ 6 / 不需要"当前章节"高亮

```html
<section class="slide" data-slide="2">
  <div class="panel">
    <div class="toc" style="padding:60px 80px;">
      <div class="kicker">cat report.md --chapters</div>
      <h2 class="h-title" style="margin-top:8px;">目录<span class="blink">▌</span></h2>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
                  gap:14px; margin-top:32px;">
        <article class="toc-card">
          <div class="toc-kicker">PART / 01</div>
          <div class="toc-num">01<span class="toc-dot">.</span></div>
          <div class="toc-name">[章节 1]</div>
        </article>
        <article class="toc-card">
          <div class="toc-kicker">PART / 02</div>
          <div class="toc-num">02<span class="toc-dot">.</span></div>
          <div class="toc-name">[章节 2]</div>
        </article>
        <!-- ... -->
      </div>
    </div>
  </div>
</section>
```

---

## 变体 D：左标题 + 右进度时间线

适合：强调"议程进度"或"剩余时间"

```html
<section class="slide" data-slide="2">
  <div class="panel">
    <div class="toc" style="display:grid; grid-template-columns: 4fr 6fr; gap:60px; padding:80px;">
      <div>
        <div class="kicker">cat /outline</div>
        <h2 class="h-title" style="margin-top:8px;">Agenda<span class="blink">▌</span></h2>
        <p style="font-size:13px; color:var(--fg-dim); line-height:1.7; margin-top:16px;">[简短议程说明]</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:18px;">
        <div class="toc-timeline-row">
          <span style="color:var(--cyan);">01</span>
          <span>[章节 1 标题]</span>
          <span style="text-align:right; color:var(--fg-mute);">5 min</span>
        </div>
        <div class="toc-timeline-row">
          <span style="color:var(--amber);">02</span>
          <span>[章节 2 标题]</span>
          <span style="text-align:right; color:var(--fg-mute);">8 min</span>
        </div>
        <div class="toc-timeline-row">
          <span style="color:var(--pink);">03</span>
          <span>[章节 3 标题]</span>
          <span style="text-align:right; color:var(--fg-mute);">12 min</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .toc-timeline-row {
    display: grid; grid-template-columns: 80px 1fr 80px; align-items: center;
    padding: 12px 0; border-bottom: 1px dashed var(--rule);
    font-size: 13px;
  }
  .toc-timeline-row > span:first-child {
    font-family: var(--font-mono); letter-spacing: .2em; font-size: 11px;
  }
</style>
```

---

## Checklist

- [ ] **window-chrome / corner / footer 三件套都在**（corner 写 `[ 02 / 37 ] INDEX`）
- [ ] **变体 A 必有 1 张 featured 全宽卡**（12 列宽，绿色背景）
- [ ] **变体 A 必有 toc-meta**：左侧 `wc -l` 统计 / 右侧 3 色 legend
- [ ] 章节名用 `Noto Serif SC` 衬线
- [ ] 数字 54px 用 Space Grotesk italic + text-shadow
- [ ] 每张卡 5 要素：kicker / num / name / desc / range 全在
- [ ] `_active` 卡颜色翻转 + 显示 `• 当前` 标签
- [ ] 至少 1 个闪烁光标（divider 末尾 或 title 末尾）
- [ ] 1440×900 视口下不溢出（卡片 desc 限制 ≤ 4 行）

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| 章节卡片看起来都一样 | 没有 featured 卡 | 至少 1 张横跨 12 列 + 绿色背景高亮 |
| current 章节没高亮 | 缺 `_active` 类 | 给当前章节卡加 `_active` |
| 章节名用 sans 太普通 | 没用衬线 | 改用 `font-family: var(--font-serif)` |
| 描述溢出 | 超过 4 行 | 限 ≤ 4 行 + `white-space: pre-line` |
| 没页码范围 | 缺 range | 必加 `→ 页 X-Y` |
| legend 看不懂 | 含义不清 | 必须分别解释：分类 / 当前章节 / 关键 |