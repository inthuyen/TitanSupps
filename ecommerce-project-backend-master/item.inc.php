<?php

include_once 'config.inc.php';

class Item {

    public function __construct(public int $id, public string $name, public float $cost, public string $category, public string $description, public string $imageUrl)
    {

    }

    static function getItemById(int $id): ?Item
    {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }

        $stmt = $conn->prepare("SELECT item_id, name, price, category, description, img_link FROM item WHERE item_id = ?");

        $stmt->bind_param("i", $id);

        if($stmt->execute()){

            $stmt->bind_result($item_id, $name, $cost, $category, $description, $img_link);
            $fetched = $stmt->fetch();
            mysqli_close($conn);
            if ($fetched) {
                return new Item($item_id, $name, $cost, $category, $description, $img_link);
            } else {
                http_response_code(500);
                die("Error adding item");
            }
        }else{
            // Error executing statement
            mysqli_close($conn);
            return null;
        }

    }

    static function deleteFromCatalog(int $id): bool
    {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            http_response_code(500);
            die('Unable to connect to the DB');
        }
        $stmt = $conn->prepare("DELETE FROM item WHERE item_id = ?");
        $stmt->bind_param("i", $id);
        $executed = $stmt->execute();
        mysqli_close($conn);
        return $executed;

    }

    static function saveToCatalog(Item $item): bool
    {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }
        $stmt = $conn->prepare("INSERT INTO item(name, price, category, description, img_link) VALUES(?, ?, ?, ?, ?)");
        $stmt->bind_param("sdsss", $item->name, $item->cost, $item->category, $item->description, $item->imageUrl);
        $executed = $stmt->execute();
        mysqli_close($conn);
        return $executed;

    }

    static function getCatalog() {
        $items = array();
        
        // Connect to the database
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if (!$conn) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }
    
        // Prepare the SQL statement
        $stmt = $conn->prepare("SELECT item_id, name, price, category, description, img_link FROM item");
        
        // Execute the statement
        $stmt->execute();
        
        // Bind the result variables
        $stmt->bind_result($item_id, $name, $price, $category, $description, $img_link);

        // Fetch the results
        while ($stmt->fetch()) {
            // Convert price to dollars and cents
            $price = floatval(substr($price, 0, -2) . "." . substr($price, -2));
            
            // Create an Item object and add it to the array
            $item = new Item($item_id, $name, $price, $category, $description, $img_link);
            $items[] = $item;
        }
        
        // Close the statement and database connection
        $stmt->close();
        $conn->close();
        
        return $items;
    }

    static function getItemsInfo($item_ids) {
        $items = array();
    
        // Connect to the database
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if (!$conn) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }
    
        // Prepare the SQL statement
        $item_ids_placeholder = str_repeat('?,', count($item_ids) - 1) . '?'; // generate placeholders for the item ids
        $stmt = $conn->prepare("SELECT item_id, name, price, img_link FROM item WHERE item_id IN ($item_ids_placeholder)");
    
        // Bind the parameters to the statement
        $stmt->bind_param(str_repeat('i', count($item_ids)), ...$item_ids);
    
        // Execute the statement
        $stmt->execute();
    
        // Get the results
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $items[] = $row;
        }
    
        // Close the database connection and statement
        $stmt->close();
        $conn->close();
    
        return $items;
    }

    static function searchItems(array $fieldsLike) {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());

        $query = "SELECT * FROM item WHERE ";
        $values = [];
        $types = "";
        // These make sure differences in names in the representations of items aren't an issue
        if(isset($fieldsLike['id'])){
            $fieldsLike['item_id'] = $fieldsLike['id'];
            unset($fieldsLike['id']);
        }
        if(isset($fieldsLike['cost'])){
            $fieldsLike['price'] = $fieldsLike['cost'];
            unset($fieldsLike['cost']);
        }
        if(isset($fieldsLike['imageUrl'])){
            $fieldsLike['img_link'] = $fieldsLike['imageUrl'];
            unset($fieldsLike['imageUrl']);
        }
        foreach ($fieldsLike as $key => $value) {
            if(!in_array($key, ["item_id", "name", "price", "category", "description", "img_link"])){
                http_response_code(400);
                header("Content-type: text/plain");
                echo "Known search field: $key";
                die();
            }
            if(is_numeric($value)){
                $value = floatval($value);
            }
            // Assumes no blobs. If needed, we'll need to add support here for blobs
            if(is_int($value)){
                $types .= "i";
                $query .= "$key = ? AND ";
                $values[] = $value;
            }else if (is_double($value)){
                $types .= "d";
                $query .= "$key LIKE ? AND ";
                $values[] = $value;
            }else {
                $types .= "s";
                $value = "%$value%";
                $query .= "$key LIKE ? AND ";
                $values[] = $value;
            }
        }
        $query = substr($query, 0, -5);

        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$values);

        $stmt->execute();
        $stmt->bind_result($item_id, $name, $price, $category, $description, $img_link);

        $items = [];

        while ($stmt->fetch()) {
            $item = new Item($item_id, $name, $price, $category, $description, $img_link);
            $items[] = $item;
        }

        return $items;

    }

    static function updateItem(array $itemChanges, int $id) {

        // Connect to the database
        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());

        $query = "UPDATE item SET ";
        $values = [];
        $types = "";

        foreach ($itemChanges as $key => $value) {
            $query .= "$key = ?, ";
            $values[] = $value;
            // Assumes no blobs. If needed, we'll need to add support here for blobs
            if(is_int($value)){
                $types .= "i";
            }else if (is_double($value)){
                $types .= "d";
            }else {
                $types .= "s";
            }
        }
        $query = substr($query, 0, -2) . " ";
        $query .= "WHERE item_id = $id;";
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$values);
        $executed = $stmt->execute();
        $conn->close();

        if($executed){
            return $stmt->affected_rows;
        }else{
            return false;
        }

    }
    
}