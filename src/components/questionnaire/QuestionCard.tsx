"use client";

import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionId: string;
  text: string;
  index: number;
  total: number;
  value: number | undefined;
  onChange: (questionId: string, value: number) => void;
}

const likertLabels = [
  { value: 1, label: "非常不同意" },
  { value: 2, label: "不同意" },
  { value: 3, label: "中立" },
  { value: 4, label: "同意" },
  { value: 5, label: "非常同意" },
];

export default function QuestionCard({
  questionId,
  text,
  index,
  total,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <div className="p-6 bg-card rounded-xl border space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2.5 py-1 shrink-0">
          {index + 1}/{total}
        </span>
        <p className="text-base leading-relaxed">{text}</p>
      </div>
      <div className="flex gap-2 justify-center pt-2">
        {likertLabels.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(questionId, option.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[64px]",
              "hover:bg-accent",
              value === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50"
            )}
          >
            <span className="text-lg font-semibold">{option.value}</span>
            <span className="text-[10px] leading-tight">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
