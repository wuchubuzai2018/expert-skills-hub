#!/usr/bin/env node

/**
 * 2026年米兰冬奥会赛程获取工具
 * 从百度体育网页抓取赛程安排数据
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

const SCHEDULE_URL = 'https://tiyu.baidu.com/al/major/home?match=2026年米兰冬奥会&tab=赛程';

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
 * @returns {Array|null} 赛程数据数组
 */
function extractScheduleFromHtml(html) {
  try {
    // 查找包含页面数据的script标签
    const scriptRegex = /<script id="atom-data-[^"]*" type="application\/json">([\s\S]*?)<\/script>/;
    const match = html.match(scriptRegex);
    
    if (match && match[1]) {
      const parsed = JSON.parse(match[1]);
      
      // 数据在 data.data.data.tabsList 中
      const pageData = parsed.data && parsed.data.data ? parsed.data.data : null;
      
      if (pageData && pageData.tabsList) {
        // 查找赛程标签页 (rootTab === 'schedule')
        const scheduleTab = pageData.tabsList.find(tab => tab.rootTab === 'schedule');
        
        if (scheduleTab && scheduleTab.dateList) {
          // 转换数据结构
          const schedules = [];
          
          scheduleTab.dateList.forEach(dateItem => {
            const dateInfo = {
              date: dateItem.date,
              dateFmt: dateItem.dateFmt,
              countText: dateItem.countText,
              matches: []
            };
            
            if (dateItem.scheduleList) {
              dateInfo.matches = dateItem.scheduleList.map(match => ({
                matchId: match.matchId || '',
                matchName: match.matchName || '',
                sportName: match.discipline ? match.discipline.sportName : '',
                eventName: match.discipline ? match.discipline.eventName : '',
                startTime: match.startTime || '',
                startDate: match.startDate || '',
                startDateTime: match.startDateTime || '',
                status: match.eventStatusName || '',
                statusId: match.eventStatusId || '',
                desc: match.desc || '',
                isChina: match.isChina === '1',
                isGold: match.isGold === '1',
                isHot: match.isHot === '1',
                isMedal: match.isMedal === '1',
                hasLive: match.hasLive || false,
                participant: match.participant || '',
                detailUrl: match.fullLink || '',
                iconArr: match.iconArr || []
              }));
            }
            
            schedules.push(dateInfo);
          });
          
          return schedules;
        }
      }
    }
  } catch (e) {
    console.error('解析JSON数据失败:', e.message);
  }
  return null;
}

/**
 * 获取全部赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08
 * @returns {Promise<Array>} 赛程数组
 */
async function getAllSchedule(date = '') {
  try {
    const html = await httpGet(SCHEDULE_URL);
    let schedules = extractScheduleFromHtml(html);
    
    if (!schedules || schedules.length === 0) {
      throw new Error('未能从页面解析出赛程数据');
    }
    
    // 按日期过滤
    if (date) {
      schedules = schedules.filter(item => item.date === date);
    }
    
    return schedules;
  } catch (error) {
    throw new Error(`获取赛程失败: ${error.message}`);
  }
}

/**
 * 获取中国相关赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08
 * @returns {Promise<Array>} 中国相关赛程数组
 */
async function getChinaSchedule(date = '') {
  try {
    const html = await httpGet(SCHEDULE_URL);
    let schedules = extractScheduleFromHtml(html);
    
    if (!schedules || schedules.length === 0) {
      throw new Error('未能从页面解析出赛程数据');
    }
    
    // 过滤中国相关赛程
    schedules.forEach(day => {
      day.matches = day.matches.filter(match => match.isChina);
    });
    
    // 移除没有比赛的日期
    schedules = schedules.filter(day => day.matches.length > 0);
    
    // 按日期过滤
    if (date) {
      schedules = schedules.filter(item => item.date === date);
    }
    
    return schedules;
  } catch (error) {
    throw new Error(`获取中国赛程失败: ${error.message}`);
  }
}

/**
 * 获取金牌赛赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08
 * @returns {Promise<Array>} 金牌赛赛程数组
 */
async function getGoldSchedule(date = '') {
  try {
    const html = await httpGet(SCHEDULE_URL);
    let schedules = extractScheduleFromHtml(html);
    
    if (!schedules || schedules.length === 0) {
      throw new Error('未能从页面解析出赛程数据');
    }
    
    // 过滤金牌赛
    schedules.forEach(day => {
      day.matches = day.matches.filter(match => match.isGold);
    });
    
    // 移除没有金牌赛的日期
    schedules = schedules.filter(day => day.matches.length > 0);
    
    // 按日期过滤
    if (date) {
      schedules = schedules.filter(item => item.date === date);
    }
    
    return schedules;
  } catch (error) {
    throw new Error(`获取金牌赛赛程失败: ${error.message}`);
  }
}

/**
 * 获取热门赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08
 * @returns {Promise<Array>} 热门赛程数组
 */
async function getHotSchedule(date = '') {
  try {
    const html = await httpGet(SCHEDULE_URL);
    let schedules = extractScheduleFromHtml(html);
    
    if (!schedules || schedules.length === 0) {
      throw new Error('未能从页面解析出赛程数据');
    }
    
    // 过滤热门赛程
    schedules.forEach(day => {
      day.matches = day.matches.filter(match => match.isHot);
    });
    
    // 移除没有热门赛程的日期
    schedules = schedules.filter(day => day.matches.length > 0);
    
    // 按日期过滤
    if (date) {
      schedules = schedules.filter(item => item.date === date);
    }
    
    return schedules;
  } catch (error) {
    throw new Error(`获取热门赛程失败: ${error.message}`);
  }
}

/**
 * 获取可用的日期列表
 * @returns {Promise<Array>} 日期数组
 */
async function getAvailableDates() {
  try {
    const html = await httpGet(SCHEDULE_URL);
    const schedules = extractScheduleFromHtml(html);
    
    if (!schedules || schedules.length === 0) {
      return [];
    }
    
    return schedules.map(day => ({
      date: day.date,
      dateFmt: day.dateFmt,
      countText: day.countText
    }));
  } catch (error) {
    return [];
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
      case 'all':
      case '--all':
      case '-a': {
        const date = args[1] || '';
        const schedules = await getAllSchedule(date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }
      
      case 'china':
      case '--china':
      case '-c': {
        const date = args[1] || '';
        const schedules = await getChinaSchedule(date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }
      
      case 'gold':
      case '--gold':
      case '-g': {
        const date = args[1] || '';
        const schedules = await getGoldSchedule(date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }
      
      case 'hot':
      case '--hot':
      case '-h': {
        const date = args[1] || '';
        const schedules = await getHotSchedule(date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }
      
      case 'dates':
      case '--dates':
      case '-d': {
        const dates = await getAvailableDates();
        console.log(JSON.stringify(dates, null, 2));
        break;
      }
      
      default:
        console.log(`
2026年米兰冬奥会赛程获取工具

用法:
  node milan-schedule.js <command> [options]

命令:
  all, -a, --all [date]     获取全部赛程
  china, -c, --china [date] 获取中国相关赛程
  gold, -g, --gold [date]   获取金牌赛赛程
  hot, -h, --hot [date]     获取热门赛程
  dates, -d, --dates        获取可用的日期列表

参数:
  date    日期过滤，格式：2026-02-08（可选）

示例:
  # 获取全部赛程
  node milan-schedule.js all

  # 获取今天的赛程
  node milan-schedule.js all 2026-02-08

  # 获取中国相关赛程
  node milan-schedule.js china

  # 获取金牌赛赛程
  node milan-schedule.js gold

  # 查看所有可用日期
  node milan-schedule.js dates
`);
        process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// 导出模块供其他脚本使用
module.exports = { 
  getAllSchedule, 
  getChinaSchedule, 
  getGoldSchedule, 
  getHotSchedule,
  getAvailableDates 
};

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
