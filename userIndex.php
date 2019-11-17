<?php
//get username from login/signup
session_start();
$user = $_SESSION['username'];
$id = $_SESSION['id'];
?>

<html>
  <head>
    <title>Pendulum</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />
  </head>

  <body>

    <ul class="topbar">
        <li class="topLink">
          <div class='dropdown'>
            <button id='userBtn' value='goSignUp'><span id="user" class="btnText dropBtn">Placehold</span></button>
          </div>
      </li>
      <li class="topLink">
        <button id='save' value='goLogIn'><span class="btnText">Save</span></button>
      </li>
      <li class="topLink">
        <a id='logout' value='goLogOut' href="index.html"><span class="btnText">Log Out</span></a>
      </li>
    </ul>

    <div class="dropdownContent">
      <ul id='simMenu' class='dropList'>
        <li><a>link1</a></li>
      </ul>
    </div>

  <div class="content">
    <div class="leftSide">
        <form id="valueForm">
          <fieldset id="title">
            <legend id="formTitle">Initial Values</legend>

            <legend>Pendulum 1</legend>
            <ul>
              <li>
                <label for='mass' class="textLabel">Mass (kg)</label>
                <input type="number" class="textfield" step="0.01" name="input" id="m1"/>
              </li>
              <li>
                <label for='length' class="textLabel">Rod length (m)</label>
                <input type="number" class="textfeild" step="0.01" name="input" id="r1"/>
              </li>
              <li>
                <label for='angle' class="textLabel">Angle 1 from vertical (deg)</label>
                <input type="number" class="textfeild" step="0.01" name="input" id="ang1"/>
              </li>
            </ul>

            <legend>Pendulum 2</legend>
            <ul>
              <li>
                <label for='mass2' class="textLabel">Mass (kg)</label>
                <input type="number" class="textfield" step="0.01" name="input" id="m2"/>
              </li>
              <li>
                <label for='length2' class="textLabel">Rod length (m)</label>
                <input type="number" class="textfeild" step="0.01" name="input" id="r2"/>
              </li>
              <li>
                <label for='angle2' class="textLabel">Angle 2 from vertical (deg)</label>
                <input type="number" class="textfeild" step="0.01" name="input" id="ang2"/>
              </li>
            </ul>

            <legend>General</legend>
            <div class="general">
              <label id="traceSwitchLabel">Trace On</label>
              <input type="checkbox" id="traceSwitch" checked><br>
           </div>

            <div class="general">
              <label for="color" id="colorLabel">Trace Color</label>
              <select id="color">

              <option value='red'>Red</option>
              <option value='orange'>Orange</option>
              <option value='yellow'>Yellow</option>
              <option value='blue' selected>Blue</option>
              <option value='green'>Green</option>
              <option value='violet'>Violet</option>
              <option value='pink'>Pink</option>
             </select>
           </div>

          <div class="general">
            <label>Gravitational Constant (m/s^2)</label>
            <select id='planet'>
              <option id='mercury' value=3.7>Mercury (3.7)</option>
              <option id='venus' value=8.87>Venus (8.87)</option>
              <option id='earth' value=9.807 selected>Earth (9.807)</option>
              <option id='mars' value=3.711>Mars (3.711)</option>
              <option id='jupiter' value=24.79>Jupiter (24.79)</option>
              <option id='saturn' value=10.44>Saturn (10.44)</option>
              <option id='uranus' value=8.87>Uranus (8.87)</option>
              <option id='neptune' value=11.15>Neptune (11.15)</option>
              <option id='moon' value=1.62>The Moon (1.62)</option>
            </select>
          </div>

          <div class="general">
            <label>Iterative Method</label>
            <select id="iteration">
              <option id="euler" value='euler'>Euler-Cromer</option>
              <option id="rk4" value='rk4'>Runge-Kutta (4th Order)</option>
            </select>
          </div>

            <div class="buttonWrap">
              <ul class="buttons">
                <li class="buttonList">
                  <button id='start' value='Start'><span class="btnText">Start</span></button>
                </li>
                <li class="buttonList">
                  <button id='pause' value='Pause'><span class="btnText">Pause</span></button>
                </li>
                <li class="buttonList">
                  <button id='reset' value='Reset'><span class="btnText">Reset</span></button>
                </li>
                <li class="buttonList">
                  <button id='random' value='Random'><span class="btnText">Random</span></button>
                </li>
              </ul>
            </div>

            <div class="buttonWrap">
              <button id='download' value='Download'><span class="btnText">Download CSV</span></button>
            </div>
          </fieldset>
        </form>
    </div><!--end leftSide-->

    <div class = "rightSide">
      <!--creates the game board-->
      <div id="container">
        <canvas id="canvas2" class="canvas" width="700px" height="680px"></canvas>
        <canvas id="canvas1" class="canvas" width="700px" height="680px"></canvas>
      </div>
    </div>
  </div><!--end content-->

  <div class="form-popup" id="myForm">
  <form class="form-container">
    <h1>Name This Simulation</h1>

    <input type="text" placeholder="Simulation Name" name="simName" id='simName' required>

    <button class="btn cancel" id='closeform'><span class="btnText">Save</span></button>
  </form>
</div>

  <script type="text/javascript" src="draw.js"></script>
  <script type="text/javascript">


    var saveButton = document.getElementById('save');
    displayUser();
    //display username in topbar-------------------------------------
    function displayUser(){

      var user = "<?php echo $user ?>";
      document.getElementById('user').innerHTML = user;
    }
    //save the sim--------------------------------------------------------------
    saveButton.addEventListener('click', (e)=>{
      e.preventDefault();
      openform();
    });

    //display saved sims--------------------------------------------------------------------------------------
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function(event) {
      var menu = document.getElementById('simMenu');
      if (!event.target.matches('#userBtn')) {
        menu.style.display = 'none';
      }
    }

    var simButton = document.getElementById('userBtn');
    simButton.onclick = function(e) {

      var menu = document.getElementById('simMenu');
      var xml = new XMLHttpRequest();

      //get saved simulations
      var id = "<?php echo $id ?>";
      xml.open("GET", "getSim.php?q="+id, true);
      xml.send();

      xml.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
          menu.innerHTML = xml.responseText;
        }
      }
      menu.style.display='block';
    }

    function openform(){
      document.getElementById("myForm").style.display = "block";
    }

    //save a new sim-----------------------------------------------------------------------------------------
    var closeForm = document.getElementById('closeform');
    closeForm.onclick = function(e) {
      e.preventDefault();

      var simName;
      name = document.getElementById('simName').value;

      document.getElementById("myForm").style.display = "none";
      var inputs = document.forms["valueForm"].elements['input'];
      //check if all fields are set
      for(i = 0; i < inputs.length; i++ ){
        if(inputs[i].value == ''){
          var valid = false;
        }
      }

      if(valid == false){
        alert("Please fill out fields to save this simulation");
        return;
      }

      var xml = new XMLHttpRequest();
      var m1 = document.getElementById('m1').value;
      var m2 = document.getElementById('m2').value;
      var r1 = document.getElementById('r1').value;
      var r2 = document.getElementById('r2').value;
      var ang1 = document.getElementById('ang1').value;
      var ang2 = document.getElementById('ang2').value;
      var id = "<?php echo $id ?>";

      xml.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
          alert('your simulation has been saved');
        }
      }
      xml.open("GET", "addSim.php?q="+m1+"&r="+m2+"&s="+r1+"&t="+r2+"&u="+ang1+"&v="+ang2+"&w="+id+"&x="+name, true);
      xml.send();
    }

    //run a saved sim------------------------------------------------------------------------------------------------------
    function run(button){
      var num = button.value;
      var xml = new XMLHttpRequest();
      xml.onreadystatechange=function() {
        if (this.readyState==4 && this.status==200) {
          var data = JSON.parse(this.response);
          document.getElementById('m1').value = data[0]['M1'];
          document.getElementById('m2').value = data[0]['M2'];
          document.getElementById('r1').value = data[0]['L1'];
          document.getElementById('r2').value = data[0]['L2'];
          document.getElementById('ang1').value = data[0]['A1'];
          document.getElementById('ang2').value = data[0]['A2'];

        }
      }
      xml.open("GET", "runSim.php?q="+num, true);
      xml.send();
    }


  </script>

  </body>
</html>
