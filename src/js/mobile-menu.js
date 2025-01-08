const buttonEl = document.querySelector('.btn-menu');
const mobileMenuEl = document.querySelector('[data-menu]')
const mobileMenuList = document.querySelector('.list-menu-mobile')


buttonEl.addEventListener('click', onToggleMenu);

function onToggleMenu(){
   mobileMenuEl.classList.toggle('is-open')
}

mobileMenuList.addEventListener('click', onClickMobileMenu)


function onClickMobileMenu(e){
   if (!e.target.classList.contains('link-menu-mobile')){
      return
   }
 onToggleMenu()
}