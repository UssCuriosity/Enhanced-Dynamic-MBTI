import { Question } from "@/types";

export const questionBank: Question[] = [
  // ===== N-S 维度: 信息获取方式 =====
  // 情境题 (polarity: -1 = agree→N, +1 = agree→S)
  { id: "ns01", text: "遇到一个新问题时，我倾向于先看全局和可能性，而不是具体细节。", dimension: "NS", weight: 1, isAnchor: true, polarity: -1, category: "scenario" },
  { id: "ns02", text: "我更关注事物「是什么」而非「可能是什么」。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns03", text: "我经常会有天马行空的想法，联想到很远的事情。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns04", text: "在学习新知识时，我喜欢从具体例子入手。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns05", text: "我倾向于信任自己的直觉和第六感。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns06", text: "面对一项任务时，我会先了解操作步骤再开始。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns07", text: "比起已证实的方法，我更喜欢探索新的可能性。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns08", text: "我觉得「脚踏实地」比「仰望星空」更重要。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns09", text: "我常常想象未来的各种可能场景。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns10", text: "我注意到别人经常忽略的细节。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns11", text: "我喜欢用隐喻和类比来理解新概念。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns12", text: "我更喜欢有具体步骤的说明而不是抽象的理论。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns13", text: "我经常能看到事物之间隐藏的联系和规律。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns14", text: "我倾向于相信眼见为实。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns15", text: "在做决定前，我会想象各种可能的结果。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns16", text: "我更擅长处理具体的、实际的问题。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns17", text: "我对抽象的概念和理论很感兴趣。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns18", text: "我觉得经验比灵感更可靠。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  // 自我评估题
  { id: "ns_sa1", text: "今天我做决定时，更多是凭直觉还是基于已知的事实？（同意=凭直觉）", dimension: "NS", weight: 1.2, isAnchor: true, polarity: -1, category: "self_assessment" },
  { id: "ns_sa2", text: "今天我的思考更偏向「想象未来」而不是「分析现实」。", dimension: "NS", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },

  // ===== T-F 维度: 决策方式 =====
  { id: "tf01", text: "做决定时，我更看重逻辑和公正性。", dimension: "TF", weight: 1, isAnchor: true, polarity: -1, category: "scenario" },
  { id: "tf02", text: "我在做决定时会优先考虑他人的感受。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf03", text: "在争论中，我更关注谁的论点更有道理。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf04", text: "我容易被别人的情绪所感染。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf05", text: "我觉得在工作中应该对事不对人。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf06", text: "帮助别人时，我更倾向于先给予情感支持。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf07", text: "我认为好的决定应该基于客观分析而非主观感受。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf08", text: "我觉得维护和谐的关系比坚持正确更重要。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf09", text: "别人觉得我有时候说话太直接了。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf10", text: "我能敏锐地感知到别人的情绪变化。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf11", text: "面对批评时，我更关注内容是否合理。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf12", text: "我经常站在对方的角度思考问题。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf13", text: "我更欣赏那些有独立思考能力的人。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf14", text: "我觉得真诚和善良是最重要的品质。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf15", text: "规则和制度应该一视同仁地执行。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf16", text: "我宁愿被人说太心软，也不愿被说太冷漠。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf17", text: "分析问题时，我会刻意排除情感因素。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf18", text: "我做决定时常会考虑「这对人际关系有什么影响」。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  // 自我评估题
  { id: "tf_sa1", text: "今天在与人交流中，我更多用脑（逻辑）还是用心（情感）？（同意=用脑）", dimension: "TF", weight: 1.2, isAnchor: true, polarity: -1, category: "self_assessment" },
  { id: "tf_sa2", text: "今天我更倾向于理性分析，而非感性判断。", dimension: "TF", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },

  // ===== J-P 维度: 生活方式 =====
  { id: "jp01", text: "我喜欢提前规划好每天的安排。", dimension: "JP", weight: 1, isAnchor: true, polarity: -1, category: "scenario" },
  { id: "jp02", text: "我更享受随机应变的灵活感。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp03", text: "做完一件事让我感到满足和轻松。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp04", text: "有太多选择让我兴奋而不是焦虑。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp05", text: "我习惯用清单或日程表来管理任务。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp06", text: "我经常在截止日期前才开始认真工作。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp07", text: "当事情偏离计划时，我会感到不安。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp08", text: "我喜欢保持开放，看看事情会怎么发展。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp09", text: "我倾向于先做完工作再放松。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp10", text: "我觉得太多规则会限制创造力。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp11", text: "整洁有序的环境让我更高效。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp12", text: "计划不如变化快，适应力更重要。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp13", text: "我通常会提前到达约定的地点。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp14", text: "临时决定的活动往往更有趣。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp15", text: "我喜欢尽快做出决定，而不是一直权衡。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp16", text: "我喜欢同时进行多个项目。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp17", text: "完成任务清单上的每一项让我很有成就感。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp18", text: "我更倾向于探索新的可能性而不是按步骤执行。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  // 自我评估题
  { id: "jp_sa1", text: "今天我更想按计划行事还是随机应变？（同意=按计划）", dimension: "JP", weight: 1.2, isAnchor: true, polarity: -1, category: "self_assessment" },
  { id: "jp_sa2", text: "今天我更享受事情在掌控中的感觉。", dimension: "JP", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },

  // ===== E-I 维度: 能量来源方向 =====
  { id: "ei01", text: "和一群人在一起让我感到精力充沛。", dimension: "EI", weight: 1, isAnchor: true, polarity: 1, category: "ei_assessment" },
  { id: "ei02", text: "我需要独处时间来恢复精力。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei03", text: "在社交场合中，我通常是主动发起对话的那个人。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei04", text: "与其参加聚会，我更愿意在家看书或独自做事。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei05", text: "我喜欢先思考再表达，而不是边说边想。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei06", text: "认识新朋友让我感到兴奋。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei07", text: "长时间的社交活动会让我感到疲惫。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei08", text: "我喜欢成为团队讨论中的活跃参与者。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei09", text: "我内心的想法很丰富，但不一定都会说出来。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei10", text: "我在人群中感到自在和放松。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei11", text: "独自工作时我效率更高。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei12", text: "我倾向于有广泛的社交圈而非少数深交的朋友。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: 1, category: "ei_assessment" },
  // 自我评估题
  { id: "ei_sa1", text: "今天我更想和人在一起还是独处？（同意=和人在一起）", dimension: "EI", weight: 1.2, isAnchor: true, polarity: 1, category: "self_assessment" },
  { id: "ei_sa2", text: "今天我的社交能量很充沛。", dimension: "EI", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },
];

/**
 * Select questions for a given day.
 * - Always includes all anchor questions (for measurement consistency)
 * - Randomly samples remaining questions ensuring balanced dimension coverage
 * - Returns ~15 questions total
 */
export function selectDailyQuestions(dayNumber: number, totalQuestions = 15): Question[] {
  const rng = seededRandom(dayNumber * 7919);
  const anchors = questionBank.filter((q) => q.isAnchor);
  const nonAnchors = questionBank.filter((q) => !q.isAnchor);

  const remaining = totalQuestions - anchors.length;
  const perDimension = Math.floor(remaining / 4);

  const selected: Question[] = [...anchors];
  const dimensions = ["NS", "TF", "JP", "EI"] as const;

  for (const dim of dimensions) {
    const pool = nonAnchors.filter((q) => q.dimension === dim);
    const shuffled = shuffleArray(pool, rng);
    selected.push(...shuffled.slice(0, perDimension));
  }

  // Fill any remaining slots
  const usedIds = new Set(selected.map((q) => q.id));
  const leftover = nonAnchors.filter((q) => !usedIds.has(q.id));
  const shuffledLeftover = shuffleArray(leftover, rng);
  const needed = totalQuestions - selected.length;
  selected.push(...shuffledLeftover.slice(0, Math.max(0, needed)));

  return shuffleArray(selected, rng);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
