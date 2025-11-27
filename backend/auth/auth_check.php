<?php
    session_start();

    header("Content-Type: application/json");

    if(!isset($_SESSION['user'])){
        echo json_encode([
            "authenticated" => false,
            "message" => "No active session."
        ]);
        exit;
    }

    echo json_encode([
        "authenticated" => true,
        "user" => $_SESSION['user']
    ]);
?>