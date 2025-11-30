fetch("../../backend/auth/auth_check.php", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {
    if(data.authenticated){
        if(data.user.role === "admin"){
            window.location.href = "../adminDashboard/adminDashboard.html";
        }else{
            window.location.href = "../userDashboard/userDashboard.html";
        }
    }
});

document.getElementById('logInForm').addEventListener('submit', function(e){
    e.preventDefault();

    const formData = new FormData(this);

    fetch("../../backend/controllers/logIn.php", {
        method: "POST",
        credentials: "include",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        const errorbox = document.getElementById('errorBox');
        const successbox = document.getElementById('successBox');

        errorbox.innerHTML = "";
        successbox.innerHTML = "";

        if(!data.success){
            data.errors.forEach(err => {
                const p = document.createElement('p');
                p.textContent = err;
                p.classList.add('error');
                errorbox.appendChild(p); 
            });
            errorbox.style.display = 'inline-block';
            successbox.style.display = 'none';
        }else{
            successbox.textContent = data.message;
            successbox.style.display = 'inline-block';
            errorbox.style.display = 'none';

            if(data.user.role === "admin"){
                setTimeout(() => {
                    window.location.href = "../adminDashboard/adminDashboard.html";
                }, 1500);
            }else{
                setTimeout(() => {
                    window.location.href = "../userDashboard/userDashboard.html";
                }, 1500);
            }
        }
    });
}); 