#!/usr/bin/env node
/*
基于GPT Image 2官方正式版的图片生成与编辑脚本（Node.js版）
使用API易国内代理服务

支持功能：
- 文生图：根据提示词生成图片
- 图生图：根据编辑指令修改已有图片
- 多图融合：参考多张图片融合

参数说明：
- -p, --prompt             图片描述或编辑指令文本（必需）
- -f, --filename          输出图片路径（可选，默认自动生成时间戳文件名）
- -s, --size              输出尺寸（可选）
- -q, --quality           画质档位（可选：low/medium/high/auto，默认auto）
- -o, --output-format      输出格式（可选：png/jpeg/webp，默认png）
- -c, --output-compression 输出压缩率（可选：0-100，默认85）
- -i, --input-image       输入图片路径（可选，可多张，最多5张）
- -k, --api-key           API密钥（可选，覆盖环境变量 APIYI_API_KEY）

使用示例：
【生成新图片】
  node generate_image.js -p "一只可爱的橘猫"
  node generate_image.js -p "日落山脉" -s "2048x1152" -q "high" -f sunset.png
  node generate_image.js -p "城市夜景" -s "2160x3840" -q "high" -f city.png

【编辑已有图片】
  node generate_image.js -p "转换成油画风格" -i original.png
  node generate_image.js -p "添加彩虹到天空" -i photo.jpg -f edited.png
  node generate_image.js -p "将背景换成海滩" -i portrait.png -f beach-bg.png

【多图融合】
  node generate_image.js -p "融合图1和图2的风格" -i ref1.png ref2.png -f merged.png

【环境变量】
  export APIYI_API_KEY="your-api-key"
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPPORTED_SIZES = [
  '1024x1024',
  '1536x1024',
  '1024x1536',
  '2048x2048',
  '2048x1152',
  '3840x2160',
  '2160x3840',
];

const SUPPORTED_QUALITIES = ['auto', 'low', 'medium', 'high'];
const SUPPORTED_OUTPUT_FORMATS = ['png', 'jpeg', 'webp'];

function printHelpAndExit(exitCode = 0) {
  const help = `usage: generate_image.js [-h] --prompt PROMPT [--filename FILENAME]
                        [--size SIZE]
                        [--quality auto|low|medium|high]
                        [--output-format png|jpeg|webp]
                        [--output-compression 0-100]
                        [--input-image INPUT_IMAGE [INPUT_IMAGE ...]]
                        [--api-key API_KEY]

基于GPT Image 2官方正式版的图片生成与编辑工具（Node.js版）

options:
  -h, --help                  show this help message and exit
  -p, --prompt PROMPT         图片描述或编辑指令文本（必需）
  -f, --filename FILE        输出图片路径 (默认: 自动生成时间戳文件名)
  -s, --size               输出尺寸 (可选: 1024x1024, 1536x1024, 1024x1536, 2048x2048, 2048x1152, 3840x2160, 2160x3840)
  -q, --quality            画质档位 (可选: auto, low, medium, high)
  -o, --output-format     输出格式 (可选: png, jpeg, webp)
  -c, --output-compression 输出压缩率 (0-100，仅jpeg/webp生效)
  -i, --input-image      输入图片路径（编辑模式，可传多张，最多5张）
  -k, --api-key        API密钥（覆盖环境变量）

尺寸说明：
  - 预设值: 1024x1024, 1536x1024, 1024x1536, 2048x2048, 2048x1152, 3840x2160, 2160x3840
  - 也支持自定义尺寸（最大边≤3840，两边16倍数，比例≤3:1）

运行示例:
  node scripts/generate_image.js -p "一只可爱的橘猫"
  node scripts/generate_image.js -p "日落山脉" -s "2048x1152" -q "high" -f sunset.png
  node scripts/generate_image.js -p "转换成油画风格" -i original.png
  node scripts/generate_image.js -p "融合图1和图2的风格" -i ref1.png ref2.png -f merged.png
`;
  process.stdout.write(help);
  process.exit(exitCode);
}

function exitWithError(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatTimestamp(dateObj) {
  const d = dateObj || new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}-${pad2(d.getHours())}-${pad2(d.getMinutes())}-${pad2(d.getSeconds())}`;
}

function addTimestampToFilename(filePath, timestamp) {
  const ts = timestamp || formatTimestamp(new Date());
  const parsed = path.parse(filePath);
  const base = parsed.name ? `${parsed.name}-${ts}` : ts;
  return path.join(parsed.dir || '.', `${base}${parsed.ext || ''}`);
}

function generateFilename(prompt) {
  const now = new Date();
  const timestamp = formatTimestamp(now);

  const keywords = String(prompt).split(/\s+/).filter(Boolean).slice(0, 3);
  const keywordStrRaw = keywords.join('-') || 'image';

  const keywordStr = keywordStrRaw
    .split('')
    .map((c) => (/^[a-zA-Z0-9\-_.]$/.test(c) ? c : '-'))
    .join('')
    .toLowerCase()
    .slice(0, 30);

  return `${timestamp}-${keywordStr}.png`;
}

function getApiKey(argsKey) {
  if (argsKey) return argsKey;
  const apiKey = process.env.APIYI_API_KEY;
  if (!apiKey) {
    exitWithError(
      '错误: 未设置 APIYI_API_KEY 环境变量\n' +
        '请前往 https://api.apiyi.com 注册申请API Key\n' +
        '或使用 -k/--api-key 参数临时指定'
    );
  }
  return apiKey;
}

function encodeImageToBase64(imagePath) {
  try {
    const bytes = fs.readFileSync(imagePath);
    return bytes.toString('base64');
  } catch (e) {
    exitWithError(`错误: 无法读取图片文件 ${imagePath} - ${e.message || String(e)}`);
  }
}

function parseArgs(argv) {
  const args = {
    prompt: null,
    filename: null,
    size: null,
    quality: null,
    outputFormat: null,
    outputCompression: null,
    inputImages: null,
    apiKey: null,
  };

  const knownFlags = new Set([
    '-h', '--help',
    '-p', '--prompt',
    '-f', '--filename',
    '-s', '--size',
    '-q', '--quality',
    '-o', '--output-format',
    '-c', '--output-compression',
    '-i', '--input-image',
    '-k', '--api-key',
  ]);

  function requireValue(i, flag) {
    const v = argv[i + 1];
    if (!v || (v.startsWith('-') && knownFlags.has(v))) {
      exitWithError(`错误: 参数 ${flag} 需要一个值`);
    }
    return v;
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === '-h' || a === '--help') {
      printHelpAndExit(0);
    }

    if (a === '-p' || a === '--prompt') {
      args.prompt = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-f' || a === '--filename') {
      args.filename = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-s' || a === '--size') {
      args.size = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-q' || a === '--quality') {
      args.quality = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-o' || a === '--output-format') {
      args.outputFormat = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-c' || a === '--output-compression') {
      args.outputCompression = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-k' || a === '--api-key') {
      args.apiKey = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-i' || a === '--input-image') {
      const images = [];
      let j = i + 1;
      while (j < argv.length) {
        const v = argv[j];
        if (v.startsWith('-') && knownFlags.has(v)) break;
        images.push(v);
        j++;
      }
      if (images.length === 0) {
        exitWithError(`错误: 参数 ${a} 需要至少一个图片路径`);
      }
      args.inputImages = images;
      i = j - 1;
      continue;
    }

    if (a.startsWith('-')) {
      exitWithError(`错误: 未知参数 ${a}，请使用 --help 查看帮助`);
    }
  }

  if (!args.prompt) {
    exitWithError('错误: 缺少必需参数 -p/--prompt');
  }

  return args;
}

function buildBoundary() {
  let s = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 24; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

function postMultipart(urlString, headers, boundary, parts) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);

    const bodyParts = [];
    for (const part of parts) {
      bodyParts.push(Buffer.from(`--${boundary}\r\n`, 'utf8'));
      bodyParts.push(Buffer.from(`${part.header}\r\n`, 'utf8'));
      bodyParts.push(Buffer.from('\r\n', 'utf8'));
      if (Buffer.isBuffer(part.body)) {
        bodyParts.push(part.body);
      } else {
        bodyParts.push(Buffer.from(part.body, 'utf8'));
      }
      bodyParts.push(Buffer.from('\r\n', 'utf8'));
    }
    bodyParts.push(Buffer.from(`--${boundary}--\r\n`, 'utf8'));

    const body = Buffer.concat(bodyParts);

    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          const statusCode = res.statusCode || 0;

          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error(`HTTP ${statusCode}`);
            err.statusCode = statusCode;
            err.responseText = text;
            return reject(err);
          }

          try {
            resolve(JSON.parse(text));
          } catch (e) {
            const err = new Error('响应不是有效的JSON');
            err.responseText = text;
            return reject(err);
          }
        });
      }
    );

    req.on('error', reject);

    req.setTimeout(500_000, () => {
      req.destroy(new Error('timeout'));
    });

    req.write(body);
    req.end();
  });
}

function postJson(urlString, headers, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);

    const body = Buffer.from(JSON.stringify(payload), 'utf8');
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Content-Length': body.length,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          const statusCode = res.statusCode || 0;

          if (statusCode < 200 || statusCode >= 300) {
            const err = new Error(`HTTP ${statusCode}`);
            err.statusCode = statusCode;
            err.responseText = text;
            return reject(err);
          }

          try {
            resolve(JSON.parse(text));
          } catch (e) {
            const err = new Error('响应不是有效的JSON');
            err.responseText = text;
            return reject(err);
          }
        });
      }
    );

    req.on('error', reject);

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('timeout'));
    });

    req.write(body);
    req.end();
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  const runTimestamp = formatTimestamp(new Date());

  let checkProgress = null;
  const clearProgressTimer = () => {
    if (checkProgress) {
      clearInterval(checkProgress);
      checkProgress = null;
    }
  };

  if (args.size != null && !SUPPORTED_SIZES.includes(args.size)) {
    const sizePattern = /^\d+x\d+$/;
    if (!sizePattern.test(args.size)) {
      exitWithError(
        `错误: 不支持的尺寸 '${args.size}'\n支持的预设尺寸: ${SUPPORTED_SIZES.join(', ')}\n或自定义尺寸（如 1920x1080）`
      );
    }
    const [w, h] = args.size.split('x').map(Number);
    if (w > 3840 || h > 3840) {
      exitWithError(`错误: 尺寸最大边不能超过3840`);
    }
    if (w % 16 !== 0 || h % 16 !== 0) {
      exitWithError(`错误: 尺寸两边必须能被16整除`);
    }
    if (Math.max(w / h, h / w) > 3) {
      exitWithError(`错误: 尺寸比例不能超过3:1`);
    }
    const mp = (w * h) / 1000000;
    if (mp < 0.65 || mp > 8.3) {
      exitWithError(`错误: 总像素必须在0.65-8.3MP之间，当前${mp.toFixed(2)}MP`);
    }
  }

  if (args.quality != null && !SUPPORTED_QUALITIES.includes(args.quality)) {
    exitWithError(
      `错误: 不支持的画质 '${args.quality}'\n支持的画质: ${SUPPORTED_QUALITIES.join(', ')}`
    );
  }

  if (args.outputFormat != null && !SUPPORTED_OUTPUT_FORMATS.includes(args.outputFormat)) {
    exitWithError(
      `错误: 不支持的输出格式 '${args.outputFormat}'\n支持的格式: ${SUPPORTED_OUTPUT_FORMATS.join(', ')}`
    );
  }

  if (args.outputCompression != null) {
    const comp = parseInt(args.outputCompression);
    if (isNaN(comp) || comp < 0 || comp > 100) {
      exitWithError(`错误: 输出压缩率必须在0-100之间`);
    }
  }

  if (!args.filename) {
    const ext = args.outputFormat === 'jpeg' ? 'jpg' : args.outputFormat === 'webp' ? 'webp' : 'png';
    args.filename = generateFilename(args.prompt).replace(/\.png$/, `.${ext}`);
  } else {
    const resolved = path.resolve(args.filename);
    if (fs.existsSync(resolved)) {
      const adjusted = addTimestampToFilename(args.filename, runTimestamp);
      process.stdout.write(`⚠️ 输出文件已存在，将避免覆盖并改为: ${adjusted}\n`);
      args.filename = adjusted;
    }
  }

  const apiKey = getApiKey(args.apiKey);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  let modeStr = '生成图片';
  let data;

  if (args.inputImages && args.inputImages.length > 0) {
    if (args.inputImages.length > 5) {
      exitWithError(`错误: 输入图片最多支持5张，当前为 ${args.inputImages.length} 张`);
    }

    for (const imgPath of args.inputImages) {
      if (!fs.existsSync(imgPath)) {
        exitWithError(`错误: 输入图片不存在: ${imgPath}`);
      }
    }

    modeStr = args.inputImages.length === 1 ? '编辑图片' : '多图融合';

    const boundary = buildBoundary();
    const parts = [];

    parts.push({
      header: 'Content-Disposition: form-data; name="model"',
      body: 'gpt-image-2',
    });

    parts.push({
      header: `Content-Disposition: form-data; name="prompt"`,
      body: args.prompt,
    });

    if (args.size != null) {
      parts.push({
        header: 'Content-Disposition: form-data; name="size"',
        body: args.size,
      });
    }

    if (args.quality != null) {
      parts.push({
        header: 'Content-Disposition: form-data; name="quality"',
        body: args.quality,
      });
    }

    if (args.outputFormat != null) {
      parts.push({
        header: 'Content-Disposition: form-data; name="output_format"',
        body: args.outputFormat,
      });
    }

    if (args.outputCompression != null) {
      parts.push({
        header: 'Content-Disposition: form-data; name="output_compression"',
        body: args.outputCompression,
      });
    }

    for (let i = 0; i < args.inputImages.length; i++) {
      const imgPath = args.inputImages[i];
      const imageData = fs.readFileSync(imgPath);
      const fileName = path.basename(imgPath);
      const mimeType = `image/${path.extname(imgPath).slice(1)}`;
      parts.push({
        header: `Content-Disposition: form-data; name="image[]"; filename="${fileName}"\r\nContent-Type: ${mimeType}`,
        body: imageData,
      });
    }

    const url = 'https://api.apiyi.com/v1/images/edits';

    process.stdout.write('🎨 图片生成已启动！\n');
    process.stdout.write(`⏱️ 预计时间: 约120-150秒，请耐心等待\n`);
    process.stdout.write(`正在${modeStr}...\n`);
    process.stdout.write(`提示词: ${args.prompt}\n`);

    if (args.size) {
      process.stdout.write(`尺寸: ${args.size}\n`);
    }
    if (args.quality) {
      process.stdout.write(`画质: ${args.quality}\n`);
    }

    process.stdout.write('image generation in progress...\n');

    const startTime = Date.now();
    checkProgress = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(`🔄 已进行 ${elapsed}秒...\n`);
    }, 5000);

    try {
      data = await postMultipart(url, headers, boundary, parts);
    } catch (e) {
      clearProgressTimer();
      if (e && e.message === 'timeout') {
        exitWithError('错误: 请求超时，请稍后重试');
      }
      if (e && e.statusCode) {
        process.stderr.write(`错误: 请求失败 - HTTP ${e.statusCode}\n`);
        if (e.responseText) {
          try {
            const detail = JSON.parse(e.responseText);
            process.stderr.write(`错误详情: ${JSON.stringify(detail, null, 2)}\n`);
          } catch {
            process.stderr.write(`响应内容: ${e.responseText}\n`);
          }
        }
        process.exit(1);
      }
      exitWithError(`错误: 请求失败 - ${e.message || String(e)}`);
    }
  } else {
    const payload = {
      model: 'gpt-image-2',
      prompt: args.prompt,
    };

    if (args.size != null) payload.size = args.size;
    if (args.quality != null) payload.quality = args.quality;
    if (args.outputFormat != null) payload.output_format = args.outputFormat;
    if (args.outputCompression != null) payload.output_compression = parseInt(args.outputCompression);

    const url = 'https://api.apiyi.com/v1/images/generations';

    process.stdout.write('🎨 图片生成已启动！\n');
    process.stdout.write(`⏱️ 预计时间: 约120-150秒，请耐心等待\n`);
    process.stdout.write(`正在${modeStr}...\n`);
    process.stdout.write(`提示词: ${args.prompt}\n`);

    if (args.size) {
      process.stdout.write(`尺寸: ${args.size}\n`);
    }
    if (args.quality) {
      process.stdout.write(`画质: ${args.quality}\n`);
    }

    process.stdout.write('image generation in progress...\n');

    const startTime = Date.now();
    checkProgress = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      process.stdout.write(`🔄 已进行 ${elapsed}秒...\n`);
    }, 5000);

    try {
      data = await postJson(url, headers, payload, 500_000);
    } catch (e) {
      clearProgressTimer();
      if (e && e.message === 'timeout') {
        exitWithError('错误: 请求超时，请稍后重试');
      }
      if (e && e.statusCode) {
        process.stderr.write(`错误: 请求失败 - HTTP ${e.statusCode}\n`);
        if (e.responseText) {
          try {
            const detail = JSON.parse(e.responseText);
            process.stderr.write(`错误详情: ${JSON.stringify(detail, null, 2)}\n`);
          } catch {
            process.stderr.write(`响应内容: ${e.responseText}\n`);
          }
        }
        process.exit(1);
      }
      exitWithError(`错误: 请求失败 - ${e.message || String(e)}`);
    }
  }

  clearProgressTimer();

  const b64Json =
    data &&
    data.data &&
    Array.isArray(data.data) &&
    data.data[0] &&
    data.data[0].b64_json;

  if (!b64Json) {
    process.stderr.write('错误: 响应中未找到图片数据\n');
    process.stderr.write(`完整响应: ${JSON.stringify(data, null, 2)}\n`);
    process.exit(1);
  }

  const imageBytes = Buffer.from(b64Json, 'base64');
  const outputFile = path.resolve(args.filename);
  const outputDir = path.dirname(outputFile);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, imageBytes);

  process.stdout.write(`✓ 图片已成功${modeStr}并保存到: ${args.filename}\n`);
  process.stdout.write('✅ 生成完成！\n');
}

main().catch((e) => {
  exitWithError(`错误: ${e && e.message ? e.message : String(e)}`);
});