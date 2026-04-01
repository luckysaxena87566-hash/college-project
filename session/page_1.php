<html>
    <head>
        <title>
            page one
</title>
</head>
<body>
    <center>
        <?php
        $user=$_POST['textuser'];
        $pass=$_POST['textpass'];
        echo "user name:-".$user;
        echo "<br>password:-".$pass;
        session_start();
        $_SESSION['username']=$user;
        $_SESSION['password']=$pass;
        ?>
        <form method=POST action="page_2.php">
            <input type="submit" value="Submit">
</form>
</center>
</body>
</html>