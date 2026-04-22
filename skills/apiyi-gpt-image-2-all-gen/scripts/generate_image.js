#!/usr/bin/env node
/*
基于GPT Image 2 All的图片生成与编辑脚本（Node.js版）
使用API易国内代理服务

支持功能：
- 文生图：根据提示词生成图片
- 图生图：根据编辑指令修改已有图片
- 多图融合：参考多张图片融合

参数说明：
- -p, --prompt          图片描述或编辑指令文本（必需）
- -f, --filename       输出图片路径（可选，默认自动生成时间戳文件名）
- -r, --response-format 响应格式（可选：url/b64_json，默认url）
- -i, --input-image    输入图片路径（可选，可多张，最多5张）
- -k, --api-key        API密钥（可选，覆盖环境变量 APIYI_API_KEY）

使用示例：
【生成新图片】
  node generate_image.js -p "一只可爱的橘猫"
  node generate_image.js -p "横版 16:9 电影画幅，日落山脉" -f sunset.png
  node generate_image.js -p "竖版 9:16 手机海报，城市夜景" -f city.png

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

const SUPPORTED_RESPONSE_FORMATS = ['url', 'b64_json'];

function printHelpAndExit(exitCode = 0) {
  const help = `usage: generate_image.js [-h] --prompt PROMPT [--filename FILENAME]
                        [--response-format url|b64_json]
                        [--input-image INPUT_IMAGE [INPUT_IMAGE ...]]
                        [--api-key API_KEY]

基于GPT Image 2 All的图片生成与编辑工具（Node.js版）

options:
  -h, --help                  show this help message and exit
  -p, --prompt PROMPT         图片描述或编辑指令文本（必需）
  -f, --filename FILE        输出图片路径 (默认: 自动生成时间戳文件名)
  -r, --response-format      响应格式 (可选: url, b64_json，默认url)
  -i, --input-image         输入图片路径（编辑模式，可传多张，最多5张）
  -k, --api-key             API密钥（覆盖环境变量）

尺寸说明（通过prompt描述，无显式size参数）：
  - 方形: 1024×1024 方图 / 1:1 方形构图
  - 横版: 横版 16:9 / 宽屏 16:9 电影画幅
  - 竖版: 竖版 9:16 / 手机海报 9:16
  - 超宽: 横幅 21:9 超宽银幕
  - 印刷: 4:3 标准画幅 / 3:2 经典画幅

运行示例:
  node scripts/generate_image.js -p "一只可爱的橘猫"
  node scripts/generate_image.js -p "横版 16:9 电影画幅，日落山脉" -f sunset.png
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
    responseFormat: null,
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
    '-r',
    '--response-format',
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

    if (a === '-r' || a === '--response-format') {
      args.responseFormat = requireValue(i, a);
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

function extractImageUrl(content) {
  if (!content) return null;
  const urlMatch = content.match(/(https?:\/\/[^\s)]+\.(png|jpg|jpeg|webp))/i);
  if (urlMatch) return urlMatch[1];
  const b64Match = content.match(/(data:image\/[^\s;]+;base64,[A-Za-z0-9+/=]+)/);
  if (b64Match) return b64Match[1];
  return null;
}

async function downloadImage(urlString) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const req = https.get(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
      },
      (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          const err = new Error(`HTTP ${res.statusCode}`);
          err.statusCode = res.statusCode;
          return reject(err);
        }
        const chunks = [];
        res.on('data', (d) => chunks.push(d));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

async function downloadBase64Image(urlString) {
  const imageBuffer = await downloadImage(urlString);
  return imageBuffer.toString('base64');
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

  if (args.responseFormat != null && !SUPPORTED_RESPONSE_FORMATS.includes(args.responseFormat)) {
    exitWithError(
      `错误: 不支持的响应格式 '${args.responseFormat}'\n支持的格式: ${SUPPORTED_RESPONSE_FORMATS.join(', ')}`
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

  const apiKey = getApiKey(args.apiKey);
  const url = 'https://api.apiyi.com/v1/chat/completions';

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  let content = [];
  let modeStr = '生成图片';

  if (args.inputImages && args.inputImages.length > 0) {
    if (args.inputImages.length > 5) {
      exitWithError(`错误: 输入图片最多支持5张，当前为 ${args.inputImages.length} 张`);
    }

    for (let idx = 0; idx < args.inputImages.length; idx++) {
      const imgPath = args.inputImages[idx];
      if (!fs.existsSync(imgPath)) {
        exitWithError(`错误: 输入图片不存在: ${imgPath}`);
      }
      const imageBase64 = encodeImageToBase64(imgPath);
      const dataUrl = `data:image/png;base64,${imageBase64}`;
      content.push({
        type: 'image_url',
        image_url: { url: dataUrl },
      });
    }
    modeStr = args.inputImages.length === 1 ? '编辑图片' : '多图融合';

    content = [
      {
        type: 'text',
        text: args.prompt,
      },
      ...content,
    ];
  } else {
    content = args.prompt;
  }

  const payload = {
    model: 'gpt-image-2-all',
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
  };

  if (args.responseFormat === 'b64_json') {
    payload.response_format = { type: 'b64_json' };
  }

  process.stdout.write('🎨 图片生成已启动！\n');
  process.stdout.write(`⏱️ 预计时间: 约60秒到300秒\n`);
  process.stdout.write(`正在${modeStr}...\n`);
  process.stdout.write(`提示词: ${args.prompt}\n`);

  process.stdout.write('image generation in progress...\n');

  const startTime = Date.now();
  checkProgress = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    process.stdout.write(`🔄 已进行 ${elapsed}秒...\n`);
  }, 5000);

  let data;
  try {
    data = await postJson(url, headers, payload, 300_000);
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

  clearProgressTimer();

  const responseContent =
    data &&
    data.choices &&
    Array.isArray(data.choices) &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;

  if (!responseContent) {
    process.stderr.write('错误: 响应中未找到内容\n');
    process.stderr.write(`完整响应: ${JSON.stringify(data, null, 2)}\n`);
    process.exit(1);
  }

  let imageData = null;

  if (args.responseFormat === 'b64_json') {
    const b64Match = responseContent.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
    if (b64Match) {
      imageData = b64Match[1];
    }
  }

  if (!imageData) {
    const imageUrl = extractImageUrl(responseContent);
    if (imageUrl) {
      if (imageUrl.startsWith('data:')) {
        imageData = imageUrl.replace(/^data:image\/png;base64,/, '');
      } else {
        process.stdout.write(`📥 正在下载图片...\n`);
        imageData = await downloadBase64Image(imageUrl);
      }
    }
  }

  if (!imageData) {
    process.stderr.write('错误: 未能从响应中提取图片数据\n');
    process.stderr.write(`响应内容: ${responseContent}\n`);
    process.exit(1);
  }

  const imageBytes = Buffer.from(imageData, 'base64');
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