# 06 · Rendering Tips（渲染技巧 + 性能 + 调试）

> 字体加载、网格技巧、动画、性能、调试的通用规则。

## 字体加载（最重要）

### 字体三件套
- **JetBrains Mono**（等宽）：代码、标签、数字、chrome
- **Space Grotesk**（无衬线）：英文 hero、数字、accent
- **Noto Sans SC**（中文）：主标、正文

### 加载方式
```html
<!-- 推荐：link 标签 + preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
```

### 避免 FOIT（不可见文字闪烁）
- 用 `&display=swap`（已经在 URL 里）
- 给所有字体设置 `font-display: swap`
- fallback 字体用 `ui-monospace, monospace` / `sans-serif`

### 避免布局偏移
```css
/* 提前声明字号 + fallback 字体 */
body {
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.55;
}
```

## 网格技巧

### 基础背景网格（已包含在 00 模板）
```css
body::before {
  content: ''; position: fixed; inset: 0;
  background-image:
    linear-gradient(90deg, #ffffff0a 1px, transparent 1px),
    linear-gradient(0deg, #ffffff08 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none; z-index: 0;
}
```

### 调试 grid
```javascript
document.querySelectorAll('.grid12, .grid3, .grid4, .grid2, .split').forEach(el => {
  el.style.outline = '1px solid red';
});
```

### 12 栅格 / N 列 grid 模板
```css
.grid12 { display: grid; grid-template-columns: repeat(12, 1fr); gap: 12px; }
.grid4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.grid3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.grid2  { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.split  { display: grid; grid-template-columns: 5fr 7fr; gap: 60px; }
```

## 动画

### 入场动画（每个 layout 都用）
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-item {
  animation: 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) var(--d, 0.1s) 1 normal both running fadeUp;
}
```

### 闪烁光标
```css
@keyframes blink { 0%, 50% { opacity: 1; } 50.01%, to { opacity: 0; } }
.cursor {
  display: inline-block;
  width: 0.6em; height: 1em;
  background: var(--green);
  margin-left: 0.25em;
  vertical-align: -0.12em;
  box-shadow: 0 0 10px var(--green);
  animation: blink 1.05s steps(2) infinite;
}
```

### 性能优化
- 用 `transform` 和 `opacity` 做动画（GPU 加速）
- 避免 `box-shadow` 动画（重绘）
- 用 `will-change: transform` 标记将要动画的元素

```css
.fade-item { will-change: transform, opacity; }
```

## 性能

### 大 deck 优化（> 20 页）
- 单文件 HTML ≤ 500 KB（避免 inline 字体到 CSS 里）
- 不要把所有页面放在一个 HTML 里（按页拆文件，路由切换）
- 用 `preload` 预加载下一张 slide

```html
<link rel="preload" href="slide-02.html" as="document">
```

### 单文件 deck（≤ 10 页）
- 全部 inline 在一个 HTML 里
- 用 hash 路由：`location.hash = '#next'` 切页

```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') location.hash = '#next';
  if (e.key === 'ArrowLeft') location.hash = '#prev';
});
```

## 调试

### 关闭所有动画
```javascript
document.querySelectorAll('*').forEach(el => {
  el.style.animation = 'none';
  el.style.transition = 'none';
});
```

### 关闭背景看文字对比
```javascript
document.body.style.background = '#fff';
```

### 列出所有用到的颜色
```javascript
const colors = new Set();
document.querySelectorAll('*').forEach(el => {
  colors.add(getComputedStyle(el).color);
  colors.add(getComputedStyle(el).backgroundColor);
});
console.log([...colors]);
```

### 高亮所有 chrome 元素
```javascript
document.querySelectorAll('.chrome').forEach(el => {
  el.style.outline = '2px solid yellow';
});
```

### 检查溢出
```javascript
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
    console.warn('OVERFLOW:', el);
  }
});
```

### 导出为 PDF（Puppeteer）
```javascript
const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('file:///path/to/index.html', { waitUntil: 'networkidle0' });
  await page.pdf({
    path: 'output.pdf',
    format: 'A4',
    landscape: true,
    printBackground: true,
  });
  await browser.close();
})();
```

### 抓所有 slide 为单独 HTML（用 scripts/render-ppt.mjs）
```bash
node scripts/render-ppt.mjs file:///path/to/index.html --out ./slides
```

## 视口规范

| 设备 | 视口 | 用途 |
|---|---|---|
| 标准桌面 | 1440 × 900 | **设计基准** |
| 宽屏桌面 | 1920 × 1080 | 适配（不放大只微调） |
| 投影仪 | 1280 × 720 | 适配（缩放 0.89） |
| 移动端 | < 768 | **不设计移动端**（保持桌面风格） |

### 视口 meta
```html
<meta name="viewport" content="width=1440, initial-scale=1.0">
<!-- 强制 1440px 宽度，移动端按比例缩放 -->
```

## 键盘快捷键

| 键 | 动作 |
|---|---|
| `→` / `Space` | 下一页 |
| `←` | 上一页 |
| `F` | 切换全屏 |
| `Esc` | 退出全屏 |
| `Home` | 第一页 |
| `End` | 最后一页 |

### 完整键盘脚本
```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    const next = document.querySelector('section.slide.active + section.slide');
    if (next) { next.classList.add('active'); document.querySelector('section.slide.active').classList.remove('active'); }
  }
  if (e.key === 'ArrowLeft') { /* ... */ }
  if (e.key === 'f' || e.key === 'F') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
});
```

## 打印优化（导出 PDF）

```css
@media print {
  body::before, body::after { display: none; }  /* 关闭背景网格 */
  .chrome { display: none; }  /* 隐藏命令栏 */
  section.slide { page-break-after: always; }  /* 每页换页 */
}
```

## 反模式（避免）

| 反模式 | 原因 | 替代方案 |
|---|---|---|
| 用 `box-shadow` 模拟纸质卡片 | 软阴影破坏终端感 | 用 1px 边框 + bg 半透明 |
| `transition: all 0.3s` | 性能差 | 明确指定 `transition: transform 0.3s, opacity 0.3s` |
| 在 `<head>` 里 inline 字体 CSS | 单文件大 | 用 `<link>` 标签 |
| 给所有元素加 `box-shadow: 0 0 20px ...` | 视觉过载 | 只给 hero / 数字加 |
| 用 emoji 作为视觉元素 | 破坏终端感 | 用 `▸` `▍` `◆` `▌` 等 unicode 字符 |
| 把整个 deck 做成一个 HTML（> 30 张） | 单文件 > 1MB | 拆分为路由切换 |
| 用 `:hover` 实现关键交互 | 桌面端才能 hover | 用点击 / 键盘 |

## 工具

### scripts/render-ppt.mjs
通用 PPT 渲染工具：用 Puppeteer + Edge 把"按 ← → 翻页"的 PPT 网页的所有 slide dump 为单文件 HTML。
```bash
node scripts/render-ppt.mjs <url> --out ./rendered
```