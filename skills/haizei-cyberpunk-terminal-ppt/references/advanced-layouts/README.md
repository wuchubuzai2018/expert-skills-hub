# Advanced Layouts · 高级 layout 子目录

> 包含 8 种高频 layout 之外的"按需加载"layout。
> 本目录与 `closing/` 都属于 **进阶内容** —— 不是每张 PPT 都需要，使用时再读。

## 文件清单

| 文件 | 何时读 | 内容规模 |
|---|---|---|
| [01-basic-patterns.md](01-basic-patterns.md) | 需要"基础但低频"的 layout | 18K · 9 种（arch-flow / intro-typ / layer-stack / loop-evo / repo-tree / yaml-code / spectrum-page / note-card-page / harness-table / quadrant / mode-stack）|
| [02-supplementary.md](02-supplementary.md) | 设计中段复杂内容页 | 124K · 13 种（A1-A13：part-cover-CN / layerFlowPanel / progressionStrip+denseSplit / transformSideBySide / timelineLadder+antiPattern / roleMatrix 6-grid / qaGrid 4-col / heroThesis+insightTable / stepTabPanel / principle+goldenRule / docCardGrid / qaDual 2x2 / kanbanBacklog+metric）|

## 与主文件 07-advanced-layouts.md 的关系

```
07-advanced-layouts.md      ← 始终可访问：nav + 8 高频 layout
advanced-layouts/
  01-basic-patterns.md      ← 按需：9-19 基础模式
  02-supplementary.md       ← 按需：A1-A13 补充模式
closing/
  README.md                 ← 按需：收尾页导航
  01-thanks-qa.md           ← 按需：致谢+Q&A
  02-cta-contact.md         ← 按需：CTA+联系方式
  03-recap-summary.md       ← 按需：关键回顾
  04-references-credits.md  ← 按需：参考资料
```

## 渐进式加载策略

1. **设计内容页前**：先读 `07-advanced-layouts.md` 顶部速查表
2. **8 高频不够用时**：根据速查表下方的"完整 layout 目录"链接，按需打开本目录文件
3. **设计 PPT 收尾时**：打开 `closing/README.md` 选择合适的收尾页
4. **不要一次读完所有文件**：90K + 18K + 124K ≈ 232K，只在用到时加载

## 完整 layout 目录（21 种）

### 8 高频（详见 07-advanced-layouts.md）

1. commandPanel + dispatchMap + hubRing + laneStack
2. specCanvas + heroPanel + stepTrack + foundationBar
3. layerCard 9-grid + intro + side thoughtPanel
4. carrierPanel + terminalBox + channelGrid + updatePanel
5. shotStage + filmstrip
6. stagePanel + toolCompareGrid
7. docCard + bridge + matrixPanel
8. heroCard + discussCard + footer open floor

### 9 基础（详见 01-basic-patterns.md）

9. arch-flow（架构图 / 数据流）
10. intro-typ（中文大字 hero 引言）
11. layer-stack（N 层堆叠）
12. loop-evo（循环 / 演进）
13. repo-tree（仓库目录树）
14. yaml-code（YAML / 配置代码块）
15. spectrum-page（全宽 spectrum 大图）
16. note-card-page（多并列 note-card）
17. harness-table（表格 / Harness 配置）
18. quadrant（2×2 四象限）
19. mode-stack（模式对比 / 错位堆叠）

### 13 补充（详见 02-supplementary.md）

A1. part-cover-CN · A2. layerFlowPanel · A3. progressionStrip+denseSplit · A4. transformSideBySide · A5. timelineLadder+antiPattern · A6. roleMatrix 6-grid · A7. qaGrid 4-col · A8. heroThesis+insightTable · A9. stepTabPanel · A10. principle+goldenRule · A11. docCardGrid · A12. qaDual 2x2 · A13. kanbanBacklog+metric

### 4 收尾页（详见 closing/）

A14. thanksQandA · A15. ctaAndContact · A16. recapSummary · A17. referencesAndCredits