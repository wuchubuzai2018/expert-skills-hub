# Haizei Cyberpunk Terminal PPT · 技能介绍

> 把 PPT 伪装成"正在被解构 / 调试的开发者控制台"——每一页都是 IDE / 终端 / 调试器的瞬间截图。

---

## 一句话介绍

这是一个 **AI Agent 技能（Skill）**，让 AI 助手（如 Claude、Cursor、Copilot 等）能够一键生成**赛博朋克终端控制台风格**的网页 PPT（HTML 单文件）。不需要 PowerPoint、不需要 Figma、不需要任何设计基础——只要把内容告诉 AI，它就能输出一份带 IDE 标题栏、行号列、闪烁光标、霓虹四色光效的"开发者视角"演示稿。

---

## 它解决什么问题？

| 痛点 | 这个 Skill 怎么解决 |
|---|---|
| 做一份 PPT 太慢（PowerPoint 排版 + 调样式 + 找图标） | AI 直接生成完整 HTML 单文件，浏览器打开即用 |
| 普通 PPT 模板太"营销风"，给工程师看不够硬核 | 终端 / IDE / 调试器视觉语言，天然适合技术分享 |
| AI 生成的 PPT 往往"一眼 AI"，缺乏设计系统约束 | 内置完整设计令牌（颜色 / 字体 / 字号 / 间距 / 动画），19 种 layout 模板全部对齐参考站 |
| 想要"可翻页 + 深链 + 全屏 + 进度条"的网页 PPT | 自带键盘导航（← → Space F）、hash 深链、顶部进度条 |
| 想导出 PDF / 截图 | 自带 Puppeteer 渲染脚本，一键 dump 所有 slide |

---

## 设计语言（30 秒速览）

| 维度 | 值 |
|---|---|
| **背景** | `#060a14`（深海军蓝，绝不纯黑）+ 36px 浅蓝网格 + 双 radial gradient |
| **主色** | `#00ff9c` 薄荷绿（41%）+ `#5ce1ff` 青蓝（26%）+ `#ffb020` 琥珀（19%）+ `#ff2e88` 品红（13%）|
| **字体** | JetBrains Mono（代码）+ Space Grotesk（英文 hero）+ Noto Sans SC（中文）+ Noto Serif SC（衬线章节名）|
| **字号** | 主体 9-17px（91%），靠留白 + 颜色 + 字距营造层次，无 32-48px 大段正文 |
| **灵魂三件套** | `window-chrome`（IDE 标题栏）+ `footer-chrome`（命令行）+ `slide-corner`（`[N/M] LABEL`）|
| **装饰** | 闪烁光标 `▌`（70%）+ 3px 装饰条（90%）+ box-shadow 辉光（90%）+ ASCII 框 |

---

## 19 种 Layout 一览

### 8 种高频 Layout（覆盖 80% 场景）

| Layout | 用途 | 典型场景 |
|---|---|---|
| **commandPanel + hubRing + laneStack** | 中心调度 + 双泳道对比 | AI 调度中枢、任务分发 |
| **specCanvas + stepTrack + foundationBar** | 方法论主链（6 步 + 上下闸口）| 流程图、方法论 |
| **layerCard 9-grid + thoughtPanel** | 9 层架构 + 侧栏思考 | 架构图、分层说明 |
| **carrierPanel + channelGrid** | "在哪里 + 怎么用" 4 通道对比 | 场景对比、渠道分析 |
| **shotStage + filmstrip** | 截图演示 + 多缩略图切换 | 产品演示、截图说明 |
| **stagePanel + toolCompareGrid** | 双图对比 + 4 工具对比 | 竞品对比、工具评测 |
| **docCard + bridge + matrixPanel** | 两栏对比 + 中间 ≠ + 4 行矩阵 | 方案对比、差异分析 |
| **heroCard + discussCard** | 收尾页（Q&A / 开放讨论）| 结尾页、互动页 |

### 基础 Layout（8 种）

| Layout | 用途 |
|---|---|
| **thesisPanel + stepCard**（推荐）| 顶部论点 + 4 阶段箭头连接 |
| **4-card** | 4 个并列概念 |
| **3-card** | 3 个并列概念（更大）|
| **2-col** | 左文 + 右图 / 表 |
| **KPI** | 4 个核心数字 + 解释 |
| **timeline** | N 阶段时间线 |
| **roadmap** | 路线图（多列瓦片）|
| **frameworkCard** | 3 框架对比 |

### 页面类型（4 种）

| 类型 | 说明 |
|---|---|
| **Cover**（封面）| boot log + ASCII 框 + hero 主标 + speaker box + 三色 legend |
| **TOC**（目录）| 12-col featured 卡片矩阵 + 衬线章节名 + 当前章节高亮 |
| **Part Cover**（章节封面）| 96px 中文主标 + 68px 英文 subtitle + accent 单词高亮 |
| **Content**（正文）| 上述 19 种 layout 自由组合 |

---

## 11 个原子组件

可直接在任何 layout 里复制粘贴：

| 组件 | 用途 |
|---|---|
| **statCard** | 数字 + label + 描述 |
| **kpiCard** | 核心 KPI（含进度条 + delta）|
| **stepKpi** | 阶段内嵌 KPI |
| **channelBar** | 多渠道横向堆叠条 |
| **priorityChip** | P0 / P1 / P2 优先级标签 |
| **hBar** | 单条横向进度 |
| **kpiBar** | KPI + 单条进度 |
| **spectrum** | 24 段连续色阶 |
| **progressRing** | 环形进度（SVG）|
| **accentBadge** | 状态徽章 |
| **noteCard** | 备注 / 警告卡 |

---

## 自包含设计知识库

这个 Skill **不依赖任何外部素材**——所有设计知识都内置在 `references/` 目录的 9 个 Markdown 文件里：

```
skills/haizei-cyberpunk-terminal-ppt/
├── SKILL.md                          ← AI 读取的入口（触发条件 + 工作流 + 验证清单）
├── references/                       ← 设计知识库（9 个文件）
│   ├── 00-design-system.md           ← 设计令牌 + 完整 HTML 底座（必读）
│   ├── 01-cover.md                   ← 封面 layout + 4 变体
│   ├── 02-toc.md                     ← 目录 layout + 4 变体
│   ├── 03-part-cover.md              ← 章节封面 layout + 4 变体
│   ├── 04-content-pages.md           ← 正文 8 种基础 layout
│   ├── 05-components.md              ← 11 个原子组件
│   ├── 06-rendering-tips.md          ← 渲染 / 性能 / 调试
│   ├── 07-advanced-layouts.md        ← 19 种高级 layout
│   └── 08-roadmap-tile.md            ← 路线图瓦片（最复杂）
└── scripts/
    └── render-ppt.mjs                ← Puppeteer 渲染脚本（导出 / 截图）
```

每个 references 文件都包含**完整可运行的 HTML 模板**（带 `[PLACEHOLDER]` 占位符），AI 只需复制 → 替换占位符 → 输出。

---

## 如何使用

### 方式一：安装到 AI 助手（推荐）

```bash
# 安装单个技能
npx skills add https://github.com/wuchubuzai2018/expert-skills-hub --skill haizei-cyberpunk-terminal-ppt

# 或安装整个技能仓库
npx skills add https://github.com/wuchubuzai2018/expert-skills-hub
```

安装后，在 Claude / Cursor / Copilot 等支持 Skill 的 AI 助手里直接说：

> "用 cyberpunk terminal 风格帮我做一份关于 [主题] 的网页 PPT，大概 10 页"

AI 会自动：
1. 读取 `SKILL.md` 了解设计系统
2. 按章节类型挑选合适的 layout
3. 复制对应 HTML 模板，替换占位符
4. 输出完整的 `index.html` 单文件

### 方式二：手动使用

1. 复制 `references/00-design-system.md` 里的「完整基础 HTML 底座」到 `index.html`
2. 为每页复制对应 layout 模板，插入到 `<body>` 里
3. 替换所有 `[LIKE-THIS]` 占位符为真实文案
4. 浏览器打开，按 `←` `→` 翻页

### 方式三：导出 PDF / 截图

```bash
node scripts/render-ppt.mjs ./index.html --out ./rendered
```

---

## 交互功能

生成的 PPT 自带以下交互（无需额外代码）：

| 功能 | 快捷键 |
|---|---|
| 上一页 / 下一页 | `←` / `→` 或 `Space` |
| 首页 / 末页 | `Home` / `End` |
| 上翻 / 下翻 | `PageUp` / `PageDown` |
| 全屏切换 | `F` |
| 深链分享 | URL `#5` 直接打开第 5 页 |
| 进度条 | 顶部 2px 绿色光效条，随翻页流动 |
| 入场动画 | 每页元素 `fadeUp` 错峰入场 |

---

## 适合什么场景？

✅ **技术分享** / **架构讲解** / **产品演示（给工程师看）**
✅ **AI / 开发者工具介绍**（视觉语言天然匹配）
✅ **内部培训** / **复盘报告** / **调研总结**
✅ **需要"可读性极高的代码风格"** PPT 的场景

❌ **不适合**：营销风首页、商务路演、给高管决策（建议改用最小化白底黑字风）

---

## 实际效果

每页都长这样（文字描述）：

```
┌─────────────────────────────────────────────────────────┐
│ ● ● ●   ~/deck/01-cover.md        线上PPT请访问 http://...  │  ← window-chrome
├─────────────────────────────────────────────────────────┤
│01│                                                       │
│02│  [ OK ]  mount /dev/deck on /presentation             │  ← boot log
│03│  [ WARN ] recording                                   │
│04│                                                       │
│05│  ╔══════════╗    > ./decompile --target=xxx           │  ← ASCII 框 + 命令
│06│  ║ [DECK]   ║                                        │
│07│  ║   FIELD  ║    凡人修仙传                           │  ← hero 主标
│08│  ║     01   ║    A Mortal's Journey                  │
│09│  ╚══════════╝    与天争命▌                            │  ← accent + 闪烁光标
│10│                                                       │
│11│  /* 一个伪灵根的凡人少年... */                         │  ← 注释样式描述
│12│                                                       │
├─────────────────────────────────────────────────────────┤
│ [user]@host:~/deck$ ./start --mode=live      ‹ ›        │  ← footer-chrome
└─────────────────────────────────────────────────────────┘
                              [ 01 / 10 ] COVER  ● REC    ← slide-corner
```

---

## 设计哲学

> **把 PPT 伪装成"正在被调试的开发者控制台"**——一切都是 IDE / 终端 / 调试器的瞬间截图；任何"营销感"的视觉（圆角 / 渐变填充 / 居中大段正文 / emoji）都属于反模式。

核心铁律：
1. 背景 `#060a14`，绝不用纯黑
2. 每页必备 `window-chrome` + `footer-chrome` + `slide-corner` 三件套
3. 关键节点加闪烁光标 `▌`
4. 主体字号 9-17px，靠留白 + 颜色 + 字距营造层次
5. 颜色不超过 4 种（green / cyan / amber / pink）
6. 圆角 ≤ 4px，保持硬核感

---

## 技术亮点

- **零依赖**：纯 HTML + CSS + 原生 JS，不依赖任何框架 / 库
- **单文件输出**：一个 `index.html` 搞定，方便分享 / 部署
- **自包含知识库**：9 个 references 文件覆盖全部设计知识，AI 不需要联网搜索
- **19 种 layout + 11 个组件**：覆盖绝大多数演示场景
- **Puppeteer 渲染脚本**：可选导出 PDF / 截图
- **响应式字号**：≤1420px 视口自动缩水

---

## 安装 / 仓库

- **仓库地址**：https://github.com/wuchubuzai2018/expert-skills-hub
- **技能市场**：https://skills.sh/?q=wuchubuzai2018
- **安装命令**：
  ```bash
  npx skills add https://github.com/wuchubuzai2018/expert-skills-hub --skill haizei-cyberpunk-terminal-ppt
  ```

---

## 作者

- **爱海贼的无处不在**
- **微信公众号**：无处不在的技术
