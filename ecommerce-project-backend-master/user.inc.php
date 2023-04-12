<?php

include 'config.inc.php';

class User
{

    public function __construct(public string $username, public string $password, public array $cart = [], public int $id = -1){}


    static function getUser(User $user, bool $isAdmin = false)
    {
        $config = Config::getInstance();
        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        if (!$conn) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }
        // Prepare the SQL statement to get a user
        $stmt = $conn->prepare("SELECT user_id, password, salt FROM users WHERE email = ?". ($isAdmin ? " AND admin = true" : ""));
        if($stmt === false){
            echo $conn->error;
            return false;
        }
        $stmt->bind_param("s", $user->username);

        // Execute the SQL statement and check for errors
        if ($stmt->execute()) {
            // Bind the result variables by reference
            $stmt->bind_result($user_id, $hashed_password, $salt);

            // Check if a row was returned
            $fetched = $stmt->fetch();
            mysqli_close($conn);
            if ($fetched) {
                // Check if the supplied password matches the hashed password with the salt
                if (md5($user->password.$salt) === $hashed_password) {
                    // User found and password is correct
                    return $user_id;
                } else {
                    // User found but password is incorrect
                    return false;
                }
            } else {
                // User not found
                return false;
            }
        } else {
            // Error executing statement
            mysqli_close($conn);
            return false;
        }
    }



    /**
     * Writes a user to the DB (as of now is implemented as a json file). NOTE: assumes that the username is not already
     * in the DB
     * @param User $user The user to write to the DB
     */
    static function writeUser(User $user)
    {
        $config = Config::getInstance();

        // Generate salt for password
        $salt = base64_encode(random_bytes(12));

        // Hash the salted password using md5
        $hashed_password = md5($user->password.$salt);

        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());

        if (!$conn) {
            http_response_code(500);
            die('Unable to connect to the Database');
        }

        // Prepare the SQL statement to insert a new user
        $stmt = $conn->prepare("INSERT INTO users (email, password, salt) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $user->username, $hashed_password, $salt);

        // Execute the SQL statement and check for errors
        $executed = $stmt->execute();
        // Close the database connection
        if ($executed) {
            mysqli_close($conn);
            return true;
        } else {
            echo "$conn->error: $hashed_password";
            mysqli_close($conn);
            return false;
        }

    }

    /**
     * Writes a user to the DB (as of now is implemented as a json file). NOTE: assumes that the username is not already
     * in the DB
     * @param User $user The user to write to the DB
     */
    static function addUserData($user_id, $fname, $lname, $phone, $address)
    {
    $config = Config::getInstance();
    // Connect to the database
    $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());

    if (!$conn) {
        http_response_code(500);
        die('Unable to connect to the Database');
    }

    // Prepare the SQL statement to update the user's information
    $stmt = $conn->prepare("UPDATE users SET fname=?, lname=?, phone=?, address=? WHERE user_id=?");
    $stmt->bind_param("ssssi", $fname, $lname, $phone, $address, $user_id);

    // Execute the SQL statement and check for errors
    $executed = $stmt->execute();
    // Close the database connection
    mysqli_close($conn);
    if ($executed) {
        return true;
    } else {
        return false;
    }

    }

    static function getUserEmail($user_id)
    {
    $config = Config::getInstance();
    
    // Connect to the database
    $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    // Prepare SQL statement
    $sql = "SELECT email FROM users WHERE user_id = ?";
    
    // Create a prepared statement
    $stmt = mysqli_prepare($conn, $sql);
    
    // Bind the parameter to the prepared statement
    mysqli_stmt_bind_param($stmt, "i", $user_id);
    
    // Execute the prepared statement
    mysqli_stmt_execute($stmt);
    
    // Bind the result variable
    mysqli_stmt_bind_result($stmt, $email);
    
    // Fetch the result
    mysqli_stmt_fetch($stmt);
    
    // Close the prepared statement
    mysqli_stmt_close($stmt);
    
    // Close the database connection
    mysqli_close($conn);
    
    // Return the email
    return $email;
    }



}