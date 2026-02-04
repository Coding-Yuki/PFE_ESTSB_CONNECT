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

if (empty($post_id) || empty($user_id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Post ID and User ID are required."]);
    exit;
}

$conn->begin_transaction();

try {
    // 1. Delete from the likes table
    $delete_like_sql = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
    $delete_stmt = $conn->prepare($delete_like_sql);
    $delete_stmt->bind_param("ii", $post_id, $user_id);
    $delete_stmt->execute();
    
    // Check if a row was actually deleted. If not, the user hadn't liked the post.
    $was_liked = $delete_stmt->affected_rows > 0;
    $delete_stmt->close();

    if ($was_liked) {
        // 2. Update the likes count on the posts table only if a like was removed
        $update_post_sql = "UPDATE posts SET likes = likes - 1 WHERE id = ? AND likes > 0";
        $update_stmt = $conn->prepare($update_post_sql);
        $update_stmt->bind_param("i", $post_id);
        $update_stmt->execute();
        $update_stmt->close();
    }

    // 3. Get the new total likes count regardless
    $select_likes_sql = "SELECT likes FROM posts WHERE id = ?";
    $select_stmt = $conn->prepare($select_likes_sql);
    $select_stmt->bind_param("i", $post_id);
    $select_stmt->execute();
    $result = $select_stmt->get_result();
    $new_likes_count = $result->fetch_assoc()['likes'];
    $select_stmt->close();
    
    // If all succeed, commit the transaction
    $conn->commit();

    http_response_code(200);
    echo json_encode(["success" => true, "isLiked" => false, "likes" => (int)$new_likes_count]);

} catch (Exception $e) {
    // If any step fails, roll back
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred while processing the unlike."]);
}

$conn->close();
?>
