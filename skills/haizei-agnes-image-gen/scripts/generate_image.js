#!/usr/bin/env node
/*
基于Agnes Image 2.1 Flash的图片生成与编辑脚本（Node.js版）
使用Agnes AI官方API服务

支持功能：
- 文生图：根据提示词生成图片（Base64输出）
- 图生图：根据编辑指令修改已有图片，输入/输出均使用Base64

参数说明：
- -p, --prompt        图片描述或编辑指令文本（必需）
- -f, --filename      输出图片路径（可选，默认自动生成时间戳文件名）
- -s, --size          输出尺寸（必需，例如 1024x768）
- -i, --input-image   输入图片路径（可选，可多张；传入则进入图生图模式）
- -k, --api-key       API密钥（可选，覆盖环境变量 AGNES_API_KEY）

使用示例：
【生成新图片（Base64输出）】
  node generate_image.js -p "A luminous floating city above a misty canyon at sunrise" -s 1024x768
  node generate_image.js -p "A clean product photo of a glass cube" -s 1024x768 -f product.png
  node generate_image.js -p "未来城市夜景" -s 1024x1536 -f city.png

【编辑已有图片（Base64输入 + Base64输出）】
  node generate_image.js -p "Convert to cyberpunk night" -s 1024x768 -i original.png
  node generate_image.js -p "Make the object orange" -s 1024x768 -i photo.png -f edited.png
  node generate_image.js -p "融合两张图的风格" -s 1024x768 -i ref1.png ref2.png -f merged.png

【环境变量】
  export AGNES_API_KEY="your-api-key"
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_NAME = 'agnes-image-2.1-flash';
const API_URL = 'https://apihub.agnes-ai.com/v1/images/generations';
const DEFAULT_TIMEOUT = 360_000;
const SIZE_PATTERN = /^\d{2,5}x\d{2,5}$/;
const MAX_INPUT_IMAGES = 5;

function printHelpAndExit(exitCode = 0) {
  const help = `usage: generate_image.js [-h] --prompt PROMPT --size SIZE
                        [--filename FILENAME]
                        [--input-image INPUT_IMAGE [INPUT_IMAGE ...]]
                        [--api-key API_KEY]

基于Agnes Image 2.1 Flash的图片生成与编辑工具（Node.js版）
文生图与图生图均使用Base64方式输出。

options:
  -h, --help                  show this help message and exit
  -p, --prompt PROMPT         图片描述或编辑指令文本（必需）
  -s, --size SIZE             输出尺寸（必需，例如 1024x768、1536x1024）
  -f, --filename FILE         输出图片路径 (默认: 自动生成时间戳文件名)
  -i, --input-image           输入图片路径（编辑模式，可传多张，最多5张）
  -k, --api-key               API密钥（覆盖环境变量 AGNES_API_KEY）

尺寸说明：
  - 支持任意合法自定义尺寸，例如 1024x768、1280x720、2048x2048
  - 建议参考 references/size-guide.md

运行示例:
  node scripts/generate_image.js -p "A floating city above a misty canyon" -s 1024x768
  node scripts/generate_image.js -p "Convert to cyberpunk night" -s 1024x768 -i original.png
  node scripts/generate_image.js -p "融合两张图的风格" -s 1024x768 -i ref1.png ref2.png -f merged.png
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
  const apiKey = process.env.AGNES_API_KEY;
  if (!apiKey) {
    exitWithError(
      '错误: 未设置 AGNES_API_KEY 环境变量\n' +
        '请前往 https://www.agnes-ai.com 注册账号并申请API Key\n' +
        '或使用 -k/--api-key 参数临时指定'
    );
  }
  return apiKey;
}

function getImageMimeType(imagePath) {
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'image/png';
}

function encodeImageToDataUri(imagePath) {
  try {
    const bytes = fs.readFileSync(imagePath);
    const mime = getImageMimeType(imagePath);
    return `data:${mime};base64,${bytes.toString('base64')}`;
  } catch (e) {
    exitWithError(`错误: 无法读取图片文件 ${imagePath} - ${e.message || String(e)}`);
  }
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

function parseArgs(argv) {
  const args = {
    prompt: null,
    filename: null,
    size: null,
    inputImages: null,
    apiKey: null,
  };

  const knownFlags = new Set([
    '-h',
    '--help',
    '-p',
    '--prompt',
    '-f',
    '--filename',
    '-s',
    '--size',
    '-i',
    '--input-image',
    '-k',
    '--api-key',
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

  if (!args.size) {
    exitWithError('错误: 缺少必需参数 -s/--size（例如 1024x768）');
  }

  return args;
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

  if (!SIZE_PATTERN.test(args.size)) {
    exitWithError(
      `错误: 无效的尺寸 '${args.size}'\n请使用 WIDTHxHEIGHT 格式，例如 1024x768、1536x1024`
    );
  }

  if (!args.filename) {
    args.filename = generateFilename(args.prompt);
  } else {
    const resolved = path.resolve(args.filename);
    if (fs.existsSync(resolved)) {
      const adjusted = addTimestampToFilename(args.filename, runTimestamp);
      process.stdout.write(`⚠️ 输出文件已存在，将避免覆盖并改为: ${adjusted}\n`);
      args.filename = adjusted;
    }
  }

  let modeStr = '生成图片';
  let inputDataUris = null;

  if (args.inputImages && args.inputImages.length > 0) {
    if (args.inputImages.length > MAX_INPUT_IMAGES) {
      exitWithError(`错误: 输入图片最多支持${MAX_INPUT_IMAGES}张，当前为 ${args.inputImages.length} 张`);
    }

    for (const imgPath of args.inputImages) {
      if (!fs.existsSync(imgPath)) {
        exitWithError(`错误: 输入图片不存在: ${imgPath}`);
      }
    }

    inputDataUris = args.inputImages.map((p) => encodeImageToDataUri(p));
    modeStr = args.inputImages.length === 1 ? '编辑图片' : '多图融合';
  }

  const payload = {
    model: MODEL_NAME,
    prompt: args.prompt,
    size: args.size,
    extra_body: {
      response_format: 'b64_json',
    },
  };

  if (inputDataUris && inputDataUris.length > 0) {
    payload.extra_body.image = inputDataUris;
  }

  const apiKey = getApiKey(args.apiKey);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  process.stdout.write('🎨 图片生成已启动！\n');
  process.stdout.write(`⏱️ 预计时间: 约60-360秒，请耐心等待\n`);
  process.stdout.write(`正在${modeStr}...\n`);
  process.stdout.write(`模型: ${MODEL_NAME}\n`);
  process.stdout.write(`尺寸: ${args.size}\n`);
  process.stdout.write(`提示词: ${args.prompt}\n`);

  if (inputDataUris) {
    process.stdout.write(`输入图片: ${inputDataUris.length}张（Base64 Data URI）\n`);
  }

  process.stdout.write('image generation in progress...\n');

  const startTime = Date.now();
  checkProgress = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    process.stdout.write(`🔄 已进行 ${elapsed}秒...\n`);
  }, 5000);

  let data;
  try {
    data = await postJson(API_URL, headers, payload, DEFAULT_TIMEOUT);
  } catch (e) {
    clearProgressTimer();
    if (e && e.message === 'timeout') {
      exitWithError('错误: 请求超时（360秒），请稍后重试');
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

  clearProgressTimer();

  const b64Json =
    data &&
    data.data &&
    Array.isArray(data.data) &&
    data.data[0] &&
    data.data[0].b64_json;

  if (!b64Json) {
    process.stderr.write('错误: 响应中未找到 b64_json 图片数据\n');
    process.stderr.write(`完整响应: ${JSON.stringify(data, null, 2)}\n`);
    process.exit(1);
  }

  const imageBytes = Buffer.from(b64Json, 'base64');
  const outputFile = path.resolve(args.filename);
  const outputDir = path.dirname(outputFile);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, imageBytes);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  process.stdout.write(`✓ 图片已成功${modeStr}并保存到: ${args.filename}\n`);
  process.stdout.write(`⏱️ 耗时 ${elapsed}秒\n`);
  process.stdout.write('✅ 生成完成！\n');
}

main().catch((e) => {
  exitWithError(`错误: ${e && e.message ? e.message : String(e)}`);
});