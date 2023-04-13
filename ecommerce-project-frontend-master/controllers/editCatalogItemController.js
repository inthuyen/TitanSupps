import { globals } from "../globals.js";
import { app } from "../main.js";
import { loadEditItemPage } from "../page-utils.js";
import { createController } from "./controller.js";
import { itemSubmit } from "../events.js";

app.controller('editCatalogItem', createController(function ($scope, $routeParams){

    if($routeParams.id){
        loadEditItemPage($routeParams.id);
        $scope.action = `${globals.BACKEND_ROOT}/catalog.php?id=${$routeParams.id}`;
        $scope.id = $routeParams.id;
        $scope.submit = function (e) {
            itemSubmit(e, $routeParams.id);
        }
    }else{
        console.warn("Missing item id");
    }

}, 'editCatalogItem'));