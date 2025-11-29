<?php
    require_once __DIR__ . '/../config/config.php';

    header("Content-Type: application/json");

    session_start();

    if(!isset($_SESSION["user"]["id"])){
        echo json_encode(["updated" => false, "message" => "Not authenticated."]); 
        exit;
    }

    $updated = false;

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $username = trim($_POST["newUsername"]);
        $email = trim($_POST["newEmail"]);
        $userId = $_SESSION["user"]["id"];

        if(!$username || !$email){
            echo json_encode(["updated" => false, "message" => "Missing fields."]);
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo json_encode([
            "updated" => false,
            "message" => "Invalid email format."
        ]);
        exit;
        }

        $stmt = $connection->prepare("UPDATE users SET username=?, email=? WHERE user_id=?");
        $stmt-> bind_param("ssi", $username, $email, $userId);
        $updated = $stmt->execute();
        $stmt->close();

        if($updated){
            $_SESSION['user']["username"] = $username;
            $_SESSION['user']["email"] = $email;
        }
    }

    echo json_encode([
        "updated" => $updated,
        "message" => $updated ? "Account updated successfully!" : "Failed to update." 
    ]);
?>