"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProjectionView from "@/components/visualization/ProjectionView";
import TimelineChart from "@/components/visualization/TimelineChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DailyPoint, EllipsoidParams, Point3D, BoundaryStats } from "@/types";
import {
  generatePersonalityInsight,
  getLabelConfidence,
  getPersonalityZones,
} from "@/lib/statistics";

const PersonalitySpace = dynamic(
  () => import("@/components/visualization/PersonalitySpace"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-slate-950 rounded-xl flex items-center justify-center text-slate-400">
        加载 3D 视图...
      </div>
    ),
  }
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

export default function ReportPage() {
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
        <div className="text-muted-foreground">生成报告中...</div>
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

  if (!plan.boundary || points.length < 3) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">数据不足</h3>
            <p className="text-muted-foreground mt-2">
              需要至少 3 天的数据才能生成报告。当前已收集 {points.length} 天。
            </p>
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button>返回面板</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const boundary = plan.boundary;
  const convexHull = JSON.parse(boundary.convexHullVertices);
  const ellipsoid: EllipsoidParams = JSON.parse(boundary.ellipsoidParams);
  const centroid: Point3D = JSON.parse(boundary.centroid);
  const stats: BoundaryStats = JSON.parse(boundary.stats);

  const insight = generatePersonalityInsight(stats, stats.eiMean);
  const labelInfo = getLabelConfidence(stats, stats.eiMean);
  const zones = getPersonalityZones(points);

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
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">返回面板</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">你的性格边界报告</h2>
          <p className="text-muted-foreground">
            基于 {points.length} 天的连续测量数据
          </p>
        </div>

        {/* MBTI Label Comparison */}
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">传统 MBTI 最接近类型</div>
              <div className="text-5xl font-bold tracking-widest">{labelInfo.label}</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">标签匹配度:</span>
                <Badge variant={labelInfo.confidence > 0.6 ? "default" : "secondary"}>
                  {(labelInfo.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                {labelInfo.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3D Space */}
        <Card>
          <CardHeader>
            <CardTitle>三维性格空间</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              每个点代表一天的性格状态。半透明表面是你的性格边界。金色标记是你的性格重心。
            </p>
            <PersonalitySpace
              points={points}
              convexHull={convexHull}
              ellipsoid={ellipsoid}
              centroid={centroid}
              height="550px"
            />
          </CardContent>
        </Card>

        {/* Core Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DimensionCard
            title="N-S (信息获取)"
            mean={stats.nsMean}
            std={stats.nsStd}
            trend={stats.nsTrend}
            leftLabel="N 直觉"
            rightLabel="S 感觉"
            color="#ef4444"
          />
          <DimensionCard
            title="T-F (决策方式)"
            mean={stats.tfMean}
            std={stats.tfStd}
            trend={stats.tfTrend}
            leftLabel="T 思考"
            rightLabel="F 情感"
            color="#22c55e"
          />
          <DimensionCard
            title="J-P (生活方式)"
            mean={stats.jpMean}
            std={stats.jpStd}
            trend={stats.jpTrend}
            leftLabel="J 判断"
            rightLabel="P 感知"
            color="#3b82f6"
          />
          <DimensionCard
            title="E-I (能量方向)"
            mean={stats.eiMean}
            std={stats.eiStd}
            trend={0}
            leftLabel="I 内向"
            rightLabel="E 外向"
            color="#a855f7"
          />
        </div>

        {/* Personality Zones */}
        <Card>
          <CardHeader>
            <CardTitle>性格区域分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(zones.distribution)
                .sort((a, b) => b[1] - a[1])
                .map(([zone, pct]) => (
                  <div
                    key={zone}
                    className={`p-4 rounded-lg border text-center ${
                      zone === zones.primary
                        ? "bg-primary/10 border-primary/30"
                        : ""
                    }`}
                  >
                    <div className="text-lg font-bold">{zone}</div>
                    <div className="text-sm text-muted-foreground">
                      {(pct * 100).toFixed(0)}%
                    </div>
                    {zone === zones.primary && (
                      <Badge className="mt-1" variant="default">
                        主要
                      </Badge>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <TimelineChart points={points} />

        {/* 2D Projections */}
        <Card>
          <CardHeader>
            <CardTitle>二维投影视图</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Insight */}
        <Card>
          <CardHeader>
            <CardTitle>个性化分析</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {insight.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Stability */}
        <Card>
          <CardHeader>
            <CardTitle>性格稳定性</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                {(stats.stability * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {stats.stability > 0.7
                  ? "你的性格非常稳定"
                  : stats.stability > 0.4
                  ? "你的性格有适度灵活性"
                  : "你的性格波动较大，多面性强"}
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                style={{ width: `${stats.stability * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>高度灵活</span>
              <span>非常稳定</span>
            </div>
          </CardContent>
        </Card>

        {/* Volume */}
        <Card>
          <CardHeader>
            <CardTitle>边界体积</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              你的性格边界体积为{" "}
              <span className="font-mono font-semibold text-foreground">
                {stats.volume.toFixed(4)}
              </span>{" "}
              （三维空间单位）。
              {stats.volume < 0.05
                ? "这是一个较小的边界，说明你的性格特征非常集中稳定。"
                : stats.volume < 0.2
                ? "这是一个中等大小的边界，说明你在保持核心特质的同时有适度的灵活性。"
                : "这是一个较大的边界，说明你是一个多面手，在不同情境下展现不同的自我。"}
            </p>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">返回面板</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

function DimensionCard({
  title,
  mean,
  std,
  trend,
  leftLabel,
  rightLabel,
  color,
}: {
  title: string;
  mean: number;
  std: number;
  trend: number;
  leftLabel: string;
  rightLabel: string;
  color: string;
}) {
  const percentage = ((mean + 1) / 2) * 100;

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="text-sm font-medium" style={{ color }}>
          {title}
        </div>
        <div className="space-y-1">
          <div className="relative h-2 bg-muted rounded-full">
            {/* Standard deviation range */}
            <div
              className="absolute h-full rounded-full opacity-30"
              style={{
                backgroundColor: color,
                left: `${Math.max(0, ((mean - std + 1) / 2) * 100)}%`,
                right: `${Math.max(0, 100 - ((mean + std + 1) / 2) * 100)}%`,
              }}
            />
            {/* Mean marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm"
              style={{
                backgroundColor: color,
                left: `calc(${percentage}% - 6px)`,
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <div className="text-xs text-muted-foreground">均值</div>
            <div className="text-sm font-mono font-semibold">{mean.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">波动</div>
            <div className="text-sm font-mono font-semibold">{std.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">趋势</div>
            <div className="text-sm font-mono font-semibold">
              {trend > 0.01 ? "↑" : trend < -0.01 ? "↓" : "→"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
