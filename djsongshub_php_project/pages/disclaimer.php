<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DMCA Disclaimer - <?= SITE_NAME ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-800 font-sans p-6">
    <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <a href="<?= SITE_URL ?>" class="text-xs font-bold text-emerald-700 hover:underline">&larr; Back to <?= SITE_NAME ?></a>
        <h1 class="text-2xl font-black text-gray-900 mt-4 mb-4">DMCA Copyright Disclaimer</h1>

        <div class="text-xs space-y-4 text-gray-700 leading-relaxed">
            <p><?= SITE_NAME ?> is a promotional portal designed to showcase creative remixes by underground DJs and sound producers. We respect the intellectual property rights of others and comply with the Digital Millennium Copyright Act (DMCA).</p>

            <h2 class="text-sm font-bold text-gray-900">Takedown Procedure</h2>
            <p>If you are the copyright owner of any musical work appearing on this portal and wish to have it removed, please email us with:</p>
            <ul class="list-disc pl-5 space-y-1">
                <li>Exact URL of the song page on <?= SITE_NAME ?></li>
                <li>Proof of copyright ownership</li>
                <li>Your contact details (Name, Organization, Email)</li>
            </ul>
            <p class="font-semibold text-red-600">We will verify and remove the reported file within 24-48 business hours.</p>
        </div>
    </div>
</body>
</html>
