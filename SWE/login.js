document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Empêche le rechargement de la page

        let email = document.querySelector("input[type='email']").value.trim();
        let password = document.querySelector("input[type='password']").value.trim();

        // Vérification simple
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Tu peux modifier ici pour ajouter une vraie vérification plus tard
        alert("Login successful!");
    });
});
