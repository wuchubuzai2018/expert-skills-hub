import path from 'node:path'
import {
  ensureDir,
  exists,
  nowIso,
  projectNameFromRoot,
  writeJson,
  writeText,
} from './utils.mjs'

function renderHomePage(projectName) {
  return `---
layout: home

hero:
  name: "${projectName} Wiki"
  text: "项目技术与业务分析文档"
  tagline: "面向新人接手、架构评审与日常维护的系统性知识库。"
  actions:
    - theme: brand
      text: 新人指南
      link: /wiki/guide/
    - theme: alt
      text: 技术知识
      link: /wiki/tech-wiki/
    - theme: alt
      text: 业务知识
      link: /wiki/biz-wiki/

features:
  - title: 快速上手
    details: 30 分钟建立项目第一印象，了解主业务主线和代码入口。
    link: /wiki/guide/base/01_快速上手
    linkText: 开始阅读
  - title: 环境搭建
    details: 本地环境搭建、联调测试环境配置，快速把项目跑起来。
    link: /wiki/guide/setup/01_本地环境搭建
    linkText: 搭建环境
  - title: 代码导航
    details: 按功能、页面、数据流定位代码，核心链路速查。
    link: /wiki/guide/codebase/01_代码导航地图
    linkText: 查看导航
  - title: 实战上手
    details: 第一个改动怎么做、常见修改场景、提测上线注意事项。
    link: /wiki/guide/practice/01_第一个改动怎么做
    linkText: 开始实战
  - title: 系统架构
    details: 系统分层、核心模块、入口点、调用链与外部依赖的完整分析。
    link: /wiki/tech-wiki/01_系统架构分析
    linkText: 查看架构分析
  - title: 业务流程
    details: 按业务域组织的核心流程、角色权限、规则决策与异常边界。
    link: /wiki/biz-wiki/
    linkText: 进入业务知识
---
`
}

function renderWikiIndex(projectName) {
  return `# ${projectName} Wiki

本 Wiki 是对 ${projectName} 项目的系统性分析文档，面向新人接手、日常维护和架构评审。

## 如何使用这份文档

### 第一次接触这个项目？

从 [新人指南](/wiki/guide/) 开始，30 分钟建立项目第一印象。

### 需要深入了解技术细节？

进入 [技术知识](/wiki/tech-wiki/)，按"系统总览 → 核心概念 → 规则与实践"的顺序阅读。

### 需要了解业务逻辑？

进入 [业务知识](/wiki/biz-wiki/)，按业务域组织的流程、规则和异常分析。

## 文档地图

- [新人指南](/wiki/guide/) — 快速上手、阅读路线图、接手维护入口清单
- [技术知识](/wiki/tech-wiki/) — 系统架构、术语、模型、规则、实践、结构、问题清单
- [业务知识](/wiki/biz-wiki/) — 按业务域组织的目标、流程、角色、规则、异常
`
}

function renderGuideIndex(projectName) {
  return `# 新人指南

欢迎加入 ${projectName} 项目。这份指南帮助你在最短时间内建立对项目的基本认知，从"完全不了解"到"能独立改代码"。

## 按阶段阅读

| 阶段 | 时间 | 你的问题 | 推荐文档 |
|------|------|----------|----------|
| 我在哪 | 第 1 天 | 这项目做什么？我负责什么？ | [快速上手](./base/01_快速上手) |
| 怎么跑 | 第 1-2 天 | 怎么把项目跑起来？ | [本地环境搭建](./setup/01_本地环境搭建) |
| 代码在哪 | 第 2-3 天 | 改某个功能该看哪里？ | [代码导航地图](./codebase/01_代码导航地图) |
| 为什么这样 | 第 3-5 天 | 为什么用这个架构？ | [核心链路速查](./codebase/02_核心链路速查) |
| 我能改了 | 第 5-7 天 | 改了不会出问题吗？ | [第一个改动怎么做](./practice/01_第一个改动怎么做) |

## 按角色阅读

### 新人开发

1. [快速上手](./base/01_快速上手) → 建立第一印象
2. [本地环境搭建](./setup/01_本地环境搭建) → 把项目跑起来
3. [代码导航地图](./codebase/01_代码导航地图) → 知道改哪里
4. [第一个改动怎么做](./practice/01_第一个改动怎么做) → 完成第一个需求

### 接手维护

1. [快速上手](./base/01_快速上手) → 了解项目全貌
2. [接手维护关键入口清单](./base/03_接手维护关键入口清单) → 知道从哪入手
3. [调试排查技巧](./codebase/03_调试排查技巧) → 能排查问题
4. [常见修改场景指南](./practice/02_常见修改场景指南) → 常见操作速查

### 深度了解

1. [阅读指南与接手路线图](./base/02_阅读指南与接手路线图) → 系统化阅读
2. [核心链路速查](./codebase/02_核心链路速查) → 理解完整流程
3. [常见问题](./faq/) → 解答疑惑
`
}

function renderTechIndex() {
  return `# 技术知识

面向系统结构、代码架构、术语、模型和开发实践的技术分析文档。

## 文档列表

### 系统总览

| 编号 | 文档 | 内容 |
|------|------|------|
| 01 | [系统架构分析](./01_系统架构分析) | 系统分层、模块、入口点、调用链、外部依赖 |
| 06 | [模块结构分析](./06_模块结构分析) | 目录树、模块职责、依赖关系 |

### 核心概念

| 编号 | 文档 | 内容 |
|------|------|------|
| 02 | [专业术语词汇表](./02_专业术语词汇表) | 领域术语、命名规范、易混淆概念 |
| 03 | [数据模型手册](./03_数据模型手册) | 核心实体、字段、状态、对象关系 |

### 规则与实践

| 编号 | 文档 | 内容 |
|------|------|------|
| 04 | [业务逻辑公式手册](./04_业务逻辑公式手册) | 计算口径、条件分支、决策规则 |
| 05 | [开发实践指南](./05_开发实践指南) | 设计模式、改动路径、常见陷阱 |

### 问题与风险

| 编号 | 文档 | 内容 |
|------|------|------|
| 07 | [架构设计问题清单](./07_架构设计问题清单) | 设计问题、风险、待确认项 |

## 推荐阅读顺序

1. 先读 01 建立架构全局视图
2. 再读 06 了解模块组成
3. 然后按需阅读 02-05、07
`
}

function renderBizIndex() {
  return `# 业务知识

面向业务域、角色、流程、规则和异常的业务分析文档。

## 业务域列表

> 业务域将在项目分析后自动识别并填充。

## 每个域包含

| 编号 | 文档 | 内容 |
|------|------|------|
| 01 | 业务目标与范围 | 域定位、业务目标、系统边界 |
| 02 | 核心流程 | 主流程、触发条件、状态变化 |
| 03 | 角色与权限 | 角色清单、职责、权限边界 |
| 04 | 规则与决策 | 业务规则、决策条件、状态机 |
| 05 | 异常与边界 | 失败路径、补偿逻辑、边界情况 |
`
}

function renderManagedConfig(projectName) {
  return `import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-mermaid-viewer'
// project-wiki-generator managed config

export default withMermaid(defineConfig({
  title: '${projectName} Wiki',
  description: '面向新人接手、架构评审与日常维护的项目分析文档。',
  lastUpdated: true,
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '新人指南', link: '/wiki/guide/' },
      { text: '技术知识', link: '/wiki/tech-wiki/' },
      { text: '业务知识', link: '/wiki/biz-wiki/' },
      { text: '常见问题', link: '/wiki/guide/faq/' }
    ],
    sidebar: {
      '/wiki/guide/': [
        {
          text: '入门概览',
          items: [
            { text: '新人指南', link: '/wiki/guide/' },
            { text: '01 快速上手', link: '/wiki/guide/base/01_快速上手' },
            { text: '02 阅读指南与接手路线图', link: '/wiki/guide/base/02_阅读指南与接手路线图' },
            { text: '03 接手维护关键入口清单', link: '/wiki/guide/base/03_接手维护关键入口清单' }
          ]
        },
        {
          text: '环境搭建',
          collapsed: true,
          items: [
            { text: '01 本地环境搭建', link: '/wiki/guide/setup/01_本地环境搭建' },
            { text: '02 联调与测试环境', link: '/wiki/guide/setup/02_联调与测试环境' }
          ]
        },
        {
          text: '代码导航',
          collapsed: true,
          items: [
            { text: '01 代码导航地图', link: '/wiki/guide/codebase/01_代码导航地图' },
            { text: '02 核心链路速查', link: '/wiki/guide/codebase/02_核心链路速查' },
            { text: '03 调试排查技巧', link: '/wiki/guide/codebase/03_调试排查技巧' }
          ]
        },
        {
          text: '实战上手',
          collapsed: true,
          items: [
            { text: '01 第一个改动怎么做', link: '/wiki/guide/practice/01_第一个改动怎么做' },
            { text: '02 常见修改场景指南', link: '/wiki/guide/practice/02_常见修改场景指南' },
            { text: '03 提测与上线注意事项', link: '/wiki/guide/practice/03_提测与上线注意事项' }
          ]
        },
        {
          text: '常见问题',
          collapsed: true,
          items: [
            { text: 'FAQ', link: '/wiki/guide/faq/' }
          ]
        }
      ],
      '/wiki/tech-wiki/': [
        {
          text: '系统总览',
          items: [
            { text: '技术知识入口', link: '/wiki/tech-wiki/' },
            { text: '01 系统架构分析', link: '/wiki/tech-wiki/01_系统架构分析' },
            { text: '06 模块结构分析', link: '/wiki/tech-wiki/06_模块结构分析' }
          ]
        },
        {
          text: '核心概念',
          collapsed: true,
          items: [
            { text: '02 专业术语词汇表', link: '/wiki/tech-wiki/02_专业术语词汇表' },
            { text: '03 数据模型手册', link: '/wiki/tech-wiki/03_数据模型手册' }
          ]
        },
        {
          text: '规则与实践',
          collapsed: true,
          items: [
            { text: '04 业务逻辑公式手册', link: '/wiki/tech-wiki/04_业务逻辑公式手册' },
            { text: '05 开发实践指南', link: '/wiki/tech-wiki/05_开发实践指南' }
          ]
        },
        {
          text: '问题与风险',
          collapsed: true,
          items: [
            { text: '07 架构设计问题清单', link: '/wiki/tech-wiki/07_架构设计问题清单' }
          ]
        }
      ],
      '/wiki/biz-wiki/': [
        {
          text: '业务知识',
          items: [
            { text: '业务总览', link: '/wiki/biz-wiki/' }
          ]
        }
      ]
    },
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    darkModeSwitchLabel: '深色模式',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除搜索',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  },
  mermaid: {},
  mermaidPlugin: {
    class: 'mermaid'
  }
}))
`
}

function renderPackageJson(projectName) {
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  return `${JSON.stringify(
    {
      name: `${safeName}-wiki`,
      private: true,
      scripts: {
        'docs:dev': 'vitepress dev .',
        'docs:build': 'vitepress build .',
        'docs:preview': 'vitepress preview .',
      },
     "dependencies": {
        "vitepress": "^1.6.4",
        "vitepress-mermaid-viewer": "^0.4.0",
        "vitepress-plugin-image-preview": "^0.1.1",
        "vitepress-plugin-diagrams": "^1.3.1"
      },
      "devDependencies": {
        "mermaid": "^11.14.0",
        "sass-embedded": "^1.98.0"
      }
    },
    null,
    2,
  )}\n`
}

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const projectName = projectNameFromRoot(projectRoot)

const docsDir = path.join(projectRoot, 'docs')
const vitepressDir = path.join(docsDir, '.vitepress')
const wikiDir = path.join(docsDir, 'wiki')
const guideDir = path.join(wikiDir, 'guide')
const guideBaseDir = path.join(guideDir, 'base')
const guideSetupDir = path.join(guideDir, 'setup')
const guideCodebaseDir = path.join(guideDir, 'codebase')
const guidePracticeDir = path.join(guideDir, 'practice')
const guideFaqDir = path.join(guideDir, 'faq')
const techDir = path.join(wikiDir, 'tech-wiki')
const bizDir = path.join(wikiDir, 'biz-wiki')
const stateDir = path.join(wikiDir, '.wiki-state')

for (const dir of [
  docsDir, vitepressDir, wikiDir,
  guideDir, guideBaseDir, guideSetupDir, guideCodebaseDir, guidePracticeDir, guideFaqDir,
  techDir, bizDir, stateDir,
]) {
  ensureDir(dir)
}

const created = []

if (writeText(path.join(docsDir, 'index.md'), renderHomePage(projectName), { overwrite: false })) {
  created.push('docs/index.md')
}

if (writeText(path.join(wikiDir, 'index.md'), renderWikiIndex(projectName), { overwrite: false })) {
  created.push('docs/wiki/index.md')
}

if (writeText(path.join(guideDir, 'index.md'), renderGuideIndex(projectName), { overwrite: false })) {
  created.push('docs/wiki/guide/index.md')
}

if (writeText(path.join(techDir, 'index.md'), renderTechIndex(), { overwrite: false })) {
  created.push('docs/wiki/tech-wiki/index.md')
}

if (writeText(path.join(bizDir, 'index.md'), renderBizIndex(), { overwrite: false })) {
  created.push('docs/wiki/biz-wiki/index.md')
}

const configPath = path.join(vitepressDir, 'config.mts')
if (!exists(configPath)) {
  writeText(configPath, renderManagedConfig(projectName))
  created.push('docs/.vitepress/config.mts')
}

const packageJsonPath = path.join(docsDir, 'package.json')
if (!exists(packageJsonPath)) {
  writeText(packageJsonPath, renderPackageJson(projectName))
  created.push('docs/package.json')
}

const analysisPath = path.join(stateDir, 'analysis.json')
if (!exists(analysisPath)) {
  writeJson(analysisPath, { projectName, analyzedAt: null })
  created.push('.wiki-state/analysis.json')
}

const planPath = path.join(stateDir, 'plan.json')
if (!exists(planPath)) {
  writeJson(planPath, { version: '2.0', generatedAt: null, confirmed: false })
  created.push('.wiki-state/plan.json')
}

const progressPath = path.join(stateDir, 'progress.json')
if (!exists(progressPath)) {
  writeJson(progressPath, { initializedAt: nowIso(), docs: [] })
  created.push('.wiki-state/progress.json')
}

console.log(JSON.stringify({ projectRoot, projectName, created, docsDir, stateDir }, null, 2))
