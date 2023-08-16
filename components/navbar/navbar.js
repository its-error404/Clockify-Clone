document.addEventListener("DOMContentLoaded", () => {
  const userWorkspaceButton = document.querySelector(".user-workspace__button");
  const workspaceContainer = document.querySelector(".workspace-container");

  userWorkspaceButton.addEventListener("click", (e) => {
    workspaceContainer.classList.toggle("visible");
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!workspaceContainer.contains(e.target)) {
      workspaceContainer.classList.remove("visible");
    }
  });

  const menuIcon = document.getElementById('menu-icon')
  const sideNav = document.querySelector('.side-nav')
  let sideNavExpanded = false

  menuIcon.addEventListener('click', (e)=>{
    if(sideNavExpanded){
    sideNav.style.width = '3.5vw'
    }
    else{
      sideNav.style.width = '10vw'
    }
   sideNavExpanded = !sideNavExpanded
  })

  const upgradeButton = document.querySelector(".upgrade__button");

  upgradeButton.addEventListener("click", (e) => {
    window.location.href = "https://app.clockify.me/upgrade";
  });

  const notificationsButton = document.querySelector(".notifications__button");
  const notificationsDropdown = document.querySelector(
    ".notifications__dropdown"
  );

  notificationsButton.addEventListener("click", (e) => {
    notificationsDropdown.classList.toggle("visible");
    e.stopPropagation();

    document.addEventListener("click", (e) => {
      if (!notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove("visible");
      }
    });
  });

  const helpButton = document.querySelector(".help__button");
  const helpDropdown = document.querySelector(".help__dropdown");

  helpButton.addEventListener("click", (e) => {
    helpDropdown.classList.toggle("visible");
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!helpDropdown.contains(e.target)) {
      helpDropdown.classList.remove("visible");
    }
  });

  const profileButton = document.querySelector(".profile__button");
  const profileDropdown = document.querySelector(".profile__dropdown");

  profileButton.addEventListener("click", (e) => {
    profileDropdown.classList.toggle("visible");
    e.stopPropagation();
  });

  document.addEventListener("click", (e) => {
    if (!profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove("visible");
    }
  });

  const lastArrow = document.getElementById('last-arrow')
  const additionalItems = document.querySelector('.additional-items')

  lastArrow.addEventListener('click', ()=>
  {
    additionalItems.classList.toggle('expanded')
  })
});
