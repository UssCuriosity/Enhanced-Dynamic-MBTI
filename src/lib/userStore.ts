import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "LoginRegistration");

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

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function userFilePath(userId: string): string {
  return path.join(DATA_DIR, `${userId}.json`);
}

function readUser(userId: string): UserData | null {
  const fp = userFilePath(userId);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function writeUser(user: UserData): void {
  ensureDir();
  fs.writeFileSync(userFilePath(user.id), JSON.stringify(user, null, 2), "utf-8");
}

/** List all user files and return their data */
function allUsers(): UserData[] {
  ensureDir();
  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf-8")));
}

// ---- User CRUD ----

export function findUserByEmail(email: string): UserData | null {
  return allUsers().find((u) => u.email === email) || null;
}

export function findUserById(userId: string): UserData | null {
  return readUser(userId);
}

export function createUser(email: string, name: string, hashedPassword: string): UserData {
  const user: UserData = {
    id: uuidv4(),
    email,
    name,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
    plans: [],
  };
  writeUser(user);
  return user;
}

// ---- Plan CRUD ----

export function createPlan(userId: string, durationDays: number): StoredPlan | null {
  const user = readUser(userId);
  if (!user) return null;

  const plan: StoredPlan = {
    id: uuidv4(),
    durationDays,
    currentDay: 0,
    status: "active",
    startDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    sessions: [],
    boundary: null,
  };
  user.plans.push(plan);
  writeUser(user);
  return plan;
}

export function getUserPlans(userId: string): StoredPlan[] {
  const user = readUser(userId);
  return user?.plans || [];
}

export function getPlan(userId: string, planId: string): StoredPlan | null {
  const user = readUser(userId);
  if (!user) return null;
  return user.plans.find((p) => p.id === planId) || null;
}

export function findPlanOwner(planId: string): UserData | null {
  return allUsers().find((u) => u.plans.some((p) => p.id === planId)) || null;
}

// ---- Session / Answer CRUD ----

export function addSession(
  userId: string,
  planId: string,
  session: StoredSession
): void {
  const user = readUser(userId);
  if (!user) return;
  const plan = user.plans.find((p) => p.id === planId);
  if (!plan) return;
  plan.sessions.push(session);
  plan.currentDay = session.dayNumber;
  if (session.dayNumber >= plan.durationDays) {
    plan.status = "completed";
  }
  writeUser(user);
}

export function updatePlanBoundary(
  userId: string,
  planId: string,
  boundary: StoredBoundary
): void {
  const user = readUser(userId);
  if (!user) return;
  const plan = user.plans.find((p) => p.id === planId);
  if (!plan) return;
  plan.boundary = boundary;
  writeUser(user);
}
