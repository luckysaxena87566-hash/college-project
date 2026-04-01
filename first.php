<html>

<head>
    <title>
        PHP
    </title>
</head>

<body>
    <center>
        <!-- <form method=GET action="checklogin.php"> -->
            <form method=POST action="first.php">
            <table border=1>
                <tr>
                    <th>User Name</th>
                    <td><input type=text name=textuser></td>
                </tr>
                <tr>
                    <th>Password</th>
                    <td><input type=password name=textpass></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input type="submit" value="Submit" name="submitbtn">
                        <input type="reset" value="Reset">
                    </td>
                </tr>
            </table>
        </form>
        <?php 
        if(isset($_POST['submitbtn'])){
             $user=$_POST['textuser'];
                // echo "<h1>Full Name:-$user</h1>" ;
            $pass=$_POST['textpass'];
                // echo "<h1>Password:-$pass</h1>";   
            if($user=="Lucky" and $pass=="Lucky2001@")
                echo "valid user";
            else 
                echo "not a valid user";
        
        }
        ?>
</body>

</html>