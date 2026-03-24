"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { DailyPoint } from "@/types";

interface TimelineChartProps {
  points: DailyPoint[];
}

export default function TimelineChart({ points }: TimelineChartProps) {
  const data = points.map((p) => ({
    day: `Day ${p.day}`,
    "N-S": Number(p.ns.toFixed(3)),
    "T-F": Number(p.tf.toFixed(3)),
    "J-P": Number(p.jp.toFixed(3)),
    "E-I": Number(p.ei.toFixed(3)),
  }));

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="text-sm font-medium mb-4">维度变化趋势</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis domain={[-1, 1]} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.3} />
          <Line type="monotone" dataKey="N-S" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="T-F" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="J-P" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="E-I" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
