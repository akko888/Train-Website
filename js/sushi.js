let menus = {};

fetch("backend/controllers/getMenu.php")
.then(res => res.json())
.then(data => {
  menus = data;
  setUpButtons();
});

function setUpButtons(){
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
}

