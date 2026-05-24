import { prisma } from "./db";
import { normalizeSessionType, normalizeTestMode } from "./testFlow";

export interface StoredAnswer {
  questionId: string;
  value: number;
  dimension: string;
}

export interface StoredScore {
  nsScore: number;
  tfScore: number;
  jpScore: number;
  eiScore: number;
}

export interface StoredSession {
  id: string;
  dayNumber: number;
  sessionType: string;
  completedAt: string;
  contextNote: string | null;
  answers: StoredAnswer[];
  score: StoredScore | null;
}

export interface StoredBoundary {
  convexHullVertices: string;
  ellipsoidParams: string;
  centroid: string;
  stats: string;
  createdAt: string;
}

export interface StoredPlan {
  id: string;
  durationDays: number;
  currentDay: number;
  testMode: string;
  modeChanged: boolean;
  status: string;
  startDate: string;
  createdAt: string;
  sessions: StoredSession[];
  boundary: StoredBoundary | null;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  plans: StoredPlan[];
}

const planInclude = {
  sessions: {
    include: { answers: true, score: true },
    orderBy: [{ dayNumber: "asc" as const }, { completedAt: "asc" as const }],
  },
  boundary: true,
};

const userInclude = {
  plans: { include: planInclude },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPlan(p: any): StoredPlan {
  return {
    id: p.id,
    durationDays: p.durationDays,
    currentDay: p.currentDay,
    testMode: p.testMode ?? "single",
    modeChanged: Boolean(p.modeChanged),
    status: p.status,
    startDate: p.startDate instanceof Date ? p.startDate.toISOString() : p.startDate,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    sessions: (p.sessions ?? []).map((s: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
      id: s.id,
      dayNumber: s.dayNumber,
      sessionType: s.sessionType ?? "single",
      completedAt: s.completedAt instanceof Date ? s.completedAt.toISOString() : s.completedAt,
      contextNote: s.contextNote,
      answers: (s.answers ?? []).map((a: any) => ({  // eslint-disable-line @typescript-eslint/no-explicit-any
        questionId: a.questionId,
        value: a.value,
        dimension: a.dimension,
      })),
      score: s.score
        ? {
            nsScore: s.score.nsScore,
            tfScore: s.score.tfScore,
            jpScore: s.score.jpScore,
            eiScore: s.score.eiScore,
          }
        : null,
    })),
    boundary: p.boundary
      ? {
          convexHullVertices: p.boundary.convexHullVertices,
          ellipsoidParams: p.boundary.ellipsoidParams,
          centroid: p.boundary.centroid,
          stats: p.boundary.stats,
          createdAt:
            p.boundary.createdAt instanceof Date
              ? p.boundary.createdAt.toISOString()
              : p.boundary.createdAt,
        }
      : null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toUserData(u: any): UserData {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    password: u.password,
    createdAt: u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt,
    plans: (u.plans ?? []).map(toPlan),
  };
}

// ---- User CRUD ----

export async function findUserByEmail(email: string): Promise<UserData | null> {
  const u = await prisma.user.findUnique({
    where: { email },
    include: userInclude,
  });
  return u ? toUserData(u) : null;
}

export async function findUserById(userId: string): Promise<UserData | null> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
  return u ? toUserData(u) : null;
}

export async function createUser(
  email: string,
  name: string,
  hashedPassword: string
): Promise<UserData> {
  const u = await prisma.user.create({
    data: { email, name, password: hashedPassword },
    include: userInclude,
  });
  return toUserData(u);
}

// ---- Plan CRUD ----

export async function createPlan(
  userId: string,
  durationDays: number,
  testMode: string
): Promise<StoredPlan | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const p = await prisma.testPlan.create({
    data: { userId, durationDays, testMode: normalizeTestMode(testMode) },
    include: planInclude,
  });
  return toPlan(p);
}

export async function getUserPlans(userId: string): Promise<StoredPlan[]> {
  const plans = await prisma.testPlan.findMany({
    where: { userId },
    include: planInclude,
    orderBy: { createdAt: "desc" },
  });
  return plans.map((p) => toPlan(p));
}

export async function getPlan(
  userId: string,
  planId: string
): Promise<StoredPlan | null> {
  const p = await prisma.testPlan.findFirst({
    where: { id: planId, userId },
    include: planInclude,
  });
  return p ? toPlan(p) : null;
}

export async function findPlanOwner(planId: string): Promise<UserData | null> {
  const plan = await prisma.testPlan.findUnique({
    where: { id: planId },
    select: { userId: true },
  });
  if (!plan) return null;

  const u = await prisma.user.findUnique({
    where: { id: plan.userId },
    include: userInclude,
  });
  return u ? toUserData(u) : null;
}

// ---- Session / Answer CRUD ----

export async function addSession(
  userId: string,
  planId: string,
  session: StoredSession
): Promise<void> {
  const plan = await prisma.testPlan.findFirst({
    where: { id: planId, userId },
  });
  if (!plan) return;

  const isComplete = session.dayNumber >= plan.durationDays;
  const normalizedSessionType = normalizeSessionType(session.sessionType);
  const isDayComplete = normalizedSessionType === "single" || normalizedSessionType === "night";

  await prisma.$transaction([
    prisma.dailySession.create({
      data: {
        id: session.id,
        planId,
        dayNumber: session.dayNumber,
        sessionType: normalizedSessionType,
        completedAt: new Date(session.completedAt),
        contextNote: session.contextNote,
        answers: {
          create: session.answers.map((a) => ({
            questionId: a.questionId,
            value: a.value,
            dimension: a.dimension,
          })),
        },
        ...(session.score
          ? {
              score: {
                create: {
                  nsScore: session.score.nsScore,
                  tfScore: session.score.tfScore,
                  jpScore: session.score.jpScore,
                  eiScore: session.score.eiScore,
                },
              },
            }
          : {}),
      },
    }),
    prisma.testPlan.update({
      where: { id: planId },
      data: {
        currentDay: session.dayNumber,
        ...(isComplete && isDayComplete ? { status: "completed" } : {}),
      },
    }),
  ]);
}

export async function updatePlanMode(
  userId: string,
  planId: string,
  testMode: string
): Promise<StoredPlan | null> {
  const plan = await prisma.testPlan.findFirst({
    where: { id: planId, userId },
  });
  if (!plan) return null;

  const normalizedMode = normalizeTestMode(testMode);
  const modeChanged = plan.testMode !== normalizedMode ? true : plan.modeChanged;

  const updated = await prisma.testPlan.update({
    where: { id: planId },
    data: {
      testMode: normalizedMode,
      modeChanged,
    },
    include: planInclude,
  });

  return toPlan(updated);
}

export async function getAllUsersWithPlans(): Promise<UserData[]> {
  const users = await prisma.user.findMany({
    include: userInclude,
    orderBy: { createdAt: "asc" },
  });
  return users.map(toUserData);
}

export async function updatePlanBoundary(
  userId: string,
  planId: string,
  boundary: StoredBoundary
): Promise<void> {
  const plan = await prisma.testPlan.findFirst({
    where: { id: planId, userId },
  });
  if (!plan) return;

  await prisma.boundaryModel.upsert({
    where: { planId },
    update: {
      convexHullVertices: boundary.convexHullVertices,
      ellipsoidParams: boundary.ellipsoidParams,
      centroid: boundary.centroid,
      stats: boundary.stats,
    },
    create: {
      planId,
      convexHullVertices: boundary.convexHullVertices,
      ellipsoidParams: boundary.ellipsoidParams,
      centroid: boundary.centroid,
      stats: boundary.stats,
    },
  });
}
