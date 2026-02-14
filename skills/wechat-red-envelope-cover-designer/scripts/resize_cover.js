#!/usr/bin/env node

/**
 * 微信红包封面图片尺寸裁剪工具
 * 
 * 支持微信红包封面开放平台的所有尺寸规范：
 * - 封面图: 957×1278px (3:4) ≤500KB
 * - 封面挂件: 1053×1746px (3:5) ≤300KB
 * - 气泡挂件: 480×384px (5:4) ≤300KB
 * - 封面故事: 750×1250px (3:5) ≤300KB
 * 
 * 自动压缩功能：如果文件超出限制，会自动降低质量直到符合要求
 * 
 * 使用方法:
 *   node resize_cover.js <输入图片路径> <类型> [输出路径]
 *   node resize_cover.js <输入图片路径> all [输出目录]
 * 
 * 示例:
 *   node resize_cover.js myimage.png cover
 *   node resize_cover.js myimage.png all ./output
 */

let sharp;
const path = require('path');
const fs = require('fs');

// 微信红包封面尺寸规范
const DIMENSIONS = {
  cover: {
    name: '封面图',
    width: 957,
    height: 1278,
    ratio: '3:4',
    sizeLimit: 500, // KB
    safeZone: {
      top: 0.25,
      middle: 0.50,
      bottom: 0.15
    }
  },
  hang: {
    name: '封面挂件',
    width: 1053,
    height: 1746,
    ratio: '3:5',
    sizeLimit: 300, // KB
    transparent: true,
    // 微信红包封面挂件：仅顶部可编辑区域允许出现内容，其余区域应完全透明
    // 这里按“顶部 324px 可编辑”约束（来自平台编辑器示意图/规范）
    editableHeightPx: 324,
    editableRegions: [{ top: 0, height: 324 }],
    safeZone: {
      top: 324 / 1746,
      bottom: 1 - 324 / 1746,
    }
  },
  bubble: {
    name: '气泡挂件',
    width: 480,
    height: 384,
    ratio: '5:4',
    sizeLimit: 300, // KB
    transparent: true,
    // 气泡挂件（480×384）：可编辑区域为上下两段，中间为不可编辑区域
    // 按平台编辑器示意图：顶部96px可编辑，中间216px不可编辑（必须透明），底部72px可编辑
    editableRegions: [
      { top: 0, height: 96 },
      { top: 384 - 72, height: 72 },
    ],
  },
  story: {
    name: '封面故事',
    width: 750,
    height: 1250,
    ratio: '3:5',
    sizeLimit: 300, // KB
    safeZone: {
      top: 0.10,
      middle: 0.80,
      bottom: 0.10
    }
  }
};

function showHelp() {
  console.log(`
微信红包封面图片尺寸裁剪工具 (带自动压缩)

使用方法:
  node resize_cover.js <输入图片路径> <类型> [输出路径]
  node resize_cover.js <输入图片路径> <类型> [输出路径] [--remove-bg|--no-remove-bg] [--bg-tolerance N] [--bg-feather N]

参数说明:
  输入图片路径 - 原始图片路径
  类型         - cover|hang|bubble|story|all
  输出路径     - 可选，默认为输入文件名_类型.png

尺寸与大小限制:
  cover  - 封面图: 957×1278px, ≤500KB
  hang   - 封面挂件: 1053×1746px, ≤300KB, PNG透明
  bubble - 气泡挂件: 480×384px, ≤300KB, PNG透明
  story  - 封面故事: 750×1250px, ≤300KB

可选参数（挂件类“假背景/黑底/灰底”清理）：
  --remove-bg           尝试自动将“近似纯色背景”转为透明（默认：hang/bubble 开启）
  --no-remove-bg        关闭自动背景清理
  --bg-tolerance N      背景色容差（默认：22；越大越容易抠掉背景，也越可能误伤主体）
  --bg-feather N        边缘羽化像素（默认：8；用于减少边缘硬切/黑边）

特性:
  ✓ 自动居中裁剪，保持目标比例
  ✓ 智能压缩，自动调整质量满足大小限制
  ✓ 挂件类自动使用PNG透明背景
  ✓ 显示安全区域提示

示例:
  node resize_cover.js myimage.png cover
  node resize_cover.js myimage.png all ./output
  node resize_cover.js pendant.png hang --remove-bg --bg-tolerance 26
  node resize_cover.js bubble.png bubble --remove-bg --bg-tolerance 24 --bg-feather 10
`);
}

function parseArgsWithFlags(argv) {
  const flags = {
    removeBg: undefined,
    bgTolerance: 22,
    bgFeather: 8,
  };

  const positionals = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '--remove-bg') {
      flags.removeBg = true;
      continue;
    }
    if (a === '--no-remove-bg') {
      flags.removeBg = false;
      continue;
    }
    if (a === '--bg-tolerance') {
      const v = argv[i + 1];
      if (!v || v.startsWith('-')) {
        console.error('❌ 错误: --bg-tolerance 需要一个数字');
        process.exit(1);
      }
      flags.bgTolerance = Math.max(0, Math.min(255, Number(v)));
      i++;
      continue;
    }
    if (a === '--bg-feather') {
      const v = argv[i + 1];
      if (!v || v.startsWith('-')) {
        console.error('❌ 错误: --bg-feather 需要一个数字');
        process.exit(1);
      }
      flags.bgFeather = Math.max(0, Math.min(64, Number(v)));
      i++;
      continue;
    }

    positionals.push(a);
  }

  return { positionals, flags };
}

function rgbDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function clamp01(x) {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function collectBorderSamplePoints(width, regionTop, regionHeight, step) {
  const points = [];
  const yTop = regionTop;
  const yBottom = regionTop + regionHeight - 1;

  for (let x = 0; x < width; x += step) {
    points.push([x, yTop]);
    points.push([x, yBottom]);
  }

  const xLeft = 0;
  const xRight = width - 1;
  for (let y = yTop; y <= yBottom; y += step) {
    points.push([xLeft, y]);
    points.push([xRight, y]);
  }

  return points;
}

function estimateUniformBackgroundColor(raw, width, height, regionTop, regionHeight) {
  const step = Math.max(4, Math.floor(width / 30));
  const points = collectBorderSamplePoints(width, regionTop, regionHeight, step);

  const samples = [];
  for (const [x, y] of points) {
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    const idx = (y * width + x) * 4;
    const a = raw[idx + 3];
    if (a < 200) continue; // 跳过透明/半透明边缘
    samples.push([raw[idx], raw[idx + 1], raw[idx + 2]]);
  }

  if (samples.length < 20) return null;

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  for (const [r, g, b] of samples) {
    rSum += r;
    gSum += g;
    bSum += b;
  }

  const rMean = Math.round(rSum / samples.length);
  const gMean = Math.round(gSum / samples.length);
  const bMean = Math.round(bSum / samples.length);

  let maxDist = 0;
  for (const [r, g, b] of samples) {
    const d = rgbDistance(r, g, b, rMean, gMean, bMean);
    if (d > maxDist) maxDist = d;
  }

  // 如果边缘采样颜色变化很大，说明背景不单一，跳过自动抠底，避免误伤
  if (maxDist > 35) return null;

  return { r: rMean, g: gMean, b: bMean };
}

function removeMatteInRegion(raw, width, height, regionTop, regionHeight, bg, tolerance, feather) {
  const tol = Math.max(0, tolerance);
  const fea = Math.max(0, feather);

  const yStart = Math.max(0, regionTop);
  const yEnd = Math.min(height, regionTop + regionHeight);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = raw[idx + 3];
      if (a === 0) continue;

      const r = raw[idx];
      const g = raw[idx + 1];
      const b = raw[idx + 2];
      const d = rgbDistance(r, g, b, bg.r, bg.g, bg.b);

      if (d <= tol) {
        raw[idx + 3] = 0;
        continue;
      }

      if (fea > 0 && d < tol + fea) {
        const t = clamp01((d - tol) / fea);
        raw[idx + 3] = Math.round(a * t);
      }
    }
  }
}

async function tryAutoRemoveMatteBackground(buffer, config, options) {
  const width = config.width;
  const height = config.height;
  const editableRegions = config.editableRegions || (config.editableHeightPx ? [{ top: 0, height: config.editableHeightPx }] : []);
  if (!Array.isArray(editableRegions) || editableRegions.length === 0) return buffer;

  const { data } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const raw = Buffer.from(data);

  const tolerance = options.bgTolerance;
  const feather = options.bgFeather;

  for (const region of editableRegions) {
    const regionTop = Math.max(0, Math.min(region.top, height - 1));
    const regionHeight = Math.max(0, Math.min(region.height, height - regionTop));
    if (!regionHeight) continue;

    const bg = estimateUniformBackgroundColor(raw, width, height, regionTop, regionHeight);
    if (!bg) continue;

    removeMatteInRegion(raw, width, height, regionTop, regionHeight, bg, tolerance, feather);
  }

  return sharp(raw, { raw: { width, height, channels: 4 } }).png().toBuffer();
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

function calculateCropDimensions(imgWidth, imgHeight, targetWidth, targetHeight) {
  const targetRatio = targetWidth / targetHeight;
  const currentRatio = imgWidth / imgHeight;
  
  let cropWidth, cropHeight, left, top;
  
  if (currentRatio > targetRatio) {
    cropHeight = imgHeight;
    cropWidth = Math.round(imgHeight * targetRatio);
    left = Math.round((imgWidth - cropWidth) / 2);
    top = 0;
  } else {
    cropWidth = imgWidth;
    cropHeight = Math.round(imgWidth / targetRatio);
    left = 0;
    top = Math.round((imgHeight - cropHeight) / 2);
  }
  
  return { cropWidth, cropHeight, left, top };
}

// 智能压缩函数：尝试不同质量设置直到满足大小限制
async function compressToLimit(buffer, type, sizeLimitKB, isTransparent) {
  const sizeLimitBytes = sizeLimitKB * 1024;
  
  // 如果已经符合要求，直接返回
  if (buffer.length <= sizeLimitBytes) {
    return { buffer, quality: null, format: 'original' };
  }
  
  console.log(`   原始大小: ${(buffer.length / 1024).toFixed(2)}KB，需要压缩...`);
  
  // 对于非透明图片，使用JPEG压缩（压缩率更好）
  if (!isTransparent && type !== 'hang' && type !== 'bubble') {
    // 尝试JPEG不同质量
    const qualities = [90, 85, 80, 75, 70, 65, 60];
    
    for (const quality of qualities) {
      const jpegBuffer = await sharp(buffer)
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toBuffer();
      
      if (jpegBuffer.length <= sizeLimitBytes) {
        return { buffer: jpegBuffer, quality, format: 'jpeg' };
      }
    }
    
    // 如果JPEG还是太大，尝试更低质量
    const lowQualityBuffer = await sharp(buffer)
      .jpeg({ quality: 55, progressive: true, mozjpeg: true })
      .toBuffer();
    
    if (lowQualityBuffer.length <= sizeLimitBytes) {
      return { buffer: lowQualityBuffer, quality: 55, format: 'jpeg' };
    }
  }
  
  // 对于透明图片（挂件），使用PNG优化
  if (isTransparent) {
    // 尝试使用8-bit调色板PNG
    const paletteBuffer = await sharp(buffer)
      .png({ 
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 80
      })
      .toBuffer();
    
    if (paletteBuffer.length <= sizeLimitBytes) {
      return { buffer: paletteBuffer, quality: 80, format: 'png-palette' };
    }
    
    // 尝试更低质量的调色板
    const lowPaletteBuffer = await sharp(buffer)
      .png({ 
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true,
        quality: 60,
        effort: 10
      })
      .toBuffer();
    
    if (lowPaletteBuffer.length <= sizeLimitBytes) {
      return { buffer: lowPaletteBuffer, quality: 60, format: 'png-palette' };
    }
    
    // 尝试颜色数量限制
    const colorsBuffer = await sharp(buffer)
      .png({ 
        compressionLevel: 9,
        palette: true,
        colours: 128,
        effort: 10
      })
      .toBuffer();
    
    if (colorsBuffer.length <= sizeLimitBytes) {
      return { buffer: colorsBuffer, quality: null, format: 'png-128colors' };
    }
  }
  
  // 通用降级策略：降低分辨率
  const img = sharp(buffer);
  const metadata = await img.metadata();
  const scale = Math.sqrt(sizeLimitBytes / buffer.length) * 0.95; // 留一些余量
  
  const newWidth = Math.floor(metadata.width * scale);
  const newHeight = Math.floor(metadata.height * scale);
  
  const resizedBuffer = await img
    .resize(newWidth, newHeight, { 
      fit: 'inside',
      withoutEnlargement: false
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  
  return { 
    buffer: resizedBuffer, 
    quality: null, 
    format: `resized-${newWidth}x${newHeight}` 
  };
}

async function processImage(inputPath, type, outputPath, options) {
  const config = DIMENSIONS[type];
  const imgInfo = await getImageInfo(inputPath);
  
  console.log(`\n📸 ${config.name}`);
  console.log(`   原始: ${imgInfo.width}×${imgInfo.height}px, ${(imgInfo.size / 1024).toFixed(2)}KB`);
  console.log(`   目标: ${config.width}×${config.height}px, ≤${config.sizeLimit}KB`);
  
  // 计算裁剪参数
  const { cropWidth, cropHeight, left, top } = calculateCropDimensions(
    imgInfo.width,
    imgInfo.height,
    config.width,
    config.height
  );
  
  // 裁剪和调整尺寸
  let processedBuffer = await sharp(inputPath)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .resize(config.width, config.height, { fit: 'fill' })
    .toBuffer();
  
  console.log(`   裁剪: ${cropWidth}×${cropHeight}px → ${config.width}×${config.height}px`);
  
  // 挂件类需要透明背景：统一强制输出PNG+alpha，避免输入是JPG时丢失透明信息
  if (config.transparent) {
    processedBuffer = await sharp(processedBuffer).ensureAlpha().png().toBuffer();
  }

  // 强制限制可编辑区域：仅允许指定区域内出现任何不透明像素。
  // 这样即便生成图“画满了整张”，最终交付也会自动裁掉不可编辑区域的内容。
  if (config.transparent && Array.isArray(config.editableRegions) && config.editableRegions.length > 0) {
    const composites = [];

    for (const region of config.editableRegions) {
      const regionTop = Math.max(0, Math.min(region.top, config.height - 1));
      const regionHeight = Math.max(0, Math.min(region.height, config.height - regionTop));
      if (!regionHeight) continue;

      const extracted = await sharp(processedBuffer)
        .extract({ left: 0, top: regionTop, width: config.width, height: regionHeight })
        .toBuffer();

      composites.push({ input: extracted, left: 0, top: regionTop });
    }

    processedBuffer = await sharp({
      create: {
        width: config.width,
        height: config.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .png()
      .toBuffer();
  } else if (config.transparent && config.editableHeightPx) {
    // 兼容旧配置：仅顶部可编辑
    const editableHeight = Math.min(config.editableHeightPx, config.height);

    const topRegion = await sharp(processedBuffer)
      .extract({ left: 0, top: 0, width: config.width, height: editableHeight })
      .toBuffer();

    processedBuffer = await sharp({
      create: {
        width: config.width,
        height: config.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([{ input: topRegion, left: 0, top: 0 }])
      .png()
      .toBuffer();
  }

  // 自动清理“假背景/纯色底”（仅挂件类）：
  // - 通过边缘采样推断背景色
  // - 将与背景色接近的像素转为透明（带轻微羽化）
  if (config.transparent) {
    const defaultRemove = type === 'hang' || type === 'bubble';
    const removeBg = options?.removeBg ?? defaultRemove;
    if (removeBg) {
      processedBuffer = await tryAutoRemoveMatteBackground(processedBuffer, config, {
        bgTolerance: options?.bgTolerance ?? 22,
        bgFeather: options?.bgFeather ?? 8,
      });
    }
  }
  
  // 压缩到符合大小限制
  const { buffer: finalBuffer, quality, format } = await compressToLimit(
    processedBuffer,
    type,
    config.sizeLimit,
    config.transparent
  );
  
  // 确定输出格式
  let finalOutputPath = outputPath;
  if (format === 'jpeg' && !outputPath.toLowerCase().endsWith('.jpg')) {
    finalOutputPath = outputPath.replace(/\.png$/i, '.jpg');
  }
  
  // 确保输出目录存在
  const outputDir = path.dirname(finalOutputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 保存文件
  fs.writeFileSync(finalOutputPath, finalBuffer);
  
  const finalSizeKB = finalBuffer.length / 1024;
  const status = finalSizeKB <= config.sizeLimit ? '✅' : '⚠️';
  
  console.log(`   ${status} 已保存: ${finalOutputPath}`);
  console.log(`      大小: ${finalSizeKB.toFixed(2)}KB / ${config.sizeLimit}KB`);
  
  if (quality) {
    console.log(`      压缩: ${format}, 质量${quality}%`);
  } else if (format !== 'original') {
    console.log(`      压缩: ${format}`);
  }
  
  if (finalSizeKB > config.sizeLimit) {
    console.warn(`      ⚠️ 警告: 仍超出限制，建议手动检查或优化原图`);
  }
  
  return finalOutputPath;
}

async function batchResize(inputPath, outputDir) {
  console.log(`\n🚀 批量处理 - 生成所有尺寸\n`);
  
  if (!outputDir) {
    outputDir = path.dirname(inputPath) || '.';
  }
  
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const results = [];
  
  for (const [type, config] of Object.entries(DIMENSIONS)) {
    const outputPath = path.join(outputDir, `${baseName}_${type}.png`);
    try {
      await processImage(inputPath, type, outputPath);
      results.push({ type, status: 'success', path: outputPath });
    } catch (error) {
      results.push({ type, status: 'error', error: error.message });
      console.error(`   ❌ 失败: ${error.message}`);
    }
  }
  
  // 打印汇总
  console.log(`\n📊 处理完成`);
  console.log('='.repeat(60));
  results.forEach(result => {
    const config = DIMENSIONS[result.type];
    if (result.status === 'success') {
      const stats = fs.statSync(result.path);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const statusIcon = stats.size <= config.sizeLimit * 1024 ? '✅' : '⚠️';
      console.log(`${statusIcon} ${config.name}: ${sizeKB}KB / ${config.sizeLimit}KB`);
      console.log(`   ${result.path}`);
    } else {
      console.log(`❌ ${config.name}: ${result.error}`);
    }
  });
  console.log('='.repeat(60));
  
  return results;
}

async function main() {
  const parsed = parseArgsWithFlags(process.argv.slice(2));
  const args = parsed.positionals;
  const flags = parsed.flags;
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }
  
  // 检查sharp是否安装
  try {
    require.resolve('sharp');
    sharp = require('sharp');
  } catch (e) {
    console.error('❌ 错误: 缺少依赖 "sharp"');
    console.error('   请先安装: npm install sharp');
    process.exit(1);
  }
  
  const inputPath = args[0];
  
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 错误: 找不到文件 "${inputPath}"`);
    process.exit(1);
  }
  
  // 批量处理
  if (args[1] === 'all' || args[1] === '--all') {
    await batchResize(inputPath, args[2]);
    return;
  }
  
  if (args.length < 2) {
    console.error('❌ 错误: 缺少类型参数');
    console.error('   使用: node resize_cover.js <图片> <类型> [输出]');
    process.exit(1);
  }
  
  const type = args[1];
  
  if (!DIMENSIONS[type]) {
    console.error(`❌ 错误: 不支持的类型 "${type}"`);
    console.error('   支持: cover, hang, bubble, story');
    process.exit(1);
  }
  
  let outputPath = args[2];
  if (!outputPath) {
    const dir = path.dirname(inputPath) || '.';
    const baseName = path.basename(inputPath, path.extname(inputPath));
    outputPath = path.join(dir, `${baseName}_${type}.png`);
  }
  
  await processImage(inputPath, type, outputPath, {
    removeBg: flags.removeBg,
    bgTolerance: flags.bgTolerance,
    bgFeather: flags.bgFeather,
  });
  
  // 显示安全区域提示
  const config = DIMENSIONS[type];
  console.log(`\n💡 安全区域提示:`);
  if (Array.isArray(config.editableRegions) && config.editableRegions.length > 0) {
    if (type === 'hang') {
      console.log(`   - 仅顶部${config.editableRegions[0].height}px可编辑/可出现元素`);
      console.log(`   - 其余区域必须完全透明留空`);
      return;
    }
    if (type === 'bubble') {
      const top = config.editableRegions[0];
      const bottom = config.editableRegions[1];
      const middle = config.height - top.height - bottom.height;
      console.log(`   - 顶部${top.height}px可编辑/可出现元素`);
      console.log(`   - 中间${middle}px必须完全透明留空（不可编辑区域）`);
      console.log(`   - 底部${bottom.height}px可编辑/可出现元素`);
      return;
    }
  }
  if (config.safeZone.top && config.safeZone.middle && config.safeZone.bottom) {
    console.log(`   - 上方${(config.safeZone.top * 100).toFixed(0)}%: 保持简洁，确保文字可读`);
    console.log(`   - 中部${(config.safeZone.middle * 100).toFixed(0)}%: 主要视觉元素区域`);
    console.log(`   - 底部${(config.safeZone.bottom * 100).toFixed(0)}%: 避免放置关键元素`);
  } else if (config.safeZone.top && config.safeZone.bottom) {
    console.log(`   - 上方${(config.safeZone.top * 100).toFixed(0)}%: 设计元素区域`);
    console.log(`   - 下方${(config.safeZone.bottom * 100).toFixed(0)}%: 必须留白/透明`);
  }
}

main().catch(error => {
  console.error(`\n❌ 处理失败: ${error.message}`);
  process.exit(1);
});
