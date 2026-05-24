#!/bin/bash

# Vercel 一键部署脚本

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查 Git 状态
echo "✓ 检查 Git 状态..."
git status

echo ""
echo "请按照以下步骤继续："
echo ""
echo "1️⃣  访问 https://vercel.com"
echo "2️⃣  点击 'Add New...' -> 'Project'"
echo "3️⃣  选择 'Import Git Repository'"
echo "4️⃣  找到并选择: Enhanced-Dynamic-MBTI"
echo ""
echo "在 Vercel 部署设置中配置以下环境变量："
echo ""
echo "📋 需要的环境变量:"
echo "   - TURSO_CONNECTION_URL"
echo "   - TURSO_AUTH_TOKEN"
echo "   - NEXTAUTH_SECRET (运行下面的命令生成)"
echo "   - NEXTAUTH_URL (部署后获得的 URL)"
echo ""
echo "生成 NEXTAUTH_SECRET 的命令:"
echo "   openssl rand -base64 32"
echo ""
echo "5️⃣  填入所有环境变量后，点击 'Deploy'"
echo ""
echo "✅ 部署完成后，你的应用将在几分钟内可用！"
