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

            $ckname="username";
            $ckvalue=$user;
            $ckpass="password";
            $ckpassvalue=$pass;
                setcookie($ckname,$ckvalue);
                setcookie($ckpass,$ckpassvalue);

            echo "user name:".$user;
            echo "<br>password:".$pass;
        ?>
        <form method=POST action=page_2.php>
            <input type=submit value=Submit>
</form>
</center>
</body>
</html>