import Link from "next/link";
import { ArrowLeft, GitBranch, Layers3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVersionTimeline } from "@/lib/versionTimeline";

export default function VersionsPage() {
  const timeline = getVersionTimeline();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.1),_transparent_30%)]" />
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.38em] text-cyan-300/80">Project Changelog</div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">版本更新时间线</h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              这个页面整理了项目的重要 commit，按改动规模分配版本号，并把项目演进整理成一条可读的 timeline。
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-white/15 bg-white/5 text-slate-50 hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>
        </div>

        <Card className="border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-50">
              <Layers3 className="h-5 w-5 text-cyan-300" />
              时间线
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-2">
              <div className="absolute left-[13px] top-1 bottom-1 w-px bg-gradient-to-b from-cyan-300 via-violet-400 to-amber-300 opacity-40" />
              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.commit} className="relative pl-10">
                    <div className="absolute left-0 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-slate-950/90 shadow-lg shadow-cyan-950/30">
                      <GitBranch className="h-3.5 w-3.5 text-cyan-300" />
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs text-cyan-100">
                              v{entry.version}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                              {entry.scope.toUpperCase()}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-slate-50">{entry.title}</h2>
                          <p className="text-sm leading-6 text-slate-300">{entry.summary}</p>
                        </div>
                        <div className="text-right text-xs text-slate-400">
                          <div>{entry.date}</div>
                          <div className="mt-1 font-mono text-slate-500">{entry.commit}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <Metric label="新增" value={`+${entry.additions}`} tone="from-cyan-300 to-sky-400" />
                        <Metric label="删除" value={`-${entry.deletions}`} tone="from-violet-300 to-fuchsia-400" />
                        <Metric label="总改动" value={`${entry.totalChanges}`} tone="from-amber-300 to-orange-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            icon={<Sparkles className="h-4 w-4 text-amber-300" />}
            title="版本规则"
            description="大改动提升主版本号，中等改动提升次版本号，小修复提升补丁号。"
          />
          <InfoCard
            icon={<GitBranch className="h-4 w-4 text-cyan-300" />}
            title="来源说明"
            description="内容来自 commit title 和 numstat，尽量用真实变化来总结版本。"
          />
          <InfoCard
            icon={<Layers3 className="h-4 w-4 text-violet-300" />}
            title="阅读方式"
            description="从下到上就是项目演进顺序，越靠后越接近当前版本。"
          />
        </div>
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</div>
      <div className={`mt-2 bg-gradient-to-r ${tone} bg-clip-text text-2xl font-semibold text-transparent`}>
        {value}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-lg shadow-cyan-950/10 backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-2">{icon}</div>
        <CardTitle className="text-base text-slate-50">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-slate-300">{description}</p>
      </CardContent>
    </Card>
  );
}
