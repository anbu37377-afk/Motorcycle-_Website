document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "dark";

  body.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", savedTheme === "light");
    themeToggle.addEventListener("click", () => {
      const current = body.getAttribute("data-theme");
      const nextTheme = current === "light" ? "dark" : "light";
      body.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      themeToggle.setAttribute("aria-pressed", nextTheme === "light");
    });
  }

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
