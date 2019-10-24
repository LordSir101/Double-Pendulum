var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
ctx.translate(300, 300);

var canvas = document.getElementById('canvas2');
var ctx2 = canvas.getContext('2d');

/*var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas.getContext('2d');*/

var w = canvas.width;
var h = canvas.height;

// Declaring variables and defualt values for the parameters of the double pendulum
// Fixed reference point is the 2D origin (0,0)
var m1 = 25; // mass 1
var m2 = 25; // mass 2
var r1 = 150; // radius of m1 from fixed point
var r2 = 150; // radius of m2 from m2
var ang1 = Math.PI / 2; // angle of m1 from fixed point reference
var ang2 = Math.PI; // angle of m2 from m1 reference
var x1; // x co-ordinate of m1
var y1; // y co-ordinate of m1
var x2; // x co-ordinate of m2
var y2; // y co-ordinate of m2
var w1 = 0; // angular velocity of m1
var w2 = 0; // angular velocity of m2
var acc1; // angluar acceleration of m1
var acc2; // angluar acceleration of m2
var g = 9.81; // gravitational constant
var t = 0; // time variable
var dt = 0.01; // time step variable for each iteration


var sphere = document.createElement('img');
sphere.src = "images/sphere.png";

function drawSphere(x, y){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, 6.28, false); //(xpos, ypos, rad, start angle, end angle, clockwise)
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(sphere, x -25, y-25, 50, 50);
    ctx.restore();
}

function drawLines(){
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function setLast(){
  lastX1 = x1;
  lastY1 = y1;
  lastX2 = x2;
  lastY2 = y2;
}

function drawTrace(){
  ctx2.beginPath();
  ctx2.moveTo(lastX1,   lastY1);
  ctx2.lineTo(x2, y2);
  ctx2.stroke();
  ctx2.closePath();
}

function update(){
  calculate();
  //setLast();
  ctx.clearRect(0 - w/2, 0 - h/2, w, h);
  //ctx.clearRect(lastX1-30, lastY1-30, 70, 70);
  //ctx.clearRect(lastX2-30, lastY2-30, 70, 70);
  drawLines();
  drawSphere(x1, y1);
  drawSphere(x2, y2);
  setLast();
  requestAnimationFrame(update);
}

sphere.onload = function(){
  update();
}

// Calculations
function calculate(){
  acc1 = (((-g*(2*m1 + m2)*Math.sin(ang1) - m2*g*Math.sin(ang1 - 2*ang2)) -
  (2*Math.sin(ang1 - ang2)*m2*(Math.pow(w2, 2)*r2 + Math.pow(w1, 2)*r1*Math.cos(ang1 - ang2)))) /
  r1*(2*m1 + m2 - m2*Math.cos(2*ang1 - 2*ang2)));

  acc2 = ((2*Math.sin(ang1 - ang2) * ((Math.pow(w1,2)*r1*(m1 + m2)) + (g*(m1 + m2)*Math.cos(ang1)) +
  (Math.pow(w2,2)*r2*m2*Math.cos(ang1 - ang2)))) /
  (r2 * (2*m1 + m2 - m2*Math.cos(2*ang1 - 2*ang2))));

  x1 = r1 * Math.sin(ang1);
  y1 = -(r1 * Math.cos(ang1));
  x2 = x1 + r2 * Math.sin(ang2);
  y2 = y1 + r2 * Math.cos(ang2);

  ang1 += 0.05;
  ang2 -= 0.075;
}
