<html>
    <head>
        <title>
            PHP login 
</title>
</head>
<body>
    <center>
        <?php
        $user=$_GET['textuser'];
        // echo "<h1>Full Name:-$user</h1>" ;
        $pass=$_GET['textpass'];
        // echo "<h1>Password:-$pass</h1>";   
        if($user=="Lucky" and $pass=="Lucky2001@")
            echo "valid user";
        else 
            echo "not a valid user";
        ?>
        
    </center>
</body>
</html>

