<?php
header('Content-Type: application/json');
require_once '../config/db.php';
require_once '../config/jwt.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verify JWT token from cookie
$token = $_COOKIE['est_connect_token'] ?? null;
if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$payload = verify_jwt($token);
if (!$payload) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$follower_id = $data['follower_id'] ?? '';
$following_id = $data['following_id'] ?? '';

if (empty($follower_id) || empty($following_id)) {
    die(json_encode(['success' => false, 'message' => 'Follower and Following IDs are required']));
}

// Check if already following
$sql = "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $follower_id, $following_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    die(json_encode(['success' => false, 'message' => 'Already following']));
}

$conn->begin_transaction();

try {
    // Insert into follows table
    $sql1 = "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("ii", $follower_id, $following_id);
    $stmt1->execute();

    // Increment following count for follower
    $sql2 = "UPDATE users SET following = following + 1 WHERE id = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $follower_id);
    $stmt2->execute();

    // Increment followers count for the one being followed
    $sql3 = "UPDATE users SET followers = followers + 1 WHERE id = ?";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $following_id);
    $stmt3->execute();

    $conn->commit();

    // Get updated follower count
    $sql4 = "SELECT followers FROM users WHERE id = ?";
    $stmt4 = $conn->prepare($sql4);
    $stmt4->bind_param("i", $following_id);
    $stmt4->execute();
    $result4 = $stmt4->get_result();
    $followers = $result4->fetch_assoc()['followers'];


    echo json_encode(['success' => true, 'isFollowing' => true, 'followers' => $followers]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Failed to follow user']);
}

$stmt->close();
?>