"use strict";

const header = document.querySelector("#site-header, .site-header");
const menuToggle = document.querySelector("#menu-toggle, .menu-toggle");
const mainNav = document.querySelector("#main-nav, .main-nav");

if (header) {
    const updateHeader = () => {
        const scrolled = window.scrollY > 24;
        header.classList.toggle("is-scrolled", scrolled);
        header.classList.toggle("scrolled", scrolled); // compatibilité avec les anciens styles
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && mainNav) {
    const closeMenu = () => {
        mainNav.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        menuToggle.classList.toggle("is-active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
        if (!mainNav.classList.contains("is-open")) return;
        if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeMenu();
    });
}

/* Google Agenda : vue mensuelle sur grand écran, vue liste sur mobile. */
const calendarFrame = document.querySelector(".google-calendar");
if (calendarFrame) {
    const desktopSrc = calendarFrame.getAttribute("src");
    const mobileQuery = window.matchMedia("(max-width: 680px)");

    const updateCalendarMode = () => {
        const url = new URL(desktopSrc, window.location.href);
        url.searchParams.set("mode", mobileQuery.matches ? "AGENDA" : "MONTH");
        const nextSrc = url.toString();
        if (calendarFrame.src !== nextSrc) calendarFrame.src = nextSrc;
    };

    updateCalendarMode();
    mobileQuery.addEventListener?.("change", updateCalendarMode);
}
