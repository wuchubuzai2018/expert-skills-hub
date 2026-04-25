# 批量生成提示词模板

当用户需要一次性生成多张图片时，可使用本文档定义的 JSON 格式配置批量生成任务。

## JSON 文件格式

```json
{
  "description": "批量任务描述（可选）",
  "global": {
    "response_format": "url",
    "size_hint": "横版 16:9"
  },
  "prompts": [
    {
      "prompt": "提示词1描述（包含尺寸）",
      "filename": "output1.png",
      "response_format": "url"
    },
    {
      "prompt": "提示词2描述（包含尺寸）",
      "filename": "output2.png",
      "response_format": "b64_json"
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
| `response_format` | 否 | 全局响应格式：url（默认）/ b64_json |
| `size_hint` | 否 | 全局尺寸提示（会在每个 prompt 前自动追加） |

### prompts 数组元素

| 字段 | 必填 | 说明 |
|------|------|------|
| `prompt` | 是 | 图片描述（文生图）或编辑指令（图生图），建议在开头包含尺寸描述 |
| `filename` | 否 | 输出文件名；不传则自动生成 |
| `response_format` | 否 | 响应格式，覆盖全局配置：url / b64_json |
| `input_images` | 否 | 图生图/多图融合时参考图路径（数组，最多5张） |

## 使用方法

### 1. 创建/获取 JSON 文件

用户可以通过以下方式提供 JSON 文件：
- 用户自行创建并提供文件路径
- 用户描述需求，AI 根据需求生成 JSON 文件

### 2. 读取并解析

AI 读取 JSON 文件后，逐个解析 `prompts` 数组中的每个对象。

### 3. 预处理 prompt

**重要**：gpt-image-2-all 模型需要在 prompt 开头描述尺寸，AI 需要确保每个 prompt 包含尺寸描述。

如果 prompt 中未包含尺寸，且 `global.size_hint` 未设置，应询问用户或自动补充常用尺寸（如"横版 16:9"）。

### 4. 逐个生成

对每个提示词对象执行生成命令：

```bash
node scripts/generate_image.js -p "{prompt}" -f "{filename}" [-r {response_format}]
```

**执行策略**：
- 逐个执行，每次生成完成后反馈结果
- 每张图片生成前提示用户预计等待时间
- 批量任务总时间 = 单张时间(60-300秒) × 图片数量

### 5. 结果反馈

生成完成后汇总反馈：
- 成功数量
- 各图片保存路径
- 失败项目及原因（如有）

## 示例场景

### 场景1：生成系列风格图

```json
{
  "description": "生成同一场景的不同风格版本",
  "global": {
    "response_format": "url",
    "size_hint": "横版 16:9"
  },
  "prompts": [
    {
      "prompt": "横版 16:9 电影画幅，山间日出风景，写实摄影风格",
      "filename": "sunrise_realistic.png"
    },
    {
      "prompt": "横版 16:9 电影画幅，山间日出风景，水彩画风格",
      "filename": "sunrise_watercolor.png"
    },
    {
      "prompt": "横版 16:9 电影画幅，山间日出风景，动漫插画风格",
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
    "response_format": "url"
  },
  "prompts": [
    {
      "prompt": "1:1 方形构图，白色陶瓷咖啡杯，正面45度角拍摄，简洁白色背景",
      "filename": "cup_front.png"
    },
    {
      "prompt": "1:1 方形构图，白色陶瓷咖啡杯，侧面角度拍摄，简洁白色背景",
      "filename": "cup_side.png"
    },
    {
      "prompt": "1:1 方形构图，白色陶瓷咖啡杯，俯视角度拍摄，简洁白色背景",
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
      "prompt": "1:1 方形构图，美食摄影，精致甜点摆盘，暖色调",
      "filename": "content_01.png",
      "response_format": "url"
    },
    {
      "prompt": "竖版 9:16 手机海报，生活场景，明亮窗边阅读角",
      "filename": "content_02.png",
      "response_format": "url"
    },
    {
      "prompt": "横版 16:9 电影画幅，旅行风景，海边日落剪影",
      "filename": "content_03.png",
      "response_format": "url"
    }
  ]
}
```

## 注意事项

1. **尺寸优先级**：单个 prompt 中的尺寸描述优先于 `global.size_hint`
2. **prompt 预处理**：AI 必须在执行前确保每个 prompt 包含尺寸描述（开头）
3. **文件名建议**：使用有意义的文件名，避免重复
4. **预估时间**：每张图约 60-300 秒，批量任务需预留充足时间
5. **图生图支持**：`prompts` 数组元素中可包含 `input_images` 字段进行多图融合