<?php

$id = doubleval($_POST["q"]);


$dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
$userName = 'test01';
$password = 'User_test';

try{
    $conn = new PDO($dsn, $userName, $password);

    $sql =  "select Name, num from simulations where Id=$id";

    //return the names of each sim in rows
    foreach ($conn->query($sql) as $row){
      //save the num key to each value so we can get info about it later
      echo "<button value=".$row['num'] . " onclick='run(this)'>";
      echo $row['Name'];
      echo "</button>";

    }
}
catch(PDOEXCEPTION $e){
  echo "Connection failed: " . $e->getMessage();
}

?>
