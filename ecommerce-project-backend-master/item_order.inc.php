<?php

include_once 'config.inc.php';

class ItemOrder {
    
    public function __construct(
        public int $item_id,
        public int $quantity,
        public int $transaction_id
    ) { }
    
    // Add all the Items and Quantities for a given Transaction ID into the Database
    public static function addOrderItems(array $item_orders) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        
        // prepare the SQL statement
        $stmt = mysqli_prepare($conn, "INSERT INTO order_items (item_id, quantity, order_id) VALUES (?, ?, ?)");
        
        // bind parameters to the SQL statement
        mysqli_stmt_bind_param($stmt, 'iii', $item_id, $quantity, $transaction_id);
        
        // loop through the array of ItemOrder objects and insert them into the database
        foreach ($item_orders as $item_order) {
            $item_id = $item_order->item_id;
            $quantity = $item_order->quantity;
            $transaction_id = $item_order->transaction_id;
            mysqli_stmt_execute($stmt);
        }
        
        // close the prepared statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }

    // Get all the item Orders and Quantities from a given Transaction/Order ID, return as an array of objects
    public static function getOrderItems($transaction_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement to select items in the order
        $sql = "SELECT item_id, quantity FROM order_items WHERE order_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $transaction_id);
        mysqli_stmt_execute($stmt);
    
        // get the result set and create an array of ItemOrder objects
        $result = mysqli_stmt_get_result($stmt);
        $items = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $itemOrder = new ItemOrder($row['item_id'], $row['quantity'], $transaction_id);
            $items[] = $itemOrder;
        }
    
        // close the statement and connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        return $items;
    }
    


}
