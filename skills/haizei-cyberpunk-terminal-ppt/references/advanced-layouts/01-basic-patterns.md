## 9. arch-flow（架构图 / 数据流）

```html
<section class="slide">
  <div class="chrome chrome--top">
    <span class="dot dot--g"></span>
    <span>ARCHITECTURE</span>
  </div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">
      [架构图标题]<span class="cursor"></span>
    </h1>
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="arch-row fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="arch-row__no">L1</div>
        <div class="arch-row__name">[LAYER 1 NAME]</div>
        <div class="arch-row__desc">[这一层的职责 / 包含什么]</div>
        <div class="arch-row__tech">[tech-stack]</div>
      </div>
      <!-- L2/L3/L4 同结构 -->
    </div>
  </div>
  <div class="chrome chrome--bottom">
    <span class="prompt">cat /architecture/layers.md</span>
  </div>
</section>

<style>
  .arch-row {
    display: grid; grid-template-columns: 60px 200px 1fr 200px;
    align-items: center; gap: 20px;
    padding: 14px 20px;
    background: #ffffff06;
    border-left: 2px solid var(--accent);
    border-radius: 0 2px 2px 0;
  }
  .arch-row__no {
    font-family: var(--font-display); font-weight: 700; font-style: italic;
    font-size: 24px; color: var(--accent);
    text-shadow: 0 0 10px currentColor;
  }
  .arch-row__name { font-family: var(--font-sans); font-weight: 700; font-size: 16px; }
  .arch-row__desc { font-size: 12px; color: var(--fg-dim); line-height: 1.5; }
  .arch-row__tech {
    font-family: var(--font-mono); font-size: 11px; color: var(--fg-mute);
    text-align: right; letter-spacing: 0.18em;
  }
</style>
```

## 10. intro-typ（中文大字 hero 引言）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>INTRO</span></div>
  <div class="stage" style="display:grid; place-items:center; padding:80px;">
    <div style="max-width:1100px; text-align:center;">
      <div style="font-family:var(--font-display); font-weight:700; font-style:italic;
                  font-size:120px; color:var(--cyan); line-height:0.8;
                  text-shadow: 0 0 30px #5ce1ff66; margin-bottom:24px;">&ldquo;</div>
      <p style="font-family:var(--font-sans); font-weight:700; font-size:52px; line-height:1.4;
                letter-spacing:-0.01em; margin-bottom:32px;">[一句话引言]</p>
      <div style="font-size:12px; color:var(--fg-dim); letter-spacing:0.22em;">◆ [作者 / 出处 · 时间]</div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">less /quotes/[N].md</span></div>
</section>
```

## 11. layer-stack（N 层堆叠）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>STACK · 9 LAYERS</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:36px;">[N 层堆叠标题]<span class="cursor"></span></h1>
    <div style="border-top:1px solid var(--rule);">
      <div class="layer fade-item" style="--d:0.05s; --accent: var(--cyan);">
        <div class="layer__no">L1</div><div class="layer__name">[LAYER 1]</div>
        <div class="layer__desc">[description]</div>
      </div>
      <!-- L2 ~ L9 类似 -->
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">ls -la /stack/</span></div>
</section>

<style>
  .layer {
    display: grid; grid-template-columns: 60px 1fr 2fr;
    align-items: center; gap: 24px;
    padding: 14px 0;
    border-bottom: 1px dashed var(--rule);
  }
  .layer__no { font-family: var(--font-display); font-weight: 700; font-style: italic; font-size: 18px; color: var(--accent); }
  .layer__name { font-family: var(--font-sans); font-weight: 700; font-size: 14px; }
  .layer__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.5; }
</style>
```

## 12. loop-evo（循环 / 演进）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>LOOP</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ ITERATION</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[循环标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:18px;">
      <div class="loop-step fade-item" style="--d:0.1s; --accent: var(--cyan);">
        <div class="loop-step__no">01</div><div class="loop-step__title">[STEP 1]</div>
        <div class="loop-step__desc">[step 1 描述]</div>
        <div class="loop-step__arrow">→</div>
      </div>
      <!-- 02/03/04 类似，最后一个用 ↻ -->
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">while true; do iter.sh; done</span></div>
</section>

<style>
  .loop-step {
    position: relative; padding: 18px 18px 24px;
    background: #ffffff06; border: 1px solid var(--rule);
    border-left: 2px solid var(--accent);
  }
  .loop-step__no {
    font-family: var(--font-display); font-weight: 700; font-style: italic;
    font-size: 24px; color: var(--accent);
    text-shadow: 0 0 10px currentColor; margin-bottom: 8px;
  }
  .loop-step__title { font-family: var(--font-sans); font-weight: 700; font-size: 16px; margin-bottom: 8px; }
  .loop-step__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.55; }
  .loop-step__arrow {
    position: absolute; right: 14px; bottom: 8px;
    font-size: 18px; color: var(--accent); opacity: 0.6;
  }
</style>
```

## 13. repo-tree（仓库目录树）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>TREE · /repo/</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ STRUCTURE</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[仓库结构标题]<span class="cursor"></span></h1>
<pre style="font-family:var(--font-mono); font-size:13px; line-height:1.7; color:var(--fg);">
<span style="color:var(--green);">/repo/</span>
├── <span style="color:var(--cyan);">README.md</span>
├── <span style="color:var(--amber);">package.json</span>
├── <span style="color:var(--cyan);">src/</span>
│   ├── <span style="color:var(--cyan);">index.ts</span>
│   └── <span style="color:var(--cyan);">core/</span>
│       ├── <span style="color:var(--cyan);">engine.ts</span>
│       └── <span style="color:var(--cyan);">parser.ts</span>
</pre>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">tree /repo/ -L 3</span></div>
</section>
```

## 14. yaml-code（YAML / 配置代码块）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>CONFIG · .yaml</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[YAML 配置标题]<span class="cursor"></span></h1>
<pre style="background:#0a1020; border:1px solid var(--rule); padding:24px;
            font-size:13px; line-height:1.7; color:var(--fg); overflow:auto;
            font-family:var(--font-mono);">
<span style="color:var(--fg-dim);"># [配置文件说明]</span>
<span style="color:var(--green);">service</span>:
  <span style="color:var(--cyan);">name</span>: <span style="color:var(--amber);">"example-svc"</span>
  <span style="color:var(--cyan);">replicas</span>: <span style="color:var(--pink);">3</span>
<span style="color:var(--green);">runtime</span>:
  <span style="color:var(--cyan);">timeout</span>: <span style="color:var(--pink);">30s</span>
  <span style="color:var(--cyan);">memory</span>: <span style="color:var(--amber);">"512Mi"</span>
</pre>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">cat config.yaml | less</span></div>
</section>
```

## 15. spectrum-page（全宽 spectrum 大图）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>SPECTRUM · 24 STAGES</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:24px;">[Spectrum 标题]<span class="cursor"></span></h1>
    <p style="font-size:13px; color:var(--fg-dim); margin-bottom:48px;">[一句话解释 spectrum 的含义]</p>
    <div style="background:linear-gradient(to right, #ff2e88 0%, #ee3982 4%, #dd447c 8%, /* … */ #00ff9c 100%);
                height:80px; border:1px solid var(--rule); position:relative;">
      <div style="position:absolute; top:-12px; left:62%; transform:translateX(-50%);
                  padding:3px 8px; background:var(--bg); border:1px solid var(--green);
                  font-size:10px; color:var(--green); letter-spacing:0.18em;
                  box-shadow: 0 0 8px #00ff9c66;">◆ CURRENT · 62%</div>
    </div>
    <div style="display:flex; justify-content:space-between;
                font-family:var(--font-mono); font-size:8px; color:var(--fg-mute); margin-top:6px;">
      <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">spectrum --show current</span></div>
</section>
```

## 16. note-card-page（多并列 note-card）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>NOTES</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[多 note-card 标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
      <div class="note-card note-card--ok"><div class="note-card__icon">✓</div>
        <div><div class="note-card__title">[OK · TITLE]</div><div class="note-card__body">[通过的事项]</div></div>
      </div>
      <div class="note-card note-card--info"><div class="note-card__icon">▸</div>
        <div><div class="note-card__title">[INFO · TITLE]</div><div class="note-card__body">[信息提示]</div></div>
      </div>
      <div class="note-card note-card--warn"><div class="note-card__icon">!</div>
        <div><div class="note-card__title">[WARN · TITLE]</div><div class="note-card__body">[警告事项]</div></div>
      </div>
      <div class="note-card note-card--err"><div class="note-card__icon">✕</div>
        <div><div class="note-card__title">[ERR · TITLE]</div><div class="note-card__body">[错误事项]</div></div>
      </div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">cat /notes.md</span></div>
</section>
```

## 17. harness-table（表格 / Harness 配置）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>HARNESS · 9 ITEMS</span></div>
  <div class="stage" style="padding:60px 80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ TABLE</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:32px;
               letter-spacing:-0.02em; margin-bottom:32px;">[表格标题]<span class="cursor"></span></h1>
    <table style="width:100%; border-collapse:collapse; font-family:var(--font-mono); font-size:13px;">
      <thead><tr style="border-bottom:1px solid var(--rule);">
        <th style="text-align:left; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[COL 1]</th>
        <th style="text-align:left; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[COL 2]</th>
        <th style="text-align:right; padding:10px 16px; color:var(--cyan); font-weight:500; letter-spacing:0.22em; font-size:11px;">[STATUS]</th>
      </tr></thead>
      <tbody>
        <tr class="h-row fade-item" style="--d:0.05s;">
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule);">[ITEM 1]</td>
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule); color:var(--fg-dim);">[desc 1]</td>
          <td style="padding:12px 16px; border-bottom:1px dashed var(--rule); text-align:right;"><span class="badge badge--g">[OK]</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">grep -E 'OK|WIP|TODO' /harness</span></div>
</section>
```

## 18. quadrant（2×2 四象限）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>QUADRANT</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:32px;">[四象限标题]<span class="cursor"></span></h1>
    <div style="display:grid; grid-template-columns:80px 1fr 80px; gap:0; height:540px;">
      <div style="writing-mode:vertical-rl; transform:rotate(180deg); align-self:center;
                  font-size:11px; color:var(--fg-dim); letter-spacing:0.22em;">[Y-AXIS ↑]</div>
      <div style="display:grid; grid-template-rows:1fr 1fr; gap:0; position:relative;">
        <div style="position:absolute; left:0; right:0; top:50%; height:1px; background:var(--rule); z-index:1;"></div>
        <div style="position:absolute; top:0; bottom:0; left:50%; width:1px; background:var(--rule); z-index:1;"></div>
        <div class="quad fade-item" style="--d:0.1s; --accent: var(--cyan);">
          <div class="quad__no">Q1 · TOP-LEFT</div>
          <div class="quad__title">[象限 1]</div>
          <div class="quad__desc">[描述]</div>
        </div>
        <!-- Q2/Q3/Q4 类似 -->
      </div>
      <div style="writing-mode:vertical-rl; align-self:center;
                  font-size:11px; color:var(--fg-dim); letter-spacing:0.22em;">[X-AXIS →]</div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">quadrant --plot</span></div>
</section>

<style>
  .quad {
    padding: 16px 20px;
    background: #ffffff06;
    border-left: 2px solid var(--accent);
    display: flex; flex-direction: column; gap: 6px;
    z-index: 0;
  }
  .quad__no { font-size: 9px; letter-spacing: 0.22em; color: var(--accent); }
  .quad__title { font-family: var(--font-sans); font-weight: 700; font-size: 16px; }
  .quad__desc { font-size: 11px; color: var(--fg-dim); line-height: 1.5; }
</style>
```

## 19. mode-stack（模式对比 / 错位堆叠）

```html
<section class="slide">
  <div class="chrome chrome--top"><span class="dot dot--g"></span><span>MODES · 3 PATTERNS</span></div>
  <div class="stage" style="padding:80px;">
    <div style="font-size:11px; color:var(--cyan); letter-spacing:0.26em; margin-bottom:14px;">◆ [KICKER]</div>
    <h1 style="font-family:var(--font-sans); font-weight:700; font-size:36px;
               letter-spacing:-0.02em; margin-bottom:48px;">[3 种模式对比]<span class="cursor"></span></h1>
    <div style="position:relative; height:340px;">
      <div class="mode-stack fade-item" style="--d:0.1s; --accent: var(--cyan); top:0; left:0;">
        <div class="mode-stack__head">[MODE 1 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
      <div class="mode-stack fade-item" style="--d:0.2s; --accent: var(--amber); top:60px; left:120px;">
        <div class="mode-stack__head">[MODE 2 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
      <div class="mode-stack fade-item" style="--d:0.3s; --accent: var(--pink); top:120px; left:240px;">
        <div class="mode-stack__head">[MODE 3 · 标题]</div>
        <ul><li>[要点 1]</li><li>[要点 2]</li></ul>
      </div>
    </div>
  </div>
  <div class="chrome chrome--bottom"><span class="prompt">compare /modes/</span></div>
</section>

<style>
  .mode-stack {
    position: absolute; width: 320px;
    padding: 16px 18px;
    background: var(--bg-2);
    border: 1px solid var(--rule);
    border-left: 3px solid var(--accent);
    box-shadow: 0 8px 24px #00000060;
    z-index: 1;
  }
  .mode-stack__head {
    font-family: var(--font-sans); font-weight: 700; font-size: 15px;
    color: var(--accent); margin-bottom: 10px;
  }
  .mode-stack ul {
    list-style: none; font-size: 12px; line-height: 1.7; color: var(--fg);
  }
  .mode-stack ul li::before { content: '▸ '; color: var(--accent); }
</style>
```

---
