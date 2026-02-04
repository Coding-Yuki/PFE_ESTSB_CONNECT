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

$user_id = $data['user_id'] ?? null;
$content = $data['content'] ?? '';
$image = $data['image'] ?? null; // Optional image

if (empty($user_id) || empty($content)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID and content are required."]);
    exit;
}

try {
    // Insert the new post
    $insert_sql = "INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_sql);
    $insert_stmt->bind_param("iss", $user_id, $content, $image);

    if ($insert_stmt->execute()) {
        $new_post_id = $conn->insert_id;
        $insert_stmt->close();

        // The API contract requires returning the full new post object,
        // including author details.
        
        // 1. Fetch the post we just created
        $post_sql = "SELECT * FROM posts WHERE id = ?";
        $post_stmt = $conn->prepare($post_sql);
        $post_stmt->bind_param("i", $new_post_id);
        $post_stmt->execute();
        $post_result = $post_stmt->get_result();
        $post = $post_result->fetch_assoc();
        $post_stmt->close();
        
        // 2. Fetch the author details
        $author_sql = "SELECT id, name, avatar, role FROM users WHERE id = ?";
        $author_stmt = $conn->prepare($author_sql);
        $author_stmt->bind_param("i", $user_id);
        $author_stmt->execute();
        $author_result = $author_stmt->get_result();
        $author = $author_result->fetch_assoc();
        $author_stmt->close();

        // 3. Assemble the final post object for the response
        $response_post = [
            'id' => $post['id'],
            'author' => $author,
            'content' => $post['content'],
            'image' => $post['image'],
            'likes' => 0,
            'likedBy' => [], // New post has no likes
            'comments' => [], // New post has no comments
            'createdAt' => $post['created_at']
        ];
        
        http_response_code(201); // Created
        echo json_encode(["success" => true, "post" => $response_post]);

    } else {
        throw new Exception("Failed to create post.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "An error occurred: " . $e->getMessage()]);
}

$conn->close();
?>
