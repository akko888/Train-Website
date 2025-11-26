<?php

$server = "localhost";
$user = "your_user";
$pass = "your_password";
$db = "sushiDB";

$connection = new mysqli($server, $user, $pass, $db);

if($connection->connect_errno){
    die("Connection failed" . $connection->connect_errno);
}else{
    echo "Connected";
}

?>