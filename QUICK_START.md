# EST Connect - Quick Start Guide

Get the EST Connect application running in 5 minutes!

---

## Step 1: Start Services (2 minutes)

### Windows (XAMPP)
1. Open XAMPP Control Panel
2. Click **Start** next to Apache
3. Click **Start** next to MySQL

### Mac (MAMP)
1. Open MAMP
2. Click **Start Servers**

### Linux
```bash
sudo systemctl start apache2
sudo systemctl start mysql
```

---

## Step 2: Setup Database (1 minute)

### Option A: phpMyAdmin (Easiest)
1. Open http://localhost/phpmyadmin/
2. Click **New**
3. Type `est_connect` → Click **Create**
4. Select `est_connect` → Go to **SQL** tab
5. Copy entire content from `scripts/setup-database.sql`
6. Paste and click **Go**

### Option B: Command Line
```bash
mysql -u root -p est_connect < scripts/setup-database.sql
```
(Just press Enter if no password)

---

## Step 3: Place Project Files (1 minute)

**Windows:**
```
Copy entire folder to: C:\xampp\htdocs\est-connect\
```

**Mac:**
```
Copy entire folder to: /Applications/MAMP/htdocs/est-connect/
```

**Linux:**
```bash
sudo cp -r . /var/www/html/est-connect/
```

---

## Step 4: Start Frontend (1 minute)

```bash
cd /path/to/est-connect
pnpm install   # First time only
pnpm dev
```

---

## Step 5: Login & Test

Open http://localhost:3000 and login with sample account:

**Email:** `ahmed@est.ma`  
**Password:** `password123`

---

## That's It!

You now have a fully working social network app!

### What's Working
- ✅ Login/Register
- ✅ Create posts
- ✅ Like/comment on posts
- ✅ Follow users
- ✅ Search users
- ✅ User profiles

---

## Troubleshooting

### "Cannot connect to database"
- Ensure MySQL is running
- Check http://localhost/phpmyadmin/ is accessible
- Verify `est_connect` database exists

### "API returns 404"
- Verify project is in correct folder
- Ensure Apache is running
- Check http://localhost/est-connect/api/users/get-all.php

### "Port 3000 in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

---

## Next Steps

1. ✅ You're running! Create a few posts, follow users, add comments
2. 📖 Read `SETUP_GUIDE.md` for detailed configuration
3. 🧪 Read `TESTING_GUIDE.md` to test all features systematically
4. 📋 Read `IMPLEMENTATION_STATUS.md` to see what's implemented

---

## Sample Users

Three sample users are pre-created for testing:

| Email | Password | Role |
|-------|----------|------|
| ahmed@est.ma | password123 | Student |
| fatima@est.ma | password123 | Student |
| prof@est.ma | password123 | Teacher |

---

## Common Tasks

### Create a New User
1. Click "Don't have an account?" on login page
2. Fill in email, password, name, and role
3. Click register
4. Login with new credentials

### Create a Post
1. Click the text box at top of feed
2. Type your message
3. Click "Post"
4. See it appear at top of feed

### Like a Post
1. Hover over any post
2. Click the heart icon
3. See the like count increase

### Follow a User
1. Go to search page
2. Search for a user
3. Click on their profile
4. Click "Follow" button
5. See follower count increase

### View Your Profile
1. Click your name or avatar in navbar
2. See all your posts
3. See your follower/following counts

---

## Performance Tips

- Database was optimized with proper indexes
- All API calls use prepared statements
- Frontend caches data in context
- Images load asynchronously

---

## Security Notes

- All passwords are hashed with bcrypt
- All database queries use prepared statements
- CORS is enabled for localhost:3000
- Session stored in localStorage (consider JWT for production)

---

## Need Help?

1. Check browser console (F12) for errors
2. Check Network tab for API failures
3. Verify database in phpMyAdmin
4. Read the full guides:
   - `SETUP_GUIDE.md` - Complete setup
   - `TESTING_GUIDE.md` - Testing procedures
   - `IMPLEMENTATION_STATUS.md` - Project overview

---

**Enjoy building with EST Connect!**
