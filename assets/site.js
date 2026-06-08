const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const modal = document.querySelector("[data-modal]");
const openContactButtons = document.querySelectorAll("[data-open-contact]");
const closeContactButtons = document.querySelectorAll("[data-close-contact]");
const year = document.querySelector("[data-year]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const parallaxPortraits = document.querySelectorAll("[data-portrait-parallax]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

const syncScrollProgress = () => {
  if (!scrollProgress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

syncHeader();
syncScrollProgress();
window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("scroll", syncScrollProgress, { passive: true });
window.addEventListener("resize", syncScrollProgress);

const resetPortraitParallax = (portrait) => {
  portrait.style.setProperty("--portrait-x", "0px");
  portrait.style.setProperty("--portrait-y", "0px");
  portrait.style.setProperty("--portrait-rx", "0deg");
  portrait.style.setProperty("--portrait-ry", "0deg");
  portrait.style.setProperty("--portrait-img-x", "0px");
  portrait.style.setProperty("--portrait-img-y", "0px");
  portrait.style.setProperty("--portrait-card-x", "0px");
  portrait.style.setProperty("--portrait-card-y", "0px");
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!prefersReducedMotion.matches) {
  parallaxPortraits.forEach((portrait) => {
    portrait.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      portrait.style.setProperty("--portrait-x", `${(x * 14).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-y", `${(y * 10).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-rx", `${(-y * 4).toFixed(2)}deg`);
      portrait.style.setProperty("--portrait-ry", `${(x * 5).toFixed(2)}deg`);
      portrait.style.setProperty("--portrait-img-x", `${(-x * 12).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-img-y", `${(-y * 9).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-card-x", `${(x * 8).toFixed(2)}px`);
      portrait.style.setProperty("--portrait-card-y", `${(y * 6).toFixed(2)}px`);
    });

    portrait.addEventListener("pointerleave", () => resetPortraitParallax(portrait));
  });
}

const closeMenu = () => {
  if (!nav || !menuToggle) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

const openModal = () => {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeMenu();
  const closeButton = modal.querySelector("[data-close-contact]");
  closeButton?.focus();
};

const closeModal = () => {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
};

openContactButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeContactButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeMenu();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -60px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});
