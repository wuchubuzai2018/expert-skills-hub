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

const DEFAULT_CONFIG_FILE = 'csdn_config.json';
const USER_AGENTS_FILE = path.join(__dirname, '../config/user_agents.json');
const API_URL = 'https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle';

const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

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
  
  let extra = {};
  if (args.extra) {
    try {
      extra = JSON.parse(args.extra);
    } catch (e) {
      log.error('Invalid JSON in --extra parameter');
      process.exit(1);
    }
  }
  
  let content = args.content;
  if (args.file) {
    const filePath = path.resolve(args.file);
    log.step(`Reading file: ${filePath}`);
    if (!fs.existsSync(filePath)) {
      log.error(`File '${filePath}' not found`);
      process.exit(1);
    }
    content = fs.readFileSync(filePath, 'utf-8');
    log.step(`File loaded, size: ${content.length} characters`);
    if (!args.title) {
      const fileName = path.basename(filePath, path.extname(filePath));
      args.title = fileName;
      log.step(`Using filename as title: ${args.title}`);
    }
  }
  
  if (!content) {
    log.error('Either --content or --file is required');
    process.exit(1);
  }
  
  const isPublish = extra.pubStatus === 'publish' || (args.command === 'publish');
  
  const payload = {
    id: args.id ? String(args.id) : undefined,
    title: args.title,
    content:content,
    markdowncontent: content,
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
  console.log('  node csdn_article.js publish --id 123456 --title "标题" --content "内容" --extra \'{"tags":"python,async"}\'');
  console.log('');
  console.log('Options:');
  console.log('  --title: 文章标题');
  console.log('  --content: Markdown内容（与--file二选一）');
  console.log('  --file: Markdown文件路径（与--content二选一，推荐）');
  console.log('  --id: 文章ID（update/publish时必需）');
  console.log('  --extra: JSON格式扩展参数');
  console.log('  --config: 配置文件路径（默认: csdn_config.json）');
  console.log('');
  console.log('Extra options (via --extra JSON):');
  console.log('  tags: 标签（逗号分隔）');
  console.log('  readType: 可见范围 (public/private/read_need_fans/read_need_vip)');
  console.log('  type: 文章类型 (original/repost/translated),默认值为original原创');
  console.log('  creation_statement: 创作者声明 (0/1/2/3) 默认值为0，即不声明');
  console.log('  pubStatus: 发布状态 (draft/publish)');
  console.log('  description: 摘要');
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
  
  if (!options.title && !options.file && command !== 'update' && command !== 'publish') {
    log.error('--title or --file is required');
    process.exit(1);
  }
  if ((command === 'update' || command === 'publish') && !options.id) {
    log.error('--id is required for update/publish');
    process.exit(1);
  }
  
  const configFile = options.config || DEFAULT_CONFIG_FILE;
  log.info(`Using config file: ${configFile}`);
  
  log.step('Loading configuration...');
  const config = loadConfig(configFile);
  
  log.step('Building request headers...');
  const headers = buildHeaders(config.headers || {});
  log.step(`User-Agent: ${headers['user-agent'].substring(0, 60)}...`);
  
  if (command === 'publish') {
    const extra = options.extra ? JSON.parse(options.extra) : {};
    extra.pubStatus = 'publish';
    options.extra = JSON.stringify(extra);
    log.step('Publish mode enabled');
  }
  
  log.step('Building request payload...');
  const payload = buildPayload(options, config);
  log.step(`Article title: ${payload.title}`);
  log.step(`Content size: ${payload.markdowncontent.length} characters`);
  log.step(`PubStatus: ${payload.pubStatus}`);
  
  log.info(`Executing ${command} command...`);
  
  try {
    const result = await postWithRetry(API_URL, headers, payload);
    
    if (result.code === 200) {
      log.success('Article saved successfully!');
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
      process.exit(1);
    }
  } catch (err) {
    log.error(`Request failed: ${err.message}`);
    process.exit(1);
  }
}

main();
