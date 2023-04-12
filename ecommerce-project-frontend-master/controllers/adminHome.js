import { app } from "../main.js";
import { createController } from "./controller.js";
import { loadAdminHome, setAdminMode } from '../page-utils.js'

app.controller('adminHome', createController(function($scope){

    loadAdminHome();

}, "adminHome"));