<hmtl>
    <head>
        <title>
            Db
</title>
</head>
<body>
    <center>
    <?php
    $Stu_id=1;
    $First_name="Lucky";
    $Last_name="Saxena";
    $Course="mca";
    $City="Kanpur";

    $mycon=mysqli_connect("localhost","root","Lucky2001@","college_student");
    echo "connection success";
    $sql="insert into student_info values(?,?,?,?,?)";
    $ps=$mycon->prepare($sql);
    	// Stu_id	First_name	Last_name	Course	City
    $ps->bind_param("issss",$Stu_id,$First_name,$Last_name,$Course,$City);
    $ps->execute();
    echo "<br>Record inserted success";
    ?>
    </center>
</body>
</html>
