var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var canvas = document.getElementById('canvas2');
var ctx2 = canvas.getContext('2d');


/*var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas.getContext('2d');*/

var w = canvas.width;
var h = canvas.height;

ctx.translate(w/2, h/2);
ctx2.translate(w/2, h/2);

// Declaring variables and defualt values for the parameters of the double pendulum
// Fixed reference point is the 2D origin (0,0)
var m1 = Math.random()*4 + 4; // mass 1
var m2 = Math.random()*4 + 4; // mass 2
const r1 = Math.random() + 1; // radius of m1 from fixed point (m)
const r2 =  Math.random() + 1; // radius of m2 from m2
var ang1 = - Math.random()*6.3;//Math.PI ; // angle of m1 from fixed point reference
var ang2 = Math.random()*6.3;//4*Math.PI / 3; // angle of m2 from m1 reference
var x1; // x co-ordinate of m1
var y1; // y co-ordinate of m1
var x2; // x co-ordinate of m2
var y2; // y co-ordinate of m2
var w1 = 0; // angular velocity of m1
var w2 = 0; // angular velocity of m2
var acc1; // angluar acceleration of m1
var acc2; // angluar acceleration of m2
var g = -9.81/3600; // gravitational constant (scaled to 60 fps)
var t = 0; // time variable
var dt = 0.01; // time step variable for each iteration

var lastX;
var lastY;


var sphere = document.createElement('img');
sphere.src = "images/sphere.png";

function drawBackground(){
  ctx2.fillStyle = 'black';
  ctx2.fillRect(0 - w/2, 0 - h/2, w, h) //since translate puts 0,0 in the middle of the canvas
}

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
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function setLast(){
  lastX = x2;
  lastY = y2;
}

function drawTrace(){
  ctx2.beginPath();
  ctx2.moveTo(lastX, lastY);
  ctx2.lineTo(x2, y2);
  ctx2.strokeStyle = '#b3ffff';
  ctx2.shadowColor = '#00e6e6';
  ctx2.shadowBlur = 10;
  ctx2.lineWidth = 2;
  ctx.lineJoin = 'round'; //make edges smooth
  ctx2.lineCap = 'round';
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
  drawTrace();
  setLast();
  requestAnimationFrame(update);
}

sphere.onload = function(){
  drawBackground()
  update();
}

// Calculations
function calculate(){
  /*
  acc1 = (((-g*(2*m1 + m2)*Math.sin(ang1) - m2*g*Math.sin(ang1 - 2*ang2)) -
  (2*Math.sin(ang1 - ang2)*m2*(Math.pow(w2, 2)*r2 + Math.pow(w1, 2)*r1*Math.cos(ang1 - ang2)))) /
  r1*(2*m1 + m2 - m2*Math.cos(2*ang1 - 2*ang2)));

  acc2 = ((2*Math.sin(ang1 - ang2) * ((Math.pow(w1,2)*r1*(m1 + m2)) + (g*(m1 + m2)*Math.cos(ang1)) +
  (Math.pow(w2,2)*r2*m2*Math.cos(ang1 - ang2)))) /
  (r2 * (2*m1 + m2 - m2*Math.cos(2*ang1 - 2*ang2))));*/


  var num1 = -g * (2 * m1 + m2) * Math.sin(ang1);
  var num2 = -m2 * g * Math.sin(ang1-2*ang2);
  var num3 = -2*Math.sin(ang1-ang2)*m2;
  var num4 = w2*w2*r2+w1*w1*r1*Math.cos(ang1-ang2);
  var den = r1 * (2*m1+m2-m2*Math.cos(2*ang1-2*ang2));
  acc1 = (num1 + num2 + num3*num4) / den;

  num1 = 2 * Math.sin(ang1-ang2);
  num2 = (w1*w1*r1*(m1+m2));
  num3 = g * (m1 + m2) * Math.cos(ang1);
  num4 = w2*w2*r2*m2*Math.cos(ang1-ang2);
  den = r2 * (2*m1+m2-m2*Math.cos(2*ang1-2*ang2));
  acc2 = (num1*(num2+num3+num4)) / den;

  x1 = r1 * Math.sin(ang1);
  y1 = (r1 * Math.cos(ang1));
  x2 = x1 + r2 * Math.sin(ang2);
  y2 = (y1 + r2 * Math.cos(ang2));

  console.log("pos " + x2 + " " + y2);

  y1 *= -1;
  y2 *= -1;

  //multiply by 100 to scale the position in meters to pixels for aesthetics
  x1 *= 100;
  y1 *= 100;
  x2 *= 100;
  y2 *= 100;


  w1 += acc1;
  w2 += acc2;
  ang1 += w1;
  ang2 += w2;


}
