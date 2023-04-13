import { globals } from "./globals";

function home(args={}) {
    return `
    <header id="page-header">
        <img src="/assets/Logo-Text.png" alt="Logo Text" style="width: 25%;">
        <h1>Titan Supps</h1>
        <h3>Your one stop shop for all your supplement needs</h3>
    </header>
    <p>
    Welcome to TitanSupps, your one-stop shop for all your bodybuilding supplement needs! We are passionate about helping you achieve your fitness goals, whether you're a seasoned athlete or just starting out on your fitness journey. At TitanSupps, we offer a wide range of high-quality supplements, including whey protein, pre-workout, creatine, and much more. Our products are specially formulated to provide your body with the nutrients it needs to build muscle, increase strength, and improve overall performance. We are committed to providing you with top-notch customer service and support, and we pride ourselves on delivering fast and reliable shipping. 
    </p>
    `;   
}

function about(args={}) {
    return `
    <header id="page-header">
        <h1>Our Team</h1>
    </header>

    <div>
        <h3>Nick H. Metzler</h3>
        <img src="https://avatars.githubusercontent.com/u/44005221?v=4">
        <p>The Gym Bro</p>
    </div>

    <div>
        <h3>John Ernest Amiscaray</h3>
        <img src="https://avatars.githubusercontent.com/u/63324129?v=4">
        <p>The Code Monkey</p>
    </div>

    <div>
        <h3>Inthuyen Naguleswaran</h3>
        <img src="https://avatars.githubusercontent.com/u/79668965?v=4">
        <p>The Mastermind</p>
    </div>
    
    <div>
        <h3>Cheukfei Louie</h3>
        <img src="https://avatars.githubusercontent.com/u/82793187?v=4">
        <p>The Ghost</p>
    </div>
    `;
}

function contact(args={}) {
    return `
    <form id="contact-form">
        <div id="contact-email-container">
        </div>
        
        <label for="contact-subject">Subject:</label>
        <input type="text" id="contact-subject" name="subject" required>
        
        <label for="contact-message">Message:</label>
        <textarea id="contact-message" name="message" rows="4" cols="50" required></textarea>
    </form>
    <button id="contact-btn">Submit Ticket</button>
    <hr> <!-- horizontal line break -->
    <div id="store-name-logo-container">
        <img src="assets/Logo.png" alt="logo" class="logo">
        <h2>Titan Supps</h2>
    </div>
    <div id="store-info-container">
        <!-- clickable address field -->
        <a href="https://www.google.ca/maps/place/290+New+Toronto+St,+Etobicoke,+ON+M8V+2E8/@43.6048018,-79.5139773,18z/data=!4m6!3m5!1s0x882b49d295300acd:0xdfa2c5c4d381a006!8m2!3d43.6055797!4d-79.51384!16s%2Fg%2F11c1hl7r13" target="_blank">
            290 New Toronto St<br>
            Etobicoke, ON<br>
            M8V 2E8
        </a>
        <br>
        <!-- clickable email element -->
        <a href="mailto:support@titansupps.ca">support@titansupps.ca</a> 
        <br>
        <!-- clickable phone element -->
        <a href="tel:4164206969">416-420-6969</a>
        <div id="business-hours-container">
            <h3> Store Hours </h3>
            <p>Monday: 9am - 5pm</p>
            <p>Tuesday: 9am - 5pm</p>
            <p>Wednesday: 9am - 5pm</p>
            <p>Thursday: 9am - 5pm</p>
            <p>Friday: 9am - 5pm</p>
            <p>Saturday: 10am - 4pm</p>
            <p>Sunday: Closed</p>
            <p>Holiday Hours may vary</p>
        </div>
    </div>
    
    <div id="location-container">
    </div>
    `;
}

function services(args={}) {
    return `
    <div>
        <p>As a part of the services offered by Titan Supps, we will supply you with a suitable workout
        based on your gender and experience level.</p>
    </div>
    `;
    
}

function catalog(args={}) {

    return `
    <div id="item-catalog">
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
    `;

}

function cart(args={}) {

    return `
      <div id="items-in-cart">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div id="total-value"></div>
      <button id="checkout-btn">Checkout</button>
    `;
  }
  
  function payments() {
      return `
      <h2>Payment Methods</h2>
    <div id="payment-methods">
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <button id="choose-payment-btn">Use Selected Payment Method</button>
    <button id="add-payment-btn">Add New Payment Method</button>
  `
}


  function shipping() {
      return `
    <h2>Shipping Methods</h2>
    <div id="shipping-methods">
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
    <button id="choose-shipping-btn">Use Selected Shipping Address</button>
    <button id="add-shipping-btn">Add New Shipping Address</button>
  `}


  function addPayment() {
    return `
        <h2>Billing Information</h2>
        <div class="order-form">
            <div class="input-group">
                <p>First Name:</p>
                <input type="text" id="first-name-payment" name="first-name" pattern="[A-Za-z]{1,20}" required>

                <p>Last Name:</p>
                <input type="text" id="last-name-payment" name="last-name" pattern="[A-Za-z]{1,20}" required><br>
            </div>
            <div class="single-input">
                <p>Credit Card Number:</p>
                <input type="text" id="cc-number" name="cc-number" pattern="[0-9]{16}" placeholder="XXXXYYYYXXXXYYYY" required>
            </div>

            <div class="input-group">
                <p>CVV:</p>
                <input type="text" id="cvv" name="cvv" pattern="[0-9]{3,4}" required><br>

                <p>Date of Expiry:</p>
                <input type="text" id="cc-expiry" name="cc-expiry" pattern="(0[1-9]|1[0-2])[23-50]" placeholder="MMYY" required><br>
            </div>

            <p>Billing Address:</p>
            <textarea id="billing-address" name="billing-address" pattern="[A-Za-z0-9\s]+" required></textarea><br><br>
        <button id="add-payment-confirm-btn">Add Payment Method</button>          
    `;
  }

  function addShipping() {
    return `
    <h2>Shipping Information</h2>
    <div class="order-form">
        <div class="input-group">
            <p>First Name:</p>
            <input type="text" id="first-name-shipping" name="first-name-shipping" pattern="[A-Za-z]{1,20}" required>

            <p>Last Name:</p>
            <input type="text" id="last-name-shipping" name="last-name-shipping" pattern="[A-Za-z]{1,20}" required><br>
        </div>

        <p>Shipping Address:</p>
        <div class="address-group">
            <textarea id="shipping-address" name="shipping-address" pattern="[A-Za-z0-9\s]+" required></textarea>
            <ul id="shipping-address-suggestions"></ul><br><br>
        </div>

        <div class="single-input">
            <p>Phone Number:</p>
            <input type="text" id="phone" name="phone" pattern="[0-9]{10}" placeholder="416XXXXXXX" required><br><br>
        </div>
  </div>
  <button id="add-shipping-confirm-btn">Add Shipping</button>          
    `;
  }

function orderInfo() {
    return `
    <header id="page-header">
        <h1>Order Information</h1>
        <img src="assets/Logo-Text.png" alt="Logo-Text" style="width: 20%;" />
    </header>
    <div id="order-info">
        <div id="order-info-container">
        </div>
        <div id="order-info-openstreetmap-container">
            <div id="map-container"></div>
        </div>
    </div>
    <div id="items-purchased">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    `;
}

function signUp(args={}) {

    return `
    <div id="sign-up">
        <h1>Sign Up</h1>
        <form class="form" onsubmit="onSignUpSubmit(event)">
            <label for="email">E-Mail</label>
            <input required id="email" name="email">
            <label for="password">Password</label>
            <input required id="password" name="password" type="password">
            <label for="confirm-password">Confirm Password</label>
            <input required id="confirm-password" name="confirm-password" type="password">
            <input type="submit" value="Sign Up">
        </form>
    </div>
    `;

}

function login(args={}) {

    return `
    <div id="login">
        <h1>Login</h1>
        <form class="form" onsubmit="onLoginSubmit(event)">
            <label for="username">Username</label>
            <input id="username" name="username">
            <label for="password">Password</label>
            <input id="password" name="password" type="password">
            <p id="signup-prompt">Don't have an account? Create one <a class="router-link hoverable" href="#!signUp">here</a></p>
            <input type="submit" value="Login">
        </form>
    </div>
    `;
}

function signOut(args={}) {

    return `
    <div>
        <h1>Bye!</h1>
        <p>You are now signed out. <a class="router-link hoverable" href="#!home">Return to home</a></p>
    <div>
    `;

}

function adminHome(args={}){

    return `
    <header>
        <h1>Titan Admin</h1>
    </header>
    <form id="admin-login-form" class="form" onsubmit="adminLoginSubmit(event)">
        <input type="email" name="email" id="email">
        <input type="password" name="password" id="password">
        <input type="hidden" name="admin" value="true">
        <button>Login</button>
    </form>
    `;
    
}

function adminControls(args={}){

    return `
    <header>
        <h1>Titan Admin Controls</h1>
    </header>
    <h2>Catalog</h2>
    <table class="admin-table">
        <tr id="catalog-table-header">
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Image URL</th>
            <th>Actions</th>
        </tr>
        <tr class="table-row-label">
            <td colspan="5">Search Items</td>
        </tr>
        <tr>
            <td>
                <input id="search-name" type="text">
            </td>
            <td>
                <input id="search-price" type="number" step="0.01">
            </td>
            <td>
                <input id="search-category" type="text">
            </td>
            <td>
                <input id="search-description" type="text">
            </td>
            <td>
                <input id="search-image-url" type="text">
            </td>
        </tr>
        <tr>
            <td onclick="onCatalogItemSearch()" class="table-btn" colspan="5">Search Items</td>
        </tr>
        <tr class="table-row-label">
            <td colspan="5">Add Item</td>
        </tr>
        <tr>
            <td>
                <input id="name" type="text">
            </td>
            <td>
                <input id="price" type="number" step="0.01">
            </td>
            <td>
                <input id="category" type="text">
            </td>
            <td>
                <input id="description" type="text">
            </td>
            <td>
                <input id="image-url" type="text">
            </td>
        </tr>
        <tr>
            <td onclick="onCatalogItemSubmit()" class="table-btn" colspan="5">Add Item</td>
        </tr>
    </table>
    `;

}

function editCatalogItem(args={}) {

    if(!args.id){
        console.error('Missing item ID');
        return `
        <p>
            Error editing item. Please try again and/or report this issue to the development team.
        </p>
        `;
    }

    return `
    <div id="load-item" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>

    <form onsubmit="itemSubmit(event, ${args.id})" id="edit-item" class="form" action="${globals.BACKEND_ROOT}/catalog.php?id=${args.id}" method="patch">
        <label for="name">Name</label>
        <input id="name" type="text" name="name">
        <label for="cost">Cost</label>
        <input id="cost" type="number" name="cost" step="0.01">
        <label for="description">Description</label>
        <input id="description" type="text" name="description">
        <label for="category">Category</label>
        <input id="category" type="text" name="category">
        <label for="imageUrl">Image URL</label>
        <input id="imageUrl" type="text" name="imageUrl">
        <button type="submit">Submit</button>
        <a href="#!adminControls" class="router-link hoverable">Return to admin controls</a>
    </form>
    `;

}

export { home, about, contact, services, catalog, cart, signUp, login, signOut, adminHome, adminControls, editCatalogItem, addPayment, addShipping, orderInfo, payments, shipping };
