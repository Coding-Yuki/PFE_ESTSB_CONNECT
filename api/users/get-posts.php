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
        $post_id = $row['id'];
        
        // Fetch Liked By user IDs
        $likes_sql = "SELECT user_id FROM likes WHERE post_id = ?";
        $likes_stmt = $conn->prepare($likes_sql);
        $likes_stmt->bind_param("i", $post_id);
        $likes_stmt->execute();
        $likes_result = $likes_stmt->get_result();
        $likedBy = [];
        while($like_row = $likes_result->fetch_assoc()) {
            $likedBy[] = $like_row['user_id'];
        }
        $likes_stmt->close();

        // Fetch Comments with their authors
        $comments_sql = "
            SELECT c.id, c.content, c.created_at, u.id AS author_id, u.name AS author_name, u.avatar AS author_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC";
        $comments_stmt = $conn->prepare($comments_sql);
        $comments_stmt->bind_param("i", $post_id);
        $comments_stmt->execute();
        $comments_result = $comments_stmt->get_result();
        $comments = [];
        while($comment_row = $comments_result->fetch_assoc()) {
            $comments[] = [
                'id' => $comment_row['id'],
                'author' => [
                    'id' => $comment_row['author_id'],
                    'name' => $comment_row['author_name'],
                    'avatar' => $comment_row['author_avatar']
                ],
                'content' => $comment_row['content'],
                'createdAt' => $comment_row['created_at']
            ];
        }
        $comments_stmt->close();
        
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
            'likes' => (int)$row['likes'],
            'likedBy' => $likedBy,
            'comments' => $comments,
            'createdAt' => $row['created_at']
        ];
    }
}

echo json_encode(['success' => true, 'posts' => $posts]);

$stmt->close();
?>
