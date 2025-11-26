<?php
    require_once __DIR__ . '/../config/config.php'; 
    
    header("Content-Type: application/json");

    $response = [
        "success" => false,
        "errors" => [],
        "message" => ""
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
            $response["success"] = true;
            $response["message"] = "User registered correctly, going back to home...";
        }else{
            $response["errors"][] = "Error in the data base: " . $stmt->error;        
        }

        echo json_encode($response);
    }
?>