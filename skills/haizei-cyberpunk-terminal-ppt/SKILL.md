---
name: haizei-cyberpunk-terminal-ppt
description: 生成"赛博朋克终端控制台"风格的网页 PPT（HTML 单文件）。设计语言是把 PPT 伪装成正在被解构/调试的开发者控制台：深海军蓝背景 + 霓虹四色光效 + 等宽代码字体 + 闪烁光标 + 终端命令栏 + ASCII 框 + 多章节卡片矩阵。必备 3 件套：window-chrome（IDE 三色圆点 + tab + URL 提示 + REC）+ slide-corner（`[ N / M ] LABEL`）+ line-numbers（左侧 40px 01-30 列）。共 19 种 layout（含 commandPanel / hubRing / specCanvas / layerCard 9-grid / carrierPanel / shotStage / docCard+bridge 等）。典型场景：用户说"做个赛博朋克风的网页 PPT"、"帮我做一份终端风格的演示稿"、"用 cyberpunk terminal 风格讲 xxx"。本 Skill 自带完整设计知识库（references/），所有 layout 给出可直接复制的 HTML 模板，**完全自包含，不依赖任何外部素材**。
---

# Cyberpunk Terminal PPT · 完全自包含设计系统

> 把 PPT 伪装成"正在被解构/调试的开发者控制台"。每一页都是一个 IDE / 终端 / 调试器的瞬间截图。

## 何时使用

- 用户想要"**赛博朋克风**"、"**终端风**"、"**控制台风**"的 PPT
- 用户想要"**开发者视角**"、"**给工程师看的演示**"的产品介绍
- 用户想要"**可读性极高的代码风格**" PPT，而不是营销风
- 用户提供了具体内容（章节 / 卡片 / 数字 / 流程），需要视觉化排版

## 何时**不要**使用

- 营销风首页（用渐变 + 大图 + 圆角按钮）
- 商务路演风（用粗宋体 + 大量金色装饰）
- 给高管决策用（建议改用最小化的"白底黑字 + 1-2 数字"风）

## 快速开始（AI 工作流）

```
1. 先读 references/00-design-system.md  ← 设计令牌 + 基础 HTML 底座
2. 按章节类型选 layout（共 19 种）：
   - 设计封面（boot log + 12-col + speaker box） → references/01-cover.md
   - 设计目录（12-col featured 卡 + 衬线章节名） → references/02-toc.md
   - 设计章节封面（中心 wrapper + accent 单词 + /* */ 描述） → references/03-part-cover.md
   - 设计正文（8 种 layout，含 thesisPanel+stepCard / frameworkCard） → references/04-content-pages.md
   - 设计组件（11 个原子组件） → references/05-components.md
   - 渲染 / 性能 / 调试 → references/06-rendering-tips.md
   - 设计高级页（19 种 layout，含 8 种高频） → references/07-advanced-layouts.md
   - 设计路线图瓦片（最复杂） → references/08-roadmap-tile.md
3. 复制对应 md 里的「完整 HTML 模板」→ 替换占位符 [LIKE-THIS] → 写新 slide
4. 浏览器打开 index.html，按 ← → 翻页浏览
5. 用 Puppeteer 抓 PDF / 截图（可选）
   node ../.claude/skills/haizei-cyberpunk-terminal-ppt/scripts/render-ppt.mjs ./index.html --out ./slides
```

## 设计语言速览（30 秒版）

| 维度 | 值 |
|---|---|
| 背景 | `#060a14`（深海军蓝，绝不纯黑）|
| 网格 | 36px 浅蓝网格 + 双 radial gradient |
| 主色 | `#00ff9c`（薄荷绿，41%）+ `#5ce1ff`（青蓝，26%）+ `#ffb020`（琥珀，19%）+ `#ff2e88`（品红，13%）|
| 字体 | JetBrains Mono + Space Grotesk + Noto Sans SC + Noto Serif SC |
| 字号 | 主体 9-17px（91%），靠留白 + 颜色 + 字距 |
| 装饰 | 闪烁光标（70%）+ 3px 装饰条（90%）+ box-shadow 辉光（90%）|
| 灵魂 | **window-chrome（IDE 标题栏）+ footer-chrome（命令行）+ slide-corner（`[N/M] LABEL`）三件套** |
| 新增 | 进度条（顶部 2px）/ line-numbers（左侧 40px 01-30 列）/ 衬线（章节名 / 标题） |

## 反模式（绝对不要做）

- ❌ 纯白 / 纯黑背景 → 用 `#060a14`
- ❌ emoji 作为视觉元素 → 用 `▸ ▍ ◆ ▌` 等 unicode 字符
- ❌ 圆角 ≥ 8px → 保持 4px 硬核感
- ❌ 32-48px 大段正文 → 主体不超过 17px
- ❌ 在终端命令栏里写中文 → 保持英文命令
- ❌ Material Design 风格的悬浮按钮
- ❌ 用渐变背景填充 hero
- ❌ **缺 window-chrome / corner / footer 三件套**（每页必备）
- ❌ **用 emoji 或彩色圆点代替 `▌` 光标字符**（用 `<span class="blink">▌</span>`）

## references 速查（9 个文件）

| 文件 | 何时读 | 内容 |
|---|---|---|
| [00-design-system.md](references/00-design-system.md) | **第一份必读** | 设计令牌 + window-chrome + panel + corner + footer + line-numbers + 进度条 + 12-col grid |
| [01-cover.md](references/01-cover.md) | 设计封面 | boot log + 12-col 完整版（speaker box + ASCII 框 + 3 色 legend）+ 3 个变体 |
| [02-toc.md](references/02-toc.md) | 设计目录 | 12-col featured 全宽卡 + 6/6 / 4/8 错落 + 衬线章节名 + 3 个变体 |
| [03-part-cover.md](references/03-part-cover.md) | 设计章节封面 | 中心 wrapper（96px 中文 + 68px 英文 subtitle）+ accent 单词 + `/* */` 描述 + 3 个变体 |
| [04-content-pages.md](references/04-content-pages.md) | 设计正文 | **8 种基础 layout**：thesisPanel+stepCard（推荐） / 4-card / 3-card / 2-col / KPI / timeline / roadmap / frameworkCard |
| [05-components.md](references/05-components.md) | 设计组件 | **11 个组件**：statCard / kpiCard / stepKpi / channelBar / priorityChip / hBar / kpiBar / spectrum / progressRing / accentBadge / noteCard |
| [06-rendering-tips.md](references/06-rendering-tips.md) | 渲染/调试 | 字体加载 / grid 技巧 / 动画 / 性能 / 调试 |
| [07-advanced-layouts.md](references/07-advanced-layouts.md) | 设计高级页 | **19 种 layout**：8 种高频（commandPanel / dispatchMap / hubRing / specCanvas / layerCard / carrierPanel / shotStage / docCard）+ 11 种其他 |
| [08-roadmap-tile.md](references/08-roadmap-tile.md) | 设计路线图 | roadmap-tile 完整模板（4 列 × N tile）|

## 8 种高频 layout 速查

| Layout | 用途 | 对齐参考站 slide |
|---|---|---|
| **commandPanel + hubRing + laneStack** | AI 调度中枢 + 双泳道对比 | slide 5 |
| **specCanvas + stepTrack + foundationBar** | 方法论主链（6 步 + 上下闸口）| slide 10 |
| **layerCard 9-grid + intro + side thoughtPanel** | 9 层架构 + 侧栏思考 | slide 17 |
| **carrierPanel + channelGrid (A/B/C)** | "在哪里 + 怎么用" 4 通道对比 | slide 12 |
| **shotStage + filmstrip** | 截图演示 + 多缩略图切换 | slide 7 |
| **stagePanel (split image) + toolCompareGrid** | 双图对比 + 4 工具对比 | slide 8 |
| **docCard + bridge + matrixPanel** | 两栏对比 + 中间 ≠ + 4 行矩阵 | slide 30 |
| **heroCard + discussCard + footer open floor** | 收尾页（Q&A / 开放讨论）| slide 37 |

## 自包含原则

**这个 skill 不依赖任何外部文件**：
- ❌ 不引用项目根目录 `archive/`、`tmp/`、`参考资料/`
- ❌ 不引用具体 slide 路径
- ❌ 不包含真实文案 / 真实 IP / 真实项目路径
- ✅ 每个 references md 都给完整可运行的 HTML 模板（带 `[PLACEHOLDER]` 占位符）
- ✅ 所有 CSS 都是通用的设计令牌 + layout 模式

## scripts

### scripts/render-ppt.mjs
通用 PPT 渲染工具：用 Puppeteer 把"按 ← → 翻页"的 PPT 网页的所有 slide dump 为单文件 HTML。
```bash
node scripts/render-ppt.mjs <url> --out ./rendered
```

## 输出验证清单

完成一份 PPT 后，逐项检查：

- [ ] **每页都有 window-chrome + footer-chrome + slide-corner 三件套**（必备）
- [ ] **slide-corner 内容随页变化**：`[ 01 / 37 ] COVER` / `[ 02 / 37 ] INDEX` / `[ 03 / 37 ] PART 0`
- [ ] **左侧 line-numbers 列可见**（40px 01-30）
- [ ] **顶部 2px 进度条**反映当前翻页进度
- [ ] **hash 深链可用**：URL `#5` 直接打开第 5 页
- [ ] 至少 1 页有闪烁光标 `▌`（用 `<span class="blink">▌</span>`）
- [ ] 颜色不超过 4 种（green / cyan / amber / pink）
- [ ] 字体四件套都已加载（JetBrains Mono + Space Grotesk + Noto Sans SC + Noto Serif SC）
- [ ] 主体字号 9-17px（无 32-48px 大段正文）
- [ ] 背景是 `#060a14`（绝不用纯黑）
- [ ] 圆角 ≤ 4px（硬核感）
- [ ] 键盘 ← → Space F 可用（额外支持 Home / End / PageUp / PageDown）
- [ ] 桌面 1440×900 视口下不溢出
- [ ] 至少 1 个 ASCII 框 / 命令行元素（保持终端感）
- [ ] **boot log 必含 1 行 `[ WARN ]`**（即使在 cover 之外）