<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide both email and password."]);
    exit;
}

try {
    // Find user by email
    $sql = "SELECT id, email, password, name, role, avatar, bio, followers, following FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
        $stmt->close();
        $conn->close();
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (password_verify($password, $user['password'])) {
        // Password is correct
        
        // Remove password from user object before sending
        unset($user['password']);

        // As per the documentation, a JWT token should be returned here.
        // For now, we are just returning the user data.

        http_response_code(200); // OK
        echo json_encode(["success" => true, "user" => $user]);

    } else {
        // Incorrect password
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Email ou mot de passe incorrect"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

$conn->close();
?>
