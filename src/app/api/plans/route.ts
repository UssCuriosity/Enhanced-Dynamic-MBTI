import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPlan, getUserPlans } from "@/lib/userStore";
import { normalizeTestMode } from "@/lib/testFlow";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { durationDays, testMode } = await req.json();
  const userId = (session.user as { id: string }).id;

  const plan = await createPlan(userId, durationDays || 14, normalizeTestMode(testMode));
  if (!plan) {
    return NextResponse.json({ error: "创建计划失败" }, { status: 500 });
  }

  return NextResponse.json(plan);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const plans = await getUserPlans(userId);

  return NextResponse.json(plans);
}
