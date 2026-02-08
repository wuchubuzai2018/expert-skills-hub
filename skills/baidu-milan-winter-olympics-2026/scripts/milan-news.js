#!/usr/bin/env node

/**
 * 2026年米兰冬奥会现场新闻获取工具
 * 从百度体育网页抓取最新的现场新闻报道
 */

const https = require('https');

// 可配置 User-Agent 池（固定 20 个），每次请求随机选一个，避免固定 UA
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/123.0.0.0 Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/122.0.0.0 Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 13; Mi 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

const HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'identity',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://tiyu.baidu.com/',
  'Origin': 'https://tiyu.baidu.com'
};

const NEWS_URL = 'https://tiyu.baidu.com/al/major/home?match=2026年米兰冬奥会&tab=直击现场';

/**
 * 发起HTTP GET请求
 * @param {string} url - 请求URL
 * @returns {Promise<string>} 响应HTML内容
 */
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { ...HEADERS, 'User-Agent': getRandomUserAgent() }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => { chunks.push(chunk); });
      
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('utf-8'));
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
 * 从HTML中提取JSON数据
 * @param {string} html - HTML内容
 * @returns {Array|null} 新闻数据数组
 */
function extractNewsFromHtml(html) {
  try {
    // 查找包含页面数据的script标签
    const scriptRegex = /<script id="atom-data-[^"]*" type="application\/json">([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      
      // 数据在 data.data.data.tabsList 中
      const pageData = parsed.data && parsed.data.data ? parsed.data.data : null;
      
      if (pageData && pageData.tabsList) {
        // 查找"直击现场"标签页的数据 (rootTab === 'video')
        const liveTab = pageData.tabsList.find(tab => tab.rootTab === 'video');
        
        if (liveTab && liveTab.data && liveTab.data.list) {
          return liveTab.data.list.map(item => ({
            id: item.dataId || '',
            title: item.title || '',
            type: item.type || 'article', // article, video, post
            subType: item.subType || '',
            source: item.provider || '',
            url: item.jumpUrl || '',
            images: item.imgs || (item.img ? [item.img] : []),
            videoDuration: item.durationText || '',
            videoUrl: item.playUrl || '',
            matchId: item.matchId || []
          }));
        }
      }
    }
  } catch (e) {
    console.error('解析JSON数据失败:', e.message);
  }
  return null;
}

/**
 * 通过正则表达式解析新闻数据（备用方案）
 * @param {string} html - HTML内容
 * @returns {Array} 新闻数据数组
 */
function parseNewsFromHtml(html) {
  const news = [];
  
  // 匹配新闻项
  const itemRegex = /<a[^>]*data-index="(\d+)"[^>]*data-key="([^"]+)"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/g;
  let match;
  
  while ((match = itemRegex.exec(html)) !== null) {
    try {
      const index = match[1];
      const key = match[2];
      const href = match[3];
      const itemHtml = match[0];
      
      // 提取标题
      const titleMatch = itemHtml.match(/class="title[^"]*"[^>]*>([^<]+)<\/div>/);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // 提取来源
      const sourceMatch = itemHtml.match(/class="source[^"]*"[^>]*>([^<]+)<\/div>/);
      const source = sourceMatch ? sourceMatch[1].trim() : '';
      
      // 提取图片
      const imgMatches = itemHtml.match(/style="background-image:url\(([^)]+)\)/g);
      const images = imgMatches ? imgMatches.map(m => {
        const urlMatch = m.match(/url\(([^)]+)\)/);
        return urlMatch ? urlMatch[1].replace(/&amp;/g, '&') : '';
      }).filter(url => url) : [];
      
      // 提取视频时长
      const durationMatch = itemHtml.match(/class="time[^"]*"[^>]*>([^<]+)<\/span>/);
      const videoDuration = durationMatch ? durationMatch[1].trim() : '';
      
      // 判断类型
      const type = itemHtml.includes('video') ? 'video' : 'article';
      
      if (title) {
        news.push({
          id: key,
          title,
          type,
          subType: '',
          source,
          url: href.startsWith('http') ? href : `https://tiyu.baidu.com${href}`,
          images,
          videoDuration,
          videoUrl: '',
          matchId: []
        });
      }
    } catch (e) {
      continue;
    }
  }
  
  return news;
}

/**
 * 获取现场新闻列表
 * @param {number} limit - 返回数量限制，默认10
 * @param {string} subType - 子类型过滤（可选）：全部、热门内容、赛事集锦、精彩瞬间、选手集锦、赛后采访、赛前采访、项目介绍、专栏节目、其他
 * @returns {Promise<Array>} 新闻数组
 */
async function getLiveNews(limit = 10, subType = '') {
  try {
    const html = await httpGet(NEWS_URL);
    
    // 首先尝试从JSON提取
    let news = extractNewsFromHtml(html);
    
    // 如果JSON提取失败，使用正则解析
    if (!news || news.length === 0) {
      news = parseNewsFromHtml(html);
    }
    
    if (news.length === 0) {
      throw new Error('未能从页面解析出新闻数据');
    }
    
    // 按子类型过滤
    if (subType && subType !== '全部') {
      news = news.filter(item => item.subType === subType);
    }
    
    // 限制数量
    return news.slice(0, limit);
  } catch (error) {
    throw new Error(`获取现场新闻失败: ${error.message}`);
  }
}

/**
 * 获取可用的子类型列表
 * @returns {Promise<Array>} 子类型数组
 */
async function getSubTypes() {
  try {
    const html = await httpGet(NEWS_URL);
    const data = extractNewsFromHtml(html);
    
    if (data && data.subTabs) {
      return data.subTabs;
    }
    
    // 默认子类型
    return [
      '全部',
      '热门内容',
      '赛事集锦',
      '精彩瞬间',
      '选手集锦',
      '赛后采访',
      '赛前采访',
      '项目介绍',
      '专栏节目',
      '其他'
    ];
  } catch (error) {
    return ['全部'];
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
      case 'list':
      case '--list':
      case '-l': {
        const limit = parseInt(args[1]) || 10;
        const subType = args[2] || '';
        const news = await getLiveNews(limit, subType);
        console.log(JSON.stringify(news, null, 2));
        break;
      }
      
      case 'types':
      case '--types':
      case '-t': {
        const types = await getSubTypes();
        console.log(JSON.stringify(types, null, 2));
        break;
      }
      
      default:
        console.log(`
2026年米兰冬奥会现场新闻获取工具

用法:
  node milan-news.js <command> [options]

命令:
  list, -l, --list [n] [subtype]  获取现场新闻列表（默认10条）
  types, -t, --types              获取可用的内容类型列表

参数:
  n          返回的新闻数量（默认10）
  subtype    内容类型过滤，可选值：
             全部、热门内容、赛事集锦、精彩瞬间、选手集锦、
             赛后采访、赛前采访、项目介绍、专栏节目、其他

示例:
  # 获取最新的10条新闻
  node milan-news.js list

  # 获取最新的20条新闻
  node milan-news.js list 20

  # 获取赛事集锦类新闻
  node milan-news.js list 10 赛事集锦

  # 查看所有可用的内容类型
  node milan-news.js types
`);
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 导出模块供其他脚本使用
module.exports = { getLiveNews, getSubTypes };

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
