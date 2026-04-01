<html>
    <head>
        <title>
            delete record
</title>
</head>
<body>
    <center>
        <form method=POST action="delete_record.php">
            <table border=1>
                <tr>
                    <th> Student Id for delete</th>
                    <td><input type=text name=txtid></td>
</tr>
<tr><td></td>
<td><input type=submit value=search name=btnsubmit></td>
</tr>
</table>
</form>
<?php
if(isset($_POST['btnsubmit'])){
    $Stu_id=$_POST['txtid'];
    // echo $Stu_id;
    $mycon=mysqli_connect("localhost","root","Lucky2001@","college_student");
    $sql="select * from student_info where Stu_id=".$Stu_id;
    $record=$mycon->query($sql);
    $n=mysqli_num_rows($record);
    if($n>0){
        session_start();
        $_SESSION['$Stu_id']=$Stu_id;
        echo "<table border=1>";
        echo "<tr><th>Stu_id</th><th>First_name</th><th>Last_name</th><th>Course</th><th>City</th>";
        while($row=mysqli_fetch_assoc($record)){  //mysqli_fetch_row($record)
        echo "<tr>";
        echo "<td>".$row['Stu_id']."</td>";
        echo "<td>".$row['First_name']."</td>";
        echo "<td>".$row['Last_name']."</td>";
        echo "<td>".$row['Course']."</td>";
        echo "<td>".$row['City']."</td>";
        echo "<form method=POST action=delete_data.php>";
        echo "<td><input type=submit value=delete></td>";
        echo "</form>";
            echo "</tr>";
        }
        echo "</table>";
    }
    else 
        echo "<font color=red size=5>No record found</font>";
}
?>
</center>
</body>
</html>