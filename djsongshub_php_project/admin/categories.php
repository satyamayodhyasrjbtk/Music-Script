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
            .replace(/[^ws-]/g, '')
            .replace(/[s_-]+/g, '-')
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
