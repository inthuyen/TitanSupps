<?php

include 'transaction.inc.php';
include 'item_order.inc.php';
include 'item.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// Retrieve form data


// Add an Order
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    $user_id = $body['userID'];
    $payment_id = $body['paymentID'];
    $shipping_id = $body['shippingID'];
    $price = $body['price'];
    $emails = $body['emails'];
    $itemArray = $body['itemArray']; // assuming this is an array of (item_id, quantity)
    
    // create a new Transaction object and insert it into the database
    $transaction = new Transaction($user_id, $payment_id, $shipping_id, $price, $emails);
    $transaction_id = Transaction::createOrder($transaction);
    
    if ($transaction_id) {
        // create an array of ItemOrder objects and insert them into the database
        $order_items = array();
        foreach ($itemArray as $item) {
            $item_order = new ItemOrder($item['item_id'], $item['quantity'], $transaction_id);
            $order_items[] = $item_order;
        }
        ItemOrder::addOrderItems($order_items);
        
        http_response_code(200); // success
        echo $transaction_id; // return the new transaction ID as the response
    } else {
        http_response_code(500); // server error
    }

// Get Order information
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    // Get most recent order (used after checkout)
    if (isset($_GET['userID'])) {
        $user_id = $_GET['userID'];
        $order_info = Transaction::getMostRecentOrderInfo($user_id);
        $transaction_id = $order_info['transaction_id'];
        $order_items = ItemOrder::getOrderItems($transaction_id);
        
        $items = array();
        foreach ($order_items as $item) {
            $item_info = array(
                'item_id' => $item->item_id,
                'quantity' => $item->quantity
            );
            $items[] = $item_info;
        }
        
        $response = array(
            'order_info' => $order_info,
            'order_items' => $items
        );
        
        echo json_encode($response);
    }

    // Get order by transaction_id (used when order summary is called from all orders summary page)
    else if (isset($_GET['transactionID'])) {
        $transaction_id = $_GET['transactionID'];
        $order_info = Transaction::getOrderInfoByTransactionID($transaction_id);
        $order_items = ItemOrder::getOrderItems($transaction_id);
        
        $items = array();
        foreach ($order_items as $item) {
            $item_info = array(
                'item_id' => $item->item_id,
                'quantity' => $item->quantity
            );
            $items[] = $item_info;
        }
        
        $response = array(
            'order_info' => $order_info,
            'order_items' => $items
        );
        
        echo json_encode($response);
    } 

    // Get item information if one item is passed
    else if (isset($_GET['itemID'])) {
        $item_id = $_GET['itemID'];
        $items_info = Item::getItemsInfo([$item_id]);
        
        echo json_encode($items_info);

    // Get item information if an array of items is passed
    } else if (isset($_GET['itemsID'])) {
        $items_id = $_GET['itemsID'];
        $items_info = Item::getItemsInfo(explode(",", $items_id));
        
        echo json_encode($items_info);
    }
    else {
        http_response_code(400); // bad request
    }
}