<?php
    session_start(); 
    
    header("Content-Type: application/json");

    if(!isset($_SESSION['user'])){
        echo json_encode([
            "deleted" => false,
            "message" => "No hay sesión activa."
        ]);
        exit;
    }

    $userId = $_SESSION['user']["id"];

    require_once __DIR__ . '/../config/config.php';

    $stmtOrders = $connection->prepare("DELETE FROM orders WHERE user_id = ?");
    $stmtOrders->bind_param("i", $userId);
    $stmtOrders->execute();
    
    $stmtUser = $connection->prepare("DELETE FROM users WHERE user_id = ?");
    $stmtUser->bind_param("i", $userId);
    $stmtUser->execute();


    if($stmtUser->execute()){
        session_unset();
        session_destroy();

        echo json_encode([
            "deleted" => true,
            "message" => "La cuenta ha sido eliminada!!"
        ]);
    }else{
        echo json_encode([
            "deleted" => false,
            "message" => "Error al eliminar la cuenta."
        ]);
    }
?>