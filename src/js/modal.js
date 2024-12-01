const spritePath = './icons/symbol-defs.svg'; 
const modalEl = document.querySelector('.modal')
const productListEl = document.querySelector('.container-products-js');
const contentEl = modalEl.querySelector('.content');
const iconCloseEl = modalEl.querySelector('.icon-crose');


productListEl.addEventListener('click', onOpenModal)

function onOpenModal(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'LI') {
    return
     };
   
    const id = e.target.dataset.sourse
    modalEl.classList.add("is-open")
    modalMarkup(id)
    };
 
  
  const modalMarkup =(id) =>{
    const markup =  `<div>
    <span> ID: ${id} </span>         
    <ul>
     <li>Nazwa: </li>
    <li>Wartość: </li>
    </ul>
    </div>`
    return contentEl.innerHTML = markup
  }
  

modalEl.addEventListener('click', onClickBackdrop)
iconCloseEl.addEventListener('click', closeModal )


function onClickBackdrop(event){
if(event.target === event.currentTarget){
    modalEl.classList.remove("is-open")
}
}

function closeModal (){
    modalEl.classList.remove("is-open")
}

