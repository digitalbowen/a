/* ============================================================
   Personal Website — interactions
   Vanilla JavaScript, no dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* ===== 1. Footer year ===== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== 2. Mobile navigation ===== */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove("open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      document.body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    // Close the menu when clicking outside of it
    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("open")) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ===== 3. Scroll reveal animations ===== */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ===== 4. Resume print / save as PDF ===== */
  var printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  /* ===== 5. Smooth back-to-top ===== */
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  /* ===== 6. Contact form — validation + mailto ===== */
  var form = document.getElementById("contactForm");

  if (form) {
    var EMAIL_TO = "hello@wanlinzheng.example"; // <-- replace with your email

    function setError(id, message) {
      var input = document.getElementById(id);
      var errEl = form.querySelector('.error[data-for="' + id + '"]');
      var fieldWrap = input ? input.closest(".field") : null;
      if (errEl) errEl.textContent = message;
      if (fieldWrap) fieldWrap.classList.toggle("invalid", !!message);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var valid = true;

      setError("name", "");
      setError("email", "");
      setError("message", "");

      if (!name) {
        setError("name", "Please tell me your name.");
        valid = false;
      }
      if (!email) {
        setError("email", "An email address helps me reply to you.");
        valid = false;
      } else if (!emailRe.test(email)) {
        setError("email", "Hmm, that email address looks a little off.");
        valid = false;
      }
      if (!message) {
        setError("message", "Don't forget your message!");
        valid = false;
      } else if (message.length < 5) {
        setError("message", "A few more words would really help.");
        valid = false;
      }

      if (!valid) return;

      var subject = "Hello from " + name;
      var body =
        "Hi Wanlin,%0D%0A%0D%0A" +
        encodeURIComponent(message) +
        "%0D%0A%0D%0AFrom: " +
        encodeURIComponent(name) +
        " (" +
        encodeURIComponent(email) +
        ")";

      window.location.href =
        "mailto:" + EMAIL_TO + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
    });

    // Clear a field's error as soon as the visitor starts typing
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        var fieldWrap = input.closest(".field");
        var errEl = fieldWrap ? fieldWrap.querySelector(".error") : null;
        if (fieldWrap) fieldWrap.classList.remove("invalid");
        if (errEl) errEl.textContent = "";
      });
    });
  }

  /* ===== 7. To-do list on Projects page ===== */
  var todoForm = document.getElementById("todoForm");
  var todoInput = document.getElementById("todoInput");
  var todoDate = document.getElementById("todoDate");
  var todoList = document.getElementById("todoList");
  var todoEmpty = document.getElementById("todoEmpty");
  var todoCount = document.getElementById("todoCount");
  var todoPriority = document.getElementById("todoPriority");
  var todoStatus = document.getElementById("todoStatus");

  // Priority metadata: emoji + label for each level
  var PRIORITY_META = {
    low: { emoji: "\u{1F49A}", label: "Low" },
    medium: { emoji: "\u2B50", label: "Medium" },
    high: { emoji: "\u{1F525}", label: "High" },
  };
  var selectedPriority = "medium";

  if (todoForm && todoList) {
    // If the page was opened by double-clicking the file (file:// origin),
    // cross-origin requests to Supabase are blocked/unreliable, so todos
    // cannot be saved. Redirect to the local HTTP server instead.
    if (location.protocol === "file:") {
      var LOCAL_URL = "http://localhost:8765/projects.html";
      document.title = "正在打开可同步版本…";
      document.body.innerHTML =
        '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#fdf9fc;">' +
        '<div style="max-width:520px;text-align:center;font-family:Nunito,Segoe UI,sans-serif;">' +
        '<div style="font-size:46px;margin-bottom:14px;">\u{1F504}</div>' +
        '<h1 style="font-family:Fraunces,Georgia,serif;font-size:1.7rem;margin-bottom:12px;">正在打开可同步版本…</h1>' +
        '<p style="color:#766d7e;font-size:1.05rem;line-height:1.7;margin-bottom:20px;">' +
        '直接双击打开网页时，浏览器会阻止数据保存到 Supabase，待办事项刷新后会消失。' +
        '正在为你跳转到本地服务器版本（待办事项可正常保存）。</p>' +
        '<a id="localGo" href="' + LOCAL_URL +
        '" style="display:inline-block;background:#de6e99;color:#fff;text-decoration:none;font-weight:800;' +
        'padding:14px 28px;border-radius:999px;box-shadow:0 10px 22px rgba(222,110,153,.32);">' +
        "点此立即打开 " + LOCAL_URL + "</a>" +
        '<p style="color:#a99eb5;font-size:.92rem;margin-top:22px;">' +
        '如果打不开（显示无法连接）：请双击项目文件夹里的 <strong>启动网站.command</strong>，再重试。</p>' +
        "</div></div>";
      setTimeout(function () {
        location.replace(LOCAL_URL);
      }, 1800);
      return; // stop the rest of to-do logic; we are leaving this page
    }

    // --- Supabase REST helpers (native fetch — no SDK dependency) ---
    // Table: todos(id, task, is_complete, date, created_at)
    var SUPA_URL = "https://gwlxrxkbpkpaaduxxpob.supabase.co/rest/v1/todos";
    var SUPA_KEY = "sb_publishable_q3YBF-qLhcEizdxrZ7jnvQ_Q88RU3Xi";
    var SUPA_HEADERS = {
      apikey: SUPA_KEY,
      Authorization: "Bearer " + SUPA_KEY,
      "Content-Type": "application/json",
    };

    // Shared fetch wrapper — on failure, include the HTTP status AND the
    // response body (which carries the PostgREST error code/message).
    function supaRequest(path, options) {
      return fetch(SUPA_URL + path, options).then(function (r) {
        if (r.ok) {
          var ct = r.headers.get("content-type") || "";
          return ct.indexOf("json") !== -1 ? r.json() : null;
        }
        return r.text().then(function (body) {
          throw new Error("HTTP " + r.status + (body ? " — " + body.slice(0, 300) : ""));
        });
      });
    }

    // INSERT a todo, resolve to the new row's id.
    function supaInsert(task, date) {
      return supaRequest("", {
        method: "POST",
        headers: Object.assign({}, SUPA_HEADERS, { Prefer: "return=representation" }),
        body: JSON.stringify({ task: task, date: date }),
      }).then(function (rows) {
        return rows && rows[0] ? rows[0].id : null;
      });
    }

    // DELETE a todo by id.
    function supaDelete(id) {
      return supaRequest("?id=eq." + encodeURIComponent(id), {
        method: "DELETE",
        headers: SUPA_HEADERS,
      });
    }

    // SELECT all todos, oldest first.
    function supaLoad() {
      return supaRequest("?select=*&order=created_at.asc", {
        headers: SUPA_HEADERS,
      });
    }

    // Visible status banner so DB problems are never silent.
    var statusTimer = null;
    function showStatus(kind, message, sticky) {
      if (!todoStatus) return;
      todoStatus.textContent = message;
      todoStatus.className = "todo-status " + kind;
      todoStatus.hidden = false;
      if (statusTimer) clearTimeout(statusTimer);
      if (!sticky) {
        statusTimer = setTimeout(function () {
          todoStatus.hidden = true;
        }, 3000);
      }
    }

    // Default the date field to today so the calendar opens on a useful day
    function pad(n) {
      return n < 10 ? "0" + n : "" + n;
    }
    function toISO(d) {
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }
    if (todoDate && !todoDate.value) {
      todoDate.value = toISO(new Date());
    }

    function fmtDate(iso) {
      if (!iso) return "";
      var d = new Date(iso + "T00:00:00");
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    function updateEmpty() {
      if (!todoEmpty) return;
      var count = todoList.querySelectorAll(".todo-item").length;
      todoEmpty.style.display = count === 0 ? "" : "none";
    }

    function updateCount() {
      if (!todoCount) return;
      var items = todoList.querySelectorAll(".todo-item");
      var total = items.length;
      var done = todoList.querySelectorAll(".todo-item.done").length;
      todoCount.hidden = false;
      todoCount.innerHTML =
        "<strong>" + done + "</strong> of <strong>" + total + "</strong> task" +
        (total === 1 ? "" : "s") + " completed";
      todoCount.classList.toggle("all-done", total > 0 && done === total);
    }

    // Priority picker — click a button to select that level for the next task
    if (todoPriority) {
      todoPriority.addEventListener("click", function (e) {
        var btn = e.target.closest(".priority-btn");
        if (!btn) return;
        selectedPriority = btn.getAttribute("data-priority");
        todoPriority.querySelectorAll(".priority-btn").forEach(function (b) {
          var isActive = b === btn;
          b.classList.toggle("active", isActive);
          b.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      });
    }

    // INSERT a new todo into Supabase, then render it with the returned id.
    // Table columns: id, task, is_complete, date, created_at
    async function addTask(text, date, priority) {
      var p = priority && PRIORITY_META[priority] ? priority : "medium";
      var id = null;
      try {
        id = await supaInsert(text, date);
        showStatus("ok", "Saved to Supabase ✓");
      } catch (err) {
        console.error("Supabase insert failed:", err);
        showStatus(
          "error",
          "Could NOT save to Supabase — this task will disappear on refresh. " +
            String(err.message || err),
          true
        );
      }
      renderTask(id, text, date, p);
    }

    // Render a single todo row in the DOM. `id` is stored on the <li>
    // so the delete handler can target the right database row.
    function renderTask(id, text, date, priority) {
      var p = priority && PRIORITY_META[priority] ? priority : "medium";
      var meta = PRIORITY_META[p];
      var li = document.createElement("li");
      li.className = "todo-item todo-priority-" + p;
      if (id) li.dataset.id = id;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("aria-label", "Mark task as done");
      checkbox.addEventListener("change", function () {
        li.classList.toggle("done", checkbox.checked);
        updateCount();
      });

      var badge = document.createElement("span");
      badge.className = "todo-priority-badge";
      badge.setAttribute("data-priority", p);
      badge.setAttribute("title", meta.label + " priority");
      badge.textContent = meta.emoji + " " + meta.label;

      var span = document.createElement("span");
      span.className = "todo-text";
      span.textContent = text;
      span.setAttribute("title", "Click to edit");

      var dateChip = document.createElement("span");
      dateChip.className = "todo-date";
      dateChip.textContent = fmtDate(date);

      var del = document.createElement("button");
      del.type = "button";
      del.className = "todo-delete";
      del.setAttribute("aria-label", "Delete task");
      del.textContent = "\u00D7";
      del.addEventListener("click", async function () {
        if (li.dataset.id) {
          try {
            await supaDelete(li.dataset.id);
          } catch (err) {
            console.error("Supabase delete failed:", err);
            return; // keep the row so the user can retry
          }
        }
        li.remove();
        updateEmpty();
        updateCount();
      });

      li.appendChild(checkbox);
      li.appendChild(badge);
      li.appendChild(dateChip);
      li.appendChild(span);
      li.appendChild(del);

      todoList.appendChild(li);
      updateEmpty();
      updateCount();
    }

    // Read all todos on page load, oldest first.
    async function loadTodos() {
      try {
        var rows = await supaLoad();
        (rows || []).forEach(function (row) {
          renderTask(row.id, row.task, row.date, "medium");
        });
      } catch (err) {
        console.error("Supabase load failed:", err);
        showStatus(
          "error",
          "Could not load todos from Supabase: " + String(err.message || err),
          true
        );
      }
    }

    /* ----- Inline edit: click text to edit, Enter saves, Esc cancels ----- */
    function startEdit(span) {
      var original = span.textContent;
      var input = document.createElement("input");
      input.type = "text";
      input.className = "todo-edit";
      input.value = original;
      input.setAttribute("aria-label", "Edit task");
      span.replaceWith(input);
      input.focus();
      input.select();

      var finished = false;
      function finish(save) {
        if (finished) return;
        finished = true;
        var next = save ? input.value.trim() : original;
        if (!next) next = original; // don't allow empty
        var newSpan = document.createElement("span");
        newSpan.className = "todo-text";
        newSpan.textContent = next;
        newSpan.setAttribute("title", "Click to edit");
        input.replaceWith(newSpan);
      }

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          finish(true);
        } else if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
        }
      });
      input.addEventListener("blur", function () {
        finish(true);
      });
    }

    // Delegated click — start editing when the task text is clicked
    todoList.addEventListener("click", function (e) {
      var span = e.target.closest(".todo-text");
      if (!span) return;
      startEdit(span);
    });

    todoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = todoInput.value.trim();
      var date = todoDate.value;
      if (!text || !date) return;
      addTask(text, date, selectedPriority);
      todoInput.value = "";
      todoInput.focus();
    });

    updateEmpty();
    updateCount();
    loadTodos();
  }

  /* ===== 8. Weather app on Projects page ===== */
  var weatherForm = document.getElementById("weatherForm");
  var weatherCity = document.getElementById("weatherCity");
  var weatherStatus = document.getElementById("weatherStatus");
  var weatherResult = document.getElementById("weatherResult");

  if (weatherForm && weatherCity && weatherStatus && weatherResult) {
    var WEATHER_API = "https://uapis.cn/api/v1/misc/weather";

    // Same-spelling, different-city pairs. Bare pinyin is ambiguous — the API
    // resolves "suzhou" to 宿州 (安徽) rather than 苏州 (江苏) — so we send the
    // Chinese name and offer the other reading as a one-tap alternative.
    // First entry in each list is the more commonly intended city.
    var AMBIGUOUS_CITIES = {
      suzhou: [
        { send: "苏州", label: "苏州 · 江苏" },
        { send: "宿州", label: "宿州 · 安徽" },
      ],
      fuzhou: [
        { send: "福州", label: "福州 · 福建" },
        { send: "抚州", label: "抚州 · 江西" },
      ],
      taizhou: [
        { send: "台州", label: "台州 · 浙江" },
        { send: "泰州", label: "泰州 · 江苏" },
      ],
      yichun: [
        { send: "宜春", label: "宜春 · 江西" },
        { send: "伊春", label: "伊春 · 黑龙江" },
      ],
      yulin: [
        { send: "榆林", label: "榆林 · 陕西" },
        { send: "玉林", label: "玉林 · 广西" },
      ],
    };

    // Candidates for an ambiguous pinyin query, or null when it is unambiguous.
    function findAmbiguous(query) {
      var key = query.toLowerCase().replace(/[\s'\-.]/g, "");
      return AMBIGUOUS_CITIES[key] || null;
    }

    // Notable cities used to suggest corrections for a misspelled search.
    // Format: "alias|alias" (lowercase, no spaces) · display label · value sent to the API.
    var CITIES = [
      ["beijing|peking", "北京", "北京"],
      ["shanghai", "上海", "上海"],
      ["guangzhou|canton", "广州 · 广东", "广州"],
      ["shenzhen", "深圳 · 广东", "深圳"],
      ["hangzhou", "杭州 · 浙江", "杭州"],
      ["nanjing", "南京 · 江苏", "南京"],
      ["suzhou", "苏州 · 江苏", "苏州"],
      ["wuhan", "武汉 · 湖北", "武汉"],
      ["chengdu", "成都 · 四川", "成都"],
      ["chongqing", "重庆", "重庆"],
      ["xian", "西安 · 陕西", "西安"],
      ["tianjin", "天津", "天津"],
      ["qingdao", "青岛 · 山东", "青岛"],
      ["dalian", "大连 · 辽宁", "大连"],
      ["xiamen|amoy", "厦门 · 福建", "厦门"],
      ["fuzhou", "福州 · 福建", "福州"],
      ["ningbo", "宁波 · 浙江", "宁波"],
      ["wuxi", "无锡 · 江苏", "无锡"],
      ["changsha", "长沙 · 湖南", "长沙"],
      ["zhengzhou", "郑州 · 河南", "郑州"],
      ["jinan", "济南 · 山东", "济南"],
      ["shenyang", "沈阳 · 辽宁", "沈阳"],
      ["harbin", "哈尔滨 · 黑龙江", "哈尔滨"],
      ["kunming", "昆明 · 云南", "昆明"],
      ["guiyang", "贵阳 · 贵州", "贵阳"],
      ["nanning", "南宁 · 广西", "南宁"],
      ["haikou", "海口 · 海南", "海口"],
      ["sanya", "三亚 · 海南", "三亚"],
      ["lanzhou", "兰州 · 甘肃", "兰州"],
      ["urumqi", "乌鲁木齐 · 新疆", "乌鲁木齐"],
      ["hohhot", "呼和浩特 · 内蒙古", "呼和浩特"],
      ["yinchuan", "银川 · 宁夏", "银川"],
      ["xining", "西宁 · 青海", "西宁"],
      ["taiyuan", "太原 · 山西", "太原"],
      ["shijiazhuang", "石家庄 · 河北", "石家庄"],
      ["hefei", "合肥 · 安徽", "合肥"],
      ["nanchang", "南昌 · 江西", "南昌"],
      ["changchun", "长春 · 吉林", "长春"],
      ["hongkong", "香港", "香港"],
      ["macau|macao", "澳门", "澳门"],
      ["taipei", "台北", "台北"],
      ["yantai", "烟台 · 山东", "烟台"],
      ["weihai", "威海 · 山东", "威海"],
      ["luoyang", "洛阳 · 河南", "洛阳"],
      ["guilin", "桂林 · 广西", "桂林"],
      ["dongguan", "东莞 · 广东", "东莞"],
      ["foshan", "佛山 · 广东", "佛山"],
      ["zhuhai", "珠海 · 广东", "珠海"],
      ["wenzhou", "温州 · 浙江", "温州"],
      ["shaoxing", "绍兴 · 浙江", "绍兴"],
      ["jinhua", "金华 · 浙江", "金华"],
      ["taizhou", "台州 · 浙江", "台州"],
      ["changzhou", "常州 · 江苏", "常州"],
      ["nantong", "南通 · 江苏", "南通"],
      ["xuzhou", "徐州 · 江苏", "徐州"],
      ["yangzhou", "扬州 · 江苏", "扬州"],
      ["zhenjiang", "镇江 · 江苏", "镇江"],
      ["linyi", "临沂 · 山东", "临沂"],
      ["handan", "邯郸 · 河北", "邯郸"],
      ["baoding", "保定 · 河北", "保定"],
      ["tangshan", "唐山 · 河北", "唐山"],
      ["baoji", "宝鸡 · 陕西", "宝鸡"],
      ["mianyang", "绵阳 · 四川", "绵阳"],
      ["liuzhou", "柳州 · 广西", "柳州"],
      ["beihai", "北海 · 广西", "北海"],
      ["zhanjiang", "湛江 · 广东", "湛江"],
      ["quanzhou", "泉州 · 福建", "泉州"],
      ["jingdezhen", "景德镇 · 江西", "景德镇"],
      ["zhuzhou", "株洲 · 湖南", "株洲"],
      ["yueyang", "岳阳 · 湖南", "岳阳"],
      ["london", "London · United Kingdom", "London"],
      ["paris", "Paris · France", "Paris"],
      ["tokyo", "Tokyo · Japan", "Tokyo"],
      ["newyork|nyc", "New York · United States", "New York"],
      ["losangeles|la", "Los Angeles · United States", "Los Angeles"],
      ["chicago", "Chicago · United States", "Chicago"],
      ["sanfrancisco|sf", "San Francisco · United States", "San Francisco"],
      ["seattle", "Seattle · United States", "Seattle"],
      ["boston", "Boston · United States", "Boston"],
      ["washington|dc", "Washington · United States", "Washington"],
      ["toronto", "Toronto · Canada", "Toronto"],
      ["vancouver", "Vancouver · Canada", "Vancouver"],
      ["mexicocity", "Mexico City · Mexico", "Mexico City"],
      ["saopaulo", "São Paulo · Brazil", "Sao Paulo"],
      ["buenosaires", "Buenos Aires · Argentina", "Buenos Aires"],
      ["sydney", "Sydney · Australia", "Sydney"],
      ["melbourne", "Melbourne · Australia", "Melbourne"],
      ["auckland", "Auckland · New Zealand", "Auckland"],
      ["singapore", "Singapore", "Singapore"],
      ["bangkok", "Bangkok · Thailand", "Bangkok"],
      ["kualalumpur|kl", "Kuala Lumpur · Malaysia", "Kuala Lumpur"],
      ["jakarta", "Jakarta · Indonesia", "Jakarta"],
      ["manila", "Manila · Philippines", "Manila"],
      ["hanoi", "Hanoi · Vietnam", "Hanoi"],
      ["hochiminh|saigon", "Ho Chi Minh City · Vietnam", "Ho Chi Minh City"],
      ["seoul", "Seoul · South Korea", "Seoul"],
      ["osaka", "Osaka · Japan", "Osaka"],
      ["kyoto", "Kyoto · Japan", "Kyoto"],
      ["mumbai|bombay", "Mumbai · India", "Mumbai"],
      ["delhi", "Delhi · India", "Delhi"],
      ["bangalore", "Bangalore · India", "Bangalore"],
      ["dubai", "Dubai · UAE", "Dubai"],
      ["doha", "Doha · Qatar", "Doha"],
      ["istanbul", "Istanbul · Turkey", "Istanbul"],
      ["moscow", "Moscow · Russia", "Moscow"],
      ["saintpetersburg", "Saint Petersburg · Russia", "Saint Petersburg"],
      ["berlin", "Berlin · Germany", "Berlin"],
      ["munich", "Munich · Germany", "Munich"],
      ["frankfurt", "Frankfurt · Germany", "Frankfurt"],
      ["amsterdam", "Amsterdam · Netherlands", "Amsterdam"],
      ["brussels", "Brussels · Belgium", "Brussels"],
      ["zurich", "Zurich · Switzerland", "Zurich"],
      ["vienna", "Vienna · Austria", "Vienna"],
      ["prague", "Prague · Czech Republic", "Prague"],
      ["warsaw", "Warsaw · Poland", "Warsaw"],
      ["rome", "Rome · Italy", "Rome"],
      ["milan", "Milan · Italy", "Milan"],
      ["madrid", "Madrid · Spain", "Madrid"],
      ["barcelona", "Barcelona · Spain", "Barcelona"],
      ["lisbon", "Lisbon · Portugal", "Lisbon"],
      ["athens", "Athens · Greece", "Athens"],
      // --- More Chinese prefecture-level cities ---
      ["lhasa", "拉萨 · 西藏", "拉萨"],
      ["wuhu", "芜湖 · 安徽", "芜湖"],
      ["huangshan", "黄山 · 安徽", "黄山"],
      ["maanshan", "马鞍山 · 安徽", "马鞍山"],
      ["anqing", "安庆 · 安徽", "安庆"],
      ["bengbu", "蚌埠 · 安徽", "蚌埠"],
      ["fuyang", "阜阳 · 安徽", "阜阳"],
      ["kaifeng", "开封 · 河南", "开封"],
      ["anyang", "安阳 · 河南", "安阳"],
      ["xinxiang", "新乡 · 河南", "新乡"],
      ["nanyang", "南阳 · 河南", "南阳"],
      ["zunyi", "遵义 · 贵州", "遵义"],
      ["anshun", "安顺 · 贵州", "安顺"],
      ["qiqihar", "齐齐哈尔 · 黑龙江", "齐齐哈尔"],
      ["daqing", "大庆 · 黑龙江", "大庆"],
      ["mudanjiang", "牡丹江 · 黑龙江", "牡丹江"],
      ["jilin", "吉林", "吉林"],
      ["anshan", "鞍山 · 辽宁", "鞍山"],
      ["fushun", "抚顺 · 辽宁", "抚顺"],
      ["yingkou", "营口 · 辽宁", "营口"],
      ["zhangjiakou", "张家口 · 河北", "张家口"],
      ["qinhuangdao", "秦皇岛 · 河北", "秦皇岛"],
      ["chengde", "承德 · 河北", "承德"],
      ["langfang", "廊坊 · 河北", "廊坊"],
      ["cangzhou", "沧州 · 河北", "沧州"],
      ["datong", "大同 · 山西", "大同"],
      ["changzhi", "长治 · 山西", "长治"],
      ["linfen", "临汾 · 山西", "临汾"],
      ["yuncheng", "运城 · 山西", "运城"],
      ["baotou", "包头 · 内蒙古", "包头"],
      ["ordos", "鄂尔多斯 · 内蒙古", "鄂尔多斯"],
      ["suqian", "宿迁 · 江苏", "宿迁"],
      ["lianyungang", "连云港 · 江苏", "连云港"],
      ["huaian", "淮安 · 江苏", "淮安"],
      ["yancheng", "盐城 · 江苏", "盐城"],
      ["putian", "莆田 · 福建", "莆田"],
      ["zhangzhou", "漳州 · 福建", "漳州"],
      ["sanming", "三明 · 福建", "三明"],
      ["nanping", "南平 · 福建", "南平"],
      ["yiwu", "义乌 · 浙江", "义乌"],
      ["jiaxing", "嘉兴 · 浙江", "嘉兴"],
      ["huzhou", "湖州 · 浙江", "湖州"],
      ["zhoushan", "舟山 · 浙江", "舟山"],
      ["quzhou", "衢州 · 浙江", "衢州"],
      ["lishui", "丽水 · 浙江", "丽水"],
      ["jiujiang", "九江 · 江西", "九江"],
      ["ganzhou", "赣州 · 江西", "赣州"],
      ["shangrao", "上饶 · 江西", "上饶"],
      ["weifang", "潍坊 · 山东", "潍坊"],
      ["zibo", "淄博 · 山东", "淄博"],
      ["taian", "泰安 · 山东", "泰安"],
      ["jining", "济宁 · 山东", "济宁"],
      ["rizhao", "日照 · 山东", "日照"],
      ["dezhou", "德州 · 山东", "德州"],
      ["changde", "常德 · 湖南", "常德"],
      ["hengyang", "衡阳 · 湖南", "衡阳"],
      ["xiangtan", "湘潭 · 湖南", "湘潭"],
      ["chenzhou", "郴州 · 湖南", "郴州"],
      ["shantou", "汕头 · 广东", "汕头"],
      ["jieyang", "揭阳 · 广东", "揭阳"],
      ["zhongshan", "中山 · 广东", "中山"],
      ["huizhou", "惠州 · 广东", "惠州"],
      ["jiangmen", "江门 · 广东", "江门"],
      ["shaoguan", "韶关 · 广东", "韶关"],
      ["wuzhou", "梧州 · 广西", "梧州"],
      ["leshan", "乐山 · 四川", "乐山"],
      ["nanchong", "南充 · 四川", "南充"],
      ["luzhou", "泸州 · 四川", "泸州"],
      ["yibin", "宜宾 · 四川", "宜宾"],
      ["dali", "大理 · 云南", "大理"],
      ["lijiang", "丽江 · 云南", "丽江"],
      ["xishuangbanna", "西双版纳 · 云南", "西双版纳"],
      ["qujing", "曲靖 · 云南", "曲靖"],
      ["xianyang", "咸阳 · 陕西", "咸阳"],
      ["weinan", "渭南 · 陕西", "渭南"],
      ["yanan", "延安 · 陕西", "延安"],
      ["hanzhong", "汉中 · 陕西", "汉中"],
      ["tianshui", "天水 · 甘肃", "天水"],
      ["kashgar", "喀什 · 新疆", "喀什"],
      // --- More international cities ---
      ["nagoya", "Nagoya · Japan", "Nagoya"],
      ["fukuoka", "Fukuoka · Japan", "Fukuoka"],
      ["sapporo", "Sapporo · Japan", "Sapporo"],
      ["cairo", "Cairo · Egypt", "Cairo"],
      ["nairobi", "Nairobi · Kenya", "Nairobi"],
      ["lagos", "Lagos · Nigeria", "Lagos"],
      ["casablanca", "Casablanca · Morocco", "Casablanca"],
      ["lyon", "Lyon · France", "Lyon"],
      ["marseille", "Marseille · France", "Marseille"],
      ["hamburg", "Hamburg · Germany", "Hamburg"],
      ["edinburgh", "Edinburgh · United Kingdom", "Edinburgh"],
      ["dublin", "Dublin · Ireland", "Dublin"],
      ["oslo", "Oslo · Norway", "Oslo"],
      ["stockholm", "Stockholm · Sweden", "Stockholm"],
      ["copenhagen", "Copenhagen · Denmark", "Copenhagen"],
      ["helsinki", "Helsinki · Finland", "Helsinki"],
      ["kyiv|kiev", "Kyiv · Ukraine", "Kyiv"],
      ["budapest", "Budapest · Hungary", "Budapest"],
      ["riyadh", "Riyadh · Saudi Arabia", "Riyadh"],
      ["telaviv", "Tel Aviv · Israel", "Tel Aviv"],
      ["karachi", "Karachi · Pakistan", "Karachi"],
      ["colombo", "Colombo · Sri Lanka", "Colombo"],
      ["kathmandu", "Kathmandu · Nepal", "Kathmandu"],
      ["dhaka", "Dhaka · Bangladesh", "Dhaka"],
      ["yangon", "Yangon · Myanmar", "Yangon"],
      ["perth", "Perth · Australia", "Perth"],
      ["brisbane", "Brisbane · Australia", "Brisbane"],
      ["honolulu", "Honolulu · United States", "Honolulu"],
      ["miami", "Miami · United States", "Miami"],
      ["houston", "Houston · United States", "Houston"],
      ["lasvegas", "Las Vegas · United States", "Las Vegas"],
      ["montreal", "Montreal · Canada", "Montreal"],
      ["lima", "Lima · Peru", "Lima"],
      ["santiago", "Santiago · Chile", "Santiago"],
      ["bogota", "Bogotá · Colombia", "Bogota"],
    ];

    var CITY_INDEX = CITIES.map(function (c) {
      return { keys: c[0].split("|"), label: c[1], send: c[2] };
    });

    // Levenshtein distance — the number of single-character edits between two strings.
    function editDistance(a, b) {
      var prev = [];
      var i, j;
      for (j = 0; j <= b.length; j++) prev[j] = j;
      for (i = 1; i <= a.length; i++) {
        var curr = [i];
        for (j = 1; j <= b.length; j++) {
          curr[j] = Math.min(
            prev[j] + 1,
            curr[j - 1] + 1,
            prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1)
          );
        }
        prev = curr;
      }
      return prev[b.length];
    }

    // Rank dictionary cities against a misspelled query; best matches first.
    function suggestCities(query) {
      var q = query.toLowerCase().replace(/[\s'\-.,]/g, "");
      if (q.length < 3) return [];

      var scored = [];
      CITY_INDEX.forEach(function (entry) {
        var best = 0;
        entry.keys.forEach(function (key) {
          var score = 1 - editDistance(q, key) / Math.max(q.length, key.length);
          // A shared prefix or substring is a stronger signal than distance alone.
          if (key.indexOf(q) === 0) score += 0.25;
          else if (key.indexOf(q) !== -1) score += 0.1;
          if (score > best) best = score;
        });
        if (best >= 0.62) scored.push({ score: best, entry: entry });
      });

      scored.sort(function (a, b) {
        return b.score - a.score;
      });
      return scored.slice(0, 5).map(function (s) {
        return s.entry;
      });
    }

    // Normalise a city name for comparison: lowercase, no spaces or punctuation.
    function normalizeCity(value) {
      return String(value || "").toLowerCase().replace(/[\s'\-.,]/g, "");
    }

    // The API is pathologically lenient — it returns a normal-looking result for
    // gibberish too (e.g. "abcd" → a place in Gujarat, "aaaa" → 合肥市, "test" →
    // 锡林郭勒盟), which is indistinguishable from a real answer. So we only trust
    // it for Chinese input or a name we recognise; anything else is not found.
    function isKnownCity(query) {
      var q = normalizeCity(query);
      var hit = false;
      CITY_INDEX.forEach(function (entry) {
        if (entry.keys.indexOf(q) !== -1) hit = true;
      });
      return hit;
    }

    // The API returns QWeather-style numeric icon codes; map them to an emoji.
    function weatherEmoji(code) {
      var c = parseInt(code, 10);
      if (isNaN(c)) return "\u{1F321}\uFE0F"; // thermometer
      if (c === 100 || c === 150) return "\u2600\uFE0F"; // clear
      if (c === 101 || c === 102 || c === 103 || c === 153) return "\u26C5"; // partly cloudy
      if (c === 104) return "\u2601\uFE0F"; // overcast
      if (c >= 300 && c <= 304) return "\u26C8\uFE0F"; // thunder
      if (c >= 305 && c <= 399) return "\u{1F327}\uFE0F"; // rain
      if (c >= 400 && c <= 499) return "\u{1F328}\uFE0F"; // snow
      if (c >= 500 && c <= 599) return "\u{1F32B}\uFE0F"; // fog / haze
      if (c === 900) return "\u{1F525}"; // very hot
      if (c === 901) return "\u2744\uFE0F"; // very cold
      return "\u{1F321}\uFE0F";
    }

    // Rounded integer for display; keeps the card tidy for values like 13.9.
    function formatTemp(t) {
      if (t === undefined || t === null || t === "") return "\u2014";
      var n = Number(t);
      return isNaN(n) ? String(t) : String(Math.round(n));
    }

    function setWeatherStatus(kind, message) {
      weatherStatus.textContent = message;
      weatherStatus.className = "todo-status weather-status " + kind;
      weatherStatus.hidden = false;
    }

    function clearWeatherStatus() {
      weatherStatus.hidden = true;
    }

    // Renders a row of tappable city chips; picking one re-runs the search.
    function renderCityChips(items, labelText, onPick) {
      var row = document.createElement("div");
      row.className = "weather-alt";

      var label = document.createElement("span");
      label.className = "weather-alt-label";
      label.textContent = labelText;
      row.appendChild(label);

      items.forEach(function (item) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "weather-alt-btn";
        btn.textContent = item.label;
        btn.addEventListener("click", function () {
          weatherCity.value = item.send;
          onPick(item);
        });
        row.appendChild(btn);
      });

      return row;
    }

    // Build the card from DOM nodes so API text is never injected as HTML.
    function renderWeather(data, matches) {
      weatherResult.innerHTML = "";

      var card = document.createElement("div");
      card.className = "weather-card";

      var main = document.createElement("div");
      main.className = "weather-main";

      var icon = document.createElement("span");
      icon.className = "weather-icon";
      icon.textContent = weatherEmoji(data.weather_icon);

      var info = document.createElement("div");

      var temp = document.createElement("div");
      temp.className = "weather-temp";
      temp.textContent = formatTemp(data.temperature);
      var unit = document.createElement("span");
      unit.className = "unit";
      unit.textContent = "\u00B0C";
      temp.appendChild(unit);
      info.appendChild(temp);

      var cond = document.createElement("div");
      cond.className = "weather-cond";
      cond.textContent = data.weather || "\u2014";
      info.appendChild(cond);

      main.appendChild(icon);
      main.appendChild(info);
      card.appendChild(main);

      var city = document.createElement("div");
      city.className = "weather-city";
      city.textContent = [data.city, data.province].filter(Boolean).join(" \u00B7 ");
      card.appendChild(city);

      var extras = [];
      if (data.humidity !== undefined && data.humidity !== null && data.humidity !== "") {
        extras.push("\u{1F4A7} Humidity " + data.humidity + "%");
      }
      var wind = [data.wind_direction, data.wind_power].filter(Boolean).join(" ");
      if (wind) extras.push("\u{1F32C}\uFE0F " + wind);
      if (data.report_time) extras.push("\u{1F551} " + data.report_time);

      if (extras.length) {
        var extra = document.createElement("ul");
        extra.className = "weather-extra";
        extras.forEach(function (text) {
          var li = document.createElement("li");
          li.textContent = text;
          extra.appendChild(li);
        });
        card.appendChild(extra);
      }

      weatherResult.appendChild(card);

      // Same spelling, different city — let the visitor switch readings.
      if (matches && matches.length > 1) {
        weatherResult.appendChild(
          renderCityChips(matches, "Same spelling, different city:", function (item) {
            loadWeather(item.send, matches);
          })
        );
      }

      weatherResult.hidden = false;
    }

    // A misspelled or unknown city: offer the closest names we know about.
    function showSuggestions(query) {
      weatherResult.innerHTML = "";
      weatherResult.hidden = true;

      var found = suggestCities(query);
      if (!found.length) return;

      weatherResult.appendChild(
        renderCityChips(found, "Did you mean:", function (item) {
          // A suggested city may itself be ambiguous (e.g. 苏州/宿州); resolve it
          // against its dictionary key so the alternative reading is offered too.
          loadWeather(item.send, findAmbiguous(item.keys && item.keys[0]));
        })
      );
      weatherResult.hidden = false;
    }

    async function loadWeather(city, matches) {
      weatherResult.hidden = true;
      weatherResult.innerHTML = "";
      setWeatherStatus("loading", "Loading\u2026");

      try {
        var res = await fetch(WEATHER_API + "?city=" + encodeURIComponent(city));

        if (res.status === 404) {
          setWeatherStatus("error", "Couldn\u2019t find that city \u2014 check the spelling.");
          showSuggestions(city);
          return;
        }
        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        var data = await res.json();
        if (!data || data.temperature === undefined || data.temperature === null) {
          setWeatherStatus("error", "Couldn\u2019t find that city \u2014 check the spelling.");
          showSuggestions(city);
          return;
        }

        clearWeatherStatus();
        renderWeather(data, matches);
      } catch (err) {
        console.error("Weather lookup failed:", err);
        setWeatherStatus("error", "Couldn\u2019t load the weather \u2014 please try again.");
      }
    }

    weatherForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var city = weatherCity.value.trim();

      if (!city) {
        weatherResult.hidden = true;
        setWeatherStatus("error", "Enter a city first.");
        return; // empty input — never call the API
      }

      // Ambiguous pinyin (e.g. "suzhou") is sent as Chinese so the API returns
      // the intended city instead of its arbitrary first match.
      var matches = findAmbiguous(city);

      // Only trust the API for Chinese input or a name we recognise. Otherwise
      // the lenient API would answer with an unrelated city for gibberish or a
      // misspelling, so report it as not found and offer close matches instead.
      var hasChinese = /[\u4e00-\u9fa5]/.test(city);
      if (!hasChinese && !matches && !isKnownCity(city)) {
        setWeatherStatus("error", "Couldn\u2019t find that city \u2014 check the spelling.");
        showSuggestions(city);
        return;
      }

      loadWeather(matches ? matches[0].send : city, matches);
    });

    // Clear the banner as soon as the visitor edits the city name
    weatherCity.addEventListener("input", clearWeatherStatus);
  }
})();
