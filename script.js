document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggle ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const toggleIcon = themeToggleBtn.querySelector("i");

  // Check for saved theme
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
  } else {
    document.body.classList.remove("light-mode");
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
  }

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    let theme = "dark";
    if (document.body.classList.contains("light-mode")) {
      theme = "light";
      toggleIcon.classList.remove("fa-sun");
      toggleIcon.classList.add("fa-moon");
    } else {
      toggleIcon.classList.remove("fa-moon");
      toggleIcon.classList.add("fa-sun");
    }
    localStorage.setItem("theme", theme);
  });

  // --- Scroll-Reveal Animation ---
  // This creates the "fade-in" effect as you scroll down

  const sectionsToFade = document.querySelectorAll(".fade-in-section");

  const observerOptions = {
    root: null, // observes intersections relative to the viewport
    rootMargin: "0px",
    threshold: 0.15, // 15% of the element must be visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Stop observing once it's visible
      }
    });
  }, observerOptions);

  sectionsToFade.forEach((section) => {
    observer.observe(section);
  });

  // Smooth scroll is handled by CSS 'scroll-behavior: smooth'

  // --- Mobile Nav Toggle ---
  const menuToggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("primary-navigation");
  const headerEl = document.querySelector(".header");

  // Set CSS var for header height to place dropdown just below
  const setHeaderHeightVar = () => {
    if (headerEl) {
      const h = headerEl.offsetHeight;
      document.documentElement.style.setProperty("--header-height", `${h}px`);
    }
  };
  setHeaderHeightVar();
  window.addEventListener("resize", setHeaderHeightVar);

  if (menuToggleBtn && navMenu) {
    let navBackdropEl = null;
    const updateBackdropSize = () => {
      if (navBackdropEl && navMenu) {
        navBackdropEl.style.height = `${navMenu.offsetHeight}px`;
      }
    };

    menuToggleBtn.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      menuToggleBtn.setAttribute("aria-expanded", String(isOpen));
      const icon = menuToggleBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
      // Ensure header height var is up to date when opening
      if (isOpen) {
        setHeaderHeightVar();
        if (!navBackdropEl || !document.body.contains(navBackdropEl)) {
          navBackdropEl = document.createElement("div");
          navBackdropEl.className = "nav-backdrop";
          document.body.appendChild(navBackdropEl);
        }
        // Wait a tick to ensure layout updated, then size backdrop
        setTimeout(updateBackdropSize, 0);
        window.addEventListener("resize", updateBackdropSize);
      } else {
        if (navBackdropEl) {
          navBackdropEl.remove();
          navBackdropEl = null;
        }
        window.removeEventListener("resize", updateBackdropSize);
      }
    });

    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (document.body.classList.contains("nav-open")) {
          document.body.classList.remove("nav-open");
          menuToggleBtn.setAttribute("aria-expanded", "false");
          const icon = menuToggleBtn.querySelector("i");
          if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
          }
          // Remove backdrop when closing via link
          const existingBackdrop = document.querySelector(".nav-backdrop");
          if (existingBackdrop) existingBackdrop.remove();
          navBackdropEl = null;
          window.removeEventListener("resize", updateBackdropSize);
        }
      });
    });
  }
});
