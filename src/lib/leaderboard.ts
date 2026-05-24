import { getAllUsersWithPlans, StoredPlan, StoredSession } from "@/lib/userStore";
import { LeaderboardBoard, TestMode } from "@/types";

function maskEmail(email: string): string {
  const [localPart, domain = ""] = email.split("@");
  return `${localPart.slice(0, 4)}****@${domain}`;
}

function uniqueDates(sessions: StoredSession[]): string[] {
  return [...new Set(sessions.map((session) => session.completedAt.slice(0, 10)))].sort();
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function currentStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  let streak = 0;
  let cursor = new Date(`${days[days.length - 1]}T00:00:00.000Z`);

  while (set.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function getPlanStats(plan: StoredPlan) {
  const days = uniqueDates(plan.sessions);
  const activeDays = days.length;
  const streakDays = currentStreak(days);
  const completionRate = plan.durationDays > 0 ? activeDays / plan.durationDays : 0;

  return {
    activeDays,
    streakDays,
    completionRate,
    createdAt: plan.createdAt,
  };
}

function pickBestPlan(plans: StoredPlan[]) {
  return plans
    .map((plan) => ({ plan, stats: getPlanStats(plan) }))
    .sort((a, b) => {
      if (b.stats.activeDays !== a.stats.activeDays) return b.stats.activeDays - a.stats.activeDays;
      if (b.stats.streakDays !== a.stats.streakDays) return b.stats.streakDays - a.stats.streakDays;
      if (b.stats.completionRate !== a.stats.completionRate) return b.stats.completionRate - a.stats.completionRate;
      return a.stats.createdAt.localeCompare(b.stats.createdAt);
    })[0];
}

function buildBoard(mode: TestMode): LeaderboardBoard {
  return { mode, title: mode === "single" ? "每天一测榜" : "白天 + 晚上榜", entries: [] };
}

export async function getLeaderboardBoards(): Promise<LeaderboardBoard[]> {
  const users = await getAllUsersWithPlans();
  const boards = [buildBoard("single"), buildBoard("dayNight")];

  for (const user of users) {
    if (user.plans.some((plan) => plan.modeChanged)) continue;

    for (const board of boards) {
      const plans = user.plans.filter((plan) => plan.testMode === board.mode && plan.sessions.length > 0);
      if (plans.length === 0) continue;

      const best = pickBestPlan(plans);
      if (!best) continue;

      board.entries.push({
        rank: 0,
        displayEmail: maskEmail(user.email),
        name: user.name,
        mode: board.mode,
        activeDays: best.stats.activeDays,
        streakDays: best.stats.streakDays,
        completionRate: best.stats.completionRate,
        planId: best.plan.id,
      });
    }
  }

  for (const board of boards) {
    board.entries.sort((a, b) => {
      if (b.activeDays !== a.activeDays) return b.activeDays - a.activeDays;
      if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
      if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate;
      return a.displayEmail.localeCompare(b.displayEmail);
    });
    board.entries = board.entries.slice(0, 10).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  return boards;
}
