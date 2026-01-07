// 1. Récupération des paramètres dans l'URL (prix et nom)
const urlParams = new URLSearchParams(window.location.search);
const unitPrice = parseInt(urlParams.get('price')) || 0;
const dishName = urlParams.get('name') || "Plat sélectionné";

// 2. Initialisation des variables de calcul
let currentQuantity = 1;

// 3. Liaison avec les éléments HTML
const qtyElement = document.getElementById('quantity');
const totalElement = document.getElementById('total');
const nameElement = document.getElementById('dish-name');

// 4. Affichage initial
nameElement.innerText = dishName;
updateDisplay();

function updateDisplay() {
    qtyElement.innerText = currentQuantity;
    const totalCalc = currentQuantity * unitPrice;
    totalElement.innerText = totalCalc.toLocaleString(); 
}

// 5. Fonctions de contrôle
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

function processPayment() {
    const method = document.getElementById('payment-method').value;
    const finalTotal = currentQuantity * unitPrice;
    alert(`Paiement de ${finalTotal} XAF via ${method.toUpperCase()} en cours...`);
}