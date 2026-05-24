"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GitBranch } from "lucide-react";
import type { LeaderboardBoard } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<LeaderboardBoard[]>([]);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
      return;
    }

    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setBoards(data.boards || []))
      .catch(() => setBoards([]));
  }, [session, router]);

  const singleBoard = boards.find((board) => board.mode === "single");
  const dualBoard = boards.find((board) => board.mode === "dayNight");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.12),_transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18%,transparent_82%,rgba(255,255,255,0.02))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

      <nav className="relative border-b border-white/10 bg-slate-950/55 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.46em] text-amber-200/80">Enhanced Dynamic MBTI</div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">动态人格边界建模</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-slate-100 hover:bg-white/10 hover:text-white">
                登录
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-amber-300 text-slate-950 hover:bg-amber-200">
                注册
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-100">
                随机试玩
              </Badge>
              <Badge variant="outline" className="border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                单测
              </Badge>
              <Badge variant="outline" className="border-violet-300/30 bg-violet-300/10 px-3 py-1 text-violet-100">
                白天 + 晚上
              </Badge>
            </div>

            <div className="space-y-5">
              <h2 className="max-w-3xl text-5xl font-semibold leading-[0.94] tracking-tight sm:text-7xl">
                你的性格，
                <span className="block bg-gradient-to-r from-amber-200 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  不是标签，是一张会呼吸的空间图。
                </span>
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                先用右下角的随机测试看 3D 边界，再进入正式流程。支持每天一测或白天+晚上双测，切换模式后也能继续，但切换过的计划不会进入排行榜。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/auth/register">
                <Button size="lg" className="bg-amber-300 px-6 text-slate-950 hover:bg-amber-200">
                  开始正式测试
                </Button>
              </Link>
              <Link href="/playground/random">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/15 bg-white/5 px-6 text-slate-50 hover:bg-white/10 hover:text-white"
                >
                  先看随机 3D
                </Button>
              </Link>
            </div>

            <div>
              <Link href="/versions">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full border border-white/10 bg-white/5 px-4 text-slate-100 hover:bg-white/10 hover:text-white"
                >
                  <GitBranch className="mr-2 h-4 w-4 text-cyan-300" />
                  版本时间线
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MiniStat title="双模式边界" value="18:00 分界" />
              <MiniStat title="隐私展示" value="邮箱脱敏" />
              <MiniStat title="排行榜规则" value="两榜分开" />
            </div>
          </div>

          <Card className="border-white/10 bg-slate-950/70 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-slate-50">榜单概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <OverviewCard
                title="每天一测榜"
                board={singleBoard}
                accent="from-cyan-300 via-sky-400 to-blue-500"
              />
              <OverviewCard
                title="白天 + 晚上榜"
                board={dualBoard}
                accent="from-violet-300 via-fuchsia-400 to-indigo-500"
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <FeatureCard
            title="更强的 3D 质感"
            description="深色背景、发光边界和更明确的色块分工，让随机试玩更像一张可互动的视觉卡片。"
          />
          <FeatureCard
            title="模式可切换"
            description="正式计划中可以随时在单测和日夜双测之间切换，但切换后不会参与榜单排名。"
          />
          <FeatureCard
            title="规则清晰"
            description="白天和晚上的分界固定为 18:00，用户一眼就能知道当前应该走哪条测试路径。"
          />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <Card className="border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-50">为什么它不是普通 MBTI？</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-300">
              <p>传统 MBTI 把你压缩成一个点，我们把它展开成一个会移动的空间。</p>
              <p>你每天的答案会形成新的坐标，久而久之，这些点会长成一块真正属于你的边界。</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-50">隐私保护</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-slate-300">
              <p>排行榜只显示邮箱前 4 个字母和 @ 后面的域名，中间会被隐藏。</p>
              <p>切换过测试模式的计划会被自动剔除，不会混入两张榜单。</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <Link
        href="/playground/random"
        className="fixed bottom-5 right-5 z-50"
        aria-label="随机测试"
      >
        <div className="flex items-center gap-3 rounded-full border border-amber-300/25 bg-slate-950/90 px-4 py-3 text-sm font-medium text-slate-50 shadow-2xl shadow-amber-500/15 backdrop-blur transition hover:scale-[1.03] hover:border-amber-200/40">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-xs font-bold text-slate-950">
            测
          </span>
          <span>随机测试</span>
        </div>
      </Link>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
      <div className="text-[11px] uppercase tracking-[0.26em] text-slate-400">{title}</div>
      <div className="mt-2 text-sm font-semibold text-slate-50">{value}</div>
    </div>
  );
}

function OverviewCard({
  title,
  board,
  accent,
}: {
  title: string;
  board?: LeaderboardBoard;
  accent: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">榜单</div>
          <div className="text-base font-semibold text-slate-50">{title}</div>
        </div>
        <div className={`h-2.5 w-16 rounded-full bg-gradient-to-r ${accent}`} />
      </div>
      <div className="mt-4 space-y-2">
        {board?.entries?.length ? (
          board.entries.slice(0, 3).map((entry) => (
            <div
              key={`${board.mode}-${entry.planId}`}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-3 text-sm"
            >
              <div>
                <div className="font-medium text-slate-50">{entry.displayEmail}</div>
                <div className="text-xs text-slate-400">
                  {entry.activeDays} 天 · 连胜 {entry.streakDays}
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-slate-100">
                #{entry.rank}
              </Badge>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-3 py-8 text-center text-sm text-slate-400">
            暂无可展示数据
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-lg shadow-cyan-950/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-slate-50">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}
