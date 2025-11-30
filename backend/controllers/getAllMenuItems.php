<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    $role = $_SESSION['user']["role"] ?? 'user';

    if($role !== 'admin'){
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }

    $sql = "
        SELECT 
            mi.item_id,
            mi.item_name,
            mi.price,
            mi.category_id,
            mc.category_name
        FROM menu_items mi
        INNER JOIN menu_categories mc ON mi.category_id = mc.category_id
        ORDER BY mc.category_id, mi.item_id
    ";

    $result = $connection->query($sql);
    $items = [];

    while($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    echo json_encode([
        "success" => true,
        "items" => $items
    ]);
?>