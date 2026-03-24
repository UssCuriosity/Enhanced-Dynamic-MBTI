# Enhanced Dynamic MBTI - 动态人格边界建模系统

通过 14-21 天的连续每日问卷测量，在 N-S、T-F、J-P 三维空间中构建你的"性格边界"模型。

## 核心理念

传统 MBTI 给出静态的四字母标签，但人的性格每天都在波动。本系统通过持续测量，找到性格波动的范围和边界。

- **三维空间**: N-S（信息获取）、T-F（决策方式）、J-P（生活方式）
- **E/I 作为修饰因子**: 独立测量，影响最终报告分析
- **边界模型**: 凸包 + 95%置信椭球 + 质心 + 趋势分析

## 技术栈

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Three.js (@react-three/fiber + @react-three/drei)
- NextAuth.js (JWT 认证)
- Recharts (图表)
- 基于文件的 JSON 数据存储（`LoginRegistration/` 文件夹）

## 数据存储

每个用户在 `LoginRegistration/` 文件夹中拥有一个独立的 JSON 文件，包含：

- 用户信息（昵称、邮箱、加密后的密码）
- 所有测试计划及其状态
- 每日问卷的完整回答记录
- 每日的三维坐标评分
- 性格边界模型数据（凸包、置信椭球、质心、统计分析）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 ，注册账号后即可开始测试。用户数据会自动保存在项目根目录的 `LoginRegistration/` 文件夹中。

## 项目结构

```
Enhanced Dynamic MBTI/
├── LoginRegistration/          # 用户数据存储（每个用户一个 JSON 文件）
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
│   │   ├── userStore.ts        # 文件存储引擎（用户/计划/会话 CRUD）
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
