(function () {
  "use strict";
  const bank = window.DevOpsQuizBank || {};
  const levels = [
    { id: "easy", label: "Easy", detail: "Build confidence with core concepts", minutes: 15 },
    { id: "medium", label: "Medium", detail: "Apply knowledge to everyday work", minutes: 25 },
    { id: "mediumHard", label: "Medium hard", detail: "Reason through real operational problems", minutes: 35 },
    { id: "hard", label: "Hard", detail: "Practice senior-level and exam-style decisions", minutes: 45 }
  ];
  const topicLabels = {
    linux: "Linux", systems: "Systems administration", terraform: "Terraform", aws: "AWS",
    ansible: "Ansible", docker: "Docker", kubernetes: "Kubernetes", git: "Git & CI/CD",
    sre: "SRE & incident response", observability: "Observability", networking: "Networking"
  };
  const $ = (id) => document.getElementById(id);
  const state = {
    level: "easy", topic: "all", count: 20, mode: "practice", timed: true,
    questions: [], answers: [], index: 0, remaining: 0, timer: null, startedAt: 0,
    finished: false, reviewFilter: "all", sessionId: 0
  };
  const STORAGE_KEY = "devops-sre-quiz-v1";
  const LEVEL_KEY = "devops-sre-quiz-last";
  let history = [];
  try { history = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); if (!Array.isArray(history)) history = []; } catch (_) { history = []; }
  const last = (() => { try { return JSON.parse(localStorage.getItem(LEVEL_KEY) || "{}"); } catch (_) { return {}; } })();
  if (levels.some((l) => l.id === last.level)) state.level = last.level;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  }
  function getPool() {
    const groups = bank[state.level] || {};
    return Object.entries(groups).flatMap(([topic, questions]) => {
      if (state.topic !== "all" && topic !== state.topic) return [];
      return questions.map((q, i) => ({ ...q, tech: topic, id: state.level + "-" + topic + "-" + i }));
    });
  }
  function shuffle(items) {
    const out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function setScreen(name) {
    document.querySelectorAll(".screen").forEach((el) => {
      const active = el.id === name + "-screen";
      el.classList.toggle("active", active);
      el.hidden = !active;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function renderSetup() {
    $("level-options").innerHTML = levels.map((level, i) => {
      const count = Object.values(bank[level.id] || {}).reduce((sum, list) => sum + list.length, 0);
      return '<button type="button" class="level-card ' + (state.level === level.id ? "selected" : "") + '" data-level="' + level.id + '" aria-pressed="' + (state.level === level.id) + '">' +
        '<span class="level-number">0' + (i + 1) + '</span><strong>' + level.label + '</strong><span>' + level.detail + '</span><small>' + count + ' questions available</small></button>';
    }).join("");
    const groups = bank[state.level] || {};
    const options = Object.entries(groups).map(([topic, questions]) => ({ topic, count: questions.length })).filter((item) => item.count > 0);
    if (state.topic !== "all" && !groups[state.topic]) state.topic = "all";
    $("topic-select").innerHTML = '<option value="all">All topics</option>' + options.map((x) =>
      '<option value="' + escapeHtml(x.topic) + '">' + escapeHtml(topicLabels[x.topic] || x.topic) + " (" + x.count + ")</option>").join("");
    $("topic-select").value = state.topic;
    const poolCount = getPool().length;
    $("available-count").textContent = poolCount + " available questions";
    $("count-select").innerHTML = [10,20,30,40,50].map((n) => '<option value="' + n + '">' + n + ' questions</option>').join("") +
      '<option value="all">All available (' + poolCount + ')</option>';
    $("count-select").value = String(state.count);
    if (state.count !== "all" && Number(state.count) > poolCount) state.count = poolCount || 10;
    $("count-select").value = String(state.count);
    $("mode-practice").checked = state.mode === "practice";
    $("mode-exam").checked = state.mode === "exam";
    $("timed-toggle").checked = state.timed;
    $("start-quiz").disabled = poolCount === 0;
    $("setup-message").textContent = poolCount < Number(state.count) && state.count !== "all" ?
      "This selection contains " + poolCount + " questions. The quiz will use all available questions for this selection." : "";
    renderHistory();
  }
  function renderHistory() {
    const total = history.length;
    const avg = total ? Math.round(history.reduce((sum, x) => sum + x.score, 0) / total) : 0;
    const best = total ? Math.max(...history.map((x) => x.score)) : 0;
    $("stat-attempts").textContent = total;
    $("stat-average").textContent = avg + "%";
    $("stat-best").textContent = best + "%";
    const recent = history.slice(-4).reverse();
    $("recent-sessions").innerHTML = recent.length ? recent.map((x) =>
      '<div class="history-row"><span><strong>' + escapeHtml(x.levelLabel) + '</strong><small>' + escapeHtml(x.date) + " · " + escapeHtml(x.mode) + '</small></span><strong>' + x.score + '%</strong></div>').join("") :
      '<p class="muted">Your results will appear here after your first quiz. Progress stays in this browser.</p>';
  }
  function startQuiz() {
    const pool = shuffle(getPool());
    if (!pool.length) return;
    const requested = state.count === "all" ? pool.length : Math.max(1, Number(state.count) || 20);
    state.questions = pool.slice(0, Math.min(requested, pool.length)).map((q) => {
      const opts = q.options.map((text, index) => ({ text, correct: index === q.correct }));
      const shuffledOptions = shuffle(opts);
      return { ...q, options: shuffledOptions.map((o) => o.text), correct: shuffledOptions.findIndex((o) => o.correct) };
    });
    state.answers = new Array(state.questions.length).fill(null);
    state.index = 0;
    state.finished = false;
    state.sessionId++;
    state.startedAt = Date.now();
    state.remaining = Math.max(1, state.questions.length) * (state.mode === "exam" ? 75 : 60);
    $("quiz-level").textContent = levels.find((x) => x.id === state.level).label;
    $("quiz-mode").textContent = state.mode === "exam" ? "Exam mode" : "Practice mode";
    $("quiz-total").textContent = state.questions.length;
    $("quiz-progress").max = state.questions.length;
    $("quiz-progress").value = 1;
    $("quiz-topic").textContent = state.topic === "all" ? "Mixed topics" : (topicLabels[state.topic] || state.topic);
    $("quiz-live-feedback").textContent = "";
    setScreen("quiz");
    renderQuestion();
    if (state.timed) {
      clearInterval(state.timer);
      state.timer = setInterval(() => {
        state.remaining--;
        renderTimer();
        if (state.remaining <= 0) finishQuiz(true);
      }, 1000);
      renderTimer();
    } else {
      $("timer-wrap").hidden = true;
    }
  }
  function renderTimer() {
    $("timer-wrap").hidden = !state.timed;
    const minutes = Math.floor(state.remaining / 60);
    const seconds = state.remaining % 60;
    $("timer-value").textContent = minutes + ":" + String(seconds).padStart(2, "0");
    $("timer-wrap").classList.toggle("urgent", state.remaining <= 60);
  }
  function renderQuestion() {
    const q = state.questions[state.index];
    if (!q) return;
    $("question-number").textContent = "Question " + (state.index + 1) + " of " + state.questions.length;
    $("question-title").textContent = q.question;
    $("question-topic").textContent = topicLabels[q.tech] || q.tech;
    $("question-difficulty").textContent = levels.find((x) => x.id === state.level).label;
    $("quiz-progress").value = state.index + 1;
    $("progress-percent").textContent = Math.round(((state.index + 1) / state.questions.length) * 100) + "%";
    $("answer-options").innerHTML = q.options.map((option, i) => {
      const selected = state.answers[state.index] === i;
      return '<button type="button" class="answer-option ' + (selected ? "selected" : "") + '" data-answer="' + i + '" aria-pressed="' + selected + '">' +
        '<span class="option-letter">' + String.fromCharCode(65 + i) + '</span><span>' + escapeHtml(option) + '</span></button>';
    }).join("");
    $("prev-question").disabled = state.index === 0;
    $("next-question").textContent = state.index === state.questions.length - 1 ? "Finish quiz" : "Next question";
    $("answered-count").textContent = state.answers.filter((x) => x !== null).length + " answered";
    $("question-feedback").hidden = true;
    if (state.mode === "practice" && state.answers[state.index] !== null) showFeedback();
    $("flag-question").textContent = q.flagged ? "★ Saved for review" : "☆ Save for review";
  }
  function chooseAnswer(index) {
    if (state.finished) return;
    state.answers[state.index] = index;
    renderQuestion();
    if (state.mode === "practice") showFeedback();
  }
  function showFeedback() {
    const q = state.questions[state.index];
    const answer = state.answers[state.index];
    if (answer === null) return;
    const correct = answer === q.correct;
    $("question-feedback").hidden = false;
    $("question-feedback").className = "feedback " + (correct ? "correct" : "incorrect");
    $("feedback-title").textContent = correct ? "Correct — nice work" : "Not quite — learn from it";
    $("feedback-explanation").textContent = q.explanation || "Review the correct option and consult the official documentation for this topic.";
    $("feedback-answer").textContent = "Correct answer: " + q.options[q.correct];
  }
  function finishQuiz(timeExpired) {
    if (state.finished) return;
    state.finished = true;
    clearInterval(state.timer);
    const total = state.questions.length;
    const correct = state.questions.reduce((n, q, i) => n + (state.answers[i] === q.correct ? 1 : 0), 0);
    const answered = state.answers.filter((x) => x !== null).length;
    const score = Math.round(correct / Math.max(1, total) * 100);
    const levelLabel = levels.find((x) => x.id === state.level).label;
    const session = { date: new Date().toLocaleDateString(), level: state.level, levelLabel, mode: state.mode === "exam" ? "Exam" : "Practice", score, correct, total, answered, topic: state.topic };
    history.push(session);
    history = history.slice(-30);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); localStorage.setItem(LEVEL_KEY, JSON.stringify({ level: state.level })); } catch (_) {}
    $("result-score").textContent = score + "%";
    $("result-title").textContent = score >= 85 ? "Strong performance" : score >= 65 ? "Good progress — keep going" : "A useful baseline to build on";
    $("result-summary").textContent = (timeExpired ? "Time expired. " : "") + "You answered " + correct + " of " + total + " questions correctly. " + answered + " of " + total + " answered.";
    $("result-correct").textContent = correct;
    $("result-incorrect").textContent = total - correct;
    $("result-unanswered").textContent = total - answered;
    $("result-level").textContent = levelLabel + " · " + session.mode;
    renderBreakdown();
    renderReview();
    renderSetup();
    setScreen("results");
  }
  function renderBreakdown() {
    const groups = {};
    state.questions.forEach((q, i) => {
      if (!groups[q.tech]) groups[q.tech] = { total: 0, correct: 0 };
      groups[q.tech].total++;
      if (state.answers[i] === q.correct) groups[q.tech].correct++;
    });
    $("result-breakdown").innerHTML = Object.entries(groups).map(([topic, stats]) => {
      const percent = Math.round(stats.correct / stats.total * 100);
      return '<div class="breakdown-row"><div class="breakdown-label"><span>' + escapeHtml(topicLabels[topic] || topic) + '</span><strong>' + stats.correct + "/" + stats.total + " · " + percent + '%</strong></div><div class="mini-track"><span style="width:' + percent + '%"></span></div></div>';
    }).join("");
    const missed = state.questions.map((q, i) => ({ q, i })).filter(({ q, i }) => state.answers[i] !== q.correct);
    $("weak-topics").innerHTML = missed.length ? '<p>Prioritize these topics in your next session:</p><div class="chip-list">' + [...new Set(missed.map(({ q }) => topicLabels[q.tech] || q.tech)).values()].map((x) => '<span class="topic-chip">' + escapeHtml(x) + '</span>').join("") + '</div>' :
      '<p>Perfect run. Raise the difficulty or try a timed mixed-topic exam.</p>';
  }
  function renderReview() {
    const filtered = state.questions.map((q, i) => ({ q, i })).filter(({ q, i }) => {
      if (state.reviewFilter === "missed" && state.answers[i] === q.correct) return false;
      if (state.reviewFilter === "saved" && !q.flagged) return false;
      return true;
    });
    $("review-count").textContent = filtered.length + " questions";
    $("review-list").innerHTML = filtered.length ? filtered.map(({ q, i }) => {
      const answer = state.answers[i];
      const correct = answer === q.correct;
      return '<article class="review-card ' + (correct ? "review-correct" : "review-missed") + '">' +
        '<div class="review-card-top"><span class="topic-chip">' + escapeHtml(topicLabels[q.tech] || q.tech) + '</span><span class="review-status">' +
        (answer === null ? "Unanswered" : correct ? "Correct" : "Review this") + '</span></div>' +
        '<h3>' + (i + 1) + ". " + escapeHtml(q.question) + '</h3>' +
        '<p class="your-answer"><strong>Your answer:</strong> ' + escapeHtml(answer === null ? "Not answered" : q.options[answer]) + '</p>' +
        '<p><strong>Correct answer:</strong> ' + escapeHtml(q.options[q.correct]) + '</p>' +
        '<p class="review-explanation">' + escapeHtml(q.explanation || "No explanation has been added yet. Consult official documentation for this topic.") + '</p></article>';
    }).join("") : '<p class="muted empty-state">No questions match this filter.</p>';
  }
  function exportResults() {
    const lines = ["DevOps & SRE Quiz Results", "Level: " + levels.find((x) => x.id === state.level).label, "Mode: " + state.mode, ""];
    state.questions.forEach((q, i) => {
      lines.push((i + 1) + ". " + q.question);
      lines.push("Your answer: " + (state.answers[i] === null ? "Unanswered" : q.options[state.answers[i]]));
      lines.push("Correct answer: " + q.options[q.correct]);
      lines.push("Explanation: " + (q.explanation || "Not provided"));
      lines.push("");
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "devops-sre-quiz-review.txt"; a.click();
    URL.revokeObjectURL(url);
  }
  function resetSetup() {
    clearInterval(state.timer);
    state.questions = []; state.answers = []; state.finished = false;
    setScreen("welcome");
    renderSetup();
  }
  $("level-options").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-level]");
    if (!btn) return;
    state.level = btn.dataset.level;
    state.topic = "all";
    renderSetup();
  });
  $("topic-select").addEventListener("change", (event) => { state.topic = event.target.value; renderSetup(); });
  $("count-select").addEventListener("change", (event) => { state.count = event.target.value === "all" ? "all" : Number(event.target.value); renderSetup(); });
  document.querySelectorAll('input[name="quiz-mode"]').forEach((input) => input.addEventListener("change", () => { state.mode = input.value; }));
  $("timed-toggle").addEventListener("change", (event) => { state.timed = event.target.checked; });
  $("start-quiz").addEventListener("click", startQuiz);
  $("answer-options").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-answer]");
    if (btn) chooseAnswer(Number(btn.dataset.answer));
  });
  $("prev-question").addEventListener("click", () => { if (state.index > 0) { state.index--; renderQuestion(); } });
  $("next-question").addEventListener("click", () => {
    if (state.index < state.questions.length - 1) { state.index++; renderQuestion(); }
    else finishQuiz(false);
  });
  $("flag-question").addEventListener("click", () => {
    const q = state.questions[state.index];
    q.flagged = !q.flagged;
    $("flag-question").textContent = q.flagged ? "★ Saved for review" : "☆ Save for review";
  });
  $("quit-quiz").addEventListener("click", () => {
    if (window.confirm("Leave this quiz? Your current attempt will not be scored.")) resetSetup();
  });
  $("open-review").addEventListener("click", () => { state.reviewFilter = "all"; $("review-filter").value = "all"; renderReview(); setScreen("review"); });
  $("review-filter").addEventListener("change", (event) => { state.reviewFilter = event.target.value; renderReview(); });
  $("back-results").addEventListener("click", () => setScreen("results"));
  $("retry-quiz").addEventListener("click", startQuiz);
  $("new-quiz").addEventListener("click", resetSetup);
  $("download-review").addEventListener("click", exportResults);
  $("clear-history").addEventListener("click", () => {
    if (window.confirm("Clear saved quiz history from this browser?")) {
      history = [];
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      renderHistory();
    }
  });
  $("show-roadmap").addEventListener("click", () => {
    const panel = $("roadmap-panel");
    panel.hidden = !panel.hidden;
    $("show-roadmap").setAttribute("aria-expanded", String(!panel.hidden));
  });
  $("roadmap-panel").hidden = true;
  renderSetup();
  setScreen("welcome");
})();