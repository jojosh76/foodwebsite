   // Détecte automatiquement si on est sur PC (localhost) ou sur mobile (IP)
const SERVER_IP = "10.117.226.154"; 
const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : `http://${SERVER_IP}:3000`;


// Attendre que toute la page HTML soit chargée
document.addEventListener("DOMContentLoaded", function () {

    // Récupération du formulaire et du bouton de connexion
    const form = document.querySelector("form");
    const loginBtn = document.querySelector("button[type='submit']");

    // Écoute de la soumission du formulaire
    form.addEventListener("submit", function (e) {

        // Empêche le rechargement automatique de la page
        e.preventDefault();

        // Récupération et nettoyage des données saisies par l'utilisateur
        let email = document.querySelector("input[type='email']")
            .value.trim().toLowerCase();
        let password = document.querySelector("input[type='password']")
            .value.trim();

        // Vérification : champs obligatoires
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Feedback visuel : bouton désactivé pendant la requête
        loginBtn.innerText = "Connecting...";
        loginBtn.style.opacity = "0.7";
        loginBtn.disabled = true;

        // Appel au backend pour la connexion
        fetch(`${BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        // Conversion de la réponse en JSON
        .then(response => response.json())

        // Traitement de la réponse du serveur
        .then(data => {

            // Si la connexion est réussie
            if (data.success) {

                // Stockage des informations utilisateur dans le navigateur
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("userEmail", data.user.email);

                alert("Login successful!");

                // Redirection selon le type d'utilisateur
                if (data.user.email.endsWith("@ictu.edu.cm")) {
                    
                    window.location.href = "about-us.html";
                } else {
                    
                    window.location.href = "about-us.html";
                }

            } else {
                
                alert("Login failed: " + data.message);

                // Réinitialisation du bouton
                loginBtn.innerText = "Log In";
                loginBtn.disabled = false;
                loginBtn.style.opacity = "1";
            }
        })

        // Gestion des erreurs serveur ou réseau
        .catch(error => {
            console.error("Error:", error);
            alert("Server error, please try again later.");

            // Réinitialisation du bouton
            loginBtn.innerText = "Log In";
            loginBtn.disabled = false;
            loginBtn.style.opacity = "1";
        });
    });
});
