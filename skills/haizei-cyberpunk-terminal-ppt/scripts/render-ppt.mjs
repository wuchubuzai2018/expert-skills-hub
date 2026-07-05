// scripts/render-ppt.mjs
// ═══════════════════════════════════════════════════════════════════════
// 通用 PPT 渲染工具：用 Puppeteer + Edge 把任何"按 ← → 翻页的 PPT 网页"
// 的所有 slide 渲染后 dump 为单文件 HTML，便于离线分析 / 参考设计。
// ═══════════════════════════════════════════════════════════════════════
//
// 用法（必须从有 puppeteer-core 的目录运行）：
//   cd <有 node_modules 的目录>
//   node <skill-path>/scripts/render-ppt.mjs <url> [options]
//
// 示例：
//   cd test && node ../.claude/skills/haizei-cyberpunk-terminal-ppt/scripts/render-ppt.mjs https://example.com/deck --out ./rendered
//
// 选项：
//   --out <dir>         输出目录（默认 ./rendered）
//   --max <n>           最多抓几张（默认 100）
//   --browser <path>    Edge/Chrome 路径
//   --wait <ms>         每张等待时间（默认 800ms）
//   --selector <sel>    等待的选择器
//   --skip-if-exists    跳过已渲染的
//   --dry-run           只打印不写文件
// ═══════════════════════════════════════════════════════════════════════

import { writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// —— 解析 CLI 参数 ——————————————————————————————————————————————
function parseArgs(argv) {
  const args = {
    url: null,
    out: './rendered',
    max: 100,
    browser: process.platform === 'win32'
      ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
      : '/usr/bin/google-chrome',
    wait: 800,
    selector: 'section._slide_16npa_4._active_16npa_49 [data-slide-panel] > *',
    activeSelector: 'section._slide_16npa_4._active_16npa_49',
    panelSelector: '[data-slide-panel]',
    skipIfExists: false,
    dryRun: false,
  };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out')        args.out = argv[++i];
    else if (a === '--max')   args.max = parseInt(argv[++i], 10);
    else if (a === '--browser') args.browser = argv[++i];
    else if (a === '--wait')  args.wait = parseInt(argv[++i], 10);
    else if (a === '--selector') args.selector = argv[++i];
    else if (a === '--active-selector') args.activeSelector = argv[++i];
    else if (a === '--panel-selector')  args.panelSelector = argv[++i];
    else if (a === '--skip-if-exists')  args.skipIfExists = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') { printHelp(); process.exit(0); }
    else positional.push(a);
  }
  args.url = positional[0] || null;
  if (!args.url) {
    printHelp();
    process.exit(2);
  }
  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/render-ppt.mjs <base-url> [options]

Options:
  --out <dir>           输出目录 (default: ./rendered)
  --max <n>             最多渲染多少张 (default: 100)
  --browser <path>      浏览器路径
  --wait <ms>           每张额外等待时间 (default: 800)
  --selector <sel>      等待 panel 出现内容的选择器
  --active-selector <sel> 当前激活 slide 选择器
  --panel-selector <sel>  panel 容器选择器
  --skip-if-exists      已存在则跳过
  --dry-run             只打印不写
  --help, -h            显示帮助`);
}

// —— 工具函数 ——————————————————————————————————————————————
async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

async function dumpActive(page, file, dryRun) {
  const html = await page.evaluate((sel) => {
    const active = document.querySelector(sel);
    return active ? active.outerHTML : '<!-- no active slide -->';
  }, file.activeSelector);
  if (dryRun) {
    console.log(`  [dry-run] would write ${html.length} bytes`);
  } else {
    await writeFile(file.outPath, html, 'utf8');
  }
  return html.length;
}

// —— 主流程 ——————————————————————————————————————————————
async function main() {
  const args = parseArgs(process.argv);
  await mkdir(args.out, { recursive: true });

  // —— 加载 puppeteer-core：从 cwd 解析（兼容 ESM 不从 cwd 找 node_modules 的问题） ——
  const cwdRequire = createRequire(pathToFileURL(path.join(process.cwd(), '_')).href + '/');
  let puppeteer;
  try {
    puppeteer = cwdRequire('puppeteer-core');
  } catch (e) {
    console.error('ERROR: puppeteer-core not found.');
    console.error('');
    console.error('Run this script from a directory where puppeteer-core is installed:');
    console.error('  cd <your-project>');
    console.error(`  node ${path.relative(process.cwd(), process.argv[1])} ${args.url} --out ./rendered`);
    console.error('');
    console.error('Or install puppeteer-core globally:');
    console.error('  npm install -g puppeteer-core');
    process.exit(1);
  }

  console.log(`[config]`);
  console.log(`  url      = ${args.url}`);
  console.log(`  out      = ${args.out}`);
  console.log(`  max      = ${args.max}`);
  console.log(`  browser  = ${args.browser}`);
  console.log(`  wait     = ${args.wait}ms`);
  console.log(`  selector = ${args.selector}`);

  const browser = await puppeteer.launch({
    executablePath: args.browser,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // 第一张：用导航触发
  console.log(`\n[init] navigating to ${args.url}`);
  await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  try {
    await page.waitForSelector(args.selector, { timeout: 20000 });
  } catch (e) {
    console.error(`[init] WARN: initial selector "${args.selector}" not found, trying fallback`);
  }
  console.log(`[init] first slide ready`);

  const dumpFile = (n) => ({
    n,
    outPath: path.join(args.out, `${String(n).padStart(2, '0')}.html`),
  });

  // 第 1 张
  let f = dumpFile(1);
  if (args.skipIfExists && await exists(f.outPath)) {
    console.log(`[01] skipped (exists)`);
  } else {
    const size = await dumpActive(page, { ...f, activeSelector: args.activeSelector }, args.dryRun);
    console.log(`[01] wrote ${size} bytes`);
  }

  // 第 2 张起：键盘 ArrowRight 翻页
  for (let i = 2; i <= args.max; i++) {
    f = dumpFile(i);
    if (args.skipIfExists && await exists(f.outPath)) {
      console.log(`[${String(i).padStart(2, '0')}] skipped (exists)`);
      continue;
    }
    try {
      await page.keyboard.press('ArrowRight');
      await page.waitForFunction(
        ({ active, panel }) => {
          const a = document.querySelector(active);
          if (!a) return false;
          const p = a.querySelector(panel);
          return p && p.children.length > 0;
        },
        { timeout: 15000 },
        { active: args.activeSelector, panel: args.panelSelector }
      );
      await new Promise(r => setTimeout(r, args.wait));
      const size = await dumpActive(page, { ...f, activeSelector: args.activeSelector }, args.dryRun);
      console.log(`[${String(i).padStart(2, '0')}] wrote ${size} bytes`);
    } catch (e) {
      console.error(`[${String(i).padStart(2, '0')}] ERROR: ${e.message}`);
      if (!args.dryRun) {
        await writeFile(f.outPath, `<!-- render error: ${e.message} -->`, 'utf8');
      }
      // 翻页失败说明可能到底了，停止
      if (e.message.includes('waiting for selector') || e.message.includes('timeout')) {
        console.log(`[abort] selector no longer matched, likely end of deck`);
        break;
      }
    }
  }

  await browser.close();
  console.log(`\n[done] rendered to ${args.out}`);
}

main().catch((e) => { console.error(e); process.exit(1); });