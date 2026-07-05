# 03 · 关键回顾（Takeaway 卡片）

> **A16. recapSummary** — 把整场演讲的 3-5 个核心观点凝练成卡片
> 适合培训、工作坊、长演讲（>30 张内容页）的结尾，让听众带走最关键的几个 takeaway。

## 视觉锚点

- **顶部**：`KEY TAKEAWAYS` 大字标题 + 副标题 `本文 5 个核心观点`
- **主体**：5 张 takeaway 卡（横排或 3+2 网格），每张：
  - 编号徽章（01-05，渐变色：cyan → green → amber → pink → cyan）
  - 一句话核心观点（中文 18px 粗体）
  - 关联章节链接（PART 1 / PART 3 / slide 18 等）
  - 一行支撑论据（灰色）
- **底部**：`RECAP · TL;DR` 一句话总结（大字）+ 行动号召

## HTML 骨架

```html
<section class="slide" data-kind="recap-summary">
  <header class="recap-header">
    <h1 class="recap-title">KEY <em>TAKEAWAYS</em></h1>
    <p class="recap-sub">本文 5 个核心观点 · 带走这 5 张卡片</p>
  </header>

  <div class="takeaways">
    <div class="tk" data-color="cyan">
      <span class="tk-num">01</span>
      <h3>AI Coding 竞争点<br>从模型转向系统</h3>
      <p class="tk-link">↗ PART 2 · slide 19</p>
      <p class="tk-evidence">决定 Claude Code 效果的关键不是模型本身，而是围绕它搭起来的工作环境（CLAUDE.md + Hooks + Skills + Plugins）。</p>
    </div>

    <div class="tk" data-color="green">
      <span class="tk-num">02</span>
      <h3>不可跳级的<br>三阶段转型</h3>
      <p class="tk-link">↗ PART 3 · slide 23</p>
      <p class="tk-evidence">T+0 Adoption → T+6M Integration → T+18M Reshape，跳级等于"一地鸡毛"。</p>
    </div>

    <div class="tk" data-color="amber">
      <span class="tk-num">03</span>
      <h3>六工种能力重组<br>KEEP/SHRINK/AI TAKES/NEW</h3>
      <p class="tk-link">↗ PART 3 · slide 24</p>
      <p class="tk-evidence">不是偷加法 / 不是做减法 / 不是裁员 / 不是改 title —— 能力重组，四条公理。</p>
    </div>

    <div class="tk" data-color="pink">
      <span class="tk-num">04</span>
      <h3>Skills 设计的<br>四大哲学</h3>
      <p class="tk-link">↗ PART 4 · slide 29</p>
      <p class="tk-evidence">PROGRESSIVE DISCLOSURE · FLEXIBILITY OVER RIGIDITY · WRITE FOR MODELS · EVOLVE FROM PRACTICE。</p>
    </div>

    <div class="tk" data-color="cyan">
      <span class="tk-num">05</span>
      <h3>知识资产的<br>五层架构</h3>
      <p class="tk-link">↗ PART 2 · slide 18</p>
      <p class="tk-evidence">L0-P 个人 → L0-T 团队 → L1 技术 → L2 业务 → L3 项目，配套 draft/verified/proven 三级成熟度。</p>
    </div>
  </div>

  <footer class="recap-tldr">
    <span class="tldr-tag">RECAP · TL;DR</span>
    <span class="tldr-text">最好的 Skill 不是给 AI 更多通用知识，而是给它那些<em>不说不知道</em>的关键信息。</span>
  </footer>
</section>
```

## CSS

```css
.recap-summary {
  display: flex; flex-direction: column; gap: 14px; height: 100%;
}
.recap-header { text-align: center; padding: 4px 0; }
.recap-title {
  font: italic 700 48px/1.1 var(--font-display); color: var(--text); margin: 0;
  letter-spacing: -1px;
}
.recap-title em { color: var(--green); font-style: normal; text-shadow: 0 0 24px rgba(0,255,156,0.4); }
.recap-sub { font: 13px var(--font-sans); color: var(--text-dim); margin: 6px 0 0; }

.takeaways { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; flex: 1; min-height: 0; }
.tk {
  border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
  padding: 14px 16px; display: flex; flex-direction: column; gap: 6px;
  border-top: 3px solid;
  background: rgba(20, 30, 48, 0.3);
}
.tk[data-color="cyan"] { border-top-color: var(--cyan); }
.tk[data-color="green"] { border-top-color: var(--green); }
.tk[data-color="amber"] { border-top-color: var(--amber); }
.tk[data-color="pink"] { border-top-color: var(--pink); }

.tk-num { font: 700 24px var(--font-mono); }
.tk[data-color="cyan"] .tk-num { color: var(--cyan); }
.tk[data-color="green"] .tk-num { color: var(--green); }
.tk[data-color="amber"] .tk-num { color: var(--amber); }
.tk[data-color="pink"] .tk-num { color: var(--pink); }

.tk h3 { font: 700 16px/1.3 var(--font-display); color: var(--text); margin: 0; }
.tk-link { font: 11px var(--font-mono); color: var(--cyan); margin: 4px 0 0; }
.tk-evidence { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 4px 0 0; }

.recap-tldr {
  display: flex; gap: 16px; align-items: center; padding: 12px 20px;
  border: 1px solid rgba(0,255,156,0.3); border-left: 4px solid var(--green);
  border-radius: 4px; background: rgba(0,255,156,0.04);
}
.tldr-tag { font: 700 12px var(--font-mono); color: var(--green); letter-spacing: 2px; }
.tldr-text { font: 700 18px/1.4 var(--font-display); color: var(--text); }
.tldr-text em { color: var(--amber); font-style: normal; }
```

## 布局变体

### 变体 A：5 横排（适合 1440x900 宽屏）

```css
.takeaways { grid-template-columns: repeat(5, 1fr); }
```

### 变体 B：3 + 2（适合内容更密集）

```css
.takeaways { grid-template-columns: repeat(3, 1fr); }
.takeaways .tk:nth-child(4),
.takeaways .tk:nth-child(5) {
  grid-column: span 1; /* 第二行 2 张，居中 */
}
```

### 变体 C：3 横排（适合核心观点少）

```css
.takeaways { grid-template-columns: repeat(3, 1fr); }
```

## Checklist

- [ ] 5 张卡数量合适（4-6 张最佳，过多则失焦）
- [ ] 每张 tk-link 都关联到具体章节（便于回看）
- [ ] 编号颜色循环（cyan → green → amber → pink → cyan）
- [ ] TL;DR 是 1 句话总结而非 1 段话
- [ ] TL;DR 关键短语用 amber 高亮
- [ ] slide-corner 写 `[ NN / 37 ] RECAP`

## 何时用

- ✅ 演讲 > 30 张内容页，听众容易忘记前面讲的
- ✅ 培训 / workshop，学员需要带走 action items
- ✅ 销售演讲，结束时给客户 recap 价值点
- ❌ 短演讲（<10 张）不需要 recap
- ❌ 技术深度分享（一个主题讲透），不需要 recap（用 references 页代替）