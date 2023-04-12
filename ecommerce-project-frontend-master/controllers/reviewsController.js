import { getCurrentUser } from "../auth.js";
import { globals } from "../globals.js";
import { app } from "../main.js";
import { createController } from "./controller.js";

app.controller('reviewsController', createController(async function ($scope, $routeParams){

    if($routeParams.item){
        $scope.user = getCurrentUser();
        $scope.item = $routeParams.item;
        let item = await ((await fetch(`${globals.BACKEND_ROOT}/catalog.php?id=${$routeParams.item}`))).json();
        $('#item-name').text(item.name);
        $('#review-item-image').css('background-image', `url(${item.imageUrl})`);
        $('#review-item-image').html('');
        let reviews = await (await fetch(`${globals.BACKEND_ROOT}/review.php?id=${$routeParams.item}`)).json();
        for(let review of reviews){
            $('#reviews-list').append(`
            <article class="review">
                <header>
                    <h1>${review.title}</h1>
                </header>
                <div class="review-stars" data-review-stars="${review.ranking}">
                </div>
                <p>
                    ${review.content}
                </p>
            </article>
            `);
        }
        $('[data-review-stars]').each(function () {
            let stars = $(this).data('review-stars');
            for(let i = 0; i < parseInt(stars); i++){
                $(this).append(`
                <span class="material-symbols-outlined">
                    star
                </span>
                `);
            }
        });
    }else{
        window.location.href = "/#!catalog";
    }

}, 'reviewsController', true));