#!/usr/bin/env node

/**
 * 2026年米兰冬奥会赛程获取工具
 * 从百度体育异步API获取赛程安排数据
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
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'identity',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://tiyu.baidu.com/',
  'Origin': 'https://tiyu.baidu.com'
};

// API基础URL
const API_BASE_URL = 'https://tiyu.baidu.com/al/major/schedule/list';

// 赛程类型映射
const SCHEDULE_TYPES = {
  all: 'all',      // 综合
  hot: 'hot',      // 热门
  china: 'china',  // 中国
  gold: 'gold'     // 金牌
};

// 2026年米兰冬奥会日期范围 (2月6日 - 2月22日)
const OLYMPICS_START_DATE = '2026-02-06';
const OLYMPICS_END_DATE = '2026-02-22';

/**
 * 发起HTTP GET请求
 * @param {string} url - 请求URL
 * @returns {Promise<Object>} 响应JSON数据
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
        try {
          const buffer = Buffer.concat(chunks);
          const text = buffer.toString('utf-8');
          const data = JSON.parse(text);
          resolve(data);
        } catch (e) {
          reject(new Error(`解析JSON失败: ${e.message}`));
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
 * 构建API URL
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {string} scheduleType - 赛程类型: all, hot, china, gold
 * @param {string} sportId - 运动项目ID，默认为'all'
 * @returns {string} 完整的API URL
 */
function buildApiUrl(date, scheduleType = 'all', sportId = 'all') {
  const type = SCHEDULE_TYPES[scheduleType] || 'all';
  return `${API_BASE_URL}?date=${date}&scheduleType=${type}&sportId=${sportId}&page=home&from=landing&isAsync=1`;
}

/**
 * 从API响应中提取赛程数据
 * @param {Object} response - API响应数据
 * @returns {Array|null} 赛程数据数组
 */
function extractScheduleFromResponse(response) {
  try {
    if (!response || response.status !== '0' || !response.data) {
      return null;
    }

    const data = response.data;
    
    if (!data.dateList || !Array.isArray(data.dateList)) {
      return null;
    }

    // 转换数据结构
    const schedules = data.dateList.map(dateItem => ({
      date: dateItem.date,
      dateFmt: dateItem.dateFmt,
      week: dateItem.week,
      countText: dateItem.countText,
      display: dateItem.display,
      matches: dateItem.scheduleList ? dateItem.scheduleList.map(match => ({
        matchId: match.matchId || '',
        matchName: match.matchName || '',
        sportName: match.discipline ? match.discipline.sportName : '',
        eventName: match.discipline ? match.discipline.eventName : '',
        subSportName: match.discipline ? match.discipline.subSportName : '',
        startTime: match.startTime || '',
        startDate: match.startDate || '',
        startDateTime: match.startDateTime || '',
        startTimestamp: match.startTimestamp || null,
        status: match.eventStatusName || '',
        statusId: match.eventStatusId || '',
        desc: match.desc || '',
        isChina: match.isChina === '1',
        isGold: match.isGold === '1',
        isHot: match.isHot === '1',
        isMedal: match.isMedal === '1',
        isPk: match.isPk === '1',
        hasLive: match.hasLive || false,
        participant: match.participant || '',
        detailUrl: match.fullLink || '',
        iconArr: match.iconArr || [],
        result: match.result || null,
        dataSource: match.dataSource || null
      })) : []
    }));

    return schedules;
  } catch (e) {
    console.error('解析赛程数据失败:', e.message);
    return null;
  }
}

/**
 * 获取指定日期的赛程数据
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @param {string} scheduleType - 赛程类型: all, hot, china, gold
 * @returns {Promise<Array>} 该日期的赛程数据数组
 */
async function getScheduleByDate(date, scheduleType = 'all') {
  try {
    const url = buildApiUrl(date, scheduleType);
    const response = await httpGet(url);
    const schedules = extractScheduleFromResponse(response);
    
    return schedules || [];
  } catch (error) {
    console.warn(`获取 ${date} 的赛程失败: ${error.message}`);
    return [];
  }
}

/**
 * 生成日期范围内的所有日期
 * @param {string} startDate - 开始日期 (YYYY-MM-DD)
 * @param {string} endDate - 结束日期 (YYYY-MM-DD)
 * @returns {Array<string>} 日期数组
 */
function generateDateRange(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * 获取全部赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08。如果为空，则获取所有日期的赛程
 * @param {boolean} fetchAll - 是否获取所有日期的数据（默认为true）
 * @returns {Promise<Array>} 赛程数组
 */
async function getAllSchedule(date = '', fetchAll = true) {
  try {
    // 如果指定了具体日期，只获取该日期
    if (date) {
      return await getScheduleByDate(date, 'all');
    }
    
    // 获取所有日期的赛程
    if (fetchAll) {
      const allSchedules = [];
      const dates = generateDateRange(OLYMPICS_START_DATE, OLYMPICS_END_DATE);
      
      // 并发请求所有日期的数据（限制并发数）
      const batchSize = 5;
      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(date => getScheduleByDate(date, 'all'))
        );
        
        results.forEach(daySchedules => {
          if (daySchedules && daySchedules.length > 0) {
            daySchedules.forEach(day => {
              if (day.matches && day.matches.length > 0) {
                allSchedules.push(day);
              }
            });
          }
        });
      }
      
      return allSchedules;
    }
    
    // 默认只获取今天的数据
    const today = getTodayDate();
    return await getScheduleByDate(today, 'all');
  } catch (error) {
    throw new Error(`获取赛程失败: ${error.message}`);
  }
}

/**
 * 获取中国相关赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08。如果为空，则获取所有日期的中国赛程
 * @param {boolean} fetchAll - 是否获取所有日期的数据（默认为true）
 * @returns {Promise<Array>} 中国相关赛程数组
 */
async function getChinaSchedule(date = '', fetchAll = true) {
  try {
    // 如果指定了具体日期，只获取该日期
    if (date) {
      const schedules = await getScheduleByDate(date, 'china');
      // 过滤出中国相关的比赛
      return schedules.map(day => ({
        ...day,
        matches: day.matches.filter(match => match.isChina)
      })).filter(day => day.matches.length > 0);
    }
    
    // 获取所有日期的中国赛程
    if (fetchAll) {
      const allSchedules = [];
      const dates = generateDateRange(OLYMPICS_START_DATE, OLYMPICS_END_DATE);
      
      // 并发请求所有日期的数据（限制并发数）
      const batchSize = 5;
      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(date => getScheduleByDate(date, 'china'))
        );
        
        results.forEach(daySchedules => {
          if (daySchedules && daySchedules.length > 0) {
            daySchedules.forEach(day => {
              if (day.matches && day.matches.length > 0) {
                // API返回的china类型数据已经是过滤过的，但再过滤一次确保安全
                const chinaMatches = day.matches.filter(match => match.isChina);
                if (chinaMatches.length > 0) {
                  allSchedules.push({
                    ...day,
                    matches: chinaMatches
                  });
                }
              }
            });
          }
        });
      }
      
      return allSchedules;
    }
    
    // 默认只获取今天的数据
    const today = getTodayDate();
    const schedules = await getScheduleByDate(today, 'china');
    return schedules.map(day => ({
      ...day,
      matches: day.matches.filter(match => match.isChina)
    })).filter(day => day.matches.length > 0);
  } catch (error) {
    throw new Error(`获取中国赛程失败: ${error.message}`);
  }
}

/**
 * 获取金牌赛赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08。如果为空，则获取所有日期的金牌赛
 * @param {boolean} fetchAll - 是否获取所有日期的数据（默认为true）
 * @returns {Promise<Array>} 金牌赛赛程数组
 */
async function getGoldSchedule(date = '', fetchAll = true) {
  try {
    // 如果指定了具体日期，只获取该日期
    if (date) {
      const schedules = await getScheduleByDate(date, 'gold');
      return schedules.map(day => ({
        ...day,
        matches: day.matches.filter(match => match.isGold)
      })).filter(day => day.matches.length > 0);
    }
    
    // 获取所有日期的金牌赛
    if (fetchAll) {
      const allSchedules = [];
      const dates = generateDateRange(OLYMPICS_START_DATE, OLYMPICS_END_DATE);
      
      const batchSize = 5;
      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(date => getScheduleByDate(date, 'gold'))
        );
        
        results.forEach(daySchedules => {
          if (daySchedules && daySchedules.length > 0) {
            daySchedules.forEach(day => {
              if (day.matches && day.matches.length > 0) {
                const goldMatches = day.matches.filter(match => match.isGold);
                if (goldMatches.length > 0) {
                  allSchedules.push({
                    ...day,
                    matches: goldMatches
                  });
                }
              }
            });
          }
        });
      }
      
      return allSchedules;
    }
    
    // 默认只获取今天的数据
    const today = getTodayDate();
    const schedules = await getScheduleByDate(today, 'gold');
    return schedules.map(day => ({
      ...day,
      matches: day.matches.filter(match => match.isGold)
    })).filter(day => day.matches.length > 0);
  } catch (error) {
    throw new Error(`获取金牌赛赛程失败: ${error.message}`);
  }
}

/**
 * 获取热门赛程
 * @param {string} date - 日期过滤（可选），格式：2026-02-08。如果为空，则获取所有日期的热门赛程
 * @param {boolean} fetchAll - 是否获取所有日期的数据（默认为true）
 * @returns {Promise<Array>} 热门赛程数组
 */
async function getHotSchedule(date = '', fetchAll = true) {
  try {
    // 如果指定了具体日期，只获取该日期
    if (date) {
      const schedules = await getScheduleByDate(date, 'hot');
      return schedules.map(day => ({
        ...day,
        matches: day.matches.filter(match => match.isHot)
      })).filter(day => day.matches.length > 0);
    }

    // 获取所有日期的热门赛程
    if (fetchAll) {
      const allSchedules = [];
      const dates = generateDateRange(OLYMPICS_START_DATE, OLYMPICS_END_DATE);

      const batchSize = 5;
      for (let i = 0; i < dates.length; i += batchSize) {
        const batch = dates.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(date => getScheduleByDate(date, 'hot'))
        );

        results.forEach(daySchedules => {
          if (daySchedules && daySchedules.length > 0) {
            daySchedules.forEach(day => {
              if (day.matches && day.matches.length > 0) {
                const hotMatches = day.matches.filter(match => match.isHot);
                if (hotMatches.length > 0) {
                  allSchedules.push({
                    ...day,
                    matches: hotMatches
                  });
                }
              }
            });
          }
        });
      }

      return allSchedules;
    }

    // 默认只获取今天的数据
    const today = getTodayDate();
    const schedules = await getScheduleByDate(today, 'hot');
    return schedules.map(day => ({
      ...day,
      matches: day.matches.filter(match => match.isHot)
    })).filter(day => day.matches.length > 0);
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
    const today = getTodayDate();
    const url = buildApiUrl(today, 'all');
    const response = await httpGet(url);
    
    if (!response || response.status !== '0' || !response.data) {
      return [];
    }

    const data = response.data;
    
    if (data.select && data.select.labels) {
      return data.select.labels.map(label => ({
        date: label.date,
        suffix: label.suffix,
        desc: label.desc,
        disabled: label.disabled === '1',
        icon: label.icon
      }));
    }
    
    return [];
  } catch (error) {
    console.warn('获取可用日期失败:', error.message);
    return [];
  }
}

/**
 * 获取所有运动项目列表
 * @returns {Promise<Object>} 包含热门项目和其他项目的对象
 */
async function getAllSports() {
  try {
    const today = getTodayDate();
    const url = buildApiUrl(today, 'all');
    const response = await httpGet(url);
    
    if (!response || response.status !== '0' || !response.data) {
      return { hot: [], other: [] };
    }

    const data = response.data;
    
    if (data.select && data.select.sport) {
      const sports = data.select.sport;
      return {
        hot: (sports.hot || []).map(sport => ({
          name: sport.name,
          value: sport.value,
          selected: sport.selected,
          hot: sport.hot || 0
        })),
        other: (sports.other || []).map(sport => ({
          name: sport.name,
          value: sport.value,
          selected: sport.selected
        }))
      };
    }
    
    return { hot: [], other: [] };
  } catch (error) {
    console.warn('获取运动项目列表失败:', error.message);
    return { hot: [], other: [] };
  }
}

/**
 * 获取指定运动项目的赛程数据
 * @param {string} sportId - 运动项目ID (如 '302' 表示短道速滑，'all' 表示全部项目)
 * @param {string} date - 日期 (YYYY-MM-DD)，如果为空则获取今天
 * @returns {Promise<Array>} 该运动项目的赛程数据数组
 */
async function getScheduleBySport(sportId, date = '') {
  try {
    const targetDate = date || getTodayDate();
    const url = buildApiUrl(targetDate, 'all', sportId);
    const response = await httpGet(url);
    const schedules = extractScheduleFromResponse(response);
    
    return schedules || [];
  } catch (error) {
    console.warn(`获取运动项目 ${sportId} 的赛程失败: ${error.message}`);
    return [];
  }
}

/**
 * 获取中国指定日期的指定运动项目赛程
 * @param {string} sportId - 运动项目ID (如 '302' 表示短道速滑)
 * @param {string} date - 日期 (YYYY-MM-DD)，如果为空则获取今天
 * @returns {Promise<Array>} 中国相关的指定运动项目赛程数组
 */
async function getChinaScheduleBySport(sportId, date = '') {
  try {
    const targetDate = date || getTodayDate();
    const url = buildApiUrl(targetDate, 'china', sportId);
    const response = await httpGet(url);
    const schedules = extractScheduleFromResponse(response);
    
    if (!schedules || schedules.length === 0) {
      return [];
    }
    
    // 过滤出中国相关的比赛
    return schedules.map(day => ({
      ...day,
      matches: day.matches.filter(match => match.isChina)
    })).filter(day => day.matches.length > 0);
  } catch (error) {
    console.warn(`获取中国运动项目 ${sportId} 的赛程失败: ${error.message}`);
    return [];
  }
}

/**
 * 获取今天的日期字符串（YYYY-MM-DD）
 * @returns {string} 今天的日期
 */
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取明天的日期字符串（YYYY-MM-DD）
 * @returns {string} 明天的日期
 */
function getTomorrowDate() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取今天的赛程（综合TAB下全部赛程）
 * @returns {Promise<Array>} 今天的赛程数组
 */
async function getTodaySchedule() {
  const today = getTodayDate();
  return getAllSchedule(today);
}

/**
 * 获取明天的赛程（综合TAB下全部赛程）
 * @returns {Promise<Array>} 明天的赛程数组
 */
async function getTomorrowSchedule() {
  const tomorrow = getTomorrowDate();
  return getAllSchedule(tomorrow);
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

      case 'today':
      case '--today':
      case '-t': {
        const schedules = await getTodaySchedule();
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }

      case 'tomorrow':
      case '--tomorrow':
      case '-m': {
        const schedules = await getTomorrowSchedule();
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }

      case 'sports':
      case '--sports':
      case '-s': {
        const sports = await getAllSports();
        console.log(JSON.stringify(sports, null, 2));
        break;
      }

      case 'sport':
      case '--sport': {
        const sportId = args[1];
        const date = args[2] || '';
        if (!sportId) {
          console.error('Error: 请指定运动项目ID');
          console.log('用法: node milan-schedule.js sport <sportId> [date]');
          console.log('示例: node milan-schedule.js sport 302 2026-02-10');
          process.exit(1);
        }
        const schedules = await getScheduleBySport(sportId, date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }

      case 'china-sport':
      case '--china-sport': {
        const sportId = args[1];
        const date = args[2] || '';
        if (!sportId) {
          console.error('Error: 请指定运动项目ID');
          console.log('用法: node milan-schedule.js china-sport <sportId> [date]');
          console.log('示例: node milan-schedule.js china-sport 302 2026-02-10');
          process.exit(1);
        }
        const schedules = await getChinaScheduleBySport(sportId, date);
        console.log(JSON.stringify(schedules, null, 2));
        break;
      }

      default:
        console.log(`
2026年米兰冬奥会赛程获取工具

用法:
  node milan-schedule.js <command> [options]

命令:
  all, -a, --all [date]         获取全部赛程（默认获取所有日期）
  china, -c, --china [date]     获取中国相关赛程（默认获取所有日期）
  gold, -g, --gold [date]       获取金牌赛赛程（默认获取所有日期）
  hot, -h, --hot [date]         获取热门赛程（默认获取所有日期）
  today, -t, --today            获取今天的赛程（无需指定日期）
  tomorrow, -m, --tomorrow      获取明天的赛程（无需指定日期）
  dates, -d, --dates            获取可用的日期列表
  sports, -s, --sports          获取所有运动项目列表
  sport <sportId> [date]        获取指定运动项目的赛程
  china-sport <sportId> [date]  获取中国指定运动项目的赛程

参数:
  date      日期过滤，格式：2026-02-08（可选）。
            不指定date时默认获取2026-02-06至2026-02-22所有日期的数据
  sportId   运动项目ID，可通过 sports 命令查看

示例:
  # 获取全部赛程（所有日期）
  node milan-schedule.js all

  # 获取特定日期的赛程
  node milan-schedule.js all 2026-02-08

  # 获取今天的赛程
  node milan-schedule.js today

  # 获取明天的赛程
  node milan-schedule.js tomorrow

  # 获取中国相关赛程（所有日期）
  node milan-schedule.js china

  # 获取特定日期的中国赛程
  node milan-schedule.js china 2026-02-08

  # 获取金牌赛赛程（所有日期）
  node milan-schedule.js gold

  # 查看所有可用日期
  node milan-schedule.js dates

  # 查看所有运动项目
  node milan-schedule.js sports

  # 获取短道速滑赛程（sportId: 302）
  node milan-schedule.js sport 302

  # 获取特定日期短道速滑赛程
  node milan-schedule.js sport 302 2026-02-10

  # 获取中国短道速滑赛程
  node milan-schedule.js china-sport 302

  # 获取特定日期中国短道速滑赛程
  node milan-schedule.js china-sport 302 2026-02-10
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
  getAvailableDates,
  getAllSports,
  getScheduleBySport,
  getChinaScheduleBySport,
  getTodaySchedule,
  getTomorrowSchedule,
  getScheduleByDate,
  generateDateRange,
  OLYMPICS_START_DATE,
  OLYMPICS_END_DATE
};

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
