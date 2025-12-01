<?php
    require_once __DIR__ . '/../config/config.php';

    header("Content-Type: application/json");

    session_start(); 

    if(!isset($_SESSION["user"]["id"])){
        echo json_encode(["changed" => false, "message" => "No autorizado"]); 
        exit;
    }

    $ok = false;

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $current = $_POST["currentPassword"];
        $new = $_POST["newPassword"];
        $repeat = $_POST["repeatPassword"];
        $userId = $_SESSION["user"]["id"];

        if(!$current || !$new || !$repeat){
            echo json_encode(["changed" => false, "message" => "Información faltante"]);
            exit;
        }

        if($new !== $repeat){
            echo json_encode(["changed" => false, "message" => "Las contraseñas no coinciden"]);
            exit;
        }

        $stmt = $connection->prepare("SELECT password_hash FROM users WHERE user_id=?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows === 0){
            echo json_encode(["changed" => false, "message" => "No se encontró el usuario"]);
            exit;
        }

        $user = $result->fetch_assoc();
        $stmt->close();

        if(!password_verify($current, $user["password_hash"])){
            echo json_encode(["changed" => false, "message" => "Tu contraseña no es correcta"]);
            exit;
        }

        $newHash = password_hash($new, PASSWORD_DEFAULT);

        $stmt = $connection->prepare("UPDATE users SET password_hash=? WHERE user_id=?");
        $stmt->bind_param("si", $newHash, $userId);
        $ok = $stmt->execute();
        $stmt->close();
    }

    echo json_encode([
        "changed" => $ok,
        "message" => $ok ? "La contraseña ha sido cambiada!" : "Error al actualizar la contraseña."
    ]);
?>