import { Question, QuestionnaireResponse, SessionResult } from "@/types";
import { questionBank } from "./questions";

/**
 * Calculate 3D personality coordinates + EI score from questionnaire responses.
 * Each answer is on a 1-5 Likert scale (1=strongly disagree, 5=strongly agree).
 * Output scores are in [-1, 1] for each dimension.
 */
export function calculateScores(responses: QuestionnaireResponse[]): SessionResult {
  const questionMap = new Map<string, Question>();
  for (const q of questionBank) {
    questionMap.set(q.id, q);
  }

  const dimensionScores: Record<string, { sum: number; weightSum: number }> = {
    NS: { sum: 0, weightSum: 0 },
    TF: { sum: 0, weightSum: 0 },
    JP: { sum: 0, weightSum: 0 },
    EI: { sum: 0, weightSum: 0 },
  };

  for (const response of responses) {
    const question = questionMap.get(response.questionId);
    if (!question) continue;

    // Map Likert 1-5 to [-1, 1]: (value - 3) / 2
    const normalizedValue = (response.value - 3) / 2;

    // Apply polarity: if polarity is -1, agreeing pushes toward N/T/J/I (negative end)
    const score = normalizedValue * question.polarity;

    const dim = dimensionScores[question.dimension];
    if (dim) {
      dim.sum += score * question.weight;
      dim.weightSum += question.weight;
    }
  }

  const getScore = (dim: string): number => {
    const d = dimensionScores[dim];
    if (!d || d.weightSum === 0) return 0;
    return Math.max(-1, Math.min(1, d.sum / d.weightSum));
  };

  return {
    ns: getScore("NS"),
    tf: getScore("TF"),
    jp: getScore("JP"),
    ei: getScore("EI"),
  };
}
