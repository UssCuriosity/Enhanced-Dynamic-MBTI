import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  findPlanOwner,
  addSession,
  updatePlanBoundary,
  StoredSession,
  StoredBoundary,
} from "@/lib/userStore";
import { calculateScores } from "@/lib/scoring";
import { questionBank } from "@/lib/questions";
import {
  computeCentroid,
  computeConfidenceEllipsoid,
  computeConvexHull,
  computeBoundaryStats,
} from "@/lib/boundary";
import { DailyPoint } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { planId } = await params;
  const { answers, contextNote } = await req.json();

  const owner = await findPlanOwner(planId);
  if (!owner) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }

  const plan = owner.plans.find((p) => p.id === planId)!;
  const nextDay = plan.sessions.length + 1;
  if (nextDay > plan.durationDays) {
    return NextResponse.json({ error: "测试已完成" }, { status: 400 });
  }

  const scores = calculateScores(answers);
  const questionMap = new Map(questionBank.map((q) => [q.id, q]));

  const newSession: StoredSession = {
    id: uuidv4(),
    dayNumber: nextDay,
    completedAt: new Date().toISOString(),
    contextNote: contextNote || null,
    answers: answers.map((a: { questionId: string; value: number }) => ({
      questionId: a.questionId,
      value: a.value,
      dimension: questionMap.get(a.questionId)?.dimension || "NS",
    })),
    score: {
      nsScore: scores.ns,
      tfScore: scores.tf,
      jpScore: scores.jp,
      eiScore: scores.ei,
    },
  };

  const isComplete = nextDay >= plan.durationDays;
  await addSession(owner.id, planId, newSession);

  const updatedOwner = await findPlanOwner(planId);
  const updatedPlan = updatedOwner?.plans.find((p) => p.id === planId);
  const allSessions = updatedPlan?.sessions || [];

  if (allSessions.length >= 3) {
    const points: DailyPoint[] = allSessions
      .filter((s) => s.score)
      .map((s) => ({
        ns: s.score!.nsScore,
        tf: s.score!.tfScore,
        jp: s.score!.jpScore,
        ei: s.score!.eiScore,
        day: s.dayNumber,
        date: s.completedAt,
      }));

    const centroid = computeCentroid(points);
    const ellipsoid = computeConfidenceEllipsoid(points);
    const convexHull = computeConvexHull(points);
    const stats = computeBoundaryStats(points);

    const boundary: StoredBoundary = {
      convexHullVertices: JSON.stringify(convexHull),
      ellipsoidParams: JSON.stringify(ellipsoid),
      centroid: JSON.stringify(centroid),
      stats: JSON.stringify(stats),
      createdAt: new Date().toISOString(),
    };

    await updatePlanBoundary(owner.id, planId, boundary);
  }

  return NextResponse.json({
    session: newSession,
    scores,
    isComplete,
    dayNumber: nextDay,
  });
}
