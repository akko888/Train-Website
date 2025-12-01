<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $userId = $_SESSION['user']["id"] ?? null;
    $orderId = $_POST['order_id'] ?? null;

    if(!$userId || !$orderId){
        echo json_encode(["success" => false, "message" => "Información faltante"]);
        exit;
    }   

    $stmt = $connection->prepare("
        UPDATE orders SET status='cancelada' 
        WHERE order_id=? AND user_id=? AND status='pendiente'
    ");
    $stmt->bind_param("ii", $orderId, $userId);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        echo json_encode(["success" => true, "message" => "Orden cancelada"]);
    }else{
        echo json_encode(["success" => true, "message" => "No puedes cancelar esta orden"]);
    }
    $stmt->close();
?>