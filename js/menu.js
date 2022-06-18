//INIT VIEWPORT HEIGHT
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

function toogleMenu(){
    const menu = document.getElementById('menu_section')
    menu.classList.toggle('active_menu')
}