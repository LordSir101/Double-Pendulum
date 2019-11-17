<?php
/*
class simulation{
  public $m1;
  public $m2;
  public $r1;
  public $r2;
  public $ang1;
  public $ang2;
}*/
$id = doubleval($_GET["q"]);


$dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
$userName = 'test01';
$password = 'User_test';

try{
    $conn = new PDO($dsn, $userName, $password);

    $sql =  "select Name, num from simulations where Id=$id";
    foreach ($conn->query($sql) as $row){
      echo "<button value=".$row['num'] . " onclick='run(this)'>";
      echo $row['Name'];
      echo "</button>";
      echo "<br>";
    }
    /*
    //if there is an error getting user object, throw an error
    while($result = $statement->fetchObject('simulation')){
      echo "<a>";
      echo "M1: ". doubleval($result->m1);
      echo "L1: ". doubleval($result->r1);
      echo "Ang1: ". doubleval($result->ang1);
      echo "M2: ". doubleval($result->m2);
      echo "L2: ". doubleval($result->r2);
      echo "Ang2: ". doubleval($result->ang2);
      echo "</a>";
      echo "<br>";
    }*/
}
catch(PDOEXCEPTION $e){
  echo "Connection failed: " . $e->getMessage();
}

?>
