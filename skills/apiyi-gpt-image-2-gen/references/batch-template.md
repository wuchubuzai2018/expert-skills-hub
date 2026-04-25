# 批量生成提示词模板

当用户需要一次性生成多张图片时，可使用本文档定义的 JSON 格式配置批量生成任务。

## JSON 文件格式

```json
{
  "description": "批量任务描述（可选）",
  "global": {
    "quality": "high",
    "size": "1024x1024",
    "output_format": "png"
  },
  "prompts": [
    {
      "prompt": "提示词1描述",
      "filename": "output1.png",
      "size": "1024x1024",
      "quality": "high",
      "output_format": "png"
    },
    {
      "prompt": "提示词2描述",
      "filename": "output2.png",
      "size": "2048x2048",
      "quality": "high"
    }
  ]
}
```

## 字段说明

### 根级字段

| ���段 | 必填 | 说明 |
|------|------|------|
| `description` | 否 | 批量任务描述，用于记录本次生成的目的 |
| `global` | 否 | 全局默认参数，所有 prompts 共享此配置 |
| `prompts` | 是 | 提示词数组，每个元素生成一张图片 |

### global 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `quality` | 否 | 全局画质档位：low / medium / high / auto |
| `size` | 否 | 全局尺寸 |
| `output_format` | 否 | 全局输出格式：png / jpeg / webp |

### prompts 数组元素

| 字段 | 必填 | 说明 |
|------|------|------|
| `prompt` | 是 | 图片描述（文生图）或编辑指令（图生图） |
| `filename` | 否 | 输出文件名；不传则自动生成 |
| `size` | 否 | 输出尺寸，覆盖全局配置 |
| `quality` | 否 | 画质档位，覆盖全局配置 |
| `output_format` | 否 | 输出格式，覆盖全局配置 |
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
node scripts/generate_image.js -p "{prompt}" -f "{filename}" [-s {size}] [-q {quality}] [-o {output_format}]
```

**执行策略**：
- 逐个执行，每次生成完成后反馈结果
- 每张图片生成前提示用户预计等待时间
- 批量任务总时间 = 单张时间 × 图片数量

### 4. 结果反馈

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
    "quality": "high",
    "size": "2048x1152",
    "output_format": "png"
  },
  "prompts": [
    {
      "prompt": "山间日出风景，写实摄影风格",
      "filename": "sunrise_realistic.png"
    },
    {
      "prompt": "山间日出风景，水彩画风格",
      "filename": "sunrise_watercolor.png"
    },
    {
      "prompt": "山间日出风景，动漫插画风格",
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
    "quality": "high",
    "size": "1024x1024"
  },
  "prompts": [
    {
      "prompt": "白色陶瓷咖啡杯，正面45度角拍摄，简洁白色背景",
      "filename": "cup_front.png"
    },
    {
      "prompt": "白色陶瓷咖啡杯，侧面角度拍摄，简洁白色背景",
      "filename": "cup_side.png"
    },
    {
      "prompt": "白色陶瓷咖啡杯，俯视角度拍摄，简洁白色背景",
      "filename": "cup_top.png"
    }
  ]
}
```

### 场景3：生成社交媒体配图套装

```json
{
  "description": "小红书配图套装",
  "global": {
    "quality": "high"
  },
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
      "size": "2048x1152"
    }
  ]
}
```

## 注意事项

1. **优先级**：`prompts` 数组中单个元素的字段会覆盖 `global` 中的全局配置
2. **文件名建议**：使用有意义的文件名，避免重复
3. **预估时间**：每张图约 120-150 秒，批量任务需预留充足时间
4. **图生图支持**：`prompts` 数组元素中可包含 `input_images` 字段进行多图融合