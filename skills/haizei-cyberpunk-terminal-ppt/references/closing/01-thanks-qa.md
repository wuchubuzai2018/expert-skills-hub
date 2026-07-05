# 01 · 致谢 + Q&A 邀请（收尾主页面）

> **A14. thanksQandA** — PPT 最后一页（slide 37 同款 + 增强）
> 用大字号致谢 + Q&A 邀请，让听众知道你讲完了、欢迎提问。

## 视觉锚点

- **上半区**：大字号致谢（中文 96px + 英文 56px italic）
  - 中文：`谢谢` 或 `感谢聆听` 或 `THANKS`
  - 英文：`thank you for watching` / `Q&A TIME`（可加 glow）
- **下半区**：3 列 Q&A 邀请卡
  - 左：`立即提问` + 提示语
  - 中：`扫码加群` + 二维码占位
  - 右：`查看完整 PPT` + URL 提示
- **底部**：可选 `// SESSION END · 演讲结束` 灰色条
- **window-chrome**：slide-ref 区域写 `SESSION END`
- **slide-corner**：`[ NN / 37 ] OPEN FLOOR`（绿色）

## HTML 骨架

```html
<section class="slide" data-kind="thanks-qa">
  <!-- 上半：致谢大字 -->
  <div class="thanks-hero">
    <h1 class="thanks-cn">感谢<em>聆听</em></h1>
    <p class="thanks-en">thank you for watching</p>
  </div>

  <!-- 下半：Q&A 邀请 -->
  <div class="qa-grid">
    <div class="qa-card" data-color="cyan">
      <span class="qa-icon">?</span>
      <h3>立即提问</h3>
      <p>举手上麦 / 群里 @主持人 / 邮件提问</p>
    </div>
    <div class="qa-card" data-color="green">
      <span class="qa-icon">QR</span>
      <h3>扫码加群</h3>
      <p>获取完整 PPT + 后续答疑</p>
      <!-- 二维码占位 -->
      <div class="qr-placeholder">▣▣ ▣ ▣<br>▣ ▣▣▣ ▣<br>▣▣ ▣ ▣▣</div>
    </div>
    <div class="qa-card" data-color="amber">
      <span class="qa-icon">→</span>
      <h3>查看完整 PPT</h3>
      <p class="url">http://101.35.40.25/<br><span style="color:var(--text-dim)">（扫描浏览器直接打开）</span></p>
    </div>
  </div>

  <!-- 底部结束标识 -->
  <footer class="session-end">
    <span class="se-tag">// SESSION END</span>
    <span class="se-text">演讲结束 · 欢迎现场交流</span>
  </footer>
</section>
```

## CSS

```css
.thanks-qa {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; gap: 32px;
}
.thanks-hero { text-align: center; }
.thanks-cn {
  font: 800 96px/1.1 var(--font-display); color: var(--text); margin: 0;
  text-shadow: 0 0 32px rgba(0,255,156,0.15);
}
.thanks-cn em { color: var(--green); font-style: normal; }
.thanks-en {
  font: italic 600 48px/1.2 var(--font-display); color: var(--green);
  text-shadow: 0 0 24px rgba(0,255,156,0.4); margin-top: 16px;
}

.qa-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; width: 100%; max-width: 1200px; }
.qa-card {
  padding: 20px 24px; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
  display: flex; flex-direction: column; gap: 8px; align-items: flex-start;
  background: rgba(20, 30, 48, 0.3); transition: all 0.2s;
}
.qa-card:hover { border-color: var(--green); background: rgba(0,255,156,0.04); }
.qa-card[data-color="cyan"] { border-left: 3px solid var(--cyan); }
.qa-card[data-color="green"] { border-left: 3px solid var(--green); }
.qa-card[data-color="amber"] { border-left: 3px solid var(--amber); }

.qa-card .qa-icon {
  width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font: 700 16px var(--font-mono); color: var(--bg);
}
.qa-card[data-color="cyan"] .qa-icon { background: var(--cyan); }
.qa-card[data-color="green"] .qa-icon { background: var(--green); }
.qa-card[data-color="amber"] .qa-icon { background: var(--amber); }
.qa-card h3 { font: 700 20px var(--font-display); color: var(--text); margin: 4px 0 0; }
.qa-card p { font: 12px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.qa-card p.url { font: 13px var(--font-mono); color: var(--cyan); line-height: 1.6; }

.qr-placeholder {
  margin-top: 8px; padding: 12px; background: var(--green); color: var(--bg);
  font: 8px/1 var(--font-mono); text-align: center; border-radius: 4px;
  font-weight: 700; letter-spacing: 2px;
}

.session-end {
  display: flex; gap: 16px; align-items: center; padding: 8px 16px;
  border-top: 1px solid rgba(255,255,255,0.04); width: 100%; margin-top: 16px;
  font: 11px var(--font-mono);
}
.session-end .se-tag { color: var(--text-dim); letter-spacing: 1.5px; }
.session-end .se-text { color: var(--text-dim); }
```

## window-chrome 改动

```html
<div class="window-chrome">
  <span class="dot dot--r"></span><span class="dot dot--y"></span><span class="dot dot--g"></span>
  <span class="tab">~/session-end.MD</span>
  <span class="slide-ref session-end">SESSION END</span>  <!-- 改这里 -->
  <span class="rec">● END</span>  <!-- 改这里 -->
</div>

<div class="slide-corner">[ <span class="num">37 / 37</span> ] OPEN FLOOR</div>
```

## 与 slide 37 的对比

| 维度 | slide 37 简单版 | 本 A14 强化版 |
|---|---|---|
| 致谢 | 中文 + 英文（heroCard） | 中文 + 英文（更大字号 + glow） |
| Q&A 邀请 | 仅 1 个 discussCard 文字段 | 3 列 grid（提问/加群/PPT） |
| 联系渠道 | 无 | 内置二维码占位 + URL |
| 结束标识 | footer open floor 双 footer | 顶部 chrome + 底部 session-end 标识 |

## Checklist

- [ ] 致谢字号 ≥ 96px（中文）/ ≥ 48px（英文 italic）
- [ ] 3 列 Q&A 卡颜色分明（cyan / green / amber）
- [ ] 二维码占位用 monospace 色块模拟（实际使用替换为真实二维码图片）
- [ ] slide-corner 改为 `OPEN FLOOR` 或 `Q&A`
- [ ] chrome 的 slide-ref 改为 `SESSION END` / `THANKS FOR WATCHING`
- [ ] footer-bar 的 GREEN 标识可改为 `END` / `Q&A`