<?php

include 'config.inc.php';

$commands = [];
$migrationFolder = $argv[1] ?? "up";
$amount = -1;
if($migrationFolder !== "up" && $migrationFolder !== "down"){
    $migrationFolder = "up";
}

if(isset($argv[2])){
    if(is_numeric($argv[2])){
        $amount = intval($argv[2]);
    }
}
$config = Config::getInstance();
// Connect to the database
$conn = mysqli_connect($config->getDBServerName(), $config->getDBUsername(), $config->getDBPassword(), $config->getDBName(), $config->getDBPort());


foreach(glob("migrations/$migrationFolder/[0-9][0-9][0-9][0-9]_migration_*.sql") as $filename){
    preg_match('/[0-9]+/', $filename, $matches);
    $numString = $matches[0];
    $numString = ltrim($numString, '0');
    $migrationNumber = intval($numString);
    $commands[$migrationNumber] = file_get_contents($filename);
}

echo "Amount: $amount";

if($migrationFolder === "down" && $amount === -1){
    $commands = array_reverse($commands);
}

if($amount === -1){
    foreach ($commands as $command){

        $conn->multi_query($command);
        printDebugInfo($conn, $command);
        while(mysqli_next_result($conn)){
            echo "...\n";
        }

    }
}else{
    for($i = 0; $i < $amount; $i++){
        $command = array_pop($commands);
        $conn->multi_query($command);
        printDebugInfo($conn, $command);
        while(mysqli_next_result($conn)){
            echo "...\n";
        }

    }
}


mysqli_close($conn);

function printDebugInfo($conn, $command) {

    echo "----- Running: $command\n";
    if($conn->error){
        echo "Error: $conn->error\n";
    }
    echo "Effected rows: $conn->affected_rows\n";

}