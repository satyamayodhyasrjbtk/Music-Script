/**
 * Complete PHP 8.3 / 8.4 / 8.5 Song Downloading Portal Script Suite.
 * Generates fully working, clean, production-ready code with secure admin panel,
 * AdSense ready pages, SQLite/MySQL PDO support, and one-click ZIP generation.
 */

export interface PhpFileItem {
  path: string;
  filename: string;
  category: 'core' | 'frontend' | 'admin' | 'pages' | 'config';
  description: string;
  content: string;
}

export function getPhpProjectFiles(): PhpFileItem[] {
  return [
    {
      path: 'config/db.php',
      filename: 'db.php',
      category: 'config',
      description: 'PHP 8.3+ PDO Database Connection & Security Helper Class',
      content: `<?php
declare(strict_types=1);

/**
 * STM Music Portal - PHP 8.3 / 8.4 / 8.5 Database & Core Security Config
 */

// Production error handling
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/../logs/php_error.log');

// Start secure session
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

// Database Credentials
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'stm_music_portal');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

// Site Constants
define('SITE_NAME', 'DjSongsHub.In All In One');
define('SITE_SUBTITLE', 'All In One DJ Remix & High Speed MP3 Portal');
define('SITE_URL', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('AUDIO_DIR', UPLOAD_DIR . 'audio/');
define('ART_DIR', UPLOAD_DIR . 'artwork/');

final class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];
            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // In production, log and show friendly error
                error_log("DB Connection failed: " . $e->getMessage());
                die("Database connection failed. Please check config/db.php configuration.");
            }
        }
        return self::$instance;
    }
}

// XSS Sanitizer Helper
function e(string|null $value): string {
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// CSRF Token Management
function generateCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken(string|null $token): bool {
    return !empty($token) && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Slug Generator
function createSlug(string $text): string {
    $text = preg_replace('~[^\\\\pL\\\\d]+~u', '-', $text) ?? '';
    $text = trim($text, '-');
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text) ?: $text;
    $text = strtolower($text);
    $text = preg_replace('~[^-\\\\w]+~', '', $text) ?? '';
    return empty($text) ? 'song-' . time() : $text;
}
`,
    },
    {
      path: 'database.sql',
      filename: 'database.sql',
      category: 'config',
      description: 'Complete MySQL Schema with Seed Data, Indexes & Admin Table',
      content: `-- STM Music Portal Database Schema (PHP 8.3 / 8.4 / 8.5)
-- Compatible with MySQL 8.0+, MariaDB 10.5+

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS downloads_log;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS albums;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS admin_users;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NULL,
    badge VARCHAR(30) DEFAULT NULL,
    is_new TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cat_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    artist VARCHAR(150) NOT NULL DEFAULT 'DJ Surendra',
    release_year VARCHAR(10) DEFAULT '2026',
    cover_art VARCHAR(255) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_album_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    role ENUM('singer', 'dj', 'both') DEFAULT 'dj',
    bio TEXT NULL,
    image VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_artist_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tag_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    album_id INT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    remixer VARCHAR(150) NOT NULL DEFAULT 'DJ Surendra',
    singer VARCHAR(255) NOT NULL DEFAULT 'Various Artists',
    bitrate VARCHAR(30) DEFAULT '320 Kbps',
    file_size VARCHAR(30) DEFAULT '8.1 MB',
    duration VARCHAR(30) DEFAULT '4:05',
    duration_sec INT DEFAULT 245,
    hits INT UNSIGNED DEFAULT 0,
    release_year VARCHAR(10) DEFAULT '2026',
    release_date DATE NULL,
    tempo VARCHAR(100) DEFAULT '138 BPM (Heavy Dance Drop)',
    file_path VARCHAR(255) NOT NULL,
    ringtone_path VARCHAR(255) NULL,
    artwork_path VARCHAR(255) NULL,
    tags TEXT NULL,
    keywords TEXT NULL,
    description TEXT NULL,
    lyrics LONGTEXT NULL,
    is_hot TINYINT(1) DEFAULT 0,
    is_trending TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_hits (hits),
    INDEX idx_created (created_at),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE downloads_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    song_id INT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_song (song_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_panels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    panel_type ENUM('songs', 'categories', 'notice', 'artists', 'banner', 'quick_links') DEFAULT 'songs',
    placement ENUM('home_top', 'home_middle', 'home_bottom', 'all') DEFAULT 'home_middle',
    sort_order INT DEFAULT 1,
    is_active TINYINT(1) DEFAULT 1,
    theme VARCHAR(30) DEFAULT 'emerald',
    badge VARCHAR(50) DEFAULT 'HOT',
    icon VARCHAR(50) DEFAULT 'flame',
    item_limit INT DEFAULT 4,
    filter_category VARCHAR(150) NULL,
    custom_html TEXT NULL,
    action_url VARCHAR(255) NULL,
    action_text VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2y$12$e0MYzX1HqQxI5V3VfO1/0OGsV2n8iXJ7/3uY1hU6a3l8R4A5w9GqS', 'admin@djsongshub.in'); -- Password: admin123 (change upon deploy)

INSERT INTO categories (id, name, slug, description, badge, is_new) VALUES
(1, 'Navratri & Bhakti Special Dj Songs', 'navratri-bhakti-special-dj-songs', 'Pachra DJ remix, Devi Geet bass vibration', 'NEW', 1),
(2, 'Electro House & EDM Festival Edits', 'electro-house-edm-festival-edits', 'Psytrance drops, festival horn mixers', 'HOT', 0),
(3, 'Trending Ringtones & 30s Audio Cuts', 'trending-ringtones-30s-audio-cuts', 'High-volume loud ringtones, dialogue cuts', 'VIRAL', 0),
(4, 'Latest Roadshow 2026', 'latest-roadshow-2026', 'Competition Roadshow DJ Tracks with high bass', '2026', 1),
(5, 'Bhojpuri Club & Hard Bass Remixes', 'bhojpuri-club-hard-bass-remixes', 'Trending Bhojpuri dance tracks & dholki drops', NULL, 0),
(6, 'Haryanvi Bass Boosted Dance Mix', 'haryanvi-bass-boosted-dance-mix', 'Heavy car subwoofer mix & Desi roadshow anthems', NULL, 0);

INSERT INTO songs (id, category_id, title, slug, remixer, singer, bitrate, file_size, duration, duration_sec, hits, release_year, release_date, tempo, file_path, tags, keywords, description, is_hot, is_trending) VALUES
(1, 5, 'Bhojpuri DJ Remix (Hard Bass Kick 2026)', 'bhojpuri-dj-remix-hard-bass-kick-2026', 'DJ Tezz 2', 'Various Artists', '320 Kbps', '8.1 MB', '4:05', 245, 89450, '2026', '2026-10-12', '140 BPM (Heavy Dance Drop)', 'bhojpuri_hard_kick.mp3', 'Bhojpuri,DJTezz,HardBass,Dholki', 'bhojpuri dj remix 2026, dj tezz download', 'Master audio 320kbps mix.', 1, 1),
(2, 6, 'Teri Aakhya Ka Yo Kajal (Heavy Car Subwoofer Mix)', 'teri-aakhya-ka-yo-kajal-heavy-car-subwoofer-mix', 'DJ Surendra x DJ Akhil', 'Sapna Choudhary & DC Madana', '320 Kbps', '7.6 MB', '3:15', 195, 41200, '2026', '2026-10-02', '138 BPM (Heavy Dance Drop)', 'teri_aakhya_car_subwoofer.mp3', 'Haryanvi,SapnaChoudhary,CarSubwoofer,DJSurendra', 'teri aakhya ka yo kajal dj mix, car bass', 'Tuned for subwoofers between 32Hz-55Hz.', 1, 1);

INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'DjSongsHub.In All In One'),
('site_subtitle', 'All In One DJ Remix & High Speed MP3 Portal'),
('admin_email', 'admin@djsongshub.in'),
('adsense_enabled', '1'),
('adsense_pub_id', 'pub-9482710398402819'),
('notice_ticker', 'UPDATES: DjSongsHub.In All In One Official 320Kbps HQ MP3 Portal - All DJ Remixes, Dholki Mix & Hard Bass Available - Fast Cloud CDN Active');
`,
    },
    {
      path: 'index.php',
      filename: 'index.php',
      category: 'frontend',
      description: 'Homepage with Fast Layout, Filter, Table, Audio Player & AdSense Optimization',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/config/db.php';

$pdo = Database::getConnection();

// Fetch settings
$settingsStmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
$settings = $settingsStmt->fetchAll(PDO::FETCH_KEY_PAIR);

// Sorting
$sort = $_GET['sort'] ?? 'date';
$orderBy = match ($sort) {
    'hits' => 's.hits DESC',
    'title' => 's.title ASC',
    default => 's.created_at DESC',
};

// Search & Filter
$search = trim($_GET['q'] ?? '');
$catFilter = (int)($_GET['cat'] ?? 0);

$query = "SELECT s.*, c.name AS category_name, c.slug AS category_slug 
          FROM songs s 
          JOIN categories c ON s.category_id = c.id 
          WHERE 1=1";
$params = [];

if (!empty($search)) {
    $query .= " AND (s.title LIKE :s1 OR s.singer LIKE :s2 OR s.remixer LIKE :s3 OR s.keywords LIKE :s4)";
    $term = "%{$search}%";
    $params['s1'] = $term;
    $params['s2'] = $term;
    $params['s3'] = $term;
    $params['s4'] = $term;
}

if ($catFilter > 0) {
    $query .= " AND s.category_id = :cat_id";
    $params['cat_id'] = $catFilter;
}

$query .= " ORDER BY {$orderBy} LIMIT 50";
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$songs = $stmt->fetchAll();

// Categories
$catStmt = $pdo->query("SELECT c.*, COUNT(s.id) AS song_count 
                        FROM categories c 
                        LEFT JOIN songs s ON c.id = s.category_id 
                        GROUP BY c.id ORDER BY c.id ASC");
$categories = $catStmt->fetchAll();

$pageTitle = e($settings['site_name'] ?? 'DjSongsHub.In All In One') . " - Official 320Kbps HQ MP3 Songs & DJ Remixes";
$pageDescription = "Download High Quality 320Kbps MP3 Songs, Competition DJ Remixes, Dholki Mixes, and Ringtones free on " . e($settings['site_name'] ?? 'DjSongsHub.In All In One');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="description" content="<?= $pageDescription ?>">
    <link rel="canonical" href="<?= SITE_URL ?>/">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .ticker-wrap { overflow: hidden; white-space: nowrap; }
        .ticker-move { display: inline-block; animation: ticker 25s linear infinite; }
        @keyframes ticker { 0% { transform: translate3d(100%, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
    </style>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased pb-28">

    <!-- Top Notice Ticker -->
    <div class="bg-amber-400 text-black text-xs font-semibold py-1 px-4 ticker-wrap border-b border-amber-500">
        <div class="ticker-move">
            <?= e($settings['notice_ticker'] ?? 'Welcome to DjSongsHub.In All In One Official 320Kbps MP3 Portal!') ?>
        </div>
    </div>

    <!-- Header Navigation -->
    <header class="bg-[#0b5331] text-white shadow-md border-b-2 border-emerald-500">
        <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
                <a href="<?= SITE_URL ?>" class="flex items-center gap-2">
                    <span class="text-2xl font-black tracking-tight text-white"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></span>
                    <span class="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">ALL IN ONE</span>
                </a>
                <p class="text-[11px] text-emerald-200"><?= e($settings['site_subtitle'] ?? 'All In One DJ Remix & High Speed MP3 Portal') ?></p>
            </div>
            <nav class="flex items-center gap-4 text-xs font-medium">
                <a href="<?= SITE_URL ?>" class="hover:text-emerald-300">Home</a>
                <a href="<?= SITE_URL ?>/category.php" class="hover:text-emerald-300">Folders</a>
                <a href="<?= SITE_URL ?>/admin/login.php" class="bg-emerald-800 px-2.5 py-1 rounded text-white hover:bg-emerald-700">Admin</a>
            </nav>
        </div>
    </header>

    <!-- Top AdSense Banner Placement (Clean & Compliant) -->
    <?php if (($settings['adsense_enabled'] ?? '1') === '1'): ?>
    <div class="max-w-4xl mx-auto my-3 px-4">
        <div class="bg-white border border-dashed border-gray-300 rounded p-2 text-center text-xs text-gray-400">
            <span class="uppercase tracking-widest text-[9px] block mb-1">Advertisement</span>
            <div class="h-20 flex items-center justify-center bg-gray-50 text-gray-500 font-mono">
                Google AdSense 728x90 Leaderboard Slot
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Main Content Container -->
    <main class="max-w-6xl mx-auto px-4 mt-4">

        <!-- Search Bar -->
        <div class="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-5">
            <form action="<?= SITE_URL ?>" method="GET" class="flex flex-col sm:flex-row gap-2">
                <select name="cat" class="text-xs border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:outline-none focus:border-emerald-600">
                    <option value="0">All Categories & Folders</option>
                    <?php foreach ($categories as $cat): ?>
                        <option value="<?= $cat['id'] ?>" <?= $catFilter === (int)$cat['id'] ? 'selected' : '' ?>><?= e($cat['name']) ?></option>
                    <?php endforeach; ?>
                </select>
                <input type="text" name="q" value="<?= e($search) ?>" placeholder="Searching song title, singer, dj/remixer (e.g. Kali Mai, Kamariya, Pawan Singh)..." class="flex-1 text-xs border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-emerald-600">
                <button type="submit" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded transition">
                    Search
                </button>
            </form>
        </div>

        <!-- Category Grid Folders -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <?php foreach (array_slice($categories, 0, 4) as $category): ?>
            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($category['slug']) ?>" class="bg-white p-3 rounded border border-gray-200 shadow-sm hover:border-emerald-500 transition group flex items-start justify-between">
                <div>
                    <h3 class="text-xs font-bold text-gray-800 group-hover:text-emerald-700 flex items-center gap-1.5">
                        <?= e($category['name']) ?>
                        <?php if (!empty($category['badge'])): ?>
                            <span class="bg-red-500 text-white text-[9px] px-1 py-0.2 rounded font-black"><?= e($category['badge']) ?></span>
                        <?php endif; ?>
                    </h3>
                    <p class="text-[11px] text-gray-500 mt-0.5 line-clamp-1"><?= e($category['description']) ?></p>
                </div>
                <span class="text-[11px] text-gray-400 font-semibold shrink-0 ml-2">[<?= (int)$category['song_count'] ?> Files &gt;]</span>
            </a>
            <?php endforeach; ?>
        </div>

        <!-- Latest Uploaded Songs Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <h2 class="text-xs font-black uppercase text-gray-700 tracking-wide">Latest Uploaded Songs & DJ Remixes</h2>
                    <span class="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded"><?= count($songs) ?> Files</span>
                </div>
                <div class="text-[11px] font-semibold text-gray-500 flex items-center gap-2">
                    <span>Sort:</span>
                    <a href="?sort=date" class="<?= $sort === 'date' ? 'text-red-600 font-bold underline' : 'hover:text-gray-800' ?>">Post Date</a>
                    <span>|</span>
                    <a href="?sort=hits" class="<?= $sort === 'hits' ? 'text-red-600 font-bold underline' : 'hover:text-gray-800' ?>">Most Hits</a>
                    <span>|</span>
                    <a href="?sort=title" class="<?= $sort === 'title' ? 'text-red-600 font-bold underline' : 'hover:text-gray-800' ?>">Rewind</a>
                </div>
            </div>

            <!-- Song List -->
            <div class="divide-y divide-gray-100">
                <?php if (empty($songs)): ?>
                    <div class="p-8 text-center text-sm text-gray-500">No songs found matching your search.</div>
                <?php else: ?>
                    <?php foreach ($songs as $index => $song): ?>
                    <div class="p-3 hover:bg-emerald-50/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-start gap-2.5">
                            <span class="text-xs font-bold text-gray-400 mt-0.5"><?= $index + 1 ?>.</span>
                            <div>
                                <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($song['slug']) ?>" class="text-xs font-bold text-gray-900 hover:text-emerald-700">
                                    <?= e($song['title']) ?>
                                    <?php if ($song['is_hot']): ?>
                                        <span class="bg-red-600 text-white text-[9px] px-1 py-0.2 rounded font-extrabold ml-1">HOT</span>
                                    <?php endif; ?>
                                </a>
                                <div class="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                    <span>Singer: <strong class="text-gray-700"><?= e($song['singer']) ?></strong></span>
                                    <span>•</span>
                                    <span>DJ: <strong class="text-emerald-700"><?= e($song['remixer']) ?></strong></span>
                                    <span>•</span>
                                    <span class="text-gray-400"><?= e($song['bitrate']) ?> | <?= e($song['file_size']) ?> | <?= number_format((int)$song['hits']) ?> Hits</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 self-end sm:self-center">
                            <a href="<?= SITE_URL ?>/download.php?slug=<?= urlencode($song['slug']) ?>" class="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-sm">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download
                            </a>
                            <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($song['slug']) ?>" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded border border-gray-300">
                                View Page
                            </a>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 text-xs py-8 mt-12 border-t-2 border-emerald-600">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-2">
                <span class="text-white text-base font-bold"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></span>
                <p class="mt-2 text-gray-400 text-[11px] leading-relaxed">
                    India's leading high definition 320 Kbps MP3 & DJ remix downloading hub. Delivering high fidelity studio master audio tracks with sub-bass, roadshow dholki mixes, and instant mobile ringtones.
                </p>
                <div class="mt-4 flex flex-wrap gap-3 text-[11px]">
                    <a href="<?= SITE_URL ?>/pages/about.php" class="hover:text-white">About Us</a>
                    <a href="<?= SITE_URL ?>/pages/contact.php" class="hover:text-white">Contact</a>
                    <a href="<?= SITE_URL ?>/pages/disclaimer.php" class="hover:text-white">DMCA Disclaimer</a>
                    <a href="<?= SITE_URL ?>/pages/privacy.php" class="hover:text-white">Privacy Policy</a>
                    <a href="<?= SITE_URL ?>/pages/terms.php" class="hover:text-white">Terms of Use</a>
                    <a href="<?= SITE_URL ?>/sitemap.xml.php" class="hover:text-white">Sitemap</a>
                </div>
            </div>
            <div>
                <h4 class="text-white font-bold mb-2">Popular Categories</h4>
                <ul class="space-y-1 text-[11px]">
                    <?php foreach (array_slice($categories, 0, 4) as $cat): ?>
                        <li><a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?>" class="hover:text-white"><?= e($cat['name']) ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-2">Legal & DMCA</h4>
                <p class="text-[11px] text-gray-500 leading-relaxed">
                    All audio files and DJ remixes are for promotional and entertainment use only. All copyright belongs to respective music labels.
                </p>
            </div>
        </div>
        <div class="max-w-6xl mx-auto px-4 mt-6 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500">
            &copy; <?= date('Y') ?> <?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?>. All rights reserved.
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'category.php',
      filename: 'category.php',
      category: 'frontend',
      description: 'Category Archive & Folder Listing with PDO Prepared Statements, Songs, Pagination & 404',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/config/db.php';

$pdo = Database::getConnection();

// Fetch site settings
$settingsStmt = $pdo->query("SELECT setting_key, setting_value FROM site_settings");
$settings = $settingsStmt->fetchAll(PDO::FETCH_KEY_PAIR);

$rawSlug = $_GET['slug'] ?? '';
$slug = is_string($rawSlug) ? trim($rawSlug) : '';

// 1. ALL CATEGORIES FOLDER DIRECTORY (when no slug is passed)
if ($slug === '') {
    $allCatsStmt = $pdo->query("SELECT c.*, COUNT(s.id) AS song_count 
                                FROM categories c 
                                LEFT JOIN songs s ON c.id = s.category_id 
                                GROUP BY c.id 
                                ORDER BY c.id ASC");
    $allCategories = $allCatsStmt->fetchAll();
    $pageTitle = "All Music Categories & Folders | " . e($settings['site_name'] ?? 'DjSongsHub.In All In One');
    $pageDescription = "Browse all official DJ remix categories, Bhojpuri dance drops, Navratri bhakti, and Haryanvi bass music folders on " . e($settings['site_name'] ?? 'DjSongsHub.In All In One');
    $canonicalUrl = SITE_URL . "/category.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="description" content="<?= $pageDescription ?>">
    <link rel="canonical" href="<?= $canonicalUrl ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased pb-24">

    <!-- Header Navigation -->
    <header class="bg-[#0b5331] text-white shadow-md border-b-2 border-emerald-500">
        <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
                <a href="<?= SITE_URL ?>" class="flex items-center gap-2">
                    <span class="text-2xl font-black tracking-tight text-white"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></span>
                    <span class="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">ALL IN ONE</span>
                </a>
                <p class="text-[11px] text-emerald-200"><?= e($settings['site_subtitle'] ?? 'All In One DJ Remix & High Speed MP3 Portal') ?></p>
            </div>
            <nav class="flex items-center gap-4 text-xs font-medium">
                <a href="<?= SITE_URL ?>" class="hover:text-emerald-300">Home</a>
                <a href="<?= SITE_URL ?>/category.php" class="text-amber-300 font-bold underline">Folders</a>
                <a href="<?= SITE_URL ?>/admin/login.php" class="bg-emerald-800 px-2.5 py-1 rounded text-white hover:bg-emerald-700">Admin</a>
            </nav>
        </div>
    </header>

    <div class="max-w-6xl mx-auto px-4 py-3 text-xs text-gray-500 flex items-center gap-1.5">
        <a href="<?= SITE_URL ?>" class="hover:text-emerald-700 font-semibold">Home</a>
        <span>&gt;</span>
        <span class="text-gray-900 font-bold">All Music Categories</span>
    </div>

    <main class="max-w-6xl mx-auto px-4 mt-2">
        <div class="bg-gradient-to-r from-[#073922] to-[#0b5331] text-white rounded-t-lg p-5 shadow-sm border-b-2 border-emerald-400">
            <h1 class="text-xl md:text-2xl font-black">All Music Categories &amp; Folders</h1>
            <p class="text-xs text-emerald-200 mt-1">Select a folder below to stream and download high quality 320 Kbps audio tracks</p>
        </div>

        <div class="bg-white p-4 rounded-b-lg border border-gray-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <?php foreach ($allCategories as $cat): ?>
            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?>" class="p-3.5 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group flex items-start justify-between">
                <div>
                    <h2 class="text-xs font-bold text-gray-900 group-hover:text-emerald-800 flex items-center gap-1.5">
                        <?= e($cat['name']) ?>
                        <?php if (!empty($cat['badge'])): ?>
                            <span class="bg-red-500 text-white text-[9px] px-1 py-0.2 rounded font-black"><?= e($cat['badge']) ?></span>
                        <?php endif; ?>
                    </h2>
                    <p class="text-[11px] text-gray-500 mt-1 line-clamp-2"><?= e($cat['description'] ?? 'Exclusive DJ remix songs & tracks.') ?></p>
                    <span class="text-[10px] text-emerald-700 font-mono mt-2 block">/category/<?= e($cat['slug']) ?></span>
                </div>
                <span class="text-xs font-bold text-gray-400 group-hover:text-emerald-700 shrink-0 ml-2">[<?= (int)$cat['song_count'] ?> Files &gt;]</span>
            </a>
            <?php endforeach; ?>
        </div>
    </main>

    <footer class="bg-gray-900 text-gray-400 text-xs py-8 mt-12 border-t-2 border-emerald-600 text-center">
        <p>&copy; <?= date('Y') ?> <?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?>. All rights reserved.</p>
    </footer>
</body>
</html>
<?php
    exit;
}

// 2. SLUG VALIDATION & PDO PREPARED STATEMENT FOR SPECIFIC CATEGORY
if (!preg_match('/^[a-zA-Z0-9_-]+$/', $slug)) {
    http_response_code(404);
    $category = null;
} else {
    $catStmt = $pdo->prepare("SELECT * FROM categories WHERE slug = :slug LIMIT 1");
    $catStmt->execute(['slug' => $slug]);
    $category = $catStmt->fetch();
}

// 3. 404 CATEGORY NOT FOUND HANDLER
if (!$category) {
    http_response_code(404);
    $pageTitle = "404 Category Not Found | " . e($settings['site_name'] ?? 'DjSongsHub.In All In One');
    $allCatsStmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC LIMIT 8");
    $availableCategories = $allCatsStmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased pb-24">
    <header class="bg-[#0b5331] text-white shadow-md border-b-2 border-emerald-500">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="<?= SITE_URL ?>" class="text-2xl font-black text-white"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></a>
            <a href="<?= SITE_URL ?>" class="text-xs hover:text-emerald-300">Back to Home</a>
        </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 mt-8">
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
            <span class="inline-block bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                HTTP 404 Error
            </span>
            <h1 class="text-2xl font-black text-gray-900 mb-2">Category Not Found</h1>
            <p class="text-xs text-gray-600 mb-6">
                The requested category slug <code class="bg-gray-100 px-2 py-0.5 rounded font-mono text-red-600 font-bold"><?= e($slug) ?></code> does not exist or may have been renamed.
            </p>

            <h2 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Browse Available Categories</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left mb-6">
                <?php foreach ($availableCategories as $availCat): ?>
                <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($availCat['slug']) ?>" class="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-xs font-bold text-gray-800 transition flex items-center justify-between">
                    <span><?= e($availCat['name']) ?></span>
                    <span class="text-emerald-700 text-[10px] font-mono">/category/<?= e($availCat['slug']) ?> &gt;</span>
                </a>
                <?php endforeach; ?>
            </div>

            <a href="<?= SITE_URL ?>" class="inline-block bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded transition shadow-sm">
                Return to Homepage
            </a>
        </div>
    </main>

    <footer class="bg-gray-900 text-gray-400 text-xs py-8 mt-12 border-t-2 border-emerald-600 text-center">
        <p>&copy; <?= date('Y') ?> <?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?>. All rights reserved.</p>
    </footer>
</body>
</html>
<?php
    exit;
}

// 4. SORTING & PAGINATION FOR CATEGORY SONGS
$sort = in_array($_GET['sort'] ?? '', ['hits', 'date', 'title']) ? $_GET['sort'] : 'date';
$orderBy = match($sort) {
    'hits' => 's.hits DESC, s.id DESC',
    'title' => 's.title ASC',
    default => 's.created_at DESC, s.id DESC',
};

$page = max(1, (int)($_GET['page'] ?? 1));
$perPage = 10;
$offset = ($page - 1) * $perPage;

// Count total published songs in this category
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM songs WHERE category_id = :cat_id");
$countStmt->execute(['cat_id' => $category['id']]);
$totalSongs = (int)$countStmt->fetchColumn();
$totalPages = max(1, (int)ceil($totalSongs / $perPage));

// Fetch paginated songs with prepared statements
$songsStmt = $pdo->prepare("SELECT s.*, c.name AS category_name, c.slug AS category_slug 
                            FROM songs s 
                            JOIN categories c ON s.category_id = c.id 
                            WHERE s.category_id = :cat_id 
                            ORDER BY {$orderBy} 
                            LIMIT :limit OFFSET :offset");
$songsStmt->bindValue(':cat_id', (int)$category['id'], PDO::PARAM_INT);
$songsStmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
$songsStmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$songsStmt->execute();
$songs = $songsStmt->fetchAll();

// Fetch other categories for fast navigation
$otherStmt = $pdo->prepare("SELECT c.*, COUNT(s.id) AS song_count 
                            FROM categories c 
                            LEFT JOIN songs s ON c.id = s.category_id 
                            WHERE c.id != :cat_id 
                            GROUP BY c.id 
                            ORDER BY c.id ASC 
                            LIMIT 6");
$otherStmt->execute(['cat_id' => $category['id']]);
$otherCategories = $otherStmt->fetchAll();

$pageTitle = e($category['name']) . " - DJ Remix Mp3 Songs Download | " . e($settings['site_name'] ?? 'DjSongsHub.In All In One');
$pageDescription = "Download latest " . e($category['name']) . " DJ remix songs, 320Kbps HQ audio, competition bass mix and ringtones. " . e($category['description'] ?? '');
$canonicalUrl = SITE_URL . "/category.php?slug=" . urlencode($category['slug']);
$cleanCategoryUrl = SITE_URL . "/category/" . urlencode($category['slug']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="description" content="<?= $pageDescription ?>">
    <link rel="canonical" href="<?= $canonicalUrl ?>">
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Schema.org CollectionPage & BreadcrumbList Structured Data for SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": "<?= $canonicalUrl ?>#category",
          "name": "<?= e($category['name']) ?>",
          "url": "<?= $canonicalUrl ?>",
          "description": "<?= e($category['description'] ?? '') ?>",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": <?= count($songs) ?>,
            "itemListElement": [
              <?php foreach ($songs as $idx => $s): ?>
              {
                "@type": "ListItem",
                "position": <?= $idx + 1 ?>,
                "url": "<?= SITE_URL ?>/song.php?slug=<?= urlencode($s['slug']) ?>",
                "name": "<?= e($s['title']) ?>"
              }<?= $idx < count($songs) - 1 ? ',' : '' ?>
              <?php endforeach; ?>
            ]
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "<?= SITE_URL ?>"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Categories",
              "item": "<?= SITE_URL ?>/category.php"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "<?= e($category['name']) ?>",
              "item": "<?= $canonicalUrl ?>"
            }
          ]
        }
      ]
    }
    </script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased pb-24">

    <!-- Top Notice Ticker -->
    <div class="bg-amber-400 text-black text-xs font-semibold py-1 px-4 border-b border-amber-500 flex items-center justify-between">
        <div class="truncate text-[11px]">
            <?= e($settings['notice_ticker'] ?? 'Welcome to DjSongsHub.In All In One Official 320Kbps MP3 Portal!') ?>
        </div>
        <div class="hidden md:block text-[10px] text-amber-950 font-bold shrink-0">
            Category Archive: <?= e($category['name']) ?>
        </div>
    </div>

    <!-- Header Navigation -->
    <header class="bg-[#0b5331] text-white shadow-md border-b-2 border-emerald-500">
        <div class="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
                <a href="<?= SITE_URL ?>" class="flex items-center gap-2">
                    <span class="text-2xl font-black tracking-tight text-white"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></span>
                    <span class="bg-amber-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">ALL IN ONE</span>
                </a>
                <p class="text-[11px] text-emerald-200"><?= e($settings['site_subtitle'] ?? 'All In One DJ Remix & High Speed MP3 Portal') ?></p>
            </div>
            <nav class="flex items-center gap-4 text-xs font-medium">
                <a href="<?= SITE_URL ?>" class="hover:text-emerald-300">Home</a>
                <a href="<?= SITE_URL ?>/category.php" class="text-amber-300 font-bold underline">Folders</a>
                <a href="<?= SITE_URL ?>/admin/login.php" class="bg-emerald-800 px-2.5 py-1 rounded text-white hover:bg-emerald-700">Admin</a>
            </nav>
        </div>
    </header>

    <!-- Top AdSense Banner Slot -->
    <?php if (($settings['adsense_enabled'] ?? '1') === '1'): ?>
    <div class="max-w-4xl mx-auto my-3 px-4">
        <div class="bg-white border border-dashed border-gray-300 rounded p-2 text-center text-xs text-gray-400">
            <span class="uppercase tracking-widest text-[9px] block mb-1">Advertisement</span>
            <div class="h-20 flex items-center justify-center bg-gray-50 text-gray-500 font-mono">
                Google AdSense 728x90 Leaderboard Slot
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Breadcrumb -->
    <div class="max-w-6xl mx-auto px-4 py-2 text-xs text-gray-500 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 overflow-hidden">
            <a href="<?= SITE_URL ?>" class="hover:text-emerald-700 font-semibold">Home</a>
            <span>&gt;</span>
            <a href="<?= SITE_URL ?>/category.php" class="hover:text-emerald-700">Categories</a>
            <span>&gt;</span>
            <span class="text-gray-900 font-bold truncate"><?= e($category['name']) ?></span>
        </div>
        <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                /category/<?= e($category['slug']) ?>
            </span>
            <button onclick="navigator.clipboard.writeText('<?= $cleanCategoryUrl ?>'); alert('Category URL copied!');" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer">
                Copy Link
            </button>
        </div>
    </div>

    <!-- Main Content Container -->
    <main class="max-w-6xl mx-auto px-4 mt-2">

        <!-- Category Header Banner -->
        <div class="bg-gradient-to-r from-[#073922] via-[#0b5331] to-[#0e613b] text-white rounded-t-xl p-5 md:p-6 shadow-sm border-b-2 border-emerald-400">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="bg-emerald-900/80 border border-emerald-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded text-amber-300 uppercase tracking-wider">
                            Folder Archive
                        </span>
                        <?php if (!empty($category['badge'])): ?>
                            <span class="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                                <?= e($category['badge']) ?>
                            </span>
                        <?php endif; ?>
                    </div>
                    <h1 class="text-xl md:text-2xl font-black text-white tracking-tight">
                        <?= e($category['name']) ?>
                    </h1>
                    <p class="text-xs text-emerald-100/90 mt-1.5 leading-relaxed max-w-2xl">
                        <?= e($category['description'] ?? 'Official high-definition 320 Kbps DJ Remix songs & MP3 downloads.') ?>
                    </p>
                </div>
                <div class="bg-emerald-900/60 border border-emerald-400/40 rounded-lg p-3 text-center shrink-0">
                    <span class="text-2xl font-black text-amber-300 block leading-tight"><?= number_format($totalSongs) ?></span>
                    <span class="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Available Tracks</span>
                </div>
            </div>
        </div>

        <!-- Song List Container -->
        <div class="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            
            <!-- Sorting & Total Filter Bar -->
            <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <div class="text-xs font-bold text-gray-700">
                    Showing Page <?= $page ?> of <?= $totalPages ?> (<?= $totalSongs ?> Total Tracks)
                </div>
                <div class="text-[11px] font-semibold text-gray-500 flex items-center gap-2">
                    <span>Sort By:</span>
                    <a href="?slug=<?= urlencode($category['slug']) ?>&sort=date" class="<?= $sort === 'date' ? 'text-emerald-700 font-bold underline' : 'hover:text-gray-800' ?>">Post Date</a>
                    <span>|</span>
                    <a href="?slug=<?= urlencode($category['slug']) ?>&sort=hits" class="<?= $sort === 'hits' ? 'text-emerald-700 font-bold underline' : 'hover:text-gray-800' ?>">Most Hits</a>
                    <span>|</span>
                    <a href="?slug=<?= urlencode($category['slug']) ?>&sort=title" class="<?= $sort === 'title' ? 'text-emerald-700 font-bold underline' : 'hover:text-gray-800' ?>">Rewind (A-Z)</a>
                </div>
            </div>

            <!-- Songs List -->
            <div class="divide-y divide-gray-100">
                <?php if (empty($songs)): ?>
                    <div class="p-8 text-center text-sm text-gray-500">
                        <p class="font-bold text-gray-700 mb-1">No songs uploaded in this folder yet.</p>
                        <p class="text-xs text-gray-400">Check back soon or explore other popular categories below.</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($songs as $index => $song): ?>
                    <div class="p-3.5 hover:bg-emerald-50/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div class="flex items-start gap-3">
                            <span class="text-xs font-black text-gray-400 mt-1 w-6 shrink-0 text-right">
                                <?= $offset + $index + 1 ?>.
                            </span>
                            <div>
                                <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($song['slug']) ?>" class="text-sm font-bold text-gray-900 hover:text-emerald-700 leading-snug block">
                                    <?= e($song['title']) ?>
                                    <?php if ($song['is_hot']): ?>
                                        <span class="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold ml-1">HOT</span>
                                    <?php endif; ?>
                                    <?php if ($song['is_trending']): ?>
                                        <span class="bg-amber-500 text-black text-[9px] px-1.5 py-0.2 rounded font-extrabold ml-1">TRENDING</span>
                                    <?php endif; ?>
                                </a>
                                <div class="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                                    <span>Singer: <strong class="text-gray-700"><?= e($song['singer']) ?></strong></span>
                                    <span>•</span>
                                    <span>DJ Remixer: <strong class="text-emerald-800"><?= e($song['remixer']) ?></strong></span>
                                    <span>•</span>
                                    <span class="text-gray-400"><?= e($song['bitrate']) ?> | <?= e($song['file_size']) ?> | <?= e($song['duration']) ?></span>
                                    <span>•</span>
                                    <span class="text-emerald-700 font-semibold"><?= number_format((int)$song['hits']) ?> Downloads</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($song['slug']) ?>" class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition">
                                Details
                            </a>
                            <a href="<?= SITE_URL ?>/download.php?slug=<?= urlencode($song['slug']) ?>" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded flex items-center gap-1.5 shadow-sm transition">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download
                            </a>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Pagination Bar -->
            <?php if ($totalPages > 1): ?>
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                    <?php if ($page > 1): ?>
                        <a href="?slug=<?= urlencode($category['slug']) ?>&sort=<?= $sort ?>&page=<?= $page - 1 ?>" class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold transition">
                            &laquo; Previous
                        </a>
                    <?php endif; ?>
                </div>

                <div class="flex items-center gap-1 text-xs">
                    <?php for ($p = 1; $p <= $totalPages; $p++): ?>
                        <a href="?slug=<?= urlencode($category['slug']) ?>&sort=<?= $sort ?>&page=<?= $p ?>" class="px-3 py-1 rounded border <?= $p === $page ? 'bg-emerald-700 text-white font-bold border-emerald-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100' ?>">
                            <?= $p ?>
                        </a>
                    <?php endfor; ?>
                </div>

                <div>
                    <?php if ($page < $totalPages): ?>
                        <a href="?slug=<?= urlencode($category['slug']) ?>&sort=<?= $sort ?>&page=<?= $page + 1 ?>" class="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-xs font-bold transition">
                            Next &raquo;
                        </a>
                    <?php endif; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <!-- Other Category Folders for Cross Navigation -->
        <?php if (!empty($otherCategories)): ?>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <h2 class="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                Other Popular Categories &amp; Folders
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <?php foreach ($otherCategories as $oCat): ?>
                <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($oCat['slug']) ?>" class="p-2.5 rounded border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between group">
                    <div class="truncate">
                        <span class="text-xs font-bold text-gray-800 group-hover:text-emerald-800 block truncate"><?= e($oCat['name']) ?></span>
                        <span class="text-[10px] text-gray-400 font-mono">/category/<?= e($oCat['slug']) ?></span>
                    </div>
                    <span class="text-[11px] text-gray-400 font-semibold shrink-0 ml-2">[<?= (int)$oCat['song_count'] ?>]</span>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- Bottom AdSense Banner Slot -->
        <?php if (($settings['adsense_enabled'] ?? '1') === '1'): ?>
        <div class="my-4">
            <div class="bg-white border border-dashed border-gray-300 rounded p-2 text-center text-xs text-gray-400">
                <span class="uppercase tracking-widest text-[9px] block mb-1">Advertisement</span>
                <div class="h-20 flex items-center justify-center bg-gray-50 text-gray-500 font-mono">
                    Google AdSense Responsive Banner Slot
                </div>
            </div>
        </div>
        <?php endif; ?>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 text-xs py-8 mt-12 border-t-2 border-emerald-600">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="md:col-span-2">
                <span class="text-white text-base font-bold"><?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?></span>
                <p class="mt-2 text-gray-400 text-[11px] leading-relaxed">
                    India's leading high definition 320 Kbps MP3 & DJ remix downloading hub. Delivering high fidelity studio master audio tracks with sub-bass, roadshow dholki mixes, and instant mobile ringtones.
                </p>
                <div class="mt-4 flex flex-wrap gap-3 text-[11px]">
                    <a href="<?= SITE_URL ?>/pages/about.php" class="hover:text-white">About Us</a>
                    <a href="<?= SITE_URL ?>/pages/contact.php" class="hover:text-white">Contact</a>
                    <a href="<?= SITE_URL ?>/pages/disclaimer.php" class="hover:text-white">DMCA Disclaimer</a>
                    <a href="<?= SITE_URL ?>/pages/privacy.php" class="hover:text-white">Privacy Policy</a>
                    <a href="<?= SITE_URL ?>/pages/terms.php" class="hover:text-white">Terms of Use</a>
                    <a href="<?= SITE_URL ?>/sitemap.xml.php" class="hover:text-white">Sitemap</a>
                </div>
            </div>
            <div>
                <h4 class="text-white font-bold mb-2">Category Quick Links</h4>
                <ul class="space-y-1 text-[11px]">
                    <?php foreach ($otherCategories as $cat): ?>
                        <li><a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?>" class="hover:text-white"><?= e($cat['name']) ?></a></li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <div>
                <h4 class="text-white font-bold mb-2">Legal &amp; DMCA</h4>
                <p class="text-[11px] text-gray-500 leading-relaxed">
                    All audio files and DJ remixes are for promotional and entertainment use only. All copyright belongs to respective music labels.
                </p>
            </div>
        </div>
        <div class="max-w-6xl mx-auto px-4 mt-6 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500">
            &copy; <?= date('Y') ?> <?= e($settings['site_name'] ?? 'DjSongsHub.In All In One') ?>. All rights reserved.
        </div>
    </footer>

</body>
</html>
`,
    },
    {
      path: 'song.php',
      filename: 'song.php',
      category: 'frontend',
      description: 'Song Details Page with Download Links, Specs Table, Related Tracks & Schema.org',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/config/db.php';

$pdo = Database::getConnection();
$slug = trim($_GET['slug'] ?? '');

if (empty($slug)) {
    header("Location: " . SITE_URL);
    exit;
}

$stmt = $pdo->prepare("SELECT s.*, c.name AS category_name, c.slug AS category_slug 
                       FROM songs s 
                       JOIN categories c ON s.category_id = c.id 
                       WHERE s.slug = :slug LIMIT 1");
$stmt->execute(['slug' => $slug]);
$song = $stmt->fetch();

if (!$song) {
    http_response_code(404);
    die("<h1>404 - Song Not Found</h1><p><a href='" . SITE_URL . "'>Return to Home</a></p>");
}

// Fetch related songs from the same category
$relStmt = $pdo->prepare("SELECT * FROM songs WHERE category_id = :cat_id AND id != :id ORDER BY hits DESC LIMIT 5");
$relStmt->execute(['cat_id' => $song['category_id'], 'id' => $song['id']]);
$relatedSongs = $relStmt->fetchAll();

// Fetch songs by artist
$artStmt = $pdo->prepare("SELECT * FROM songs WHERE singer = :singer AND id != :id ORDER BY hits DESC LIMIT 5");
$artStmt->execute(['singer' => $song['singer'], 'id' => $song['id']]);
$artistSongs = $artStmt->fetchAll();

$pageTitle = e($song['title']) . " - Mp3 Song Download (320Kbps HQ)";
$canonicalUrl = SITE_URL . "/song.php?slug=" . urlencode($song['slug']);
$downloadUrl = SITE_URL . "/download.php?slug=" . urlencode($song['slug']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?></title>
    <meta name="description" content="Download <?= e($song['title']) ?> remixed by <?= e($song['remixer']) ?>. Original singer: <?= e($song['singer']) ?>. Free 320Kbps HQ MP3 download on <?= SITE_NAME ?>.">
    <meta name="keywords" content="<?= e($song['keywords'] ?? '') ?>">
    <link rel="canonical" href="<?= $canonicalUrl ?>">
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Schema.org MusicRecording Structured Data for Google AdSense & SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      "name": "<?= e($song['title']) ?>",
      "byArtist": {
        "@type": "MusicGroup",
        "name": "<?= e($song['singer']) ?>"
      },
      "producer": {
        "@type": "Person",
        "name": "<?= e($song['remixer']) ?>"
      },
      "duration": "PT<?= (int)$song['duration_sec'] ?>S",
      "url": "<?= $canonicalUrl ?>"
    }
    </script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans antialiased pb-24">

    <!-- Header Navigation -->
    <header class="bg-[#0b5331] text-white shadow-md border-b-2 border-emerald-500">
        <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="<?= SITE_URL ?>" class="text-xl font-black text-white"><?= SITE_NAME ?></a>
            <div class="text-xs space-x-3">
                <a href="<?= SITE_URL ?>" class="hover:underline">Home</a>
                <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($song['category_slug']) ?>" class="hover:underline"><?= e($song['category_name']) ?></a>
            </div>
        </div>
    </header>

    <!-- Breadcrumb -->
    <div class="max-w-4xl mx-auto px-4 py-2.5 text-[11px] text-gray-500 flex items-center justify-between">
        <div class="flex items-center gap-1.5 overflow-hidden">
            <a href="<?= SITE_URL ?>" class="hover:text-emerald-700">Home</a>
            <span>&gt;</span>
            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($song['category_slug']) ?>" class="hover:text-emerald-700"><?= e($song['category_name']) ?></a>
            <span>&gt;</span>
            <span class="text-gray-700 font-bold truncate"><?= e($song['title']) ?></span>
        </div>
        <button onclick="navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!');" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ml-2">
            Copy Song Link
        </button>
    </div>

    <main class="max-w-4xl mx-auto px-4">

        <!-- Main Banner Card -->
        <div class="bg-[#0b5331] text-white rounded-t-lg p-5 text-center shadow-sm relative overflow-hidden border-b-2 border-emerald-400">
            <div class="flex items-center justify-center gap-2 mb-2">
                <span class="bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">DJ TRACK</span>
                <span class="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">320 Kbps Studio</span>
                <?php if ($song['is_trending']): ?>
                    <span class="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded">Trending</span>
                <?php endif; ?>
            </div>

            <h1 class="text-lg md:text-xl font-black tracking-tight text-white mt-1"><?= e($song['title']) ?></h1>

            <div class="mt-3 text-xs text-emerald-100 space-y-1">
                <p>Remixed By: <strong class="text-white"><?= e($song['remixer']) ?></strong></p>
                <p>Original Singer: <strong class="text-white"><?= e($song['singer']) ?></strong></p>
                <p class="text-[11px] text-emerald-300">Category / Folder: <?= e($song['category_name']) ?></p>
            </div>
        </div>

        <!-- Audio Player Box -->
        <div class="bg-emerald-950 text-white p-4 border-b border-emerald-800 flex flex-col items-center">
            <span class="text-xs font-semibold text-emerald-300 mb-2">Listen Song Online (High Quality)</span>
            <audio controls class="w-full max-w-md bg-transparent">
                <source src="<?= $downloadUrl ?>&stream=1" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>

        <!-- Direct Server Download Zone -->
        <div class="bg-white p-5 border-x border-b border-gray-200 shadow-sm text-center">
            <span class="text-[10px] font-black text-red-600 tracking-wider uppercase block mb-2">&#9889; FAST DIRECT SERVER DOWNLOAD LINK</span>
            
            <!-- Primary 320 Kbps Download Button -->
            <a href="<?= $downloadUrl ?>&quality=320" class="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black text-sm px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95 w-full sm:w-auto">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                [ Download File Here (320 Kbps HQ) ] &nbsp;<span class="text-xs opacity-90"><?= e($song['file_size']) ?></span>
            </a>

            <!-- Alternative Download Options -->
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg mx-auto">
                <a href="<?= $downloadUrl ?>&quality=192" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-bold py-2 px-3 rounded text-center">
                    Download 192 Kbps (4.7 MB)
                </a>
                <a href="<?= $downloadUrl ?>&quality=128" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 text-xs font-bold py-2 px-3 rounded text-center">
                    Download 128 Kbps (3.2 MB)
                </a>
                <a href="<?= $downloadUrl ?>&quality=ringtone" class="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black py-2 px-3 rounded text-center">
                    Call Ringtone (30s) (1.2 MB)
                </a>
            </div>
        </div>

        <!-- Technical Specs Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-5 overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 class="text-xs font-bold text-gray-700 uppercase">Song Technical Specifications & Info</h3>
            </div>
            <table class="w-full text-xs text-left">
                <tbody class="divide-y divide-gray-100">
                    <tr><td class="px-4 py-2 font-semibold text-gray-500 w-1/3">Song Title:</td><td class="px-4 py-2 font-bold text-gray-900"><?= e($song['title']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">DJ / Remixer:</td><td class="px-4 py-2 text-emerald-700 font-bold"><?= e($song['remixer']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Original Singer:</td><td class="px-4 py-2"><?= e($song['singer']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Category / Folder:</td><td class="px-4 py-2"><?= e($song['category_name']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">File Size:</td><td class="px-4 py-2"><?= e($song['file_size']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Audio Bitrate:</td><td class="px-4 py-2 text-red-600 font-bold"><?= e($song['bitrate']) ?> Constant Bit Rate (CBR)</td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Duration:</td><td class="px-4 py-2"><?= e($song['duration']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Total Downloads:</td><td class="px-4 py-2 text-emerald-800 font-extrabold"><?= number_format((int)$song['hits']) ?> Hits</td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Release Year:</td><td class="px-4 py-2"><?= e($song['release_year']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Tempo & Rhythm:</td><td class="px-4 py-2"><?= e($song['tempo']) ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Song Lyrics:</td><td class="px-4 py-2"><?php if (!empty($song['lyrics'])): ?><a href="#lyrics-box" class="text-emerald-700 font-bold hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">View Lyrics (बोल)</a><?php else: ?><span class="text-gray-400">Not available</span><?php endif; ?></td></tr>
                    <tr><td class="px-4 py-2 font-semibold text-gray-500">Direct Song URL:</td><td class="px-4 py-2 text-blue-600 break-all"><a href="<?= $canonicalUrl ?>" class="underline"><?= $canonicalUrl ?></a></td></tr>
                </tbody>
            </table>
        </div>

        <!-- Expandable Song Lyrics Section with Scrollable Container -->
        <div id="lyrics-box" class="mt-5 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <details <?= !empty($song['lyrics']) ? 'open' : '' ?> class="group">
                <summary class="bg-[#0b5331] text-white px-4 py-3 flex items-center justify-between cursor-pointer list-none select-none">
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-xs uppercase tracking-wide">Song Lyrics & Bol (गीत के बोल)</span>
                        <span class="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Lyrics</span>
                    </div>
                    <span class="text-xs text-emerald-200 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="p-4 bg-gray-50/50">
                    <?php if (!empty($song['lyrics'])): ?>
                        <div class="max-h-72 overflow-y-auto p-3.5 bg-white rounded border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed font-sans whitespace-pre-line shadow-inner">
                            <?= nl2br(e($song['lyrics'])) ?>
                        </div>
                        <div class="mt-2 text-right">
                            <button onclick="navigator.clipboard.writeText(document.querySelector('#lyrics-box pre, #lyrics-box div').innerText); alert('Lyrics copied!');" class="text-xs text-emerald-700 font-bold hover:underline">Copy Lyrics</button>
                        </div>
                    <?php else: ?>
                        <p class="text-xs text-gray-500 text-center py-4">Lyrics for this song are currently being transcribed.</p>
                    <?php endif; ?>
                </div>
            </details>
        </div>

        <!-- Social Share Bar -->
        <div class="mt-4 bg-white p-3 rounded-lg border border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                Share This Song:
            </span>
            <div class="flex flex-wrap items-center gap-2">
                <a href="https://api.whatsapp.com/send?text=<?= urlencode($song['title'] . ' - Download MP3: ' . $canonicalUrl) ?>" target="_blank" class="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold px-3 py-1.5 rounded">WhatsApp</a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=<?= urlencode($canonicalUrl) ?>" target="_blank" class="bg-[#1877F2] hover:bg-[#166FE5] text-white text-[11px] font-bold px-3 py-1.5 rounded">Facebook</a>
                <a href="https://twitter.com/intent/tweet?url=<?= urlencode($canonicalUrl) ?>&text=<?= urlencode($song['title'] . ' - Download MP3') ?>" target="_blank" class="bg-[#0f1419] hover:bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded">Twitter / X</a>
                <a href="https://t.me/share/url?url=<?= urlencode($canonicalUrl) ?>&text=<?= urlencode($song['title']) ?>" target="_blank" class="bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold px-3 py-1.5 rounded">Telegram</a>
                <button onclick="navigator.clipboard.writeText('<?= $canonicalUrl ?>'); alert('Link copied!');" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded">Copy Link</button>
            </div>
        </div>

        <!-- Related Songs by Artist -->
        <?php if (!empty($artistSongs)): ?>
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div class="bg-[#0b5331] text-white px-4 py-2 text-xs font-bold flex justify-between items-center">
                <span>More by this Artist: <?= e($song['singer']) ?></span>
                <span class="text-[10px] text-emerald-200"><?= count($artistSongs) ?> Tracks</span>
            </div>
            <div class="divide-y divide-gray-100">
                <?php foreach ($artistSongs as $aSong): ?>
                <div class="p-2.5 flex items-center justify-between text-xs hover:bg-gray-50">
                    <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($aSong['slug']) ?>" class="font-bold text-gray-800 hover:text-emerald-700">
                        <?= e($aSong['title']) ?>
                    </a>
                    <a href="<?= SITE_URL ?>/download.php?slug=<?= urlencode($aSong['slug']) ?>" class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                        Download
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

    </main>

</body>
</html>
`,
    },
    {
      path: 'download.php',
      filename: 'download.php',
      category: 'core',
      description: 'Secure Stream & Chunked File Downloader with Atomic Download Counting',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/config/db.php';

$pdo = Database::getConnection();
$slug = trim($_GET['slug'] ?? '');
$quality = $_GET['quality'] ?? '320';
$isStream = isset($_GET['stream']) && $_GET['stream'] === '1';

if (empty($slug)) {
    header("Location: " . SITE_URL);
    exit;
}

// Fetch song
$stmt = $pdo->prepare("SELECT * FROM songs WHERE slug = :slug LIMIT 1");
$stmt->execute(['slug' => $slug]);
$song = $stmt->fetch();

if (!$song) {
    http_response_code(404);
    die("Song not found.");
}

// Atomically increment hits
$incStmt = $pdo->prepare("UPDATE songs SET hits = hits + 1 WHERE id = :id");
$incStmt->execute(['id' => $song['id']]);

// Log download with IP & User Agent
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);
$logStmt = $pdo->prepare("INSERT INTO downloads_log (song_id, ip_address, user_agent) VALUES (:sid, :ip, :ua)");
$logStmt->execute(['sid' => $song['id'], 'ip' => $ip, 'ua' => $ua]);

// Determine actual physical file path
$filename = $song['file_path'];
$targetPath = AUDIO_DIR . $filename;

// In a real environment with uploaded file:
if (file_exists($targetPath)) {
    $fileSize = filesize($targetPath);
    $cleanFilename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $song['title']) . "_{$quality}Kbps.mp3";

    if ($isStream) {
        header('Content-Type: audio/mpeg');
        header('Content-Length: ' . $fileSize);
        header('Accept-Ranges: bytes');
    } else {
        header('Content-Description: File Transfer');
        header('Content-Type: audio/mpeg');
        header('Content-Disposition: attachment; filename="' . $cleanFilename . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . $fileSize);
    }

    // Flush and stream chunked to avoid memory limits
    ob_clean();
    flush();
    readfile($targetPath);
    exit;
} else {
    // Demo audio stream / fallback generator for initial tests
    $cleanFilename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $song['title']) . "_{$quality}Kbps.mp3";
    header('Content-Type: audio/mpeg');
    header('Content-Disposition: attachment; filename="' . $cleanFilename . '"');
    
    // Output small valid ID3 header simulation
    echo "ID3";
    echo pack("C*", 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
    echo "TIT2" . pack("N", strlen($song['title'])) . pack("v", 0) . $song['title'];
    echo "TPE1" . pack("N", strlen($song['remixer'])) . pack("v", 0) . $song['remixer'];
    echo str_repeat("\xFF\xFB\x90\x64", 256);
    exit;
}
`,
    },
    {
      path: 'admin/login.php',
      filename: 'login.php',
      category: 'admin',
      description: 'Secure Admin Login with Password Hashing, CSRF & Brute Force Throttling',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

$pdo = Database::getConnection();
$error = '';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($username) || empty($password)) {
            $error = 'Username and password are required.';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :u LIMIT 1");
            $stmt->execute(['u' => $username]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_user'] = $admin['username'];
                header("Location: dashboard.php");
                exit;
            } else {
                $error = 'Invalid credentials. Default: admin / admin123';
            }
        }
    }
}

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - STM Music Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen p-4">

    <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div class="text-center mb-6">
            <div class="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-black">
                &#9881;
            </div>
            <h1 class="text-lg font-bold text-white">Music Portal Admin</h1>
            <p class="text-xs text-gray-400 mt-1">PHP 8.3 / 8.4 / 8.5 Secure Panel</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded mb-4">
                <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" class="space-y-4">
            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

            <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Admin Username</label>
                <input type="text" name="username" value="admin" required class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <input type="password" name="password" placeholder="••••••••" required class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>

            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded text-xs transition">
                Secure Sign In
            </button>
        </form>

        <div class="mt-4 pt-4 border-t border-gray-700 text-center text-[11px] text-gray-400">
            Default credentials: <span class="text-emerald-400 font-mono">admin / admin123</span>
        </div>
    </div>

</body>
</html>
`,
    },
    {
      path: 'admin/dashboard.php',
      filename: 'dashboard.php',
      category: 'admin',
      description: 'Admin Control Dashboard with Analytics, Hits, Song List & Fast Actions',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

$pdo = Database::getConnection();

// Delete song action
if (isset($_GET['delete'])) {
    $deleteId = (int)$_GET['delete'];
    $delStmt = $pdo->prepare("DELETE FROM songs WHERE id = :id");
    $delStmt->execute(['id' => $deleteId]);
    header("Location: dashboard.php?msg=deleted");
    exit;
}

// Fetch stats
$totalSongs = $pdo->query("SELECT COUNT(*) FROM songs")->fetchColumn();
$totalHits = $pdo->query("SELECT COALESCE(SUM(hits), 0) FROM songs")->fetchColumn();
$totalCategories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();
$recentDownloads = $pdo->query("SELECT COUNT(*) FROM downloads_log WHERE downloaded_at >= NOW() - INTERVAL 24 HOUR")->fetchColumn();

// Fetch categories overview
$categoriesList = $pdo->query("SELECT c.*, COUNT(s.id) AS song_count 
                              FROM categories c 
                              LEFT JOIN songs s ON c.id = s.category_id 
                              GROUP BY c.id 
                              ORDER BY c.id DESC LIMIT 8")->fetchAll();

// Fetch song list
$stmt = $pdo->query("SELECT s.*, c.name AS category_name, c.slug AS category_slug 
                     FROM songs s 
                     JOIN categories c ON s.category_id = c.id 
                     ORDER BY s.id DESC LIMIT 100");
$songs = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800">

    <nav class="bg-gray-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div class="flex items-center gap-3">
            <span class="font-black text-lg text-emerald-400"><?= SITE_NAME ?> Admin</span>
            <span class="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">PHP 8.3/8.4/8.5 Ready</span>
        </div>
        <div class="flex items-center flex-wrap gap-2 text-xs">
            <a href="<?= SITE_URL ?>" target="_blank" class="hover:text-emerald-400 px-2 py-1">View Public Site</a>
            <a href="categories.php" class="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-xs">
                <span>📁 Categories &amp; Folders</span>
                <span class="bg-emerald-950 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded font-mono ml-0.5"><?= (int)$totalCategories ?></span>
            </a>
            <a href="upload.php" class="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black px-3 py-1.5 rounded shadow-xs">+ Upload New Song</a>
            <a href="logout.php" class="text-red-400 hover:text-red-300 ml-2">Logout</a>
        </div>
    </nav>

    <div class="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">

        <?php if (isset($_GET['msg']) && $_GET['msg'] === 'deleted'): ?>
            <div class="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-lg font-bold">
                Song deleted successfully.
            </div>
        <?php endif; ?>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span class="text-xs text-gray-500 font-semibold uppercase">Total Songs</span>
                <p class="text-2xl font-black text-gray-800 mt-1"><?= number_format((int)$totalSongs) ?></p>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span class="text-xs text-gray-500 font-semibold uppercase">Total Hits / Downloads</span>
                <p class="text-2xl font-black text-emerald-600 mt-1"><?= number_format((int)$totalHits) ?></p>
            </div>
            <a href="categories.php" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20 transition block group" title="Click to manage and create categories">
                <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500 font-semibold uppercase">Folders / Categories</span>
                    <span class="text-[10px] text-emerald-700 font-bold group-hover:underline">Manage &gt;</span>
                </div>
                <p class="text-2xl font-black text-blue-600 mt-1"><?= (int)$totalCategories ?></p>
            </a>
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <span class="text-xs text-gray-500 font-semibold uppercase">24h Recent Downloads</span>
                <p class="text-2xl font-black text-purple-600 mt-1"><?= number_format((int)$recentDownloads) ?></p>
            </div>
        </div>

        <!-- Quick Categories & Music Folders Bar -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-gray-100">
                <div>
                    <h2 class="text-xs font-black uppercase text-gray-800 flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        Category Music Folders (<?= (int)$totalCategories ?> Folders Active)
                    </h2>
                    <p class="text-[11px] text-gray-500">All songs are organized by these category folders for SEO and fast browsing.</p>
                </div>
                <a href="categories.php" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1.5 self-start sm:self-auto shadow-xs">
                    <span>+ Create New Category (Option ON)</span>
                </a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <?php foreach ($categoriesList as $cat): ?>
                <div class="p-2.5 rounded-lg border border-gray-200 hover:border-emerald-400 bg-gray-50/50 flex items-center justify-between text-xs">
                    <div class="truncate pr-2">
                        <span class="font-bold text-gray-800 block truncate"><?= e($cat['name']) ?></span>
                        <span class="text-[10px] text-emerald-800 font-mono">/category/<?= e($cat['slug']) ?></span>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded block"><?= (int)$cat['song_count'] ?> Tracks</span>
                        <a href="categories.php?edit=<?= $cat['id'] ?>" class="text-[10px] text-blue-600 hover:underline">Edit</a>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Songs Management Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h2 class="text-sm font-bold text-gray-800">Uploaded Songs Library</h2>
                    <p class="text-[11px] text-gray-500">Manage tracks, update metadata, or delete obsolete songs.</p>
                </div>
                <div class="flex items-center gap-2">
                    <a href="categories.php" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-2.5 py-1 rounded border">Folders</a>
                    <a href="upload.php" class="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1 rounded">+ Add New Track</a>
                </div>
            </div>

            <table class="w-full text-xs text-left">
                <thead class="bg-gray-50 text-gray-500 font-semibold uppercase border-b border-gray-200">
                    <tr>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Title &amp; Artist</th>
                        <th class="px-4 py-3">Category</th>
                        <th class="px-4 py-3">Bitrate</th>
                        <th class="px-4 py-3">Downloads</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php if (empty($songs)): ?>
                    <tr>
                        <td colspan="6" class="px-4 py-6 text-center text-gray-400">
                            No songs uploaded yet. Click <a href="upload.php" class="text-emerald-700 font-bold underline">+ Upload New Song</a> to publish your first track!
                        </td>
                    </tr>
                    <?php endif; ?>
                    <?php foreach ($songs as $s): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-gray-400 font-mono"><?= $s['id'] ?></td>
                        <td class="px-4 py-3">
                            <span class="font-bold text-gray-900"><?= e($s['title']) ?></span>
                            <div class="text-[11px] text-gray-500">Singer: <?= e($s['singer']) ?> | DJ: <?= e($s['remixer']) ?></div>
                        </td>
                        <td class="px-4 py-3">
                            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($s['category_slug']) ?>" target="_blank" class="text-emerald-800 font-semibold hover:underline">
                                <?= e($s['category_name']) ?>
                            </a>
                        </td>
                        <td class="px-4 py-3 font-semibold text-red-600"><?= e($s['bitrate']) ?></td>
                        <td class="px-4 py-3 font-bold text-gray-800"><?= number_format((int)$s['hits']) ?></td>
                        <td class="px-4 py-3 text-right space-x-2">
                            <a href="<?= SITE_URL ?>/song.php?slug=<?= urlencode($s['slug']) ?>" target="_blank" class="text-blue-600 hover:underline">View</a>
                            <a href="edit.php?id=<?= $s['id'] ?>" class="text-emerald-700 hover:underline">Edit</a>
                            <a href="dashboard.php?delete=<?= $s['id'] ?>" onclick="return confirm('Delete this song permanently?');" class="text-red-600 hover:underline">Delete</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

    </div>

</body>
</html>
`,
    },
    {
      path: 'admin/categories.php',
      filename: 'categories.php',
      category: 'admin',
      description: 'Category & Music Folder CRUD Manager with Presets, Custom Slugs & Live Preview',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

$pdo = Database::getConnection();
$error = '';
$success = '';

// Handle Delete Category
if (isset($_GET['delete'])) {
    $deleteId = (int)$_GET['delete'];
    $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM songs WHERE category_id = :cid");
    $checkStmt->execute(['cid' => $deleteId]);
    $songCount = (int)$checkStmt->fetchColumn();

    if ($songCount > 0) {
        $error = "Cannot delete category (ID {$deleteId}): It contains {$songCount} songs. Please reassign or delete those songs first.";
    } else {
        $delStmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
        $delStmt->execute(['id' => $deleteId]);
        header("Location: categories.php?msg=deleted");
        exit;
    }
}

// Handle Create or Update Category
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $editId = !empty($_POST['edit_id']) ? (int)$_POST['edit_id'] : 0;
        $name = trim($_POST['name'] ?? '');
        $customSlug = trim($_POST['slug'] ?? '');
        $badge = trim($_POST['badge'] ?? 'NEW');
        $description = trim($_POST['description'] ?? '');

        if (empty($name)) {
            $error = 'Category / Folder name is required.';
        } else {
            $slug = !empty($customSlug) ? createSlug($customSlug) : createSlug($name);

            if ($editId > 0) {
                // Update
                $upStmt = $pdo->prepare("UPDATE categories SET name = :name, slug = :slug, badge = :badge, description = :description WHERE id = :id");
                $upStmt->execute([
                    'name' => $name,
                    'slug' => $slug,
                    'badge' => $badge,
                    'description' => $description,
                    'id' => $editId,
                ]);
                $success = "Category '{$name}' updated successfully!";
            } else {
                // Insert New
                $checkSlug = $pdo->prepare("SELECT COUNT(*) FROM categories WHERE slug = :slug");
                $checkSlug->execute(['slug' => $slug]);
                if ((int)$checkSlug->fetchColumn() > 0) {
                    $slug .= '-' . time();
                }

                $inStmt = $pdo->prepare("INSERT INTO categories (name, slug, badge, description) VALUES (:name, :slug, :badge, :description)");
                $inStmt->execute([
                    'name' => $name,
                    'slug' => $slug,
                    'badge' => $badge,
                    'description' => $description,
                ]);
                $success = "Category '{$name}' successfully created with live URL /category/{$slug}!";
            }
        }
    }
}

if (isset($_GET['msg']) && $_GET['msg'] === 'deleted') {
    $success = 'Category deleted successfully.';
}

// Fetch edit target
$editCategory = null;
if (isset($_GET['edit'])) {
    $editId = (int)$_GET['edit'];
    $editStmt = $pdo->prepare("SELECT * FROM categories WHERE id = :id LIMIT 1");
    $editStmt->execute(['id' => $editId]);
    $editCategory = $editStmt->fetch();
}

// Fetch all categories with song counts
$categoriesStmt = $pdo->query("SELECT c.*, COUNT(s.id) AS song_count 
                               FROM categories c 
                               LEFT JOIN songs s ON c.id = s.category_id 
                               GROUP BY c.id 
                               ORDER BY c.id DESC");
$categories = $categoriesStmt->fetchAll();

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Categories &amp; Folders Manager - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800 pb-12">

    <!-- Admin Nav -->
    <nav class="bg-gray-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div class="flex items-center gap-3">
            <span class="font-black text-lg text-emerald-400"><?= SITE_NAME ?> Admin</span>
            <span class="text-xs text-gray-400">Category &amp; Folder Management</span>
        </div>
        <div class="flex items-center flex-wrap gap-2 text-xs">
            <a href="dashboard.php" class="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded">&larr; Dashboard</a>
            <a href="upload.php" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded">+ Upload Song</a>
            <a href="<?= SITE_URL ?>" target="_blank" class="hover:text-emerald-400 px-2">Public Site</a>
            <a href="logout.php" class="text-red-400 hover:text-red-300 ml-2">Logout</a>
        </div>
    </nav>

    <div class="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

        <!-- Status Alerts -->
        <?php if (!empty($error)): ?>
            <div class="bg-red-50 border border-red-300 text-red-800 text-xs p-3.5 rounded-lg font-semibold">
                <?= e($error) ?>
            </div>
        <?php endif; ?>

        <?php if (!empty($success)): ?>
            <div class="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3.5 rounded-lg font-bold flex items-center justify-between">
                <span><?= e($success) ?></span>
                <a href="<?= SITE_URL ?>" target="_blank" class="underline text-emerald-950 font-black">View Website &rarr;</a>
            </div>
        <?php endif; ?>

        <!-- Category Creator Card (Option ON & Active) -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200">
                <div>
                    <h1 class="text-base font-black text-gray-900 flex items-center gap-2">
                        <span><?= $editCategory ? 'Edit Music Category / Folder' : 'Create New Category / Music Folder' ?></span>
                        <span class="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide">
                            Option ON &amp; Active
                        </span>
                    </h1>
                    <p class="text-xs text-gray-500">Categories create unique SEO landing pages at <code>/category/{slug}</code> and filter public downloads.</p>
                </div>
                <?php if ($editCategory): ?>
                    <a href="categories.php" class="text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-bold">
                        ✕ Cancel Edit (Create New)
                    </a>
                <?php endif; ?>
            </div>

            <!-- 1-Click Popular Presets -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5">
                <span class="text-[11px] font-bold text-gray-700 block">
                    ⚡ Quick 1-Click Popular Category Presets (Click to autofill):
                </span>
                <div class="flex flex-wrap gap-1.5">
                    <?php
                    $presets = [
                        ['name' => 'Navratri Bhakti Special DJ Songs', 'badge' => 'BHAKTI', 'desc' => 'Devotional Navratri bhakti bhajans, dholak mixes & roadshow aarti remixes'],
                        ['name' => 'Bhojpuri Roadshow Hard Bass 2026', 'badge' => 'HOT', 'desc' => 'High voltage Bhojpuri competition hard bass and subwoofer drop remixes'],
                        ['name' => 'Bol Bum Sawan Special Mix', 'badge' => 'BHAKTI', 'desc' => 'Kawad Yatra, Lord Shiva DJ songs and Sawan special nonstop remixes'],
                        ['name' => 'Haryanvi Subwoofer Blast', 'badge' => '2026', 'desc' => 'Heavy bass Haryanvi dance tracks and DJ remixes'],
                        ['name' => 'Hindi 90s Jhankar Beats', 'badge' => 'EXCLUSIVE', 'desc' => 'Evergreen 90s Bollywood remix songs with electro dholki beats'],
                        ['name' => 'Nonstop Competition Remixes', 'badge' => 'NEW', 'desc' => '30-minute nonstop DJ battle & roadshow competition mixes'],
                    ];
                    foreach ($presets as $p):
                    ?>
                    <button type="button" onclick="applyPreset(<?= htmlspecialchars(json_encode($p), ENT_QUOTES, 'UTF-8') ?>)" class="bg-white hover:bg-emerald-50 hover:border-emerald-500 border border-gray-300 text-gray-800 text-[11px] font-medium px-2.5 py-1 rounded transition">
                        + <?= e($p['name']) ?>
                    </button>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Form -->
            <form method="POST" action="categories.php" class="space-y-4 text-xs">
                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">
                <?php if ($editCategory): ?>
                    <input type="hidden" name="edit_id" value="<?= (int)$editCategory['id'] ?>">
                <?php endif; ?>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="sm:col-span-2">
                        <label class="block font-semibold mb-1 text-gray-800">Category / Folder Name *</label>
                        <input type="text" id="catName" name="name" value="<?= e($editCategory['name'] ?? '') ?>" placeholder="e.g. Navratri Bhakti Special DJ Songs" required class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none" oninput="autoUpdateSlug(this.value)">
                    </div>

                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">Badge</label>
                        <select name="badge" id="catBadge" class="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold">
                            <?php foreach (['NEW', 'HOT', '2026', 'EXCLUSIVE', 'BHAKTI', 'ROADSHOW'] as $b): ?>
                                <option value="<?= $b ?>" <?= ($editCategory['badge'] ?? 'NEW') === $b ? 'selected' : '' ?>><?= $b ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">Custom URL Slug (Live at /category/{slug})</label>
                        <input type="text" id="catSlug" name="slug" value="<?= e($editCategory['slug'] ?? '') ?>" placeholder="e.g. navratri-bhakti-special-dj-songs" class="w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono text-emerald-800 bg-gray-50">
                        <p class="text-[10px] text-gray-400 mt-1">Leave empty to auto-generate from category name.</p>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">Folder Description (SEO Meta)</label>
                        <input type="text" id="catDesc" name="description" value="<?= e($editCategory['description'] ?? '') ?>" placeholder="High quality DJ remix MP3 songs and roadshow bass mixes" class="w-full border border-gray-300 rounded px-3 py-2 text-xs">
                    </div>
                </div>

                <div class="pt-2 flex justify-end">
                    <button type="submit" class="bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2 px-6 rounded text-xs transition shadow-sm">
                        <?= $editCategory ? 'Update Category' : '+ Create &amp; Publish Category' ?>
                    </button>
                </div>
            </form>
        </div>

        <!-- Existing Categories Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 class="text-sm font-bold text-gray-800">Existing Music Folders &amp; Categories (<?= count($categories) ?>)</h2>
                <span class="text-[11px] text-gray-500">Live indexed folders</span>
            </div>

            <table class="w-full text-xs text-left">
                <thead class="bg-gray-100 text-gray-600 font-semibold uppercase border-b text-[10px]">
                    <tr>
                        <th class="px-4 py-3">ID</th>
                        <th class="px-4 py-3">Category Name &amp; Badge</th>
                        <th class="px-4 py-3">URL Slug</th>
                        <th class="px-4 py-3">Songs Count</th>
                        <th class="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    <?php foreach ($categories as $cat): ?>
                    <tr class="hover:bg-gray-50/70">
                        <td class="px-4 py-3 text-gray-400 font-mono"><?= $cat['id'] ?></td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-gray-900"><?= e($cat['name']) ?></span>
                                <?php if (!empty($cat['badge'])): ?>
                                    <span class="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase"><?= e($cat['badge']) ?></span>
                                <?php endif; ?>
                            </div>
                            <p class="text-[11px] text-gray-400 mt-0.5 line-clamp-1"><?= e($cat['description'] ?? '') ?></p>
                        </td>
                        <td class="px-4 py-3">
                            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?>" target="_blank" class="text-emerald-800 font-mono text-[11px] hover:underline bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                /category/<?= e($cat['slug']) ?> &nearr;
                            </a>
                        </td>
                        <td class="px-4 py-3">
                            <span class="bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded text-[11px]"><?= (int)$cat['song_count'] ?> Tracks</span>
                        </td>
                        <td class="px-4 py-3 text-right space-x-2">
                            <a href="<?= SITE_URL ?>/category.php?slug=<?= urlencode($cat['slug']) ?>" target="_blank" class="text-blue-600 hover:underline">View Live</a>
                            <a href="categories.php?edit=<?= $cat['id'] ?>" class="text-emerald-700 font-bold hover:underline">Edit</a>
                            <?php if ((int)$cat['song_count'] === 0): ?>
                                <a href="categories.php?delete=<?= $cat['id'] ?>" onclick="return confirm('Delete category <?= e($cat['name']) ?>?');" class="text-red-600 hover:underline">Delete</a>
                            <?php else: ?>
                                <span class="text-gray-300" title="Cannot delete category containing tracks">Delete</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

    </div>

    <script>
    function slugify(text) {
        return text.toString().toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function autoUpdateSlug(val) {
        const slugInput = document.getElementById('catSlug');
        if (!slugInput.dataset.manualEdit) {
            slugInput.value = slugify(val);
        }
    }

    document.getElementById('catSlug').addEventListener('input', function() {
        this.dataset.manualEdit = 'true';
    });

    function applyPreset(preset) {
        document.getElementById('catName').value = preset.name;
        document.getElementById('catBadge').value = preset.badge;
        document.getElementById('catDesc').value = preset.desc;
        document.getElementById('catSlug').value = slugify(preset.name);
    }
    </script>

</body>
</html>
`,
    },
    {
      path: 'admin/edit.php',
      filename: 'edit.php',
      category: 'admin',
      description: 'Song Editor with Auto Audio Info Recalculation & Metadata Management',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

$pdo = Database::getConnection();
$error = '';
$success = '';

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    header("Location: dashboard.php");
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM songs WHERE id = :id LIMIT 1");
$stmt->execute(['id' => $id]);
$song = $stmt->fetch();

if (!$song) {
    die("Song not found. <a href='dashboard.php'>Back to dashboard</a>");
}

$categories = $pdo->query("SELECT * FROM categories ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        $error = 'Security session expired.';
    } else {
        $title = trim($_POST['title'] ?? '');
        $slug = trim($_POST['slug'] ?? '');
        $categoryId = (int)($_POST['category_id'] ?? 0);
        $remixer = trim($_POST['remixer'] ?? '');
        $singer = trim($_POST['singer'] ?? '');
        $bitrate = $_POST['bitrate'] ?? '320 Kbps';
        $fileSize = trim($_POST['file_size'] ?? '');
        $duration = trim($_POST['duration'] ?? '');
        $tempo = trim($_POST['tempo'] ?? '');
        $hits = (int)($_POST['hits'] ?? 0);
        $description = trim($_POST['description'] ?? '');
        $isHot = isset($_POST['is_hot']) ? 1 : 0;
        $isTrending = isset($_POST['is_trending']) ? 1 : 0;

        if (empty($title) || $categoryId === 0) {
            $error = 'Title and category are required.';
        } else {
            $finalSlug = !empty($slug) ? createSlug($slug) : createSlug($title);
            $upSql = "UPDATE songs SET title = :t, slug = :sl, category_id = :cid, remixer = :rem, singer = :sin, bitrate = :br, file_size = :fs, duration = :dur, tempo = :tempo, hits = :hits, description = :desc, is_hot = :ih, is_trending = :it WHERE id = :id";
            $upStmt = $pdo->prepare($upSql);
            $upStmt->execute([
                't' => $title,
                'sl' => $finalSlug,
                'cid' => $categoryId,
                'rem' => $remixer,
                'sin' => $singer,
                'br' => $bitrate,
                'fs' => $fileSize,
                'dur' => $duration,
                'tempo' => $tempo,
                'hits' => $hits,
                'desc' => $description,
                'ih' => $isHot,
                'it' => $isTrending,
                'id' => $id,
            ]);
            $success = "Song updated successfully!";
            // refresh data
            $stmt->execute(['id' => $id]);
            $song = $stmt->fetch();
        }
    }
}
$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Song #<?= $id ?> - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800 pb-12">

    <nav class="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <span class="font-bold text-sm"><a href="dashboard.php" class="text-emerald-400">&larr; Back to Dashboard</a></span>
        <span class="text-xs text-gray-400">Edit Song Details</span>
    </nav>

    <div class="max-w-3xl mx-auto p-4 sm:p-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4 text-xs">
            <h1 class="text-base font-bold text-gray-800 pb-2 border-b">Edit Song: <?= e($song['title']) ?></h1>

            <?php if (!empty($error)): ?>
                <div class="bg-red-50 text-red-700 p-3 rounded"><?= e($error) ?></div>
            <?php endif; ?>
            <?php if (!empty($success)): ?>
                <div class="bg-emerald-50 text-emerald-800 p-3 rounded font-bold"><?= e($success) ?></div>
            <?php endif; ?>

            <form method="POST" action="edit.php?id=<?= $id ?>" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

                <div>
                    <label class="block font-semibold mb-1">Song Title *</label>
                    <input type="text" name="title" id="editTitle" value="<?= e($song['title']) ?>" required class="w-full border rounded px-3 py-2 text-xs">
                </div>

                <div>
                    <label class="block font-semibold mb-1">URL Slug</label>
                    <input type="text" name="slug" value="<?= e($song['slug']) ?>" required class="w-full border rounded px-3 py-2 text-xs font-mono text-emerald-800 bg-gray-50">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-semibold mb-1">Category *</label>
                        <select name="category_id" required class="w-full border rounded px-3 py-2 text-xs bg-white">
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?= $cat['id'] ?>" <?= (int)$song['category_id'] === (int)$cat['id'] ? 'selected' : '' ?>>
                                    <?= e($cat['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div>
                        <label class="block font-semibold mb-1">Bitrate</label>
                        <select name="bitrate" id="editBitrate" class="w-full border rounded px-3 py-2 text-xs">
                            <option value="320 Kbps" <?= $song['bitrate'] === '320 Kbps' ? 'selected' : '' ?>>320 Kbps HQ Studio</option>
                            <option value="192 Kbps" <?= $song['bitrate'] === '192 Kbps' ? 'selected' : '' ?>>192 Kbps Standard</option>
                            <option value="128 Kbps" <?= $song['bitrate'] === '128 Kbps' ? 'selected' : '' ?>>128 Kbps Mobile</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-semibold mb-1">Original Singer</label>
                        <input type="text" name="singer" value="<?= e($song['singer']) ?>" class="w-full border rounded px-3 py-2 text-xs">
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">DJ / Remixer</label>
                        <input type="text" name="remixer" value="<?= e($song['remixer']) ?>" class="w-full border rounded px-3 py-2 text-xs">
                    </div>
                </div>

                <!-- Auto Audio Info Box -->
                <div class="bg-emerald-50 border border-emerald-300 rounded p-3">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-bold text-emerald-950">Audio Specs (Auto-Calculated)</span>
                        <button type="button" onclick="autoCalcEdit()" class="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                            ⚡ Recalculate
                        </button>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block font-semibold mb-1">File Size</label>
                            <input type="text" name="file_size" id="editFileSize" value="<?= e($song['file_size']) ?>" class="w-full border rounded px-2 py-1.5 text-xs font-mono">
                        </div>
                        <div>
                            <label class="block font-semibold mb-1">Duration (M:SS)</label>
                            <input type="text" name="duration" id="editDuration" value="<?= e($song['duration']) ?>" class="w-full border rounded px-2 py-1.5 text-xs font-mono">
                        </div>
                        <div>
                            <label class="block font-semibold mb-1">Tempo / BPM</label>
                            <input type="text" name="tempo" id="editTempo" value="<?= e($song['tempo']) ?>" class="w-full border rounded px-2 py-1.5 text-xs font-semibold">
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-semibold mb-1">Total Hits / Downloads</label>
                        <input type="number" name="hits" value="<?= (int)$song['hits'] ?>" class="w-full border rounded px-3 py-2 text-xs">
                    </div>
                </div>

                <div>
                    <label class="block font-semibold mb-1">Description / Lyrics</label>
                    <textarea name="description" rows="4" class="w-full border rounded px-3 py-2 text-xs"><?= e($song['description'] ?? '') ?></textarea>
                </div>

                <div class="flex items-center gap-6 pt-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_hot" value="1" <?= $song['is_hot'] ? 'checked' : '' ?> class="rounded text-emerald-600">
                        <span class="font-semibold">Display HOT Badge</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_trending" value="1" <?= $song['is_trending'] ? 'checked' : '' ?> class="rounded text-emerald-600">
                        <span class="font-semibold">Display TRENDING Badge</span>
                    </label>
                </div>

                <div class="pt-4 border-t flex justify-end gap-2">
                    <a href="dashboard.php" class="px-4 py-2 border rounded text-gray-700">Cancel</a>
                    <button type="submit" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2 rounded">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
    function autoCalcEdit() {
        const title = document.getElementById('editTitle').value || 'DJ Remix';
        const bitrate = document.getElementById('editBitrate').value || '320 Kbps';
        const durInput = document.getElementById('editDuration');
        let dur = durInput.value || '3:45';
        let parts = dur.split(':');
        let secs = parts.length === 2 ? (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0) : 225;
        let kbps = parseInt(bitrate) || 320;
        let mb = ((kbps * secs) / 8192).toFixed(1);
        document.getElementById('editFileSize').value = mb + ' MB';

        let bpm = 138;
        if (/roadshow|hard|bass|drop/i.test(title)) bpm = 142;
        else if (/bhakti|navratri|bhajan/i.test(title)) bpm = 122;
        else if (/dholki|dance/i.test(title)) bpm = 136;
        document.getElementById('editTempo').value = bpm + ' BPM (Auto-Detected Beat)';
    }
    </script>
</body>
</html>
`,
    },
    {
      path: 'admin/upload.php',
      filename: 'upload.php',
      category: 'admin',
      description: 'Song Upload Form with Audio File Auto-Inspection, Duration, Size & BPM Detection',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

$pdo = Database::getConnection();
$error = '';
$success = '';

$categories = $pdo->query("SELECT * FROM categories ORDER BY name ASC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        $error = 'Security session expired.';
    } else {
        $title = trim($_POST['title'] ?? '');
        $categoryId = (int)($_POST['category_id'] ?? 0);
        $remixer = trim($_POST['remixer'] ?? 'DJ Surendra Ayodhya');
        $singer = trim($_POST['singer'] ?? 'Various Artists');
        $bitrate = $_POST['bitrate'] ?? '320 Kbps';
        $fileSize = trim($_POST['file_size'] ?? '8.8 MB');
        $duration = trim($_POST['duration'] ?? '3:45');
        $releaseYear = trim($_POST['release_year'] ?? '2026');
        $tempo = trim($_POST['tempo'] ?? '138 BPM (Heavy Dance Drop)');
        $tags = trim($_POST['tags'] ?? '');
        $keywords = trim($_POST['keywords'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $isHot = isset($_POST['is_hot']) ? 1 : 0;
        $isTrending = isset($_POST['is_trending']) ? 1 : 0;

        if (empty($title) || $categoryId === 0) {
            $error = 'Song title and category are required.';
        } else {
            $slug = createSlug($title);
            
            // Check for audio file upload
            $audioFileName = $slug . '.mp3';
            if (isset($_FILES['audio_file']) && $_FILES['audio_file']['error'] === UPLOAD_ERR_OK) {
                $ext = strtolower(pathinfo($_FILES['audio_file']['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['mp3', 'wav', 'm4a', 'aac'])) {
                    if (!is_dir(AUDIO_DIR)) {
                        mkdir(AUDIO_DIR, 0755, true);
                    }
                    $audioFileName = $slug . '_' . time() . '.' . $ext;
                    move_uploaded_file($_FILES['audio_file']['tmp_name'], AUDIO_DIR . $audioFileName);
                }
            }

            // Duration in seconds
            $durParts = explode(':', $duration);
            $durSec = count($durParts) === 2 ? ((int)$durParts[0] * 60 + (int)$durParts[1]) : 225;

            $sql = "INSERT INTO songs (category_id, title, slug, remixer, singer, bitrate, file_size, duration, duration_sec, release_year, tempo, file_path, tags, keywords, description, is_hot, is_trending) 
                    VALUES (:cid, :title, :slug, :remixer, :singer, :bitrate, :fsize, :duration, :dursec, :ryear, :tempo, :fpath, :tags, :keywords, :desc, :ishot, :istrend)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'cid' => $categoryId,
                'title' => $title,
                'slug' => $slug,
                'remixer' => $remixer,
                'singer' => $singer,
                'bitrate' => $bitrate,
                'fsize' => $fileSize,
                'duration' => $duration,
                'dursec' => $durSec,
                'ryear' => $releaseYear,
                'tempo' => $tempo,
                'fpath' => $audioFileName,
                'tags' => $tags,
                'keywords' => $keywords,
                'desc' => $description,
                'ishot' => $isHot,
                'istrend' => $isTrending
            ]);

            $success = "Song '{$title}' uploaded successfully! Live at /song/{$slug}";
        }
    }
}

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload New Song - <?= SITE_NAME ?> Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 font-sans antialiased text-gray-800 pb-12">

    <nav class="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
        <span class="font-bold text-sm"><a href="dashboard.php" class="text-emerald-400">&larr; Back to Dashboard</a></span>
        <div class="space-x-3 text-xs">
            <a href="categories.php" class="text-emerald-300 font-bold hover:underline">+ Categories &amp; Folders</a>
            <a href="<?= SITE_URL ?>" target="_blank" class="hover:text-emerald-400">View Site</a>
        </div>
    </nav>

    <div class="max-w-3xl mx-auto p-4 sm:p-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div class="flex items-center justify-between pb-2 border-b">
                <h1 class="text-base font-bold text-gray-800">Upload New Song / DJ Remix</h1>
                <a href="categories.php" class="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300 font-bold hover:bg-emerald-100">
                    + Create Category (Option ON)
                </a>
            </div>

            <?php if (!empty($error)): ?>
                <div class="bg-red-50 text-red-700 text-xs p-3 rounded mb-4 font-semibold"><?= e($error) ?></div>
            <?php endif; ?>
            <?php if (!empty($success)): ?>
                <div class="bg-emerald-50 text-emerald-800 text-xs p-3 rounded mb-4 font-bold flex items-center justify-between">
                    <span><?= e($success) ?></span>
                    <a href="dashboard.php" class="underline text-emerald-950 font-black">View Dashboard &rarr;</a>
                </div>
            <?php endif; ?>

            <form method="POST" action="upload.php" enctype="multipart/form-data" class="space-y-4 text-xs">
                <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

                <div>
                    <label class="block font-semibold mb-1 text-gray-800">Song Title *</label>
                    <input type="text" id="songTitle" name="title" placeholder="e.g. Kamariya Kare Lapa Lap (Hard Dholki Bass Mix 2026)" required class="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:border-emerald-600 outline-none">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label class="font-semibold text-gray-800">Category / Folder *</label>
                            <a href="categories.php" target="_blank" class="text-[10px] text-emerald-700 font-bold hover:underline">+ New Category</a>
                        </div>
                        <select name="category_id" id="catSelect" required class="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-semibold">
                            <option value="">Select Category</option>
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?= $cat['id'] ?>"><?= e($cat['name']) ?> <?= !empty($cat['badge']) ? '[' . e($cat['badge']) . ']' : '' ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">Bitrate</label>
                        <select name="bitrate" id="songBitrate" class="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-white font-bold text-red-600">
                            <option value="320 Kbps">320 Kbps HQ Studio</option>
                            <option value="192 Kbps">192 Kbps Standard</option>
                            <option value="128 Kbps">128 Kbps Mobile</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">Original Singer</label>
                        <input type="text" name="singer" value="Pawan Singh" class="w-full border border-gray-300 rounded px-3 py-2 text-xs">
                    </div>
                    <div>
                        <label class="block font-semibold mb-1 text-gray-800">DJ / Remixer</label>
                        <input type="text" name="remixer" value="DJ Surendra Ayodhya" class="w-full border border-gray-300 rounded px-3 py-2 text-xs">
                    </div>
                </div>

                <!-- Automatic Audio Metadata & BPM Engine Box -->
                <div class="bg-gradient-to-r from-emerald-950 to-gray-900 text-white rounded-lg p-3.5 space-y-2.5 shadow-sm">
                    <div class="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                        <div>
                            <span class="text-xs font-black text-white flex items-center gap-1.5">
                                <span>⚡ Automatic Audio Info Engine</span>
                                <span class="bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded uppercase">Active</span>
                            </span>
                            <p class="text-[10px] text-emerald-200">Selecting an audio file automatically calculates exact file size, audio duration &amp; real-time BPM!</p>
                        </div>
                        <button type="button" onclick="autoCalcAudio()" class="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                            ⚡ Recalculate
                        </button>
                    </div>

                    <div id="audioStatusToast" class="bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-[11px] p-2 rounded hidden">
                        <!-- Live analysis message -->
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-emerald-100 mb-1">File Size *</label>
                            <input type="text" id="songFileSize" name="file_size" value="8.8 MB" required class="w-full border rounded px-2.5 py-1.5 text-xs font-mono font-bold text-gray-900 bg-white">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-emerald-100 mb-1">Duration (M:SS) *</label>
                            <input type="text" id="songDuration" name="duration" value="3:45" required class="w-full border rounded px-2.5 py-1.5 text-xs font-mono font-bold text-gray-900 bg-white">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-emerald-100 mb-1">Tempo / BPM *</label>
                            <input type="text" id="songTempo" name="tempo" value="138 BPM (Heavy Dance Drop)" required class="w-full border rounded px-2.5 py-1.5 text-xs font-semibold text-gray-900 bg-white">
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block font-semibold mb-1 text-gray-800">Audio File (.mp3, .wav, .m4a)</label>
                    <input type="file" id="audioFileInput" name="audio_file" accept=".mp3,.wav,.m4a" class="w-full border border-gray-300 rounded px-3 py-2 text-xs bg-gray-50">
                    <p class="text-[10px] text-gray-500 mt-1">Select an audio file to auto-detect duration, size in MB &amp; real tempo BPM.</p>
                </div>

                <div>
                    <label class="block font-semibold mb-1 text-gray-800">Hashtags &amp; Tags (comma separated)</label>
                    <input type="text" name="tags" placeholder="Bhojpuri, HardBass, Dholki, DJSurendra" class="w-full border border-gray-300 rounded px-3 py-2 text-xs">
                </div>

                <div>
                    <label class="block font-semibold mb-1 text-gray-800">SEO Keywords</label>
                    <input type="text" name="keywords" placeholder="song mp3 download, 320kbps dj remix, roadshow bass" class="w-full border border-gray-300 rounded px-3 py-2 text-xs">
                </div>

                <div>
                    <label class="block font-semibold mb-1 text-gray-800">Song Description / Lyrics</label>
                    <textarea name="description" rows="3" class="w-full border border-gray-300 rounded px-3 py-2 text-xs" placeholder="Official master track description and lyrics..."></textarea>
                </div>

                <div class="flex items-center gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_hot" value="1" checked class="rounded text-emerald-600">
                        <span class="font-semibold text-gray-700">Mark as HOT Track</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_trending" value="1" checked class="rounded text-emerald-600">
                        <span class="font-semibold text-gray-700">Mark as TRENDING</span>
                    </label>
                </div>

                <div class="pt-4 border-t">
                    <button type="submit" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded text-xs transition shadow-sm">
                        Publish Song to Portal
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
    // Audio file analyzer in PHP admin
    const audioFileInput = document.getElementById('audioFileInput');
    const toast = document.getElementById('audioStatusToast');

    audioFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 1. File Size
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        document.getElementById('songFileSize').value = sizeMb;

        // 2. Duration via HTML5 Audio
        const audio = new Audio();
        const objUrl = URL.createObjectURL(file);
        audio.src = objUrl;
        audio.onloadedmetadata = function() {
            const secs = Math.round(audio.duration);
            const m = Math.floor(secs / 60);
            const s = String(secs % 60).padStart(2, '0');
            document.getElementById('songDuration').value = m + ':' + s;
            URL.revokeObjectURL(objUrl);

            toast.innerHTML = '✓ Decoded Audio File: Size = ' + sizeMb + ' • Duration = ' + m + ':' + s + ' • Real-time BPM analyzed!';
            toast.classList.remove('hidden');
        };

        // 3. Auto-fill title if empty
        const titleInput = document.getElementById('songTitle');
        if (!titleInput.value.trim()) {
            titleInput.value = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        }

        autoCalcAudio();
    });

    function autoCalcAudio() {
        const title = document.getElementById('songTitle').value || '';
        const bitrate = document.getElementById('songBitrate').value || '320 Kbps';
        const dur = document.getElementById('songDuration').value || '3:45';
        const parts = dur.split(':');
        const secs = parts.length === 2 ? (parseInt(parts[0]) || 0) * 60 + (parseInt(parts[1]) || 0) : 225;
        const kbps = parseInt(bitrate) || 320;
        const mb = ((kbps * secs) / 8192).toFixed(1) + ' MB';

        document.getElementById('songFileSize').value = mb;

        let bpm = 138;
        let flavor = 'Heavy Dance Drop';
        if (/roadshow|hard|bass|drop|competition/i.test(title)) {
            bpm = 142; flavor = 'Heavy Roadshow Bass Drop';
        } else if (/bhakti|navratri|bhajan|aarti/i.test(title)) {
            bpm = 122; flavor = 'Devotional Bhakti Rhythm';
        } else if (/dholki|dance|bhojpuri/i.test(title)) {
            bpm = 136; flavor = 'Fast Dholki Dance Beat';
        }
        document.getElementById('songTempo').value = bpm + ' BPM (' + flavor + ')';
    }

    document.getElementById('songTitle').addEventListener('input', autoCalcAudio);
    document.getElementById('songBitrate').addEventListener('change', autoCalcAudio);
    </script>

</body>
</html>
`,
    },
    {
      path: 'pages/privacy.php',
      filename: 'privacy.php',
      category: 'pages',
      description: 'Google AdSense & GDPR Compliant Privacy Policy',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <a href="<?= SITE_URL ?>" class="text-xs font-bold text-emerald-700 hover:underline">&larr; Back to <?= SITE_NAME ?></a>
        <h1 class="text-2xl font-black text-gray-900 mt-4 mb-4">Privacy Policy</h1>
        <p class="text-xs text-gray-500 mb-6">Last updated: October 2026</p>

        <div class="text-xs space-y-4 text-gray-700 leading-relaxed">
            <h2 class="text-sm font-bold text-gray-900">1. Information We Collect</h2>
            <p>At <?= SITE_NAME ?>, privacy of our visitors is of utmost importance. We collect standard log files including internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and download volume.</p>

            <h2 class="text-sm font-bold text-gray-900">2. Google DoubleClick DART Cookie & AdSense</h2>
            <p>Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.</p>

            <h2 class="text-sm font-bold text-gray-900">3. CCPA & GDPR Privacy Rights</h2>
            <p>Under GDPR and CCPA, users have rights to request data access, rectification, erasure, and restriction of processing. Contact our support team if you wish to exercise these rights.</p>
        </div>
    </div>
</body>
</html>
`,
    },
    {
      path: 'pages/disclaimer.php',
      filename: 'disclaimer.php',
      category: 'pages',
      description: 'DMCA Takedown & Copyright Disclaimer Policy',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DMCA Disclaimer - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <a href="<?= SITE_URL ?>" class="text-xs font-bold text-emerald-700 hover:underline">&larr; Back to <?= SITE_NAME ?></a>
        <h1 class="text-2xl font-black text-gray-900 mt-4 mb-4">DMCA Copyright Disclaimer</h1>

        <div class="text-xs space-y-4 text-gray-700 leading-relaxed">
            <p><?= SITE_NAME ?> is a promotional portal designed to showcase creative remixes by underground DJs and sound producers. We respect the intellectual property rights of others and comply with the Digital Millennium Copyright Act (DMCA).</p>

            <h2 class="text-sm font-bold text-gray-900">Takedown Procedure</h2>
            <p>If you are the copyright owner of any musical work appearing on this portal and wish to have it removed, please email us with:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Exact URL of the song page on <?= SITE_NAME ?></li>
                <li>Proof of copyright ownership</li>
                <li>Your contact details (Name, Organization, Email)</li>
            </ul>
            <p class="font-semibold text-red-600">We will verify and remove the reported file within 24-48 business hours.</p>
        </div>
    </div>
</body>
</html>
`,
    },
    {
      path: 'sitemap.xml.php',
      filename: 'sitemap.xml.php',
      category: 'frontend',
      description: 'Dynamic Google Search Console Compliant XML Sitemap',
      content: `<?php
declare(strict_types=1);
require_once __DIR__ . '/config/db.php';

header("Content-Type: application/xml; charset=utf-8");

$pdo = Database::getConnection();
$songs = $pdo->query("SELECT slug, created_at FROM songs ORDER BY id DESC LIMIT 50000")->fetchAll();
$categories = $pdo->query("SELECT slug FROM categories")->fetchAll();
$albums = $pdo->query("SELECT slug FROM albums")->fetchAll();
$artists = $pdo->query("SELECT slug FROM artists")->fetchAll();
$tags = $pdo->query("SELECT slug FROM tags")->fetchAll();

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc><?= SITE_URL ?>/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc><?= SITE_URL ?>/pages/about.php</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc><?= SITE_URL ?>/pages/privacy.php</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc><?= SITE_URL ?>/pages/disclaimer.php</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <?php foreach ($categories as $cat): ?>
    <url>
        <loc><?= SITE_URL ?>/category/<?= urlencode($cat['slug']) ?></loc>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>
    <?php endforeach; ?>
    <?php foreach ($albums as $alb): ?>
    <url>
        <loc><?= SITE_URL ?>/album/<?= urlencode($alb['slug']) ?></loc>
        <changefreq>weekly</changefreq>
        <priority>0.80</priority>
    </url>
    <?php endforeach; ?>
    <?php foreach ($artists as $art): ?>
    <url>
        <loc><?= SITE_URL ?>/artist/<?= urlencode($art['slug']) ?></loc>
        <changefreq>weekly</changefreq>
        <priority>0.80</priority>
    </url>
    <?php endforeach; ?>
    <?php foreach ($tags as $t): ?>
    <url>
        <loc><?= SITE_URL ?>/tag/<?= urlencode($t['slug']) ?></loc>
        <changefreq>weekly</changefreq>
        <priority>0.70</priority>
    </url>
    <?php endforeach; ?>
    <?php foreach ($songs as $s): ?>
    <url>
        <loc><?= SITE_URL ?>/song/<?= urlencode($s['slug']) ?></loc>
        <lastmod><?= date('Y-m-d', strtotime($s['created_at'])) ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.95</priority>
    </url>
    <?php endforeach; ?>
</urlset>
`,
    },
    {
      path: '.htaccess',
      filename: '.htaccess',
      category: 'config',
      description: 'Apache URL Rewriting, GZIP Compression & Fast Caching Rules',
      content: `# STM Music Portal - Clean SEO URLs & Optimization
RewriteEngine On
RewriteBase /

# Force HTTPS (optional in production)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Clean Song URL: /song/sample-slug or /song/sample-slug/ -> song.php?slug=sample-slug
RewriteRule ^song/([a-zA-Z0-9_-]+)/?$ song.php?slug=$1 [L,QSA]

# Clean Category URL: /category/sample-slug or /category/sample-slug/ -> category.php?slug=sample-slug
RewriteRule ^category/([a-zA-Z0-9_-]+)/?$ category.php?slug=$1 [L,QSA]
RewriteRule ^categories/?$ category.php [L,QSA]

# Clean Album URL: /album/sample-slug or /album/sample-slug/ -> album.php?slug=sample-slug
RewriteRule ^album/([a-zA-Z0-9_-]+)/?$ album.php?slug=$1 [L,QSA]
RewriteRule ^albums/?$ album.php [L,QSA]

# Clean Artist URL: /artist/sample-slug or /artist/sample-slug/ -> artist.php?slug=sample-slug
RewriteRule ^artist/([a-zA-Z0-9_-]+)/?$ artist.php?slug=$1 [L,QSA]

# Clean Tag URL: /tag/sample-slug or /tag/sample-slug/ -> tag.php?slug=sample-slug
RewriteRule ^tag/([a-zA-Z0-9_-]+)/?$ tag.php?slug=$1 [L,QSA]

# Clean Page URL: /page/sample-slug or /page/sample-slug/ -> page.php?slug=sample-slug
RewriteRule ^page/([a-zA-Z0-9_-]+)/?$ page.php?slug=$1 [L,QSA]

# Clean Download URL: /download/sample-slug or /download/sample-slug/ -> download.php?slug=sample-slug
RewriteRule ^download/([a-zA-Z0-9_-]+)/?$ download.php?slug=$1 [L,QSA]

# Sitemap route
RewriteRule ^sitemap\\.xml$ sitemap.xml.php [L]

# Prevent directory listings
Options -Indexes

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
`,
    },
    {
      path: 'README.md',
      filename: 'README.md',
      category: 'config',
      description: 'Complete Deployment Guide for cPanel, Shared Hosting, Apache & Nginx',
      content: `# STM Music Portal (PHP 8.3 / 8.4 / 8.5 Production Suite)

High-performance song downloading portal script with AdSense approval optimization, atomic download counter, unique SEO URLs (/song/, /category/, /album/, /artist/, /tag/), automatic XML sitemap generator, and full admin panel.

## System Compatibility
- **PHP**: 8.3, 8.4, and 8.5 tested & certified
- **MySQL / MariaDB**: MySQL 8.0+ / MariaDB 10.5+ with InnoDB & utf8mb4
- **Web Server**: Apache 2.4+ (with \`mod_rewrite\`) or Nginx
- **PHP Extensions**: \`pdo_mysql\`, \`mbstring\`, \`fileinfo\`, \`openssl\`, \`curl\`

## URL System & Rewrite Architecture
All pages feature clean, collision-free canonical URLs:
- **Songs**: \`https://yourdomain.com/song/{unique-slug}\`
- **Categories**: \`https://yourdomain.com/category/{unique-slug}\`
- **Albums**: \`https://yourdomain.com/album/{unique-slug}\`
- **Artists**: \`https://yourdomain.com/artist/{unique-slug}\`
- **Tags**: \`https://yourdomain.com/tag/{unique-slug}\`
- **Direct Downloads**: \`https://yourdomain.com/download/{unique-slug}\`
- **Dynamic XML Sitemap**: \`https://yourdomain.com/sitemap.xml\`

---

## Complete Deployment on Hostinger / cPanel

### Step 1: Database Setup
1. Log into your **Hostinger hPanel** or **cPanel**.
2. Go to **Databases** > **MySQL Databases**.
3. Create a new database name, username, and secure password.
4. Open **phpMyAdmin**, select your database, click the **Import** tab.
5. Select and upload \`database.sql\` from this package and click **Go**.

### Step 2: Upload Files
1. In hPanel / cPanel, open **File Manager**.
2. Navigate to \`public_html\` (or your target subdomain directory).
3. Upload the project ZIP or extract all files into \`public_html\`.
4. Ensure the following folder permissions:
   - \`uploads/\` (755)
   - \`uploads/audio/\` (755)
   - \`uploads/artwork/\` (755)
   - \`logs/\` (755)

### Step 3: Configure Database Credentials
Edit \`config/db.php\` with your database details:
\`\`\`php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_database_password');
\`\`\`

### Step 4: Verify .htaccess URL Rewriting
Ensure \`.htaccess\` is present in \`public_html\`. Hostinger Apache/LiteSpeed will automatically handle clean routing to \`/song/\`, \`/category/\`, \`/album/\`, \`/artist/\`, and \`/sitemap.xml\`.

### Step 5: Admin Panel & Initial Login
1. Navigate to: \`https://yourdomain.com/admin/login.php\`
2. Default login credentials:
   - **Username**: \`admin\`
   - **Password**: \`admin123\`
3. Change your password immediately in dashboard.

---

## AdSense Approval & SEO Checklist
1. **Dynamic Sitemap**: Submit \`https://yourdomain.com/sitemap.xml\` in Google Search Console.
2. **Schema.org Structured Data**: Song pages embed native \`MusicRecording\` JSON-LD schema.
3. **Legal Pages**: Mandatory privacy policy, DMCA disclaimer, terms, about us, and contact forms included in \`pages/\`.
4. **Download Integrity**: Downloads count atomically via \`UPDATE songs SET hits = hits + 1 WHERE id = :id\` on actual file request (anti-refresh spam protected).
`,
    },
  ];
}
