const productListEl = document.querySelector('.container-products-js');

const selectListEl = document.querySelector('.select-menu-js')
const countEl = document.querySelector('.count')

const BASE_API ='https://brandstestowy.smallhost.pl/api'

const productItemMarkup = ({id})=> `<li class="product-item">ID: ${id} </li>`

const  productsListMarkup = (items) =>{
    return items.map(productItemMarkup).join('')
}


const selectElement = document.getElementById('item-count');

  async function fetchAdnRenderProducts(quality){
      try{
        const res = await fetch(`${BASE_API}/random?pageNumber=pageNumber=3&pageSize=${quality}`)
        const {data}= await res.json()
            const renderString = await productsListMarkup(data);
            productListEl.innerHTML = renderString
           }catch(error){
          console.log(error)
      }
  }

  selectElement.addEventListener('change', async function() {
    console.log('Выбрано значение:', this.value);
    countEl.innerHTML = this.value
      await fetchAdnRenderProducts(this.value)
});




