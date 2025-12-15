// தமிழ் முழு கிளையன்ட் லாஜிக் (localStorage அடிப்படையில்)
(function () {
  const STORE = {
    admins: "ttnt_admins",
    users: "ttnt_users",
    events: "ttnt_events",
    uzh: "ttnt_uzhavarapani",
    session: "ttnt_sessions",
    history: "ttnt_history",
    pref: "ttnt_pref"
  };

  const els = {};

  function qs(id) {
    return document.getElementById(id);
  }

  function read(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("storage read", key, e);
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function toast(msg) {
    const t = qs("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.remove("hidden");
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.classList.add("hidden"), 200);
    }, 2200);
  }

  function initDom() {
    els.tabButtons = document.querySelectorAll(".tab-button");
    els.tabPanels = document.querySelectorAll(".tab-panel");
    els.adminLoginForm = qs("adminLoginForm");
    els.adminWelcome = qs("adminWelcome");
    els.adminDashboard = qs("adminDashboard");
    els.eventForm = qs("eventForm");
    els.adminAddForm = qs("adminAddForm");
    els.eventsTable = qs("eventsTable");
    els.usersTable = qs("usersTable");
    els.uzhTable = qs("uzhavarapaniTable");
    els.refreshEventsBtn = qs("refreshEventsBtn");
    els.refreshUsersBtn = qs("refreshUsersBtn");
    els.refreshUzhBtn = qs("refreshUzhBtn");

    els.userRegisterForm = qs("userRegisterForm");
    els.userLoginForm = qs("userLoginForm");
    els.userWelcome = qs("userWelcome");
    els.userDashboard = qs("userDashboard");
    els.userEvents = qs("userEvents");
    els.userProfile = qs("userProfile");
    els.userLogoutBtn = qs("userLogoutBtn");
    els.eventCountPill = qs("eventCountPill");

    els.publicEvents = qs("publicEvents");
    els.todayNotice = qs("todayNotice");
    els.nextUzhDate = qs("nextUzhDate");
    els.uzhForm = qs("uzhavarapaniForm");
    els.historyText = qs("historyText");
    els.countdownTimer = qs("countdownTimer");
    els.countdownLabel = qs("countdownLabel");
    els.bannerSchedule = qs("bannerSchedule");
    els.metaSchedule = qs("metaSchedule");
    els.langToggle = qs("langToggle");
    els.themeToggle = qs("themeToggle");
    els.docTitle = qs("docTitle");
    els.brandTitle = qs("brandTitle");
    els.heroTitle = qs("heroTitle");
    els.overviewTitle = qs("overviewTitle");

    els.eventSearch = qs("eventSearch");
    els.userSearch = qs("userSearch");
    els.uzhSearch = qs("uzhSearch");
    els.exportEventsBtn = qs("exportEventsBtn");
    els.exportUsersBtn = qs("exportUsersBtn");
    els.exportUzhBtn = qs("exportUzhBtn");
  }

  function seed() {
    if (!read(STORE.admins).length) {
      write(STORE.admins, [{ username: "admin", password: "admin123" }]);
    }
    if (!read(STORE.events).length) {
      const next = fourthSunday(new Date());
      const sample = [
        {
          id: Date.now(),
          title: "மாதாந்திர உழவரப்பணி",
          date: next.toISOString().slice(0, 10),
          type: "உழவரப்பணி",
          description: "மாதம் நான்காம் ஞாயிறு காலை 9:00 – மதியம் 1:00. சுத்தம், தோட்டம், அன்னதானம் தயாரிப்பு."
        }
      ];
      write(STORE.events, sample);
    }
    if (!read(STORE.history, "").length) {
      write(
        STORE.history,
        "அருள்தரும் அன்னை ஸ்ரீ கோமதியம்மை சமேத அருள்மிகு சுவாமி ஸ்ரீ தொண்டர்கள் நயினார் திருக்கோயில் – திருநெல்வேலி (Arultharum Annai Sri Gomathiyammai Sametha Arulmigu Swami Sri Thondarkal Nainar Thirukkoyil) திருநெல்வேலியில் அமைந்துள்ள புனித ஸ்தலம். பக்தர்களின் உழைப்பால் சுத்தம், அலங்காரம், திருப்பணி அனைத்தும் நடைபெறுகின்றன. " +
          "இங்கு ஆண்டுதோறும் சிறப்பு விழாக்கள், மாதந்தோறும் நான்காம் ஞாயிற்றுக்கிழமை உழவரப்பணி நடைபெற்று பக்தர்கள் கலந்துகொள்கின்றனர். " +
          "பரமாத்மாவின் அருளால் கிராம மக்களின் வாழ்வு வளம் பெறுவதாக நம்பப்படுகிறது."
      );
    }
  }

  function setHistory() {
    if (!els.historyText) return;
    els.historyText.textContent = read(STORE.history, "");
  }

  function fourthSunday(base = new Date()) {
    const year = base.getFullYear();
    const month = base.getMonth();
    let count = 0;
    const d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      if (d.getDay() === 0) count++;
      if (count === 4) return new Date(d);
      d.setDate(d.getDate() + 1);
    }
    // fallback to last Sunday
    d.setDate(d.getDate() - 7);
    return d;
  }

  function formatDate(str) {
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return str;
    return d.toLocaleDateString("ta-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  function bindTabs() {
    els.tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        els.tabButtons.forEach((b) => b.classList.remove("active"));
        els.tabPanels.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        const target = qs(btn.dataset.target);
        if (target) target.classList.add("active");
      });
    });
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const username = data.get("username")?.toString().trim();
    const password = data.get("password")?.toString();
    const admins = read(STORE.admins);
    const found = admins.find((a) => a.username === username && a.password === password);
    if (!found) {
      toast("பயனர்பெயர் அல்லது கடவுச்சொல் தவறு");
      return;
    }
    write(STORE.session, { role: "admin", username });
    renderAdminState();
    toast("நிர்வாகம் உள்நுழைந்தது");
  }

  function renderAdminState() {
    const session = read(STORE.session, {});
    const isAdmin = session.role === "admin";
    els.adminDashboard.classList.toggle("hidden", !isAdmin);
    els.adminWelcome.classList.toggle("hidden", !isAdmin);
    if (isAdmin) {
      els.adminWelcome.textContent = `நல்வரவு, ${session.username}`;
      renderEvents();
      renderUsers();
      renderUzh();
    }
  }

  function addAdmin(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const username = data.get("username")?.toString().trim();
    const password = data.get("password")?.toString();
    if (!username || !password) {
      toast("பயனர்பெயர்/கடவுச்சொல் தேவை");
      return;
    }
    const admins = read(STORE.admins);
    if (admins.some((a) => a.username === username)) {
      toast("ஏற்கனவே உள்ள பயனர்பெயர்");
      return;
    }
    admins.push({ username, password });
    write(STORE.admins, admins);
    e.target.reset();
    toast("நிர்வாகி சேர்க்கப்பட்டது");
  }

  function saveEvent(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const ev = {
      id: Date.now(),
      title: data.get("title")?.toString().trim(),
      date: data.get("date"),
      type: data.get("type"),
      description: data.get("description")?.toString().trim()
    };
    if (!ev.title || !ev.date || !ev.description) {
      toast("அனைத்து விவரங்களும் தேவை");
      return;
    }
    const list = read(STORE.events);
    list.unshift(ev);
    write(STORE.events, list);
    e.target.reset();
    renderEvents();
    renderPublicEvents();
    toast("நிகழ்வு சேர்க்கப்பட்டது");
  }

  function deleteEvent(id) {
    const list = read(STORE.events);
    const filtered = list.filter((ev) => ev.id !== id);
    write(STORE.events, filtered);
    renderEvents();
    renderPublicEvents();
    toast("நிகழ்வு நீக்கப்பட்டது");
  }

  function renderEvents() {
    if (!els.eventsTable) return;
    const list = read(STORE.events);
    const filtered = filterBySearch(list, els.eventSearch?.value);
    els.eventsTable.innerHTML =
      list.length === 0
        ? "<p class='muted'>நிகழ்வுகள் இல்லை</p>"
        : filtered
            .map(
              (ev) => `
          <div class="table-item">
            <div class="row">
              <span class="badge">${ev.type}</span>
              <strong>${ev.title}</strong>
              <span class="muted">${formatDate(ev.date)}</span>
            </div>
            <p class="muted">${ev.description}</p>
            <button class="btn ghost" data-delete="${ev.id}">நீக்கு</button>
          </div>
        `
            )
            .join("");

    els.eventsTable.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => deleteEvent(Number(btn.dataset.delete)));
    });
    if (els.eventCountPill) {
      els.eventCountPill.textContent = `${filtered.length} நிகழ்வுகள்`;
    }
  }

  function registerUser(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const user = {
      id: Date.now(),
      name: data.get("name")?.toString().trim(),
      address: data.get("address")?.toString().trim(),
      phone: data.get("phone")?.toString().trim(),
      password: data.get("password")?.toString()
    };
    if (!user.name || !user.address || !user.phone || !user.password) {
      toast("அனைத்து விவரங்களும் தேவை");
      return;
    }
    const users = read(STORE.users);
    if (users.some((u) => u.phone === user.phone)) {
      toast("இதே தொலைபேசியில் பதிவு உள்ளது");
      return;
    }
    users.push(user);
    write(STORE.users, users);
    e.target.reset();
    toast("பயனர் பதிவு முடிந்தது");
    renderUsers();
  }

  function loginUser(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const phone = data.get("phone")?.toString().trim();
    const password = data.get("password")?.toString();
    const users = read(STORE.users);
    const found = users.find((u) => u.phone === phone && u.password === password);
    if (!found) {
      toast("உள்நுழைவு தோல்வி");
      return;
    }
    write(STORE.session, { role: "user", phone });
    renderUserState();
    toast("உள்நுழைவு வெற்றி");
  }

  function renderUsers() {
    if (!els.usersTable) return;
    const users = read(STORE.users);
    const filtered = filterBySearch(users, els.userSearch?.value);
    els.usersTable.innerHTML =
      users.length === 0
        ? "<p class='muted'>பயனர்கள் பதிவு செய்யவில்லை</p>"
        : filtered
            .map(
              (u) => `
          <div class="table-item">
            <strong>${u.name}</strong>
            <div class="muted">${u.phone}</div>
            <div class="muted">${u.address}</div>
          </div>
        `
            )
            .join("");
  }

  function renderUserState() {
    const session = read(STORE.session, {});
    const isUser = session.role === "user";
    els.userDashboard.classList.toggle("hidden", !isUser);
    els.userWelcome.classList.toggle("hidden", !isUser);
    if (!isUser) return;
    const users = read(STORE.users);
    const me = users.find((u) => u.phone === session.phone);
    if (me) {
      els.userWelcome.textContent = `${me.name}, நல்வரவு!`;
      els.userProfile.innerHTML = `
        <li>பெயர்: ${me.name}</li>
        <li>தொலைபேசி: ${me.phone}</li>
        <li>முகவரி: ${me.address}</li>
      `;
    }
    renderUserEvents();
    renderUzh();
  }

  function renderUserEvents() {
    const list = read(STORE.events);
    const filtered = filterBySearch(list, els.eventSearch?.value);
    if (!els.userEvents) return;
    els.userEvents.innerHTML =
      filtered.length === 0
        ? "<p class='muted'>நிகழ்வுகள் இல்லை</p>"
        : filtered
            .map(
              (ev) => `
          <div class="table-item">
            <div class="row">
              <span class="badge">${ev.type}</span>
              <strong>${ev.title}</strong>
              <span class="muted">${formatDate(ev.date)}</span>
            </div>
            <p class="muted">${ev.description}</p>
          </div>
        `
            )
            .join("");
  }

  function renderPublicEvents() {
    if (!els.publicEvents) return;
    const list = read(STORE.events);
    els.publicEvents.innerHTML =
      list.length === 0
        ? "<p class='muted'>நிகழ்வுகள் இல்லை</p>"
        : list
            .slice(0, 4)
            .map(
              (ev) => `
          <div class="table-item">
            <div class="row">
              <span class="badge">${ev.type}</span>
              <strong>${ev.title}</strong>
              <span class="muted">${formatDate(ev.date)}</span>
            </div>
            <p class="muted">${ev.description}</p>
          </div>
        `
            )
            .join("");
    if (els.todayNotice && list.length) {
      const top = list[0];
      els.todayNotice.textContent = `${top.title} — ${formatDate(top.date)}`;
    }
  }

  function submitUzh(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    const rec = {
      id: Date.now(),
      person: data.get("person")?.toString().trim(),
      phone: data.get("phone")?.toString().trim(),
      count: Number(data.get("count")) || 1,
      note: data.get("note")?.toString().trim(),
      created: new Date().toISOString()
    };
    if (!rec.person || !rec.phone) {
      toast("பெயர் மற்றும் தொலைபேசி தேவை");
      return;
    }
    const list = read(STORE.uzh);
    list.unshift(rec);
    write(STORE.uzh, list);
    e.target.reset();
    renderUzh();
    toast("உழவரப்பணி பதிவு சேர்க்கப்பட்டது");
  }

  function renderUzh() {
    const list = read(STORE.uzh);
    const filtered = filterBySearch(list, els.uzhSearch?.value);
    if (els.uzhTable) {
      els.uzhTable.innerHTML =
        filtered.length === 0
          ? "<p class='muted'>இன்னும் பதிவு இல்லை</p>"
          : filtered
              .map(
                (r) => `
          <div class="table-item">
            <div class="row"><strong>${r.person}</strong><span class="muted">${r.phone}</span></div>
            <div class="muted">குழு: ${r.count}</div>
            ${r.note ? `<div class="muted">${r.note}</div>` : ""}
          </div>
        `
              )
              .join("");
    }
  }

  function logoutUser() {
    write(STORE.session, {});
    els.userDashboard.classList.add("hidden");
    els.userWelcome.classList.add("hidden");
    toast("வெளியேறப்பட்டது");
  }

  function bindMisc() {
    els.refreshEventsBtn?.addEventListener("click", renderEvents);
    els.refreshUsersBtn?.addEventListener("click", renderUsers);
    els.refreshUzhBtn?.addEventListener("click", renderUzh);
    els.userLogoutBtn?.addEventListener("click", logoutUser);

    els.eventSearch?.addEventListener("input", () => {
      renderEvents();
      renderUserEvents();
    });
    els.userSearch?.addEventListener("input", renderUsers);
    els.uzhSearch?.addEventListener("input", renderUzh);

    els.exportEventsBtn?.addEventListener("click", () => exportCsv(read(STORE.events), "events.csv"));
    els.exportUsersBtn?.addEventListener("click", () => exportCsv(read(STORE.users), "users.csv"));
    els.exportUzhBtn?.addEventListener("click", () => exportCsv(read(STORE.uzh), "uzhavarapani.csv"));

    els.themeToggle?.addEventListener("click", toggleTheme);
    els.langToggle?.addEventListener("click", toggleLang);
  }

  function setNextUzh() {
    if (!els.nextUzhDate) return;
    const d = fourthSunday();
    const txt = `${formatDate(d.toISOString())} (காலை 9:00)`;
    els.nextUzhDate.textContent = txt;
    if (els.countdownTimer) {
      startCountdown(d);
    }
  }

  function setTodayCard() {
    const list = read(STORE.events);
    if (!els.todayNotice) return;
    if (!list.length) {
      els.todayNotice.textContent = "நிகழ்வுகள் இல்லை";
      return;
    }
    const top = list[0];
    els.todayNotice.textContent = `${top.title} — ${formatDate(top.date)}`;
  }

  function filterBySearch(list, term) {
    if (!term) return list;
    const t = term.toLowerCase();
    return list.filter((item) => JSON.stringify(item).toLowerCase().includes(t));
  }

  function exportCsv(list, filename) {
    if (!list || !list.length) {
      toast("தரவு இல்லை");
      return;
    }
    const keys = Object.keys(list[0]);
    const rows = [keys.join(",")].concat(
      list.map((row) => keys.map((k) => `"${(row[k] ?? "").toString().replace(/"/g, '""')}"`).join(","))
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function startCountdown(targetDate) {
    const target = new Date(targetDate).getTime();
    if (Number.isNaN(target) || !els.countdownTimer) return;
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        els.countdownTimer.textContent = "நடப்பில்";
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      els.countdownTimer.textContent = `${days} நாள் ${hours} மணி`;
      requestAnimationFrame(() => setTimeout(tick, 1000));
    };
    tick();
  }

  const L10N = {
    ta: {
      schedule: "மாதம் நான்காம் ஞாயிறு — உழவரப்பணி",
      today: "இன்றைய அறிவிப்பு",
      countdown: "அடுத்த உழவரப்பணி வரை",
      nav: {
        overview: "மேலோட்டம்",
        history: "வரலாறு",
        events: "நிகழ்வுகள்",
        gallery: "படங்கள்",
        uzh: "உழவரப்பணி",
        contact: "தொடர்பு"
      }
    },
    en: {
      schedule: "Fourth Sunday every month — Uzhavarapani",
      today: "Today’s Update",
      countdown: "Next Uzhavarapani in",
      nav: {
        overview: "Overview",
        history: "History",
        events: "Events",
        gallery: "Photos",
        uzh: "Uzhavarapani",
        contact: "Contact"
      }
    }
  };

  function toggleTheme() {
    const pref = read(STORE.pref, {});
    const isDark = document.documentElement.classList.toggle("theme-dark");
    write(STORE.pref, { ...pref, theme: isDark ? "dark" : "light" });
  }

  function toggleLang() {
    const pref = read(STORE.pref, {});
    const next = pref.lang === "en" ? "ta" : "en";
    applyLang(next);
    write(STORE.pref, { ...pref, lang: next });
  }

  function applyLang(lang) {
    const dict = L10N[lang] || L10N.ta;
    if (els.bannerSchedule) els.bannerSchedule.textContent = dict.schedule;
    if (els.metaSchedule) els.metaSchedule.textContent = `📅 ${dict.schedule}`;
    if (els.todayHeading) els.todayHeading.textContent = dict.today;
    if (els.countdownLabel) els.countdownLabel.textContent = dict.countdown;
    if (qs("navOverview")) qs("navOverview").textContent = dict.nav.overview;
    if (qs("navHistory")) qs("navHistory").textContent = dict.nav.history;
    if (qs("navEvents")) qs("navEvents").textContent = dict.nav.events;
    if (qs("navGallery")) qs("navGallery").textContent = dict.nav.gallery;
    if (qs("navUzh")) qs("navUzh").textContent = dict.nav.uzh;
    if (qs("navContact")) qs("navContact").textContent = dict.nav.contact;
    document.documentElement.lang = lang === "en" ? "en" : "ta";
  }

  document.addEventListener("DOMContentLoaded", () => {
    initDom();
    seed();
    setHistory();
    setNextUzh();
    setTodayCard();
    bindTabs();
    bindMisc();
    const pref = read(STORE.pref, {});
    if (pref.theme === "dark") document.documentElement.classList.add("theme-dark");
    applyLang(pref.lang || "ta");

    els.adminLoginForm?.addEventListener("submit", handleAdminLogin);
    els.adminAddForm?.addEventListener("submit", addAdmin);
    els.eventForm?.addEventListener("submit", saveEvent);
    els.userRegisterForm?.addEventListener("submit", registerUser);
    els.userLoginForm?.addEventListener("submit", loginUser);
    els.uzhForm?.addEventListener("submit", submitUzh);

    renderEvents();
    renderPublicEvents();
    renderUserEvents();
    renderUsers();
    renderUzh();
    renderAdminState();
    renderUserState();
  });
})();


