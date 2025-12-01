fetch("../../backend/auth/auth_check.php", {credentials: "include"})
.then(res => res.json())
.then(data => {
    if(!data.authenticated || data.user.role !== "admin"){
        window.location.href = "../logIn/logIn.html";
        return; 
    }

    document.getElementById('username').innerText = data.user.username + '!';
    document.getElementById('usernameInfo').innerText = data.user.username;
    document.getElementById('email').innerText = data.user.email;
    document.getElementById('role').innerText = data.user.role;
});

let showCompleted = true;

function fetchAllOrders() {
    fetch("../../backend/controllers/getAllOrders.php", {credentials: "include"})
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("orderList");
        list.innerHTML = "";

        if(!data.success || data.orders.length === 0){
            list.innerHTML = "<li>Sin ordenes.</li>";
            return;
        }

        let orders = data.orders;
        if (!showCompleted) {
            orders = orders.filter(order => order.status !== "completada");
        }

        orders.forEach(function(order){
            const li = document.createElement("li");
            li.classList = "displayed";

            const itemNames = order.items
                .map(i => `${i.item_name} x${i.quantity}`)
                .join(", ");

            li.innerHTML = `
                #${order.order_id} | ${order.username} | ${order.order_name} | 
                ${order.order_type} | $${order.total_amount}<br>
                Estado: ${order.status}<br>
                Artículos: ${itemNames} | <em>${order.created_at}</em><br>
                ${order.status === "pendiente" ? 
                `<button class="completeBtn" data-id="${order.order_id}">Completar</button>`
                : ''}
            `;

            list.appendChild(li);
        });
        attachCompleteButtons();
    });
}

function attachCompleteButtons(){
    document.querySelectorAll(".completeBtn").forEach(btn => {
        btn.addEventListener('click', async function(){
            const orderId = btn.dataset.id;

            const res = await fetch("../../backend/controllers/completeOrder.php", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `order_id=${orderId}`
            });

            const data = await res.json();
            alert(data.message);

            if(data.success){
                fetchAllOrders();
            }
        });
    });
}
document.getElementById("toggleCompleted").addEventListener("click", () => {
    showCompleted = !showCompleted;

    document.getElementById("toggleCompleted").innerText =
        showCompleted ? "Esconder completadas" : "Mostrar completadas";

    fetchAllOrders();
});

fetch("../../backend/controllers/getUsers.php", { credentials: "include" })
.then(res => res.json())
.then(data => {
    const list = document.getElementById("userList");
    list.innerHTML = "";
    if(!data.success || data.users.length === 0){
        list.innerHTML = "<li>Sin usuarios.</li>";
        return;
    }
    data.users.forEach(user => {
        const li = document.createElement("li");
        li.classList = "displayed";
        li.innerHTML = `${user.username} | ${user.email} | ${user.role}`;
        list.appendChild(li);
    });
});

fetch("../../backend/controllers/getAllMenuItems.php", {credentials: "include"})
.then(res => res.json())
.then(data => {
    const list = document.getElementById("menuList");
    list.innerHTML = "";

    if(!data.success){
        list.innerHTML = "<li>Error cargando el menu.</li>";
        return;
    }

    const categories = {};
    data.items.forEach(item => {
        if(!categories[item.category_id]){
            categories[item.category_id] = {
                name: item.category_name,
                items: []
            };
        }
        categories[item.category_id].items.push(item);
    });

    Object.values(categories).forEach(cat => {
        const li = document.createElement("li");
        li.classList = "displayed";

        let html = `${cat.name}<br><ul>`;

        cat.items.forEach(i => {
            html += `
                <li>
                    ${i.item_name} — $${i.price}
                    <button class="deleteItem" data-id="${i.item_id}">
                        Borrar
                    </button>
                </li>
            `;
        });

        html += `
            <li>
                <input class="newName" placeholder="Nuevo artículo">
                <input class="newPrice" type="number" step="0.01" placeholder="Precio">
                <button class="addItem" data-category="${cat.name}">
                    Añadir
                </button>
            </li>
        `;

        html += "</ul>";
        li.innerHTML = html;
        list.appendChild(li);
    });

    attachMenuButtons();
});

document.getElementById('logOutBtn').addEventListener('click', async function(){
    const response = await fetch("../../backend/controllers/logOut.php", {
        method: "POST",
        credentials: "include"
    });

    if(response.ok){
        window.location.href = "../logIn/logIn.html";
    }
});

document.getElementById('deleteBtn').addEventListener('click', async function(){
    
    if(!confirm("¿Estás seguro que quieres borar la cuenta? No puede ser deshecho.")){
        return;
    }

    fetch("../../backend/controllers/deleteAccount.php", {
        method: "POST",
        credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

        if(data.deleted){
            window.location.href = "../logIn/logIn.html";
        }
    })
    .catch(err => console.error(err));
});

function attachMenuButtons(){
    document.querySelectorAll(".deleteItem").forEach(btn => {
        btn.addEventListener("click", async () => {
            if(!confirm("Elimnar este artículo?")) return;

            const res = await fetch("../../backend/controllers/deleteMenuItem.php", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `item_id=${btn.dataset.id}`
            });

            const data = await res.json();
            alert(data.message);
            location.reload();
        });
    });

    document.querySelectorAll(".addItem").forEach(btn => {
        btn.addEventListener("click", async () => {
            const container = btn.parentElement;
            const name = container.querySelector(".newName").value;
            const price = container.querySelector(".newPrice").value;

            const categoryId = {
                Sushi: 1,
                Ramen: 2,
                Onigiri: 3,
                Bebidas: 4
            }[btn.dataset.category];

            if(!name || !price) return alert("Missing data");

            const res = await fetch("../../backend/controllers/addMenuItem.php", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `category_id=${categoryId}&item_name=${name}&price=${price}`
            });

            const data = await res.json();
            alert(data.message);
            location.reload();
        });
    });
}

fetchAllOrders();