---
name: csdn-article-generator-publish
description: csdn blog article generator skills,CSDN博客文章生成与发布技能。实现CSDN博客网站的文章的创建、保存草稿、更新和发布。适用场景：(1) 用户请求"帮我写一篇XX文章，保存到CSDN" (2) 用户请求"更新我CSDN上的某篇文章" (3) 用户请求"发布我的CSDN文章" 时调用此技能
---

# CSDN Article Generator Publish Skills

## 技能概述

- 支持读取指定目录下的 Markdown 文件内容，并将其保存为 CSDN 草稿
- 生成 Markdown 文章并保存到本地文件
- 保存 Markdown 文章为 CSDN 草稿
- 根据文章 ID 更新文章
- 发布文章（需额外字段）

## ⚠️ 重要注意事项

- **防限流**：CSDN 有接口限流机制，请勿频繁调用 API
- **建议操作**：
  - 单次保存/更新操作间隔至少 5-10 秒
  - 每天保存/更新文章数量建议不超过5篇
  - 批量操作时适当增加间隔时间
  - 优先使用草稿状态，确认无误后再发布

## 使用流程

### 步骤 1：配置请求头

判断当前目录下是否存在 `csdn_config.json` 文件，若文件不存在请复制 `config/config_example.json`到工作目录下，并重命名为 `csdn_config.json`，文件需要根据示例文档让用户进行更改，填写请求头信息： [config_example.json](config/config_example.json)

#### 获取请求头方法

1. 登录 CSDN 并打开 https://editor.csdn.net/md/ Markdown风格的文章编辑器
2. 填写标题和内容，点击保存为草稿
3. 打开浏览器开发者工具（F12）
4. 切换到 Network（网络）标签
5. 找到 `saveArticle` 请求，右键 → Copy → Copy as cURL
6. 从 curl 命令中提取以下请求头：
   - `Cookie`: 用户登录Cookie
   - `x-ca-nonce`: 请求唯一标识（UUID）
   - `x-ca-signature`: 签名
   - `x-ca-signature-headers`: 签名头列表
   - `x-ca-key`: API Key

#### 配置文件格式

```json
{
  "headers": {
    "Cookie": "用户Cookie",
    "x-ca-nonce": "UUID",
    "x-ca-signature": "签名",
    "x-ca-signature-headers": "x-ca-key,x-ca-nonce",
    "x-ca-key": "API Key"
  },
  "defaults": {
    "readType": "public",
    "type": "original",
    "pubStatus": "draft",
    "creation_statement": 0,
    "tags": "",
    "categories": ""
  }
}
```

详细字段说明见 [config_example.json](config/config_example.json)

### 步骤 2：生成 Markdown 文章

1. 根据用户需求生成文章内容（Markdown格式）
2. 保存到当前工作目录的 `csdnarticle/` 文件夹中
3. 文件命名建议：`{文章标题}.md`

```bash
# 确保 csdnarticle 目录存在
mkdir -p csdnarticle
```

### 步骤 3：保存草稿

将本地 Markdown 文件保存为 CSDN 草稿：

```bash
# 方式1：通过 --file 参数指定 Markdown 文件（推荐）
node skills/csdn-article-generator-publish/scripts/csdn_article.js save \
  --title "Python 异步编程实战" \
  --file csdnarticle/Python异步编程实战.md

# 方式2：通过 --content 参数直接传递内容
node skills/csdn-article-generator-publish/scripts/csdn_article.js save \
  --title "Python 异步编程实战" \
  --content "# Python 异步编程实战\n\n## 简介\n\n本文介绍Python异步编程..."

# 方式3：仅使用 --file 参数，自动提取文件名作为标题
node skills/csdn-article-generator-publish/scripts/csdn_article.js save \
  --file csdnarticle/Python异步编程实战.md
```

**参数说明：**
- `--title`: 文章标题（使用 --file 时可选，未提供则使用文件名）
- `--content`: Markdown 内容（与 --file 二选一）
- `--file`: Markdown 文件路径（与 --content 二选一，推荐使用）
- `--config`: 配置文件路径（默认: csdn_config.json）

### 步骤 4：检查草稿

引导用户在 CSDN 编辑器中检查文章排版、格式、内容是否正确，确认无误后，进入下一步。

### 步骤 5：发布文章（如需发布）

使用 `publish` 命令，通过 `--extra` 参数传递发布配置：

```bash
node skills/csdn-article-generator-publish/scripts/csdn_article.js publish \
  --id 159048943 \
  --title "Python 异步编程实战" \
  --file csdnarticle/Python异步编程实战.md \
  --extra '{"tags":"python,async","readType":"public","type":"original","creation_statement":1}'
```

**--extra 参数说明：**
| 字段 | 说明 | 可选值 |
|------|------|--------|
| tags | 标签（逗号分隔，最多5个） | python,async |
| readType | 可见范围 | public(默认值), private, read_need_fans, read_need_vip |
| type | 文章类型 | original(默认值), repost, translated |
| creation_statement | 创作声明 | 0=无声明(默认值), 1=部分内容由AI辅助生成, 2=内容来源网络进行整合创作, 3=个人观点，仅供参考 |
| description | 文章摘要（最大256字） | - |

详细 API 参数见 [api_reference.md](references/api_reference.md)

## 目录结构

```
csdn-article-generator-publish/
├── SKILL.md                          # 技能说明文档
├── scripts/
│   └── csdn_article.js              # Node.js 脚本（核心执行脚本）
├── config/
│   ├── config_example.json           # 用户配置文件示例
│   └── user_agents.json             # 随机User-Agent列表
└── references/
    └── api_reference.md             # CSDN API 详细文档
```

## 场景样例

### 样例 1：生成并保存草稿

> "帮我写一篇关于 Python 异步编程的文章，标题是《Python 异步编程实战》，保存到 CSDN 草稿箱"

执行流程：
1. 生成文章内容（Markdown格式）
2. 保存到 `csdnarticle/Python异步编程实战.md`
3. 调用 `save` 命令：
   ```bash
   # 方式1：使用 --file 参数（推荐）
   node scripts/csdn_article.js save \
     --title "Python 异步编程实战" \
     --file csdnarticle/Python异步编程实战.md
   
   # 方式2：使用 --content 参数（内容较短时）
   node scripts/csdn_article.js save \
     --title "Python 异步编程实战" \
     --content "# Python 异步编程实战\n\n## 简介\n\n本文介绍..."
   ```
4. 返回文章 ID 供用户后续操作

### 样例 2：更新草稿

> "更新我之前那篇 CSDN 草稿（ID: 159048943），把标题改成《Python 异步编程进阶》"

执行流程：
1. 根据新需求更新 Markdown 内容
2. 保存到 `csdnarticle/Python异步编程进阶.md`
3. 调用 `update` 命令：
   ```bash
   # 方式1：使用 --file 参数（推荐）
   node scripts/csdn_article.js update \
     --id 159048943 \
     --title "Python 异步编程进阶" \
     --file csdnarticle/Python异步编程进阶.md
   
   # 方式2：使用 --content 参数
   node scripts/csdn_article.js update \
     --id 159048943 \
     --title "Python 异步编程进阶" \
     --content "# Python 异步编程进阶\n\n## 新增内容..."
   ```

### 样例 3：发布文章

> "帮我把 ID 159048943 的文章发布到 CSDN，标签是 python,async"

执行流程：
1. 引导用户确认 creation_statement、readType、type 等字段
2. 调用 `publish` 命令：
   ```bash
   # 方式1：使用 --file 参数（推荐）
   node scripts/csdn_article.js publish \
     --id 159048943 \
     --title "Python 异步编程实战" \
     --file csdnarticle/Python异步编程实战.md \
     --extra '{"tags":"python,async","creation_statement":1,"readType":"public","type":"original"}'
   
   # 方式2：使用 --content 参数
   node scripts/csdn_article.js publish \
     --id 159048943 \
     --title "Python 异步编程实战" \
     --content "# Python 异步编程实战\n\n..." \
     --extra '{"tags":"python,async","creation_statement":1}'
   ```

