<?php
    session_start(); 
    
    header("Content-Type: application/json");

    if(!isset($_SESSION['user'])){
        echo json_encode([
            "deleted" => false,
            "message" => "No active session."
        ]);
        exit;
    }

    $userId = $_SESSION['user']["id"];

    require_once __DIR__ . '/../config/config.php';

    $stmt = $connection->prepare("DELETE FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $userId);

    if($stmt->execute()){
        session_unset();
        session_destroy();

        echo json_encode([
            "deleted" => true,
            "message" => "Account deleted succesfully!!"
        ]);
    }else{
        echo json_encode([
            "deleted" => false,
            "message" => "Error deleting account."
        ]);
    }
?>