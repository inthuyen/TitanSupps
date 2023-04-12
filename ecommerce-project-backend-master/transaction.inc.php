<?php

include_once 'config.inc.php';

class Transaction {
    private $user_id;
    private $payment_id;
    private $shipping_id;
    private $price;
    private $emails;
    
    public function __construct($user_id, $payment_id, $shipping_id, $price, $emails) {
        $this->user_id = $user_id;
        $this->payment_id = $payment_id;
        $this->shipping_id = $shipping_id;
        $this->price = $price;
        $this->emails = $emails;
    }
    
    // Add order to the Database
    public static function createOrder(Transaction $transaction) {
        // generate a random 14-character tracking string
        $tracking = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 14);
        
        // set the current date and the estimated time of arrival (ETA) 5 days later
        $date = date('Y-m-d H:i:s');
        $eta = date('Y-m-d', strtotime('+5 days'));
        
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        
        // prepare the SQL statement with placeholders for the values
        $stmt = mysqli_prepare($conn, "INSERT INTO orders (user_id, date, eta, price, payment_id, shipping_id, tracking, emails) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
        // bind the values to the placeholders in the statement
        mysqli_stmt_bind_param($stmt, "issdsiss", $transaction->user_id, $date, $eta, $transaction->price, $transaction->payment_id, $transaction->shipping_id, $tracking, $transaction->emails);
    
        // execute the prepared statement and check for errors
        if (mysqli_stmt_execute($stmt) === false) {
            error_log("Error: " . mysqli_error($conn));
            return false;
        }
    
        // get the newly generated transaction ID
        $transaction_id = mysqli_insert_id($conn);
    
        // close the statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        // return the newly generated transaction ID
        return $transaction_id;
    }
    


    // Get information for the All Orders Page (Transaction ID, Date, Price)
    public static function getAllUserOrders($user_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement to select orders for the given user_id
        $sql = "SELECT o.transaction_id AS order_num, o.`date`, o.eta, o.price, o.tracking, SUM(oi.quantity) AS total_items
                    FROM orders o JOIN order_items oi ON o.transaction_id = oi.order_id
                    WHERE o.user_id = ?
                    GROUP BY o.transaction_id
                    ORDER BY o.`date` DESC";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $user_id);
        mysqli_stmt_execute($stmt);
    
        // get the result set and create an array of orders with formatted date
        $result = mysqli_stmt_get_result($stmt);
        $orders = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $row['date'] = date('Y-m-d', strtotime($row['date'])); // format the date as YYYY-MM-DD
            $orders[] = $row;
        }
    
        // close the statement and connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        return $orders;
    }
    

    // Using the users ID get the most recent order info to display after checking out
    public static function getMostRecentOrderInfo($user_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // retrieve order information from database using the provided user_id
        $sql = "SELECT orders.date, payment.number, shipping.fname, shipping.lname, shipping.address, orders.eta, orders.tracking, orders.transaction_id FROM orders 
                INNER JOIN users ON orders.user_id = users.user_id
                INNER JOIN payment ON orders.payment_id = payment.payment_id
                INNER JOIN shipping ON orders.shipping_id = shipping.shipping_id
                WHERE users.user_id = $user_id
                ORDER BY orders.date DESC
                LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $order = mysqli_fetch_assoc($result);
    
        // Swap the first 12 characters of the card number with 'X'
        $ccNumber = str_pad(substr($order['number'], 12), strlen($order['number']), 'X', STR_PAD_LEFT);
    
        // return the retrieved order information as an array
        return array(
            'date' => $order['date'],
            'ccNumber' => $ccNumber,
            'fname' => $order['fname'],
            'lname' => $order['lname'],
            'address' => $order['address'],
            'eta' => $order['eta'],
            'tracking' => $order['tracking'],
            'transaction_id' => $order['transaction_id']
        );
    }


    // Display order info based on the Transaction ID
    // Used for when a user selects an order from the All Orders page
    public static function getOrderInfoByTransactionID($transaction_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());

        // retrieve order information from database using the provided transaction_id
        $sql = "SELECT orders.date, payment.number, shipping.fname, shipping.lname, shipping.address, orders.eta, orders.tracking, orders.transaction_id FROM orders 
                INNER JOIN users ON orders.user_id = users.user_id
                INNER JOIN payment ON orders.payment_id = payment.payment_id
                INNER JOIN shipping ON orders.shipping_id = shipping.shipping_id
                WHERE orders.transaction_id = '$transaction_id'
                LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $order = mysqli_fetch_assoc($result);

        // Swap the first 12 characters of the card number with 'X'
        $ccNumber = str_pad(substr($order['number'], 12), strlen($order['number']), 'X', STR_PAD_LEFT);

        // return the retrieved order information as an array
        return array(
            'date' => $order['date'],
            'ccNumber' => $ccNumber,
            'fname' => $order['fname'],
            'lname' => $order['lname'],
            'address' => $order['address'],
            'eta' => $order['eta'],
            'tracking' => $order['tracking'],
            'transaction_id' => $order['transaction_id']
        );
    }

    
}