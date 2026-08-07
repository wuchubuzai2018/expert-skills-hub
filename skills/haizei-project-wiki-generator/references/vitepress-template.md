# VitePress Template

## 首页模板（index.md）

使用 VitePress 的 `layout: home` 格式，包含 hero 区域和 features 卡片：

```yaml
---
layout: home

hero:
  name: "{项目名} Wiki"
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
```

### 首页定制规则

- `hero.name`：使用项目名称 + "Wiki"
- `hero.text`：一句话描述文档定位
- `hero.tagline`：说明目标读者
- `actions`：最多 3 个按钮，brand 主题用于新人指南（最重要的入口）
- `features`：6 个卡片，第一个是新人快速上手，其余指向核心文档
- features 的 `link` 必须指向实际存在的文档路径

---

## config.mts 模板

```typescript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-mermaid-viewer'
// project-wiki-generator managed config

export default withMermaid(defineConfig({
  title: '{项目名} Wiki',
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
      '/wiki/guide/': [/* 由 build-vitepress-config.mjs 自动生成 */],
      '/wiki/tech-wiki/': [/* 由 build-vitepress-config.mjs 自动生成 */],
      '/wiki/biz-wiki/': [/* 由 build-vitepress-config.mjs 自动生成 */]
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
```

### config.mts 规则

- 使用 `withMermaid(defineConfig({...}))` 包装，确保 Mermaid 图表正常渲染
- 第一行注释 `// project-wiki-generator managed config` 用于标识本技能管理的配置
- `lastUpdated: true` 启用最后更新时间
- `ignoreDeadLinks: true` 容忍构建时的死链接（渐进式生成时部分链接可能暂时无效）
- `mermaid: {}` 和 `mermaidPlugin: { class: 'mermaid' }` 启用 Mermaid 支持
- 侧边栏由 `build-vitepress-config.mjs` 自动扫描文件系统生成
- 如果用户已有自定义配置（不含 managed 注释），生成候选配置到 `.wiki-state/` 而不覆盖
- 顶部导航使用面向新人友好的命名：新人指南 / 技术知识 / 业务知识 / 常见问题
- 左侧导航按章节分组（入门概览 / 环境搭建 / 代码导航 / 实战上手 / 常见问题），而非简单平铺
- 非首个分组使用 `collapsed: true`，减少侧边栏视觉噪音
- 包含中文本地化配置（搜索、页脚导航、深色模式标签等）

---

## package.json 模板

```json
{
  "name": "{project-name}-wiki",
  "private": true,
  "scripts": {
    "docs:dev": "vitepress dev .",
    "docs:build": "vitepress build .",
    "docs:preview": "vitepress preview ."
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
}
```

---

## Wiki 总览页模板（wiki/index.md）

```markdown
# {项目名} Wiki

本 Wiki 是对 {项目名} 项目的系统性分析文档，面向新人接手、日常维护和架构评审。

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
```

---

## 新人指南入口页模板（wiki/guide/index.md）

```markdown
# 新人指南

欢迎加入项目。这份指南帮助你在最短时间内建立对项目的基本认知，从"完全不了解"到"能独立改代码"。

## 按阶段阅读

| 阶段 | 时间 | 你的问题 | 推荐文档 |
|------|------|----------|----------|
| 我在哪 | 第 1 天 | 这项目做什么？ | [快速上手](./base/01_快速上手) |
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
```

---

## 图表策略

- 统一使用 Mermaid 内嵌图表（flowchart、sequenceDiagram、classDiagram、stateDiagram-v2、erDiagram）
- 支持 `vitepress-plugin-diagrams`（Kroki）用于复杂图表
- 不生成单独的图表文件，全部内嵌在 markdown 中
- 组件图优先使用自上而下的垂直布局（TB）

## 保守更新原则

- 如果 `config.mts` 是本技能生成或缺失，可以直接重建
- 如果 `config.mts` 明显是项目自定义内容（不含 managed 注释），优先生成候选配置到 `.wiki-state/generated-config.mts`，提示用户确认
