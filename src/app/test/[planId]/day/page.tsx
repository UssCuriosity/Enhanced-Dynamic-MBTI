"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import QuestionCard from "@/components/questionnaire/QuestionCard";
import Link from "next/link";

interface QuestionItem {
  id: string;
  text: string;
  dimension: string;
  category: string;
}

export default function DailyTestPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const planId = params.planId as string;

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [dayNumber, setDayNumber] = useState(0);
  const [totalDays, setTotalDays] = useState(14);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [contextNote, setContextNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [result, setResult] = useState<{
    scores: { ns: number; tf: number; jp: number; ei: number };
    isComplete: boolean;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch(`/api/plans/${planId}/questions`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.alreadyDone) {
            setAlreadyDone(true);
          } else {
            setError(data.error || "获取问题失败");
          }
        } else {
          setQuestions(data.questions);
          setDayNumber(data.dayNumber);
          setTotalDays(data.totalDays);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("网络错误");
        setLoading(false);
      });
  }, [planId, status, router]);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);

    const answerArray = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    try {
      const res = await fetch(`/api/plans/${planId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answerArray, contextNote }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const data = await res.json();
        setError(data.error || "提交失败");
      }
    } catch {
      setError("网络错误");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">加载问卷中...</div>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-4xl">&#10003;</div>
          <h2 className="text-2xl font-bold">今天的测试已完成</h2>
          <p className="text-muted-foreground">明天再来继续你的性格探索吧！</p>
          <Link href={`/test/${planId}/progress`}>
            <Button variant="outline">查看进度</Button>
          </Link>
          <br />
          <Link href="/dashboard">
            <Button variant="ghost">返回面板</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (result) {
    const mbtiType = `${result.scores.ei >= 0 ? "E" : "I"}${result.scores.ns < 0 ? "N" : "S"}${result.scores.tf < 0 ? "T" : "F"}${result.scores.jp < 0 ? "J" : "P"}`;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-4xl">&#127881;</div>
          <h2 className="text-2xl font-bold">
            第 {dayNumber} 天完成！
          </h2>
          <div className="text-3xl font-bold tracking-widest text-primary">
            {mbtiType}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <ScoreDisplay label="E-I" value={result.scores.ei} leftLabel="E(+)" rightLabel="I(-)" inverted />
            <ScoreDisplay label="N-S" value={result.scores.ns} leftLabel="N(-)" rightLabel="S(+)" />
            <ScoreDisplay label="T-F" value={result.scores.tf} leftLabel="T(-)" rightLabel="F(+)" />
            <ScoreDisplay label="J-P" value={result.scores.jp} leftLabel="J(-)" rightLabel="P(+)" />
          </div>
          {result.isComplete ? (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                恭喜！你已完成所有测试天数，查看你的完整报告吧！
              </p>
              <Link href={`/test/${planId}/report`}>
                <Button size="lg">查看报告</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground">
                还剩 {totalDays - dayNumber} 天，明天继续！
              </p>
              <Link href={`/test/${planId}/progress`}>
                <Button variant="outline">查看进度</Button>
              </Link>
            </div>
          )}
          <Link href="/dashboard">
            <Button variant="ghost">返回面板</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              第 {dayNumber} / {totalDays} 天
            </span>
            <span className="text-sm text-muted-foreground">
              已答 {answeredCount} / {questions.length}
            </span>
          </div>
          <Progress value={(answeredCount / questions.length) * 100} />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        {questions.map((q, idx) => (
          <QuestionCard
            key={q.id}
            questionId={q.id}
            text={q.text}
            index={idx}
            total={questions.length}
            value={answers[q.id]}
            onChange={handleAnswer}
          />
        ))}

        <div className="p-6 bg-card rounded-xl border space-y-3">
          <label className="text-sm font-medium">
            今日备注（可选）
          </label>
          <Textarea
            placeholder="记录一下今天的心情或发生的事情..."
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            rows={3}
          />
        </div>

        <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t p-4 -mx-4">
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="w-full"
            size="lg"
          >
            {submitting
              ? "提交中..."
              : allAnswered
              ? "提交今日问卷"
              : `还有 ${questions.length - answeredCount} 题未答`}
          </Button>
        </div>
      </main>
    </div>
  );
}

function ScoreDisplay({
  label,
  value,
  leftLabel,
  rightLabel,
  inverted = false,
}: {
  label: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
  inverted?: boolean;
}) {
  const percentage = inverted
    ? ((-value + 1) / 2) * 100
    : ((value + 1) / 2) * 100;
  return (
    <div className="p-3 bg-card rounded-lg border space-y-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="relative h-2 bg-muted rounded-full">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-sm"
          style={{ left: `calc(${percentage}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span className="font-mono text-foreground">{value.toFixed(2)}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
