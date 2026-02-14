# 微信红包封面图片尺寸裁剪工具

自动将图片裁剪为微信红包封面开放平台要求的标准尺寸，并智能压缩以满足文件大小限制。

## 功能特性

✅ **自动尺寸裁剪** - 居中裁剪，保持目标比例  
✅ **智能压缩** - 自动调整质量直到满足大小限制  
✅ **多格式支持** - 自动选择最佳格式（PNG/JPEG）  
✅ **透明背景** - 挂件类自动使用PNG透明背景  
✅ **批量处理** - 一键生成所有尺寸  
✅ **安全提示** - 显示微信安全区域规范

## 支持尺寸

| 类型 | 尺寸 | 比例 | 格式 | 大小限制 | 特殊要求 |
|------|------|------|------|----------|----------|
| **封面图** (cover) | 957×1278px | 3:4 | PNG/JPG | **≤500KB** | 上方25%保持简洁 |
| **封面挂件** (hang) | 1053×1746px | 3:5 | PNG | **≤300KB** | 仅顶部324px可编辑，其余透明背景 |
| **气泡挂件** (bubble) | 480×384px | 5:4 | PNG | **≤300KB** | 顶部96px+底部72px可编辑，中间216px透明 |
| **封面故事** (story) | 750×1250px | 3:5 | PNG/JPG | **≤300KB** | 顶部/底部各10%可能被裁切 |

## 安装

```bash
cd scripts
npm install
```

## 使用方法

### 单类型裁剪

```bash
# 生成封面图（自动压缩到≤500KB）
node resize_cover.js <输入图片> cover

# 生成封面挂件（自动压缩到≤300KB，透明背景）
node resize_cover.js <输入图片> hang

# 生成气泡挂件（自动压缩到≤300KB，透明背景）
node resize_cover.js <输入图片> bubble

# 生成封面故事（自动压缩到≤300KB）
node resize_cover.js <输入图片> story
```

### 指定输出路径

```bash
node resize_cover.js <输入图片> <类型> <输出路径>
```

示例:
```bash
node resize_cover.js myimage.png cover ./output/cover.png
node resize_cover.js myimage.png hang ./output/hang.png
```

### 批量生成所有尺寸

```bash
node resize_cover.js <输入图片> all [输出目录]
```

示例:
```bash
# 输出到当前目录
node resize_cover.js myimage.png all

# 输出到指定目录
node resize_cover.js myimage.png all ./output
```

## 智能压缩策略

脚本会自动尝试以下压缩策略，直到满足大小限制：

### 非透明图片（封面图、故事图）
1. **JPEG 质量调整**: 90% → 85% → 80% → ... → 55%
2. **mozjpeg 优化**: 使用优化的JPEG编码器
3. **分辨率降级**: 如果质量调整仍不满足，降低分辨率

### 透明图片（挂件类）
1. **PNG 调色板**: 使用8-bit调色板模式（质量80%）
2. **降低调色板质量**: 60%质量
3. **限制颜色数**: 减少到128色
4. **最大压缩**: effort=10的极致压缩
5. **分辨率降级**: 最后的降级手段

## 挂件类“假背景”清理（可选）

有些AI生成的挂件（封面挂件/气泡挂件）会带黑底/灰底/近似纯色底，看起来像“假透明背景”。脚本支持在裁剪/遮罩完成后，自动把“接近背景色”的像素转为透明：

```bash
# 开启自动抠底（默认 hang/bubble 已开启；这里显式写出来）
node resize_cover.js input.png hang --remove-bg
node resize_cover.js input.png bubble --remove-bg

# 调整容差与羽化（容差越大越容易抠掉背景，但也可能误伤主体）
node resize_cover.js input.png hang --remove-bg --bg-tolerance 26 --bg-feather 10
```

参数说明：
- `--remove-bg` / `--no-remove-bg`: 开/关自动背景清理
- `--bg-tolerance N`: 背景色容差（默认22）
- `--bg-feather N`: 边缘羽化（默认8）

### 输出示例

```
📸 封面图
   原始: 1920×1080px, 2450.50KB
   目标: 957×1278px, ≤500KB
   裁剪: 1438×1080px → 957×1278px
   ✅ 已保存: ./output/myimage_cover.jpg
      大小: 485.32KB / 500KB
      压缩: jpeg, 质量75%
```

## 输出文件

批量处理时会自动生成以下文件:
- `myimage_cover.jpg/png` - 封面图 (957×1278px, ≤500KB)
- `myimage_hang.png` - 封面挂件 (1053×1746px, ≤300KB, 透明)
- `myimage_bubble.png` - 气泡挂件 (480×384px, ≤300KB, 透明)
- `myimage_story.jpg/png` - 封面故事 (750×1250px, ≤300KB)

## 完整示例

```bash
# 1. 安装依赖
cd scripts
npm install

# 2. 批量生成所有尺寸（推荐）
node resize_cover.js ../my_design.png all ../output

# 3. 查看结果
ls -lh ../output/
# -rw-r--r--  1 user  staff   485K  my_design_cover.jpg
# -rw-r--r--  1 user  staff   298K  my_design_hang.png
# -rw-r--r--  1 user  staff   156K  my_design_bubble.png
# -rw-r--r--  1 user  staff   287K  my_design_story.jpg

# 4. 单独生成封面图
node resize_cover.js ../my_design.png cover ../output/cover_final.png
```

## 注意事项

1. **自动压缩**: 无需手动调整，脚本会自动压缩到符合微信规范
2. **格式选择**: 非透明图片默认使用JPEG（压缩率更好），透明图片使用PNG
3. **质量优先**: 脚本会尽量保持高质量，只有在必要时才降低质量
4. **极端情况**: 如果原图过大，脚本可能会降低分辨率以满足限制
5. **安全区域**: 处理完成后会显示微信安全区域提示，帮助设计审核

## 故障排除

### 如果文件仍然超出限制

可能是因为原图过于复杂或尺寸过大。脚本已包含极端降级策略：
- 降低分辨率
- 使用最大压缩级别
- 减少颜色数量（挂件类）

如果仍不满足，建议：
1. 使用更简单的原图设计
2. 减少原图的细节和颜色数量
3. 手动使用专业工具（如Photoshop）先优化原图

### 依赖安装失败

```bash
# 如果npm install sharp失败，可以尝试：
npm install sharp --platform=darwin --arch=arm64  # Mac M系列
npm install sharp --platform=darwin --arch=x64    # Mac Intel
npm install sharp --platform=linux --arch=x64     # Linux
npm install sharp --platform=win32 --arch=x64     # Windows
```
