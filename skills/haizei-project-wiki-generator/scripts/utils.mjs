import fs from 'node:fs'
import path from 'node:path'

export function toPosix(value) {
  return value.split(path.sep).join('/')
}

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

export function exists(filePath) {
  return fs.existsSync(filePath)
}

export function readJson(filePath, fallback = null) {
  if (!exists(filePath)) {
    return fallback
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

export function writeText(filePath, content, options = {}) {
  const { overwrite = true } = options

  ensureDir(path.dirname(filePath))

  if (!overwrite && exists(filePath)) {
    return false
  }

  fs.writeFileSync(filePath, content, 'utf8')
  return true
}

export function readFirstHeading(filePath) {
  if (!exists(filePath)) {
    return null
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

export function listMarkdownFiles(rootDir, options = {}) {
  const { ignoreHidden = true } = options
  const results = []

  function walk(currentDir) {
    if (!exists(currentDir)) {
      return
    }

    const entries = fs.readdirSync(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      if (ignoreHidden && entry.name.startsWith('.')) {
        continue
      }

      const fullPath = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
        continue
      }

      if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(fullPath)
      }
    }
  }

  walk(rootDir)
  return results.sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

export function toDocLink(filePath, docsRoot) {
  const relativePath = toPosix(path.relative(docsRoot, filePath)).replace(/\.md$/, '')
  if (relativePath.endsWith('/index')) {
    return `/${relativePath.slice(0, -'/index'.length)}/`
  }
  if (relativePath === 'index') {
    return '/'
  }
  return `/${relativePath}`
}

export function titleFromFileName(fileName) {
  return fileName.replace(/\.md$/, '').replace(/[_-]/g, ' ').trim()
}

export function countContentLines(filePath) {
  if (!exists(filePath)) {
    return 0
  }

  return fs.readFileSync(filePath, 'utf8').split(/\r?\n/).length
}

export function projectNameFromRoot(projectRoot) {
  const packageJsonPath = path.join(projectRoot, 'package.json')
  if (exists(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      if (packageJson.name) {
        return packageJson.name
      }
    } catch {
      // ignore invalid package.json and fall back to folder name
    }
  }

  return path.basename(projectRoot)
}

export function nowIso() {
  return new Date().toISOString()
}

export function sanitizeFileSegment(value) {
  return value.replace(/[<>:"/\\|?*]/g, '-').trim()
}

export function isManagedConfig(content) {
  return content.includes('project-wiki-generator managed config')
}
