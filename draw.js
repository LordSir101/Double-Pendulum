var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var canvas = document.getElementById('canvas2');
var ctx2 = canvas.getContext('2d');

var sphere = document.createElement('img');
var color = document.getElementById('color'); //the color the user selects in dropdown menu
var startButton = document.getElementById('start');
var randomButton = document.getElementById('random');
var resetButton = document.getElementById('reset');
var pauseButton = document.getElementById('pause');
var planetSelect = document.getElementById('planet');
pauseButton.disabled = true; //disables pause button until start is pressed

var w = canvas.width;
var h = canvas.height;

//put the origin (0,0) in the center of both canvases
ctx.translate(w/2, h/2);
ctx2.translate(w/2, h/2);

// Declaring variables and defualt values for the parameters of the double pendulum
// Fixed reference point is the 2D origin (0,0)
var m1 = parseFloat(document.getElementById('m1').value);
var m2 = parseFloat(document.getElementById('m2').value);
var r1 = parseFloat(document.getElementById('r1').value);
var r2 = parseFloat(document.getElementById('r2').value);
var ang1 = parseFloat(document.getElementById('ang1').value) * (Math.PI)/180;
var ang2 = parseFloat(document.getElementById('ang2').value) * (Math.PI)/180;
var x1; // x co-ordinate of m1
var y1; // y co-ordinate of m1
var x2; // x co-ordinate of m2
var y2; // y co-ordinate of m2
var w1 = 0; // angular velocity of m1
var w2 = 0; // angular velocity of m2
var acc1; // angluar acceleration of m1
var acc2; // angluar acceleration of m2
var g = planetChoice(); // gravitational constant (scaled to 60 fps)

var lineColor;
var shadowColor;

//used to reset last values to nothing when start is pressed
var initialLastX;
var initialLastY;

//holds last position of pendulum
var lastX = initialLastX;
var lastY = initialLastY;

var animation;

// event listeners for buttons
startButton.addEventListener('click', setup);

randomButton.addEventListener('click', randomSetup);

resetButton.addEventListener('click', ()=>{
  location.reload();
});

pauseButton.addEventListener('click', (e)=>{
  e.preventDefault();
  if(pauseButton.innerText == 'Pause'){
    cancelAnimationFrame(animation);
    pauseButton.innerText = 'Resume';
  }
  else{
    update();
    pauseButton.innerText = 'Pause';
  }
});

//validate the form------------------------------------------------------------------------------------------
function validateForm(){
  var inputs = document.forms["valueForm"].elements['input'];
  var valid;

  //Changes all border clors to black in case the form was validated multiple times
  for(i = 0; i < inputs.length; i++ ){
    inputs[i].style.borderColor = 'gray';
    inputs[i].style.borderWidth = '1px';
  }

  //check if any field is blank
  for(i = 0; i < inputs.length; i++ ){
    if(inputs[i].value == ''){
      inputs[i].style.borderColor = '#ff3333'; //changes wrong input border to red
      inputs[i].style.borderWidth = '1px';
      valid = false;
    }
  }

  if(valid == false){
    alert("Please fill out all required fields");
    return false;
  }
  //check if any input except angles are negative
  for(i = 0; i < inputs.length; i++ ){
    if(inputs[i].getAttribute('id') != 'ang1' && inputs[i].getAttribute('id') != 'ang2' ){
      if(inputs[i].value < 0){
        inputs[i].style.borderColor = '#ff3333'; //changes wrong input border to red
        inputs[i].style.borderWidth = '1px';
        valid = false;
      }
    }
  }

  if(valid == false){
    alert("Please ensure that your inputs are valid numbers");
    return false;
  }
  return true;
}

//sets up the canvas for a new drawing
function setup(e){
  e.preventDefault();
  var valid = validateForm();
  if(!valid){return;}

  cancelAnimationFrame(animation);
  pauseButton.innerText = 'Pause';
  pauseButton.disabled = false;
  loadSphere();
  resetValues();
  drawBackground();
  setColor();
  update();
}

//sets up the canvas for a random drawing
function randomSetup(e){
  e.preventDefault();
  cancelAnimationFrame(animation);
  pauseButton.innerText = 'Pause';
  pauseButton.disabled = false;
  setRandomValues();
  loadSphere();
  drawBackground();
  setColor();
  update();
}

function update(){
  calculate();
  ctx.clearRect(0 - w/2, 0 - h/2, w, h);
  drawLines();
  drawSphere(x1, y1);
  drawSphere(x2, y2);

  if (document.getElementById('traceSwitch').checked) {
    drawTrace();
  }
  
  setLast();
  animation = requestAnimationFrame(update);
}

// Calculations---------------------------------------------------------------------------------------
function calculate(){

  //each equation is split up into terms
  var num1 = -g * (2 * m1 + m2) * Math.sin(ang1);
  var num2 = -m2 * g * Math.sin(ang1-2*ang2);
  var num3 = -2*Math.sin(ang1-ang2)*m2;
  var num4 = w2*w2*r2+w1*w1*r1*Math.cos(ang1-ang2);
  var den = r1 * (2*m1+m2-m2*Math.cos(2*ang1-2*ang2)); //denominator
  acc1 = (num1 + num2 + num3*num4) / den;

  num1 = 2 * Math.sin(ang1-ang2);
  num2 = (w1*w1*r1*(m1+m2));
  num3 = g * (m1 + m2) * Math.cos(ang1);
  num4 = w2*w2*r2*m2*Math.cos(ang1-ang2);
  den = r2 * (2*m1+m2-m2*Math.cos(2*ang1-2*ang2)); //denominator
  acc2 = (num1*(num2+num3+num4)) / den;

  //get position based on angle
  x1 = r1 * Math.sin(ang1);
  y1 = (-r1 * Math.cos(ang1));
  x2 = x1 + r2 * Math.sin(ang2);
  y2 = (y1 - r2 * Math.cos(ang2));

  //this will print the coordinates as calculated
  //console.log("pos " + x2 + " " + y2);

  //reverse the y-coordinates so that the pendulum is drawn in the right place
  y1 *= -1;
  y2 *= -1;

  //multiply by 100 to scale the position in meters to pixels for aesthetics
  x1 *= 100;
  y1 *= 100;
  x2 *= 100;
  y2 *= 100;

  //find new velocity and angle based on acc calculated
  w1 += acc1;
  w2 += acc2;
  ang1 += w1;
  ang2 += w2;
}

function planetChoice() {
  
  // indeces for planets in order: 0 = Mercury ... 7 = Neptune
  if (planetSelect.selectedIndex == 0){
    g = parseFloat(document.getElementById('mercury').value) / 3600;
    return g;
  }
  if (planetSelect.selectedIndex == 1){
    g = parseFloat(document.getElementById('venus').value) / 3600;
    return g;
  }
  if (planetSelect.selectedIndex == 2){
    g = parseFloat(document.getElementById('earth').value) / 3600;
    return g;
  }
  if (planetSelect.selectedIndex == 3) {
    g = parseFloat(document.getElementById('mars').value) / 3600;
    return g;
  }  
  if (planetSelect.selectedIndex == 4){
    g = parseFloat(document.getElementById('jupiter').value) / 3600;
    return g;
  }

  if (planetSelect.selectedIndex == 5){
    g = parseFloat(document.getElementById('saturn').value) / 3600;
    return g;
  }
  if (planetSelect.selectedIndex == 6){
    g = parseFloat(document.getElementById('uranus').value) / 3600;
    return g;
  }
  if (planetSelect.selectedIndex == 7){
    g = parseFloat(document.getElementById('neptune').value) / 3600;
    return g;
  }
}

//sets random inputs------------------------------------------------------------------------------------------------------------------
function setRandomValues(){
  m1 = Math.random()*4 + 4;
  m2 = Math.random()*4 + 4;
  r1 = Math.random() + 1;
  r2 = Math.random() + 1;
  ang1 = Math.random()*6.3;
  ang2 = Math.random()*6.3;
  x1;
  y1;
  x2;
  y2;
  w1 = 0;
  w2 = 0;
  acc1;
  acc2;
  g = planetChoice();
  t = 0;
  dt = 0.01;
  lastX = initialLastX;
  lastY = initialLastY;

  // set random colour
  /* this snippet mostly works except occaisionally when the random button is clicked it freezes the simulation
   I'm guessing it goes to an index out of range
   (next day update: seems to be fine now. lemme know if it causes trouble)
   In randomSetup() I swapped the places of setRandomValues() and loadSphere()
   because when this code ran the trace and ball colours didn't correspond */
  
  var colourSource = ["images/sphere red.png","images/sphere orange.png","images/sphere yellow.png","images/sphere.png","images/sphere green.png","images/sphere purple.png","images/sphere pink.png"];
  var colours = ["red","orange","yellow","blue","green","violet","pink"];
  var randomIndex = Math.floor(Math.random() * colours.length);
  sphere.src = colourSource[randomIndex];
  color.value = colours[randomIndex];

  // displaying the random value to 2 decimal places into the html form
  document.getElementById('m1').value = m1.toFixed(2);
  document.getElementById('m2').value = m2.toFixed(2);
  document.getElementById('r1').value = r1.toFixed(2);
  document.getElementById('r2').value = r2.toFixed(2);
  document.getElementById('ang1').value = (ang1 * 180/(Math.PI)).toFixed(2);
  document.getElementById('ang2').value = (ang2 * 180/(Math.PI)).toFixed(2);
}

//load correct sphere images based on user choice--------------------------------------------------------------------------------
function loadSphere(){

  var name = color.value;

  switch(name){
    case "red"://red
      sphere.src = "images/sphere red.png";
      break;
    case "orange"://orange
      sphere.src = "images/sphere orange.png";
      break;
    case "yellow"://yellow
      sphere.src = "images/sphere yellow.png";
      break;
    case "blue": //blue
      sphere.src = "images/sphere.png";
      break;
    case "green"://green
      sphere.src = "images/sphere green.png";
      break;
    case "violet"://violet
      sphere.src = "images/sphere purple.png";
      break;
    case "pink"://pink
      sphere.src = "images/sphere pink.png";
      break;
  }
  console.log(sphere.src);
}


//sets background to black------------------------------------------------------------------------------------------------
function drawBackground(){
  canvas2.style.background = 'none';
  ctx2.fillStyle = 'black';
  ctx2.fillRect(0 - w/2, 0 - h/2, w, h) //since translate puts 0,0 in the middle of the canvas
}

//draws a sphere---------------------------------------------------------------------------------------------------------------
function drawSphere(x, y){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, 6.28, false); //(xpos, ypos, rad, start angle, end angle, clockwise)
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(sphere, x -25, y-25, 50, 50); //draws image at center of clipped circle
    ctx.restore();
}

//draws the ropes---------------------------------------------------------------------------------------------------------------------
function drawLines(){
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

//keeps track of last position of pendulum 2--------------------------------------------------------------------------------------
function setLast(){
  lastX = x2;
  lastY = y2;
}

//traces pendulum 2-----------------------------------------------------------------------------------------------------------------
function drawTrace(){

  ctx2.beginPath();
  ctx2.moveTo(lastX, lastY);
  ctx2.lineTo(x2, y2);
  ctx2.strokeStyle = lineColor;
  ctx2.shadowColor = shadowColor;
  ctx2.shadowBlur = 10;
  ctx2.lineWidth = 2.5;
  ctx.lineJoin = 'round'; //make edges smooth
  ctx2.lineCap = 'round';
  ctx2.stroke();
  ctx2.closePath();
}

//sets the color of the trace----------------------------------------------------------------------------------------------------
function setColor(){
  var traceColors = new Array();
  //[] = 'stroke, shadow color'
  traceColors["red"] = '#ff9999 #ff0000'
  traceColors["orange"] = '#ffb380 #e65c00'
  traceColors["yellow"] = '#ffff99 #ffff4d'
  traceColors["blue"] = '#b3ffff #00e6e6'
  traceColors["green"] = '#adebad #00e600'
  traceColors["violet"] = '#ecb3ff #ac00e6'
  traceColors["pink"] = '#ffb3d9 #ff0080'

  var codes = traceColors[color.value];
  lineColor = codes.slice(0, 7); //first # value
  shadowColor = codes.slice(8, 15); //second # value
}

//resets values for new drawing-------------------------------------------------------------------------------------------------------
function resetValues(){

  m1 = parseFloat(document.getElementById('m1').value);
  m2 = parseFloat(document.getElementById('m2').value);
  r1 = parseFloat(document.getElementById('r1').value);
  r2 = parseFloat(document.getElementById('r2').value);
  ang1 = parseFloat(document.getElementById('ang1').value) * (Math.PI)/180;
  ang2 = parseFloat(document.getElementById('ang2').value) * (Math.PI)/180;
  x1; // x co-ordinate of m1
  y1; // y co-ordinate of m1
  x2; // x co-ordinate of m2
  y2; // y co-ordinate of m2
  w1 = 0; // angular velocity of m1
  w2 = 0; // angular velocity of m2
  acc1; // angluar acceleration of m1
  acc2; // angluar acceleration of m2
  g = planetChoice(); // gravitational constant (scaled to 60 fps)
  lastX = initialLastX;
  lastY = initialLastY;
}
