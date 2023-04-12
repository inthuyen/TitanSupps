<?php

include 'user.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $body = json_decode(file_get_contents('php://input'), true);
    if(!isset($body['username']) || !isset($body['password'])){
        http_response_code(400);
        return;
    }
    $user = new User($body['username'], $body['password']);
    $userId = isset($body['isAdmin']) ? User::getUser($user, $body['isAdmin']) : User::getUser($user);
    if($userId !== false){
        // User found
        http_response_code(200);
        header('Content-Type: text/plain');
        echo $userId;
    }else{
        // User not found
        http_response_code(401);
        return;
    }
}else {
    http_response_code(405);
}