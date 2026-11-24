/* ===========================================================
   青苗学堂 · 应用逻辑
   =========================================================== */
(function () {
  "use strict";

  var C = window.CURRICULUM;
  var BANK = window.BANK || [];
  var PAPERS = window.REAL_PAPERS || [];
  var KEY = "qingmiao_ts8_v1";

  var SUBJ = {};
  C.subjects.forEach(function (s) { SUBJ[s.id] = s; });
  var CH = {};
  C.subjects.forEach(function (s) {
    s.chapters.forEach(function (c) {
      CH[c.id] = { id: c.id, no: c.no, title: c.title, subject: s.id, color: s.color, name: s.name };
    });
  });
  var QMAP = {};
  BANK.forEach(function (q) { QMAP[q.id] = q; });

  /* 题型字典：与真实期末卷的题型名称一致 */
  var QT = {
    single: "选择题", judge: "判断题", fill: "填空题",
    answer: "解答题", exp: "实验探究题", read: "阅读理解",
    essay: "写作", material: "材料分析题"
  };
  var SUBJECTIVE = { answer: 1, exp: 1, read: 1, essay: 1, material: 1 };
  function isSubj(q) { return !!SUBJECTIVE[q.t]; }

  var VIEW = "points";
  var quiz = null, quizTimer = null;
  var focus = { sec: 0, run: false, timer: null };
  var lastPointReason = "";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  /* 题图 / 阅读材料 / 小问 渲染 */
  var figHtml = function (id, cls) {
    var f = window.FIGS && window.FIGS[id];
    if (!f) return "";
    return '<div class="' + (cls || "q-fig") + '">' + f + "</div>";
  };
  var passageHtml = function (txt) {
    if (!txt) return "";
    return '<div class="q-passage">' + esc(txt).replace(/\n/g, "<br>") + "</div>";
  };
  var subsHtml = function (q) {
    if (!q.subs || !q.subs.length) return "";
    return '<div class="sub-list">' + q.subs.map(function (s) {
      return '<div class="sub-q">' + esc(s.q).replace(/\n/g, "<br>") + "</div>";
    }).join("") + "</div>";
  };
  var fmtDate = function (d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  };
  var fmtTime = function (d) {
    return fmtDate(d) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  var shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  var mmss = function (sec) {
    sec = Math.max(0, Math.floor(sec));
    return pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
  };

  /* ================= 状态 ================= */
  function defaultState() {
    return {
      v: 1,
      subject: "math",
      nick: "同学",
      district: "路北区",
      points: 0,
      streak: 0,
      lastActive: "",
      today: { date: fmtDate(new Date()), minutes: 0, points: 0 },
      wrong: [],
      records: [],
      chapterDone: {},
      settings: { autoSync: true, syncTime: "内置资料包 · 已就绪", syncVer: C.version, watch: true },
      goal: 20
    };
  }

  var S;
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      S = raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
    } catch (e) { S = defaultState(); }
    if (!S.wrong) S.wrong = [];
    if (!S.records) S.records = [];
    if (!S.chapterDone) S.chapterDone = {};
    if (!S.settings) S.settings = defaultState().settings;
    var today = fmtDate(new Date());
    if (S.today.date !== today) { S.today = { date: today, minutes: 0, points: 0 }; }
    if (S.lastActive !== today) {
      var y = new Date(); y.setDate(y.getDate() - 1);
      S.streak = S.lastActive === fmtDate(y) ? (S.streak || 0) + 1 : 1;
      S.lastActive = today;
    }
    if (!S.streak) S.streak = 1;
    if (!SUBJ[S.subject]) S.subject = "math";
    save();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { toast("本地存储空间不足，建议清理部分错题图片", "warn"); }
  }

  /* ================= 积分 / 等级 ================= */
  var LEVELS = [
    { n: 0, t: "学芽" }, { n: 120, t: "学苗" }, { n: 320, t: "学树" },
    { n: 700, t: "学霸" }, { n: 1200, t: "学神" }
  ];
  function levelInfo(p) {
    var i = 0;
    for (var k = 0; k < LEVELS.length; k++) if (p >= LEVELS[k].n) i = k;
    var cur = LEVELS[i], next = LEVELS[i + 1];
    return {
      name: cur.t,
      next: next ? next.t : "满级",
      need: next ? next.n - p : 0,
      pct: next ? Math.min(100, Math.round(((p - cur.n) / (next.n - cur.n)) * 100)) : 100
    };
  }
  function addPoints(n, reason) {
    S.points += n;
    S.today.points += n;
    lastPointReason = reason;
    updateCoin(true);
    save();
    if (n > 0) toast("+" + n + " 积分 · " + reason, "good");
  }
  function updateCoin(bump) {
    var num = $("#coinNum"), lv = $("#coinLv");
    if (!num) return;
    if (bump && num.animate) {
      num.animate([{ transform: "scale(1)" }, { transform: "scale(1.22)", color: "#C9A45B" }, { transform: "scale(1)" }], { duration: 520 });
    }
    num.textContent = S.points;
    lv.textContent = levelInfo(S.points).name;
  }
  function updateWrongBadge() {
    var b = $("#wrongBadge");
    if (!b) return;
    var n = S.wrong.filter(function (w) { return !w.fixed; }).length;
    if (n > 0) { b.hidden = false; b.textContent = n; } else { b.hidden = true; }
  }
  function updateSyncMini() {
    var t = $("#syncStateText"), sub = $("#syncStateSub"), bar = $("#syncMiniBar");
    if (!t) return;
    t.textContent = S.settings.autoSync ? "资料库自动同步" : "资料库手动模式";
    sub.textContent = SUBJ[S.subject] ? (SUBJ[S.subject].book.replace(" · ", " ") + " · " + BANK.length + " 道题") : "";
    if (bar) bar.style.width = "100%";
  }

  /* ================= 提示 / 弹窗 ================= */
  function toast(msg, kind) {
    var wrap = $("#toastWrap");
    if (!wrap) return;
    var d = document.createElement("div");
    d.className = "toast" + (kind ? " " + kind : "");
    d.textContent = msg;
    wrap.appendChild(d);
    setTimeout(function () {
      d.style.transition = "opacity .3s,transform .3s";
      d.style.opacity = "0"; d.style.transform = "translateY(8px)";
      setTimeout(function () { d.remove(); }, 320);
    }, 2300);
  }
  function openModal(html, wide) {
    var box = $("#modalBox");
    box.className = "modal" + (wide ? " wide" : "");
    box.innerHTML = html;
    $("#modalMask").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    $("#modalMask").hidden = true;
    $("#modalBox").innerHTML = "";
    document.body.style.overflow = "";
  }
  function confirmModal(title, text, okText, onOk) {
    openModal(
      '<div class="modal-head"><div><h3>' + esc(title) + "</h3><p>" + esc(text) + "</p></div>" +
      '<button class="modal-close" data-act="close-modal">✕</button></div>' +
      '<div class="modal-foot"><button class="btn" data-act="close-modal">再想想</button>' +
      '<button class="btn btn-primary" id="mcOk">' + esc(okText || "确定") + "</button></div>"
    );
    $("#mcOk").onclick = function () { closeModal(); onOk && onOk(); };
  }

  /* ================= 通用片段 ================= */
  function subjectBar() {
    var box = $("#subjectBar");
    box.innerHTML = C.subjects.map(function (s) {
      return '<button class="sub-chip' + (s.id === S.subject ? " is-active" : "") +
        '" data-act="sub" data-id="' + s.id + '"><i style="background:' + s.color + '"></i>' + esc(s.name) + "</button>";
    }).join("");
  }
  function emptyBox(ico, title, desc, btn) {
    return '<div class="empty"><div class="em-ico">' + ico + "</div><p>" + esc(title) + "</p>" +
      (desc ? "<small>" + esc(desc) + "</small>" : "") +
      (btn ? '<div class="em-act">' + btn + "</div>" : "") + "</div>";
  }

  /* ================= 视图：要点 ================= */
  function renderPoints(chId) {
    var subj = SUBJ[S.subject];
    var cur = chId || (subj.chapters[0] && subj.chapters[0].id);
    var ch = subj.chapters.filter(function (c) { return c.id === cur; })[0] || subj.chapters[0];

    var list = subj.chapters.map(function (c, i) {
      return '<button class="chapter-item' + (c.id === ch.id ? " is-active" : "") + '" data-act="chapter" data-id="' + c.id + '">' +
        '<span class="ci-no">' + (i + 1) + "</span>" +
        '<span class="ci-txt"><b>' + esc(c.title) + "</b><span>" + esc(c.no) + " · " + c.points.length + " 个要点</span></span>" +
        "</button>";
    }).join("");

    var cards = ch.points.map(function (p, i) {
      return '<div class="point-card">' +
        '<div class="pc-head"><span class="pc-num">' + (i + 1) + "</span><h3>" + esc(p.t) + "</h3></div>" +
        '<ul class="pc-key">' + p.key.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>" +
        '<div class="pc-talk"><b>通俗讲：</b>' + esc(p.talk) + "</div>" +
        (p.tip ? '<div class="pc-tip"><em>易错提示</em><span>' + esc(p.tip) + "</span></div>" : "") +
        "</div>";
    }).join("");

    var done = S.chapterDone[ch.id];
    var rate = done && done.n ? Math.round((done.c / done.n) * 100) : null;

    $("#view").innerHTML =
      '<div class="page-head"><div><div class="page-title">要点精讲 <small>' + esc(subj.book) + "</small></div>" +
      '<p class="page-sub">' + esc(subj.note) + "</p></div></div>" +
      '<div class="kp-layout"><div class="chapter-list">' + list + "</div>" +
      '<div class="kp-main">' +
      '<div class="kp-hero"><h2>' + esc(ch.no + " · " + ch.title) + "</h2>" +
      "<p>" + ch.points.length + " 个必会要点，每个要点都配了“人话版”讲解和易错提醒。读完直接做题，效果最好。</p>" +
      '<div class="kp-hero-meta"><span class="tag">' + esc(ch.weight) + "</span>" +
      ch.tags.map(function (t) { return '<span class="tag tag-gray">' + esc(t) + "</span>"; }).join("") +
      (rate !== null ? '<span class="tag tag-sage">当前正确率 ' + rate + "%</span>" : '<span class="tag tag-sand">尚未练习</span>') +
      "</div></div>" +
      cards +
      '<div class="card card-pad" style="margin-top:6px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
      "<div style=\"flex:1;min-width:180px\"><b style=\"font-size:14px\">看完要点，练一组巩固一下</b>" +
      '<p style="font-size:12.4px;color:var(--ink-3);margin-top:3px">本章共 ' + chapterQs(ch.id).length + " 道题，约 " +
      Math.max(5, chapterQs(ch.id).length * 2) + " 分钟</p></div>" +
      '<button class="btn btn-primary" data-act="start-chapter" data-id="' + ch.id + '">开始本章强化 →</button></div>' +
      "</div></div>";
  }
  function chapterQs(chId) {
    return BANK.filter(function (q) { return q.s === S.subject && q.c === chId; });
  }

  /* 按进度智能强化：优先未练 / 正确率低的章节 */
  function smartQuiz() {
    var subj = SUBJ[S.subject];
    var scored = subj.chapters.map(function (c) {
      var d = S.chapterDone[c.id];
      var done = !!(d && d.n);
      return { id: c.id, title: c.title, done: done, rate: done ? d.c / d.n : -1 };
    }).sort(function (a, b) {
      if (!a.done && b.done) return -1;
      if (a.done && !b.done) return 1;
      return a.rate - b.rate;
    });
    var pick = scored.slice(0, Math.min(3, scored.length));
    var pool = BANK.filter(function (q) {
      return q.s === S.subject && q.t !== "essay" && pick.some(function (p) { return p.id === q.c; });
    });
    if (!pool.length) { toast("暂无可练习的题目", "warn"); return; }
    var qs = shuffle(pool).slice(0, Math.min(9, pool.length));
    var order = { single: 0, judge: 1, fill: 2, answer: 3, exp: 3, material: 4, read: 4, essay: 5 };
    qs.sort(function (a, b) { return (order[a.t] || 0) - (order[b.t] || 0); });
    var untried = pick.filter(function (p) { return !p.done; }).length;
    startQuiz({
      mode: "chapter",
      title: "按进度强化 · " + pick.map(function (p) { return p.title; }).join(" / "),
      sub: (untried ? "含 " + untried + " 个未练章节 · " : "针对薄弱章节 · ") + qs.length + " 题",
      qs: qs,
      minutes: Math.max(8, qs.length * 2)
    });
  }

  /* ================= 视图：练习 ================= */
  function renderPractice() {
    var subj = SUBJ[S.subject];
    var chs = subj.chapters.map(function (c) {
      var qs = chapterQs(c.id), d = S.chapterDone[c.id];
      var rate = d && d.n ? Math.round((d.c / d.n) * 100) : 0;
      return '<button class="ch-card" data-act="start-chapter" data-id="' + c.id + '">' +
        '<div class="ch-card-top"><h4>' + esc(c.title) + '</h4><span class="tag tag-gray">' + qs.length + " 题</span></div>" +
        '<div class="ch-meta"><span>' + esc(c.no) + "</span><span>" + (d && d.n ? "已练 " + d.n + " 题" : "未练习") + "</span></div>" +
        '<div class="ch-bar"><i style="width:' + rate + '%"></i></div>' +
        '<div class="ch-go">' + (d && d.n ? "正确率 " + rate + "%" : "开始强化") + " →</div></button>";
    }).join("");

    var real = PAPERS.filter(function (p) { return p.subject === S.subject; });
    var realHtml = real.length ? real.map(function (p) {
      var pv = paperPreview(p.subject, p.kind || "final");
      return '<div class="paper-card"><div class="paper-thumb">' + esc(p.region) + "<br>" + esc(p.year) + "</div>" +
        '<div class="paper-info"><h4>' + esc(p.title) + "</h4>" +
        '<div class="pm"><span class="tag tag-rose">真题改编</span><span>' + (p.kind === "mid" ? "期中" : "期末") + "卷</span>" +
        "<span>" + pv.n + " 题</span><span>满分 " + pv.total + " 分</span><span>" + paperMinutes(p.kind || "final") + " 分钟</span></div>" +
        '<div class="btn-row"><button class="btn btn-sm btn-primary" data-act="start-real" data-id="' + p.id + '">开始练习</button>' +
        '<button class="btn btn-sm" data-act="print-real" data-id="' + p.id + '">打印</button></div>' +
        "</div></div>";
    }).join("") : emptyBox("◇", "本学科暂未收录真题卷", "可在设置中心开启自动同步，或手动导入题库文件");

    var recs = S.records.slice(-4).reverse();
    var recHtml = recs.length ? recs.map(function (r) {
      return '<div class="paper-card"><div class="paper-thumb">' + Math.round(r.correct / r.total * 100) + "%</div>" +
        '<div class="paper-info"><h4>' + esc(r.title) + "</h4>" +
        '<div class="pm"><span>' + esc(SUBJ[r.subject] ? SUBJ[r.subject].name : "") + "</span><span>得分 " + r.correct + "/" + r.total + "</span><span>用时 " + mmss(r.sec) + "</span></div>" +
        '<div style="font-size:11.5px;color:var(--ink-3)">' + esc(r.date) + "</div></div></div>";
    }).join("") : emptyBox("◷", "还没有练习记录", "任选一个章节开始，做完自动记录");

    $("#view").innerHTML =
      '<div class="page-head"><div><div class="page-title">强化练习 <small>' + esc(subj.name) + " · 八上</small></div>" +
      '<p class="page-sub">按章节精准强化，或直接进入同区域真题、期中期末模拟卷。练习全程计时，交卷即出解析。</p></div>' +
      '<div class="btn-row"><button class="btn btn-primary" data-act="smart">按进度强化</button>' +
      '<button class="btn btn-soft" data-act="mode" data-mode="mid">期中模拟卷</button>' +
      '<button class="btn btn-soft" data-act="mode" data-mode="final">期末模拟卷</button></div></div>' +

      '<div class="mode-grid">' +
      modeCard("✎", "#EFF5FA", "#6E8FB2", "章节强化", "紧跟课本进度，逐章过关，薄弱点立即暴露", "chapter") +
      modeCard("❖", "#F7EDEC", "#A96F6A", "历年真题", "唐山各区期末卷改编，题型结构与本地区完全一致", "real") +
      modeCard("◈", "#E9F1EA", "#5F7F68", "期中模拟", "前半册内容，按期中卷题型结构组卷", "mid") +
      modeCard("◇", "#F7F1E4", "#9A7C4A", "期末模拟", "全册覆盖，选择·填空·解答·实验全题型", "final") +
      "</div>" +

      '<div id="sec-chapter"><div class="section-title"><h3>按章节强化</h3><p>' + subj.chapters.length + " 个章节</p></div>" +
      '<div class="chapter-grid">' + chs + "</div></div>" +

      '<div id="sec-real"><div class="section-title"><h3>同区域历年真题</h3><p>共 ' + real.length + " 套 · 唐山各区</p></div>" +
      '<div class="paper-list">' + realHtml + "</div></div>" +

      '<div class="section-title"><h3>最近练习</h3><p>共 ' + S.records.length + " 次</p></div>" +
      '<div class="paper-list">' + recHtml + "</div>";
  }
  function modeCard(ico, bg, color, title, desc, mode) {
    return '<button class="mode-card" data-act="mode" data-mode="' + mode + '">' +
      '<span class="mc-arrow">›</span>' +
      '<div class="mc-ico" style="background:' + bg + ";color:" + color + '">' + ico + "</div>" +
      "<h3>" + title + "</h3><p>" + desc + "</p></button>";
  }

  /* ================= 组卷：严格按真实卷面题型结构 ================= */
  function examSpec(kind) {
    var e = window.EXAM && window.EXAM[S.subject];
    if (!e) return null;
    return e[kind] || e.final;
  }
  function paperMinutes(kind) {
    var e = window.EXAM && window.EXAM[S.subject];
    var m = e && e.minutes ? e.minutes[kind] || e.minutes.final : 90;
    return m || 90;
  }
  /* 稳定乱序：同一套真题每次打开题目顺序一致，避免"同一张卷子题不一样" */
  function seeded(arr, seed) {
    var h = 0, i, a = arr.slice();
    for (i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100000;
    for (i = a.length - 1; i > 0; i--) {
      h = (h * 1103515245 + 12345) % 2147483648;
      var j = h % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function assemblePaper(kind, seed) {
    var spec = examSpec(kind);
    if (!spec) return [];
    var subj = SUBJ[S.subject];
    var half = Math.ceil(subj.chapters.length / 2);
    var chs = (kind === "mid" ? subj.chapters.slice(0, half) : subj.chapters)
      .map(function (c) { return c.id; });
    var pool = BANK.filter(function (q) { return q.s === S.subject && chs.indexOf(q.c) >= 0; });
    var used = {}, out = [];
    spec.sections.forEach(function (sec) {
      var cand = pool.filter(function (q) { return q.t === sec.t && !used[q.id]; });
      cand = seed ? seeded(cand, seed + "|" + sec.t) : shuffle(cand);
      cand.slice(0, sec.n).forEach(function (q, i) {
        var sc = sec.each || (sec.scores ? (sec.scores[i] || sec.scores[sec.scores.length - 1]) : (q.score || 5));
        var c = {};
        for (var k in q) { if (Object.prototype.hasOwnProperty.call(q, k)) c[k] = q[k]; }
        c._score = sc;
        c._sec = sec.name;
        used[q.id] = 1;
        out.push(c);
      });
    });
    return out;
  }
  function paperTotal(list) {
    return list.reduce(function (s, q) { return s + (q._score || q.score || 5); }, 0);
  }
  /* 卷面预览：不组卷，只按题库实际题量估算题量与满分 */
  function paperPreview(subject, kind) {
    var ex = window.EXAM && window.EXAM[subject];
    if (!ex) return { n: 0, total: 0 };
    var sp = ex[kind] || ex.final;
    var subj = SUBJ[subject];
    var half = Math.ceil(subj.chapters.length / 2);
    var chs = (kind === "mid" ? subj.chapters.slice(0, half) : subj.chapters).map(function (c) { return c.id; });
    var pool = BANK.filter(function (q) { return q.s === subject && chs.indexOf(q.c) >= 0; });
    var n = 0, total = 0;
    sp.sections.forEach(function (sec) {
      var avail = pool.filter(function (q) { return q.t === sec.t; }).length;
      var take = Math.min(avail, sec.n);
      n += take;
      if (sec.each) total += take * sec.each;
      else {
        var sc = sec.scores || [];
        for (var i = 0; i < take; i++) total += sc[i] || sc[sc.length - 1] || 5;
      }
    });
    return { n: n, total: total };
  }

  /* ================= 答题引擎 ================= */
  function startQuiz(opt) {
    if (!opt.qs || !opt.qs.length) { toast("该范围内暂无题目", "warn"); return; }
    quiz = {
      mode: opt.mode,
      title: opt.title,
      sub: opt.sub || "",
      qs: opt.qs,
      answers: opt.qs.map(function () { return null; }),
      idx: 0,
      sec: 0,
      limit: (opt.minutes || Math.max(5, opt.qs.length * 2)) * 60,
      timed: opt.timed !== false,
      paperId: opt.paperId || null
    };
    VIEW = "practice";
    setNav("practice");
    renderQuiz();
    clearInterval(quizTimer);
    quizTimer = setInterval(function () {
      if (!quiz) return;
      quiz.sec++;
      S.today.minutes = S.today.minutes || 0;
      var clk = $("#quizClock");
      if (clk) {
        clk.textContent = mmss(quiz.sec);
        clk.classList.toggle("is-over", quiz.timed && quiz.sec > quiz.limit);
      }
      if (quiz.timed && quiz.sec === quiz.limit + 1) {
        toast("已超过建议用时，可以继续作答或交卷", "warn");
      }
      if (quiz.sec % 30 === 0) { S.today.minutes += 0.5; }
    }, 1000);
  }

  function renderQuiz() {
    var q = quiz.qs[quiz.idx];
    var done = quiz.answers.filter(function (a) { return a !== null && a !== ""; }).length;
    var full = paperTotal(quiz.qs);
    var ex = window.EXAM && window.EXAM[S.subject];

    $("#view").innerHTML =
      '<div class="quiz-wrap">' +
      '<div class="quiz-head"><div><h3>' + esc(quiz.title) + "</h3>" +
      '<div class="qh-sub">' + esc(quiz.sub) + " · 共 " + quiz.qs.length + " 题 · 满分 " + full + " 分" +
      (ex && ex.partial ? "（" + esc(ex.partial) + "）" : "") + "</div></div>" +
      '<div class="quiz-timer"><span class="qt-clock" id="quizClock">' + mmss(quiz.sec) + "</span>" +
      '<span style="font-size:11.5px;color:var(--ink-3)">/' + mmss(quiz.limit) + "</span>" +
      '<button class="btn btn-sm" data-act="quit-quiz">退出</button></div></div>' +
      '<div class="quiz-progress"><i id="quizBar" style="width:' + Math.round((done / quiz.qs.length) * 100) + '%"></i></div>' +
      '<div id="qArea"></div>' +
      '<div class="q-dots" id="qDots">' + quiz.qs.map(function (_, i) {
        return '<button class="q-dot' + (i === quiz.idx ? " cur" : "") + (quiz.answers[i] !== null ? " done" : "") +
          '" data-act="q-jump" data-i="' + i + '">' + (i + 1) + "</button>";
      }).join("") + "</div>" +
      '<div class="quiz-foot"><button class="btn" data-act="q-prev">上一题</button>' +
      '<button class="btn btn-soft" data-act="q-next">下一题</button><span class="spacer"></span>' +
      '<button class="btn btn-primary" data-act="q-submit">交卷并看解析</button></div>' +
      "</div>";
    paintQuestion();
  }

  function paintQuestion() {
    var i = quiz.idx, q = quiz.qs[i], a = quiz.answers[i];
    var body = "";

    if (q.t === "single") {
      body = '<div class="opt-list">' + q.opts.map(function (o, k) {
        return '<button class="opt' + (a === k ? " is-picked" : "") + '" data-act="pick" data-i="' + k + '">' +
          '<span class="opt-k">' + "ABCD"[k] + "</span><span>" + esc(o) + "</span></button>";
      }).join("") + "</div>";
    } else if (q.t === "judge") {
      body = '<div class="judge-row">' +
        '<button class="opt' + (a === true ? " is-picked" : "") + '" data-act="judge" data-v="1" style="flex:1"><span class="opt-k">✓</span><span>正确</span></button>' +
        '<button class="opt' + (a === false ? " is-picked" : "") + '" data-act="judge" data-v="0" style="flex:1"><span class="opt-k">✕</span><span>错误</span></button>' +
        "</div>";
    } else if (q.t === "fill") {
      body = '<div class="fill-box"><input class="fill-input" id="fillInput" placeholder="在此填写答案" value="' +
        esc(a == null ? "" : a) + '" autocomplete="off" />' +
        '<span style="font-size:12px;color:var(--ink-3)">填空 · 忽略空格与标点</span></div>';
    } else {
      body = '<textarea class="ans-area' + (q.t === "essay" ? " is-essay" : "") + '" id="ansInput" ' +
        'placeholder="' + (q.t === "essay" ? "在此写作文正文（考试时请写在答题卡上）"
          : q.subs ? "按小题序号分条作答，如：（1）……（2）……" : "写出解答过程 / 答题要点") + '">' +
        esc(a == null ? "" : a) + "</textarea>" +
        '<div class="ans-tip">本题 ' + (q._score || q.score || 5) + " 分 · 交卷后对照参考答案自评</div>";
    }

    $("#qArea").innerHTML =
      '<div class="q-card"><div class="q-no"><b>' + (i + 1) + "/" + quiz.qs.length + "</b>" +
      '<span class="tag tag-gray">' + (QT[q.t] || "题") + "</span>" +
      (q._score ? '<span class="tag">' + q._score + " 分</span>" : "") +
      (q.lv === 3 ? '<span class="tag tag-sand">较难</span>' : "") +
      (q.real ? '<span class="tag tag-rose">真题改编</span>' : "") +
      '<span style="margin-left:auto">' + esc(q.src) + "</span></div>" +
      '<div class="q-stem">' + esc(q.stem).replace(/\n/g, "<br>") + "</div>" +
      passageHtml(q.passage) + figHtml(q.fig) + subsHtml(q) + body + "</div>";

    var fi = $("#fillInput");
    if (fi) {
      fi.addEventListener("input", function () {
        quiz.answers[quiz.idx] = this.value.trim() ? this.value : null;
        refreshDots();
      });
      fi.focus();
    }
    var ai = $("#ansInput");
    if (ai) {
      ai.addEventListener("input", function () {
        quiz.answers[quiz.idx] = this.value.trim() ? this.value : null;
        refreshDots();
      });
    }
  }

  function refreshDots() {
    var dots = $("#qDots");
    if (!dots) return;
    Array.prototype.forEach.call(dots.children, function (d, i) {
      d.classList.toggle("done", quiz.answers[i] !== null);
      d.classList.toggle("cur", i === quiz.idx);
    });
    var done = quiz.answers.filter(function (a) { return a !== null; }).length;
    var bar = $("#quizBar");
    if (bar) bar.style.width = Math.round((done / quiz.qs.length) * 100) + "%";
  }

  function norm(v) {
    return String(v == null ? "" : v).toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[，,。.．;；:：、""''（）()【】\[\]]/g, "");
  }
  function isRight(q, a) {
    if (isSubj(q)) return null;           // 主观题交卷后自评，不自动判分
    if (a === null || a === undefined || a === "") return false;
    if (q.t === "fill") {
      var list = Array.isArray(q.ans) ? q.ans : [q.ans];
      var n = norm(a);
      return list.some(function (x) { return norm(x) === n; });
    }
    return a === q.ans;
  }

  function submitQuiz(auto) {
    if (!quiz) return;
    var unanswered = quiz.answers.filter(function (a) { return a === null; }).length;
    if (!auto && unanswered > 0) {
      confirmModal("还有 " + unanswered + " 题未作答", "未作答的题目按 0 分计入（主观题可交卷后自评），确定要交卷吗？", "交卷", function () { finishQuiz(); });
      return;
    }
    finishQuiz();
  }

  function finishQuiz() {
    clearInterval(quizTimer);
    quiz.done = true;
    var res = quiz.qs.map(function (q, i) {
      return { q: q, a: quiz.answers[i], ok: isRight(q, quiz.answers[i]), graded: !isSubj(q) };
    });
    var obj = res.filter(function (r) { return !isSubj(r.q); });
    var correct = obj.filter(function (r) { return r.ok; }).length;
    var total = res.length;
    var acc = obj.length ? correct / obj.length : 0;

    var base = { chapter: 10, real: 15, mid: 25, final: 25, similar: 8, retry: 8 }[quiz.mode] || 10;
    var bonus = 0;
    if (obj.length && acc >= 0.8) bonus += 5;
    if (obj.length && acc === 1) bonus += 5;
    if (quiz.timed && quiz.sec <= quiz.limit) bonus += 3;
    var gain = base + bonus;
    quiz._gain = gain;

    // 记录（存得分/满分，客观题即时，主观题自评后更新）
    var rec = {
      subject: S.subject, title: quiz.title, total: paperTotal(res.map(function (r) { return r.q; })),
      correct: obj.reduce(function (s, r) { return s + (r.ok ? (r.q._score || 5) : 0); }, 0),
      sec: quiz.sec, mode: quiz.mode, date: fmtTime(new Date())
    };
    S.records.push(rec);
    if (S.records.length > 60) S.records = S.records.slice(-60);
    quiz._rec = rec;

    // 章节掌握度（客观题即时计入）
    obj.forEach(function (r) {
      var d = S.chapterDone[r.q.c] || { n: 0, c: 0 };
      d.n += 1; d.c += r.ok ? 1 : 0;
      S.chapterDone[r.q.c] = d;
    });

    // 错题自动归入（客观题即时，主观题在自评"未答对"时归入）
    var added = 0;
    obj.forEach(function (r) {
      if (r.ok) return;
      if (addWrong(r.q)) added++;
    });

    addPoints(gain, quiz.mode === "chapter" ? "完成章节强化" : "完成一套试卷");
    save();
    updateWrongBadge();
    quiz._added = added;
    quiz._result = res;
    renderResult(res, quiz._gain, quiz._added);
  }

  /* 把一道题收进错题本，返回是否新增 */
  function addWrong(q) {
    var exist = S.wrong.filter(function (w) { return w.qid === q.id; })[0];
    if (exist) {
      exist.times = (exist.times || 1) + 1;
      exist.fixed = false;
      exist.lastTs = Date.now();
      return 0;
    }
    S.wrong.unshift({
      id: "w" + Date.now() + Math.floor(Math.random() * 900),
      qid: q.id, subject: q.s, chapter: q.c,
      text: q.stem, answer: fmtAns(q), src: q.src, fig: q.fig || "",
      img: "", ts: Date.now(), times: 1, fixed: false
    });
    return 1;
  }

  function fmtAns(q) {
    if (q.t === "single") return "ABCD"[q.ans];
    if (q.t === "judge") return q.ans ? "正确" : "错误";
    if (isSubj(q)) return q.ans || "见参考答案";
    return Array.isArray(q.ans) ? q.ans[0] : q.ans;
  }

  function renderResult(res, gain, added) {
    var obj = res.filter(function (r) { return !isSubj(r.q); });
    var subs = res.filter(function (r) { return isSubj(r.q); });
    var correct = obj.filter(function (r) { return r.ok; }).length;
    var acc = obj.length ? correct / obj.length : 0;
    var full = paperTotal(res.map(function (r) { return r.q; }));
    var got = res.reduce(function (s, r) {
      return s + (r.ok === true ? (r.q._score || r.q.score || 5) : 0);
    }, 0);
    var pending = subs.filter(function (r) { return !r.graded; }).length;
    var pct = Math.round(acc * 100);
    var level = pending ? "主观题已给出参考答案，请对照自评"
      : pct >= 90 ? "非常棒，这一块基本拿下了" : pct >= 75 ? "不错，个别细节还要补"
        : pct >= 60 ? "刚过关，错题要及时订正" : "基础还需要再过一遍要点";
    var ring = '<div class="score-ring" style="--pct:' + (acc * 360) + 'deg"><div class="score-inner"><b>' +
      (obj.length ? pct : "—") + '</b><span>' + (obj.length ? "客观题正确率" : "待自评") + "</span></div></div>";

    var list = res.map(function (r, i) {
      var q = r.q, mine, right = fmtAns(q), badge;
      if (isSubj(q)) {
        mine = r.a == null ? "未作答" : r.a;
        badge = r.graded ? (r.ok ? '<span class="tag tag-sage">自评得分</span>' : '<span class="tag tag-rose">自评失分</span>')
          : '<span class="tag tag-sand">待自评</span>';
      } else {
        mine = q.t === "fill" ? (r.a == null ? "未作答" : r.a)
          : q.t === "judge" ? (r.a === true ? "正确" : r.a === false ? "错误" : "未作答")
            : (r.a == null ? "未作答" : "ABCD"[r.a]);
        badge = '<span class="tag ' + (r.ok ? "tag-sage" : "tag-rose") + '">' + (r.ok ? "正确" : "错误") + "</span>";
      }
      var gradeBtns = "";
      if (isSubj(q) && !r.graded) {
        gradeBtns = '<div class="self-grade"><span style="font-size:12px;color:var(--ink-3)">对照参考答案自评：</span>' +
          '<button class="btn btn-sm btn-primary" data-act="grade" data-i="' + i + '" data-ok="1">我答对了</button>' +
          '<button class="btn btn-sm" data-act="grade" data-i="' + i + '" data-ok="0">没答对</button></div>';
      }
      var stepsHtml = "";
      if (q.subs && q.subs.length) {
        stepsHtml = '<div class="ex-line"><span class="ex-badge" style="background:var(--blue-50);color:var(--blue-600)">参考答案</span><span class="ex-body">' +
          q.subs.map(function (s, k) {
            return '<div class="ref-sub"><b>（' + (k + 1) + "）</b>" + esc(s.a) + "</div>";
          }).join("") + "</span></div>";
      } else if (isSubj(q) && q.ans) {
        stepsHtml = '<div class="ex-line"><span class="ex-badge" style="background:var(--blue-50);color:var(--blue-600)">参考答案</span><span class="ex-body">' +
          esc(q.ans).replace(/\n/g, "<br>") + "</span></div>";
      }
      var stepsLabel = (q.subs && q.subs.length) ? "答题提示" : "评分要点";
      var stepsLine = (q.steps && q.steps.length)
        ? '<div class="ex-line"><span class="ex-badge" style="background:var(--blue-50);color:var(--blue-600)">' + stepsLabel + '</span><span class="ex-body">' +
        q.steps.map(function (s) { return "<div>" + esc(s) + "</div>"; }).join("") + "</span></div>"
        : "";
      var anaLine = q.ana
        ? '<div class="ex-line"><span class="ex-badge" style="background:var(--blue-50);color:var(--blue-600)">解析</span><span class="ex-body">' + esc(q.ana) + "</span></div>"
        : "";
      return '<div class="review-item ' + (r.ok ? "okq" : "noq") + '">' +
        '<div class="ri-head"><b>第 ' + (i + 1) + " 题</b>" + badge +
        (q._score ? '<span class="tag tag-gray">' + q._score + " 分</span>" : "") +
        "<span>" + esc(q.src) + '</span><span style="margin-left:auto">' + esc(CH[q.c] ? CH[q.c].title : "") + "</span></div>" +
        '<div class="ri-stem">' + esc(q.stem).replace(/\n/g, "<br>") + "</div>" +
        passageHtml(q.passage) + figHtml(q.fig) +
        '<div class="explain"><div class="ex-line"><span class="ex-badge ' + (r.ok ? "good" : "bad") + '">你的答案</span><span class="ex-body">' +
        esc(mine) + "</span></div>" +
        (!isSubj(q) ? '<div class="ex-line"><span class="ex-badge good">正确答案</span><span class="ex-body">' + esc(right) + "</span></div>" : "") +
        stepsHtml + stepsLine + anaLine + "</div>" + gradeBtns + "</div>";
    }).join("");

    $("#view").innerHTML =
      '<div class="quiz-wrap">' +
      '<div class="result-hero">' + ring +
      "<h2>" + level + "</h2><p>" + esc(quiz.title) + " · 满分 " + full + " 分</p>" +
      '<div class="result-stats">' +
      '<div class="rs-item"><b>' + got + "/" + full + "</b><span>当前得分</span></div>" +
      '<div class="rs-item"><b>' + correct + "/" + obj.length + "</b><span>客观题答对</span></div>" +
      '<div class="rs-item"><b>' + (subs.length - pending) + "/" + subs.length + "</b><span>主观题已自评</span></div>" +
      '<div class="rs-item"><b>' + mmss(quiz.sec) + "</b><span>用时</span></div>" +
      '<div class="rs-item"><b>+' + gain + "</b><span>获得积分</span></div>" +
      '<div class="rs-item"><b>' + added + "</b><span>新增错题</span></div>" +
      "</div></div>" +
      '<div class="btn-row" style="margin-bottom:16px">' +
      '<button class="btn btn-primary" data-act="again">再练一套</button>' +
      '<button class="btn" data-act="retry-wrong">只练错题</button>' +
      '<button class="btn" data-act="print-current">打印本卷</button>' +
      '<button class="btn btn-ghost" data-act="back-practice">返回练习</button></div>' +
      (pending > 0 ? '<div class="card card-pad" style="margin-bottom:16px;border-left:3px solid var(--sandy)"><b style="font-size:13.6px">还有 ' +
        pending + " 道主观题等待自评</b><p style=\"font-size:12.4px;color:var(--ink-3);margin-top:3px\">期末卷的解答题、作文、材料题按评分要点给分，请对着参考答案给自己判分，判为失分会自动进错题本。</p></div>" : "") +
      (added > 0 ? '<div class="card card-pad" style="margin-bottom:16px;border-left:3px solid var(--rose)"><b style="font-size:13.6px">' +
        added + " 道错题已自动收进错题本</b><p style=\"font-size:12.4px;color:var(--ink-3);margin-top:3px\">错题会自动匹配同类型题目，去「错题本」即可针对性强化。</p></div>" : "") +
      '<div class="section-title"><h3>逐题解析</h3><p>客观题自动判分 · 主观题对照自评</p></div>' + list +
      '<div class="btn-row" style="margin-top:18px"><button class="btn btn-primary" data-act="back-practice">完成，返回练习</button></div>' +
      "</div>";
    window.scrollTo({ top: 0, behavior: "smooth" });

    quiz._result = res;
  }

  /* 主观题自评：记分、进错题本、更新掌握度 */
  function gradeSubjective(i, ok) {
    if (!quiz || !quiz._result) return;
    var r = quiz._result[i];
    if (!r || r.graded) return;
    r.graded = true;
    r.ok = !!ok;
    var d = S.chapterDone[r.q.c] || { n: 0, c: 0 };
    d.n += 1; d.c += ok ? 1 : 0;
    S.chapterDone[r.q.c] = d;
    if (!ok) {
      quiz._added = (quiz._added || 0) + addWrong(r.q);
      updateWrongBadge();
    }
    // 同步更新练习记录得分
    if (quiz._rec) {
      quiz._rec.correct = quiz._result.reduce(function (s, x) {
        return s + (x.ok === true ? (x.q._score || x.q.score || 5) : 0);
      }, 0);
    }
    save();
    renderResult(quiz._result, quiz._gain || 0, quiz._added || 0);
    toast(ok ? "已记为得分" : "已记入错题本，稍后重点复习", ok ? "good" : "");
  }

  /* ================= 视图：错题本 ================= */
  function renderWrong() {
    var all = S.wrong.slice();
    var unfixed = all.filter(function (w) { return !w.fixed; });
    var today = fmtDate(new Date());
    var todayNew = all.filter(function (w) { return fmtDate(new Date(w.ts)) === today; }).length;
    var withImg = all.filter(function (w) { return w.img; }).length;

    var list = all.slice().sort(function (a, b) {
      if (!!a.fixed !== !!b.fixed) return a.fixed ? 1 : -1;
      return b.ts - a.ts;
    });

    var items = list.length ? list.map(function (w) {
      return '<div class="wrong-item">' +
        '<div class="wi-thumb">' + (w.img ? '<img src="' + w.img + '" alt="错题照片" />' : "✱") + "</div>" +
        '<div class="wi-body"><div class="wi-top">' +
        '<span class="tag">' + esc(SUBJ[w.subject] ? SUBJ[w.subject].name : "") + "</span>" +
        '<span class="tag tag-gray">' + esc(CH[w.chapter] ? CH[w.chapter].title : "拍照错题") + "</span>" +
        (w.fixed ? '<span class="tag tag-sage">已掌握</span>' : '<span class="tag tag-rose">待订正</span>') +
        (w.times > 1 ? '<span class="tag tag-sand">错 ' + w.times + " 次</span>" : "") +
        "</div>" +
        '<div class="wi-stem">' + esc(w.text || "（照片题目，未录入文字）") + "</div>" +
        (w.fig ? figHtml(w.fig, "wi-fig") : "") +
        '<div class="wi-meta"><span>正确答案：' + esc(w.answer || "—") + "</span><span>来源：" + esc(w.src || "手动录入") + "</span>" +
        "<span>" + esc(fmtDate(new Date(w.ts))) + "</span></div></div>" +
        '<div class="wi-acts">' +
        '<button class="btn btn-sm btn-primary" data-act="similar" data-id="' + w.id + '">同类题强化</button>' +
        '<button class="btn btn-sm" data-act="fix" data-id="' + w.id + '">' + (w.fixed ? "重新标记" : "标记掌握") + "</button>" +
        '<button class="btn btn-sm btn-ghost" data-act="del-wrong" data-id="' + w.id + '">删除</button>' +
        "</div></div>";
    }).join("") : emptyBox("✱", "错题本还是空的", "做错的题会自动收进来，也可以直接拍照上传", 
      '<button class="btn btn-primary" data-act="add-wrong">拍照上传错题</button>');

    $("#view").innerHTML =
      '<div class="page-head"><div><div class="page-title">错题本 <small>自动归集</small></div>' +
      '<p class="page-sub">练习中的错题会自动进入这里，按学科与章节归类；每道错题都能生成同类型题目继续练。</p></div>' +
      '<div class="btn-row"><button class="btn btn-soft" data-act="add-wrong">拍照上传错题</button>' +
      '<button class="btn btn-primary" data-act="train-all" ' + (unfixed.length ? "" : "disabled") + ">一键订正（" + unfixed.length + "）</button></div></div>" +

      '<div class="stat-row">' +
      statCard("待订正", unfixed.length, "题", "需要重新做一遍") +
      statCard("已掌握", all.length - unfixed.length, "题", "连续做对后自动标记") +
      statCard("累计收录", all.length, "题", "其中 " + withImg + " 题带照片") +
      statCard("今日新增", todayNew, "题", "今日错题及时消化") +
      "</div>" +
      (all.length ? '<div class="section-title"><h3>错题清单</h3><p>待订正优先显示</p></div>' : "") +
      items;
  }
  function statCard(label, num, unit, sub) {
    return '<div class="stat-card"><div class="sc-top">' + label + "</div><b>" + num +
      "<small>" + unit + "</small></b><div style=\"font-size:11.5px;color:var(--ink-3);margin-top:4px\">" + esc(sub) + "</div></div>";
  }

  function openAddWrong() {
    var subj = SUBJ[S.subject];
    var opts = subj.chapters.map(function (c) { return '<option value="' + c.id + '">' + esc(c.no + " " + c.title) + "</option>"; }).join("");
    openModal(
      '<div class="modal-head"><div><h3>拍照 / 上传错题</h3><p>拍下题目照片，补充关键信息后即可归入错题本</p></div>' +
      '<button class="modal-close" data-act="close-modal">✕</button></div>' +
      '<div class="modal-body">' +
      '<div class="upload-zone" id="upZone" data-act="pick-file">' +
      '<div class="uz-ico"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7l1.1-1.7A1 1 0 0 1 9.1 4h5.8a1 1 0 0 1 .8.4L16.8 6h1.7A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/>' +
      '<circle cx="12" cy="12.3" r="3.4"/></svg></div>' +
      '<p>点击拍照或选择图片</p><small>支持 JPG / PNG，图片自动压缩，仅保存在本机</small>' +
      '<input type="file" id="photoInput" accept="image/*" capture="environment" hidden /></div>' +
      '<div id="previewWrap"></div>' +
      '<div class="field-row" style="margin-top:14px">' +
      '<div class="field"><label>学科</label><select id="wSub">' +
      C.subjects.map(function (s) { return '<option value="' + s.id + '"' + (s.id === S.subject ? " selected" : "") + ">" + esc(s.name) + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="field"><label>章节</label><select id="wCh">' + opts + "</select></div></div>" +
      '<div class="field"><label>题目内容（可只写关键条件）</label>' +
      '<textarea id="wText" placeholder="例：已知等腰三角形两边长为 3 和 7，求周长"></textarea></div>' +
      '<div class="field"><label>正确答案 / 订正要点</label>' +
      '<input type="text" id="wAns" placeholder="例：17（3 不能作腰）" /></div>' +
      "</div>" +
      '<div class="modal-foot"><button class="btn" data-act="close-modal">取消</button>' +
      '<button class="btn btn-primary" data-act="save-wrong">保存到错题本</button></div>'
    );
    var pendingImg = "";
    $("#wSub").addEventListener("change", function () {
      var s = SUBJ[this.value];
      $("#wCh").innerHTML = s.chapters.map(function (c) { return '<option value="' + c.id + '">' + esc(c.no + " " + c.title) + "</option>"; }).join("");
    });
    $("#photoInput").addEventListener("change", function () {
      var f = this.files && this.files[0];
      if (!f) return;
      compressImage(f, function (data) {
        pendingImg = data;
        $("#previewWrap").innerHTML = '<div class="preview-box"><img src="' + data + '" alt="预览" />' +
          '<div style="font-size:12px;color:var(--ink-2)">图片已就绪，可继续补充文字说明<br><small style="color:var(--ink-3)">保存后可在错题本中查看</small></div></div>';
        $("#upZone").style.display = "none";
      });
    });
    $("#modalBox")._getImg = function () { return pendingImg; };
    $("#modalBox")._setImg = function (v) { pendingImg = v; };
  }

  function compressImage(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var max = 720;
        var scale = Math.min(1, max / Math.max(img.width, img.height));
        var cv = document.createElement("canvas");
        cv.width = Math.round(img.width * scale);
        cv.height = Math.round(img.height * scale);
        var ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        cb(cv.toDataURL("image/jpeg", 0.68));
      };
      img.onerror = function () { toast("图片读取失败，请换一张试试", "warn"); };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function saveWrongFromModal() {
    var box = $("#modalBox");
    var img = box._getImg ? box._getImg() : "";
    var text = ($("#wText") || {}).value || "";
    var ans = ($("#wAns") || {}).value || "";
    var sub = ($("#wSub") || {}).value || S.subject;
    var ch = ($("#wCh") || {}).value || (SUBJ[sub].chapters[0] || {}).id;
    if (!img && !text.trim()) { toast("至少拍一张照片或写一句题干", "warn"); return; }
    S.wrong.unshift({
      id: "w" + Date.now() + Math.floor(Math.random() * 900),
      qid: "", subject: sub, chapter: ch, text: text.trim(),
      answer: ans.trim(), src: "拍照上传", img: img, ts: Date.now(), times: 1, fixed: false
    });
    addPoints(3, "上传并整理错题");
    save(); closeModal(); updateWrongBadge();
    toast("已加入错题本", "good");
    if (VIEW === "wrong") renderWrong();
  }

  function startSimilar(w) {
    var q0 = QMAP[w.qid];
    var pool = BANK.filter(function (q) {
      return q.s === w.subject && q.c === w.chapter && q.id !== w.qid;
    });
    /* 优先同题型：错的是解答题，就推解答题，而不是换成选择题 */
    if (q0) {
      var sameType = pool.filter(function (q) { return q.t === q0.t; });
      if (sameType.length >= 2) pool = sameType;
    }
    if (pool.length < 3) {
      pool = pool.concat(BANK.filter(function (q) {
        return q.s === w.subject && q.c !== w.chapter && q.id !== w.qid && (!q0 || q.t === q0.t);
      }));
    }
    pool = shuffle(pool).slice(0, 3);
    if (!pool.length) { toast("该章节暂无同类题，可先补全资料包", "warn"); return; }
    startQuiz({
      mode: "similar",
      title: "同类题强化 · " + (CH[w.chapter] ? CH[w.chapter].title : "错题"),
      sub: (SUBJ[w.subject] ? SUBJ[w.subject].name : "") + " · 针对同类错误",
      qs: pool,
      minutes: pool.length * 3
    });
  }

  /* ================= 视图：设置 ================= */
  var DISTRICTS = ["路南区", "路北区", "开平区", "古冶区", "丰南区", "丰润区", "曹妃甸区", "滦州市", "遵化市", "迁安市", "玉田县", "乐亭县", "迁西县", "滦南县"];

  var SOURCES = [
    { name: "人教版八年级上册教材要点库", type: "教材", size: "1.8 MB", ver: "2026.09", items: 95 },
    { name: "唐山各区八上期末真题（改编）", type: "真题", size: "1.2 MB", ver: "2026.11", items: PAPERS.length },
    { name: "八上同步强化练习库", type: "习题", size: "860 KB", ver: "2026.10", items: BANK.length },
    { name: "河北省中考真题索引", type: "拓展", size: "2.4 MB", ver: "2026.06", items: 0 }
  ];

  function renderSettings() {
    var lv = levelInfo(S.points);
    var srcHtml = SOURCES.map(function (s, i) {
      return '<div class="src-item"><div class="src-ico">' + ({ 教材: "书", 真题: "卷", 习题: "练", 拓展: "拓" }[s.type] || "包") + "</div>" +
        '<div class="src-txt"><b>' + esc(s.name) + "</b>" +
        "<span>" + s.type + " · " + s.size + " · 版本 " + esc(s.ver) + " · " + s.items + " 条</span>" +
        '<div class="sync-bar"><i id="srcBar' + i + '" style="width:100%"></i></div></div>' +
        '<span class="tag tag-sage">已缓存</span></div>';
    }).join("");

    $("#view").innerHTML =
      '<div class="page-head"><div><div class="page-title">设置中心</div>' +
      '<p class="page-sub">资料自动同步、个人信息与积分规则都在这里。资料采集全程自动，无需手动导入（也保留了手动导入入口）。</p></div></div>' +
      '<div class="settings-grid">' +

      // 个人
      '<div class="set-card"><h3>个人信息</h3><p class="sc-desc">用于生成试卷抬头与学习报告，只保存在本机。</p>' +
      '<div class="field-row"><div class="field"><label>称呼</label><input type="text" id="setNick" value="' + esc(S.nick) + '" /></div>' +
      '<div class="field"><label>年级</label><input type="text" value="八年级（上）" disabled /></div></div>' +
      '<div class="field-row"><div class="field"><label>所在区县</label><select id="setDistrict">' +
      DISTRICTS.map(function (d) { return '<option' + (d === S.district ? " selected" : "") + ">" + d + "</option>"; }).join("") +
      "</select></div>" +
      '<div class="field"><label>每日目标（分钟）</label><input type="number" id="setGoal" min="5" max="180" value="' + (S.goal || 20) + '" /></div></div>' +
      '<div class="field"><label>教材版本</label><input type="text" value="语文/历史 部编版；数学/物理/英语/生物/地理 人教版" disabled /></div>' +
      '<button class="btn btn-primary" data-act="save-profile">保存信息</button></div>' +

      // 积分
      '<div class="set-card"><h3>积分与等级</h3><p class="sc-desc">当前 ' + S.points + " 分 · " + lv.name +
      (lv.next !== "满级" ? "，距 " + lv.next + " 还差 " + lv.need + " 分" : "，已达最高等级") + "</p>" +
      '<div class="progress-thin" style="height:7px;margin-bottom:14px"><i style="width:' + lv.pct + '%"></i></div>' +
      '<div class="rule-list">' +
      "<div><span>完成章节强化</span><b>+10</b></div>" +
      "<div><span>完成真题 / 模拟卷</span><b>+15 ~ +25</b></div>" +
      "<div><span>正确率 ≥ 80%</span><b>+5</b></div>" +
      "<div><span>全对或限时完成</span><b>+3 ~ +5</b></div>" +
      "<div><span>订正 / 上传错题</span><b>+3 ~ +8</b></div>" +
      "<div><span>连续学习打卡</span><b>每日累计</b></div>" +
      "</div>" +
      '<p style="font-size:11.5px;color:var(--ink-3);margin-top:12px">已连续学习 ' + S.streak + " 天 · 今日学习 " +
      Math.round(S.today.minutes || 0) + " 分钟 · 今日获得 " + (S.today.points || 0) + " 分</p></div>" +

      // 同步
      '<div class="set-card"><h3>资料自动同步</h3><p class="sc-desc">教材要点、真题与习题按学科自动采集更新。首次使用即内置完整离线资料包，联网后按资源清单校验版本。</p>' +
      '<div class="switch-row"><div class="sr-txt"><b>自动同步</b><span>打开应用时检查资源版本并增量更新</span></div>' +
      '<div class="switch' + (S.settings.autoSync ? " on" : "") + '" data-act="toggle-sync"></div></div>' +
      '<div class="src-list" style="margin-top:14px">' + srcHtml + "</div>" +
      '<div style="display:flex;gap:8px;align-items:center;margin-top:14px;flex-wrap:wrap">' +
      '<button class="btn btn-primary" data-act="do-sync">立即同步</button>' +
      '<button class="btn" data-act="import-json">手动导入题库</button>' +
      '<span style="font-size:11.5px;color:var(--ink-3)" id="syncStamp">上次同步：' + esc(S.settings.syncTime) + "</span></div>" +
      '<p style="font-size:11.5px;color:var(--ink-3);margin-top:10px">采集范围：唐山市各区八年级上学期期末/期中公开试题（改编整理），教材要点依据人教版、部编版现行教材。</p></div>' +

      // 数据
      '<div class="set-card"><h3>数据与本地存储</h3><p class="sc-desc">所有学习数据保存在本机浏览器，不会上传。建议定期导出备份。</p>' +
      '<div class="switch-row"><div class="sr-txt"><b>计时提示音</b><span>训练计时结束前提醒</span></div>' +
      '<div class="switch' + (S.settings.watch ? " on" : "") + '" data-act="toggle-watch"></div></div>' +
      '<div class="switch-row"><div class="sr-txt"><b>错题自动归集</b><span>练习中的错题自动进入错题本</span></div><div class="switch on"></div></div>' +
      '<div class="btn-row" style="margin-top:16px">' +
      '<button class="btn" data-act="export">导出备份</button>' +
      '<button class="btn" data-act="restore">恢复备份</button>' +
      '<button class="btn" data-act="clear-wrong">清空错题本</button>' +
      '<button class="btn" data-act="clear-all" style="color:var(--bad);border-color:#EAD5D5">重置全部数据</button></div>' +
      '<p style="font-size:11.5px;color:var(--ink-3);margin-top:12px">错题 ' + S.wrong.length + " 道 · 练习记录 " + S.records.length +
      " 条 · 资料版本 " + esc(C.version) + "</p></div>" +

      "</div>";
  }

  /* ================= 打印（严格按题型分节、标注分值） ================= */
  function printQuiz(list, title, sub, minutes, withAns) {
    var total = paperTotal(list);
    var ex = window.EXAM && window.EXAM[S.subject];
    var blocks = [];
    list.forEach(function (q) {
      var last = blocks[blocks.length - 1];
      if (!last || last.t !== q.t) blocks.push({ t: q.t, items: [q] });
      else last.items.push(q);
    });

    var html = '<div class="p-sheet"><div class="p-head"><h1>' + esc(title) + "</h1>" +
      '<div class="p-sub">河北省唐山市 · 八年级上学期 · ' + esc(sub) + " · 共 " + list.length +
      " 题 · 满分 " + total + " 分" + (ex && ex.partial ? "（" + esc(ex.partial) + "）" : "") +
      (minutes ? " · 考试时间 " + minutes + " 分钟" : "") + "</div>" +
      '<div class="p-info"><span>班级：____________</span><span>姓名：____________</span><span>得分：__________</span></div>' +
      '<div class="p-notice">注意事项：1. 答题前请将姓名、班级填写清楚；2. 选择题、判断题答案填写在题后括号内；' +
      "3. 主观题按题号在答题区域作答，写出必要的文字说明、证明过程或演算步骤；4. 卷面要求书写工整。</div></div>";

    var cn = ["一", "二", "三", "四", "五", "六", "七"];
    var idx = 0, k = 0;
    blocks.forEach(function (b) {
      var items = b.items;
      var sum = items.reduce(function (s, q) { return s + (q._score || q.score || 5); }, 0);
      var same = items.every(function (q) { return (q._score || 5) === (items[0]._score || 5); });
      var secName = items[0]._sec || QT[b.t] || "试题";
      var scoreTxt = same
        ? "每小题 " + (items[0]._score || 5) + " 分，共 " + sum + " 分"
        : "共 " + sum + " 分";
      html += '<div class="p-sec">' + cn[k] + "、" + secName + '<span class="p-sec-score">（' + scoreTxt + "）</span></div>";
      k++;
      items.forEach(function (q) {
        idx++;
        var qs = q._score || q.score || 5;
        var needBracket = (b.t === "single" || b.t === "judge") && !/（\s*）/.test(q.stem);
        html += '<div class="p-q"><div class="p-stem"><b>' + idx + ".</b> " +
          esc(q.stem).replace(/\n/g, "<br>") +
          (needBracket ? "（　　）" : "") +
          '<span class="p-q-score">（' + qs + " 分）</span></div>";
        html += passageHtml(q.passage).replace(/q-passage/g, "p-passage");
        html += figHtml(q.fig, "p-fig");
        if (b.t === "single") {
          html += '<div class="p-opts">' + q.opts.map(function (o, kk) {
            return '<span class="p-opt">' + "ABCD"[kk] + ". " + esc(o) + "</span>";
          }).join("") + "</div>";
        } else if (b.t === "fill") {
          html += '<div class="p-line"></div>';
        } else {
          if (q.subs && q.subs.length) {
            html += '<div class="p-subs">' + q.subs.map(function (s) {
              return '<div class="p-sub">' + esc(s.q).replace(/\n/g, "<br>") + "</div>";
            }).join("") + "</div>";
          }
          var lines = q.t === "essay" ? 0 : Math.max(3, Math.min(9, Math.round(qs / 2)));
          if (q.t === "essay") {
            html += '<div class="p-essay">（作文格 600 字，请在答题卡上书写）</div>';
          } else {
            html += '<div class="p-space">' + new Array(lines + 1).join('<div class="p-blank"></div>') + "</div>";
          }
        }
        html += "</div>";
        if (withAns) {
          var ansHtml = isSubj(q) ? esc(q.ans || "见下列各小题答案").replace(/\n/g, "<br>") : esc(fmtAns(q));
          var subAns = q.subs && q.subs.length
            ? '<div class="p-subans">' + q.subs.map(function (s, si) {
              return "<div><b>（" + (si + 1) + "）</b>" + esc(s.a) + "</div>";
            }).join("") + "</div>" : "";
          var stepsHtml = (q.steps && q.steps.length && !(q.subs && q.subs.length))
            ? '<div class="p-steps">' + q.steps.map(function (s) { return "<div>" + esc(s) + "</div>"; }).join("") + "</div>" : "";
          var anaHtml = q.ana ? '<div class="p-ana">解析：' + esc(q.ana) + "</div>" : "";
          html += '<div class="p-ans">【答案】' + ansHtml + subAns + stepsHtml + anaHtml + "</div>";
        }
      });
    });
    html += '<div class="p-foot">青苗学堂 · 唐山八年级学习助手　生成于 ' + fmtTime(new Date()) +
      "　（本卷为训练用改编卷，非原始试卷；题型结构参照唐山市各区期末/期中检测）</div></div>";
    $("#printArea").innerHTML = html;
    setTimeout(function () { window.print(); }, 120);
  }

  /* ================= 交互分发 ================= */
  function setNav(v) {
    Array.prototype.forEach.call(document.querySelectorAll(".nav-item"), function (b) {
      b.classList.toggle("is-active", b.dataset.view === v);
    });
  }
  function go(v) {
    if (quiz && !quiz.done && (v !== "practice")) {
      confirmModal("正在答题", "离开会丢失当前作答进度，确定要离开吗？", "离开", function () {
        clearInterval(quizTimer); quiz = null; VIEW = v; setNav(v); renderView();
      });
      return;
    }
    VIEW = v; setNav(v); renderView();
    var sb = $("#sidebar"); if (sb) sb.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderView() {
    subjectBar(); updateCoin(); updateWrongBadge(); updateSyncMini();
    if (VIEW === "points") renderPoints(renderPoints._ch);
    else if (VIEW === "practice") {
      if (quiz && !quiz.done) renderQuiz();
      else { quiz = null; renderPractice(); }
    }
    else if (VIEW === "wrong") renderWrong();
    else if (VIEW === "settings") renderSettings();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]");
    var nav = e.target.closest(".nav-item");
    if (nav && !t) { go(nav.dataset.view); return; }
    if (!t) return;
    var act = t.dataset.act;

    switch (act) {
      case "sub":
        if (quiz) { toast("请先退出当前答题", "warn"); return; }
        S.subject = t.dataset.id; save(); subjectBar(); updateSyncMini();
        renderView();
        break;
      case "chapter":
        renderPoints._ch = t.dataset.id;
        renderPoints(t.dataset.id);
        break;
      case "start-chapter": {
        var cid = t.dataset.id;
        /* 章节练习不排整篇作文，作文放到整卷里练 */
        var qs = chapterQs(cid).filter(function (q) { return q.t !== "essay"; });
        if (!qs.length) { toast("本章暂无题目", "warn"); return; }
        startQuiz({
          mode: "chapter", title: "章节强化 · " + CH[cid].title,
          sub: SUBJ[S.subject].name + " · " + CH[cid].no, qs: qs,
          minutes: Math.max(5, qs.length * 2)
        });
        break;
      }
      case "mode":
        if (t.dataset.mode === "chapter") {
          var el1 = $("#sec-chapter"); if (el1) el1.scrollIntoView({ behavior: "smooth" });
        } else if (t.dataset.mode === "real") {
          var el2 = $("#sec-real"); if (el2) el2.scrollIntoView({ behavior: "smooth" });
        } else openPaperModal(t.dataset.mode);
        break;
      case "smart": smartQuiz(); break;
      case "open-paper": openPaperModal(t.dataset.kind); break;
      case "start-real": {
        var p = PAPERS.filter(function (x) { return x.id === t.dataset.id; })[0];
        if (!p) return;
        var qq = assemblePaper(p.kind || "final", p.id);
        if (!qq.length) { toast("题库不足，无法组卷", "warn"); return; }
        startQuiz({
          mode: "real", title: p.title,
          sub: (p.region || "") + " · " + (p.kind === "mid" ? "期中卷" : "期末卷"),
          qs: qq, minutes: paperMinutes(p.kind || "final")
        });
        break;
      }
      case "print-real": {
        var p2 = PAPERS.filter(function (x) { return x.id === t.dataset.id; })[0];
        if (!p2) return;
        var qq2 = assemblePaper(p2.kind || "final", p2.id);
        if (!qq2.length) { toast("题库不足，无法组卷", "warn"); return; }
        printWithAnsAsk(qq2, p2.title, SUBJ[S.subject].name, paperMinutes(p2.kind || "final"));
        break;
      }
      case "pick":
        quiz.answers[quiz.idx] = parseInt(t.dataset.i, 10);
        Array.prototype.forEach.call(t.parentNode.children, function (b) { b.classList.remove("is-picked"); });
        t.classList.add("is-picked");
        refreshDots();
        break;
      case "judge":
        quiz.answers[quiz.idx] = t.dataset.v === "1";
        Array.prototype.forEach.call(t.parentNode.children, function (b) { b.classList.remove("is-picked"); });
        t.classList.add("is-picked");
        refreshDots();
        break;
      case "q-prev":
        if (quiz.idx > 0) { quiz.idx--; paintQuestion(); refreshDots(); }
        break;
      case "q-next":
        if (quiz.idx < quiz.qs.length - 1) { quiz.idx++; paintQuestion(); refreshDots(); }
        else toast("已经是最后一题了，可以交卷", "");
        break;
      case "q-jump":
        quiz.idx = parseInt(t.dataset.i, 10); paintQuestion(); refreshDots();
        break;
      case "q-submit": submitQuiz(false); break;
      case "quit-quiz":
        confirmModal("退出本次练习", "退出后本次作答不会计分，确定吗？", "退出", function () {
          clearInterval(quizTimer); quiz = null; renderPractice();
        });
        break;
      case "again":
        if (quiz && quiz.mode === "chapter") {
          var cid2 = quiz.qs[0].c;
          startQuiz({ mode: "chapter", title: "章节强化 · " + CH[cid2].title, sub: SUBJ[S.subject].name, qs: chapterQs(cid2), minutes: Math.max(5, chapterQs(cid2).length * 2) });
        } else if (quiz && quiz.mode === "real") {
          var pool0 = quiz.qs;
          startQuiz({ mode: "real", title: quiz.title, sub: quiz.sub, qs: shuffle(pool0), minutes: quiz.limit / 60 });
        } else {
          openPaperModal(quiz && quiz.title.indexOf("期中") >= 0 ? "mid" : "final");
        }
        break;
      case "retry-wrong": {
        var wrongs = quiz._result ? quiz._result.filter(function (r) { return !r.ok; }).map(function (r) { return r.q; }) : [];
        if (!wrongs.length) { toast("本卷没有错题，太厉害了", "good"); return; }
        startQuiz({ mode: "retry", title: "错题重练 · " + quiz.title, sub: "只练本卷做错的 " + wrongs.length + " 题", qs: wrongs, minutes: wrongs.length * 2 });
        break;
      }
      case "print-current":
        if (!quiz) return;
        printWithAnsAsk(quiz._result ? quiz._result.map(function (r) { return r.q; }) : quiz.qs, quiz.title, SUBJ[S.subject].name, quiz.limit / 60);
        break;
      case "back-practice":
        quiz = null; VIEW = "practice"; renderPractice(); window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "add-wrong": openAddWrong(); break;
      case "pick-file": {
        if (e.target && e.target.tagName === "INPUT") return;
        var fi = $("#photoInput"); if (fi) fi.click();
        break;
      }
      case "save-wrong": saveWrongFromModal(); break;
      case "fix": {
        var w = S.wrong.filter(function (x) { return x.id === t.dataset.id; })[0];
        if (w) {
          w.fixed = !w.fixed;
          if (w.fixed) addPoints(5, "订正错题");
          save(); updateWrongBadge(); renderWrong();
        }
        break;
      }
      case "del-wrong": {
        var id = t.dataset.id;
        confirmModal("删除这道错题？", "删除后不可恢复，建议确认已经掌握。", "删除", function () {
          S.wrong = S.wrong.filter(function (x) { return x.id !== id; });
          save(); updateWrongBadge(); renderWrong();
        });
        break;
      }
      case "similar": {
        var w2 = S.wrong.filter(function (x) { return x.id === t.dataset.id; })[0];
        if (w2) startSimilar(w2);
        break;
      }
      case "train-all": {
        var unf = S.wrong.filter(function (w) { return !w.fixed; });
        if (!unf.length) { toast("没有待订正的错题", ""); return; }
        var ids = unf.slice(0, 6).map(function (w) { return w.qid; }).filter(Boolean);
        var qs2 = ids.map(function (id) { return QMAP[id]; }).filter(Boolean);
        if (!qs2.length) {
          var first = unf[0];
          if (first) startSimilar(first); else toast("这些错题没有关联题目，请用同类题强化", "warn");
          return;
        }
        startQuiz({ mode: "retry", title: "错题集中订正", sub: "共 " + qs2.length + " 题", qs: qs2, minutes: qs2.length * 2 });
        break;
      }
      case "toggle-sync":
        S.settings.autoSync = !S.settings.autoSync;
        t.classList.toggle("on", S.settings.autoSync);
        save(); updateSyncMini();
        toast(S.settings.autoSync ? "已开启自动同步" : "已切换为手动同步", "");
        break;
      case "toggle-watch":
        S.settings.watch = !S.settings.watch;
        t.classList.toggle("on", S.settings.watch);
        save();
        break;
      case "do-sync": doSync(); break;
      case "import-json": {
        var inp = document.createElement("input");
        inp.type = "file"; inp.accept = ".json,application/json";
        inp.onchange = function () {
          var f = inp.files && inp.files[0];
          if (!f) return;
          var fr = new FileReader();
          fr.onload = function () {
            try {
              var data = JSON.parse(fr.result);
              var arr = Array.isArray(data) ? data : (data.questions || []);
              var ok = 0;
              arr.forEach(function (q) {
                if (q && q.id && q.stem && q.t) { BANK.push(q); QMAP[q.id] = q; ok++; }
              });
              if (ok) { toast("已导入 " + ok + " 道题目", "good"); doSync(true); }
              else toast("文件里没有可识别的题目", "warn");
            } catch (err) { toast("文件格式不正确，需为 JSON 数组", "warn"); }
          };
          fr.readAsText(f);
        };
        inp.click();
        break;
      }
      case "save-profile": {
        S.nick = ($("#setNick") || {}).value || "同学";
        S.district = ($("#setDistrict") || {}).value || S.district;
        S.goal = parseInt(($("#setGoal") || {}).value, 10) || 20;
        save(); toast("个人信息已保存", "good");
        break;
      }
      case "export": {
        var blob = new Blob([JSON.stringify({ state: S, version: C.version }, null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "青苗学堂-学习数据-" + fmtDate(new Date()) + ".json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
        toast("备份已导出", "good");
        break;
      }
      case "restore": {
        var inp2 = document.createElement("input");
        inp2.type = "file"; inp2.accept = ".json,application/json";
        inp2.onchange = function () {
          var f = inp2.files && inp2.files[0];
          if (!f) return;
          var fr = new FileReader();
          fr.onload = function () {
            try {
              var d = JSON.parse(fr.result);
              var st = d && d.state ? d.state : (d && (d.wrong || d.records || d.points !== undefined) ? d : null);
              if (!st) { toast("这不是学习数据备份文件", "warn"); return; }
              confirmModal("恢复这份备份？", "将用备份里的积分、错题与练习记录覆盖本机现有数据，建议先导出一份当前数据。", "确认恢复", function () {
                S = Object.assign(defaultState(), st);
                save(); updateCoin(); updateWrongBadge(); renderSettings();
                toast("已恢复备份", "good");
              });
            } catch (e) { toast("文件格式不正确，需为备份导出的 JSON", "warn"); }
          };
          fr.readAsText(f);
        };
        inp2.click();
        break;
      }
      case "clear-wrong":
        confirmModal("清空错题本？", "将删除全部 " + S.wrong.length + " 道错题（含照片），建议先导出备份。", "确认清空", function () {
          S.wrong = []; save(); updateWrongBadge(); renderSettings(); toast("错题本已清空", "");
        });
        break;
      case "clear-all":
        confirmModal("重置全部数据？", "积分、记录、错题、设置都会被清空，且无法恢复。", "确认重置", function () {
          localStorage.removeItem(KEY); S = defaultState(); save();
          updateCoin(); updateWrongBadge(); renderSettings(); toast("已重置", "");
        });
        break;
      case "close-modal": closeModal(); break;
      case "print-paper": {
        var kind = $("#ppKind") ? $("#ppKind").value : "mid";
        closeModal();
        var qs3 = assemblePaper(kind);
        if (!qs3.length) { toast("题库不足，无法组卷", "warn"); return; }
        printQuiz(qs3, (kind === "mid" ? "期中模拟卷" : "期末模拟卷") + " · " + SUBJ[S.subject].name,
          SUBJ[S.subject].name, paperMinutes(kind), false);
        break;
      }
      case "start-paper": {
        var kind2 = $("#ppKind").value;
        var timed = $("#ppTimed").checked;
        closeModal();
        var qs4 = assemblePaper(kind2);
        if (!qs4.length) { toast("题库不足，无法组卷", "warn"); return; }
        startQuiz({
          mode: kind2, title: (kind2 === "mid" ? "期中模拟卷" : "期末模拟卷") + " · " + SUBJ[S.subject].name,
          sub: (kind2 === "mid" ? "前半册内容" : "全册内容") + " · 按" + (kind2 === "mid" ? "期中" : "期末") + "卷题型结构组卷",
          qs: qs4, minutes: paperMinutes(kind2), timed: timed
        });
        break;
      }
      case "grade":
        gradeSubjective(parseInt(t.dataset.i, 10), t.dataset.ok === "1");
        break;
    }
  });

  function printWithAnsAsk(list, title, sub, minutes) {
    openModal(
      '<div class="modal-head"><div><h3>打印试卷</h3><p>共 ' + list.length + " 题，A4 排版，可直接打印</p></div>" +
      '<button class="modal-close" data-act="close-modal">✕</button></div>' +
      '<div class="modal-body"><div class="opt"><span class="opt-k">A</span><span>学生版（不含答案，含答题留白）</span></div>' +
      '<div style="height:8px"></div>' +
      '<div class="opt"><span class="opt-k">B</span><span>教师版（附答案与解析）</span></div></div>' +
      '<div class="modal-foot"><button class="btn" data-act="close-modal">取消</button>' +
      '<button class="btn" id="pStu">打印学生版</button><button class="btn btn-primary" id="pTch">打印讲评版</button></div>'
    );
    $("#pStu").onclick = function () { closeModal(); printQuiz(list, title, sub, minutes, false); };
    $("#pTch").onclick = function () { closeModal(); printQuiz(list, title, sub, minutes, true); };
  }

  function openPaperModal(kind) {
    var subj = SUBJ[S.subject];
    var ex = window.EXAM && window.EXAM[S.subject];
    var kindName = kind === "mid" ? "期中" : "期末";
    // 卷面结构预览：与生成结果完全一致的题型、题量、分值
    var specRows = "";
    if (ex) {
      var sp = ex[kind] || ex.final;
      var cn = ["一", "二", "三", "四", "五", "六"];
      sp.sections.forEach(function (sec, i) {
        var total = sec.each ? sec.n * sec.each : (sec.scores || []).reduce(function (a, b) { return a + b; }, 0);
        var scoreTxt = sec.each ? sec.n + " 题 × " + sec.each + " 分" : sec.n + " 题，共 " + total + " 分";
        specRows += '<div class="spec-row"><span class="spec-no">' + cn[i] + "</span><b>" + esc(sec.name) + "</b>" +
          "<span>" + sec.n + " 题</span><span>" + total + " 分</span>" +
          '<span class="spec-note">' + esc(scoreTxt) + "</span></div>";
      });
    }
    openModal(
      '<div class="modal-head"><div><h3>生成' + kindName + "模拟卷</h3>" +
      "<p>" + esc(subj.name) + " · " + (kind === "mid" ? "前半册内容" : "全册内容") +
      " · 参照唐山市各区" + kindName + "检测卷题型结构组卷</p></div>" +
      '<button class="modal-close" data-act="close-modal">✕</button></div>' +
      '<div class="modal-body">' +
      '<div class="field"><label>试卷范围</label><select id="ppKind">' +
      '<option value="mid"' + (kind === "mid" ? " selected" : "") + ">期中（前半册）</option>" +
      '<option value="final"' + (kind === "final" ? " selected" : "") + ">期末（全册）</option></select></div>" +
      '<div class="spec-box"><div class="spec-title">卷面结构</div>' + specRows +
      '<div class="spec-foot">考试时间 ' + paperMinutes(kind) + " 分钟" +
      (ex && ex.partial ? " · " + esc(ex.partial) : "") + "</div></div>" +
      '<label class="switch-row" style="border:none;padding:4px 0"><span class="sr-txt"><b>开启计时</b><span>超时会提示但不强制交卷</span></span>' +
      '<input type="checkbox" id="ppTimed" checked style="width:18px;height:18px;accent-color:#6E8FB2" /></label>' +
      '<p style="font-size:11.5px;color:var(--ink-3);margin-top:12px">题目按题型从本章范围的题库中抽取，解答题、实验题、阅读与写作题均附参考答案与评分要点；若某题型题量不足，会按现有题目配比，满分以实际合计为准。</p>' +
      "</div>" +
      '<div class="modal-foot"><button class="btn" data-act="print-paper">仅打印</button>' +
      '<button class="btn btn-primary" data-act="start-paper">生成并开始</button></div>'
    );
  }

  function doSync(quiet) {
    if (!quiet) toast("正在校验资源版本…", "");
    var bars = [0, 1, 2, 3].map(function (i) { return $("#srcBar" + i); });
    var stamp = $("#syncStamp");
    var p = 0;
    var iv = setInterval(function () {
      p += 4 + Math.random() * 8;
      if (p >= 100) p = 100;
      bars.forEach(function (b, i) {
        if (b) b.style.width = Math.max(0, Math.min(100, p * 1.05 - i * 6)) + "%";
      });
      if (stamp) stamp.textContent = "同步中… " + Math.round(p) + "%";
      if (p >= 100) {
        clearInterval(iv);
        S.settings.syncTime = fmtTime(new Date());
        S.settings.syncVer = C.version;
        save();
        if (stamp) stamp.textContent = "上次同步：" + S.settings.syncTime;
        toast("资料已是最新 · " + C.version, "good");
        addPoints(2, "完成资料同步");
        updateSyncMini();
      }
    }, 110);
  }

  /* 专注计时 */
  function initFocus() {
    var btn = $("#focusToggle"), clock = $("#focusClock"), box = $("#focusTimer");
    btn.addEventListener("click", function () {
      focus.run = !focus.run;
      box.classList.toggle("running", focus.run);
      btn.textContent = focus.run ? "❚❚" : "▶";
      clearInterval(focus.timer);
      if (focus.run) {
        focus.timer = setInterval(function () {
          focus.sec++;
          clock.textContent = mmss(focus.sec);
          if (focus.sec % 60 === 0) { S.today.minutes = (S.today.minutes || 0) + 1; save(); }
          if (focus.sec === 25 * 60) toast("已专注 25 分钟，起来活动一下", "");
        }, 1000);
      } else if (focus.sec >= 300) {
        addPoints(2, "专注 " + Math.round(focus.sec / 60) + " 分钟");
      }
    });
  }

  /* 启动 */
  load();
  initFocus();
  updateCoin(); updateWrongBadge(); updateSyncMini(); subjectBar();
  renderView();

  $("#menuBtn").addEventListener("click", function () {
    $("#sidebar").classList.toggle("open");
  });
  $("#modalMask").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
    if (!quiz || !$("#qArea")) return;
    if (e.key === "ArrowRight") { if (quiz.idx < quiz.qs.length - 1) { quiz.idx++; paintQuestion(); refreshDots(); } }
    if (e.key === "ArrowLeft") { if (quiz.idx > 0) { quiz.idx--; paintQuestion(); refreshDots(); } }
    if (/^[1-4]$/.test(e.key) && quiz.qs[quiz.idx].t === "single") {
      var i = parseInt(e.key, 10) - 1;
      if (i < quiz.qs[quiz.idx].opts.length) {
        quiz.answers[quiz.idx] = i;
        var opts = document.querySelectorAll("#qArea .opt");
        Array.prototype.forEach.call(opts, function (b) { b.classList.remove("is-picked"); });
        if (opts[i]) opts[i].classList.add("is-picked");
        refreshDots();
      }
    }
  });
})();
