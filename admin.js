/* ==========================================================
   ADMIN.JS - GESTION COMPLÈTE (DASHBOARD & SQL)
   ========================================================== */

const sidebar = document.getElementById("sidebar");
const main = document.getElementById("main-content");
const pageTitle = document.getElementById("page-title");

// 1. PROTECTION DE LA PAGE
const userEmail = localStorage.getItem("userEmail");
if (!userEmail || !userEmail.endsWith("@ictu.edu.cm")) {
    alert("Accès refusé ! Réservé aux administrateurs de ICT-U.");
    window.location.href = "About us.html";
}

// 2. INITIALISATION DES DONNÉES
let orders = [];
let users = [];
let meals = []; // Les plats seront chargés depuis MySQL

/* ===== SIDEBAR UI ===== */
sidebar.innerHTML = `
  <h2>🍽️ Canteen Admin</h2>
  <ul>
    <li id="nav-dashboard" class="active" onclick="loadPage('dashboard')"><i class="fa fa-chart-line"></i> Dashboard</li>
    <li id="nav-dishes" onclick="loadPage('dishes')"><i class="fa fa-utensils"></i> Dishes</li>
    <li id="nav-orders" onclick="loadPage('orders')"><i class="fa fa-receipt"></i> Orders</li>
    <li id="nav-users" onclick="loadPage('users')"><i class="fa fa-users"></i> Users</li>
  </ul>
`;

/* ===== CHARGEMENT DES PAGES (ROUTER) ===== */
function loadPage(page) {
    // Gestion visuelle du menu actif
    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    const activeNav = document.getElementById(`nav-${page}`);
    if (activeNav) activeNav.classList.add("active");

    // Chargement du contenu
    if (page === "dashboard") loadDashboard();
    if (page === "dishes") loadDishes();
    if (page === "orders") loadOrders();
    if (page === "users") loadUsers();
}

/* ==========================================================
   GESTION DES PLATS (SYNC SQL)
   ========================================================== */

// Fonction pour récupérer les plats depuis la base SQL via l'API
async function fetchMealsFromDB() {
    try {
        const response = await fetch("http://localhost:3000/api/meals");
        meals = await response.json();
        // Si on est sur la page "dishes", on rafraîchit l'affichage
        if (document.getElementById("admin-menu-grid")) {
            renderAdminDishes();
        }
    } catch (err) {
        console.error("Erreur de connexion API pour les plats:", err);
    }
}

function loadDishes() {
    pageTitle.innerText = "Dishes Management";
    main.innerHTML = `
        <div class="table-card" style="margin-bottom: 25px;">
            <h3><i class="fa fa-plus-circle"></i> Add New Dish (MySQL)</h3>
            <form id="add-dish-form" style="display:grid; gap:15px; margin-top:15px;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <input type="text" id="d-name" placeholder="Dish Name" required style="padding:12px; border-radius:8px; border:1px solid #ddd;">
                    <input type="number" id="d-price" placeholder="Price (FCFA)" required style="padding:12px; border-radius:8px; border:1px solid #ddd;">
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
            <div id="admin-menu-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:20px; margin-top:20px;">
                </div>
        </div>
    `;

    fetchMealsFromDB(); // On charge les données dès l'ouverture

    // Gestion du formulaire d'ajout
    document.getElementById("add-dish-form").onsubmit = function(e) {
        e.preventDefault();
        const file = document.getElementById("d-img").files[0];
        const reader = new FileReader();

        reader.onloadend = async function() {
            const newMeal = {
                name: document.getElementById("d-name").value,
                price: document.getElementById("d-price").value,
                desc: document.getElementById("d-desc").value,
                image: reader.result // Envoi en Base64
            };
            
            // APPEL API POUR ENREGISTRER DANS MYSQL
            try {
                const response = await fetch("http://localhost:3000/api/admin/add-meal", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMeal)
                });

                if (response.ok) {
                    alert("Dish added successfully to MySQL database!");
                    e.target.reset();
                    document.getElementById("preview-container").style.display = "none";
                    fetchMealsFromDB(); // Rafraîchir la liste
                }
            } catch (err) {
                alert("Error connecting to server. Is Node.js running?");
            }
        };
        if (file) reader.readAsDataURL(file);
    };
}

// Prévisualisation de l'image sélectionnée
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

// Affichage des plats dans la grille Admin
function renderAdminDishes() {
    const grid = document.getElementById("admin-menu-grid");
    if (!grid) return;

    if (meals.length === 0) {
        grid.innerHTML = "<p style='color:#999;'>No extra dishes in SQL database.</p>";
        return;
    }

    grid.innerHTML = meals.map(m => `
        <div style="background:white; border:1px solid #eee; border-radius:12px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
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

// Suppression d'un plat dans SQL via API
async function deleteMeal(id) {
    if(confirm("Permanently delete this item from the database?")) {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/delete-meal/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                fetchMealsFromDB(); // Rafraîchir la vue
            }
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    }
}

/* ==========================================================
   DASHBOARD & STATISTIQUES
   ========================================================== */

async function fetchData() {
    try {
        // Chargement des commandes et utilisateurs depuis l'API
        const resOrders = await fetch("http://localhost:3000/api/admin/orders");
        orders = await resOrders.json();
        const resUsers = await fetch("http://localhost:3000/api/admin/users");
        users = await resUsers.json();
        loadDashboard();
    } catch (err) { 
        console.warn("API Offline - Using dummy data for dashboard preview"); 
        loadDashboard(); 
    }
}

function loadDashboard() {
    pageTitle.innerText = "Dashboard";
    // Calcul du revenu total des commandes payées
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
                <i class="fa fa-edit"></i> Update Menu
            </button>
        </div>
    `;
}

/* ===== AUTRES PAGES (STUBS) ===== */
function loadOrders() { 
    pageTitle.innerText = "Orders Management"; 
    main.innerHTML = "<div class='table-card'><h3>Orders list (Fetched from MySQL Database)</h3></div>"; 
}

function loadUsers() { 
    pageTitle.innerText = "Users Management"; 
    main.innerHTML = "<div class='table-card'><h3>Registered Students (ICTU Domain Only)</h3></div>"; 
}

// INITIALISATION AU DÉMARRAGE
fetchData();