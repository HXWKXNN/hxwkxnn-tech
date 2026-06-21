const translatable = document.querySelectorAll("[data-pt][data-en]");
const nav = document.getElementById("main-nav");
const LANG_KEY = "hxwkxnn_lang";

function applyLanguage(lang) {
  const selectedLang = lang === "en" ? "en" : "pt";
  document.documentElement.lang = selectedLang === "pt" ? "pt-BR" : "en";

  translatable.forEach((el) => {
    const text = el.dataset[selectedLang];
    if (text) el.textContent = text;
  });

  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    const isActive =
      (selectedLang === "pt" && btn.getAttribute("aria-label")?.toLowerCase().includes("portugu")) ||
      (selectedLang === "en" && btn.getAttribute("aria-label")?.toLowerCase().includes("english"));

    btn.classList.toggle("active", Boolean(isActive));
  });
}

function setLanguage(lang) {
  const selectedLang = lang === "en" ? "en" : "pt";
  localStorage.setItem(LANG_KEY, selectedLang);
  applyLanguage(selectedLang);
}

function toggleMenu() {
  if (!nav) return;
  nav.classList.toggle("open");
}

document.querySelectorAll("#main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (nav) nav.classList.remove("open");
  });
});

const savedLang = localStorage.getItem(LANG_KEY) || "pt";
applyLanguage(savedLang);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
}

function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll("#main-nav a"));
  const isHomePage = Boolean(document.querySelector('#main-nav a[href="#services"]'));

  if (!isHomePage) return;

  const sectionIds = ["top", "services", "projects", "stack", "process", "plans", "faq", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const setActiveNav = (currentId) => {
    navLinks.forEach((link) => link.classList.remove("active"));

    const activeLink = navLinks.find((link) => {
      const href = link.getAttribute("href") || "";
      if (currentId === "top") return href === "index.html#top" || href === "#top" || href.endsWith("#top");
      return href === `#${currentId}` || href === `index.html#${currentId}` || href.endsWith(`#${currentId}`);
    });

    if (activeLink) activeLink.classList.add("active");
  };

  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 150;
    let currentId = "top";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentId = section.id;
      }
    });

    const nearBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;

    if (nearBottom && document.getElementById("contact")) {
      currentId = "contact";
    }

    setActiveNav(currentId);
  };

  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("hashchange", updateActiveSection);
}

initScrollSpy();

