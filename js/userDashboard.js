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
        list.innerHTML = '<li>We could not find your order /ᐠ ╥ ˕ ╥マ</li>';
        return;
    }

    let filteredOrders = data.orders.filter(order => order.status !== 'canceled');
    if(!showCompleted){
        filteredOrders = filteredOrders.filter(order => order.status !== 'completed');
    }

    if(filteredOrders.length === 0){
        list.innerHTML = '<li>No orders to display... /ᐠ ╥ ˕ ╥マ</li>';
        return;
    }

    filteredOrders.forEach(function(order){
        const li = document.createElement("li");
        li.classList = "displayed";

        const itemNames = order.items.map(i => i.item_name + " x" + i.quantity).join(", ");

        li.innerHTML = `
            Order #${order.order_id}<br>
            Name: ${order.order_name}<br>
            Type: ${order.order_type}<br>
            Total: $${order.total_amount}<br>
            Items: ${itemNames}<br>
            Status: ${order.status}<br>
            <em>${order.created_at}</em><br>
            ${order.status === 'pending' ? `<button class="cancelBtn" data-id="${order.order_id}">Cancel</button>` : ''}
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
toggleBtn.textContent = "Hide/Show Completed Orders";
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
    
    if(!confirm("Are you sure you want to delete your account? This cannot be undone.")){
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
        alert("New password do not match!");
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