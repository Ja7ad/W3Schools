// Perceptron Object ---------------------
function XYPerceptron (n, slope, b, c, xMax, yMax) {
// Set Ptron Variables
this.numpoints = n;
this.slope = slope;
this.intercept = b;
this.learnc = c;
this.bias = 1;
this.desired = [];
// Set Random Weights
this.weights = [];
for (let i = 0; i < 3; i++) {
  this.weights[i] = Math.random()*2-1;
}
// Set XY Points
this.xPoints = [];
this.yPoints = [];
for (let i = 0; i < this.numpoints; i++) {
  this.xPoints[i] = Math.random() * xMax;
  this.yPoints[i] = Math.random() * yMax;
}

// F(x) Function
this.f = function(x) {
  return x * this.slope + this.intercept;
}

// Compute Desired Answers
this.desired = function () {
  for (let i = 0; i < this.numpoints; i++) {
    let x = this.xPoints[i];
    let y = this.yPoints[i];
    let answer = -1;
    if (y > this.f(x)) {answer = 1;}
    this.desired[i] = answer;
  }
}

// Activate Function
this.activate = function(inputs) {
  let sum = 0;
  for (let i = 0; i < 3; i++) {
    sum += inputs[i] * this.weights[i];
  } 
  if (sum > 0) {return 1;} else {return -1;}
}

// Train Function
this.train = function(i) {
  let x = this.xPoints[i];
  let y = this.yPoints[i];
  let input = [x, y, this.bias];
  let guess = this.activate(input);
  // Error can be 0, -2, or 2
  let error = this.desired[i] - guess;
  // Adjust weights based on weightChange * input
  if (error != 0) {
    for (let i = 0; i < 3; i++) {
      this.weights[i] += this.learnc * error * input[i];         
    }
  }
  return error;        
}}