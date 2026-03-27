"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-primary">Enhanced Dynamic</span>{" "}
            <span className="text-muted-foreground">MBTI</span>
          </h1>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">注册</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
              你的性格，<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                不止四个字母
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              传统 MBTI 给你一个静态标签。Enhanced Dynamic MBTI 通过 14-21 天的动态测量，
              在三维空间中描绘你真实的性格边界 —— 因为你每天都不一样。
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                开始探索
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <FeatureCard
              title="每日 3–5 分钟"
              description="每天回答 15 道精心设计的问题，系统会捕捉你当天的性格状态。简单、快速、不打扰你的生活。"
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <FeatureCard
              title="三维性格空间"
              description="用 N-S、T-F、J-P 三个维度构建三维坐标系，每天的测量结果是空间中的一个点，形成你独特的性格点云。"
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              }
            />
            <FeatureCard
              title="动态边界模型"
              description="通过凸包和置信椭球算法，计算你的性格边界。了解你性格的稳定区域、波动范围和变化趋势。"
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              }
            />
          </div>

          <div className="mt-12 p-8 bg-white/60 dark:bg-slate-800/60 rounded-2xl border max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">为什么需要动态测量？</h3>
            <div className="text-muted-foreground space-y-3">
              <p>
                你今天可能因为一场激烈的讨论而更偏向 T（思考型），明天可能因为和朋友的深入交流而更偏向 F（情感型）。
                你的性格不是一个固定的点，而是一个在三维空间中的<strong className="text-foreground">活动范围</strong>。
              </p>
              <p>
                Enhanced Dynamic MBTI 通过持续的测量，找到这个范围的边界，告诉你：
              </p>
              <ul className="space-y-1 inline-block text-left">
                <li>· 你性格的「重心」在哪里</li>
                <li>· 你的波动范围有多大</li>
                <li>· 哪些维度稳定，哪些维度灵活</li>
                <li>· 你的性格是否有变化趋势</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-xl border flex flex-col items-center text-center gap-3 h-full">
      <div className="text-primary shrink-0">{icon}</div>
      <h3 className="text-lg font-semibold shrink-0">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{description}</p>
    </div>
  );
}
