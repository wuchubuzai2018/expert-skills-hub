#!/usr/bin/env node

/**
 * 2026年米兰冬奥会中国队获奖名单获取工具
 * 从百度体育网页抓取中国队的获奖名单数据
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

// 中国队获奖名单页面URL（id=26为中国队）
const CHINA_MEDAL_URL = 'https://tiyu.baidu.com/al/major/delegation?id=26&match=2026年米兰冬奥会&tab=获奖名单';

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
 * 从HTML中提取JSON数据（获奖名单数据）
 * @param {string} html - HTML内容
 * @returns {Object|null} 获奖名单数据对象
 */
function extractJsonFromHtml(html) {
  try {
    // 查找包含页面数据的script标签
    const scriptRegex = /<script id="atom-data-[^"]*" type="application\/json">([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      
      // 数据在 data.data.data.tabsList 中
      const pageData = parsed.data && parsed.data.data ? parsed.data.data : null;
      
      if (pageData && pageData.tabsList) {
        // 查找获奖名单标签页 (rootTab === 'medalDetail')
        const medalTab = pageData.tabsList.find(tab => tab.rootTab === 'medalDetail');
        
        if (medalTab && medalTab.data) {
          return {
            delegationInfo: {
              country: pageData.header?.title || '中国',
              countryEn: pageData.header?.subtitle || 'China（CHN）',
              rank: pageData.header?.rankInfo?.rank || '',
              gold: pageData.header?.medalInfo?.gold || '0',
              silver: pageData.header?.medalInfo?.silver || '0',
              bronze: pageData.header?.medalInfo?.bronze || '0',
              delegationId: pageData.header?.delegationId || '26'
            },
            medalList: medalTab.data
          };
        }
      }
    }
  } catch (e) {
    console.error('解析JSON数据失败:', e.message);
  }
  return null;
}

/**
 * 解析获奖名单数据
 * @param {Object} data - 从JSON中提取的原始数据
 * @returns {Array} 结构化的获奖名单数组
 */
function parseMedalList(data) {
  if (!data || !data.medalList || !Array.isArray(data.medalList)) {
    return [];
  }

  const medals = [];
  
  // data.medalList 是一个数组，每个元素代表一个筛选标签（如"全部"、"金牌"、"银牌"等）
  // 我们取第一个元素（通常是"全部"）
  const allMedalsTab = data.medalList[0];
  
  if (allMedalsTab && allMedalsTab.tabData) {
    // tabData 是按日期分组的数据
    allMedalsTab.tabData.forEach(dateGroup => {
      const date = dateGroup.date || '';
      
      if (dateGroup.dateList && Array.isArray(dateGroup.dateList)) {
        dateGroup.dateList.forEach(item => {
          medals.push({
            // 运动员信息
            playerName: item.playerName || '',
            
            // 奖牌信息
            medal: item.medal || '',           // 如"第1银"
            medalType: item.medalType || '',   // gold/silver/bronze
            medalRank: item.medal ? parseInt(item.medal.replace(/[^0-9]/g, '')) || 0 : 0,
            
            // 赛事信息
            bigMatch: item.bigMatch || '',     // 大项，如"自由式滑雪"
            smallMatch: item.smallMatch || '', // 小项，如"自由式滑雪女子坡面障碍技巧"
            
            // 时间和地点
            date: date,                        // 日期，如"02月09日"
            time: item.time || '',             // 时间，如"21:00"
            medalTime: item.medalTime || '',   // 时间戳
            
            // 排名信息
            rank: item.rank || 0,              // 比赛排名
            
            // 链接信息
            detailUrl: item.link ? `https://tiyu.baidu.com${item.link}` : '',
            loc: item.loc || '',               // 本地链接
            
            // 媒体信息
            videoInfo: item.videoInfo || null, // 视频信息
            playIconArr: item.playIconArr || [], // 播放图标
            
            // 其他信息
            country: item.country || '中国',
            olympicEventId: item.olympicEventId || '',
            backgroundColor: item.backgroundColor || '',
            color: item.color || '',
            iconType: item.iconType || ''
          });
        });
      }
    });
  }
  
  return medals;
}

/**
 * 获取中国队获奖名单
 * @param {string} medalType - 奖牌类型过滤（可选）：gold（金牌）、silver（银牌）、bronze（铜牌）、all（全部）
 * @returns {Promise<Object>} 获奖名单数据对象
 */
async function getChinaMedals(medalType = 'all') {
  try {
    const html = await httpGet(CHINA_MEDAL_URL);
    const data = extractJsonFromHtml(html);
    
    if (!data) {
      throw new Error('未能从页面解析出获奖名单数据');
    }
    
    // 解析获奖名单
    let medals = parseMedalList(data);
    
    // 按奖牌类型过滤
    if (medalType && medalType !== 'all') {
      medals = medals.filter(item => item.medalType === medalType);
    }
    
    // 按奖牌时间排序（降序，最新的在前）
    medals.sort((a, b) => {
      const timeA = parseInt(a.medalTime) || 0;
      const timeB = parseInt(b.medalTime) || 0;
      return timeB - timeA;
    });
    
    return {
      delegationInfo: data.delegationInfo,
      medals: medals,
      total: medals.length
    };
  } catch (error) {
    throw new Error(`获取中国队获奖名单失败: ${error.message}`);
  }
}

/**
 * 获取奖牌统计数据
 * @returns {Promise<Object>} 奖牌统计数据
 */
async function getMedalStats() {
  try {
    const html = await httpGet(CHINA_MEDAL_URL);
    const data = extractJsonFromHtml(html);
    
    if (!data || !data.delegationInfo) {
      throw new Error('未能获取奖牌统计数据');
    }
    
    const info = data.delegationInfo;
    const medals = parseMedalList(data);
    
    // 按类型统计
    const goldCount = medals.filter(m => m.medalType === 'gold').length;
    const silverCount = medals.filter(m => m.medalType === 'silver').length;
    const bronzeCount = medals.filter(m => m.medalType === 'bronze').length;
    
    // 按大项统计
    const sportStats = {};
    medals.forEach(m => {
      const sport = m.bigMatch || '其他';
      if (!sportStats[sport]) {
        sportStats[sport] = { gold: 0, silver: 0, bronze: 0, total: 0 };
      }
      sportStats[sport][m.medalType]++;
      sportStats[sport].total++;
    });
    
    return {
      delegationInfo: info,
      summary: {
        gold: goldCount,
        silver: silverCount,
        bronze: bronzeCount,
        total: medals.length
      },
      bySport: sportStats
    };
  } catch (error) {
    throw new Error(`获取奖牌统计失败: ${error.message}`);
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
        const medalType = args[1] || 'all';
        const result = await getChinaMedals(medalType);
        console.log(JSON.stringify(result, null, 2));
        break;
      }
      
      case 'stats':
      case '--stats':
      case '-s': {
        const stats = await getMedalStats();
        console.log(JSON.stringify(stats, null, 2));
        break;
      }
      
      default:
        console.log(`
2026年米兰冬奥会中国队获奖名单获取工具

用法:
  node milan-china-medals.js <command> [options]

命令:
  list, -l, --list [type]    获取中国队获奖名单
  stats, -s, --stats         获取奖牌统计数据

参数:
  type    奖牌类型过滤，可选值：
          all（全部，默认）、gold（金牌）、silver（银牌）、bronze（铜牌）

示例:
  # 获取全部获奖名单
  node milan-china-medals.js list

  # 获取金牌获奖名单
  node milan-china-medals.js list gold

  # 获取银牌获奖名单
  node milan-china-medals.js list silver

  # 获取铜牌获奖名单
  node milan-china-medals.js list bronze

  # 获取奖牌统计
  node milan-china-medals.js stats

数据字段说明:
  playerName    运动员姓名
  medal         奖牌名称（如"第1银"）
  medalType     奖牌类型（gold/silver/bronze）
  bigMatch      大项（如"自由式滑雪"）
  smallMatch    小项（如"自由式滑雪女子坡面障碍技巧"）
  date          日期
  time          时间
  detailUrl     详情页面URL
  videoInfo     视频信息
`);
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 导出模块供其他脚本使用
module.exports = { getChinaMedals, getMedalStats };

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
