<?php
include 'review.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if($_SERVER['REQUEST_METHOD'] == 'POST'){

    $body = json_decode(file_get_contents('php://input'), true);
    if(!isset($body['title']) || !isset($body['content']) ||
        !isset($body['ranking']) || !is_numeric($body['ranking'])
        || !isset($body['item']) || !is_numeric($body['item'])
        || !isset($body['user']) || !is_numeric($body['user'])){
        http_response_code(400);
        echo "Missing fields or invalid fields";
        die();
    }
    Review::addReview(new Review(-1, $body['title'], $body['content'], intval($body['ranking']), intval($body['user']), intval($body['item'])));

} else if($_SERVER['REQUEST_METHOD'] === 'GET'){

    $reviews = Review::getAllReviewsOfItem($_GET['id']);
    echo json_encode($reviews);

} else {

    http_response_code(405);

}