import type { StoredPlan, StoredSession } from "@/lib/userStore";

export type TestMode = "single" | "dayNight";
export type SessionType = "single" | "day" | "night";

export const TEST_MODE_LABELS: Record<TestMode, string> = {
  single: "每天一测",
  dayNight: "白天 + 晚上",
};

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  single: "今日测试",
  day: "白天测试",
  night: "晚上测试",
};

export function normalizeTestMode(value: unknown): TestMode {
  return value === "dayNight" ? "dayNight" : "single";
}

export function normalizeSessionType(value: unknown): SessionType {
  return value === "day" || value === "night" ? value : "single";
}

export function nextSessionTypeForMode(mode: TestMode): SessionType {
  return mode === "dayNight" ? "day" : "single";
}

export function getPlanSessionsByDay(plan: StoredPlan, dayNumber: number): StoredSession[] {
  return plan.sessions
    .filter((session) => session.dayNumber === dayNumber)
    .sort((a, b) => {
      if (a.completedAt === b.completedAt) {
        return a.sessionType.localeCompare(b.sessionType);
      }
      return a.completedAt.localeCompare(b.completedAt);
    });
}

export function isDayComplete(sessions: StoredSession[]): boolean {
  if (sessions.length === 0) return false;
  if (sessions.some((session) => session.sessionType === "single")) return true;
  return sessions.some((session) => session.sessionType === "night");
}

export function resolveNextTestSlot(plan: StoredPlan): {
  dayNumber: number;
  sessionType: SessionType;
  currentDaySessions: StoredSession[];
  isCurrentDayOpen: boolean;
} {
  const currentDay = plan.currentDay || 0;
  const mode = normalizeTestMode(plan.testMode);

  if (currentDay === 0) {
    return {
      dayNumber: 1,
      sessionType: nextSessionTypeForMode(mode),
      currentDaySessions: [],
      isCurrentDayOpen: false,
    };
  }

  const currentDaySessions = getPlanSessionsByDay(plan, currentDay);
  const isCurrentDayOpen = !isDayComplete(currentDaySessions);

  if (!isCurrentDayOpen) {
    return {
      dayNumber: currentDay + 1,
      sessionType: nextSessionTypeForMode(mode),
      currentDaySessions,
      isCurrentDayOpen: false,
    };
  }

  const firstSessionType = currentDaySessions[0]?.sessionType;

  if (firstSessionType === "day") {
    return {
      dayNumber: currentDay,
      sessionType: "night",
      currentDaySessions,
      isCurrentDayOpen: true,
    };
  }

  if (firstSessionType === "single") {
    return {
      dayNumber: currentDay,
      sessionType: "single",
      currentDaySessions,
      isCurrentDayOpen: true,
    };
  }

  return {
    dayNumber: currentDay,
    sessionType: nextSessionTypeForMode(mode),
    currentDaySessions,
    isCurrentDayOpen: true,
  };
}

export function formatTestMode(mode: string): string {
  return TEST_MODE_LABELS[normalizeTestMode(mode)];
}

export function isModeChanged(plan: StoredPlan): boolean {
  return Boolean(plan.modeChanged);
}
