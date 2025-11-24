const menuItems = {
    Sushi: [{name: "Salmon Nigiri"}, {name: "Tuna Nigiri"}, {name: "Shrimp Nigiri"}, {name: "California Roll"}, 
            {name: "Spicy Tuna Roll"}, {name: "Philadelphia Roll"}, {name: "Unagi Nigiri"}, 
            {name: "Tamago Nigiri"}, {name: "Rainbow Roll"}],
    Ramen: [{name: "Shoyu Ramen"}, {name: "Tonkotsu Ramen"}, {name: "Miso Ramen"}, {name: "Shio Ramen"}, 
            {name: "Spicy Ramen"},{name: "Curry Ramen"}, {name: "Tsukemen"}, {name: "Vegetable Ramen"}, 
            {name: "Seafood Ramen"}],
    Onigiri: [{name: "Salmon Onigiri"}, {name: "Tuna Mayo Onigiri"}, {name: "Umeboshi Onigiri"}, 
              {name: "Kombu Onigiri"}, {name: "Okaka Onigiri"}, {name: "Tarako Onigiri"}, 
              {name: "Chicken Teriyaki Onigiri"}, {name: "Spicy Salmon Onigiri"}, {name: "Seaweed Onigiri"}],
    Drinks: [{name: "Green Tea"}, {name: "Ramune"}, {name: "Calpico"}, {name: "Coke"}, {name: "Iced Tea"}]
};

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
    title.innerHTML = cat;

    menuItems[cat].forEach(function(item){
        const div = document.createElement('div');
        const btn = document.createElement('button');
        btn.textContent = 'Add'; 
        btn.classList = 'menu-button';

        div.classList.add('menu-item');

        div.innerHTML = '<div>' + item.name + '</div>';
        div.appendChild(btn),
        
        btn.addEventListener('click', function(){
            addToCart(item.name);
        });

        grid.appendChild(div);
    });
}


function addToCart(name){
    const exists = car.find(function(i){return i.name === name});
    if(exists){exists.qty++}
    else{car.push({name, qty: 1});} 
    
    alert(name + " added to cart!")
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
    const prevStep = currentStep;
    const newStep = currentStep + direction;
    document.getElementById('prevBtn').style.display = (currentStep === 0 || currentStep === 1) ? 'none' : 'inline-block';

    if(prevStep === 1 && newStep === 2){
        if(car.length === 0){
            alert('Your cart is empty. Add at least one item.');
            return;
        }
    }

    if(prevStep === 3 && newStep === 4){
        const form = document.getElementById('dataForm');

        if(!form.orderName.value.trim() || !form.orderDirection.value.trim()){
            alert("Please fill all required fields.");
            return;
        }

        if(!form.typeOrder.value){
            alert("Please select a type of order.");
            return;
        }

        if(!form.pay.value){
            alert("Please select a payment method.");
            return;
        }

        if(form.pay.value === "card"){
            const cardInputs = document.querySelectorAll('#cardForm input');
            if (!cardInputs[0].value.trim() || !cardInputs[1].value.trim()) {
                alert("Please complete the card information.");
                return;
            }
        }
    }

    currentStep = newStep;

    if(prevStep === 0 && currentStep == 1){
        orderStarted = true;
    }

    let nextText = 'Next';
    if(currentStep === 0) nextText = 'Start';
    if(currentStep === 3) nextText = 'Submit';

    if(prevStep === 3 && currentStep === 4){
        orderStarted = false;
        submitOrder();
    }

    if(currentStep > 3){
        currentStep = 4;
    }

    document.getElementById('nextBtn').innerText = nextText;

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
     
    car.forEach(function(item, index){
        const div = document.createElement('div');
        const btndelete = document.createElement('button');
        btndelete.classList.add('btn-delete');
        btndelete.innerHTML = '<img src="../../Imgs/delete.svg" alt="No image">'
        div.classList.add('car-item');

        btndelete.addEventListener('click', function(){
            removeItem(index, item);
        });

        div.innerHTML = '<span>' + item.name + ' (Quantity: ' + item.qty +')</span>';
        div.appendChild(btndelete);    

        carList.appendChild(div);
    });
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
            case 'card':
                document.getElementById('cardForm').style.display = 'flex';         
                break;
            case 'cash':
                document.getElementById('cardForm').style.display = 'none';
                break;
        }
    });
});

function submitOrder(){
    const orderItems = car.map(item => ({
        name: item.name,
        qty: item.qty
    }));

    const form = document.getElementById('dataForm');
    const orderName = form.orderName.value;
    const direction = form.orderDirection.value;
    const typeOrder = form.typeOrder.value;
    const pay = form.pay.value;

    let cardNumber = null;
    let cardExpiration = null;

    if(pay == 'card'){
        const cardInputs = document.querySelectorAll('#cardForm input');
        cardNumber = cardInputs[0].value;
        cardExpiration = cardInputs[1].value;
    }

    const finalOrder = {
        items: orderItems,
        orderName,
        direction,
        typeOrder,
        pay,
        cardNumber,
        cardExpiration
    };

}

updateBar();
changeStep(0);
document.querySelector('.dataForm').addEventListener('submit', function(e){e.preventDefault();});
