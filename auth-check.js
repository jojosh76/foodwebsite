// auth-check.js
document.addEventListener("DOMContentLoaded", () => {

    // 1️⃣ Récupération des informations de session
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");

    // 2️⃣ Protection : utilisateur non connecté → retour au login
    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    // 3️⃣ Gestion de l'affichage du lien Admin
    const adminLink = document.getElementById("admin-link");

    // Si l'utilisateur est un admin (email ICTU)
    if (adminLink && userEmail && userEmail.endsWith("@ictu.edu.cm")) {
        adminLink.style.display = "inline-block";
    }
});

// 4️⃣ Fonction de déconnexion
function logout() {
    localStorage.clear();      // Supprime toutes les données utilisateur
    window.location.href = "index.html"; // Redirection vers la page de connexion
}
