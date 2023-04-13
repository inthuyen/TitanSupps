import { app } from "../main.js";
import { loadCartPage } from "../page-utils.js";
import { createController } from "./controller.js";

app.controller('cart', createController(function ($scope) {

    loadCartPage();

}, 'cart', true));