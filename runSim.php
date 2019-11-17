<?php

$num = doubleval($_GET["q"]);


$dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
$userName = 'test01';
$password = 'User_test';


$conn = new PDO($dsn, $userName, $password);

$sql=  $conn->prepare("select M1, M2, L1, L2, A1, A2 from simulations where num=$num");
$sql->execute();

//prints result as array
$result = $sql->fetchAll(\PDO::FETCH_ASSOC);
echo(json_encode($result));


?>
