<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $role = $_SESSION['user']["role"] ?? 'user';

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }

    $category_id = $_POST["category_id"] ?? null;
    $name = $_POST["item_name"] ?? null;
    $price = $_POST["price"] ?? null;

    if(!$category_id || !$name || !$price){
        echo json_encode(["success" => false, "message" => "Información faltante"]);
        exit;
    }

    $stmt = $connection->prepare("
        INSERT INTO menu_items (category_id, item_name, price)
        VALUES (?, ?, ?)
    ");
    $stmt->bind_param("isd", $category_id, $name, $price);

    $executed = $stmt->execute();

    echo json_encode([
        "success" => $executed,
        "message" => $executed ? "Artículo agregado" : "Error al agregar"
    ]);    
?>