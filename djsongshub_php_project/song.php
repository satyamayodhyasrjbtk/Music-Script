<?php
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
