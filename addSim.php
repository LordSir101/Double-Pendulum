<?php

//get variables from xml query
$m1 = doubleval($_POST["q"]);
$m2 = doubleval($_POST["r"]);
$r1 = doubleval($_POST["s"]);
$r2 = doubleval($_POST["t"]);
$ang1 = doubleval($_POST["u"]);
$ang2= doubleval($_POST["v"]);
$id = doubleval($_POST["w"]);
$name = $_POST["x"];

$dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
$userName = 'test01';
$password = 'User_test';

try{
    $conn = new PDO($dsn, $userName, $password);

    $sql = "insert into simulations (Id, M1, L1, A1, M2, L2, A2, Name)
            values(?, ?, ?, ?, ?, ?, ?, ?)";

    $statement = $conn->prepare($sql);
    $statement->bindValue(1, $id);
    $statement->bindValue(2, $m1);
    $statement->bindValue(3, $r1);
    $statement->bindValue(4, $ang1);
    $statement->bindValue(5, $m2);
    $statement->bindValue(6, $r2);
    $statement->bindValue(7, $ang2);
    $statement->bindValue(8, $name);
    $statement->execute();
}
catch(PDOEXCEPTION $e){
  echo "Connection failed: " . $e->getMessage();
}

?>
