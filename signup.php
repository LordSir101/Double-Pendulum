<?php
  session_start();
?>

<html>
  <head>
    <title>Pendulum</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />

  </head>


  <body>
    <ul class="topbar">
      <li class="topLink">
        <a id='back' value='back' href="index.html"><span class="btnText">Back</span></a>
      </li>
      <li class="topLink">
        <a id='goLogIn' value='goLogIn' href="login.php"><span class="btnText">Log In</span></a>
      </li>
    </ul>

    <form id=signupForm method='GET' action='signup.php'>
      <fieldset>
        <legend class="infoTitle">Account Information</legend>
        <ul class="infoInput">
          <li>
            <label for='uname' class="textLabel">Username:</label>
            <input type="text" class="textfield" name="uname" id="uname"/>
          </li>
          <li>
            <label for='pass' class="textLabel">Password:</label>
            <input type="password" class="textfeild" step="0.01" name="pass" id="pass"/>
          </li>
          <li>
            <label for='show' class="textLabel">Show</label>
            <input type="checkbox" onclick="show()"/>
          </li>
        </ul>

        <div class="buttonWrap">
          <ul class="buttons">
            <li class="buttonList">
              <button id='signup' value='signup'><span class="btnText">Sign Up</span></button>
            </li>
          </ul>
        </div>

        <div class="errorMessage" id='signupError'>
        </div>
      </fieldset>
    </form>
    <script type="text/javascript">
      //show password
      function show(){
        var input = document.getElementById("pass");
        if (input.type === "password") {
          input.type = "text";
        } else {
          input.type = "password";
        }
      }

    </script>

    <?php
    $submit = $_GET;

    //when user submits form, execute
    if($submit){
      $pass = $_GET['pass'];
      $uname = $_GET['uname'];

      $dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
      $userName = 'test01';
      $password = 'User_test';
      $id = rand(10000000, 99999999);
      $results = 0;
      $message = "";
      $idValid = false;

      try{
          $conn = new PDO($dsn, $userName, $password);

          //checks if user id exists then selcts another one
          while(!$idValid){
            $checkId= $conn->prepare("select * from users where Id=$id");
            $checkId->execute();
            if($checkId->rowCount() >= 1){
              $id = rand(10000000, 99999999);
              continue;
            }
            $idValid = true;
          }

          //check if fields are filled out
          if(empty($uname) || empty($pass)){
            throw new Exception('Please fill out all fields');
          }

          $check = "select * from users where Username=?";
          $statement = $conn->prepare($check);
          $statement->bindValue(1, $uname);
          $statement->execute();

          //if username exists, throw error
          if($statement->rowCount() >= 1){
            throw new Exception('That username has already been taken');
          }

          $sql = "insert into users (Id, Username, Password)
                  values(?, ?, ?)";

          $statement = $conn->prepare($sql);
          $statement->bindValue(1, $id);
          $statement->bindValue(2, $uname);
          $statement->bindValue(3, $pass);
          $statement->execute();

          //pass the username to userIndex
          $_SESSION['id'] = $id;
          $_SESSION['username'] = $uname;
          header("Location: userIndex.php");
      }
      catch(PDOEXCEPTION $e){
        echo "Connection failed: " . $e->getMessage();
      }

      catch(EXCEPTION $e){
        $message = $e->getMessage();
        //for some reason, I can't call this function when it is in the other script tags
        //so I ran it here
        echo "<script type='text/javascript'>",
              "var message = '$message';",
              "document.getElementById('signupError').innerHTML = message;",
              "console.log(message);",
              "</script>";
      }

    }//end if satement
    ?>

  </body>

</html>
