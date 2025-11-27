<?php
    require_once __DIR__ . '/../config/config.php';

    session_start();

    header("Content-Type: application/json"); 

    $response = [
        "success" => false,
        "errors" => [],
        "message" => ""
    ];

    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        $email = trim($_POST['email']);
        $password = $_POST['password'];

        if(empty($email)) $response["errors"][] = "Email is required.";
        if(empty($password)) $response["errors"][] = "Password is required";

        if(!empty($response["errors"])){
            echo json_encode($response);
            exit; 
        }

        $stmt = $connection->prepare("
            SELECT user_id, username, email, password_hash, role
            FROM users
            WHERE email = ?
        ");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows === 0){
            $response["errors"][] = "Invalid email or password.";
            echo json_encode($response);
            exit;
        }

        $user = $result->fetch_assoc();

        if(password_verify($password, $user['password_hash'])){

            $_SESSION['user'] = [
                "id" => $user['user_id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "role" => $user['role']
            ];

            $response["success"] = true;
            $response["message"] = "Login successful! Redirecting...";
            $response["user"] = $_SESSION['user'];
        }else{
            $response["errors"][] = "Invalid email or password.";
        }

        $stmt->close();
        echo json_encode($response);
    }
?>