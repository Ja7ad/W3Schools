// Plotter Object
function XYPlotter(id) {

// Setup
this.canvas = document.getElementById(id);
this.ctx = this.canvas.getContext("2d");
this.xMin = 0;
this.yMin = 0;
this.xMax = this.canvas.width;
this.yMax = this.canvas.height;
this.ctx.font = "16px Verdana";
this.xF = 1;
this.yF = 1;

// Transform XY Function 
this.transformXY = function() {
  this.ctx.transform(1, 0, 0, -1, 0, this.canvas.height);
}

// Transform Max Function 
this.transformMax = function(x, y) {
  this.xF = this.xMax / x
  this.yF = this.yMax / y
}

// Plot One XY Point
this.plotPoint = function(x, y, color, radius = 3) {
  this.ctx.fillStyle = color;
  this.ctx.beginPath();
  this.ctx.ellipse(x*this.xF, y*this.yF, radius, radius, 0, 0, Math.PI * 2);
  this.ctx.fill();
}

// Plot Points Function
this.plotPoints = function(n, xArr, yArr, color, radius = 3) {
  for (let i = 0; i < n; i++) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.ellipse(xArr[i]*this.xF, yArr[i]*this.yF, radius, radius, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// Plot Line Function
this.plotLine = function(x0, y0, x, y, color) {
  this.ctx.moveTo(x0*this.xF, y0*this.yF);
  this.ctx.lineTo(x*this.xF, y*this.yF);
  this.ctx.strokeStyle = color;
  this.ctx.stroke();
}

// Plot Rectangle Function
this.plotRectangle = function(x, y, w, h) {
  this.ctx.strokeRect(x*this.xF, y*this.yF, w, h);
}

// Plot Circle Function
this.plotCircle = function(x, y, r) {
  this.ctx.beginPath();
  this.ctx.arc(x*this.xF, y*this.yF, r, 0, 2 * Math.PI);
  this.ctx.stroke();
}

// Plot Text Function
this.plotText = function(x, y, text) {
  this.ctx.fillText(text, x*this.xF, y*this.yF);
}

} // End of Plotter Object
