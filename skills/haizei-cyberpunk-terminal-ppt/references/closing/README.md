# Closing Pages · 收尾页导航

> 当 PPT 内容页全部讲完后，最后 1-3 张用来"收尾"。
> 收尾页的目标：让听众记得住 → 知道下一步做什么 → 留有联系渠道。

## 何时读哪个文件

| 文件 | 何时读 | 适用场景 |
|---|---|---|
| [01-thanks-qa.md](01-thanks-qa.md) | PPT 结束时 | 主收尾页：致谢 + Q&A 邀请（slide 37 同款） |
| [02-cta-contact.md](02-cta-contact.md) | 演讲结束 / 留资环节 | 行动号召 + 联系方式 + 二维码 + 后续链接 |
| [03-recap-summary.md](03-recap-summary.md) | 关键观点多 / 培训场景 | 关键回顾：3-5 个 takeaway 卡片 |
| [04-references-credits.md](04-references-credits.md) | 内容引用多 / 学术演讲 | 参考资料 + 致谢 + 版权说明 |

## 设计要点（4 种收尾页通用）

- **window-chrome / slide-corner / line-numbers 三件套必须有**（但 slide-corner 内容改为 `OPEN FLOOR` / `END` / `Q&A` 等收尾标识）
- **slide-corner 颜色**：用绿色（accent）表示"完成"，与内容页区分
- **slide-ref 区域**：写 `SESSION END` / `THANKS FOR WATCHING` 等告别词
- **press 提示**：去掉（收尾页不需要再翻页）；如需要回放，可加 `> PRESS [R] TO REWIND`
- **底部 footer-bar**：3 色 legend 可保留，但建议把 GREEN 改为 `END` / `Q&A` 等标识

## 视觉变体速查

| 变体 | 主调 | 适用 |
|---|---|---|
| **致谢大字** | 中文/英文大字号居中 | 通用 |
| **CTA + 二维码** | 行动号召按钮 + 二维码占位 + 联系方式 grid | 商务演讲 |
| **关键 takeaway 卡片** | 3-5 张并排小卡 | 培训 / 工作坊 |
| **参考资料列表** | 分类链接 + 来源徽章 | 学术 / 技术深度分享 |

## 与 slide 37（heroCard+discussCard）的关系

`01-thanks-qa.md` 是 slide 37 的 **强化版**：
- 同样有"致谢大字 + Q&A 邀请"的核心结构
- 新增可选的 **CTA 双卡**（"扫码加群" + "查看完整 PPT"）
- 更明确的"演讲结束"标识（slide-corner / footer-bar / chrome 改动）
- 去掉原来冗余的 footer open floor 双 footer（合并为一个）

如果你的收尾页比较简单（不需联系方式、不需 Q&A 引导），直接用 slide 37 的 `heroCard + discussCard + footer open floor` layout 即可（见 [07-advanced-layouts.md](../07-advanced-layouts.md) 第 8 节）。