#!/usr/bin/env node

/**
 * 图片尺寸调整和压缩工具
 * 
 * 功能：
 * - 按指定像素宽高调整图片尺寸
 * - 按比例缩放图片
 * - 智能压缩图片到指定大小
 * - 批量处理多张图片
 * 
 * 使用方法:
 *   node resize_image.js <输入图片> [选项]
 * 
 * 选项:
 *   -w, --width <像素>       目标宽度（像素）
 *   -h, --height <像素>      目标高度（像素）
 *   -s, --scale <比例>       缩放比例（如 0.5, 2）
 *   -m, --max-width <像素>  最大宽度（保持比例）
 *   -m, --max-height <像素> 最大高度（保持比例）
 *   -q, --quality <质量>     JPEG质量 1-100（默认 80）
 *   -S, --size <KB>         目标文件大小（KB），自动压缩
 *   -f, --format <格式>      输出格式：png|jpg|webp|original（默认 original）
 *   -o, --output <路径>      输出路径
 *   -a, --aspect-ratio <比例> 目标宽高比（如 16:9, 4:3）
 *   --fit <模式>             适应模式：cover|contain|fill|inside|outside（默认 cover）
 *   --help                   显示帮助
 * 
 * 示例:
 *   # 按指定尺寸调整
 *   node resize_image.js input.png -w 800 -h 600
 *   
 *   # 按比例缩放
 *   node resize_image.js input.png -s 0.5
 *   
 *   # 压缩到指定大小
 *   node resize_image.js input.png -S 500 -o output.jpg
 *   
 *   # 指定宽高比裁剪
 *   node resize_image.js input.png -a 16:9 -o output.png
 *   
 *   # 最大尺寸限制（保持比例）
 *   node resize_image.js input.png --max-width 1920 --max-height 1080
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

function showHelp() {
  console.log(`
图片尺寸调整和压缩工具

使用方法:
  node resize_image.js <输入图片> [选项]

选项:
  -w, --width <像素>         目标宽度（像素）
  -h, --height <像素>        目标高度（像素）
  -s, --scale <比例>         缩放比例（如 0.5, 2）
  -m, --max-width <像素>     最大宽度（保持比例）
  -m, --max-height <像素>    最大高度（保持比例）
  -q, --quality <质量>       JPEG质量 1-100（默认 80）
  -S, --size <KB>           目标文件大小（KB），自动压缩
  -f, --format <格式>        输出格式：png|jpg|webp|original（默认 original）
  -o, --output <路径>        输出路径
  -a, --aspect-ratio <比例> 目标宽高比（如 16:9, 4:3）
  --fit <模式>               适应模式：cover|contain|fill|inside|outside（默认 cover）
  --help                     显示帮助

适应模式说明:
  cover     - 填充整个区域（可能裁剪）
  contain   - 完整放入区域内（可能留白）
  fill      - 拉伸填充
  inside    - 完整放入（缩小）
  outside   - 完全覆盖（放大）

示例:
  # 按指定尺寸调整
  node resize_image.js input.png -w 800 -h 600 -o output.png
  
  # 按比例缩放
  node resize_image.js input.png -s 0.5 -o output.png
  
  # 压缩到指定大小（如 500KB）
  node resize_image.js input.png -S 500 -o output.jpg
  
  # 指定宽高比裁剪（16:9）
  node resize_image.js input.png -a 16:9 -o output.png
  
  # 最大尺寸限制（保持比例）
  node resize_image.js input.png --max-width 1920 --max-height 1080 -o output.png
  
  # 转换为 WebP 格式并压缩
  node resize_image.js input.png -f webp -q 80 -o output.webp
  
  # 批量处理（通配符）
  node resize_image.js "*.png" -w 800 -h 600 -o ./output/
`);
}

function parseArgs(argv) {
  const args = {
    input: null,
    width: null,
    height: null,
    scale: null,
    maxWidth: null,
    maxHeight: null,
    quality: 80,
    targetSize: null,
    format: 'original',
    output: null,
    aspectRatio: null,
    fit: 'cover'
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case '-w':
      case '--width':
        args.width = parseInt(next, 10);
        i++;
        break;
      case '-h':
      case '--height':
        args.height = parseInt(next, 10);
        i++;
        break;
      case '-s':
      case '--scale':
        args.scale = parseFloat(next);
        i++;
        break;
      case '--max-width':
        args.maxWidth = parseInt(next, 10);
        i++;
        break;
      case '--max-height':
        args.maxHeight = parseInt(next, 10);
        i++;
        break;
      case '-q':
      case '--quality':
        args.quality = parseInt(next, 10);
        i++;
        break;
      case '-S':
      case '--size':
        args.targetSize = parseInt(next, 10);
        i++;
        break;
      case '-f':
      case '--format':
        args.format = next;
        i++;
        break;
      case '-o':
      case '--output':
        args.output = next;
        i++;
        break;
      case '-a':
      case '--aspect-ratio':
        args.aspectRatio = next;
        i++;
        break;
      case '--fit':
        args.fit = next;
        i++;
        break;
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;
      default:
        if (!arg.startsWith('-')) {
          args.input = arg;
        }
    }
  }

  return args;
}

async function getImageInfo(inputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: fs.statSync(inputPath).size
    };
  } catch (error) {
    throw new Error(`无法读取图片: ${error.message}`);
  }
}

function parseAspectRatio(ratio) {
  const parts = ratio.split(':');
  if (parts.length === 2) {
    return {
      width: parseInt(parts[0], 10),
      height: parseInt(parts[1], 10)
    };
  }
  return null;
}

function calculateDimensions(imgWidth, imgHeight, args) {
  let targetWidth = args.width;
  let targetHeight = args.height;

  // 按比例缩放
  if (args.scale) {
    targetWidth = Math.round(imgWidth * args.scale);
    targetHeight = Math.round(imgHeight * args.scale);
  }

  // 最大尺寸限制
  if (args.maxWidth || args.maxHeight) {
    let maxW = args.maxWidth || Infinity;
    let maxH = args.maxHeight || Infinity;
    
    const scaleW = maxW / imgWidth;
    const scaleH = maxH / imgHeight;
    const scale = Math.min(scaleW, scaleH);
    
    if (scale < 1) {
      targetWidth = Math.round(imgWidth * scale);
      targetHeight = Math.round(imgHeight * scale);
    }
  }

  // 宽高比处理
  if (args.aspectRatio) {
    const ratio = parseAspectRatio(args.aspectRatio);
    if (ratio) {
      const targetRatio = ratio.width / ratio.height;
      
      if (!targetWidth && targetHeight) {
        targetWidth = Math.round(targetHeight * targetRatio);
      } else if (targetWidth && !targetHeight) {
        targetHeight = Math.round(targetWidth / targetRatio);
      } else if (!targetWidth && !targetHeight) {
        // 根据原图尺寸和目标比例计算
        const currentRatio = imgWidth / imgHeight;
        if (currentRatio > targetRatio) {
          targetHeight = imgHeight;
          targetWidth = Math.round(imgHeight * targetRatio);
        } else {
          targetWidth = imgWidth;
          targetHeight = Math.round(imgWidth / targetRatio);
        }
      }
    }
  }

  return {
    width: targetWidth || imgWidth,
    height: targetHeight || imgHeight
  };
}

async function compressToSize(buffer, targetSizeKB, format, originalFormat) {
  const targetBytes = targetSizeKB * 1024;
  
  if (buffer.length <= targetBytes) {
    return { buffer, quality: null };
  }

    console.log(`   原始大小: ${(buffer.length / 1024).toFixed(2)}KB，需要压缩...`);
  
  const finalFormat = format === 'original' ? originalFormat : format;
  
  // JPEG 压缩
  if (finalFormat === 'jpeg' || finalFormat === 'jpg') {
    const qualities = [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40];
    
    for (const quality of qualities) {
      const compressed = await sharp(buffer)
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toBuffer();
      
      if (compressed.length <= targetBytes) {
        return { buffer: compressed, quality };
      }
    }
  }
  
  // WebP 压缩
  if (finalFormat === 'webp') {
    const qualities = [90, 85, 80, 75, 70, 65, 60, 55, 50];
    
    for (const quality of qualities) {
      const compressed = await sharp(buffer)
        .webp({ quality })
        .toBuffer();
      
      if (compressed.length <= targetBytes) {
        return { buffer: compressed, quality };
      }
    }
  }
  
  // PNG 压缩
  if (finalFormat === 'png') {
    // 尝试调色板 PNG
    const paletteOptions = [
      { palette: true, quality: 80, compressionLevel: 9 },
      { palette: true, quality: 60, compressionLevel: 9 },
      { palette: true, quality: 40, compressionLevel: 9 },
    ];
    
    for (const opts of paletteOptions) {
      const compressed = await sharp(buffer)
        .png(opts)
        .toBuffer();
      
      if (compressed.length <= targetBytes) {
        return { buffer: compressed, quality: opts.quality };
      }
    }
    
    // 限制颜色数量
    const colorsOptions = [
      { palette: true, colours: 256, effort: 10 },
      { palette: true, colours: 128, effort: 10 },
      { palette: true, colours: 64, effort: 10 },
      { palette: true, colours: 32, effort: 10 },
    ];
    
    for (const opts of colorsOptions) {
      const compressed = await sharp(buffer)
        .png(opts)
        .toBuffer();
      
      if (compressed.length <= targetBytes) {
        return { buffer: compressed, quality: opts.colours };
      }
    }
  }
  
  // 最后尝试：降低分辨率
  const img = sharp(buffer);
  const metadata = await img.metadata();
  const scale = Math.sqrt(targetBytes / buffer.length) * 0.9;
  
  const newWidth = Math.floor(metadata.width * scale);
  const newHeight = Math.floor(metadata.height * scale);
  
  const resized = await sharp(buffer)
    .resize(newWidth, newHeight, { fit: 'inside' })
    .toBuffer();
  
  return { 
    buffer: resized, 
    quality: null,
    note: ` resized to ${newWidth}x${newHeight}`
  };
}

async function processImage(inputPath, args) {
  const imgInfo = await getImageInfo(inputPath);
  const { width, height } = calculateDimensions(imgInfo.width, imgInfo.height, args);
  
  const outputFormat = args.format === 'original' ? imgInfo.format : args.format;
  
  console.log(`\n📸 处理图片: ${path.basename(inputPath)}`);
  console.log(`   原始: ${imgInfo.width}×${imgInfo.height}px, ${(imgInfo.size / 1024).toFixed(2)}KB`);
  console.log(`   目标: ${width}×${height}px, 格式: ${outputFormat}`);
  
  // 处理透明通道
  let pipeline = sharp(inputPath);
  
  // 调整尺寸
  if (args.width || args.height || args.scale || args.aspectRatio || args.maxWidth || args.maxHeight) {
    pipeline = pipeline.resize(width, height, { fit: args.fit });
  }
  
  // 转换为目标格式
  if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
    pipeline = pipeline.jpeg({ quality: args.quality, progressive: true, mozjpeg: true });
  } else if (outputFormat === 'png') {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else if (outputFormat === 'webp') {
    pipeline = pipeline.webp({ quality: args.quality });
  }
  
  let buffer = await pipeline.toBuffer();
  
  // 压缩到目标大小
  if (args.targetSize) {
    const { buffer: compressed, quality, note } = await compressToSize(
      buffer, 
      args.targetSize, 
      outputFormat,
      imgInfo.format
    );
    buffer = compressed;
    
    if (quality) {
      console.log(`   压缩: ${outputFormat}, 质量 ${quality}%`);
    }
    if (note) {
      console.log(`   降级: ${note}`);
    }
  }
  
  // 确定输出路径
  let outputPath = args.output;
  if (!outputPath) {
    const dir = path.dirname(inputPath) || '.';
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const baseName = path.basename(inputPath, path.extname(inputPath));
    outputPath = path.join(dir, `${baseName}_resized.${ext}`);
  }
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 保存文件
  fs.writeFileSync(outputPath, buffer);
  
  const finalSizeKB = buffer.length / 1024;
  const status = !args.targetSize || finalSizeKB <= args.targetSize ? '✅' : '⚠️';
  
  console.log(`   ${status} 已保存: ${outputPath}`);
  console.log(`      大小: ${finalSizeKB.toFixed(2)}KB`);
  
  if (args.targetSize && finalSizeKB > args.targetSize) {
    console.warn(`      ⚠️ 警告: 仍超出目标大小 ${args.targetSize}KB`);
  }
  
  return outputPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  
  if (!args.input) {
    showHelp();
    process.exit(1);
  }
  
  // 检查 sharp
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ 错误: 缺少依赖 "sharp"');
    console.error('   请先安装: npm install sharp');
    process.exit(1);
  }
  
  const sharp = require('sharp');
  
  // 检查输入文件
  if (!fs.existsSync(args.input)) {
    console.error(`❌ 错误: 找不到文件 "${args.input}"`);
    process.exit(1);
  }
  
  await processImage(args.input, args);
}

main().catch(error => {
  console.error(`\n❌ 处理失败: ${error.message}`);
  process.exit(1);
});
