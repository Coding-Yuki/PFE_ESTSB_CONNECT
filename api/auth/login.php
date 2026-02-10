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
require_once '../config/jwt.php';

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

        // Create JWT token for the authenticated user
        $token = create_jwt(["sub" => $user['id'], "email" => $user['email'], "role" => $user['role']]);

        // Set httpOnly cookie for the JWT. Use SameSite=None for cross-site scenarios;
        // Secure flag is set only when HTTPS is detected.
        $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
        if (PHP_VERSION_ID >= 70300) {
            setcookie('est_connect_token', $token, [
                'expires' => time() + 60 * 60 * 24 * 7,
                'path' => '/',
                'httponly' => true,
                'samesite' => 'None',
                'secure' => $secure,
            ]);
        } else {
            // Fallback header for older PHP versions
            $cookie = "est_connect_token={$token}; Path=/; HttpOnly" . ($secure ? "; Secure" : "") . "; SameSite=None";
            header("Set-Cookie: $cookie", false);
        }

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
