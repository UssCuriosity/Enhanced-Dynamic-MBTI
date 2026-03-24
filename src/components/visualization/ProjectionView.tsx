"use client";

import { DailyPoint } from "@/types";

interface ProjectionViewProps {
  points: DailyPoint[];
  xKey: "ns" | "tf" | "jp";
  yKey: "ns" | "tf" | "jp";
  xLabel: string;
  yLabel: string;
  xLeftLabel: string;
  xRightLabel: string;
  yBottomLabel: string;
  yTopLabel: string;
}

const dimensionColors: Record<string, string> = {
  ns: "#ef4444",
  tf: "#22c55e",
  jp: "#3b82f6",
};

export default function ProjectionView({
  points,
  xKey,
  yKey,
  xLabel,
  yLabel,
  xLeftLabel,
  xRightLabel,
  yBottomLabel,
  yTopLabel,
}: ProjectionViewProps) {
  const size = 280;
  const padding = 40;
  const plotSize = size - padding * 2;

  const toPixelX = (v: number) => padding + ((v + 1) / 2) * plotSize;
  const toPixelY = (v: number) => size - padding - ((v + 1) / 2) * plotSize;

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="text-sm font-medium text-center mb-2">
        {xLabel} vs {yLabel}
      </div>
      <svg width={size} height={size} className="mx-auto">
        {/* Grid */}
        {[-1, -0.5, 0, 0.5, 1].map((v) => (
          <g key={v}>
            <line
              x1={toPixelX(v)} y1={padding}
              x2={toPixelX(v)} y2={size - padding}
              stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.5}
            />
            <line
              x1={padding} y1={toPixelY(v)}
              x2={size - padding} y2={toPixelY(v)}
              stroke="currentColor" strokeOpacity={0.1} strokeWidth={0.5}
            />
          </g>
        ))}

        {/* Axes */}
        <line x1={toPixelX(0)} y1={padding} x2={toPixelX(0)} y2={size - padding}
          stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
        <line x1={padding} y1={toPixelY(0)} x2={size - padding} y2={toPixelY(0)}
          stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />

        {/* Labels */}
        <text x={padding - 5} y={toPixelY(0)} textAnchor="end" dominantBaseline="middle"
          fill={dimensionColors[xKey]} fontSize={10}>{xLeftLabel}</text>
        <text x={size - padding + 5} y={toPixelY(0)} textAnchor="start" dominantBaseline="middle"
          fill={dimensionColors[xKey]} fontSize={10}>{xRightLabel}</text>
        <text x={toPixelX(0)} y={size - padding + 15} textAnchor="middle"
          fill={dimensionColors[yKey]} fontSize={10}>{yBottomLabel}</text>
        <text x={toPixelX(0)} y={padding - 8} textAnchor="middle"
          fill={dimensionColors[yKey]} fontSize={10}>{yTopLabel}</text>

        {/* Points */}
        {points.map((p, i) => {
          const t = points.length > 1 ? i / (points.length - 1) : 0;
          const hue = 220 - t * 220;
          return (
            <circle
              key={i}
              cx={toPixelX(p[xKey])}
              cy={toPixelY(p[yKey])}
              r={4}
              fill={`hsl(${hue}, 70%, 55%)`}
              opacity={0.8}
            >
              <title>Day {p.day}: {xKey}={p[xKey].toFixed(2)}, {yKey}={p[yKey].toFixed(2)}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
