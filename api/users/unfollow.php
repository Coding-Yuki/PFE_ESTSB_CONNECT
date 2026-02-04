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

$data = json_decode(file_get_contents("php://input"), true);
$follower_id = $data['follower_id'] ?? '';
$following_id = $data['following_id'] ?? '';

if (empty($follower_id) || empty($following_id)) {
    die(json_encode(['success' => false, 'message' => 'Follower and Following IDs are required']));
}

$conn->begin_transaction();

try {
    // Delete from follows table
    $sql1 = "DELETE FROM follows WHERE follower_id = ? AND following_id = ?";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("ii", $follower_id, $following_id);
    $stmt1->execute();

    if ($stmt1->affected_rows > 0) {
        // Decrement following count for follower
        $sql2 = "UPDATE users SET following = GREATEST(0, following - 1) WHERE id = ?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("i", $follower_id);
        $stmt2->execute();

        // Decrement followers count for the one being unfollowed
        $sql3 = "UPDATE users SET followers = GREATEST(0, followers - 1) WHERE id = ?";
        $stmt3 = $conn->prepare($sql3);
        $stmt3->bind_param("i", $following_id);
        $stmt3->execute();
    }

    $conn->commit();

    // Get updated follower count
    $sql4 = "SELECT followers FROM users WHERE id = ?";
    $stmt4 = $conn->prepare($sql4);
    $stmt4->bind_param("i", $following_id);
    $stmt4->execute();
    $result4 = $stmt4->get_result();
    $followers = $result4->fetch_assoc()['followers'];

    echo json_encode(['success' => true, 'isFollowing' => false, 'followers' => $followers]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Failed to unfollow user']);
}

?>