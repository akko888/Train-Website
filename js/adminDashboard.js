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

fetch("../../backend/controllers/getAllOrders.php", { credentials: "include" })
.then(res => res.json())
.then(data => {
    const list = document.getElementById("orderList");
    list.innerHTML = "";
    if(!data.success || data.orders.length === 0){
        list.innerHTML = "<li>No orders yet.</li>";
        return;
    }
    data.orders.forEach(order => {
        const li = document.createElement("li");
        li.classList = "displayed";
        const itemNames = order.items.map(i => i.item_name + " x" + i.quantity).join(", ");
        li.innerHTML = `
        #${order.order_id} | ${order.username} | ${order.order_name} | ${order.order_type} | $${order.total_amount}<br>
        Items: ${itemNames} | <em>${order.created_at}</em>
        `;
        list.appendChild(li);
    });
});

fetch("../../backend/controllers/getUsers.php", { credentials: "include" })
.then(res => res.json())
.then(data => {
    const list = document.getElementById("userList");
    list.innerHTML = "";
    if(!data.success || data.users.length === 0){
        list.innerHTML = "<li>No users found.</li>";
        return;
    }
    data.users.forEach(user => {
        const li = document.createElement("li");
        li.classList = "displayed";
        li.innerHTML = `${user.username} | ${user.email} | ${user.role}`;
        list.appendChild(li);
    });
});

fetch("../../backend/controllers/getMenu.php", { credentials: "include" })
.then(res => res.json())
.then(data => {
    const list = document.getElementById("menuList");
    list.innerHTML = "";
    const categories = Object.values(data); 
    if(categories.length === 0){
        list.innerHTML = "<li>No menu items found.</li>";
        return;
    }
    categories.forEach(cat => {
        const li = document.createElement("li");
        li.classList = "displayed";
        const items = cat.items.map(i => i).join(", ");
        li.innerHTML = `${cat.title} (Price: ${cat.price}$): ${items}`;
        list.appendChild(li);
    });
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