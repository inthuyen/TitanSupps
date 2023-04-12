import { getCart } from './cart.js';
import { globals } from './globals.js';
import { assignRouterListeners, toggleElementsByAccessControl, togglePageElements } from './page-utils.js';
import * as events from './events.js';

$(document).ready(function() {

    // if(window.location.pathname === '/admin'){
    //     setAdminMode(true);
    //     navigate('adminHome');
    // }else{
    //     setAdminMode(false);
    //     navigate('home');
    // }

    let cart = getCart();

  $('#item-amount').text(`${cart.items.reduce((acc, item) => acc + Number(item.quantity), 0) || ''}`);

    assignRouterListeners();
    toggleElementsByAccessControl();
    togglePageElements('home');

    let userAgent = navigator.userAgent;

    let browser = "Unknown Browser";
    console.log(userAgent);
    if(userAgent.match("Firefox/\\d+.\\d+")){
        browser = "Mozilla Firefox";
    }else if(userAgent.match("Edg/\\d+.\\d+")){
        browser = "Microsoft Edge";
    }else if(userAgent.match("Chrome/\\d.\\d+")){
        browser = "Google Chrome";
    }

    $('#browser-info').text(browser);

});

function menuClick() {

  let displayStatus = $('#app-nav ul').css("display");
  $('#app-nav ul').css("display", displayStatus === "none" ? "flex": "none");
  let menuText = $("#mobile-menu").text().trim();
  $("#mobile-menu").text(menuText === "menu" ? "close" : "menu");

}

window.menuClick = menuClick;

const app = angular.module("titan", ["ngRoute"]);

app.config(function ($routeProvider, $sceDelegateProvider) {
    
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        `${globals.BACKEND_ROOT}/**`
    ]);

    $routeProvider
        .when("/home", {
            templateUrl: "/views/home.htm",
            controller: "home"
        })
        .when("/", {
            templateUrl: "/views/home.htm",
            controller: "home"
        })
        .when("/catalog", {
            templateUrl: "/views/catalog.htm",
            controller: "catalog"
        })
        .when("/about", {
            templateUrl: "/views/about.htm",
            controller: "about"
        })
        .when("/services", {
            templateUrl: "/views/services.htm",
            controller: "services"
        })
        .when("/signUp", {
            templateUrl: "/views/signUp.htm"
        })
        .when("/login", {
            templateUrl: "/views/login.htm",
            controller: "login"
        })
        .when("/signOut", {
            templateUrl: "/views/signOut.htm",
            controller: "signOut"
        })
        .when("/contact", {
            templateUrl: "/views/contact.htm",
            controller: "contact"
        }).when("/cart", {
            templateUrl: "/views/cart.htm",
            controller: "cart"
        }).when("/adminHome", {
            templateUrl: "/views/adminHome.htm",
            controller: "adminHome"
        }).when("/adminControls", {
            templateUrl: "/views/adminControls.htm",
            controller: "adminControls"
        }).when("/editCatalogItem", {
            templateUrl: "/views/editCatalogItem.htm",
            controller: "editCatalogItem"
        }).when("/reviews", {
            templateUrl: "/views/reviews.htm",
            controller: "reviewsController"
        }).when("/orders", {
            templateUrl: "/views/orders.htm",
            controller: "orders"
        });
});

for(let element in events){

    if(events[element] instanceof Function){
        window[element] = events[element];
    }

}

export { app };