<?php
declare(strict_types=1);
require_once __DIR__ . '/../config/db.php';

$pdo = Database::getConnection();
$error = '';

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($token)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($username) || empty($password)) {
            $error = 'Username and password are required.';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :u LIMIT 1");
            $stmt->execute(['u' => $username]);
            $admin = $stmt->fetch();

            if ($admin && password_verify($password, $admin['password_hash'])) {
                session_regenerate_id(true);
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_user'] = $admin['username'];
                header("Location: dashboard.php");
                exit;
            } else {
                $error = 'Invalid credentials. Default: admin / admin123';
            }
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
    <title>Admin Login - STM Music Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 flex items-center justify-center min-h-screen p-4">

    <div class="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div class="text-center mb-6">
            <div class="bg-emerald-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-black">
                &#9881;
            </div>
            <h1 class="text-lg font-bold text-white">Music Portal Admin</h1>
            <p class="text-xs text-gray-400 mt-1">PHP 8.3 / 8.4 / 8.5 Secure Panel</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="bg-red-900/50 border border-red-500 text-red-200 text-xs p-3 rounded mb-4">
                <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php" class="space-y-4">
            <input type="hidden" name="csrf_token" value="<?= $csrfToken ?>">

            <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Admin Username</label>
                <input type="text" name="username" value="admin" required class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <input type="password" name="password" placeholder="••••••••" required class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500">
            </div>

            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded text-xs transition">
                Secure Sign In
            </button>
        </form>

        <div class="mt-4 pt-4 border-t border-gray-700 text-center text-[11px] text-gray-400">
            Default credentials: <span class="text-emerald-400 font-mono">admin / admin123</span>
        </div>
    </div>

</body>
</html>
