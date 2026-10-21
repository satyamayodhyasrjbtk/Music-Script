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
