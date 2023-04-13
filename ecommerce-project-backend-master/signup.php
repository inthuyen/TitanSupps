<?php

include 'user.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $body = json_decode(file_get_contents('php://input'), true);
    if(!isset($body['email']) || !isset($body['password'])){
        http_response_code(400);
    }
    if(User::writeUser(new User($body['email'], $body['password']))){
        http_response_code(201);
    }else{
        http_response_code(500);
    }
}else {
    http_response_code(405);
}