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
  if (lowered.includes("deployment")) {
    return "部署相关更新，聚焦构建和发布流程。";
  }
  return "功能和体验均有调整。";
}

const RAW_COMMITS: Array<Pick<VersionEntry, "commit" | "date" | "title" | "additions" | "deletions" | "scope">> = [
  {
    commit: "731c167",
    date: "2026-05-24",
    title: "Fix: handle git command failure in Vercel build environment",
    additions: 34,
    deletions: 28,
    scope: "patch",
  },
  {
    commit: "eeb8e3b",
    date: "2026-05-24",
    title: "Add Vercel deployment documentation and script",
    additions: 82,
    deletions: 0,
    scope: "minor",
  },
  {
    commit: "7df4067",
    date: "2026-05-24",
    title: "docs: remove edgeone deployment guide",
    additions: 0,
    deletions: 32,
    scope: "patch",
  },
  {
    commit: "e83886a",
    date: "2026-05-24",
    title: "docs: prepare edgeone deployment",
    additions: 32,
    deletions: 0,
    scope: "patch",
  },
  {
    commit: "588102a",
    date: "2026-05-24",
    title: "feat: preserve data and refresh ui",
    additions: 1373,
    deletions: 244,
    scope: "major",
  },
  {
    commit: "d716741",
    date: "2026-03-27",
    title: "UI improvements: dimension labels, MBTI type display, and layout alignment",
    additions: 32,
    deletions: 23,
    scope: "minor",
  },
  {
    commit: "4e8f145",
    date: "2026-03-25",
    title: "Update README with live site link and current tech stack",
    additions: 24,
    deletions: 10,
    scope: "patch",
  },
  {
    commit: "4fe0b0b",
    date: "2026-03-25",
    title: "Add footer credit line to all pages",
    additions: 5,
    deletions: 0,
    scope: "patch",
  },
  {
    commit: "7242047",
    date: "2026-03-25",
    title: "Fix Turso connection: use createClient for proper URL handling",
    additions: 9,
    deletions: 7,
    scope: "patch",
  },
  {
    commit: "2551f81",
    date: "2026-03-25",
    title: "Migrate from file-based storage to Prisma + Turso for cloud deployment",
    additions: 186,
    deletions: 84,
    scope: "major",
  },
  {
    commit: "77b49ff",
    date: "2026-03-25",
    title: "feat: expand question bank to 166 items and optimize daily selection",
    additions: 149,
    deletions: 26,
    scope: "minor",
  },
  {
    commit: "98e6f16",
    date: "2026-03-25",
    title: "docs: add Windows quick start guide",
    additions: 118,
    deletions: 0,
    scope: "minor",
  },
  {
    commit: "8f8f57a",
    date: "2026-03-25",
    title: "docs: clarify that users should use the actual address shown in terminal",
    additions: 3,
    deletions: 4,
    scope: "patch",
  },
  {
    commit: "d85ccb6",
    date: "2026-03-25",
    title: "fix: add missing dotenv dependency and clarify README install step",
    additions: 8,
    deletions: 11,
    scope: "patch",
  },
  {
    commit: "aaebbf8",
    date: "2026-03-25",
    title: "docs: add detailed macOS setup guide for new users",
    additions: 128,
    deletions: 4,
    scope: "minor",
  },
  {
    commit: "0e5a502",
    date: "2026-03-25",
    title: "feat: implement Enhanced Dynamic MBTI full-stack application",
    additions: 1410,
    deletions: 528,
    scope: "major",
  },
  {
    commit: "6e20bb4",
    date: "2026-03-25",
    title: "feat: initial commit",
    additions: 0,
    deletions: 0,
    scope: "major",
  },
];

export function getVersionTimeline(): VersionEntry[] {
  let major = 0;
  let minor = 0;
  let patch = 0;

  return RAW_COMMITS.map((commit) => {
    const totalChanges = commit.additions + commit.deletions;

    if (commit.scope === "major") {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (commit.scope === "minor") {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }

    return {
      version: `${major}.${minor}.${patch}`,
      commit: commit.commit,
      date: commit.date,
      title: commit.title,
      scope: commit.scope,
      additions: commit.additions,
      deletions: commit.deletions,
      totalChanges,
      summary: summarizeCommit(commit.title),
    };
  });
}
