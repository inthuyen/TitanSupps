<?php

include 'shipping.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// Get all Shipping Options for front end
// Get all Shipping Options for front end
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $user_id = $_GET['user_id'];
    $shipping_info = Shipping::getAllShippingInfo($user_id);

    $result = [];
    foreach ($shipping_info as $shipping) {
        $result[] = [        'address' => $shipping[1]->getAddress(),
            'fname' => $shipping[1]->getFname(),
            'lname' => $shipping[1]->getLname(),
            'phone' => $shipping[1]->getPhone(),
            'shipping_id' => $shipping[0]
        ];
    }


    echo json_encode($result);
}  

// Add Shipping Method to the Database
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve data from POST request
    $user_id = $_POST['userID'];
    $address = $_POST['address'];
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $phone = $_POST['phone'];
  
    // Create Shipping object and add to Database
    $shipping_info = new Shipping($address, $fname, $lname, $phone, $user_id);
    $result = Shipping::addShipping($shipping_info);
  
    // Set response code and return message
    if ($result) {
      http_response_code(200);
      echo json_encode(array("message" => "Shipping Info added successfully."));
    } else {
      http_response_code(400);
      echo json_encode(array("message" => "Unable to add Shipping Info."));
    }
  }