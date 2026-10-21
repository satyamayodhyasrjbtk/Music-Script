import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { getPhpProjectFiles } from '../src/utils/phpCodeGenerator';

console.log('Generating PHP Suite Files and ZIP package...');

const outputDir = path.resolve(process.cwd(), 'djsongshub_php_project');
const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Write all PHP Project Files
const phpFiles = getPhpProjectFiles();
console.log(`Found ${phpFiles.length} PHP project files.`);

for (const file of phpFiles) {
  const fullPath = path.join(outputDir, file.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, file.content, 'utf-8');
  console.log(`✓ Written: ${file.path}`);
}

// Ensure folders exist
const requiredDirs = ['uploads/audio', 'uploads/artwork', 'logs', 'assets/css', 'assets/js'];
for (const d of requiredDirs) {
  const dirPath = path.join(outputDir, d);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, '.gitkeep'), '', 'utf-8');
}

// Add README.md for cPanel / Hosting Deployment
const readmeContent = `# DjSongsHub.In All In One - Complete PHP 8.3 / 8.4 / 8.5 Suite

Official Production Website Script for https://djsongshub.in

## Requirements
- PHP 8.3, 8.4, or 8.5
- MySQL 5.7+ or MariaDB 10.3+
- Apache with \`mod_rewrite\` enabled (or Nginx with rewrite rules)
- PDO MySQL extension enabled
- fileinfo and mbstring extensions enabled

## Installation Steps (cPanel / Shared Hosting / VPS)

1. **Extract ZIP Files:**
   Upload all files from this folder directly into your website root (\`public_html\`).

2. **Database Import:**
   - Go to phpMyAdmin on your hosting.
   - Create a database (e.g. \`djsongshub_db\`).
   - Import the \`database/schema.sql\` file. It will create all tables (\`categories\`, \`songs\`, \`site_panels\`, \`admin_users\`, etc.) and seed data.

3. **Configure Database Connection:**
   - Open \`config/db.php\`.
   - Update your database credentials:
     \`\`\`php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'your_database_name');
     define('DB_USER', 'your_database_user');
     define('DB_PASS', 'your_database_password');
     \`\`\`

4. **Verify Category Links:**
   - Category URLs will work cleanly with friendly rewrite:
     - \`https://djsongshub.in/category/navratri-bhakti-special-dj-songs\`
     - Or direct query: \`https://djsongshub.in/category.php?slug=navratri-bhakti-special-dj-songs\`
   - Safe prepared statements prevent SQL injection.
   - If a category is not found, a clean 404 response is returned with alternative categories.

5. **Admin Access:**
   - URL: \`https://djsongshub.in/admin/login.php\`
   - Default Username: \`admin\`
   - Default Password: \`admin123\`
   *(Important: Change password after first login!)*

6. **Permissions:**
   - Make sure \`uploads/\` and \`logs/\` folders have write permissions (chmod 755 or 775).
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf-8');

// 2. Package using Python zipfile
console.log('Packaging into ZIP files via python3 zipfile...');

const pyScript = `
import os, zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, path)
            ziph.write(full_path, rel_path)

# 1. PHP Production Suite ZIP
php_suite_dir = "${outputDir}"
php_zip_path = "${path.join(publicDir, 'djsongshub_php8_suite.zip')}"
root_php_zip = "${path.resolve(process.cwd(), 'djsongshub_php8_suite.zip')}"

with zipfile.ZipFile(php_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipdir(php_suite_dir, zipf)

with zipfile.ZipFile(root_php_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipdir(php_suite_dir, zipf)

print(f"Created PHP Suite ZIP: {php_zip_path} ({os.path.getsize(php_zip_path)} bytes)")

# 2. Complete Project Source ZIP (React + PHP)
all_zip_path = "${path.join(publicDir, 'djsongshub_all_in_one_full_project.zip')}"
root_all_zip = "${path.resolve(process.cwd(), 'djsongshub_all_in_one_full_project.zip')}"

exclude_dirs = {'.git', 'node_modules', '.next', 'dist', '.cache'}
with zipfile.ZipFile(all_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("${process.cwd()}"):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, "${process.cwd()}")
            zipf.write(full_path, rel_path)

with zipfile.ZipFile(root_all_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("${process.cwd()}"):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, "${process.cwd()}")
            zipf.write(full_path, rel_path)

print(f"Created Full Project ZIP: {all_zip_path} ({os.path.getsize(all_zip_path)} bytes)")
`;

const pyPath = path.resolve(process.cwd(), 'temp_zip_script.py');
fs.writeFileSync(pyPath, pyScript, 'utf-8');

execSync(`python3 "${pyPath}"`, { stdio: 'inherit' });
fs.unlinkSync(pyPath);

console.log('ZIP Generation Complete!');
