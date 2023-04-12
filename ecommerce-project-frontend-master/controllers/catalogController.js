import { app } from "../main.js";
import { loadCatalogPage } from "../page-utils.js";
import { createController } from "./controller.js";

app.controller('catalog', createController(function($scope) {

    loadCatalogPage();

}, "catalog", true));