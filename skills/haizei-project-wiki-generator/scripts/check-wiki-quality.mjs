import fs from 'node:fs'
import path from 'node:path'
import {
  countContentLines,
  listMarkdownFiles,
  nowIso,
  writeJson,
} from './utils.mjs'

function analyzeMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = countContentLines(filePath)
  const sectionCount = (content.match(/^##\s+/gm) ?? []).length
  const mermaidCount = (content.match(/```mermaid[\s\S]*?```/g) ?? []).length
  const sourceRefs = (content.match(/来源索引|Section sources|file:\/\/|`[^`]+\.(java|ts|js|py|go|rs|kt|vue)[\s:]/g) ?? []).length
  const crossLinks = (content.match(/\[[^\]]+\]\((\.\/|\.\.\/|\/wiki\/)/g) ?? []).length
  const pendingItems = (content.match(/待确认/g) ?? []).length
  const hasAnalysisScope = /分析范围/.test(content)
  const hasSourceIndex = /来源索引/.test(content)
  const hasCrossLinkSection = /交叉链接|相关文档/.test(content)

  const level =
    lines >= 80 && sectionCount >= 5 && sourceRefs >= 1 && hasSourceIndex
      ? 'strong'
      : lines >= 40 && sectionCount >= 3
        ? 'acceptable'
        : 'weak'

  const issues = []
  if (lines < 40) issues.push('行数不足（< 40）')
  if (sectionCount < 3) issues.push('章节不足（< 3）')
  if (!hasSourceIndex) issues.push('缺少来源索引区块')
  if (!hasAnalysisScope) issues.push('缺少分析范围声明')
  if (!hasCrossLinkSection) issues.push('缺少交叉链接/相关文档区块')
  if (mermaidCount === 0 && lines > 60) issues.push('无图表（建议添加 Mermaid）')

  return {
    filePath: path.relative(process.cwd(), filePath),
    lineCount: lines,
    sectionCount,
    mermaidCount,
    sourceRefs,
    crossLinks,
    pendingItems,
    hasAnalysisScope,
    hasSourceIndex,
    hasCrossLinkSection,
    level,
    issues,
  }
}

const projectRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
const docsRoot = path.join(projectRoot, 'docs')
const wikiRoot = path.join(docsRoot, 'wiki')
const reportPath = path.join(wikiRoot, '.wiki-state', 'quality-report.json')

const guideFiles = listMarkdownFiles(path.join(wikiRoot, 'guide'))
const techFiles = listMarkdownFiles(path.join(wikiRoot, 'tech-wiki'))
const bizFiles = listMarkdownFiles(path.join(wikiRoot, 'biz-wiki'))
const files = guideFiles.concat(techFiles).concat(bizFiles)

const documents = []
for (const filePath of files) {
  if (fs.existsSync(filePath)) {
    documents.push(analyzeMarkdown(filePath))
  }
}

const summary = {
  total: documents.length,
  strong: documents.filter((d) => d.level === 'strong').length,
  acceptable: documents.filter((d) => d.level === 'acceptable').length,
  weak: documents.filter((d) => d.level === 'weak').length,
  withSourceIndex: documents.filter((d) => d.hasSourceIndex).length,
  withAnalysisScope: documents.filter((d) => d.hasAnalysisScope).length,
  withCrossLinks: documents.filter((d) => d.hasCrossLinkSection).length,
  totalPendingItems: documents.reduce((sum, d) => sum + d.pendingItems, 0),
}

const report = { generatedAt: nowIso(), summary, documents }

writeJson(reportPath, report)
console.log(JSON.stringify(report, null, 2))
