# Expert-Skill-Hub

一个AI Agent技能仓库，提供各种实用技能，帮助AI助手更好地完成特定任务。

## 🎯 现有技能

###  nano-banana-pro-image-gen
**AI图片生成技能** - 支持文生图、图生图编辑
- 10种图片比例（1:1, 16:9, 9:16等）
- 3种分辨率（1K/2K/4K）
- 使用API易代理服务
- [查看详情 →](skills/nano-banana-pro-image-gen/SKILL.md)

###  pdf-to-image-preview
**PDF文件转图片** - 支持PDF文件转换为图片
- [查看详情 →](skills/pdf-to-image-preview/SKILL.md)


## 🚀 技能安装

- 使用npx命令：
npx skills add https://github.com/wuchubuzai2018/expert-skills-hub --skill 实际技能名称

- 克隆仓库
1. 复制此仓库
2. 根据需要选择技能
3. 查看各技能目录下的SKILL.md获取使用说明

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
