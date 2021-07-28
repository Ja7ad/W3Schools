var i, n, ryb = [], rybRule = -1;
ryb[0] = "#fe2712" //red
ryb[6] = "#fb9902" //orange
ryb[12] = "#fefe33" //yellow
ryb[18] = "#66b032" //green
ryb[24] = "#0247fe" //blue
ryb[30] = "#8601af" //violet

var arr = mixColors(ryb[0], ryb[6], 6);
n = 0;
for (i = 1; i < 6; i++) {
  ryb[i] = arr[n];
  n++;
}
var arr = mixColors(ryb[6], ryb[12], 6);
n = 0;
for (i = 7; i < 12; i++) {
  ryb[i] = arr[n];
  n++;
}
var arr = mixColors(ryb[12], ryb[18], 6);
n = 0;
for (i = 13; i < 18; i++) {
  ryb[i] = arr[n];
  n++;
}
var arr = mixColors(ryb[18], ryb[24], 6);
n = 0;
for (i = 19; i < 24; i++) {
  ryb[i] = arr[n];
  n++;
}
var arr = mixColors(ryb[24], ryb[30], 6);
n = 0;
for (i = 25; i < 30; i++) {
  ryb[i] = arr[n];
  n++;
}
var arr = mixColors(ryb[30], ryb[0], 6);
n = 0;
for (i = 31; i < 36; i++) {
  ryb[i] = arr[n];
  n++;
}

var oRyb = ryb.slice();

function mixColors(from, to, n) {
  var i, z, arr = [], fromObj, toObj, r, g, b, resultObj;
  fromObj = w3color(to);
  toObj = w3color(from);
  r = fromObj.red;
  g = fromObj.green;
  b = fromObj.blue;
  for (i = 1; i < n; i++) {
    z = i / n;
    r = z * fromObj.red + (1 - z) * toObj.red;
    g = z * fromObj.green + (1 - z) * toObj.green;
    b = z * fromObj.blue + (1 - z) * toObj.blue;
    resultObj = w3color("rgb(" + r + "," + g + "," + b + ")");
    arr.push(resultObj.toHexString());
  }
  return arr;
}

var col1, col2, col3, col4, col5;
function changeRule(n) {
  var i, c, t1, t2, a1, a2, x, sc1, sc2, satval, lightval, col1light, col5light, col4light, col;
  satval = document.getElementById("satval").value;
  lightval = document.getElementById("lightval").value;
  rybRule = n;
  col1light = 0.9;
  col5light = 0.12;
  for (i = 0; i < 5; i++) {
    document.getElementById("rulelist").getElementsByTagName("li")[i].style.backgroundColor = "";
  }
  document.getElementById("rulelist").getElementsByTagName("li")[n].style.backgroundColor = "#f1f1f1";
  if (n == 0) {
    x = w3color(ryb[rybNo]);
    col3 = x.toHexString();
    col1light = 0.93;
    x.lightness = (col1light * (lightval / 100));
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col1 = x.toHexString();
    x = w3color(ryb[rybNo]);
    x.lighter(20);
    col2 = x.toHexString();
    x = w3color(ryb[rybNo]);
    x.darker(20);
    col4 = x.toHexString();
    x = w3color(ryb[rybNo]);
    x.lightness = (col5light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col5 = x.toHexString();
    clearLine();    
    drawLine((rybNo * (2 / 36)));
  }
  if (n == 1) {
    a1 = rybNo - 3;
    if (a1 < 0) a1 = 36 + a1;
    a2 = rybNo + 3;
    if (a2 > 35) a2 = a2 - 36;
    col3 = ryb[rybNo];
    col2 = ryb[a1];
    col4 = ryb[a2];
    x = w3color(ryb[a1]);
    x.lightness = (col1light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col1 = x.toHexString();
    x = w3color(ryb[a2]);
    x.lightness = (col5light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col5 = x.toHexString();
    clearLine();    
    drawLine((rybNo * (2 / 36)));
    drawLine((a1 * (2 / 36)));
    drawLine((a2 * (2 / 36)));
  }
  if (n == 2) {
    col3 = ryb[rybNo];
    c = rybNo + 18;
    if (c > 35) c = c - 36;
    col2 = ryb[c];
    x = w3color(ryb[rybNo]);
    x.lightness = (col5light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col5 = x.toHexString();
    x = w3color(ryb[c]);
    x.lightness = (col1light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col1 = x.toHexString();
    x = w3color(ryb[rybNo]);
    col4light = 0.4;
    x.lightness = (col4light * (lightval / 100));
    x.sat = (satval * 8) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col4 = x.toHexString();
    clearLine();    
    drawLine((rybNo * (2 / 36)));
    drawLine((c * (2 / 36)));
  }
  if (n == 3) {
    col3 = ryb[rybNo];
    t1 = rybNo + 12;
    if (t1 > 35) t1 = t1 - 36;
    t2 = rybNo + 24;
    if (t2 > 35) t2 = t2 - 36;
    col2 = ryb[t2];
    col4 = ryb[t1];
    x = w3color(ryb[rybNo]);
    x.lightness = (col5light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col5 = x.toHexString();
    x = w3color(ryb[t2]);
    x.lightness = (col1light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col1 = x.toHexString();
    clearLine();    
    drawLine((rybNo * (2 / 36)));
    drawLine((t1 * (2 / 36)));
    drawLine((t2 * (2 / 36)));
  }
  if (n == 4) {
    col3 = ryb[rybNo];
    sc1 = rybNo + 15;
    if (sc1 > 35) sc1 = sc1 - 36;
    sc2 = rybNo + 21;
    if (sc2 > 35) sc2 = sc2 - 36;
    col4 = ryb[sc2];
    col2 = ryb[sc1];
    x = w3color(ryb[sc2]);
    x.lightness = (col5light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col5 = x.toHexString();
    x = w3color(ryb[sc1]);
    x.lightness = (col1light * (lightval / 100));
    x.sat = (satval * 7) / 1000;
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    col1 = x.toHexString();
    clearLine();
    drawLine((rybNo * (2 / 36)));
    drawLine((sc1 * (2 / 36)));
    drawLine((sc2 * (2 / 36)));
  }
  draw5Shades(-1);
  drawWebPage();
}

function draw5Shades(n) {
  for (i = 1; i <= 5; i++) {
    document.getElementById("color" + i).style.backgroundColor = window["col" + i];
    col = w3color(window["col" + i]);
    if (col.isDark()) {
      document.getElementById("colorvalue" + i).style.color = "#ffffff";
      document.getElementById("colorvalue" + i).style.opacity = "0.6";
    } else {
      document.getElementById("colorvalue" + i).style.color = "#1f2d3d";
      document.getElementById("colorvalue" + i).style.opacity = "0.4";
    }
    document.getElementById("colorvalue" + i).innerHTML = col.toHexString().toUpperCase();
    document.getElementById("colorvalue" + i).innerHTML = col.toHexString().toUpperCase();
    if (n == -1 || n == 2) {
      document.getElementById("sethue" + i).value = (col.hue);
    }
    if (n == -1 || n == 0) {
      document.getElementById("setsat" + i).value = (col.sat * 100);
    }
    if (n == -1 || n == 1) {
      document.getElementById("setlight" + i).value = (col.lightness * 100);
    }
  }
}

function drawWebPage() {
  var x, l, i, col;
  x = document.getElementsByClassName("txcolor1");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col1;
  }
  x = document.getElementsByClassName("txcolor2");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col2;
  }
  x = document.getElementsByClassName("txcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col3;
    x[i].style.color = col4;
  }
  x = document.getElementsByClassName("txcolor4");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col4;
    x[i].style.color = col5;
  }
  x = document.getElementsByClassName("txcolor5");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col5;
    x[i].style.color = col2;
  }
  x = document.getElementsByClassName("bgcolor1");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col1;
  }
  x = document.getElementsByClassName("bgcolor2");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col2;
    x[i].style.backgroundColor = col3;
  }
  x = document.getElementsByClassName("bgcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col3;
  }
  x = document.getElementsByClassName("bgcolor4");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col4;
  }
  x = document.getElementsByClassName("bgcolor5");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col5;
  }
  x = document.getElementsByClassName("borderrightcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.borderColor = col3;
  }
}

function xxxdrawWebPage() {
  var x, l, i, col;
  x = document.getElementsByClassName("txcolor1");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col1;
  }
  x = document.getElementsByClassName("txcolor2");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col2;
  }
  x = document.getElementsByClassName("txcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col3;
  }
  x = document.getElementsByClassName("txcolor4");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col4;
  }
  x = document.getElementsByClassName("txcolor5");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.color = col5;
  }
  x = document.getElementsByClassName("bgcolor1");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col1;
  }
  x = document.getElementsByClassName("bgcolor2");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col2;
  }
  x = document.getElementsByClassName("bgcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col3;
  }
  x = document.getElementsByClassName("bgcolor4");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col4;
  }
  x = document.getElementsByClassName("bgcolor5");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.backgroundColor = col5;
  }
  x = document.getElementsByClassName("borderrightcolor3");
  l = x.length;
  for (i = 0; i < l; i++) {
    x[i].style.borderColor = col3;
  }
}

var canvas, ctx, lastend, myColor, radius, rybNo;
function initCanvas(rn) {
  rybNo = rn;
  canvas = document.getElementById("can");
  ctx = canvas.getContext("2d");
  lastend = 1.474 * Math.PI;
  myColor = ryb;
  drawCanvas()
  clearLine();
  detectEdge();
  radius = (canvas.height / 2) * 0.90;
  document.getElementById('can').onclick = function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var i, c, a1, a2, t1, t2, sc1, sc2, r1, r2, r3, sq1, sq2, sq3;
    rgb=ctx.getImageData(x, y, 1, 1).data;
    var c = w3color("rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")");
    for (i = 0; i < ryb.length; i++) {
      if (c.toHexString() == ryb[i]) {
        d = i;
        break;
      }
    }
    rybNo = d;
    x = w3color(ryb[rybNo]);
    changeRule(rybRule);
  }
  document.getElementById('can').onmousemove = function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var i, c, a1, a2, t1, t2, sc1, sc2, r1, r2, r3, sq1, sq2, sq3;
    rgb=ctx.getImageData(x, y, 1, 1).data;
    var c = w3color("rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")");
    document.getElementById("can").style.cursor = "default";
    for (i = 0; i < ryb.length; i++) {
      if (c.toHexString() == ryb[i]) {
        document.getElementById("can").style.cursor = "pointer";
      }
    }
  }
}

function drawCanvas() {
  var x;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < myColor.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, lastend, lastend + (Math.PI * 2 * ((360 / myColor.length) / 360)), false);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    lastend += Math.PI * 2 * ((360 / myColor.length) / 360);
  }
}

function clearLine() {
  ctx.setTransform(1,0,0,1,0,0);
  var lastend = 0;
  var myColor = ["#ffffff"];
  for (var i = 0; i < myColor.length; i++) {
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2.5, lastend, lastend + (Math.PI * 2 * ((360 / myColor.length) / 360)), true);
    ctx.lineTo(canvas.width / 2, canvas.height / 2);
    ctx.fill();
    lastend += Math.PI * 2 * ((360 / myColor.length) / 360);
  }
}



function drawLine(degrees) {
  ctx.setTransform(1,0,0,1,0,0);
  ctx.translate(canvas.height / 2, canvas.height / 2);
  ctx.beginPath();
  ctx.lineWidth = radius * 0.07;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(degrees * Math.PI);
  ctx.lineTo(0, - (radius * 0.75));
  ctx.stroke();
  ctx.rotate(-(degrees) * Math.PI);
}



function satlight() {
  var lightval, satval, i, x;
  lightval = document.getElementById("lightval").value;
  satval = document.getElementById("satval").value;
  for (i = 0; i < oRyb.length; i++) {
    x = w3color(oRyb[i]);
    x.lightness = (x.lightness * (lightval / 100));
    x.sat = (x.sat * (satval / 100));
    x = w3color("hsl(" + x.hue + "," + x.sat + "," + x.lightness + ")");
    ryb[i] = x.toHexString();
  }
  drawCanvas();
  changeRule(rybRule);
}

function setsatlight(y, n) {
  var lightval, satval, i, x, hueval;
  hueval = document.getElementById("sethue" + n).value;
  lightval = document.getElementById("setlight" + n).value;
  satval = document.getElementById("setsat" + n).value;
  col = w3color(window["col" + n]);
  col.hue = hueval;
  col.lightness = lightval / 100;
  col.sat = satval / 100;
  col = w3color("hsl(" + col.hue + "," + col.sat + "," + col.lightness + ")");
  window["col" + n] = col.toHexString();
  draw5Shades(y);
  drawWebPage();
}


function displayDots() {
  var x, l, i;
  x = document.getElementsByClassName("fade");
  for (i = 0; i < x.length; i++) {
    document.getElementById("dotcontainer").innerHTML += "<span class='dot' onclick='displayWebPage(" + (i + 1) + ")'></span>&nbsp;";
  }  
}

var currentwebpage = 1;
function displayWebPage(n) {
  var x, l, i;
  x = document.getElementsByClassName("fade");
  for (i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = "";
    document.getElementById("webpage" + (i + 1)).style.display = "none";
  }
  if (x.length > 0 ) {
    currentwebpage += n;
    if (currentwebpage > (x.length)) {currentwebpage = x.length;}
    if (currentwebpage < 1) {currentwebpage = 1;}
   document.getElementById("webpage" + currentwebpage).style.display = "block";
  }
}

var wheelspin, wheelspincounter, wheelspinspeed, wheelstopspeed;
function colorwheelspin() {
  wheelspincounter = 0, wheelspinspeed = 30, wheelstopspeed = 1;
  spinspinspin();
}


function spinspinspin() {
  wheelspincounter++;
  if (wheelspincounter > 50) {
    wheelspinspeed += wheelstopspeed;
    wheelstopspeed = wheelstopspeed * 1.1;
  }
  if (wheelspinspeed > 200) {
    window.clearTimeout(wheelspin);
    return;
  }
  rybNo = (rybNo + 1);
  if (rybNo > 35) {rybNo = 0;}
  wheelspin = window.setTimeout(function () {
    changeRule(rybRule);
    spinspinspin();
  }, wheelspinspeed);
}

function detectEdge() {
  var i, y, x = navigator.userAgent;
  if (x.indexOf("Edge") > -1) {
    y = document.getElementById("slidecontainer").getElementsByClassName("slider");
    for (i = 0; i < y.length; i++) {
      y[i].style.height = "24px";
    }
  }
};

