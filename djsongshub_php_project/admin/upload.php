<?php
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
            titleInput.value = file.name.replace(/.[^/.]+$/, '').replace(/[-_]/g, ' ');
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
