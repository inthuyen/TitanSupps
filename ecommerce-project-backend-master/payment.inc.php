<?php

include_once 'config.inc.php';

class Payment {
    private $fname;
    private $lname;
    private $ccNumber;
    private $cvv;
    private $expiry;
    private $billingAddress;
    
    public function __construct($fname, $lname, $ccNumber, $cvv, $expiry, $billingAddress) {
        $this->fname = $fname;
        $this->lname = $lname;
        $this->ccNumber = $ccNumber;
        $this->cvv = $cvv;
        $this->expiry = $expiry;
        $this->billingAddress = $billingAddress;
    }
    
    public static function addPayment(Payment $payment, $user_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement with placeholders for the values
        $stmt = mysqli_prepare($conn, "INSERT INTO payment (fname, lname, number, cvv, expiry, user_id, billing_address) 
                                       VALUES (?, ?, ?, ?, ?, ?, ?)");
    
        // bind the values to the placeholders in the statement
        mysqli_stmt_bind_param($stmt, "sssssis", $payment->fname, $payment->lname, $payment->ccNumber, $payment->cvv, $payment->expiry, $user_id, $payment->billingAddress);
    
        // execute the prepared statement and check for errors
        if (mysqli_stmt_execute($stmt) === false) {
            error_log("Error: " . mysqli_error($conn));
            return false;
        }
    
        // get the newly generated payment ID
        $payment_id = mysqli_insert_id($conn);
    
        // close the statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        // return the newly generated payment ID
        return $payment_id;
    }
    

    // Get all payments as payment objects, used for selecting payment method
    public static function getAllPayments($user_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement to retrieve payments for the given user
        $stmt = mysqli_prepare($conn, "SELECT payment_id, number FROM payment WHERE user_id = ?");
    
        // bind the user_id value to the placeholder in the statement
        mysqli_stmt_bind_param($stmt, "i", $user_id);
    
        // execute the prepared statement and check for errors
        if (mysqli_stmt_execute($stmt) === false) {
            error_log("Error: " . mysqli_error($conn));
            return false;
        }
    
        // bind the retrieved columns to variables
        mysqli_stmt_bind_result($stmt, $payment_id, $ccNumber);
    
        // create an empty array to hold the payment IDs and masked numbers
        $payments = [];
    
        // fetch each row and create a Payment object for it
        while (mysqli_stmt_fetch($stmt)) {
            // replace the first 14 characters of the number with "X"
            $maskedNumber = str_pad(substr($ccNumber, 12), strlen($ccNumber), "X", STR_PAD_LEFT);
    
            // add the payment ID and masked number to the array
            $payments[] = [$payment_id, $maskedNumber];
        }
    
        // close the statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        // return the array of payment IDs and masked numbers
        return $payments;
    }
    

    
    // Used to show which credit card was used for a transaction
    public static function getMaskedCCNumberFromPaymentID($payment_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement to retrieve the ccNumber for the given payment_id
        $stmt = mysqli_prepare($conn, "SELECT number FROM payment WHERE id = ?");
    
        // bind the payment_id value to the placeholder in the statement
        mysqli_stmt_bind_param($stmt, "i", $payment_id);
    
        // execute the prepared statement and check for errors
        if (mysqli_stmt_execute($stmt) === false) {
            error_log("Error: " . mysqli_error($conn));
            return false;
        }
    
        // bind the retrieved column to a variable
        mysqli_stmt_bind_result($stmt, $ccNumber);
    
        // fetch the row and mask the ccNumber with 'X' characters
        if (mysqli_stmt_fetch($stmt)) {
            $ccNumber = str_pad(substr($ccNumber, 0, 14), strlen($ccNumber), 'X', STR_PAD_RIGHT);
        }
    
        // close the statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        // return the masked ccNumber
        return $ccNumber;
    }
    
}


