import { app } from "../main.js";

import { createController } from "./controller";

app.controller('services', createController(function ($scope) {



}, 'services'));