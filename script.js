const translatable = document.querySelectorAll("[data-pt][data-en]");
const modal = document.getElementById("language-modal");
const nav = document.getElementById("main-nav");

function applyLanguage(lang) {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  translatable.forEach((el) => {
    el.textContent = el.dataset[lang];
  });
}

function closeLanguageModal() {
  if (!modal) return;
  modal.classList.add("is-hidden");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
}

function openLanguageModal() {
  if (!modal) return;
  modal.classList.remove("is-hidden");
  modal.style.display = "flex";
  document.body.classList.add("modal-open");
}

function setLanguage(lang) {
  localStorage.setItem("hx_language", lang);
  applyLanguage(lang);
  closeLanguageModal();
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
  closeLanguageModal();
} else {
  applyLanguage("pt");
  openLanguageModal();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
