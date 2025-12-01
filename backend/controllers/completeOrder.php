<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $user_id = $_SESSION['user']["id"] ?? null;
    $order_id = $_POST['order_id'] ?? null;
    $role = $_SESSION['user']["role"] ?? 'user';

    if(!$user_id || !$order_id){
        echo json_encode(['success' => false, 'message' => 'Información faltante']);
        exit;
    }

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }

    $stmt = $connection->prepare("UPDATE orders SET status='completada' WHERE order_id=? AND status='pendiente'");
    $stmt->bind_param("i", $order_id);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        echo json_encode(['success' => true, 'message' => 'Orden completada!']);
    }else{
        echo json_encode(['success' => false, 'message' => 'No se ha podido completar la orden']);
    }
?>