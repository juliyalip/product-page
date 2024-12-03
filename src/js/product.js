const productListEl = document.querySelector('.container-products-js');
const selectListEl = document.querySelector('.select-menu-js');
const containerSelectEl = document.getElementById('item-count');
const qualityProductEl = document.querySelector('.count');
const selectElement = document.getElementById('item-count');

const BASE_API = 'https://brandstestowy.smallhost.pl/api';

let totalLoadedProducts = 0; // Счетчик всех загруженных продуктов
let allLoadedProducts = []; // Массив для хранения всех загруженных продуктов
let hasMoreProducts = true; // Флаг наличия данных

class ApiProducts {
  constructor() {
    this.page = 1;
    this._quantity = 8;
    this.isLoading = false;
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    if (typeof value === 'number' && value > 0) {
      this._quantity = value;
    } else {
      throw new Error('Quantity must be a positive number');
    }
  }

  async fetchProducts() {
    if (this.isLoading) return [];
    this.isLoading = true;
    try {
      const response = await fetch(`${BASE_API}/random?pageNumber=${this.page}&pageSize=${this._quantity}`);
      if (!response.ok) {
        throw new Error('Error response from server');
      }
      const data = await response.json();
      this.page += 1;
      this.isLoading = false;
      return data.data;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      return []; 
    }
  }

  startToScroll(container) {
    window.addEventListener('scroll', async () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        const products = await this.fetchProducts();
        if (products && products.length > 0) {
          renderProducts(products, container);
          totalLoadedProducts += products.length; 
          qualityProductEl.textContent = totalLoadedProducts; 
          console.log('Updated totalLoadedProducts:', totalLoadedProducts); 
        } else {
          console.log('No more products to load.');
          hasMoreProducts = false; 
        }
      }
    });
  }
}

function renderProducts(products, container) {
  const renderString = productsListMarkup(products);
  container.insertAdjacentHTML('beforeend', renderString);
}

const productItemMarkup = ({ id }) => `<li class="product-item" data-sourse=${id}>ID: ${id}</li>`;
const productsListMarkup = (items) => items.map(productItemMarkup).join('');

const apiProducts = new ApiProducts();

selectElement.addEventListener('change', (event) => {
  const newQuantity = parseInt(event.target.value, 10);
  apiProducts.quantity = newQuantity;
  resetAndReload();
});

async function resetAndReload() {
  apiProducts.page = 1;
  productListEl.innerHTML = ''; 
  totalLoadedProducts = 0; 
  await renderInterface();
}

async function renderInterface() {
  try {
    const products = await apiProducts.fetchProducts();
    if (products && products.length > 0) {
      totalLoadedProducts += products.length; 
      qualityProductEl.textContent = totalLoadedProducts; 
      console.log('Updated totalLoadedProducts:', totalLoadedProducts); 
      renderProducts(products, productListEl);
    } else {
      console.log('No more products to load.');
      hasMoreProducts = false; 
    }
  } catch (error) {
    console.error(error);
  }
}

renderInterface();
apiProducts.startToScroll(productListEl);


