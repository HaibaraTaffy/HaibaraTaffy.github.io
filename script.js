document.documentElement.classList.add("js");

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const visualThemeButton = document.querySelector(".visual-theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const storedTheme = localStorage.getItem("theme");
const storedVisualTheme = localStorage.getItem("visual-theme");

if (storedTheme === "light" || storedTheme === "dark") {
  root.dataset.theme = storedTheme;
}

if (storedVisualTheme === "taffy" || storedVisualTheme === "haibara") {
  root.dataset.visualTheme = storedVisualTheme;
}

const updateVisualThemeButton = () => {
  const isHaibara = root.dataset.visualTheme === "haibara";
  visualThemeButton?.setAttribute("aria-label", isHaibara ? "切换到小菲主题" : "切换到灰原哀主题");
  visualThemeButton?.setAttribute("aria-pressed", String(isHaibara));
};

const updateThemeColor = () => {
  const backgroundColor = getComputedStyle(root).getPropertyValue("--bg").trim();
  if (backgroundColor) themeColorMeta?.setAttribute("content", backgroundColor);
};

updateVisualThemeButton();
updateThemeColor();

visualThemeButton?.addEventListener("click", () => {
  const nextVisualTheme = root.dataset.visualTheme === "haibara" ? "taffy" : "haibara";
  root.dataset.visualTheme = nextVisualTheme;
  localStorage.setItem("visual-theme", nextVisualTheme);
  updateVisualThemeButton();
  updateThemeColor();
});

themeButton?.addEventListener("click", () => {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentDark = root.dataset.theme ? root.dataset.theme === "dark" : systemDark;
  const nextTheme = currentDark ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  updateThemeColor();
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
}

const backgroundSlides = [...document.querySelectorAll('.background-slide[data-visual="taffy"]')];
const backgroundSections = [...document.querySelectorAll("[data-background]")];
let activeBackground = 0;

const showBackground = (index) => {
  if (index === activeBackground || !backgroundSlides[index]) return;
  backgroundSlides[activeBackground]?.classList.remove("is-active");
  backgroundSlides[index].classList.add("is-active");
  activeBackground = index;
};

if ("IntersectionObserver" in window) {
  const backgroundObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) showBackground(Number(entry.target.dataset.background) || 0);
    });
  }, { rootMargin: "-46% 0px -46% 0px" });

  backgroundSections.forEach((section) => backgroundObserver.observe(section));
}
