<?php

include 'item.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Access-Control-Allow-Methods: *');

$body = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    $catalog = empty($_GET) ? Item::getCatalog() : Item::searchItems($_GET);
    if (!isset($_GET['id'])) {
        // Get the catalog using the getCatalog function
        echo json_encode($catalog);
    } else {
        // Find the item with the matching ID
        $item = array_values(array_filter($catalog, function($item) {
            return $item->id == $_GET['id'];
        }))[0];
        
        if ($item) {
            echo json_encode($item);
        } else {
            http_response_code(404);
        }
    }
} else if($_SERVER['REQUEST_METHOD'] == 'POST') {

    if(Item::saveToCatalog(new Item(-1, $body['name'], $body['cost'], $body['category'], $body['description'], $body['imageUrl']))){
        http_response_code(201);
    }else{
        http_response_code(400);
    }

} else if($_SERVER['REQUEST_METHOD'] == 'DELETE') {

    $id = $_GET['id'];
    if(Item::deleteFromCatalog($id)){
        http_response_code(204);
    }else{
        http_response_code(400);
    }

} else if($_SERVER['REQUEST_METHOD'] == 'PATCH') {

    $id = $_GET['id'];
    $status = Item::updateItem($body, $id);
    if($status === false){
        http_response_code(400);
        die(0);
    }else if($status === 0){
        http_response_code(404);
    }

    http_response_code(204);

}