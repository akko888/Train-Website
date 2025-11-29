<?php
    require_once __DIR__ . "/../config/config.php";

    session_start();

    header("Content-Type: application/json");

    if(!isset($_SESSION['user']["id"])){
        echo json_encode(["success" => false, "message" => "User not authenticated."]);
        exit;
    }

    $userId = $_SESSION['user']["id"];

    $stmt = $connection->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $userId);
    $stmt-> execute();
    $ordersResult = $stmt->get_result();

    $orders = [];

    while($order = $ordersResult->fetch_assoc()){

        $stmtItems = $connection->prepare("
            SELECT oi.quantity, oi.unit_price, mi.item_name
            FROM order_items oi
            JOIN menu_items mi ON oi.item_id = mi.item_id
            WHERE oi.order_id = ?;
        ");
        $stmtItems->bind_param("i", $order["order_id"]);
        $stmtItems->execute();
        $itemsResult = $stmtItems->get_result();

        $items = [];
        while($item = $itemsResult->fetch_assoc()){
            $items[] = $item;
        }

        $order["items"] = $items;
        $orders[] = $order;
    }

    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);
?>