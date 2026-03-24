"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProjectionView from "@/components/visualization/ProjectionView";
import TimelineChart from "@/components/visualization/TimelineChart";
import Link from "next/link";
import { DailyPoint, EllipsoidParams, Point3D } from "@/types";

const PersonalitySpace = dynamic(
  () => import("@/components/visualization/PersonalitySpace"),
  { ssr: false, loading: () => <div className="h-[500px] bg-slate-950 rounded-xl flex items-center justify-center text-slate-400">加载 3D 视图...</div> }
);

interface PlanData {
  id: string;
  durationDays: number;
  currentDay: number;
  status: string;
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
  boundary: {
    convexHullVertices: string;
    ellipsoidParams: string;
    centroid: string;
    stats: string;
  } | null;
}

export default function ProgressPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const planId = params.planId as string;

  const [plan, setPlan] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    const res = await fetch(`/api/plans/${planId}`);
    if (res.ok) {
      setPlan(await res.json());
    }
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    else if (status === "authenticated") fetchPlan();
  }, [status, router, fetchPlan]);

  if (loading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  const points: DailyPoint[] = plan.sessions
    .filter((s) => s.score)
    .map((s) => ({
      ns: s.score!.nsScore,
      tf: s.score!.tfScore,
      jp: s.score!.jpScore,
      ei: s.score!.eiScore,
      day: s.dayNumber,
      date: s.completedAt,
    }));

  const boundary = plan.boundary;
  const convexHull = boundary ? JSON.parse(boundary.convexHullVertices) : undefined;
  const ellipsoid: EllipsoidParams | undefined = boundary
    ? JSON.parse(boundary.ellipsoidParams)
    : undefined;
  const centroid: Point3D | undefined = boundary
    ? JSON.parse(boundary.centroid)
    : undefined;

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
          <div className="flex gap-2">
            {plan.status === "active" && (
              <Link href={`/test/${planId}/day`}>
                <Button size="sm">今日测试</Button>
              </Link>
            )}
            {plan.status === "completed" && (
              <Link href={`/test/${planId}/report`}>
                <Button size="sm">查看报告</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">测试进度</h2>
            <p className="text-muted-foreground mt-1">
              已收集 {points.length} 天的数据
            </p>
          </div>
          <Badge variant={plan.status === "active" ? "default" : "secondary"}>
            {plan.status === "active" ? "进行中" : "已完成"}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>进度: {plan.currentDay} / {plan.durationDays} 天</span>
            <span>{Math.round((plan.currentDay / plan.durationDays) * 100)}%</span>
          </div>
          <Progress value={(plan.currentDay / plan.durationDays) * 100} />
        </div>

        {points.length >= 3 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>三维性格空间</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  拖拽旋转 · 滚轮缩放 · 每个点代表一天的测量结果，颜色从蓝（第1天）渐变到红（最后一天）
                </p>
                <PersonalitySpace
                  points={points}
                  convexHull={convexHull}
                  ellipsoid={ellipsoid}
                  centroid={centroid}
                />
              </CardContent>
            </Card>

            <TimelineChart points={points} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProjectionView
                points={points}
                xKey="ns" yKey="tf"
                xLabel="N-S" yLabel="T-F"
                xLeftLabel="N(直觉)" xRightLabel="S(感觉)"
                yBottomLabel="T(思考)" yTopLabel="F(情感)"
              />
              <ProjectionView
                points={points}
                xKey="ns" yKey="jp"
                xLabel="N-S" yLabel="J-P"
                xLeftLabel="N(直觉)" xRightLabel="S(感觉)"
                yBottomLabel="J(判断)" yTopLabel="P(感知)"
              />
              <ProjectionView
                points={points}
                xKey="tf" yKey="jp"
                xLabel="T-F" yLabel="J-P"
                xLeftLabel="T(思考)" xRightLabel="F(情感)"
                yBottomLabel="J(判断)" yTopLabel="P(感知)"
              />
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-4">&#128202;</div>
              <h3 className="text-lg font-semibold">数据积累中</h3>
              <p className="text-muted-foreground mt-2">
                还需要 {3 - points.length} 天的数据才能生成可视化图表。坚持每天完成测试！
              </p>
            </CardContent>
          </Card>
        )}

        {points.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>每日数据记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-3 text-left font-medium">天数</th>
                      <th className="py-2 px-3 text-right font-medium text-red-500">N-S</th>
                      <th className="py-2 px-3 text-right font-medium text-green-500">T-F</th>
                      <th className="py-2 px-3 text-right font-medium text-blue-500">J-P</th>
                      <th className="py-2 px-3 text-right font-medium text-purple-500">E-I</th>
                    </tr>
                  </thead>
                  <tbody>
                    {points.map((p) => (
                      <tr key={p.day} className="border-b last:border-0">
                        <td className="py-2 px-3">第 {p.day} 天</td>
                        <td className="py-2 px-3 text-right font-mono">{p.ns.toFixed(3)}</td>
                        <td className="py-2 px-3 text-right font-mono">{p.tf.toFixed(3)}</td>
                        <td className="py-2 px-3 text-right font-mono">{p.jp.toFixed(3)}</td>
                        <td className="py-2 px-3 text-right font-mono">{p.ei.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
