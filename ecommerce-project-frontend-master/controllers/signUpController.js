import { app } from "../main.js";
import { createController } from "./controller.js";

app.controller('signUp', createController(function ($scope) {

}, "signUp"));