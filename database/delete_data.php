<html>
    <head>
        <title>
            delete data 
</title>
</head>
<body>
<center>
<?php
$mycon=mysqli_connect("localhost","root","Lucky2001@","college_student");
session_start();
$Stu_id=$_SESSION['$Stu_id'];
$sql="delete from student_info where stu_id=?";
$ps=$mycon->prepare($sql);
$ps->bind_param("i",$Stu_id);
$ps->execute();
echo "Record deleted successfully";
?>
</center>
</body>
</html>