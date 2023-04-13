<?php
include 'config.inc.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $body = json_decode(file_get_contents('php://input'), true);

    $gender = $body["gender"];
    $experience = $body["experience"];

    $config = Config::getInstance();
    // Connect to the database
    $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    if (!$conn) {
        http_response_code(500);
        die('Unable to connect to the Database');
    }

    // Prepare the SQL statement to get a user
    $stmt = $conn->prepare("SELECT exercises, `reps/set`, days FROM workouts WHERE gender = ? AND experience = ?");
    if($stmt === false){
        echo $conn->error;
        return false;
    }
    $stmt->bind_param("ss", $gender, $experience);

    // Execute the SQL statement and check for errors
    if ($stmt->execute()) {
        // Bind the result variables by reference
        $stmt->bind_result($exercises, $reps, $days);

        // Check if a row was returned
        $fetched = $stmt->fetch();
        mysqli_close($conn);
                
        if ($fetched) {
            echo "<p>Your workout plan is " . $exercises . " for " . $reps . " " . $days . ".</p>";
        } else {
            // Workout plan not found
            echo "<p>No workout plan found for your gender and experience level.</p>";
        }
    } else {
        // Error executing statement
        mysqli_close($conn);
        return false;
	}
}
?>