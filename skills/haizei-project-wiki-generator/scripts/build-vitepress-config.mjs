import fs from 'node:fs'
import path from 'node:path'
import {
  isManagedConfig,
  listMarkdownFiles,
  projectNameFromRoot,
  readFirstHeading,
  titleFromFileName,
  toDocLink,
  writeText,
} from './utils.mjs'

function toItem(filePath, docsRoot) {
  return {
    text: readFirstHeading(filePath) ?? titleFromFileName(path.basename(filePath)),
    link: toDocLink(filePath, docsRoot),
  }
}

function buildGuideGroups(guideDir, docsRoot) {
  if (!fs.existsSync(guideDir)) return []

  const groups = []

  // 入门概览 group: index + base/
  const overviewItems = []
  const indexFile = path.join(guideDir, 'index.md')
  if (fs.existsSync(indexFile)) {
    overviewItems.push(toItem(indexFile, docsRoot))
  }
  const baseDir = path.join(guideDir, 'base')
  if (fs.existsSync(baseDir)) {
    const baseFiles = listMarkdownFiles(baseDir).filter(
      (f) => path.dirname(f) === baseDir && path.basename(f) !== 'index.md',
    )
    for (const f of baseFiles) {
      overviewItems.push(toItem(f, docsRoot))
    }
  }
  // fallback: base files directly in guide/ (legacy structure)
  const legacyFiles = listMarkdownFiles(guideDir).filter(
    (f) => path.dirname(f) === guideDir && path.basename(f) !== 'index.md',
  )
  for (const f of legacyFiles) {
    overviewItems.push(toItem(f, docsRoot))
  }
  if (overviewItems.length > 0) groups.push({ text: '入门概览', items: overviewItems })

  // 环境搭建 group: setup/
  const setupDir = path.join(guideDir, 'setup')
  if (fs.existsSync(setupDir)) {
    const setupFiles = listMarkdownFiles(setupDir).filter(
      (f) => path.basename(f) !== 'index.md',
    )
    if (setupFiles.length > 0) {
      groups.push({ text: '环境搭建', collapsed: true, items: setupFiles.map((f) => toItem(f, docsRoot)) })
    }
  }

  // 代码导航 group: codebase/
  const codebaseDir = path.join(guideDir, 'codebase')
  if (fs.existsSync(codebaseDir)) {
    const codebaseFiles = listMarkdownFiles(codebaseDir).filter(
      (f) => path.basename(f) !== 'index.md',
    )
    if (codebaseFiles.length > 0) {
      groups.push({ text: '代码导航', collapsed: true, items: codebaseFiles.map((f) => toItem(f, docsRoot)) })
    }
  }

  // 实战上手 group: practice/
  const practiceDir = path.join(guideDir, 'practice')
  if (fs.existsSync(practiceDir)) {
    const practiceFiles = listMarkdownFiles(practiceDir).filter(
      (f) => path.basename(f) !== 'index.md',
    )
    if (practiceFiles.length > 0) {
      groups.push({ text: '实战上手', collapsed: true, items: practiceFiles.map((f) => toItem(f, docsRoot)) })
    }
  }

  // 常见问题 group: faq/
  const faqDir = path.join(guideDir, 'faq')
  if (fs.existsSync(faqDir)) {
    const faqFiles = listMarkdownFiles(faqDir)
    if (faqFiles.length > 0) {
      groups.push({ text: '常见问题', collapsed: true, items: faqFiles.map((f) => toItem(f, docsRoot)) })
    }
  }

  return groups
}

function buildTechGroups(techDir, docsRoot) {
  if (!fs.existsSync(techDir)) return []

  const allFiles = listMarkdownFiles(techDir).filter(
    (f) => path.dirname(f) === techDir,
  )

  const fileMap = {}
  for (const f of allFiles) {
    fileMap[path.basename(f)] = f
  }

  const groups = []

  const overviewItems = []
  if (fileMap['index.md']) overviewItems.push(toItem(fileMap['index.md'], docsRoot))
  if (fileMap['01_系统架构分析.md']) overviewItems.push(toItem(fileMap['01_系统架构分析.md'], docsRoot))
  if (fileMap['06_模块结构分析.md']) overviewItems.push(toItem(fileMap['06_模块结构分析.md'], docsRoot))
  if (overviewItems.length > 0) groups.push({ text: '系统总览', items: overviewItems })

  const conceptItems = []
  if (fileMap['02_专业术语词汇表.md']) conceptItems.push(toItem(fileMap['02_专业术语词汇表.md'], docsRoot))
  if (fileMap['03_数据模型手册.md']) conceptItems.push(toItem(fileMap['03_数据模型手册.md'], docsRoot))
  if (conceptItems.length > 0) groups.push({ text: '核心概念', collapsed: true, items: conceptItems })

  const practiceItems = []
  if (fileMap['04_业务逻辑公式手册.md']) practiceItems.push(toItem(fileMap['04_业务逻辑公式手册.md'], docsRoot))
  if (fileMap['05_开发实践指南.md']) practiceItems.push(toItem(fileMap['05_开发实践指南.md'], docsRoot))
  if (practiceItems.length > 0) groups.push({ text: '规则与实践', collapsed: true, items: practiceItems })

  const issueItems = []
  if (fileMap['07_架构设计问题清单.md']) issueItems.push(toItem(fileMap['07_架构设计问题清单.md'], docsRoot))
  if (issueItems.length > 0) groups.push({ text: '问题与风险', collapsed: true, items: issueItems })

  const knownFiles = new Set([
    'index.md',
    '01_系统架构分析.md', '02_专业术语词汇表.md', '03_数据模型手册.md',
    '04_业务逻辑公式手册.md', '05_开发实践指南.md', '06_模块结构分析.md',
    '07_架构设计问题清单.md',
  ])
  const extraItems = []
  for (const f of allFiles) {
    if (!knownFiles.has(path.basename(f))) {
      extraItems.push(toItem(f, docsRoot))
    }
  }
  if (extraItems.length > 0) groups.push({ text: '扩展文档', collapsed: true, items: extraItems })

  return groups
}

function buildBizGroups(bizDir, docsRoot) {
  if (!fs.existsSync(bizDir)) return []

  const groups = []

  const overviewItems = []
  const bizIndex = path.join(bizDir, 'index.md')
  if (fs.existsSync(bizIndex)) {
    overviewItems.push(toItem(bizIndex, docsRoot))
  }
  const rootFiles = listMarkdownFiles(bizDir).filter(
    (f) => path.dirname(f) === bizDir && path.basename(f) !== 'index.md',
  )
  for (const f of rootFiles) {
    overviewItems.push(toItem(f, docsRoot))
  }
  if (overviewItems.length > 0) {
    groups.push({ text: '业务知识', items: overviewItems })
  }

  const entries = fs.readdirSync(bizDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const domainDir = path.join(bizDir, entry.name)
    const domainFiles = listMarkdownFiles(domainDir)
    if (domainFiles.length === 0) continue
    groups.push({
      text: entry.name,
      collapsed: true,
      items: domainFiles.map((f) => toItem(f, docsRoot)),
    })
  }

  return groups
}

function renderConfig(projectName, guideGroups, techGroups, bizGroups) {
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
      '/wiki/guide/': ${JSON.stringify(guideGroups, null, 2)},
      '/wiki/tech-wiki/': ${JSON.stringify(techGroups, null, 2)},
      '/wiki/biz-wiki/': ${JSON.stringify(bizGroups, null, 2)}
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

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const projectName = projectNameFromRoot(projectRoot)
const docsRoot = path.join(projectRoot, 'docs')
const configPath = path.join(docsRoot, '.vitepress', 'config.mts')
const guideDir = path.join(docsRoot, 'wiki', 'guide')
const techDir = path.join(docsRoot, 'wiki', 'tech-wiki')
const bizDir = path.join(docsRoot, 'wiki', 'biz-wiki')
const stateDir = path.join(docsRoot, 'wiki', '.wiki-state')
const candidatePath = path.join(stateDir, 'generated-config.mts')

const guideGroups = buildGuideGroups(guideDir, docsRoot)
const techGroups = buildTechGroups(techDir, docsRoot)
const bizGroups = buildBizGroups(bizDir, docsRoot)
const nextConfig = renderConfig(projectName, guideGroups, techGroups, bizGroups)

let wroteTo = configPath
let mode = 'managed-update'

if (fs.existsSync(configPath)) {
  const current = fs.readFileSync(configPath, 'utf8')
  if (!isManagedConfig(current)) {
    wroteTo = candidatePath
    mode = 'candidate-only'
  }
}

writeText(wroteTo, nextConfig)

console.log(
  JSON.stringify(
    {
      mode,
      wroteTo,
      guideGroups: guideGroups.length,
      techGroups: techGroups.length,
      bizGroups: bizGroups.length,
    },
    null,
    2,
  ),
)
