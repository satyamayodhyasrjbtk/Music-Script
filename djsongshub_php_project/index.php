<?php
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
