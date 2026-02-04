<?php
// Set headers for CORS and JSON content type
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once '../config/db.php';

try {
    // Main query to get all posts, ordered by newest first
    $posts_sql = "SELECT p.id, p.user_id, p.content, p.image, p.likes, p.created_at FROM posts p ORDER BY p.created_at DESC";
    $posts_result = $conn->query($posts_sql);

    $posts = [];

    if ($posts_result->num_rows > 0) {
        while($post_row = $posts_result->fetch_assoc()) {
            $post_id = $post_row['id'];
            $user_id = $post_row['user_id'];

            // 1. Fetch Author details
            $author_sql = "SELECT id, name, avatar, role FROM users WHERE id = ?";
            $author_stmt = $conn->prepare($author_sql);
            $author_stmt->bind_param("i", $user_id);
            $author_stmt->execute();
            $author_result = $author_stmt->get_result();
            $author = $author_result->fetch_assoc();
            $author_stmt->close();

            // 2. Fetch Liked By user IDs
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

            // 3. Fetch Comments with their authors
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

            // Assemble the final post structure
            $posts[] = [
                'id' => $post_row['id'],
                'author' => $author,
                'content' => $post_row['content'],
                'image' => $post_row['image'],
                'likes' => (int)$post_row['likes'],
                'likedBy' => $likedBy,
                'comments' => $comments,
                'createdAt' => $post_row['created_at']
            ];
        }
    }

    // Final JSON output
    echo json_encode(["success" => true, "posts" => $posts]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

$conn->close();
?>
