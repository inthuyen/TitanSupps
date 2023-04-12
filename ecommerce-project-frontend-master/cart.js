import { updateCartImageText } from "./events.js";

let instance = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : { items: [] };

function getCart() {
    return instance;
}

function saveCart() {
    console.log(instance);
    localStorage.setItem('cart', JSON.stringify(instance));
}

function clearCart() {
  instance.items = [];
  localStorage.removeItem('cart');
  saveCart();
  updateCartImageText();
}



function addToCart(item_id, quantity) {
    let cart = getCart();

    // Check if the item is already in the cart
    let existingItemIndex = cart.items.findIndex(item => item.item_id === item_id);

    if (existingItemIndex === -1) {
      // Item is not in the cart, add it as a new item
      cart.items.push({ item_id: item_id, quantity: Number(quantity) });
    } else {
      // Item is already in the cart, update its quantity
      cart.items[existingItemIndex].quantity += Number(quantity);
    }

    saveCart();
}

async function updateCart(item_id, quantity) {
  let cart = getCart();

  // Find the index of the item in the cart
  let itemIndex = cart.items.findIndex(item => item.item_id === item_id);

  // If the item is not in the cart, do nothing
  if (itemIndex === -1) {
    return;
  }

  // Remove the item from the cart if the specified quantity is zero
  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    // Update the quantity of the item in the cart
    cart.items[itemIndex].quantity = Number(quantity);
  }

  saveCart();
}

  
  


export { getCart, saveCart, addToCart, updateCart, clearCart };