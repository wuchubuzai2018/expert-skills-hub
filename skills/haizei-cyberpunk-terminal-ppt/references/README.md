# references 速查手册

> **设计知识库**——所有 layout / 组件的"如何使用 + 完整可运行 HTML 模板"。
> **完全自包含**：不引用任何外部文件，复制即用。
> **渐进式加载**：核心 layout 在主目录，进阶 layout 在 `advanced-layouts/` 和 `closing/` 子目录。

## 读法（渐进式）

```
1. 必读：00-design-system.md              ← 设计令牌 + 基础 HTML 底座
2. 按章节类型挑 layout（核心）             ← 01 / 02 / 03 / 04 / 07 / 08
3. 需要组件时翻 05-components.md           ← 11 个原子组件
4. 渲染调试翻 06-rendering-tips.md         ← 字体加载 / 动画 / 性能 / 调试
5. 8 高频不够用时：翻 advanced-layouts/   ← 按需加载（基础模式 + 补充模式）
6. 设计 PPT 收尾时：翻 closing/           ← 4 种收尾页 layout
```

## 文件清单

### 主目录（核心 · 必读 + 高频）

| 文件 | 何时读 | 内容 |
|---|---|---|
| [00-design-system.md](00-design-system.md) | **第一份必读** | 设计令牌（颜色/字体/字号/动画）+ 完整基础 HTML 模板 |
| [01-cover.md](01-cover.md) | 设计封面 | cover layout + 5 种变体 + 完整 HTML |
| [02-toc.md](02-toc.md) | 设计目录 | toc layout + 卡片矩阵 + 完整 HTML |
| [03-part-cover.md](03-part-cover.md) | 设计章节封面 | part-cover layout + 5 种变体 + 完整 HTML |
| [04-content-pages.md](04-content-pages.md) | 设计正文 | **8 种基础 layout**：thesisPanel+stepCard / 4-card / 3-card / 2-col / KPI / timeline / roadmap / frameworkCard |
| [05-components.md](05-components.md) | 设计组件 | **11 个原子组件**：statCard / kpiCard / stepKpi / channelBar / priorityChip / hBar / kpiBar / spectrum / progressRing / accentBadge / noteCard |
| [06-rendering-tips.md](06-rendering-tips.md) | 渲染/调试 | 字体加载 / grid 技巧 / 动画 / 性能 / 调试 |
| [07-advanced-layouts.md](07-advanced-layouts.md) | 设计高级页（核心） | **8 种高频 layout 完整模板** + nav + Checklist + 失败模式（90K） |
| [08-roadmap-tile.md](08-roadmap-tile.md) | 设计路线图 | roadmap-tile 完整模板（4 列 × N tile）|

### advanced-layouts/ 子目录（进阶 · 按需加载）

| 文件 | 何时读 | 内容 |
|---|---|---|
| [advanced-layouts/README.md](advanced-layouts/README.md) | **子目录导航** | 渐进式加载策略 + 完整 layout 目录（21 种）|
| [advanced-layouts/01-basic-patterns.md](advanced-layouts/01-basic-patterns.md) | 需要基础但低频 layout | **9-19 基础模式**：arch-flow / intro-typ / layer-stack / loop-evo / repo-tree / yaml-code / spectrum-page / note-card-page / harness-table / quadrant / mode-stack（18K）|
| [advanced-layouts/02-supplementary.md](advanced-layouts/02-supplementary.md) | 设计复杂中段内容页 | **A1-A13 补充模式**：part-cover-CN / layerFlowPanel / progressionStrip+denseSplit / transformSideBySide / timelineLadder+antiPattern / roleMatrix 6-grid / qaGrid 4-col / heroThesis+insightTable / stepTabPanel / principle+goldenRule / docCardGrid / qaDual 2x2 / kanbanBacklog+metric（124K）|

### closing/ 子目录（收尾页 · 按需加载）

| 文件 | 何时读 | 内容 |
|---|---|---|
| [closing/README.md](closing/README.md) | **收尾页导航** | 4 种收尾 layout 速查 + 何时用哪个 |
| [closing/01-thanks-qa.md](closing/01-thanks-qa.md) | PPT 结束时 | **A14 thanksQandA**：致谢大字 + 3 列 Q&A 邀请 |
| [closing/02-cta-contact.md](closing/02-cta-contact.md) | 演讲结束 / 留资环节 | **A15 ctaAndContact**：主 CTA + 二维码 + 联系方式 grid |
| [closing/03-recap-summary.md](closing/03-recap-summary.md) | 关键观点多 / 培训场景 | **A16 recapSummary**：5 张 takeaway 卡片 + TL;DR |
| [closing/04-references-credits.md](closing/04-references-credits.md) | 内容引用多 / 学术演讲 | **A17 referencesAndCredits**：参考资料分类 + 致谢 + 版权 |

## 文件大小对比（渐进式加载的收益）

```
核心（始终加载）:
  00-design-system.md    23K
  01-cover.md            16K
  02-toc.md              14K
  03-part-cover.md       13K
  04-content-pages.md    38K
  05-components.md       16K
  06-rendering-tips.md    8K
  07-advanced-layouts.md 90K  ← 从 218K 降到 90K（拆分后）
  08-roadmap-tile.md     10K
  ────────────────────────
  小计                   228K  (vs 拆分前 320K，节省 30%)

进阶（按需加载）:
  advanced-layouts/01-basic-patterns.md   18K
  advanced-layouts/02-supplementary.md    124K
  closing/01-thanks-qa.md                  6K
  closing/02-cta-contact.md                7K
  closing/03-recap-summary.md              5K
  closing/04-references-credits.md         8K
  ────────────────────────
  合计                  168K  ← 仅在用到时加载
```

## 渐进式加载的好处

1. **首读只加载 228K**（核心 9 个文件）
2. **设计 PPT 收尾时** 才加载 closing/（26K）
3. **设计复杂内容页时** 才加载 advanced-layouts/（142K）
4. **总节省** ~30% 上下文占用 + 更清晰的导航

## AI 使用流程

```bash
# 1. 复制 references/00-design-system.md 里的「完整基础模板」到 index.html

# 2. 为每页复制对应 layout 模板（HTML 片段），插入到 <body> 里
#    - 内容页 → 07-advanced-layouts.md（8 高频）
#    - 复杂页 → advanced-layouts/02-supplementary.md（A1-A13）
#    - 收尾页 → closing/01-04.md（A14-A17）

# 3. 替换所有 [LIKE-THIS] 占位符为真实文案

# 4. 浏览器打开，按 ← → 翻页

# 5. 可选：Puppeteer 抓 PDF
node ../.claude/skills/haizei-cyberpunk-terminal-ppt/scripts/render-ppt.mjs ./index.html --out ./slides
```

## 模板约定

每个 md 文件的 HTML 模板都遵循：

- **自包含**：包含 design tokens + 该 layout 的全部 markup + 该 layout 的 CSS
- **占位符**：所有可替换文案用 `[LIKE-THIS]` 标记（如 `[TITLE]`、`[KPI-VALUE]`）
- **可裁剪**：包含多种变体时用 `<!-- 变体 1：xxx -->` 注释分隔
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