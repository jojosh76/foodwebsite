document.addEventListener("DOMContentLoaded", () => {
    // 1. AFFICHAGE DE L'EMAIL CONNECTÉ
    const displayEmail = document.getElementById("userEmailDisplay");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedEmail) {
        displayEmail.value = savedEmail;
    } else {
        // Si aucun email n'est trouvé, on redirige vers le login (sécurité)
        window.location.href = "index.html";
    }

    // 2. LOGIQUE DU BOUTON LOGOUT
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
        // Effacer les données de session
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole"); // Si tu l'utilises pour l'admin

        alert("Logging out...");
        // Rediriger vers la page de connexion
        window.location.href = "login.html";
    });

    // 3. SAUVEGARDE DES PRÉFÉRENCES (Ton code existant)
    document.querySelector(".save-btn").addEventListener("click", () => {
        const settings = {
            menuNotif: document.getElementById("notifMenu").checked,
            promoNotif: document.getElementById("notifPromo").checked,
            darkMode: document.getElementById("darkMode").checked
        };
        localStorage.setItem("canteenSettings", JSON.stringify(settings));
        alert("Settings saved successfully ✅");
    });

    // 4. DARK MODE (Ton code existant optimisé)
    const darkToggle = document.getElementById("darkMode");
    darkToggle.addEventListener("change", () => {
        applyDarkMode(darkToggle.checked);
    });

    function applyDarkMode(isDark) {
        if (isDark) {
            document.body.style.background = "#1e1e1e";
            document.body.style.color = "white";
        } else {
            document.body.style.background = "#f1f5f9";
            document.body.style.color = "black";
        }
    }
});