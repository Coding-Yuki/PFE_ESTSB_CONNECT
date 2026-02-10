<?php
// GET /api/comments/get.php?post_id=X
// Returns JSON list of comments with commenter info (username, avatar)

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Validate input
$post_id = isset($_GET['post_id']) ? $_GET['post_id'] : null;
if ($post_id === null || !is_numeric($post_id)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid post_id']);
    exit;
}

// Database connection - using PDO for secure prepared statements
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('DB_NAME') ?: 'est_connect';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';
$dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $sql = "SELECT c.id, c.post_id, c.user_id, c.content, c.created_at,
                   u.id AS user_id, u.name AS username, u.avatar
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.post_id = :post_id
            ORDER BY c.created_at ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':post_id', (int)$post_id, PDO::PARAM_INT);
    $stmt->execute();
    $comments = $stmt->fetchAll();

    // Normalize results (ensure consistent keys/format)
    $out = array_map(function ($c) {
        return [
            'id' => (string)$c['id'],
            'post_id' => (string)$c['post_id'],
            'user_id' => isset($c['user_id']) ? (string)$c['user_id'] : null,
            'username' => isset($c['username']) ? $c['username'] : null,
            'avatar' => isset($c['avatar']) ? $c['avatar'] : null,
            'content' => $c['content'],
            'created_at' => $c['created_at'],
        ];
    }, $comments);

    echo json_encode(['success' => true, 'comments' => $out]);
} catch (PDOException $e) {
    http_response_code(500);
    // Do not leak DB errors in production
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

?>
