# EST Connect - TODO List

This file outlines the necessary steps to complete the EST Connect web application.

## 1. Setup Local Development Environment

- [ ] **Install XAMPP/WAMP/MAMP or Docker:** Set up a local server environment that supports Apache, MySQL, and PHP.
- [ ] **Start Services:** Ensure Apache and MySQL services are running.
- [ ] **Create Database:**
  - [ ] Open phpMyAdmin (`http://localhost/phpmyadmin`).
  - [ ] Create a new database named `est_connect`.
- [ ] **Create Database Tables:**
  - [ ] Go to the `est_connect` database.
  - [ ] Open the "SQL" tab.
  - [ ] Copy and execute the `CREATE TABLE` queries from `BACKEND_API_DOCUMENTATION.md` to create the `users`, `posts`, `comments`, `likes`, and `follows` tables.

## 2. Complete and Refine the Backend API

- [ ] **Implement All API Endpoint Logic:** Open each file in the `/api` directory and implement the server-side logic as described in the documentation.
  - [ ] `api/auth/register.php`: Complete user registration logic with password hashing (`password_hash`).
  - [ ] `api/posts/create.php`: Implement post creation.
  - [ ] `api/posts/like.php`: Implement post liking.
  - [ ] `api/posts/unlike.php`: Implement post unliking.
  - [ ] `api/comments/add.php`: Implement comment creation.
  - [ ] `api/users/follow.php`: Implement user following.
  - [ ] `api/users/unfollow.php`: Implement user unfollowing.
  - [ ] `api/users/get-profile.php`: Complete fetching a single user's profile.
  - [ ] `api/users/get-posts.php`: Complete fetching all posts for a specific user.
  - [ ] `api/users/search.php`: Implement user search functionality.
- [ ] **Implement JWT Authentication (Optional, but Recommended):**
  - [ ] Modify `login.php` and `register.php` to generate a JWT token upon successful authentication.
  - [ ] For all private endpoints (creating posts, liking, following, etc.), add logic to verify the JWT token from the request headers.
- [ ] **Optimize Database Queries:**
  - [ ] Refactor `api/posts/get-all.php` to use a single, more efficient `JOIN` query to fetch posts along with their related author and comment data. This will prevent the "N+1" query problem.

## 3. Full-Stack Integration and Testing

- [ ] **Run the Frontend:**
  - [ ] Open a terminal in the project root.
  - [ ] Run `pnpm install` (if you haven't already).
  - [ ] Run `pnpm dev` to start the Next.js development server.
- [ ] **Run the Backend:**
  - [ ] Make sure your PHP server (XAMPP, etc.) is running and the `api` folder is accessible.
- [ ] **Test All Features Thoroughly:**
  - [ ] **Authentication:**
    - [ ] Can you register a new account?
    - [ ] Can you log in and log out?
    - [ ] Does the app prevent you from accessing protected pages (like the feed) when logged out?
  - [ ] **Feed:**
    - [ ] Does the feed display posts from different users?
    - [ ] Can you create a new post?
    - [ ] Can you like and unlike a post? Does the like count update?
    - [ ] Can you add a comment to a post?
  - [ ] **User Profile:**
    - [ ] Can you view another user's profile?
    - [ ] Does the profile page show the correct user information and their posts?
    - [ ] Can you follow and unfollow a user?
  - [ ] **Search:**
    - [ ] Does the search page return relevant users?

## 4. Final Polish

- [ ] **Error Handling:** Ensure both the frontend and backend handle errors gracefully (e.g., show a notification if a network request fails).
- [ ] **Code Cleanup:** Remove any console logs or commented-out code.
- [ ] **Build for Production:**
  - [ ] Run `pnpm build` to create a production-ready build of the Next.js application.
  - [ ] Run `pnpm start` to test the production build locally.
