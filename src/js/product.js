const productListEl = document.querySelector('.container-products-js');
const selectListEl = document.querySelector('.select-menu-js');
const selectElement = document.getElementById('item-count');

const BASE_API = 'https://brandstestowy.smallhost.pl/api';

let totalProducts = 50; 
let allLoadedProducts = []; 
let hasMoreProducts = true; 

class ApiProducts {
  constructor() {
    this.page = 1;
    this._quantity = 8;
    this.isLoading = false;
    this.initResizeListener(); 
    this.updateQuantity(); 
  }

  get quantity() {
    return this._quantity;
  }

  set quantity(value) {
    if (typeof value === 'number' && value > 0) {
      this._quantity = value;
    } else {
      throw new Error('invalid number');
    }
  }

  updateQuantity() {
    const width = window.innerWidth;

    if (width <= 767) {
      this.quantity = 2; 
    } else if (width <= 1199) {
      this.quantity = 6; 
    } else {
      this.quantity = 8; 
    }
  }

  initResizeListener() {
    window.addEventListener("resize", () => {
      this.updateQuantity();
    });
  }

  async fetchProducts() {
    if (this.isLoading || !hasMoreProducts) return [];
    this.isLoading = true;

    try {
      const response = await fetch(`${BASE_API}/random?pageNumber=${this.page}&pageSize=${this._quantity}`);
      if (!response.ok) {
        throw new Error('Error response from server');
      }

      const data = await response.json();
      this.page += 1; 
      this.isLoading = false;

      allLoadedProducts = [...allLoadedProducts, ...data.data];

    
      if (allLoadedProducts.length >= totalProducts) {
        hasMoreProducts = false;
      }

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
      if (scrollTop + clientHeight >= scrollHeight - 70) {
        if (!hasMoreProducts) {
          console.log('No more products to load.');
          return;
        }

        const products = await this.fetchProducts();
        if (products.length > 0) {
          renderProducts(products, container);
        }
      }
    });
  }
}

function renderProducts(products, container) {
  const renderString = productsListMarkup(products);
  container.insertAdjacentHTML('beforeend', renderString);
}

const productItemMarkup = ({ id }) => `<li class="product-item" data-source=${id}><div>ID: ${id}</div></li>`;
const productsListMarkup = (items) => items.map(productItemMarkup).join('');

const apiProducts = new ApiProducts();

apiProducts.startToScroll(productListEl);

async function resetAndReload() {
  apiProducts.page = 1;
  allLoadedProducts = [];
  hasMoreProducts = true;
  productListEl.innerHTML = '';
  await renderInterface();
}

async function renderInterface() {
  try {
    const products = await apiProducts.fetchProducts();
    if (products.length > 0) {
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

