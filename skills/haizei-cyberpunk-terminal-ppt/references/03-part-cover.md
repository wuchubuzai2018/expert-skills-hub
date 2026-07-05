# 03 · Part Cover（章节封面）

> 把每个章节的起始页做成"./load --part=NN --source=part_NN.md" + 巨型章节标题的样子。
> 假设你已经在 `<body>` 里复制了 `00-design-system.md` 的"完整基础 HTML 底座"。

## 核心原则

1. **极简**：1 行加载命令 + 中文大标题（accent 单词 italic Space Grotesk 绿色辉光）+ 英文 subtitle + `/* ... */` 描述
2. **强装饰**：96px 中文主标 + 68px 英文 subtitle（green italic）+ 闪烁光标 ▌
3. **accent 单词高亮**：标题中间某 1 个词用 `<span class="accent">[词]</span>`，双层 text-shadow 辉光
4. **不做内容列表**（避免与 toc 页重复）
5. **每个章节的 accent 都用绿色**（与 cover 保持一致；不要按章节换色，参考站的做法）
6. **press 提示**：`> press → to [action]_` + 闪烁光标

---

## 变体 A：完整版（中心对齐 · 对齐参考站 slide 3/6/20/25）

> 适用：每个章节起始页

```html
<section class="slide" data-slide="3">
  <div class="panel">
    <!-- ⬇️ Part-Cover 完整布局 ⬇️ -->
    <div class="wrapper" style="text-align:center; flex-direction:column; justify-content:center;
                                align-items:center; width:100%; height:100%; display:flex;">

      <!-- 顶部加载命令 -->
      <div class="part-cmd fade-item" style="--d:.03s;">
        <span class="log-ok">&gt;</span> ./load --part=[NN] --source=part_[NN].md --title="[章节中文标题]"
      </div>

      <!-- 中文大标题（accent 单词高亮） -->
      <h1 class="main-title fade-item" style="--d:.1s;">
        <span>[章节标 1]</span>
        <span class="title-highlight">[accent 词]</span>
        <span>[章节标 2]</span>
      </h1>

      <!-- 英文 subtitle（绿色 italic Space Grotesk） -->
      <div class="english-label fade-item" style="--d:.17s;">[english-keyword]</div>

      <!-- 描述（/* ... */ 注释样式） -->
      <div class="description fade-item" style="--d:.24s;">
        <span class="log-a">/*</span> [一句话描述这个章节要解决什么问题、读完读者能获得什么。]<span class="log-a">*/</span>
      </div>

      <!-- 翻页提示 -->
      <div class="footer-tip fade-item" style="--d:.31s;">
        <span class="log-ok">&gt;</span> press
        <kbd class="kbd-key">→</kbd> to [action]_<span class="blink">▌</span>
      </div>
    </div>
    <!-- ⬆️ Part-Cover 完整布局 ⬆️ -->
  </div>
</section>

<style>
  /* ===== Part Cover 专属样式 ===== */
  .part-cmd {
    font-family: var(--font-mono); font-size: 12px;
    letter-spacing: .26em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 20px;
  }
  .main-title {
    font-family: var(--font-sans); font-weight: 700;
    font-size: 96px; line-height: 1; letter-spacing: -3px;
    color: var(--fg); margin: 0;
  }
  .title-highlight {
    color: var(--green);
    text-shadow: 0 0 18px rgba(0,255,156,.55), 0 0 36px rgba(0,255,156,.2);
    font-family: var(--font-display); font-style: italic; font-weight: 500;
  }
  .english-label {
    color: var(--green);
    text-shadow: 0 0 18px rgba(0,255,156,.55), 0 0 36px rgba(0,255,156,.2);
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    font-size: 68px; letter-spacing: -2.5px;
    margin-top: 12px;
  }
  .description {
    max-width: 720px;
    color: var(--fg-dim);
    border-left: 2px solid var(--green);
    text-align: left;
    margin-top: 40px; padding-left: 18px;
    font-family: var(--font-mono); font-size: 14.5px; line-height: 1.8;
  }
  .footer-tip {
    letter-spacing: .18em; text-transform: uppercase;
    color: var(--fg-dim);
    font-family: var(--font-mono); font-size: 11px;
    margin-top: 36px;
  }
  .kbd-key {
    display: inline-block;
    border: 1px solid var(--rule); letter-spacing: .06em;
    margin: 0 2px; padding: 1px 6px; font-size: 10px;
  }
</style>
```

---

## 变体 B：左右分栏（PART 编号 + 标题）

适合：强调"章节序号"和"章节标题"的同等重要性

```html
<section class="slide" data-slide="3">
  <div class="panel">
    <div class="part-split" style="display:grid; grid-template-columns:1fr 1px 1fr;
                                    padding:80px; gap:60px; align-items:center; height:100%;">

      <!-- 左：编号 -->
      <div class="fade-item" style="--d:.05s; text-align:center;">
        <div class="part-num" style="font-family:var(--font-display); font-weight:700; font-style:italic;
                                    font-size:240px; line-height:.85; color:var(--pink);
                                    text-shadow: 0 0 30px #ff2e8866;">
          [NN]
        </div>
      </div>

      <!-- 中：垂直分隔 -->
      <div style="background:var(--rule); width:1px; height:60%;"></div>

      <!-- 右：标题 -->
      <div>
        <div class="kicker" style="color:var(--pink); margin-bottom:18px;">◆ [LABEL]</div>
        <h1 style="font-family:var(--font-sans); font-weight:700; font-size:64px;
                   letter-spacing:-.02em; margin-bottom:18px;">
          [章节标题]<span class="blink">▌</span>
        </h1>
        <p style="font-size:15px; color:var(--fg-dim); line-height:1.7;">
          [章节描述]
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## 变体 C：背景大字版（章节关键词做背景）

适合：章节有"标志性关键词"（如 / AGENT / SCALE / TEAM）

```html
<section class="slide" data-slide="3">
  <div class="panel">
    <div class="wrapper" style="display:grid; place-items:center; position:relative;
                                overflow:hidden; height:100%;">
      <!-- 背景大字（半透明） -->
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
                  font-family:var(--font-display); font-weight:700; font-style:italic;
                  font-size:520px; color:#5ce1ff0a; line-height:1;
                  pointer-events:none; user-select:none; z-index:0;">
        [KEYWORD]
      </div>

      <div style="position:relative; z-index:1; text-align:center;">
        <div class="kicker" style="color:var(--cyan); margin-bottom:20px;">◆ PART [NN]</div>
        <h1 style="font-family:var(--font-sans); font-weight:700; font-size:72px;
                   letter-spacing:-.02em; margin-bottom:16px;">
          [章节标题]<span class="blink">▌</span>
        </h1>
        <p style="font-size:14px; color:var(--fg-dim);">[一句话描述]</p>
      </div>
    </div>
  </div>
</section>
```

---

## 变体 D：终端命令版（模拟 `cd` + `ls`）

适合：技术分享 / 开发者向 / 强调"进入新工作目录"

```html
<section class="slide" data-slide="3">
  <div class="panel">
    <div class="wrapper" style="padding:80px;">
      <div style="font-family:var(--font-mono); font-size:14px; line-height:2; color:var(--fg);">
        <div><span style="color:var(--green);">$</span> cd /parts/<span style="color:var(--cyan);">[NN]-[slug]</span></div>
        <div><span style="color:var(--fg-dim);">[OK]</span> directory changed</div>
        <div><span style="color:var(--green);">$</span> ls -la</div>
        <div style="color:var(--fg-dim); padding-left:24px;">
          drwxr-xr-x  README.md<br/>
          drwxr-xr-x  CHANGELOG.md<br/>
          drwxr-xr-x  [chapter]/&nbsp;&nbsp;&nbsp;<span style="color:var(--cyan);">← 当前章节</span>
        </div>
        <div style="margin-top:24px;"><span style="color:var(--green);">$</span> cat README.md | head -3</div>
        <div style="color:var(--fg); padding-left:24px; margin-top:8px;
                    font-family:var(--font-sans); font-weight:700; font-size:28px; line-height:1.4;">
          第 [NN] 章：[章节中文标题]<br/>
          <span style="font-size:13px; font-weight:400; color:var(--fg-dim);">[未来 12 个月的演进方向]</span>
        </div>
        <div style="margin-top:24px;"><span style="color:var(--green);">$</span> _<span class="blink">▌</span></div>
      </div>
    </div>
  </div>
</section>
```

---

## Checklist

- [ ] **window-chrome / corner / footer 三件套都在**（corner 写 `[ 03 / 37 ] PART 0`）
- [ ] **变体 A 必有顶部加载命令**：`./load --part=NN --source=part_NN.md --title="..."`
- [ ] **主标题 96px + 英文 subtitle 68px green italic**（变体 A 关键尺寸）
- [ ] **accent 单词高亮**用 `<span class="title-highlight">[词]</span>`，双层 text-shadow
- [ ] **描述用 `/* ... */` 注释样式** + 左侧 2px 绿色 border-left
- [ ] **press 提示必含闪烁光标** ▌
- [ ] **每个章节的 accent 都用绿色**（不按章节换色）
- [ ] **底部 press 末尾**必须有下划线 + 光标（模拟"等待输入"）

## 失败模式

| 失败 | 原因 | 修复 |
|---|---|---|
| 和 cover 看起来一样 | 没有 accent 单词高亮 | 标题中间必须有 1 个 `<span class="title-highlight">` |
| 章节之间没有视觉差异 | 所有都用同色 | accent 都用绿色（参考站做法），靠命令/标题区分章节 |
| accent 单词不突出 | 没 text-shadow | 双层 text-shadow：0 0 18px + 0 0 36px |
| 描述太"营销" | 用居中 + 大字 | 改用左对齐 + 2px 绿色 border-left + `/* */` 注释样式 |
| 英文 subtitle 用了中文 | 不是 italic Space Grotesk | 用 `font-family: var(--font-display); font-style: italic` |

---

## 变体 E：中文主标题版（纯中文 + 单词/短语英文副标题 · 对齐参考站 slide 20/25/34）

> 适用于"以中文为主标题、英文只是单词或短语补充"的章节封面。
> 与变体 A 的区别：英文 subtitle 从 68px italic 大字 → 改为单词级（`team` / `roadmap / rollout` / `faq / objection handling`），中文标题占主导。

**代表 slide**：
- 20 · `AI 全栈团队` + `team`
- 25 · `落地场景 · 常见 Q&A` + `faq / objection handling`
- 34 · `AI Coding 落地路线图` + `roadmap / rollout`

**HTML 骨架**：
```html
<section class="slide" data-kind="part-cover-cn">
  <!-- 顶部命令行 -->
  <div class="load-cmd">&gt; ./LOAD --PART=03 --SOURCE=PART_03.MD --TITLE="AI 全栈团队"</div>

  <!-- 主标题（中文 + 中点分隔 + accent 高亮） -->
  <h1 class="cn-title">
    <span class="cn">AI</span>
    <span class="dot">·</span>
    <span class="cn accent">全栈团队</span>
  </h1>

  <!-- 英文副标题（单词级 + italic + green glow） -->
  <div class="en-subtitle">team</div>

  <!-- 描述 -->
  <div class="cn-desc">/* 客户问工具，真正想问的是：团队怎么变、流程怎么改、结果怎么更稳。三个阶段，不可跳级。 */</div>

  <!-- PRESS 提示 -->
  <div class="press-hint">&gt; PRESS <kbd>→</kbd> TO CONTINUE <span class="blink">▌</span></div>
</section>
```

**CSS**：
```css
.part-cover-cn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; height: 100%; gap: 20px;
}
.load-cmd { font: 13px/1.5 var(--font-mono); color: var(--green); letter-spacing: 0.5px; }
.cn-title {
  font: 700 96px/1.1 var(--font-display); color: var(--text);
  margin: 0; display: flex; gap: 24px; align-items: baseline; flex-wrap: wrap; justify-content: center;
}
.cn-title .dot { color: var(--text); opacity: 0.4; font-weight: 300; font-size: 72px; }
.cn-title .accent { color: var(--green); text-shadow: 0 0 32px rgba(0,255,156,0.4); }
.en-subtitle {
  font: italic 600 56px/1.2 var(--font-display); color: var(--green);
  text-shadow: 0 0 24px rgba(0,255,156,0.5);
}
.en-subtitle.long { font-size: 42px; letter-spacing: 0.5px; }
.cn-desc {
  font: 14px/1.7 var(--font-mono); color: var(--text-dim);
  border-left: 2px solid var(--green); padding-left: 16px; margin-top: 24px; max-width: 760px; text-align: left;
}
.press-hint { font: 12px var(--font-mono); color: var(--text-dim); margin-top: 32px; letter-spacing: 1.5px; }
.press-hint kbd { display: inline-block; padding: 2px 8px; border: 1px solid var(--text-dim); border-radius: 3px; margin: 0 4px; }
```

**与变体 A 的对比**：

| 维度 | 变体 A（中文 + 英文 subtitle 大字） | 变体 E（中文主导 + 单词副标题）|
|---|---|---|
| 中文标题 | 96px 中等占比 | **96px 占主导** |
| 英文副标题 | **68px italic 大字**（`harness engineering` 完整短语） | **42-56px italic 单词/短语**（`team` / `roadmap / rollout`） |
| 用途 | 中英并列介绍概念 | 中文为主、英文为补充标签 |
| 适合章节 | Part 1 / Part 2 概念性章节 | Part 3 / Part 4 实施性章节 |

**注意事项**：
- 英文副标题超 2 个单词时，加 `.long` 类（42px）保持视觉平衡
- `·` 中点必须用半角 + 两侧空格，避免挤压
- 中文与 accent 单词的色彩对比：accent 单词用绿色 + glow，主体中文用白色