import { getCart } from "./cart";
import { globals } from "./globals";

let instance = sessionStorage.getItem('order') ?
    JSON.parse(sessionStorage.getItem('order')) : { payment_id: null, shipping_id: null, price: null, emails: 0 };

function getOrder() {
    return instance;
}

function savePrice(price) {
    instance.price = price;
    saveOrder();
}

function savePayment(payment_id) {
    instance.payment_id = payment_id;
    saveOrder();
}

function saveShipping(shipping_id) {
    instance.shipping_id = shipping_id;
    saveOrder();
}

function saveEmails(emails) {
    instance.emails = emails;
    saveOrder();
}

function popOrder() {
    instance = { payment_id: null, shipping_id: null, price: null, emails: [], transaction_id: null };
    sessionStorage.removeItem('order');
}

function saveOrder() {
    sessionStorage.setItem('order', JSON.stringify(instance));
}


async function sendOrder(user_id) {
    const payment_id = getOrder().payment_id;
    const shipping_id = getOrder().shipping_id;
    const price = getOrder().price;
    const emails = getOrder().emails;
    // Get the cart data
    const cart = getCart();

    // Create a new array of items
    const itemArray = cart.items.map(item => {
    return {
        item_id: item.item_id,
        quantity: item.quantity
    }
    });
    //console.log(itemArray);
    // $.post(`${globals.BACKEND_ROOT}/order_handler.php`, {       
    //     userID: user_id,
    //     paymentID: payment_id,
    //     shippingID: shipping_id,
    //     price: price,
    //     emails: emails,
    //     itemArray: itemArray,
    // }, function (response, status, xhr) {
    //     if (xhr.status == 200) {
    //         console.log('Success on Order');
    //         return true
    //     } else if (xhr.status == 400) {
    //         alert('Error: FATAL ERROR in ORDER');
    //     }
    // })
    let response = await fetch(`${globals.BACKEND_ROOT}/order_handler.php`, { 
        method: 'POST',
        body: JSON.stringify({
            userID: user_id,
            paymentID: payment_id,
            shippingID: shipping_id,
            price: price,
            emails: emails,
            itemArray: itemArray,
        })
    });
    console.log(response);
}

async function getMostRecentOrder(user_id) {
    const response = await fetch(`${globals.BACKEND_ROOT}/order_handler.php?userID=${user_id}`);
    const data = await response.json(); // parse the JSON response
    console.log(data);
    return data; // return the parsed data
}

async function getOrderInfo(transaction_id) {
    const response = await fetch(`${globals.BACKEND_ROOT}/order_handler.php?transactionID=${transaction_id}`);
    const data = await response.json(); // parse the JSON response
    return data; // return the parsed data
}


  
  
  
// Adding this line so it's accessible in event listeners
window.getOrder = getOrder;
window.savePrice = savePrice;
window.savePayment = savePayment;
window.saveShipping = saveShipping;
window.saveEmails = saveEmails;
window.popOrder = popOrder;
window.sendOrder = sendOrder;
window.getMostRecentOrder = getMostRecentOrder;
window.getOrderInfo = getOrderInfo;



export { getOrder, getOrderInfo, getMostRecentOrder, saveEmails, savePrice, savePayment, saveShipping, saveOrder, sendOrder, popOrder };
