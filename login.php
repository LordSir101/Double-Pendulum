<?php
  session_start(); //this must be first thing on the page.  used to pass varibles via session
?>

<html>
  <head>
    <title>Pendulum</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />

  </head>

  <body>

    <ul class="topbar">
      <li class="topLink">
        <a id='back' value='goSignUp' href="index.html"><span class="btnText">Back</span></a>
      </li>
      <li class="topLink">
        <a id='goSignUp' value='goSignUp' href="signup.php"><span class="btnText">Sign Up</span></a>
      </li>
    </ul>

    <form id=signupForm method='GET' action='login.php'>
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
            <input type="checkbox" onclick='show()'/>
          </li>
        </ul>

        <div class="buttonWrap">
          <ul class="buttons">
            <li class="buttonList">
              <button id='login' value='signup'><span class="btnText">Log In</span></button>
            </li>
          </ul>
        </div>

        <!--display error messages here-->
        <div id='loginError' class="errorMessage">
        </div>
      </fieldset>
    </form>

    <script>
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
    class User{
      public $Id;
      public $Username;
      public $Password;
    }
    $submit = $_GET;

    //when user submits form, execute
    if($submit){
      $uname = $_GET['uname'];
      $pass = $_GET['pass'];

      $dsn = 'mysql:host=localhost:3303;dbname=doublePendulum'; //must specify port otherwise machine activley refuss connection
      $userName = 'test01';
      $password = 'User_test';

      try{
          $conn = new PDO($dsn, $userName, $password);

          //check if fields are filled out
          if(empty($uname) || empty($pass)){
            throw new Exception('Please fill out all fields');
          }

          $sql = "select Username, Id, Password from users where Username=?";

          $statement = $conn->prepare($sql);
          $statement->bindValue(1, $uname);
          $statement->execute();

          //if there is an error getting user object, throw an error
          if(!($result = $statement->fetchObject('User'))){
            throw new Exception('Your username or password is inccorect.  Please try again');
          }

          //verify password
          //if the entered password does not match encrypted pass from db
          if(!(password_verify($pass, $result->Password))){
            throw new Exception('Your username or password is inccorect.  Please try again');
          }

          //pass the username and id to userIndex
          $_SESSION['username'] = $result->Username;
          $_SESSION['id'] = intval($result->Id);
          header("Location: userIndex.php");
      }
      //errors with connection
      catch(PDOEXCEPTION $e){
        echo "Connection failed: " . $e->getMessage();
      }
      //errors with input
      catch(EXCEPTION $e){
        $message = $e->getMessage();
        echo "<script type='text/javascript'>",
              "var message = '$message';",
              "document.getElementById('loginError').innerHTML = message;",
              "console.log(message);",
              "</script>";
      }
    } //end if statement
    ?>
  </body>

</html>
