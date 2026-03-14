# CSDN Article Publish Troubleshooting

## 1. 配置校验直接失败

如果脚本在发送请求前直接退出，通常是本地前置校验拦住了常见错误：

- `headers.Cookie` 缺失或仍是示例值：重新登录 CSDN 后，从 `saveArticle` 请求复制最新 Cookie
- `x-ca-nonce` / `x-ca-signature` / `x-ca-key` 缺失：说明请求头没有完整复制
- `x-ca-signature-headers` 不包含 `x-ca-key,x-ca-nonce`：签名链不完整，请重新抓包
- `tags` 超过 5 个：删减为最多 5 个标签
- `description` 超过 256 字：压缩摘要内容
- `publish` 模式缺少 `description`：补充摘要后再发布

## 2. 哪些请求头最容易过期

以下字段最容易失效或变化：

- `Cookie`：登录态过期后会失效
- `x-ca-nonce`：通常与当前请求相关，重新抓一次最稳妥
- `x-ca-signature`：签名字段，经常随请求变化

相对更稳定但仍建议一起更新的字段：

- `x-ca-signature-headers`
- `x-ca-key`

最稳妥的做法不是只替换单个字段，而是重新打开编辑器并重新抓取一整组 `saveArticle` 请求头。

## 3. 如何刷新签名相关字段

建议按以下流程刷新：

1. 登录 CSDN，并打开 Markdown 编辑器页面
2. 随便填写一个标题和一段正文
3. 点击一次“保存草稿”
4. 打开浏览器开发者工具，进入 Network
5. 找到 `saveArticle` 请求
6. 从请求头中完整复制以下字段到 `csdn_config.json`

- `Cookie`
- `x-ca-nonce`
- `x-ca-signature`
- `x-ca-signature-headers`
- `x-ca-key`

不要只更新其中一个字段，否则经常会出现签名不匹配的问题。

## 4. 保存草稿失败时先看什么

优先排查顺序：

1. 本地前置校验是否已经报错
2. `Cookie` 是否还是当前登录会话
3. `x-ca-nonce` 和 `x-ca-signature` 是否是最新抓取的值
4. 是否短时间内频繁保存导致限流
5. Markdown 文件是否为空、标题是否为空

如果接口返回了 `traceId`，建议保留它，方便后续定位具体请求。

## 5. 发布失败时先看什么

相比草稿保存，发布更容易因为字段不完整失败。重点检查：

1. `description` 是否已提供，且长度不超过 256 字
2. `readType`、`type`、`creation_statement` 是否是支持的值
3. `tags` 是否超过 5 个
4. 当前文章 ID 是否正确，或本地 `csdn_article_map.json` 是否映射到了正确文章

如果你是基于 `--file` 自动复用文章 ID，先检查 `csdn_article_map.json` 里该文件对应的 `id` 和 `url` 是否正确。

## 6. 限流怎么处理

CSDN 接口会出现限流。建议：

- 单次保存或更新之间至少间隔 5 到 10 秒
- 不要在短时间内批量连续发布多篇文章
- 一旦提示限流，先等待一段时间再继续

## 7. 本地文章映射失效怎么办

`csdn_article_map.json` 用来保存 Markdown 文件与文章 ID 的对应关系。如果映射错了：

- 直接删除错误条目后重新执行一次 `save`
- 或者在 `update` / `publish` 时显式传入 `--id` 覆盖映射

如果你移动了 Markdown 文件路径，映射键也会变化。最简单的修复方式是用新路径重新执行一次 `save` 或带 `--id` 的 `update`。