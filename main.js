document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark";

  body.setAttribute("data-theme", savedTheme);

  const setupThemeToggle = (activeToggle) => {
    if (!activeToggle) return;
    activeToggle.setAttribute("aria-pressed", localStorage.getItem("theme") === "light");
    activeToggle.addEventListener("click", () => {
      const current = body.getAttribute("data-theme");
      const nextTheme = current === "light" ? "dark" : "light";
      body.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      document.querySelectorAll(".theme-toggle").forEach(btn => {
        btn.setAttribute("aria-pressed", nextTheme === "light");
      });
    });
  };

  setupThemeToggle(themeToggle);
  setupThemeToggle(document.getElementById("mobile-theme-toggle"));


  const menuToggle = document.getElementById("menu-toggle");
  const dashboardToggle = document.querySelector(".nav-dashboard-icon");
  const mobileMenu = document.getElementById("mobile-menu");
  const toggles = [menuToggle, dashboardToggle].filter(Boolean);

  if (mobileMenu && toggles.length) {
    const setExpanded = (value) => {
      toggles.forEach((toggle) => toggle.setAttribute("aria-expanded", value));
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      setExpanded("false");
    };

    const openMenu = () => {
      mobileMenu.classList.add("open");
      mobileMenu.setAttribute("aria-hidden", "false");
      setExpanded("true");
    };

    setExpanded("false");
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        if (mobileMenu.classList.contains("open")) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    });

    mobileMenu.addEventListener("click", (event) => {
      if (event.target === mobileMenu || event.target.hasAttribute("data-close")) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  // --- PREMIUM ANIMATIONS & EFFECTS ---

  // 1. Inject Noise Overlay
  const noise = document.createElement("div");
  noise.className = "noise-overlay";
  body.appendChild(noise);

  // 2. Enhanced Intersection Observer for Reveals
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll(".reveal, .reveal-zoom, .reveal-slide, .hero-premium, .neo-card").forEach(el => {
    revealObserver.observe(el);
  });

  // 3. Multi-Layer Parallax Effect
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    // Primary Hero Parallax (Sitewide)
    const sitewideParallax = document.querySelectorAll(".hero-bg-media");
    sitewideParallax.forEach(layer => {
      layer.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
    });

    // Advanced Multi-Layer Parallax (Home 1)
    const layers = document.querySelectorAll(".parallax-layer");
    layers.forEach(layer => {
      const speed = layer.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      layer.style.transform = `translateY(${yPos}px)`;
    });
  });

  // 4a. Mouse Tracking for Card Glow (Site-wide)
  document.querySelectorAll(".neo-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });

  // 4b. 3D Product Viewer (Home 2)
  const viewer = document.querySelector(".product-3d-viewer");
  const model = document.querySelector(".product-model-container");

  if (viewer && model) {
    let isDragging = false;
    let startX;
    let rotation = 0;

    const startDrag = (e) => {
      isDragging = true;
      startX = e.pageX || e.touches[0].pageX;
      viewer.style.cursor = "grabbing";
    };

    const endDrag = () => {
      isDragging = false;
      viewer.style.cursor = "grab";
    };

    const drag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX || e.touches[0].pageX;
      const walk = (x - startX) * 0.5;
      rotation += walk;
      startX = x;
      model.style.transform = `rotateY(${rotation}deg)`;
    };

    viewer.addEventListener("mousedown", startDrag);
    viewer.addEventListener("touchstart", startDrag);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    viewer.addEventListener("mousemove", drag);
    viewer.addEventListener("touchmove", drag);

    // Zoom Logic
    let scale = 1;
    viewer.addEventListener("wheel", (e) => {
      e.preventDefault();
      scale += e.deltaY * -0.001;
      scale = Math.min(Math.max(0.5, scale), 2);
      model.style.transform = `rotateY(${rotation}deg) scale(${scale})`;
    });
  }

  // 5. Page Transitions
  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#") && !link.getAttribute("target") && !href.startsWith("http")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        body.classList.add("page-loading");
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    }
  });

  window.addEventListener("load", () => {
    body.classList.remove("page-loading");

    // 6. AI Text Scramble Effect
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = "!<>-_\\/[]{}—=+*^?#________";
        this.update = this.update.bind(this);
      }
      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || "";
          const to = newText[i] || "";
          const start = Math.floor(Math.random() * 20); // Faster start
          const end = start + Math.floor(Math.random() * 25); // Faster end
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
      update() {
        let output = "";
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += `<span class="scramble-char">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    const titles = document.querySelectorAll(".hero-title");
    titles.forEach((title) => {
      const fx = new TextScramble(title);
      const originalText = title.innerText;
      fx.setText(originalText);
    });
  });

  // --- EXISTING LOGIC ---
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      let valid = true;
      const message = form.querySelector(".form-message");
      const inputs = form.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        input.classList.remove("invalid");
        if (!input.checkValidity()) {
          valid = false;
          input.classList.add("invalid");
        }
      });

      if (!valid) {
        event.preventDefault();
        if (message) {
          message.textContent = "Please complete all required fields.";
        }
      } else {
        event.preventDefault();
        if (message) {
          message.textContent = "Submitted successfully.";
        }
      }
    });
  });
});

/* --- Energy Streak Background Animation --- */
function initAntiGravity() {
  let container = document.getElementById('anti-gravity-bg');
  if (!container) {
    container = document.createElement('div');
    container.id = 'anti-gravity-bg';
    document.body.prepend(container);
  }

  const particleCount = 30; // Number of streaks
  const particleClass = 'energy-streak';

  for (let i = 0; i < particleCount; i++) {
    createParticle(container, particleClass);
  }
}

function createParticle(parent, particleClass) {
  const p = document.createElement('div');
  p.classList.add(particleClass);

  // Randomize properties
  const height = Math.random() * 80 + 40; // 40px to 120px height
  const startX = Math.random() * 100; // 0% to 100% width
  const duration = Math.random() * 10 + 5; // 5s to 15s speed
  const delay = Math.random() * -15; // Negative delay
  const drift = Math.random() * 60 - 30; // -30px to 30px horizontal drift
  const maxOpacity = Math.random() * 0.4 + 0.2; // Substle opacity

  // Apply styles
  p.style.height = `${height}px`;
  p.style.left = `${startX}%`;
  p.style.top = '0'; // align to top, transform handles Y position

  // Custom Variables for CSS
  p.style.setProperty('--duration', `${duration}s`);
  p.style.setProperty('--drift', `${drift}px`);
  p.style.setProperty('--max-opacity', maxOpacity);

  p.style.animationDelay = `${delay}s`;

  parent.appendChild(p);
}

// Initialize background
document.addEventListener("DOMContentLoaded", () => {
  initAntiGravity();
});




