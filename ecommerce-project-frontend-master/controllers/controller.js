import { isUserSignedIn } from "../auth.js";
import { assignRouterListeners, navigate, toggleElementsByAccessControl, togglePageElements } from "../page-utils.js";

function createController(init, route, requiresAuth=false) {

    return function($scope, $routeParams) {

        init($scope, $routeParams);
        assignRouterListeners();
        toggleElementsByAccessControl();
        if(requiresAuth && !isUserSignedIn()){
            navigate('login');
        }
        togglePageElements(route);

    }

}

export { createController };