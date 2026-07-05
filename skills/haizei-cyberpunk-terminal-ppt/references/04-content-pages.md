# 04 · Content Pages（正文页 · 8 种基础 layout）

> 正文页的 **8 种最常用 layout**。每种都给完整可运行的 HTML 模板。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"（含 window-chrome + panel + corner + footer）。

## 速查：什么时候选哪种

| Layout | 用途 | 典型场景 |
|---|---|---|
| **thesisPanel + stepCard（推荐）**| 顶部一句核心论点 + 4 阶段 step card 带箭头连接 | "演进/路径/阶段" 类，最常用的内容页 |
| **4-card** | 4 个并列概念 | 4 大原则 / 4 步骤 / 4 类型 |
| **3-card** | 3 个并列概念（更大）| 3 阶段 / 3 支柱 / 3 视角 |
| **2-col** | 左文 + 右图/表 | 介绍 + 截图 / 问题 + 解法 |
| **KPI** | 4 个核心数字 + 解释 | 业绩 / 指标 / 数据 |
| **timeline** | N 阶段时间线 | 演进史 / 里程碑 / 路径 |
| **roadmap** | 路线图（多列瓦片）| 后续 6/12-advanced-layouts.md 有更高级版 |
| **frameworkCard** | 3 个并列 + kicker + tag + role + 适合场景 + 要点列表 | 框架/方法论对比（spec-kit / OpenSpec / superpowers） |

---

## Layout 0：thesisPanel + stepCard（顶部论点 + 4 阶段箭头连接 · 推荐）

> **推荐的最常用内容页**：顶部 1 句核心论点（含 kicker + 主张 + 解释 + axisLabel） + 下方 4 张带箭头连接器的 stepCard + 底部 workflowPanel。
> 对齐参考站 slide 4（AI 编程演进）。

**适用**：演进 / 路径 / 阶段 / 流程，"分 N 阶段讲清楚 1 个核心论点"的场景。

```html
<section class="slide" data-slide="4">
  <div class="panel">
    <!-- ⬇️ thesis + step + workflow 组合 ⬇️ -->

    <!-- 1. 顶部 kicker + 主标 -->
    <div class="part-label">PART [NN] · [LABEL] · [SUB-LABEL]</div>
    <h2 class="h-title mt-2">[主标题：从<span class="accent">[accent 1]</span>，到<span class="accent">[accent 2]</span>]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <!-- 2. 三段式 stage：thesisPanel + timeline(step) + workflowPanel -->
    <div class="stage">

      <!-- 2a. thesisPanel：核心论点 -->
      <div class="thesis-panel">
        <div class="thesis-kicker">[KICKER · 参考图的逻辑]</div>
        <div class="thesis-title">[一句话主张，不是"工具越来越强"，而是[新观点]。</div>
        <p>[3-4 行解释这个主张的上下文、为什么现在成立、对比旧的认知。]</p>
        <div class="axis-label">
          <span>[local / 旧]</span><b>→</b><span>[team / 新]</span>
        </div>
      </div>

      <!-- 2b. timeline：4 张 stepCard 带箭头连接器 -->
      <div class="timeline-4">
        <div class="step-card" style="--tone: var(--green);">
          <div class="step-head"><span>01</span><i>[STAGE LABEL]</i></div>
          <div class="step-title">[阶段 1 标题]</div>
          <div class="step-sub">[阶段 1 副标]</div>
          <p>[阶段 1 描述，2-3 行]</p>
          <div class="connector">→</div>
        </div>
        <div class="step-card" style="--tone: var(--cyan);">
          <div class="step-head"><span>02</span><i>[STAGE LABEL]</i></div>
          <div class="step-title">[阶段 2 标题]</div>
          <div class="step-sub">[阶段 2 副标]</div>
          <p>[阶段 2 描述]</p>
          <div class="connector">→</div>
        </div>
        <div class="step-card" style="--tone: var(--amber);">
          <div class="step-head"><span>03</span><i>[STAGE LABEL]</i></div>
          <div class="step-title">[阶段 3 标题]</div>
          <div class="step-sub">[阶段 3 副标]</div>
          <p>[阶段 3 描述]</p>
          <div class="connector">→</div>
        </div>
        <div class="step-card" style="--tone: var(--pink);">
          <div class="step-head"><span>04</span><i>[STAGE LABEL]</i></div>
          <div class="step-title">[阶段 4 标题]</div>
          <div class="step-sub">[阶段 4 副标]</div>
          <p>[阶段 4 描述]</p>
        </div>
      </div>

      <!-- 2c. workflowPanel：底层说明 -->
      <div class="workflow-panel">
        <div class="workflow-head">
          <span>[WORKFLOW · BACKBONE]</span>
          <b>[围绕 [X] 构建 [Y] 的工作流]</b>
        </div>
        <div class="layer-grid">
          <div class="layer-row"><span>01</span><strong>[层名 1]</strong><p>[层 1 描述]</p></div>
          <div class="layer-row"><span>02</span><strong>[层名 2]</strong><p>[层 2 描述]</p></div>
          <div class="layer-row"><span>03</span><strong>[层名 3]</strong><p>[层 3 描述]</p></div>
          <div class="layer-row"><span>04</span><strong>[层名 4]</strong><p>[层 4 描述]</p></div>
        </div>
      </div>
    </div>

    <!-- 3. 底部 bottom-line（结论） -->
    <div class="bottom-line">
      <span>$ conclusion</span>
      <b>[一句话总结这个页面的核心观点。]</b>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 0 专属样式 ===== */
  .stage {
    flex: 1;
    display: grid; grid-template-rows: auto minmax(0, 1fr) auto;
    gap: 12px; min-height: 0; margin-top: 14px;
  }

  /* thesisPanel：3 列网格（左 kicker + 中标题段 + 右 axisLabel） */
  .thesis-panel {
    background: linear-gradient(90deg, #00ff9c14, #5ce1ff09 44%, #ff2e880d), #060a14d1;
    border: 1px solid #5ce1ff40;
    display: grid; grid-template-columns: 225px minmax(0, 1fr) 310px;
    align-items: center; gap: 18px;
    padding: 17px 20px;
    position: relative; overflow: hidden;
  }
  .thesis-panel::before {
    content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .46;
    background-image:
      linear-gradient(90deg, #ffffff09 1px, transparent 1px),
      linear-gradient(#ffffff07 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .thesis-kicker {
    position: relative; z-index: 1;
    font-family: var(--font-mono); font-size: 11px; line-height: 1.65;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--amber);
  }
  .thesis-title {
    position: relative; z-index: 1;
    color: var(--fg);
    font-size: 26px; font-weight: 700; line-height: 1.24;
  }
  .thesis-panel p {
    position: relative; z-index: 1;
    font-size: var(--slide-lead); color: #d9e4f5c7;
    margin: 8px 0 0; line-height: 1.66;
  }
  .axis-label {
    position: relative; z-index: 1;
    justify-self: end;
    display: inline-flex; align-items: center; gap: 10px;
    font-family: var(--font-mono); font-size: var(--slide-body-xs);
    letter-spacing: .11em; text-transform: uppercase;
    color: var(--fg-dim);
    background: #00ff9c0e; border: 1px solid #00ff9c47;
    padding: 8px 12px;
  }
  .axis-label b { color: var(--green); font-size: 18px; font-weight: 400; }

  /* timeline-4：4 张 stepCard 带连接器 */
  .timeline-4 {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px; min-height: 0;
  }
  .step-card {
    position: relative; overflow: visible;
    border: 1px solid var(--rule);
    background: linear-gradient(#0f1626f5, #070c18fc);
    padding: 16px 16px 14px;
    min-height: 0;
    box-shadow: inset 0 0 0 1px #d9e4f508;
  }
  .step-card::before {
    content: ''; position: absolute; top: 0; left: 14px; right: 14px; height: 2px;
    background: var(--tone, var(--green));
    box-shadow: 0 0 16px var(--tone, var(--green));
  }
  .step-head {
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    font-family: var(--font-mono); font-size: 11px; letter-spacing: .13em;
    text-transform: uppercase; color: var(--fg-dim);
  }
  .step-head span { color: var(--tone, var(--green)); font-weight: 700; }
  .step-head i   { font-style: normal; }
  .step-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 29px; line-height: 1.08; letter-spacing: -.7px;
    color: var(--fg); margin-top: 16px;
  }
  .step-sub {
    min-height: 38px;
    font-size: var(--slide-body); color: var(--tone, var(--green));
    margin-top: 8px; line-height: 1.42;
  }
  .step-card p {
    min-height: 86px;
    font-size: var(--slide-lead); color: #d9e4f5c2;
    margin: 10px 0 0; line-height: 1.52;
  }
  /* 连接器：右侧 22×22 方块带 → */
  .connector {
    z-index: 3;
    position: absolute; top: 50%; right: -17px; transform: translateY(-50%);
    width: 22px; height: 22px;
    display: grid; place-items: center;
    background: var(--bg); color: var(--cyan);
    border: 1px solid #5ce1ff66;
    font-family: var(--font-mono);
  }
  /* 最后一张不要连接器 */
  .step-card:last-child .connector { display: none; }

  /* workflowPanel：底部"分层说明" */
  .workflow-panel {
    background: radial-gradient(circle at 18% 0, #00ff9c1c, transparent 34%), #0a1020e6;
    border: 1px solid #00ff9c47;
    padding: 13px 14px;
  }
  .workflow-head {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 18px; padding-bottom: 10px;
    border-bottom: 1px dashed #6b7a9952;
  }
  .workflow-head span {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .16em; color: var(--green);
    text-transform: uppercase;
  }
  .workflow-head b { font-size: var(--slide-lead); color: var(--fg); }
  .layer-grid {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px; margin-top: 10px;
  }
  .layer-row {
    display: grid; grid-template-columns: 34px 64px minmax(0, 1fr);
    align-items: start; gap: 9px;
    background: #060a146b; border: 1px solid #6b7a993d;
    padding: 8px 9px;
  }
  .layer-row span {
    font-family: var(--font-mono); font-size: var(--slide-body-xs);
    color: var(--amber); text-transform: uppercase;
  }
  .layer-row strong { font-size: var(--slide-lead); color: var(--fg); }
  .layer-row p {
    font-size: var(--slide-body-sm); color: #d9e4f5b8;
    margin: 0; line-height: 1.45;
  }

  /* bottom-line：黄色 bottom callout */
  .bottom-line {
    display: flex; align-items: center; gap: 12px;
    background: linear-gradient(90deg, #ffb02014, #00ff9c09, transparent);
    border: 1px solid #ffb0204d;
    padding: 10px 12px; margin-top: 12px;
  }
  .bottom-line span {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .16em; color: var(--amber);
    text-transform: uppercase; flex-shrink: 0;
  }
  .bottom-line b {
    font-size: var(--slide-body); color: #d9e4f5eb;
    line-height: 1.48;
  }
</style>
```

### 简化版（去掉底部 workflow + bottom-line）

如果内容只有 4 个阶段，不需要底层说明，可以省略 workflowPanel：

```html
<div class="stage">
  <div class="thesis-panel">…</div>
  <div class="timeline-4">…</div>
</div>
```

---

## Layout 1：4-card（4 张并列卡片）

**适用**：4 个并列概念、4 大原则、4 个阶段、4 个类型。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>[SECTION-NAME]</span>
    <span class="sep">/</span>
    <span>4 of 7 pages</span>
  </div>

  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:42px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [4 个并列概念的标题]<span class="cursor"></span>
    </h1>

    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:18px;">
      <div class="card fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="card__bar"></div>
        <div class="card__no">01</div>
        <div class="card__title">[概念 1 标题]</div>
        <div class="card__desc">[概念 1 描述，2-3 行]</div>
        <div class="card__metric">42<span class="card__metric-unit">%</span></div>
      </div>
      <div class="card fade-item" style="--d:0.18s; --accent: var(--amber);">
        <div class="card__bar"></div>
        <div class="card__no">02</div>
        <div class="card__title">[概念 2 标题]</div>
        <div class="card__desc">[概念 2 描述]</div>
        <div class="card__metric">3.2<span class="card__metric-unit">x</span></div>
      </div>
      <div class="card fade-item" style="--d:0.26s; --accent: var(--pink);">
        <div class="card__bar"></div>
        <div class="card__no">03</div>
        <div class="card__title">[概念 3 标题]</div>
        <div class="card__desc">[概念 3 描述]</div>
        <div class="card__metric">128<span class="card__metric-unit">k</span></div>
      </div>
      <div class="card fade-item" style="--d:0.34s; --accent: var(--green);">
        <div class="card__bar"></div>
        <div class="card__no">04</div>
        <div class="card__title">[概念 4 标题]</div>
        <div class="card__desc">[概念 4 描述]</div>
        <div class="card__metric">99.9<span class="card__metric-unit">%</span></div>
      </div>
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">cat /principles.md</span>
  </div>
</section>

<style>
  .card {
    position: relative;
    padding: 20px 20px 22px 24px;
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-radius: 2px;
  }
  .card__bar {
    position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--accent, var(--green));
    box-shadow: 0 0 6px var(--accent, var(--green));
  }
  .card__no {
    font-size: 10px; letter-spacing: 0.22em;
    color: var(--accent, var(--green));
    margin-bottom: 8px;
  }
  .card__title {
    font-family: var(--font-sans);
    font-size: 17px; font-weight: 700;
    line-height: 1.3; margin-bottom: 8px;
  }
  .card__desc {
    font-size: 11px; color: var(--fg-dim);
    line-height: 1.55; margin-bottom: 16px;
  }
  .card__metric {
    font-family: var(--font-display);
    font-weight: 700; font-size: 42px;
    color: var(--accent, var(--green));
    line-height: 1;
    text-shadow: 0 0 12px currentColor;
  }
  .card__metric-unit {
    font-size: 18px; opacity: 0.7; margin-left: 2px;
  }
</style>
```

---

## Layout 2：3-card（3 张并列卡片 · 更大）

**适用**：3 个并列概念、3 阶段、3 支柱。卡片更大、描述更长。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>[SECTION-NAME]</span>
  </div>

  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:42px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [3 个并列概念的标题]<span class="cursor"></span>
    </h1>

    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:20px;">
      <div class="big-card fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="card__bar"></div>
        <div style="display:flex; align-items:flex-start; gap:16px;">
          <div style="font-family:var(--font-display); font-weight:700; font-style:italic;
                      font-size:64px; color:var(--accent); line-height:1;">
            01
          </div>
          <div style="flex:1;">
            <div style="font-size:11px; letter-spacing:0.22em; color:var(--accent); margin-bottom:8px;">PHASE</div>
            <h3 style="font-family:var(--font-sans); font-weight:700; font-size:24px; line-height:1.2; margin-bottom:12px;">
              [阶段 1 标题]
            </h3>
            <p style="font-size:13px; color:var(--fg-dim); line-height:1.65;">
              [阶段 1 描述，3-4 行解释这个阶段做什么 / 关键产出 / 验证标准。]
            </p>
          </div>
        </div>
      </div>
      <!-- 卡片 02 / 03 同样结构，换 accent 色 + 内容 -->
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">ls /phases/</span>
  </div>
</section>
```

---

## Layout 3：2-col（左文 + 右图/表）

**适用**：介绍 + 截图、问题 + 解法、对比 + 总结。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>[SECTION-NAME]</span>
  </div>

  <div class="stage" style="display:grid; grid-template-columns: 5fr 7fr; padding:80px; gap:60px;">
    
    <!-- 左：文字 -->
    <div>
      <div class="fade-item" style="--d:0.05s; font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
      <h1 class="fade-item" style="--d:0.1s; font-family:var(--font-sans); font-weight:700;
          font-size:48px; letter-spacing:-0.02em; margin-bottom:24px;">
        [标题]<span class="cursor"></span>
      </h1>
      <p class="fade-item" style="--d:0.2s; font-size:14px; color:var(--fg-dim); line-height:1.7; margin-bottom:20px;">
        [第 1 段：问题描述]
      </p>
      <p class="fade-item" style="--d:0.3s; font-size:14px; color:var(--fg-dim); line-height:1.7; margin-bottom:24px;">
        [第 2 段：解决方案]
      </p>
      <ul class="fade-item" style="--d:0.4s; list-style:none; font-size:13px; color:var(--fg); line-height:1.9;">
        <li><span style="color:var(--green); margin-right:10px;">▸</span> [要点 1]</li>
        <li><span style="color:var(--green); margin-right:10px;">▸</span> [要点 2]</li>
        <li><span style="color:var(--green); margin-right:10px;">▸</span> [要点 3]</li>
      </ul>
    </div>

    <!-- 右：图/表/代码框 -->
    <div class="fade-item" style="--d:0.3s;">
      <!-- 选项 A：截图占位 -->
      <div style="border:1px solid var(--rule); background:#ffffff06; height:100%;
                  display:grid; place-items:center; color:var(--fg-mute); font-size:11px; letter-spacing:0.2em;">
        [ 截图 / 图示 / 代码框占位 ]
      </div>
      
      <!-- 选项 B：代码框 -->
      <!-- <pre style="background:#0a1020; border:1px solid var(--rule); padding:20px;
                    font-size:12px; line-height:1.7; color:var(--fg);
                    overflow:auto; height:100%;">
<span style="color:var(--green);">function</span> <span style="color:var(--cyan);">example</span>() {
  <span style="color:var(--fg-dim);">// 这里是代码示例</span>
  <span style="color:var(--pink);">return</span> <span style="color:var(--amber);">42</span>;
}</pre> -->
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">cat /section/README.md</span>
  </div>
</section>
```

---

## Layout 4：KPI（4 个核心数字 + 解释）

**适用**：业绩汇报、指标页、数据汇总。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>METRICS · [PERIOD]</span>
    <span class="sep">/</span>
    <span>aggregated</span>
  </div>

  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ KEY METRICS</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:42px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [指标主题标题]<span class="cursor"></span>
    </h1>

    <!-- 4 个 KPI 大数字 -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:24px; margin-bottom:40px;">
      <div class="kpi-block fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="kpi-block__label">[KPI 1 LABEL]</div>
        <div class="kpi-block__value">42<span class="kpi-block__unit">%</span></div>
        <div class="kpi-block__delta">↑ 12% vs [PREV]</div>
      </div>
      <!-- KPI 2 / 3 / 4 同样结构 -->
    </div>

    <!-- KPI 解释区 -->
    <div style="padding:20px 24px; border-left:2px solid var(--cyan); background:#ffffff06; font-size:12px; color:var(--fg-dim); line-height:1.7;">
      <span style="color:var(--cyan); letter-spacing:0.2em; margin-right:12px;">[NOTE]</span>
      [对 4 个 KPI 的整体解释：数据来源 / 统计周期 / 注意事项]
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">grep METRICS /report</span>
  </div>
</section>

<style>
  .kpi-block {
    padding: 18px 20px;
    border: 1px solid var(--rule);
    border-left: 2px solid var(--accent, var(--cyan));
    background: #ffffff06;
  }
  .kpi-block__label {
    font-size: 10px; letter-spacing: 0.22em;
    color: var(--accent, var(--cyan));
    margin-bottom: 12px;
  }
  .kpi-block__value {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 56px; line-height: 1;
    color: var(--accent, var(--cyan));
    text-shadow: 0 0 16px currentColor;
  }
  .kpi-block__unit {
    font-size: 22px; opacity: 0.7; margin-left: 4px;
    font-style: normal;
  }
  .kpi-block__delta {
    font-size: 11px; color: var(--green);
    letter-spacing: 0.18em;
    margin-top: 8px;
  }
</style>
```

---

## Layout 5：timeline（N 阶段时间线）

**适用**：演进史、里程碑、产品路径。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>TIMELINE · [PERIOD]</span>
  </div>

  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:42px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [时间线主题标题]<span class="cursor"></span>
    </h1>

    <!-- 横向时间线 -->
    <div style="position:relative; padding:32px 0;">
      <!-- 主线 -->
      <div style="position:absolute; left:5%; right:5%; top:50%; height:1px;
                  background:linear-gradient(to right, var(--green), var(--cyan), var(--amber), var(--pink));"></div>
      
      <!-- 4 个阶段 -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:16px;">
        
        <div class="tl-stage fade-item" style="--d:0.1s; --accent: var(--green);">
          <div class="tl-stage__year">2020</div>
          <div class="tl-stage__dot"></div>
          <div class="tl-stage__title">[阶段 1]</div>
          <div class="tl-stage__desc">[阶段 1 描述]</div>
        </div>
        <div class="tl-stage fade-item" style="--d:0.2s; --accent: var(--cyan);">
          <div class="tl-stage__year">2022</div>
          <div class="tl-stage__dot"></div>
          <div class="tl-stage__title">[阶段 2]</div>
          <div class="tl-stage__desc">[阶段 2 描述]</div>
        </div>
        <div class="tl-stage fade-item" style="--d:0.3s; --accent: var(--amber);">
          <div class="tl-stage__year">2024</div>
          <div class="tl-stage__dot"></div>
          <div class="tl-stage__title">[阶段 3]</div>
          <div class="tl-stage__desc">[阶段 3 描述]</div>
        </div>
        <div class="tl-stage fade-item" style="--d:0.4s; --accent: var(--pink);">
          <div class="tl-stage__year">2026</div>
          <div class="tl-stage__dot"></div>
          <div class="tl-stage__title">[阶段 4]</div>
          <div class="tl-stage__desc">[阶段 4 描述]</div>
        </div>
      </div>
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">git log --graph --all</span>
  </div>
</section>

<style>
  .tl-stage {
    text-align: center;
    padding: 0 8px;
  }
  .tl-stage__year {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 28px;
    color: var(--accent);
    text-shadow: 0 0 12px currentColor;
    margin-bottom: 12px;
  }
  .tl-stage__dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 12px var(--accent);
    margin: 0 auto 12px;
    position: relative; z-index: 1;
  }
  .tl-stage__title {
    font-family: var(--font-sans);
    font-weight: 700; font-size: 15px;
    margin-bottom: 6px;
  }
  .tl-stage__desc {
    font-size: 11px;
    color: var(--fg-dim);
    line-height: 1.55;
  }
</style>
```

---

## Layout 6：roadmap（路线图 · 多列瓦片 · 简化版）

**适用**：规划、后续阶段、迭代节奏。完整高级版在 [08-roadmap-tile.md](08-roadmap-tile.md)。

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>ROADMAP · [PERIOD]</span>
  </div>

  <div class="stage" style="padding:60px 80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ ROADMAP</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">
      [路线图标题]<span class="cursor"></span>
    </h1>

    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:16px;">
      
      <div class="rm-col fade-item" style="--d:0.1s;">
        <div class="rm-col__head" style="--accent: var(--cyan);">H1 · 2026</div>
        <div class="rm-col__body">
          <div class="rm-tile"><span class="rm-tile__pri pri--p0">P0</span> [事项 1]</div>
          <div class="rm-tile"><span class="rm-tile__pri pri--p1">P1</span> [事项 2]</div>
        </div>
      </div>

      <div class="rm-col fade-item" style="--d:0.2s;">
        <div class="rm-col__head" style="--accent: var(--amber);">H2 · 2026</div>
        <div class="rm-col__body">
          <div class="rm-tile"><span class="rm-tile__pri pri--p1">P1</span> [事项 3]</div>
          <div class="rm-tile"><span class="rm-tile__pri pri--p2">P2</span> [事项 4]</div>
        </div>
      </div>

      <div class="rm-col fade-item" style="--d:0.3s;">
        <div class="rm-col__head" style="--accent: var(--pink);">2027+</div>
        <div class="rm-col__body">
          <div class="rm-tile"><span class="rm-tile__pri pri--p2">P2</span> [事项 5]</div>
        </div>
      </div>
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">cat /roadmap.md</span>
  </div>
</section>

<style>
  .rm-col { background: #ffffff06; border: 1px solid var(--rule); border-radius: 2px; }
  .rm-col__head {
    padding: 10px 16px;
    font-size: 11px; letter-spacing: 0.22em;
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
    background: #ffffff0a;
  }
  .rm-col__body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
  .rm-tile {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px;
    font-size: 12px;
    background: #ffffff04;
    border-left: 2px solid var(--rule);
  }
  .rm-tile__pri {
    font-size: 9px; letter-spacing: 0.18em;
    padding: 2px 6px;
    border-radius: 1px;
  }
  .pri--p0 { background: #ff2e8820; color: var(--pink); }
  .pri--p1 { background: #ffb02020; color: var(--amber); }
  .pri--p2 { background: #5ce1ff20; color: var(--cyan); }
</style>
```

---

## Layout 7：frameworkCard（3 框架对比）

> 顶部 1 行关键 takeaway + 3 张 frameworkCard 横排，每张含 kicker + tag + title + role + "最适合" 段落 + 3 条要点。
> 对齐参考站 slide 9（OpenSpec / Spec-kit / superpowers 对比）。

**适用**：3 个并列方案/框架/产品对比，每张卡需要更多结构化信息（不适合用 3-card 时用这个）。

```html
<section class="slide" data-slide="9">
  <div class="panel">
    <!-- 顶部 kicker + 主标 -->
    <div class="part-label">PART [NN] · [LABEL] · [SUB]</div>
    <h2 class="h-title mt-2">[主标题：3 框架对比]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <!-- 上半区：截图 + decision panel（可选） -->
    <div class="top-grid">
      <div class="shot-frame">
        <div class="shot-bar"><span>[图说]</span><button>点击放大</button></div>
        <button class="shot-button" aria-label="放大"><img src="[screenshot]" alt="[screenshot desc]"></button>
      </div>
      <div class="decision-panel">
        <div class="equation-kicker">[KICKER · 客户先记住这一句]</div>
        <div class="equation-formula"><b>[公式/口号]</b></div>
        <div class="equation-hint">[解释公式含义。]</div>
        <div class="decision-stack">
          <div class="choice-row"><span>[场景 1]</span><strong>[方案 1]</strong><p>[选 1 的原因。]</p></div>
          <div class="choice-row"><span>[场景 2]</span><strong>[方案 2]</strong><p>[选 2 的原因。]</p></div>
          <div class="choice-row"><span>[场景 3]</span><strong>[方案 3]</strong><p>[选 3 的原因。]</p></div>
        </div>
      </div>
    </div>

    <!-- 下半区：3 张 frameworkCard -->
    <div class="compare-grid">
      <div class="framework-card" style="--tone: var(--cyan);">
        <div class="card-head">
          <span class="card-kicker">[TYPE 1]</span>
          <span class="card-tag">[tag 1]</span>
        </div>
        <div class="card-title">[框架 1 名]</div>
        <div class="card-role">[框架 1 的核心定位 / 一句话描述]</div>
        <div class="section-block">
          <div class="section-label">最适合</div>
          <div class="section-text">[最适合的场景 / 用户类型。]</div>
        </div>
        <ul class="point-list">
          <li>[要点 1]</li>
          <li>[要点 2]</li>
          <li>[要点 3]</li>
        </ul>
      </div>
      <div class="framework-card" style="--tone: var(--green);">
        <div class="card-head">
          <span class="card-kicker">[TYPE 2]</span>
          <span class="card-tag">[tag 2]</span>
        </div>
        <div class="card-title">[框架 2 名]</div>
        <div class="card-role">[框架 2 的核心定位]</div>
        <div class="section-block">
          <div class="section-label">最适合</div>
          <div class="section-text">[最适合的场景。]</div>
        </div>
        <ul class="point-list">
          <li>[要点 1]</li>
          <li>[要点 2]</li>
          <li>[要点 3]</li>
        </ul>
      </div>
      <div class="framework-card" style="--tone: var(--pink);">
        <div class="card-head">
          <span class="card-kicker">[TYPE 3]</span>
          <span class="card-tag">[tag 3]</span>
        </div>
        <div class="card-title">[框架 3 名]</div>
        <div class="card-role">[框架 3 的核心定位]</div>
        <div class="section-block">
          <div class="section-label">最适合</div>
          <div class="section-text">[最适合的场景。]</div>
        </div>
        <ul class="point-list">
          <li>[要点 1]</li>
          <li>[要点 2]</li>
          <li>[要点 3]</li>
        </ul>
      </div>
    </div>

    <!-- 底部 takeaway -->
    <div class="bottom-takeaway">
      <span>[MENTAL MODEL · 记住这一句]</span>
      <b>[3 框架的取舍逻辑 / 总结一句话。]</b>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 7 专属样式 ===== */
  .top-grid {
    display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 14px; align-items: stretch;
  }

  /* 截图框 + 点击放大按钮 */
  .shot-frame {
    border: 1px solid var(--rule); background: var(--bg-3);
    display: flex; flex-direction: column;
  }
  .shot-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 12px; border-bottom: 1px solid var(--rule);
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .16em; color: var(--green); text-transform: uppercase;
  }
  .shot-bar button {
    background: transparent; color: var(--cyan);
    border: 1px solid var(--cyan); cursor: pointer;
    font-family: var(--font-mono); font-size: 9.5px;
    padding: 2px 8px; letter-spacing: .12em;
  }
  .shot-button {
    background: transparent; border: 0; cursor: zoom-in;
    padding: 0; flex: 1;
  }
  .shot-button img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* decision panel（"先记住这一句"） */
  .decision-panel {
    background: linear-gradient(135deg, #060a14d6 0%, #0a1020e6 100%);
    border: 1px solid var(--rule);
    padding: 16px 18px; display: flex; flex-direction: column;
  }
  .equation-kicker {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .18em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 8px;
  }
  .equation-formula {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    font-size: 22px; color: var(--green);
    text-shadow: 0 0 12px #00ff9c66;
    padding: 10px 0; border-top: 1px dashed var(--rule); border-bottom: 1px dashed var(--rule);
  }
  .equation-hint { font-size: 11.5px; color: var(--fg-dim); line-height: 1.55; margin-top: 8px; }
  .decision-stack { display: grid; gap: 6px; margin-top: 10px; }
  .choice-row {
    display: grid; grid-template-columns: 1fr auto; gap: 6px;
    background: #060a146b; border-left: 2px solid var(--green);
    padding: 6px 10px;
  }
  .choice-row span {
    grid-column: 1 / -1;
    font-family: var(--font-mono); font-size: 9.5px;
    letter-spacing: .12em; color: var(--fg-dim); text-transform: uppercase;
  }
  .choice-row strong {
    font-family: var(--font-sans); font-weight: 700;
    color: var(--green); font-size: 13px;
  }
  .choice-row p {
    grid-column: 1 / -1;
    font-size: 10.5px; color: var(--fg); margin: 0; line-height: 1.45;
  }

  /* 3 张 frameworkCard */
  .compare-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .framework-card {
    position: relative;
    border: 1px solid var(--rule);
    background: linear-gradient(#0f1626f5, #070c18fc);
    padding: 16px;
  }
  .framework-card::before {
    content: ''; position: absolute; top: 0; left: 14px; right: 14px; height: 2px;
    background: var(--tone, var(--green));
    box-shadow: 0 0 16px var(--tone, var(--green));
  }
  .card-head {
    display: flex; justify-content: space-between; align-items: center; gap: 8px;
  }
  .card-kicker {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .14em; color: var(--tone, var(--green));
    text-transform: uppercase;
  }
  .card-tag {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: .12em;
    color: var(--bg); background: var(--tone, var(--green));
    padding: 2px 8px;
  }
  .card-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 26px; letter-spacing: -.7px; color: var(--fg);
    margin-top: 10px;
  }
  .card-role {
    font-size: var(--slide-body-sm); color: #d9e4f5c2;
    margin-top: 8px; line-height: 1.5;
  }
  .section-block {
    margin-top: 14px;
    background: #060a1475; border-left: 2px solid var(--tone, var(--green));
    padding: 8px 10px;
  }
  .section-label {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: .16em; color: var(--tone, var(--green));
    text-transform: uppercase;
  }
  .section-text {
    font-size: 11px; color: var(--fg); margin-top: 4px; line-height: 1.5;
  }
  .point-list {
    list-style: none; padding: 0; margin: 12px 0 0;
    font-size: 11.5px; color: #d9e4f5b8; line-height: 1.55;
  }
  .point-list li {
    position: relative; padding-left: 14px; margin-bottom: 6px;
  }
  .point-list li::before {
    content: "›"; position: absolute; left: 0; top: 0;
    color: var(--tone, var(--green)); font-weight: 700;
    font-family: var(--font-mono);
  }

  /* 底部 takeaway */
  .bottom-takeaway {
    display: flex; align-items: baseline; gap: 12px;
    padding: 10px 14px; margin-top: 8px;
    background: linear-gradient(90deg, #00ff9c0e, #5ce1ff09);
    border: 1px dashed #00ff9c52;
  }
  .bottom-takeaway span {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .18em; color: var(--green);
    text-transform: uppercase; flex-shrink: 0;
  }
  .bottom-takeaway b {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 14px; color: var(--fg); line-height: 1.45;
  }
</style>
```

---

## Checklist

- [ ] **window-chrome / panel / corner / footer 四件套都在**（每页必备）
- [ ] **slide-corner 内容正确**（按章节写 PART NN · LABEL）
- [ ] 卡片间距 ≥ 14px（gap）
- [ ] accent 色用 `--cyan` / `--amber` / `--pink` / `--green` 4 色循环
- [ ] 卡片标题 17px（card layout）/ 24px（big-card layout）/ 29px（step-card / framework-card）
- [ ] 至少 1 个闪烁光标（kicker 或标题末尾）
- [ ] 1440×900 视口下不溢出
- [ ] **Layout 0 必含 thesisPanel（3-col 网格）+ stepCard（带 connector）+ workflowPanel**

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| 4-card 看起来像 Bootstrap | 没有顶部 accent 条 / 等距网格 | 加 `.card__bar` + 不规则间距 |
| 3-card 第 2 张太挤 | gap 太小 | `gap: 20px` 起 |
| 2-col 左右失衡 | 5:5 分栏 | 改 5:7 或 4:8 |
| KPI 数字不突出 | 用普通字体 | Space Grotesk italic + text-shadow |
| timeline 主线看不见 | 颜色太浅 | 用 `linear-gradient` 4 色主线 + 1px |
| **Layout 0 stepCard 缺连接器** | 没用 `.connector` 元素 | 每张除最后一张加 `→` 22×22 方块 |
| **Layout 0 thesisPanel 像普通卡片** | 没用 3-col 网格 + 渐变背景 | 必须 `grid-template-columns: 225px 1fr 310px` + 三段式渐变 |
| **Layout 7 frameworkCard 缺 section-block** | 没有"最适合"独立段 | 加 `.section-block` 用 dashed border-left + tone 色 |
| **Layout 7 frameworkCard 像普通 3-card** | 没 kicker + tag + section | 必须含 kicker + tag + role + section + 3 条要点 |