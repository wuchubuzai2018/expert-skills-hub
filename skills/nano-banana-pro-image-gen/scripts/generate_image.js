#!/usr/bin/env node
/*
基于NanoBananaPro/Gemini 3 Pro的图片生成与编辑脚本（Node.js版）
使用API易国内代理服务

支持功能：
- 文生图：根据提示词生成图片
- 图生图：根据编辑指令修改已有图片

参数说明：
- -p, --prompt        图片描述或编辑指令文本（必需）
- -f, --filename      输出图片路径（可选，默认自动生成时间戳文件名）
- -a, --aspect-ratio  图片比例（可选）
- -r, --resolution    图片分辨率（可选：1K/2K/4K，必须大写）
- -i, --input-image   输入图片路径（可选，可多张，最多14张）
- -k, --api-key       API密钥（可选，覆盖环境变量 APIYI_API_KEY）

使用示例：
【生成新图片】
  node generate_image.js -p "一只可爱的橘猫"
  node generate_image.js -p "日落山脉" -a 16:9 -r 4K
  node generate_image.js -p "城市夜景" -a 9:16 -r 2K -f wallpaper.png

【编辑已有图片】
  node generate_image.js -p "转换成油画风格" -i original.png
  node generate_image.js -p "添加彩虹到天空" -i photo.jpg -f edited.png
  node generate_image.js -p "将背景换成海滩" -i portrait.png -a 3:4 -r 2K
  node generate_image.js -p "参考多张图片融合风格" -i ref1.png ref2.png ref3.png -f merged.png

【环境变量】
  export APIYI_API_KEY="your-api-key"
*/

const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPPORTED_ASPECT_RATIOS = [
  '1:1',
  '16:9',
  '9:16',
  '4:3',
  '3:4',
  '3:2',
  '2:3',
  '5:4',
  '4:5',
  '21:9',
];

const SUPPORTED_RESOLUTIONS = ['1K', '2K', '4K'];

function printHelpAndExit(exitCode = 0) {
  const help = `usage: generate_image.js [-h] --prompt PROMPT [--filename FILENAME]
                        [--aspect-ratio ${SUPPORTED_ASPECT_RATIOS.join(', ')}]
                        [--resolution ${SUPPORTED_RESOLUTIONS.join(', ')}]
                        [--input-image INPUT_IMAGE [INPUT_IMAGE ...]]
                        [--api-key API_KEY]

基于Gemini 3 Pro的图片生成与编辑工具（Node.js版）

options:
  -h, --help            show this help message and exit
  -p, --prompt PROMPT   图片描述或编辑指令文本（必需）
  -f, --filename FILE   输出图片路径 (默认: 自动生成时间戳文件名)
  -a, --aspect-ratio    图片比例 (可选)
  -r, --resolution      图片分辨率 (可选: 1K, 2K, 4K，必须大写)
  -i, --input-image     输入图片路径（编辑模式，可传多张，最多14张）
  -k, --api-key         API密钥（覆盖环境变量）

运行示例:
  node scripts/generate_image.js -p "一只可爱的橘猫"
  node scripts/generate_image.js -p "日落山脉" -a 16:9 -r 4K
  node scripts/generate_image.js -p "城市夜景" -a 9:16 -r 2K -f wallpaper.png

  node scripts/generate_image.js -p "转换成油画风格" -i original.png
  node scripts/generate_image.js -p "参考多张图片融合风格" -i ref1.png ref2.png -f merged.png
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

function generateFilename(prompt) {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${pad2(now.getHours())}-${pad2(now.getMinutes())}-${pad2(now.getSeconds())}`;

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
    aspectRatio: null,
    resolution: null,
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
    '-a',
    '--aspect-ratio',
    '-r',
    '--resolution',
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

    if (a === '-a' || a === '--aspect-ratio') {
      args.aspectRatio = requireValue(i, a);
      i++;
      continue;
    }

    if (a === '-r' || a === '--resolution') {
      args.resolution = requireValue(i, a);
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

async function main() {
  const argv = process.argv.slice(2);
  const args = parseArgs(argv);

  if (args.aspectRatio != null && !SUPPORTED_ASPECT_RATIOS.includes(args.aspectRatio)) {
    exitWithError(
      `错误: 不支持的比例 '${args.aspectRatio}'\n支持的比例: ${SUPPORTED_ASPECT_RATIOS.join(', ')}`
    );
  }

  if (args.resolution != null && !SUPPORTED_RESOLUTIONS.includes(args.resolution)) {
    exitWithError(
      `错误: 不支持的分辨率 '${args.resolution}'\n支持的分辨率: ${SUPPORTED_RESOLUTIONS.join(', ')} (必须大写)`
    );
  }

  if (!args.filename) {
    args.filename = generateFilename(args.prompt);
  }

  const apiKey = getApiKey(args.apiKey);
  const url =
    'https://api.apiyi.com/v1beta/models/gemini-3-pro-image-preview:generateContent';

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  const parts = [{ text: args.prompt }];
  let modeStr = '生成图片';

  if (args.inputImages && args.inputImages.length > 0) {
    if (args.inputImages.length > 14) {
      exitWithError(`错误: 输入图片最多支持14张，当前为 ${args.inputImages.length} 张`);
    }

    for (const imgPath of args.inputImages) {
      if (!fs.existsSync(imgPath)) {
        exitWithError(`错误: 输入图片不存在: ${imgPath}`);
      }
      const imageBase64 = encodeImageToBase64(imgPath);
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: imageBase64,
        },
      });
    }
    modeStr = '编辑图片';
  }

  const generationConfig = {
    responseModalities: ['IMAGE'],
  };

  const imageConfig = {};
  if (args.aspectRatio != null) imageConfig.aspectRatio = args.aspectRatio;
  if (args.resolution != null) imageConfig.imageSize = args.resolution;
  if (Object.keys(imageConfig).length > 0) generationConfig.imageConfig = imageConfig;

  const payload = {
    contents: [{ parts }],
    generationConfig,
  };

  process.stdout.write(`正在${modeStr}...\n`);
  process.stdout.write(`提示词: ${args.prompt}\n`);

  if (generationConfig.imageConfig && generationConfig.imageConfig.aspectRatio) {
    process.stdout.write(`比例: ${generationConfig.imageConfig.aspectRatio}\n`);
  }
  if (generationConfig.imageConfig && generationConfig.imageConfig.imageSize) {
    process.stdout.write(`分辨率: ${generationConfig.imageConfig.imageSize}\n`);
  }

  // 输出请求参数（脱敏：不直接输出base64图片数据，避免刷屏）
  const payloadLog = {
    generationConfig,
    contents: [],
  };

  for (const content of payload.contents || []) {
    const partsLog = [];
    for (const part of content.parts || []) {
      if (part && typeof part === 'object' && part.inlineData && typeof part.inlineData === 'object') {
        const inlineData = { ...part.inlineData };
        if (typeof inlineData.data === 'string') {
          inlineData.data = `<omitted base64: ${inlineData.data.length} chars>`;
        }
        partsLog.push({ inlineData });
      } else {
        partsLog.push(part);
      }
    }
    payloadLog.contents.push({ parts: partsLog });
  }

  process.stdout.write(`输出请求参数: ${JSON.stringify(payloadLog, null, 2)}\n`);
  process.stdout.write('image generation in progress...\n');

  let data;
  try {
    data = await postJson(url, headers, payload, 120_000);
  } catch (e) {
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

  const imageData =
    data &&
    data.candidates &&
    Array.isArray(data.candidates) &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts[0] &&
    data.candidates[0].content.parts[0].inlineData &&
    data.candidates[0].content.parts[0].inlineData.data;

  if (!imageData) {
    process.stderr.write('错误: 响应中未找到图片数据\n');
    process.stderr.write(`完整响应: ${JSON.stringify(data, null, 2)}\n`);
    process.exit(1);
  }

  const imageBytes = Buffer.from(imageData, 'base64');
  const outputFile = path.resolve(args.filename);
  const outputDir = path.dirname(outputFile);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, imageBytes);

  process.stdout.write(`✓ 图片已成功${modeStr}并保存到: ${args.filename}\n`);
}

main().catch((e) => {
  exitWithError(`错误: ${e && e.message ? e.message : String(e)}`);
});
