<?php
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
