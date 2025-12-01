<?php
// Pon tu información en este archivo y cambia la contraseña de administrador

$server = "localhost";
$user = "tu_usuario";
$pass = "tu_contraseña";
$db = "sushiDB";

$connection = new mysqli($server, $user, $pass, $db);

if($connection->connect_errno){
    die("La conexión falló: " . $connection->connect_errno);
}/*else{
    echo "Connected";
}*/

define('ADMIN_KEY', 'Configura_tu_contraseña');

?>