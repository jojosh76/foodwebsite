/* ==========================================================
   PAYMENT.JS - GESTION DU PAIEMENT ET MISE À JOUR STOCK
   ========================================================== */

// 1. Récupération des paramètres dans l'URL (ID, prix et nom)
const urlParams = new URLSearchParams(window.location.search);

// --- CORRECTION : Récupération du mealId indispensable pour MySQL ---
const mealId = urlParams.get('id'); 
const dishName = urlParams.get('item') || "Selected Dish";
const unitPrice = parseInt(urlParams.get('price')) || 0;

// 2. Initialisation des variables de calcul
let currentQuantity = 1;

// 3. Liaison avec les éléments HTML
const qtyElement = document.getElementById('quantity');
const totalElement = document.getElementById('total');
const nameElement = document.getElementById('dish-name');

// Éléments d'affichage
const displayItemElement = document.getElementById('display-item');
const displayPriceElement = document.getElementById('display-price');

// 4. Affichage initial sur la page
if (nameElement) nameElement.innerText = dishName;

if (displayItemElement) {
    displayItemElement.textContent = "Dish : " + dishName;
}

if (displayPriceElement) {
    displayPriceElement.textContent = "Price : " + unitPrice + " FCFA";
}

updateDisplay();

/**
 * Met à jour l'affichage du prix total en fonction de la quantité
 */
function updateDisplay() {
    if (qtyElement && totalElement) {
        qtyElement.innerText = currentQuantity;
        const totalCalc = currentQuantity * unitPrice;
        totalElement.innerText = totalCalc.toLocaleString();
    }
}

/**
 * Fonctions de contrôle de la quantité
 */
function increase() {
    currentQuantity++;
    updateDisplay();
}

function decrease() {
    if (currentQuantity > 1) {
        currentQuantity--;
        updateDisplay();
    }
}

/**
 * ENVOI DU PAIEMENT AU SERVEUR
 */
async function processPayment() {
    const methodElement = document.getElementById('payment-method');
    const method = methodElement ? methodElement.value : "Unknown";
    const finalTotal = currentQuantity * unitPrice;

    // Récupération de l'ID utilisateur (depuis le localStorage après login)
    const userId = localStorage.getItem("userId") || 1; 

    // --- LOGIQUE D'ENVOI AU BACKEND ---
    try {
        const response = await fetch("http://localhost:3000/api/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mealId: mealId,           // <--- ENVOI DE L'ID POUR DIMINUER LE STOCK
                user_id: userId,
                item: dishName,
                unit_price: unitPrice,
                quantity: currentQuantity,
                payment_method: method
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Si le serveur confirme que tout est OK (Paiement + Stock)
            showReceipt(dishName, currentQuantity, method, finalTotal);
        } else {
            // Si le stock est insuffisant ou erreur serveur
            alert("Order Error: " + (data.message || "Unable to process payment"));
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        alert("Server connection failed. Is your Node.js server running?");
    }
}

/**
 * Affiche le reçu final après succès
 */
function showReceipt(name, qty, method, total) {
    alert("Payment validated successfully! ✅");

    // Masquer le formulaire de paiement
    const card = document.querySelector('.card');
    if (card) card.style.display = 'none';

    // Remplir les informations du reçu
    document.getElementById('receipt-date').innerText = new Date().toLocaleString();
    document.getElementById('receipt-item').innerText = name;
    document.getElementById('receipt-qty').innerText = qty;
    document.getElementById('receipt-method').innerText = method.toUpperCase();
    document.getElementById('receipt-total').innerText = total.toLocaleString();

    // Afficher le bloc reçu
    const receiptBlock = document.getElementById('receipt');
    if (receiptBlock) receiptBlock.style.display = 'block';
}