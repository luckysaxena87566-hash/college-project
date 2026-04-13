<?php
session_start();
$success = $_SESSION['success'] ?? 'Message sent successfully!';
unset($_SESSION['success']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Success - PHP Contact Form</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style> body { background-color: #f8f9fa; } .success-container { max-width: 500px; margin: 100px auto; text-align: center; } </style>
</head>
<body>
    <div class="container">
        <div class="success-container">
            <div class="alert alert-success">
                <h4>✅ Success!</h4>
                <p><?= htmlspecialchars($success) ?></p>
            </div>
            <a href="index.php" class="btn btn-primary">Send Another Message</a>
        </div>
    </div>
</body>
</html>

