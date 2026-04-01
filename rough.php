<!-- <?php
$i=1;
while($i<=10){
    ?>
    <p>Hello<?php echo $i ?></p>
    <?php $i++; 
}
?> -->

<!-- <?php 
$fruits=array("apple","banana","orange","mango");
print_r($fruits[0]);
foreach($fruits as $f){
    echo $f."<br>";
}?> -->

<!-- //assosicative array -->
<!-- <?php 
$emp=array(
    "Lucky" => "software engineer",
    "ashu" => "app developer",
    "anu" => "network developer"
);
foreach($emp as $key => $value){
    // echo $key.":".$value.'<br>';
    echo "<h1>$key : $value</h1>";
}
?> -->

<!-- //connection with database using oops concept; -->
<!-- /*<?php
$servername = "localhost";
$username = "root";
$password = "Lucky2001@";
$dbname = "rough_db";

// Connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check
if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

echo "OOP: Connected successfully";
?>*/ -->

<!-- <?php
$servername="localhost";
$username="root";
$password="Lucky2001@";
$dbname="rough_db";
 
// create connection
$conn= new mysqli($servername,$username,$password,$dbname);
//check connection
if($conn->connect_error){
    die("connection failed:".$conn->connect_error);
}
echo "connection successfully"
?> -->

<!-- connection with db using procedural concept; -->
<!-- <?php
$servername = "localhost";
$username = "root";
$password = "Lucky2001@";
$dbname = "rough_db";

// Connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check
if(!$conn){
    die("Connection failed: " . mysqli_connect_error());
}

echo "Procedural: Connected successfully";
?> -->

<?php
$servername="localhost";
$username="root";
$password="Lucky2001@";
$dbname="rough_d";

$conn = @mysqli_connect($servername,$username,$password,$dbname);
echo "connection successfully";
?>


