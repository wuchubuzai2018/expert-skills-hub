---
name: baidu-milan-winter-olympics-2026
description: 获取2026年米兰冬奥会数据，包括奖牌榜排名、现场新闻报道和赛程安排。从百度体育网页抓取实时的奖牌排行榜信息、最新新闻资讯和比赛赛程。当用户需要查询冬奥会奖牌榜、了解各国奖牌数量、获取现场新闻、查看赛程安排时使用此技能。
---

# 2026年米兰冬奥会数据获取

## 功能概述

此技能用于获取2026年米兰冬奥会的以下数据：

### 1. 奖牌榜数据
- 各国/地区奖牌排名
- 金牌、银牌、铜牌数量
- 奖牌总数统计
- 国旗图片链接
- 详情页面链接

### 2. 现场新闻报道
- 最新赛事新闻
- 精彩瞬间
- 赛后采访
- 视频资讯
- 赛事集锦

### 3. 赛程数据
- 全部赛程安排
- 中国相关赛程
- 金牌赛赛程
- 热门赛程
- 比赛时间、状态、项目信息

数据来源：百度体育 (tiyu.baidu.com)

## 获取奖牌榜数据

### 获取奖牌榜TOP30

当用户需要查看奖牌榜前30名时：

```bash
node scripts/milan-olympics.js top
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

### 奖牌榜返回数据字段说明

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

## 获取现场新闻数据

### 获取最新新闻列表

当用户需要查看冬奥会现场新闻时：

```bash
node scripts/milan-news.js list
```

### 获取指定数量的新闻

获取20条最新新闻：

```bash
node scripts/milan-news.js list 20
```

### 按类型筛选新闻

获取"赛事集锦"类型的新闻：

```bash
node scripts/milan-news.js list 10 赛事集锦
```

### 获取可用的内容类型

```bash
node scripts/milan-news.js types
```

可用类型包括：
- 全部
- 热门内容
- 赛事集锦
- 精彩瞬间
- 选手集锦
- 赛后采访
- 赛前采访
- 项目介绍
- 专栏节目
- 其他

## 新闻数据字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 新闻唯一标识 |
| title | string | 新闻标题 |
| type | string | 内容类型：article（文章）、video（视频）、post（动态） |
| subType | string | 内容子类型 |
| source | string | 新闻来源 |
| url | string | 详情页面URL |
| images | array | 图片URL数组 |
| videoDuration | string | 视频时长（仅视频类型） |
| videoUrl | string | 视频播放链接（仅视频类型） |
| matchId | array | 关联的赛事ID |

## 获取赛程数据

### 获取全部赛程

```bash
node scripts/milan-schedule.js all
```

### 获取特定日期的赛程

```bash
node scripts/milan-schedule.js all 2026-02-08
```

### 获取中国相关赛程

```bash
node scripts/milan-schedule.js china
```

获取特定日期的中国赛程：

```bash
node scripts/milan-schedule.js china 2026-02-08
```

### 获取金牌赛赛程

```bash
node scripts/milan-schedule.js gold
```

获取特定日期的金牌赛：

```bash
node scripts/milan-schedule.js gold 2026-02-08
```

### 获取热门赛程

```bash
node scripts/milan-schedule.js hot
```

### 获取今天的赛程（综合TAB）

自动获取今天日期的全部赛程，无需手动指定日期：

```bash
node scripts/milan-schedule.js today
```

### 获取明天的赛程（综合TAB）

自动获取明天日期的全部赛程，无需手动指定日期：

```bash
node scripts/milan-schedule.js tomorrow
```

### 获取可用的日期列表

```bash
node scripts/milan-schedule.js dates
```

### 赛程数据字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| matchId | string | 比赛唯一标识 |
| matchName | string | 比赛名称 |
| sportName | string | 项目大类名称 |
| eventName | string | 具体小项名称 |
| startTime | string | 开始时间（HH:mm） |
| startDate | string | 开始日期（YYYY-MM-DD） |
| startDateTime | string | 完整开始时间 |
| status | string | 比赛状态（未开赛、进行中、已结束等） |
| statusId | string | 状态ID |
| desc | string | 比赛描述/备注 |
| isChina | boolean | 是否中国相关赛程 |
| isGold | boolean | 是否金牌赛 |
| isHot | boolean | 是否热门赛程 |
| isMedal | boolean | 是否奖牌赛 |
| hasLive | boolean | 是否有直播 |
| participant | string | 参赛类型（单人/团体） |
| detailUrl | string | 详情页面URL |
| iconArr | array | 图标标签数组 |

## 作者介绍

- 爱海贼的无处不在
- 我的微信公众号：无处不在的技术

## 注意事项

- 数据从百度体育网页实时抓取，可能存在短暂延迟
- 奖牌榜数据会随着比赛进行不断更新
- 排名规则遵循国际奥委会标准（先按金牌数，再按银牌数，再按铜牌数）
- 新闻内容实时更新，包含文字报道、图片和视频
- 赛程数据包含比赛时间、项目、状态等信息
