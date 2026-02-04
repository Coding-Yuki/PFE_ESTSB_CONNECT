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

// Check if already liked to prevent re-liking and simply return current state
$check_sql = "SELECT id FROM likes WHERE post_id = ? AND user_id = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("ii", $post_id, $user_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
if ($check_result->num_rows > 0) {
    // User has already liked this post. Get the current like count and return.
    $likes_count_sql = "SELECT likes FROM posts WHERE id = ?";
    $likes_count_stmt = $conn->prepare($likes_count_sql);
    $likes_count_stmt->bind_param("i", $post_id);
    $likes_count_stmt->execute();
    $likes_count_result = $likes_count_stmt->get_result()->fetch_assoc();
    $likes_count_stmt->close();

    echo json_encode(["success" => true, "isLiked" => true, "likes" => (int)$likes_count_result['likes']]);
    $check_stmt->close();
    $conn->close();
    exit;
}
$check_stmt->close();


$conn->begin_transaction();

try {
    // 1. Insert into the likes table
    $insert_like_sql = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
    $insert_stmt = $conn->prepare($insert_like_sql);
    $insert_stmt->bind_param("ii", $post_id, $user_id);
    $insert_stmt->execute();
    $insert_stmt->close();

    // 2. Update the likes count on the posts table
    $update_post_sql = "UPDATE posts SET likes = likes - 1 WHERE id = ? AND likes > 0";
    $update_stmt = $conn->prepare($update_post_sql);
    $update_stmt->bind_param("i", $post_id);
    $update_stmt->execute();
    $update_stmt->close();

    // 3. Get the new total likes count
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
    echo json_encode(["success" => true, "isLiked" => true, "likes" => (int)$new_likes_count]);

} catch (Exception $e) {
    // If any step fails, roll back
    $conn->rollback();
    http_response_code(500);
    // Use a generic message for security
    echo json_encode(["success" => false, "message" => "An error occurred while processing the like."]);
}

$conn->close();
?>
