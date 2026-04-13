<?php
session_start();
require_once 'config.php';


if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    header('Location: index.php?error=csrf');
    exit;
}


unset($_SESSION['csrf_token']);


$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');


$errors = [];
if (empty($name) || strlen($name) > 100) $errors[] = 'Invalid name';
if (empty($email) || strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email';
if (empty($subject) || strlen($subject) > 200) $errors[] = 'Invalid subject';
if (empty($message)) $errors[] = 'Message required';

if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    header('Location: index.php?error=validation');
    exit;
}

try {
    $stmt = $pdo->prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, $subject, $message]);
    
    $_SESSION['success'] = 'Thank you! Your message has been sent.';
    header('Location: success.php');
    exit;
    
} catch (PDOException $e) {
    error_log('DB Insert Error: ' . $e->getMessage());
    $_SESSION['errors'] = ['Submission failed. Please try again.'];
    header('Location: index.php?error=db');
    exit;
}
?>

