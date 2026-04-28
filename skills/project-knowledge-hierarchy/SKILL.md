---
name: project-knowledge-hierarchy
description: 项目知识分层维护技能，根据三层架构（项目层→技术层→资产层）生成标准化项目文档目录结构。支持初始化和增量维护。当用户需要创建项目知识管理文档、维护项目资产文档、规划项目文档体系、生成项目文档目录时使用此技能。
---

# Project Knowledge Hierarchy

## Overview

项目知识分层模型将项目知识分为三个层级，从上到下依次为：

- **项目层 (Project Layer)** - 业务方向、核心流程、架构设计
- **技术层 (Technology Layer)** - 中间件、编码规范、第三方库、接口文档
- **资产层 (Assets Layer)** - 产品需求、技术方案、测试用例、Bug记录

各层级之间遵循单向依赖原则：上层文档可引用下层文档，禁止反向依赖（项目层 → 技术层 → 资产层）。

## 目录结构

```
docs/
├─ README.md                  # 顶层总览：三层结构说明、快速导航、维护规范
├─ 01-project-layer
│  ├─ 01-project-overview
│  ├─ 02-core-process
│  ├─ 03-architecture
│  └─ README.md
├─ 02-technology-layer
│  ├─ 01-middleware-config
│  ├─ 02-coding-standards
│  ├─ 03-third-party-libraries
│  ├─ 04-api-docs
│  └─ README.md
└─ 03-assets-layer
   ├─ 01-prd-docs
   ├─ 02-technical-solutions
   ├─ 03-test-cases
   ├─ 04-bug-records
   └─ README.md
```

## 执行步骤

### Step 1: 询问目录位置

首先询问用户文档目录的创建位置：

> 请确认文档目录的创建位置，默认在当前工程的 `docs` 目录下创建。

根据用户回答确定目标路径，如用户无输入，默认在 `docs/` 目录下创建。

### Step 2: 检查已有目录

在创建前检查目标路径是否已存在文档结构：

```bash
# 检查目标目录是否已存在
if [ -d "$TARGET_DIR" ]; then
  echo "检测到已有目录结构，将仅创建缺失的目录和文件，不会覆盖已有内容。"
fi
```

如果目录已存在，进入增量模式：只创建缺失的子目录，不覆盖已有的 README.md。

### Step 3: 选择生成模式

根据用户需求和项目类型选择模式：

| 模式 | 说明 | 输出内容 |
|------|------|----------|
| 完整模式 | 生成全部三层结构 | 全部 11 个子目录 + 4 个 README.md |
| 单层模式 | 只生成指定层级 | 指定层的子目录 + 1 个 README.md |
| 自定义模式 | 用户选择需要的子目录 | 用户勾选的子目录 + 对应 README.md |

询问用户：

> 请选择生成模式：完整模式（推荐）/ 单层模式 / 自定义模式？

如用户无明确选择，默认使用完整模式。

### Step 4: 创建目录结构

根据用户的系统环境，创建目录（使用 `-p` 确保幂等，已有目录不受影响）：

```bash
# 示例：创建完整三层结构
mkdir -p docs/01-project-layer/{01-project-overview,02-core-process,03-architecture}
mkdir -p docs/02-technology-layer/{01-middleware-config,02-coding-standards,03-third-party-libraries,04-api-docs}
mkdir -p docs/03-assets-layer/{01-prd-docs,02-technical-solutions,03-test-cases,04-bug-records}
```

### Step 5: 初始化 README 文件

仅在 README.md 不存在时创建，避免覆盖用户已有内容。

#### docs/README.md（顶层总览）

```markdown
# 项目文档中心

## 知识分层结构

本项目文档按三层架构组织，上层可引用下层，禁止反向依赖。

| 层级 | 目录 | 职责 |
|------|------|------|
| 项目层 | [01-project-layer](./01-project-layer/) | 业务方向、核心流程、架构设计 |
| 技术层 | [02-technology-layer](./02-technology-layer/) | 中间件配置、编码规范、第三方库、接口文档 |
| 资产层 | [03-assets-layer](./03-assets-layer/) | 产品需求、技术方案、测试用例、Bug记录 |

## 维护规范

- 目录名使用英文，中划线分隔，数字前缀排序
- 文档格式统一使用 Markdown
- 新增文档请参考各层 README.md 中的归档指引
```

#### 各层 README.md 模板

为每个层级根目录创建 README.md，包含目录说明和归档指引：

```markdown
# [层级名称]

## 目录说明

| 目录 | 用途 | 包含内容 |
|------|------|----------|
| ... | ... | ... |

## 归档指引

新增文档时，请根据以下规则选择目录：
- [根据该层各子目录的职责，给出 1-2 句判断标准]
```

## 各目录内容说明

### 01-project-layer（项目层）

| 目录 | 用途 | 包含内容 |
|------|------|----------|
| `01-project-overview` | 项目概览 | 项目背景、目标、范围、里程碑计划 |
| `02-core-process` | 核心流程 | 业务流程图、业务规则、关键节点 |
| `03-architecture` | 架构设计 | 系统架构图、模块划分、技术选型理由 |
| `README.md` | 层说明 | 项目层目录结构说明和维护规范 |

### 02-technology-layer（技术层）

| 目录 | 用途 | 包含内容 |
|------|------|----------|
| `01-middleware-config` | 中间件配置 | 数据库、缓存、消息队列等服务配置 |
| `02-coding-standards` | 编码规范 | 命名规范、代码风格、注释要求 |
| `03-third-party-libraries` | 第三方库 | 依赖清单、版本说明、License 清单 |
| `04-api-docs` | 接口文档 | API 接口定义、请求响应示例、错误码说明 |
| `README.md` | 层说明 | 技术层目录结构说明和维护规范 |

### 03-assets-layer（资产层）

| 目录 | 用途 | 包含内容 |
|------|------|----------|
| `01-prd-docs` | 产品需求 | PRD 文档、功能清单、需求评审记录 |
| `02-technical-solutions` | 技术方案 | 技术方案设计、详细设计文档、评审记录 |
| `03-test-cases` | 测试用例 | 测试计划、测试用例、测试报告 |
| `04-bug-records` | Bug 记录 | 历史 Bug 清单、问题原因分析、修复记录 |
| `README.md` | 层说明 | 资产层目录结构说明和维护规范 |

## 增量维护指引

当项目已有文档需要归档到此结构时：

1. **识别文档类型** — 根据文档内容判断属于哪个层级、哪个子目录
2. **移动或链接** — 将文档移动到对应目录，或在对应目录创建链接
3. **更新 README** — 在对应层级的 README.md 中补充文档条目说明

新增文档的归档决策树：

```
文档是否描述业务目标/流程/架构？
  → 是 → 01-project-layer（根据内容选子目录）
  → 否 → 文档是否描述技术配置/规范/接口？
           → 是 → 02-technology-layer
           → 否 → 03-assets-layer（需求/方案/测试/Bug）
```

## 维护规范

1. **命名规范**: 目录名使用英文，中划线分隔，数字前缀用于排序
2. **文档格式**: README.md 使用 Markdown 格式，代码示例使用代码块
3. **层级原则**: 上层文档可引用下层文档，禁止反向依赖（项目层 → 技术层 → 资产层）
4. **版本管理**: 文档随代码版本更新，保持同步
5. **幂等操作**: 重复执行技能时只补充缺失内容，不覆盖已有文件