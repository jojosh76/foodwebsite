// 1. Récupération des paramètres dans l'URL (prix et nom)
const urlParams = new URLSearchParams(window.location.search);

// Harmonisation : On récupère 'item' (envoyé par menu.js) et on l'affiche
const dishName = urlParams.get('item') || "Plat sélectionné";
const unitPrice = parseInt(urlParams.get('price')) || 0;

// 2. Initialisation des variables de calcul
let currentQuantity = 1;

// 3. Liaison avec les éléments HTML
const qtyElement = document.getElementById('quantity');
const totalElement = document.getElementById('total');
const nameElement = document.getElementById('dish-name');

// Éléments supplémentaires (optionnels)
const displayItemElement = document.getElementById('display-item');
const displayPriceElement = document.getElementById('display-price');

// 4. Affichage initial
if (nameElement) nameElement.innerText = dishName;

if (displayItemElement) {
    displayItemElement.textContent = "Plat : " + dishName;
}

if (displayPriceElement) {
    displayPriceElement.textContent = "Total à payer : " + unitPrice + " FCFA";
}

updateDisplay();

function updateDisplay() {
    if (qtyElement && totalElement) {
        qtyElement.innerText = currentQuantity;
        const totalCalc = currentQuantity * unitPrice;
        totalElement.innerText = totalCalc.toLocaleString();
    }
}

// 5. Fonctions de contrôle quantité
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

// 6. Paiement
function processPayment() {
    const methodElement = document.getElementById('payment-method');
    const method = methodElement ? methodElement.value : "inconnue";
    const finalTotal = currentQuantity * unitPrice;

    // --- RÉCUPÉRATION DE L'ID UTILISATEUR (AJOUTÉ) ---
    const userId = localStorage.getItem("userId") || 1; 

    // 🔵 ENVOI DES DONNÉES AU BACKEND (MIS À JOUR AVEC USER_ID)
    fetch("http://localhost:3000/api/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId, // Utilise le vrai ID récupéré au login !
            item: dishName,
            unit_price: unitPrice,
            quantity: currentQuantity,
            payment_method: method
        })
    }).catch(err => console.error("Erreur fetch paiement :", err));

    // 1. Message succès (TA logique)
    alert("Paiement validé avec succès ! ✅");

    // 2. Masquer le formulaire
    document.querySelector('.card').style.display = 'none';

    // 3. Remplir le reçu
    document.getElementById('receipt-date').innerText = new Date().toLocaleString();
    document.getElementById('receipt-item').innerText = dishName;
    document.getElementById('receipt-qty').innerText = currentQuantity;
    document.getElementById('receipt-method').innerText = method.toUpperCase();
    document.getElementById('receipt-total').innerText = finalTotal.toLocaleString();

    // 4. Afficher le reçu
    document.getElementById('receipt').style.display = 'block';
}