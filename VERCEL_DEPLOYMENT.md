# Vercel 部署指南

你的项目已经配置好可以部署到 Vercel。按照以下步骤进行：

## 第一步：准备环境变量

### 1.1 检查 .env.local 文件
确保你有 `.env.local` 文件，包含以下变量：
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

### 1.2 获取你的环境变量值
- **TURSO_CONNECTION_URL** 和 **TURSO_AUTH_TOKEN**：从 Turso 控制面板获取
- **NEXTAUTH_SECRET**：使用 `openssl rand -base64 32` 生成
- **NEXTAUTH_URL**：Vercel 部署后，这应该是 `https://yourdomain.vercel.app`

## 第二步：在 Vercel 上部署

### 2.1 访问 Vercel 并授权 GitHub
1. 打开 https://vercel.com
2. 登录或创建账户
3. 点击 "Import Project"
4. 选择 "Import Git Repository"
5. 找到 **Enhanced-Dynamic-MBTI** 仓库并选择

### 2.2 配置项目设置
1. **Project Name**：Enhanced-Dynamic-MBTI（可自定义）
2. **Framework**：自动识别为 Next.js
3. **Root Directory**：.（项目根目录）

### 2.3 配置环境变量
在 "Environment Variables" 部分添加：
- `TURSO_CONNECTION_URL`
- `TURSO_AUTH_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` = `https://yourdomain.vercel.app`

### 2.4 点击 Deploy
等待构建完成（通常需要 2-3 分钟）

## 第三步：部署后配置

### 3.1 更新数据库连接
如果使用 Turso 数据库，确保：
- 数据库已创建
- 迁移已运行（Vercel 会在构建时自动运行）

### 3.2 验证应用
1. 访问 `https://yourdomain.vercel.app`
2. 测试登录/注册功能
3. 检查控制台日志

## 问题排除

### 构建失败
- 检查 Node.js 版本（需要 18+）
- 查看构建日志获取详细错误信息
- 确保所有依赖都正确安装

### 环境变量未生效
- 重新部署（在 Deployments 中点击 "Redeploy"）
- 确保变量值正确（不要有多余空格）

### 数据库连接问题
- 验证 TURSO_CONNECTION_URL 和 TURSO_AUTH_TOKEN
- 检查数据库是否在线
- 查看应用日志

## 自定义域名（可选）

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的自定义域名
3. 按照指示更新 DNS 记录
4. 更新 NEXTAUTH_URL 为新域名

---

需要帮助？查看 [Vercel Next.js 文档](https://vercel.com/docs/frameworks/nextjs)
