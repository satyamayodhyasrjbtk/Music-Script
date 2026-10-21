# DjSongsHub.In All In One - Complete PHP 8.3 / 8.4 / 8.5 Suite

Official Production Website Script for https://djsongshub.in

## Requirements
- PHP 8.3, 8.4, or 8.5
- MySQL 5.7+ or MariaDB 10.3+
- Apache with `mod_rewrite` enabled (or Nginx with rewrite rules)
- PDO MySQL extension enabled
- fileinfo and mbstring extensions enabled

## Installation Steps (cPanel / Shared Hosting / VPS)

1. **Extract ZIP Files:**
   Upload all files from this folder directly into your website root (`public_html`).

2. **Database Import:**
   - Go to phpMyAdmin on your hosting.
   - Create a database (e.g. `djsongshub_db`).
   - Import the `database/schema.sql` file. It will create all tables (`categories`, `songs`, `site_panels`, `admin_users`, etc.) and seed data.

3. **Configure Database Connection:**
   - Open `config/db.php`.
   - Update your database credentials:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'your_database_name');
     define('DB_USER', 'your_database_user');
     define('DB_PASS', 'your_database_password');
     ```

4. **Verify Category Links:**
   - Category URLs will work cleanly with friendly rewrite:
     - `https://djsongshub.in/category/navratri-bhakti-special-dj-songs`
     - Or direct query: `https://djsongshub.in/category.php?slug=navratri-bhakti-special-dj-songs`
   - Safe prepared statements prevent SQL injection.
   - If a category is not found, a clean 404 response is returned with alternative categories.

5. **Admin Access:**
   - URL: `https://djsongshub.in/admin/login.php`
   - Default Username: `admin`
   - Default Password: `admin123`
   *(Important: Change password after first login!)*

6. **Permissions:**
   - Make sure `uploads/` and `logs/` folders have write permissions (chmod 755 or 775).
