const menus = {
  sushi:{
    title: "Sushi",
    items: ["Salmon Nigiri", "Tuna Nigiri", "Shrimp Nigiri", "California Roll", "Spicy Tuna Roll",
            "Philadelphia Roll", "Unagi Nigiri", "Tamago Nigiri","Rainbow Roll"],
    img: "Imgs/sushiMenu.png",
    price: 20
  },
  ramen:{
    title: "Ramen",
    items: ["Shoyu Ramen", "Tonkotsu Ramen", "Miso Ramen", "Shio Ramen", "Spicy Ramen", "Curry Ramen",
            "Tsukemen", "Vegetable Ramen", "Seafood Ramen"],
    img: "Imgs/ramenMenu.png",
    price: 20
  },
  onigiri:{
    title: "Onigiri",
    items: ["Salmon Onigiri", "Tuna Mayo Onigiri", "Umeboshi Onigiri", "Kombu Onigiri", "Okaka Onigiri",
            "Tarako Onigiri", "Chicken Teriyaki Onigiri", "Spicy Salmon Onigiri", "Seaweed Onigiri"],
    img: "Imgs/onigiriMenu.png",
    price: 10
  },
  drink:{
    title: "Drinks",
    items: ["Green Tea", "Ramune", "Calpico", "Coke", "Iced Tea"],
    img: "Imgs/drinkMenu.png",
    price: 5
  }
}

const buttons = document.querySelectorAll(".button-holder button");
const menuList = document.getElementById('menu-list');
const menuImg = document.getElementById('menu-img');
const menuTitle = document.getElementById('menu-title');

buttons.forEach(function(btn){
  btn.addEventListener('click', function(){
    const type = btn.dataset.menu;
    const data = menus[type];

    menuList.innerHTML = "";
    data.items.forEach(function(item){
      const li = document.createElement("li");
      li.textContent = item;
      menuList.appendChild(li);
    });


    menuImg.src = data.img;
    menuTitle.innerHTML = data.title + " " + data.price + "$";
  });
});

