#!/usr/bin/env node

/**
 * 微信红包封面挂件背景去除增强工具
 * 
 * 特点：
 * - 智能背景检测（支持白色、灰色、纯色背景）
 * - 边缘羽化和抗锯齿处理
 * - 保留主体细节，去除背景杂质
 * - 针对AI生成图片优化
 * 
 * 使用方法:
 *   node remove_bg_enhanced.js <输入图片> [输出图片] [选项]
 * 
 * 选项:
 *   --mode <white|gray|auto>  背景检测模式 (默认: auto)
 *   --tolerance <0-100>       背景容差 (默认: 30)
 *   --feather <0-20>          边缘羽化像素 (默认: 3)
 *   --smooth <0-10>           平滑度 (默认: 2)
 *   --min-area <pixels>       最小保留区域 (默认: 100)
 * 
 * 示例:
 *   node remove_bg_enhanced.js input.png output.png --mode white --tolerance 40
 *   node remove_bg_enhanced.js input.png --mode auto --tolerance 35
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {
    input: null,
    output: null,
    mode: 'auto',
    tolerance: 30,
    feather: 3,
    smooth: 2,
    minArea: 100
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    
    if (arg === '--mode') {
      args.mode = argv[++i];
    } else if (arg === '--tolerance') {
      args.tolerance = parseInt(argv[++i], 10);
    } else if (arg === '--feather') {
      args.feather = parseInt(argv[++i], 10);
    } else if (arg === '--smooth') {
      args.smooth = parseInt(argv[++i], 10);
    } else if (arg === '--min-area') {
      args.minArea = parseInt(argv[++i], 10);
    } else if (!arg.startsWith('--') && !args.input) {
      args.input = arg;
    } else if (!arg.startsWith('--') && !args.output) {
      args.output = arg;
    }
  }

  if (!args.output) {
    const ext = path.extname(args.input);
    const base = args.input.slice(0, -ext.length);
    args.output = `${base}_transparent${ext}`;
  }

  return args;
}

function showHelp() {
  console.log(`
微信红包封面挂件背景去除增强工具

使用方法:
  node remove_bg_enhanced.js <输入图片> [输出图片] [选项]

选项:
  --mode <white|gray|auto>  背景检测模式 (默认: auto)
                            white: 针对白色背景优化
                            gray:  针对灰色背景优化
                            auto:  自动检测
  --tolerance <0-100>       背景容差，越大越激进 (默认: 30)
  --feather <0-20>          边缘羽化像素 (默认: 3)
  --smooth <0-10>           边缘平滑度 (默认: 2)
  --min-area <pixels>       最小保留区域像素数 (默认: 100)

示例:
  # 处理白色背景图片
  node remove_bg_enhanced.js input.png output.png --mode white --tolerance 40
  
  # 自动检测背景
  node remove_bg_enhanced.js input.png --mode auto --tolerance 35

  # 高容差处理（适合复杂背景）
  node remove_bg_enhanced.js input.png --tolerance 50 --feather 5
`);
}

// 计算像素亮度
function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// 计算颜色距离
function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

// 检测背景颜色
async function detectBackground(imageData, width, height, mode) {
  const samples = [];
  const borderWidth = Math.max(5, Math.floor(Math.min(width, height) * 0.05));
  
  // 从四边采样
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < borderWidth; x += 2) {
      const idx = (y * width + x) * 4;
      if (imageData[idx + 3] > 200) {
        samples.push({
          r: imageData[idx],
          g: imageData[idx + 1],
          b: imageData[idx + 2],
          lum: getLuminance(imageData[idx], imageData[idx + 1], imageData[idx + 2])
        });
      }
    }
    for (let x = width - borderWidth; x < width; x += 2) {
      const idx = (y * width + x) * 4;
      if (imageData[idx + 3] > 200) {
        samples.push({
          r: imageData[idx],
          g: imageData[idx + 1],
          b: imageData[idx + 2],
          lum: getLuminance(imageData[idx], imageData[idx + 1], imageData[idx + 2])
        });
      }
    }
  }
  
  for (let x = borderWidth; x < width - borderWidth; x += 5) {
    for (let y = 0; y < borderWidth; y += 2) {
      const idx = (y * width + x) * 4;
      if (imageData[idx + 3] > 200) {
        samples.push({
          r: imageData[idx],
          g: imageData[idx + 1],
          b: imageData[idx + 2],
          lum: getLuminance(imageData[idx], imageData[idx + 1], imageData[idx + 2])
        });
      }
    }
    for (let y = height - borderWidth; y < height; y += 2) {
      const idx = (y * width + x) * 4;
      if (imageData[idx + 3] > 200) {
        samples.push({
          r: imageData[idx],
          g: imageData[idx + 1],
          b: imageData[idx + 2],
          lum: getLuminance(imageData[idx], imageData[idx + 1], imageData[idx + 2])
        });
      }
    }
  }

  if (samples.length < 20) return null;

  // 分析样本统计
  let rSum = 0, gSum = 0, bSum = 0, lumSum = 0;
  for (const s of samples) {
    rSum += s.r; gSum += s.g; bSum += s.b; lumSum += s.lum;
  }
  const rMean = rSum / samples.length;
  const gMean = gSum / samples.length;
  const bMean = bSum / samples.length;
  const lumMean = lumSum / samples.length;

  // 计算颜色方差
  let colorVariance = 0;
  for (const s of samples) {
    colorVariance += colorDistance(s.r, s.g, s.b, rMean, gMean, bMean);
  }
  colorVariance /= samples.length;

  // 判断背景类型
  let bgType = 'mixed';
  if (colorVariance < 30) {
    if (lumMean > 200) bgType = 'white';
    else if (lumMean > 100 && lumMean < 180) bgType = 'gray';
    else bgType = 'dark';
  }

  // 如果用户指定了模式，优先使用用户指定
  if (mode !== 'auto') bgType = mode;

  return {
    r: Math.round(rMean),
    g: Math.round(gMean),
    b: Math.round(bMean),
    luminance: lumMean,
    type: bgType,
    variance: colorVariance
  };
}

// 创建透明度蒙版
function createAlphaMask(imageData, width, height, bgInfo, tolerance) {
  const mask = new Uint8Array(width * height);
  const tolVal = tolerance * 2.55; // 转换为0-255范围
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];
      
      let isBackground = false;
      let alpha = 255;
      
      if (bgInfo.type === 'white' || bgInfo.type === 'gray') {
        // 基于亮度的检测
        const lum = getLuminance(r, g, b);
        const bgLum = bgInfo.luminance;
        const lumDiff = Math.abs(lum - bgLum);
        
        // 同时考虑颜色距离
        const colorDist = colorDistance(r, g, b, bgInfo.r, bgInfo.g, bgInfo.b);
        
        // 综合判断
        if (lumDiff < tolerance && colorDist < tolVal * 1.5) {
          isBackground = true;
          alpha = 0;
        } else if (lumDiff < tolerance * 1.5 || colorDist < tolVal * 2) {
          // 过渡区域
          const factor = Math.min(lumDiff / (tolerance * 1.5), colorDist / (tolVal * 2));
          alpha = Math.round(255 * Math.max(0, factor - 0.3) / 0.7);
        }
      } else {
        // 通用颜色距离检测
        const dist = colorDistance(r, g, b, bgInfo.r, bgInfo.g, bgInfo.b);
        if (dist < tolVal) {
          isBackground = true;
          alpha = 0;
        } else if (dist < tolVal * 1.8) {
          alpha = Math.round(255 * (dist - tolVal) / (tolVal * 0.8));
        }
      }
      
      mask[y * width + x] = alpha;
    }
  }
  
  return mask;
}

// 应用羽化
function applyFeather(mask, width, height, feather) {
  if (feather <= 0) return mask;
  
  const result = new Uint8Array(mask);
  const temp = new Uint8Array(width * height);
  
  // 多次迭代实现羽化效果
  for (let iter = 0; iter < feather; iter++) {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        
        // 3x3平均
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += mask[(y + dy) * width + (x + dx)];
          }
        }
        temp[idx] = Math.round(sum / 9);
      }
    }
    
    // 复制回mask
    for (let i = 0; i < width * height; i++) {
      mask[i] = temp[i];
    }
  }
  
  return mask;
}

// 去除小噪点
function removeNoise(mask, width, height, minArea) {
  const visited = new Uint8Array(width * height);
  const newMask = new Uint8Array(mask);
  
  function floodFill(startX, startY) {
    const stack = [[startX, startY]];
    const pixels = [];
    visited[startY * width + startX] = 1;
    
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      pixels.push([x, y]);
      
      const neighbors = [[x-1,y], [x+1,y], [x,y-1], [x,y+1]];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = ny * width + nx;
          if (!visited[idx] && mask[idx] > 128) {
            visited[idx] = 1;
            stack.push([nx, ny]);
          }
        }
      }
    }
    
    return pixels;
  }
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!visited[idx] && mask[idx] > 128) {
        const pixels = floodFill(x, y);
        if (pixels.length < minArea) {
          // 太小的区域设为透明
          for (const [px, py] of pixels) {
            newMask[py * width + px] = 0;
          }
        }
      }
    }
  }
  
  return newMask;
}

async function processImage(inputPath, outputPath, options) {
  console.log(`\n🎨 开始处理: ${path.basename(inputPath)}`);
  console.log(`   模式: ${options.mode}, 容差: ${options.tolerance}, 羽化: ${options.feather}`);
  
  // 读取图片
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  
  const { width, height } = info;
  console.log(`   尺寸: ${width}×${height}px`);
  
  // 检测背景
  const bgInfo = await detectBackground(data, width, height, options.mode);
  if (!bgInfo) {
    console.log('   ⚠️ 无法检测背景，跳过处理');
    await sharp(inputPath).png().toFile(outputPath);
    return;
  }
  
  console.log(`   检测到背景: ${bgInfo.type} (RGB: ${bgInfo.r},${bgInfo.g},${bgInfo.b})`);
  
  // 创建透明度蒙版
  let mask = createAlphaMask(data, width, height, bgInfo, options.tolerance);
  
  // 去除噪点
  if (options.minArea > 0) {
    mask = removeNoise(mask, width, height, options.minArea);
  }
  
  // 应用羽化
  if (options.feather > 0) {
    mask = applyFeather(mask, width, height, options.feather);
  }
  
  // 应用蒙版到原图
  const outputData = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    outputData[i * 4 + 3] = mask[i];
  }
  
  // 保存结果
  await sharp(outputData, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);
  
  const stats = fs.statSync(outputPath);
  console.log(`   ✅ 已保存: ${outputPath}`);
  console.log(`   大小: ${(stats.size / 1024).toFixed(2)}KB`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('❌ 错误: 缺少依赖 "sharp"');
    console.error('   请先安装: npm install sharp');
    process.exit(1);
  }
  
  const options = parseArgs(args);
  
  if (!fs.existsSync(options.input)) {
    console.error(`❌ 错误: 找不到文件 "${options.input}"`);
    process.exit(1);
  }
  
  await processImage(options.input, options.output, options);
  console.log('\n🎉 处理完成!');
}

main().catch(err => {
  console.error(`\n❌ 错误: ${err.message}`);
  process.exit(1);
});
