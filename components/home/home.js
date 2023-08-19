document.addEventListener("DOMContentLoaded", () => {

    const menuIcon = document.getElementById('menu-icon')
    const sidebar = document.querySelector('.side-nav')
    const featureSection = document.querySelector('.feature-section')
    
    menuIcon.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
        featureSection.classList.toggle('expanded');
      });
})