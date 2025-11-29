<?php
    require_once __DIR__ . '/../config/config.php';

    session_start();

    header("Content-Type: application/json");

    if(!isset($_SESSION['user']["id"])){
        echo json_encode([
            "success" => false,
            "message" => "User not authenticated"
        ]);
        exit;
    }

    $userId = $_SESSION['user']["id"];

    $data = json_decode(file_get_contents("php://input"), true);

    if(!$data){
        echo json_encode([
            "success" => false,
            "message" => "Invalid order"
        ]);
        exit;
    }

    $orderName = $data['orderName'] ?? null;
    $direction = $data['direction'] ?? null;
    $typeOrder = $data['typeOrder'] ?? null;
    $pay = $data['pay'] ?? null;
    $total = $data['total'] ?? null;
    $cardNumber = $data['cardNumber'] ?? null;
    $cardExpiration = $data['cardExpiration'] ?? null;
    $items = $data['items'] ?? [];

    if(!$orderName || !$direction || !$typeOrder || !$pay || empty($items)){
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $stmt = $connection->prepare("
        INSERT INTO orders 
        (user_id, order_name, order_direction, order_type, payment_method, card_number, card_expiration, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "issssssd", 
        $userId, $orderName, $direction, $typeOrder, $pay, $cardNumber, $cardExpiration, $total
    );

    if(!$stmt->execute()){
        echo json_encode([
            "success" => false,
            "message" => "Order insert failed: " . $stmt->error 
        ]);
        exit; 
    }

    $orderId = $stmt->insert_id;
    $stmt->close();

    $itemStmt = $connection->prepare("
        INSERT INTO order_items (order_id, item_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
    ");

    foreach($items as $item){
        $name = $item['name'];
        $qty = $item['qty'];
        $price = $item['price'];

        $find = $connection->prepare("SELECT item_id FROM menu_items WHERE item_name = ?");
        $find->bind_param("s", $name);
        $find->execute();
        $result = $find->get_result();

        if($result-> num_rows === 0){
            echo json_encode([
                "success" => false,
                "message" => "Item not found: $name"
            ]);
            exit;
        }

        $row = $result->fetch_assoc();
        $itemId = $row['item_id'];
        $find->close();

        $itemStmt->bind_param("iiid", $orderId, $itemId, $qty, $price);
        if(!$itemStmt->execute()){
            echo json_encode([
                "success" => false,
                "message" => "Item insert failed: " . $itemStmt->error
            ]);
            exit;
        }
    }

    $itemStmt->close();

    echo json_encode([
        "success" => true,
        "order_id" => $orderId
    ]);
?>