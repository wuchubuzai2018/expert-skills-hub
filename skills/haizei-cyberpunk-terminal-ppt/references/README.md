# references 速查手册

> **设计知识库**——所有 layout / 组件的"如何使用 + 完整可运行 HTML 模板"。
> **完全自包含**：不引用任何外部文件，复制即用。

## 读法

```
1. 先读 00-design-system.md         ← 设计令牌 + 基础 HTML 底座（必读）
2. 按章节类型挑 layout              ← 01 / 02 / 03 / 04 / 07
3. 需要组件时翻 05-components.md    ← 11 个原子组件
4. 渲染调试翻 06-rendering-tips.md  ← 字体加载 / 动画 / 性能 / 调试
```

## 文件清单

| 文件 | 何时读 | 内容 |
|---|---|---|
| [00-design-system.md](00-design-system.md) | **第一份必读** | 设计令牌（颜色/字体/字号/动画）+ 完整基础 HTML 模板 |
| [01-cover.md](01-cover.md) | 设计封面 | cover layout + 4 种变体 + 完整 HTML |
| [02-toc.md](02-toc.md) | 设计目录 | toc layout + 卡片矩阵 + 完整 HTML |
| [03-part-cover.md](03-part-cover.md) | 设计章节封面 | part-cover layout + 4 种变体 + 完整 HTML |
| [04-content-pages.md](04-content-pages.md) | 设计正文 | **6 种基础 layout**：4-card / 3-card / 2-col / KPI / timeline / roadmap |
| [05-components.md](05-components.md) | 设计组件 | **11 个原子组件**：statCard / kpiCard / stepKpi / channelBar / priorityChip / hBar / kpiBar / spectrum / progressRing / accentBadge / noteCard |
| [06-rendering-tips.md](06-rendering-tips.md) | 渲染/调试 | 字体加载 / grid 技巧 / 动画 / 性能 / 调试 |
| [07-advanced-layouts.md](07-advanced-layouts.md) | 设计高级页 | **10 种高级 layout**：arch-flow / intro-typ / layer-stack / loop-evo / repo-tree / yaml-code / spectrum-page / note-card-page / harness-table / quadrant |
| [08-roadmap-tile.md](08-roadmap-tile.md) | 设计路线图 | roadmap-tile 完整模板（4 列 × N tile）|

## AI 使用流程

```bash
# 1. 复制 references/00-design-system.md 里的「完整基础模板」到 index.html

# 2. 为每页复制对应 layout 模板（HTML 片段），插入到 <body> 里

# 3. 替换所有 [LIKE-THIS] 占位符为真实文案

# 4. 浏览器打开，按 ← → 翻页

# 5. 可选：Puppeteer 抓 PDF
node ../.claude/skills/haizei-cyberpunk-terminal-ppt/scripts/render-ppt.mjs ./index.html --out ./slides
```

## 模板约定

每个 md 文件的 HTML 模板都遵循：

- **自包含**：包含 design tokens + 该 layout 的全部 markup + 该 layout 的 CSS
- **占位符**：所有可替换文案用 `[LIKE-THIS]` 标记（如 `[TITLE]`、`[KPI-VALUE]`）
- **可裁剪**：包含 4 种变体时用 `<!-- 变体 1：xxx -->` 注释分隔
- **可运行**：复制粘贴到 index.html 即可在浏览器看效果

## 反模式速查（绝对不要做）

- ❌ 纯白 / 纯黑背景
- ❌ emoji 作为视觉元素
- ❌ 圆角 ≥ 8px
- ❌ 32-48px 大段正文
- ❌ 在终端命令栏里写中文
- ❌ Material Design 风格的悬浮按钮
- ❌ 用渐变背景填充 hero

## 调试技巧

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
```