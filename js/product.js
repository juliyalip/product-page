const productListEl = document.querySelector('.container-products-js');
const selectListEl = document.querySelector('.select-menu-js')
const containerSelectEl = document.getElementById('item-count');  //  контейнер для селекта
const countEl = document.querySelector('.count')
const BASE_API ='https://brandstestowy.smallhost.pl/api'




const productItemMarkup = ({id})=> `<li class="product-item">ID: ${id} </li>`

const  productsListMarkup = (items) =>{
    return items.map(productItemMarkup).join('')
}

const selectElement = document.getElementById('item-count');


window.addEventListener('resize', renderInitionSelect)

function generateSelect(length, step) {
    let options = '';
    for (let i = step; i <= length; i += step) {
      options += `<option value="${i}">${i}</option>`;
    }
    return options;
  }

const mobileContent = generateSelect(50, 2)
const desctopContent = generateSelect(50, 10)

renderInitionSelect()

function renderInitionSelect(){
    let quality = 2
    if(window.innerWidth <= 1199){
countEl.innerHTML = quality
containerSelectEl.innerHTML = mobileContent
fetchAdnRenderProducts(quality)
    } else{
        quality = 10
        countEl.innerHTML = quality
        containerSelectEl.innerHTML = desctopContent
        fetchAdnRenderProducts(quality) 
    }
}

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




