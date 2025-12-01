<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $role = $_SESSION['user']["role"] ?? 'usuario';

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit;
    }

    $id = $_POST["item_id"] ?? null;

    if(!$id){
        echo json_encode(["success" => false, "message" => "No se encuentra el ID del artículo"]);
        exit;
    }

    $stmt = $connection->prepare("DELETE FROM menu_items WHERE item_id=?");
    $stmt->bind_param("i", $id);

    echo json_encode([
        "success" => $stmt->execute(),
        "message" => $stmt->execute() ? "Artículo eliminado" : "Error al eliminar"
    ]);   
?>