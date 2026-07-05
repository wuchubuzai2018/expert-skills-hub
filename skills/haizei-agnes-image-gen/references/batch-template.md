# 批量生成提示词模板

当用户需要一次性生成多张图片时，可使用本文档定义的 JSON 格式配置批量生成任务。

## JSON 文件格式

```json
{
  "description": "批量任务描述（可选）",
  "global": {
    "size": "1024x768"
  },
  "prompts": [
    {
      "prompt": "提示词1描述",
      "filename": "output1.png",
      "size": "1024x768"
    },
    {
      "prompt": "提示词2描述",
      "filename": "output2.png",
      "size": "2048x2048"
    }
  ]
}
```

## 字段说明

### 根级字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `description` | 否 | 批量任务描述，用于记录本次生成的目的 |
| `global` | 否 | 全局默认参数，所有 prompts 共享此配置 |
| `prompts` | 是 | 提示词数组，每个元素生成一张图片 |

### global 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `size` | 否 | 全局输出尺寸，例如 `1024x768`、`1536x1024` |

### prompts 数组元素

| 字段 | 必填 | 说明 |
|------|------|------|
| `prompt` | 是 | 图片描述（文生图）或编辑指令（图生图） |
| `filename` | 否 | 输出文件名；不传则自动生成 |
| `size` | 否 | 输出尺寸，覆盖全局配置 |
| `input_images` | 否 | 图生图/多图融合时参考图路径（数组，最多5张） |

## 使用方法

### 1. 创建/获取 JSON 文件

用户可以通过以下方式提供 JSON 文件：
- 用户自行创建并提供文件路径
- 用户描述需求，AI 根据需求生成 JSON 文件

### 2. 读取并解析

AI 读取 JSON 文件后，逐个解析 `prompts` 数组中的每个对象。

### 3. 逐个生成

对每个提示词对象执行生成命令：

```bash
# 单张生成示例
node scripts/generate_image.js -p "{prompt}" -s "{size}" -f "{filename}"
```

**图生图示例：**
```bash
node scripts/generate_image.js -p "{prompt}" -s "{size}" -i "{input_image}" -f "{filename}"
```

**执行策略**：
- 逐个执行，每次生成完成后反馈结果与耗时
- 每张图片生成前提示用户预计等待时间
- 批量任务总时间 = 单张时间 × 图片数量

### 4. 结果反馈

生成完成后汇总反馈：
- 成功数量
- 各图片保存路径
- 累计耗时
- 失败项目及原因（如有）

## 示例场景

### 场景1：生成同一场景的不同风格版本

```json
{
  "description": "生成同一场景的不同风格版本",
  "global": {
    "size": "1536x1024"
  },
  "prompts": [
    {
      "prompt": "A mountain sunrise scene, photorealistic style",
      "filename": "sunrise_realistic.png"
    },
    {
      "prompt": "A mountain sunrise scene, watercolor painting style",
      "filename": "sunrise_watercolor.png"
    },
    {
      "prompt": "A mountain sunrise scene, anime illustration style",
      "filename": "sunrise_anime.png"
    }
  ]
}
```

### 场景2：生成产品多视角图

```json
{
  "description": "产品展示图多角度生成",
  "global": {
    "size": "1024x1024"
  },
  "prompts": [
    {
      "prompt": "White ceramic coffee cup, front 45-degree angle, clean white background",
      "filename": "cup_front.png"
    },
    {
      "prompt": "White ceramic coffee cup, side angle, clean white background",
      "filename": "cup_side.png"
    },
    {
      "prompt": "White ceramic coffee cup, top-down angle, clean white background",
      "filename": "cup_top.png"
    }
  ]
}
```

### 场景3：生成社交媒体配图套装

```json
{
  "description": "小红书配图套装",
  "prompts": [
    {
      "prompt": "美食摄影，精致甜点摆盘，暖色调",
      "filename": "content_01.png",
      "size": "1024x1024"
    },
    {
      "prompt": "生活场景，明亮窗边阅读角",
      "filename": "content_02.png",
      "size": "1024x1536"
    },
    {
      "prompt": "旅行风景，海边日落剪影",
      "filename": "content_03.png",
      "size": "1536x1024"
    }
  ]
}
```

### 场景4：批量图生图（同一指令应用于多张图片）

```json
{
  "description": "将多张图片统一转换为赛博朋克风格",
  "global": {
    "size": "1024x768"
  },
  "prompts": [
    {
      "prompt": "Convert to cyberpunk night style with neon lights while preserving the original composition",
      "filename": "cyber_01.png",
      "input_images": ["photo1.png"]
    },
    {
      "prompt": "Convert to cyberpunk night style with neon lights while preserving the original composition",
      "filename": "cyber_02.png",
      "input_images": ["photo2.png"]
    },
    {
      "prompt": "Convert to cyberpunk night style with neon lights while preserving the original composition",
      "filename": "cyber_03.png",
      "input_images": ["photo3.png"]
    }
  ]
}
```

## 注意事项

1. **优先级**：`prompts` 数组中单个元素的字段会覆盖 `global` 中的全局配置
2. **文件名建议**：使用有意义的文件名，避免重复
3. **预估时间**：每张图约 60-360 秒，批量任务需预留充足时间
4. **图生图支持**：`prompts` 数组元素中可包含 `input_images` 字段进行多图融合
5. **脚本限速**：默认串行执行，避免并发触发限流；如需并行请用户自行控制节奏