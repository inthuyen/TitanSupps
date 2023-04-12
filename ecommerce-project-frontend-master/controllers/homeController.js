import { app } from "../main.js";
import { setAdminMode } from "../page-utils.js";
import { createController } from "./controller.js";


app.controller('home', createController(function ($scope) {

    setAdminMode(false);

}, "home"));