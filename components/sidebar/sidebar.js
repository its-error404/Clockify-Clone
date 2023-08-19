document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const sideNav = document.querySelector(".side-nav");
    const menuText = document.querySelector(".menu-text");
    const itemMenu = document.querySelector('.item-menu');
    
    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("rotate-icon");
      sideNav.classList.toggle("expanded");
      menuText.classList.toggle("active");
      if (sideNav.classList.contains("expanded")) {
        itemMenu.style.display = "none";
        itemMenu.style.visibility = "hidden";
      }
      menuIcon.classList.toggle("rotate-icon");
    });
  });
  