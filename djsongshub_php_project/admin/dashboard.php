<?php
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
