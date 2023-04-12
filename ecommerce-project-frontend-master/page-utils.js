import { isUserSignedIn, signOut, getUserID } from './auth.js';
import { globals } from './globals.js';
import * as pages from './pages.js';
import { getOrder, getOrderInfo, getMostRecentOrder, savePrice, savePayment, saveShipping, popOrder, sendOrder, saveOrder, saveEmails } from './order.js';
import { clearCart, getCart } from './cart.js';


function setAdminMode(isAdminMode) {

    globals.ADMIN_MODE = isAdminMode;

}

function navigate(pageRef, args = {}, withAngularRouting = false) {

    if(withAngularRouting){
        window.location.href = `/#!${pageRef}?` + new URLSearchParams(args);
        return;
    }

    let pageLoadFunc = pages[pageRef];

    if (!(pageLoadFunc instanceof Function)) {
        console.error(`Invalid page reference of ${pageRef}. This must reference the name of a function defined in pages.js`);
        return;
    }

    $('#app').html(pageLoadFunc(args));

    assignRouterListeners();

    toggleElementsByAccessControl();
    togglePageElements(pageRef);

    if (pageRef === 'catalog') {
        loadCatalogPage();
    } else if (pageRef === 'cart') {
        loadCartPage();
    } else if (pageRef === 'signOut') {
        onSignOutPageOpen();
    } else if (pageRef === 'adminHome') {
        loadAdminHome();
    } else if (pageRef === 'adminControls') {
        loadAdminControls();
    } else if (pageRef === 'editCatalogItem') {
        if (args.id) {
            loadEditItemPage(args.id);
        }
    }else if(pageRef === 'orderInfo'){
      loadOrderInfoPage();
    }else if(pageRef === 'addPayment'){
      loadAddPaymentPage();
    }else if(pageRef === 'payments'){
      loadPaymentPage();
    }else if(pageRef === 'addShipping'){
      loadAddShippingPage();
    }else if(pageRef === 'shipping'){
      loadShippingPage();
    }else if(pageRef === 'contact'){
      loadContactPage();
    }
    

}

function onRouterLinkClick() {

    let pageRef = $(this).data('page-ref');
    if(!pageRef){
        console.warn('No page ref for clicked router link');
        return;
    }

    navigate(pageRef);

}

function assignRouterListeners() {

    $('.router-link').off('click', onRouterLinkClick);
    $('.router-link').on('click', onRouterLinkClick);

}

function togglePageElements(currentPage) {

    $('*[data-display-on-page]').each(function (_) {
        let page = $(this).data('display-on-page');
        if (page === currentPage) {
            $(this).css('display', $(this).data('display') || 'block');
        } else {
            $(this).css('display', 'none');
        }
    });

}

function toggleElementsByAccessControl() {

    $('*[data-access-control]').each(function (_) {
        let accessControl = $(this).data('access-control');
        if (isUserSignedIn()) {
            if (accessControl === 'authorized') {
                $(this).css('display', $(this).data('display') || 'block');
            } else {
                $(this).css('display', 'none');
            }
        } else {
            if (accessControl === 'anonymous') {
                $(this).css('display', $(this).data('display') || 'block');
            } else {
                $(this).css('display', 'none');
            }
        }
    });

    $('*[data-user-role]').each(function (_) {
        let role = $(this).data('user-role');
        if (globals.ADMIN_MODE) {
            if (role === 'admin') {
                $(this).css('display', $(this).data('display') || 'block');
            } else {
                $(this).css('display', 'none');
            }
        } else {
            if (role === 'client') {
                $(this).css('display', $(this).data('display') || 'block');
            } else {
                $(this).css('display', 'none');
            }
        }
    });

}


function loadContactPage() {
  // Add a contact email field if the user is not signed in <label for="contact-sign-in">If you already have an account, please sign in for faster support</label>
      //<button type="button" id="contact-sign-in">Sign In</button>
  if(!isUserSignedIn()) {
    let emailForm = $('#contact-email-container');
    emailForm.html('');
    emailForm.append(`
      
      <label for="contact-email">Email:</label>
      <input type="email" id="contact-email" name="email" required>
    `);
  }

  // Create a div to hold the map
  let locationInfo = $('#location-container');
  let locationLat = 43.605590;
  let locationLong = -79.513530;
  mapboxgl.accessToken = 'pk.eyJ1Ijoibmlja21ldHoiLCJhIjoiY2wxYmgxdXozMnM0djNicHd6cXoxa3JiYyJ9.GgDsHaj9D_QuR3q5GKykMg';
    var map = new mapboxgl.Map({
      container: 'location-container',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [locationLong, locationLat],
      zoom: 10
    });

    var delivery_marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat([locationLong, locationLat])
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setHTML("<style>.mapboxgl-popup-content h2 {color: black;}</style><h2>290 New Toronto St.<br>Etobicoke, ON<br>M8V 2E8</h2>"));


      
      
    


  $('#contact-btn').on('click', function () {
    // Check the contact email field if the user is not signed in
    if (!isUserSignedIn()) {
      var userID = "null";
      var email = $('#contact-email');
      if (email.length && !email.val()) {
        alert('Please provide a valid email address.');
      }
    } else {
      var email = "null";
      var userID = getUserID();
    }
    
    var subject = $('#contact-subject').val();
    var message = $('#contact-message').val();

    console.log(`User ID: ${userID}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    if (subject.length < 1 || subject.length > 20 || !/^[a-zA-Z0-9?!\s&']+$/.test(subject)) {
      alert('Please provide a subject with less than 20 characters\nOnly alphanumeric or punctuation characters allowed (? ! & \').');
    } else if (message.length < 10  || subject.length > 250 || !/^[a-zA-Z0-9?!\s&']+$/.test(message)) {
      alert('Please provide a message with at least 10 characters\nOnly alphanumeric or punctuation characters allowed (? ! & \').');
    } else {
      $.post(`${globals.BACKEND_ROOT}/send_email.php`, {      
        userID: userID,
        email: email,
        subject: subject,
        message: message
    }, function(response, status, xhr) {
        if (xhr.status == 200) {
            // Parse the JSON response
            var ticket_id = JSON.parse(response).ticket_id;
            console.log("Received ticket ID: " + ticket_id);

            // Alert the user a ticket has been submitted and reload the page
            window.alert("Your Support Ticket id is " + ticket_id + "\nYou will be contacted via email shortly");
        } else if (xhr.status == 400) {
            alert('Error: Support Ticket not sent');
        }
    });
    
    
    }    
  });

  



  
}



function loadCatalogPage() {

    fetch(`${globals.BACKEND_ROOT}/catalog.php`)
        .then(res => res.json())
        .then(body => {
            $('#item-catalog').html('');
            for (let item of body) {
                $('#item-catalog').append(`
                <div draggable="true" data-item-id="${item.id}" class="catalog-item" ondragstart="onCatalogItemDrag(event)">
                    <h1>${item.name}</h1>
                    <img draggable="false" src="${item.imageUrl}" alt="${item.name}">
                    <p>${item.cost}</p>
                    <a href="#!reviews?item=${item.id}">Reviews</a>
                </div>
                `);
            }
        });

}

function getPageSpinnerMarkup(){

    return `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

}


function loadCartPage() {

    let cart = getCart();
     // Converts the cart items from an array to a set and back to get the unique items
    let uniqueItems = [...new Set(cart.items.map(item => item.item_id))];
    
    if(uniqueItems.length === 0){
        $('#items-in-cart').html(`You haven't added any items to your cart yet.`);
    return;
    }
    let itemAmounts = [];
    for(let item of uniqueItems){
        let quantity = cart.items.filter(entry => entry.item_id === item).reduce((sum, entry) => sum + entry.quantity, 0);
        itemAmounts.push({item: item, amount: quantity, itemInfo: null});
    }
    let total = 0;
    console.log(itemAmounts);
    populateCartPage(itemAmounts)
        .then(res => {
            console.log(res);
            itemAmounts = res;
            let cartList = $('#items-in-cart');
            cartList.html('');
            for (let entry of itemAmounts) {
                total += entry.itemInfo.cost * entry.amount;
                cartList.append(`
                <div id="item-container">
                    <img src="${entry.itemInfo.imageUrl}" alt="${entry.itemInfo.name}">
                    <p>${entry.itemInfo.name} <br>
                    Amount: ${entry.amount} <br>
                    Cost: $${entry.itemInfo.cost.toFixed(2)} each
                    </p>
                    <label for="item-${entry.item}-quantity">Quantity:</label>
                    <input type="number" id="item-${entry.item}-quantity" min="0" value="${entry.amount}">
                    <button class="update-cart" data-item="${entry.item}">Update</button>
                </div>
                `);
            }
            cartList.append(`
            <div id="total-value"></div>
            <button id="checkout-btn">Checkout</button>
            `);
                    // Checkout button functionality
            let checkoutButton = $('#checkout-btn');
            checkoutButton.on('click', () => {
                savePrice(total)
                navigate('payments'); // navigate to the checkout page when the button is clicked
            });
            let totalValue = $('#total-value');
            totalValue.html(`
                <p><strong>Total: </strong>$${total.toFixed(2)}</p>
            `);
            $('.update-cart').on('click', updateCartOnClick);
        });
}


async function updateCartUtil(itemId, newQuantity) {
  await updateCart(itemId, newQuantity);
  navigate("cart");
}


async function populateCartPage(itemAmounts) {

  for(let entry of itemAmounts){
      entry.itemInfo = await (await fetch(`${globals.BACKEND_ROOT}/catalog.php?id=${entry.item}`)).json();
  }

  return itemAmounts;

}


function loadPaymentPage() {
  if(!isUserSignedIn()){
    navigate('login');
    return;
  }

  let userID = getUserID();
  fetch(`${globals.BACKEND_ROOT}/payment_handler.php?user_id=${userID}`)
    .then(response => response.json())
    .then(data => {
      let paymentMethods = $('#payment-methods');
      paymentMethods.html('');
      if (data.length === 0) {
        navigate('addPayment');
      } else {
        for(let entry of data){
          paymentMethods.append(`
            <div class="checkbox-input">
              <p>${entry.maskedNumber}</p>
              <input type="checkbox" name="payment_method" value="${entry.payment_id}">
            </div>
            `);
          }
        }
      })
      .catch(error => console.error(error));
  
  // Allow only one checkbox to be selected at a time
  $('input[type=checkbox][name=payment]').on('change', function() {
    $('input[type=checkbox][name=payment]').not(this).prop('checked', false);
  });


  $('#choose-payment-btn').on('click', function() {
    // Check if any checkbox is selected
    if ($('input[type=checkbox][name=payment_method]:checked').length > 0) {
      // Perform action when a checkbox is selected
      let selectedPayment = $('input[type=checkbox][name=payment_method]:checked').val();
      console.log('Selected payment method:', selectedPayment);
      savePayment(selectedPayment);
      navigate("shipping");
    } else {
      // Alert user no payment method is selected
      alert("No payment method was selected");
    }
  });

  // Take user to the Add Payment Page
  $('#add-payment-btn').on('click', function() {
    navigate('addPayment');
  });
  
}



function loadAddPaymentPage() {
  if(!isUserSignedIn()){
    navigate('login');
    return;
  }


  // Add Payment button functionality
  let addPaymentButton = $('#add-payment-confirm-btn');
  addPaymentButton.on('click', () => {
    let ccNumber = $('#cc-number').val();
    let cvv = $('#cvv').val();
    let expiry = $('#cc-expiry').val();
    let billingAddress = $('#billing-address').val();
    let firstName = $('#first-name-payment').val();
    let lastName = $('#last-name-payment').val();
    let errorMessage = '';

    if(!ccNumber.match(/^[0-9]{16}$/)){
      errorMessage += 'Error: Credit card number must be a 16-digit number.\n';
    }

    if(!cvv.match(/^[0-9]{3,4}$/)){
      errorMessage += 'Error: CVV must be a 3 or 4-digit number.\n';
    }

    // I can't get this working properly
    //if(!expiry.match(/^(0[1-9]|1[0-2]) (2[2-9]|[3-4][0-9]|50)$/)){
     // errorMessage += 'Error: Expiry date must be in the format MMYY.\n';
    //}

    if(!billingAddress.match(/^[A-Za-z0-9,\s]+$/)){
      errorMessage += 'Error: Billing Address\n';
    }    

    if(!firstName.match(/^[A-Za-z]{1,20}$/)){
      errorMessage += 'First Name\n';
    }

    if(!lastName.match(/^[A-Za-z]{1,20}$/)){
      errorMessage += 'Last Name\n';
    }

    if(errorMessage){
      alert(errorMessage);
    } else {
      $.post(`${globals.BACKEND_ROOT}/payment_handler.php`, {      
        userID: getUserID(),
        ccNumber: ccNumber,
        cvv: cvv,
        expiry: expiry,
        billingAddress: billingAddress,
        firstName: firstName,
        lastName: lastName,
    }, function(response, status, xhr) {
        if (xhr.status == 200) {
            navigate('payments'); // navigate to the payment page when the button is clicked
        } else if (xhr.status == 400) {
            alert('Error: Payment not added');
        }
    });
    
    }
  });
}

function loadShippingPage() {
  if(!isUserSignedIn()){
    navigate('login');
    return;
  }

  let userID = getUserID();
  fetch(`${globals.BACKEND_ROOT}/shipping_handler.php?user_id=${userID}`)
    .then(response => response.json())
    .then(data => {
      let shippingMethods = $('#shipping-methods');
      shippingMethods.html('');
      if (data.length === 0) {
        navigate('addShipping');
      } else {
        for(let entry of data){
          shippingMethods.append(`
            <div class="checkbox-input">
              <p>${entry.fname} ${entry.lname} <br> ${entry.address}<br>${entry.phone}</p>
              <input type="checkbox" name="shipping_method" value="${entry.shipping_id}">
            </div>
          `);
        }
      }
    })
    .catch(error => console.error(error));

  
  // Allow only one checkbox to be selected at a time
  $('input[type=checkbox][name=shipping_method]').on('change', function() {
    $('input[type=checkbox][name=shipping_method]').not(this).prop('checked', false);
  });


  $('#choose-shipping-btn').on('click', function() {
    // Check if any checkbox is selected
    if ($('input[type=checkbox][name=shipping_method]:checked').length > 0) {
      // Perform action when a checkbox is selected
      let selectedShipping = $('input[type=checkbox][name=shipping_method]:checked').val();
      console.log('Selected shipping method:', selectedShipping);
      saveShipping(selectedShipping);
      navigate("orderInfo");
    } else {
      // Alert user no payment method is selected
      alert("No shipping method was selected");
    }
  });

  // Take user to the Add Payment Page
  $('#add-shipping-btn').on('click', function() {
    navigate('addShipping');
  });
}


async function loadAddShippingPage() {
  if(!isUserSignedIn()){
    navigate('login');
    return;
  }

  $('#shipping-address').on('input', async () => {
    let shippingAddress = $('#shipping-address').val();
    try {
      // Make a request to the Geocoding API service with the partial shipping address as a parameter to retrieve auto-suggested results
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${shippingAddress}&key=3af01ed1482c45e2a39283588d9a5927&limit=5`);
      const data = await response.json();
      if (data.status.code === 200) {
        // Display the auto-suggested results
        let results = data.results;
        let suggestionsList = $('#shipping-address-suggestions');
        suggestionsList.empty();
        for (let i = 0; i < results.length; i++) {
          let suggestion = results[i].formatted;
          // Create a suggestion item as a clickable <li> element
          let suggestionItem = $('<li>').text(suggestion).click(() => {
            $('#shipping-address').val(suggestion);
            suggestionsList.empty(); // Clear the suggestions list when a suggestion is clicked
          });
          suggestionsList.append(suggestionItem);
        }
      } else {
        console.error(data.status.message);
      }
    } catch (error) {
      console.error(error);
    }
  });
  

  
  // Add Payment button functionality
  let addShippingButton = $('#add-shipping-confirm-btn');
  addShippingButton.on('click', async () => {
    let fName = $('#first-name-shipping').val();
    let lName = $('#last-name-shipping').val();
    let shippingAddress = $('#shipping-address').val();
    let phone = $('#phone').val();
    let errorMessage = '';

    if(!fName.match(/^[A-Za-z]{1,20}$/)){
      errorMessage += 'First Name\n';
    }

    if(!lName.match(/^[A-Za-z]{1,20}$/)){
      errorMessage += 'Last Name\n';
    }

    if(!shippingAddress.match(/^[A-Za-z0-9,\s]+$/)){
      errorMessage += 'Error: Shipping Address\n';
    }
    

    if(!phone.match(/^[0-9]{10}$/)){
      errorMessage += 'Phone number must be a 10-digit number.\n';
    }

    if(errorMessage){
      alert(errorMessage);
    } else {
      try {
        // Make a request to the Geocoding API service with the shipping address as a parameter to check if valid
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${shippingAddress}&key=3af01ed1482c45e2a39283588d9a5927`);
        const data = await response.json();
        if (data.status.code === 200) {
          $.post(`${globals.BACKEND_ROOT}/shipping_handler.php`, { 
            userID: getUserID(),
            address: shippingAddress,
            fname: fName,
            lname: lName,
            phone: phone
          }, function(response, status, xhr) {
            if (xhr.status == 200) {
              navigate('shipping'); // navigate to the payment page when the button is clicked
            } else if (xhr.status == 400) {
              alert('Error: Shipping Method not added');
            }
          });
        } else {
          alert("Could not find address.\nPlease enter a valid address.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
}


async function loadOrderInfoPage() {
  if (!isUserSignedIn()) {
    navigate('login');
    return;
  }
  // Email notifications not implemented
  saveEmails(0);

  // Send the order
  if (await sendOrder(getUserID())) {
    console.log('Order sent:');
  }

  // Clear the Cart
  clearCart();
  
  // Github issue #36
  // Testing for calling from orders page (not yet implemented)
  //let orderJSON = await getOrderInfo(18);

  // Get the most recent order information
  let orderJSON = await getMostRecentOrder(getUserID());
  console.log(orderJSON);
  // Append information to the page
  let orderInfo = $('#order-info-container');
  orderInfo.html('');
  orderInfo.append(`
    <h2>Order Information</h2>
    <p id="order-info-transaction-number">Transaction Number: ${orderJSON.order_info.transaction_id}</p>
    <p id="order-info-date">Order Date: ${orderJSON.order_info.date}</p>
    <p id="order-info-cc-number">Credit Card Number: ${orderJSON.order_info.ccNumber}</p><br>

    <h2>Shipping Information</h2>
    <p id="order-info-full-name">Name: ${orderJSON.order_info.fname} ${orderJSON.order_info.lname}</p>
    <p id="order-info-shipping-address">Shipping Address: ${orderJSON.order_info.address}</p>
    <p id="order-info-estimated-shipping-date">Estimated Delivery Date: ${orderJSON.order_info.eta}</p>
    <p id="order-info-trackinge">Tracking Number: ${orderJSON.order_info.tracking}</p>
    `);


  // Make a request to the OpenCage Geocoding API service with the shipping address as a parameter
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${orderJSON.order_info.address}&key=3af01ed1482c45e2a39283588d9a5927`);
  const data = await response.json();

  if (data.status.code === 200) {
    // Extract latitude, longitude, and Street Address from the response
    const lat = data.results[0].bounds.northeast.lat;
    const lng = data.results[0].bounds.northeast.lng;
    const addressTxt = orderJSON.order_info.address.substring(0, orderJSON.order_info.address.indexOf(','));


    mapboxgl.accessToken = 'pk.eyJ1Ijoibmlja21ldHoiLCJhIjoiY2wxYmgxdXozMnM0djNicHd6cXoxa3JiYyJ9.GgDsHaj9D_QuR3q5GKykMg';
			var map = new mapboxgl.Map({
				container: 'map-container',
				style: 'mapbox://styles/mapbox/dark-v10',
				center: [lng, lat],
				zoom: 11
			});

			var delivery_marker = new mapboxgl.Marker({ color: "red" })
				.setLngLat([lng, lat])
				.addTo(map)
				.setPopup(new mapboxgl.Popup().setHTML("<style>.mapboxgl-popup-content h2 {color: black;}</style><h2>" + addressTxt + "</h2>"));
        
  } else {
    // Call a div to hold the Error
    let mapInfo = $('#map-container');
    mapInfo.append(`
      <p>Error finding address via Geocoding</p>`
    );
  }

  // Grab all the items ID's from the order
  let itemsID = orderJSON.order_items.map(item => item.item_id);
  let items_data;
  console.log("ITEMS ID: ", itemsID);
  // Make a request to the backend to get information about the purchased items
  if (itemsID.length === 1) {
    // Only one item ID in the order
    const items_response = await fetch(`${globals.BACKEND_ROOT}/order_handler.php?itemID=${itemsID}`);
    items_data = await items_response.json();
  } else {
    // More than one item ID in the order
    const items_response = await fetch(`${globals.BACKEND_ROOT}/order_handler.php?itemsID=${itemsID}`);
    items_data = await items_response.json();
  }

  // Call a div to hold the list of items and info
  let itemList = $('#items-purchased');
  itemList.html('');
  itemList.append(`<h2>Purchased Items</h2>`);
  for (let i = 0; i < orderJSON.order_items.length; i++) {
    const item = orderJSON.order_items[i];
    // Equate the item_ID from the order information to the data returned from the order items table
    // This is needed for Quantity accuracy
    const item_data = items_data.find(data => data.item_id === item.item_id);

    // REMOVE DIVISION WHEN FLOATS ARE USED IN THE DATABASE
    const cost = (item_data.price / 100).toFixed(2);
    const total_cost = (parseFloat(item.quantity) * (item_data.price / 100)).toFixed(2);
    itemList.append(`
      <div id="item-container">
        <img src="${item_data.img_link}" alt="${item_data.name}">
        <p>${item_data.name} <br>
          Amount: ${item.quantity} <br>
          Cost: $${cost} each<br>
          Total Cost: $${total_cost}
        </p>
      </div>
    `);
  }
}

function loadEditItemPage(id) {

    fetch(`${globals.BACKEND_ROOT}/catalog.php?id=${id}`)
        .then(res => res.json())
        .then(item => {
            $('#edit-item').css('display', 'flex');
            $('#load-item').css('display', 'none');

            $('#name').val(item.name);
            $('#cost').val(item.cost);
            $('#description').val(item.description);
            $('#category').val(item.category);
            $('#imageUrl').val(item.imageUrl);
        })

}


      



function loadAdminHome() {

    fetch(`${globals.BACKEND_ROOT}/nonce.php`)
        .then(res => res.text())
        .then(res => {
            $('#admin-login-form').append(`<input type="hidden" name="nonce" value="${res}">`);
        });

}

function loadAdminControls(queryParams) {

    // Creates a clone of the queryParams
    console.log(JSON.stringify(queryParams));
    const params = JSON.parse(JSON.stringify(queryParams));

    console.log(params);

    for(let property in params){
        if(property.startsWith("search")){
            let newName = property.substring(6);
            newName = newName.charAt(0).toLowerCase() + newName.slice(1);
            params[newName] = params[property];
            delete params[property];
        }
    }

    fetch(`${globals.BACKEND_ROOT}/catalog.php?${new URLSearchParams(params)}`)
        .then(res => res.json())
        .then(res => {
            for (let item of res) {
                $('#catalog-table-header').after(`
                    <tr data-item="${item.id}">
                        <td>${item.name}</td>
                        <td>${item.cost}</td>
                        <td>${item.category}</td>
                        <td>${item.description}</td>
                        <td>${item.imageUrl}</td>
                        <td>
                        <button onclick="catalogItemDelete(${item.id})">
                            Delete
                        </button>
                        <button onclick="catalogItemEdit(${item.id})">
                            Edit
                        </button>
                        </td>
                    </tr>
                    `);
            }
            $('#search-name').val(params['name'] || '');
            $('#search-price').val(params['price'] || '');
            $('#search-category').val(params['category'] || '');
            $('#search-description').val(params['description'] || '');
            $('#search-image-url').val(params['imageUrl'] || '');
        });

}

function onSignOutPageOpen() {

    signOut();

}

export { loadCatalogPage, loadCartPage, onSignOutPageOpen, navigate, assignRouterListeners, setAdminMode, toggleElementsByAccessControl, togglePageElements, loadAdminHome, loadAdminControls, loadEditItemPage, getPageSpinnerMarkup };