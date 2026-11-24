/* ===========================================================
   卷面结构：按河北省唐山市八年级上学期期末/期中检测的真实题型设置
   - 数学：选择 → 填空 → 解答（计算/证明/应用）
   - 物理：选择 → 填空 → 实验探究 → 计算与简答
   - 语文：积累与运用（选择/默写）→ 阅读（文言文/现代文）→ 写作
   - 英语：单项选择 → 词汇运用 → 任务型阅读 → 书面表达（笔试部分）
   - 生物/地理：单项选择 → 识图/综合题
   - 历史：单项选择 → 材料分析
   说明：题目全部从题库按题型抽取，题量不足时自动按现有题目配比，
        卷面满分以实际抽到的分值合计为准。
   =========================================================== */
window.EXAM = {
  math: {
    name: "数学", minutes: { mid: 90, final: 100 },
    mid: { sections: [
      { t: "single", name: "选择题", note: "每小题 3 分，只有一个选项符合题意", n: 10, each: 3 },
      { t: "fill", name: "填空题", note: "每小题 3 分，把答案写在横线上", n: 6, each: 3 },
      { t: "answer", name: "解答题", note: "写出必要的文字说明、证明过程或演算步骤", n: 5, scores: [8, 10, 10, 12, 12] }
    ] },
    final: { sections: [
      { t: "single", name: "选择题", note: "每小题 3 分，只有一个选项符合题意", n: 10, each: 3 },
      { t: "fill", name: "填空题", note: "每小题 3 分，把答案写在横线上", n: 6, each: 3 },
      { t: "answer", name: "解答题", note: "写出必要的文字说明、证明过程或演算步骤", n: 6, scores: [8, 8, 8, 8, 10, 10] }
    ] }
  },

  physics: {
    name: "物理", minutes: { mid: 80, final: 90 },
    mid: { sections: [
      { t: "single", name: "选择题", note: "每小题 3 分，只有一个选项符合题意", n: 8, each: 3 },
      { t: "fill", name: "填空题", note: "每空 2 分", n: 6, each: 2 },
      { t: "exp", name: "实验探究题", note: "按要求完成实验报告中的各小题", n: 2, each: 12 },
      { t: "answer", name: "计算与简答题", note: "写出必要的公式和演算过程，只写结果不得分", n: 3, scores: [14, 14, 12] }
    ] },
    final: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分，只有一个选项符合题意", n: 12, each: 2 },
      { t: "fill", name: "填空题", note: "每空 2 分", n: 8, each: 2 },
      { t: "exp", name: "实验探究题", note: "按要求完成实验报告中的各小题", n: 2, each: 12 },
      { t: "answer", name: "计算与简答题", note: "写出必要的公式和演算过程，只写结果不得分", n: 3, each: 12 }
    ] }
  },

  chinese: {
    name: "语文", minutes: { mid: 120, final: 120 },
    mid: { sections: [
      { t: "single", name: "积累与运用", note: "每小题 3 分", n: 4, each: 3 },
      { t: "fill", name: "古诗文默写", note: "每空 2 分，有错别字该空不得分", n: 3, each: 2 },
      { t: "read", name: "阅读理解", note: "阅读下面材料，完成各题", n: 2, each: 21 },
      { t: "essay", name: "写作", note: "按要求作文，不少于 600 字", n: 1, each: 40 }
    ] },
    final: { sections: [
      { t: "single", name: "积累与运用", note: "每小题 3 分", n: 4, each: 3 },
      { t: "fill", name: "古诗文默写", note: "每空 2 分，有错别字该空不得分", n: 3, each: 2 },
      { t: "read", name: "阅读理解", note: "阅读下面材料，完成各题", n: 3, each: 14 },
      { t: "essay", name: "写作", note: "按要求作文，不少于 600 字", n: 1, each: 40 }
    ] }
  },

  english: {
    name: "英语", minutes: { mid: 90, final: 100 }, partial: "笔试部分，听力另测",
    mid: { sections: [
      { t: "single", name: "单项选择", note: "每小题 1 分", n: 8, each: 1 },
      { t: "fill", name: "词汇运用", note: "每小题 2 分", n: 3, each: 2 },
      { t: "read", name: "任务型阅读", note: "根据短文内容回答问题", n: 2, each: 12 },
      { t: "essay", name: "书面表达", note: "按提示写一篇短文", n: 1, each: 20 }
    ] },
    final: { sections: [
      { t: "single", name: "单项选择", note: "每小题 1 分", n: 10, each: 1 },
      { t: "fill", name: "词汇运用", note: "每小题 2 分", n: 4, each: 2 },
      { t: "read", name: "任务型阅读", note: "根据短文内容回答问题", n: 3, each: 12 },
      { t: "essay", name: "书面表达", note: "按提示写一篇短文", n: 1, each: 20 }
    ] }
  },

  biology: {
    name: "生物", minutes: { mid: 60, final: 60 },
    mid: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 13, each: 2 },
      { t: "answer", name: "识图与综合题", note: "结合图示或材料作答", n: 4, scores: [18, 19, 18, 19] }
    ] },
    final: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 15, each: 2 },
      { t: "answer", name: "识图与综合题", note: "结合图示或材料作答", n: 4, scores: [17, 18, 17, 18] }
    ] }
  },

  geography: {
    name: "地理", minutes: { mid: 60, final: 60 },
    mid: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 10, each: 2 },
      { t: "fill", name: "填空题", note: "每空 2 分", n: 2, each: 2 },
      { t: "answer", name: "读图综合题", note: "读图并结合所学知识作答", n: 3, scores: [25, 25, 26] }
    ] },
    final: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 12, each: 2 },
      { t: "answer", name: "读图综合题", note: "读图并结合所学知识作答", n: 4, each: 19 }
    ] }
  },

  history: {
    name: "历史", minutes: { mid: 60, final: 60 },
    mid: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 12, each: 2 },
      { t: "fill", name: "填空题", note: "每空 2 分", n: 4, each: 2 },
      { t: "material", name: "材料分析题", note: "阅读材料并结合所学知识作答", n: 3, scores: [23, 23, 22] }
    ] },
    final: { sections: [
      { t: "single", name: "选择题", note: "每小题 2 分", n: 12, each: 2 },
      { t: "fill", name: "填空题", note: "每空 2 分", n: 5, each: 2 },
      { t: "material", name: "材料分析题", note: "阅读材料并结合所学知识作答", n: 4, scores: [16, 16, 18, 16] }
    ] }
  }
};

/* 同区域历年真题改编卷：按真实卷面结构与答题时长组卷 */
window.REAL_PAPERS = [
  { id: "rp-m1", subject: "math", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-m2", subject: "math", region: "丰南区", year: "2024", term: "期中", kind: "mid",
    title: "唐山市丰南区 2023—2024 学年八年级上学期期中检测（改编）" },
  { id: "rp-m3", subject: "math", region: "路南区", year: "2023", term: "期末", kind: "final",
    title: "唐山市路南区 2022—2023 学年八年级上学期期末检测（改编）" },
  { id: "rp-p1", subject: "physics", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-p2", subject: "physics", region: "路南区", year: "2023", term: "期末", kind: "final",
    title: "唐山市路南区 2022—2023 学年八年级上学期期末检测（改编）" },
  { id: "rp-p3", subject: "physics", region: "开平区", year: "2024", term: "期中", kind: "mid",
    title: "唐山市开平区 2023—2024 学年八年级上学期期中检测（改编）" },
  { id: "rp-c1", subject: "chinese", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-c2", subject: "chinese", region: "丰南区", year: "2024", term: "期中", kind: "mid",
    title: "唐山市丰南区 2023—2024 学年八年级上学期期中检测（改编）" },
  { id: "rp-e1", subject: "english", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-e2", subject: "english", region: "开平区", year: "2024", term: "期中", kind: "mid",
    title: "唐山市开平区 2023—2024 学年八年级上学期期中检测（改编）" },
  { id: "rp-b1", subject: "biology", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-g1", subject: "geography", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-h1", subject: "history", region: "路北区", year: "2024", term: "期末", kind: "final",
    title: "唐山市路北区 2023—2024 学年八年级上学期期末检测（改编）" },
  { id: "rp-h2", subject: "history", region: "遵化市", year: "2023", term: "期末", kind: "final",
    title: "唐山市遵化市 2022—2023 学年八年级上学期期末检测（改编）" }
];
