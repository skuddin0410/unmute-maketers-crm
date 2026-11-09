/* Marketers Unmuted CRM — Phase 1 demo app (no build step). */
(function () {
  "use strict";
  const S = MU.SCHEMA;
  const KEY = "mu-crm-demo-v2";
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const localISO = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const uid = (p) => p + "_" + Math.random().toString(36).slice(2, 9);

  /* ---------- Store ---------- */
  let db;
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) { db = JSON.parse(raw); return; } } catch (e) { /* storage unavailable */ }
    db = MU.buildDemo();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* ignore */ } }
  load();

  /* ---------- Dates & formatting ---------- */
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const daysFrom = (s) => Math.round((new Date(String(s).slice(0, 10) + "T00:00:00") - today()) / 864e5);
  const fmtDate = (s) => s ? new Date(String(s).length > 10 ? s : s + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" }) : "—";
  const fmtTime = (s) => new Date(s).toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });
  const rel = (s) => { const d = daysFrom(s); return d === 0 ? "Today" : d === 1 ? "Tomorrow" : d === -1 ? "Yesterday" : d < 0 ? Math.abs(d) + " days ago" : "In " + d + " days"; };
  const money = (n) => "$" + Number(n || 0).toLocaleString("en-CA");
  const scoreCls = (n) => n == null ? "lo" : n >= 75 ? "hi" : n >= 60 ? "mid" : "lo";
  const stageName = (col, id) => ((S[col].stages || []).find((s) => s.id === id) || { name: id || "—" }).name;

  /* ---------- Icons ---------- */
  const ICON = {
    dashboard: '<path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 4v3h6V4z"/>',
    leads: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.6c1.8.7 3 2.6 3.5 5.4"/>',
    guests: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
    followups: '<path d="M8 3v3M16 3v3"/><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="m8.5 13.5 2.5 2.5 4.5-5"/>',
    partners: '<path d="M7 11 3 7l4-4M17 13l4 4-4 4"/><path d="M3 7h11a4 4 0 0 1 4 4M21 17H10a4 4 0 0 1-4-4"/>',
    deals: '<path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3S9.5 10.5 12 11s4.5 1.3 4.5 3.2-2 3.3-4.5 3.3-4.5-1.3-4.5-3"/>',
    content: '<path d="M5 4h11l3 3v13H5z"/><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
    community: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5s1.2 1.8 3.5 1.8 3.5-1.8 3.5-1.8M9 9.5h.01M15 9.5h.01"/>',
    team: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2L5 5.9l-2 3.4 2 1.5a7 7 0 0 0 0 2.4l-2 1.5 2 3.4 2.4-.9a7 7 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>'
  };
  const icon = (k, s) => '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[k] + "</svg>";

  /* ---------- Navigation ---------- */
  const NAV = [
    { group: "Overview", items: [{ id: "dashboard", label: "Dashboard" }] },
    { group: "Guest pipeline", items: [{ id: "leads", label: "Leads" }, { id: "guests", label: "Guests & episodes" }, { id: "followups", label: "Follow-ups" }] },
    { group: "Growth", items: [{ id: "partners", label: "Partnerships" }, { id: "deals", label: "Sponsors & deals" }] },
    { group: "Audience", items: [{ id: "content", label: "Content" }, { id: "community", label: "Community" }] },
    { group: "Admin", items: [{ id: "team", label: "Team & setup" }] }
  ];
  function dueCount() { return db.followups.filter((f) => !f.done && daysFrom(f.due) <= 0).length; }
  function renderNav(active) {
    const counts = { leads: db.leads.length, guests: db.guests.filter((g) => g.stage !== "shared").length, followups: dueCount() };
    $("#nav").innerHTML = NAV.map((g) => '<div class="nav-group"><h2>' + g.group + "</h2>" + g.items.map((it) => {
      const c = counts[it.id];
      const badge = c ? '<span class="nav-count' + (it.id === "followups" ? " alert" : "") + '">' + c + "</span>" : "";
      return '<a class="nav-link" href="#' + it.id + '"' + (active === it.id ? ' aria-current="page"' : "") + ">" + icon(it.id) + "<span>" + it.label + "</span>" + badge + "</a>";
    }).join("") + "</div>").join("");
  }

  /* ---------- Shared UI ---------- */
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2400); }
  function pageHead(title, sub, actions) {
    return '<div class="page-head"><div><h1>' + title + "</h1>" + (sub ? "<p>" + sub + "</p>" : "") + '</div><div class="page-actions">' + (actions || "") + "</div></div>";
  }
  const stagePill = (col, st) => {
    const cls = { invited: "navy", ready: "lime", published: "ok", shared: "ok", won: "ok", partner: "ok", lost: "red", booked: "lime", selected: "ok", scheduled: "lime" }[st] || "";
    return '<span class="pill ' + cls + '">' + esc(stageName(col, st)) + "</span>";
  };

  /* ---------- Board (kanban) ---------- */
  function board(col, items, cardFn, opts) {
    opts = opts || {};
    return '<div class="board" data-col="' + col + '">' + S[col].stages.map((st) => {
      const list = items.filter((i) => i.stage === st.id);
      const extra = opts.colExtra ? opts.colExtra(list) : "";
      return '<section class="col" data-stage="' + st.id + '" aria-label="' + esc(st.name) + '"><div class="col-head"><div><b>' + esc(st.name) + "</b>" + (st.hint ? "<small>" + esc(st.hint) + "</small>" : "") + extra + '</div><span class="pill">' + list.length + "</span></div>" +
        (list.length ? list.map((i) => '<button class="card" draggable="true" data-id="' + i.id + '">' + cardFn(i) + "</button>").join("") : '<div class="col-empty">Nothing here yet</div>') + "</section>";
    }).join("") + "</div>";
  }
  function wireBoard(col) {
    const root = $('.board[data-col="' + col + '"]'); if (!root) return;
    let dragId = null;
    $$(".card", root).forEach((c) => {
      c.addEventListener("click", () => openRecord(col, c.dataset.id));
      c.addEventListener("dragstart", (e) => { dragId = c.dataset.id; c.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; });
      c.addEventListener("dragend", () => c.classList.remove("dragging"));
    });
    $$(".col", root).forEach((colEl) => {
      colEl.addEventListener("dragover", (e) => { e.preventDefault(); colEl.classList.add("drop"); });
      colEl.addEventListener("dragleave", () => colEl.classList.remove("drop"));
      colEl.addEventListener("drop", (e) => { e.preventDefault(); colEl.classList.remove("drop"); if (dragId) setStage(col, dragId, colEl.dataset.stage); });
    });
  }
  function setStage(col, id, stage) {
    const rec = db[col].find((r) => r.id === id); if (!rec || rec.stage === stage) return;
    rec.stage = stage;
    if (col === "guests" && stage === "recorded") scheduleFollowups(rec);
    save(); toast((rec.name || rec.org || rec.company || rec.title) + " moved to " + stageName(col, stage)); render();
  }
  function scheduleFollowups(g) {
    if (db.followups.some((f) => f.guestId === g.id)) return;
    const base = new Date(g.recordAt || Date.now()); base.setHours(0, 0, 0, 0);
    const d = (n) => localISO(new Date(base.getTime() + n * 864e5));
    [["Day 1 thank-you + share kit", 1, "Claude"], ["Day 14 VIP invite", 14, "Claude"], ["Day 30 partnership chat", 30, "Raoof"]].forEach(([kind, n, owner]) =>
      db.followups.push({ id: uid("fu"), guestId: g.id, who: g.name, company: g.company, kind, due: d(n), owner, done: false }));
    toast("Day 1, 14 and 30 follow-ups scheduled for " + g.name);
  }

  function confirmBox(msg, okLabel, onOk) {
    const m = $("#modal");
    m.innerHTML = '<form method="dialog"><h2>Are you sure?</h2><p>' + esc(msg) + '</p><div class="modal-actions"><button class="btn" type="button" id="cNo">Cancel</button><button class="btn primary" type="button" id="cYes">' + esc(okLabel) + "</button></div></form>";
    m.showModal();
    $("#cNo").addEventListener("click", () => m.close());
    $("#cYes").addEventListener("click", () => { m.close(); onOk(); });
  }

  /* ---------- Views ---------- */
  const views = {};

  views.dashboard = function () {
    const todays = db.guests.filter((g) => g.stage === "booked" && daysFrom(g.recordAt) === 0).sort((a, b) => a.recordAt.localeCompare(b.recordAt));
    const slots = todays.slice(0, 4).map((g) => '<button class="slot" data-open="guests:' + g.id + '"><time>' + fmtTime(g.recordAt) + "</time><strong>" + esc(g.name) + "</strong><span>" + esc(g.title) + ", " + esc(g.company) + "</span><span>" + esc(g.series) + " · " + esc(g.format) + "</span></button>").join("");
    const pad = Array.from({ length: Math.max(0, 4 - todays.length) }, () => '<div class="slot empty"><time>Open slot</time><strong>No guest booked</strong><span>Book from Leads</span></div>').join("");

    const recorded = db.guests.filter((g) => ["recorded", "editing", "published", "shared"].includes(g.stage)).length;
    const pub = db.guests.filter((g) => ["published", "shared"].includes(g.stage));
    const shareRate = pub.length ? Math.round(100 * pub.filter((g) => g.stage === "shared").length / pub.length) : 0;
    const vals = { episodes: recorded, shareRate, subs: db.newsletterSubs, coffee: db.coffee.length, partnerships: db.partners.filter((p) => p.region === "Canada" && p.stage !== "research").length };
    const goals = MU.GOALS.map((g) => {
      const v = vals[g.key]; const pct = Math.min(100, Math.round(100 * v / g.target));
      return '<div class="goal"><b>' + g.label + '</b><span class="num">' + v + (g.unit || "") + ' <span class="muted">/ ' + g.target + (g.unit || "") + '</span></span><div class="bar"><i class="' + (pct >= 100 ? "hit" : "") + '" style="width:' + pct + '%"></i></div><small>' + g.note + "</small></div>";
    }).join("");

    const max = Math.max(1, ...S.leads.stages.map((s) => db.leads.filter((l) => l.stage === s.id).length));
    const funnel = S.leads.stages.map((s) => { const c = db.leads.filter((l) => l.stage === s.id).length; return '<button class="funnel-row" data-go="leads"><span>' + s.name + '</span><span class="fbar"><i style="width:' + (100 * c / max) + '%"></i></span><b>' + c + "</b></button>"; }).join("");

    const due = db.followups.filter((f) => !f.done && daysFrom(f.due) <= 0).sort((a, b) => a.due.localeCompare(b.due)).slice(0, 6);
    const dueList = due.length ? '<ul class="list">' + due.map((f) => '<li><span class="grow"><strong>' + esc(f.kind) + "</strong><span>" + esc(f.who) + " · " + esc(f.company || "") + "</span></span>" + (daysFrom(f.due) < 0 ? '<span class="pill red">' + rel(f.due) + "</span>" : '<span class="pill lime">Today</span>') + "</li>").join("") + "</ul>" : '<p class="muted">Nothing due. Nice.</p>';

    const open = db.deals.filter((d) => !["won", "lost"].includes(d.stage));
    const pipeline = open.reduce((s, d) => s + Number(d.value || 0), 0);
    const nextPartner = db.partners.filter((p) => p.region === "Canada").sort((a, b) => a.nextDate.localeCompare(b.nextDate)).slice(0, 3);

    return pageHead("Good day, Raoof", "Here's the studio, the pipeline and what needs you today.") +
      '<section class="studio"><div class="studio-head"><span class="on-air"><i></i>ON AIR TODAY</span><h2>' + todays.length + " recording" + (todays.length === 1 ? "" : "s") + ' scheduled</h2><span class="muted">' + new Date().toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" }) + '</span></div><div class="slots">' + slots + pad + "</div></section>" +
      '<div class="grid-2"><div class="stack">' +
      '<div class="panel"><div class="panel-head"><h2>Due follow-ups</h2><a href="#followups">All follow-ups</a></div>' + dueList + "</div>" +
      '<div class="panel"><div class="panel-head"><h2>Lead funnel</h2><a href="#leads">Open leads</a></div><div class="funnel">' + funnel + "</div></div>" +
      '</div><div class="stack">' +
      '<div class="panel"><div class="panel-head"><h2>6-month goals</h2></div>' + goals + "</div>" +
      '<div class="panel"><div class="panel-head"><h2>Partnerships: Canada first</h2><a href="#partners">All</a></div><ul class="list">' + nextPartner.map((p) => '<li><span class="grow"><strong>' + esc(p.org) + "</strong><span>" + esc(p.nextStep) + " · " + fmtDate(p.nextDate) + "</span></span>" + stagePill("partners", p.stage) + "</li>").join("") + "</ul></div>" +
      '<div class="panel"><div class="panel-head"><h2>Sponsor pipeline</h2><a href="#deals">Deals</a></div><div class="stat-row" style="grid-template-columns:1fr 1fr;margin:0"><div class="stat"><span>Open value</span><b>' + money(pipeline) + '</b></div><div class="stat"><span>Open deals</span><b>' + open.length + "</b></div></div></div>" +
      "</div></div>";
  };
  views.dashboard.after = function () {
    $$("[data-open]").forEach((b) => b.addEventListener("click", () => { const [c, i] = b.dataset.open.split(":"); openRecord(c, i); }));
    $$("[data-go]").forEach((b) => b.addEventListener("click", () => { location.hash = "#" + b.dataset.go; }));
  };

  /* Leads */
  const leadUI = { mode: "board", q: "", region: "", level: "", source: "" };
  views.leads = function () {
    const f = leadUI;
    const items = db.leads.filter((l) => (!f.q || (l.name + " " + l.company + " " + l.title + " " + l.city).toLowerCase().includes(f.q.toLowerCase())) && (!f.region || l.region === f.region) && (!f.level || l.level === f.level) && (!f.source || l.source === f.source));
    const opt = (arr, cur, label) => '<option value="">' + label + "</option>" + arr.map((o) => "<option" + (o === cur ? " selected" : "") + ">" + esc(o) + "</option>").join("");
    const fld = (k) => S.leads.fields.find((x) => x.key === k).options;
    const toolbar = '<div class="toolbar"><input type="search" id="lq" placeholder="Filter by name, company, city" value="' + esc(f.q) + '"><select id="lregion">' + opt(fld("region"), f.region, "All regions") + '</select><select id="llevel">' + opt(fld("level"), f.level, "All levels") + '</select><select id="lsource">' + opt(fld("source"), f.source, "All sources") + '</select><span class="result-count">' + items.length + ' leads</span><div class="seg" role="group" aria-label="View"><button data-mode="board" aria-pressed="' + (f.mode === "board") + '">Board</button><button data-mode="table" aria-pressed="' + (f.mode === "table") + '">Table</button></div></div>';
    const card = (l) => "<strong>" + esc(l.name) + '</strong><span class="sub">' + esc(l.title) + ", " + esc(l.company) + '</span><div class="meta"><span class="pill">' + esc(l.level) + '</span><span class="pill">' + esc(l.city) + "</span>" + (l.fit != null ? '<span class="score ' + scoreCls(l.fit) + '">Fit ' + l.fit + "</span>" : "") + "</div>";
    const table = '<div class="table-wrap"><table><thead><tr><th>Name</th><th>Company</th><th>Level</th><th>Region</th><th>Source</th><th class="num">Fit</th><th>Sponsor</th><th>Email</th><th>Stage</th></tr></thead><tbody>' +
      items.map((l) => '<tr data-id="' + l.id + '"><td><strong>' + esc(l.name) + '</strong><span class="sub">' + esc(l.title) + "</span></td><td>" + esc(l.company) + '<span class="sub">' + esc(l.industry || "") + "</span></td><td>" + esc(l.level) + "</td><td>" + esc(l.city) + '<span class="sub">' + esc(l.region) + "</span></td><td>" + esc(l.source) + '</td><td class="num"><span class="score ' + scoreCls(l.fit) + '">' + (l.fit ?? "—") + "</span></td><td>" + esc(l.sponsor || "—") + "</td><td>" + (l.email ? esc(l.email) : '<span class="muted">Not enriched</span>') + "</td><td>" + stagePill("leads", l.stage) + "</td></tr>").join("") +
      "</tbody></table>" + (items.length ? "" : '<div class="empty-state"><strong>No leads match these filters</strong>Clear a filter or import a CSV.</div>') + "</div>";
    return pageHead("Leads", "Marketers we could feature. Mine, analyze, enrich, then pick who to invite.", '<button class="btn" id="importCsv">Import CSV</button><button class="btn primary" data-add="leads">Add lead</button>') + toolbar + (f.mode === "board" ? board("leads", items, card) : table);
  };
  views.leads.after = function () {
    const rerender = () => { render(); const el = $("#lq"); if (el && document.activeElement !== el && leadUI._focus) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
    $("#lq").addEventListener("input", (e) => { leadUI.q = e.target.value; leadUI._focus = true; rerender(); });
    ["region", "level", "source"].forEach((k) => $("#l" + k).addEventListener("change", (e) => { leadUI[k] = e.target.value; leadUI._focus = false; render(); }));
    $$(".seg button").forEach((b) => b.addEventListener("click", () => { leadUI.mode = b.dataset.mode; render(); }));
    $$("tbody tr").forEach((r) => r.addEventListener("click", () => openRecord("leads", r.dataset.id)));
    $("#importCsv").addEventListener("click", openImport);
    wireBoard("leads");
  };

  /* Guests */
  const guestUI = { mode: "board" };
  views.guests = function () {
    const upcoming = db.guests.filter((g) => g.stage === "booked").sort((a, b) => a.recordAt.localeCompare(b.recordAt));
    const card = (g) => "<strong>" + esc(g.name) + '</strong><span class="sub">' + esc(g.title) + ", " + esc(g.company) + '</span><div class="meta"><span class="pill">' + esc(g.series) + '</span><span class="pill">' + (g.stage === "booked" ? fmtDate(g.recordAt) + " " + fmtTime(g.recordAt) : esc(g.format)) + "</span></div>";
    const table = '<div class="table-wrap"><table><thead><tr><th>Guest</th><th>Series</th><th>Recording</th><th>Format</th><th>Episode</th><th>Stage</th></tr></thead><tbody>' +
      db.guests.slice().sort((a, b) => b.recordAt.localeCompare(a.recordAt)).map((g) => '<tr data-id="' + g.id + '"><td><strong>' + esc(g.name) + '</strong><span class="sub">' + esc(g.title) + ", " + esc(g.company) + "</span></td><td>" + esc(g.series) + "</td><td>" + fmtDate(g.recordAt) + '<span class="sub">' + fmtTime(g.recordAt) + "</span></td><td>" + esc(g.format) + "</td><td>" + (g.episode ? esc(g.episode) : '<span class="muted">Not recorded yet</span>') + "</td><td>" + stagePill("guests", g.stage) + "</td></tr>").join("") + "</tbody></table></div>";
    return pageHead("Guests & episodes", "Every guest from booking to shared. Moving a guest to Recorded schedules their Day 1, 14 and 30 follow-ups.", '<button class="btn primary" data-add="guests">Book a guest</button>') +
      '<div class="stat-row"><div class="stat"><span>Booked this week</span><b>' + upcoming.filter((g) => daysFrom(g.recordAt) < 7).length + '</b></div><div class="stat"><span>In editing</span><b>' + db.guests.filter((g) => g.stage === "editing").length + '</b></div><div class="stat"><span>Published</span><b>' + db.guests.filter((g) => ["published", "shared"].includes(g.stage)).length + '</b></div><div class="stat"><span>Shared by guest</span><b>' + db.guests.filter((g) => g.stage === "shared").length + "</b></div></div>" +
      '<div class="toolbar"><div class="seg" role="group" aria-label="View"><button data-mode="board" aria-pressed="' + (guestUI.mode === "board") + '">Board</button><button data-mode="table" aria-pressed="' + (guestUI.mode === "table") + '">Table</button></div></div>' +
      (guestUI.mode === "board" ? board("guests", db.guests, card) : table);
  };
  views.guests.after = function () {
    $$(".seg button").forEach((b) => b.addEventListener("click", () => { guestUI.mode = b.dataset.mode; render(); }));
    $$("tbody tr").forEach((r) => r.addEventListener("click", () => openRecord("guests", r.dataset.id)));
    wireBoard("guests");
  };

  /* Follow-ups */
  views.followups = function () {
    const open = db.followups.filter((f) => !f.done).sort((a, b) => a.due.localeCompare(b.due));
    const groups = [
      ["Overdue", open.filter((f) => daysFrom(f.due) < 0), "red"],
      ["Today", open.filter((f) => daysFrom(f.due) === 0), "lime"],
      ["Next 7 days", open.filter((f) => daysFrom(f.due) > 0 && daysFrom(f.due) <= 7), ""],
      ["Later", open.filter((f) => daysFrom(f.due) > 7), ""],
      ["Done recently", db.followups.filter((f) => f.done).slice(-6).reverse(), "ok"]
    ];
    const item = (f) => '<div class="fu-item' + (f.done ? " done" : "") + '"><input type="checkbox" data-fu="' + f.id + '"' + (f.done ? " checked" : "") + ' aria-label="Mark ' + esc(f.kind) + " for " + esc(f.who) + ' done"><span class="grow"><strong>' + esc(f.kind) + "</strong><span>" + esc(f.who) + (f.company ? " · " + esc(f.company) : "") + '</span></span><span class="pill">' + esc(f.owner) + '</span><span class="muted">' + fmtDate(f.due) + "</span></div>";
    return pageHead("Follow-ups", "The relationship journey on autopilot: thank-you on Day 1, VIP invite on Day 14, partnership chat from Day 30.", '<button class="btn primary" data-add="followups">Add follow-up</button>') +
      groups.filter((g) => g[1].length).map(([t, list, cls]) => '<div class="fu-group"><h2>' + t + ' <span class="pill ' + cls + '">' + list.length + "</span></h2>" + list.map(item).join("") + "</div>").join("");
  };
  views.followups.after = function () {
    $$("[data-fu]").forEach((c) => c.addEventListener("change", () => { const f = db.followups.find((x) => x.id === c.dataset.fu); f.done = c.checked; save(); toast(c.checked ? "Marked done" : "Reopened"); render(); }));
  };

  /* Partnerships */
  const partnerUI = { mode: "regions" };
  views.partners = function () {
    const order = [["Canada", "Now"], ["United States", "Phase 1: after AMA Toronto"], ["Europe", "Phase 2"], ["Middle East & Africa", "Phase 2"], ["Asia-Pacific", "Phase 2"]];
    const regionsHTML = order.map(([r, phase]) => {
      const list = db.partners.filter((p) => p.region === r); if (!list.length) return "";
      return '<section class="region"><div class="region-head"><h2>' + r + '</h2><span class="pill' + (phase === "Now" ? " lime" : "") + '">' + phase + '</span></div><div class="table-wrap"><table><thead><tr><th>Association</th><th>Our offer</th><th>Next step</th><th>When</th><th>Stage</th></tr></thead><tbody>' +
        list.map((p) => '<tr data-id="' + p.id + '"><td><strong>' + esc(p.org) + '</strong><span class="sub">' + esc(p.city) + " · " + esc(p.contactRole) + "</span></td><td>" + esc(p.offer) + "</td><td>" + esc(p.nextStep) + "</td><td>" + fmtDate(p.nextDate) + "</td><td>" + stagePill("partners", p.stage) + "</td></tr>").join("") + "</tbody></table></div></section>";
    }).join("");
    const card = (p) => "<strong>" + esc(p.org) + '</strong><span class="sub">' + esc(p.nextStep) + '</span><div class="meta"><span class="pill">' + esc(p.region) + "</span></div>";
    return pageHead("Partnerships", "Associations as partners, never competitors. Our offer: we help you show off your members, for free.", '<button class="btn primary" data-add="partners">Add association</button>') +
      '<div class="toolbar"><div class="seg" role="group" aria-label="View"><button data-mode="regions" aria-pressed="' + (partnerUI.mode === "regions") + '">By region</button><button data-mode="board" aria-pressed="' + (partnerUI.mode === "board") + '">Board</button></div></div>' +
      (partnerUI.mode === "board" ? board("partners", db.partners, card) : regionsHTML);
  };
  views.partners.after = function () {
    $$(".seg button").forEach((b) => b.addEventListener("click", () => { partnerUI.mode = b.dataset.mode; render(); }));
    $$("tbody tr").forEach((r) => r.addEventListener("click", () => openRecord("partners", r.dataset.id)));
    wireBoard("partners");
  };

  /* Deals */
  views.deals = function () {
    const card = (d) => "<strong>" + esc(d.company) + '</strong><span class="sub">' + esc(d.product) + '</span><div class="meta"><span class="score hi">' + money(d.value) + "</span>" + (d.fromGuest ? '<span class="pill lime">From a guest</span>' : "") + "</div>";
    const won = db.deals.filter((d) => d.stage === "won").reduce((s, d) => s + Number(d.value), 0);
    const open = db.deals.filter((d) => !["won", "lost"].includes(d.stage));
    const warm = db.deals.filter((d) => d.fromGuest).length;
    return pageHead("Sponsors & deals", "Partnership conversations with people who already know us. Never pitched on recording day.", '<button class="btn primary" data-add="deals">Add deal</button>') +
      '<div class="stat-row"><div class="stat"><span>Open pipeline</span><b>' + money(open.reduce((s, d) => s + Number(d.value), 0)) + '</b></div><div class="stat"><span>Won</span><b>' + money(won) + '</b></div><div class="stat"><span>Open deals</span><b>' + open.length + '</b></div><div class="stat"><span>Started from a guest</span><b>' + warm + " of " + db.deals.length + "</b></div></div>" +
      board("deals", db.deals, card, { colExtra: (list) => "<small>" + money(list.reduce((s, d) => s + Number(d.value || 0), 0)) + "</small>" });
  };
  views.deals.after = function () { wireBoard("deals"); };

  /* Content */
  const contentUI = { type: "" };
  views.content = function () {
    const types = S.content.fields.find((f) => f.key === "type").options;
    const list = db.content.filter((c) => !contentUI.type || c.type === contentUI.type).sort((a, b) => a.date.localeCompare(b.date));
    return pageHead("Content", "Weekly rhythm: Marketer and Question of the Week on Monday, People Moves on Wednesday, the Unmuted Brief on Thursday.", '<button class="btn primary" data-add="content">Add content</button>') +
      '<div class="toolbar"><select id="ctype"><option value="">All types</option>' + types.map((t) => "<option" + (t === contentUI.type ? " selected" : "") + ">" + esc(t) + "</option>").join("") + '</select><span class="result-count">' + list.length + " items</span></div>" +
      '<div class="table-wrap"><table><thead><tr><th>Title</th><th>Type</th><th>Publish</th><th>Owner</th><th>Status</th></tr></thead><tbody>' +
      list.map((c) => '<tr data-id="' + c.id + '"><td><strong>' + esc(c.title) + "</strong></td><td>" + esc(c.type) + "</td><td>" + fmtDate(c.date) + '<span class="sub">' + rel(c.date) + "</span></td><td>" + esc(c.owner) + "</td><td>" + stagePill("content", c.stage) + "</td></tr>").join("") + "</tbody></table></div>";
  };
  views.content.after = function () {
    $("#ctype").addEventListener("change", (e) => { contentUI.type = e.target.value; render(); });
    $$("tbody tr").forEach((r) => r.addEventListener("click", () => openRecord("content", r.dataset.id)));
  };

  /* Community */
  views.community = function () {
    const coffee = '<div class="panel"><div class="panel-head"><h2>Coffee Match</h2><span class="muted">Monthly 20-minute chats</span></div><ul class="list">' + db.coffee.map((c) => '<li><span class="grow"><strong>' + esc(c.a) + " + " + esc(c.b) + "</strong><span>" + esc(c.match) + '</span></span><span class="pill' + (c.status === "Met" ? " ok" : "") + '">' + esc(c.status) + "</span></li>").join("") + "</ul></div>";
    const noms = '<div class="panel"><div class="panel-head"><h2>Top 100 Canada nominations</h2><button class="btn small" data-add="nominations">Add nomination</button></div><p class="muted" style="margin-top:-6px">Merit only. Nominations open January 2027, list published June 2027.</p><ul class="list">' + db.nominations.map((n) => '<li data-nom="' + n.id + '" style="cursor:pointer"><span class="grow"><strong>' + esc(n.name) + "</strong><span>" + esc(n.company) + " · " + esc(n.category) + "</span></span>" + stagePill("nominations", n.stage) + "</li>").join("") + "</ul></div>";
    const events = '<div class="panel"><div class="panel-head"><h2>Events</h2><button class="btn small" data-add="events">Add event</button></div><ul class="list">' + db.events.slice().sort((a, b) => a.date.localeCompare(b.date)).map((e) => '<li><span class="grow"><strong>' + esc(e.title) + "</strong><span>" + esc(e.type) + " · " + esc(e.city) + " · " + fmtDate(e.date) + '</span></span><span class="muted">' + (e.rsvps || 0) + " / " + esc(e.capacity) + "</span></li>").join("") + "</ul></div>";
    return pageHead("Community", "Ways marketers meet each other: Coffee Match, events, Top 100, and the 2027 members' space.") +
      '<div class="stat-row"><div class="stat"><span>Community waitlist</span><b>' + db.waitlist + '</b></div><div class="stat"><span>Coffee Match pairs</span><b>' + db.coffee.length + '</b></div><div class="stat"><span>Top 100 nominations</span><b>' + db.nominations.length + '</b></div><div class="stat"><span>Upcoming events</span><b>' + db.events.filter((e) => daysFrom(e.date) >= 0).length + "</b></div></div>" +
      '<div class="grid-2"><div class="stack">' + noms + '</div><div class="stack">' + events + coffee + "</div></div>";
  };
  views.community.after = function () { $$("[data-nom]").forEach((li) => li.addEventListener("click", () => openRecord("nominations", li.dataset.nom))); };

  /* Settings */
  views.team = function () {
    const team = [["Raoof", "Runs the CRM, guest booking, sales follow-up", "Owner"], ["SK", "Host and partnerships, face of the brand", "Host"], ["Podcast editing team", "Recording, editing, publishing", "Team"], ["Magazine design team", "Covers, templates, share kits", "Team"], ["Claude", "Lead analysis, drafts, show notes, newsletter, follow-ups", "Assistant"]];
    const phases = [["Phase 1", "Demo CRM: design, menus and categories with sample data", "Now"], ["Phase 2", "Supabase database, real logins, hosted on Netlify", "Next"], ["Phase 3", "Live leads and the full guest flow", "Later"]];
    return pageHead("Team & setup", "Who does what, and where this build is headed.") +
      '<div class="grid-2"><div class="panel"><h2>Team</h2><ul class="list">' + team.map(([n, r, t]) => '<li><span class="grow"><strong>' + n + "</strong><span>" + r + '</span></span><span class="pill' + (t === "Assistant" ? " lime" : "") + '">' + t + "</span></li>").join("") + "</ul></div>" +
      '<div class="stack"><div class="panel"><h2>Build phases</h2><ul class="list">' + phases.map(([p, d, s]) => '<li><span class="grow"><strong>' + p + "</strong><span>" + d + '</span></span><span class="pill' + (s === "Now" ? " lime" : "") + '">' + s + "</span></li>").join("") + "</ul></div>" +
      '<div class="panel"><h2>Our rules</h2><ul class="list"><li>Nobody pays to be featured.</li><li>Top 100 is merit-only.</li><li>No selling on recording day.</li><li>Sponsored content is always labelled.</li><li>We partner with associations; we never compete.</li><li>Every guest is a VIP.</li></ul></div>' +
      '<div class="panel"><h2>Demo data</h2><p class="muted">Changes you make are saved in this browser only.</p><button class="btn" id="resetDemo2">Reset demo data</button></div></div></div>';
  };
  views.team.after = function () { $("#resetDemo2").addEventListener("click", resetDemo); };

  /* ---------- Record drawer ---------- */
  function titleOf(col, r) { return r.name || r.org || r.company || r.title || r.who; }
  function subOf(col, r) {
    if (col === "leads" || col === "guests") return r.title + ", " + r.company;
    if (col === "partners") return r.region + " · " + r.city;
    if (col === "deals") return r.product + " · " + money(r.value);
    if (col === "content") return r.type;
    if (col === "nominations") return r.company + " · " + r.category;
    return "";
  }
  function openRecord(col, id) {
    const r = db[col].find((x) => x.id === id); if (!r) return;
    const sch = S[col];
    const stages = sch.stages ? '<div class="stagebar" role="group" aria-label="Stage">' + sch.stages.map((s, i) => {
      const cur = sch.stages.findIndex((x) => x.id === r.stage);
      return '<button data-stage="' + s.id + '" class="' + (i < cur ? "past" : i === cur ? "now" : "") + '" title="Move to ' + esc(s.name) + '">' + esc(s.name) + "</button>";
    }).join("") + "</div>" : "";
    const fields = '<dl class="fields">' + sch.fields.map((f) => {
      let v = r[f.key];
      if (f.type === "datetime-local" && v) v = fmtDate(v) + ", " + fmtTime(v);
      else if (f.type === "date" && v) v = fmtDate(v);
      else if (f.key === "value") v = money(v);
      return "<dt>" + f.label + "</dt><dd>" + (v === "" || v == null ? '<span class="muted">—</span>' : esc(v)) + "</dd>";
    }).join("") + "</dl>";
    let actions = "";
    if (col === "leads") actions += '<button class="btn primary" id="toGuest">Book as guest</button>';
    if (col === "guests") actions += '<button class="btn" id="fuSched">Schedule follow-ups</button>';
    const assist = col === "leads" ? '<h3>Claude will do this</h3><div class="ai-box">In Phase 3, I score <b>fit</b> and <b>sponsor potential</b>, find the email from your Apollo/Seamless export, and draft a personal invite you approve.</div>' :
      col === "guests" ? '<h3>Claude will do this</h3><div class="ai-box">Before recording: a one-page guest brief for SK. After: titles, show notes, 3–5 clip picks, quote cards in Canva and the guest share kit.</div>' : "";
    const notes = '<h3>Notes</h3>' + (r.notes && r.notes.length ? r.notes.map((n) => '<div class="note">' + esc(n.text) + "<small>" + new Date(n.at).toLocaleString("en-CA") + "</small></div>").join("") : '<p class="muted">No notes yet.</p>') +
      '<form class="note-form" id="noteForm"><label for="noteText" class="muted" style="font-size:13px">Add a note</label><textarea id="noteText" placeholder="What happened, what\'s next"></textarea><button class="btn small" type="submit">Save note</button></form>';
    const d = $("#drawer");
    d.innerHTML = '<div class="drawer-head"><div><h2>' + esc(titleOf(col, r)) + "</h2><p>" + esc(subOf(col, r)) + '</p></div><button class="icon-btn" id="closeDrawer" aria-label="Close">' + icon("close") + "</button></div>" + stages + fields +
      '<div class="drawer-actions">' + actions + '<button class="btn" id="editRec">Edit</button><button class="btn ghost" id="delRec">Delete</button></div>' + assist + notes;
    d.classList.add("open"); d.setAttribute("aria-hidden", "false"); $("#scrim").hidden = false;
    $("#closeDrawer").focus();
    $("#closeDrawer").addEventListener("click", closeDrawer);
    $$(".stagebar button", d).forEach((b) => b.addEventListener("click", () => { setStage(col, id, b.dataset.stage); openRecord(col, id); }));
    $("#editRec").addEventListener("click", () => openForm(col, r));
    $("#delRec").addEventListener("click", () => confirmBox("Delete " + titleOf(col, r) + "? This can't be undone.", "Delete", () => { db[col] = db[col].filter((x) => x.id !== id); save(); closeDrawer(); toast("Deleted"); render(); }));
    $("#noteForm").addEventListener("submit", (e) => { e.preventDefault(); const t = $("#noteText").value.trim(); if (!t) { $("#noteText").focus(); return; } (r.notes = r.notes || []).push({ text: t, at: Date.now() }); save(); openRecord(col, id); toast("Note saved"); });
    const tg = $("#toGuest"); if (tg) tg.addEventListener("click", () => { closeDrawer(); openForm("guests", { name: r.name, title: r.title, company: r.company, region: r.region, email: r.email, series: { CMO: "CMO Edition", Director: "Director Edition" }[r.level] || "Manager Edition", format: "Remote" }, () => { r.stage = "invited"; save(); }); });
    const fs = $("#fuSched"); if (fs) fs.addEventListener("click", () => { scheduleFollowups(r); save(); render(); });
  }
  function closeDrawer() { const d = $("#drawer"); d.classList.remove("open"); d.setAttribute("aria-hidden", "true"); $("#scrim").hidden = true; }

  /* ---------- Add / edit form ---------- */
  function openForm(col, rec, onCreate) {
    const sch = S[col]; const editing = rec && rec.id;
    const m = $("#modal");
    const input = (f) => {
      const v = rec ? rec[f.key] : "";
      const req = f.required ? " required" : "";
      const full = ["offer", "nextStep", "episode", "title", "linkedin"].includes(f.key) && col !== "leads" && col !== "guests" ? " full" : "";
      let ctl;
      if (f.type === "select") ctl = '<select name="' + f.key + '"' + req + '><option value=""></option>' + f.options.map((o) => "<option" + (o === v ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select>";
      else ctl = '<input name="' + f.key + '" type="' + (f.type || "text") + '" value="' + esc(v == null ? "" : v) + '"' + req + ">";
      return '<label class="' + full + '">' + f.label + (f.required ? " *" : "") + ctl + '<span class="err" data-err="' + f.key + '"></span></label>';
    };
    const stageSel = sch.stages ? '<label>Stage<select name="stage">' + sch.stages.map((s) => '<option value="' + s.id + '"' + ((rec && rec.stage) === s.id ? " selected" : "") + ">" + esc(s.name) + "</option>").join("") + "</select></label>" : "";
    m.innerHTML = '<form method="dialog" novalidate><h2>' + (editing ? "Edit " : "Add ") + sch.label.toLowerCase() + "</h2><p>" + (editing ? "Update the details and save." : "Fill in what you know. You can add the rest later.") + '</p><div class="form-grid">' + sch.fields.map(input).join("") + stageSel + '</div><div class="modal-actions"><button class="btn" value="cancel" type="button" id="cancelForm">Cancel</button><button class="btn primary" type="submit">' + (editing ? "Save changes" : "Add " + sch.label.toLowerCase()) + "</button></div></form>";
    m.showModal();
    $("#cancelForm").addEventListener("click", () => m.close());
    $("form", m).addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target); let ok = true; const out = {};
      sch.fields.forEach((f) => {
        let v = (fd.get(f.key) || "").toString().trim();
        const err = $('[data-err="' + f.key + '"]', m); err.textContent = "";
        if (f.required && !v) { err.textContent = f.label + " is required"; ok = false; }
        if (f.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { err.textContent = "Enter a valid email"; ok = false; }
        if (f.type === "number" && v !== "") v = Number(v);
        out[f.key] = v;
      });
      if (!ok) { const firstErr = $$(".err", m).find((x) => x.textContent); if (firstErr) firstErr.previousElementSibling.focus(); return; }
      if (sch.stages) out.stage = fd.get("stage");
      if (editing) { Object.assign(rec, out); toast("Saved"); }
      else {
        const nr = Object.assign({ id: uid(col.slice(0, 2)), notes: [], createdAt: new Date().toISOString().slice(0, 10) }, out);
        if (col === "followups") nr.done = false;
        if (col === "guests" && !nr.recordAt) nr.recordAt = localISO(new Date()) + "T10:00";
        if (col === "events") nr.rsvps = 0;
        db[col].push(nr); if (onCreate) onCreate(nr);
        toast(sch.label + " added");
      }
      save(); m.close(); render(); if (editing && $("#drawer").classList.contains("open")) openRecord(col, rec.id);
    });
  }

  /* ---------- CSV import ---------- */
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
      else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim()));
  }
  const ALIASES = {
    name: ["name", "full name", "fullname"], first: ["first name", "firstname"], last: ["last name", "lastname"],
    title: ["title", "job title", "position"], company: ["company", "company name", "organization", "account name"],
    email: ["email", "work email", "email address"], phone: ["phone", "mobile phone", "work direct phone", "corporate phone", "phone number"],
    city: ["city"], country: ["country"], linkedin: ["linkedin", "person linkedin url", "linkedin url"], industry: ["industry"]
  };
  function levelFromTitle(t) { t = (t || "").toLowerCase(); if (/chief|cmo|\bvp\b|vice president|head of/.test(t)) return "CMO"; if (/director/.test(t)) return "Director"; if (/manager|lead/.test(t)) return "Manager"; return "Executive"; }
  function regionFromCountry(c) { c = (c || "").toLowerCase(); if (!c || c.includes("canada")) return "Canada"; if (c.includes("united states") || c === "usa" || c === "us") return "United States"; if (/kingdom|germany|france|spain|ital|netherlands|ireland|sweden|europe/.test(c)) return "Europe"; if (/emirates|saudi|nigeria|kenya|south africa|egypt|qatar/.test(c)) return "Middle East & Africa"; return "Asia-Pacific"; }
  function openImport() {
    const m = $("#modal");
    m.innerHTML = '<form method="dialog"><h2>Import leads from CSV</h2><p>Works with Apollo and Seamless exports. Columns are matched by name: first/last name, title, company, email, phone, city, country, LinkedIn.</p><div class="dropzone"><strong>Choose a .csv file</strong><br><input type="file" id="csvFile" accept=".csv,text/csv"></div><div class="csv-preview" id="csvPreview"></div><div class="modal-actions"><button class="btn" type="button" id="cancelImp">Cancel</button><button class="btn primary" type="button" id="doImp" disabled>Import leads</button></div></form>';
    m.showModal();
    let parsed = [];
    $("#cancelImp").addEventListener("click", () => m.close());
    $("#csvFile").addEventListener("change", (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const rows = parseCSV(String(reader.result)); const head = (rows.shift() || []).map((h) => h.trim().toLowerCase());
        const idx = {}; Object.keys(ALIASES).forEach((k) => { idx[k] = head.findIndex((h) => ALIASES[k].includes(h)); });
        const get = (r, k) => idx[k] >= 0 ? (r[idx[k]] || "").trim() : "";
        const existing = new Set(db.leads.map((l) => (l.email || l.name + l.company).toLowerCase()));
        let dupes = 0;
        parsed = rows.map((r) => {
          const name = get(r, "name") || (get(r, "first") + " " + get(r, "last")).trim();
          const title = get(r, "title");
          const lead = { id: uid("ld"), name, title, company: get(r, "company"), email: get(r, "email"), phone: get(r, "phone"), city: get(r, "city"), linkedin: get(r, "linkedin"), industry: get(r, "industry"), region: regionFromCountry(get(r, "country")), level: levelFromTitle(title), source: "Apollo", stage: get(r, "email") ? "enriched" : "mined", fit: null, sponsor: "", notes: [], createdAt: new Date().toISOString().slice(0, 10) };
          return lead;
        }).filter((l) => { if (!l.name) return false; const k = (l.email || l.name + l.company).toLowerCase(); if (existing.has(k)) { dupes++; return false; } existing.add(k); return true; });
        $("#csvPreview").innerHTML = parsed.length ? "<p><b>" + parsed.length + " new leads</b> found" + (dupes ? ", " + dupes + " duplicates skipped" : "") + ".</p><ul class=\"list\">" + parsed.slice(0, 5).map((l) => '<li><span class="grow"><strong>' + esc(l.name) + "</strong><span>" + esc(l.title) + ", " + esc(l.company) + "</span></span></li>").join("") + "</ul>" : '<p class="err" style="color:var(--red)">No usable rows. The file needs a name column (or first and last name).</p>';
        $("#doImp").disabled = !parsed.length;
      };
      reader.readAsText(file);
    });
    $("#doImp").addEventListener("click", () => { db.leads.push(...parsed); save(); m.close(); toast(parsed.length + " leads imported"); render(); });
  }

  /* ---------- Global search ---------- */
  function wireSearch() {
    const inp = $("#globalSearch"), box = $("#searchResults");
    inp.addEventListener("input", () => {
      const q = inp.value.trim().toLowerCase(); if (q.length < 2) { box.hidden = true; return; }
      const hits = [];
      [["leads", "Lead"], ["guests", "Guest"], ["partners", "Association"], ["deals", "Deal"]].forEach(([col, lab]) => db[col].forEach((r) => {
        const hay = [r.name, r.org, r.company, r.title, r.city].join(" ").toLowerCase();
        if (hay.includes(q)) hits.push({ col, id: r.id, t: titleOf(col, r), s: lab + " · " + subOf(col, r) });
      }));
      box.innerHTML = hits.length ? hits.slice(0, 10).map((h) => '<button data-col="' + h.col + '" data-id="' + h.id + '"><span>' + esc(h.t) + "</span><small>" + esc(h.s) + "</small></button>").join("") : '<p class="muted" style="padding:8px 10px;margin:0">No matches for "' + esc(inp.value) + '"</p>';
      box.hidden = false;
      $$("button", box).forEach((b) => b.addEventListener("click", () => { box.hidden = true; inp.value = ""; openRecord(b.dataset.col, b.dataset.id); }));
    });
    document.addEventListener("click", (e) => { if (!box.contains(e.target) && e.target !== inp) box.hidden = true; });
  }

  /* ---------- Router ---------- */
  function current() { const r = (location.hash || "#dashboard").replace(/^#\/?/, ""); return views[r] ? r : "dashboard"; }
  function render() {
    const r = current();
    renderNav(r);
    $("#view").innerHTML = views[r]();
    $$("[data-add]").forEach((b) => b.addEventListener("click", () => openForm(b.dataset.add)));
    if (views[r].after) views[r].after();
  }
  function resetDemo() { confirmBox("Reset all demo data? Your changes in this browser will be lost.", "Reset demo data", doReset); }
  function doReset() { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } db = MU.buildDemo(); save(); render(); toast("Demo data reset"); }

  window.addEventListener("hashchange", () => { closeDrawer(); $("#rail").classList.remove("open"); render(); $("#view").focus({ preventScroll: true }); window.scrollTo(0, 0); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#drawer").classList.contains("open")) closeDrawer(); });
  $("#scrim").addEventListener("click", () => { closeDrawer(); $("#rail").classList.remove("open"); });
  $("#menuBtn").addEventListener("click", () => { const open = $("#rail").classList.toggle("open"); $("#menuBtn").setAttribute("aria-expanded", open); $("#scrim").hidden = !open; });
  $("#resetDemo").addEventListener("click", resetDemo);
  wireSearch();
  render();
})();
