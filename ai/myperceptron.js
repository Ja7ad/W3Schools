// Perceptron Object ---------------------
function Perceptron(no, learningRate = 0.00001) {

// Set Initial Values
this.learnc = learningRate;
this.bias = 1;

// Compute Randow Weights
this.weights = [];
for (let i = 0; i <= no; i++) {
  this.weights[i] = Math.random() * 2 - 1;
}

// Activate Function
this.activate = function(inputs) {
  let sum = 0;
  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * this.weights[i];
  } 
  if (sum > 0) {return 1} else {return 0}
}

// Train Function
this.train = function(inputs, desired) {
  inputs.push(this.bias);
  let guess = this.activate(inputs);
  let error = desired - guess;
  if (error != 0) {
    for (let i = 0; i < inputs.length; i++) {
      this.weights[i] += this.learnc * error * inputs[i];         
    }
  }
}
// End Perceptron Object ---------------------
}
