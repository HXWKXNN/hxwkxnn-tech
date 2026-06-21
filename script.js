const translatable = document.querySelectorAll("[data-pt][data-en]");
const nav = document.getElementById("main-nav");

function applyLanguage(lang) {
  const selectedLang = lang === "en" ? "en" : "pt";
  document.documentElement.lang = selectedLang === "pt" ? "pt-BR" : "en";

  translatable.forEach((el) => {
    const text = el.dataset[selectedLang];
    if (text) el.textContent = text;
  });
}

function setLanguage(lang) {
  applyLanguage(lang);
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

applyLanguage("pt");

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
