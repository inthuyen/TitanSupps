<?php

$max = -1;
$migrationName = $argv[1] ?? "migrate";

foreach(glob('migrations/up/[0-9][0-9][0-9][0-9]_migration_*.sql') as $filename){
    preg_match('/[0-9]+/', $filename, $matches);
    $numString = $matches[0];
    $numString = ltrim($numString, '0');
    $migrationNumber = intval($numString);
    if($migrationNumber > $max){
        $max = $migrationNumber;
    }
}
$maxAsStr = "".$max + 1;
$leadingZeroes = 4 - strlen($maxAsStr);
for($i = 0; $i < $leadingZeroes; $i++){

    $maxAsStr = '0' . $maxAsStr;

}


file_put_contents("migrations/up/$maxAsStr"."_migration_$migrationName"."_up.sql", '');
file_put_contents("migrations/down/$maxAsStr"."_migration_$migrationName"."_down.sql", '');