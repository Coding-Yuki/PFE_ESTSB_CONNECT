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
$name = $data['name'] ?? '';
$role = $data['role'] ?? 'student'; // Default to student

if (empty($email) || empty($password) || empty($name) || empty($role)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Please provide email, password, name, and role."]);
    exit;
}

try {
    // Check if user already exists
    $check_sql = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "Cet email existe déjà"]);
        $check_stmt->close();
        $conn->close();
        exit;
    }
    $check_stmt->close();

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user
    $insert_sql = "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("ssss", $email, $hashed_password, $name, $role);

    if ($insert_stmt->execute()) {
        $new_user_id = $conn->insert_id;

        // Fetch the newly created user to return
        $user_sql = "SELECT id, email, name, role, avatar, bio, followers, following FROM users WHERE id = ?";
        $user_stmt = $conn->prepare($user_sql);
        $user_stmt->bind_param("i", $new_user_id);
        $user_stmt->execute();
        $user_result = $user_stmt->get_result();
        $user = $user_result->fetch_assoc();
        $user_stmt->close();
        
        // As per the documentation, a JWT token should be returned here.
        // For now, we are just returning the user data.

        // Create JWT token for the newly created user
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

        http_response_code(201); // Created
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        throw new Exception("Failed to create user.");
    }

    $insert_stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

$conn->close();
?>
