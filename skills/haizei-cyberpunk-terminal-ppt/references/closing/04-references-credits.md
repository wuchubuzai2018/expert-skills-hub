# 04 · 参考资料 + 致谢（References + Credits）

> **A17. referencesAndCredits** — 当演讲引用了大量外部资料时，给出完整出处
> 适合学术分享、技术深度内容、含原论文 / 官方文档引用的演讲。

## 视觉锚点

- **顶部**：`REFERENCES · 参考资料` + `本场引用 12 处 · 按来源分类` 副标题
- **主体 2 列布局**：
  - **左 50%**：分类链接列表（4 类）
    - 📘 官方文档 / 📄 研究论文 / 🛠 工具仓库 / 📰 行业报道
    - 每条：[来源徽章] + 链接 + 一句话摘要
  - **右 50%**：致谢区
    - 顶部：特别致谢（contributors 头像占位 / 名字列表）
    - 中部：灵感来源（"本 PPT 受 XXX 启发"）
    - 底部：版权说明（CC BY-SA 4.0 / 仅供学习交流）
- **底部**：`// CREDITS` 条 + 演讲者联系信息（一行）

## HTML 骨架

```html
<section class="slide" data-kind="references-credits">
  <header class="ref-header">
    <h1 class="ref-title">REFERENCES <em>· 参考资料</em></h1>
    <p class="ref-sub">本场引用 12 处 · 按来源分类 · 链接直达原文</p>
  </header>

  <div class="ref-body">
    <!-- 左：参考资料 -->
    <div class="ref-list">
      <div class="ref-cat" data-cat="doc">
        <header class="rc-h"><span class="rc-icon">📘</span><span class="rc-name">官方文档 / Official Docs</span><span class="rc-count">5</span></header>
        <ul class="rc-items">
          <li>
            <a href="#" class="rc-link">Anthropic · Building Effective Agents</a>
            <span class="rc-desc">Agent 设计的官方方法论，本场多处引用</span>
          </li>
          <li>
            <a href="#" class="rc-link">Claude Code Docs · Best Practices</a>
            <span class="rc-desc">CLI 模式 / 工作环境组件的官方说明</span>
          </li>
          <li>
            <a href="#" class="rc-link">Harness Engineering Guide · 2026</a>
            <span class="rc-desc">"Harness = 上下文 + 工具 + 治理"概念来源</span>
          </li>
          <li>
            <a href="#" class="rc-link">Skills Spec · 2026.06</a>
            <span class="rc-desc">Skill 描述字段的官方格式说明</span>
          </li>
          <li>
            <a href="#" class="rc-link">MCP Protocol Spec</a>
            <span class="rc-desc">Model Context Protocol 协议规范</span>
          </li>
        </ul>
      </div>

      <div class="ref-cat" data-cat="paper">
        <header class="rc-h"><span class="rc-icon">📄</span><span class="rc-name">研究论文 / Research</span><span class="rc-count">3</span></header>
        <ul class="rc-items">
          <li>
            <a href="#" class="rc-link">Fiona Fung · Running an AI-native engineering org</a>
            <span class="rc-desc">Claude SF 2026 · AI 原生工程团队的方法论</span>
          </li>
          <li>
            <a href="#" class="rc-link">Thariq Shihipar · Building Skills · 2026.06</a>
            <span class="rc-desc">Anthropic 官方 Skill 制作经验总结</span>
          </li>
          <li>
            <a href="#" class="rc-link">SWE-bench · Agent Evaluation · 2025</a>
            <span class="rc-desc">Agent 在真实代码库的评测基准</span>
          </li>
        </ul>
      </div>

      <div class="ref-cat" data-cat="repo">
        <header class="rc-h"><span class="rc-icon">🛠</span><span class="rc-name">工具仓库 / Repos</span><span class="rc-count">3</span></header>
        <ul class="rc-items">
          <li>
            <a href="#" class="rc-link">anthropics/skills</a>
            <span class="rc-desc">Anthropic 官方 Skills 仓库</span>
          </li>
          <li>
            <a href="#" class="rc-link">spec-kit/spec-kit</a>
            <span class="rc-desc">Spec-Driven Development 工具链</span>
          </li>
          <li>
            <a href="#" class="rc-link">modelcontextprotocol/servers</a>
            <span class="rc-desc">MCP 官方 server 列表</span>
          </li>
        </ul>
      </div>

      <div class="ref-cat" data-cat="news">
        <header class="rc-h"><span class="rc-icon">📰</span><span class="rc-name">行业报道 / Press</span><span class="rc-count">1</span></header>
        <ul class="rc-items">
          <li>
            <a href="#" class="rc-link">The Pragmatic Engineer · AI Engineering · 2026</a>
            <span class="rc-desc">"AI Engineering" 概念的行业定义</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 右：致谢 + 版权 -->
    <div class="credits">
      <div class="cr-block">
        <h3 class="cr-h">// SPECIAL THANKS · 特别致谢</h3>
        <div class="cr-list">
          <span class="cr-name">@flynnji</span><span class="cr-role">设计 / 主讲</span>
          <span class="cr-name">@archiver-bot</span><span class="cr-role">知识沉淀</span>
          <span class="cr-name">腾讯 KM 团队</span><span class="cr-role">12 份实战文档</span>
          <span class="cr-name">Claude SF 2026 观众</span><span class="cr-role">方法论反馈</span>
        </div>
      </div>

      <div class="cr-block">
        <h3 class="cr-h">// INSPIRED BY · 灵感来源</h3>
        <p class="cr-text">本 PPT 设计与排版参考 Anthropic 官方文档风格、Cyberpunk 终端美学、Hexo 技术博客排版。</p>
      </div>

      <div class="cr-block license">
        <h3 class="cr-h">// LICENSE · 版权说明</h3>
        <p class="cr-text"><b>CC BY-SA 4.0</b> · 署名 - 相同方式共享 · 可自由复制、修改、再发布，但需保留作者署名并采用相同许可证。</p>
        <p class="cr-text warn">⚠ 仅供学习交流使用 · 商业使用请联系作者授权</p>
      </div>

      <div class="cr-block contact">
        <h3 class="cr-h">// CONTACT</h3>
        <p class="cr-text">作者 <b style="color:var(--green)">flynnji</b> · 客户成功中心 · <code>flynnji@yourdomain.com</code></p>
      </div>
    </div>
  </div>

  <footer class="ref-foot">
    <span class="rf-tag">// CREDITS</span>
    <span class="rf-text">本 PPT 由 flynnji 制作于 2026.06 · v1.0 · 渲染工具：haizei-cyberpunk-terminal-ppt</span>
  </footer>
</section>
```

## CSS

```css
.references-credits {
  display: flex; flex-direction: column; gap: 12px; height: 100%;
}
.ref-header { padding: 4px 0 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.ref-title {
  font: 700 28px var(--font-display); color: var(--text); margin: 0;
}
.ref-title em { color: var(--cyan); font-style: normal; }
.ref-sub { font: 12px var(--font-mono); color: var(--text-dim); margin: 4px 0 0; }

.ref-body { display: grid; grid-template-columns: 5fr 4fr; gap: 14px; flex: 1; min-height: 0; }

.ref-list { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; padding-right: 4px; }
.ref-cat { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; background: rgba(20, 30, 48, 0.3); }
.rc-h { display: flex; gap: 8px; align-items: baseline; margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.06); }
.rc-icon { font-size: 14px; }
.rc-name { font: 700 12px var(--font-mono); color: var(--green); letter-spacing: 1px; flex: 1; }
.rc-count { font: 10px var(--font-mono); color: var(--text-dim); padding: 1px 5px; border: 1px solid var(--text-dim); border-radius: 2px; }
.rc-items { list-style: none; padding: 0; margin: 0; }
.rc-items li { padding: 3px 0; display: grid; grid-template-columns: 1fr; gap: 1px; }
.rc-link { font: 11px/1.4 var(--font-mono); color: var(--cyan); text-decoration: none; }
.rc-link:hover { color: var(--green); }
.rc-desc { font: 10px/1.3 var(--font-sans); color: var(--text-dim); padding-left: 12px; }

.credits { display: flex; flex-direction: column; gap: 10px; }
.cr-block { padding: 10px 14px; border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; background: rgba(20, 30, 48, 0.3); }
.cr-h { font: 700 11px var(--font-mono); color: var(--amber); letter-spacing: 1.5px; margin: 0 0 6px; }
.cr-list { display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; }
.cr-name { font: 11px var(--font-mono); color: var(--green); }
.cr-role { font: 11px var(--font-sans); color: var(--text-dim); }
.cr-text { font: 11px/1.5 var(--font-sans); color: var(--text-dim); margin: 0; }
.cr-text b { color: var(--green); }
.cr-text code { color: var(--amber); background: rgba(255,176,32,0.1); padding: 1px 5px; border-radius: 2px; font: 11px var(--font-mono); }
.cr-text.warn { color: var(--amber); margin-top: 4px; }

.license { border-color: rgba(0,255,156,0.2); background: rgba(0,255,156,0.03); }
.contact { border-color: rgba(92,225,255,0.2); }

.ref-foot {
  display: flex; gap: 12px; align-items: center; padding: 8px 12px;
  border-top: 1px solid rgba(255,255,255,0.06); font: 11px var(--font-mono); color: var(--text-dim);
}
.rf-tag { color: var(--amber); letter-spacing: 1.5px; }
.rf-text { color: var(--text-dim); }
```

## Checklist

- [ ] 参考资料分类清晰（≥ 4 类：文档/论文/仓库/报道）
- [ ] 每条链接 + 一句话摘要（不只是裸 URL）
- [ ] 致谢部分 ≥ 3 类（设计/内容/灵感来源）
- [ ] 版权说明明确（CC BY / CC BY-SA / 仅学习交流）
- [ ] 联系方式在右下或底部
- [ ] slide-corner 写 `[ NN / 37 ] REFERENCES`

## 何时用

- ✅ 学术 / 研究分享，引用大量论文
- ✅ 技术深度内容，含官方文档链接
- ✅ 开源项目演讲，致谢 contributors
- ✅ 客户内部分享，附 KM 内部链接
- ❌ 短演讲（<10 张），不需要 references 页
- ❌ 内部团队 sync（用 A14 thanks+QA 即可）