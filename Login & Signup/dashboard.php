<?php
require_once 'config.php';


if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$username = $_SESSION['username'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - PHP Login & Signup</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container dashboard">
        <h2>Dashboard</h2>
        
        <div class="welcome">
            <h3>Welcome, <?php echo htmlspecialchars($username); ?>!</h3>
            <p>You have successfully logged in.</p>
        </div>
        
        <div style="text-align: center; margin-top: 1rem;">
            <a href="logout.php" class="btn" style="display: inline-block; width: auto; padding: 0.75rem 2rem;">Logout</a>
        </div>
    </div>
</body>
</html>
