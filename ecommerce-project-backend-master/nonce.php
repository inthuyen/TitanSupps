<?php
include 'nonce-service.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$nonceService = new NonceService();

if($_SERVER['REQUEST_METHOD'] == 'GET') {

    $thing = $nonceService->generateNonce();
    echo "$thing";

}else if($_SERVER['REQUEST_METHOD'] == 'POST') {

    $body = json_decode(file_get_contents('php://input'), true);
    $nonce = $body['nonce'];
    $valid = $nonceService->validateNonce($nonce);

    if(!$valid){
        http_response_code(400);
    }else{
        http_response_code(200);
    }

}