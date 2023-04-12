<?php

include 'item.inc.php';

class Review {

    public function __construct(public int $id, public string $title, public string $content, public int $ranking, public int $user, public int $item)
    {

    }

    static function deleteReview(int $id) : bool
    {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            http_response_code(500);
            die('Unable to connect to the DB');
        }
        $stmt = $conn->prepare("DELETE FROM review WHERE id = ?");
        $stmt->bind_param("i", $id);
        $executed = $stmt->execute();
        mysqli_close($conn);
        return $executed;

    }

    static function addReview(Review $review) : bool
    {

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }

        $stmt = $conn->prepare("INSERT INTO review(title, content, ranking, item, user) VALUES(?, ?, ?, ?, ?)");
        $stmt->bind_param("ssiii", $review->title, $review->content, $review->ranking, $review->item, $review->user);
        $executed = $stmt->execute();
        mysqli_close($conn);
        return $executed;

    }

    static function getAllReviewsOfItem(int $id) {

        $item = Item::getItemById($id);
        if($item === null){
            http_response_code(404);
            die("Item not found");
        }

        $config = Config::getInstance();
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if ($conn === false) {
            echo "HIIIII";
            http_response_code(500);
            die('Unable to connect to the Database');
        }

        // Prepare the SQL statement
        $stmt = $conn->prepare("SELECT id, title, content, ranking, user, item FROM review WHERE item = ?");

        $stmt->bind_param("i", $id);
        // Execute the statement
        $stmt->execute();

        // Bind the result variables
        $stmt->bind_result($id, $title, $content, $ranking, $user, $item);

        $reviews = [];
        // Fetch the results
        while ($stmt->fetch()) {
            // Create an Item object and add it to the array
            $review = new Review($id, $title, $content, $ranking, $user, $item);
            $reviews[] = $review;
        }

        // Close the statement and database connection
        $stmt->close();
        $conn->close();

        return $reviews;

    }

}