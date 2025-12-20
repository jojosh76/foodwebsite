// ===== Sidebar Loader =====
const sidebar = document.getElementById("sidebar");

sidebar.innerHTML = `
  <h2>Admin Canteen</h2>
  <ul>
      <li onclick="loadPage('dashboard')">Dashboard</li>
      <li onclick="loadPage('meals')">Gestion des plats</li>
      <li onclick="loadPage('orders')">Gestion des commandes</li>
      <li onclick="loadPage('stocks')">Gestion des stocks</li>
      <li onclick="loadPage('users')">Gestion des utilisateurs</li>
  </ul>
`;

const main = document.getElementById("main-content");

// ===== Page Loader =====
function loadPage(page) {
    if (page === "dashboard") {
        main.innerHTML = `
        <div class="card">
            <h2>Dashboard</h2>
            <p>Bienvenue dans l'administration de la cantine universitaire.</p>
        </div>
        `;
    }

    if (page === "meals") {
        main.innerHTML = `
        <div class="card">
            <h2>Gestion des plats</h2>
            <p>Créer, modifier ou supprimer les repas disponibles.</p>
        </div>
        `;
    }

    if (page === "orders") {
        main.innerHTML = `
        <div class="card">
            <h2>Gestion des commandes</h2>
            <p>Suivi des commandes des étudiants.</p>
        </div>
        `;
    }

    if (page === "stocks") {
        main.innerHTML = `
        <div class="card">
            <h2>Gestion des stocks</h2>
            <p>Suivi des ingrédients et alertes de niveau bas.</p>
        </div>
        `;
    }

    if (page === "users") {
        main.innerHTML = `
        <div class="card">
            <h2>Gestion des utilisateurs</h2>
            <p>Administrateurs, cuisiniers, caissiers, étudiants.</p>
        </div>
        `;
    }
}

// Load initial page
loadPage("dashboard");