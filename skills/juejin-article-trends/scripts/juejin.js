#!/usr/bin/env node

/**
 * 掘金热门文章排行榜获取工具
 * 用于获取掘金网站的文章分类和热门文章排行榜
 */

const https = require('https');
const zlib = require('zlib');

// 可配置 User-Agent 池（固定 15 个），每次请求随机选一个，避免固定 UA
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
  'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://juejin.cn/',
  'Origin': 'https://juejin.cn'
};

/**
 * 发起HTTP GET请求
 * @param {string} url - 请求URL
 * @param {Object} headers - 请求头
 * @returns {Promise<Object>} 响应数据
 */
function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { ...HEADERS, 'User-Agent': getRandomUserAgent(), ...headers }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => { chunks.push(chunk); });
      
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const encoding = res.headers['content-encoding'];
        
        // 解压数据
        let decompressed;
        try {
          if (encoding === 'gzip') {
            decompressed = zlib.gunzipSync(buffer);
          } else if (encoding === 'deflate') {
            decompressed = zlib.inflateSync(buffer);
          } else if (encoding === 'br') {
            decompressed = zlib.brotliDecompressSync(buffer);
          } else {
            decompressed = buffer;
          }
          
          const data = JSON.parse(decompressed.toString('utf-8'));
          resolve(data);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
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

/**
 * 获取掘金文章分类列表
 * @returns {Promise<Array>} 分类列表
 */
async function getCategories() {
  try {
    const response = await httpGet('https://api.juejin.cn/tag_api/v1/query_category_briefs');
    
    if (response.err_no !== 0) {
      throw new Error(response.err_msg || '获取分类失败');
    }
    
    return response.data.map(cat => ({
      id: cat.category_id,
      name: cat.category_name
    }));
  } catch (error) {
    throw new Error(`获取分类失败: ${error.message}`);
  }
}

/**
 * 获取掘金热门文章排行榜
 * @param {string} categoryId - 分类ID
 * @param {string} type - 排行榜类型: hot(热门), new(最新)
 * @param {number} limit - 返回文章数量限制
 * @returns {Promise<Array>} 文章列表
 */
async function getArticles(categoryId, type = 'hot', limit = 20) {
  try {
    const url = `https://api.juejin.cn/content_api/v1/content/article_rank?category_id=${categoryId}&type=${type}`;
    const response = await httpGet(url);
    
    if (response.err_no !== 0) {
      throw new Error(response.err_msg || '获取文章失败');
    }
    
    const articles = response.data.map(item => ({
      title: item.content.title,
      brief: item.content.brief || '',
      author: item.author.name,
      authorId: item.author.user_id,
      articleId: item.content.content_id,
      popularity: item.content_counter.hot_rank || 0,
      viewCount: item.content_counter.view || 0,
      likeCount: item.content_counter.like || 0,
      collectCount: item.content_counter.collect || 0,
      commentCount: item.content_counter.comment_count || 0,
      interactCount: item.content_counter.interact_count || 0,
      url: `https://juejin.cn/post/${item.content.content_id}`,
      publishTime: item.content.ctime,
      tags: item.tags ? item.tags.map(tag => tag.tag_name) : []
    }));
    
    return limit ? articles.slice(0, limit) : articles;
  } catch (error) {
    throw new Error(`获取文章失败: ${error.message}`);
  }
}

/**
 * 主函数 - 处理命令行参数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'categories':
      case '--categories':
      case '-c': {
        const categories = await getCategories();
        console.log(JSON.stringify(categories, null, 2));
        break;
      }
      
      case 'articles':
      case '--articles':
      case '-a': {
        const categoryId = args[1];
        const type = args[2] || 'hot';
        const limit = parseInt(args[3]) || 20;
        
        if (!categoryId) {
          console.error('Error: 请提供分类ID');
          console.error('用法: node juejin.js articles <category_id> [type] [limit]');
          process.exit(1);
        }
        
        const articles = await getArticles(categoryId, type, limit);
        console.log(JSON.stringify(articles, null, 2));
        break;
      }
      
      default:
        console.log(`
掘金热门文章排行榜工具

用法:
  node juejin.js <command> [options]

命令:
  categories, -c, --categories    获取文章分类列表
  articles, -a, --articles        获取热门文章排行榜

示例:
  # 获取所有分类
  node juejin.js categories

  # 获取指定分类的热门文章 (默认20篇)
  node juejin.js articles 6809637769959178254

  # 获取指定分类的最新文章，限制10篇
  node juejin.js articles 6809637769959178254 new 10

参数说明:
  category_id    分类ID (可通过 categories 命令获取)
  type           排序类型: hot(热门) 或 new(最新), 默认hot
  limit          返回文章数量, 默认20
`);
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 导出模块供其他脚本使用
module.exports = { getCategories, getArticles };

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
