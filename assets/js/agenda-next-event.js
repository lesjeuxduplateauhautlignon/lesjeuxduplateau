/*
 * Sprint 2.8.1 — Prochaine rencontre automatique
 *
 * Une fois le Web App Google Apps Script déployé, collez son URL ci-dessous.
 * Exemple : https://script.google.com/macros/s/AKfycb.../exec
 */
const NEXT_EVENT_ENDPOINT = "https://script.google.com/macros/s/AKfycbygSQGbCADzybgrcnB6c0ugxdOgSpaYOxQvd1CU-YS533INcZN4OjGD_wumuFZI-i4C/exec";

(function () {
    "use strict";

    const elements = {
        card: document.querySelector("[data-next-event-card]"),
        day: document.querySelector("[data-event-day]"),
        month: document.querySelector("[data-event-month]"),
        title: document.querySelector("[data-event-title]"),
        date: document.querySelector("[data-event-date]"),
        time: document.querySelector("[data-event-time]"),
        location: document.querySelector("[data-event-location]"),
        welcome: document.querySelector("[data-event-welcome]"),
        link: document.querySelector("[data-event-link]"),
        status: document.querySelector("[data-event-status]")
    };

    if (!elements.card) return;

    if (!NEXT_EVENT_ENDPOINT.startsWith("https://script.google.com/")) {
        setStatus("La rencontre affichée est la valeur de secours tant que la connexion automatique n’est pas activée.");
        return;
    }

    const callbackName = "ljdpNextEventCallback_" + Date.now();
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
        cleanup();
        setStatus("Impossible d’actualiser la prochaine rencontre pour le moment.");
    }, 10000);

    window[callbackName] = function (payload) {
        cleanup();

        if (!payload || payload.ok !== true || !payload.event) {
            setStatus(payload && payload.message ? payload.message : "Aucune rencontre à venir n’a été trouvée.");
            return;
        }

        renderEvent(payload.event);
        setStatus("");
    };

    script.onerror = function () {
        cleanup();
        setStatus("Impossible d’actualiser la prochaine rencontre pour le moment.");
    };

    script.src = NEXT_EVENT_ENDPOINT
        + (NEXT_EVENT_ENDPOINT.includes("?") ? "&" : "?")
        + "callback=" + encodeURIComponent(callbackName);
    script.async = true;
    document.head.appendChild(script);

    function cleanup() {
        window.clearTimeout(timeout);
        if (script.parentNode) script.parentNode.removeChild(script);
        try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
    }

    function renderEvent(event) {
        const start = new Date(event.start);
        const end = new Date(event.end);
        const isAllDay = Boolean(event.allDay);

        elements.day.textContent = new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(start);
        elements.month.textContent = capitalize(new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(start));
        elements.title.textContent = event.title || "Prochaine rencontre";
        elements.date.textContent = capitalize(new Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long"
        }).format(start));

        elements.time.textContent = isAllDay
            ? "Toute la journée"
            : formatTimeRange(start, end);

        elements.location.textContent = event.location || "Lieu indiqué dans le calendrier";
        elements.welcome.textContent = inferWelcome(event.description);
        elements.link.href = "#calendrier";

        elements.card.classList.add("is-live");
    }

    function formatTimeRange(start, end) {
        const formatter = new Intl.DateTimeFormat("fr-FR", {
            hour: "2-digit",
            minute: "2-digit"
        });
        const startText = formatter.format(start).replace(":", " h ");
        const endText = formatter.format(end).replace(":", " h ");
        return startText + " – " + endText;
    }

    function inferWelcome(description) {
        const text = (description || "").toLocaleLowerCase("fr-FR");
        if (text.includes("réservé aux adhérents") || text.includes("réservée aux adhérents")) {
            return "Réservé aux adhérents";
        }
        if (text.includes("sur inscription")) {
            return "Sur inscription";
        }
        return "Ouvert à toutes et tous";
    }

    function capitalize(value) {
        return value ? value.charAt(0).toLocaleUpperCase("fr-FR") + value.slice(1) : value;
    }

    function setStatus(message) {
        if (elements.status) elements.status.textContent = message;
    }
})();
