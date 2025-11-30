<?php
// Set the data from this file to your own data and change its name to "config.php"

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

define('ADMIN_KEY', 'Set_Your_Admin_Password');

?>