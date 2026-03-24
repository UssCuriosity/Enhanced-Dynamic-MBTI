import { DailyPoint, BoundaryStats } from "@/types";

/**
 * Generate a textual personality analysis based on boundary statistics.
 */
export function generatePersonalityInsight(stats: BoundaryStats, eiMean: number): string {
  const parts: string[] = [];

  // NS dimension analysis
  const nsLabel = stats.nsMean < -0.3 ? "直觉型(N)" : stats.nsMean > 0.3 ? "感觉型(S)" : "直觉-感觉平衡";
  const nsStability = stats.nsStd < 0.2 ? "稳定" : stats.nsStd < 0.4 ? "适度波动" : "显著波动";
  parts.push(`信息获取: 你整体偏向${nsLabel}，该维度${nsStability}（标准差 ${stats.nsStd.toFixed(2)}）。`);

  // TF dimension analysis
  const tfLabel = stats.tfMean < -0.3 ? "思考型(T)" : stats.tfMean > 0.3 ? "情感型(F)" : "思考-情感平衡";
  const tfStability = stats.tfStd < 0.2 ? "稳定" : stats.tfStd < 0.4 ? "适度波动" : "显著波动";
  parts.push(`决策方式: 你整体偏向${tfLabel}，该维度${tfStability}（标准差 ${stats.tfStd.toFixed(2)}）。`);

  // JP dimension analysis
  const jpLabel = stats.jpMean < -0.3 ? "判断型(J)" : stats.jpMean > 0.3 ? "感知型(P)" : "判断-感知平衡";
  const jpStability = stats.jpStd < 0.2 ? "稳定" : stats.jpStd < 0.4 ? "适度波动" : "显著波动";
  parts.push(`生活方式: 你整体偏向${jpLabel}，该维度${jpStability}（标准差 ${stats.jpStd.toFixed(2)}）。`);

  // EI modifier
  const eiLabel = eiMean < -0.3 ? "内向(I)" : eiMean > 0.3 ? "外向(E)" : "内外向平衡";
  parts.push(`能量方向: 你偏向${eiLabel}（均值 ${eiMean.toFixed(2)}），这影响着你在三维性格空间中的表达方式。`);

  // Overall stability
  if (stats.stability > 0.7) {
    parts.push("整体评估: 你的性格非常稳定，日常波动较小，你对自己的认知和行为模式有很高的一致性。");
  } else if (stats.stability > 0.4) {
    parts.push("整体评估: 你的性格有适度的灵活性，在不同情境下会展现不同的一面，这是一种健康的适应能力。");
  } else {
    parts.push("整体评估: 你的性格波动较大，你是一个多面的人，在不同环境和情绪下会展现截然不同的特质。");
  }

  // Trend analysis
  const trends: string[] = [];
  if (Math.abs(stats.nsTrend) > 0.02) {
    trends.push(
      `信息获取维度${stats.nsTrend > 0 ? "逐渐偏向感觉(S)" : "逐渐偏向直觉(N)"}`
    );
  }
  if (Math.abs(stats.tfTrend) > 0.02) {
    trends.push(
      `决策方式${stats.tfTrend > 0 ? "逐渐偏向情感(F)" : "逐渐偏向思考(T)"}`
    );
  }
  if (Math.abs(stats.jpTrend) > 0.02) {
    trends.push(
      `生活方式${stats.jpTrend > 0 ? "逐渐偏向感知(P)" : "逐渐偏向判断(J)"}`
    );
  }

  if (trends.length > 0) {
    parts.push(`变化趋势: 在测量期间，你的${trends.join("，")}。`);
  }

  return parts.join("\n\n");
}

/**
 * Get a traditional MBTI-like label from boundary stats.
 */
export function getMBTILabel(stats: BoundaryStats, eiMean: number): string {
  const e = eiMean >= 0 ? "E" : "I";
  const n = stats.nsMean <= 0 ? "N" : "S";
  const t = stats.tfMean <= 0 ? "T" : "F";
  const j = stats.jpMean <= 0 ? "J" : "P";
  return `${e}${n}${t}${j}`;
}

/**
 * Get the confidence level description for a traditional label.
 * Returns how strongly the person fits this type vs being borderline.
 */
export function getLabelConfidence(stats: BoundaryStats, eiMean: number): {
  label: string;
  confidence: number;
  description: string;
} {
  const dims = [
    { val: Math.abs(eiMean), std: stats.eiStd },
    { val: Math.abs(stats.nsMean), std: stats.nsStd },
    { val: Math.abs(stats.tfMean), std: stats.tfStd },
    { val: Math.abs(stats.jpMean), std: stats.jpStd },
  ];

  const avgClearance = dims.reduce((sum, d) => sum + d.val, 0) / dims.length;
  const avgStd = dims.reduce((sum, d) => sum + d.std, 0) / dims.length;

  const confidence = Math.min(1, avgClearance / (avgStd + 0.1));

  let description: string;
  if (confidence > 0.7) {
    description = "你的性格特征非常鲜明，传统 MBTI 标签对你有较高的描述力。";
  } else if (confidence > 0.4) {
    description = "你在某些维度上存在明显偏好，但在其他维度上比较灵活。单一标签难以完全描述你。";
  } else {
    description = "你的性格非常灵活多变，传统的固定标签对你的描述力有限。动态边界模型能更好地呈现你的人格特征。";
  }

  return {
    label: getMBTILabel(stats, eiMean),
    confidence,
    description,
  };
}

/**
 * Determine which octant(s) of the 3D space the person occupies most.
 */
export function getPersonalityZones(points: DailyPoint[]): {
  primary: string;
  secondary: string | null;
  distribution: Record<string, number>;
} {
  const zones: Record<string, number> = {
    NTJ: 0, NTP: 0, NFJ: 0, NFP: 0,
    STJ: 0, STP: 0, SFJ: 0, SFP: 0,
  };

  for (const p of points) {
    const n = p.ns <= 0 ? "N" : "S";
    const t = p.tf <= 0 ? "T" : "F";
    const j = p.jp <= 0 ? "J" : "P";
    zones[`${n}${t}${j}`]++;
  }

  const total = points.length || 1;
  const distribution: Record<string, number> = {};
  for (const [k, v] of Object.entries(zones)) {
    distribution[k] = v / total;
  }

  const sorted = Object.entries(zones).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted[0][0],
    secondary: sorted[1][1] > 0 ? sorted[1][0] : null,
    distribution,
  };
}
