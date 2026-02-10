<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Clear cookie by setting expiration in the past
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
if (PHP_VERSION_ID >= 70300) {
    setcookie('est_connect_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'None',
        'secure' => $secure,
    ]);
} else {
    $cookie = "est_connect_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly" . ($secure ? "; Secure" : "") . "; SameSite=None";
    header("Set-Cookie: $cookie", false);
}

echo json_encode(['success' => true]);

?>
