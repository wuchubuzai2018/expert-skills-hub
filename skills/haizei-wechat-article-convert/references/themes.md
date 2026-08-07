# 微信公众号主题配置

本文档详细说明了 `md_to_wechat.py` 脚本中所有预设主题的样式配置。

## 预设主题列表

### 1. default (默认主题)
简洁大方的默认蓝色主题，适合大多数技术文章和教程。

**色彩方案:**
- 主色调: #1e6bb8 (专业蓝)
- 文本色: #3f3f3f (深灰)
- 背景色: #ffffff (纯白)
- 边框色: #dfe6e9 (浅灰)
- 代码背景: #f6f8fa (极浅灰)

**适用场景:** 技术、教育、通用内容

### 2. orange (活力橙)
活力的橙色主题，适合运动、美食、娱乐类内容。

**色彩方案:**
- 主色调: #e67e22 (活力橙)
- 文本色: #2c3e50 (深蓝灰)
- 背景色: #ffffff
- 边框色: #fad7a0 (淡橙)
- 代码背景: #fef5e7 (极淡橙)

**适用场景:** 运动、美食、娱乐、促销活动

### 3. green-grid (清新绿格子) ⭐ NEW
清新自然的绿色格子主题，提取自优秀微信公众号文章样式。

**特色功能:**
- ✨ 格子背景：使用 CSS 渐变创建的格子图案
- 🎨 清新绿色：主色调 #52c41a
- 📝 优雅字体：Optima-Regular, PingFangTC-light
- 📐 精细间距：段落间距、列表间距精心调整

**色彩方案:**
- 主色调: #52c41a (清新绿)
- 文本色: #333333 (深灰)
- 背景色: #ffffff (纯白 + 格子背景)
- 边框色: #d9f7be (浅绿)
- 代码背景: #f6ffed (淡绿)

**字体设置:**
- 字体族: Optima-Regular, PingFangTC-light
- 正文字号: 15px
- 标题字号: 24px (H2), 20px (H3)
- 字间距: 继承默认

**间距设置:**
- 段落间距: 16px (上下)
- 列表项间距: 8px
- 列表左边距: 1.2em
- 格子背景内边距: 2px 12px

**适用场景:** 生活方式、健康、环保、自然主题、文艺清新

**格子背景样式:**
```css
background-image: linear-gradient(#f0f0f0 1px, transparent 1px),
                   linear-gradient(90deg, #f0f0f0 1px, transparent 1px);
background-size: 20px 20px;
background-position: -1px -1px;
```

### 4. grid + orange (活力橙格子) ⭐ NEW
格子主题的橙色变体，保留序号徽章、旋转动画与格子背景，主色替换为活力橙。

**使用方式:** `--theme grid --grid-color orange`

**色彩方案:**
- 主色调: #e67e22 (活力橙)
- 文本色: #333333 (深灰)
- 背景色: #ffffff (纯白 + 浅橙格子背景 #fdeeda)
- 边框色: #fad7a0 (淡橙)
- 代码背景: #fef5e7 (极淡橙)

**适用场景:** 促销活动、美食探店、运动健身、活泼风格的技术分享

**格子主题三配色一览:**

| 配色 | 主色 | 格子线色 | 适用场景 |
|------|------|---------|---------|
| green (清新绿) | #52c41a | #edf7e6 | 生活方式、健康、环保 |
| blue (大气蓝) | #007AFF | #e6efff | 科技、商务、专业内容 |
| orange (活力橙) | #e67e22 | #fdeeda | 促销、美食、活泼内容 |

### 5. aurora (极光靛紫) ⭐ NEW
前沿科技感的极光紫主题，简洁无徽章，适合有未来感的内容。

**色彩方案:**
- 主色调: #6c5ce7 (极光紫)
- 文本色: #2d3436 (深炭灰)
- 背景色: #ffffff (纯白)
- 边框色: #dfe3fd (淡紫)
- 代码背景: #f4f2ff (极淡紫)

**适用场景:** AI 前沿、产品发布、创新趋势、科技评论

## 自定义主题

如果需要创建自定义主题，可以修改 `scripts/md_to_wechat.py` 中的 `THEMES` 字典，添加新的主题配置：

```python
THEMES = {
    "custom": {
        "name": "自定义主题",
        "description": "主题描述",
        "colors": {
            "primary": "#your-color",
            "text": "#your-color",
            "bg": "#your-color",
            "border": "#your-color",
            "code_bg": "#your-color"
        },
        "font_size": {
            "title": "22px",
            "h1": "28px",
            "h2": "24px",
            "h3": "20px",
            "body": "16px",
            "code": "14px"
        },
        "grid_background": True,  # 可选：启用格子背景
        "font_family": "Your Font Family"  # 可选：自定义字体
    }
}
```

## 主题选择建议

| 内容类型 | 推荐主题 | 理由 |
|---------|---------|------|
| 技术教程 | default | 专业、清晰 |
| 运动美食 | orange | 活力、吸引 |
| 生活方式 | grid (green) | 清新、格子背景、优雅 |
| 促销活动 | grid (orange) | 活力橙 + 序号徽章，醒目有节奏 |
| AI 前沿/产品发布 | aurora | 极光紫科技感，未来感强 |
