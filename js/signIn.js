document.getElementById('registerForm').addEventListener('submit', function(e){
    e.preventDefault();

    const formData = new FormData(this);

    fetch("../../backend/controllers/register.php", {
        method: "POST",
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

            setTimeout(() => {
                window.location.href = "../../index.html";
            }, 1500);
        }
    });
});