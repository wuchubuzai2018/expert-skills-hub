## A1. part-cover-CN

**适用场景**：每章节大封面，纯中文主标题 + 英文短语副标题，无衬线大字。

**视觉锚点**：
- 上方一行 monospace 命令：`> ./LOAD --PART=0X --SOURCE=PART_0X.MD --TITLE="..."`
- 主标题：中文 96px，白色 + 中点 `·` 分隔；后半段 cyan 绿
- 副标题：英文短语 italic，绿色 glow，约 60px
- 描述：`/* ... */` 风格，左侧 cyan 竖条
- 底部 PRESS → 提示，闪烁光标

**代表 slide**：20（AI 全栈团队 / team）、25（落地场景 · 常见 Q&A / faq / objection handling）、34（AI Coding 落地路线图 / roadmap / rollout）

**HTML 骨架**：
```html
<section class="slide" data-kind="part-cover-cn">
  <!-- 命令行 -->
  <div class="load-cmd">&gt; ./LOAD --PART=03 --SOURCE=PART_03.MD --TITLE="AI 全栈团队"</div>

  <!-- 主标题（中文 + 中点 + 英文） -->
  <h1 class="cn-title">
    <span class="cn">AI</span>
    <span class="dot">·</span>
    <span class="cn accent">全栈团队</span>
  </h1>

  <!-- 副标题（英文短语，italic + green glow） -->
  <div class="en-subtitle">team</div>

  <!-- 描述 -->
  <div class="cn-desc">/* 客户问工具，真正想问的是：团队怎么变、流程怎么改、结果怎么更稳。三个阶段，不可跳级。 */</div>

  <!-- PRESS 提示 -->
  <div class="press-hint">&gt; PRESS <kbd>→</kbd> TO CONTINUE <span class="blink">▌</span></div>
</section>
```

**CSS 关键样式**：
```css
.part-cover-cn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; height: 100%;
}
.load-cmd { font: 13px/1.5 var(--font-mono); color: var(--green); letter-spacing: 0.5px; margin-bottom: 40px; }
.cn-title {
  font: 700 96px/1.1 var(--font-display); color: var(--text);
  margin: 0; display: flex; gap: 24px; align-items: baseline;
}
.cn-title .dot { color: var(--text); opacity: 0.4; font-weight: 300; }
.cn-title .accent { color: var(--accent); text-shadow: 0 0 32px rgba(0,255,156,0.4); }
.en-subtitle {
  font: italic 600 60px/1.2 var(--font-display); color: var(--accent);
  text-shadow: 0 0 24px rgba(0,255,156,0.5); margin-top: 24px;
}
.cn-desc {
  font: 14px/1.7 var(--font-mono); color: var(--text-dim);
  border-left: 2px solid var(--accent); padding-left: 16px; margin-top: 32px; max-width: 720px;
}
.cn-desc .accent { color: var(--amber); }
.press-hint {
  font: 12px var(--font-mono); color: var(--text-dim);
  margin-top: 48px; letter-spacing: 1.5px;
}
.press-hint kbd {
  display: inline-block; padding: 2px 8px; border: 1px solid var(--text-dim);
  border-radius: 3px; margin: 0 4px;
}
.blink { animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
```

**注意事项**：
- 中点 `·` 必须用半角 + 空格包裹，避免排版溢出
- 中文标题字号 ≤ 96px，副标题 ≤ 60px，二者比例 1.6:1 最佳
- `LOAD` 命令保持 monospace 字体，与视觉的 sans 大字形成"代码 ↔ 设计"双层

---

## A2. layerFlowPanel

**适用场景**：展示一个领域的多层级结构（左）+ 该领域内的循环运转流程（右）。

**视觉锚点**：
- **左面板（55% 宽）**：`KNOWLEDGE ARCHITECTURE`，5 行 layer 表（L0-P / L0-T / L1 / L2 / L3），每行 level code + 分类名 + 范围徽章 + 描述
- **左面板底部**：成熟度 ladder（draft → verified → proven），三个色块 + `↓` 箭头连接
- **右面板（45% 宽）**：`KNOWLEDGE LOOP`，2x2 网格 4 阶段（INIT/RUN/ARCHIVE/PROMOTE），每格 badge + 标题 + 描述
- **右面板右边缘**：2 个 amber 箭头指示流程方向
- **顶部**：`CORE THESIS` 单行引文，cyan 竖条

**代表 slide**：18（Harness Engineering · KNOWLEDGE MOAT）

**HTML 骨架**：
```html
<section class="slide" data-kind="layer-flow-panel">
  <!-- 顶部 CORE THESIS -->
  <header class="thesis-bar">
    <span class="tag">CORE THESIS</span>
    <span class="thesis-text">Harness Engineering 的价值，不在于流程更复杂，而在于把团队经验沉淀为可检索、可验证、可复用的知识资产。</span>
    <span class="quote">"工作流只是管道，知识才是流过管道的活水。"</span>
  </header>

  <div class="two-pane">
    <!-- 左：5 层架构 + ladder -->
    <div class="pane left">
      <div class="pane-title">
        <span class="en">KNOWLEDGE ARCHITECTURE</span>
        <span class="zh">五层存储 · 三级成熟度</span>
      </div>
      <div class="layer-table">
        <div class="layer-row" data-tier="l0p">
          <span class="lvl">L0-P</span>
          <span class="cat">个人偏好</span>
          <span class="scope">纯本地</span>
          <span class="desc">编码风格（Tab/空格）、编程范式偏好等 — <em>不强制共享</em></span>
        </div>
        <!-- ... 4 more rows for L0-T/L1/L2/L3 -->
      </div>

      <div class="maturity-ladder">
        <span class="label">三级成熟度（多可值）</span>
        <div class="ladder-stages">
          <div class="stage draft"><span class="k">draft</span><span class="d">新提取·单一来源·置信度 0.5-0.6</span></div>
          <div class="arrow">↓</div>
          <div class="stage verified"><span class="k">verified</span><span class="d">≥1 工作流成功引用</span></div>
          <div class="arrow">↓</div>
          <div class="stage proven"><span class="k">proven</span><span class="d">≥2 项目验证·成熟可信</span></div>
        </div>
        <div class="decay">衰减：proven 12 月未引→verified，verified 6 月未引→draft，draft 持续未引→归档</div>
      </div>
    </div>

    <!-- 右：4 步 Loop -->
    <div class="pane right">
      <div class="pane-title">
        <span class="en">KNOWLEDGE LOOP</span>
        <span class="zh">流程完成即知识增长</span>
      </div>
      <div class="loop-grid">
        <div class="loop-cell" data-stage="init">
          <span class="badge">INIT</span>
          <span class="title">知识注入</span>
          <p class="desc">工作流启动自动 git pull 知识仓库，注入全景目录查询入口。</p>
        </div>
        <div class="loop-cell" data-stage="run">
          <span class="badge">RUN</span>
          <span class="title">按需消费</span>
          <p class="desc">Agent 在决策点按预算三级渐进查询：技术分析查反模式，架构设计查决策集。</p>
        </div>
        <div class="loop-cell" data-stage="archive">
          <span class="badge">ARCHIVE</span>
          <span class="title">自动沉淀</span>
          <p class="desc">@archiver 自动提取：架构决策→decision，跌坑→pitfall，经验→guideline。</p>
        </div>
        <div class="loop-cell" data-stage="promote">
          <span class="badge">PROMOTE</span>
          <span class="title">提升+复用</span>
          <p class="desc">通用知识自动提升到 L1/L2；下一个工作流 INIT 即站在前人肩上。</p>
        </div>
        <span class="flow-arrow arrow-r"></span>
        <span class="flow-arrow arrow-d"></span>
      </div>

      <!-- 底部 4 列要点 -->
      <ul class="loop-takeaways">
        <li><b>独立 Git 仓库</b>作为单一事实源（不寄生项目）</li>
        <li><b>引用追踪闭环</b> + 自动衰减（避免过时知识误导）</li>
        <li><b>贡献暂存 + 异步合并</b>（低摩擦共识机制）</li>
        <li><b>流程完成一次，团队知识增长一次</b></li>
      </ul>
    </div>
  </div>
</section>
```

**CSS 关键样式**：
```css
.layer-flow-panel { display: flex; flex-direction: column; gap: 16px; height: 100%; }
.thesis-bar {
  display: flex; align-items: center; gap: 16px;
  padding: 10px 16px; border: 1px solid rgba(0,255,156,0.2);
  background: rgba(0,255,156,0.04); border-radius: 6px;
  font: 13px/1.5 var(--font-mono);
}
.thesis-bar .tag { color: var(--green); font-weight: 700; letter-spacing: 1px; }
.thesis-bar .thesis-text { color: var(--text); flex: 1; }
.thesis-bar .quote { color: var(--amber); font-style: italic; }

.two-pane { display: grid; grid-template-columns: 55% 45%; gap: 16px; flex: 1; min-height: 0; }
.pane { border: 1px solid rgba(92,225,255,0.18); border-radius: 6px; padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; }
.pane-title { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 8px; border-bottom: 1px solid rgba(92,225,255,0.12); }
.pane-title .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.pane-title .zh { font: 12px var(--font-sans); color: var(--text-dim); }

.layer-table { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.layer-row {
  display: grid; grid-template-columns: 50px 80px 80px 1fr; gap: 10px; align-items: baseline;
  font: 12px/1.5 var(--font-mono); padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.06);
}
.layer-row .lvl { color: var(--green); font-weight: 700; }
.layer-row .cat { color: var(--text); font-weight: 600; }
.layer-row .scope { color: var(--cyan); font-size: 11px; padding: 1px 6px; border: 1px solid var(--cyan); border-radius: 3px; align-self: center; }
.layer-row .desc { color: var(--text-dim); }
.layer-row em { color: var(--amber); font-style: normal; }

.maturity-ladder { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; }
.maturity-ladder .label { font: 11px var(--font-mono); color: var(--text-dim); display: block; margin-bottom: 6px; }
.ladder-stages { display: flex; align-items: center; gap: 8px; }
.stage { flex: 1; padding: 8px 10px; border: 1px solid; border-radius: 4px; }
.stage.draft { border-color: var(--text-dim); color: var(--text-dim); }
.stage.verified { border-color: var(--cyan); color: var(--cyan); }
.stage.proven { border-color: var(--green); color: var(--green); }
.stage .k { display: block; font-weight: 700; }
.stage .d { display: block; font-size: 10px; opacity: 0.8; }
.ladder-stages .arrow { color: var(--text-dim); font-size: 16px; }
.decay { font: 10px var(--font-mono); color: var(--text-dim); margin-top: 6px; }

.loop-grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; flex: 1; }
.loop-cell { border: 1px solid rgba(92,225,255,0.15); padding: 10px 12px; border-radius: 4px; display: flex; flex-direction: column; gap: 4px; }
.loop-cell .badge { font: 700 10px var(--font-mono); color: var(--green); letter-spacing: 1px; }
.loop-cell .title { font: 700 16px var(--font-display); color: var(--text); }
.loop-cell .desc { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.flow-arrow { position: absolute; right: -4px; top: 50%; width: 8px; height: 8px; border-top: 2px solid var(--amber); border-right: 2px solid var(--amber); transform: rotate(45deg); }
.flow-arrow.arrow-d { right: 50%; bottom: -4px; top: auto; transform: rotate(135deg); }

.loop-takeaways { list-style: none; padding: 10px 12px; margin: 0; border-top: 1px solid rgba(255,255,255,0.06); font: 11px/1.7 var(--font-sans); color: var(--text-dim); display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; }
.loop-takeaways li b { color: var(--green); font-weight: 600; }
```

---

## A3. progressionStrip + denseSplit

**适用场景**：一页内同时表达"概念演进阶段"+"具体实践集合"，信息密度极高。

**视觉锚点**：
- **顶部 progressionStrip**：4 个 stage 横排（01/02/03/04），中间用 amber `→` 连接；最右 stage 高亮（绿色边框 + 星标 ★）
- **左 70% denseSplit**：
  - 上：定义框（cyan 边框 + 关键词 amber）
  - 中：6 个 primitive 网格（2x3 或 3x2），每格 keyword + 描述
  - 下：vs 对比框（Cron vs Loop）
- **右 30%**：分子对照表（green vs red）+ 适合/不适合 Loop 列表
- **底部**：以前 → 后来 → 现在 三段叙事

**代表 slide**：19（Loop Engineering · 可持续工作的 Agent 控制面）

**HTML 骨架**：
```html
<section class="slide" data-kind="progression-dense">
  <!-- 顶部 4 阶段 -->
  <div class="progression-strip">
    <div class="strip-title">
      <span class="en">AI CODING · 抽象层级演进</span>
      <span class="flow-label">Prompt → Context → Harness → Loop</span>
    </div>
    <div class="strip-stages">
      <div class="stage" data-stage="01">
        <span class="num">01</span>
        <span class="t">Prompt Engineering</span>
        <span class="st">怎么说清楚</span>
        <span class="d">单次调用·角色设定·few-shot</span>
      </div>
      <span class="arrow">→</span>
      <div class="stage" data-stage="02">
        <span class="num">02</span>
        <span class="t">Context Engineering</span>
        <span class="st">给模型看什么</span>
        <span class="d">RAG · repo map · AGENTS.md · skills</span>
      </div>
      <span class="arrow">→</span>
      <div class="stage" data-stage="03">
        <span class="num">03</span>
        <span class="t">Harness Engineering</span>
        <span class="st">让 Agent 可靠行动</span>
        <span class="d">tools · hooks · sandbox · subagents · feedback</span>
      </div>
      <span class="arrow">→</span>
      <div class="stage highlight" data-stage="04">
        <span class="num">04</span><span class="star">★</span>
        <span class="t">Loop Engineering</span>
        <span class="st">持续工作的控制面</span>
        <span class="d">发现·分流·验证·沉淀·决定</span>
      </div>
    </div>
  </div>

  <div class="dense-split">
    <!-- 左 -->
    <div class="col-left">
      <!-- 定义框 -->
      <div class="def-box">
        <div class="box-title"><span class="en">什么是 LOOP ENGINEERING?</span><span class="sub">Harness 之上的控制面</span></div>
        <p><b style="color:var(--cyan)">Harness</b> 是 Agent 的运行环境 —— 把模型包进工具、上下文、权限、hooks、sandbox、日志和恢复路径里。</p>
        <p><b style="color:var(--green)">Loop</b> 是 Harness 之上的持续控制流程 —— 它不再让人持续 prompt agent，而是设计让系统自己发现工作、分派任务、检查结果、记录状态，再决定下一步。</p>
        <blockquote>AI Coding 的竞争点正在从"模型会不会写代码"，转向"系统能不能让 Agent 在真实工程约束里持续推进"。</blockquote>
      </div>

      <!-- 6 primitive -->
      <div class="primitive-grid">
        <div class="pg-title"><span class="en">六个 PRIMITIVE</span><span class="sub">组成持续工作的 loop</span></div>
        <div class="pg-cells">
          <div class="pg-cell"><b>Automations</b> 定时发现与分流 — loop 的"眼睛"</div>
          <div class="pg-cell"><b>Worktrees</b> 隔离并行任务，互不踩脚</div>
          <div class="pg-cell"><b>Skills</b> 沉淀项目知识，下次直接用</div>
          <div class="pg-cell"><b>Plugins</b> 接入外部系统（issue / CI / 消息）</div>
          <div class="pg-cell"><b>Subagents</b> 任务分派与并发</div>
          <div class="pg-cell"><b>State</b> 上一轮结果成为下一轮输入</div>
        </div>
      </div>

      <!-- vs 对比 -->
      <div class="vs-box">
        <div class="vs-title">LOOP ≠ CRON</div>
        <div class="vs-pairs">
          <div class="vs-side cron"><b>Cron</b><p>固定时间触发，无上下文，不理解状态—"到点就执行"</p></div>
          <div class="vs-mid">vs</div>
          <div class="vs-side loop"><b>Loop</b><p>会话内状态驱动，继承上下文、MCP、Skills — "看到这个状态后，下一步该做什么"</p></div>
        </div>
      </div>
    </div>

    <!-- 右 -->
    <div class="col-right">
      <div class="cmp-table">
        <div class="cmp-title"><span class="en">HARNESS VS LOOP</span><span class="sub">分子对照</span></div>
        <div class="cmp-row header"><span></span><span>关注点</span><span>单次行动的可靠性</span><span>持续推进的可靠性</span></div>
        <div class="cmp-row"><span class="k">关注点</span><span class="c1">单次行动的可靠性</span><span class="c2">持续推进的可靠性</span></div>
        <div class="cmp-row"><span class="k">如果缺对分</span><span class="c1">仍需要人持续点火、分派、验收</span><span class="c2">只是反复调用模型，没有工程底座</span></div>
      </div>

      <div class="suit-grid">
        <div class="suit ok">
          <div class="h"><span class="ic">✓</span> 适合 Loop <span class="sub">每轮产生新证据</span></div>
          <ul><li><b>CI 自修复</b><span>日志天然传感器·结果明确</span></li><li><b>PR 托管</b><span>GitHub API 提供外部状态源</span></li><li><b>依赖升级</b><span>测试绿/红是一值信号</span></li><li><b>文档同步</b><span>diff 精确检视差异</span></li><li><b>日志巡检</b><span>错误事件可检测可量化</span></li><li><b>长测试分析</b><span>报告 = 结构化输入</span></li></ul>
        </div>
        <div class="suit bad">
          <div class="h"><span class="ic">✗</span> 不适合 Loop <span class="sub">缺少验证闭环 + 权限风险</span></div>
          <ul><li><b>目标空泛的大重构</b><span>"把架构优化一下" → 缺少外部完成标准</span></li><li><b>生产权限链路</b><span>能写消息、改 issue、push branch；部署服务</span></li><li><b>支付 / 安全链路</b><span>安全链路不允许首跑，默认应只读</span></li></ul>
        </div>
      </div>

      <div class="narrative">
        <span class="phase old">以前 · 我们写代码</span>
        <span class="phase mid">后来 · 我们提示模型写代码</span>
        <span class="phase now">现在 · 我们设计让模型持续工作的系统</span>
      </div>
    </div>
  </div>
</section>
```

**CSS 关键样式**：
```css
.progression-strip { padding: 12px 16px; border: 1px solid rgba(92,225,255,0.2); border-radius: 6px; }
.strip-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
.strip-title .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.strip-title .flow-label { font: 11px var(--font-mono); color: var(--text-dim); }
.strip-stages { display: grid; grid-template-columns: 1fr 16px 1fr 16px 1fr 16px 1fr; gap: 8px; align-items: stretch; }
.stage { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; display: flex; flex-direction: column; gap: 3px; }
.stage .num { font: 700 11px var(--font-mono); color: var(--green); }
.stage .t { font: 700 14px var(--font-display); color: var(--text); }
.stage .st { font: 11px var(--font-mono); color: var(--cyan); }
.stage .d { font: 10px/1.4 var(--font-mono); color: var(--text-dim); }
.stage.highlight { border-color: var(--green); box-shadow: 0 0 24px rgba(0,255,156,0.15); }
.stage.highlight .star { color: var(--green); margin-left: 4px; }
.strip-stages .arrow { color: var(--amber); font-size: 18px; align-self: center; text-align: center; }

.dense-split { display: grid; grid-template-columns: 7fr 3fr; gap: 16px; flex: 1; min-height: 0; margin-top: 12px; }
.def-box { padding: 12px 16px; border: 1px solid rgba(92,225,255,0.2); border-radius: 6px; font: 12px/1.7 var(--font-sans); color: var(--text-dim); }
.def-box p { margin: 6px 0; }
.def-box blockquote { margin: 8px 0 0; padding-left: 12px; border-left: 2px solid var(--accent); color: var(--text); }
.box-title { display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(92,225,255,0.12); }
.box-title .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.box-title .sub { font: 11px var(--font-mono); color: var(--text-dim); }

.primitive-grid { margin-top: 10px; }
.pg-title { display: flex; justify-content: space-between; margin-bottom: 8px; }
.pg-title .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.pg-cells { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
.pg-cell { padding: 8px 10px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; font: 11px/1.5 var(--font-mono); color: var(--text-dim); }
.pg-cell b { color: var(--green); display: inline-block; min-width: 90px; }

.vs-box { margin-top: 10px; padding: 10px 12px; border: 1px solid rgba(255,176,32,0.2); border-radius: 6px; }
.vs-title { font: 700 12px var(--font-mono); color: var(--amber); margin-bottom: 8px; }
.vs-pairs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 12px; align-items: center; }
.vs-side { font: 11px/1.5 var(--font-sans); color: var(--text-dim); }
.vs-side b { color: var(--amber); display: block; margin-bottom: 4px; font: 700 13px var(--font-mono); }
.vs-side.loop b { color: var(--green); }
.vs-mid { color: var(--text-dim); font: 700 14px var(--font-mono); }

.col-right { display: flex; flex-direction: column; gap: 10px; }
.cmp-table { border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px 12px; }
.cmp-title { display: flex; justify-content: space-between; padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.cmp-title .en { font: 700 12px var(--font-mono); color: var(--cyan); }
.cmp-title .sub { font: 11px var(--font-mono); color: var(--text-dim); }
.cmp-row { display: grid; grid-template-columns: 80px 1fr 1fr; gap: 8px; padding: 4px 0; font: 11px var(--font-mono); }
.cmp-row .k { color: var(--amber); font-weight: 700; }
.cmp-row .c1 { color: var(--pink); }
.cmp-row .c2 { color: var(--green); }

.suit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.suit { padding: 8px 10px; border-radius: 4px; }
.suit.ok { border: 1px solid var(--green); }
.suit.bad { border: 1px solid var(--pink); }
.suit .h { font: 700 11px var(--font-mono); display: flex; justify-content: space-between; margin-bottom: 6px; }
.suit.ok .h { color: var(--green); }
.suit.bad .h { color: var(--pink); }
.suit .h .ic { font-weight: 700; }
.suit ul { list-style: none; padding: 0; margin: 0; font: 10px/1.6 var(--font-mono); color: var(--text-dim); }
.suit li { padding: 2px 0; display: flex; gap: 6px; }
.suit li b { color: var(--text); min-width: 88px; }

.narrative { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 8px; }
.narrative .phase { padding: 8px; border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; font: 11px var(--font-mono); text-align: center; color: var(--text-dim); }
.narrative .now { border-color: var(--green); color: var(--green); border-style: solid; }
```

---

## A4. transformSideBySide

**适用场景**：表达"传统做法 vs 未来形态"的对比，含中间过渡、Core Formula、症状与团队转变注解。

**视觉锚点**：
- **左栏 AS-IS（粉）**：标题 + 5 段垂直流程，每段有方块步骤编号 + 转换词 + 输出标签 + BOTTLENECK 高亮
- **中**：垂直 `TRANSFORM` 文字 + 上下双箭头（amber 三角）
- **右栏 TO-BE（绿）**：4 阶段 2x2 网格（SPEC/PAIR DEV/SHIP & LEARN/REVIEW），每格带角色徽章 + `AI CLARIFY/AI OPS/AI CODE/AI TEST` 标签 + OUT 注释
- **右侧中心**：CORE FORMULA 公式盒：`AI 全栈小队 = 人 × AI × Spec`（绿色虚线边框）
- **右顶部**：spec/pair dev/review/ship 4 个 status pill
- **底部**：`// 症状`（粉）+ `// TEAM SHIFT` + `// WHY FASTER`（琥珀）三段注解
- **中下**：症状行用粉色 strikethrough 强调"交接和损耗"

**代表 slide**：22（传统团队转型 AI 产品研发团队）

**HTML 骨架**：
```html
<section class="slide" data-kind="transform-side-by-side">
  <div class="transform-grid">
    <!-- 左 AS-IS -->
    <aside class="as-is">
      <header class="pane-h pink">
        <span class="en">AS-IS · LEGACY TEAM</span>
        <span class="zh">传统团队</span>
        <span class="badge">按工种切分</span>
      </header>
      <p class="sub">六段式瀑布 · 输出物逐环节交接</p>

      <div class="vertical-flow">
        <div class="step">
          <span class="square"></span>
          <span class="num">01</span>
          <div class="step-body">
            <div class="step-name">产品</div>
            <div class="step-action">→ PRD / 需求</div>
            <span class="out-tag">DEFINE</span>
            <div class="step-note">说明</div>
          </div>
        </div>
        <div class="step">
          <span class="square"></span>
          <span class="num">02</span>
          <div class="step-body">
            <div class="step-name">设计</div>
            <div class="step-action">→ 原型 / UI</div>
            <span class="out-tag">DESIGN</span>
            <div class="step-note">设计稿</div>
          </div>
        </div>
        <div class="step bottleneck">
          <span class="square"></span>
          <span class="num">03</span>
          <div class="step-body">
            <div class="step-name">研发经理</div>
            <div class="step-action">→ 技术方案 / 架构设计</div>
            <span class="out-tag warn">BOTTLENECK</span>
            <div class="step-note"></div>
          </div>
        </div>
        <div class="step">
          <span class="square"></span>
          <span class="num">04</span>
          <div class="step-body">
            <div class="step-name">研发</div>
            <div class="step-action">→ 代码包 / 接口</div>
            <span class="out-tag">BUILD</span>
            <div class="step-note">服务</div>
          </div>
        </div>
        <div class="step">
          <span class="square"></span>
          <span class="num">05</span>
          <div class="step-body">
            <div class="step-name">测试</div>
            <div class="step-action">→ 测试报告 / 缺陷清单</div>
            <span class="out-tag">VERIFY</span>
            <div class="step-note"></div>
          </div>
        </div>
      </div>

      <div class="symptom">
        <span class="label">// 症状</span>
        <p><s style="color:var(--pink)">交接和损耗</s> · <s style="color:var(--pink)">单点即瓶颈</s> · <s style="color:var(--pink)">任务一次性和，全链路停摆</s></p>
      </div>
    </aside>

    <!-- 中 TRANSFORM -->
    <div class="transform-divider">
      <div class="arrow up">▲</div>
      <div class="label">TRANSFORM</div>
      <div class="arrow down">▼</div>
    </div>

    <!-- 右 TO-BE -->
    <section class="to-be">
      <header class="pane-h green">
        <span class="en">TO-BE · AI-NATIVE SQUAD</span>
        <span class="zh">AI 全栈团队</span>
        <span class="badge">按需求闭环切分</span>
      </header>
      <p class="sub">一支小队吃掉一个需求 · 节奏：天 / 小时级</p>

      <div class="stage-pills">
        <span class="pill">SPEC</span>
        <span class="pill">PAIR DEV</span>
        <span class="pill">REVIEW</span>
        <span class="pill">SHIP</span>
      </div>

      <div class="quad-grid">
        <div class="quad" data-pos="tl">
          <span class="badge">01 · SPEC</span>
          <span class="compass">NW</span>
          <div class="quad-body">
            <h4>定义</h4>
            <p>先把目标、边界、验收说清</p>
            <div class="role-chips"><span>产品</span><span>设计</span><span>研发经理</span><span class="ai">AI CLARIFY</span></div>
            <p class="out">OUT · Spec · 原型草图 · 验收口径</p>
          </div>
        </div>
        <div class="quad" data-pos="tr">
          <span class="badge">02 · PAIR DEV</span>
          <span class="compass">NE</span>
          <div class="quad-body">
            <h4>并行产出</h4>
            <p>主力研发拉着 AI 一起写</p>
            <div class="role-chips"><span>研发</span><span>设计</span><span class="ai">AI CODE</span><span class="ai">AI TEST</span></div>
            <p class="out">OUT · 代码 · 接口文档 · 测试草稿</p>
          </div>
        </div>
        <!-- 中心 CORE FORMULA -->
        <div class="formula-box">
          <span class="formula-tag">CORE FORMULA</span>
          <div class="formula">AI <span class="hl">全栈小队</span></div>
          <div class="formula-eq"><span>人</span> × <span>AI</span> × <span>Spec</span></div>
          <div class="formula-sub">CLOSED LOOP ↻</div>
        </div>
        <div class="quad" data-pos="bl">
          <span class="badge">04 · SHIP & LEARN</span>
          <span class="compass">SW</span>
          <div class="quad-body">
            <h4>发布与回流</h4>
            <p>反馈回流下一版 Spec</p>
            <div class="role-chips"><span>运维</span><span>产品</span><span>研发</span><span class="ai">AI OPS</span></div>
            <p class="out">OUT · 灰度版本 · 监控指标 · 用户反馈</p>
          </div>
        </div>
        <div class="quad" data-pos="br">
          <span class="badge">03 · REVIEW</span>
          <span class="compass">SE</span>
          <div class="quad-body">
            <h4>质量前置</h4>
            <p>AI 先扫规则，人做关键判断</p>
            <div class="role-chips"><span>研发经理</span><span>测试</span><span class="ai">AI CR</span><span class="ai">AI QA</span></div>
            <p class="out">OUT · CR 结论 · 风险清单 · 回归结果</p>
          </div>
        </div>
      </div>

      <div class="footer-notes">
        <div class="note shift"><span class="lbl">// TEAM SHIFT</span><span>产品、设计、研发、测试、运维没有消失——从"部门排队交接"变成"小队里动态切换主次"。</span></div>
        <div class="note why"><span class="lbl">// WHY FASTER</span><span>需求先规约 · 开发带测试 · 上线带反馈，周期从属级串行一天 / 小时级闭环。</span></div>
      </div>
    </section>
  </div>
</section>
```

**CSS 关键样式**：
```css
.transform-grid { display: grid; grid-template-columns: 1fr 56px 1.4fr; gap: 12px; height: 100%; }
.as-is, .to-be { border-radius: 6px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.as-is { border: 1px solid rgba(255,46,136,0.3); background: rgba(255,46,136,0.04); }
.to-be { border: 1px solid rgba(0,255,156,0.25); background: rgba(0,255,156,0.03); }
.pane-h { display: flex; gap: 12px; align-items: baseline; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.pane-h.pink .en { color: var(--pink); }
.pane-h.green .en { color: var(--green); }
.pane-h .en { font: 700 13px var(--font-mono); letter-spacing: 1.5px; }
.pane-h .zh { font: 14px var(--font-display); color: var(--text); }
.pane-h .badge { font: 10px var(--font-mono); padding: 2px 8px; border-radius: 3px; margin-left: auto; }
.pane-h.pink .badge { color: var(--pink); border: 1px solid var(--pink); }
.pane-h.green .badge { color: var(--green); border: 1px solid var(--green); }
.sub { font: 11px var(--font-sans); color: var(--text-dim); margin: 0; }

.vertical-flow { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.step { display: grid; grid-template-columns: 18px 32px 1fr; gap: 8px; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.06); align-items: start; }
.step .square { width: 10px; height: 10px; border: 2px solid var(--pink); margin-top: 4px; }
.step .num { font: 700 12px var(--font-mono); color: var(--pink); }
.step-body { display: grid; grid-template-columns: 80px 1fr auto; gap: 8px; align-items: center; }
.step-name { font: 700 13px var(--font-display); color: var(--text); }
.step-action { font: 11px var(--font-mono); color: var(--pink); }
.out-tag { font: 700 9px var(--font-mono); color: var(--text-dim); padding: 1px 5px; border: 1px solid var(--text-dim); border-radius: 2px; letter-spacing: 0.5px; }
.out-tag.warn { color: var(--amber); border-color: var(--amber); }
.step.bottleneck { background: rgba(255,46,136,0.08); padding-left: 8px; margin-left: -8px; }
.step-note { grid-column: 1 / -1; font: 10px var(--font-sans); color: var(--text-dim); margin-top: 2px; }

.symptom { padding: 8px 10px; border-top: 1px solid rgba(255,46,136,0.2); font: 11px/1.5 var(--font-sans); color: var(--text-dim); }
.symptom .label { color: var(--pink); font: 700 11px var(--font-mono); display: block; margin-bottom: 4px; }
.symptom p { margin: 0; }

.transform-divider { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.transform-divider .label { writing-mode: vertical-rl; font: 700 12px var(--font-mono); color: var(--amber); letter-spacing: 4px; }
.transform-divider .arrow { color: var(--amber); font-size: 16px; }

.stage-pills { display: flex; gap: 6px; }
.stage-pills .pill { font: 700 10px var(--font-mono); padding: 2px 8px; border: 1px solid var(--green); color: var(--green); border-radius: 3px; }
.stage-pills .pill:nth-child(3) { color: var(--amber); border-color: var(--amber); }

.quad-grid {
  position: relative; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; flex: 1;
}
.quad { border: 1px solid rgba(0,255,156,0.18); border-radius: 4px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; }
.quad .badge { font: 700 10px var(--font-mono); color: var(--green); letter-spacing: 1px; }
.quad .compass { font: 9px var(--font-mono); color: var(--text-dim); margin-left: auto; }
.quad .quad-body h4 { font: 700 16px var(--font-display); color: var(--text); margin: 0; }
.quad .quad-body p { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 2px 0; }
.role-chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.role-chips span { font: 9px var(--font-mono); padding: 1px 5px; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; color: var(--text-dim); }
.role-chips span.ai { color: var(--green); border-color: var(--green); }
.quad .out { font: 10px var(--font-mono); color: var(--cyan); margin: 4px 0 0; }

.formula-box {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  border: 1px dashed var(--green); padding: 14px 24px; text-align: center;
  background: rgba(6,10,20,0.92); border-radius: 6px; box-shadow: 0 0 32px rgba(0,255,156,0.25);
}
.formula-tag { font: 700 9px var(--font-mono); color: var(--green); letter-spacing: 2px; }
.formula { font: 700 20px var(--font-display); color: var(--text); margin-top: 4px; }
.formula .hl { color: var(--green); }
.formula-eq { font: 700 16px var(--font-mono); color: var(--cyan); margin-top: 4px; }
.formula-eq span { padding: 2px 6px; border: 1px solid var(--cyan); border-radius: 3px; margin: 0 2px; }
.formula-sub { font: 9px var(--font-mono); color: var(--green); margin-top: 4px; letter-spacing: 1px; }

.footer-notes { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
.footer-notes .note { padding: 8px 10px; border-left: 2px solid; font: 11px/1.5 var(--font-sans); color: var(--text-dim); }
.footer-notes .shift { border-color: var(--green); }
.footer-notes .why { border-color: var(--amber); }
.footer-notes .lbl { font: 700 10px var(--font-mono); display: block; margin-bottom: 2px; }
.footer-notes .shift .lbl { color: var(--green); }
.footer-notes .why .lbl { color: var(--amber); }
```

---

## A5. timelineLadder + antiPatternRow

**适用场景**：表达"分阶段转型路径"，强调"不可跳级"，底部给出常见反模式警告。

**视觉锚点**：
- **顶部**：标题"三阶段 · 不可跳级"（"不可跳级"绿字 glow）
- **左侧时间轴**：3 个 milestone（◇ T+0 NOW / ◇ T+6M CONSOLIDATE / ◇ T+18M RESHAPE），右下标"0-3M"、"大多数团队"等
- **主体 3 段堆叠卡**：每段 01/02/03 + 主题名（Adoption / Integration / Reshape）+ 描述 + 3 个 bullet + 右栏 NORTH-STAR KPI（绿）+ EXIT CRITERIA（绿虚框）
- **段间红框警告**：`⚠ SKIP = FAIL · 先 01 再 02` / `⚠ SKIP = FAIL · 先 02 再 03`
- **底部 anti-pattern 行**：粉色边框 3 列 "01→03 / 02→03 / 停在 01"，每列配简短描述

**代表 slide**：23（三阶段 · 不可跳级）

**HTML 骨架**：
```html
<section class="slide" data-kind="timeline-ladder">
  <h1 class="slide-title">三阶段 · <span class="accent">不可跳级</span></h1>
  <div class="caption-row"><span class="en">TIMELINE</span></div>

  <div class="ladder-wrap">
    <!-- 左侧时间轴 -->
    <div class="timeline-rail">
      <div class="t-node" data-t="0">
        <span class="rhombus">◇</span>
        <span class="t">T+0</span>
        <span class="sub">NOW · 0-3M</span>
        <span class="hint">大多数团队</span>
      </div>
      <div class="t-node" data-t="6"><span class="rhombus">◇</span><span class="t">T+6M</span><span class="sub">CONSOLIDATE</span></div>
      <div class="t-node" data-t="18"><span class="rhombus">◇</span><span class="t">T+18M</span><span class="sub">RESHAPE</span></div>
    </div>

    <!-- 主体阶段卡 -->
    <div class="stage-cards">
      <div class="stage-card" data-stage="01">
        <div class="card-head">
          <span class="badge">01</span>
          <span class="action-tag">ADOPT</span>
          <h3>工具导入 · Adoption</h3>
          <span class="tagline">先解决"去哪里找上下文"</span>
        </div>
        <p class="stage-desc">让每个研发手上都有一把 AI 武器，建立"AI 在身边"的工作直觉。</p>
        <ul class="bullets">
          <li><b>IDE 插件铺开</b>：补全 / 对话 / 代码解释，覆盖率先于深度</li>
          <li><b>场景卡点</b>：写单元测试、改 legacy 代码、写注释，三件先做</li>
          <li><b>度量进场</b>：安装率 → 活跃率 → 采纳率 → 留存率 四道水位线</li>
        </ul>
        <div class="card-foot">
          <div class="kpi"><span class="lbl">NORTH-STAR KPI</span><span class="v">人均省 30 min/日</span></div>
          <div class="exit"><span class="lbl">EXIT CRITERIA</span><p>周活 &gt; 70% · 采纳率 &gt; 30% · 老板能从看板看到数字</p></div>
        </div>
      </div>

      <div class="skip-warn">⚠ SKIP = FAIL · 先 01 再 02</div>

      <div class="stage-card" data-stage="02">
        <div class="card-head">
          <span class="badge">02</span>
          <span class="action-tag">INTEGRATE</span>
          <h3>流程重构 · Integration</h3>
          <span class="tagline">别让旧经验拖累新模型</span>
        </div>
        <p class="stage-desc">AI 从"个人工具"变成"工程链路的一环"：需求、代码、测试、上线都被它穿起来。</p>
        <ul class="bullets">
          <li><b>Spec-kit 进研发</b>：需求/设计文档成为 AI 和人共读的上下文</li>
          <li><b>CR / 测试 / 文档同轨</b>：AI CR 前置门禁 + AI 用例生成 + 自动同步文档</li>
          <li><b>MCP 统一上下文</b>：TAPD / 工蜂 / CNB 串成一条研发流水线</li>
        </ul>
        <div class="card-foot">
          <div class="kpi"><span class="lbl">NORTH-STAR KPI</span><span class="v">交付周期 ↓40%</span></div>
          <div class="exit"><span class="lbl">EXIT CRITERIA</span><p>AI 进入 CI/CD · SOP 被改写 · 关键链路 不可回退</p></div>
        </div>
      </div>

      <div class="skip-warn">⚠ SKIP = FAIL · 先 02 再 03</div>

      <div class="stage-card" data-stage="03">
        <div class="card-head">
          <span class="badge">03</span>
          <span class="action-tag">RESHAPE</span>
          <h3>组织重塑 · Reshape</h3>
          <span class="tagline">把个人技巧变成组织资产</span>
        </div>
        <p class="stage-desc">人均产能被 AI 抬升后，团队形状必须变：角色边界、编制、招聘、绩效一起改。</p>
        <ul class="bullets">
          <li><b>能力重组</b>：PM / Dev / Tech Lead / DevOps 向 Spec / Pair / Review / Enable 演化</li>
          <li><b>编制压扁</b>：打通业务-研发，"更小团队 × 更大交付"</li>
          <li><b>招聘重写</b>：从"会某语言"到"能和 AI 共同产出"，JD 里出现 Spec / MCP / Skills</li>
        </ul>
        <div class="card-foot">
          <div class="kpi"><span class="lbl">NORTH-STAR KPI</span><span class="v amber">人均交付 ×2</span></div>
          <div class="exit"><span class="lbl">EXIT CRITERIA</span><p>岗位说明 / 绩效 / 晋升 三件套已被 AI 原生化</p></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部反模式 -->
  <footer class="anti-pattern">
    <span class="ap-label">ANTI-PATTERN</span>
    <span class="ap-title">跳级 = 一地鸡毛</span>
    <div class="ap-cols">
      <div class="ap-col"><b>01 → 03</b><p>工具还没用熟就谈"组织变革"，招 AI 原生结果没人带得动</p></div>
      <div class="ap-col"><b>02 → 03</b><p>流程没打通就改编制，角色定义悬空，交接更乱</p></div>
      <div class="ap-col"><b>停在 01</b><p>永远"人均省 30 分钟"，省下的时间进不了交付</p></div>
    </div>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.slide-title { font: 700 32px var(--font-display); color: var(--text); margin: 0 0 16px; }
.slide-title .accent { color: var(--green); text-shadow: 0 0 24px rgba(0,255,156,0.5); }
.caption-row { margin-bottom: 8px; }
.caption-row .en { font: 700 11px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }

.ladder-wrap { display: grid; grid-template-columns: 100px 1fr; gap: 12px; flex: 1; min-height: 0; }
.timeline-rail { display: flex; flex-direction: column; gap: 20px; padding-top: 8px; }
.t-node { display: flex; flex-direction: column; gap: 2px; padding-left: 4px; position: relative; }
.t-node .rhombus { color: var(--cyan); font-size: 14px; }
.t-node .t { font: 700 13px var(--font-mono); color: var(--cyan); }
.t-node .sub { font: 10px var(--font-mono); color: var(--text-dim); letter-spacing: 1px; }
.t-node .hint { font: 10px var(--font-mono); color: var(--amber); border: 1px solid var(--amber); padding: 1px 4px; border-radius: 2px; margin-top: 2px; align-self: flex-start; }

.stage-cards { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.stage-card { border: 1px solid rgba(0,255,156,0.18); border-radius: 6px; padding: 12px 16px; display: grid; grid-template-columns: 1fr 220px; gap: 16px; }
.stage-card .card-head { grid-column: 1 / -1; display: flex; gap: 10px; align-items: baseline; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.stage-card .badge { font: 700 18px var(--font-mono); color: var(--green); }
.stage-card .action-tag { font: 700 10px var(--font-mono); color: var(--cyan); padding: 1px 6px; border: 1px solid var(--cyan); border-radius: 2px; letter-spacing: 1px; }
.stage-card h3 { font: 700 16px var(--font-display); color: var(--text); margin: 0; }
.stage-card .tagline { font: 11px var(--font-mono); color: var(--text-dim); margin-left: auto; }
.stage-card .stage-desc { font: 12px/1.5 var(--font-sans); color: var(--text-dim); margin: 4px 0; grid-column: 1; }
.stage-card .bullets { list-style: none; padding: 0; margin: 0; font: 11px/1.7 var(--font-sans); color: var(--text-dim); grid-column: 1; }
.stage-card .bullets b { color: var(--green); }
.stage-card .card-foot { grid-row: 2 / span 2; grid-column: 2; display: flex; flex-direction: column; gap: 8px; }
.stage-card .kpi { padding: 8px 10px; border: 1px solid rgba(0,255,156,0.2); border-radius: 4px; }
.stage-card .kpi .lbl { display: block; font: 700 9px var(--font-mono); color: var(--green); letter-spacing: 1.5px; }
.stage-card .kpi .v { display: block; font: 700 18px var(--font-display); color: var(--green); margin-top: 2px; }
.stage-card .kpi .v.amber { color: var(--amber); }
.stage-card .exit { padding: 8px 10px; border: 1px dashed rgba(0,255,156,0.3); border-radius: 4px; }
.stage-card .exit .lbl { display: block; font: 700 9px var(--font-mono); color: var(--green); letter-spacing: 1.5px; }
.stage-card .exit p { font: 10px/1.5 var(--font-sans); color: var(--text-dim); margin: 4px 0 0; }

.skip-warn { text-align: center; font: 700 11px var(--font-mono); color: var(--pink); padding: 4px 0; border: 1px solid rgba(255,46,136,0.4); border-radius: 4px; background: rgba(255,46,136,0.06); margin: 2px 16px; }

.anti-pattern { border: 1px solid var(--pink); border-radius: 6px; padding: 10px 16px; display: grid; grid-template-columns: auto auto 1fr; gap: 16px; align-items: center; margin-top: 12px; }
.anti-pattern .ap-label { font: 700 10px var(--font-mono); color: var(--pink); letter-spacing: 1.5px; }
.anti-pattern .ap-title { font: 700 14px var(--font-display); color: var(--pink); }
.anti-pattern .ap-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.anti-pattern .ap-col b { display: block; color: var(--pink); font: 700 11px var(--font-mono); margin-bottom: 2px; }
.anti-pattern .ap-col p { font: 11px/1.4 var(--font-sans); color: var(--text-dim); margin: 0; }
```

---

## A6. roleMatrix 6-grid

**适用场景**：表达"一个工作流上 6 个角色的能力重组"，每角色按 KEEP / SHRINK / AI TAKES / NEW 四象限重塑。

**视觉锚点**：
- **顶部**：`AI-NATIVE PIPELINE  01 需求 › 02 架构 › 03 研发 › 04 质量 › 05 PM › 06 运维` 流程条
- **主体 2x3 grid**：6 张角色卡（NEED / DESIGN / BUILD / VERIFY / PM ORCHESTRATE / RUN）
  - 每卡顶部：编号 + 子标题（如 `PM — 需求分析 »»»`）+ 角色名 + CONTEXT OWNER 描述
  - 每卡底部：`AI === L1/L2/L3  LABEL → LABEL` 进度条
  - 每卡内 4 象限：KEEP / SHRINK / AI TAKES / NEW
- **底部**：RESHAPE AXIONS 公理条 4 列（"不是偷加法 / 不是做减法 / 不是裁员 / 不是改 title"）

**代表 slide**：24（全流程六工种的能力重组）

**HTML 骨架**：
```html
<section class="slide" data-kind="role-matrix">
  <header class="pipeline-bar">
    <span class="en">AI-NATIVE PIPELINE</span>
    <span class="step">01 需求 ›</span>
    <span class="step">02 架构 ›</span>
    <span class="step">03 研发 ›</span>
    <span class="step">04 质量 ›</span>
    <span class="step">05 PM ›</span>
    <span class="step">06 运维</span>
  </header>

  <div class="role-grid">
    <div class="role-card" data-pos="01">
      <header class="rc-head">
        <span class="rc-id">01 · NEED</span>
        <span class="rc-sub">PM — 需求分析 »»»</span>
        <span class="rc-tag">CONTEXT OWNER</span>
      </header>
      <h3 class="rc-name">上下文负责人</h3>
      <p class="rc-desc">让 AI 和人共读同一份"要做什么"—从写 PRD，到维护一份能被 Agent 执行的规约。</p>
      <div class="rc-progress">AI <span class="bar l2"></span> L2 <span class="bar prd"></span> PRD → SPEC</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>业务抽象 · 价值判断 · 多方对齐</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>手写长 PRD—画静态原型—人肉维护需求追踪表</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>PRD 排版 · 用例穷举 · 竞品调研 · 验收标准</p></div>
        <div class="quad-cell new"><b>NEW</b><p>写 Spec / Plan / Tasks · 给 AI 注入业务上下文 · 管 Prompt 资产</p></div>
      </div>
    </div>

    <div class="role-card" data-pos="02">
      <header class="rc-head">
        <span class="rc-id">02 · DESIGN</span>
        <span class="rc-sub">架构师 — 技术负责 »»»</span>
        <span class="rc-tag">SPEC ARCHITECT</span>
      </header>
      <h3 class="rc-name">规约架构师</h3>
      <p class="rc-desc">交付物从一张图，变成"Agent 能直接照着干"的规范与约束集合。</p>
      <div class="rc-progress">AI <span class="bar l2"></span> L2 <span class="bar doc"></span> DOC → RULES</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>系统分解 · 技术选型 · 跨域权衡</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>画几十页 Wiki 设计文档—口头传达架构红线</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>接口草稿 · ER 图 · 时序图 · 方案对比</p></div>
        <div class="quad-cell new"><b>NEW</b><p>定 架构 Rules / 约束库 · 设计多 Agent 拓扑 · 写可执行 Plan</p></div>
      </div>
    </div>

    <div class="role-card" data-pos="03">
      <header class="rc-head">
        <span class="rc-id">03 · BUILD</span>
        <span class="rc-sub">一线研发 / 前后端 »»»</span>
        <span class="rc-tag">AI PAIR DEV</span>
      </header>
      <h3 class="rc-name">人机结对研发</h3>
      <p class="rc-desc">最小单位从"行代码"变成"一个任务"—自写 10%，指挥 Agent 写 90%，对结果负全责。</p>
      <div class="rc-progress">AI <span class="bar l3"></span> L3 <span class="bar manual"></span> MANUAL → POLICY</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>领域建模 · 性能与稳定性判断 · 端到端掌控</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>初级 CRUD—纯脚本外包—靠记 API 吃饭的工程师</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>样板代码 · 跨文件重构 · 单元测试 · 文档同步</p></div>
        <div class="quad-cell new"><b>NEW</b><p>写 Prompt / Rules · 审 AI 代码 · 端谱多 Agent · 对任务级交付负责</p></div>
      </div>
    </div>

    <div class="role-card" data-pos="04">
      <header class="rc-head">
        <span class="rc-id">04 · VERIFY</span>
        <span class="rc-sub">QA 一线测试 / TECH LEAD »»»</span>
        <span class="rc-tag">QUALITY GATEKEEPER</span>
      </header>
      <h3 class="rc-name">质量守门人</h3>
      <p class="rc-desc">产出 ×10，同质同步放大于一寸门员权重第一次真正过到实手，靠"跳坑"而不是"点检"。</p>
      <div class="rc-progress">AI <span class="bar l3"></span> L3 <span class="bar manual"></span> MANUAL → POLICY</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>测试策略 · 架构把关 · 代码品味 · 团队叙事</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>造工步手册—手写用例库—人肉 Review 块状变更</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>用例生成 · 回归执行 · Lint/安全扫描 · 明亚的 Bug</p></div>
        <div class="quad-cell new"><b>NEW</b><p>写 AI CR 规则集 · 设计门槛策略 · 维护红线/评测集 · 对抗 AI 幻觉</p></div>
      </div>
    </div>

    <div class="role-card" data-pos="05">
      <header class="rc-head">
        <span class="rc-id">05 · ORCHESTRATE</span>
        <span class="rc-sub">PM — 项目统筹 »»»</span>
        <span class="rc-tag">FLOW PM</span>
      </header>
      <h3 class="rc-name">流程编排 PM</h3>
      <p class="rc-desc">核心职责从"同步进度"转向"疏通卡点"：把 AI 流程里需要人判断的节点显式化并持续优化。</p>
      <div class="rc-progress">AI <span class="bar l3"></span> L3 <span class="bar tracking"></span> TRACKING → FLOW..</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>目标拆解 · 优先级判断 · 跨团队协同 · 风险沟通</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>被动催办—人肉抄进度表—靠口头港串联关系</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>例会纪要 · 状态同步 · 里程碑提醒 · 基础看板更新</p></div>
        <div class="quad-cell new"><b>NEW</b><p>设计 人机协同关卡 · 识别卡点并触发升级 · 定义必须人工决策的节点 · 复盘并优化流程强弱</p></div>
      </div>
    </div>

    <div class="role-card" data-pos="06">
      <header class="rc-head">
        <span class="rc-id">06 · RUN</span>
        <span class="rc-sub">平台 / DEVOPS / SRE »»»</span>
        <span class="rc-tag">PLATFORM ENABLER</span>
      </header>
      <h3 class="rc-name">赋能 + 运营</h3>
      <p class="rc-desc">AI 时代的"基础设施"是上下文与能力包—谁把 Skills/MCP/MCP 做好，谁定团队天花板。</p>
      <div class="rc-progress">AI <span class="bar l2"></span> L2 <span class="bar platform"></span> PLATFORM → CONT..</div>
      <div class="quad">
        <div class="quad-cell keep"><b>KEEP</b><p>CI/CD · 环境/权限 · 可用性 · 研发体验</p></div>
        <div class="quad-cell shrink"><b>SHRINK</b><p>人肉抛班盯盘—手敲等 Runbook—一对一工单支持</p></div>
        <div class="quad-cell ai-takes"><b>AI TAKES</b><p>日志根因 · 告警降噪 · 工单答疑 · 运维脚本</p></div>
        <div class="quad-cell new"><b>NEW</b><p>做 Skills / MCP / 评测集 · 接 Agent 沙箱 · 分析 AI 使用数据</p></div>
      </div>
    </div>
  </div>

  <footer class="axions">
    <span class="ax-label">RESHAPE AXIONS</span>
    <span class="ax-title">能力重组，四条公理</span>
    <div class="ax-cols">
      <div class="ax-col"><b>① 不是偷加法</b><p>要给一堆 Prompt·工程师 · 老岗位长出新分支</p></div>
      <div class="ax-col"><b>② 不是做减法</b><p>AI 全栈 ≠ 人啥都不干 · AI 接替重复，人做判断</p></div>
      <div class="ax-col"><b>③ 不是裁员</b><p>接替重复，人做把人从低阶任务提到高阶</p></div>
      <div class="ax-col"><b>④ 不是改 title</b><p>改 JD·就完事 · 工作方式 / 绩效 / 培养 三件套都要改</p></div>
    </div>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.pipeline-bar { display: flex; gap: 14px; align-items: center; padding: 8px 14px; border: 1px solid rgba(92,225,255,0.2); border-radius: 6px; margin-bottom: 14px; font: 12px var(--font-mono); }
.pipeline-bar .en { color: var(--cyan); font-weight: 700; letter-spacing: 1.5px; }
.pipeline-bar .step { color: var(--text-dim); }
.pipeline-bar .step:not(:last-child)::after { content: ''; }

.role-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px; flex: 1; }
.role-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px; }
.role-card .rc-head { display: flex; gap: 10px; align-items: baseline; padding-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.role-card .rc-id { font: 700 11px var(--font-mono); color: var(--green); letter-spacing: 1px; }
.role-card .rc-sub { font: 11px var(--font-mono); color: var(--cyan); }
.role-card .rc-tag { font: 700 9px var(--font-mono); color: var(--amber); padding: 1px 5px; border: 1px solid var(--amber); border-radius: 2px; margin-left: auto; letter-spacing: 1px; }
.role-card .rc-name { font: 700 16px var(--font-display); color: var(--text); margin: 0; }
.role-card .rc-desc { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.role-card .rc-progress { font: 10px var(--font-mono); color: var(--text-dim); display: flex; align-items: center; gap: 6px; }
.role-card .rc-progress .bar { display: inline-block; height: 6px; background: linear-gradient(90deg, var(--green), var(--cyan)); border-radius: 3px; }
.role-card .rc-progress .bar.l2 { width: 24px; }
.role-card .rc-progress .bar.l3 { width: 36px; }
.role-card .rc-progress .bar.prd { background: var(--cyan); width: 32px; }
.role-card .rc-progress .bar.doc { background: var(--amber); width: 32px; }

.quad { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; flex: 1; margin-top: 4px; }
.quad-cell { padding: 5px 7px; border-radius: 3px; font: 10px/1.4 var(--font-sans); }
.quad-cell b { display: block; font: 700 9px var(--font-mono); letter-spacing: 1px; margin-bottom: 2px; }
.quad-cell.keep { border-left: 2px solid var(--green); }
.quad-cell.keep b { color: var(--green); }
.quad-cell.shrink { border-left: 2px solid var(--pink); }
.quad-cell.shrink b { color: var(--pink); }
.quad-cell.ai-takes { border-left: 2px solid var(--cyan); }
.quad-cell.ai-takes b { color: var(--cyan); }
.quad-cell.new { border-left: 2px solid var(--amber); }
.quad-cell.new b { color: var(--amber); }
.quad-cell p { color: var(--text-dim); margin: 0; }

.axions { display: grid; grid-template-columns: auto auto 1fr; gap: 14px; align-items: center; padding: 10px 14px; border: 1px solid rgba(0,255,156,0.2); border-radius: 6px; margin-top: 12px; }
.axions .ax-label { font: 700 10px var(--font-mono); color: var(--green); letter-spacing: 1.5px; }
.axions .ax-title { font: 700 14px var(--font-display); color: var(--green); }
.axions .ax-cols { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
.axions .ax-col b { display: block; color: var(--amber); font: 700 11px var(--font-mono); margin-bottom: 2px; }
.axions .ax-col p { font: 11px/1.4 var(--font-sans); color: var(--text-dim); margin: 0; }
```

---

## A7. qaGrid 4-col

**适用场景**：一页展示多个并列的 Q&A 主题（如"研发层常见 Q&A"），每列独立编号、问题与多条建议答案，底部给"对答话术"参考。

**视觉锚点**：
- **顶部 summary bar**：`$ field-guide: collab | pr | legacy` 命令样式 + 一句话核心观点 + 讲法提示
- **主体 4 列**：每列
  - 顶部编号徽章（00/01/02/03）+ 类型标签（CONTEXT / WINDOW · COLLAB · PR / REVIEW · LEGACY REFACTOR）
  - 大标题（核心问题）
  - 描述段
  - 4 条编号建议（01-04，每条带边框或灰底）
  - 底部「对答话术」dashed 框
- **底部 progress + objectives**：命令 `$ rollout.ai --mode=team` + 阶段流程 + 目标三件套

**代表 slide**：26（研发层面 Q&A）

**HTML 骨架**：
```html
<section class="slide" data-kind="qa-grid-4col">
  <header class="summary-bar">
    <span class="cmd">$ field-guide: collab | pr | legacy</span>
    <span class="thesis">真正的关键不是让 AI 多生成代码，而是把<em>分工边界、质量前移、渐进式重构</em>设计成一套可复制的研发流程。</span>
    <span class="hint">讲法：先给共同框架，再答协作 / PR / 重构。</span>
  </header>

  <div class="qa-grid">
    <div class="qa-col" data-col="00">
      <header class="qc-head">
        <span class="badge">00</span>
        <span class="tag">CONTEXT / WINDOW</span>
      </header>
      <h3 class="qc-title">长上下文什么时候需要压缩？</h3>
      <p class="qc-desc">回答质量、对话长度、任务切换出现异常信号时，应及时压缩上下文。</p>
      <ol class="qc-answers">
        <li><span class="num">01</span>回答开始重复、遗忘早期细节、出现幻觉或答非所问。</li>
        <li><span class="num">02</span>对话已经过长，继续堆叠会推高 token / credit 并稀释重点。</li>
        <li><span class="num">03</span>任务或话题多次切换，历史上下文开始互相干扰。</li>
        <li><span class="num">04</span>可开启新会话，或用 `/summarize` 保留关键背景，已做决策与待解决问题。</li>
      </ol>
      <div class="qa-script">
        <span class="script-tag">对答话术</span>
        <p>上下文管理的目标不是保留全部信息，而是保留<em>决策、删除噪声</em>。</p>
      </div>
    </div>

    <div class="qa-col" data-col="01">
      <header class="qc-head">
        <span class="badge">01</span>
        <span class="tag">COLLAB</span>
      </header>
      <h3 class="qc-title">多人 / 多团队协作</h3>
      <p class="qc-desc">先拆边界，再让 AI 并行；不要一上来让所有人各写各的。</p>
      <ol class="qc-answers">
        <li><span class="num">01</span>按业务域、目录、接口契约、Owner 拆任务。</li>
        <li><span class="num">02</span>提示词与清单许修改范围与禁止触碰区域。</li>
        <li><span class="num">03</span>生成前先查重：已有组件、工具函数、服务是否可复用。</li>
        <li><span class="num">04</span>用 @文件、Rules、Memory、Skills 统一上下文与规范。</li>
      </ol>
      <div class="qa-script">
        <span class="script-tag">对答话术</span>
        <p>AI 不是各写各的，而是在统一规则下分工会同。</p>
      </div>
    </div>

    <div class="qa-col" data-col="02">
      <header class="qc-head">
        <span class="badge amber">02</span>
        <span class="tag">PR / REVIEW</span>
      </header>
      <h3 class="qc-title">PR 不成为交付瓶颈</h3>
      <p class="qc-desc">把质量检查前移，让 PR 做最终确认，而不是最后补救。</p>
      <ol class="qc-answers">
        <li><span class="num">01</span>复杂任务先让 AI 出 Plan，先粗计划，再写代码。</li>
        <li><span class="num">02</span>控制 PR 粒度：一个 PR 解决一个问题，重构与功能拆开。</li>
        <li><span class="num">03</span>提交前让 AI 生成变更摘要、风险点、测试建议、自检结论。</li>
        <li><span class="num">04</span>人类 Review 聚焦业务正确性、架构边界与长期可维护性。</li>
      </div>
      <div class="qa-script">
        <span class="script-tag">对答话术</span>
        <p>让 AI 做自检与归纳，让人事做高价值判断。</p>
      </div>
    </div>

    <div class="qa-col" data-col="03">
      <header class="qc-head">
        <span class="badge">03</span>
        <span class="tag">LEGACY REFACTOR</span>
      </header>
      <h3 class="qc-title">存量项目模块拆解 / 重构</h3>
      <p class="qc-desc">老项目先做看清，再被动；先跑 `/init` 建认知底稿，再做拆解与治理。</p>
      <ol class="qc-answers">
        <li><span class="num">01</span>把 `/init` 作为老旧代码库的"第一次接触"。先扫目录、依赖与边界，产出初始上下文。</li>
        <li><span class="num">02</span>基于 `/init` 输出盘点模块职责、依赖关系、重复逻辑与高风险点。</li>
        <li><span class="num">03</span>优先选择低风险、高复用、可验证的小切口开始治理。</li>
        <li><span class="num">04</span>每次只做一个可回滚的小改动：抽函数、拆 service、补适配层。</li>
        <li><span class="num">05</span>重构完成后把新边界写进 Rules，防止后续代码再次劣化。</li>
      </ol>
      <div class="qa-script">
        <span class="script-tag">对答话术</span>
        <p>先 init 建上下文，再拆解，再小步迁移，才是老项目可落地的 AI 改造路径。</p>
      </div>
    </div>
  </div>

  <footer class="rollout-bar">
    <span class="cmd">$ rollout.ai --mode=team</span>
    <span class="flow">分工边界 → 上下文统一 → 质量前移 → 小步重构</span>
    <span class="goals">目标 · 减少冲突 · 不让 PR 堆住交付 · 让存量系统可持续演进</span>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.summary-bar { display: flex; gap: 16px; align-items: center; padding: 10px 14px; border: 1px solid rgba(92,225,255,0.18); border-radius: 6px; font: 12px/1.5 var(--font-mono); }
.summary-bar .cmd { color: var(--green); white-space: nowrap; }
.summary-bar .thesis { color: var(--text); flex: 1; }
.summary-bar .thesis em { color: var(--amber); font-style: normal; }
.summary-bar .hint { color: var(--text-dim); }

.qa-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; flex: 1; min-height: 0; margin-top: 10px; }
.qa-col { border: 1px solid rgba(92,225,255,0.18); border-radius: 6px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.qa-col[data-col="02"] { border-color: rgba(255,176,32,0.3); }
.qa-col .qc-head { display: flex; gap: 8px; align-items: center; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.qa-col .badge { font: 700 14px var(--font-mono); color: var(--green); padding: 2px 6px; border: 1px solid var(--green); border-radius: 3px; }
.qa-col .badge.amber { color: var(--amber); border-color: var(--amber); }
.qa-col .tag { font: 700 10px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.qa-col .qc-title { font: 700 16px/1.3 var(--font-display); color: var(--text); margin: 0; }
.qa-col .qc-desc { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.qa-col .qc-answers { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.qa-col .qc-answers li { padding: 5px 8px; border: 1px solid rgba(255,255,255,0.06); border-radius: 3px; font: 11px/1.5 var(--font-sans); color: var(--text-dim); display: grid; grid-template-columns: 22px 1fr; gap: 6px; }
.qa-col .qc-answers .num { color: var(--cyan); font: 700 10px var(--font-mono); }
.qa-col .qa-script { padding: 8px 10px; border: 1px dashed rgba(0,255,156,0.3); border-radius: 4px; margin-top: auto; background: rgba(0,255,156,0.03); }
.qa-col .script-tag { font: 700 9px var(--font-mono); color: var(--green); letter-spacing: 1px; }
.qa-col .qa-script p { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 4px 0 0; }
.qa-col .qa-script em { color: var(--green); font-style: normal; }

.rollout-bar { display: flex; gap: 16px; align-items: center; padding: 8px 14px; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 10px; font: 11px var(--font-mono); color: var(--text-dim); }
.rollout-bar .cmd { color: var(--green); }
.rollout-bar .flow { flex: 1; color: var(--cyan); }
.rollout-bar .goals { color: var(--amber); }
```

---

## A8. heroThesis + insightTable

**适用场景**：以一句话核心观点开场 + 列出作者观点 + 配参考表格。

**视觉锚点**：
- **顶部 hero-thesis box**：左侧"一句话结论"徽章 + 大字号观点（关键词琥珀/绿色高亮）+ 公式 `工作环境 = 上下文组织 + 工具接入 + 组织治理`（3 个绿框 chip）+ 原文链接
- **主体左右分栏**：
  - **左 50%**："作者核心观点"，5 条编号卡片（01-05），每张有标题 + 描述 + 引用框（左侧 cyan 条）
  - **右 50%**："HARNESS: 7 个工作环境组件" 5 列表格 — 组件 / 定义 / 什么时候加载（高亮）/ 最适合解决什么问题 / 常见误区

**代表 slide**：27（Claude Code 在大仓库下的最佳实践：核心观点）

**HTML 骨架**：
```html
<section class="slide" data-kind="hero-thesis-insight-table">
  <div class="hero-thesis">
    <span class="ht-tag">一句话结论</span>
    <p class="ht-text">大型代码库里，决定 Claude Code 效果的关键不是模型本身，而是围绕它搭起来的<em>工作环境</em>。</p>
    <div class="ht-formula">
      <span>工作环境 =</span>
      <span class="chip">上下文组织</span>
      <span class="op">+</span>
      <span class="chip">工具接入</span>
      <span class="op">+</span>
      <span class="chip">组织治理</span>
    </div>
    <div class="ht-link">原文链接 <a href="#">https://claude.com/blog/...</a></div>
  </div>

  <div class="split-2">
    <!-- 左：作者观点 -->
    <div class="insight-col">
      <header class="ic-head">
        <span class="en">作者核心观点</span>
      </header>
      <div class="insight-list">
        <div class="insight">
          <span class="num">01</span>
          <div class="ins-body">
            <h4>实时探索式 agent 搜索，比静态索引的 RAG 更可靠</h4>
            <p>大型代码库中，基于实时文件系统探索的 agent 式搜索，比依赖静态索引的 RAG 更可靠。</p>
            <blockquote>「SKILL.md 只做"目录"，详细信息拆分到 references/、assets/、scripts/ 子目录。」</blockquote>
          </div>
        </div>
        <!-- ... 4 more insights ... -->
      </div>
    </div>

    <!-- 右：组件表格 -->
    <div class="table-col">
      <header class="ic-head">
        <span class="en">HARNESS</span>
        <span class="sub">7 个工作环境组件</span>
      </header>
      <table class="cmp-table">
        <thead>
          <tr><th>组件</th><th>定义</th><th class="hl">什么时候加载</th><th>最适合解决什么问题</th><th>常见误区</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><b>CLAUDE.md</b></td>
            <td>会话启动时自动读取的上下文文件</td>
            <td class="hl green">每次会话</td>
            <td>项目约定、代码库知识</td>
            <td>把所有知识都堆进去</td>
          </tr>
          <tr>
            <td><b>Hooks</b></td>
            <td>在关键事件触发的脚本</td>
            <td class="hl green">事件触发</td>
            <td>自动化固定动作、沉淀经验</td>
            <td>本该自动做的事还靠提示词做</td>
          </tr>
          <tr>
            <td><b>Skills</b></td>
            <td>面向特定任务的打包知识/流程</td>
            <td class="hl green">按需加载</td>
            <td>专业领域知识、专项工作流</td>
            <td>把 skill 内容塞回 CLAUDE.md</td>
          </tr>
          <tr>
            <td><b>Plugins</b></td>
            <td>对外分发的 skills/hooks/MCP 的包</td>
            <td class="hl green">安装后常驻可用</td>
            <td>在组织内快速复制成熟配置</td>
            <td>好用配置只停留在个人机器</td>
          </tr>
          <tr>
            <td><b>LSP</b></td>
            <td>符号级代码智能</td>
            <td class="hl green">常驻</td>
            <td>跳转定义、追踪引用、typed 语言导航</td>
            <td>以为它天然就有</td>
          </tr>
          <tr>
            <td><b>MCP Servers</b></td>
            <td>外部系统接入层</td>
            <td class="hl green">常驻</td>
            <td>文档、工单、分析平台、内部系统接入</td>
            <td>基础没打好就先接太多系统</td>
          </tr>
          <tr>
            <td><b>Subagents</b></td>
            <td>隔离上下文的子代理</td>
            <td class="hl green">调用时</td>
            <td>并行探索、探索与修改分离</td>
            <td>在同一上下文里把所有事都混做</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
```

**CSS 关键样式**：
```css
.hero-thesis { padding: 16px 20px; border: 1px solid rgba(92,225,255,0.25); border-left: 4px solid var(--cyan); border-radius: 6px; background: rgba(92,225,255,0.04); position: relative; }
.hero-thesis .ht-tag { position: absolute; top: 12px; left: 12px; font: 700 10px var(--font-mono); color: var(--cyan); padding: 2px 8px; border: 1px solid var(--cyan); border-radius: 3px; letter-spacing: 1px; }
.hero-thesis .ht-text { font: 700 22px/1.4 var(--font-display); color: var(--text); margin: 24px 0 12px; }
.hero-thesis .ht-text em { color: var(--amber); font-style: normal; font-weight: 800; }
.hero-thesis .ht-formula { display: flex; gap: 8px; align-items: center; font: 700 14px var(--font-mono); color: var(--text-dim); margin-bottom: 8px; }
.hero-thesis .ht-formula .chip { color: var(--green); padding: 3px 10px; border: 1px solid var(--green); border-radius: 3px; }
.hero-thesis .ht-formula .op { color: var(--amber); }
.hero-thesis .ht-link { font: 11px var(--font-mono); color: var(--text-dim); }
.hero-thesis .ht-link a { color: var(--cyan); text-decoration: none; }

.split-2 { display: grid; grid-template-columns: 1fr 1.2fr; gap: 16px; flex: 1; min-height: 0; margin-top: 14px; }
.ic-head { display: flex; gap: 12px; align-items: baseline; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 10px; }
.ic-head .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.ic-head .sub { font: 11px var(--font-mono); color: var(--text-dim); }

.insight-col { display: flex; flex-direction: column; }
.insight-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
.insight { display: grid; grid-template-columns: 32px 1fr; gap: 10px; padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.insight .num { font: 700 16px var(--font-mono); color: var(--green); }
.insight h4 { font: 700 13px/1.4 var(--font-display); color: var(--text); margin: 0 0 4px; }
.insight p { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.insight blockquote { margin: 6px 0 0; padding: 4px 8px; border-left: 2px solid var(--cyan); font: 11px/1.5 var(--font-mono); color: var(--cyan); }

.cmp-table { width: 100%; border-collapse: collapse; font: 11px var(--font-sans); }
.cmp-table thead th { text-align: left; padding: 8px 10px; font: 700 11px var(--font-mono); color: var(--text-dim); letter-spacing: 1px; border-bottom: 1px solid rgba(0,255,156,0.3); }
.cmp-table thead th.hl { color: var(--green); }
.cmp-table tbody td { padding: 8px 10px; color: var(--text-dim); border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: top; }
.cmp-table tbody td b { color: var(--green); }
.cmp-table tbody td.hl { color: var(--green); font-weight: 700; }
.cmp-table tbody tr:hover { background: rgba(0,255,156,0.03); }
```

---

## A9. stepTabPanel

**适用场景**：表达一个方法论的 3 个落地步骤，每步独立深讲。

**视觉锚点**：
- **顶部 tab 条**：4 个 tab（"落地三步法"激活 / 01 可导航 / 02 可维护 / 03 可扩展）
- **大观点行**：一句话总结，关键词琥珀高亮
- **主体 3 列并排**：每列
  - 顶部：01/02/03 编号（青/琥珀/绿 渐变）+ 右上角小标语
  - 标题（大字）
  - 副标题（说明）
  - "为什么要这样做"段（带绿色 `>` 列表项）
  - "具体怎么做"段（带关键词加粗 + 灰色 dashed 分隔）
- **底部**：无（用 footer chrome 占位）

**代表 slide**：28（Claude Code 在大仓库下的最佳实践：三种成熟的模式）

**HTML 骨架**：
```html
<section class="slide" data-kind="step-tab-panel">
  <header class="tab-bar">
    <span class="tab active">落地三步法</span>
    <span class="tab">01 可导航</span>
    <span class="tab">02 可维护</span>
    <span class="tab">03 可扩展</span>
  </header>

  <p class="big-thesis">大代码库落地，不是把模型接进来就结束，而是要先让 Claude <em>找对上下文</em>，再让配置 <em>跟上模型演进</em>，最后把成熟经验 <em>变成组织资产</em>。</p>

  <div class="step-cols">
    <article class="step-col" data-step="01">
      <header class="sc-head">
        <span class="num">01</span>
        <span class="tagline">先解决"去哪里找上下文"</span>
      </header>
      <h3>让代码库可导航</h3>
      <p class="subtitle">不是喂更多上下文，而是让正确上下文按需出现。</p>

      <section class="sc-why">
        <h5>为什么要这样做</h5>
        <p>大仓库最大的问题通常不是信息不够，而是相关上下文找不准。</p>
        <p>从正确区域开始，Claude 才能把注意力花在真正相关的模块上。</p>
        <p>验证与搜索范围收窄后，速度更快、噪音更低、判断更稳。</p>
      </section>

      <section class="sc-how">
        <h5>具体怎么做</h5>
        <p><b>CLAUDE.md 分层</b> 粗目录放全局地图、核心命令、关键陷阱；子目录放本地命令、局部背景和本地约定。</p>
        <p><b>从子目录启动</b> 任务只涉及某个服务时直接从服务目录开始，Claude 会继续向上读取父级 CLAUDE.md。</p>
        <p><b>验证命令收敛</b> 在子目录级 CLAUDE.md 写清本地测试与 lint 命令，只跑目前修改真正相关的验证。</p>
        <p><b>忽略规则压噪音</b> 结合 <code>.gitignore</code> 与 <code>.claude/settings.json</code> 的 permissions.deny 排除生成文件、构建产物和第三方依赖。</p>
        <p><b>补代码库地图</b> 顶层目录条目多且命名不直观时，用轻量 markdown 标明目录名表与一行用途说明。</p>
      </section>
    </article>

    <article class="step-col" data-step="02">
      <header class="sc-head">
        <span class="num">02</span>
        <span class="tagline">别让旧经验拖累新模型</span>
      </header>
      <h3>主动维护配置</h3>
      <p class="subtitle">配置不是一次性文档，而是一套要持续迭代的工作环境。</p>

      <section class="sc-why">
        <h5>为什么要这样做</h5>
        <p>模型变强后，旧时代的"安全扶手"可能反而压制跨文件协同和自动化能力。</p>
        <p>为弥补旧能力而写的 hooks、skills、工具补丁，在产品补齐后会变成重复路径。</p>
        <p>不做复盘，配置会像技术债一样越积越厚，最后拖慢团队效率。</p>
      </section>

      <section class="sc-how">
        <h5>具体怎么做</h5>
        <p><b>识别过时限制</b> 重点检查"必须拆成单文件改动"这类旧约束，判断它是否仍然必要。</p>
        <p><b>复盘 hooks / skills / 补丁</b> 把曾经用来补产品短板的脚本和流程逐项过一遍，删除已无增益的部分。</p>
        <p><b>模型升级即触发器</b> 每次主要模型升级后都做一轮复盘，重新判断哪些规则、哪些 skill 还值得保留。</p>
        <p><b>建立固定节奏</b> 建议每 3-6 个月做一次配置审查，把它当成技术债治理和产品迭代。</p>
      </section>
    </article>

    <article class="step-col" data-step="03">
      <header class="sc-head">
        <span class="num">03</span>
        <span class="tagline">把个人技巧变成组织资产</span>
      </header>
      <h3>分配明确 owner</h3>
      <p class="subtitle">没有 owner，再好的配置也难以规模化复制和治理。</p>

      <section class="sc-why">
        <h5>为什么要这样做</h5>
        <p>仅有技术配置，不会自动带来组织级采用；最佳实践通常停留在少数高手手里。</p>
        <p>没有 owner，团队容易重复踩坑、权限策略、skill/plugin 清单也会逐渐分裂。</p>
        <p>受监管组织尤其需要清晰责任边界，才能把扩展速度和治理要求一起做起来。</p>
      </section>

      <section class="sc-how">
        <h5>具体怎么做</h5>
        <p><b>最小可行形态：DRI</b> 至少有一个明确负责人，持续维护配置标准、CLAUDE.md 规范、权限策略与更新节奏。</p>
        <p><b>更成熟形态：Agent Manager</b> 由 PM + 工程混合角色负责 Claude Code 生态，做跨团队协调、治理和能力分发。</p>
        <p><b>先做批准清单</b> 从一组已批准的 skills / plugins 开始，保留正常代码审查流程，避免一开始就完全放。</p>
        <p><b>控制范围再扩展</b> 初期限制接入范围，随着经验积累逐步扩展，让组织治理跟着能力成熟一起长出来。</p>
        <p><b>建立跨职能工作组</b> 工程、信息安全、治理共同定义推广路线图，保证效率与合规一起推进。</p>
      </section>
    </article>
  </div>
</section>
```

**CSS 关键样式**：
```css
.tab-bar { display: flex; gap: 4px; padding: 6px; border: 1px solid rgba(92,225,255,0.2); border-radius: 6px; margin-bottom: 14px; }
.tab-bar .tab { flex: 1; text-align: center; padding: 8px 12px; font: 700 11px var(--font-mono); color: var(--text-dim); border-radius: 4px; letter-spacing: 1px; }
.tab-bar .tab.active { background: rgba(92,225,255,0.1); color: var(--cyan); border: 1px solid var(--cyan); }

.big-thesis { font: 600 18px/1.6 var(--font-display); color: var(--text); margin: 0 0 16px; padding: 12px 16px; border-left: 3px solid var(--green); background: rgba(0,255,156,0.03); }
.big-thesis em { color: var(--amber); font-style: normal; font-weight: 700; }

.step-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.step-col { border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.step-col[data-step="01"] { border-top: 2px solid var(--cyan); }
.step-col[data-step="02"] { border-top: 2px solid var(--amber); }
.step-col[data-step="03"] { border-top: 2px solid var(--green); }

.sc-head { display: flex; gap: 10px; align-items: baseline; padding-bottom: 6px; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.step-col[data-step="01"] .num { color: var(--cyan); }
.step-col[data-step="02"] .num { color: var(--amber); }
.step-col[data-step="03"] .num { color: var(--green); }
.sc-head .num { font: 700 22px var(--font-mono); }
.sc-head .tagline { font: 11px var(--font-mono); color: var(--text-dim); margin-left: auto; }

.step-col h3 { font: 700 20px var(--font-display); color: var(--text); margin: 0; }
.step-col .subtitle { font: 12px/1.5 var(--font-sans); color: var(--text-dim); margin: 0 0 4px; }

.sc-why, .sc-how { padding-top: 6px; }
.sc-why h5, .sc-how h5 { font: 700 10px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; margin: 0 0 6px; }
.sc-why p, .sc-how p { font: 11px/1.6 var(--font-sans); color: var(--text-dim); margin: 4px 0; }
.sc-why p::before { content: '> '; color: var(--green); font-weight: 700; }
.sc-how p b { color: var(--green); }
.sc-how p code { font: 11px var(--font-mono); color: var(--amber); background: rgba(255,176,32,0.08); padding: 1px 4px; border-radius: 2px; }
```

---

## A10. principleCard + goldenRuleCard

**适用场景**：方法论提炼，左侧"四大设计哲学"原则卡 + 右侧"九黄金法则"编号卡 + 底部 CORE INSIGHT 收尾。

**视觉锚点**：
- **顶部标题**：「构建 <em>Claude Code</em> 的经验教训：我们如何构建 Skills」+ 右侧原文引用 metadata
- **左 50% "四大设计哲学"**：4 张 P1-P4 卡，每张：编号徽章（带 1px 边框）+ EN 标签（小标）+ 中文标题 + 描述 + 引用框
- **右 50% "九条例制作最佳实践"**：5 条编号卡（01-05 可见），每张：编号（绿/粉）+ EN 小标 + 中文标题 + 描述 + 双示例对比（绿色 ✓ 正确 vs 红色 ✗ 错误）
- **底部**：`CORE INSIGHT` 收尾条 + 三段公式（文件系 = 上下文工程 / Gotchas = 最高密度信号 / 验证类 = ROI 最高投资）

**代表 slide**：29（构建 Claude Code 的经验教训：我们如何构建 Skills）

**HTML 骨架**：
```html
<section class="slide" data-kind="principle-golden">
  <header class="ph-head">
    <h1 class="ph-title">构建 <em>Claude Code</em> 的经验教训：我们如何构建 Skills</h1>
    <div class="ph-meta"><span class="lbl">原文</span> Anthropic · Thariq Shihipar · 2026.06.03</div>
  </header>

  <div class="two-split">
    <!-- 左 -->
    <div class="principle-col">
      <header class="pc-head">
        <span class="num">01</span>
        <span class="en">四大设计哲学</span>
      </header>

      <div class="principle-cards">
        <div class="pc">
          <span class="pc-num">P1</span>
          <span class="pc-en">PROGRESSIVE DISCLOSURE</span>
          <h4>渐进式信息披露</h4>
          <p>把文件系统作为上下文工程手段，让 AI 按需读取，不一次性塞满上下文窗口。</p>
          <blockquote>SKILL.md 只做"目录"，详细信息拆分到 references/、assets/、scripts/ 子目录。</blockquote>
        </div>

        <div class="pc">
          <span class="pc-num">P2</span>
          <span class="pc-en">FLEXIBILITY OVER RIGIDITY</span>
          <h4>灵活性优于严格指令</h4>
          <p>避免"轨迹化"AI，给信息但保留适应空间。过度具体的指令反而有害。</p>
          <blockquote>不要写成 SOP 流水化，写成"知识 + 工具"，让 AI 自主判断。</blockquote>
        </div>

        <div class="pc">
          <span class="pc-num">P3</span>
          <span class="pc-en">WRITE FOR MODELS, NOT HUMANS</span>
          <h4>为模型而非人类编写</h4>
          <p>描述字段不是给人类的摘要，是告诉模型"何时触发此技能"的触发说明书。</p>
          <blockquote>描述中包含触发词能显著提高命中率，如 "babysit" → "监控 PR → 解决合并冲突"。</blockquote>
        </div>

        <div class="pc">
          <span class="pc-num">P4</span>
          <span class="pc-en">EVOLVE FROM PRACTICE</span>
          <h4>从实践中演化</h4>
          <p>最好的 Skill 从几行代码 + 一个"坑点"开始，遇到新边界情况不断迭代。</p>
        </div>
      </div>
    </div>

    <!-- 右 -->
    <div class="golden-col">
      <header class="pc-head">
        <span class="num">02</span>
        <span class="en">九条例制作最佳实践</span>
        <span class="sub">（核心干货）</span>
      </header>

      <div class="golden-cards">
        <div class="gc">
          <span class="gc-num">01</span>
          <span class="gc-en">DON'T STATE THE OBVIOUS</span>
          <h4>不要陈述显而易见的内容</h4>
          <p>Claude 会编码、能读代码库。重新默认行为的 Skill 只会浪费上下文。</p>
          <div class="gc-example"><span class="bad">❌ 示例</span> 前面设计 Skill 专门避开了 Inter 字体和紫色渐变 — Claude 的默认"舒适区"输出。</div>
        </div>

        <div class="gc">
          <span class="gc-num">02</span>
          <span class="gc-en">BUILD GOTCHAS — HIGHEST SIGNAL DENSITY</span>
          <h4>构建"坑点"（Gotchas） ★★★</h4>
          <p>任何 Skill 中信号价值最高的部分。从 Claude 的失败中持续积累，每条都是黄金。</p>
          <div class="gc-example"><span class="bad">❌ 示例</span> "subscriptions 表仅追加，需要版本号最高的行，不是 created_at 最近。"</div>
        </div>

        <div class="gc">
          <span class="gc-num">03</span>
          <span class="gc-en">LEVERAGE PROGRESSIVE DISCLOSURE</span>
          <h4>善用渐进式信息披露</h4>
          <p>函数签名到 references/api.md，模板放 assets/，脚本放 scripts/ — 让文件系统自然分步加载。</p>
          <div class="gc-example"><span class="ok">✅ 示例</span> "如果任务是 pending 状态，参考 stuck-jobs.md。" — SKILL.md 只做目录索引。</div>
        </div>

        <div class="gc">
          <span class="gc-num">04</span>
          <span class="gc-en">WRITE DESCRIPTIONS FOR MODELS</span>
          <h4>为模型编写描述</h4>
          <p>Claude 启动时扫描所有 Skill 描述来决定"谁处理这个请求"。描述 = 触发条件，非摘要。</p>
          <div class="gc-example">
            <span class="ok">✅ 触发条件</span> "当用户提到 babysit、监控 PR 或自动合并时触发"
            <span class="bad">vs ❌ 摘要</span> "这个技能帮助你管理 PR。"
          </div>
        </div>

        <div class="gc">
          <span class="gc-num">05</span>
          <span class="gc-en">DON'T OVER-CONSTRAIN</span>
          <h4>不过度限制 Claude</h4>
          <p>给信息，但让 Claude 有根据具体情况灵活适应的空间。高度可复用的 Skill 需避免过于具体的指令。</p>
          <div class="gc-example">
            <span class="ok">✅ 灵活</span> "确保依赖已安装（npm install 或 yarn add）"
            <span class="bad">vs ❌ 必须</span> "你必须先检查 package.json、运行 npm install..."
          </div>
        </div>
      </div>
    </div>
  </div>

  <footer class="core-insight">
    <span class="ci-tag">CORE INSIGHT</span>
    <span class="ci-text">最好的 Skill 不是给 AI 更多通用知识，而是给它那些<em>不说不知道</em>的关键信息。</span>
    <div class="ci-formula">
      <span>文件系统 = 上下文工程</span>
      <span class="sep">·</span>
      <span>Gotchas = 最高密度信号</span>
      <span class="sep">·</span>
      <span>验证类 = ROI 最高投资</span>
    </div>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.ph-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.ph-title { font: 700 26px var(--font-display); color: var(--text); margin: 0; }
.ph-title em { color: var(--green); font-style: italic; }
.ph-meta { font: 11px var(--font-mono); color: var(--text-dim); }
.ph-meta .lbl { color: var(--cyan); font-weight: 700; }

.two-split { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; min-height: 0; }
.pc-head { display: flex; gap: 10px; align-items: baseline; padding-bottom: 6px; border-bottom: 1px solid rgba(92,225,255,0.15); margin-bottom: 8px; }
.pc-head .num { font: 700 18px var(--font-mono); color: var(--green); }
.pc-head .en { font: 700 12px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; }
.pc-head .sub { font: 11px var(--font-mono); color: var(--text-dim); margin-left: auto; }

.principle-cards { display: flex; flex-direction: column; gap: 8px; }
.pc { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; }
.pc .pc-num { display: inline-block; font: 700 11px var(--font-mono); color: var(--green); padding: 1px 6px; border: 1px solid var(--green); border-radius: 2px; letter-spacing: 1px; }
.pc .pc-en { display: block; font: 9px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; margin: 4px 0 2px; }
.pc h4 { font: 700 14px var(--font-display); color: var(--text); margin: 0 0 4px; }
.pc p { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.pc blockquote { margin: 6px 0 0; padding: 4px 8px; border-left: 2px solid var(--green); font: 11px/1.5 var(--font-mono); color: var(--green); }

.golden-cards { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
.gc { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; }
.gc .gc-num { display: inline-block; font: 700 11px var(--font-mono); color: var(--green); padding: 1px 6px; border: 1px solid var(--green); border-radius: 2px; }
.gc .gc-en { display: block; font: 9px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; margin: 4px 0 2px; }
.gc h4 { font: 700 14px var(--font-display); color: var(--text); margin: 0 0 4px; }
.gc p { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.gc-example { margin-top: 6px; padding: 6px 8px; background: rgba(0,0,0,0.2); border-radius: 3px; font: 10px/1.5 var(--font-mono); }
.gc-example .ok { color: var(--green); font-weight: 700; margin-right: 4px; }
.gc-example .bad { color: var(--pink); font-weight: 700; margin-right: 4px; }
.gc-example .sep { color: var(--text-dim); margin: 0 4px; }

.core-insight { display: flex; align-items: center; gap: 16px; padding: 10px 14px; border: 1px solid rgba(0,255,156,0.25); border-left: 4px solid var(--green); border-radius: 4px; margin-top: 10px; background: rgba(0,255,156,0.04); }
.core-insight .ci-tag { font: 700 10px var(--font-mono); color: var(--green); padding: 2px 6px; border: 1px solid var(--green); border-radius: 2px; letter-spacing: 1px; }
.core-insight .ci-text { font: 600 13px var(--font-display); color: var(--text); flex: 1; }
.core-insight .ci-text em { color: var(--amber); font-style: normal; }
.core-insight .ci-formula { font: 11px var(--font-mono); color: var(--text-dim); display: flex; gap: 6px; }
.core-insight .ci-formula .sep { color: var(--cyan); }
```

---

## A11. docCardGrid

**适用场景**：展示一组外部参考文档/笔记资源（如 Obsidian Vault 中的笔记），每张卡片有完整元数据。

**视觉锚点**：
- **顶部**：H1 标题 + 副标题描述
- **主体 2x2 或 3-card 网格**：每张卡片
  - 顶部彩色细线（绿/琥珀/青）
  - 编号徽章 01/02/03（带边框）
  - 标题（中文 + 英文混排）
  - 描述段
  - 元数据块：`# FRONTMATTER` + `# VAULT` + 文件路径
  - 标签 chips（4-5 个）
  - 底部 CTA：「在 Obsidian 中打开 →」

**代表 slide**：31（深度笔记 — 从实战中沉淀）

**HTML 骨架**：
```html
<section class="slide" data-kind="doc-card-grid">
  <header class="dc-head">
    <h1>深度笔记 —— 从实战中沉淀</h1>
    <p class="sub">以下笔记存放在本地 Obsidian Vault 中，支持双向链接与关系图谱，点击可直达原文。</p>
  </header>

  <div class="doc-grid">
    <article class="doc-card" data-color="green">
      <span class="top-bar"></span>
      <header class="dc-h">
        <span class="dc-num">01</span>
        <h3>CodeBuddy 存量项目接入实战</h3>
      </header>
      <p class="dc-desc">以 GitHub 开源项目为案例，拆解历史项目接入 CodeBuddy 的完整流程：架构分析、CodeGraph 影响链路追踪、核心字段变更改造。</p>
      <dl class="dc-meta">
        <dt># FRONTMATTER</dt><dd>Codebuddy 历史项目实践</dd>
        <dt># VAULT</dt><dd>matter / Codebuddy存量项目接入实战.md</dd>
      </dl>
      <div class="dc-tags">
        <span class="tag">CODEBUDDY.MD</span>
        <span class="tag">SKILLS</span>
        <span class="tag">知识库</span>
        <span class="tag">审退试点</span>
      </div>
      <a class="dc-cta" href="#">↗ 在 Obsidian 中打开</a>
    </article>

    <article class="doc-card" data-color="amber">
      <span class="top-bar"></span>
      <header class="dc-h">
        <span class="dc-num">02</span>
        <h3>CodeBuddy Code (CLI) 完全指南</h3>
      </header>
      <p class="dc-desc">终端原生 AI 编程助手：CLI vs IDE 范式差异、17 个现场演示案例、五大行为控制机制（斜杠命令/Skills/Sub-agents/Hooks/MCP）、会话分支与检查点回退。</p>
      <dl class="dc-meta">
        <dt># FRONTMATTER</dt><dd>CodeBuddy CLI 完全指南 · 2026.06.24</dd>
        <dt># VAULT</dt><dd>matter / CodeBuddy CLI.md</dd>
      </dl>
      <div class="dc-tags">
        <span class="tag">CLI</span>
        <span class="tag">终端</span>
        <span class="tag">AGENT</span>
        <span class="tag">自动化</span>
      </div>
      <a class="dc-cta" href="#">↗ 在 Obsidian 中打开</a>
    </article>

    <article class="doc-card" data-color="cyan">
      <span class="top-bar"></span>
      <header class="dc-h">
        <span class="dc-num">03</span>
        <h3>Skills 制作最佳实践</h3>
      </header>
      <p class="dc-desc">Anthropic 官方方法论：九条制作最佳实践、渐进式信息披露、Gotchas 积累策略、文件系统作为上下文工程，附 frontend-design / docx / pdf 三个官方 Skill 实例剖析。</p>
      <dl class="dc-meta">
        <dt># FRONTMATTER</dt><dd>Anthropic 官方 Skill 方法论 · 2026.06.23</dd>
        <dt># VAULT</dt><dd>matter / Skills 制作最佳实践.md</dd>
      </dl>
      <div class="dc-tags">
        <span class="tag">SKILLS</span>
        <span class="tag">ANTHROPIC</span>
        <span class="tag">最佳实践</span>
        <span class="tag">GOTCHAS</span>
      </div>
      <a class="dc-cta" href="#">↗ 在 Obsidian 中打开</a>
    </article>
  </div>

  <footer class="dc-foot">
    <span class="cmd">$ vault matter | notes 3</span>
    <span class="hint">点击笔记卡片在本地 Obsidian 中查看完整内容</span>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.dc-head { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.dc-head h1 { font: 700 30px var(--font-display); color: var(--text); margin: 0; }
.dc-head .sub { font: 12px/1.5 var(--font-sans); color: var(--text-dim); margin: 6px 0 0; }

.doc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; flex: 1; min-height: 0; }
.doc-card { position: relative; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 14px 18px 12px; display: flex; flex-direction: column; gap: 8px; overflow: hidden; }
.doc-card[data-color="green"] .top-bar { background: var(--green); }
.doc-card[data-color="amber"] .top-bar { background: var(--amber); }
.doc-card[data-color="cyan"] .top-bar { background: var(--cyan); }
.doc-card .top-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.doc-card[data-color="green"] .dc-num { color: var(--green); border-color: var(--green); }
.doc-card[data-color="amber"] .dc-num { color: var(--amber); border-color: var(--amber); }
.doc-card[data-color="cyan"] .dc-num { color: var(--cyan); border-color: var(--cyan); }

.dc-h { display: flex; gap: 10px; align-items: baseline; }
.dc-num { font: 700 14px var(--font-mono); padding: 2px 8px; border: 1px solid; border-radius: 3px; letter-spacing: 1px; }
.dc-h h3 { font: 700 18px var(--font-display); color: var(--text); margin: 0; }
.dc-desc { font: 11px/1.6 var(--font-sans); color: var(--text-dim); margin: 0; }
.dc-meta { display: grid; grid-template-columns: 110px 1fr; gap: 4px 12px; margin: 4px 0 0; font: 11px var(--font-mono); }
.dc-meta dt { color: var(--cyan); }
.dc-meta dd { color: var(--text-dim); margin: 0; }
.dc-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
.dc-tags .tag { font: 10px var(--font-mono); color: var(--text); padding: 2px 6px; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; }
.dc-cta { font: 700 11px var(--font-mono); color: var(--green); text-decoration: none; margin-top: auto; padding-top: 4px; }
.dc-cta:hover { color: var(--cyan); }

.dc-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.06); font: 11px var(--font-mono); color: var(--text-dim); }
.dc-foot .cmd { color: var(--green); }
```

---

## A12. qaDual 2x2

**适用场景**：4 个并列 Q&A 主题（决策层/技术层），每格用 QUESTIONS/ANSWER 双栏展示完整问答对话。

**视觉锚点**：
- **顶部标题**：「决策层/技术层 常见问题」
- **小标题行**：`他关心的四件事 × 用户实际问法` / `他会追问的四类技术问题 × 推荐回答`
- **2x2 网格**：每格 card
  - 顶部：编号 01/02/03/04 + 类型标签（如「ROI 能不能算清」+ 关键概念行）+ 右侧特殊徽章（`● 涨价计划` 粉色点）
  - **左半 QUESTIONS**：1-4 条用户问法（每条带优先级 chip `高频`/`必问`）
  - **右半 ANSWER**：A/B/C/D 编号答复条目

**代表 slide**：32（决策层常见问题：价值证明、ROI 评估与推进路径）、33（技术层常见问题：接入方式、治理边界与实施路径）

**HTML 骨架**：
```html
<section class="slide" data-kind="qa-dual-2x2">
  <header class="qd-head">
    <h1>决策层常见问题：<span>价值证明、ROI 评估与推进路径</span></h1>
    <div class="progress-bar"><span class="seg done"></span><span class="seg active"></span><span class="seg"></span><span class="seg"></span></div>
  </header>
  <p class="qd-caption"><span class="en">他关心的四件事</span> × <span class="zh">用户实际问法</span></p>

  <div class="qd-grid">
    <div class="qd-card" data-col="01">
      <header class="qdh">
        <span class="num">01</span>
        <div class="title">
          <h3>ROI 能不能算清</h3>
          <p>人数提升 × 人数 × 单价 vs 年度采购成本</p>
        </div>
        <span class="flag">● 涨价计划</span>
      </header>
      <div class="qd-body">
        <div class="qd-q">
          <h5>QUESTIONS</h5>
          <ul>
            <li><span class="prio high">高频</span> Q1 · 产品售卖价格，不同版本的差异？</li>
            <li><span class="prio">Q2</span> · 企业版权益分管理规则，每个席位平均使用积分是多少？</li>
          </ul>
        </div>
        <div class="qd-a">
          <h5>ANSWER</h5>
          <ul>
            <li><b>A.</b> 旗舰版：3 个坐席起购，198/人/月，包含 2000 积分/月</li>
            <li><b>B.</b> 专享版(VPC)：10 个坐席起购，316/人/月，包含 2000 积分/月</li>
            <li><b>C.</b> 加量包：100 元 2000 积分，积分属于积分池可全员共享</li>
            <li><b>核心区别：</b></li>
            <li><b>1.</b> VPC 版本资源独享更适合对数据资源安全有更高要求的客户。</li>
            <li><b>2.</b> 提供按需配速供货能力升档，提到上限后智能降档。</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="qd-card" data-col="02">
      <header class="qdh">
        <span class="num">02</span>
        <div class="title">
          <h3>供应商实力</h3>
          <p>腾讯背书、长期路线图、大客户案例</p>
        </div>
      </header>
      <div class="qd-body">
        <div class="qd-q">
          <h5>QUESTIONS</h5>
          <ul>
            <li><span class="prio high">高频</span> Q1 · 和竞品的主要差异和优势</li>
          </ul>
        </div>
        <div class="qd-a">
          <h5>ANSWER</h5>
          <ul>
            <li><b>A.</b> 腾讯侧可以拿到长期稳定的国内外模型资源，主要涉及 Claude/GLM/MinMax</li>
            <li><b>B.</b> 腾讯侧有 6-7 万工程师使用 AI 介入工作，腾讯也是 Claude/GLM/MinMax 的大客户</li>
            <li><b>C.</b> 阿里系（灵码/Qoder/秒悟）分属不同团队，字节主要面向个人开发者，ToB 发展较慢，腾讯 Codebuddy/Wrokbuddy 一个团队研发管理</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="qd-card" data-col="03">
      <header class="qdh">
        <span class="num">03</span>
        <div class="title">
          <h3>战略契合度</h3>
          <p>和公司数字化 / AI 战略怎么对齐</p>
        </div>
      </header>
      <div class="qd-body">
        <div class="qd-q">
          <h5>QUESTIONS</h5>
          <ul>
            <li><span class="prio">Q1</span> · 这件事怎么在我们内部推广落地？</li>
            <li><span class="prio">Q2</span> · 推广期需要关注的信息</li>
          </ul>
        </div>
        <div class="qd-a">
          <h5>ANSWER</h5>
          <ul>
            <li><b>A.</b> 内部可通过组织 skills 大赛进行推广</li>
            <li><b>B.</b> 内部推广期间建议配置足量的积分给用户使用，这样才能让用户体验 AI 介入的完整能力</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="qd-card" data-col="04">
      <header class="qdh">
        <span class="num">04</span>
        <div class="title">
          <h3>数据与合规风险</h3>
          <p>代码会不会泄漏、模型私有化是否支持</p>
        </div>
      </header>
      <div class="qd-body">
        <div class="qd-q">
          <h5>QUESTIONS</h5>
          <ul>
            <li><span class="prio high">高频</span> Q1 · 数据是否安全</li>
            <li><span class="prio">Q2</span> · 如何保证安全前提下的使用体验？</li>
          </ul>
        </div>
        <div class="qd-a">
          <h5>ANSWER</h5>
          <ul>
            <li><b>A.</b> 腾讯侧会对数据进行分片传给大模型，云端不存在使用户代码相关信息，对比 claude code 会全文回传用户数据至云端并存储</li>
            <li><b>B.</b> 如果信息密集比较高，建议先使用海外模型进行方案设计，方案设计完成后使用国内模型进行执行，保障数据不出海</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
```

**CSS 关键样式**：
```css
.qd-head { margin-bottom: 8px; }
.qd-head h1 { font: 700 28px var(--font-display); color: var(--text); margin: 0; }
.qd-head h1 span { color: var(--text-dim); }
.progress-bar { display: flex; gap: 2px; height: 4px; margin-top: 8px; }
.progress-bar .seg { flex: 1; background: rgba(255,255,255,0.06); border-radius: 2px; }
.progress-bar .seg.done { background: var(--green); }
.progress-bar .seg.active { background: var(--amber); }
.qd-caption { font: 11px var(--font-mono); color: var(--text-dim); margin: 6px 0 10px; }
.qd-caption .en { color: var(--cyan); }
.qd-caption .zh { color: var(--amber); }

.qd-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.qd-card { border: 1px solid rgba(92,225,255,0.18); border-radius: 6px; padding: 10px 14px; display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.qd-card .qdh { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: start; padding-bottom: 6px; border-bottom: 1px solid rgba(92,225,255,0.12); }
.qd-card .num { font: 700 14px var(--font-mono); color: var(--cyan); padding: 2px 8px; border: 1px solid var(--cyan); border-radius: 3px; }
.qd-card .title h3 { font: 700 16px var(--font-display); color: var(--text); margin: 0 0 2px; }
.qd-card .title p { font: 11px var(--font-mono); color: var(--text-dim); margin: 0; }
.qd-card .flag { font: 10px var(--font-mono); color: var(--pink); padding: 2px 6px; border-radius: 2px; }

.qd-body { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; min-height: 0; }
.qd-q, .qd-a { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.qd-q h5, .qd-a h5 { font: 700 10px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; margin: 0; padding-bottom: 2px; border-bottom: 1px solid rgba(92,225,255,0.12); }
.qd-q ul, .qd-a ul { list-style: none; padding: 0; margin: 0; font: 11px/1.6 var(--font-sans); color: var(--text-dim); }
.qd-q li, .qd-a li { padding: 2px 0; }
.qd-q .prio { font: 9px var(--font-mono); color: var(--cyan); padding: 0 4px; border: 1px solid var(--cyan); border-radius: 2px; margin-right: 4px; }
.qd-q .prio.high { color: var(--amber); border-color: var(--amber); }
.qd-a b { color: var(--green); font-weight: 700; }
```

---

## A13. kanbanBacklog + metricStrip

**适用场景**：分上下半场的 backlog 路线图。上半场（slide 35）展示 4 列需求/架构/编码/评审；下半场（slide 36）展示 3 列测试/发布/管理 + 底部 4 个 KPI metric 条。

**视觉锚点**：
- **顶部 terminal 命令**：`$ cat roadmap.dev-review.json | grep priority=P0` + 一段描述（关键词琥珀/青色高亮）+ 关键提示行
- **环节 tab 条**：本页覆盖的环节（如 `01 需求分析与规划 6 · 02 系统架构与设计 2 · ...`）
- **FILTER 行**：ALL · N | P0 · 建议先做 | P1 | P2 + 右侧 STOCK 状态
- **4 列 kanban**：每列
  - 顶部：列编号 + 标题 + 卡片数 + 优先级分布条（P0:4 P1:1 P2:1）
  - 多张 backlog card，每张：P0/P1/P2 优先级徽章 + 标题 + 度量行（带 ↓↑ 箭头）+ 项目信息 + 状态圆点
- **底部 metric 条**：4 个 KPI（UNIT_TEST / RCA_TIME / INCIDENT / ALERT_NOISE），每个带顶部彩色细条 + 巨大数字 + 描述

**代表 slide**：35（需求规划 上半场）、36（需求规划 下半场 + metric）

**HTML 骨架（slide 35 上半场）**：
```html
<section class="slide" data-kind="kanban-half">
  <header class="kb-head">
    <div class="path">AI CODING · ROADMAP / BACKLOG · 上半场 / DEV → REVIEW</div>
    <h1>AI Coding 落地 · 需求规划 &amp; 最佳实践索引</h1>
    <div class="cmd-bar"><span class="prompt">$</span> <code>cat roadmap.dev-review.json | grep priority=P0</code></div>
    <p class="kb-desc">把"推行 AI Coding"拆成一条可执行的<em>需求清单</em>——需求→架构→编码→评审 四环节、<em>13 条需求</em>，每一条都挂着一份<em>腾讯内部 KM 实战文档</em>作为参考实现。</p>
    <p class="kb-hint">▶ 瓦片 = 1 条需求 + 1 份 KM 最佳实践 · 左侧 <b style="color:var(--green)">P0</b> 条优先推进点 · 顶部可按 P0/P1/P2 过滤 · 下半参见 Part 4 · TEST → OPS → ORG</p>
  </header>

  <div class="seg-tabs">
    <span class="lbl">// 本页环节</span>
    <span class="seg"><b>01</b> 需求分析与规划 6</span>
    <span class="sep">·</span>
    <span class="seg"><b>02</b> 系统架构与设计 2</span>
    <span class="sep">·</span>
    <span class="seg active"><b>03</b> 编码开发实现 5</span>
    <span class="sep">·</span>
    <span class="seg"><b>04</b> 代码评审（CR） 2</span>
  </div>

  <div class="filter-bar">
    <span class="lbl">FILTER:</span>
    <span class="chip active">● ALL · 15</span>
    <span class="chip">● P0 · 建议先做</span>
    <span class="chip">● P1</span>
    <span class="chip">● P2</span>
    <span class="stock">
      <span class="stock-l">STOCK:</span>
      <span class="dot ok"></span> FULL
      <span class="dot warn"></span> PART
      <span class="dot bad"></span> NONE
      <span class="hint">↗ click tile → doc</span>
    </span>
  </div>

  <div class="kanban">
    <div class="col" data-col="01">
      <header class="col-h">
        <span class="col-num">01</span>
        <span class="col-title">需求分析与规划</span>
        <span class="col-count">6</span>
      </header>
      <div class="col-bar"><span class="seg p0" style="width:66%"></span><span class="seg p1" style="width:17%"></span><span class="seg p2" style="width:17%"></span></div>
      <p class="col-legend">P0:4 P1:1 P2:1</p>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>自动生成 PRD 与用户故事</b><span class="status ok"></span></header>
        <p class="metric">需求撰写 ↓60% · 启动周期 ↓</p>
        <p class="src">lxl/@A6AA61 · 项目第一期</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>需求质量评估 / 多轮澄清</b><span class="status ok"></span></header>
        <p class="metric">评审时间 ↓30% · 返修率 ↑90%</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>AI 埋点需求定义</b><span class="status warn"></span></header>
        <p class="metric">埋点文档 ↓60% · 可视化阅读</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>需求智能解析 / 流程图</b><span class="status warn"></span></header>
        <p class="metric">自然语言 → 功能清单 · 逻辑流程图</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>工期与资源预估</b><span class="status warn"></span></header>
        <p class="metric">历史模型 + NL · 计划精度 ↑</p>
      </div>

      <div class="tile p2">
        <header><span class="badge">P2</span><b>竞品与市场调研</b><span class="status warn"></span></header>
        <p class="metric">联网检索 · 差异化分析报告</p>
      </div>
    </div>

    <div class="col" data-col="02">
      <header class="col-h">
        <span class="col-num">02</span>
        <span class="col-title">系统架构与设计</span>
        <span class="col-count">2</span>
      </header>
      <div class="col-bar"><span class="seg p0" style="width:50%"></span><span class="seg p1" style="width:50%"></span></div>
      <p class="col-legend">P0:1 P1:1 P2:0</p>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>架构设计建议与模式推荐</b><span class="status ok"></span></header>
        <p class="metric">设计时间 ↓50% · 蓝图/ER/接口</p>
        <p class="src">lxl/d79571 · 影像云 · 系统设计阶段实践</p>
      </div>

      <div class="tile p1">
        <header><span class="badge">P1</span><b>逆向工程 / 现代化迁移</b><span class="status warn"></span></header>
        <p class="metric">现代化周期 ↑3× · Java→Go</p>
        <p class="src">lxl/587269 · 觅影盒子结算重构</p>
      </div>
    </div>

    <div class="col" data-col="03">
      <header class="col-h">
        <span class="col-num">03</span>
        <span class="col-title">编码开发实现</span>
        <span class="col-tag">CORE</span>
        <span class="col-count">5</span>
      </header>
      <div class="col-bar"><span class="seg p0" style="width:80%"></span><span class="seg p1" style="width:20%"></span></div>
      <p class="col-legend">P0:4 P1:1 P2:0</p>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>上下文感知代码补全</b><span class="status ok"></span></header>
        <p class="metric">产出 ↑26% · 完成速度 ↑55%</p>
        <p class="src">built-in · 产品内置真实能力</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>多文件 / 跨模块开发</b><span class="status ok"></span></header>
        <p class="metric">提效 40-50% · 集成 Bug ↓</p>
        <p class="src">built-in · 产品内置真实能力</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>自主编程智能体</b><span class="status warn"></span></header>
        <p class="metric">时延 78-12× · 迁移成本 ↓20×</p>
        <p class="src">lxl/8e69c06 · AT 工蜂调度优化 · T 群全自动改代码</p>
      </div>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>设计稿转代码（D2C）</b><span class="status ok"></span></header>
        <p class="metric">可用度 &gt;80% · 协同效率 ↑</p>
        <p class="src">lxl/7312bb7 · 偏之品定 · D2C 经预跳动退交样</p>
      </div>

      <div class="tile p1">
        <header><span class="badge">P1</span><b>SDD / OpenSpec 工程化</b><span class="status warn"></span></header>
        <p class="metric">规范驱动开发 · /specify → /implement</p>
        <p class="src">lxl/6f64443 · CodeBuddyCode · OpenSpec 实施</p>
      </div>
    </div>

    <div class="col" data-col="04">
      <header class="col-h">
        <span class="col-num">04</span>
        <span class="col-title">代码评审（CR）</span>
        <span class="col-count">2</span>
      </header>
      <div class="col-bar"><span class="seg p0" style="width:50%"></span><span class="seg p1" style="width:50%"></span></div>
      <p class="col-legend">P0:1 P1:1 P2:0</p>

      <div class="tile p0">
        <header><span class="badge">P0</span><b>自动化质量与安全检查</b><span class="status ok"></span></header>
        <p class="metric">漏洞修复成本 ↓ · 千行 Bug 率 ↓</p>
        <p class="src">lxl/e125bc · 轻盈云前端 · 多场景技术拆 · 2 docs</p>
      </div>

      <div class="tile p1">
        <header><span class="badge">P1</span><b>任务对齐与意图验证</b><span class="status warn"></span></header>
        <p class="metric">对比 Jira/ADO · 减少返工</p>
        <p class="src">lxl/7d0b68 · 数据查询 · CodeBuddy →</p>
      </div>
    </div>
  </div>

  <footer class="kb-foot">
    <span class="cmd">$ cat roadmap.dev-review.json | wc -l → 13 条需求 · 12 份 KM 实践 · 可直接抄</span>
    <span class="nav">↘ 接下页：测试 / 运维 / 全流程 ▶</span>
  </footer>
</section>
```

**HTML 骨架（slide 36 下半场 + metric）**：
```html
<section class="slide" data-kind="kanban-half-metric">
  <!-- 同上头部 -->
  <div class="seg-tabs">
    <span class="lbl">// 本页环节</span>
    <span class="seg"><b>05</b> 测试与质量保证 4</span>
    <span class="sep">·</span>
    <span class="seg"><b>06</b> 发布与运维（AIOps）4</span>
    <span class="sep">·</span>
    <span class="seg"><b>07</b> 全流程与管理 2</span>
  </div>

  <!-- filter + kanban 同上，省略 -->

  <!-- 底部 metric 条 -->
  <footer class="metric-strip">
    <span class="ms-tag">// METRICS · HIGHLIGHTS</span>
    <div class="ms-tiles">
      <div class="ms-tile" data-color="cyan">
        <span class="ms-bar"></span>
        <span class="ms-key">UNIT_TEST</span>
        <span class="ms-num">+72%</span>
        <span class="ms-desc">单测覆盖率</span>
      </div>
      <div class="ms-tile" data-color="green">
        <span class="ms-bar"></span>
        <span class="ms-key">RCA_TIME</span>
        <span class="ms-num">-65%</span>
        <span class="ms-desc">故障定位时长</span>
      </div>
      <div class="ms-tile" data-color="amber">
        <span class="ms-bar"></span>
        <span class="ms-key">INCIDENT</span>
        <span class="ms-num">-43%</span>
        <span class="ms-desc">月度事故数</span>
      </div>
      <div class="ms-tile" data-color="pink">
        <span class="ms-bar"></span>
        <span class="ms-key">ALERT_NOISE</span>
        <span class="ms-num">-78%</span>
        <span class="ms-desc">告警噪音量</span>
      </div>
    </div>
  </footer>
</section>
```

**CSS 关键样式**：
```css
.kb-head .path { font: 700 11px var(--font-mono); color: var(--cyan); letter-spacing: 1.5px; margin-bottom: 8px; }
.kb-head h1 { font: 700 26px var(--font-display); color: var(--text); margin: 0 0 10px; }
.kb-head .cmd-bar { font: 12px var(--font-mono); color: var(--green); margin-bottom: 8px; }
.kb-head .cmd-bar .prompt { color: var(--amber); margin-right: 6px; }
.kb-head .cmd-bar code { color: var(--green); }
.kb-desc { font: 12px/1.6 var(--font-sans); color: var(--text); margin: 4px 0; }
.kb-desc em { color: var(--amber); font-style: normal; }
.kb-hint { font: 11px var(--font-mono); color: var(--text-dim); margin: 4px 0 12px; }

.seg-tabs { display: flex; gap: 8px; align-items: center; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; margin-bottom: 8px; font: 11px var(--font-mono); }
.seg-tabs .lbl { color: var(--text-dim); }
.seg-tabs .seg { color: var(--text-dim); padding: 2px 8px; border: 1px solid rgba(255,255,255,0.1); border-radius: 2px; }
.seg-tabs .seg b { color: var(--green); }
.seg-tabs .seg.active { color: var(--cyan); border-color: var(--cyan); background: rgba(92,225,255,0.08); }
.seg-tabs .sep { color: var(--text-dim); }

.filter-bar { display: flex; gap: 8px; align-items: center; padding: 6px 12px; font: 11px var(--font-mono); color: var(--text-dim); margin-bottom: 10px; }
.filter-bar .lbl { color: var(--amber); }
.filter-bar .chip { padding: 2px 8px; border-radius: 2px; cursor: pointer; }
.filter-bar .chip.active { color: var(--cyan); border: 1px solid var(--cyan); background: rgba(92,225,255,0.08); }
.filter-bar .chip:not(.active) { color: var(--text-dim); }
.filter-bar .stock { margin-left: auto; display: flex; gap: 8px; align-items: center; }
.filter-bar .stock-l { color: var(--text-dim); }
.filter-bar .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 2px; }
.filter-bar .dot.ok { background: var(--green); }
.filter-bar .dot.warn { background: var(--amber); }
.filter-bar .dot.bad { background: var(--pink); }
.filter-bar .hint { color: var(--text-dim); }

.kanban { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; flex: 1; min-height: 0; }
.col { display: flex; flex-direction: column; gap: 6px; padding: 8px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; min-width: 0; }
.col-h { display: flex; gap: 6px; align-items: baseline; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.col-num { font: 700 11px var(--font-mono); color: var(--green); }
.col-title { font: 700 13px var(--font-display); color: var(--text); }
.col-tag { font: 700 9px var(--font-mono); color: var(--cyan); padding: 1px 4px; border: 1px solid var(--cyan); border-radius: 2px; }
.col-count { margin-left: auto; font: 700 11px var(--font-mono); color: var(--text-dim); }
.col-bar { display: flex; height: 4px; border-radius: 2px; overflow: hidden; background: rgba(255,255,255,0.04); }
.col-bar .seg.p0 { background: var(--green); }
.col-bar .seg.p1 { background: var(--amber); }
.col-bar .seg.p2 { background: var(--pink); }
.col-legend { font: 9px var(--font-mono); color: var(--text-dim); margin: 0 0 4px; text-align: right; }

.tile { padding: 6px 8px; border-left: 2px solid; background: rgba(0,0,0,0.15); border-radius: 0 3px 3px 0; }
.tile.p0 { border-color: var(--green); }
.tile.p1 { border-color: var(--amber); }
.tile.p2 { border-color: var(--pink); }
.tile header { display: flex; gap: 6px; align-items: baseline; }
.tile .badge { font: 700 10px var(--font-mono); padding: 1px 5px; border-radius: 2px; }
.tile.p0 .badge { color: var(--green); border: 1px solid var(--green); }
.tile.p1 .badge { color: var(--amber); border: 1px solid var(--amber); }
.tile.p2 .badge { color: var(--pink); border: 1px solid var(--pink); }
.tile header b { font: 600 12px/1.4 var(--font-display); color: var(--text); flex: 1; }
.tile .status { width: 8px; height: 8px; border-radius: 50%; }
.tile .status.ok { background: var(--green); box-shadow: 0 0 6px var(--green); }
.tile .status.warn { background: var(--amber); }
.tile .metric { font: 10px/1.5 var(--font-mono); color: var(--text-dim); margin: 4px 0 0; }
.tile .src { font: 9px var(--font-mono); color: var(--cyan); margin: 2px 0 0; }

.kb-foot { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); font: 10px var(--font-mono); color: var(--text-dim); }
.kb-foot .cmd { color: var(--green); }
.kb-foot .nav { color: var(--amber); }

.metric-strip { padding: 10px 12px; border: 1px solid rgba(0,255,156,0.2); border-radius: 4px; margin-top: 10px; }
.metric-strip .ms-tag { font: 700 10px var(--font-mono); color: var(--green); letter-spacing: 1.5px; display: block; margin-bottom: 6px; }
.ms-tiles { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; }
.ms-tile { padding: 8px 12px; border-radius: 4px; background: rgba(0,0,0,0.2); position: relative; overflow: hidden; }
.ms-tile .ms-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
.ms-tile[data-color="cyan"] .ms-bar { background: var(--cyan); }
.ms-tile[data-color="green"] .ms-bar { background: var(--green); }
.ms-tile[data-color="amber"] .ms-bar { background: var(--amber); }
.ms-tile[data-color="pink"] .ms-bar { background: var(--pink); }
.ms-tile .ms-key { font: 700 10px var(--font-mono); color: var(--text-dim); letter-spacing: 1.5px; }
.ms-tile .ms-num { display: block; font: 700 24px var(--font-display); margin: 2px 0; }
.ms-tile[data-color="cyan"] .ms-num { color: var(--cyan); }
.ms-tile[data-color="green"] .ms-num { color: var(--green); }
.ms-tile[data-color="amber"] .ms-num { color: var(--amber); }
.ms-tile[data-color="pink"] .ms-num { color: var(--pink); }
.ms-tile .ms-desc { font: 10px var(--font-sans); color: var(--text-dim); }
```

---

## 9 种补充 layout 速查

| # | 名称 | 来源 slide | 核心特征 | 复用场景 |
|---|---|---|---|---|
| 9 | part-cover-CN | 20 / 25 / 34 | 中文 + 英文副标题大字 | 每章封面（中文为主） |
| 10 | layerFlowPanel | 18 | 5 层架构 + 2x2 Loop + 4 要点 | 领域知识架构页 |
| 11 | progressionStrip + denseSplit | 19 | 4 阶段条 + 6 primitive + 适合/不适合 + 叙事 | 概念演进 + 实践集合 |
| 12 | transformSideBySide | 22 | AS-IS/TO-BE + TRANSFORM + Formula | 现状 vs 转型对比 |
| 13 | timelineLadder + antiPattern | 23 | T+0/+6M/+18M + KPI + 阶段警告 + 底部反模式 | 分阶段实施路线 |
| 14 | roleMatrix 6-grid | 24 | 2x3 角色卡 + KEEP/SHRINK/AI TAKES/NEW + 公理条 | 角色能力重组 |
| 15 | qaGrid 4-col | 26 | 4 列问答 + 编号答案 + 对答话术 | 多主题 Q&A |
| 16 | heroThesis + insightTable | 27 | 顶部 hero + 左洞察 + 右表格 | 方法论提炼 + 参考 |
| 17 | stepTabPanel | 28 | 落地三步法 tab + 三步深讲 | 方法论步骤详解 |
| 18 | principleCard + goldenRule | 29 | 4 哲学 + 9 黄金法则 + CORE INSIGHT | 设计原则 + 实践 |
| 19 | docCardGrid | 31 | 文档卡（彩边 + 元数据 + tags + CTA） | 资源索引 / 笔记 |
| 20 | qaDual 2x2 | 32 / 33 | 2x2 + QUESTIONS/ANSWER 双栏 | 决策/技术 Q&A |
| 21 | kanbanBacklog + metric | 35 / 36 | 4 列 backlog + 优先级 + 底部 KPI 条 | 路线图看板 |

> 至此 `07-advanced-layouts.md` 共收录 **21 种 layout**（8 高频 + 11 补充 + A1-A13 补充），覆盖原参考站 37 张 slide 的全部内容页 layout。

---

# 附录 B：4 种收尾页 Layout（A14-A17）

> 收尾页的完整模板在 [closing/](../closing/) 子目录下（4 个文件 + 1 个 README）。
> 本附录给出每个 layout 的 30 秒速览，便于快速决定用哪一个。

| # | Layout | 文件 | 用途 |
|---|---|---|---|
| A14 | **thanksQandA** | [closing/01-thanks-qa.md](../closing/01-thanks-qa.md) | 致谢大字 + 3 列 Q&A 邀请（提问/加群/PPT） |
| A15 | **ctaAndContact** | [closing/02-cta-contact.md](../closing/02-cta-contact.md) | 主 CTA + 二维码 + 联系方式 grid + NEXT STEPS |
| A16 | **recapSummary** | [closing/03-recap-summary.md](../closing/03-recap-summary.md) | 5 张 takeaway 卡片 + TL;DR 一句话总结 |
| A17 | **referencesAndCredits** | [closing/04-references-credits.md](../closing/04-references-credits.md) | 参考资料分类 + 致谢 + 版权说明 + 联系 |

## 何时用哪个

```
演讲时长 < 30 min    → A14 thanksQandA（简单直接）
演讲时长 30-60 min   → A14 + A16 recapSummary（核心观点凝练）
商务 / 客户演讲      → A15 ctaAndContact（留资 + 加微信）
学术 / 技术深度      → A17 referencesAndCredits（致谢 + 引用）
培训 / workshop      → A14 + A16 + A15（致谢 + recap + 留群）
```

## 4 种 layout 共用设计要点

- **slide-corner**：写 `OPEN FLOOR` / `END` / `Q&A` / `RECAP` / `REFERENCES` 等收尾标识（不用 page number）
- **chrome slide-ref 区域**：写 `SESSION END` / `THANKS FOR WATCHING` 等告别词
- **footer-bar**：3 色 legend 可保留，但 GREEN 改为 `END` / `Q&A` 等
- **press 提示**：去掉（收尾页不需要再翻页）
- **window-chrome + line-numbers**：保留（保持视觉一致性）