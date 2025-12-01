<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

    require_once __DIR__ . '/../config/config.php';

    header("Content-Type: application/json");

    $menus = [];

    $stmt = $connection->prepare("
        SELECT category_id, category_name, base_price 
        FROM menu_categories 
        ORDER BY category_id
    ");

    $stmt->execute();
    $categories = $stmt->get_result();

    while($cat = $categories->fetch_assoc()){
        $key = strtolower($cat["category_name"]);

        $menus[$key] = [
            "title" => $cat["category_name"],
            "price" => $cat["base_price"],
            "img" => "Imgs/" . $key . "Menu.png",
            "items" => []
        ];

        $stmtItems = $connection->prepare("SELECT item_name FROM menu_items WHERE category_id=? ORDER BY item_id");

        $stmtItems->bind_param("i", $cat["category_id"]);
        $stmtItems->execute();
        $itemsResult = $stmtItems->get_result();

        while($item = $itemsResult->fetch_assoc()){
            $menus[$key]["items"][] = $item["item_name"];
        }
    }

    echo json_encode($menus);
?>  