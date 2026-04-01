<html>
    <head>
        <title>
            page two
</title>
</head>
<body>
    <center>
        <?php
        session_start();
        $uname=$_SESSION['username'];
        $pname=$_SESSION['password'];
        echo "user name in next page".$uname;
        echo "<br>password jjjjj in next page".$pname;
        session_unset();
        session_destroy();
        ?>
</center>
</body>
</html>