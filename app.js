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
  const qs = (id) => document.getElementById(id);

  const read = (key, fallback = []) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function toast(msg) {
    const t = qs("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.remove("hidden");
    t.classList.add("show");
    setTimeout(() => {
      t.classList.remove("show");
      t.classList.add("hidden");
    }, 2200);
  }

  function initDom() {
    [
      "adminLoginForm","adminAddForm","eventForm","userRegisterForm",
      "userLoginForm","uzhavarapaniForm","userLogoutBtn",
      "adminWelcome","userWelcome","adminDashboard","userDashboard",
      "eventsTable","usersTable","uzhavarapaniTable","userEvents",
      "publicEvents","historyText","todayNotice","nextUzhDate",
      "countdownTimer","countdownLabel","bannerSchedule","metaSchedule",
      "eventSearch","userSearch","uzhSearch","eventCountPill",
      "langToggle","themeToggle"
    ].forEach(id => els[id] = qs(id));

    els.tabButtons = document.querySelectorAll(".tab-button");
    els.tabPanels  = document.querySelectorAll(".tab-panel");
  }

  function seed() {
    if (!read(STORE.admins).length)
      write(STORE.admins, [{ username: "admin", password: "admin123" }]);

    if (!read(STORE.events).length) {
      const d = fourthSunday(new Date());
      write(STORE.events, [{
        id: Date.now(),
        title: "மாதாந்திர உழவரப்பணி",
        date: d.toISOString().slice(0,10),
        type: "உழவரப்பணி",
        description: "மாதம் நான்காம் ஞாயிறு காலை 9:00 – மதியம் 1:00."
      }]);
    }

    if (!read(STORE.history, "").length) {
      write(STORE.history,
        "அருள்தரும் அன்னை ஸ்ரீ கோமதியம்மை சமேத அருள்மிகு சுவாமி ஸ்ரீ தொண்டர்கள் நயினார் திருக்கோயில் – திருநெல்வேலி. " +
        "மாதந்தோறும் நான்காம் ஞாயிறு உழவரப்பணி நடைபெறும் புனித ஸ்தலம்."
      );
    }
  }

  const fourthSunday = (b) => {
    const y=b.getFullYear(), m=b.getMonth();
    let c=0,d=new Date(y,m,1);
    while(d.getMonth()===m){
      if(d.getDay()===0) c++;
      if(c===4) return new Date(d);
      d.setDate(d.getDate()+1);
    }
    return d;
  };

  const formatDate = (s) =>
    new Date(s).toLocaleDateString("ta-IN",{day:"numeric",month:"long",year:"numeric"});

  function bindTabs() {
    els.tabButtons.forEach(btn=>{
      btn.onclick=()=>{
        els.tabButtons.forEach(b=>b.classList.remove("active"));
        els.tabPanels.forEach(p=>p.classList.remove("active"));
        btn.classList.add("active");
        qs(btn.dataset.target)?.classList.add("active");
      };
    });
  }

  function renderPublicEvents() {
    const list = read(STORE.events);
    els.publicEvents.innerHTML = list.map(ev=>`
      <div class="table-item">
        <strong>${ev.title}</strong>
        <div class="muted">${formatDate(ev.date)}</div>
        <p class="muted">${ev.description}</p>
      </div>`).join("");
    if (els.todayNotice && list[0])
      els.todayNotice.textContent = `${list[0].title} — ${formatDate(list[0].date)}`;
  }

  function setHistory() {
    els.historyText.textContent = read(STORE.history,"");
  }

  function setNextUzh() {
    const d = fourthSunday(new Date());
    els.nextUzhDate.textContent = `${formatDate(d)} (காலை 9:00)`;
  }

  document.addEventListener("DOMContentLoaded",()=>{
    initDom();
    seed();
    setHistory();
    setNextUzh();
    bindTabs();
    renderPublicEvents();
  });
})();
