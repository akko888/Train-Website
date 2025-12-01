let menuItems = {};

fetch("../../backend/auth/auth_check.php", {
    credentials: "include"
})
.then(res => res.json())
.then(data => {
    if(!data.authenticated){
        alert('No puedes ordenar sin cuenta.'); 
        return window.location.href = "../logIn/logIn.html";
    }
    if(data.user.role === "admin"){
        alert('Los administradores no pueden ordenar.');
        return window.location.href = "../adminDashboard/adminDashboard.html";
    }
});

fetch("../../backend/controllers/getMenu.php")
.then(res => res.json())
.then(data => {
    
    Object.keys(data).forEach(function(key){

        const category = data[key];

        menuItems[category.title] = {
            price: category.price,
            items: category.items.map(itemName => ({name: itemName}))
        };
    });
});

let car = [];
let currentStep = 0;
let orderStarted = false;

document.querySelectorAll('.menu-wrapper button').forEach(function(btn){
    btn.addEventListener('click', function(){
        const category = btn.dataset.category;
        switchCategory(category);     
    });
});

function switchCategory(cat){
    const title = document.getElementById('menuTitle');
    const grid = document.getElementById('menuGrid');
    
    grid.innerHTML = '';
    title.innerHTML = cat + ' ' + menuItems[cat].price + '$';

    menuItems[cat].items.forEach(function(item){
        const div = document.createElement('div');
        const btn = document.createElement('button');
        btn.textContent = 'Añadir'; 
        btn.classList = 'menu-button';

        div.classList.add('menu-item');

        div.innerHTML = '<div>' + item.name + '</div>';
        div.appendChild(btn),
        
        btn.addEventListener('click', function(){
            addToCart(item.name, menuItems[cat].price);
        });

        grid.appendChild(div);
    });
}


function addToCart(name, price){
    const exists = car.find(function(i){return i.name === name});
    if(exists){exists.qty++}
    else{car.push({name, price, qty: 1});} 
    
    alert(name + " añadido al carrito!")
}

document.querySelectorAll('.options button').forEach(function(btn){
    btn.addEventListener('click', function(){
        switch(btn.id){
            case 'prevBtn':
                changeStep(-1);            
                break;
            case 'nextBtn':
                changeStep(1);
                break;
        }
    });
});

function changeStep(direction){
    const newStep = currentStep + direction;

    if(currentStep === 1 && newStep === 2 || currentStep === 2 && newStep === 3){
        if(car.length === 0){
            alert('Tu carrito está vacio. Añade al menos un artículo.');
            return;
        }
    }

    if(currentStep === 3 && newStep === 4){
        const form = document.getElementById('dataForm');

        if(!form.orderName.value.trim() || !form.orderDirection.value.trim()){
            alert("Por favor llena los campos.");
            return;
        }

        if(!form.typeOrder.value){
            alert("Por favor selecciona el tipo de orden.");
            return;
        }

        if(!form.pay.value){
            alert("Por favor selecciona el método de pago.");
            return;
        }

        if(form.pay.value === "card"){
            const cardInputs = document.querySelectorAll('#cardForm input');
            if (!cardInputs[0].value.trim() || !cardInputs[1].value.trim()) {
                alert("Completa la información de la tarjeta.");
                return;
            }
        }
    }

    currentStep = Math.max(0, Math.min(newStep, 4));

    if(currentStep > 0) orderStarted = true;
    if(currentStep === 4) orderStarted = false;

    const nextBtn = document.getElementById('nextBtn');
    if(currentStep === 0) nextBtn.innerText = 'Empezar';
    else if(currentStep === 3) nextBtn.innerText = 'Ordenar';
    else nextBtn.innerText = 'Siguiente';

    const prevBtn = document.getElementById('prevBtn');
    prevBtn.style.display = (currentStep <= 1) ? 'none' : 'inline-block';

    if(currentStep == 2){
        loadCar();
    }
    
    document.getElementById('orderStart').style.display = currentStep === 0 ? 'flex' : 'none';
    document.getElementsByClassName('progress-container')[0].style.display = currentStep === 0 ? 'none' : 'flex';
    document.getElementById('menuSidebar').style.display = currentStep === 1 ? 'flex' : 'none';
    document.getElementById('menuItems').style.display = currentStep === 1 ? 'flex' : 'none';
    document.getElementById('confirmation').style.display = currentStep === 2 ? 'flex' : 'none';
    document.getElementById('extraInfo').style.display = currentStep === 3 ? 'flex' : 'none';
    document.getElementById('finalStep').style.display = currentStep === 4 ? 'flex' : 'none';

    if(currentStep === 4){
        document.getElementsByClassName('progress-container')[0].style.display = 'none';
        document.getElementById('options').style.display = 'none';
        submitOrder();
    }
    
    window.addEventListener('beforeunload', function(e){
        if(orderStarted){
            e.preventDefault();
            e.returnValue = ""
        }
    });

    updateBar();
}


function loadCar(){
    const carList = document.getElementById('carList');
    carList.innerHTML = '';

    let total = 0;
     
    car.forEach(function(item, index){
        const div = document.createElement('div');
        const btndelete = document.createElement('button');
        btndelete.classList.add('btn-delete');
        btndelete.innerHTML = '<img src="../../Imgs/delete.svg" alt="No image">'
        div.classList.add('car-item');

        btndelete.addEventListener('click', function(){
            removeItem(index, item);
        });

        total += item.price *  item.qty;

        div.innerHTML = '<span>' + item.name + ' ' + item.price*item.qty + '$' + ' (Cantidad: ' + item.qty +')</span>';
        div.appendChild(btndelete);    

        carList.appendChild(div);
    });

    document.getElementById('totalPrice').innerHTML = 'Total: ' + total + '$'; 
}

function removeItem(i, it){
    if(it.qty == 1){
        car.splice(i, 1);
        loadCar();
    }
    else{
        it.qty -= 1;
        loadCar();
    }
}

function updateBar(){
    const bar = document.getElementById('progressBar');
    bar.style.width = (currentStep - 1) * 50 + '%';
}

document.getElementsByName('pay').forEach(function(radioInput){
    radioInput.addEventListener('click',function(){
        switch(radioInput.value){
            case 'tarjeta':
                document.getElementById('cardForm').style.display = 'flex';         
                break;
            case 'efectivo':
                document.getElementById('cardForm').style.display = 'none';
                break;
        }
    });
});

function submitOrder(){
    const orderItems = car.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty
    }));

    const total = car.reduce((sum, item) => sum + item.price * item.qty, 0);
    const form = document.getElementById('dataForm');
    const orderName = form.orderName.value;
    const direction = form.orderDirection.value;
    const typeOrder = form.typeOrder.value;
    const pay = form.pay.value;

    let cardNumber = null;
    let cardExpiration = null;

    if(pay == 'tarjeta'){
        const cardInputs = document.querySelectorAll('#cardForm input');
        cardNumber = cardInputs[0].value;
        cardExpiration = cardInputs[1].value;
    }

    const finalOrder = {
        items: orderItems,
        total,
        orderName,
        direction,
        typeOrder,
        pay,
        cardNumber,
        cardExpiration
    };

    fetch("../../backend/controllers/createOrder.php", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(finalOrder)
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            alert("Order submitted!");
        }else{
            alert("Error al enviar la orden: " + data.message);
            window.location.href = "../../index.html"
        }
    });
}

updateBar();
changeStep(0);
document.querySelector('.dataForm').addEventListener('submit', function(e){e.preventDefault();});
