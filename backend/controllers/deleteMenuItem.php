<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $role = $_SESSION['user']["role"] ?? 'user';

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $id = $_POST["item_id"] ?? null;

    if(!$id){
        echo json_encode(["success" => false, "message" => "Missing item ID"]);
        exit;
    }

    $stmt = $connection->prepare("DELETE FROM menu_items WHERE item_id=?");
    $stmt->bind_param("i", $id);

    echo json_encode([
        "success" => $stmt->execute(),
        "message" => $stmt->execute() ? "Item deleted" : "Error deleting"
    ]);   
?>