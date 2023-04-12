import { app } from "../main.js";

import { createController } from "./controller";

app.controller('about', createController(function ($scope) {



}, 'about'));