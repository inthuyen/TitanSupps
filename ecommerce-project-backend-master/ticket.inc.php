<?php

include_once 'config.inc.php';

class Ticket {
    
    public function __construct(
        public string $email,
        public string $subject,
        public string $message
    ) { }
    
    // Add all the Items and Quantities for a given Transaction ID into the Database
    public static function createNewTicket($ticket){
        $config = Config::getInstance();
        
        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        
        // Check connection
        if (!$conn) {
          die("Connection failed: " . mysqli_connect_error());
        }
        
        // Prepare SQL statement
        $sql = "INSERT INTO support_tickets (email, subject, message) VALUES (?, ?, ?)";
        
        // Create a prepared statement
        $stmt = mysqli_prepare($conn, $sql);
        
        // Bind the parameters to the prepared statement
        mysqli_stmt_bind_param($stmt, "sss", $ticket->email, $ticket->subject, $ticket->message);
        
        // Execute the prepared statement
        mysqli_stmt_execute($stmt);
        
        // Get the id of the newly inserted record
        $ticket_id = mysqli_insert_id($conn);
        
        // Close the prepared statement
        mysqli_stmt_close($stmt);
        
        // Close the database connection
        mysqli_close($conn);
        
        // Return the ticket id
        return $ticket_id;
      }
      

      public static function createNewTicketUser($ticket, $user_id){
        $config = Config::getInstance();
        
        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
        
        // Check connection
        if (!$conn) {
          die("Connection failed: " . mysqli_connect_error());
        }
        
        // Prepare SQL statement
        $sql = "INSERT INTO support_tickets (user_id, email, subject, message) VALUES (?, ?, ?, ?)";
        
        // Create a prepared statement
        $stmt = mysqli_prepare($conn, $sql);
        
        // Bind the parameters to the prepared statement
        mysqli_stmt_bind_param($stmt, "ssss", $user_id, $ticket->email, $ticket->subject, $ticket->message);
        
        // Execute the prepared statement
        mysqli_stmt_execute($stmt);
        
        // Get the id of the newly inserted record
        $ticket_id = mysqli_insert_id($conn);
        
        // Close the prepared statement
        mysqli_stmt_close($stmt);
        
        // Close the database connection
        mysqli_close($conn);
        
        // Return the ticket id
        return $ticket_id;
      }
      

      public static function getAllTickets(){
        $config = Config::getInstance();
    
        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // Check if the connection was successful
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
    
        // Prepare the SQL query
        $sql = "SELECT * FROM support_tickets";
    
        // Execute the query and get the result set
        $result = mysqli_query($conn, $sql);
    
        // Check if any rows were returned
        if (mysqli_num_rows($result) > 0) {
            $tickets = array(); // create an empty array to hold the tickets
    
            // Loop through the result set and add each row to the tickets array
            while ($row = mysqli_fetch_assoc($result)) {
                $ticket_id = $row["ticket_id"];
                $user_id = $row["user_id"];
                $email = $row["email"];
                $subject = $row["subject"];
                $message = $row["message"];
    
                // Create a new array with the ticket data and add it to the tickets array
                $ticket_data = array($ticket_id, $user_id, $email, $subject, $message);
                array_push($tickets, $ticket_data);
            }
    
            // Close the database connection
            mysqli_close($conn);
    
            // Return the tickets array
            return $tickets;
        } else {
            // No tickets were found
            mysqli_close($conn);
            return array();
        }
    }

    public static function resolveTicket($ticket_id){
        $config = Config::getInstance();
    
        // Connect to the database
        $conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());
    
        // Check if the connection succeeded
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
    
        // Prepare the SQL statement to retrieve the support ticket with the given ID
        $sql = "SELECT * FROM support_tickets WHERE ticket_id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $ticket_id);
    
        // Execute the SQL statement and retrieve the result
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
    
        // Check if a row was found
        if ($row = mysqli_fetch_assoc($result)) {
            // Remove the support ticket from the database
            $sql = "DELETE FROM support_tickets WHERE ticket_id = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "i", $ticket_id);
            mysqli_stmt_execute($stmt);
    
            // Return the row as an array
            return $row;
        } else {
            // Return null if no row was found
            return null;
        }
    }
    

    

}