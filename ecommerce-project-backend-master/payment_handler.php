<?php

include 'payment.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// Retrieve form data

// Get Credit Card payment_id (for database reference) and masked CC number for front end
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_GET['user_id'];
    $payments = Payment::getAllPayments($user_id);

    $result = [];
    foreach ($payments as $payment) {
        $result[] = [
            'payment_id' => $payment[0],
            'maskedNumber' => $payment[1]
        ];
    }

    // If it is empty, it will return an HTTP 404
    echo json_encode($result);
} 
// Add Payment Method to the Database
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve data from POST request
    $fname = $_POST['firstName'];
    $lname = $_POST['lastName'];
    $user_id = $_POST['userID'];
    $ccNumber = $_POST['ccNumber'];
    $cvv = $_POST['cvv'];
    $expiry = $_POST['expiry'];
    $billingAddress = $_POST['billingAddress'];
  
    // Create Payment object and add to user
    $payment = new Payment($fname, $lname, $ccNumber, $cvv, $expiry, $billingAddress);
    $result = Payment::addPayment($payment, $user_id);
  
    // Set response code and return message
    if ($result) {
      http_response_code(200);
      echo json_encode(array("message" => "Payment added successfully."));
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Unable to add payment."));
    }
  }
  

