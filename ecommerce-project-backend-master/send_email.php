<?php

include 'user.inc.php';
include 'ticket.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // get the values of the post parameters
    $userID = $_POST['userID'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];
    
    // check if userID is null
    if ($userID !== 'null') {
        // get the user email from the user_id
        $email = User::getUserEmail($userID);
        // create ticket object with email, subject and message
        $ticket = new Ticket($email, $subject, $message);
        // create new ticket in the database
        $ticket_id = Ticket::createNewTicketUser($ticket, $userID);
    } else {
        // create ticket object with email, subject and message
        $ticket = new Ticket($email, $subject, $message);
        // create new ticket in the database
        $ticket_id = Ticket::createNewTicket($ticket);
    }
    
    // return ticket_id as JSON
    echo json_encode(array("ticket_id" => $ticket_id));
    }
    ?>