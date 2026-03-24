export type Dimension = "NS" | "TF" | "JP" | "EI";

export interface Question {
  id: string;
  text: string;
  dimension: Dimension;
  weight: number;
  isAnchor: boolean;
  /** +1 means choosing "agree" goes toward S/F/P/E; -1 means toward N/T/J/I */
  polarity: 1 | -1;
  category: "scenario" | "self_assessment" | "ei_assessment";
}

export interface Point3D {
  ns: number;
  tf: number;
  jp: number;
}

export interface DailyPoint extends Point3D {
  day: number;
  ei: number;
  date: string;
}

export interface EllipsoidParams {
  center: [number, number, number];
  radii: [number, number, number];
  rotation: number[][];
}

export interface BoundaryData {
  points: DailyPoint[];
  convexHull: number[][];
  ellipsoid: EllipsoidParams;
  centroid: Point3D;
  stats: BoundaryStats;
}

export interface BoundaryStats {
  nsMean: number;
  nsStd: number;
  nsTrend: number;
  tfMean: number;
  tfStd: number;
  tfTrend: number;
  jpMean: number;
  jpStd: number;
  jpTrend: number;
  eiMean: number;
  eiStd: number;
  volume: number;
  stability: number; // 0-1, higher = more stable personality
}

export interface QuestionnaireResponse {
  questionId: string;
  value: number; // 1-5 Likert scale
}

export interface SessionResult {
  ns: number;
  tf: number;
  jp: number;
  ei: number;
}
