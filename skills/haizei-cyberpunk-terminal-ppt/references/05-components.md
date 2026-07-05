# 05 · Components（11 个原子组件）

> 单个组件的 HTML + CSS 片段。可以在任何 layout 里直接复制粘贴。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"。

## 组件速查

| 组件 | 用途 | 关键样式 |
|---|---|---|
| **statCard** | 数字 + label + 描述 | Space Grotesk 大数字 + accent 色 |
| **kpiCard** | 核心 KPI（含进度条）| 大数字 + delta + 进度条 |
| **stepKpi** | 阶段内嵌 KPI | 步骤编号 + 数字 + 状态 |
| **channelBar** | 多渠道横向条 | 多色横向堆叠条 |
| **priorityChip** | P0/P1/P2 优先级 | 圆角 2px + bg + fg 配色 |
| **hBar** | 单条横向进度 | bg-soft + fg 实色 |
| **kpiBar** | KPI + 单条 | label + bar + 数字 |
| **spectrum** | 24 段连续色阶 | linear-gradient + 24 ticks |
| **progressRing** | 环形进度 | SVG circle + dasharray |
| **accentBadge** | 状态徽章 | border + dot + text |
| **noteCard** | 备注/警告卡 | 左侧条 + bg-soft + icon |

---

## 1. statCard（数字 + label + 描述）

```html
<div class="stat-card" style="--accent: var(--cyan);">
  <div class="stat-card__bar"></div>
  <div class="stat-card__label">[LABEL]</div>
  <div class="stat-card__value">42<span class="stat-card__unit">%</span></div>
  <div class="stat-card__desc">[2-3 行描述这个数字的含义]</div>
</div>

<style>
  .stat-card {
    position: relative;
    padding: 18px 20px 18px 22px;
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-radius: 2px;
  }
  .stat-card__bar {
    position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
  }
  .stat-card__label {
    font-size: 10px; letter-spacing: 0.22em;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .stat-card__value {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 36px; line-height: 1;
    color: var(--accent);
    text-shadow: 0 0 14px currentColor;
    margin-bottom: 10px;
  }
  .stat-card__unit { font-size: 16px; opacity: 0.7; margin-left: 2px; font-style: normal; }
  .stat-card__desc {
    font-size: 11px; color: var(--fg-dim);
    line-height: 1.55;
  }
</style>
```

---

## 2. kpiCard（KPI + delta + 进度条）

```html
<div class="kpi-card" style="--accent: var(--green);">
  <div class="kpi-card__head">
    <span class="kpi-card__label">[KPI LABEL]</span>
    <span class="kpi-card__delta">↑ 12%</span>
  </div>
  <div class="kpi-card__value">99.9<span class="kpi-card__unit">%</span></div>
  <div class="kpi-card__bar">
    <div class="kpi-card__bar-fill" style="width:85%;"></div>
  </div>
  <div class="kpi-card__note">target: 99.5% · actual: 99.9%</div>
</div>

<style>
  .kpi-card {
    padding: 16px 18px;
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-left: 2px solid var(--accent);
    border-radius: 2px;
  }
  .kpi-card__head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px;
  }
  .kpi-card__label {
    font-size: 10px; letter-spacing: 0.22em; color: var(--accent);
  }
  .kpi-card__delta {
    font-size: 11px; color: var(--green); letter-spacing: 0.18em;
  }
  .kpi-card__value {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 42px; line-height: 1;
    color: var(--accent);
    text-shadow: 0 0 14px currentColor;
    margin-bottom: 12px;
  }
  .kpi-card__unit { font-size: 18px; opacity: 0.7; margin-left: 2px; font-style: normal; }
  .kpi-card__bar {
    height: 4px;
    background: #ffffff10;
    border-radius: 1px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .kpi-card__bar-fill {
    height: 100%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  .kpi-card__note {
    font-size: 10px; color: var(--fg-mute); letter-spacing: 0.18em;
  }
</style>
```

---

## 3. stepKpi（阶段内嵌 KPI）

```html
<div class="step-kpi" style="--accent: var(--cyan);">
  <div class="step-kpi__no">STEP 03</div>
  <div class="step-kpi__value">128<span class="step-kpi__unit">k</span></div>
  <div class="step-kpi__label">MAU</div>
  <div class="step-kpi__status">✓ 完成</div>
</div>

<style>
  .step-kpi {
    padding: 14px 16px;
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-radius: 2px;
    position: relative;
  }
  .step-kpi__no {
    font-size: 9px; letter-spacing: 0.22em;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .step-kpi__value {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 28px; line-height: 1;
    color: var(--accent);
    text-shadow: 0 0 10px currentColor;
  }
  .step-kpi__unit { font-size: 12px; opacity: 0.7; margin-left: 2px; font-style: normal; }
  .step-kpi__label {
    font-size: 10px; color: var(--fg-dim);
    letter-spacing: 0.2em;
    margin-top: 6px;
  }
  .step-kpi__status {
    position: absolute; top: 12px; right: 12px;
    font-size: 10px; color: var(--green);
    letter-spacing: 0.18em;
  }
</style>
```

---

## 4. channelBar（多渠道横向条）

```html
<div class="channel-bar">
  <div class="channel-bar__label">[CHANNEL · 总计 100%]</div>
  <div class="channel-bar__track">
    <div class="channel-bar__seg" style="width:42%; background:var(--cyan);" title="[CHANNEL 1] 42%"></div>
    <div class="channel-bar__seg" style="width:28%; background:var(--amber);" title="[CHANNEL 2] 28%"></div>
    <div class="channel-bar__seg" style="width:18%; background:var(--pink);" title="[CHANNEL 3] 18%"></div>
    <div class="channel-bar__seg" style="width:12%; background:var(--green);" title="[CHANNEL 4] 12%"></div>
  </div>
  <div class="channel-bar__legend">
    <span><span class="channel-bar__dot" style="background:var(--cyan);"></span>[CH 1] 42%</span>
    <span><span class="channel-bar__dot" style="background:var(--amber);"></span>[CH 2] 28%</span>
    <span><span class="channel-bar__dot" style="background:var(--pink);"></span>[CH 3] 18%</span>
    <span><span class="channel-bar__dot" style="background:var(--green);"></span>[CH 4] 12%</span>
  </div>
</div>

<style>
  .channel-bar { font-family: var(--font-mono); }
  .channel-bar__label {
    font-size: 10px; color: var(--fg-dim);
    letter-spacing: 0.2em; margin-bottom: 8px;
  }
  .channel-bar__track {
    display: flex; height: 14px;
    border: 1px solid var(--rule);
    border-radius: 1px;
    overflow: hidden;
    background: #ffffff08;
  }
  .channel-bar__seg {
    height: 100%;
    transition: filter 0.2s;
  }
  .channel-bar__seg:hover { filter: brightness(1.4); }
  .channel-bar__legend {
    display: flex; gap: 16px; flex-wrap: wrap;
    margin-top: 10px;
    font-size: 11px; color: var(--fg);
  }
  .channel-bar__dot {
    display: inline-block;
    width: 8px; height: 8px;
    margin-right: 6px;
  }
</style>
```

---

## 5. priorityChip（P0/P1/P2 优先级）

```html
<span class="pri-chip pri--p0">P0</span>
<span class="pri-chip pri--p1">P1</span>
<span class="pri-chip pri--p2">P2</span>

<style>
  .pri-chip {
    display: inline-block;
    padding: 2px 8px;
    font-size: 9px; letter-spacing: 0.22em;
    font-family: var(--font-mono);
    border-radius: 1px;
    font-weight: 600;
  }
  .pri--p0 { background: #ff2e8820; color: var(--pink); border: 1px solid #ff2e8855; }
  .pri--p1 { background: #ffb02020; color: var(--amber); border: 1px solid #ffb02055; }
  .pri--p2 { background: #5ce1ff20; color: var(--cyan); border: 1px solid #5ce1ff55; }
</style>
```

---

## 6. hBar（单条横向进度）

```html
<div class="h-bar" style="--accent: var(--green); --pct: 75%;">
  <div class="h-bar__head">
    <span class="h-bar__label">[LABEL]</span>
    <span class="h-bar__pct">75%</span>
  </div>
  <div class="h-bar__track">
    <div class="h-bar__fill"></div>
  </div>
</div>

<style>
  .h-bar { font-family: var(--font-mono); }
  .h-bar__head {
    display: flex; justify-content: space-between;
    font-size: 11px; color: var(--fg);
    margin-bottom: 6px;
  }
  .h-bar__label { letter-spacing: 0.18em; }
  .h-bar__pct { color: var(--accent); font-weight: 600; }
  .h-bar__track {
    height: 6px;
    background: #ffffff10;
    border-radius: 1px;
    overflow: hidden;
  }
  .h-bar__fill {
    height: 100%;
    width: var(--pct);
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
</style>
```

---

## 7. kpiBar（KPI + 单条）

```html
<div class="kpi-bar" style="--accent: var(--cyan); --pct: 62%;">
  <div class="kpi-bar__label">[KPI LABEL]</div>
  <div class="kpi-bar__row">
    <div class="kpi-bar__value">62<span class="kpi-bar__unit">%</span></div>
    <div class="kpi-bar__track"><div class="kpi-bar__fill"></div></div>
  </div>
</div>

<style>
  .kpi-bar {
    padding: 12px 16px;
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-radius: 2px;
  }
  .kpi-bar__label {
    font-size: 10px; letter-spacing: 0.22em;
    color: var(--accent);
    margin-bottom: 8px;
  }
  .kpi-bar__row {
    display: flex; align-items: center; gap: 16px;
  }
  .kpi-bar__value {
    font-family: var(--font-display);
    font-weight: 700; font-style: italic;
    font-size: 24px;
    color: var(--accent);
    text-shadow: 0 0 10px currentColor;
    min-width: 80px;
  }
  .kpi-bar__unit { font-size: 12px; opacity: 0.7; font-style: normal; }
  .kpi-bar__track {
    flex: 1;
    height: 5px;
    background: #ffffff10;
    border-radius: 1px;
    overflow: hidden;
  }
  .kpi-bar__fill {
    height: 100%;
    width: var(--pct);
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
</style>
```

---

## 8. spectrum（24 段连续色阶）

```html
<div class="spectrum">
  <div class="spectrum__label">[LABEL · 24 段]</div>
  <div class="spectrum__track">
    <div class="spectrum__seg" style="background:#ff2e88;"></div>
    <div class="spectrum__seg" style="background:#ee3982;"></div>
    <div class="spectrum__seg" style="background:#dd447c;"></div>
    <!-- ...共 24 段，用 CSS 变量或 JS 生成 -->
  </div>
  <div class="spectrum__ticks">
    <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
    <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span>
  </div>
</div>

<style>
  .spectrum { font-family: var(--font-mono); }
  .spectrum__label {
    font-size: 10px; color: var(--fg-dim);
    letter-spacing: 0.2em; margin-bottom: 6px;
  }
  .spectrum__track {
    display: flex; height: 28px;
    border: 1px solid var(--rule);
  }
  .spectrum__seg { flex: 1; height: 100%; }
  .spectrum__ticks {
    display: flex; justify-content: space-between;
    font-size: 8px; color: var(--fg-mute);
    margin-top: 4px;
    letter-spacing: 0;
  }
</style>

<!-- 更简洁版（用 inline 渐变生成 24 段） -->
<div class="spectrum-simple" style="background:linear-gradient(to right,
  #ff2e88 0%, #ee3982 4%, #dd447c 8%, /* ... */ #00ff9c 100%);
  height:28px; border:1px solid var(--rule);"></div>
```

---

## 9. progressRing（环形进度）

```html
<div class="ring" style="--pct: 75; --accent: var(--green);">
  <svg viewBox="0 0 100 100" width="80" height="80">
    <circle cx="50" cy="50" r="42" fill="none"
            stroke="#ffffff10" stroke-width="6"/>
    <circle cx="50" cy="50" r="42" fill="none"
            stroke="var(--accent)" stroke-width="6"
            stroke-dasharray="263.89" stroke-dashoffset="65.97"
            transform="rotate(-90 50 50)"
            stroke-linecap="round"
            style="filter: drop-shadow(0 0 6px var(--accent));"></circle>
    <text x="50" y="55" text-anchor="middle"
          font-family="JetBrains Mono" font-size="20" font-weight="700"
          fill="var(--accent)">75%</text>
  </svg>
  <div class="ring__label">[LABEL]</div>
</div>

<style>
  .ring {
    display: inline-flex; flex-direction: column;
    align-items: center; gap: 8px;
  }
  .ring__label {
    font-size: 10px; color: var(--fg-dim);
    letter-spacing: 0.2em;
  }
</style>
```

---

## 10. accentBadge（状态徽章）

```html
<span class="badge badge--g"><span class="badge__dot"></span>[OK]</span>
<span class="badge badge--c"><span class="badge__dot"></span>[INFO]</span>
<span class="badge badge--a"><span class="badge__dot"></span>[WARN]</span>
<span class="badge badge--p"><span class="badge__dot"></span>[ERR]</span>

<style>
  .badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 3px 10px;
    font-size: 10px; letter-spacing: 0.22em;
    font-family: var(--font-mono);
    border-radius: 1px;
  }
  .badge__dot {
    display: inline-block;
    width: 6px; height: 6px;
    border-radius: 50%;
  }
  .badge--g { background: #00ff9c14; color: var(--green); border: 1px solid #00ff9c44; }
  .badge--g .badge__dot { background: var(--green); box-shadow: 0 0 4px var(--green); }
  .badge--c { background: #5ce1ff14; color: var(--cyan);  border: 1px solid #5ce1ff44; }
  .badge--c .badge__dot { background: var(--cyan);  box-shadow: 0 0 4px var(--cyan); }
  .badge--a { background: #ffb02014; color: var(--amber); border: 1px solid #ffb02044; }
  .badge--a .badge__dot { background: var(--amber); box-shadow: 0 0 4px var(--amber); }
  .badge--p { background: #ff2e8814; color: var(--pink);  border: 1px solid #ff2e8844; }
  .badge--p .badge__dot { background: var(--pink);  box-shadow: 0 0 4px var(--pink); }
</style>
```

---

## 11. noteCard（备注/警告卡）

```html
<div class="note-card note-card--info">
  <div class="note-card__icon">▸</div>
  <div>
    <div class="note-card__title">[NOTE TITLE]</div>
    <div class="note-card__body">[备注 / 警告 / 说明 文字内容]</div>
  </div>
</div>

<div class="note-card note-card--warn">
  <div class="note-card__icon">!</div>
  <div>
    <div class="note-card__title">[WARNING TITLE]</div>
    <div class="note-card__body">[警告文字内容]</div>
  </div>
</div>

<div class="note-card note-card--ok">
  <div class="note-card__icon">✓</div>
  <div>
    <div class="note-card__title">[SUCCESS TITLE]</div>
    <div class="note-card__body">[成功 / 通过文字内容]</div>
  </div>
</div>

<style>
  .note-card {
    display: flex; gap: 12px;
    padding: 12px 16px;
    border-left: 2px solid;
    background: #ffffff06;
    border-radius: 0 2px 2px 0;
  }
  .note-card--info { border-color: var(--cyan); }
  .note-card--warn { border-color: var(--amber); }
  .note-card--ok   { border-color: var(--green); }
  .note-card--err  { border-color: var(--pink); }

  .note-card__icon {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 18px;
    line-height: 1;
    flex-shrink: 0;
    width: 24px;
  }
  .note-card--info .note-card__icon { color: var(--cyan); }
  .note-card--warn .note-card__icon { color: var(--amber); }
  .note-card--ok   .note-card__icon { color: var(--green); }
  .note-card--err  .note-card__icon { color: var(--pink); }

  .note-card__title {
    font-size: 11px;
    letter-spacing: 0.22em;
    color: var(--fg);
    margin-bottom: 4px;
  }
  .note-card__body {
    font-size: 12px;
    color: var(--fg-dim);
    line-height: 1.6;
  }
</style>
```

---

## Checklist

- [ ] 组件 accent 色用 `--cyan` / `--amber` / `--pink` / `--green`
- [ ] 数字用 Space Grotesk italic + text-shadow
- [ ] label / kicker 用等宽字体 + letter-spacing
- [ ] 圆角 ≤ 2px
- [ ] 边框 1px + 内部 bg 半透明白 `#ffffff06`

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| 数字看起来像普通文字 | 没用 Space Grotesk italic | font-family display + 700 + italic |
| bar 看不清进度 | track 太亮 / fill 太暗 | track 用 `#ffffff10`，fill 用 accent 全饱和 |
| chip 不像"优先级" | 没用 bg + border 配色 | 必须 `background` + `border` + `color` 三件套 |
| ring 数字看不清 | 用普通字号 | 至少 18px + accent 色 + 中心对齐 |