import { globals } from "../globals.js";
import { app } from "../main.js";
import { loadAdminControls } from "../page-utils.js";

import { createController } from "./controller.js";

app.controller("adminControls", createController(function ($scope, $queryParams) {

    if(!globals.ADMIN_MODE){
        window.location.href = "/#!adminHome";
    }
    loadAdminControls($queryParams);
    
}, "adminControls", true));