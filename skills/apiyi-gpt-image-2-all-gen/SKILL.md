---
name: apiyi-gpt-image-2-all-gen
description: AI图片生成技能，使用ChatGPT最新生图 gpt-image-2-all，当用户需要生成图片、视觉信息图、创建图像、编辑/修改/调整已有图片时使用此技能。基于API易平台(https://api.apiyi.com/)的ChatGPT最新生图gpt-image-2-all模型（gpt-image-2-all）的图片生成服务，无需访问外网。该模型以 $0.03/张 按次计费，支持文生图、单图编辑、多图融合、自然语言改图，文字还原度高、中文提示词友好。尺寸通过prompt描述控制（无显式size参数）与NanoBanana2不同的关键点：无size参数，需在prompt开头描述尺寸；统一$0.03/张无分辨率阶梯；使用对话式端点/v1/chat/completions为主推。
---

# 图片生成与编辑（GPT Image 2 All）Skills

基于API易平台的ChatGPT最新生图gpt-image-2-all模型实现图片生成技能，可以通过自然语言帮助用户生成图片，通过API易国内代理服务访问，支持Node.js和Python两种运行环境。gpt-image-2-all是API易平台上线的一款GPT图像生成官逆模型，以 $0.03/张 的极具竞争力的按次计费定价，约60秒到300秒出图，支持文生图/单图编辑/多图融合/自然语言改图，文字还原度高、内容限制少、原生支持中文提示词。

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
   - **Size/Aspect（可选）**：由于该模型无显式size参数，尺寸通过prompt描述控制。建议在prompt开头描述尺寸。
     - "手机壁纸" -> 在prompt开头写 `竖版 9:16` 或 `手机海报 9:16`
     - "电脑壁纸/视频封面" -> 在prompt开头写 `横版 16:9` 或 `电影画幅 16:9`
     - "头像" -> 在prompt开头写 `1:1 方形构图` 或 `1024×1024 方图`
     - 默认若用户未明确指定图片比例，保持图片比例为空（由模型自适应）。
   - **Response Format（可选）**：响应格式，默认 `url`（R2 CDN加速链接），可选 `b64_json`（base64图片数据）。
   - **注意**：该模型不支持 `size`、`n`、`quality`、`aspect_ratio` 参数，传入可能触发参数校验错误。

### 第2步：环境检查与命令执行
1. **检查环境**：确认 `APIYI_API_KEY` 环境变量是否已设置（通常假定已设置，若运行失败再提示用户）。
2. **构建并运行命令**：
   - **优先尝试 Node.js 版本**：如果环境有 Node（`node` 命令可用），优先使用 `scripts/generate_image.js`（零依赖，参数与 Python 保持一致）。
   - **Node 不可用再用 Python 版本**：使用 `scripts/generate_image.py`。

   **文生图命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "{prompt}" -f "{filename}" [-r {response_format}]
   ```

   **图生图命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "{edit_instruction}" -i "{input_path}" -f "{output_filename}" [-r {response_format}]
   ```

   **多图融合命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "融合图1和图2的风格" -i ref1.png ref2.png -f "merged.png" [-r {response_format}]
   ```

   **（可选）Python 版本命令模板（Node 不可用时）**：
   ```bash
   python scripts/generate_image.py -p "{prompt}" -f "{filename}" [-r {response_format}]
   python scripts/generate_image.py -p "{edit_instruction}" -i "{input_path}" -f "{output_filename}" [-r {response_format}]
   ```

## ⏱️ 长时间任务处理策略

### 1. 任务前提示

**执行前必须告知用户**：
- "图片生成已启动，预计需要60秒到300秒"

### 2. 🎨 最佳实践示例

> "图片生成中，预计60秒到300秒完成...\n⏳ 正在生成..."

### 第3步：结果反馈
1. **执行反馈**：等待终端命令执行完毕。
2. **成功**：告知用户图片已生成，并指出保存路径。
3. **失败**：
   - 若提示 API Key 缺失，请指导用户设置环境变量。
   - 若提示网络错误，建议用户检查网络或稍后重试。

## 命令行使用样例

### 生成新图片

```bash
python scripts/generate_image.py -p "图片描述文本" -f "output.png" [-r url|b64_json]
```

**示例：**
```bash
# 基础生成
python scripts/generate_image.py -p "一只可爱的橘猫在草地上玩耍" -f "cat.png"

# 指定尺寸（在prompt开头描述）
python scripts/generate_image.py -p "横版 16:9 电影画幅，日落山脉风景" -f "sunset.png"

# 竖版高清图片（适合手机壁纸）
python scripts/generate_image.py -p "竖版 9:16 手机海报，城市夜景" -f "city.png"
```

**（可选）Node.js 版本示例：**
```bash
# 基础生成
node scripts/generate_image.js -p "一只可爱的橘猫在草地上玩耍" -f "cat.png"

# 指定尺寸
node scripts/generate_image.js -p "横版 16:9 电影画幅，日落山脉风景" -f "sunset.png"
```

### 编辑已有图片

```bash
python scripts/generate_image.py -p "编辑指令" -f "output.png" -i "path/to/input.png"
```

**示例：**
```bash
# 修改风格
python scripts/generate_image.py -p "将图片转换成水彩画风格" -f "watercolor.png" -i "original.png"

# 添加元素
python scripts/generate_image.py -p "在天空添加彩虹" -f "rainbow.png" -i "landscape.png"

# 替换背景
python scripts/generate_image.py -p "将背景换成海滩" -f "beach-bg.png" -i "portrait.png"
```

**（可选）Node.js 版本示例：**
```bash
# 修改风格
node scripts/generate_image.js -p "将图片转换成水彩画风格" -f "watercolor.png" -i "original.png"

# 多张参考图融合（最多5张）
node scripts/generate_image.js -p "融合图1和图2的风格" -i ref1.png ref2.png -f "merged.png"
```

## 附加资源

- 尺寸与比例控制文档：references/size-guide.md

## 命令行参数说明

> Python 与 Node.js 版本参数保持一致（短参数与长参数等价）。

| 参数 | 必填 | 说明 |
|------|------|------|
| `-p` / `--prompt` | 是 | 图片描述（文生图）或编辑指令（图生图）。保留用户原始完整输入。 |
| `-f` / `--filename` | 否 | 输出图片路径/文件名；不传则自动生成带时间戳的 PNG 文件名，并写入当前目录。 |
| `-r` / `--response-format` | 否 | 响应格式：`url`（默认，R2 CDN链接）或 `b64_json`（base64图片数据）。 |
| `-i` / `--input-image` | 否 | 图生图输入图片路径；可传多张（最多5张）。传入该参数即进入编辑模式。 |

## 图片比例说明

由于gpt-image-2-all模型没有size参数，尺寸通过prompt描述控制。经验证较稳定的写法：

| 需求 | 推荐写法 |
|------|----------|
| 方形 | 1024×1024 方图 / 1:1 方形构图 |
| 横版 | 横版 16:9 / 宽屏 16:9 电影画幅 |
| 竖版 | 竖版 9:16 / 手机海报 9:16 |
| 超宽横幅 | 横幅 21:9 超宽银幕 |
| 经典印刷 | 4:3 标准画幅 / 3:2 经典画幅 |

**技巧**：在prompt开头描述尺寸/构图，模型遵循度更高。可搭配画幅风格词（如 电影画幅、手机海报、方形构图）进一步提升一致性。

## 响应格式说明

### url（默认）
默认返回 R2 CDN 加速链接，有效期约24小时。适用于Web应用直接渲染。对于需要长期保存的图片，请生成后立即转存到自己的对象存储。

### b64_json
返回 base64 编码的图片数据（已含 `data:image/png;base64,` 前缀）。适用于：
- 服务端需要直接处理图片数据
- 需要写入本地文件
- 前端直接渲染

## 注意事项

- API密钥必须设置，可通过环境变量或命令行参数提供
- 图片生成时间：约60秒到300秒
- 编辑图片时，输入图片会自动转换为base64编码
- 确保输出目录有写入权限
- 该模型不支持 `size`、`n`、`quality`、`aspect_ratio` 参数
- 默认响应的 url 字段是 R2 CDN 加速链接，有效期约24小时

### API Key设置与获取

#### 如何获取API Key

如果你还没有API密钥，请前往 **https://api.apiyi.com** 注册账号并申请API Key。

获取步骤：
1. 访问 https://api.apiyi.com
2. 注册/登录你的账号
3. 在控制台中创建API密钥
4. 复制密钥并设置环境变量或在命令行中使用

#### 设置API Key

脚本按以下顺序查找API密钥：
1. `--api-key` 命令行参数（临时使用）
2. `APIYI_API_KEY` 环境变量（推荐）

**设置环境变量（推荐）：**
```bash
# Linux/Mac
export APIYI_API_KEY="your-api-key-here"

# Windows CMD
我的电脑高级设置中设置环境变量或者执行set APIYI_API_KEY=your-api-key-here

# Windows PowerShell
在我的电脑中设置环境变量:$env:APIYI_API_KEY="your-api-key-here"
```

**命令行参数方式（临时）：**
```bash
python scripts/generate_image.py -p "一只猫" -k "your-api-key-here"
```

## API端点说明

### 主推端点：POST /v1/chat/completions

对话式端点——相比 `/v1/images/generations` 和 `/v1/images/edits`，对话式端点对提示词遵循更好，并且同一端点同时支持文生图与带参考图改图，可以天然做多轮迭代。

- 仅输入文本 messages → 文生图
- messages 中加入 image_url（URL 或 base64 data URL）→ 带参考图改图
- 保留 assistant 历史消息继续追问 → 多轮迭代改图

## 模型信息

- 模型名：gpt-image-2-all
- 出图速度：约 60-300 秒
- 输出分辨率：无显式 size 参数，由模型自适应（建议在 prompt 中描述）
- 默认响应格式：url（R2 CDN 加速链接，默认 1 天有效期）
- 可选响应格式：b64_json
- 中文提示词：✅ 原生支持
- 支持能力：文生图、单图编辑、多图融合、自然语言改图
- 价格：$0.03/张

## 作者介绍

- 爱海贼的无处不在
- 我的微信公众号：无处不在的技术