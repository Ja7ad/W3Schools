function Trainer(xArray, yArray) {
this.xArr = xArray;
this.yArr = yArray;
this.points = this.xArr.length;
this.learnc = 0.000001;
this.weight = 0;
this.bias = 1;
this.cost;

// Cost Error Function
this.costError = function() {
  total = 0;
  for (let i = 0; i < this.points; i++) {
    total += (this.yArr[i] - (this.weight * this.xArr[i] + this.bias)) **2;
  }
  return total / this.points;
}

// Train Function
this.train = function(iter) {
  for (let i = 0; i < iter; i++) {
    this.updateWeights();
  }
  this.cost = this.costError();
}

// Update Weights Function
this.updateWeights = function() {
  let wx;
  let w_deriv = 0;
  let b_deriv = 0;
  for (let i = 0; i < this.points; i++) {
    wx = this.yArr[i] - (this.weight * this.xArr[i] + this.bias);
    w_deriv += -2 * wx * this.xArr[i];
    b_deriv += -2 * wx;
  }
  this.weight -= (w_deriv / this.points) * this.learnc;
  this.bias -= (b_deriv / this.points) * this.learnc;
}

} // End Trainer Object
