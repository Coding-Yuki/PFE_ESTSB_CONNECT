<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$user_id = $_GET['user_id'] ?? '';

if (empty($user_id)) {
    die(json_encode(['success' => false, 'message' => 'User ID is required']));
}

$sql = "SELECT p.*, u.name as author_name, u.avatar as author_avatar, u.role as author_role 
        FROM posts p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.user_id = ? 
        ORDER BY p.created_at DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$posts = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // You would also fetch comments and likes for each post here
        $posts[] = [
            'id' => $row['id'],
            'author' => [
                'id' => $row['user_id'],
                'name' => $row['author_name'],
                'avatar' => $row['author_avatar'],
                'role' => $row['author_role']
            ],
            'content' => $row['content'],
            'image' => $row['image'],
            'likes' => $row['likes'],
            'likedBy' => [], // Needs a separate query
            'comments' => [], // Needs a separate query
            'createdAt' => $row['created_at']
        ];
    }
}

echo json_encode(['success' => true, 'posts' => $posts]);

$stmt->close();
?>