<?php

include 'transaction.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if($_SERVER['REQUEST_METHOD'] === 'GET'){

    if(!isset($_GET['user'])){
        http_response_code(400);
        die("Missing user id");
    }
    $userID = $_GET['user'];
    echo json_encode(Transaction::getAllUserOrders($userID));

}else{

    http_response_code(405);

}