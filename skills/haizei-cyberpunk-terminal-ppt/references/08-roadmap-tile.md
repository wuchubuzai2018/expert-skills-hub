# 08 · Roadmap Tile（路线图瓦片 · 最复杂 layout）

> **PPT 中最复杂的 layout**：N 列（季度/月份）× N 行（功能/事项）= M 个 tile。
> 每个 tile 含：优先级 chip / 状态 / 标题 / 负责人 / 进度条。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"。

## 核心原则

1. **列 = 时间段**（H1 / Q1 / Q2 / 月份），行 = 功能流 / 主题
2. **每个 tile 5 要素**：优先级 / 状态点 / 标题 / 负责人 / 进度
3. **列数限制**：3-5 列最佳，超过 5 列会挤
4. **行数限制**：每列 5-9 个 tile 最佳
5. **进度可视化**：用 `h-bar`（06）显示 0-100% 进度

## 完整 HTML 模板（4 列 × 7 行）

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>ROADMAP · 4Q · 2026</span>
    <span class="sep">/</span>
    <span>28 items</span>
    <span class="sep">/</span>
    <span style="color:var(--pink)">[WARN]</span>
    <span>draft v0.3</span>
  </div>

  <div class="stage" style="padding:48px 60px;">
    <!-- 标题区 -->
    <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px;">
      <div>
        <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:10px;">◆ ROADMAP</div>
        <h1 style="font-family:var(--font-sans); font-weight:700; font-size:32px;
                   letter-spacing:-0.02em; margin-bottom:6px;">
          [路线图标题]<span class="cursor"></span>
        </h1>
        <div style="font-size:12px; color:var(--fg-dim);">[一句话说明时间范围 / 总事项数]</div>
      </div>
      <!-- 图例 -->
      <div style="display:flex; gap:12px; font-size:10px;">
        <span><span class="pri-chip pri--p0">P0</span> 关键</span>
        <span><span class="pri-chip pri--p1">P1</span> 重要</span>
        <span><span class="pri-chip pri--p2">P2</span> 一般</span>
      </div>
    </div>

    <!-- 4 列 tile 网格 -->
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px;">
      
      <!-- ===== 列 1：Q1 ===== -->
      <div class="rm-col">
        <div class="rm-col__head" style="--accent:var(--cyan);">
          <span>Q1 · 2026</span>
          <span class="rm-col__meta">7 items</span>
        </div>
        <div class="rm-col__body">
          
          <div class="rm-tile">
            <span class="pri-chip pri--p0">P0</span>
            <span class="rm-tile__status status--done">✓</span>
            <div class="rm-tile__title">[已完成事项 1]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:100%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p0">P0</span>
            <span class="rm-tile__status status--done">✓</span>
            <div class="rm-tile__title">[已完成事项 2]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:100%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p1">P1</span>
            <span class="rm-tile__status status--wip">●</span>
            <div class="rm-tile__title">[进行中事项 3]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:60%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p1">P1</span>
            <span class="rm-tile__status status--wip">●</span>
            <div class="rm-tile__title">[进行中事项 4]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:30%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p2">P2</span>
            <span class="rm-tile__status status--todo">○</span>
            <div class="rm-tile__title">[待办事项 5]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:0%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p2">P2</span>
            <span class="rm-tile__status status--todo">○</span>
            <div class="rm-tile__title">[待办事项 6]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:0%;"></div></div>
          </div>

          <div class="rm-tile">
            <span class="pri-chip pri--p2">P2</span>
            <span class="rm-tile__status status--todo">○</span>
            <div class="rm-tile__title">[待办事项 7]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:0%;"></div></div>
          </div>
        </div>
      </div>

      <!-- ===== 列 2：Q2 ===== -->
      <div class="rm-col">
        <div class="rm-col__head" style="--accent:var(--amber);">
          <span>Q2 · 2026</span>
          <span class="rm-col__meta">7 items</span>
        </div>
        <div class="rm-col__body">
          <div class="rm-tile">
            <span class="pri-chip pri--p0">P0</span>
            <span class="rm-tile__status status--wip">●</span>
            <div class="rm-tile__title">[进行中事项 8]</div>
            <div class="rm-tile__owner">[owner]</div>
            <div class="rm-tile__bar"><div class="rm-tile__bar-fill" style="width:40%;"></div></div>
          </div>
          <!-- ... 更多 tile ... -->
        </div>
      </div>

      <!-- ===== 列 3：Q3 ===== -->
      <div class="rm-col">
        <div class="rm-col__head" style="--accent:var(--pink);">
          <span>Q3 · 2026</span>
          <span class="rm-col__meta">7 items</span>
        </div>
        <div class="rm-col__body">
          <!-- ... -->
        </div>
      </div>

      <!-- ===== 列 4：Q4 ===== -->
      <div class="rm-col">
        <div class="rm-col__head" style="--accent:var(--green);">
          <span>Q4 · 2026</span>
          <span class="rm-col__meta">7 items</span>
        </div>
        <div class="rm-col__body">
          <!-- ... -->
        </div>
      </div>
    </div>
  </div>

  <div class="chrome chrome--bottom">
    <span class="prompt">cat /roadmap/2026.md</span>
    <span style="margin-left:auto; color:var(--fg-mute);">28 items · last update [date]</span>
  </div>
</section>

<style>
  /* 复用 04-content-pages.md 的 pri-chip / 复用 05-components.md 的 h-bar 模式 */

  .rm-col {
    background: #ffffff06;
    border: 1px solid var(--rule);
    border-radius: 2px;
  }
  .rm-col__head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
    font-size: 11px; letter-spacing: 0.22em;
    color: var(--accent);
    border-bottom: 1px solid var(--accent);
    background: #ffffff0a;
  }
  .rm-col__meta {
    font-size: 9px;
    color: var(--fg-mute);
    letter-spacing: 0.18em;
  }
  .rm-col__body {
    padding: 10px;
    display: flex; flex-direction: column; gap: 6px;
  }

  .rm-tile {
    padding: 8px 10px;
    background: #ffffff04;
    border-left: 2px solid var(--rule);
    display: grid;
    grid-template-columns: 32px 18px 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "pri status title"
      "pri status owner"
      "bar bar bar";
    gap: 4px 6px;
    align-items: center;
  }
  .rm-tile__title {
    grid-area: title;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.3;
  }
  .rm-tile__owner {
    grid-area: owner;
    font-size: 9px;
    color: var(--fg-mute);
    letter-spacing: 0.18em;
  }
  .rm-tile__status {
    grid-area: status;
    font-size: 14px;
    text-align: center;
  }
  .status--done { color: var(--green); }
  .status--wip  { color: var(--amber); animation: pulse 1.5s infinite; }
  .status--todo { color: var(--fg-mute); }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.4; }
  }

  .rm-tile__bar {
    grid-area: bar;
    height: 3px;
    background: #ffffff10;
    border-radius: 1px;
    overflow: hidden;
    margin-top: 4px;
  }
  .rm-tile__bar-fill {
    height: 100%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
  }
</style>
```

---

## 3 种变体

### 变体 1：3 列简化版（Q1/Q2/Q3 · 每列 5 tile）

```html
<!-- 同上结构，3 列 + 5 tile/列，更易看清 -->
<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:14px;">
  <!-- ...3 列 ... -->
</div>
```

### 变体 2：按主题分列（不是按季度）

```html
<!-- 列：INFRASTRUCTURE / PRODUCT / GROWTH / RESEARCH -->
<div class="rm-col__head" style="--accent:var(--cyan);">
  <span>INFRASTRUCTURE</span>
</div>
```

### 变体 3：宽窄交错（重点列宽，背景列窄）

```html
<div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:12px;">
  <!-- Q1 宽，其他窄 -->
</div>
```

---

## Checklist

- [ ] 列数 3-5 列（超过 5 列会挤）
- [ ] 每列 tile 数 5-9（超过会滚动）
- [ ] 每个 tile 都有 5 要素：pri / status / title / owner / bar
- [ ] status 用 `✓` / `●` / `○` 三色（绿 / 琥珀 / 灰）
- [ ] 进度条用 `--green` 渐变 + box-shadow 辉光
- [ ] 图例区有 P0/P1/P2 配色说明
- [ ] 至少 1 个 tile 处于 `wip` 状态（用脉冲动画）
- [ ] 1440×900 视口下不溢出

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| tile 看起来都一样 | 没用 status 区分 | 加 `✓` / `●` / `○` + 颜色 |
| 进度条看不出进度 | 颜色太暗 / track 太亮 | track `#ffffff10`，fill `--green` 全饱和 |
| tile 标题溢出 | 太长 | 限制 ≤ 12 字 + `text-overflow: ellipsis` |
| 列宽不等距 | 用了 `2fr 1fr 1fr 1fr` 但不说明 | 默认等距，需要强调时再改 |
| 全部 P0/P1 | 优先级没分层 | 至少 30% 是 P2（说明不是全部关键） |
| 没有 owner | 信息太"虚" | 加 owner（小字、灰），增加 accountability |
| 看起来像 Jira 看板 | 用了彩色卡 + 圆角 + 阴影 | 改用 1px 边框 + 半透明白 bg + 2px accent 条 |