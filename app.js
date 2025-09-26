const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");

import { products, productsData } from "./products.js";

let cart = [];

// 1. get products
class Products {
  // get from api end point !  
  getProducts() {
    return productsData;
  }
}

// 2. display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">${product.price}</p>
        <p class="product-title">$ ${product.title}</p>
      </div>
      <button class="btn add-to-cart" data-id=${product.id}>
        add to cart
      </button>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }
  getAddToCartBtns() {
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtns];

    buttons.forEach((btn) => {
      const id = btn.dataset.id;
    // check if this item is already in the cart
      const isInCart = cart.find((p)=>p.id===id);
      if (isInCart){
        btn.innerText= "In Cart";
        btn.disable= true;
      }

      btn.addEventListener("click",(event)=> {
        event.target.innerText = "In Cart";
        event.target.disable = true;
        // get product rom products :
        const addedProduct = Storage.getProduct(id);
        // add to cart
        cart = [...cart, {addedProduct,quantity:1}];
        // save cart to local storage
        Storage.saveCart(cart);
        // update cart value
        this.setCartValue(cart);

        // add to cart item
        // get cart from storage
      });
    });
  }
  setCartValue(Cart) {
    // 1. cart items : 
    // 2. cart total price :
    const tempCartItems = 0;
    const totalPrice = cart.reduce((acc,curr)=>{
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    },0);
    cartTotal.innerText = `total price : ${totalPrice.toFixed(2)} $`;
    tempCartItems.innerText = tempCartItems;
  }
}

// 3. storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  // set up already added cart items
  ui.setupApp();
  const products = new Products();
  //   get all products :
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  ui.getCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});


// cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
