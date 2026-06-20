const translatable = document.querySelectorAll("[data-pt][data-en]");
const modal = document.getElementById("language-modal");
const nav = document.getElementById("main-nav");

function applyLanguage(lang) {
  const selectedLang = lang === "en" ? "en" : "pt";
  document.documentElement.lang = selectedLang === "pt" ? "pt-BR" : "en";

  translatable.forEach((el) => {
    const text = el.dataset[selectedLang];
    if (text) el.textContent = text;
  });
}

function closeLanguageModal() {
  if (!modal) return;
  modal.classList.add("is-hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openLanguageModal() {
  if (!modal) return;
  modal.classList.remove("is-hidden");
  modal.removeAttribute("aria-hidden");
  document.body.classList.add("modal-open");
}

function setLanguage(lang) {
  const selectedLang = lang === "en" ? "en" : "pt";
  try {
    localStorage.setItem("hx_language", selectedLang);
  } catch (error) {
    console.warn("Não foi possível salvar o idioma no navegador.", error);
  }

  applyLanguage(selectedLang);
  closeLanguageModal();
}

function toggleMenu() {
  if (!nav) return;
  nav.classList.toggle("open");
}

// Garante que os botões do popup funcionem mesmo se o cache ignorar o onclick antigo.
document.querySelectorAll(".language-buttons button").forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent.toLowerCase();
    setLanguage(buttonText.includes("english") ? "en" : "pt");
  });
});

document.querySelectorAll("#main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (nav) nav.classList.remove("open");
  });
});

let savedLanguage = null;
try {
  savedLanguage = localStorage.getItem("hx_language");
} catch (error) {
  savedLanguage = null;
}

if (savedLanguage) {
  applyLanguage(savedLanguage);
  closeLanguageModal();
} else {
  applyLanguage("pt");
  openLanguageModal();
}

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
