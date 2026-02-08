---
name: baidu-milan-winter-olympics-2026
description: 获取2026年米兰冬奥会奖牌榜数据，从百度体育网页抓取实时的金牌/银牌/铜牌排行榜信息。当用户需要查询冬奥会奖牌榜、了解各国奖牌数量时使用此技能。
---

# 2026年米兰冬奥会奖牌榜

## 功能概述

此技能用于获取2026年米兰冬奥会的奖牌榜数据，包括：
- 各国/地区奖牌排名
- 金牌、银牌、铜牌数量
- 奖牌总数统计
- 国旗图片链接
- 详情页面链接

数据来源：百度体育 (tiyu.baidu.com)

## 使用方法

### 获取奖牌榜TOP30

当用户需要查看奖牌榜前30名时：

```bash
node scripts/milan-olympics.js top
```

返回示例：
```json
[
  {
    "rank": 1,
    "country": "意大利",
    "countryEn": "",
    "gold": 1,
    "silver": 1,
    "bronze": 1,
    "total": 3,
    "flagUrl": "https://gimg3.baidu.com/lego/...",
    "detailUrl": "https://tiyu.baidu.com/al/major/delegation?..."
  },
  {
    "rank": 1,
    "country": "日本",
    "countryEn": "",
    "gold": 1,
    "silver": 1,
    "bronze": 1,
    "total": 3,
    "flagUrl": "https://gimg3.baidu.com/lego/...",
    "detailUrl": "https://tiyu.baidu.com/al/major/delegation?..."
  }
]
```

### 获取奖牌榜TOP N

获取指定数量的排名：

```bash
node scripts/milan-olympics.js top 10
```

### 获取完整奖牌榜

```bash
node scripts/milan-olympics.js all
```

## 数据字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| rank | number | 排名 |
| country | string | 国家/地区名称（中文） |
| countryEn | string | 国家/地区名称（英文） |
| gold | number | 金牌数 |
| silver | number | 银牌数 |
| bronze | number | 铜牌数 |
| total | number | 奖牌总数 |
| flagUrl | string | 国旗图片URL |
| detailUrl | string | 详情页面URL |

## 模块导出

脚本支持作为模块导入使用：

```javascript
const { getTopMedals, getAllMedals } = require('./milan-olympics.js');

// 获取前10名
const top10 = await getTopMedals(10);

// 获取全部
const all = await getAllMedals();
```

## 注意事项

- 数据从百度体育网页实时抓取，可能存在短暂延迟
- 奖牌榜数据会随着比赛进行不断更新
- 排名规则遵循国际奥委会标准（先按金牌数，再按银牌数，再按铜牌数）
