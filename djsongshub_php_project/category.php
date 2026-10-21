<?php
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
