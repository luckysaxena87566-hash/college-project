<html>
    <head>
        <title>
            page two
</title>
</head>
<body>
<center>
    <?php
        $user=$_COOKIE['username']; //$ckname='username'
        $pass=$_COOKIE['password']; //$ckpass="password"; 
        echo "user name in second page".$user;
        echo "<br>password in second page".$pass;
    ?>
</center>
</body>
</html>
