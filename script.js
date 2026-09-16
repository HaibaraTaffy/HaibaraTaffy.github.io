document.documentElement.classList.add("js");

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "light" || storedTheme === "dark") {
  root.dataset.theme = storedTheme;
}

themeButton?.addEventListener("click", () => {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentDark = root.dataset.theme ? root.dataset.theme === "dark" : systemDark;
  const nextTheme = currentDark ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("theme", nextTheme);
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

const backgroundSlides = [...document.querySelectorAll(".background-slide")];
const backgroundSections = [...document.querySelectorAll("[data-background]")];
let activeBackground = 0;
let backgroundFrame = 0;

const showBackground = (index) => {
  if (index === activeBackground || !backgroundSlides[index]) return;
  backgroundSlides[activeBackground]?.classList.remove("is-active");
  backgroundSlides[index].classList.add("is-active");
  activeBackground = index;
};

const updateBackground = () => {
  const focusLine = window.innerHeight * 0.48;
  let nextBackground = 0;

  backgroundSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= focusLine) {
      nextBackground = Number(section.dataset.background) || 0;
    }
  });

  showBackground(nextBackground);
  backgroundFrame = 0;
};

window.addEventListener("scroll", () => {
  if (!backgroundFrame) backgroundFrame = requestAnimationFrame(updateBackground);
}, { passive: true });

window.addEventListener("resize", updateBackground);
updateBackground();
