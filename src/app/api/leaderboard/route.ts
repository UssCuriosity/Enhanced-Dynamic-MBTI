import { NextResponse } from "next/server";
import { getLeaderboardBoards } from "@/lib/leaderboard";

export async function GET() {
  const boards = await getLeaderboardBoards();
  return NextResponse.json({ boards });
}
