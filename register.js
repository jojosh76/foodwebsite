document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const registerBtn = document.getElementById("registerBtn");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // 1. Récupération des données
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // 2. Validation simple
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // 3. Feedback visuel
        registerBtn.innerText = "Creating account...";
        registerBtn.disabled = true;
        registerBtn.style.opacity = "0.7";

        // 4. Appel au Backend
        fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: fullName, 
                email: email, 
                password: password 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Account created successfully! You can now log in.");
                window.location.href = "login.html"; // Redirection vers la connexion
            } else {
                alert("Registration failed: " + data.message);
                resetButton();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Server error, please try again later.");
            resetButton();
        });

        function resetButton() {
            registerBtn.innerText = "Create Account";
            registerBtn.disabled = false;
            registerBtn.style.opacity = "1";
        }
    });
});