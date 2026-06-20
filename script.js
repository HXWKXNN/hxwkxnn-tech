const translatable = document.querySelectorAll("[data-pt][data-en]");
const modal = document.getElementById("language-modal");
const nav = document.getElementById("main-nav");

function applyLanguage(lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  translatable.forEach((el) => {
    el.textContent = el.dataset[lang];
  });
}

function setLanguage(lang) {
  localStorage.setItem("hx_language", lang);
  applyLanguage(lang);
  modal.style.display = "none";
}

function toggleMenu() {
  nav.classList.toggle("open");
}

document.querySelectorAll("#main-nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const savedLanguage = localStorage.getItem("hx_language");
if (savedLanguage) {
  applyLanguage(savedLanguage);
  modal.style.display = "none";
} else {
  applyLanguage("pt");
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
