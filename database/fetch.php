<hmtl>
    <head>
        <title>
            Db
</title>
</head>
<body>
    <center>
    <?php
   
    $mycon=mysqli_connect("localhost","root","Lucky2001@","college_student");
    // echo "connection success<br>";
    $sql="select * from student_info";
    // $sql="select * from student_info where First_name='Lucky'";
    $record=$mycon->query($sql);
    $n=mysqli_num_rows($record);
    // echo "Total record ".$n;
    if($n>0){
        echo "<table border=1>";
        echo "<tr><th>Stu_id</th><th>First_name</th><th>Last_name</th><th>Course</th><th>City</th>";
        while($row=mysqli_fetch_assoc($record)){  //mysqli_fetch_row($record)
        echo "<tr>";
        echo "<td>".$row['Stu_id']."</td>";
        echo "<td>".$row['First_name']."</td>";
        echo "<td>".$row['Last_name']."</td>";
        echo "<td>".$row['Course']."</td>";
        echo "<td>".$row['City']."</td>";
            // echo $row['Stu_id']." ".$row['First_name']." ".$row['Last_name']." ".$row['Course']." ".$row['City'];
            // echo $row[0]." ".$row[1]." ".$row[2]." ".$row[3]." ".$row[4];
            // echo "<br>";
            echo "</tr>";
        }
        echo "</table>";
    }
    else 
        echo "<font color=red size=5>Record not found</font>";
    $mycon->close();
    ?>
    <center>
</body>
</html>