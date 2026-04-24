---
name: apiyi-gpt-image-2-gen
description: 图片生成技能，当用户需要生成图片、视觉信息图、创建图像、编辑/修改/调整已有图片时使用此技能。基于API易平台(https://api.apiyi.com/)的ChatGPT Image 2模型（gpt-image-2）的官方正式版图片生成服务。该模型支持精确的尺寸/画质控制（含4K），按token计费。与gpt-image-2-all（官逆版）不同的关键点：使用/v1/images/generations和/v1/images/edits端点；有显式size参数；有quality参数；按token计费；使用multipart/form-data上传参考图；b64_json为纯base64无前缀。
---

# 图片生成与编辑（GPT Image 2 官方正式版）

基于API易平台的GPT Image 2模型（gpt-image-2）官方正式版实现图片生成技能，可以通过自然语言帮助用户生成图片，通过API易国内代理服务访问，支持Node.js和Python两种运行环境。gpt-image-2是API易平台的官方正式版GPT图像生成模型，支持精确的尺寸/画质控制（含4K），按token计费。

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
   - **Size（可选）**：输出尺寸。
     - 预设值：`1024x1024`、`1536x1024`、`1024x1536`、`2048x2048`、`2048x1152`、`3840x2160`、`2160x3840`
     - 也可使用自定义尺寸（满足：最大边≤3840、两边16倍数、比例≤3:1、总像素0.65–8.3MP）
     - 默认由模型自适应（auto）
   - **Quality（可选）**：画质档位。`low`（草图/批量）、`medium`（日常）、`high`（终稿/精细文字）、`auto`（默认）
   - **Output Format（可选）**：`png`（默认）、`jpeg`、`webp`
   - **Output Compression（可选）**：输出压缩率（0-100），仅jpeg/webp生效
   - **注意**：该模型使用官方正式版端点，与官逆版gpt-image-2-all不同。

### 第2步：环境检查与命令执行
1. **检查环境**：确认 `APIYI_API_KEY` 环境变量是否已设置（通常假定已设置，若运行失败再提示用户）���
2. **构建并运行命令**：
   - **优先尝试 Node.js 版本**：如果环境有 Node（`node` 命令可用），优先使用 `scripts/generate_image.js`（零依赖，参数与 Python 保持一致）。
   - **Node 不可用再用 Python 版本**：使用 `scripts/generate_image.py`。

   **文生图命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "{prompt}" -f "{filename}" [-s {size}] [-q {quality}] [-o {output_format}]
   ```

   **图生图命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "{edit_instruction}" -i "{input_path}" -f "{output_filename}" [-s {size}] [-q {quality}]
   ```

   **多图融合命令模板（优先 Node.js）：**
   ```bash
   node scripts/generate_image.js -p "融合图1和图2的风格" -i ref1.png ref2.png -f "merged.png" [-s {size}] [-q {quality}]
   ```

   **（可选）Python 版本命令模板（Node 不可用时）**：
   ```bash
   python scripts/generate_image.py -p "{prompt}" -f "{filename}" [-s {size}] [-q {quality}] [-o {output_format}]
   python scripts/generate_image.py -p "{edit_instruction}" -i "{input_path}" -f "{output_filename}" [-s {size}] [-q {quality}]
   ```

## ⏱️ 长时间任务处理策略

### 1. 任务前提示

**执行前必须告知用户**：
- "图片生成已启动，预计需要120-150秒，请耐心等待"

### 2. 🎨 最佳实践示例

> "图片生成中，预计120-150秒完成...\n⏳ 正在生成...\n（high + 2K/4K 复杂场景可能需要更长时间，请耐心等待）"

### 第3步：结果反馈
1. **执行反馈**：等待终端命令执行完毕。
2. **成功**：告知用户图片已生成，并指出保存路径。
3. **失败**：
   - 若提示 API Key 缺失，请指导用户设置环境变量。
   - 若提示网络错误，建议用户检查网络或稍后重试。

## 命令行使用样例

### 生成新图片

```bash
python scripts/generate_image.py -p "图片描述文本" -f "output.png" [-s {size}] [-q {quality}] [-o {output_format}]
```

**示例：**
```bash
# 基础生成
python scripts/generate_image.py -p "一只可爱的橘猫在草地上玩耍" -f "cat.png"

# 指定尺寸和画质
python scripts/generate_image.py -p "日落山脉风景" -f "sunset.png" -s "2048x1152" -q "high"

# 竖版高清图片（适合手机壁纸）
python scripts/generate_image.py -p "城市夜景" -f "city.png" -s "2160x3840" -q "high"

# 输出为JPEG
python scripts/generate_image.py -p "风景照片" -f "landscape.jpg" -s "3840x2160" -q "high" -o "jpeg"
```

**（可选）Node.js 版本示例：**
```bash
# 基础生成
node scripts/generate_image.js -p "一只可爱的橘猫在草地上玩耍" -f "cat.png"

# 指定尺寸和画质
node scripts/generate_image.js -p "日落山脉风景" -f "sunset.png" -s "2048x1152" -q "high"
```

### 编辑已有图片

```bash
python scripts/generate_image.py -p "编辑指令" -f "output.png" -i "path/to/input.png" [-s {size}] [-q {quality}]
```

**示例：**
```bash
# 修改风格
python scripts/generate_image.py -p "将图片转换成水彩画风格" -f "watercolor.png" -i "original.png"

# 添加元素
python scripts/generate_image.py -p "在天空添加彩虹" -f "rainbow.png" -i "landscape.png" -q "high"

# 替换背景
python scripts/generate_image.py -p "将背景换成海滩" -f "beach-bg.png" -i "portrait.png" -s "2048x2048"
```

**（可选）Node.js 版本示例：**
```bash
# 修改风格
node scripts/generate_image.js -p "将图片转换成水彩画风格" -f "watercolor.png" -i "original.png"

# 多��参考图融合（最多5张）
node scripts/generate_image.js -p "把图1的人物放进图2的场景" -i ref1.png ref2.png -f "merged.png"
```

## 附加资源

- 尺寸与比例控制文档：references/size-guide.md

## 命令行参数说明

> Python 与 Node.js 版本参数保持一致（短参数与长参数等价）。

| 参数 | 必填 | 说明 |
|------|------|------|
| `-p` / `--prompt` | 是 | 图片描述（文生图）或编辑指令（图生图）。保留用户原始完整输入。 |
| `-f` / `--filename` | 否 | 输出图片路径/文件名；不传则自动生成带时间戳的文件名。 |
| `-s` / `--size` | 否 | 输出尺寸：1024x1024 / 1536x1024 / 1024x1536 / 2048x2048 / 2048x1152 / 3840x2160 / 2160x3840 或自定义尺寸。 |
| `-q` / `--quality` | 否 | 画质档位：low / medium / high / auto（默认auto）。 |
| `-o` / `--output-format` | 否 | 输出格式：png（默认）/ jpeg / webp。 |
| `-c` / `--output-compression` | 否 | 输出压缩率（0-100），仅jpeg/webp生效。 |
| `-i` / `--input-image` | 否 | 图生图输入图片路径；可传多张（最多5张）。传入该参数即进入编辑模式。 |

## 尺寸说明

### 预设尺寸

| 尺寸 | 比例 | 适用场景 |
|------|------|----------|
| 1024x1024 | 1:1 | 头像、Instagram帖子 |
| 1536x1024 | 3:2 | 标准横版 |
| 1024x1536 | 2:3 | 标准竖版 |
| 2048x2048 | 1:1 | 高清方图 |
| 2048x1152 | 16:9 | 横版视频封面、桌面壁纸 |
| 3840x2160 | 16:9 | 4K超高清 |
| 2160x3840 | 9:16 | 竖版4K |

### 自定义尺寸

可使用任意合法自定义尺寸，需满足：
- 最大边 ≤ 3840
- 两边都能被16整除
- 比例 ≤ 3:1
- 总像素 0.65–8.3MP

## 画质说明

| 画质 | 说明 | 适用场景 |
|------|------|----------|
| low | 草图/批量生成 | 快速预览、多次迭代 |
| medium | 日常 | 普通使用 |
| high | 终稿/精细文字 | 最终输出、包含文字的图像 |
| auto | 默认 | 由模型决定 |

## 输出格式说明

| 格式 | 说明 | 适用场景 |
|------|------|----------|
| png | 无压缩，透明背景 | 需要透明背景、保留最佳画质 |
| jpeg | 有压缩 | 照片、存储空间敏感 |
| webp | 现代格式 | Web使用、平衡画质与大小 |

**注意**：b64_json字段是纯base64，不含 `data:image/...;base64,` 前缀。客户端需要：
- 写文件：`base64.b64decode(b64_str)` → 写入磁盘
- 浏览器渲染：自行拼前缀 `data:image/png;base64,` + b64

## 注意事项

- API密钥必须设置，可通过环境变量或命令行参数提供
- 图片生成时间：约120-150秒，high + 2K/4K 复杂场景可能需要更长时间
- 编辑图片时，使用multipart/form-data上传参考图
- 确保输出目录有写入权限
- 按token计费（非按张）

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

### 文生图端点：POST /v1/images/generations

文生图端点，使用JSON格式请求。

### 图生图端点：POST /v1/images/edits

图生图端点，使用multipart/form-data格式请求。上传参考图（最多5张）+ 指令进行单图改图、多图融合。

参考图顺序有意义，prompt中可用"图1/图2/图3"指代。

## 模型信息

- 模型名：gpt-image-2
- 出图速度：约 120-150秒（4K复杂场景可能需要更长时间）
- 输出分辨率：1024x1024 / 1536x1024 / 1024x1536 / 2048x2048 / 2048x1152 / 3840x2160 / 2160x3840 或自定义
- 默认响应格式：b64_json（纯base64，无前缀）
- 画质档位：low / medium / high / auto
- 输出格式：png / jpeg / webp
- 支持能力：文生图、单图编辑、多图融合
- 计费方式：按token计费

## gpt-image-2（官转）vs gpt-image-2-all（官逆）对比

| 特性 | gpt-image-2 | gpt-image-2-all |
|------|-------------|-----------------|
| 性质 | 官方正式版 | 官方逆向版 |
| 计费 | 按token | 统一$0.03/张 |
| 端点 | /v1/images/generations, /v1/images/edits | /v1/chat/completions |
| 上传参考图 | multipart form-data | base64 data URL |
| 下载图片 | b64_json（纯base64） | url或b64_json（带前缀） |
| 多图融合 | image[]数组最多5张 | chat多个image_url |
| 尺寸控制 | 显式size参数 | prompt描述 |
| 速度 | 约120-150秒 | 约60-300秒 |

## 作者介绍

