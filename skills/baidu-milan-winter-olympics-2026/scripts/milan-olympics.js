#!/usr/bin/env node

/**
 * 2026年米兰冬奥会奖牌榜获取工具
 * 从百度体育网页抓取奖牌榜数据
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
  // 不要 gzip/br/deflate 等压缩处理：请求服务器返回明文
  'Accept-Encoding': 'identity',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://tiyu.baidu.com/',
  'Origin': 'https://tiyu.baidu.com'
};

const MEDAL_URL = 'https://tiyu.baidu.com/al/major/home?match=2026年米兰冬奥会&tab=奖牌榜';

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
 * 解析奖牌榜HTML，提取结构化数据
 * @param {string} html - HTML内容
 * @returns {Array} 奖牌榜数据数组
 */
function parseMedalRankings(html) {
  const rankings = [];
  
  // 提取排名项的正则表达式
  // 匹配模式: class="rankContainer rankTable" 开头的<a>标签内的数据
  const rankItemRegex = /<a[^>]*class="rankContainer[^"]*"[^>]*>[\s\S]*?<\/a>/g;
  const items = html.match(rankItemRegex) || [];
  
  for (const item of items) {
    try {
      // 提取排名
      const rankMatch = item.match(/class="rankHeaderRanking[^"]*"[^>]*>.*?<span[^>]*>(\d+)<\/span>/s);
      const rank = rankMatch ? parseInt(rankMatch[1]) : 0;
      
      // 提取国家/地区名称
      const countryMatch = item.match(/class="rankHeaderAreaName[^"]*"[^>]*>([^<]+)<\/span>/);
      const country = countryMatch ? countryMatch[1].trim() : '';
      
      // 提取奖牌数 - 匹配 gold/silver/copper 类的 div
      const goldMatch = item.match(/class="medalImg gold"[^>]*>(\d+)<\/div>/);
      const silverMatch = item.match(/class="medalImg silver"[^>]*>(\d+)<\/div>/);
      const copperMatch = item.match(/class="medalImg copper"[^>]*>(\d+)<\/div>/);
      
      const gold = goldMatch ? parseInt(goldMatch[1]) : 0;
      const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
      const bronze = copperMatch ? parseInt(copperMatch[1]) : 0;
      
      // 提取总数
      const totalMatch = item.match(/class="rankHeaderSum[^"]*"[^>]*>(\d+)<\/div>/);
      const total = totalMatch ? parseInt(totalMatch[1]) : (gold + silver + bronze);
      
      // 提取国旗URL
      const flagMatch = item.match(/class="rankHeaderFlag"[^>]*style="background-image:url\('([^']+)'/);
      const flagUrl = flagMatch ? flagMatch[1] : '';
      
      // 提取详情链接
      const linkMatch = item.match(/href="([^"]+)"/);
      const detailUrl = linkMatch ? `https://tiyu.baidu.com${linkMatch[1]}` : '';
      
      if (country && rank > 0) {
        rankings.push({
          rank,
          country,
          countryEn: '', // 从HTML中无法直接获取英文名
          gold,
          silver,
          bronze,
          total,
          flagUrl,
          detailUrl
        });
      }
    } catch (e) {
      // 解析单个项目失败，继续处理下一个
      continue;
    }
  }
  
  // 如果正则匹配失败，尝试从JSON数据中提取
  if (rankings.length === 0) {
    const jsonData = extractJsonFromHtml(html);
    if (jsonData && jsonData.length > 0) {
      return jsonData;
    }
  }
  
  return rankings;
}

/**
 * 尝试从HTML中提取JSON格式的奖牌榜数据
 * @param {string} html - HTML内容
 * @returns {Array|null} 奖牌榜数据数组
 */
function extractJsonFromHtml(html) {
  try {
    // 查找包含奖牌榜数据的script标签或JSON数据
    const jsonMatch = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[1]);
      // 尝试找到奖牌榜数据
      if (data && data.medalRankings) {
        return data.medalRankings.map(item => ({
          rank: item.rank || 0,
          country: item.country || item.name || '',
          countryEn: item.countryEn || '',
          gold: item.gold || 0,
          silver: item.silver || 0,
          bronze: item.bronze || 0,
          total: item.total || 0,
          flagUrl: item.flagUrl || '',
          detailUrl: item.detailUrl || ''
        }));
      }
    }
  } catch (e) {
    // JSON解析失败
  }
  return null;
}

/**
 * 获取奖牌榜TOP N
 * @param {number} limit - 返回数量限制，默认30
 * @returns {Promise<Array>} 奖牌榜数组
 */
async function getTopMedals(limit = 30) {
  try {
    const html = await httpGet(MEDAL_URL);
    const rankings = parseMedalRankings(html);
    
    if (rankings.length === 0) {
      throw new Error('未能从页面解析出奖牌榜数据');
    }
    
    // 按排名排序并限制数量
    return rankings
      .sort((a, b) => a.rank - b.rank)
      .slice(0, limit);
  } catch (error) {
    throw new Error(`获取奖牌榜失败: ${error.message}`);
  }
}

/**
 * 获取完整奖牌榜
 * @returns {Promise<Array>} 完整奖牌榜数组
 */
async function getAllMedals() {
  return getTopMedals(100);
}

/**
 * 主函数 - 处理命令行参数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'top':
      case '--top':
      case '-t': {
        const limit = parseInt(args[1]) || 30;
        const rankings = await getTopMedals(limit);
        console.log(JSON.stringify(rankings, null, 2));
        break;
      }
      
      case 'all':
      case '--all':
      case '-a': {
        const rankings = await getAllMedals();
        console.log(JSON.stringify(rankings, null, 2));
        break;
      }
      
      default:
        console.log(`
2026年米兰冬奥会奖牌榜获取工具

用法:
  node milan-olympics.js <command> [options]

命令:
  top, -t, --top [n]    获取奖牌榜前N名（默认30）
  all, -a, --all        获取完整奖牌榜

示例:
  # 获取奖牌榜前30名
  node milan-olympics.js top

  # 获取奖牌榜前10名
  node milan-olympics.js top 10

  # 获取完整奖牌榜
  node milan-olympics.js all
`);
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 导出模块供其他脚本使用
module.exports = { getTopMedals, getAllMedals };

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
