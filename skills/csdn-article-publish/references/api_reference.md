# CSDN Blog API Reference

## API Endpoint

- **URL**: `https://bizapi.csdn.net/blog-console-api/v3/mdeditor/saveArticle`
- **Method**: POST
- **Content-Type**: application/json

## Request Headers

备注：可以使用浏览器开发者工具中，先尝试保存一次草稿状态的文章的操作后，从请求头中进行获取
| Header | Required | Description |
|--------|----------|-------------|
| Cookie | Yes | 用户登录Cookie |
| x-ca-nonce | Yes | UUID字符串 |
| x-ca-signature | Yes | Base64签名 |
| x-ca-signature-headers | Yes | 签名头列表，如 "x-ca-key,x-ca-nonce" |
| x-ca-key | Yes | API Key |

## Request Body Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| id | Update Only | - | 文章ID，更新时必需 |
| title | Yes | - | 文章标题 |
| content | Yes | - | HTML 格式正文内容 |
| markdowncontent | Yes | - | Markdown格式文章内容 |
| pubStatus | No | draft | 发布状态: draft/publish |
| readType | No | public | 可见范围 |
| type | No | original | 文章类型 |
| tags | No | - | 标签，逗号分隔，最多5个 |
| categories | No | - | 分类 |
| Description | No | - | 摘要，最大256字,发布时需要填写 |
| creation_statement | No | 0 | 创作声明 0=无声明(默认值), 1=部分内容由AI辅助生成, 2=内容来源网络进行整合创作, 3=个人观点，仅供参考 |
| status | No | 2 | 状态 2-草稿 0-发布 |
| cover_type | No | 1 | 封面类型 |
| authorized_status | No | false | 授权状态 |
| source | No | pc_mdeditor | 来源 |

## Field Values

### pubStatus
- `draft` - 草稿状态
- `publish` - 发布状态

### readType
- `public` - 全部可见
- `private` - 仅我可见
- `read_need_fans` - 粉丝可见
- `read_need_vip` - VIP可见

### type
- `original` - 原创
- `repost` - 转载
- `translated` - 翻译

### creation_statement
- `0` - 无声明
- `1` - 部分内容由AI辅助生成
- `2` - 内容来源于网络，进行整合再创作
- `3` - 个人看法，仅供参考

## Response

```json
{
  "code": 200,
  "traceId": "xxx",
  "data": {
    "url": "https://blog.csdn.net/xxx/article/details/xxx",
    "id": 123456,
    "qrcode": "xxx",
    "title": "文章标题",
    "description": ""
  },
  "msg": "success"
}
```
