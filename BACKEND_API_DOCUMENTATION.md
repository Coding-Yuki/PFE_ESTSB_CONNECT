# EST Connect - Backend API Documentation

## Setup Instructions

### 1. Database Setup (phpMyAdmin)

Create these tables in your MySQL database:

```sql
-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255),
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Likes Table (track who liked what)
CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Followers Table
CREATE TABLE follows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_follow (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## API Endpoints

### Authentication

#### 1. Login
**Endpoint:** `POST /api/auth/login.php`

**Request:**
```json
{
  "email": "user@est.ma",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@est.ma",
    "name": "Ahmed Bennani",
    "role": "student",
    "avatar": "https://...",
    "bio": "...",
    "followers": 10,
    "following": 5
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

---

#### 2. Register
**Endpoint:** `POST /api/auth/register.php`

**Request:**
```json
{
  "email": "newuser@est.ma",
  "password": "password123",
  "name": "Fatima Alami",
  "role": "student"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "2",
    "email": "newuser@est.ma",
    "name": "Fatima Alami",
    "role": "student",
    "avatar": "https://...",
    "bio": "Nouvel utilisateur",
    "followers": 0,
    "following": 0
  },
  "token": "jwt_token_here"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Cet email existe déjà"
}
```

---

### Posts

#### 3. Get All Posts
**Endpoint:** `GET /api/posts/get-all.php`

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "1",
      "author": {
        "id": "1",
        "name": "Ahmed Bennani",
        "avatar": "https://...",
        "role": "student"
      },
      "content": "Ceci est un post",
      "image": "https://...",
      "likes": 5,
      "likedBy": ["2", "3"],
      "comments": [
        {
          "id": "1",
          "author": {
            "id": "2",
            "name": "Fatima Alami",
            "avatar": "https://..."
          },
          "content": "Super post!",
          "createdAt": "2024-01-15T10:30:00"
        }
      ],
      "createdAt": "2024-01-15T09:00:00"
    }
  ]
}
```

---

#### 4. Create Post
**Endpoint:** `POST /api/posts/create.php`

**Request:**
```json
{
  "user_id": "1",
  "content": "Mon nouveau post",
  "image": null
}
```

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "10",
    "author": {
      "id": "1",
      "name": "Ahmed Bennani",
      "avatar": "https://...",
      "role": "student"
    },
    "content": "Mon nouveau post",
    "image": null,
    "likes": 0,
    "likedBy": [],
    "comments": [],
    "createdAt": "2024-01-15T11:00:00"
  }
}
```

---

#### 5. Like Post
**Endpoint:** `POST /api/posts/like.php`

**Request:**
```json
{
  "post_id": "1",
  "user_id": "2"
}
```

**Response:**
```json
{
  "success": true,
  "isLiked": true,
  "likes": 6
}
```

---

#### 6. Unlike Post
**Endpoint:** `POST /api/posts/unlike.php`

**Request:**
```json
{
  "post_id": "1",
  "user_id": "2"
}
```

**Response:**
```json
{
  "success": true,
  "isLiked": false,
  "likes": 5
}
```

---

### Comments

#### 7. Add Comment
**Endpoint:** `POST /api/comments/add.php`

**Request:**
```json
{
  "post_id": "1",
  "user_id": "2",
  "content": "Excellent post!"
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "id": "5",
    "author": {
      "id": "2",
      "name": "Fatima Alami",
      "avatar": "https://..."
    },
    "content": "Excellent post!",
    "createdAt": "2024-01-15T11:05:00"
  }
}
```

---

### Users

#### 8. Get User Profile
**Endpoint:** `GET /api/users/get-profile.php?user_id=1`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "ahmed@est.ma",
    "name": "Ahmed Bennani",
    "role": "student",
    "avatar": "https://...",
    "bio": "Étudiant en génie informatique",
    "followers": 25,
    "following": 15
  }
}
```

---

#### 9. Get User Posts
**Endpoint:** `GET /api/users/get-posts.php?user_id=1`

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "1",
      "author": {...},
      "content": "...",
      "image": "...",
      "likes": 5,
      "likedBy": ["2", "3"],
      "comments": [],
      "createdAt": "2024-01-15T09:00:00"
    }
  ]
}
```

---

#### 10. Search Users
**Endpoint:** `GET /api/users/search.php?query=Ahmed&role=student`

**Query Parameters:**
- `query` (required): Search term
- `role` (optional): Filter by 'student', 'teacher', or leave empty for all

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "name": "Ahmed Bennani",
      "avatar": "https://...",
      "role": "student",
      "bio": "Étudiant en génie informatique",
      "followers": 25
    }
  ]
}
```

---

#### 11. Follow User
**Endpoint:** `POST /api/users/follow.php`

**Request:**
```json
{
  "follower_id": "2",
  "following_id": "1"
}
```

**Response:**
```json
{
  "success": true,
  "isFollowing": true,
  "followers": 26
}
```

---

#### 12. Unfollow User
**Endpoint:** `POST /api/users/unfollow.php`

**Request:**
```json
{
  "follower_id": "2",
  "following_id": "1"
}
```

**Response:**
```json
{
  "success": true,
  "isFollowing": false,
  "followers": 25
}
```

---

#### 13. Get All Users
**Endpoint:** `GET /api/users/get-all.php`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "name": "Ahmed Bennani",
      "avatar": "https://...",
      "role": "student",
      "bio": "...",
      "followers": 25,
      "following": 15
    }
  ]
}
```

---

## PHP Example Structure

Here's a basic structure for your PHP files:

### `/api/config/db.php`
```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "est_connect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

// Set UTF-8
$conn->set_charset("utf8");
?>
```

### `/api/auth/login.php`
```php
<?php
header('Content-Type: application/json');
require_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Your login logic here
// Hash password with password_verify()
// Return user data if success
?>
```

---

## Important Notes

1. **Always use `password_hash()`** when storing passwords
2. **Always use `password_verify()`** when checking passwords
3. **Use prepared statements** to prevent SQL injection
4. **Return JSON** from all endpoints
5. **Set proper headers:** `header('Content-Type: application/json');`
6. **Handle CORS** if frontend is on different port (which it will be locally)

---

## CORS Setup (Important for Local Development)

Add this to the top of each PHP file or in a middleware:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
```

---

## Testing with Postman

Test each endpoint with Postman before integrating with frontend:
1. GET /api/users/get-all.php → Should return empty array initially
2. POST /api/auth/register.php → Create first user
3. POST /api/auth/login.php → Test login
4. POST /api/posts/create.php → Create a post
5. GET /api/posts/get-all.php → Should return your post

---

## Environment Setup (XAMPP)

1. Place your project in `C:\xampp\htdocs\est-connect\`
2. Start Apache and MySQL from XAMPP Control Panel
3. Go to `http://localhost/phpmyadmin/` to create database
4. Create database named `est_connect`
5. Run the SQL table creation queries above
6. Frontend will call APIs at `http://localhost/est-connect/api/...`
```

Maintenant je vais refactoriser les contextes pour utiliser les APIs :
