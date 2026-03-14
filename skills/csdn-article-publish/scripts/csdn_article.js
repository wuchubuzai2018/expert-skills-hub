#!/usr/bin/env node
/**
 * CSDN Blog Article Management Script
 * Usage:
 *   node csdn_article.js save --title "标题" --content "内容"
 *   node csdn_article.js save --title "标题" --file path/to/article.md
 *   node csdn_article.js update --id 123456 --title "标题" --content "内容"
 *   node csdn_article.js publish --id 123456 --title "标题" --content "内容" --extra '{"tags":"python,async","creation_statement":1}'
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { markdownToHtml } = require('./markdown_to_html');

const DEFAULT_CONFIG_FILE = 'csdn_config.json';
const DEFAULT_ARTICLE_MAP_FILE = 'csdn_article_map.json';
const USER_AGENTS_FILE = path.join(__dirname, '../config/user_agents.json');
const API_URL = 'https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle';

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;
const MAX_TAG_COUNT = 5;
const MAX_DESCRIPTION_LENGTH = 256;
const REQUIRED_HEADERS = ['Cookie', 'x-ca-nonce', 'x-ca-signature', 'x-ca-signature-headers', 'x-ca-key'];
const VALID_READ_TYPES = new Set(['public', 'private', 'read_need_fans', 'read_need_vip']);
const VALID_ARTICLE_TYPES = new Set(['original', 'repost', 'translated']);
const VALID_CREATION_STATEMENTS = new Set([0, 1, 2, 3]);
const VALID_PUB_STATUS = new Set(['draft', 'publish']);
const TROUBLESHOOTING_DOC = 'skills/csdn-article-generator-publish/references/troubleshooting.md';

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warn: (msg) => console.warn(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  step: (msg) => console.log(`\x1b[90m  → ${msg}\x1b[0m`)
};

function parseArgs() {
  const args = process.argv.slice(2);
  const result = { command: null, options: {} };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace('--', '');
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        if (key === 'id') {
          result.options.id = parseInt(value, 10);
        } else if (key === 'config') {
          result.options.config = value;
        } else {
          result.options[key] = value;
        }
        i++;
      } else {
        result.options[key] = true;
      }
    } else if (!result.command) {
      result.command = args[i];
    }
  }
  
  return result;
}

function loadConfig(configPath) {
  const resolvedPath = path.resolve(configPath);
  if (!fs.existsSync(resolvedPath)) {
    log.error(`Config file '${resolvedPath}' not found`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
}

function parseExtra(extraValue) {
  if (!extraValue) {
    return {};
  }

  try {
    return JSON.parse(extraValue);
  } catch (error) {
    log.error('Invalid JSON in --extra parameter');
    log.step("Fix suggestion: ensure --extra uses valid JSON, for example --extra '{\"tags\":\"python,async\"}'");
    process.exit(1);
  }
}

function getArticleMapPath() {
  return path.resolve(process.cwd(), DEFAULT_ARTICLE_MAP_FILE);
}

function loadArticleMap() {
  const articleMapPath = getArticleMapPath();

  if (!fs.existsSync(articleMapPath)) {
    return {
      path: articleMapPath,
      data: {
        version: 1,
        articles: {}
      }
    };
  }

  try {
    const data = JSON.parse(fs.readFileSync(articleMapPath, 'utf-8'));
    return {
      path: articleMapPath,
      data: {
        version: data.version || 1,
        articles: data.articles || {}
      }
    };
  } catch (error) {
    log.error(`Failed to parse article map '${articleMapPath}'`);
    log.step('Fix suggestion: repair or remove the local map file, then run save again to recreate it');
    process.exit(1);
  }
}

function saveArticleMap(articleMap) {
  fs.writeFileSync(articleMap.path, `${JSON.stringify(articleMap.data, null, 2)}\n`, 'utf-8');
}

function normalizeFileKey(filePath) {
  const absolutePath = path.resolve(filePath);
  const relativePath = path.relative(process.cwd(), absolutePath);

  if (relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)) {
    return relativePath.split(path.sep).join('/');
  }

  return absolutePath;
}

function updateArticleMap(articleMap, filePath, articleData, command) {
  if (!filePath || !articleData || !articleData.id) {
    return;
  }

  const key = normalizeFileKey(filePath);
  const existing = articleMap.data.articles[key] || {};

  articleMap.data.articles[key] = {
    ...existing,
    id: String(articleData.id),
    url: articleData.url || existing.url || '',
    title: articleData.title || existing.title || '',
    lastCommand: command,
    updatedAt: new Date().toISOString()
  };
}

function findArticleIdByFile(articleMap, filePath) {
  if (!filePath) {
    return null;
  }

  const key = normalizeFileKey(filePath);
  return articleMap.data.articles[key] || null;
}

function isPlaceholderValue(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  const placeholderValues = new Set([
    'your_cookie_here',
    'your cookie',
    '用户cookie',
    'uuid',
    '签名',
    'api key',
    'xxxxxxxx',
    'xxxxxx'
  ]);

  return placeholderValues.has(normalized) || /^x{6,}$/i.test(trimmed) || /^your[_ -]/i.test(trimmed);
}

function printValidationErrors(title, errors) {
  log.error(title);
  errors.forEach((error, index) => {
    log.step(`${index + 1}. ${error}`);
  });
  process.exit(1);
}

function validateConfig(config, configFile) {
  const errors = [];
  const headers = config.headers || {};
  const defaults = config.defaults || {};

  REQUIRED_HEADERS.forEach((headerName) => {
    const value = headers[headerName];

    if (typeof value !== 'string' || !value.trim()) {
      errors.push(`配置文件 ${configFile} 缺少 headers.${headerName}，请从 saveArticle 请求头补齐该字段`);
      return;
    }

    if (isPlaceholderValue(value)) {
      errors.push(`配置文件 ${configFile} 中 headers.${headerName} 仍是示例值，请替换为你自己的真实请求头`);
    }
  });

  if (typeof headers.Cookie === 'string' && headers.Cookie.trim() && headers.Cookie.trim().length < 20) {
    errors.push('headers.Cookie 长度异常偏短，通常表示 Cookie 未完整复制，建议重新从浏览器复制 saveArticle 请求头');
  }

  if (typeof headers['x-ca-signature-headers'] === 'string') {
    const signatureHeaders = headers['x-ca-signature-headers'];
    if (!signatureHeaders.includes('x-ca-key') || !signatureHeaders.includes('x-ca-nonce')) {
      errors.push('headers.x-ca-signature-headers 必须包含 x-ca-key,x-ca-nonce，否则签名校验大概率失败');
    }
  }

  if (defaults.readType && !VALID_READ_TYPES.has(defaults.readType)) {
    errors.push(`defaults.readType='${defaults.readType}' 不合法，可选值：public/private/read_need_fans/read_need_vip`);
  }

  if (defaults.type && !VALID_ARTICLE_TYPES.has(defaults.type)) {
    errors.push(`defaults.type='${defaults.type}' 不合法，可选值：original/repost/translated`);
  }

  if (defaults.pubStatus && !VALID_PUB_STATUS.has(defaults.pubStatus)) {
    errors.push(`defaults.pubStatus='${defaults.pubStatus}' 不合法，可选值：draft/publish`);
  }

  if (defaults.creation_statement !== undefined && !VALID_CREATION_STATEMENTS.has(Number(defaults.creation_statement))) {
    errors.push(`defaults.creation_statement='${defaults.creation_statement}' 不合法，可选值：0/1/2/3`);
  }

  return errors;
}

function resolveContentAndTitle(args) {
  let content = args.content;
  let title = args.title ? String(args.title).trim() : '';
  let resolvedFilePath = null;

  if (args.file) {
    resolvedFilePath = path.resolve(args.file);
    log.step(`Reading file: ${resolvedFilePath}`);

    if (!fs.existsSync(resolvedFilePath)) {
      printValidationErrors('Input validation failed', [`Markdown file '${resolvedFilePath}' not found，请检查 --file 路径是否正确`]);
    }

    content = fs.readFileSync(resolvedFilePath, 'utf-8');
    log.step(`File loaded, size: ${content.length} characters`);

    if (!title) {
      title = path.basename(resolvedFilePath, path.extname(resolvedFilePath));
      log.step(`Using filename as title: ${title}`);
    }
  }

  return {
    content,
    title,
    resolvedFilePath
  };
}

function splitTags(tagsValue) {
  if (!tagsValue) {
    return [];
  }

  return String(tagsValue)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function validateResolvedInput(command, payload, resolvedFilePath) {
  const errors = [];
  const tags = splitTags(payload.tags);
  const description = typeof payload.Description === 'string' ? payload.Description.trim() : '';

  if (!payload.markdowncontent || !String(payload.markdowncontent).trim()) {
    errors.push('文章内容为空，请提供 --content 或使用 --file 指向一个非空 Markdown 文件');
  }

  if (!payload.title || !String(payload.title).trim()) {
    errors.push('文章标题为空，请提供 --title，或者使用有文件名的 --file');
  }

  if ((command === 'update' || command === 'publish') && !payload.id) {
    if (resolvedFilePath) {
      errors.push('未找到文章 ID。请先用 save 保存该文件建立映射，或在本次命令中显式传入 --id');
    } else {
      errors.push('update/publish 需要文章 ID，请传入 --id，或改用 --file 并确保该文件已经保存过草稿');
    }
  }

  if (tags.length > MAX_TAG_COUNT) {
    errors.push(`tags 超过 ${MAX_TAG_COUNT} 个，当前 ${tags.length} 个，请删减后重试`);
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push(`description 超过 ${MAX_DESCRIPTION_LENGTH} 字，当前 ${description.length} 字，请压缩摘要后重试`);
  }

  if (!VALID_READ_TYPES.has(payload.readType)) {
    errors.push(`readType='${payload.readType}' 不合法，可选值：public/private/read_need_fans/read_need_vip`);
  }

  if (!VALID_ARTICLE_TYPES.has(payload.type)) {
    errors.push(`type='${payload.type}' 不合法，可选值：original/repost/translated`);
  }

  if (!VALID_CREATION_STATEMENTS.has(Number(payload.creation_statement))) {
    errors.push(`creation_statement='${payload.creation_statement}' 不合法，可选值：0/1/2/3`);
  }

  if (!VALID_PUB_STATUS.has(payload.pubStatus)) {
    errors.push(`pubStatus='${payload.pubStatus}' 不合法，可选值：draft/publish`);
  }

  if (command === 'publish') {
    if (!description) {
      errors.push('publish 模式要求提供 description 摘要。请在 --extra 中传入 description，或在配置 defaults.description 中设置默认值');
    }
  }

  return errors;
}

function buildFailureHints(result) {
  const message = typeof result === 'string' ? result : `${result.msg || ''} ${result.code || ''}`;
  const normalized = message.toLowerCase();
  const hints = [];

  if (normalized.includes('signature') || normalized.includes('签名')) {
    hints.push('签名相关字段通常会随请求变化，请重新从浏览器里复制最新的 saveArticle 请求头');
  }

  if (normalized.includes('cookie') || normalized.includes('登录') || normalized.includes('unauthorized') || normalized.includes('403')) {
    hints.push('Cookie 可能已过期。建议重新登录 CSDN 编辑器后，再抓取一次 saveArticle 请求头');
  }

  if (normalized.includes('nonce')) {
    hints.push('x-ca-nonce 通常是一次性值，刷新页面后重新抓取请求头更稳妥');
  }

  if (normalized.includes('429') || normalized.includes('限流')) {
    hints.push('已触发限流，建议至少等待 5 到 10 秒后再重试');
  }

  return hints;
}

function loadUserAgents() {
  if (fs.existsSync(USER_AGENTS_FILE)) {
    return JSON.parse(fs.readFileSync(USER_AGENTS_FILE, 'utf-8'));
  }
  return ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'];
}

function getRandomUserAgent() {
  const agents = loadUserAgents();
  return agents[Math.floor(Math.random() * agents.length)];
}

function buildHeaders(config) {
  return {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-type': 'application/json',
    'origin': 'https://editor.csdn.net',
    'referer': 'https://editor.csdn.net/',
    'user-agent': getRandomUserAgent(),
    ...config
  };
}

function buildPayload(args, config) {
  const defaults = config.defaults || {};
  const extra = args.extra || {};
  const isPublish = extra.pubStatus === 'publish' || args.command === 'publish';
  const htmlContent = markdownToHtml(args.content);
  
  const payload = {
    id: args.id ? String(args.id) : undefined,
    title: args.title,
    content: htmlContent,
    markdowncontent: args.content,
    Description: extra.description || defaults.description || '',
    readType: extra.readType || defaults.readType || 'public',
    level: 0,
    tags: extra.tags || defaults.tags || '',
    status: isPublish ? 0 : 2,
    categories: extra.categories || defaults.categories || '',
    type: extra.type || defaults.type || 'original',
    original_link: '',
    authorized_status: false,
    not_auto_saved: '1',
    source: 'pc_mdeditor',
    cover_images: [],
    cover_type: 1,
    is_new: 1,
    vote_id: 0,
    resource_id: '',
    pubStatus: extra.pubStatus || defaults.pubStatus || 'draft',
    creation_statement: extra.creation_statement !== undefined ? extra.creation_statement : (defaults.creation_statement !== undefined ? defaults.creation_statement : 0),
    creator_activity_id: ''
  };
  
  return payload;
}

function post(url, headers, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Length': Buffer.byteLength(JSON.stringify(data))
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function postWithRetry(url, headers, data, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await post(url, headers, data);
      
      if (result.code === 200) {
        return result;
      }
      
      if (result.code === 429 || (result.msg && result.msg.includes('限流'))) {
        log.warn(`Rate limited, retrying in ${RETRY_DELAY / 1000}s... (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }
      
      return result;
    } catch (err) {
      if (attempt < retries) {
        log.warn(`Request failed: ${err.message}, retrying... (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Max retries exceeded');
}

function printUsage() {
  console.log('');
  console.log('CSDN Article Management Script');
  console.log('');
  console.log('Usage:');
  console.log('  node csdn_article.js save --title "标题" --content "内容"');
  console.log('  node csdn_article.js save --title "标题" --file path/to/article.md');
  console.log('  node csdn_article.js update --id 123456 --title "标题" --content "内容"');
  console.log('  node csdn_article.js update --id 123456 --file path/to/article.md');
  console.log('  node csdn_article.js update --file path/to/article.md');
  console.log('  node csdn_article.js publish --id 123456 --title "标题" --content "内容" --extra \'{"tags":"python,async","description":"文章摘要"}\'');
  console.log('  node csdn_article.js publish --file path/to/article.md --extra \'{"tags":"python,async","description":"文章摘要"}\'');
  console.log('');
  console.log('Options:');
  console.log('  --title: 文章标题');
  console.log('  --content: Markdown内容（与--file二选一）');
  console.log('  --file: Markdown文件路径（与--content二选一，推荐）');
  console.log('  --id: 文章ID（原有参数，继续支持显式传入；若--file已有本地映射也可省略）');
  console.log('  --extra: JSON格式扩展参数');
  console.log('  --config: 配置文件路径（默认: csdn_config.json）');
  console.log('');
  console.log('Extra options (via --extra JSON):');
  console.log('  tags: 标签（逗号分隔）');
  console.log('  readType: 可见范围 (public/private/read_need_fans/read_need_vip)');
  console.log('  type: 文章类型 (original/repost/translated),默认值为original原创');
  console.log('  creation_statement: 创作者声明 (0/1/2/3) 默认值为0，即不声明');
  console.log('  pubStatus: 发布状态 (draft/publish)');
  console.log('  description: 摘要（发布时必填，最多256字）');
  console.log('');
  console.log(`Local article map: ${DEFAULT_ARTICLE_MAP_FILE}`);
  console.log('');
}

async function main() {
  const { command, options } = parseArgs();
  
  if (!command || command === '--help' || command === '-h') {
    printUsage();
    process.exit(0);
  }
  
  if (!['save', 'update', 'publish'].includes(command)) {
    log.error(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
  }
  
  const configFile = options.config || DEFAULT_CONFIG_FILE;
  log.info(`Using config file: ${configFile}`);
  
  log.step('Loading configuration...');
  const config = loadConfig(configFile);
  const configErrors = validateConfig(config, configFile);

  if (configErrors.length > 0) {
    printValidationErrors('Configuration validation failed', configErrors);
  }

  const articleMap = loadArticleMap();
  const extra = parseExtra(options.extra);

  if (command === 'publish') {
    extra.pubStatus = 'publish';
    log.step('Publish mode enabled');
  }

  const resolvedInput = resolveContentAndTitle(options);
  const articleRecord = findArticleIdByFile(articleMap, resolvedInput.resolvedFilePath);

  if (!options.id && articleRecord && (command === 'update' || command === 'publish')) {
    options.id = articleRecord.id;
    log.step(`Resolved article ID from ${DEFAULT_ARTICLE_MAP_FILE}: ${options.id}`);
  }

  const buildArgs = {
    command,
    id: options.id,
    title: resolvedInput.title,
    content: resolvedInput.content,
    extra
  };
  
  log.step('Building request headers...');
  const headers = buildHeaders(config.headers || {});
  log.step(`User-Agent: ${headers['user-agent'].substring(0, 60)}...`);
  
  log.step('Building request payload...');
  let payload;

  try {
    payload = buildPayload(buildArgs, config);
  } catch (error) {
    log.error(`Failed to convert Markdown to HTML: ${error.message}`);
    process.exit(1);
  }

  const inputErrors = validateResolvedInput(command, payload, resolvedInput.resolvedFilePath);

  if (inputErrors.length > 0) {
    printValidationErrors('Input validation failed', inputErrors);
  }

  log.step(`Article title: ${payload.title}`);
  log.step(`Content size: ${payload.markdowncontent.length} characters`);
  log.step(`PubStatus: ${payload.pubStatus}`);
  
  log.info(`Executing ${command} command...`);
  
  try {
    const result = await postWithRetry(API_URL, headers, payload);
    
    if (result.code === 200) {
      log.success('Article saved successfully!');
      updateArticleMap(articleMap, resolvedInput.resolvedFilePath, result.data, command);

      if (resolvedInput.resolvedFilePath) {
        saveArticleMap(articleMap);
        log.step(`Updated local article map: ${articleMap.path}`);
      }

      console.log('');
      console.log(`  Article URL: ${result.data.url}`);
      console.log(`  Article ID: ${result.data.id}`);
      console.log(`  Title: ${result.data.title}`);
      console.log('');
    } else {
      log.error(`Failed: ${result.msg}`);
      if (result.traceId) {
        log.error(`Trace ID: ${result.traceId}`);
      }
      const failureHints = buildFailureHints(result);
      failureHints.forEach((hint) => log.step(`Troubleshooting: ${hint}`));
      if (failureHints.length > 0) {
        log.step(`See ${TROUBLESHOOTING_DOC} for more details`);
      }
      process.exit(1);
    }
  } catch (err) {
    log.error(`Request failed: ${err.message}`);
    log.step(`See ${TROUBLESHOOTING_DOC} for common recovery steps`);
    process.exit(1);
  }
}

main();
