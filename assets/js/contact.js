(() => {
    "use strict";

    const form = document.getElementById("contact-form");

    if (!form) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById("contact-form-status");
    const initialButtonText = submitButton ? submitButton.textContent.trim() : "";

    const setStatus = (message, type = "") => {
        if (!status) {
            return;
        }

        status.textContent = message;
        status.classList.remove("is-error", "is-success");

        if (type) {
            status.classList.add(`is-${type}`);
        }
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!submitButton) {
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Envoi en cours…";
        setStatus("Votre message est en cours d’envoi.");

        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Formspree a refusé l’envoi.");
            }

            setStatus("Message envoyé. Merci !", "success");
            window.location.assign("merci.html");
        } catch (error) {
            console.error(error);
            setStatus(
                "Impossible d’envoyer votre message. Vérifiez votre connexion puis réessayez.",
                "error"
            );
            submitButton.disabled = false;
            submitButton.textContent = initialButtonText;
        }
    });
})();
