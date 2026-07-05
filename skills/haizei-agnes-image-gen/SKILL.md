---
name: haizei-agnes-image-gen
description: 图片生成技能,当用户需要生成图片、视觉信息图、创建图像、编辑已有图片时使用此技能。基于Agnes AI官方API的Agnes Image 2.1 Flash模型（agnes-image-2.1-flash）的图片生成服务
---

# 图片生成与编辑（Agnes Image 2.1 Flash）

基于Agnes AI官方API的Agnes Image 2.1 Flash模型实现图片生成技能，可以通过自然语言帮助用户生成图片，仅需Node.js运行环境。文生图与图生图（编辑/多图融合）均使用Base64方式传输图片数据，无需任何第三方依赖。Agnes Image 2.1 Flash是Sapiens AI升级推出的图像生成模型，针对高信息密度图像进行了优化，更适合复杂视觉细节、丰富构图、密集元素和清晰语义对齐等场景。

## 使用指引

遵循以下步骤：

### 第1步：分析需求与参数提取
1. **明确意图**：区分用户是需要【文生图】（生成新图片）还是【图生图】（编辑/修改现有图片）或【多图融合】。
2. **提示词（Prompt）分析**：
   - **使用用户原始完整输入**：把用户输入的原始完整问题需求描述（原文）直接作为 `-p` 提示词的主体，避免自行改写、总结或二次创作，防止细节丢失。
   - **需要补充时先确认**：如果信息不足（例如缺少风格、主体数量、镜头语言、场景细节、文字内容、禁止元素等），先向用户提问确认；用户确认后，再把补充内容**以"追加"的方式**拼接到原始提示词后。
   - 样例：
       - 用户输入："帮我生成一张猫的图片，风格要可爱一点。"
       - 正例说明：直接使用用户输入作为提示词：`-p "帮我生成一张猫的图片，风格要可爱一点。"`
       - 反例说明：擅自改写为"生成一张可爱风格的猫的图片"会丢失用户原始输入的细节和语气。
       - 如果需要补充细节（例如颜色、背景等），先提问确认："你希望猫是什么颜色的？背景有什么要求吗？"用户回答后，再追加到提示词中：`-p "帮我生成一张猫的图片，风格要可爱一点。猫是橘色的，背景是草地。"`

3. **关键参数整理**：
   - **Prompt（必需）**：提示词分析后的最终提示词（默认=用户原始完整且一致的输入；仅在用户确认后才追加补充信息）。
   - **Filename（可选）**：输出图片文件名/路径(需包含文件随机标识，避免重复)。不传则脚本会自动生成带时间戳的文件名。建议根据内容生成合理文件名（例如 `cat_in_garden.png`），避免使用通用名。
   - **Size（必需）**：输出尺寸，格式 `WIDTHxHEIGHT`，例如 `1024x768`、`1536x1024`、`1024x1536`、`2048x2048`。模型支持任意合法自定义尺寸（建议参考 references/size-guide.md）。
   - **Input Image（可选）**：图生图输入图片路径，可传多张（最多5张）。传入该参数即进入编辑/多图融合模式；输入图片会自动转换为 Data URI Base64 形式发送。

### 第2步：环境检查与命令执行
1. **检查环境**：确认 `AGNES_API_KEY` 环境变量是否已设置（通常假定已设置，若运行失败再提示用户）。
2. **构建并运行命令**：
   - **使用 Node.js 版本**：调用 `scripts/generate_image.js`（零依赖，Node.js 18+ 即可）。

   **文生图命令模板：**
   ```bash
   node scripts/generate_image.js -p "{prompt}" -s "{size}" [-f "{filename}"]
   ```

   **图生图命令模板：**
   ```bash
   node scripts/generate_image.js -p "{edit_instruction}" -s "{size}" -i "{input_path}" -f "{output_filename}"
   ```

   **多图融合命令模板：**
   ```bash
   node scripts/generate_image.js -p "融合图1和图2的风格" -s "{size}" -i ref1.png ref2.png -f "merged.png"
   ```

## ⏱️ 长时间任务处理策略

### 1. 任务前提示

**执行前必须告知用户**：
- "图片生成已启动，预计需要60秒到360秒，请耐心等待"

### 2. 🎨 最佳实践示例

> "图片生成中，预计60-360秒完成...\n⏳ 正在生成...\n（高信息密度复杂场景可能需要更长时间，请耐心等待）"

### 第3步：结果反馈
1. **执行反馈**：等待终端命令执行完毕。
2. **成功**：告知用户图片已生成，并指出保存路径与实际耗时。
3. **失败**：
   - 若提示 API Key 缺失，请指导用户设置环境变量。
   - 若提示网络错误或超时，建议用户检查网络或稍后重试。
   - 若提示 400 错误，参考 SKILL.md 末尾的"常见错误与排查"。

## 命令行使用样例

### 生成新图片（文生图）

```bash
node scripts/generate_image.js -p "图片描述文本" -s "{size}" [-f "output.png"]
```

**示例：**
```bash
# 基础生成
node scripts/generate_image.js -p "A luminous floating city above a misty canyon at sunrise" -s "1024x768"

# 指定文件名
node scripts/generate_image.js -p "A clean product photo of a glass cube on a white studio background" -s "1024x768" -f "product.png"

# 竖版高清图片（适合手机壁纸）
node scripts/generate_image.js -p "未来城市夜景" -s "1024x1536" -f "city.png"

# 高信息密度场景
node scripts/generate_image.js -p "A futuristic city marketplace filled with flying vehicles, holographic signs, dense crowds, neon lighting, cinematic realism, ultra-detailed" -s "1536x1024" -f "city_market.png"
```

### 编辑已有图片（图生图）

```bash
node scripts/generate_image.js -p "编辑指令" -s "{size}" -i "path/to/input.png" [-f "output.png"]
```

**示例：**
```bash
# 修改风格
node scripts/generate_image.js -p "Convert the scene into a rain-soaked cyberpunk night with neon reflections while preserving the original composition" -s "1024x768" -i "original.png"

# 添加元素
node scripts/generate_image.js -p "Add a rainbow in the sky while preserving the original composition" -s "1024x768" -i "landscape.png" -f "rainbow.png"

# 替换背景
node scripts/generate_image.js -p "Replace the background with a beach while preserving the main subject" -s "1024x1024" -i "portrait.png" -f "beach_bg.png"

# 局部修改
node scripts/generate_image.js -p "Make the object orange while preserving the original composition" -s "1024x768" -i "photo.png" -f "orange.png"

# 多图融合（最多5张）
node scripts/generate_image.js -p "Blend the styles of image1 and image2" -s "1024x768" -i ref1.png ref2.png -f "merged.png"
```

## 命令行参数说明

| 参数 | 必填 | 说明 |
|------|------|------|
| `-p` / `--prompt` | 是 | 图片描述（文生图）或编辑指令（图生图）。保留用户原始完整输入。 |
| `-s` / `--size` | 是 | 输出尺寸，格式 `WIDTHxHEIGHT`，例如 `1024x768`、`1536x1024`。 |
| `-f` / `--filename` | 否 | 输出图片路径/文件名；不传则自动生成带时间戳的 PNG 文件名。 |
| `-i` / `--input-image` | 否 | 图生图输入图片路径；可传多张（最多5张）。传入该参数即进入编辑模式。 |
| `-k` / `--api-key` | 否 | API密钥（覆盖环境变量 `AGNES_API_KEY`）。 |


## 文件资源说明

| 资源 | 说明 |
|------|------|
| [`scripts/generate_image.js`](scripts/generate_image.js) | Node.js 脚本（零依赖，Node.js 18+ 可用） |
| [`references/size-guide.md`](references/size-guide.md) | 尺寸与比例控制文档，需要时使用，按需加载 |
| [`references/batch-template.md`](references/batch-template.md) | 批量生成配置模板，需要批量生成时使用，按需加载 |

## 批量生成

当用户需要一次性生成多张图片（批量生成）时：

1. **加载配置模板**：[references/batch-template.md](references/batch-template.md) — 包含 JSON 配置格式说明和使用示例
2. **获取/生成 JSON 文件**：用户可自行提供 JSON 文件，或描述需求后 AI 根据需求生成
3. **逐个执行**：读取 prompts 数组，逐个执行生成命令，每张完成后反馈结果
4. **汇总反馈**：完成后告知成功数量、图片路径列表、累计耗时

> 注意：批量任务总时间 = 单张时间(60-360秒) × 图片数量，请提前告知用户预估时长。

## 提示词最佳实践

Agnes Image 2.1 Flash 特别擅长高信息密度场景。建议使用结构化提示词：

```
[主体] + [场景 / 环境] + [风格] + [光照] + [构图] + [质量要求]
```

**文生图较好示例：**
```
A futuristic city marketplace filled with flying vehicles, holographic signs, dense crowds, neon lighting, cinematic realism, ultra-detailed, high-information-density composition
```

**图生图较好示例**（同时说明修改要求和保留要求）：
```
Convert the image into a fantasy winter landscape, add snow, warm window lights, and a magical atmosphere, while preserving the original building structure and camera angle.
```

推荐结构：
```
[修改要求] + [新风格 / 新场景] + [需要添加或移除的元素] + [需要保留的元素]
```

## Base64 传输说明

本技能统一使用 Base64 方式传输图片：

- **文生图输出**：通过 `extra_body.response_format: "b64_json"` 指定，响应中 `data[0].b64_json` 为图片 Base64 数据（纯 base64，无前缀）。
- **图生图输入**：本地图片自动转换为 Data URI 格式 `data:image/png;base64,XXX`，放入 `extra_body.image` 数组。
- **图生图输出**：通过 `extra_body.response_format: "b64_json"` 指定，响应中 `data[0].b64_json` 为图片 Base64 数据。

> 客户端写入文件：`Buffer.from(b64_str, 'base64')` → 写入磁盘
>
> 注意：官方文档中文生图 Base64 输出示例使用的是顶层 `"return_base64": true`，但经实测该参数被 API 忽略（仍返回 URL）。本技能统一采用 `extra_body.response_format: "b64_json"`，对文生图与图生图均有效。

## 注意事项

- API密钥必须设置，可通过环境变量 `AGNES_API_KEY` 或命令行参数 `-k` 提供
- 图片生成时间：约60-360秒，复杂高密度场景可能需要更长时间
- 文生图与图生图使用同一端点 `/v1/images/generations`，均通过 JSON 请求
- 输出图片统一为 PNG 格式（无 quality、output_format 等参数）
- 编辑图片时，输入图片最多5张，单张会自动 base64 编码后上传
- 确保输出目录有写入权限

### API Key设置与获取

#### 如何获取API Key

如果你还没有API密钥，请前往 **https://www.agnes-ai.com** 注册账号并申请API Key。

获取步骤：
1. 访问 https://www.agnes-ai.com
2. 注册/登录你的账号
3. 在控制台中创建API密钥
4. 复制密钥并设置环境变量或在命令行中使用

#### 设置API Key

脚本按以下顺序查找API密钥：
1. `--api-key` / `-k` 命令行参数（临时使用）
2. `AGNES_API_KEY` 环境变量（推荐）

**设置环境变量：**
```bash
# Linux/Mac
export AGNES_API_KEY="your-api-key-here"

# Windows CMD
set AGNES_API_KEY=your-api-key-here

# Windows PowerShell
$env:AGNES_API_KEY="your-api-key-here"
```

## API端点说明

### 端点：POST https://apihub.agnes-ai.com/v1/images/generations

文生图与图生图共用同一端点，使用 JSON 格式请求。

- **认证 Header**：`Authorization: Bearer YOUR_API_KEY`
- **Content-Type**：`application/json`

### 文生图（Base64输出）

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "...",
  "size": "1024x768",
  "extra_body": {
    "response_format": "b64_json"
  }
}
```

### 图生图（Data URI Base64 输入 + Base64 输出）

```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "...",
  "size": "1024x768",
  "extra_body": {
    "image": [
      "data:image/png;base64,XXXXX"
    ],
    "response_format": "b64_json"
  }
}
```

### 响应格式（Base64输出）

```json
{
  "created": 1780000000,
  "data": [
    {
      "url": null,
      "b64_json": "iVBORw0KGgoAAAANSUhEUgAA...",
      "revised_prompt": null
    }
  ]
}
```

## 模型信息

- 模型名：`agnes-image-2.1-flash`
- 出图速度：约 60-360 秒
- 输出分辨率：自定义尺寸，例如 `1024x768`、`1536x1024`、`2048x2048`
- 输出格式：PNG（固定）
- 支持能力：文生图、单图编辑、多图融合、高信息密度图像优化
- 价格：$0.003/张
- 输入方式：Data URI Base64（图生图）

## 常见错误与排查

### 1. `response_format` 放在顶层导致报错

不要将 `response_format` 放在请求体顶层，必须放在 `extra_body` 中。

错误示例：
```json
{
  "model": "agnes-image-2.1-flash",
  "prompt": "...",
  "size": "1024x768",
  "response_format": "b64_json"
}
```

正确示例：见上文"API端点说明"。

### 2. 文生图默认返回 URL 而非 Base64

官方文档中文生图 Base64 输出示例使用顶层 `"return_base64": true`，但实测该参数会被 API 忽略，仍返回 `url`。

✅ 推荐做法：与图生图统一使用 `extra_body.response_format: "b64_json"`，对文生图与图生图均有效（本技能已采用此方案）。

### 3. 图生图请求缺少 `image`

图生图请求中，`image` 数组为必填。

### 4. 输入图片 URL 不可访问

本技能已统一使用 Data URI Base64 输入图片，规避公网URL访问性问题。

### 5. 请求超时

图片生成可能需要60-360秒，具体取决于提示词复杂度、图片尺寸和服务负载。脚本超时已设置为360秒。

## 作者介绍

- 爱海贼的无处不在
- 我的微信公众号：无处不在的技术