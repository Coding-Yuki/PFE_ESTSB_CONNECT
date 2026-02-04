<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "est_connect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

// Set UTF-8
$conn->set_charset("utf8");
?>