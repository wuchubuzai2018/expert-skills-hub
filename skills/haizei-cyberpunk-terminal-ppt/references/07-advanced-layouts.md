# 07 · Advanced Layouts（19 种 layout）

> **19 种 layout**：8 种高频（含 commandPanel / hubRing / specCanvas / carrierPanel / shotStage / layerCard 9-grid / docCard / discussCard）+ 11 种其他场景。

> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"。

## 速查（19 种 · 按使用频率排序）

| # | Layout | 用途 | 关键样式 |
|---:|---|---|---|
| 1 | **commandPanel + dispatchMap + hubRing + laneStack** | 中心调度 + 双泳道对比 | 圆环 hub + 上下堆叠 laneCard + 4 步 loopPanel + › 列表 |
| 2 | **specCanvas + heroPanel + stepTrack + foundationBar** | 方法论主链（spec-kit 风格）| ghost 字 + positionStack + 6 步 step 链 |
| 3 | **layerCard 9-grid + intro + side thoughtPanel** | 9 层架构 + 侧栏思考 | 3×3 网格 + folder 装饰 + hl-from/to 标注 |
| 4 | **carrierPanel + terminalBox + channelGrid + updatePanel** | "在哪里 + 怎么用" 4 通道对比 | 终端 cmd/ok/bad 行 + A/B/C 通道卡 + 4 节点 flow |
| 5 | **shotStage + filmstrip** | 截图演示 + 多缩略图切换 | topbar + caption + 4 chip 缩略图列表 |
| 6 | **stagePanel (split image) + toolCompareGrid** | 双图对比 + 4 工具对比 | main+alt 双图 + rank+name+sub+tag+desc+link |
| 7 | **docCard + bridge + matrixPanel** | 两栏对比 + 中间 ≠ + 4 行矩阵 | docCard + ≠ 桥 + axis 行 |
| 8 | **heroCard + discussCard + footer open floor** | 收尾页（Q&A / 开放讨论）| hero + discuss + 双 footer |
| 9 | arch-flow | 架构图 / 数据流 | 多层 row + 连接箭头 |
| 10 | intro-typ | 中文大字 hero 引言 | 居中 + 大字号 + 装饰边框 |
| 11 | layer-stack | 9 层 / N 层堆叠 | 横线分隔 + 层级编号 |
| 12 | loop-evo | 循环 / 演进 | 4 段 + 脉冲 |
| 13 | repo-tree | 仓库目录树 | monospace + 树状缩进 |
| 14 | yaml-code | YAML / 配置代码块 | 等宽 + 4 色语法高亮 |
| 15 | spectrum-page | 全宽 spectrum 大图 | 24 段 + ticks + 状态点 |
| 16 | note-card-page | 大 note-card 多块 | 4 个并列 note-card |
| 17 | harness-table | 表格 / Harness 配置 | 表头 + 多行 + 状态色 |
| 18 | quadrant | 2×2 四象限 | x/y 轴 + 4 区域 |
| 19 | mode-stack | 模式对比 / 错位堆叠 | 多个列表错位重叠 |

> 11 种基础 layout 的代码保留在本文件后半部分（不破坏，向后兼容）。

---

# 8 种高频 layout

---

# 8 种高频 layout

---

## 1. commandPanel + dispatchMap + hubRing + laneStack（中心调度 · 对齐 slide 5）

**适用**：表达"AI / 系统作为调度中枢，把任务分发给不同角色"的场景。  
**关键元素**：
- 顶部 1 条 `commandPanel`：浅绿渐变 + `prompt` + `<b>` 主张 + `<p>` 解释
- 中部 `dispatchMap`：3 列网格（左 intake 列表 + 中 hubRing 圆环 + 右 laneStack 2 行 laneCard）
- 底部 2 列：loopPanel（4 步循环）+ governancePanel（3 条 › 列表）

```html
<section class="slide" data-slide="5">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL] · [SUB]</div>
    <h2 class="h-title mt-2">[主标：以 <span class="accent">[accent]</span> 做[动作]]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <div class="stage-grid">
      <!-- 顶部 commandPanel -->
      <div class="command-panel">
        <span class="cmd-prompt">$ [module].dispatch --mode=[mode] --contract=[contract]</span>
        <b>[一句话主张：AI 不只是 [旧角色]，而是 [新角色]。</b>
        <p>[3 行解释这个新角色的工作方式、读什么、判断什么、分发给谁。]</p>
      </div>

      <!-- 中部 dispatchMap：3 列 -->
      <div class="dispatch-map">
        <!-- 左：intakePanel（带斜纹填充） -->
        <div class="intake-panel">
          <div class="panel-kicker">[WORK INTAKE]</div>
          <div class="panel-title">[需求池 / 事件流 / 变更单]</div>
          <ul>
            <li>[来源 1 进入统一上下文]</li>
            <li>[来源 2 先读规约再派给谁]</li>
            <li>[每次执行都留下可审计记录]</li>
          </ul>
        </div>

        <!-- 中：aiHub（圆环 + 双 dashed border） -->
        <div class="ai-hub">
          <div class="hub-ring">
            <span>[CENTER LABEL]</span>
            <strong>[任务分发器]</strong>
            <em>[context · policy · routing]</em>
          </div>
        </div>

        <!-- 右：laneStack（2 行 laneCard） -->
        <div class="lane-stack">
          <div class="lane-card" style="--tone: var(--green);">
            <div class="lane-head"><span>[ID 1]</span><b>[角色 1 名]</b></div>
            <div class="lane-role">[角色 1 定位]</div>
            <div class="node-grid">
              <i>[节点 1]</i><i>[节点 2]</i><i>[节点 3]</i><i>[节点 4]</i>
            </div>
            <p>[角色 1 适合什么任务。]</p>
          </div>
          <div class="lane-card" style="--tone: var(--cyan);">
            <div class="lane-head"><span>[ID 2]</span><b>[角色 2 名]</b></div>
            <div class="lane-role">[角色 2 定位]</div>
            <div class="node-grid">
              <i>[节点 1]</i><i>[节点 2]</i><i>[节点 3]</i><i>[节点 4]</i>
            </div>
            <p>[角色 2 适合什么任务。]</p>
          </div>
        </div>
      </div>

      <!-- 底部 2 列：loopPanel + governancePanel -->
      <div class="bottom-grid">
        <div class="loop-panel">
          <div class="panel-kicker">[CONTROL LOOP]</div>
          <div class="loop-steps">
            <div class="loop-step"><span>[STEP]</span><b>01</b><p>[step 1 说明]</p></div>
            <div class="loop-step"><span>[STEP]</span><b>02</b><p>[step 2 说明]</p></div>
            <div class="loop-step"><span>[STEP]</span><b>03</b><p>[step 3 说明]</p></div>
            <div class="loop-step"><span>[STEP]</span><b>04</b><p>[step 4 说明]</p></div>
          </div>
        </div>
        <div class="governance-panel">
          <div class="panel-kicker">[WHY SDD STILL MATTERS]</div>
          <ul>
            <li>[SDD 作为任务契约：每个任务都能追溯到 spec / plan / tasks。]</li>
            <li>[AI 中心不是替代管理者，而是把排队、分发、检查变成系统能力。]</li>
            <li>[Teams 的价值在于混合编队：数字员工跑吞吐，自然人做判断。]</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 1 专属样式 ===== */
  .stage-grid {
    flex: 1;
    display: grid;
    grid-template-rows: auto minmax(0, 1.18fr) auto;
    gap: 12px; min-height: 0; margin-top: 14px;
  }

  /* commandPanel：顶部一句话主张 */
  .command-panel {
    background: linear-gradient(90deg, #00ff9c14, #5ce1ff09, #ff2e880b), #060a14d6;
    border: 1px solid #00ff9c47;
    display: grid; grid-template-columns: 345px minmax(0, 1fr);
    align-items: center; gap: 18px;
    padding: 16px 18px;
  }
  .cmd-prompt {
    grid-column: 1 / -1;
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--green);
  }
  .command-panel b {
    grid-column: 1 / -1;
    color: var(--fg); font-size: 24px; line-height: 1.22;
  }
  .command-panel p {
    grid-column: 1 / -1;
    font-size: var(--slide-lead); color: #d9e4f5c2;
    margin: 0; line-height: 1.58;
  }

  /* dispatchMap：3 列网格 */
  .dispatch-map {
    display: grid;
    grid-template-columns: 320px minmax(260px, .9fr) minmax(0, 1.18fr);
    align-items: stretch; gap: 14px; min-height: 0;
  }
  .intake-panel, .loop-panel, .governance-panel, .lane-card {
    border: 1px solid var(--rule);
    background: linear-gradient(#0f1626f5, #070c18fc);
    box-shadow: inset 0 0 0 1px #d9e4f508;
  }
  .intake-panel {
    padding: 18px; position: relative; overflow: hidden;
  }
  .intake-panel::after {
    content: ''; position: absolute; inset: auto 14px 14px; height: 78px;
    opacity: .9;
    background-image: repeating-linear-gradient(135deg, #5ce1ff14 0 8px, transparent 8px 16px);
    border: 1px dashed #5ce1ff3d;
  }
  .panel-kicker {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--amber);
  }
  .panel-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 28px; letter-spacing: -.7px;
    color: var(--fg); margin-top: 14px; line-height: 1.12;
  }
  .intake-panel ul, .governance-panel ul {
    list-style: none; padding: 0;
    display: grid; gap: 9px; margin: 14px 0 0;
  }
  .intake-panel li, .governance-panel li {
    position: relative; padding-left: 16px;
    font-size: var(--slide-body); color: #d9e4f5c2; line-height: 1.52;
  }
  .intake-panel li::before, .governance-panel li::before {
    content: "›"; position: absolute; left: 0; top: 0;
    color: var(--green); font-family: var(--font-mono); font-weight: 700;
  }

  /* aiHub：圆环 + 双 dashed 内圈 */
  .ai-hub {
    background: radial-gradient(circle, #00ff9c2e, transparent 42%),
                radial-gradient(circle, #5ce1ff17, transparent 62%),
                #020610e0;
    border: 1px solid #00ff9c4d;
    display: grid; place-items: center; position: relative; overflow: hidden;
  }
  .ai-hub::before, .ai-hub::after {
    content: ''; position: absolute; inset: 34px;
    border: 1px dashed #00ff9c47;
    transform: rotate(12deg);
  }
  .ai-hub::after { inset: 64px; border-color: #5ce1ff3d; transform: rotate(-16deg); }
  .hub-ring {
    z-index: 1;
    background: radial-gradient(circle, #00ff9c29, #060a14f0 66%), var(--bg);
    text-align: center;
    border: 1px solid #00ff9c73;
    border-radius: 999px;
    width: 230px; height: 230px;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    gap: 8px;
    box-shadow: 0 0 44px #00ff9c2e, inset 0 0 28px #00ff9c14;
  }
  .hub-ring span {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: .2em; text-transform: uppercase;
    color: var(--green);
  }
  .hub-ring strong {
    color: var(--fg); font-size: 36px; line-height: 1;
  }
  .hub-ring em {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: .12em; color: var(--fg-dim);
    font-style: normal; text-transform: uppercase;
  }

  /* laneStack：上下 2 张 laneCard */
  .lane-stack {
    display: grid; grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 12px; min-height: 0;
  }
  .lane-card {
    padding: 14px; position: relative; overflow: hidden;
  }
  .lane-card::before {
    content: ''; position: absolute; top: 0; left: 14px; right: 14px; height: 2px;
    background: var(--tone, var(--green));
    box-shadow: 0 0 16px var(--tone, var(--green));
  }
  .lane-head {
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .15em; text-transform: uppercase;
  }
  .lane-head span { color: var(--tone, var(--green)); }
  .lane-head b { color: var(--fg); }
  .lane-role {
    color: var(--fg);
    margin-top: 8px;
    font-family: var(--font-sans); font-weight: 800;
    font-size: 20px; line-height: 1.24;
  }
  .node-grid {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 7px; margin-top: 11px;
  }
  .node-grid i {
    display: grid; place-items: center;
    min-height: 36px; padding: 0 5px;
    font-style: normal;
    font-family: var(--font-mono); font-size: var(--slide-body-xs);
    letter-spacing: .06em;
    color: var(--tone, var(--green));
    text-align: center;
    background: #060a1485; border: 1px solid #6b7a9947;
    line-height: 1.22;
  }
  .lane-card p {
    font-size: var(--slide-body); color: #d9e4f5bd;
    margin: 10px 0 0; line-height: 1.46;
  }

  /* 底部 2 列 */
  .bottom-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.36fr) minmax(0, .84fr);
    gap: 14px;
  }
  .loop-panel, .governance-panel { padding: 13px 14px; }
  .loop-steps {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 9px; margin-top: 10px;
  }
  .loop-step {
    background: #060a1475; border: 1px solid #6b7a993d;
    padding: 9px;
  }
  .loop-step span {
    display: block;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .12em; color: var(--fg-dim); text-transform: uppercase;
  }
  .loop-step b {
    display: block;
    color: var(--green); margin-top: 5px;
    font-family: var(--font-mono); font-size: 21px;
  }
  .loop-step p {
    font-size: 11px; color: var(--fg); margin: 6px 0 0; line-height: 1.45;
  }
</style>
```

---

## 2. specCanvas + heroPanel + stepTrack + foundationBar（方法论主链 · 对齐 slide 10）

**适用**：表达"feature / 流程 / 主链"的标准化方法论。  
**关键元素**：
- 顶部 heroPanel（含 ghost 背景大字 "METHOD"）+ 右侧 positionStack（3 张 cyan/green/amber 小卡）
- 底部 flowPanel：foundationBar（顶部）+ stepTrack（6 步）+ closureBar（底部）

```html
<section class="slide" data-slide="10">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL] · [SUB]</div>
    <h2 class="h-title mt-2">[主标：[方法名] · [一句话定性]]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <div class="spec-canvas">

      <!-- 顶部 2 列：heroPanel + positionStack -->
      <div class="top-grid">
        <!-- heroPanel：含 ghost 背景大字 -->
        <div class="hero-panel">
          <div class="hero-ghost">[GHOST]</div>
          <div class="hero-kicker">[KICKER]</div>
          <div class="hero-headline">[方法名] 把一个 <span class="hero-key">[feature]</span><br>从 [旧状态]，推进成 [新状态]。</div>
          <p class="hero-text">[3 行解释这套方法的核心价值。]</p>
          <div class="hero-equation">
            <span>[unit]</span>
            <i>=</i>
            <b>[step1] → [step2] → [step3] → [step4] → [step5] → [step6]</b>
          </div>
          <div class="hero-foot">
            foundation by <code>/[constitution]</code> · preflight by <code>/[analyze]</code>
          </div>
        </div>

        <!-- positionStack：3 张 cyan/green/amber 小卡 -->
        <div class="position-stack">
          <div class="position-card" style="--tone: var(--cyan);">
            <div class="position-kicker">[KICKER 1]</div>
            <div class="position-title">[标题 1]</div>
            <div class="position-body">[2-3 行说明 1]</div>
          </div>
          <div class="position-card" style="--tone: var(--green);">
            <div class="position-kicker">[KICKER 2]</div>
            <div class="position-title">[标题 2]</div>
            <div class="position-body">[2-3 行说明 2]</div>
          </div>
          <div class="position-card" style="--tone: var(--amber);">
            <div class="position-kicker">[KICKER 3]</div>
            <div class="position-title">[标题 3]</div>
            <div class="position-body">[2-3 行说明 3]</div>
          </div>
        </div>
      </div>

      <!-- 底部 flowPanel -->
      <div class="flow-panel">
        <div class="flow-header">
          <div>
            <div class="flow-kicker">[FLOW · MAIN CHAIN]</div>
            <div class="flow-title">[一句话描述这个 feature 从共识到落地的标准主链]</div>
          </div>
          <div class="flow-meta">[meta · documents first · agent second]</div>
        </div>

        <!-- foundationBar：顶部入口 -->
        <div class="foundation-bar">
          <span class="foundation-label">[FOUNDATION]</span>
          <code>/[constitution]</code>
          <b>[基础说明：]</b>
          <span>[一句话解释 constitution 的作用。]</span>
        </div>

        <!-- stepTrack：6 步横向卡片 -->
        <div class="step-track">
          <div class="step-card-spec" style="--tone: var(--cyan);">
            <div class="step-topline"><span>01</span><code>/[step1]</code></div>
            <div class="step-label">[step 1 标题]</div>
            <div class="step-desc">[step 1 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div><button>复制提示词</button></div>
          </div>
          <div class="step-card-spec" style="--tone: var(--cyan);">
            <div class="step-topline"><span>02</span><code>/[step2]</code></div>
            <div class="step-label">[step 2 标题]</div>
            <div class="step-desc">[step 2 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div></div>
          </div>
          <div class="step-card-spec" style="--tone: var(--green);">
            <div class="step-topline"><span>03</span><code>/[step3]</code></div>
            <div class="step-label">[step 3 标题]</div>
            <div class="step-desc">[step 3 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div></div>
          </div>
          <div class="step-card-spec" style="--tone: var(--green);">
            <div class="step-topline"><span>04</span><code>/[step4]</code></div>
            <div class="step-label">[step 4 标题]</div>
            <div class="step-desc">[step 4 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div></div>
          </div>
          <div class="step-card-spec" style="--tone: var(--amber);">
            <div class="step-topline"><span>05</span><code>/[step5]</code></div>
            <div class="step-label">[step 5 标题]</div>
            <div class="step-desc">[step 5 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div></div>
          </div>
          <div class="step-card-spec" style="--tone: var(--amber);">
            <div class="step-topline"><span>06</span><code>/[step6]</code></div>
            <div class="step-label">[step 6 标题]</div>
            <div class="step-desc">[step 6 描述]</div>
            <div class="step-foot"><div class="step-output">[Output]</div></div>
          </div>
        </div>

        <!-- closureBar：底部闸口 -->
        <div class="closure-bar">
          <span class="closure-label">[PREFLIGHT GATE]</span>
          <code>/[analyze]</code>
          <b>[闸口说明：]</b>
          <span>[闸口的作用/规则。]</span>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 2 专属样式 ===== */
  .spec-canvas {
    flex: 1;
    display: grid; grid-template-rows: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 12px; min-height: 0; margin-top: 14px;
  }

  /* top-grid：heroPanel + positionStack */
  .top-grid {
    display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    gap: 12px; min-height: 0;
  }

  /* heroPanel：含 ghost 大字 + headline + equation */
  .hero-panel {
    background: #060a14d6;
    border: 1px solid #00ff9c47;
    padding: 24px 26px;
    position: relative; overflow: hidden;
  }
  .hero-ghost {
    position: absolute; right: 24px; top: 18px;
    font-family: var(--font-display); font-style: italic; font-weight: 700;
    font-size: 96px; color: #ffffff08;
    letter-spacing: 4px;
    pointer-events: none;
  }
  .hero-kicker {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--amber); position: relative; z-index: 1;
  }
  .hero-headline {
    position: relative; z-index: 1;
    font-family: var(--font-sans); font-weight: 700;
    font-size: 26px; line-height: 1.32; letter-spacing: -.5px;
    color: var(--fg);
    margin-top: 10px;
  }
  .hero-key { color: var(--green); text-shadow: 0 0 12px rgba(0,255,156,.5); font-family: var(--font-display); font-style: italic; }
  .hero-text {
    position: relative; z-index: 1;
    font-size: 13px; color: var(--fg-dim); line-height: 1.65;
    margin-top: 14px;
  }
  .hero-equation {
    position: relative; z-index: 1;
    margin-top: 18px;
    display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px;
    background: #060a1475; border: 1px dashed #00ff9c47;
    padding: 10px 14px;
  }
  .hero-equation span {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    color: var(--green); font-size: 14px;
  }
  .hero-equation i { color: var(--fg-mute); font-style: normal; }
  .hero-equation b {
    font-family: var(--font-mono); font-weight: 600;
    font-size: 13px; color: var(--fg);
  }
  .hero-foot {
    position: relative; z-index: 1;
    margin-top: 10px;
    font-size: 11px; color: var(--fg-dim);
    font-family: var(--font-mono);
  }
  .hero-foot code {
    color: var(--cyan); background: #060a14; border: 1px solid var(--rule);
    padding: 1px 6px; font-size: 11px;
  }

  /* positionStack：3 张 cyan/green/amber 卡 */
  .position-stack {
    display: grid; grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 10px; min-height: 0;
  }
  .position-card {
    border: 1px solid var(--rule);
    background: #060a14d1;
    padding: 12px 14px;
    position: relative; overflow: hidden;
  }
  .position-card::before {
    content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px;
    background: var(--tone, var(--cyan));
    box-shadow: 0 0 8px var(--tone, var(--cyan));
  }
  .position-kicker {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--tone, var(--cyan));
  }
  .position-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 17px; letter-spacing: -.3px;
    color: var(--fg); margin-top: 4px;
  }
  .position-body {
    font-size: 12px; color: var(--fg-dim);
    margin-top: 6px; line-height: 1.5;
  }

  /* flowPanel：底部大块 */
  .flow-panel {
    background: #060a14d6; border: 1px solid var(--rule);
    padding: 13px 16px;
    display: flex; flex-direction: column; gap: 10px;
    min-height: 0;
  }
  .flow-header {
    display: flex; justify-content: space-between; align-items: baseline; gap: 18px;
    padding-bottom: 8px; border-bottom: 1px dashed #6b7a9952;
  }
  .flow-kicker {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--green);
  }
  .flow-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 18px; color: var(--fg);
    margin-top: 4px;
  }
  .flow-meta {
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .12em; color: var(--fg-dim);
    text-transform: uppercase;
  }

  /* foundationBar + closureBar：上下闸口 */
  .foundation-bar, .closure-bar {
    display: flex; align-items: center; gap: 10px;
    background: linear-gradient(90deg, #00ff9c0e, transparent);
    border: 1px solid #00ff9c47;
    padding: 9px 12px;
    font-size: 11.5px;
  }
  .closure-bar {
    background: linear-gradient(90deg, #ffb0200e, transparent);
    border-color: #ffb0204d;
  }
  .foundation-label, .closure-label {
    font-family: var(--font-mono); font-size: 9.5px;
    letter-spacing: .18em; text-transform: uppercase;
    color: var(--green); flex-shrink: 0;
  }
  .closure-label { color: var(--amber); }
  .foundation-bar code, .closure-bar code {
    color: var(--green); background: #060a14;
    border: 1px solid #00ff9c66;
    padding: 1px 8px; font-size: 11px;
    font-family: var(--font-mono);
  }
  .closure-bar code { color: var(--amber); border-color: #ffb02066; }
  .foundation-bar b, .closure-bar b {
    color: var(--fg); font-weight: 700;
    font-family: var(--font-mono); font-size: 11.5px;
  }
  .foundation-bar span, .closure-bar span {
    color: var(--fg-dim); font-family: var(--font-mono);
  }

  /* stepTrack：6 步横向卡片 */
  .step-track {
    display: grid; grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
  }
  .step-card-spec {
    background: #060a14d6;
    border: 1px solid var(--rule);
    padding: 10px 11px;
    position: relative;
  }
  .step-card-spec::before {
    content: ''; position: absolute; top: 0; left: 8px; right: 8px; height: 2px;
    background: var(--tone, var(--cyan));
    box-shadow: 0 0 12px var(--tone, var(--cyan));
  }
  .step-topline {
    display: flex; align-items: baseline; justify-content: space-between;
    font-family: var(--font-mono); font-size: 9.5px;
  }
  .step-topline span {
    color: var(--tone, var(--cyan)); font-weight: 700;
    letter-spacing: .12em;
  }
  .step-topline code {
    color: var(--tone, var(--cyan));
    font-family: var(--font-mono); font-size: 10px;
  }
  .step-label {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 12.5px; color: var(--fg); margin-top: 6px;
  }
  .step-desc {
    font-size: 10.5px; color: var(--fg-dim); line-height: 1.45;
    margin-top: 4px;
  }
  .step-foot {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 8px;
  }
  .step-output {
    font-family: var(--font-mono); font-size: 9px;
    color: var(--tone, var(--cyan)); letter-spacing: .12em;
    background: #060a14; border: 1px solid var(--rule);
    padding: 1px 6px;
  }
  .step-foot button {
    background: transparent; color: var(--green);
    border: 1px solid var(--green); cursor: pointer;
    font-family: var(--font-mono); font-size: 9px;
    padding: 2px 7px; letter-spacing: .12em;
  }
</style>
```

---

## 3. layerCard 9-grid + intro + side thoughtPanel（9 层架构 · 对齐 slide 17）

**适用**：表达"N 层架构 / 体系 / 框架"的页面，主区 3×3 网格 + 侧栏"核心思想"。

```html
<section class="slide" data-slide="17">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL]</div>
    <h2 class="h-title mt-2">[主标：[架构名] · <span class="accent">[一句话定性]</span>]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <!-- 顶部 intro：3 行"echo / main / core-question" -->
    <div class="intro-block">
      <div class="intro-lines">
        <span class="echo">$ cat [file].md</span>
        <span class="main">[一句话定义这个架构是什么、不是某个工具、也不是某条技巧，而是一整套 <strong>[关键词]</strong>。]</span>
        <span class="core-question">核心命题：怎么把 [旧角色] 变成 <strong>[可约束、可协作、可校验、可持续维护]</strong> 的 [新角色]。</span>
      </div>
      <div class="keywords-row">
        <div class="keyword-chip"><span class="keyword-word">[关键词 1]</span><span class="keyword-desc">[关键词 1 解释]</span></div>
        <div class="keyword-chip"><span class="keyword-word">[关键词 2]</span><span class="keyword-desc">[关键词 2 解释]</span></div>
        <div class="keyword-chip"><span class="keyword-word">[关键词 3]</span><span class="keyword-desc">[关键词 3 解释]</span></div>
      </div>
    </div>

    <!-- 主区：左 mainGrid（9-card）+ 右 sideCol（thoughtPanel） -->
    <div class="main-grid">
      <section class="stack-panel">
        <div class="panel-head">
          <span class="panel-kicker">[N LAYERS · [NN] 层]</span>
          <span class="panel-meta">[meta · 单独看都不稀奇，组合起来才是工程系统]</span>
        </div>
        <div class="layer-grid">
          <!-- 9 张 layerCard，用 accent 循环 -->
          <article class="layer-card" style="--tone: var(--cyan);">
            <div class="layer-top"><span class="layer-idx">01</span><span class="layer-title">[层名 1]</span><span class="layer-sub">[SUB]</span></div>
            <div class="layer-desc">[层 1 描述]</div>
            <div class="layer-bottom"><div class="folder-wrap"><div class="folder" style="--folder-color: #6BA8BD; --folder-back-color: #629AAD;"><div class="folder__back"><div class="paper paper-1"></div><div class="paper paper-2"></div><div class="paper paper-3"></div><div class="folder__front"></div><div class="folder__front right"></div></div></div></div><div class="layer-mapped">↗ [映射到哪]</div></div>
          </article>
          <!-- 8 张类似，省略 -->
        </div>
      </section>

      <aside class="side-col">
        <div class="thought-panel">
          <div class="panel-head">
            <span class="panel-kicker">[CORE IDEA]</span>
            <span class="panel-meta">[meta · 一句话定性]</span>
          </div>
          <div class="thought-body">
            <section class="thought-section">
              <h3 class="thought-title">[小标题 1]</h3>
              <p class="thought-text">[段落 1，可使用 <span class="hl-key">"key"</span> 标注关键 / <span class="hl-from">"旧"</span> → <span class="hl-to">"新"</span> 突出迁移逻辑。]</p>
            </section>
            <section class="thought-section">
              <h3 class="thought-title">[小标题 2 · N 层]</h3>
              <div class="layer-list">
                <div class="layer-list-item"><div class="layer-list-title">[层 1 名]</div><div class="layer-list-desc">[层 1 解释]</div></div>
                <!-- N 个类似 -->
              </div>
            </section>
            <section class="thought-section">
              <h3 class="thought-title">[小标题 3]</h3>
              <p class="thought-text">[段落 3，可使用 <span class="hl-key">[关键词]</span> 高亮。]</p>
            </section>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 3 专属样式 ===== */
  .intro-block {
    background: linear-gradient(90deg, #060a14d6, #0a1020e6);
    border: 1px solid var(--rule);
    padding: 16px 20px;
  }
  .intro-lines {
    display: flex; flex-direction: column; gap: 8px;
    font-family: var(--font-mono); font-size: 13.5px;
  }
  .echo         { color: var(--green); letter-spacing: .1em; }
  .main         { color: var(--fg); line-height: 1.5; }
  .core-question{ color: var(--fg-dim); line-height: 1.5; }
  .keywords-row {
    display: flex; gap: 10px; margin-top: 12px;
  }
  .keyword-chip {
    flex: 1;
    background: #060a146b; border: 1px solid #6b7a993d;
    padding: 8px 12px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .keyword-word {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 14px; color: var(--green);
  }
  .keyword-desc {
    font-size: 10.5px; color: var(--fg-dim); line-height: 1.45;
  }

  .main-grid {
    flex: 1; min-height: 0; margin-top: 14px;
    display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 14px;
  }
  .stack-panel, .side-col, .thought-panel {
    display: flex; flex-direction: column; min-height: 0;
  }
  .panel-head {
    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
    margin-bottom: 10px;
    padding-bottom: 8px; border-bottom: 1px dashed #6b7a9952;
  }
  .panel-meta {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .12em; color: var(--fg-dim);
  }

  .layer-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .layer-card {
    background: #060a14d6;
    border: 1px solid var(--rule);
    padding: 12px 13px;
    position: relative;
  }
  .layer-card::before {
    content: ''; position: absolute; top: 0; left: 10px; right: 10px; height: 2px;
    background: var(--tone, var(--cyan));
    box-shadow: 0 0 12px var(--tone, var(--cyan));
  }
  .layer-top { display: flex; align-items: baseline; gap: 6px; }
  .layer-idx {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--tone, var(--cyan)); font-weight: 700;
  }
  .layer-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 14px; color: var(--fg);
  }
  .layer-sub {
    font-family: var(--font-mono); font-size: 9px;
    color: var(--fg-dim); letter-spacing: .14em;
    text-transform: uppercase; margin-left: auto;
  }
  .layer-desc {
    font-size: 10.5px; color: var(--fg-dim); line-height: 1.5;
    margin-top: 8px;
  }
  .layer-bottom {
    margin-top: 10px;
    display: flex; align-items: center; gap: 8px;
  }
  .folder-wrap { width: 36px; height: 24px; overflow: hidden; }
  .folder { width: 60px; height: 50px; transform: scale(.35); transform-origin: left top; position: relative; }
  .folder__back, .folder__front {
    position: absolute; inset: 0;
    background: var(--folder-color, #6BA8BD);
  }
  .folder__back { background: var(--folder-back-color, #629AAD); }
  .folder__front { background: var(--folder-color, #6BA8BD); }
  .folder__front.right { right: 0; left: auto; width: 50%; background: var(--folder-back-color, #629AAD); }
  .paper { position: absolute; width: 90%; height: 30%; left: 5%; background: var(--paper-1, #E5E5E5); }
  .paper-1 { top: 10%; background: var(--paper-1, #E5E5E5); }
  .paper-2 { top: 35%; background: var(--paper-2, #F2F2F2); }
  .paper-3 { top: 60%; background: var(--paper-3, #ffffff); }
  .layer-mapped {
    font-family: var(--font-mono); font-size: 9.5px;
    color: var(--fg); letter-spacing: .08em;
  }

  /* thoughtPanel */
  .thought-panel {
    background: #0a1020e6; border: 1px solid var(--rule);
    padding: 14px;
  }
  .thought-body {
    display: flex; flex-direction: column; gap: 12px;
    overflow-y: auto; max-height: 100%;
  }
  .thought-section {
    border-left: 2px solid var(--green);
    padding-left: 10px;
  }
  .thought-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 14px; color: var(--cyan); margin-bottom: 6px;
  }
  .thought-text {
    font-size: 11.5px; color: var(--fg); line-height: 1.55; margin: 4px 0;
  }
  .hl-key  { color: var(--green); text-shadow: 0 0 8px #00ff9c66; }
  .hl-from {
    color: var(--pink);
    text-decoration: line-through;
    text-decoration-color: var(--fg-mute);
  }
  .hl-to { color: var(--green); font-weight: 700; }

  .layer-list { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
  .layer-list-item {
    background: #060a146b; border-left: 2px solid var(--green);
    padding: 6px 10px;
  }
  .layer-list-title {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--green); font-weight: 700;
  }
  .layer-list-desc {
    font-size: 11px; color: var(--fg-dim); line-height: 1.45; margin-top: 2px;
  }
</style>
```

> **注**：folder 是参考站自带的 CSS 动画装饰（用 CSS 画出"文件夹"图标）。如不需要，可删除 `.layer-bottom` 里的 `.folder-wrap`。

---

## 4. carrierPanel + terminalBox + channelGrid + updatePanel（"在哪里 + 怎么用" · 对齐 slide 12）

**适用**：表达"载体形态 / 4 种用法 / 流程节点"的页面。  
**关键元素**：
- 顶部 carrierPanel（含 carrierHead + carrierLink + terminalBox 的 ✓/✗ 行）
- 中部 channelGrid：3 张 channelCard（A/B/C 不同颜色），含 channelCmd + promptPreview + 4 条列表
- 底部 updatePanel：4 节点 flow（updateNode 横向排列）

```html
<section class="slide" data-slide="12">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL] · [SUB]</div>
    <h2 class="h-title mt-2">[主标：[问题]该放<span class="accent">哪里</span>，开发时<span class="accent">怎么引用</span>]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <!-- 顶部 carrierPanel -->
    <div class="carrier-panel">
      <div class="carrier-head">
        <span class="carrier-kicker">[CARRIER · 载体形态]</span>
        <span class="carrier-meta">[git is the source of truth · everything else is a view]</span>
      </div>
      <a class="carrier-link" href="[URL]" target="_blank">点击跳链：[URL]</a>
      <div class="terminal-box">
        <div class="term-line term-cmd">$ [question] ?</div>
        <div class="term-line term-ok">✓ [✓ 行 1：推荐做法 + 理由]</div>
        <div class="term-line term-ok">✓ [✓ 行 2]</div>
        <div class="term-line term-ok">✓ [✓ 行 3]</div>
        <div class="term-line term-bad">✗ [✗ 行 1：不可执行 / 不可校验 / AI 读不到]</div>
        <div class="term-line term-bad">✗ [✗ 行 2]</div>
      </div>
    </div>

    <!-- 中部 channelGrid：3 通道 A/B/C -->
    <div class="channel-grid">
      <!-- A：主推（绿色 + dashed border） -->
      <div class="channel-card ch-green channel-featured">
        <div class="channel-head">
          <span class="channel-tag">A</span>
          <div class="channel-title-box">
            <div class="channel-title">[通道 A 名]</div>
            <div class="channel-sub">[通道 A 副标]</div>
          </div>
        </div>
        <div class="channel-bullet">解决「[A 解决的问题]」</div>
        <div class="channel-cmd-wrap">
          <div class="channel-cmd">/[cmd-args] init --profile [profile] --rules [rules] --version [v]</div>
          <button>复制 Prompt</button>
        </div>
        <div class="prompt-preview">
          <div class="prompt-preview-line"><span>01</span>[步骤 1]</div>
          <div class="prompt-preview-line"><span>02</span>[步骤 2]</div>
          <div class="prompt-preview-line"><span>03</span>[步骤 3]</div>
          <div class="prompt-preview-line"><span>04</span>[步骤 4]</div>
        </div>
        <ul class="channel-list">
          <li>[说明 1]</li>
          <li>[说明 2]</li>
          <li>[说明 3]</li>
          <li>[说明 4]</li>
        </ul>
      </div>

      <!-- B：辅助（琥珀色） -->
      <div class="channel-card ch-amber">
        <div class="channel-head">
          <span class="channel-tag">B</span>
          <div class="channel-title-box">
            <div class="channel-title">[通道 B 名]</div>
            <div class="channel-sub">[通道 B 副标]</div>
          </div>
        </div>
        <div class="channel-bullet">解决「[B 解决的问题]」</div>
        <div class="channel-cmd-wrap">
          <div class="channel-cmd">mcp://[path]/lookup?topic=[topic]</div>
        </div>
        <ul class="channel-list">
          <li>[说明 1]</li>
          <li>[说明 2]</li>
          <li>[说明 3]</li>
          <li>[说明 4]</li>
        </ul>
      </div>

      <!-- C：运行时校验（粉色） -->
      <div class="channel-card ch-pink">
        <div class="channel-head">
          <span class="channel-tag">C</span>
          <div class="channel-title-box">
            <div class="channel-title">[通道 C 名]</div>
            <div class="channel-sub">[通道 C 副标]</div>
          </div>
        </div>
        <div class="channel-bullet">解决「[C 解决的问题]」</div>
        <div class="channel-cmd-wrap">
          <div class="channel-cmd">pull_request.target → standards-check --fail-on MUST</div>
        </div>
        <div class="prompt-preview cnb-preview">
          <div class="prompt-preview-line"><span>01</span>[配置 1]</div>
          <div class="prompt-preview-line"><span>02</span>[配置 2]</div>
          <div class="prompt-preview-line"><span>03</span>[配置 3]</div>
          <div class="prompt-preview-line"><span>04</span>[配置 4]</div>
        </div>
        <ul class="channel-list">
          <li>[说明 1]</li>
          <li>[说明 2]</li>
          <li>[说明 3]</li>
          <li>[说明 4]</li>
        </ul>
      </div>
    </div>

    <!-- 底部 updatePanel：4 节点 flow -->
    <div class="update-panel">
      <div class="update-head">
        <span class="update-kicker">[DEMO · 流程]</span>
        <span class="update-meta">[meta · version-1 · 标准化]</span>
      </div>
      <div class="update-flow">
        <div class="update-node"><span class="update-k">[STEP 1]</span><span class="update-v">[节点 1]</span><span class="update-arrow">→</span></div>
        <div class="update-node"><span class="update-k">[STEP 2]</span><span class="update-v">[节点 2]</span><span class="update-arrow">→</span></div>
        <div class="update-node"><span class="update-k">[STEP 3]</span><span class="update-v">[节点 3]</span><span class="update-arrow">→</span></div>
        <div class="update-node"><span class="update-k">[STEP 4]</span><span class="update-v">[节点 4]</span></div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 4 专属样式 ===== */

  /* carrierPanel：顶部载体形态 */
  .carrier-panel {
    background: #060a14d6; border: 1px solid var(--rule);
    padding: 13px 16px;
  }
  .carrier-head {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-bottom: 8px; border-bottom: 1px dashed #6b7a9952;
  }
  .carrier-kicker {
    font-family: var(--font-mono); font-size: 11px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--green);
  }
  .carrier-meta {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim); letter-spacing: .12em;
  }
  .carrier-link {
    display: inline-block; margin-top: 8px;
    padding: 4px 10px;
    border: 1px solid var(--cyan); color: var(--cyan);
    font-family: var(--font-mono); font-size: 11px;
    text-decoration: none; letter-spacing: .08em;
  }

  /* terminalBox：✓/✗ 行 */
  .terminal-box {
    margin-top: 10px;
    background: #020610ec;
    border: 1px solid var(--rule);
    padding: 10px 14px;
    font-family: var(--font-mono); font-size: 12px;
    line-height: 1.75;
  }
  .term-line { color: var(--fg-dim); }
  .term-cmd  { color: var(--amber); }
  .term-ok   { color: var(--green); }
  .term-bad  { color: var(--pink); text-decoration: line-through; text-decoration-color: var(--fg-mute); }

  /* channelGrid：3 通道 A/B/C */
  .channel-grid {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px; margin-top: 12px;
  }
  .channel-card {
    border: 1px solid var(--rule);
    background: #060a14d6;
    padding: 14px;
    position: relative;
  }
  .channel-card::before {
    content: ''; position: absolute; top: 0; left: 10px; right: 10px; height: 2px;
    background: var(--ch-tone, var(--green));
    box-shadow: 0 0 12px var(--ch-tone, var(--green));
  }
  .ch-green { --ch-tone: var(--green); }
  .ch-amber { --ch-tone: var(--amber); }
  .ch-pink  { --ch-tone: var(--pink); }
  .channel-featured {
    border-color: var(--green);
    box-shadow: 0 0 0 1px var(--green), 0 0 32px rgba(0,255,156,.18);
  }
  .channel-head {
    display: flex; align-items: center; gap: 10px;
  }
  .channel-tag {
    display: grid; place-items: center;
    width: 26px; height: 26px;
    border: 1px solid var(--ch-tone, var(--green));
    color: var(--ch-tone, var(--green));
    font-family: var(--font-sans); font-weight: 800;
    font-size: 14px;
  }
  .channel-title-box { flex: 1; }
  .channel-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 15px; color: var(--fg);
  }
  .channel-sub {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim); letter-spacing: .12em;
    margin-top: 2px;
  }
  .channel-bullet {
    margin-top: 12px;
    font-size: 12px; color: var(--green);
    background: rgba(0,255,156,.06); border-left: 2px solid var(--green);
    padding: 6px 10px;
  }
  .channel-cmd-wrap {
    display: flex; gap: 8px; margin-top: 10px;
  }
  .channel-cmd {
    flex: 1;
    background: #020610ec; border: 1px dashed var(--ch-tone, var(--green));
    padding: 6px 10px;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--ch-tone, var(--green));
    overflow: hidden; text-overflow: ellipsis;
  }
  .channel-cmd-wrap button {
    background: transparent; color: var(--green);
    border: 1px solid var(--green); cursor: pointer;
    font-family: var(--font-mono); font-size: 10px;
    padding: 2px 10px; letter-spacing: .12em; white-space: nowrap;
  }
  .prompt-preview {
    margin-top: 10px;
    background: #020610ec; border: 1px solid var(--rule);
    padding: 8px 10px;
    font-family: var(--font-mono); font-size: 10.5px;
    line-height: 1.65;
  }
  .cnb-preview { border-color: #ffb0204d; }
  .prompt-preview-line { display: flex; gap: 8px; color: var(--fg-dim); }
  .prompt-preview-line span { color: var(--green); font-weight: 700; min-width: 18px; }
  .channel-list {
    list-style: none; padding: 0;
    margin: 10px 0 0;
    font-size: 11px; color: var(--fg-dim);
    line-height: 1.55;
  }
  .channel-list li {
    position: relative; padding-left: 14px; margin-bottom: 4px;
  }
  .channel-list li::before {
    content: "›"; position: absolute; left: 0; top: 0;
    color: var(--green); font-family: var(--font-mono); font-weight: 700;
  }

  /* updatePanel：底部 4 节点 flow */
  .update-panel {
    margin-top: 12px;
    background: #060a14d6; border: 1px solid var(--rule);
    padding: 12px 16px;
  }
  .update-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 10px;
    padding-bottom: 8px; border-bottom: 1px dashed #6b7a9952;
  }
  .update-kicker {
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--green);
  }
  .update-meta {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim);
  }
  .update-flow {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .update-node {
    display: flex; align-items: center; gap: 8px;
    background: #060a146b; border: 1px solid #6b7a993d;
    padding: 8px 10px;
  }
  .update-k {
    font-family: var(--font-mono); font-size: 9.5px;
    color: var(--amber); letter-spacing: .14em;
    text-transform: uppercase; flex-shrink: 0;
  }
  .update-v {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--fg);
  }
  .update-arrow { color: var(--green); font-weight: 700; margin-left: auto; }
  .update-node:last-child .update-arrow { display: none; }
</style>
```

---

## 5. shotStage + filmstrip（截图演示 · 对齐 slide 7）

**适用**：表达"几步演示 + 多张截图切换"的页面。  
**关键元素**：
- 左：screenshot 主图（带 topbar: STEP 01 / 03 + meta）+ caption
- 右：filmstrip 4 张缩略图 chip（带 thumb + title + desc）

```html
<section class="slide" data-slide="7">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL]</div>
    <h2 class="h-title mt-2">[主标：[流程名]]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <div class="main-grid-2col">

      <!-- 左：截图主区 + caption -->
      <div class="shot-stage">
        <div class="shot-stage-main">
          <div class="shot-stage-topbar">
            <div class="shot-stage-badge">STEP <b>01</b> / 03</div>
            <div class="shot-stage-meta">[Meta · [流程名] · [工具名]]</div>
          </div>
          <div class="shot-stage-frame">
            <img class="shot-stage-img" alt="[截图说明]" src="./[path]/screenshot-01.png">
          </div>
          <div class="shot-stage-caption">
            <span class="shot-stage-caption-k">[工具 · 标签]</span>
            <span>[2-3 行说明这张截图在做什么、关键点在哪。]</span>
          </div>
        </div>
      </div>

      <!-- 右：filmstrip 4 张 chip -->
      <div class="shot-filmstrip" role="tablist">
        <button type="button" class="shot-chip shot-chip-active">
          <div class="shot-chip-thumb">
            <span class="shot-chip-thumb-num">01</span>
            <img alt="STEP 01" src="./[path]/screenshot-01.png">
          </div>
          <div class="shot-chip-body">
            <div class="shot-chip-title">[步骤 1 标题]</div>
            <div class="shot-chip-desc">[步骤 1 简述]</div>
          </div>
        </button>
        <button type="button" class="shot-chip">
          <div class="shot-chip-thumb">
            <span class="shot-chip-thumb-num">02</span>
            <img alt="STEP 02" src="./[path]/screenshot-02.png">
          </div>
          <div class="shot-chip-body">
            <div class="shot-chip-title">[步骤 2 标题]</div>
            <div class="shot-chip-desc">[步骤 2 简述]</div>
          </div>
        </button>
        <!-- 步骤 3 / 4 类似 -->
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 5 专属样式 ===== */
  .main-grid-2col {
    flex: 1; min-height: 0; margin-top: 14px;
    display: grid; grid-template-columns: minmax(0, 1fr) 320px;
    gap: 14px;
  }
  .shot-stage { display: flex; flex-direction: column; min-height: 0; }
  .shot-stage-main {
    flex: 1; min-height: 0;
    border: 1px solid var(--rule); background: #060a14d6;
    display: flex; flex-direction: column;
  }
  .shot-stage-topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px;
    border-bottom: 1px solid var(--rule);
    background: linear-gradient(90deg, #ffb0200e, transparent);
  }
  .shot-stage-badge {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--amber); letter-spacing: .14em;
    border: 1px solid var(--amber); padding: 2px 8px;
  }
  .shot-stage-badge b { color: var(--amber); font-size: 13px; }
  .shot-stage-meta {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim); letter-spacing: .14em;
  }
  .shot-stage-frame {
    flex: 1; min-height: 0;
    display: grid; place-items: center;
    background: #020610;
    padding: 16px;
  }
  .shot-stage-img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .shot-stage-caption {
    display: flex; gap: 12px;
    padding: 10px 14px;
    border-top: 1px solid var(--rule);
    background: #060a146b;
    font-size: 11.5px; color: var(--fg); line-height: 1.5;
  }
  .shot-stage-caption-k {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--cyan); letter-spacing: .14em;
    text-transform: uppercase; flex-shrink: 0;
  }

  /* filmstrip 4 chip */
  .shot-filmstrip {
    display: flex; flex-direction: column; gap: 8px;
    min-height: 0; overflow-y: auto;
  }
  .shot-chip {
    background: #060a14d6; border: 1px solid var(--rule);
    padding: 8px; cursor: pointer; text-align: left;
    display: flex; gap: 10px; align-items: stretch;
    color: var(--fg);
  }
  .shot-chip-active {
    border-color: var(--green);
    box-shadow: 0 0 0 1px var(--green), 0 0 18px rgba(0,255,156,.2);
    background: rgba(0,255,156,.06);
  }
  .shot-chip-thumb {
    position: relative; width: 70px; flex-shrink: 0;
    aspect-ratio: 16/9; overflow: hidden;
    background: #020610;
  }
  .shot-chip-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .shot-chip-thumb-num {
    position: absolute; top: 4px; left: 4px;
    font-family: var(--font-mono); font-size: 10px;
    color: var(--green); background: rgba(0,0,0,.6);
    padding: 1px 5px; letter-spacing: .1em;
  }
  .shot-chip-body {
    display: flex; flex-direction: column; gap: 4px;
    padding: 4px 0;
  }
  .shot-chip-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 12px; color: var(--fg);
  }
  .shot-chip-desc {
    font-size: 10.5px; color: var(--fg-dim); line-height: 1.45;
  }
</style>
```

---

## 6. stagePanel (split image) + toolCompareGrid（双图对比 + 工具对比 · 对齐 slide 8）

**适用**：表达"演示双画面 + 4 个工具横向对比"的页面。

```html
<section class="slide" data-slide="8">
  <div class="panel">
    <div class="part-label">PART [NN] · [LABEL]</div>
    <h2 class="h-title mt-2">[主标：与其[旧方案]，不如<span class="underline-mark">[新方案]</span>]</h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <div class="main-content">
      <div class="upper-grid">
        <!-- 上半：双图 stagePanel -->
        <div class="stage">
          <div class="stage-head">
            <div class="stage-meta">
              <span class="stage-label">[现场演示双画面]</span>
              <span class="stage-kicker">[DEMO-FIRST STRATEGY]</span>
            </div>
            <div class="stage-actions">
              <button>复制演示 Prompt</button>
              <span class="stage-badge">[BADGE · MAIN × REF]</span>
            </div>
          </div>
          <div class="stage-split">
            <figure class="stage-panel stage-panel-main">
              <figcaption class="panel-title">MAIN · [工具名 1]</figcaption>
              <img class="stage-img-main" alt="[主画面]" src="./[path]/main.png">
            </figure>
            <figure class="stage-panel stage-panel-alt">
              <figcaption class="panel-title">REFERENCE · [工具名 2]</figcaption>
              <img class="stage-img-alt" alt="[参考画面]" src="./[path]/alt.png">
            </figure>
          </div>
        </div>

        <!-- 下半：4 工具对比 -->
        <div class="tool-compare">
          <div class="tool-compare-head">
            <span class="tool-compare-kicker">[TOOLCHAIN · 四选一 / 主推 [X]]</span>
          </div>
          <div class="tool-compare-grid">
            <a class="tool-card tool-card-primary" href="[URL]" target="_blank">
              <div class="tool-card-top">
                <span class="tool-card-rank">01 · RECOMMENDED</span>
                <span class="tool-card-name">[工具 1 名]</span>
                <span class="tool-card-sub">[工具 1 副标]</span>
              </div>
              <div class="tool-card-body">
                <span class="tool-card-tag tag-default">[TAG 1]</span>
                <div class="tool-card-desc">[工具 1 描述 3-4 行。]</div>
              </div>
              <div class="tool-card-link">
                <span class="tool-card-link-k">WEB</span>
                <span class="tool-card-link-u">[domain.com]</span>
                <span class="tool-card-link-arrow">→</span>
              </div>
            </a>
            <!-- 工具 2/3/4 类似，省略 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 6 专属样式 ===== */
  .main-content {
    flex: 1; min-height: 0; margin-top: 14px;
    display: flex; flex-direction: column;
  }
  .upper-grid {
    display: grid; grid-template-rows: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: 14px; min-height: 0;
  }

  /* stagePanel：双图对比 */
  .stage {
    display: flex; flex-direction: column; min-height: 0;
    border: 1px solid var(--rule); background: #060a14d6;
    padding: 14px 16px;
  }
  .stage-head {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 12px;
  }
  .stage-meta { display: flex; align-items: baseline; gap: 14px; }
  .stage-label {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 16px; color: var(--fg);
  }
  .stage-kicker {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .stage-actions { display: flex; align-items: center; gap: 10px; }
  .stage-actions button {
    background: transparent; color: var(--green);
    border: 1px solid var(--green); cursor: pointer;
    font-family: var(--font-mono); font-size: 10.5px;
    padding: 4px 10px; letter-spacing: .12em;
  }
  .stage-badge {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--cyan); border: 1px solid var(--cyan);
    padding: 4px 8px; letter-spacing: .14em;
  }
  .stage-split {
    flex: 1; min-height: 0;
    display: grid; grid-template-columns: 2fr 1fr; gap: 12px;
  }
  .stage-panel {
    border: 1px solid var(--rule); background: #020610;
    display: flex; flex-direction: column;
  }
  .stage-panel-main { border-color: var(--green); box-shadow: 0 0 0 1px var(--green), 0 0 24px rgba(0,255,156,.18); }
  .stage-panel .panel-title {
    padding: 6px 10px;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .14em; color: var(--fg-dim);
    text-transform: uppercase;
    border-bottom: 1px solid var(--rule);
  }
  .stage-panel-main .panel-title { color: var(--green); }
  .stage-panel img { width: 100%; height: 100%; object-fit: cover; flex: 1; }

  /* toolCompareGrid：4 工具对比 */
  .tool-compare {
    border: 1px solid var(--rule); background: #060a14d6;
    padding: 12px 14px;
  }
  .tool-compare-head {
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px dashed #6b7a9952;
  }
  .tool-compare-kicker {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--amber); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .tool-compare-grid {
    display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .tool-card {
    border: 1px solid var(--rule);
    background: #060a146b;
    padding: 12px;
    color: var(--fg);
    text-decoration: none;
    display: flex; flex-direction: column;
    transition: all .2s;
  }
  .tool-card:hover {
    border-color: var(--green); background: rgba(0,255,156,.06);
  }
  .tool-card-primary {
    border-color: var(--green);
    background: rgba(0,255,156,.04);
    box-shadow: 0 0 24px rgba(0,255,156,.16);
  }
  .tool-card-top { display: flex; flex-direction: column; gap: 4px; }
  .tool-card-rank {
    font-family: var(--font-mono); font-size: 9px;
    color: var(--green); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .tool-card-name {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 17px; color: var(--fg);
  }
  .tool-card-sub {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--fg-dim); letter-spacing: .12em;
  }
  .tool-card-body { margin-top: 10px; flex: 1; }
  .tool-card-tag {
    display: inline-block;
    padding: 2px 8px;
    font-family: var(--font-mono); font-size: 9.5px;
    letter-spacing: .14em; color: var(--fg);
    border: 1px solid var(--rule);
    background: #020610;
    margin-bottom: 6px;
  }
  .tag-default { color: var(--green); border-color: var(--green); }
  .tag-teal { color: var(--cyan); border-color: var(--cyan); }
  .tag-coral { color: var(--pink); border-color: var(--pink); }
  .tag-gold { color: var(--amber); border-color: var(--amber); }
  .tool-card-desc {
    font-size: 11px; color: var(--fg); line-height: 1.55;
  }
  .tool-card-link {
    margin-top: 10px; padding-top: 8px;
    border-top: 1px dashed var(--rule);
    display: flex; align-items: center; gap: 6px;
    font-family: var(--font-mono); font-size: 10px;
  }
  .tool-card-link-k  { color: var(--amber); letter-spacing: .12em; }
  .tool-card-link-u  { color: var(--cyan); letter-spacing: .04em; }
  .tool-card-link-arrow { color: var(--green); margin-left: auto; }
</style>
```

---

## 7. docCard + bridge + matrixPanel（两栏对比 + 矩阵 · 对齐 slide 30）

**适用**：表达"两个东西看起来像但本质不同"的对比页。  
**关键元素**：
- 顶部 commandBar（`$ diff --brief ...` + meta）
- 中部 cardRow：2 张 docCard（human/ai 色调不同）+ 中间 bridge `≠`
- 底部 matrixPanel：4 行对比矩阵（axis + 2 列 cell）

```html
<section class="slide" data-slide="30">
  <div class="panel">
    <!-- 顶部标题 -->
    <div>
      <div class="kicker">[PART NN] · [LABEL · A / B 对比]</div>
      <h2 class="h-title" style="margin-top:8px;">
        [X] 不是 <span class="accent">[Y]</span>：两类文档服务不同协作对象
      </h2>
      <div class="toc-divider"><span class="blink">▌</span></div>
      <p style="font-family:var(--font-mono); font-size:13.5px; color:var(--fg-dim); line-height:1.7; max-width:72ch; margin-top:12px;">
        <span style="color:var(--amber);">#</span> [副标：不要把面向 [对象 1] 的 [文档 1]，混成面向 [对象 2] 的 [文档 2]；两者是 [关系]，不是 [替代关系]。]
      </p>
    </div>

    <!-- 中部 commandBar -->
    <div class="command-bar" style="margin-top:14px;">
      <span class="cmd-prompt">$ diff --brief [A] [B] [C]</span>
      <span class="cmd-result">[DIFFERENT LAYERS · same project, different readers]</span>
    </div>

    <!-- 中部 stage：cardRow + matrixPanel -->
    <div class="stage-content">
      <!-- cardRow：2 张 docCard + 中间 bridge -->
      <div class="card-row">
        <article class="doc-card doc-human">
          <div class="card-topline">
            <span class="card-index">01</span>
            <span class="card-label">[TYPE A · HUMAN CONTRACT]</span>
            <span class="card-cadence">[频率：里程碑]</span>
          </div>
          <div class="card-title">[文档 A 名]</div>
          <div class="card-subtitle">[文档 A 副标]</div>
          <ul class="bullet-list">
            <li><span>01</span><p>[要点 1]</p></li>
            <li><span>02</span><p>[要点 2]</p></li>
            <li><span>03</span><p>[要点 3]</p></li>
          </ul>
        </article>

        <article class="doc-card doc-ai">
          <div class="card-topline">
            <span class="card-index">02</span>
            <span class="card-label">[TYPE B · AGENT OS]</span>
            <span class="card-cadence">[频率：持续微调]</span>
          </div>
          <div class="card-title">[文档 B 名]</div>
          <div class="card-subtitle">[文档 B 副标]</div>
          <ul class="bullet-list">
            <li><span>01</span><p>[要点 1]</p></li>
            <li><span>02</span><p>[要点 2]</p></li>
            <li><span>03</span><p>[要点 3]</p></li>
          </ul>
        </article>

        <div class="bridge">
          <span class="bridge-line">not equal</span>
          <strong>≠</strong>
          <span class="bridge-line">mutual layer</span>
        </div>
      </div>

      <!-- matrixPanel：4 行对比矩阵 -->
      <div class="matrix-panel">
        <div class="matrix-header">
          <span>[COMPARE STRUCTURE]</span>
          <span>[human-readable context → agent-executable constraints]</span>
        </div>
        <div class="matrix-grid">
          <div class="matrix-row">
            <div class="axis">[维度 1]</div>
            <div class="matrix-cell cell-human">[对象 1 描述]</div>
            <div class="matrix-cell cell-ai">[对象 2 描述]</div>
          </div>
          <div class="matrix-row">
            <div class="axis">[维度 2]</div>
            <div class="matrix-cell cell-human">[对象 1 描述]</div>
            <div class="matrix-cell cell-ai">[对象 2 描述]</div>
          </div>
          <div class="matrix-row">
            <div class="axis">[维度 3]</div>
            <div class="matrix-cell cell-human">[对象 1 描述]</div>
            <div class="matrix-cell cell-ai">[对象 2 描述]</div>
          </div>
          <div class="matrix-row">
            <div class="axis">[维度 4]</div>
            <div class="matrix-cell cell-human">[对象 1 描述]</div>
            <div class="matrix-cell cell-ai">[对象 2 描述]</div>
          </div>
        </div>
      </div>

      <!-- 底部 takeaway -->
      <div class="takeaway-bar">
        <span class="takeaway-label">[对客结论话术]</span>
        <strong>[一句话总结：A 是 [A 性质]；B 是 [B 性质]。]</strong>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 7 专属样式 ===== */
  .stage-content {
    flex: 1; min-height: 0; margin-top: 14px;
    display: grid; grid-template-rows: auto auto auto;
    gap: 12px;
  }

  /* commandBar：顶部 diff 命令 */
  .command-bar {
    background: linear-gradient(90deg, #00ff9c0e, transparent);
    border: 1px solid var(--green);
    padding: 9px 14px;
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: var(--font-mono); font-size: 11.5px;
  }
  .cmd-prompt  { color: var(--green); letter-spacing: .08em; }
  .cmd-result  { color: var(--cyan);  letter-spacing: .12em; text-transform: uppercase; }

  /* cardRow：2 张 docCard + bridge */
  .card-row {
    display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px;
    align-items: stretch;
  }
  .doc-card {
    position: relative;
    border: 1px solid var(--rule);
    background: #060a14d6;
    padding: 16px 18px;
  }
  .doc-human {
    border-color: #ffb02047;
    background: linear-gradient(135deg, rgba(255,176,32,.05), #060a14d6);
  }
  .doc-ai {
    border-color: var(--green);
    background: linear-gradient(135deg, rgba(0,255,156,.05), #060a14d6);
  }
  .card-topline {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: .14em; text-transform: uppercase;
  }
  .card-index {
    color: var(--green); font-weight: 700; font-size: 11px;
  }
  .card-label {
    background: rgba(0,255,156,.08); color: var(--green);
    border: 1px solid var(--green); padding: 2px 8px;
  }
  .doc-human .card-label {
    background: rgba(255,176,32,.08); color: var(--amber);
    border-color: var(--amber);
  }
  .card-cadence {
    margin-left: auto;
    color: var(--fg-dim); font-size: 9.5px;
    border: 1px solid var(--rule); padding: 2px 6px;
  }
  .card-title {
    font-family: var(--font-sans); font-weight: 800;
    font-size: 22px; color: var(--fg); margin-top: 12px;
    letter-spacing: -.3px;
  }
  .card-subtitle {
    color: var(--cyan); font-family: var(--font-sans);
    font-weight: 700; font-size: 12.5px; margin-top: 4px;
  }
  .doc-human .card-subtitle { color: var(--amber); }
  .bullet-list {
    list-style: none; padding: 0;
    margin-top: 12px;
    font-size: 11.5px; color: var(--fg); line-height: 1.55;
  }
  .bullet-list li {
    display: flex; gap: 8px; margin-bottom: 6px;
  }
  .bullet-list li span {
    color: var(--green); font-family: var(--font-mono);
    font-weight: 700; min-width: 18px;
  }

  /* bridge：中间的 ≠ */
  .bridge {
    align-self: center;
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    padding: 0 8px;
  }
  .bridge-line {
    font-family: var(--font-mono); font-size: 9.5px;
    color: var(--fg-dim); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .bridge strong {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    font-size: 56px;
    color: var(--pink);
    text-shadow: 0 0 24px rgba(255,46,136,.5);
  }

  /* matrixPanel：4 行对比矩阵 */
  .matrix-panel {
    background: #060a14d6; border: 1px solid var(--rule);
    padding: 12px 16px;
  }
  .matrix-header {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-bottom: 8px;
    border-bottom: 1px dashed #6b7a9952;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--green); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .matrix-header span:last-child { color: var(--fg-dim); text-transform: none; letter-spacing: .04em; }
  .matrix-grid {
    display: grid; gap: 1px;
    background: #6b7a993d;
    border: 1px solid #6b7a993d;
    margin-top: 10px;
  }
  .matrix-row {
    display: grid; grid-template-columns: 110px 1fr 1fr;
    background: #060a14d6;
  }
  .axis {
    background: rgba(0,255,156,.04);
    padding: 10px 14px;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--green); letter-spacing: .12em;
    text-transform: uppercase;
    border-right: 1px solid var(--rule);
  }
  .matrix-cell {
    padding: 10px 14px;
    font-size: 11.5px; color: var(--fg); line-height: 1.5;
  }
  .cell-human {
    background: rgba(255,176,32,.04);
    border-right: 1px solid var(--rule);
  }
  .cell-ai {
    background: rgba(0,255,156,.04);
  }

  /* takeawayBar */
  .takeaway-bar {
    background: linear-gradient(90deg, #00ff9c0e, transparent);
    border: 1px dashed var(--green);
    padding: 10px 14px;
    display: flex; align-items: baseline; gap: 14px;
  }
  .takeaway-label {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--green); letter-spacing: .14em;
    text-transform: uppercase; flex-shrink: 0;
  }
  .takeaway-bar strong {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 14px; color: var(--fg); line-height: 1.45;
  }
</style>
```

---

## 8. heroCard + discussCard + footer open floor（收尾页 · 对齐 slide 37）

**适用**：Q&A / 开放讨论 / 结尾页。

```html
<section class="slide" data-slide="37">
  <div class="panel">
    <div class="part-label">open --discussion --mode=live</div>
    <h2 class="h-title mt-2">感谢聆听 <span class="accent">现在进入讨论</span></h2>
    <div class="toc-divider"><span class="blink">▌</span></div>

    <div class="closing-grid">
      <!-- 左：heroCard（带 topic chips） -->
      <section class="hero-card">
        <div class="hero-body">
          <div>
            <div class="hero-cmd">
              <span class="log-ok">&gt;</span> open --floor --topic=[topic]
            </div>
            <div class="hero-eyebrow">[EBYEBROW · TAG · TITLE]</div>
            <div class="hero-title">欢迎讨论</div>
            <p class="hero-desc">[2-3 行说明接下来要做什么、鼓励继续展开。]</p>
          </div>
          <div class="topic-row">
            <span class="topic-chip">[TAG 1]</span>
            <span class="topic-chip">[TAG 2]</span>
            <span class="topic-chip">[TAG 3]</span>
            <span class="topic-chip">[TAG 4]</span>
            <span class="topic-chip">[TAG 5]</span>
          </div>
        </div>
      </section>

      <!-- 右：discussCard -->
      <aside class="discuss-card">
        <div class="discuss-label">[OPEN DISCUSSION]</div>
        <div class="discuss-title">[如果继续聊，最值得讨论的是]</div>
        <ul class="discuss-list">
          <li>[引导问题 1]</li>
          <li>[引导问题 2]</li>
          <li>[引导问题 3]</li>
        </ul>
        <div class="discuss-note">[也欢迎直接提问题...]</div>
      </aside>
    </div>

    <!-- 底部 footer：左右双栏 -->
    <div class="closing-footer">
      <div class="foot-left">
        <div class="foot-cmd">
          <span class="log-ok">$</span> open --discussion <span style="color:var(--fg-mute);">／</span> OPEN FLOOR
        </div>
        <div class="foot-title">欢迎交流 <span class="foot-accent">open floor</span></div>
      </div>
      <div class="foot-right">
        <div class="foot-vol">[DECK · VERSION · DECKNAME]</div>
        <div>[date · [ORG] · [TAG]]</div>
        <div class="foot-eof"><span class="blink">▌</span> Q&amp;A · OPEN DISCUSSION</div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ===== Layout 8 专属样式 ===== */
  .closing-grid {
    flex: 1; min-height: 0; margin-top: 14px;
    display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    gap: 14px;
  }

  /* heroCard */
  .hero-card {
    border: 1px solid var(--rule);
    background: #060a14d6;
    padding: 20px 24px;
    display: flex; flex-direction: column;
  }
  .hero-body {
    display: flex; flex-direction: column; gap: 18px;
    height: 100%;
  }
  .hero-cmd {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--green); letter-spacing: .14em;
  }
  .hero-eyebrow {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--cyan); letter-spacing: .2em;
    text-transform: uppercase;
    margin-top: 14px;
  }
  .hero-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 48px; line-height: 1.05;
    color: var(--green);
    text-shadow: 0 0 24px rgba(0,255,156,.55), 0 0 48px rgba(0,255,156,.2);
    letter-spacing: -1px;
    margin-top: 8px;
  }
  .hero-desc {
    font-family: var(--font-mono); font-size: 12px;
    color: var(--fg); line-height: 1.65;
    margin-top: 12px;
  }
  .topic-row {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-top: auto;
  }
  .topic-chip {
    display: inline-block;
    padding: 4px 12px;
    border: 1px solid var(--green);
    background: rgba(0,255,156,.06);
    color: var(--green);
    font-family: var(--font-mono); font-size: 10.5px;
    letter-spacing: .14em;
  }

  /* discussCard */
  .discuss-card {
    border: 1px solid var(--rule);
    background: #060a14d6;
    padding: 18px 20px;
    display: flex; flex-direction: column;
  }
  .discuss-label {
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--amber); letter-spacing: .16em;
    text-transform: uppercase;
  }
  .discuss-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 18px; color: var(--fg);
    margin-top: 8px; line-height: 1.3;
  }
  .discuss-list {
    list-style: none; padding: 0;
    margin-top: 14px;
    font-size: 12.5px; color: var(--fg); line-height: 1.7;
  }
  .discuss-list li {
    position: relative; padding-left: 14px; margin-bottom: 6px;
  }
  .discuss-list li::before {
    content: "›"; position: absolute; left: 0; top: 0;
    color: var(--green); font-weight: 700; font-family: var(--font-mono);
  }
  .discuss-note {
    margin-top: auto; padding-top: 14px;
    border-top: 1px dashed var(--rule);
    font-size: 11.5px; color: var(--fg-dim); line-height: 1.55;
  }

  /* closing-footer */
  .closing-footer {
    margin-top: 14px;
    display: grid; grid-template-columns: 1fr auto;
    align-items: end; gap: 16px;
    padding-top: 12px;
    border-top: 1px solid var(--rule);
  }
  .foot-cmd {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--green); letter-spacing: .14em;
    text-transform: uppercase;
  }
  .foot-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 28px; color: var(--fg);
    margin-top: 4px;
  }
  .foot-accent {
    color: var(--green); font-style: italic;
    text-shadow: 0 0 12px rgba(0,255,156,.4);
  }
  .foot-right {
    text-align: right;
    font-family: var(--font-mono); font-size: 10.5px;
    color: var(--fg-dim); letter-spacing: .12em;
    line-height: 1.7;
  }
  .foot-vol { color: var(--cyan); }
  .foot-eof { color: var(--green); margin-top: 4px; }
</style>
```

---

# 旧 11 种 layout（保留 · 向后兼容）

> 以下 11 种 layout 是基础布局，全部保留。每种都是自包含的 `<section>` + `<style>` 模板，可直接复制到 slide 里。

## 9. arch-flow（架构图 / 数据流）

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>ARCHITECTURE</span>
  </div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [架构图标题]<span class="cursor"></span>
    </h1>
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="arch-row fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="arch-row__no">L1</div>
        <div class="arch-row__name">[LAYER 1 NAME]</div>
        <div class="arch-row__desc">[这一层的职责 / 包含什么]</div>
        <div class="arch-row__tech">[tech-stack]</div>
      </div>
      <!-- L2/L3/L4 同结构 -->
    </div>
  </div>
  <div class="chrome chrome--bottom">
    <span class="prompt">cat /architecture/layers.md</span>
  </div>
</section>

<style>
  .arch-row {
    display: grid; grid-template-columns: 60px 200px 1fr 200px;
    align-items: center; gap: 20px;
    padding: 14px 20px;
    background: #ffffff06;
    border-left: 2px solid var(--accent);
    border-radius: 0 2px 2px 0;
  }
  .arch-row__no {
    font-family: var(--font-display); font-weight: 700; font-style: italic;
    font-size: 24px; color: var(--accent);
    text-shadow: 0 0 10px currentColor;
  }
  .arch-row__name { font-family: var(--font-sans); font-weight: 700; font-size: 16px; }
  .arch-row__desc { font-size: 12px; color: var(--fg-dim); line-height: 1.5; }
  .arch-row__tech {
    font-family: var(--font-mono); font-size: 11px; color: var(--fg-mute);
    text-align: right; letter-spacing: 0.18em;
  }
</style>
```

## 10. intro-typ（中文大字 hero 引言）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>INTRO</span></div>
  <div class="stage" style="display:grid; place-items:center; padding:80px;">
    <div style="max-width:1100px; text-align:center;">
      <div style="font-family:var(--font-display); font-weight:700; font-style:italic;
                  font-size:120px; color:var(--cyan); line-height:0.8;
                  text-shadow: 0 0 30px #5ce1ff66; margin-bottom:24px;">&ldquo;</div>
      <p style="font-family:var(--font-sans); font-weight:700; font-size:52px; line-height:1.4;
                letter-spacing:-0.01em; margin-bottom:32px;">[一句话引言]</p>
      <div style="font-size:12px; color:var(--fg-dim); letter-spacing:0.22em;">◆ [作者 / 出处 · 时间]</div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">less /quotes/[N].md</span></div>
</section>
```

## 11. layer-stack（N 层堆叠）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>STACK · 9 LAYERS</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:36px;">[N 层堆叠标题]<span class="cursor"></span></h1>
    <div style="border-top:1px solid var(--rule);">
      <div class="layer fade-item" style="--d:0.05s; --accent: var(--cyan);">
        <div class="layer__no">L1</div><div class="layer__name">[LAYER 1]</div>
        <div class="layer__desc">[description]</div>
      </div>
      <!-- L2 ~ L9 类似 -->
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">ls -la /stack/</span></div>
</section>

<style>
  .layer {
    display: grid; grid-template-columns: 60px 1fr 2fr;
    align-items: center; gap: 24px;
    padding: 14px 0;
    border-bottom: 1px dashed var(--rule);
  }
  .layer__no { font-family: var(--font-display); font-weight: 700; font-style: italic; font-size: 18px; color: var(--accent); }
  .layer__name { font-family: var(--font-sans); font-weight: 700; font-size: 14px; }
  .layer__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.5; }
</style>
```

## 12. loop-evo（循环 / 演进）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>LOOP</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ ITERATION</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[循环标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:18px;">
      <div class="loop-step fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="loop-step__no">01</div><div class="loop-step__title">[STEP 1]</div>
        <div class="loop-step__desc">[step 1 描述]</div>
        <div class="loop-step__arrow">→</div>
      </div>
      <!-- 02/03/04 类似，最后一个用 ↻ -->
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">while true; do iter.sh; done</span></div>
</section>

<style>
  .loop-step {
    position: relative; padding: 18px 18px 24px;
    background: #ffffff06; border: 1px solid var(--rule);
    border-left: 2px solid var(--accent);
  }
  .loop-step__no {
    font-family: var(--font-display); font-weight: 700; font-style: italic;
    font-size: 24px; color: var(--accent);
    text-shadow: 0 0 10px currentColor; margin-bottom: 8px;
  }
  .loop-step__title { font-family: var(--font-sans); font-weight: 700; font-size: 16px; margin-bottom: 8px; }
  .loop-step__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.55; }
  .loop-step__arrow {
    position: absolute; right: 14px; bottom: 8px;
    font-size: 18px; color: var(--accent); opacity: 0.6;
  }
</style>
```

## 13. repo-tree（仓库目录树）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>TREE · /repo/</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ STRUCTURE</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[仓库结构标题]<span class="cursor"></span></h1>
<pre style="font-family:var(--font-mono); font-size:13px; line-height:1.7; color:var(--fg);">
<span style="color:var(--green);">/repo/</span>
├── <span style="color:var(--cyan);">README.md</span>
├── <span style="color:var(--amber);">package.json</span>
├── <span style="color:var(--cyan);">src/</span>
│   ├── <span style="color:var(--cyan);">index.ts</span>
│   └── <span style="color:var(--cyan);">core/</span>
│       ├── <span style="color:var(--cyan);">engine.ts</span>
│       └── <span style="color:var(--cyan);">parser.ts</span>
</pre>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">tree /repo/ -L 3</span></div>
</section>
```

## 14. yaml-code（YAML / 配置代码块）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>CONFIG · .yaml</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[YAML 配置标题]<span class="cursor"></span></h1>
<pre style="background:#0a1020; border:1px solid var(--rule); padding:24px;
            font-size:13px; line-height:1.7; color:var(--fg); overflow:auto;
            font-family:var(--font-mono);">
<span style="color:var(--fg-dim);"># [配置文件说明]</span>
<span style="color:var(--green);">service</span>:
  <span style="color:var(--cyan);">name</span>: <span style="color:var(--amber);">"example-svc"</span>
  <span style="color:var(--cyan);">replicas</span>: <span style="color:var(--pink);">3</span>
<span style="color:var(--green);">runtime</span>:
  <span style="color:var(--cyan);">timeout</span>: <span style="color:var(--pink);">30s</span>
  <span style="color:var(--cyan);">memory</span>: <span style="color:var(--amber);">"512Mi"</span>
</pre>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">cat config.yaml | less</span></div>
</section>
```

## 15. spectrum-page（全宽 spectrum 大图）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>SPECTRUM · 24 STAGES</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:24px;">[Spectrum 标题]<span class="cursor"></span></h1>
    <p style="font-size:13px; color:var(--fg-dim); margin-bottom:48px;">[一句话解释 spectrum 的含义]</p>
    <div style="background:linear-gradient(to right, #ff2e88 0%, #ee3982 4%, #dd447c 8%, /* … */ #00ff9c 100%);
                height:80px; border:1px solid var(--rule); position:relative;">
      <div style="position:absolute; top:-12px; left:62%; transform:translateX(-50%);
                  padding:3px 8px; background:var(--bg); border:1px solid var(--green);
                  font-size:10px; color:var(--green); letter-spacing:0.18em;
                  box-shadow: 0 0 8px #00ff9c66;">◆ CURRENT · 62%</div>
    </div>
    <div style="display:flex; justify-content:space-between;
                font-family:var(--font-mono); font-size:8px; color:var(--fg-mute); margin-top:6px;">
      <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">spectrum --show current</span></div>
</section>
```

## 16. note-card-page（多并列 note-card）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>NOTES</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[多 note-card 标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="note-card note-card--ok"><div class="note-card__icon">✓</div>
        <div><div class="note-card__title">[OK · TITLE]</div><div class="note-card__body">[通过的事项]</div></div>
      </div>
      <div class="note-card note-card--info"><div class="note-card__icon">▸</div>
        <div><div class="note-card__title">[INFO · TITLE]</div><div class="note-card__body">[信息提示]</div></div>
      </div>
      <div class="note-card note-card--warn"><div class="note-card__icon">!</div>
        <div><div class="note-card__title">[WARN · TITLE]</div><div class="note-card__body">[警告事项]</div></div>
      </div>
      <div class="note-card note-card--err"><div class="note-card__icon">✕</div>
        <div><div class="note-card__title">[ERR · TITLE]</div><div class="note-card__body">[错误事项]</div></div>
      </div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">cat /notes.md</span></div>
</section>
```

## 17. harness-table（表格 / Harness 配置）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>HARNESS · 9 ITEMS</span></div>
  <div class="stage" style="padding:60px 80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ TABLE</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:32px;
               letter-spacing:-0.02em; margin-bottom:32px;">[表格标题]<span class="cursor"></span></h1>
    <table style="width:100%; border-collapse:collapse; font-family:var(--font-mono); font-size:13px;">
      <thead><tr style="border-bottom:1px solid var(--rule);">
        <th style="text-align:left; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[COL 1]</th>
        <th style="text-align:left; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[COL 2]</th>
        <th style="text-align:right; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[STATUS]</th>
      </tr></thead>
      <tbody>
        <tr class="h-row fade-item" style="--d:0.05s;">
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule);">[ITEM 1]</td>
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule); color:var(--fg-dim);">[desc 1]</td>
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule); text-align:right;"><span class="badge badge--g">[OK]</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">grep -E 'OK|WIP|TODO' /harness</span></div>
</section>
```

## 18. quadrant（2×2 四象限）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>QUADRANT</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[四象限标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:80px 1fr 80px; gap:0; height:540px;">
      <div style="writing-mode:vertical-rl; transform:rotate(180deg); align-self:center;
                  font-size:11px; color:var(--fg-dim); letter-spacing:0.22em;">[Y-AXIS ↑]</div>
      <div style="display:grid; grid-template-rows:1fr 1fr; gap:0; position:relative;">
        <div style="position:absolute; left:0; right:0; top:50%; height:1px; background:var(--rule); z-index:1;"></div>
        <div style="position:absolute; top:0; bottom:0; left:50%; width:1px; background:var(--rule); z-index:1;"></div>
        <div class="quad fade-item" style="--d:0.1s; --accent: var(--cyan);">
          <div class="quad__no">Q1 · TOP-LEFT</div>
          <div class="quad__title">[象限 1]</div>
          <div class="quad__desc">[描述]</div>
        </div>
        <!-- Q2/Q3/Q4 类似 -->
      </div>
      <div style="writing-mode:vertical-rl; align-self:center;
                  font-size:11px; color:var(--fg-dim); letter-spacing:0.22em;">[X-AXIS →]</div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">quadrant --plot</span></div>
</section>

<style>
  .quad {
    padding: 16px 20px;
    background: #ffffff06;
    border-left: 2px solid var(--accent);
    display: flex; flex-direction: column; gap: 6px;
    z-index: 0;
  }
  .quad__no { font-size: 9px; letter-spacing: 0.22em; color: var(--accent); }
  .quad__title { font-family: var(--font-sans); font-weight: 700; font-size: 16px; }
  .quad__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.5; }
</style>
```

## 19. mode-stack（模式对比 / 错位堆叠）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>MODES · 3 PATTERNS</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[3 种模式对比]<span class="cursor"></span></h1>
    <div style="position:relative; height:340px;">
      <div class="mode-stack fade-item" style="--d:0.1s; --accent: var(--cyan); top:0; left:0;">
        <div class="mode-stack__head">[MODE 1 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
      <div class="mode-stack fade-item" style="--d:0.2s; --accent: var(--amber); top:60px; left:120px;">
        <div class="mode-stack__head">[MODE 2 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
      <div class="mode-stack fade-item" style="--d:0.3s; --accent: var(--pink); top:120px; left:240px;">
        <div class="mode-stack__head">[MODE 3 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">compare /modes/</span></div>
</section>

<style>
  .mode-stack {
    position: absolute; width: 320px;
    padding: 16px 18px;
    background: var(--bg-2);
    border: 1px solid var(--rule);
    border-left: 3px solid var(--accent);
    box-shadow: 0 8px 24px #00000060;
    z-index: 1;
  }
  .mode-stack__head {
    font-family: var(--font-sans); font-weight: 700; font-size: 15px;
    color: var(--accent); margin-bottom: 10px;
  }
  .mode-stack ul {
    list-style: none; font-size: 12px; line-height: 1.7; color: var(--fg);
  }
  .mode-stack ul li::before { content: '▸ '; color: var(--accent); }
</style>
```

---

## Checklist

- [ ] **window-chrome / panel / corner / footer 四件套都在**（每页必备）
- [ ] **slide-corner 内容正确**（PART NN · LABEL 或 SECTION NAME）
- [ ] 每种 layout 至少 1 个闪烁光标
- [ ] accent 色不超过 4 种循环
- [ ] 描述 / 文案 ≤ 3 行（除 spec 步骤外）
- [ ] 1440×900 视口下不溢出

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| arch-flow 像表格 | 没用 accent 条 / grid | 加 `border-left: 2px solid var(--accent)` |
| intro-typ 像 PPT 模板 | 居中 + 大字 | 必须有 120px 引号 + 装饰字距 |
| repo-tree 太密集 | 行距太小 / 字号太大 | `font-size: 13px` + `line-height: 1.7` |
| yaml-code 看不清 | 没用配色 | 必须 4 色：key=绿 / string=琥珀 / number=粉 / comment=dim |
| spectrum 没锚点 | 没标当前态 | 加 `◆ CURRENT · 62%` 浮动标签 |
| quadrant 4 角视觉等重 | 没用 accent 区分 | 4 个象限用 4 色 |
| **Layout 1 dispatchMap 像 dashboard** | hubRing 没用 dashed 双圈 | 必须 `.ai-hub::before/::after` 双 dashed 内圈 |
| **Layout 2 specCanvas 像普通 6 步** | stepTrack 缺 foundationBar + closureBar | 必须上下两条 bar + 中间 6 step |
| **Layout 3 layerCard 像 9-card** | 没有 intro + side thoughtPanel | 必须 intro + 3×3 + side thoughtPanel 三段式 |
| **Layout 4 carrierPanel 像列表** | terminalBox 没 ✓/✗ 行 | 必须含 `term-ok` / `term-bad` 行 |
| **Layout 7 docCard 像 2-card** | 没有 bridge ≠ | 必须中间 `.bridge` 含 ≠ + not equal/mutual layer |
| **Layout 8 closing 像普通 end** | 没有 heroCard + discussCard + 双 footer | 必须分 hero / discuss / foot-left / foot-right 四块 |