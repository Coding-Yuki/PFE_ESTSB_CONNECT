# EST Connect - Complete Setup Guide

This guide walks you through setting up the EST Connect social network application for local development.

## Prerequisites

- **XAMPP, WAMP, or MAMP** (Apache + MySQL + PHP)
- **Node.js and pnpm** (for frontend)
- **Git** (optional, for version control)

---

## Step 1: Local Server Setup

### On Windows (XAMPP):
1. Download and install [XAMPP](https://www.apachefriends.org/)
2. Install to a folder (e.g., `C:\xampp`)
3. Launch **XAMPP Control Panel**
4. Click **Start** for both Apache and MySQL

### On Mac (MAMP):
1. Download and install [MAMP](https://www.mamp.info/)
2. Launch **MAMP**
3. Click **Start Servers**

### On Linux:
```bash
sudo apt-get install apache2 mysql-server php php-mysql
sudo systemctl start apache2
sudo systemctl start mysql
```

---

## Step 2: Project Setup

### Clone the Repository
```bash
# Clone the project
git clone https://github.com/Coding-Yuki/PFE_ESTSB_CONNECT.git
cd PFE_ESTSB_CONNECT
```

### Place Files in Web Root

**Windows (XAMPP):**
- Copy the entire project folder to `C:\xampp\htdocs\est-connect`

**Mac (MAMP):**
- Copy the entire project folder to `/Applications/MAMP/htdocs/est-connect`

**Linux:**
- Copy to `/var/www/html/est-connect`

---

## Step 3: Database Setup

### 1. Create the Database

**Using phpMyAdmin (Easiest):**
1. Open `http://localhost/phpmyadmin/`
2. Click **New** in the left sidebar
3. Enter database name: `est_connect`
4. Click **Create**
5. Select the `est_connect` database
6. Click the **SQL** tab
7. Copy and paste the entire content from `/scripts/setup-database.sql`
8. Click **Go** to execute

**Using Command Line:**
```bash
mysql -u root -p < scripts/setup-database.sql
```
(Press Enter when prompted for password if you have no password)

### 2. Verify Database Setup

1. In phpMyAdmin, select `est_connect` database
2. You should see these tables:
   - users
   - posts
   - comments
   - likes
   - follows

---

## Step 4: Frontend Setup

### Install Dependencies
```bash
cd /path/to/est-connect
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

The frontend will start at `http://localhost:3000`

---

## Step 5: Configuration

### Update API URL (if needed)

The frontend is configured to call APIs at:
```
http://localhost/est-connect/api
```

If your setup is different, update:
- `/lib/auth-context.tsx` - Change `API_URL`
- `/lib/data-context.tsx` - Change `API_URL`

### Database Configuration

Update `/api/config/db.php` if needed:

```php
<?php
$servername = "localhost";
$username = "root";           // Your MySQL username
$password = "";               // Your MySQL password
$dbname = "est_connect";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed"]));
}

$conn->set_charset("utf8");
?>
```

---

## Step 6: Testing the Application

### Test with Sample Data

The database setup script includes sample users:

**Email:** `ahmed@est.ma`  
**Password:** `password123`  
**Role:** Student

**Email:** `fatima@est.ma`  
**Password:** `password123`  
**Role:** Student

**Email:** `prof@est.ma`  
**Password:** `password123`  
**Role:** Teacher

### Manual Testing Checklist

#### Authentication
- [ ] Register a new account
- [ ] Login with credentials
- [ ] Logout functionality works
- [ ] Cannot access feed without login

#### Posts
- [ ] Create a new post
- [ ] Posts appear in feed
- [ ] Like/unlike posts
- [ ] Like count updates correctly

#### Comments
- [ ] Add comment to a post
- [ ] Comments display correctly
- [ ] Comment author info is correct

#### Users
- [ ] View user profile
- [ ] Follow/unfollow user
- [ ] Search for users
- [ ] User list displays correctly

---

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

### Cannot Connect to Database
1. Verify MySQL is running
2. Check database credentials in `/api/config/db.php`
3. Verify database `est_connect` exists
4. Check phpMyAdmin at `http://localhost/phpmyadmin/`

### CORS Errors
- All PHP files already have CORS headers enabled
- If still getting errors, check browser console for details

### API Calls Failing (404 errors)
1. Verify project is in correct folder:
   - XAMPP: `C:\xampp\htdocs\est-connect`
   - MAMP: `/Applications/MAMP/htdocs/est-connect`
2. Check that Apache is running
3. Test API directly: `http://localhost/est-connect/api/users/get-all.php`

### Password Verification Issues
Sample passwords are hashed with bcrypt. The plain password is `password123` for all sample accounts.

---

## Project Structure

```
est-connect/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (main)/            # Main app pages (feed, profile, search)
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and contexts
│   ├── auth-context.tsx   # Authentication logic
│   ├── data-context.tsx   # Data fetching logic
│   └── utils.ts          # Utilities
├── api/                   # PHP backend
│   ├── auth/             # Authentication endpoints
│   ├── posts/            # Post endpoints
│   ├── comments/         # Comment endpoints
│   ├── users/            # User endpoints
│   └── config/           # Database config
├── public/               # Static assets
├── scripts/              # Database setup scripts
└── package.json          # Dependencies
```

---

## Production Deployment

For production, consider:
1. Use environment variables for sensitive config
2. Implement JWT authentication
3. Add input validation and sanitization
4. Use prepared statements (already implemented)
5. Add rate limiting
6. Use HTTPS
7. Migrate to a proper hosting provider

---

## Next Steps

1. Complete the setup above
2. Test all features using the checklist
3. Deploy to production when ready
4. Monitor API logs for errors
5. Optimize database queries if needed

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review API logs in browser console
3. Check phpMyAdmin for database state
4. Verify all files are in correct locations
