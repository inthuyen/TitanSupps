<?php

include_once 'config.inc.php';

class Shipping {
    private $address;
    private $fname;
    private $lname;
    private $phone;
    private $user_id;
    
    public function __construct($address, $fname, $lname, $phone, $user_id) {
        $this->address = $address;
        $this->fname = $fname;
        $this->lname = $lname;
        $this->phone = $phone;
        $this->user_id = $user_id;
    }
    
    public function getAddress() {
        return $this->address;
    }
    
    public function getFname() {
        return $this->fname;
    }
    
    public function getLname() {
        return $this->lname;
    }
    
    public function getPhone() {
        return $this->phone;
    }
    
    public function getUserId() {
        return $this->user_id;
    }

    public static function addShipping(Shipping $shipping_info) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement with parameters
        $stmt = mysqli_prepare($conn, "INSERT INTO shipping (address, fname, lname, phone, user_id) VALUES (?, ?, ?, ?, ?)");
    
        // bind the parameters to the SQL statement
        mysqli_stmt_bind_param($stmt, "ssssi", $shipping_info->address, $shipping_info->fname, $shipping_info->lname, $shipping_info->phone, $shipping_info->user_id);
    
        // execute the statement and get the result
        if (mysqli_stmt_execute($stmt)) {
            $shipping_id = mysqli_insert_id($conn);
            return $shipping_id;
        } else {
            return false;
        }
    
        // close the statement and connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }

    public static function getAllShippingInfo($user_id) {
        // create a database connection using the Config class
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // prepare the SQL statement
        $stmt = mysqli_prepare($conn, "SELECT shipping_id, address, fname, lname, phone FROM shipping WHERE user_id=?");
        mysqli_stmt_bind_param($stmt, "i", $user_id);
    
        // execute the SQL statement
        mysqli_stmt_execute($stmt);
    
        // bind the result variables
        mysqli_stmt_bind_result($stmt, $shipping_id, $address, $fname, $lname, $phone);
    
        // fetch the results into an array of Shipping objects
        $shipping_info = array();
        while (mysqli_stmt_fetch($stmt)) {
            $shipping_obj = new Shipping($address, $fname, $lname, $phone, $user_id);
            $shipping_info[] = array($shipping_id, $shipping_obj);
        }
    
        // close the statement and database connection
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    
        // return the array of [shipping_id, Shipping Object]
        return $shipping_info;
    }
    
    
    
  }

  