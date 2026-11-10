document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const themeBtn = document.getElementById("theme-toggle");
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const day = theme === "day";
    themeBtn.textContent = day ? "🌙" : "☀️";
    themeBtn.setAttribute("aria-label", day ? "Switch to night" : "Switch to day");
    try { localStorage.setItem("theme", theme); } catch (e) {}
  };
  let saved = "night";
  try { saved = localStorage.getItem("theme") || "night"; } catch (e) {}
  applyTheme(saved);
  themeBtn.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "day" ? "night" : "day");
  });

  const toggle = document.getElementById("nav-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navAs = [...document.querySelectorAll(".nav-links a")];
  const spy = () => {
    const y = window.scrollY + 140;
    let current = null;
    sections.forEach((s) => {
      if (s.offsetTop <= y) current = s.id;
    });
    navAs.forEach((a) => a.classList.toggle("active", a.dataset.nav === current));
  };
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  mountField();
  mountLabs();
  mountStats();
  mountFilters();
  mountDecks();
  mountDialog();
  mountOrbit();
  mountType();

  function mountField() {
    const canvas = document.getElementById("field-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pointer = { x: -9999, y: -9999 };
    const shapes = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const count = Math.min(48, Math.round(innerWidth / 28));
    for (let i = 0; i < count; i += 1) {
      shapes.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: 10 + Math.random() * 28,
        kind: i % 4,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.18,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.003,
        a: 0.18 + Math.random() * 0.32
      });
    }
    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    }, { passive: true });
    const frame = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      shapes.forEach((shape) => {
        if (!reduced) {
          const dx = shape.x - pointer.x;
          const dy = shape.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 0) {
            shape.vx += (dx / dist) * 0.045;
            shape.vy += (dy / dist) * 0.045;
          }
          shape.vx *= 0.985;
          shape.vy *= 0.985;
          shape.x += shape.vx;
          shape.y += shape.vy;
          shape.rot += shape.vr;
          if (shape.x < -70) shape.x = innerWidth + 40;
          if (shape.x > innerWidth + 70) shape.x = -40;
          if (shape.y < -70) shape.y = innerHeight + 40;
          if (shape.y > innerHeight + 70) shape.y = -40;
        }
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rot);
        ctx.strokeStyle = `rgba(62, 240, 200, ${shape.a})`;
        ctx.fillStyle = `rgba(62, 240, 200, ${shape.a})`;
        ctx.lineWidth = 1;
        if (shape.kind === 0) {
          ctx.beginPath();
          ctx.arc(0, 0, shape.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(shape.r, 0, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (shape.kind === 1) {
          ctx.beginPath();
          ctx.moveTo(0, -shape.r * 0.55);
          ctx.lineTo(shape.r * 0.4, 0);
          ctx.lineTo(0, shape.r * 0.55);
          ctx.lineTo(-shape.r * 0.4, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (shape.kind === 2) {
          ctx.strokeRect(-shape.r * 0.45, -shape.r * 0.28, shape.r * 0.9, shape.r * 0.56);
        } else {
                ctx.beginPath();
          ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
                ctx.fill();
        }
        ctx.restore();
      });
      if (!reduced) requestAnimationFrame(frame);
    };
    frame();
  }

  function mountType() {
    const el = document.getElementById("type-role");
    if (!el) return;
    const lines = [
      "Machine Learning Enthusiast",
      "Robotics & Circuit Designer",
      "Full Stack Web Developer",
      "Vibe Coder",
      "AI Research Learner",
      "Research Engineer",
      "Computer Science Engineer",
      "Researcher",
      "Professional and Academic Writer",
      "Always Learning",
    ];
    if (reduced) {
      el.textContent = lines[0];
      return;
    }
    let i = 0;
    let n = lines[0].length;
    let dir = -1;
    const tick = () => {
      const word = lines[i];
      n += dir;
      el.textContent = word.slice(0, n);
      if (n >= word.length) {
        dir = -1;
        setTimeout(tick, 1300);
        return;
      }
      if (n <= 0) {
        dir = 1;
        i = (i + 1) % lines.length;
        setTimeout(tick, 260);
        return;
      }
      setTimeout(tick, dir > 0 ? 68 : 32);
    };
    setTimeout(tick, 1300);
  }

  function mountStats() {
    const box = document.querySelector(".stats");
    if (!box) return;
    const nodes = [...box.querySelectorAll("dt")];
    const projects = document.getElementById("project-count");
    if (projects) projects.dataset.count = String(document.querySelectorAll("#project-grid .lab").length);
    const targets = nodes.map((el) => Number(String(el.dataset.count || el.textContent).replace(/[^\d]/g, "")) || 0);
    const run = new WeakMap();
    let wave = 0;
    let visible = false;

    const paint = (el, value) => {
      el.textContent = String(Math.round(value));
    };

    const climb = (el, target) => {
      if (reduced) {
        paint(el, target);
        return;
      }
      const token = wave;
      run.set(el, token);
      let current = 0;
      const step = Math.max(target / (2000 / 60), 0.05);
      const tick = () => {
        if (run.get(el) !== token) return;
        current += step;
        if (current >= target) paint(el, target);
        else {
          paint(el, current);
          requestAnimationFrame(tick);
        }
      };
      paint(el, 0);
      requestAnimationFrame(tick);
    };

    const play = () => {
      wave += 1;
      nodes.forEach((el, i) => climb(el, targets[i]));
    };

    if (reduced) {
      nodes.forEach((el, i) => paint(el, targets[i]));
      visible = true;
    } else {
      nodes.forEach((el) => paint(el, 0));
      const watcher = new IntersectionObserver((entries) => {
        const hit = entries.some((entry) => entry.isIntersecting);
        if (hit && !visible) play();
        visible = hit;
      }, { threshold: 0.4 });
      watcher.observe(box);
    }

    const citations = document.getElementById("citation-count");
    if (!citations) return;
    const profile = "https://scholar.google.com/citations?user=laJ1Z0IAAAAJ&hl=en";
    const routes = [
      "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(profile),
      "https://corsproxy.io/?" + encodeURIComponent(profile)
    ];
    const applyCitations = (raw) => {
      const value = Number(String(raw).replace(/[^\d]/g, ""));
      if (!Number.isFinite(value)) return;
      const index = nodes.indexOf(citations);
      if (index >= 0) targets[index] = value;
      if (visible) climb(citations, value);
    };
    const read = async (route) => {
      const response = await fetch(route);
      if (!response.ok) throw new Error("status");
      const html = await response.text();
      const match = html.match(/class="gsc_rsb_std"[^>]*>\s*([\d,]+)/);
      if (!match) throw new Error("parse");
      applyCitations(match[1]);
    };
    routes.reduce((chain, route) => chain.catch(() => read(route)), Promise.reject()).catch(() => {});
  }

  function mountLabs() {
    const stages = [...document.querySelectorAll(".lab-stage")];
    const visible = new Set();
    const pointers = new WeakMap();

    stages.forEach((stage) => {
      const canvas = stage.querySelector("canvas");
      pointers.set(canvas, { x: 0.5, y: 0.55 });
      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        pointers.set(canvas, {
          x: (e.clientX - r.left) / r.width,
          y: (e.clientY - r.top) / r.height
        });
      });
      stage.addEventListener("pointerleave", () => {
        pointers.set(canvas, { x: 0.5, y: 0.55 });
        });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
    }, { rootMargin: "80px" });
    stages.forEach((s) => io.observe(s));

    const fit = (canvas) => {
      const r = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, w, h };
    };

    const tick = (time) => {
      visible.forEach((stage) => {
        if (stage.closest(".lab")?.classList.contains("is-hidden")) return;
        const canvas = stage.querySelector("canvas");
        const { ctx, w, h } = fit(canvas);
        const p = pointers.get(canvas);
        const scene = scenes[stage.dataset.scene] || scenes.fusion;
        grid(ctx, w, h);
        scene(ctx, w, h, reduced ? 0 : time, p.x, p.y);
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener("resize", () => {
      stages.forEach((stage) => fit(stage.querySelector("canvas")));
    });
  }

  function grid(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
  }

  function node(ctx, x, y, r, color, label) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (label) {
      ctx.fillStyle = "rgba(220,230,240,0.8)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + r + 14);
    }
  }

  function link(ctx, a, b, color, dash) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.setLineDash(dash || [4, 6]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.restore();
  }

  const scenes = {
    fusion(ctx, w, h, t, mx, my) {
      const pull = (x, y) => ({ x: x + (mx - 0.5) * 24, y: y + (my - 0.5) * 16 });
      const mri = pull(w * 0.18, h * 0.38);
      const quest = pull(w * 0.22, h * 0.68);
      const fuse = pull(w * 0.52, h * 0.5);
      const out = pull(w * 0.8, h * 0.48 + Math.sin(t * 0.002) * 6);
      link(ctx, mri, fuse, "rgba(120,180,255,0.8)");
      link(ctx, quest, fuse, "rgba(62,240,200,0.8)");
      link(ctx, fuse, out, "rgba(190,160,255,0.9)", []);
      node(ctx, mri.x, mri.y, 11, "#7eb6ff", "MRI");
      node(ctx, quest.x, quest.y, 9, "#3ef0c8", "Scores");
      node(ctx, fuse.x, fuse.y, 14, "#c9a6ff", "Late fusion");
      node(ctx, out.x, out.y, 8, "#f4f1ea", "Risk");
    },
    federated(ctx, w, h, t, mx, my) {
      const hub = { x: w * (0.5 + (mx - 0.5) * 0.08), y: h * 0.48 };
      for (let i = 0; i < 5; i++) {
        const ang = t * 0.0004 + i * ((Math.PI * 2) / 5);
        const p = { x: hub.x + Math.cos(ang) * w * 0.32, y: hub.y + Math.sin(ang) * h * 0.32 };
        link(ctx, p, hub, "rgba(62,240,200,0.55)");
        node(ctx, p.x, p.y, 8, i === 2 ? "#f0d48a" : "#7eb6ff", "");
      }
      node(ctx, hub.x, hub.y, 16, "#3ef0c8", "Updates only");
    },
    backbones(ctx, w, h, t, mx) {
      const names = ["ResNet", "Dense", "EffNet", "Patch"];
      names.forEach((name, i) => {
        const x = w * (0.16 + i * 0.18);
        const bh = h * (0.25 + ((Math.sin(t * 0.002 + i) + 1) / 2) * 0.4 * (0.7 + mx * 0.4));
        ctx.fillStyle = i === 3 ? "rgba(62,240,200,0.85)" : "rgba(126,182,255,0.75)";
        ctx.fillRect(x, h * 0.78 - bh, 28, bh);
        ctx.fillStyle = "rgba(220,230,240,0.75)";
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, x + 14, h * 0.9);
      });
      ctx.strokeStyle = "rgba(201,166,255,0.9)";
      ctx.beginPath();
      ctx.moveTo(w * 0.78, h * 0.55);
      ctx.lineTo(w * 0.9, h * 0.42);
      ctx.stroke();
      node(ctx, w * 0.9, h * 0.42, 10, "#c9a6ff", "Fusion");
    },
    ev(ctx, w, h, t, mx, my) {
      const a = { x: w * 0.16, y: h * (0.62 + (my - 0.5) * 0.1) };
      const b = { x: w * 0.38, y: h * 0.58 };
      const c = { x: w * (0.62 + (mx - 0.5) * 0.05), y: h * 0.36 };
      link(ctx, a, b, "rgba(160,190,230,0.7)");
      link(ctx, b, c, "rgba(62,240,200,0.85)");
      node(ctx, a.x, a.y, 7, "#9ab", "");
      node(ctx, b.x, b.y, 10, "#7eb6ff", "Feeder");
      node(ctx, c.x, c.y, 12, "#c9a6ff", "Station");
      const flag = { x: w * 0.8, y: h * (0.42 + Math.sin(t * 0.003) * 0.04) };
      link(ctx, c, flag, "rgba(240,212,138,0.8)", [2, 5]);
      node(ctx, flag.x, flag.y, 8, "#f0d48a", "Anomaly");
      for (let i = 0; i < 6; i++) {
        node(ctx, w * (0.2 + i * 0.1), h * 0.78, 3, "rgba(126,182,255,0.7)", "");
      }
    },
    frames(ctx, w, h, t) {
      const n = 6;
      const idx = Math.floor(t / 420) % n;
      for (let i = 0; i < n; i++) {
        const x = w * (0.08 + i * 0.15);
        ctx.strokeStyle = i === idx ? "#3ef0c8" : "rgba(126,182,255,0.45)";
        ctx.strokeRect(x, h * 0.28, w * 0.12, h * 0.4);
        ctx.fillStyle = i === idx ? "rgba(62,240,200,0.18)" : "rgba(10,20,40,0.4)";
        ctx.fillRect(x, h * 0.28, w * 0.12, h * 0.4);
        const fall = i / (n - 1);
        ctx.strokeStyle = "#d5e8ff";
        ctx.beginPath();
        const cx = x + w * 0.06;
        const cy = h * (0.4 + fall * 0.12);
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.moveTo(cx, cy + 5);
        ctx.lineTo(cx + fall * 16, cy + 22);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(220,230,240,0.7)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Lighting shifts across the clip", w * 0.08, h * 0.84);
    },
    privacy(ctx, w, h, t, mx) {
      for (let i = 0; i < 28; i++) {
        const real = i < 16;
        const x = (real ? 0.18 : 0.62) * w + ((i * 47) % 80) + Math.sin(t * 0.001 + i) * 6;
        const y = h * (0.25 + ((i * 19) % 50) / 100) + (mx - 0.5) * 10;
        node(ctx, x, y, real ? 3.5 : 4, real ? "#7eb6ff" : "#3ef0c8", "");
      }
      ctx.fillStyle = "rgba(220,230,240,0.65)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Held at site", w * 0.28, h * 0.84);
      ctx.fillText("Shareable view", w * 0.72, h * 0.84);
      ctx.strokeStyle = "rgba(240,212,138,0.7)";
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.18);
      ctx.lineTo(w * 0.5, h * 0.76);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    agents(ctx, w, h, t, mx, my) {
      const claim = { x: w * 0.2, y: h * 0.45 };
      const evidence = { x: w * 0.5, y: h * (0.32 + (my - 0.5) * 0.08) };
      const check = { x: w * (0.78 + (mx - 0.5) * 0.04), y: h * 0.5 };
      link(ctx, claim, evidence, "rgba(126,182,255,0.8)");
      link(ctx, evidence, check, "rgba(62,240,200,0.9)", []);
      const travel = (t * 0.00035) % 1;
      node(ctx, claim.x + (evidence.x - claim.x) * travel, claim.y + (evidence.y - claim.y) * travel, 4, "#f4f1ea", "");
      node(ctx, claim.x, claim.y, 11, "#7eb6ff", "Claim");
      node(ctx, evidence.x, evidence.y, 11, "#f0d48a", "Passage");
      node(ctx, check.x, check.y, 12, "#3ef0c8", "Check");
    },
    shap(ctx, w, h, t, mx) {
      const base = w * 0.5;
      ctx.strokeStyle = "rgba(220,230,240,0.35)";
      ctx.beginPath();
      ctx.moveTo(base, h * 0.12);
      ctx.lineTo(base, h * 0.84);
      ctx.stroke();
      const feats = [
        { name: "AHI", v: 0.26 },
        { name: "Age", v: 0.14 },
        { name: "BMI", v: -0.1 },
        { name: "SpO2", v: -0.16 },
        { name: "Neck", v: 0.07 }
      ];
      feats.forEach((feat, i) => {
        const y = h * (0.18 + i * 0.13);
        const width = w * feat.v * (0.85 + mx * 0.2) * (0.94 + Math.sin(t * 0.002 + i) * 0.05);
        ctx.fillStyle = feat.v > 0 ? "#3ef0c8" : "#f0d48a";
        ctx.fillRect(width > 0 ? base : base + width, y, Math.abs(width), 9);
        ctx.fillStyle = "rgba(220,230,240,0.8)";
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(feat.name, w * 0.18, y + 9);
      });
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(220,230,240,0.55)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText("pushes risk", base + 8, h * 0.94);
    },
    churn(ctx, w, h, t, mx) {
      const tilt = 0.16 + (mx - 0.5) * 0.18;
      ctx.strokeStyle = "rgba(62,240,200,0.9)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(w * (0.38 + tilt), h * 0.12);
      ctx.lineTo(w * (0.5 + tilt), h * 0.86);
      ctx.stroke();
      ctx.setLineDash([]);
      const stay = [[0.16, 0.28], [0.22, 0.44], [0.14, 0.58], [0.28, 0.36], [0.2, 0.7], [0.3, 0.56]];
      const leave = [[0.66, 0.26], [0.74, 0.44], [0.68, 0.62], [0.82, 0.34], [0.76, 0.74], [0.86, 0.56]];
      stay.forEach((point, i) => node(ctx, w * point[0], h * point[1] + Math.sin(t * 0.002 + i) * 3, 5, "#3ef0c8", ""));
      leave.forEach((point, i) => node(ctx, w * point[0], h * point[1] + Math.sin(t * 0.002 + i + 2) * 3, 5, "#f0d48a", ""));
      ctx.fillStyle = "rgba(220,230,240,0.75)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Stay", w * 0.12, h * 0.92);
      ctx.fillText("Leave", w * 0.72, h * 0.92);
    },
    mesh(ctx, w, h, t, mx, my) {
      const pts = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          const wobble = Math.sin(t * 0.003 + r + c) * 4;
          pts.push({
            x: w * (0.22 + c * 0.12) + wobble + (mx - 0.5) * 16,
            y: h * (0.22 + r * 0.16) + (my - 0.5) * 10
          });
        }
      }
      ctx.strokeStyle = "rgba(126,182,255,0.45)";
      pts.forEach((p, i) => {
        if ((i + 1) % 5 !== 0) link(ctx, p, pts[i + 1], "rgba(126,182,255,0.35)", []);
        if (i + 5 < pts.length) link(ctx, p, pts[i + 5], "rgba(62,240,200,0.35)", []);
      });
      pts.forEach((p, i) => node(ctx, p.x, p.y, i === 12 ? 6 : 3, i === 12 ? "#f0d48a" : "#9cf", ""));
    },
    heatmap(ctx, w, h, t, mx, my) {
      const cols = 10;
      const rows = 6;
      const cw = w / cols;
      const ch = h / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c / cols - (0.62 + (mx - 0.5) * 0.1);
          const dy = r / rows - (0.45 + (my - 0.5) * 0.1);
          const hot = Math.exp(-(dx * dx + dy * dy) * 18) * (0.75 + Math.sin(t * 0.003) * 0.2);
          ctx.fillStyle = `rgba(${Math.round(40 + hot * 180)}, ${Math.round(180 - hot * 40)}, ${Math.round(220 - hot * 80)}, ${0.15 + hot * 0.75})`;
          ctx.fillRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
        }
      }
    },
    rag(ctx, w, h, t, mx, my) {
      const q = { x: w * (0.22 + (mx - 0.5) * 0.05), y: h * 0.5 };
      node(ctx, q.x, q.y, 12, "#3ef0c8", "Query");
      for (let i = 0; i < 5; i++) {
        const doc = {
          x: w * (0.55 + (i % 3) * 0.12),
          y: h * (0.22 + i * 0.13) + Math.sin(t * 0.002 + i) * 4
        };
        const near = i === 1 || i === 3;
        link(ctx, q, doc, near ? "rgba(62,240,200,0.85)" : "rgba(126,182,255,0.25)", near ? [] : [3, 6]);
        ctx.strokeStyle = near ? "#3ef0c8" : "rgba(126,182,255,0.6)";
        ctx.strokeRect(doc.x - 16, doc.y - 12, 32, 22);
      }
      ctx.fillStyle = "rgba(220,230,240,0.7)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("Retrieved passages", w * 0.55, h * 0.9);
    },
    seismic(ctx, w, h, t, mx) {
      ctx.beginPath();
      ctx.strokeStyle = "#7eb6ff";
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= w; x += 3) {
        const n = x / w;
        const quake = Math.exp(-Math.pow((n - ((t * 0.00008 + mx) % 1)) * 8, 2));
        const y = h * 0.5 + Math.sin(n * 28 + t * 0.004) * (6 + quake * 48);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = "rgba(240,212,138,0.9)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("M ≥ 5.0 window", 16, 28);
    },
    curve(ctx, w, h, t, mx) {
      const left = w * 0.14;
      const right = w * 0.92;
      const top = h * 0.16;
      const bottom = h * 0.78;
      ctx.strokeStyle = "rgba(220,230,240,0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left, bottom);
      ctx.lineTo(right, bottom);
      ctx.stroke();
      for (let g = 1; g <= 3; g += 1) {
        const y = bottom - (bottom - top) * (g / 4);
        ctx.strokeStyle = "rgba(220,230,240,0.12)";
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      const bars = [0.34, 0.58, 0.46, 0.82, 0.5, 0.68];
      const slot = (right - left) / bars.length;
      const active = Math.min(bars.length - 1, Math.max(0, Math.floor(mx * bars.length)));
      bars.forEach((value, i) => {
        const height = (bottom - top) * value * (0.92 + Math.sin(t * 0.002 + i) * 0.04);
        const x = left + i * slot + slot * 0.28;
        ctx.fillStyle = i === active ? "#f0d48a" : "#3ef0c8";
        ctx.fillRect(x, bottom - height, slot * 0.44, height);
      });
      ctx.fillStyle = "rgba(220,230,240,0.7)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("value", 8, h * 0.2);
      ctx.fillText("category", left, h * 0.92);
    },
    queue(ctx, w, h, t, mx) {
      const names = ["A", "B", "C", "D"];
      const y = h * (0.46 + (mx - 0.5) * 0.06);
      const start = w * 0.18;
      const gap = (w * 0.7) / (names.length - 1);
      const served = Math.floor(t / 900) % names.length;
      names.forEach((name, i) => {
        const x = start + i * gap;
        if (i < names.length - 1) {
          ctx.strokeStyle = "rgba(62,240,200,0.55)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + 18, y);
          ctx.lineTo(x + gap - 18, y);
          ctx.stroke();
        }
        const on = i === served;
        node(ctx, x, y, on ? 14 : 10, on ? "#f0d48a" : "#3ef0c8", name);
      });
      ctx.fillStyle = "rgba(220,230,240,0.72)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("first served", 16, h * 0.2);
    },
    som(ctx, w, h, t, mx) {
      for (let i = 0; i < 5; i += 1) {
        const y = h * (0.3 + i * 0.1);
        ctx.strokeStyle = "rgba(220,230,240,0.28)";
        ctx.beginPath();
        ctx.moveTo(w * 0.08, y);
        ctx.lineTo(w * 0.92, y);
        ctx.stroke();
      }
      const groups = [
        { name: "Classical", x: 0.22, color: "#7eb6ff" },
        { name: "Jazz", x: 0.5, color: "#f0d48a" },
        { name: "Electronic", x: 0.78, color: "#3ef0c8" }
      ];
      groups.forEach((group, gi) => {
        ctx.fillStyle = "rgba(220,230,240,0.72)";
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(group.name, w * group.x, h * 0.16);
        for (let n = 0; n < 4; n += 1) {
          const drift = Math.sin(t * 0.0025 + gi * 1.4 + n) * 6 + (mx - 0.5) * 12;
          const x = w * group.x + (n - 1.5) * 18 + drift * 0.25;
          const y = h * (0.34 + ((n + gi) % 5) * 0.1);
          const playing = Math.floor(t / 280) % 4 === n && Math.floor(t / 1120) % 3 === gi;
          ctx.fillStyle = group.color;
          ctx.beginPath();
          ctx.ellipse(x, y, playing ? 8 : 6.5, playing ? 5.5 : 4.5, -0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = group.color;
          ctx.beginPath();
          ctx.moveTo(x + 6, y);
          ctx.lineTo(x + 6, y - 20);
          ctx.stroke();
        }
      });
    },
    stack(ctx, w, h, t, mx) {
      const names = ["UI", "API", "Data"];
      const pts = names.map((name, i) => ({
        name,
        x: w * (0.5 + (mx - 0.5) * 0.08),
        y: h * (0.26 + i * 0.24) + Math.sin(t * 0.002 + i) * 3
      }));
      pts.forEach((p, i) => {
        if (i) link(ctx, pts[i - 1], p, "rgba(62,240,200,0.65)", []);
        node(ctx, p.x, p.y, 10, i === 1 ? "#3ef0c8" : "#7eb6ff", p.name);
      });
    },
    track(ctx, w, h, t, mx) {
      const lane = (mx - 0.5) * 0.42;
      ctx.fillStyle = "#10141a";
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.12);
      ctx.lineTo(w * 0.66, h * 0.12);
      ctx.lineTo(w * 0.9, h * 0.9);
      ctx.lineTo(w * 0.1, h * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(62,240,200,0.55)";
      ctx.stroke();
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.12);
      ctx.lineTo(w * 0.66, h * 0.12);
      ctx.lineTo(w * 0.9, h * 0.9);
      ctx.lineTo(w * 0.1, h * 0.9);
      ctx.closePath();
      ctx.clip();
      ctx.strokeStyle = "rgba(244,241,234,0.55)";
      ctx.lineWidth = 2;
      ctx.setLineDash([14, 18]);
      ctx.lineDashOffset = -((t * 0.18) % 32);
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.12);
      ctx.lineTo(w * (0.5 + lane * 0.2), h * 0.9);
      ctx.stroke();
      ctx.restore();
      ctx.setLineDash([]);
      const car = (x, y, scale, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = "#d7dde6";
        ctx.fillRect(-22, -16, 7, 12);
        ctx.fillRect(15, -16, 7, 12);
        ctx.fillRect(-22, 10, 7, 12);
        ctx.fillRect(15, 10, 7, 12);
        ctx.fillStyle = color;
        ctx.fillRect(-16, -26, 32, 52);
        ctx.fillStyle = "#0c1016";
        ctx.fillRect(-10, -14, 20, 16);
        ctx.restore();
      };
      const bob = Math.sin(t * 0.012) * 3;
      car(w * (0.38 - lane * 0.25), h * 0.4, 0.62, "#f0d48a");
      car(w * (0.5 + lane), h * 0.7 + bob, 1, "#3ef0c8");
      ctx.fillStyle = "rgba(220,230,240,0.7)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("steer", w * 0.06, h * 0.16);
    },
    device(ctx, w, h, t, mx) {
      const hub = { x: w * (0.5 + (mx - 0.5) * 0.06), y: h * 0.5 };
      ["Sense", "Act", "Alert"].forEach((name, i) => {
        const ang = -0.9 + i * 0.9 + Math.sin(t * 0.001) * 0.04;
        const p = { x: hub.x + Math.cos(ang) * w * 0.28, y: hub.y + Math.sin(ang) * h * 0.28 };
        link(ctx, p, hub, "rgba(126,182,255,0.7)");
        node(ctx, p.x, p.y, 8, "#7eb6ff", name);
      });
      node(ctx, hub.x, hub.y, 14, "#3ef0c8", "Board");
    },
    waste(ctx, w, h, t, mx) {
      const hub = { x: w * (0.74 + (mx - 0.5) * 0.04), y: h * 0.5 };
      ["Bin", "Sort", "Haul"].forEach((name, i) => {
        const p = { x: w * 0.2, y: h * (0.24 + i * 0.24) + Math.sin(t * 0.002 + i) * 3 };
        link(ctx, p, hub, "rgba(62,240,200,0.55)");
        node(ctx, p.x, p.y, 8, "#7eb6ff", name);
      });
      node(ctx, hub.x, hub.y, 13, "#3ef0c8", "City");
    },
    plastic(ctx, w, h, t, mx) {
      for (let i = 0; i < 5; i++) {
        const x = (t * 0.03 + i * 48) % (w * 0.55);
        ctx.fillStyle = i % 2 ? "rgba(126,182,255,0.85)" : "rgba(240,212,138,0.9)";
        ctx.fillRect(w * 0.06 + x, h * (0.3 + (i % 3) * 0.14), 18, 11);
      }
      node(ctx, w * (0.8 + (mx - 0.5) * 0.04), h * 0.48, 14, "#3ef0c8", "Sort");
    },
    pixels(ctx, w, h, t, mx) {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const edited = r === 1 && c === 2;
          ctx.fillStyle = edited ? "#f0d48a" : "rgba(126,182,255,0.28)";
          ctx.fillRect(w * (0.14 + c * 0.16), h * (0.2 + r * 0.18), w * 0.13, h * 0.14);
        }
      }
      node(ctx, w * (0.14 + 2 * 0.16 + (mx - 0.5) * 0.04), h * 0.16, 4, "#3ef0c8", "Edit");
    },
    beam(ctx, w, h, t, mx) {
      ctx.strokeStyle = "rgba(126,182,255,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.06, h * 0.48);
      ctx.lineTo(w * 0.58, h * 0.48);
      ctx.stroke();
      const x = w * (0.1 + ((t * 0.00025) % 0.45));
      node(ctx, x, h * 0.48, 4, "#f4f1ea", "");
      ctx.beginPath();
      ctx.strokeStyle = "#3ef0c8";
      ctx.ellipse(w * (0.74 + (mx - 0.5) * 0.03), h * 0.48, 34, 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(220,230,240,0.8)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Plasma", w * 0.74, h * 0.82);
    },
    layers(ctx, w, h, t, mx) {
      const names = ["Conv", "Pool", "Class"];
      names.forEach((name, i) => {
        const width = w * (0.62 - i * 0.14);
        const y = h * (0.22 + i * 0.22);
        ctx.strokeStyle = i === 2 ? "#3ef0c8" : "rgba(126,182,255,0.8)";
        ctx.strokeRect((w - width) / 2 + (mx - 0.5) * 8, y, width, h * 0.14);
        ctx.fillStyle = "rgba(220,230,240,0.8)";
        ctx.font = "11px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, w / 2, y + h * 0.1);
      });
    },
    flow(ctx, w, h, t, mx) {
      const names = ["File", "Clean", "Preview"];
      const pts = names.map((name, i) => ({
        name,
        x: w * (0.2 + i * 0.28 + (mx - 0.5) * 0.02),
        y: h * 0.48
      }));
      pts.forEach((p, i) => {
        if (i) link(ctx, pts[i - 1], p, "rgba(62,240,200,0.8)", []);
        node(ctx, p.x, p.y + Math.sin(t * 0.002 + i) * 4, 10, i === 2 ? "#3ef0c8" : "#7eb6ff", p.name);
      });
    },
    agri(ctx, w, h, t, mx, my) {
      const crop = { x: w * 0.5, y: h * (0.32 + (my - 0.5) * 0.06) };
      const farm = { x: w * 0.22, y: h * 0.68 };
      const market = { x: w * (0.78 + (mx - 0.5) * 0.04), y: h * 0.68 };
      link(ctx, farm, crop, "rgba(62,240,200,0.7)");
      link(ctx, market, crop, "rgba(126,182,255,0.7)");
      link(ctx, farm, market, "rgba(240,212,138,0.45)");
      node(ctx, crop.x, crop.y, 12, "#3ef0c8", "Crop");
      node(ctx, farm.x, farm.y, 9, "#7eb6ff", "Farmer");
      node(ctx, market.x, market.y, 9, "#f0d48a", "Market");
    },
    skill(ctx, w, h, t, mx) {
      const a = { x: w * 0.28, y: h * 0.4 };
      const b = { x: w * 0.72, y: h * 0.62 };
      link(ctx, a, b, "rgba(62,240,200,0.8)", []);
      const travel = (t * 0.0003) % 1;
      node(ctx, a.x + (b.x - a.x) * travel, a.y + (b.y - a.y) * travel, 4, "#f0d48a", "");
      node(ctx, a.x + (mx - 0.5) * 6, a.y, 12, "#7eb6ff", "Teach");
      node(ctx, b.x, b.y, 12, "#3ef0c8", "Learn");
    },
    rx(ctx, w, h, t, mx) {
      ["Stock", "Bill", "Give"].forEach((name, i) => {
        const y = h * (0.22 + i * 0.24);
        const width = w * (0.35 + ((i + Math.sin(t * 0.002)) % 1) * 0.25);
        ctx.fillStyle = i === 2 ? "#3ef0c8" : "rgba(126,182,255,0.75)";
        ctx.fillRect(w * 0.28, y, width, 12);
        ctx.fillStyle = "rgba(220,230,240,0.85)";
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(name, w * 0.24, y + 11);
      });
    },
    gem(ctx, w, h, t, mx) {
      const y = h * (0.18 + ((t * 0.00015) % 0.55));
      const x = w * (0.35 + Math.sin(t * 0.001) * 0.12);
      ctx.beginPath();
      ctx.fillStyle = "#f0d48a";
      ctx.moveTo(x, y);
      ctx.lineTo(x + 10, y + 14);
      ctx.lineTo(x, y + 22);
      ctx.lineTo(x - 10, y + 14);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#3ef0c8";
      ctx.fillRect(w * (0.2 + mx * 0.5), h * 0.78, w * 0.22, 8);
      ctx.fillStyle = "rgba(220,230,240,0.8)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Catch", w * 0.5, h * 0.74);
    },
    leak(ctx, w, h, t, mx) {
      const dropY = h * (0.16 + ((t * 0.0002) % 0.4));
      node(ctx, w * 0.28, dropY, 6, "#7eb6ff", "Leak");
      node(ctx, w * 0.55, h * 0.55, 8, "#f0d48a", "Odor");
      node(ctx, w * (0.78 + (mx - 0.5) * 0.04), h * 0.38, 12, "#3ef0c8", "Alert");
    },
    votes(ctx, w, h, t, mx) {
      const tally = { x: w * (0.72 + (mx - 0.5) * 0.04), y: h * 0.48 };
      [0.7, 0.45, 0.3].forEach((v, i) => {
        const y = h * (0.26 + i * 0.2);
        ctx.fillStyle = "rgba(126,182,255,0.8)";
        ctx.fillRect(w * 0.12, y, w * v * 0.35, 8);
        link(ctx, { x: w * 0.12 + w * v * 0.35, y: y + 4 }, tally, "rgba(62,240,200,0.45)");
      });
      node(ctx, tally.x, tally.y, 13, "#3ef0c8", "Score");
    },
    irrigate(ctx, w, h, t, mx) {
      node(ctx, w * 0.24, h * 0.28, 10, "#7eb6ff", "Rain");
      const moist = 0.35 + (Math.sin(t * 0.002) + 1) * 0.15;
      ctx.fillStyle = "#f0d48a";
      ctx.fillRect(w * 0.42, h * 0.62, w * 0.08, -h * moist);
      ctx.fillStyle = "rgba(220,230,240,0.8)";
      ctx.font = "11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Soil", w * 0.46, h * 0.74);
      node(ctx, w * (0.72 + (mx - 0.5) * 0.04), h * 0.42, 12, "#3ef0c8", "Water");
    }
  };

  function mountFilters() {
    const note = document.getElementById("filter-note");
    let active = null;
    document.querySelectorAll(".pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        const key = pill.dataset.filter;
        active = active === key ? null : key;
        document.querySelectorAll(".pill").forEach((p) => p.classList.toggle("on", active && p.dataset.filter === active));
        document.querySelectorAll(".lab").forEach((lab) => {
          const tags = (lab.dataset.tags || "").split(" ");
          lab.classList.toggle("is-hidden", Boolean(active) && !tags.includes(active));
        });
        document.querySelectorAll(".empty").forEach((el) => {
          const grid = document.getElementById(el.dataset.emptyFor);
          const shown = [...grid.querySelectorAll(".segment:not([hidden]) .lab")];
          const any = shown.some((lab) => !lab.classList.contains("is-hidden"));
          el.hidden = any || shown.length === 0;
        });
        if (window.refreshDecks) window.refreshDecks();
        if (active) {
          const label = pill.textContent.trim();
          note.hidden = false;
          note.textContent = `Showing work tagged ${label}. Click the pill again to clear.`;
        } else {
          note.hidden = true;
                }
            });
        });
    }

  function mountDecks() {
    const labels = {
      ml: "ML",
      dl: "DL",
      web: "Web Dev",
      python: "Python",
      opengl: "OpenGL",
      neural: "Neural Network"
    };
    const decks = [];

    const wrap = (grid) => {
      const deck = document.createElement("div");
      deck.className = "deck";
      const prev = document.createElement("button");
      const next = document.createElement("button");
      prev.type = "button";
      next.type = "button";
      prev.className = next.className = "deck-arrow";
      prev.setAttribute("aria-label", "Previous");
      next.setAttribute("aria-label", "Next");
      prev.textContent = "‹";
      next.textContent = "›";
      prev.dataset.dir = "-1";
      next.dataset.dir = "1";
      const frame = document.createElement("div");
      frame.className = "deck-window";
      grid.before(deck);
      deck.append(prev, frame, next);
      frame.append(grid);
      let index = 0;
      const pageSize = () => (window.matchMedia("(max-width: 860px)").matches ? 1 : 2);
      const cards = () => [...grid.querySelectorAll(".segment:not([hidden]) .lab")].filter((lab) => !lab.classList.contains("is-hidden"));
      const render = () => {
        const items = cards();
        const size = pageSize();
        const max = Math.max(0, items.length - size);
        index = Math.max(0, Math.min(index, max));
        const track = grid.querySelector(".segment:not([hidden]) .lab-grid");
        const width = items[0] ? items[0].getBoundingClientRect().width : 0;
        const gap = 18;
        if (track) track.style.transform = `translateX(${-index * (width + gap)}px)`;
        const idle = items.length <= size;
        prev.hidden = next.hidden = idle;
        prev.disabled = index === 0;
        next.disabled = index >= max;
      };
      const step = (dir) => {
        index += dir * pageSize();
        render();
      };
      prev.addEventListener("click", () => step(-1));
      next.addEventListener("click", () => step(1));
      decks.push({ reset() { index = 0; render(); }, render });
      render();
    };

    const tabsFor = (segments, names) => {
      const bar = document.createElement("div");
      bar.className = "seg-tabs" + (names ? " sub" : "");
      segments.forEach((seg, i) => {
        const id = seg.dataset.deck;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "seg-tab" + (i === 0 ? " on" : "");
        btn.dataset.for = id;
        btn.textContent = names ? names[id] : seg.querySelector("h3").textContent;
        btn.addEventListener("click", () => {
          segments.forEach((item) => { item.hidden = item !== seg; });
          if (seg.dataset.family === "software") {
            document.querySelectorAll("#project-grid .segment[data-family='hardware']").forEach((item) => { item.hidden = true; });
          }
          bar.querySelectorAll(".seg-tab").forEach((tab) => tab.classList.toggle("on", tab === btn));
          decks.forEach((deck) => deck.reset());
        });
        bar.append(btn);
        seg.hidden = i !== 0;
      });
      return bar;
    };

    const papers = document.getElementById("paper-grid");
    const paperSegs = [...papers.querySelectorAll(":scope > .segment")];
    papers.before(tabsFor(paperSegs));
    wrap(papers);

    const projects = document.getElementById("project-grid");
    const projectSegs = [...projects.querySelectorAll(":scope > .segment")];
    const software = projectSegs.filter((seg) => seg.dataset.family === "software");
    const hardware = projectSegs.filter((seg) => seg.dataset.family === "hardware");
    const familyBar = document.createElement("div");
    familyBar.className = "seg-tabs";
    const subBar = tabsFor(software, labels);
    hardware.forEach((seg) => { seg.hidden = true; });
    const pickFamily = (name) => {
      familyBar.querySelectorAll(".seg-tab").forEach((tab) => tab.classList.toggle("on", tab.dataset.for === name));
      const softwareOn = name === "software";
      subBar.hidden = !softwareOn;
      if (softwareOn) {
        const current = subBar.querySelector(".seg-tab.on") || subBar.querySelector(".seg-tab");
        current.click();
      } else {
        software.forEach((seg) => { seg.hidden = true; });
        hardware.forEach((seg, i) => { seg.hidden = i !== 0; });
        decks.forEach((deck) => deck.reset());
      }
    };
    ["software", "hardware"].forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seg-tab" + (name === "software" ? " on" : "");
      btn.dataset.for = name;
      btn.textContent = name === "software" ? "Software" : "Hardware";
      btn.addEventListener("click", () => pickFamily(name));
      familyBar.append(btn);
    });
    projects.before(familyBar);
    projects.before(subBar);
    wrap(projects);

    window.refreshDecks = () => decks.forEach((deck) => deck.render());
    window.addEventListener("resize", window.refreshDecks);
    requestAnimationFrame(window.refreshDecks);
  }

  function mountDialog() {
    const dialog = document.getElementById("lab-dialog");
    const body = document.getElementById("dialog-body");
    const kicker = document.getElementById("dialog-kicker");
    window.openLab = (source) => {
      const lab = source.closest(".lab");
      if (!lab) return;
      const title = lab.querySelector("h3").textContent;
      const authors = lab.querySelector(".authors");
      const detail = lab.querySelector(".lab-detail");
      const status = lab.querySelector(".status");
      kicker.textContent = status ? status.textContent : "";
      body.innerHTML = `<h3>${title}</h3>${authors ? `<p>${authors.innerHTML}</p>` : ""}${detail ? detail.innerHTML : ""}`;
      if (!dialog.open) dialog.showModal();
    };
    document.querySelectorAll(".lab-foot").forEach((foot) => {
      if (foot.querySelector(".open-lab")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "open-lab";
      button.textContent = "Overview";
      foot.prepend(button);
    });
    document.querySelectorAll(".lab").forEach((lab) => {
      lab.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        if (event.target.closest("button") && !event.target.closest(".open-lab")) return;
        window.openLab(lab);
      });
    });
    document.getElementById("dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  function mountOrbit() {
    const orbs = [...document.querySelectorAll(".orb")];
    let index = orbs.findIndex((orb) => orb.querySelector(".fa-envelope"));
    if (index < 0) index = 0;
    const lead = document.getElementById("contact-lead");

    const render = () => {
      const n = orbs.length;
      const narrow = window.matchMedia("(max-width: 720px)").matches;
      const spacing = narrow ? 58 : 92;
      orbs.forEach((orb, i) => {
        let offset = i - index;
        if (offset > n / 2) offset -= n;
        if (offset < -n / 2) offset += n;
        const distance = Math.abs(offset);
        orb.classList.toggle("center", offset === 0);
        if (offset === 0) {
          orb.style.transform = "translateX(0) scale(1.45)";
          orb.style.opacity = "1";
          orb.style.zIndex = "10";
            } else {
          const scale = Math.max(0.55, 1 - distance * 0.16);
          orb.style.transform = `translateX(${offset * spacing}px) scale(${scale})`;
          orb.style.opacity = String(Math.max(0.18, 1 - distance * 0.28));
          orb.style.zIndex = String(10 - distance);
        }
      });
      lead.textContent = orbs[index].dataset.label;
    };

    orbs.forEach((orb, i) => {
      orb.addEventListener("click", (event) => {
        if (i !== index) {
          event.preventDefault();
          index = i;
          render();
        }
      });
    });

    window.stepContact = (dir) => {
      index = (index + dir + orbs.length) % orbs.length;
      render();
      return lead.textContent;
    };
    document.querySelectorAll(".arrow").forEach((btn) => {
      btn.addEventListener("click", () => window.stepContact(Number(btn.dataset.dir)));
    });
    window.addEventListener("resize", render);
    render();
    }
});
