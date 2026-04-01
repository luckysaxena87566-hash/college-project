<hmtl>
    <head>
        <title>
            Db
</title>
</head>
<body>
    <form method=POST >
        Stu_id:<input type=text name=txtid>
        <br>
        First_name:<input type=text name=Firstname>
        <br>
        Last_name:<input type=text name=Lastname>
        <br>
        Course:<input type=text name=Corsname>
        <br>
        City<input type=text name=Ctyname>
        <br>
        <input type=submit value=Submit name=btnsubmit>
</form>
    <center>
    <?php
    if(isset($_POST['btnsubmit'])){
    $Stu_id=$_POST['txtid'];
    $First_name=$_POST['Firstname'];
    $Last_name=$_POST['Lastname'];
    $Course=$_POST['Corsname'];
    $City=$_POST['Ctyname'];
    $mycon=mysqli_connect("localhost","root","Lucky2001@","college_student");
    echo "connection success";
    $sql="insert into student_info values(?,?,?,?,?)";
    $ps=$mycon->prepare($sql);
    	// Stu_id	First_name	Last_name	Course	City
    $ps->bind_param("issss",$Stu_id,$First_name,$Last_name,$Course,$City);
    $ps->execute();
    echo "<br>Record inserted success";
    }
    ?>
    
    </center>
</body>
</html>
