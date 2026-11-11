---
name: atlas-image-gen
description: 使用 Atlas Cloud 的异步图片接口执行文生图。当用户需要通过 Atlas Cloud 生成图片、海报、封面、商品图或视觉素材，并希望控制尺寸、质量和输出格式时使用此技能。
---

# Atlas Cloud 图片生成

该技能通过 Atlas Cloud 图片生成接口执行文生图。脚本只提交一次生成请求，随后使用有界 GET 轮询等待结果，避免重复创建计费任务。

## 使用前准备

1. 设置 API Key：

   ```bash
   export ATLASCLOUD_API_KEY="your-api-key"
   ```

2. 默认模型为 `openai/gpt-image-2/text-to-image`。如需使用其他模型，先从 Atlas Cloud 模型目录确认准确的模型 ID 和输入参数。

## 生成图片

```bash
python skills/atlas-image-gen/scripts/generate_image.py \
  --prompt "一只红色立方体置于白色摄影棚背景中" \
  --output red-cube.png \
  --size 1024x1024 \
  --quality medium
```

常用参数：

| 参数 | 说明 | 默认值 |
|---|---|---|
| `--prompt` | 图片描述，必填 | - |
| `--output` | 输出文件路径 | 自动生成 PNG 文件名 |
| `--model` | Atlas Cloud 模型 ID | `openai/gpt-image-2/text-to-image` |
| `--size` | 输出尺寸 | `1024x1024` |
| `--quality` | `low`、`medium` 或 `high` | `medium` |
| `--output-format` | `png` 或 `jpeg` | `png` |
| `--moderation` | 传给模型的 moderation 参数 | `low` |
| `--timeout` | 提交、轮询和下载的总超时秒数 | `300` |

也可通过 `ATLASCLOUD_API_BASE` 覆盖 API 地址；默认使用 `https://api.atlascloud.ai`。

## 执行约束

- 当前脚本仅支持文生图，不上传本地参考图片。
- `POST /api/v1/model/generateImage` 在每次命令执行中最多调用一次，失败后不会自动重试。
- 只有 `GET /api/v1/model/prediction/{id}` 使用有界退避轮询。
- 输出图片只下载一次；超时或失败时以非零状态退出。
- API Key 只从环境变量读取，不写入文件或命令行参数。

## 验证

```bash
python -m unittest discover -s skills/atlas-image-gen/tests -v
python -m py_compile skills/atlas-image-gen/scripts/generate_image.py
```
