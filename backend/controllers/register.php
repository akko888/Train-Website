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

        if(empty($username)) $response["errors"][] = "User name is obligatory.";
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) $response["errors"][] = "Email is not valid.";
        if($password !== $confirm) $response["errors"][] = "Passwords do not match.";

        if($role === "admin"){
            $adminkey = trim($_POST['adminkey'] ?? '');
            if($adminkey !== ADMIN_KEY){
                $response["errors"][] = "Invalid admin key. Cannot register as admin.";
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
            $response["message"] = "User registered correctly, Redirecting...";
            $response["user"] = $_SESSION['user'];;
        }else{
            $response["errors"][] = "Error in the data base: " . $stmt->error;        
        }

        $stmt->close();
        echo json_encode($response);
    }
?>