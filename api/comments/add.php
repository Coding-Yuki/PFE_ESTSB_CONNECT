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

$post_id = $data['post_id'] ?? null;
$user_id = $data['user_id'] ?? null;
$content = $data['content'] ?? '';

if (empty($post_id) || empty($user_id) || empty($content)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Post ID, User ID, and content are required."]);
    exit;
}

try {
    // Insert the new comment
    $insert_sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("iis", $post_id, $user_id, $content);

    if ($insert_stmt->execute()) {
        $new_comment_id = $conn->insert_id;
        $insert_stmt->close();

        // The API contract requires returning the new comment object,
        // including the author's details.

        $comment_sql = "
            SELECT c.id, c.content, c.created_at, u.id AS author_id, u.name AS author_name, u.avatar AS author_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?";
        
        $comment_stmt = $conn->prepare($comment_sql);
        $comment_stmt->bind_param("i", $new_comment_id);
        $comment_stmt->execute();
        $result = $comment_stmt->get_result();
        $comment_row = $result->fetch_assoc();
        $comment_stmt->close();

        $response_comment = [
            'id' => $comment_row['id'],
            'author' => [
                'id' => $comment_row['author_id'],
                'name' => $comment_row['author_name'],
                'avatar' => $comment_row['author_avatar']
            ],
            'content' => $comment_row['content'],
            'createdAt' => $comment_row['created_at']
        ];
        
        http_response_code(201); // Created
        echo json_encode(["success" => true, "comment" => $response_comment]);

    } else {
        throw new Exception("Failed to add comment.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

$conn->close();
?>
