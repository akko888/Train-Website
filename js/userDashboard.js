fetch("../../backend/auth/auth_check.php", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {
    if(!data.authenticated){
        window.location.href = "../logIn/logIn.html";
        return;
    }

    document.getElementById('username').innerHTML = data.user.username + "!";
    document.getElementById('usernameInfo').innerHTML = data.user.username;
    document.getElementById('email').innerHTML = data.user.email;
    document.getElementById('role').innerHTML = data.user.role;
});

let showCompleted = true;

async function fetchOrders() {
    const res = await fetch("../../backend/controllers/getOrders.php", { credentials: "include" });
    const data = await res.json();
    
    const list = document.getElementById("orderList");
    list.innerHTML = "";

    if(!data.success){
        list.innerHTML = '<li>No pudimos encontrar tus ordenes /ᐠ ╥ ˕ ╥マ</li>';
        return;
    }

    let filteredOrders = data.orders.filter(order => order.status !== 'cancelada');
    if(!showCompleted){
        filteredOrders = filteredOrders.filter(order => order.status !== 'completada');
    }

    if(filteredOrders.length === 0){
        list.innerHTML = '<li>Sin ordenes que mostrar... /ᐠ ╥ ˕ ╥マ</li>';
        return;
    }

    filteredOrders.forEach(function(order){
        const li = document.createElement("li");
        li.classList = "displayed";

        const itemNames = order.items.map(i => i.item_name + " x" + i.quantity).join(", ");

        li.innerHTML = `
            Orden número #${order.order_id}<br>
            Nombre: ${order.order_name}<br>
            Tipo: ${order.order_type}<br>
            Total: $${order.total_amount}<br>
            Artículos: ${itemNames}<br>
            Estado: ${order.status}<br>
            <em>${order.created_at}</em><br>
            ${order.status === 'pendiente' ? `<button class="cancelBtn" data-id="${order.order_id}">Cancel</button>` : ''}
        `;

        list.appendChild(li);
    });

    document.querySelectorAll('.cancelBtn').forEach(function(btn){
        btn.addEventListener('click', async function(){
            const orderId = this.dataset.id;
            const res = await fetch("../../backend/controllers/cancelOrder.php", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `order_id=${orderId}`
            });

            const data = await res.json();
            alert(data.message);
            if(data.success){
                fetchOrders();
            }
        });
    });
}

const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Esconder/Mostrar Ordenes Completadas";
toggleBtn.classList = "toggle-btn";
toggleBtn.addEventListener("click", function(){
    showCompleted = !showCompleted;
    fetchOrders();
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

document.getElementById('editBtn').addEventListener('click', function(){
    document.getElementById('editFormBox').classList.remove("hidden");
});

document.getElementById('cancelEdit').addEventListener('click', function(){
    document.getElementById('editFormBox').classList.add("hidden");
});

document.getElementById('changePasswordBtn').addEventListener('click', function(){
    document.getElementById('passwordFormBox').classList.remove("hidden");
});

document.getElementById('cancelPassword').addEventListener('click', function(){
    document.getElementById('passwordFormBox').classList.add("hidden");
});

document.getElementById('editForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const formData = new FormData(this);

    const res = await fetch("../../backend/controllers/updateData.php", {
        method: "POST",
        credentials: "include",
        body: formData
    })

    const data = await res.json();
    alert(data.message);

    if(data.updated){
        location.reload();
    }
});

document.getElementById('passwordForm').addEventListener('submit', async function(e){
    e.preventDefault();

    const formData = new FormData(this);
    
    const newPass = formData.get("newPassword");
    const repeat = formData.get("repeatPassword");

    if(newPass !== repeat){
        alert("La contraseñas no coinciden!");
        return;
    }

    const res = await fetch("../../backend/controllers/changePassword.php", {
        method: "POST",
        credentials: "include",
        body: formData
    });

    const data = await res.json();
    alert(data.message);

    if(data.changed){
        document.getElementById("passwordFormBox").classList.add("hidden");
    }
});

document.querySelector(".order-box").prepend(toggleBtn);

fetchOrders();