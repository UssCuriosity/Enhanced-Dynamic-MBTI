import { Question } from "@/types";

export const questionBank: Question[] = [
  // =====================================================================
  // N-S 维度: 信息获取方式 (polarity: -1 = agree→N, +1 = agree→S)
  // =====================================================================

  // --- 情境题 ---
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
  { id: "ns19", text: "读说明书时，我会仔细看每个步骤和细节。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns20", text: "我经常发现自己在想「如果……会怎样」。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns21", text: "比起理论讨论，我更喜欢动手实践。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns22", text: "我容易注意到事物之间深层的关联。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns23", text: "我倾向于描述事物「实际是什么样」，而非「它意味着什么」。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns24", text: "当别人讲述一件事时，我更关心这件事背后的含义。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns25", text: "我喜欢有明确答案的问题，不喜欢模棱两可。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns26", text: "我经常有突然的灵光一闪。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns27", text: "我觉得现在拥有的比将来可能得到的更重要。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns28", text: "我喜欢探索「为什么」多过了解「是什么」。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns29", text: "我更擅长记住具体的事实和数据。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns30", text: "我有时会沉浸在自己构建的想象世界中。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns31", text: "解决问题时，我会优先参考过去成功的经验。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns32", text: "我喜欢用不同的角度重新审视熟悉的事物。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns33", text: "比起创意满分的方案，我更信任经过验证的方案。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns34", text: "我对新奇的想法和概念充满好奇。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns35", text: "我觉得照片比抽象画更有表达力。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns36", text: "阅读时，我更喜欢有丰富想象空间的作品。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns37", text: "别人说我是个务实的人。", dimension: "NS", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns38", text: "我经常关注事物可能演变的趋势和方向。", dimension: "NS", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "ns39", text: "旅行时，我更喜欢按攻略上的推荐去打卡。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "ns40", text: "我喜欢思考那些没有标准答案的开放性问题。", dimension: "NS", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },

  // --- 每日自评题 ---
  { id: "ns_sa1", text: "今天我做决定时，更多是凭直觉还是基于已知的事实？（同意=凭直觉）", dimension: "NS", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "ns_sa2", text: "今天我的思考更偏向「想象未来」而不是「分析现实」。", dimension: "NS", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "ns_sa3", text: "今天我关注的更多是眼前的具体事务，而非长远的可能性。", dimension: "NS", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },
  { id: "ns_sa4", text: "今天我有很多天马行空的联想和灵感。", dimension: "NS", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },

  // =====================================================================
  // T-F 维度: 决策方式 (polarity: -1 = agree→T, +1 = agree→F)
  // =====================================================================

  // --- 情境题 ---
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
  { id: "tf19", text: "看到不合理的事情，我会直接指出来。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf20", text: "我觉得理解别人的感受比解决问题本身更重要。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf21", text: "对于工作中的分歧，我认为应该用数据说话。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf22", text: "我很难拒绝别人的请求，即使有些不太合理。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf23", text: "我更看重一个人的能力而非态度。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf24", text: "当朋友遇到困难，我的第一反应是安慰而非分析原因。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf25", text: "我认为感情用事是做决定的大忌。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf26", text: "我觉得世界需要更多的善意和包容。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf27", text: "我习惯用利弊清单来辅助做重要决定。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf28", text: "即使自己吃亏，我也不想伤害别人的感情。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf29", text: "我更关心事情的效率而非参与者的感受。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf30", text: "当需要传达坏消息时，我会花很多心思考虑措辞。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf31", text: "我觉得真相比安慰更重要。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf32", text: "我经常被电影或书中角色的遭遇深深打动。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf33", text: "讨论问题时，我更关注论点是否站得住脚。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf34", text: "我觉得一个好的领导者应该首先关心团队成员的感受。", dimension: "TF", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf35", text: "做评价时，我尽量不让个人喜好影响判断。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf36", text: "我倾向于给予别人鼓励而非批评。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf37", text: "我认为公平比仁慈更重要。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf38", text: "我能感受到房间里微妙的紧张气氛。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "tf39", text: "处理冲突时，我更倾向于就事论事。", dimension: "TF", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "tf40", text: "在团队中，我经常主动担任调解者的角色。", dimension: "TF", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },

  // --- 每日自评题 ---
  { id: "tf_sa1", text: "今天在与人交流中，我更多用脑（逻辑）还是用心（情感）？（同意=用脑）", dimension: "TF", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "tf_sa2", text: "今天我更倾向于理性分析，而非感性判断。", dimension: "TF", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "tf_sa3", text: "今天我在做选择时，主要依据的是事实和逻辑。", dimension: "TF", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "tf_sa4", text: "今天我特别在意周围人的情绪和感受。", dimension: "TF", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },

  // =====================================================================
  // J-P 维度: 生活方式 (polarity: -1 = agree→J, +1 = agree→P)
  // =====================================================================

  // --- 情境题 ---
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
  { id: "jp19", text: "我的桌面和文件夹通常是整理好的。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp20", text: "我享受没有明确目的的闲逛和探索。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp21", text: "旅行前，我会提前规划好详细的行程。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp22", text: "我经常在最后一刻才做出决定。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp23", text: "没有完成当天的计划会让我感到不安。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp24", text: "我觉得生活中最好的事情往往是计划之外的。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp25", text: "我倾向于把工作按优先级排好序再开始。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp26", text: "我更喜欢灵活调整方向而不是固守方案。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp27", text: "遇到约会或会议，我通常都会提前到达。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp28", text: "规定太多步骤的流程会让我感到窒息。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp29", text: "我习惯为重要的事情设定明确的截止日期。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp30", text: "我对日程表排得太满感到抗拒。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp31", text: "完成一个阶段性目标后，我才会开始放松。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp32", text: "我更看重过程中的体验而非最终的结果。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp33", text: "面对选择时，我倾向于快速决定而不是反复犹豫。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp34", text: "开始一个新项目比完成一个旧项目更让我兴奋。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp35", text: "我的生活节奏比较规律和有条理。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp36", text: "突然出现的机会比预定的计划更吸引我。", dimension: "JP", weight: 1, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp37", text: "出门前我会确认带齐所有需要的东西。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp38", text: "我经常同时关注多个不同的兴趣爱好。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },
  { id: "jp39", text: "做事情时，我倾向于按部就班地进行。", dimension: "JP", weight: 1, isAnchor: false, polarity: -1, category: "scenario" },
  { id: "jp40", text: "我觉得「随缘」是一种很好的生活态度。", dimension: "JP", weight: 0.8, isAnchor: false, polarity: 1, category: "scenario" },

  // --- 每日自评题 ---
  { id: "jp_sa1", text: "今天我更想按计划行事还是随机应变？（同意=按计划）", dimension: "JP", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "jp_sa2", text: "今天我更享受事情在掌控中的感觉。", dimension: "JP", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "jp_sa3", text: "今天我把大部分事情都安排得井井有条。", dimension: "JP", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
  { id: "jp_sa4", text: "今天我更享受随性、不受约束的状态。", dimension: "JP", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },

  // =====================================================================
  // E-I 维度: 能量来源方向 (polarity: -1 = agree→I, +1 = agree→E)
  // =====================================================================

  // --- 测评题 ---
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
  { id: "ei13", text: "在聚会上，我通常是最后离开的那批人。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei14", text: "连续几天独处对我来说完全没有问题。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei15", text: "我喜欢在团队中头脑风暴，互相激发想法。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei16", text: "深度阅读和独自思考是我给自己充电的方式。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei17", text: "我很容易和陌生人聊起来。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei18", text: "在嘈杂的环境中我很难集中注意力。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei19", text: "我会主动组织朋友聚会或集体活动。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei20", text: "电话响起时，我有时会犹豫要不要接。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei21", text: "旅行时，我喜欢和当地人交流互动。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei22", text: "工作中被频繁打断会让我非常烦躁。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei23", text: "我觉得独自吃饭完全不是什么问题。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei24", text: "我在人多的场合反而感觉更有活力。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei25", text: "周末我更倾向于安静地待在家里。", dimension: "EI", weight: 1, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei26", text: "和朋友见面后，我感觉精力更充沛了。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei27", text: "我更喜欢通过文字而非电话来沟通。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei28", text: "参加社交活动之前，我不需要做什么心理准备。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: 1, category: "ei_assessment" },
  { id: "ei29", text: "我享受一个人散步或慢跑的时光。", dimension: "EI", weight: 0.8, isAnchor: false, polarity: -1, category: "ei_assessment" },
  { id: "ei30", text: "团队合作比独自工作更能激发我的创造力。", dimension: "EI", weight: 1, isAnchor: false, polarity: 1, category: "ei_assessment" },

  // --- 每日自评题 ---
  { id: "ei_sa1", text: "今天我更想和人在一起还是独处？（同意=和人在一起）", dimension: "EI", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },
  { id: "ei_sa2", text: "今天我的社交能量很充沛。", dimension: "EI", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },
  { id: "ei_sa3", text: "今天社交活动让我感到愉快而非疲惫。", dimension: "EI", weight: 1.2, isAnchor: false, polarity: 1, category: "self_assessment" },
  { id: "ei_sa4", text: "今天我更享受安静独处的时刻。", dimension: "EI", weight: 1.2, isAnchor: false, polarity: -1, category: "self_assessment" },
];

/**
 * Select questions for a given day.
 * - Rotates 1 daily-state question per dimension (from self_assessment pool)
 * - Randomly samples remaining questions from the general pool, balanced across dimensions
 * - Returns ~15 questions total with high variety across 21 days
 */
export function selectDailyQuestions(dayNumber: number, totalQuestions = 15): Question[] {
  const rng = seededRandom(dayNumber * 7919);
  const dimensions = ["NS", "TF", "JP", "EI"] as const;

  const dailyState: Question[] = [];
  for (const dim of dimensions) {
    const saPool = questionBank.filter(
      (q) => q.dimension === dim && q.category === "self_assessment"
    );
    const idx = (dayNumber - 1) % saPool.length;
    dailyState.push(saPool[idx]);
  }

  const usedIds = new Set(dailyState.map((q) => q.id));
  const remaining = totalQuestions - dailyState.length;
  const perDimension = Math.floor(remaining / 4);

  const selected: Question[] = [...dailyState];

  for (const dim of dimensions) {
    const pool = questionBank.filter(
      (q) => q.dimension === dim && q.category !== "self_assessment" && !usedIds.has(q.id)
    );
    const shuffled = shuffleArray(pool, rng);
    const picked = shuffled.slice(0, perDimension);
    selected.push(...picked);
    picked.forEach((q) => usedIds.add(q.id));
  }

  const leftover = questionBank.filter(
    (q) => !usedIds.has(q.id) && q.category !== "self_assessment"
  );
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
