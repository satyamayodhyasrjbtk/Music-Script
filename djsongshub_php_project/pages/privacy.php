<?php
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
