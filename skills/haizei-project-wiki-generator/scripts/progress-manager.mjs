import fs from 'node:fs'
import path from 'node:path'
import { countContentLines, ensureDir, nowIso, readJson, writeJson } from './utils.mjs'

function statePaths(projectRoot) {
  const stateDir = path.join(projectRoot, 'docs', 'wiki', '.wiki-state')
  ensureDir(stateDir)
  return {
    stateDir,
    progressPath: path.join(stateDir, 'progress.json'),
    planPath: path.join(stateDir, 'plan.json'),
  }
}

function fileStatus(filePath) {
  if (!fs.existsSync(filePath)) return 'pending'
  return countContentLines(filePath) >= 20 ? 'completed' : 'draft'
}

function buildQueueFromPlan(projectRoot, plan) {
  const queue = []
  const docsDir = path.join(projectRoot, 'docs')

  if (plan.guide && plan.guide.docs) {
    for (const doc of plan.guide.docs) {
      const filePath = path.join(docsDir, doc.path)
      queue.push({
        id: doc.id,
        type: 'guide',
        title: doc.title,
        fileName: doc.fileName,
        filePath,
        status: doc.status || fileStatus(filePath),
        updatedAt: null,
      })
    }
  }

  if (plan.techWiki && plan.techWiki.docs) {
    for (const doc of plan.techWiki.docs) {
      const filePath = path.join(docsDir, doc.path)
      queue.push({
        id: doc.id,
        type: 'tech',
        title: doc.title,
        fileName: doc.fileName,
        filePath,
        status: doc.status || fileStatus(filePath),
        updatedAt: null,
      })
    }
  }

  if (plan.bizWiki && plan.bizWiki.domains) {
    for (const domain of plan.bizWiki.domains) {
      for (const doc of domain.docs || []) {
        const filePath = path.join(docsDir, doc.path)
        queue.push({
          id: doc.id,
          type: 'biz',
          domain: domain.name,
          title: doc.title,
          fileName: doc.fileName,
          filePath,
          status: doc.status || fileStatus(filePath),
          updatedAt: null,
        })
      }
    }
  }

  return queue
}

function initProgress(projectRoot) {
  const { progressPath, planPath } = statePaths(projectRoot)
  const plan = readJson(planPath, {})

  const progress = {
    initializedAt: nowIso(),
    updatedAt: nowIso(),
    docs: buildQueueFromPlan(projectRoot, plan),
  }

  writeJson(progressPath, progress)
  return progress
}

function showProgress(projectRoot) {
  const { progressPath } = statePaths(projectRoot)
  const progress = readJson(progressPath, null)
  if (!progress) {
    throw new Error('progress.json 不存在，请先运行 init')
  }

  const docs = progress.docs || []
  const guideDocs = docs.filter((d) => d.type === 'guide')
  const techDocs = docs.filter((d) => d.type === 'tech')
  const bizDocs = docs.filter((d) => d.type === 'biz')

  return {
    total: docs.length,
    completed: docs.filter((d) => d.status === 'completed').length,
    pending: docs.filter((d) => d.status === 'pending').length,
    draft: docs.filter((d) => d.status === 'draft').length,
    guide: { total: guideDocs.length, completed: guideDocs.filter((d) => d.status === 'completed').length },
    tech: { total: techDocs.length, completed: techDocs.filter((d) => d.status === 'completed').length },
    biz: { total: bizDocs.length, completed: bizDocs.filter((d) => d.status === 'completed').length },
    nextPending: docs.filter((d) => d.status !== 'completed').slice(0, 5),
  }
}

function completeDoc(projectRoot, docId) {
  const { progressPath } = statePaths(projectRoot)
  const progress = readJson(progressPath, null)
  if (!progress) {
    throw new Error('progress.json 不存在，请先运行 init')
  }

  const doc = (progress.docs || []).find((item) => item.id === docId)
  if (!doc) {
    throw new Error(`未找到文档编号: ${docId}`)
  }

  doc.status = 'completed'
  doc.updatedAt = nowIso()
  progress.updatedAt = nowIso()
  writeJson(progressPath, progress)
  return { completed: docId, remaining: progress.docs.filter((d) => d.status !== 'completed').length }
}

const command = process.argv[2]
const projectRoot = process.argv[3] ? path.resolve(process.argv[3]) : process.cwd()

if (!command) {
  console.error('用法: node progress-manager.mjs <init|show|complete> <project-root> [doc-id]')
  process.exit(1)
}

if (command === 'init') {
  console.log(JSON.stringify(initProgress(projectRoot), null, 2))
} else if (command === 'show') {
  console.log(JSON.stringify(showProgress(projectRoot), null, 2))
} else if (command === 'complete') {
  const docId = process.argv[4]
  if (!docId) {
    console.error('complete 用法: node progress-manager.mjs complete <project-root> <doc-id>')
    process.exit(1)
  }
  console.log(JSON.stringify(completeDoc(projectRoot, docId), null, 2))
} else {
  console.error(`未知命令: ${command}`)
  process.exit(1)
}
