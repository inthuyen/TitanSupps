import { app } from "../main.js";
import { onSignOutPageOpen } from "../page-utils";
import { createController } from "./controller.js";

app.controller('signOut', createController(function ($scope) {

    onSignOutPageOpen();

}, "signOut"));