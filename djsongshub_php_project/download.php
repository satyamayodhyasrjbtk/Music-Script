<?php
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
    echo str_repeat("ÿûd", 256);
    exit;
}
