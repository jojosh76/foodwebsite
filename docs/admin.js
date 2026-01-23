/* ==========================================================
   ADMIN.JS - GESTION COMPLÈTE (DASHBOARD & SQL)
   ========================================================== */
   // Détecte automatiquement si on est sur PC (localhost) ou sur mobile (IP)
const SERVER_IP = "10.117.226.154"; 
const BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : `http://${SERVER_IP}:3000`;


const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");
const pageTitle = document.getElementById("page-title");

// 1. PROTECTION DE LA PAGE
const userEmail = localStorage.getItem("userEmail");
if (!userEmail || !userEmail.endsWith("@ictu.edu.cm")) {
    alert("Accès refusé ! Réservé aux administrateurs de ICT-U.");
    window.location.href = "about-us.html";
}

let orders = [];
let users = [];
let meals = [];

/* ===== SIDEBAR UI (Toutes tes options) ===== */
sidebar.innerHTML = `
  <h2>🍽️ Canteen Admin</h2>
  <ul>
    <li id="nav-dashboard" class="active" onclick="loadPage('dashboard')"><i class="fa fa-chart-line"></i> Dashboard</li>
    <li id="nav-dishes" onclick="loadPage('dishes')"><i class="fa fa-utensils"></i> Dishes</li>
    <li id="nav-orders" onclick="loadPage('orders')"><i class="fa fa-receipt"></i> Orders</li>
    <li id="nav-users" onclick="loadPage('users')"><i class="fa fa-users"></i> Users</li>
  </ul>
`;

function loadPage(page) {
    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const activeNav = document.getElementById(`nav-${page}`);
    if (activeNav) activeNav.classList.add("active");

    if (page === "dashboard") loadDashboard();
    if (page === "dishes") loadDishes();
    if (page === "orders") loadOrders();
    if (page === "users") loadUsers();
}

/* ===== GESTION DES PLATS (AVEC STOCK) ===== */

async function fetchMealsFromDB() {
    try {
        const response = await fetch(`${BASE_URL}/api/meals`)
        meals = await response.json();
        if (document.getElementById("admin-menu-grid")) renderAdminDishes();
    } catch (err) { console.error("Erreur API plats:", err); }
}

function loadDishes() {
    pageTitle.innerText = "Dishes Management";
    main.innerHTML = `
        <div class="table-card" style="margin-bottom: 25px;">
            <h3><i class="fa fa-plus-circle"></i> Add New Dish (MySQL)</h3>
            <form id="add-dish-form" style="display:grid; gap:15px; margin-top:15px;">
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:15px;">
                    <input type="text" id="d-name" placeholder="Dish Name" required style="padding:12px; border-radius:8px; border:1px solid #ddd;">
                    <input type="number" id="d-price" placeholder="Price (FCFA)" required style="padding:12px; border-radius:8px; border:1px solid #ddd;">
                    <input type="number" id="d-stock" placeholder="Stock" value="50" required style="padding:12px; border-radius:8px; border:1px solid #ddd;">
                </div>
                <textarea id="d-desc" placeholder="Description..." required style="padding:12px; border-radius:8px; border:1px solid #ddd; height:80px;"></textarea>
                
                <label for="d-img" style="background:#003366; color:white; padding:12px; border-radius:8px; cursor:pointer; text-align:center;">
                    <i class="fa fa-upload"></i> Choose Dish Photo
                </label>
                <input type="file" id="d-img" accept="image/*" style="display:none" required onchange="previewImage(this)">
                
                <div id="preview-container" style="text-align:center; display:none;">
                    <img id="img-preview" src="" style="max-height:150px; border-radius:8px; border:2px solid #ddd; margin-top:10px;">
                </div>

                <button type="submit" style="background:#FF8C00; color:white; padding:12px; border-radius:8px; border:none; font-weight:bold; cursor:pointer;">Save to Database</button>
            </form>
        </div>
        <div class="table-card">
            <h3>Menu Preview (Current SQL Content)</h3>
            <div id="admin-menu-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:20px; margin-top:20px;"></div>
        </div>
    `;

    fetchMealsFromDB();

    document.getElementById("add-dish-form").onsubmit = function(e) {
        e.preventDefault();
        const file = document.getElementById("d-img").files[0];
        const reader = new FileReader();

        reader.onloadend = async function() {
            const newMeal = {
                name: document.getElementById("d-name").value,
                price: document.getElementById("d-price").value,
                stock: document.getElementById("d-stock").value,
                desc: document.getElementById("d-desc").value,
                image: reader.result
            };
            
            try {
                const response = await fetch(`${BASE_URL}/api/admin/add-meal`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMeal)
                });

                if (response.ok) {
                    alert("Dish added successfully!");
                    e.target.reset();
                    document.getElementById("preview-container").style.display = "none";
                    fetchMealsFromDB();
                }
            } catch (err) { alert("Error connecting to server."); }
        };
        if (file) reader.readAsDataURL(file);
    };
}

function previewImage(input) {
    const preview = document.getElementById('img-preview');
    const container = document.getElementById('preview-container');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            container.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderAdminDishes() {
    const grid = document.getElementById("admin-menu-grid");
    if (!grid) return;

    grid.innerHTML = meals.map(m => `
        <div style="background:white; border:1px solid #eee; border-radius:12px; overflow:hidden; position:relative; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <div style="position:absolute; top:5px; left:5px; background:#003366; color:white; padding:2px 6px; border-radius:4px; font-size:10px;">
                Stock: ${m.stock}
            </div>
            <img src="${m.image}" style="width:100%; height:120px; object-fit:cover;">
            <div style="padding:10px; text-align:center;">
                <h4 style="font-size:14px; margin:0;">${m.name}</h4>
                <p style="color:#FF8C00; font-weight:bold; margin:5px 0;">${m.price} FCFA</p>
                <button onclick="deleteMeal(${m.id})" style="background:#e11d48; color:white; border:none; padding:5px 12px; border-radius:6px; cursor:pointer; font-size:11px;">
                    <i class="fa fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join("");
}

async function deleteMeal(id) {
    if(confirm("Permanently delete?")) {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/delete-meal/${id}`, { method: "DELETE" });
            if (response.ok) fetchMealsFromDB();
        } catch (err) { console.error("Erreur suppression:", err); }
    }
}

/* ===== DASHBOARD & STATS (Toutes tes fonctionnalités) ===== */

async function fetchData() {
    try {
       const resOrders = await fetch(`${BASE_URL}/api/admin/orders`);
        orders = await resOrders.json();
        const resUsers = await fetch(`${BASE_URL}/api/admin/users`);
        users = await resUsers.json();
        loadDashboard();
    } catch (err) { 
        console.warn("API Offline - Mode démo"); 
        loadDashboard(); 
    }
}

function loadDashboard() {
    pageTitle.innerText = "Dashboard";
    const revenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
    
    main.innerHTML = `
        <div class="stats">
            <div class="stat-card"><h3>Total Orders</h3><p>${orders.length || 0}</p></div>
            <div class="stat-card"><h3>Active Users</h3><p>${users.length || 0}</p></div>
            <div class="stat-card"><h3>Revenue</h3><p>${revenue.toLocaleString()} FCFA</p></div>
        </div>
        <div class="table-card" style="margin-top:20px;">
            <h3>Quick Management</h3>
            <button onclick="loadPage('dishes')" style="padding:12px 20px; background:#003366; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">
                <i class="fa fa-edit"></i> Update Menu & Stock
            </button>
        </div>
    `;
}

/* ===== GESTION DES COMMANDES (ORDERS) ===== */

async function loadOrders() { 
    pageTitle.innerText = "Orders Management"; 
    
    // Affichage d'un indicateur de chargement
    main.innerHTML = `
        <div class="table-card">
            <h3><i class="fa fa-receipt"></i> Recent Orders</h3>
            <div id="orders-list-container">Loading orders...</div>
        </div>
    `; 

    try {
        // Récupération des commandes depuis le serveur MySQL
        const response = await fetch(`${BASE_URL}/api/admin/orders`);
        const ordersData = await response.json();

        const container = document.getElementById("orders-list-container");

        if (!ordersData || ordersData.length === 0) {
            container.innerHTML = "<p>No orders found in database.</p>";
            return;
        }

        // Création du tableau des commandes
        container.innerHTML = `
            <table style="width:100%; border-collapse: collapse; margin-top:15px;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #eee;">
                        <th style="padding:12px; text-align:left;">ID</th>
                        <th style="padding:12px; text-align:left;">Dish Name</th>
                        <th style="padding:12px; text-align:left;">Price</th>
                        <th style="padding:12px; text-align:left;">Qty</th>
                        <th style="padding:12px; text-align:left;">Total</th>
                        <th style="padding:12px; text-align:left;">Status</th>
                        <th style="padding:12px; text-align:left;">Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${ordersData.map(order => `
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding:12px;">#${order.id}</td>
                            <td style="padding:12px; font-weight:bold;">${order.item_name || order.item}</td>
                            <td style="padding:12px;">${order.unit_price} FCFA</td>
                            <td style="padding:12px;">x${order.quantity}</td>
                            <td style="padding:12px; color:#FF8C00; font-weight:bold;">${(order.unit_price * order.quantity).toLocaleString()} FCFA</td>
                            <td style="padding:12px;">
                                <span style="background:#dcfce7; color:#166534; padding:4px 8px; border-radius:12px; font-size:12px;">
                                    ${order.status || 'Paid'}
                                </span>
                            </td>
                            <td style="padding:12px; font-size:12px; color:#666;">
                                ${new Date(order.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        console.error("Erreur chargement commandes:", err);
        document.getElementById("orders-list-container").innerHTML = 
            `<p style="color:red;">Error connecting to database. Make sure your server is running.</p>`;
    }
}
fetchData();