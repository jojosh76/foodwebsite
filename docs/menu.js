/* ==========================================================
   MENU.JS - GESTION DU MENU (MYSQL) ET DU PANIER
   ========================================================== */


   // Détecte automatiquement si on est sur PC (localhost) ou sur mobile (IP)
const SERVER_IP = "10.117.226.154"; 
const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : `http://${SERVER_IP}:3000`;

let cart = [];
let totalAmount = 0;

document.addEventListener("DOMContentLoaded", () => {
    renderMenuFromSQL();
});

/**
 * RÉCUPÈRE LES PLATS DEPUIS L'API NODE.JS (MYSQL)
 */
async function renderMenuFromSQL() {
    const grid = document.getElementById("dynamic-menu-grid");
    if (!grid) return;

    try {
        const response = await fetch(`${BASE_URL}/api/meals`)
        const meals = await response.json();

        if (meals.length === 0) {
            grid.innerHTML = "<p style='text-align:center; color:#666;'>No extra dishes available today.</p>";
            return;
        }

        // Génération du HTML avec gestion du STOCK
        grid.innerHTML = meals.map(m => {
            const isOutOfStock = m.stock <= 0;
            const stockColor = m.stock <= 5 ? "#e11d48" : "#28a745"; // Rouge si stock bas

            return `
            <article class="menu-item" style="${isOutOfStock ? 'opacity: 0.7;' : ''}">
                <div class="stock-badge" style="background:${stockColor}; position:absolute; top:10px; right:10px; color:white; padding:4px 8px; border-radius:5px; font-size:12px; font-weight:bold; z-index:10;">
                    ${isOutOfStock ? "SOLD OUT" : "Stock: " + m.stock}
                </div>
                <img src="${m.image_url}" alt="${m.name}" class="item-image">
                <div class="item-details">
                    <div class="item-header">
                        <span class="item-name">${m.name}</span>
                        <span class="item-price">${m.price} FCFA</span>
                    </div>
                    <p class="item-description">${m.description || "Freshly prepared ICTU meal."}</p>
                    <button class="order-btn" 
                        onclick="addToCart('${m.name.replace(/'/g, "\\'")}', ${m.price}, ${m.id})"
                        ${isOutOfStock ? "disabled style='background:#ccc; cursor:not-allowed;'" : ""}>
                        <i class="fa ${isOutOfStock ? 'fa-times' : 'fa-cart-plus'}"></i> 
                        ${isOutOfStock ? 'Out of Stock' : 'Order Now'}
                    </button>
                </div>
            </article>
        `}).join("");

        setupAnimations();

    } catch (err) {
        console.error("Erreur lors du chargement du menu SQL:", err);
        grid.innerHTML = "<p style='color:red; text-align:center;'>Impossible de charger le menu.</p>";
    }
}

/**
 * Gère l'ajout au panier et la redirection
 */
function addToCart(itemName, price, itemId) {
    cart.push({ id: itemId, name: itemName, price: price });
    totalAmount += price;

    showNotification(`${itemName} added to cart!`);
    
    // Redirection vers paiement avec l'ID pour pouvoir déduire le stock côté serveur plus tard
    setTimeout(() => {
        window.location.href = `payment.html?id=${itemId}&item=${encodeURIComponent(itemName)}&price=${price}`;
    }, 800);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `<i class="fa fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);

    Object.assign(notification.style, {
        position: "fixed", bottom: "20px", right: "20px", background: "#28a745",
        color: "white", padding: "12px 20px", borderRadius: "8px", zIndex: "1000"
    });

    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "all 0.5s ease-out";
        observer.observe(item);
    });
}