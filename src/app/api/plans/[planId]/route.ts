import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findPlanOwner } from "@/lib/userStore";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { planId } = await params;
  const owner = await findPlanOwner(planId);

  if (!owner) {
    return NextResponse.json({ error: "计划不存在" }, { status: 404 });
  }

  const plan = owner.plans.find((p) => p.id === planId);
  return NextResponse.json(plan);
}
