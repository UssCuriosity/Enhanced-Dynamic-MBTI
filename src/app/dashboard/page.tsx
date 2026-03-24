"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Plan {
  id: string;
  durationDays: number;
  currentDay: number;
  status: string;
  startDate: string;
  sessions: Array<{
    dayNumber: number;
    completedAt: string;
    score: {
      nsScore: number;
      tfScore: number;
      jpScore: number;
      eiScore: number;
    } | null;
  }>;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchPlans = useCallback(async () => {
    const res = await fetch("/api/plans");
    if (res.ok) {
      const data = await res.json();
      setPlans(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated") {
      fetchPlans();
    }
  }, [status, router, fetchPlans]);

  const createPlan = async (days: number) => {
    setCreating(true);
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durationDays: days }),
    });

    if (res.ok) {
      const plan = await res.json();
      router.push(`/test/${plan.id}/day`);
    }
    setCreating(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  const activePlan = plans.find((p) => p.status === "active");
  const completedPlans = plans.filter((p) => p.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Enhanced Dynamic</span>{" "}
              <span className="text-muted-foreground">MBTI</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              退出
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold">欢迎回来</h2>
          <p className="text-muted-foreground mt-1">
            继续你的动态人格探索之旅
          </p>
        </div>

        {activePlan ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>进行中的测试</CardTitle>
                  <CardDescription>
                    {activePlan.durationDays} 天计划 · 开始于{" "}
                    {new Date(activePlan.startDate).toLocaleDateString("zh-CN")}
                  </CardDescription>
                </div>
                <Badge>进行中</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    已完成 {activePlan.currentDay} / {activePlan.durationDays} 天
                  </span>
                  <span>
                    {Math.round(
                      (activePlan.currentDay / activePlan.durationDays) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (activePlan.currentDay / activePlan.durationDays) * 100
                  }
                />
              </div>
              <div className="flex gap-3">
                <Link href={`/test/${activePlan.id}/day`}>
                  <Button>今日测试</Button>
                </Link>
                {activePlan.currentDay >= 3 && (
                  <Link href={`/test/${activePlan.id}/progress`}>
                    <Button variant="outline">查看进度</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>开始新的测试计划</CardTitle>
              <CardDescription>
                选择测试周期，每天花 3-5 分钟完成问卷，构建你的性格边界模型
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => createPlan(14)}
                  disabled={creating}
                  className="p-6 border-2 rounded-xl text-left hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                >
                  <div className="text-2xl font-bold">14 天</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    快速了解你的性格范围，适合初次体验
                  </div>
                </button>
                <button
                  onClick={() => createPlan(21)}
                  disabled={creating}
                  className="p-6 border-2 rounded-xl text-left hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
                >
                  <div className="text-2xl font-bold">21 天</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    更精确的性格边界建模，数据更丰富
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {completedPlans.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">历史记录</h3>
            {completedPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {plan.durationDays} 天测试计划
                      </CardTitle>
                      <CardDescription>
                        {new Date(plan.startDate).toLocaleDateString("zh-CN")} ·
                        已完成 {plan.currentDay} 天
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">已完成</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Link href={`/test/${plan.id}/report`}>
                      <Button variant="outline" size="sm">查看报告</Button>
                    </Link>
                    <Link href={`/test/${plan.id}/progress`}>
                      <Button variant="ghost" size="sm">查看数据</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
