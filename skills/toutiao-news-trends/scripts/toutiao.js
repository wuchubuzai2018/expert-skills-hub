#!/usr/bin/env node

/**
 * 今日头条热榜获取工具
 * 抓取 https://www.toutiao.com/hot-event/hot-board/ 返回的热点榜单数据
 */

const https = require('https');
const zlib = require('zlib');

const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/123.0.0.0 Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

const DEFAULT_HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://www.toutiao.com/',
  'Origin': 'https://www.toutiao.com',
};

function decompressBody(buffer, contentEncoding) {
  if (!contentEncoding) return buffer;
  const encoding = String(contentEncoding).toLowerCase();
  if (encoding.includes('gzip')) return zlib.gunzipSync(buffer);
  if (encoding.includes('deflate')) return zlib.inflateSync(buffer);
  if (encoding.includes('br')) return zlib.brotliDecompressSync(buffer);
  return buffer;
}

/**
 * 发起 HTTP GET 请求并解析 JSON
 * @param {string} url
 * @param {object} headers
 */
function httpGetJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        ...DEFAULT_HEADERS,
        'User-Agent': getRandomUserAgent(),
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const decompressed = decompressBody(buffer, res.headers['content-encoding']);
          const text = decompressed.toString('utf-8');
          const data = JSON.parse(text);
          resolve(data);
        } catch (e) {
          const status = res.statusCode || 0;
          reject(new Error(`Failed to parse JSON (status=${status}): ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function getHotBoard(limit = 50) {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(200, Math.floor(limit))) : 50;
  const url = 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc';
  const resp = await httpGetJson(url);

  if (!resp || !Array.isArray(resp.data)) {
    throw new Error('获取今日头条热榜失败：返回结构不符合预期');
  }

  const items = resp.data.map((item, index) => {
    let cleanedLink = '';
    try {
      const u = new URL(item.Url);
      u.search = '';
      u.hash = '';
      cleanedLink = u.toString();
    } catch {
      cleanedLink = typeof item.Url === 'string' ? item.Url : '';
    }

    const popularity = Number.parseInt(item.HotValue, 10);

    return {
      rank: index + 1,
      title: item.Title || '',
      popularity: Number.isFinite(popularity) ? popularity : 0,
      link: cleanedLink,
      cover: item.Image && item.Image.url ? item.Image.url : null,
      label: item.LabelDesc || item.Label || null,
      clusterId: String(item.ClusterIdStr || item.ClusterId || ''),
      categories: Array.isArray(item.InterestCategory) ? item.InterestCategory : [],
    };
  });

  return items.slice(0, safeLimit);
}

function printHelp() {
  console.log(`
今日头条热榜工具

用法:
  node scripts/toutiao.js <command> [args]

命令:
  hot, list            获取热榜（可选: limit）

示例:
  # 获取热榜（默认50条）
  node scripts/toutiao.js hot

  # 获取热榜前10条
  node scripts/toutiao.js hot 10
`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'hot':
      case 'list':
      case '--hot':
      case '-h': {
        const limitArg = args[1];
        const limit = limitArg ? Number.parseInt(limitArg, 10) : 50;
        const data = await getHotBoard(limit);
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      case 'help':
      case '--help':
      case '-?':
      default:
        printHelp();
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { getHotBoard };

if (require.main === module) {
  main();
}
