const productListEl = document.querySelector('.container-products-js');
const selectListEl = document.querySelector('.select-menu-js');
const countEl = document.querySelector('.count');
const dropDownList = document.querySelector('.dropdown-list');
const countWrapper = document.querySelector('.click-count-js')
const section3 = document.getElementById('section3')

const BASE_API = 'https://brandstestowy.smallhost.pl/api';

countWrapper.addEventListener('click', onToggleDropdownMenu)

function onToggleDropdownMenu() {
  dropDownList.classList.toggle('isOpen')
}

function renderProducts(products, container) {
  const renderString = productsListMarkup(products);
  container.insertAdjacentHTML('beforeend', renderString);
}

const productItemMarkup = ({ id }) => `<li class="product-item" data-source=${id}><div>ID: ${id}</div></li>`;
const productsListMarkup = (items) => items.map(productItemMarkup).join('');

class ApiProducts {
  constructor(selector) {
    this.currentPage = 1;
    this.totalPages = 0;
    this.loading = false;
    this._pageSize = 8;
    this._selector = selector;
    this.endOfPage = false;
  }

  get pageSize() {
    return this._pageSize
  }

  async loadingInitionProducts() {

    try {

      this.loading = true;
      const response = await fetch(`${BASE_API}/random?pageNumber=${this.currentPage}&pageSize=${this._pageSize}`)
      const { totalPages, data } = await response.json();
      this.currentPage += 1;
      this.totalPages = totalPages;
      countEl.textContent = this._pageSize

      this._selector.textContent = this._pageSize;

      renderProducts(data, productListEl)
      window.addEventListener("scroll", debounce(apiProducts.startToScroll.bind(apiProducts), 200))

    } catch (error) {
      console.log(error)
    } finally {
      this.loading = false
    }
  }

  async onClickMenu(e) {
    if (!e.target.classList.contains("item-count")) {
      return
    }

    const selectedCount = e.target.dataset.count

    onToggleDropdownMenu()
    countEl.textContent = ''
    dropDownList.classList.remove('isOpen')

    productListEl.innerHTML = '';
    this.currentPage = 1;
    this._pageSize = Number(selectedCount);
    try {
      this.loading = true
      const responce = await fetch(`${BASE_API}/random?pageNumber=${this.currentPage}&pageSize=${this._pageSize}`);
      const { data, totalPages, currentPage } = await responce.json();
      renderProducts(data, productListEl)
      this.totalPages = totalPages;
      countEl.textContent = this._pageSize
      this.currentPage += 1

    } catch (error) {
      console.log(error)
    } finally {
      this.loading = false
    }

  }

  async startToScroll() {
    if (this.loading) {
      return
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {

      try {

        this.loading = true
        const responce = await fetch(`${BASE_API}/random?pageNumber=${this.currentPage}&pageSize=${this._pageSize}`);
        const { data, currentPage } = await responce.json();
        this.currentPage += 1;
        renderProducts(data, productListEl)
        countEl.textContent = currentPage * this._pageSize
        if (this.currentPage > this.totalPages) {
          window.removeEventListener("scroll", this.startToScroll.bind(this))
        }

      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }

    }
  }
}


const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const apiProducts = new ApiProducts(countEl)

const onSectionVisible = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      apiProducts.loadingInitionProducts();
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(onSectionVisible, {
  root: null,
  threshold: 1,
});

observer.observe(section3);

dropDownList.addEventListener('click', apiProducts.onClickMenu.bind(apiProducts))


window.addEventListener('scroll', function () {
  const scrollPosition = window.scrollY;
  const container = document.getElementById("section3");

  container.style.backgroundPosition = `center ${scrollPosition * 0.2}px`;
});