const translatable = document.querySelectorAll("[data-pt][data-en]");
const nav = document.getElementById("main-nav");
const menuButton = document.querySelector(".menu-btn");
const header = document.querySelector(".header");
const LANG_KEY = "hxwkxnn_lang";

function applyLanguage(lang) {
  const selected = lang === "en" ? "en" : "pt";
  document.documentElement.lang = selected === "pt" ? "pt-BR" : "en";

  translatable.forEach((element) => {
    const text = element.dataset[selected];
    if (text) element.textContent = text;
  });

  document.querySelectorAll("[data-pt-aria-label][data-en-aria-label]").forEach((element) => {
    const value = selected === "en"
      ? element.getAttribute("data-en-aria-label")
      : element.getAttribute("data-pt-aria-label");
    if (value) element.setAttribute("aria-label", value);
  });

  document.querySelectorAll("[data-pt-href][data-en-href]").forEach((element) => {
    const value = selected === "en"
      ? element.getAttribute("data-en-href")
      : element.getAttribute("data-pt-href");
    if (value) element.setAttribute("href", value);
  });

  const pageTitles = {
    pt: {
      "home.html": "HXWKXNN Tech — Privacidade, Segurança e Desenvolvimento",
      "sobre.html": "Sobre — HXWKXNN Tech",
      "system-manager.html": "HXWKXNN System Manager — Privacidade e Segurança",
      "index.html": "Links — HXWKXNN Tech",
      "links.html": "Links — HXWKXNN Tech"
    },
    en: {
      "home.html": "HXWKXNN Tech — Privacy, Security and Development",
      "sobre.html": "About — HXWKXNN Tech",
      "system-manager.html": "HXWKXNN System Manager — Privacy and Security",
      "index.html": "Links — HXWKXNN Tech",
      "links.html": "Links — HXWKXNN Tech"
    }
  };

  const currentPage = normalizePageName(window.location.pathname);
  const localizedTitle = pageTitles[selected]?.[currentPage];
  if (localizedTitle) document.title = localizedTitle;

  document.querySelectorAll(".lang-switch button").forEach((button) => {
    const label = (button.getAttribute("aria-label") || "").toLowerCase();
    const isActive = selected === "pt"
      ? label.includes("portugu")
      : label.includes("english");
    button.classList.toggle("active", isActive);
  });
}

function setLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang === "en" ? "en" : "pt");
  applyLanguage(lang);
}

function toggleMenu() {
  if (!nav) return;
  const open = nav.classList.toggle("open");
  menuButton?.setAttribute("aria-expanded", String(open));
}

function closeMenu() {
  nav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
}

function getHeaderOffset() {
  const headerHeight = header?.getBoundingClientRect().height || 76;
  return Math.ceil(headerHeight + 26);
}

function scrollToSection(target, behavior = "smooth") {
  if (!target) return;

  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const top = Math.max(0, targetTop - getHeaderOffset());

  window.scrollTo({ top, behavior });
}

function normalizePageName(pathname) {
  const page = pathname.split("/").pop() || "home.html";
  return page.toLowerCase();
}

function isHomePage() {
  const currentPage = normalizePageName(window.location.pathname);
  return currentPage === "home.html" || currentPage === "";
}

// Navegação por âncoras com compensação precisa do cabeçalho fixo.
document.querySelectorAll('a[href*="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const rawHref = link.getAttribute("href") || "";
    const [pagePart, hashPart] = rawHref.split("#");
    if (!hashPart) {
      closeMenu();
      return;
    }

    const targetPage = pagePart ? normalizePageName(pagePart) : normalizePageName(window.location.pathname);
    const currentPage = normalizePageName(window.location.pathname);
    const samePage = !pagePart || targetPage === currentPage || (isHomePage() && targetPage === "home.html");

    if (!samePage) {
      closeMenu();
      return;
    }

    const target = document.getElementById(hashPart);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    history.pushState(null, "", `#${hashPart}`);
    scrollToSection(target);
  });
});

applyLanguage(localStorage.getItem(LANG_KEY) || "pt");

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

function setActiveNavigation() {
  const links = [...document.querySelectorAll("#main-nav a")];
  if (!links.length) return;

  const currentPage = normalizePageName(window.location.pathname);
  const home = currentPage === "home.html" || currentPage === "";

  if (!home) {
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const targetPage = normalizePageName(href.split("#")[0]);
      link.classList.toggle("active", targetPage === currentPage);
    });
    return;
  }

  const sectionLinks = links.filter((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#");
  });

  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const updateSection = () => {
    const marker = window.scrollY + getHeaderOffset() + 42;
    const atPageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
    let currentId = sections[0].id;

    if (atPageBottom) {
      currentId = sections[sections.length - 1].id;
    } else {
      for (const section of sections) {
        if (section.offsetTop <= marker) currentId = section.id;
      }
    }

    links.forEach((link) => link.classList.remove("active"));
    sectionLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  updateSection();
  window.addEventListener("scroll", updateSection, { passive: true });
  window.addEventListener("resize", updateSection);
  window.addEventListener("hashchange", updateSection);
}

setActiveNavigation();

// Corrige também a posição ao entrar em home.html#projetos vindo de outra página.
window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;

  window.setTimeout(() => scrollToSection(target, "auto"), 60);
});
