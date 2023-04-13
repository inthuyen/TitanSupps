import { app } from "../main.js";
import { createController } from "./controller.js";
import { globals } from "../globals.js";
import { getUserID } from "../auth.js";

app.controller('orders', createController(async function ($scope, $routeParams){

    if(!$routeParams.id){
        $scope.title = "Your Orders";

        let orders = await (await fetch(`${globals.BACKEND_ROOT}/user_orders.php?user=${getUserID()}`)).json();

        $('#orders').html('');

        for(let order of orders){
            $('#orders').append(`
                <article class="order">
                    <header>
                        <h1><a class="order-link" href="${window.location.href}?id=${order.order_num}">Order No. ${order.order_num}</a></h1>
                    </header>
                    <p>Date: ${order.date}</p>
                    <p>ETA: ${order.eta}</p>
                    <p>Total: ${order.price}</p>
                    <p>Tracking Number: ${order.tracking}</p>
                    <p>Total Items ${order.total_items}</p>
                </article>
            `);
        }

    }else{
        $scope.title = "Your Order";

        let order = await (await fetch(`${globals.BACKEND_ROOT}/order_handler.php?transactionID=68`)).json();
        let items = order.order_items;

        $('#orders').html(`
            <article class="order">
                <header>
                    <h1>Order No. ${$routeParams.id}</h1>
                </header>
                <p>Date: ${order.order_info.date}</p>
                <p>ETA: ${order.order_info.eta}</p>
                <p>Tracking Number: ${order.order_info.tracking}</p>
                <section id="order_items">
                    <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </section>
            </article>
        `);

        let itemsQuery = "";

        for(let item of items){

            itemsQuery += `${item.item_id},`;

        }

        itemsQuery.slice(0, itemsQuery.length - 1);

        let items_info = await (await (fetch(`${globals.BACKEND_ROOT}/order_handler.php?itemsID=${itemsQuery}`))).json();
        $('#order_items').html(`
        <header>
            <h1>Items:</h1>
        </header>
        `);

        for(let item_info of items_info){

            $('#order_items').append(`
            <article>
                <header>
                    <h1>${item_info.name}</h1>
                </header>
                <img alt="${item_info.name}" src="${item_info.img_link}">
            </article>
            `);

        }

    }

}, 'orders', true));