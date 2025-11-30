<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $user_id = $_SESSION['user']["id"] ?? null;
    $order_id = $_POST['order_id'] ?? null;
    $role = $_SESSION['user']["role"] ?? 'user';

    if(!$user_id || !$order_id){
        echo json_encode(['success' => false, 'message' => 'Missing parameters']);
        exit;
    }

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $stmt = $connection->prepare("UPDATE orders SET status='completed' WHERE order_id=? AND status='pending'");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        echo json_encode(['success' => true, 'message' => 'Order marked as completed']);
    }else{
        echo json_encode(['success' => false, 'message' => 'Cannot complete this order']);
    }
?>