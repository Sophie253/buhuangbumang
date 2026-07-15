const STORAGE_KEY = "huiwang-growth-coach-v1";

const topics = {
  reading: { label: "阅读", icon: "book-open", className: "reading" },
  writing: { label: "写作", icon: "pen-line", className: "writing" },
  learning: { label: "学习", icon: "brain-circuit", className: "learning" },
};

const stages = [
  {
    title: "先从事实开始",
    prompt: "这周，阅读、写作或学习里，真实发生了什么？可以只说一件，也可以直接说没有。",
    quick: ["我读了一点", "我写了一点", "我学了一点", "这周没有做"],
    key: "facts",
  },
  {
    title: "留下一个有温度的细节",
    prompt: "你提到的事里，哪一处最让你有印象？它不必深刻，具体就够了。",
    quick: ["一段文字", "一个新问题", "一次卡住", "还说不上来"],
    key: "insight",
  },
  {
    title: "看看阻力在哪里",
    prompt: "如果有想做却没做的事，最主要的阻力是什么？不需要责备自己，只要说清楚。",
    quick: ["忘记了", "太累了", "手机分心", "目标太大了"],
    key: "barrier",
  },
  {
    title: "为下周留下一件事",
    prompt: "下周你愿意回应的一件最小行动是什么？请写清对象、动作和大致时间，例如“周三早上读一篇文献摘要 10 分钟”。",
    quick: ["先选一本书", "早上读 10 分钟", "写 100 字", "先整理桌面"],
    key: "next",
  },
];

const defaultState = {
  focus: ["reading", "learning"],
  commitments: [],
  reviews: [],
  draft: { stage: 0, messages: [], answers: {} },
  settings: { reminderTime: "20:30", notificationPrompted: false },
};

let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...structuredClone(defaultState), ...stored, settings: { ...defaultState.settings, ...(stored?.settings || {}) } };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function $ (selector) { return document.querySelector(selector); }
function $$ (selector) { return [...document.querySelectorAll(selector)]; }

function iconRefresh() {
  if (window.lucide) window.lucide.createIcons();
}

function getWeekRange(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  const end = new Date(d); end.setDate(d.getDate() + 6);
  const fmt = (x) => `${x.getMonth() + 1} 月 ${x.getDate()} 日`;
  return `${fmt(d)} 至 ${fmt(end)}`;
}

function formatDate(dateString) {
  if (!dateString) return "本周内回应";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "本周内回应";
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function switchView(name) {
  $$(".view").forEach((el) => el.classList.toggle("active", el.id === `${name}View`));
  $$(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.view === name));
  if (name === "history") renderHistory();
  if (name === "review") renderReview();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderFocus() {
  const root = $("#focusTopics");
  root.innerHTML = state.focus.map((key) => {
    const topic = topics[key];
    return `<span class="topic-pill ${topic.className}"><i data-lucide="${topic.icon}"></i>${topic.label}</span>`;
  }).join("");
  iconRefresh();
}

function renderCommitments() {
  const root = $("#commitmentList");
  if (!state.commitments.length) {
    root.innerHTML = $("#emptyCommitmentTemplate").innerHTML;
    iconRefresh();
    return;
  }
  root.innerHTML = state.commitments.map((action) => `
    <article class="commitment-item ${action.done ? "done" : ""}">
      <button class="check-button" data-action="toggle" data-id="${action.id}" type="button" title="${action.done ? "标记为未完成" : "标记为完成"}">${action.done ? '<i data-lucide="check"></i>' : ""}</button>
      <div><div class="commitment-text">${escapeHtml(action.text)}</div><p class="commitment-meta">${action.done ? "已回应" : formatDate(action.time)}</p></div>
      <button class="delete-action" data-action="delete" data-id="${action.id}" type="button" title="移除此行动" aria-label="移除此行动"><i data-lucide="x"></i></button>
    </article>`).join("");
  iconRefresh();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function getProgress() {
  if (state.reviews.length && !state.draft.messages.length) return 100;
  return Math.round((state.draft.stage / stages.length) * 100);
}

function renderHome() {
  $("#weekLabel").textContent = `本周 · ${getWeekRange()}`;
  renderFocus();
  renderCommitments();
  const progress = getProgress();
  const ring = $(".progress-ring");
  ring.style.setProperty("--progress", progress);
  $("#progressNumber").textContent = progress;
  const done = state.reviews.length > 0 && (!state.draft.messages.length || state.draft.stage >= stages.length);
  $("#reviewStatus").textContent = done ? "已完成" : progress ? "进行中" : "待开始";
  $("#reviewStatusText").textContent = done ? "这一周已经被你好好看见。" : progress ? "不需要从头来，继续说下去。" : "留出 10 分钟，和自己说说这周。";
  $("#continueReviewButton").innerHTML = done ? '查看档案 <i data-lucide="arrow-up-right"></i>' : `${progress ? "继续对话" : "进入对话"} <i data-lucide="arrow-up-right"></i>`;
  iconRefresh();
}

function reviewMessages() {
  if (!state.draft.messages.length) {
    state.draft.messages = [{ role: "coach", text: "这不是考核。我们只是把这一周真实发生的事，重新放回你手里。" }, { role: "coach", text: stages[0].prompt }];
    saveState();
  }
  return state.draft.messages;
}

function renderReview() {
  const messages = reviewMessages();
  const stage = state.draft.stage;
  $("#reviewTitle").textContent = stage < stages.length ? stages[stage].title : "这周已经被你好好看见";
  const conversation = $("#conversation");
  conversation.innerHTML = messages.map((m) => `
    <div class="message ${m.role === "user" ? "user" : "coach"}">
      <div class="avatar">${m.role === "user" ? "你" : "回"}</div>
      <div class="bubble">${escapeHtml(m.text)}<small>${m.role === "user" ? "你的回答" : "成长督导"}</small></div>
    </div>`).join("");
  conversation.scrollTop = conversation.scrollHeight;
  $("#quickReplies").innerHTML = stage < stages.length ? stages[stage].quick.map((reply) => `<button class="quick-reply" type="button">${reply}</button>`).join("") : "";
  const finished = stage >= stages.length;
  $("#answerInput").disabled = finished;
  $("#voiceButton").disabled = finished;
  $("#composer").querySelector("button[type=submit]").disabled = finished;
  $("#answerInput").placeholder = finished ? "这轮复盘已归档。" : "写下真实的回答，不需要写得漂亮。";
  updateLiveSummary();
}

function updateLiveSummary() {
  const a = state.draft.answers;
  $("#summaryFacts").textContent = a.facts || "等待你的回答";
  $("#summaryInsight").textContent = a.insight || "尚未记录";
  $("#summaryNext").textContent = a.next || "尚未决定";
}

function respond(answer) {
  const clean = answer.trim();
  if (!clean || state.draft.stage >= stages.length) return;
  const stage = stages[state.draft.stage];
  state.draft.messages.push({ role: "user", text: clean });
  state.draft.answers[stage.key] = clean;
  state.draft.stage += 1;
  if (state.draft.stage < stages.length) {
    state.draft.messages.push({ role: "coach", text: coachBridge(stage.key, clean) });
    state.draft.messages.push({ role: "coach", text: stages[state.draft.stage].prompt });
  } else {
    state.draft.messages.push({ role: "coach", text: "谢谢你没有绕开这一周。你的复盘已经整理好。请把下一步放进本周行动里，它只需要小到你愿意回应。" });
    archiveReview();
  }
  saveState();
  $("#answerInput").value = "";
  resizeComposer();
  renderReview();
  renderHome();
  if (state.draft.stage >= stages.length) openActionDialog(state.draft.answers.next || "");
}

function coachBridge(key, answer) {
  const bridges = {
    facts: `我听见了：${answer}。不用判断做得够不够，先把它当作这一周的真实证据。`,
    insight: `这个细节值得留下：${answer}。它比一个漂亮结论更接近你实际的生活。`,
    barrier: `阻力被说清楚，就不再只是“我不够自律”。你提到的是：${answer}。`,
  };
  return bridges[key] || "";
}

function archiveReview() {
  const a = state.draft.answers;
  state.reviews.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), facts: a.facts, insight: a.insight, barrier: a.barrier, next: a.next });
}

function clearDraftAfterArchive() {
  state.draft = structuredClone(defaultState.draft);
  saveState();
}

function renderHistory() {
  const root = $("#historyList");
  if (!state.reviews.length) {
    root.innerHTML = '<div class="empty-state"><i data-lucide="archive"></i><p>第一轮周复盘完成后，它会出现在这里。</p></div>';
    iconRefresh(); return;
  }
  root.innerHTML = state.reviews.map((review) => `
    <article class="history-item">
      <header><div><p class="eyebrow">一周回看</p><h2>${new Date(review.date).toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}</h2></div><time>${new Date(review.date).toLocaleDateString("zh-CN")}</time></header>
      <p><strong>发生了什么：</strong>${escapeHtml(review.facts)}</p>
      <p><strong>留下的细节：</strong>${escapeHtml(review.insight)}</p>
      <p><strong>阻力：</strong>${escapeHtml(review.barrier)}</p>
      <p><strong>下一步：</strong>${escapeHtml(review.next)}</p>
    </article>`).join("");
}

function renderTopicSelector() {
  const root = $("#topicSelector");
  root.innerHTML = Object.entries(topics).map(([key, topic]) => `
    <label class="topic-option ${state.focus.includes(key) ? "checked" : ""}">
      <div><i data-lucide="${topic.icon}"></i><span>${topic.label}</span></div><input type="checkbox" value="${key}" ${state.focus.includes(key) ? "checked" : ""} />
    </label>`).join("");
  iconRefresh();
  $$("#topicSelector input").forEach((input) => input.addEventListener("change", () => {
    const selected = $$("#topicSelector input:checked");
    if (selected.length > 2) input.checked = false;
    input.closest(".topic-option").classList.toggle("checked", input.checked);
  }));
}

function openFocusDialog() { renderTopicSelector(); $("#focusDialog").showModal(); }
function openActionDialog(prefill = "") { $("#actionText").value = prefill; $("#actionDialog").showModal(); $("#actionText").focus(); }
function openSettings() { $("#reminderTime").value = state.settings.reminderTime; updateNotificationState(); $("#settingsDialog").showModal(); }

function updateNotificationState() {
  const permission = "Notification" in window ? Notification.permission : "unsupported";
  const labels = { granted: "已允许浏览器通知", denied: "通知已被系统阻止", default: "尚未请求权限", unsupported: "当前浏览器不支持" };
  $("#notificationState").textContent = labels[permission];
  $("#requestNotificationButton").textContent = permission === "granted" ? "已开启" : "开启";
  $("#requestNotificationButton").disabled = permission === "granted" || permission === "unsupported";
}

async function requestNotifications() {
  if (!("Notification" in window)) return;
  const permission = await Notification.requestPermission();
  state.settings.notificationPrompted = true;
  saveState(); updateNotificationState();
  if (permission === "granted") new Notification("不慌不忙", { body: "提醒已开启。下一次复盘，记得先看真实发生的事。" });
}

function checkDueReminder() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const [hours, minutes] = state.settings.reminderTime.split(":").map(Number);
  if ((now.getDay() === 0 || now.getDay() === 6) && now.getHours() === hours && Math.abs(now.getMinutes() - minutes) < 2) {
    new Notification("不慌不忙", { body: "留出 10 分钟，和自己说说这一周。" });
  }
}

function resizeComposer() {
  const input = $("#answerInput");
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
}

function initVoice() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    $("#voiceButton").title = "当前浏览器不支持语音输入";
    return;
  }
  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  let finalText = "";
  recognition.addEventListener("start", () => { $("#voiceButton").classList.add("listening"); });
  recognition.addEventListener("end", () => { $("#voiceButton").classList.remove("listening"); });
  recognition.addEventListener("result", (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      else interim += event.results[i][0].transcript;
    }
    $("#answerInput").value = finalText + interim;
    resizeComposer();
  });
  $("#voiceButton").addEventListener("click", () => recognition.start());
}

function bindEvents() {
  $$(".nav-item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  $("#startReviewButton").addEventListener("click", () => switchView("review"));
  $("#continueReviewButton").addEventListener("click", () => state.reviews.length && (!state.draft.messages.length || state.draft.stage >= stages.length) ? switchView("history") : switchView("review"));
  $("#exitReviewButton").addEventListener("click", () => switchView("home"));
  $("#editFocusButton").addEventListener("click", openFocusDialog);
  $("#quickReflectButton").addEventListener("click", () => { switchView("review"); $("#answerInput").focus(); });
  $$(".add-action").forEach((button) => button.addEventListener("click", () => openActionDialog()));
  $("#notificationButton").addEventListener("click", openSettings);
  $("#mobileSettings").addEventListener("click", openSettings);
  $("#requestNotificationButton").addEventListener("click", requestNotifications);
  $("#reminderTime").addEventListener("change", (event) => { state.settings.reminderTime = event.target.value; saveState(); });
  $("#composer").addEventListener("submit", (event) => { event.preventDefault(); respond($("#answerInput").value); });
  $("#answerInput").addEventListener("keydown", (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); respond(event.target.value); } });
  $("#answerInput").addEventListener("input", resizeComposer);
  $("#quickReplies").addEventListener("click", (event) => { if (event.target.matches(".quick-reply")) respond(event.target.textContent); });
  $("#commitmentList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]"); if (!button) return;
    const index = state.commitments.findIndex((item) => item.id === button.dataset.id); if (index < 0) return;
    if (button.dataset.action === "toggle") state.commitments[index].done = !state.commitments[index].done;
    if (button.dataset.action === "delete") state.commitments.splice(index, 1);
    saveState(); renderCommitments();
  });
  $("#focusForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const selected = $$("#topicSelector input:checked").map((input) => input.value);
    if (!selected.length) { event.preventDefault(); return; }
    state.focus = selected; saveState(); renderFocus();
  });
  $("#actionForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const text = $("#actionText").value.trim(); if (!text) { event.preventDefault(); return; }
    state.commitments.unshift({ id: crypto.randomUUID(), text, time: $("#actionTime").value, done: false });
    saveState(); renderCommitments();
    if (state.draft.stage >= stages.length) clearDraftAfterArchive();
    renderHome();
  });
  $("#resetButton").addEventListener("click", () => {
    if (confirm("确定清除这台设备上的所有复盘与行动记录吗？此操作无法撤销。")) { localStorage.removeItem(STORAGE_KEY); state = structuredClone(defaultState); renderHome(); renderReview(); renderHistory(); }
  });
}

function initPwa() {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
}

function init() {
  renderHome();
  bindEvents();
  initVoice();
  initPwa();
  setInterval(checkDueReminder, 60000);
  iconRefresh();
}

document.addEventListener("DOMContentLoaded", init);
