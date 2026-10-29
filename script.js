
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS
  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-link");
  const backToTop = document.getElementById("back-to-top");
  const yearElement = document.getElementById("current-year");
  const revealElements = document.querySelectorAll(".reveal");

  // ANNÉE AUTOMATIQUE
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // MENU MOBILE
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    navLinks.classList.remove("open");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Ouvrir le menu" : "Fermer le menu"
      );

      navLinks.classList.toggle("open", !isOpen);
    });

    // Fermer le menu après un clic sur un lien
    navItems.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Fermer le menu si l'utilisateur clique à l'extérieur
    document.addEventListener("click", (event) => {
      const clickedInsideMenu =
        navLinks.contains(event.target) ||
        menuToggle.contains(event.target);

      if (!clickedInsideMenu) {
        closeMenu();
      }
    });

    // Fermer le menu lors du passage à un écran large
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // EFFETS AU DÉFILEMENT
  function updateScrollEffects() {
    const scrollPosition = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", scrollPosition > 20);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollPosition > 450);
    }
  }

  window.addEventListener("scroll", updateScrollEffects, {
    passive: true
  });

  updateScrollEffects();

  // ANIMATION D'APPARITION DES ÉLÉMENTS
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // NAVIGATION ACTIVE SELON LA SECTION
  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visibleSections.length) return;

        const activeId = visibleSections[0].target.id;

        navItems.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // LIENS INTERNES : DÉFILEMENT FLUIDE
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      // Mettre à jour l'URL sans recharger la page
      history.replaceState(null, "", href);
    });
  });

  console.log(
    "%cPortfolio chargé avec succès !",
    "color: #a99bff; font-weight: bold; font-size: 14px;"
  );
});
