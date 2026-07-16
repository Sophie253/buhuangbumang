const STORAGE_KEY = "huiwang-growth-coach-v1";
const SESSION_KEY = "buhuangbumang-supabase-session-v1";
const SYNC_CONFIG = window.BUHUANGBUMANG_SYNC_CONFIG || {};

const topics = {
  reading: { label: "阅读", icon: "book-open", className: "reading" },
  writing: { label: "写作", icon: "pen-line", className: "writing" },
  learning: { label: "学习", icon: "brain-circuit", className: "learning" },
  listening: { label: "English listening", icon: "headphones", className: "listening" },
  philosophy: { label: "哲学", icon: "landmark", className: "philosophy" },
  psychology: { label: "心理学", icon: "brain", className: "psychology" },
  history: { label: "历史", icon: "scroll-text", className: "history" },
  sifi: { label: "Sifi", icon: "rocket", className: "sifi" },
  conversationalAi: { label: "对话式 AI", icon: "messages-square", className: "conversational-ai" },
  agentAi: { label: "Agent AI", icon: "bot", className: "agent-ai" },
};

const materialKinds = {
  listen: { label: "课程或听力", icon: "headphones" },
  reading: { label: "英文或其他阅读", icon: "languages" },
  paper: { label: "科研文献", icon: "file-text" },
};

const microCategories = {
  self: { label: "身体与自己", icon: "sparkles" },
  relationship: { label: "关系与善意", icon: "heart" },
  nature: { label: "动物与自然", icon: "leaf" },
  play: { label: "电影音乐与玩乐", icon: "music-2" },
  life: { label: "空间与生活", icon: "coffee" },
};

const builtInMicroActions = [
  { id: "self-water", category: "self", text: "喝一杯水。" },
  { id: "self-stand", category: "self", text: "从椅子上站起来。" },
  { id: "self-distance-look", category: "self", text: "看 6 米外 1 分钟。" },
  { id: "self-chest-open", category: "self", text: "做一组扩胸运动。" },
  { id: "self-blink", category: "self", text: "眨眼 5 秒。" },
  { id: "self-grip-ring", category: "self", text: "握力圈 10 下。" },
  { id: "self-stretch", category: "self", text: "伸展 30 秒。" },
  { id: "self-breathe", category: "self", text: "到窗边深呼吸一次。" },
  { id: "self-walk", category: "self", text: "走 5 分钟。" },
  { id: "self-sleep", category: "self", text: "提前给睡觉留出十分钟。" },
  { id: "relationship-hug", category: "relationship", text: "拥抱一下家人。" },
  { id: "relationship-hello", category: "relationship", text: "认真问候一个人。" },
  { id: "relationship-thanks", category: "relationship", text: "向某个人说一声谢谢。" },
  { id: "relationship-message", category: "relationship", text: "给在意的人发一句消息。" },
  { id: "nature-cat", category: "nature", text: "撸一会儿猫。" },
  { id: "nature-dog", category: "nature", text: "遛一会儿狗。" },
  { id: "nature-bird", category: "nature", text: "逗一会儿鸟。" },
  { id: "nature-plant", category: "nature", text: "给植物浇一点水。" },
  { id: "nature-sky", category: "nature", text: "看看今天的天空。" },
  { id: "nature-tree", category: "nature", text: "观察一棵树或一朵花。" },
  { id: "play-song", category: "play", text: "听一首你想听的歌。", media: true },
  { id: "play-film", category: "play", text: "看一段电影，或看一部电影。", media: true },
  { id: "play-poem", category: "play", text: "读一首诗。" },
  { id: "play-dance", category: "play", text: "跳一支歌的时间。" },
  { id: "play-photo", category: "play", text: "翻一张旧照片。" },
  { id: "play-light", category: "play", text: "拍下一处喜欢的光。" },
  { id: "life-drink", category: "life", text: "泡一杯喜欢的饮品。" },
  { id: "life-tidy", category: "life", text: "收好一件物品。" },
  { id: "life-window", category: "life", text: "打开窗。" },
  { id: "life-desk", category: "life", text: "整理桌面上一小块地方。" },
  { id: "life-mat", category: "life", text: "看一眼 MAT。" },
  { id: "life-orbi", category: "life", text: "看一眼 Orbi。" },
];

const stages = [
  {
    title: "先从事实开始",
    prompt: "这周，阅读、写作或学习里，真实发生了什么？可以只说一件，也可以直接说没有。",
    quick: ["我读了一点", "我写了一点", "我学了一点", "这周没有做"],
    key: "facts",
  },
  {
    title: "留下一个有温度的细节",
    prompt: "从其中一项听读内容里，留下 1 到 2 句话吧：一个要点、一个问题，或你自己的解释都可以。",
    quick: ["一句摘录", "一个新问题", "我的解释", "还没有笔记"],
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
  materials: [],
  moments: [],
  micro: { deck: [], currentId: null, currentDone: false, customActions: [] },
  reviews: [],
  draft: { stage: 0, messages: [], answers: {} },
  settings: { reminderTime: "20:30", notificationPrompted: false },
  syncMeta: { updatedAt: null },
};

let state = loadState();
let cloudSession = loadCloudSession();
let cloudUser = null;
let syncTimer = null;
let syncInFlight = false;
let activeMaterialId = null;
let editingMaterialId = null;
let editingNoteId = null;
let activeMicroMomentId = null;
let editingMicroActionId = null;

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      ...structuredClone(defaultState),
      ...stored,
      settings: { ...defaultState.settings, ...(stored?.settings || {}) },
      micro: { ...defaultState.micro, ...(stored?.micro || {}), customActions: stored?.micro?.customActions || [] },
      syncMeta: { ...defaultState.syncMeta, ...(stored?.syncMeta || {}) },
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  state.syncMeta = { ...(state.syncMeta || {}), updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueCloudSync();
}

function isSyncConfigured() {
  return /^https:\/\/[^\s]+\.supabase\.co\/?$/.test(SYNC_CONFIG.url || "") && Boolean(SYNC_CONFIG.anonKey);
}

function loadCloudSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}

function saveCloudSession(session) {
  cloudSession = session;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

function supabaseUrl(path) {
  return `${SYNC_CONFIG.url.replace(/\/$/, "")}${path}`;
}

async function supabaseRequest(path, options = {}) {
  if (!isSyncConfigured()) throw new Error("同步服务尚未配置");
  const headers = { apikey: SYNC_CONFIG.anonKey, ...(options.headers || {}) };
  if (cloudSession?.access_token) headers.Authorization = `Bearer ${cloudSession.access_token}`;
  const response = await fetch(supabaseUrl(path), { ...options, headers });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.msg || detail.message || "同步暂时没有成功");
  }
  return response.status === 204 ? null : response.json();
}

function sessionExpiresSoon() {
  return !cloudSession?.expires_at || Number(cloudSession.expires_at) * 1000 < Date.now() + 60_000;
}

async function refreshCloudSession() {
  if (!cloudSession?.refresh_token || !sessionExpiresSoon()) return cloudSession;
  const response = await fetch(supabaseUrl("/auth/v1/token?grant_type=refresh_token"), {
    method: "POST",
    headers: { apikey: SYNC_CONFIG.anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: cloudSession.refresh_token }),
  });
  if (!response.ok) throw new Error("登录已过期，请重新打开登录链接");
  saveCloudSession(await response.json());
  return cloudSession;
}

async function getCloudUser() {
  if (!cloudSession?.access_token) return null;
  await refreshCloudSession();
  const user = await supabaseRequest("/auth/v1/user");
  cloudUser = user;
  return user;
}

function mergeById(remoteItems = [], localItems = []) {
  const merged = new Map();
  [...remoteItems, ...localItems].forEach((item) => {
    if (!item?.id) return;
    const existing = merged.get(item.id);
    merged.set(item.id, existing ? { ...existing, ...item } : item);
  });
  return [...merged.values()];
}

function mergeMaterials(remoteItems = [], localItems = []) {
  const combined = mergeById(remoteItems, localItems);
  return combined.map((material) => {
    const remote = remoteItems.find((item) => item.id === material.id);
    const local = localItems.find((item) => item.id === material.id);
    return { ...material, notes: mergeById(remote?.notes || [], local?.notes || []) };
  });
}

function mergeCloudState(remoteState, localState) {
  const remoteNewer = new Date(remoteState?.syncMeta?.updatedAt || 0) >= new Date(localState?.syncMeta?.updatedAt || 0);
  const newest = remoteNewer ? remoteState : localState;
  return {
    ...structuredClone(defaultState),
    ...newest,
    commitments: mergeById(remoteState?.commitments, localState?.commitments),
    materials: mergeMaterials(remoteState?.materials, localState?.materials),
    moments: mergeById(remoteState?.moments, localState?.moments),
    reviews: mergeById(remoteState?.reviews, localState?.reviews),
    micro: {
      ...defaultState.micro,
      ...(newest?.micro || {}),
      customActions: mergeById(remoteState?.micro?.customActions, localState?.micro?.customActions),
    },
    settings: { ...defaultState.settings, ...(newest?.settings || {}) },
    syncMeta: { updatedAt: new Date().toISOString() },
  };
}

function refreshAll() {
  renderHome();
  renderReview();
  renderHistory();
  renderSyncStatus();
}

function queueCloudSync() {
  if (!isSyncConfigured() || !cloudSession?.access_token || syncInFlight) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncCloudState(), 700);
}

async function syncCloudState({ pullFirst = false } = {}) {
  if (!isSyncConfigured() || !cloudSession?.access_token || syncInFlight) return;
  syncInFlight = true;
  renderSyncStatus("正在同步");
  try {
    await refreshCloudSession();
    const user = cloudUser || await getCloudUser();
    if (pullFirst) {
      const rows = await supabaseRequest(`/rest/v1/app_states?select=data,updated_at&user_id=eq.${encodeURIComponent(user.id)}`);
      if (rows[0]?.data) {
        state = mergeCloudState(rows[0].data, state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    }
    await supabaseRequest("/rest/v1/app_states?on_conflict=user_id", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ user_id: user.id, data: state, updated_at: new Date().toISOString() }),
    });
    renderSyncStatus("已同步");
    refreshAll();
  } catch (error) {
    renderSyncStatus(error.message || "同步暂时没有成功", true);
  } finally {
    syncInFlight = false;
  }
}

function parseMagicLinkSession() {
  const hash = new URLSearchParams(location.hash.slice(1));
  if (!hash.get("access_token")) return false;
  saveCloudSession({
    access_token: hash.get("access_token"),
    refresh_token: hash.get("refresh_token"),
    expires_at: hash.get("expires_at") || String(Math.floor(Date.now() / 1000) + Number(hash.get("expires_in") || 3600)),
  });
  history.replaceState({}, document.title, `${location.pathname}${location.search}`);
  return true;
}

function renderSyncStatus(message = "") {
  const configured = isSyncConfigured();
  const signedIn = configured && Boolean(cloudSession?.access_token && cloudUser);
  const note = $("#storageNote");
  if (note) note.innerHTML = signedIn ? '<i data-lucide="cloud-check"></i> 已登录私密同步' : '<i data-lucide="hard-drive"></i> 数据仅保存在此设备';
  const status = $("#syncStatus");
  const signedOut = $("#syncSignedOut");
  const signedInPanel = $("#syncSignedIn");
  if (!status || !signedOut || !signedInPanel) return;
  if (!configured) {
    status.textContent = "同步服务还没有连上。完成管理员设置后，这里就可以用邮箱登录。";
    signedOut.hidden = true;
    signedInPanel.hidden = true;
  } else if (signedIn) {
    status.textContent = message || "你的记录会加密传输，并只存到这个账号的私人空间。";
    signedOut.hidden = true;
    signedInPanel.hidden = false;
    $("#syncAccountEmail").textContent = cloudUser.email || "已登录";
  } else {
    status.textContent = message || "登录后会先合并这台设备已有的记录，再同步到你的其他设备。";
    signedOut.hidden = false;
    signedInPanel.hidden = true;
  }
  iconRefresh();
}

function openSyncDialog() {
  renderSyncStatus();
  $("#syncDialog").showModal();
}

async function sendMagicLink() {
  const email = $("#syncEmail").value.trim();
  if (!email || !$("#syncEmail").checkValidity()) { $("#syncEmail").reportValidity(); return; }
  if (!isSyncConfigured()) { renderSyncStatus("同步服务还没有准备好"); return; }
  const button = $("#sendMagicLinkButton");
  button.disabled = true;
  try {
    const response = await fetch(supabaseUrl("/auth/v1/otp"), {
      method: "POST",
      headers: { apikey: SYNC_CONFIG.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        create_user: true,
        gotrue_meta_security: {},
        options: { emailRedirectTo: SYNC_CONFIG.appUrl || `${location.origin}${location.pathname}` },
      }),
    });
    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      throw new Error(detail.msg || detail.message || "登录链接没有发出");
    }
    renderSyncStatus("登录链接已发到邮箱。请在这台设备上打开它，回来后会自动同步。");
  } catch (error) {
    renderSyncStatus(error.message || "登录链接没有发出", true);
  } finally {
    button.disabled = false;
  }
}

async function initSync() {
  const arrivedFromMagicLink = parseMagicLinkSession();
  if (!isSyncConfigured() || !cloudSession?.access_token) { renderSyncStatus(); return; }
  try {
    await getCloudUser();
    await syncCloudState({ pullFirst: true });
    if (arrivedFromMagicLink) openSyncDialog();
  } catch (error) {
    saveCloudSession(null);
    cloudUser = null;
    renderSyncStatus("登录已失效，请重新发送登录链接", true);
  }
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

function getTodayLabel(date = new Date()) {
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日 · ${["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()]}`;
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

function renderMaterials() {
  const root = $("#materialList");
  if (!state.materials.length) {
    root.innerHTML = '<div class="empty-state"><i data-lucide="headphones"></i><p>添加一项你想反复听、读或整理的内容。</p></div>';
    iconRefresh();
    return;
  }
  root.innerHTML = state.materials.map((material) => {
    const kind = materialKinds[material.kind] || materialKinds.listen;
    const latest = material.notes?.[0];
    return `<article class="material-card">
      <div class="material-card-top"><span class="material-type"><i data-lucide="${kind.icon}"></i>${kind.label}</span><div class="material-card-controls"><button class="edit-material" data-material-action="edit" data-id="${material.id}" type="button" title="编辑素材" aria-label="编辑素材"><i data-lucide="pencil"></i></button><button class="delete-material" data-material-action="delete" data-id="${material.id}" type="button" title="删除素材" aria-label="删除素材"><i data-lucide="x"></i></button></div></div>
      <div class="material-title">${escapeHtml(material.title)}</div>
      <p class="material-note">${latest ? escapeHtml(latest.text) : "还没有留下笔记。"}</p>
      <div class="material-actions"><time>${latest ? formatShortDate(latest.date) : ""}</time><div class="note-controls">${latest ? `<button class="text-button" data-material-action="edit-note" data-id="${material.id}" data-note-id="${latest.id}" type="button">修改</button>` : ""}<button class="text-button" data-material-action="note" data-id="${material.id}" type="button">${latest ? "再记一句" : "留一句"} <i data-lucide="pen-line"></i></button></div></div>
    </article>`;
  }).join("");
  iconRefresh();
}

function allMicroActions() {
  return [...builtInMicroActions, ...state.micro.customActions];
}

function findMicroAction(id) {
  return allMicroActions().find((action) => action.id === id);
}

function refillMicroDeck() {
  state.micro.deck = allMicroActions().map((action) => action.id).sort(() => Math.random() - 0.5);
}

function drawMicroAction() {
  const available = allMicroActions();
  if (!available.length) return;
  state.micro.deck = state.micro.deck.filter((id) => available.some((action) => action.id === id));
  if (!state.micro.deck.length) refillMicroDeck();
  if (state.micro.deck.length > 1 && state.micro.deck[0] === state.micro.currentId) state.micro.deck.push(state.micro.deck.shift());
  state.micro.currentId = state.micro.deck.shift();
  state.micro.currentDone = false;
  activeMicroMomentId = null;
  saveState();
  renderMicroGlow();
}

function renderMicroGlow() {
  const root = $("#microGlowCard");
  const action = findMicroAction(state.micro.currentId);
  if (!action) {
    root.classList.remove("is-done");
    root.innerHTML = `<p class="micro-glow-kicker"><i data-lucide="sparkles"></i>今天不需要完成什么</p><p class="micro-glow-text">抽一张，看看哪件小事现在刚好适合你。</p><div class="micro-glow-controls"><button class="micro-draw-button" data-micro-action="draw" type="button"><i data-lucide="shuffle"></i>抽一张</button></div>`;
    iconRefresh();
    return;
  }
  const category = microCategories[action.category] || microCategories.self;
  if (state.micro.currentDone) {
    root.classList.add("is-done");
    root.innerHTML = `<p class="micro-glow-kicker"><i data-lucide="check-circle-2"></i>今天留下了一点什么</p><p class="micro-glow-text">${escapeHtml(action.text)}</p><p class="micro-glow-subtext">不需要再做更多了。想玩的话，再抽一张。</p><div class="micro-glow-controls"><button class="micro-draw-button" data-micro-action="draw" type="button"><i data-lucide="shuffle"></i>再抽一张</button></div>`;
  } else {
    root.classList.remove("is-done");
    root.innerHTML = `<p class="micro-glow-kicker"><i data-lucide="${category.icon}"></i>${category.label}</p><p class="micro-glow-text">${escapeHtml(action.text)}</p><p class="micro-glow-subtext">做了就算，换一张也没关系。</p><div class="micro-glow-controls"><button class="micro-draw-button" data-micro-action="done" type="button"><i data-lucide="check"></i>做过了</button><button class="micro-swap-button" data-micro-action="swap" type="button"><i data-lucide="refresh-cw"></i>换一张</button></div>`;
  }
  iconRefresh();
}

function completeMicroAction() {
  const action = findMicroAction(state.micro.currentId);
  if (!action || state.micro.currentDone) return;
  const moment = {
    id: crypto.randomUUID(),
    kind: "micro",
    microActionId: action.id,
    actionText: action.text,
    detail: "",
    reflection: "",
    text: action.text,
    date: new Date().toISOString(),
  };
  state.moments.unshift(moment);
  state.micro.currentDone = true;
  activeMicroMomentId = moment.id;
  saveState();
  renderMicroGlow();
  openMicroMomentDialog(action, moment);
}

function openMicroMomentDialog(action, moment) {
  const category = microCategories[action.category] || microCategories.self;
  $("#microMomentCategory").textContent = category.label;
  $("#microMomentTitle").textContent = action.text;
  $("#microMomentDetail").value = moment?.detail || "";
  $("#microMomentReflection").value = moment?.reflection || "";
  $("#microMomentDetail").previousElementSibling.textContent = action.media ? "片名或歌名（可选）" : "相关对象或名称（可选）";
  $("#microMomentDialog").showModal();
  $("#microMomentReflection").focus();
}

function renderMicroLibrary() {
  const root = $("#microLibraryList");
  if (!state.micro.customActions.length) {
    root.innerHTML = '<div class="empty-state"><i data-lucide="sparkles"></i><p>还没有自定义微光。可以加一件你自己喜欢的小事。</p></div>';
    iconRefresh();
    return;
  }
  root.innerHTML = state.micro.customActions.map((action) => {
    const category = microCategories[action.category] || microCategories.self;
    return `<div class="micro-library-item"><div><p>${escapeHtml(action.text)}</p><small>${category.label}</small></div><div class="micro-library-controls"><button type="button" data-library-action="edit" data-id="${action.id}" title="编辑"><i data-lucide="pencil"></i></button><button type="button" data-library-action="delete" data-id="${action.id}" title="删除"><i data-lucide="x"></i></button></div></div>`;
  }).join("");
  iconRefresh();
}

function openMicroLibrary() {
  renderMicroLibrary();
  $("#microLibraryDialog").showModal();
}

function openMicroActionDialog(id = null) {
  editingMicroActionId = id;
  const action = id ? state.micro.customActions.find((item) => item.id === id) : null;
  if ($("#microLibraryDialog").open) $("#microLibraryDialog").close();
  $("#microActionDialogTitle").textContent = action ? "编辑这张小事卡" : "添加一张小事卡";
  $("#saveMicroActionButton").textContent = action ? "保存修改" : "加入卡组";
  $("#microActionText").value = action?.text || "";
  $("#microActionCategory").value = action?.category || "self";
  $("#microActionDialog").showModal();
  $("#microActionText").focus();
}

function formatShortDate(value) {
  const d = new Date(value);
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function getProgress() {
  if (state.reviews.length && !state.draft.messages.length) return 100;
  return Math.round((state.draft.stage / stages.length) * 100);
}

function renderHome() {
  $("#dayLabel").textContent = getTodayLabel();
  renderFocus();
  renderMicroGlow();
  renderMaterials();
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
    state.draft.messages = [{ role: "coach", text: "没有标准答案，聊聊这周发生了什么。" }, { role: "coach", text: stages[0].prompt }];
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
      <div class="bubble">${escapeHtml(m.text)}<small>${m.role === "user" ? "你的回答" : "不慌不忙"}</small></div>
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
  const entries = [
    ...state.reviews.map((review) => ({ type: "review", date: review.date, item: review })),
    ...state.moments.map((moment) => ({ type: moment.kind === "micro" ? "micro" : "moment", date: moment.date, item: moment })),
    ...state.materials.flatMap((material) => (material.notes || []).map((note) => ({ type: "note", date: note.date, item: note, material }))),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!entries.length) {
    root.innerHTML = '<div class="empty-state"><i data-lucide="archive"></i><p>你留下的周复盘、随手记录、微光和笔记，都会在这里慢慢排成一条线。</p></div>';
    iconRefresh(); return;
  }
  root.innerHTML = entries.map((entry) => {
    if (entry.type === "review") {
      const review = entry.item;
      return `<article class="history-item history-review">
        <header><div><p class="eyebrow">一周回看</p><h2>${new Date(review.date).toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}</h2></div><time>${formatDate(review.date)}</time></header>
        <p><strong>发生了什么：</strong>${escapeHtml(review.facts)}</p>
        <p><strong>留下的细节：</strong>${escapeHtml(review.insight)}</p>
        <p><strong>阻力：</strong>${escapeHtml(review.barrier)}</p>
        <p><strong>下一步：</strong>${escapeHtml(review.next)}</p>
      </article>`;
    }

    if (entry.type === "micro") {
      const moment = entry.item;
      const detail = [moment.detail, moment.reflection].filter(Boolean).map(escapeHtml).join("<br>");
      return `<article class="history-item history-moment">
        <header><div><p class="eyebrow">今日微光</p><h2>${escapeHtml(moment.actionText || moment.text)}</h2></div><time>${formatDate(moment.date)}</time></header>
        ${detail ? `<p>${detail}</p>` : '<p class="history-muted">做过就已经很好了，没有留下感受也没关系。</p>'}
      </article>`;
    }

    if (entry.type === "note") {
      const { item: note, material } = entry;
      return `<article class="history-item history-note">
        <header><div><p class="eyebrow">素材笔记</p><h2>${escapeHtml(material.title)}</h2></div><time>${formatDate(note.date)}</time></header>
        <p>${escapeHtml(note.text)}</p>
      </article>`;
    }

    const moment = entry.item;
    const material = state.materials.find((item) => item.id === moment.materialId);
    return `<article class="history-item history-moment">
      <header><div><p class="eyebrow">记录此刻</p><h2>${material ? escapeHtml(material.title) : "随手留下"}</h2></div><time>${formatDate(moment.date)}</time></header>
      <p>${escapeHtml(moment.text)}</p>
    </article>`;
  }).join("");
  iconRefresh();
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
function openMaterialDialog(id = null) {
  editingMaterialId = id;
  const material = id ? state.materials.find((item) => item.id === id) : null;
  $("#materialDialogTitle").textContent = material ? "编辑这项内容" : "添加一个想持续使用的内容";
  $("#saveMaterialButton").textContent = material ? "保存修改" : "加入素材";
  $("#materialTitle").value = material?.title || "";
  $("#materialKind").value = material?.kind || "listen";
  $("#materialDialog").showModal();
  $("#materialTitle").focus();
}
function openNoteDialog(id, noteId = null) {
  const material = state.materials.find((item) => item.id === id);
  if (!material) return;
  activeMaterialId = id;
  editingNoteId = noteId;
  const note = noteId ? material.notes?.find((item) => item.id === noteId) : null;
  $("#noteMaterialKind").textContent = materialKinds[material.kind]?.label || "学习记录";
  $("#noteMaterialTitle").textContent = note ? `修改 · ${material.title}` : material.title;
  $("#saveNoteButton").textContent = note ? "保存修改" : "保存这句话";
  $("#materialNote").value = note?.text || "";
  $("#noteDialog").showModal();
  $("#materialNote").focus();
}
function openMomentDialog() {
  const select = $("#momentMaterial");
  select.innerHTML = '<option value="">只是随手记下</option>' + state.materials.map((item) => `<option value="${item.id}">${escapeHtml(item.title)}</option>`).join("");
  $("#momentText").value = "";
  $("#momentDialog").showModal();
  $("#momentText").focus();
}
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
  $("#quickRecordButton").addEventListener("click", openMomentDialog);
  $("#manageMicroActionsButton").addEventListener("click", openMicroLibrary);
  $("#continueReviewButton").addEventListener("click", () => state.reviews.length && (!state.draft.messages.length || state.draft.stage >= stages.length) ? switchView("history") : switchView("review"));
  $("#exitReviewButton").addEventListener("click", () => switchView("home"));
  $("#editFocusButton").addEventListener("click", openFocusDialog);
  $("#addMaterialButton").addEventListener("click", () => openMaterialDialog());
  $("#quickReflectButton").addEventListener("click", () => { switchView("review"); $("#answerInput").focus(); });
  $$(".add-action").forEach((button) => button.addEventListener("click", () => openActionDialog()));
  $("#notificationButton").addEventListener("click", openSettings);
  $("#mobileSettings").addEventListener("click", openSettings);
  $("#syncButton").addEventListener("click", openSyncDialog);
  $("#mobileSync").addEventListener("click", openSyncDialog);
  $("#sendMagicLinkButton").addEventListener("click", sendMagicLink);
  $("#syncNowButton").addEventListener("click", () => syncCloudState({ pullFirst: true }));
  $("#signOutButton").addEventListener("click", () => {
    saveCloudSession(null); cloudUser = null; renderSyncStatus("已退出这台设备，本机记录仍然保留。");
  });
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
  $("#microGlowCard").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-micro-action]"); if (!button) return;
    if (button.dataset.microAction === "draw" || button.dataset.microAction === "swap") drawMicroAction();
    if (button.dataset.microAction === "done") completeMicroAction();
  });
  $("#addCustomMicroButton").addEventListener("click", () => openMicroActionDialog());
  $("#microLibraryList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-library-action]"); if (!button) return;
    const index = state.micro.customActions.findIndex((item) => item.id === button.dataset.id); if (index < 0) return;
    if (button.dataset.libraryAction === "edit") openMicroActionDialog(button.dataset.id);
    if (button.dataset.libraryAction === "delete") {
      state.micro.customActions.splice(index, 1);
      if (state.micro.currentId === button.dataset.id) { state.micro.currentId = null; state.micro.currentDone = false; }
      saveState(); renderMicroLibrary(); renderMicroGlow();
    }
  });
  $("#materialList").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-material-action]"); if (!button) return;
    const index = state.materials.findIndex((item) => item.id === button.dataset.id); if (index < 0) return;
    if (button.dataset.materialAction === "note") openNoteDialog(button.dataset.id);
    if (button.dataset.materialAction === "edit-note") openNoteDialog(button.dataset.id, button.dataset.noteId);
    if (button.dataset.materialAction === "edit") openMaterialDialog(button.dataset.id);
    if (button.dataset.materialAction === "delete") { state.materials.splice(index, 1); saveState(); renderMaterials(); }
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
  $("#materialForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const title = $("#materialTitle").value.trim(); if (!title) { event.preventDefault(); return; }
    if (editingMaterialId) {
      const material = state.materials.find((item) => item.id === editingMaterialId);
      if (!material) { event.preventDefault(); return; }
      material.title = title;
      material.kind = $("#materialKind").value;
    } else {
      state.materials.unshift({ id: crypto.randomUUID(), title, kind: $("#materialKind").value, notes: [] });
    }
    saveState(); renderMaterials();
  });
  $("#noteForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const text = $("#materialNote").value.trim(); if (!text || !activeMaterialId) { event.preventDefault(); return; }
    const material = state.materials.find((item) => item.id === activeMaterialId); if (!material) { event.preventDefault(); return; }
    material.notes = material.notes || [];
    if (editingNoteId) {
      const note = material.notes.find((item) => item.id === editingNoteId);
      if (!note) { event.preventDefault(); return; }
      note.text = text;
      note.date = new Date().toISOString();
    } else {
      material.notes.unshift({ id: crypto.randomUUID(), text, date: new Date().toISOString() });
    }
    saveState(); renderMaterials();
  });
  $("#momentForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const text = $("#momentText").value.trim(); if (!text) { event.preventDefault(); return; }
    state.moments.unshift({ id: crypto.randomUUID(), materialId: $("#momentMaterial").value || null, text, date: new Date().toISOString() });
    saveState();
  });
  $("#microMomentForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const moment = state.moments.find((item) => item.id === activeMicroMomentId);
    if (!moment) return;
    moment.detail = $("#microMomentDetail").value.trim();
    moment.reflection = $("#microMomentReflection").value.trim();
    moment.text = moment.reflection || moment.actionText;
    saveState();
  });
  $("#microActionForm").addEventListener("submit", (event) => {
    if (event.submitter?.value === "cancel") return;
    const text = $("#microActionText").value.trim(); if (!text) { event.preventDefault(); return; }
    if (editingMicroActionId) {
      const action = state.micro.customActions.find((item) => item.id === editingMicroActionId);
      if (!action) { event.preventDefault(); return; }
      action.text = text;
      action.category = $("#microActionCategory").value;
    } else {
      state.micro.customActions.unshift({ id: crypto.randomUUID(), text, category: $("#microActionCategory").value, custom: true });
      state.micro.deck = [];
    }
    saveState(); renderMicroGlow();
  });
  $("#resetButton").addEventListener("click", () => {
    const syncing = isSyncConfigured() && cloudSession?.access_token && cloudUser;
    const warning = syncing
      ? "确定清除这个账号的所有记录吗？同步后，手机和电脑上的记录都会消失，此操作无法撤销。"
      : "确定清除这台设备上的所有复盘与行动记录吗？此操作无法撤销。";
    if (confirm(warning)) { state = structuredClone(defaultState); saveState(); refreshAll(); }
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
  initSync();
  setInterval(checkDueReminder, 60000);
  iconRefresh();
}

document.addEventListener("DOMContentLoaded", init);
