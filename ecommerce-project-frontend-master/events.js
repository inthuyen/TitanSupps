import { getCart, addToCart, updateCart } from "./cart.js";
import { globals } from "./globals.js";
import { signUp, login } from "./auth.js";
import { navigate, loadCatalogPage, setAdminMode, loadCartPage } from "./page-utils.js";
import { extractFormToBody } from "./util.js";

function onCartDragOver(e) {
    e.preventDefault();
}

function updateCartImageText() {

    let cart = getCart();
    let totalQuantity = cart.items.reduce((acc, item) => acc + Number(item.quantity), 0);

    if(totalQuantity > 0){
        $('#item-amount').text(`${totalQuantity}`);
    }else{
        $('#item-amount').text('');
    }

}

function onCartDrop(e) {
    e.preventDefault();
  
    let item_id = e.dataTransfer.getData('item_id');
    let quantity = e.dataTransfer.getData('quantity');
  
    addToCart(parseInt(item_id), quantity);
  
    updateCartImageText();
}
  

function onCatalogItemDrag(e) {
    e.dataTransfer.setData('item_id', $(e.target).data('item-id'));
    e.dataTransfer.setData('quantity', 1);
}  

function updateCartOnClick(e) {
    e.preventDefault(); // prevent the default action of the button
  
    let itemId = parseInt($(e.target).data('item'));
    let newQuantity = $(`#item-${itemId}-quantity`).val();
    updateCart(itemId, newQuantity)
        .then(() => {
            let cart = getCart();
            // Check if the item is already in the cart
            let existingItemIndex = cart.items.findIndex(item => item.item_id === itemId);
            // Item is already in the cart, update its quantity
            cart.items[existingItemIndex].quantity = Number(newQuantity);
            updateCartImageText();
            loadCartPage();
      })
      .catch((error) => {
        console.error(error);
      });
}
  
  
  
function onSignUpSubmit(e) {

    e.preventDefault();
    let password = $('#password').val();
    let confirmPassword = $('#confirm-password').val();
    let email = $('#email').val();

    if(password !== confirmPassword){
        alert('Passwords do not match');
        return;
    }

    signUp({ email, password })
        .then(_ => {
            alert('Signup Successful');
        })
        .catch(error => {
            alert('Unable to complete sign up. Please try again later');
            console.log(error);
        });

}

function onLoginSubmit(e) {

    e.preventDefault();
    
    let username = $('#username').val();
    let password = $('#password').val();

    if(username.trim().length === 0 || password.trim().length === 0){
        alert('Please enter all fields');
        return;
    }

    login({username: username, password: password})
        .then(res => {
            if(res.status === 401){
                alert('Invalid Credentials');
                return;
            }
            navigate('home');
            loadCatalogPage();
        })
        .catch(error => {
            alert('Unable to complete login. Please try again later');
            console.log(error);
        });

}

function adminLoginSubmit(e) {

    e.preventDefault();

    let email = $('#email').val();
    let password = $('#password').val();

    login({username: email, password: password, isAdmin: true})
        .then(res => {
            if(res.ok){
                setAdminMode(true);
                navigate('adminControls', {}, true);
            }else if(res.status === 401){
                alert('Unauthorized access');
            }
        });

}

function onCatalogItemSubmit(){

    let name = $('#name').val();
    let price = $('#price').val();
    let category = $('#category').val();
    let description = $('#description').val();
    let imageUrl = $('#image-url').val();

    if(!name.trim() || !price || !category.trim() || !description.trim() || !imageUrl.trim()){
        alert("Please fill all values");
        return;
    }

    fetch(`${globals.BACKEND_ROOT}/catalog.php`, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            cost: price,
            category: category,
            description: description,
            imageUrl: imageUrl
        })
    }).then(res => {
        if(res.ok){
            navigate('adminControls', {}, true);
        }else{
            alert('Unable to update the catalog at this time');
        }
    })

}

function catalogItemDelete(id){

    fetch(`${globals.BACKEND_ROOT}/catalog.php?id=${id}`, {
        method: 'DELETE'
    }).then(res => {
        if(res.ok){
            $(`tr[data-item=${id}]`).remove();
        }else{
            alert('Unable to delete the item at this time');
        }
    });

}

function catalogItemEdit(id){

    navigate('editCatalogItem', { id }, true);

}

function onCatalogItemSearch(){

    let params = {
        searchName: $('#search-name').val(),
        searchPrice: $('#search-price').val(),
        searchCategory: $('#search-category').val(),
        searchDescription: $('#search-description').val(),
        searchImageUrl: $('#search-image-url').val()
    };
    let href = window.location.href;
    if(href.includes("?")){
        href = href.substring(0, href.lastIndexOf('?'));
    }
    href += "?";
    console.log(href);
    for(let param in params){
        if(!params[param]){
            continue;
        }
        href += `${param}=${params[param]}&`;
    }

    href = href.substring(0, href.length - 1);
    window.location.href = href;

}

function itemSubmit(e, id){

    e.preventDefault();
    fetch(`${globals.BACKEND_ROOT}/catalog.php?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            name: $('#name').val(),
            price: parseFloat($('#cost').val()),
            description: $('#description').val(),
            category: $('#category').val(),
            img_link: $('#imageUrl').val()
        })
    }).then(res => {
        if(res.ok){
            alert('Successfully updated the item');
        }else{
            console.error(res);
        }
    });

}

function onReviewSubmit(e) {

    e.preventDefault();

    let body = extractFormToBody($(e.target));
    body['ranking'] = parseInt(body['ranking']);
    body['user'] = parseInt(body['user']);
    body['item'] = parseInt(body['item']);
    fetch(`${globals.BACKEND_ROOT}/review.php`, {
        method: 'POST',
        body: JSON.stringify(body)
    }).then(res => {
        if(res.ok){
            alert('Review submitted. Thank you!');
        }else{
            alert('Error submitting your review. Try again or contact administration.');
        }
    });

}

function workoutFormSubmit(e) {

    let body = extractFormToBody($(e.target));

    fetch(`${globals.BACKEND_ROOT}/services.php`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        .then(res => res.text())
        .then(res => {
            $('#result').html(res);
        });

}

export { onCartDragOver, onCartDrop, onCatalogItemDrag, onSignUpSubmit, onLoginSubmit, adminLoginSubmit, onCatalogItemSubmit, onCatalogItemSearch, catalogItemDelete, catalogItemEdit, itemSubmit, onReviewSubmit, workoutFormSubmit, updateCartOnClick, updateCartImageText };