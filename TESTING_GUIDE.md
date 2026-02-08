# EST Connect - Testing Guide

This guide provides comprehensive testing procedures for the EST Connect application.

---

## Prerequisites for Testing

1. **Database Setup Complete** - Run `/scripts/setup-database.sql`
2. **Backend Running** - Apache + PHP accessible at `http://localhost/est-connect/api`
3. **Frontend Running** - Next.js dev server at `http://localhost:3000`
4. **Postman or cURL** - For API testing (optional but recommended)

---

## Testing the Backend API with Postman

### 1. Test Database Connection

**Endpoint:** `GET http://localhost/est-connect/api/users/get-all.php`

Expected Response (empty or with sample users):
```json
{
  "success": true,
  "users": []
}
```

---

### 2. Test User Registration

**Endpoint:** `POST http://localhost/est-connect/api/auth/register.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "test@est.ma",
  "password": "test123456",
  "name": "Test User",
  "role": "student"
}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "4",
    "email": "test@est.ma",
    "name": "Test User",
    "role": "student",
    "avatar": null,
    "bio": null,
    "followers": 0,
    "following": 0
  }
}
```

---

### 3. Test User Login

**Endpoint:** `POST http://localhost/est-connect/api/auth/login.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "ahmed@est.ma",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "ahmed@est.ma",
    "name": "Ahmed Bennani",
    "role": "student",
    "avatar": null,
    "bio": "Étudiant en génie informatique",
    "followers": 10,
    "following": 5
  }
}
```

**Test with Wrong Password:**
```json
{
  "success": false,
  "message": "Email ou mot de passe incorrect"
}
```

---

### 4. Test Create Post

**Endpoint:** `POST http://localhost/est-connect/api/posts/create.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "1",
  "content": "This is my first post!",
  "image": null
}
```

**Expected Response:**
```json
{
  "success": true,
  "post": {
    "id": "1",
    "author": {
      "id": "1",
      "name": "Ahmed Bennani",
      "avatar": null,
      "role": "student"
    },
    "content": "This is my first post!",
    "image": null,
    "likes": 0,
    "likedBy": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

---

### 5. Test Get All Posts

**Endpoint:** `GET http://localhost/est-connect/api/posts/get-all.php`

**Expected Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "1",
      "author": {...},
      "content": "...",
      "image": null,
      "likes": 0,
      "likedBy": [],
      "comments": [],
      "createdAt": "2024-01-15T10:30:00"
    }
  ]
}
```

---

### 6. Test Like Post

**Endpoint:** `POST http://localhost/est-connect/api/posts/like.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "post_id": "1",
  "user_id": "2"
}
```

**Expected Response:**
```json
{
  "success": true,
  "isLiked": true,
  "likes": 1
}
```

---

### 7. Test Unlike Post

**Endpoint:** `POST http://localhost/est-connect/api/posts/unlike.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "post_id": "1",
  "user_id": "2"
}
```

**Expected Response:**
```json
{
  "success": true,
  "isLiked": false,
  "likes": 0
}
```

---

### 8. Test Add Comment

**Endpoint:** `POST http://localhost/est-connect/api/comments/add.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "post_id": "1",
  "user_id": "2",
  "content": "Nice post!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "comment": {
    "id": "1",
    "author": {
      "id": "2",
      "name": "Fatima Alami",
      "avatar": null
    },
    "content": "Nice post!",
    "createdAt": "2024-01-15T10:35:00"
  }
}
```

---

### 9. Test Get User Profile

**Endpoint:** `GET http://localhost/est-connect/api/users/get-profile.php?user_id=1`

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "Ahmed Bennani",
    "email": "ahmed@est.ma",
    "role": "student",
    "avatar": null,
    "bio": "Étudiant en génie informatique",
    "followers": 10,
    "following": 5
  }
}
```

---

### 10. Test Search Users

**Endpoint:** `GET http://localhost/est-connect/api/users/search.php?query=Ahmed&role=student`

**Expected Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "name": "Ahmed Bennani",
      "avatar": null,
      "role": "student",
      "bio": "Étudiant en génie informatique",
      "followers": 10
    }
  ]
}
```

---

### 11. Test Follow User

**Endpoint:** `POST http://localhost/est-connect/api/users/follow.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "follower_id": "2",
  "following_id": "1"
}
```

**Expected Response:**
```json
{
  "success": true,
  "isFollowing": true,
  "followers": 11
}
```

---

### 12. Test Unfollow User

**Endpoint:** `POST http://localhost/est-connect/api/users/unfollow.php`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "follower_id": "2",
  "following_id": "1"
}
```

**Expected Response:**
```json
{
  "success": true,
  "isFollowing": false,
  "followers": 10
}
```

---

## Frontend Testing Checklist

### Authentication Tests

- [ ] **Register New Account**
  - Go to `/register`
  - Fill form with valid data
  - Click register
  - Verify redirect to login page
  - Verify user data in database

- [ ] **Login**
  - Go to `/login`
  - Enter credentials
  - Click login
  - Verify redirect to feed
  - Verify user is logged in (navbar shows user info)

- [ ] **Login Validation**
  - Enter wrong password
  - Verify error message appears
  - Try non-existent email
  - Verify error message appears

- [ ] **Logout**
  - Click logout button
  - Verify redirect to login
  - Verify user data cleared

### Feed Tests

- [ ] **Load Feed**
  - Logged in user sees posts from all users
  - Posts display in reverse chronological order
  - Post contains: author, content, likes, comments

- [ ] **Create Post**
  - Click create post button
  - Enter content
  - Click submit
  - Post appears at top of feed
  - Post count increases

- [ ] **Like Post**
  - Click like button
  - Like count increases
  - Button highlights (showing liked state)
  - Unlike post
  - Like count decreases

- [ ] **Comment on Post**
  - Click add comment
  - Enter comment text
  - Submit
  - Comment appears on post
  - Comment count increases

### User Profile Tests

- [ ] **View Own Profile**
  - Click own avatar/name
  - Profile page loads with own data
  - Shows own posts
  - Shows correct follower/following counts

- [ ] **View Other User Profile**
  - Search for a user
  - Click on user
  - Profile page loads
  - Shows user's posts
  - Shows follow button (if not following)

- [ ] **Follow/Unfollow**
  - Click follow button
  - Follower count increases on their profile
  - Following count increases on your profile
  - Click unfollow
  - Counts decrease

### Search Tests

- [ ] **Search Users**
  - Go to search page
  - Enter search query
  - Results appear
  - Click on result
  - Goes to user profile

- [ ] **Filter by Role**
  - Search with role filter
  - Results filtered correctly
  - Shows only students or teachers

---

## Error Testing

### Test Invalid Data

- [ ] **Empty Fields**
  - Try register with empty email
  - Verify error message
  - Try create post with empty content
  - Verify error message

- [ ] **Invalid Email Format**
  - Try register with invalid email
  - Verify validation error

- [ ] **Duplicate Email**
  - Register with email that already exists
  - Verify error: "Email already exists"

- [ ] **Database Connection**
  - Stop MySQL temporarily
  - Try to load feed
  - Verify error message displayed

---

## Performance Testing

### Load Time

- [ ] **Initial Page Load**
  - Measure time from typing URL to content visible
  - Should be < 2 seconds

- [ ] **Feed Load**
  - Measure time to load 10+ posts
  - Should be < 1 second

- [ ] **Image Load**
  - If testing with images, verify they load quickly
  - No broken images

### API Response Times

- [ ] **Get All Posts** - Should respond in < 500ms
- [ ] **Create Post** - Should respond in < 500ms
- [ ] **Get User Profile** - Should respond in < 300ms
- [ ] **Search Users** - Should respond in < 300ms

---

## Security Testing

- [ ] **CORS Headers**
  - Verify API responds to requests from localhost:3000
  - Check browser console for CORS errors

- [ ] **SQL Injection Prevention**
  - Try SQL injection in login: `admin' --`
  - Verify it doesn't work

- [ ] **Password Storage**
  - Verify passwords are hashed in database
  - Should not be plain text

- [ ] **Session Management**
  - Logout clears user data
  - Cannot access protected pages without login
  - Token/session expires properly

---

## Browser Testing

Test in multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Test on multiple devices:
- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

---

## Debugging Tips

### Check Browser Console
Press `F12` and look for:
- JavaScript errors
- Network errors
- CORS issues

### Check Network Tab
Look at API requests:
- Response status (200, 404, 500)
- Response body (error messages)
- Request headers

### Check Database
Use phpMyAdmin to:
- Verify tables created
- Check if data inserted correctly
- Look for orphaned records

### Enable Debug Logging
Add to PHP files:
```php
error_log("Debug message here");
```

Check PHP error log:
- Windows: `C:\xampp\apache\logs\error.log`
- Mac: `/Applications/MAMP/logs/apache_error.log`

---

## Test Execution Checklist

- [ ] Database created and seeded
- [ ] All tables verified in phpMyAdmin
- [ ] PHP server running and accessible
- [ ] Frontend server running
- [ ] All API endpoints tested with Postman
- [ ] All frontend features tested manually
- [ ] No console errors
- [ ] No network errors
- [ ] Performance acceptable
- [ ] Security features working

---

## Known Issues & Solutions

### Common Issues

**Issue:** API returns 404
**Solution:** Verify project path and that API folder structure is correct

**Issue:** Database connection fails
**Solution:** Check MySQL is running and credentials in `/api/config/db.php`

**Issue:** CORS errors
**Solution:** Already handled in PHP files, check browser console for details

**Issue:** Passwords don't work
**Solution:** Sample password is `password123`, ensure correct hashing

---

## Next Steps After Testing

1. Fix any bugs found
2. Optimize performance bottlenecks
3. Add additional features if needed
4. Deploy to production when satisfied
5. Monitor production for errors
