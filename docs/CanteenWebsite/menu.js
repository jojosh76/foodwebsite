/* ==========================================================
   MENU.JS - GESTION DU MENU (MYSQL) ET DU PANIER
   ========================================================== */

let cart = [];
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Charger les plats depuis la base de données SQL (au lieu du localStorage)
    renderMenuFromSQL();
});

/**
 * RÉCUPÈRE LES PLATS DEPUIS L'API NODE.JS (MYSQL)
 */
async function renderMenuFromSQL() {
    const grid = document.getElementById("dynamic-menu-grid");
    if (!grid) return;

    try {
        // Appel à ton API
        const response = await fetch("http://localhost:3000/api/meals");
        const meals = await response.json();

        // Si la base est vide
        if (meals.length === 0) {
            grid.innerHTML = "<p style='text-align:center; color:#666;'>No extra dishes available today.</p>";
            return;
        }

        // Génération du HTML pour chaque plat récupéré
        grid.innerHTML = meals.map(m => `
            <article class="menu-item">
                <img src="${m.image_url}" alt="${m.name}" class="item-image">
                <div class="item-details">
                    <div class="item-header">
                        <span class="item-name">${m.name}</span>
                        <span class="item-price">${m.price} FCFA</span>
                    </div>
                    <p class="item-description">${m.description || "Freshly prepared ICTU meal."}</p>
                    <button class="order-btn" onclick="addToCart('${m.name.replace(/'/g, "\\'")}', ${m.price})">
                        <i class="fa fa-cart-plus"></i> Order
                    </button>
                </div>
            </article>
        `).join("");

        // 3. Une fois les plats affichés, on active les animations
        setupAnimations();

    } catch (err) {
        console.error("Erreur lors du chargement du menu SQL:", err);
        grid.innerHTML = "<p style='color:red; text-align:center;'>Impossible de charger le menu. Vérifiez que le serveur Node.js est lancé.</p>";
    }
}

/**
 * Gère l'ajout au panier et la redirection vers le paiement
 */
function addToCart(itemName, price) {
    // Logique interne du panier
    cart.push({ name: itemName, price: price });
    totalAmount += price;

    // Notification visuelle
    showNotification(`${itemName} added to cart!`);
    
    console.log("Cart Update:", cart);
    console.log("Current Total:", totalAmount, "FCFA");

    // Redirection vers la page de paiement avec les paramètres dans l'URL
    // encodeURIComponent est utilisé pour gérer les espaces et caractères spéciaux
    setTimeout(() => {
        window.location.href = `payment.html?item=${encodeURIComponent(itemName)}&price=${price}`;
    }, 800); // Petit délai pour laisser l'utilisateur voir la notification
}

/**
 * Affiche une petite bulle de confirmation (Notification)
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fa fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    // Style rapide pour la notification (si pas dans ton CSS)
    Object.assign(notification.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#28a745",
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        zIndex: "1000",
        transition: "opacity 0.5s"
    });

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

/**
 * Animation d'apparition fluide au défilement (Scroll Intersection Observer)
 */
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    // On observe tous les menu-items (ceux du HTML fixe et ceux injectés par SQL)
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "all 0.5s ease-out";
        observer.observe(item);
    });
}