// தமிழ் முழு கிளையன்ட் லாஜிக் (localStorage அடிப்படையில்)
(function () {
  const STORE = {
    admins: "ttnt_admins",
    users: "ttnt_users",
    events: "ttnt_events",
    uzh: "ttnt_uzhavarapani",
    session: "ttnt_sessions",
    history: "ttnt_history"
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
  }

  function seed() {
    if (!read(STORE.admins).length) {
      write(STORE.admins, [{ username: "admin", password: "admin123" }]);
    }
    if (!read(STORE.events).length) {
      const next = nextLastSunday();
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

  function nextLastSunday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const end = new Date(year, month + 1, 0); // last day of month
    const day = end.getDay(); // 0 Sunday
    const diff = day === 0 ? 0 : day;
    const lastSunday = new Date(end);
    lastSunday.setDate(end.getDate() - diff);
    return lastSunday;
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
    els.eventsTable.innerHTML =
      list.length === 0
        ? "<p class='muted'>நிகழ்வுகள் இல்லை</p>"
        : list
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
      els.eventCountPill.textContent = `${list.length} நிகழ்வுகள்`;
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
    els.usersTable.innerHTML =
      users.length === 0
        ? "<p class='muted'>பயனர்கள் பதிவு செய்யவில்லை</p>"
        : users
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
    if (!els.userEvents) return;
    els.userEvents.innerHTML =
      list.length === 0
        ? "<p class='muted'>நிகழ்வுகள் இல்லை</p>"
        : list
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
    if (els.uzhTable) {
      els.uzhTable.innerHTML =
        list.length === 0
          ? "<p class='muted'>இன்னும் பதிவு இல்லை</p>"
          : list
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
  }

  function setNextUzh() {
    if (!els.nextUzhDate) return;
    const d = nextLastSunday();
    const txt = `${formatDate(d.toISOString())} (காலை 9:00)`;
    els.nextUzhDate.textContent = txt;
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

  document.addEventListener("DOMContentLoaded", () => {
    initDom();
    seed();
    setHistory();
    setNextUzh();
    setTodayCard();
    bindTabs();
    bindMisc();

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

