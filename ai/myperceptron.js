// Perceptron Object ---------------------
function Perceptron(no) {

// Set Variables and Weights
this.learnc = 0.01;
this.bias = 1;
this.weights = [];
for (let i = 0; i <= no; i++) {
  this.weights[i] = Math.random()*2-1;
}

// Activate Function
this.activate = function(inputs) {
  let sum = 0;
  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * this.weights[i];
  } 
  if (sum > 0) {return 1} else {return -1}
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

}
