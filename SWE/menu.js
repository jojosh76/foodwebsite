let cart = [];
let totalAmount = 0;

function addToCart(itemName, price) {
    // 1. Logique de calcul
    cart.push({ name: itemName, price: price });
    totalAmount += price;

    // 2. Notification visuelle
    showNotification(`${itemName} ajouté au panier !`);
    
    console.log("Panier actuel:", cart);
    console.log("Total:", totalAmount, "FCFA");

    // 3. Redirection vers la page de paiement
    // Attention : Assure-toi que ton fichier s'appelle payment.html (et pas paiement.html)
    window.location.href = `payment.html?item=${encodeURIComponent(itemName)}&price=${price}`;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.5s";
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Animation d'apparition des cartes au scroll
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "all 0.5s ease-out";
        observer.observe(item);
    });
});