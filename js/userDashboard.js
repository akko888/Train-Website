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
