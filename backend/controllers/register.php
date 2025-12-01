<?php
    require_once __DIR__ . '/../config/config.php'; 
    session_start();

    header("Content-Type: application/json");

    $response = [
        "success" => false,
        "errors" => [],
        "message" => "",
        "user" => []
    ];

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $password = $_POST['password'];
        $confirm = $_POST['confirmPassword'];
        $role = $_POST['role'];

        if(empty($username)) $response["errors"][] = "El nombre de usario es obligatorio.";
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) $response["errors"][] = "Email no válido.";
        if($password !== $confirm) $response["errors"][] = "Las contraseñas no coinciden.";

        if($role === "admin"){
            $adminkey = trim($_POST['adminkey'] ?? '');
            if($adminkey !== ADMIN_KEY){
                $response["errors"][] = "Llave incorrecta. No se puede registrar como admin.";
            }
        }

        if(!empty($response["errors"])){
            echo json_encode($response);
            exit;
        }

        $hashed = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $connection->prepare("
            INSERT INTO users (username, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        ");
        $stmt -> bind_param("ssss", $username, $email, $hashed, $role);

        if($stmt->execute()){

            $_SESSION['user'] = [
                "id" => $connection->insert_id,
                "username" => $username,
                "email" => $email,
                "role" => $role
            ];

            $response["success"] = true;
            $response["message"] = "Usuario registrado correctamente, Redirigiendo...";
            $response["user"] = $_SESSION['user'];;
        }else{
            $response["errors"][] = "Error en la base de datos: " . $stmt->error;        
        }

        $stmt->close();
        echo json_encode($response);
    }
?>