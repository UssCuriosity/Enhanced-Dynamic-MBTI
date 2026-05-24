import { execSync } from "node:child_process";

export interface VersionEntry {
  version: string;
  commit: string;
  date: string;
  title: string;
  scope: "major" | "minor" | "patch";
  additions: number;
  deletions: number;
  totalChanges: number;
  summary: string;
}

interface RawCommit {
  hash: string;
  date: string;
  title: string;
  additions: number;
  deletions: number;
}

function classifyScope(totalChanges: number, additions: number, deletions: number): VersionEntry["scope"] {
  if (totalChanges >= 1200 || additions >= 900 || deletions >= 400) return "major";
  if (totalChanges >= 120 || additions >= 60 || deletions >= 40) return "minor";
  return "patch";
}

function summarizeCommit(title: string): string {
  const lowered = title.toLowerCase();

  if (lowered.includes("full-stack") || lowered.includes("migrate")) {
    return "架构级更新，涉及数据层、应用层和整体交互流程。";
  }
  if (lowered.includes("question bank")) {
    return "强化题库与测试选择逻辑，让正式测试更稳定。";
  }
  if (lowered.includes("ui improvements") || lowered.includes("layout")) {
    return "偏视觉和交互优化，提升页面可读性与结构层次。";
  }
  if (lowered.includes("docs") || lowered.includes("readme")) {
    return "以文档说明和 onboarding 为主，帮助新用户快速上手。";
  }
  if (lowered.includes("fix") || lowered.includes("turso")) {
    return "修复连接或运行问题，保证项目可用性。";
  }
  return "功能和体验均有调整。";
}

function readGitCommits(limit = 20): RawCommit[] {
  try {
    const output = execSync(
      `git log --numstat --date=short --pretty=format:%H%x09%ad%x09%s -n ${limit}`,
      { encoding: "utf8" }
    );

    const commits: RawCommit[] = [];
    const lines = output.split("\n");
    let current: RawCommit | null = null;

    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split("\t");
      if (parts.length === 3 && /^[0-9a-f]{7,40}$/i.test(parts[0])) {
        if (current) commits.push(current);
        current = {
          hash: parts[0],
          date: parts[1],
          title: parts[2],
          additions: 0,
          deletions: 0,
        };
        continue;
      }

      if (!current || parts.length < 3) continue;
      const added = Number.parseInt(parts[0], 10);
      const deleted = Number.parseInt(parts[1], 10);
      if (!Number.isNaN(added)) current.additions += added;
      if (!Number.isNaN(deleted)) current.deletions += deleted;
    }

    if (current) commits.push(current);
    return commits;
  } catch (error) {
    // Git not available in build environment (e.g., Vercel)
    // Return empty array to allow build to proceed
    return [];
  }
}

export function getVersionTimeline(): VersionEntry[] {
  const commits = readGitCommits(12).reverse();

  let major = 0;
  let minor = 0;
  let patch = 0;

  return commits.map((commit) => {
    const totalChanges = commit.additions + commit.deletions;
    const scope = classifyScope(totalChanges, commit.additions, commit.deletions);

    if (scope === "major") {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (scope === "minor") {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    return {
      version: `${major}.${minor}.${patch}`,
      commit: commit.hash.slice(0, 7),
      date: commit.date,
      title: commit.title,
      scope,
      additions: commit.additions,
      deletions: commit.deletions,
      totalChanges,
      summary: summarizeCommit(commit.title),
    };
  });
}
