import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findPlanOwner } from "@/lib/userStore";
import { selectDailyQuestions } from "@/lib/questions";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { planId } = await params;
  const owner = findPlanOwner(planId);
  if (!owner) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }

  const plan = owner.plans.find((p) => p.id === planId)!;
  const nextDay = plan.sessions.length + 1;

  if (nextDay > plan.durationDays) {
    return NextResponse.json({ error: "测试已完成" }, { status: 400 });
  }

  const todaySession = plan.sessions.find((s) => {
    const today = new Date().toISOString().split("T")[0];
    return s.completedAt.split("T")[0] === today;
  });

  if (todaySession) {
    return NextResponse.json(
      { error: "今天已经完成了测试", alreadyDone: true },
      { status: 400 }
    );
  }

  const questions = selectDailyQuestions(nextDay);

  return NextResponse.json({
    dayNumber: nextDay,
    totalDays: plan.durationDays,
    questions: questions.map((q) => ({
      id: q.id,
      text: q.text,
      dimension: q.dimension,
      category: q.category,
    })),
  });
}
