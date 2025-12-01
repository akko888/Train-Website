<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    if(!isset($_SESSION['user']["id"]) || $_SESSION['user']["role"] !== "admin"){
        echo json_encode(["success" => false, "message" => "Usuario no autorizado."]);
        exit;
    }

    $stmt = $connection->prepare("SELECT user_id, username, email, role, created_at  FROM users");
    $stmt->execute();
    $stmt->bind_result($userId, $username, $email, $role, $created_at);

    $users = [];
    while($stmt->fetch()){
       $users[] = [
            'user_id' => $userId,
            'username' => $username,
            'email' => $email,
            'role' => $role,
            'created_at' => $created_at
        ]; 
    }

    $stmt->close();

    echo json_encode(["success" => true, "users" => $users]);
?>