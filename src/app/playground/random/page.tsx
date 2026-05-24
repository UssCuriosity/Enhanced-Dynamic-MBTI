"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyPoint, EllipsoidParams, Point3D } from "@/types";
import { computeBoundaryStats, computeConfidenceEllipsoid, computeConvexHull, computeCentroid } from "@/lib/boundary";

const PersonalitySpace = dynamic(() => import("@/components/visualization/PersonalitySpace"), {
  ssr: false,
  loading: () => <div className="h-[520px] rounded-3xl bg-slate-950 flex items-center justify-center text-slate-400">加载 3D 预览...</div>,
});

function randomPoint(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 10000;
  return (x - Math.floor(x)) * 2 - 1;
}

function buildRandomPoints(count = 10): DailyPoint[] {
  const baseDate = Date.UTC(2026, 0, 1);
  return Array.from({ length: count }, (_, index) => {
    const i = index + 1;
    const drift = i / count;
    return {
      day: i,
      date: new Date(baseDate + (i - 1) * 86400000).toISOString(),
      ns: Math.max(-1, Math.min(1, randomPoint(i * 1.1) * 0.6 + drift * 0.3 - 0.15)),
      tf: Math.max(-1, Math.min(1, randomPoint(i * 2.3) * 0.6 - drift * 0.25 + 0.1)),
      jp: Math.max(-1, Math.min(1, randomPoint(i * 3.7) * 0.6 + Math.sin(i) * 0.15)),
      ei: Math.max(-1, Math.min(1, randomPoint(i * 4.1) * 0.6)),
    };
  });
}

export default function RandomPlaygroundPage() {
  const [seed, setSeed] = useState(1);

  const points = useMemo(() => buildRandomPoints(10 + (seed % 4)), [seed]);
  const centroid: Point3D = useMemo(() => computeCentroid(points), [points]);
  const ellipsoid: EllipsoidParams = useMemo(() => computeConfidenceEllipsoid(points), [points]);
  const convexHull = useMemo(() => computeConvexHull(points), [points]);
  const stats = useMemo(() => computeBoundaryStats(points), [points]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-sky-300">Visitor Preview</div>
            <h1 className="text-3xl font-bold">随机 MBTI 3D 试玩</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSeed((n) => n + 1)}
              className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
            >
              重新随机
            </Button>
            <Link href="/dashboard">
              <Button className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">返回面板</Button>
            </Link>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-xl text-slate-50">随机边界</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-sm text-slate-300">
              拖拽旋转，滚轮缩放。这里每次都会随机生成一组边界数据，用来预览 3D 风格。
            </div>
            <PersonalitySpace
              points={points}
              convexHull={convexHull}
              ellipsoid={ellipsoid}
              centroid={centroid}
              height="520px"
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="N-S 均值" value={stats.nsMean.toFixed(2)} />
          <StatCard label="T-F 均值" value={stats.tfMean.toFixed(2)} />
          <StatCard label="J-P 均值" value={stats.jpMean.toFixed(2)} />
          <StatCard label="稳定度" value={stats.stability.toFixed(2)} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-cyan-950/10">
      <CardContent className="p-4">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-50">{value}</div>
      </CardContent>
    </Card>
  );
}
