const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");
const pageTitle = document.getElementById("page-title");

/* ===== DATA (VIDES PAR DÉFAUT) ===== */
let meals = [];
let orders = [];
let stocks = [];
let users = [];

/* ===== SIDEBAR ===== */
sidebar.innerHTML = `
  <h2>🍽️ Canteen Admin</h2>
  <ul>
    <li class="active" onclick="loadPage('dashboard', event)">
      <i class="fa fa-chart-line"></i> Dashboard
    </li>
    <li onclick="loadPage('meals', event)">
      <i class="fa fa-utensils"></i> Dishes
    </li>
    <li onclick="loadPage('orders', event)">
      <i class="fa fa-receipt"></i> Orders
    </li>
    <li onclick="loadPage('stocks', event)">
      <i class="fa fa-box"></i> Stocks
    </li>
    <li onclick="loadPage('users', event)">
      <i class="fa fa-users"></i> Users
    </li>
  </ul>
`;

/* ===== PAGE LOADER ===== */
function loadPage(page, event) {
  document
    .querySelectorAll(".sidebar li")
    .forEach(li => li.classList.remove("active"));
  event.target.closest("li").classList.add("active");

  if (page === "dashboard") loadDashboard();
  if (page === "meals") loadMeals();
  if (page === "orders") loadOrders();
  if (page === "stocks") loadStocks();
  if (page === "users") loadUsers();
}

/* ===== DASHBOARD ===== */
function loadDashboard() {
  pageTitle.innerText = "Dashboard";

  const revenue = orders
    .filter(o => o.status === "paid")
    .reduce((sum, o) => sum + o.price, 0);

  main.innerHTML = `
    <div class="stats">
      <div class="stat-card">
        <h3>Orders</h3>
        <p>${orders.length}</p>
      </div>
      <div class="stat-card">
        <h3>Dishes</h3>
        <p>${meals.length}</p>
      </div>
      <div class="stat-card">
        <h3>Users</h3>
        <p>${users.length}</p>
      </div>
      <div class="stat-card">
        <h3>Revenue</h3>
        <p>${revenue.toLocaleString()} FCFA</p>
      </div>
    </div>
  `;
}

/* ===== DISH MANAGEMENT ===== */
function loadMeals() {
  pageTitle.innerText = "Dish Management";

  main.innerHTML = `
    <!-- ADD DISH -->
    <div class="table-card" style="margin-bottom:20px">
      <h3>Add Dish</h3>
      <form onsubmit="addDish(event)">
        <input id="dish-name" type="text" placeholder="Dish name" required />
        <input id="dish-price" type="number" placeholder="Price (FCFA)" required />
        <button type="submit">Add Dish</button>
      </form>
    </div>

    <!-- DISH LIST -->
    <div class="table-card">
      <h3>Dish List</h3>
      ${
        meals.length === 0
          ? `<p style="color:#64748b">No dishes added yet.</p>`
          : `
      <table>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
        ${meals.map(m => `
          <tr>
            <td>${m.name}</td>
            <td>${m.price} FCFA</td>
            <td>${m.available ? "Available" : "Unavailable"}</td>
          </tr>
        `).join("")}
      </table>`
      }
    </div>
  `;
}

/* ===== ADD DISH LOGIC ===== */
function addDish(event) {
  event.preventDefault();

  const name = document.getElementById("dish-name").value.trim();
  const price = Number(document.getElementById("dish-price").value);

  if (!name || price <= 0) return;

  meals.push({
    name,
    price,
    available: true
  });

  loadMeals();
  loadDashboard();
}

/* ===== ORDERS ===== */
function loadOrders() {
  pageTitle.innerText = "Orders Management";

  main.innerHTML = `
    <div class="table-card">
      <h3>Orders</h3>
      ${
        orders.length === 0
          ? `<p style="color:#64748b">No orders yet.</p>`
          : `
      <table>
        <tr>
          <th>Student</th>
          <th>Dish</th>
          <th>Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        ${orders.map((o, index) => `
          <tr>
            <td>${o.student}</td>
            <td>${o.meal}</td>
            <td>${o.price} FCFA</td>
            <td>
              <span class="status ${o.status === "paid" ? "done" : "pending"}">
                ${o.status}
              </span>
            </td>
            <td>
              ${
                o.status === "pending"
                  ? `<button class="approve-btn" onclick="approveOrder(${index})">
                      Approve
                    </button>`
                  : `<span style="color:green;">✔ Approved</span>`
              }
            </td>
          </tr>
        `).join("")}
      </table>`
      }
    </div>
  `;
}

/* ===== APPROVE ORDER ===== */
function approveOrder(index) {
  orders[index].status = "paid";
  loadOrders();
  loadDashboard();
}

/* ===== STOCKS ===== */
function loadStocks() {
  pageTitle.innerText = "Stocks Management";

  main.innerHTML = `
    <div class="table-card">
      <h3>Stocks</h3>
      <p style="color:#64748b">Stock module not yet configured.</p>
    </div>
  `;
}

/* ===== USERS ===== */
function loadUsers() {
  pageTitle.innerText = "Users Management";

  main.innerHTML = `
    <div class="table-card">
      <h3>Users</h3>
      <p style="color:#64748b">User module not yet configured.</p>
    </div>
  `;
}

/* ===== INIT ===== */
loadDashboard();
