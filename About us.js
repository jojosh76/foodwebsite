console.log("Digital Canteen - About Us page loaded");

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Vérification de l'utilisateur connecté
    const email = localStorage.getItem("userEmail");
    
    if (email) {
        console.log("Connecté en tant que : " + email);
        // Vous pouvez ajouter un message de bienvenue ici si vous le souhaitez
    } else {
        console.log("Navigation en mode invité");
    }

    // 2. Animation d'apparition au défilement (Scroll Reveal)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // On applique l'animation aux sections et aux membres de l'équipe
    const animateElements = document.querySelectorAll('.project, .member');
    animateElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease-out";
        observer.observe(el);
    });
});