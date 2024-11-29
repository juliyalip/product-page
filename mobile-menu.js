const buttonEl = document.querySelector('.btn-menu');
const mobileMenuEl = document.querySelector('[data-menu]')

buttonEl.addEventListener('click', onToggleMenu);

function onToggleMenu(){
   mobileMenuEl.classList.toggle('is-open')
}




