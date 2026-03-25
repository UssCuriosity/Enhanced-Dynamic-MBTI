# Enhanced Dynamic MBTI - 动态人格边界建模系统

> **在线体验**: [https://enhanced-dynamic-mbti.vercel.app](https://enhanced-dynamic-mbti.vercel.app)
>
> 注册账号即可开始你的 14-21 天动态人格测试，无需本地部署。

通过 14-21 天的连续每日问卷测量，在 N-S、T-F、J-P 三维空间中构建你的"性格边界"模型。

## 核心理念

传统 MBTI 给出静态的四字母标签，但人的性格每天都在波动。本系统通过持续测量，找到性格波动的范围和边界。

- **三维空间**: N-S（信息获取）、T-F（决策方式）、J-P（生活方式）
- **E/I 作为修饰因子**: 独立测量，影响最终报告分析
- **边界模型**: 凸包 + 95%置信椭球 + 质心 + 趋势分析

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Three.js (@react-three/fiber + @react-three/drei) — 3D 性格空间可视化
- NextAuth.js (JWT 认证)
- Recharts (图表)
- Prisma + Turso (libSQL 云数据库)
- 部署于 Vercel

## 数据存储

线上版本使用 [Turso](https://turso.tech) 云数据库（基于 libSQL，兼容 SQLite），通过 Prisma ORM 管理。本地开发时自动回退到 SQLite 文件数据库，无需额外安装数据库软件。

数据模型包含：

- **User** — 用户信息（昵称、邮箱、加密后的密码）
- **TestPlan** — 测试计划及其状态
- **DailySession** — 每日问卷的完整回答记录
- **DailyScore** — 每日的三维坐标评分
- **BoundaryModel** — 性格边界模型数据（凸包、置信椭球、质心、统计分析）

## 快速开始（macOS）

从零开始，在一台全新的 Mac 上把项目跑起来。

### 1. 安装 Homebrew（macOS 包管理器）

打开 **终端**（Terminal.app，在「启动台 → 其他」或按 `Cmd + 空格` 搜索 "终端"），粘贴以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装完成后，终端会提示你执行几行命令来把 Homebrew 加入环境变量（通常是两行 `echo` 和 `eval` 命令），**按提示复制粘贴执行即可**。

验证安装：

```bash
brew --version
```

能看到版本号说明安装成功。

### 2. 安装 Node.js

本项目使用 Next.js 16，需要 **Node.js >= 18.18.0**。推荐安装最新 LTS 版本：

```bash
brew install node
```

验证安装：

```bash
node --version   # 应输出 v18.x 或更高
npm --version    # 应输出 9.x 或更高
```

### 3. 安装 Git 并下载代码

macOS 通常自带 Git，如果没有：

```bash
brew install git
```

克隆项目：

```bash
git clone https://github.com/UssCuriosity/Enhanced-Dynamic-MBTI.git
cd Enhanced-Dynamic-MBTI
```

> 也可以在 [GitHub 仓库页面](https://github.com/UssCuriosity/Enhanced-Dynamic-MBTI) 点击绿色的 **Code** 按钮，选择 **Download ZIP** 下载压缩包，解压后在终端中 `cd` 到项目文件夹即可。

### 4. 创建环境变量文件

项目需要一个 `.env` 文件来配置数据库和认证密钥。复制下面这一整段命令粘贴到终端中运行，它会自动生成随机密钥并创建好 `.env` 文件：

```bash
echo "DATABASE_URL=\"file:./dev.db\"
NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\"
NEXTAUTH_URL=\"http://localhost:3000\"" > .env
```

运行后可以验证文件是否创建成功：

```bash
cat .env
```

应该看到类似这样的输出（`NEXTAUTH_SECRET` 的值每次随机生成，不一样是正常的）：

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="aB3xY7k9mQ2w..."
NEXTAUTH_URL="http://localhost:3000"
```

> 本地开发不需要配置 `TURSO_DATABASE_URL`，系统会自动使用本地 SQLite 文件。

### 5. 安装项目依赖（重要，不要跳过！）

```bash
npm install
```

这会根据 `package.json` 下载所有需要的库到 `node_modules/` 文件夹，通常需要 1-3 分钟。

> **必须先完成这一步**，后面的数据库初始化和启动服务器都依赖这里安装的库。如果跳过，会出现 `Cannot find module` 或 `command not found` 之类的错误。

### 6. 初始化数据库

项目使用 SQLite 作为本地数据库（无需额外安装数据库软件），通过 Prisma 管理。

依次运行以下两条命令：

```bash
npx prisma migrate deploy
npx prisma generate
```

第一条命令会在项目根目录创建 `dev.db` 数据库文件并建好所有数据表，第二条命令会生成 Prisma 客户端代码。

### 7. 启动开发服务器

```bash
npm run dev
```

看到类似以下输出说明启动成功：

```
▲ Next.js 16.2.1 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in xxxms
```

> **注意看 `Local:` 后面的地址**。如果 3000 端口已被其他程序占用，Next.js 会自动换用其他端口（如 3001、3002 等），终端会显示实际使用的地址，以终端显示的为准。

### 8. 访问应用

复制终端中 `Local:` 后面显示的地址，粘贴到浏览器中打开，注册账号后即可开始 MBTI 动态人格测试。

### 常见问题

**Q: `npm install` 报错或很慢？**
> 尝试使用国内镜像源：`npm install --registry=https://registry.npmmirror.com`

**Q: 如何停止服务器？**
> 在运行服务器的终端中按 `Ctrl + C`

**Q: 如何重置数据库？**
> 删除 `dev.db` 文件后重新运行 `npx prisma migrate deploy`

## 快速开始（Windows）

从零开始，在一台全新的 Windows 电脑上把项目跑起来。

### 1. 安装 Node.js

前往 [Node.js 官网](https://nodejs.org/)，下载 **LTS（长期支持）** 版本的安装包（`.msi` 文件）。

运行安装程序，**一路点 Next 使用默认设置即可**，安装程序会自动将 Node.js 添加到系统环境变量。

安装完成后，打开 **PowerShell**（按 `Win + X`，选择「终端」或「Windows PowerShell」），验证安装：

```powershell
node --version   # 应输出 v18.x 或更高
npm --version    # 应输出 9.x 或更高
```

> 如果提示 `node: 无法识别的命令`，关闭 PowerShell 重新打开再试。

### 2. 安装 Git 并下载代码

前往 [Git 官网](https://git-scm.com/downloads/win)，下载安装包并运行，**一路点 Next 使用默认设置即可**。

安装完成后，**关闭并重新打开 PowerShell**，然后克隆项目：

```powershell
git clone https://github.com/UssCuriosity/Enhanced-Dynamic-MBTI.git
cd Enhanced-Dynamic-MBTI
```

> 也可以在 [GitHub 仓库页面](https://github.com/UssCuriosity/Enhanced-Dynamic-MBTI) 点击绿色的 **Code** 按钮，选择 **Download ZIP** 下载压缩包，解压后在 PowerShell 中 `cd` 到项目文件夹即可。

### 3. 创建环境变量文件

复制下面这段命令粘贴到 PowerShell 中运行，它会自动生成随机密钥并创建好 `.env` 文件：

```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$secret = [Convert]::ToBase64String($bytes)
@"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="$secret"
NEXTAUTH_URL="http://localhost:3000"
"@ | Set-Content .env -Encoding UTF8
```

运行后验证文件是否创建成功：

```powershell
Get-Content .env
```

应该看到类似这样的输出（`NEXTAUTH_SECRET` 的值每次随机生成，不一样是正常的）：

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="aB3xY7k9mQ2w..."
NEXTAUTH_URL="http://localhost:3000"
```

> 本地开发不需要配置 `TURSO_DATABASE_URL`，系统会自动使用本地 SQLite 文件。

### 4. 安装项目依赖（重要，不要跳过！）

```powershell
npm install
```

这会根据 `package.json` 下载所有需要的库到 `node_modules/` 文件夹，通常需要 1-3 分钟。

> **必须先完成这一步**，后面的数据库初始化和启动服务器都依赖这里安装的库。如果跳过，会出现 `Cannot find module` 或 `command not found` 之类的错误。

### 5. 初始化数据库

项目使用 SQLite 作为本地数据库（无需额外安装数据库软件），通过 Prisma 管理。

依次运行以下两条命令：

```powershell
npx prisma migrate deploy
npx prisma generate
```

第一条命令会在项目根目录创建 `dev.db` 数据库文件并建好所有数据表，第二条命令会生成 Prisma 客户端代码。

### 6. 启动开发服务器

```powershell
npm run dev
```

看到类似以下输出说明启动成功：

```
▲ Next.js 16.2.1 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in xxxms
```

> **注意看 `Local:` 后面的地址**。如果 3000 端口已被其他程序占用，Next.js 会自动换用其他端口（如 3001、3002 等），以终端显示的为准。

### 7. 访问应用

复制终端中 `Local:` 后面显示的地址，粘贴到浏览器中打开，注册账号后即可开始 MBTI 动态人格测试。

### 常见问题

**Q: `npm install` 报错或很慢？**
> 尝试使用国内镜像源：`npm install --registry=https://registry.npmmirror.com`

**Q: PowerShell 提示"无法加载文件，因为在此系统上禁止运行脚本"？**
> 以管理员身份打开 PowerShell，运行 `Set-ExecutionPolicy RemoteSigned`，输入 `Y` 确认，然后关闭重新打开 PowerShell 再试。

**Q: 如何停止服务器？**
> 在运行服务器的终端中按 `Ctrl + C`

**Q: 如何重置数据库？**
> 删除 `dev.db` 文件后重新运行 `npx prisma migrate deploy`

## 项目结构

```
Enhanced Dynamic MBTI/
├── prisma/
│   ├── schema.prisma           # 数据模型定义
│   └── migrations/             # 数据库迁移文件
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── page.tsx            # 首页
│   │   ├── layout.tsx          # 全局布局
│   │   ├── auth/               # 登录/注册页面
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/          # 用户面板
│   │   │   └── page.tsx
│   │   ├── test/[planId]/      # 测试相关页面
│   │   │   ├── day/page.tsx    # 每日问卷
│   │   │   ├── progress/page.tsx # 进度追踪 + 3D 可视化
│   │   │   └── report/page.tsx # 最终报告
│   │   └── api/                # API 路由
│   │       ├── auth/           # 注册 + NextAuth 认证
│   │       └── plans/          # 测试计划 CRUD + 问卷提交
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── questionnaire/      # 问卷组件
│   │   │   └── QuestionCard.tsx
│   │   ├── visualization/      # 可视化组件
│   │   │   ├── PersonalitySpace.tsx  # 3D 性格空间（Three.js）
│   │   │   ├── ProjectionView.tsx    # 2D 投影视图（SVG）
│   │   │   └── TimelineChart.tsx     # 维度变化折线图（Recharts）
│   │   └── providers/
│   │       └── SessionProvider.tsx   # NextAuth Session Provider
│   ├── lib/
│   │   ├── db.ts               # Prisma 数据库连接（Turso / 本地 SQLite）
│   │   ├── userStore.ts        # 数据层（用户/计划/会话 CRUD）
│   │   ├── auth.ts             # NextAuth 配置
│   │   ├── questions.ts        # 题库（86题，覆盖 NS/TF/JP/EI）
│   │   ├── scoring.ts          # 评分算法（Likert → 三维坐标）
│   │   ├── boundary.ts         # 边界计算（凸包 + 置信椭球 + 质心）
│   │   ├── statistics.ts       # 统计分析 + 个性化报告文本生成
│   │   └── utils.ts            # 通用工具函数
│   └── types/
│       └── index.ts            # TypeScript 类型定义
├── package.json
├── tsconfig.json
└── README.md
```

## 核心算法

### 评分
每道题使用 5 级 Likert 量表，映射到 [-1, 1] 区间后按维度加权平均，得到当日三维坐标 (NS, TF, JP) 及独立的 EI 分数。

### 边界模型
- **凸包 (Convex Hull)**: 所有测量点的最外边界，代表绝对性格范围
- **置信椭球**: 基于协方差矩阵的 95% 置信区间，代表常态性格范围
- **质心**: 所有点的均值，代表性格重心
- **趋势分析**: 线性回归检测性格漂移倾向
