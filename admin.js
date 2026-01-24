const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");
const pageTitle = document.getElementById("page-title");

// Protection de la page Admin
const userEmail = localStorage.getItem("userEmail");
if (!userEmail || !userEmail.endsWith("@ictu.edu.cm")) {
    alert("Accès refusé ! Réservé aux administrateurs.");
    window.location.href = "About us.html";
}

/* ===== DATA (SYNC AVEC LE BACKEND) ===== */
let orders = [];
let users = [];
let meals = [
    { name: "Chicken and rice", price: 1000, available: true },
    { name: "Kati Kati", price: 1000, available: true },
    { name: "Eru", price: 1000, available: true }
];

/* ===== SIDEBAR ===== */
sidebar.innerHTML = `
  <h2>🍽️ Canteen Admin</h2>
  <ul>
    <li class="active" onclick="loadPage('dashboard', event)">
      <i class="fa fa-chart-line"></i> Dashboard
    </li>
    <li onclick="loadPage('orders', event)">
      <i class="fa fa-receipt"></i> Orders
    </li>
    <li onclick="loadPage('users', event)">
      <i class="fa fa-users"></i> Users
    </li>
  </ul>
`;

/* ===== API CALLS ===== */
async function fetchData() {
    try {
        // On récupère les commandes depuis le backend
        const resOrders = await fetch("http://localhost:3000/api/admin/orders");
        orders = await resOrders.json();

        // On récupère les utilisateurs
        const resUsers = await fetch("http://localhost:3000/api/admin/users");
        users = await resUsers.json();
        
        loadDashboard(); // Rafraîchit l'affichage
    } catch (err) {
        console.error("Erreur de chargement des données:", err);
    }
}

/* ===== PAGE LOADER ===== */
function loadPage(page, event) {
  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  if(event) event.target.closest("li").classList.add("active");

  if (page === "dashboard") loadDashboard();
  if (page === "orders") loadOrders();
  if (page === "users") loadUsers();
}

/* ===== DASHBOARD ===== */
function loadDashboard() {
  pageTitle.innerText = "Dashboard";
  
  // Calcul du revenu basé sur les commandes 'paid' en BDD
  const revenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

  main.innerHTML = `
    <div class="stats">
      <div class="stat-card"><h3>Orders</h3><p>${orders.length}</p></div>
      <div class="stat-card"><h3>Users</h3><p>${users.length}</p></div>
      <div class="stat-card"><h3>Revenue</h3><p>${revenue.toLocaleString()} FCFA</p></div>
    </div>
  `;
}

/* ===== ORDERS VIEW ===== */
function loadOrders() {
  pageTitle.innerText = "Orders Management";
  main.innerHTML = `
    <div class="table-card">
      <h3>Recent Orders (from Database)</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>User ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
        ${orders.map(o => `
          <tr>
            <td>#${o.id}</td>
            <td>User ${o.user_id}</td>
            <td>${o.total_amount} FCFA</td>
            <td><span class="status done">${o.status}</span></td>
            <td>${new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

/* ===== USERS VIEW ===== */
function loadUsers() {
  pageTitle.innerText = "Users Management";
  main.innerHTML = `
    <div class="table-card">
      <h3>Registered Students</h3>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
        ${users.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.name || u.full_name}</td>
            <td>${u.email}</td>
          </tr>
        `).join("")}
      </table>
    </div>
  `;
}

// Initialisation au chargement
fetchData();