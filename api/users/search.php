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

$query = $_GET['query'] ?? '';
$role = $_GET['role'] ?? '';

if (empty($query)) {
    die(json_encode(['success' => false, 'message' => 'Query is required']));
}

$sql = "SELECT id, name, avatar, role, bio, followers FROM users WHERE name LIKE ?";
$params = ["%$query%"];

if (!empty($role)) {
    $sql .= " AND role = ?";
    $params[] = $role;
}

$stmt = $conn->prepare($sql);
$types = str_repeat('s', count($params));
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode(['success' => true, 'users' => $users]);

$stmt->close();
?>