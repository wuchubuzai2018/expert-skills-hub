# Expert-Skill-Hub

一个AI Agent技能仓库，提供各种实用技能，帮助AI助手更好地完成特定任务。

## 🎯 现有技能

| 技能 | 简介 | 详情 |
|---|---|---|
| nano-banana-pro-image-gen | AI 图片生成（文生图 / 图生图编辑），支持多种比例与分辨率 | [skills/nano-banana-pro-image-gen/SKILL.md](skills/nano-banana-pro-image-gen/SKILL.md) |
| pdf-to-image-preview | PDF 转图片（逐页导出 PNG/JPG，支持分辨率配置） | [skills/pdf-to-image-preview/SKILL.md](skills/pdf-to-image-preview/SKILL.md) |
| juejin-article-trends | 掘金热门文章榜单（分类列表 + 热门/最新文章） | [skills/juejin-article-trends/SKILL.md](skills/juejin-article-trends/SKILL.md) |
| baidu-milan-winter-olympics-2026 | 2026 米兰冬奥会数据（奖牌榜、现场新闻、赛程） | [skills/baidu-milan-winter-olympics-2026/SKILL.md](skills/baidu-milan-winter-olympics-2026/SKILL.md) |
| toutiao-news-trends | 今日头条新闻热榜（热点标题、热度值、跳转链接、封面图） | [skills/toutiao-news-trends/SKILL.md](skills/toutiao-news-trends/SKILL.md) |
| wechat-article-search | 微信公众号文章搜索（标题、概要、发布时间、公众号名称与链接） | [skills/wechat-article-search/SKILL.md](skills/wechat-article-search/SKILL.md) |

## 🚀 技能安装

- 方式一：前往 https://skills.sh/?q=wuchubuzai2018
- 方式二：添加具体技能：`npx skills add https://github.com/wuchubuzai2018/expert-skills-hub --skill 技能名称`
- 方式三：添加技能仓库：`npx skills add https://github.com/wuchubuzai2018/expert-skills-hub`
- 方式四：手动下载技能文件夹，复制文件到自己的技能目录skills中

## 📁 技能目录结构

每个技能应遵循以下结构：
```
skills/
└── skill-name/
    ├── SKILL.md          # 技能说明和使用指南
    ├── scripts/          # 脚本文件
    └── references/       # 参考资料
```

## ➕ 添加新技能

1. 在`skills/`目录下创建新文件夹
2. 编写`SKILL.md`文档
3. 添加必要的脚本和资料
4. 在README中更新技能列表

## 📄 SKILL.md 模板

每个技能应包含：
- 技能名称和描述
- 使用指引（步骤说明）
- 命令行使用样例
- 参数说明
- 注意事项

## 作者介绍

- 爱海贼的无处不在
- 我的微信公众号：无处不在的技术
