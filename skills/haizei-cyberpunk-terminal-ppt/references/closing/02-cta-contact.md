# 02 · CTA + 联系方式（行动号召页）

> **A15. ctaAndContact** — 演讲结束后的"留资 / 加微 / 进群"页
> 适合商务演讲、技术分享、workshop 收尾，引导听众下一步行动。

## 视觉锚点

- **顶部**：`THANK YOU` 大字（英文 64px italic）+ 中文小字 `期待与您合作`（24px）
- **主体 2 列**：
  - **左 60%**：CTA 主卡
    - 行动号召大字号："扫码加我微信" / "申请试用" / "下载完整方案"
    - 二维码占位（200x200px 居中）
    - 下方 fallback 链接
  - **右 40%**：联系方式 grid（3x2）
    - 邮箱 / 微信 / GitHub / 公众号 / 官网 / 知乎
- **底部**：可选 `// NEXT STEPS` 三步走（扫码 → 加好友 → 拉群）

## HTML 骨架

```html
<section class="slide" data-kind="cta-contact">
  <header class="cta-header">
    <h1 class="cta-big">THANK <em>YOU</em></h1>
    <p class="cta-sub">期待与您合作 · 欢迎扫码交流</p>
  </header>

  <div class="cta-body">
    <!-- 左：主 CTA -->
    <div class="cta-main">
      <span class="cta-tag">// PRIMARY CTA</span>
      <h2 class="cta-action">扫码加我微信</h2>
      <p class="cta-desc">备注 <em>"[PPT 关键词]"</em>，我会在 24 小时内通过</p>
      <div class="cta-qr">▣▣ ▣ ▣▣ ▣<br>▣ ▣▣▣ ▣ ▣<br>▣▣ ▣ ▣▣ ▣<br>▣ ▣▣▣ ▣ ▣▣<br>▣▣ ▣ ▣ ▣▣ ▣</div>
      <p class="cta-fallback">或搜索微信：<code>yourname_dev</code></p>
    </div>

    <!-- 右：联系方式 grid -->
    <div class="cta-channels">
      <span class="ch-tag">// CHANNELS</span>
      <div class="ch-grid">
        <div class="ch-item">
          <span class="ch-icon">@</span>
          <span class="ch-key">EMAIL</span>
          <span class="ch-val">hi@yourdomain.com</span>
        </div>
        <div class="ch-item">
          <span class="ch-icon">微</span>
          <span class="ch-key">WECHAT</span>
          <span class="ch-val">yourname_dev</span>
        </div>
        <div class="ch-item">
          <span class="ch-icon">{ }</span>
          <span class="ch-key">GITHUB</span>
          <span class="ch-val">github.com/yourname</span>
        </div>
        <div class="ch-item">
          <span class="ch-icon">公</span>
          <span class="ch-key">公众号</span>
          <span class="ch-val">无处不在的技术</span>
        </div>
        <div class="ch-item">
          <span class="ch-icon">W</span>
          <span class="ch-key">WEBSITE</span>
          <span class="ch-val">yourdomain.com</span>
        </div>
        <div class="ch-item">
          <span class="ch-icon">知</span>
          <span class="ch-key">ZHIHU</span>
          <span class="ch-val">@yourname</span>
        </div>
      </div>
    </div>
  </div>

  <footer class="next-steps">
    <span class="ns-tag">// NEXT STEPS</span>
    <div class="ns-flow">
      <span class="ns-step"><b>1</b> 扫码</span>
      <span class="ns-arrow">→</span>
      <span class="ns-step"><b>2</b> 加好友</span>
      <span class="ns-arrow">→</span>
      <span class="ns-step"><b>3</b> 拉群交流</span>
    </div>
  </footer>
</section>
```

## CSS

```css
.cta-contact {
  display: flex; flex-direction: column; gap: 16px; height: 100%;
}
.cta-header { text-align: center; padding: 8px 0; }
.cta-big {
  font: italic 700 64px/1.1 var(--font-display); color: var(--text); margin: 0;
  letter-spacing: -2px;
}
.cta-big em { color: var(--green); font-style: normal; text-shadow: 0 0 24px rgba(0,255,156,0.4); }
.cta-sub { font: 16px var(--font-sans); color: var(--text-dim); margin: 8px 0 0; letter-spacing: 1px; }

.cta-body { display: grid; grid-template-columns: 6fr 4fr; gap: 16px; flex: 1; min-height: 0; }

.cta-main {
  border: 1px solid rgba(0,255,156,0.3); border-radius: 8px;
  padding: 20px 28px; background: rgba(0,255,156,0.04);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
.cta-tag, .ch-tag { font: 700 10px var(--font-mono); color: var(--green); letter-spacing: 1.5px; align-self: flex-start; }
.cta-action { font: 700 28px var(--font-display); color: var(--text); margin: 0; }
.cta-desc { font: 13px var(--font-sans); color: var(--text-dim); margin: 0; }
.cta-desc em { color: var(--amber); font-style: normal; font-weight: 700; }
.cta-qr {
  width: 180px; height: 180px; background: var(--green); color: var(--bg);
  font: 12px/1.2 var(--font-mono); text-align: center; padding: 16px; border-radius: 4px;
  font-weight: 700; letter-spacing: 4px; display: flex; align-items: center; justify-content: center;
  word-break: break-all;
}
.cta-fallback { font: 12px var(--font-mono); color: var(--cyan); margin: 4px 0 0; }
.cta-fallback code { color: var(--amber); background: rgba(255,176,32,0.1); padding: 2px 6px; border-radius: 3px; }

.cta-channels {
  border: 1px solid rgba(92,225,255,0.18); border-radius: 8px;
  padding: 16px 20px; background: rgba(92,225,255,0.03);
  display: flex; flex-direction: column; gap: 10px;
}
.ch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 1; }
.ch-item {
  padding: 8px 10px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px;
  display: grid; grid-template-columns: 28px 1fr; grid-template-rows: auto auto; gap: 2px 8px; align-items: center;
}
.ch-icon {
  grid-row: 1 / 3; width: 28px; height: 28px; border-radius: 50%;
  background: rgba(0,255,156,0.15); color: var(--green);
  display: flex; align-items: center; justify-content: center;
  font: 700 12px var(--font-mono);
}
.ch-key { font: 9px var(--font-mono); color: var(--text-dim); letter-spacing: 1px; }
.ch-val { font: 11px var(--font-mono); color: var(--text); }

.next-steps {
  display: flex; gap: 16px; align-items: center; padding: 10px 16px;
  border: 1px solid rgba(255,176,32,0.2); border-radius: 6px; background: rgba(255,176,32,0.04);
}
.ns-tag { font: 700 10px var(--font-mono); color: var(--amber); letter-spacing: 1.5px; }
.ns-flow { display: flex; gap: 8px; align-items: center; flex: 1; justify-content: center; font: 12px var(--font-mono); color: var(--text-dim); }
.ns-step b { color: var(--amber); margin-right: 6px; }
.ns-arrow { color: var(--cyan); }
```

## Checklist

- [ ] 主 CTA 二维码占位 200x200px 居中（实际使用替换为真实二维码）
- [ ] 联系方式 ≥ 4 项（邮箱/微信必备）
- [ ] 联系方式 icon 用 28px 圆形 + 单字符（@/微/{}/公/W/知）
- [ ] NEXT STEPS 3 步流程清晰（1 → 2 → 3）
- [ ] 二维码下方有 fallback（搜索微信号 / 打开链接）
- [ ] slide-corner 写 `[ NN / 37 ] CONTACT`

## 常见变体

- **Workshop 场景**：CTA 改为"扫码加入共学群" + 二维码 + 群规
- **招聘场景**：CTA 改为"加入我们" + JD 链接 + 内推二维码
- **产品发布**：CTA 改为"立即试用" + 试用链接 + 产品视频 QR