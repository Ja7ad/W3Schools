function drawFace(ctx, radius) {
var grad;
ctx.beginPath();
ctx.fillStyle='white';
grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
grad.addColorStop(0, '#333');
grad.addColorStop(0.5, 'white');
grad.addColorStop(1, '#333');
ctx.strokeStyle = grad;
ctx.lineWidth = radius*0.1;
ctx.arc(0, 0, radius, 0, 2*Math.PI);
ctx.fill();
ctx.stroke();
ctx.strokeStyle = "#333";
ctx.beginPath();
ctx.fillStyle = '#333';
ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
ctx.fill();
}
function drawNumbers(ctx, radius) {
var ang;
var n;
ctx.font = radius*0.15 + "px arial";
ctx.textBaseline = "middle";
ctx.textAlign = "center";
for(n = 1; n < 13; n++){
  ang = n*Math.PI/6;
  ctx.rotate(ang);
  ctx.translate(0, -radius*0.85);
  ctx.rotate(-ang);
  ctx.fillText(n.toString(), 0, 0);
  ctx.rotate(ang);
  ctx.translate(0, radius*0.85);
  ctx.rotate(-ang);
  }
}
function drawGlass(ctx, radius) {
grad=ctx.createRadialGradient(-0.4*radius, -0.4*radius, 0, -0.4*radius, -0.4*radius, 14*radius/12);
grad.addColorStop(0, "rgba(255,255,255,0.8)");
grad.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = grad;
ctx.beginPath();
ctx.arc(0, 0, radius, 0, 2*Math.PI);
ctx.fill();
}
function drawTime(ctx, radius, UTC, now){
if (UTC) {
var hour = now.getUTCHours();
} else {
var hour = now.getHours();
}
var minute = now.getMinutes();
var second = now.getSeconds();
//hour
hour=hour%12;
hour=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
drawHand(ctx, hour, radius*0.5, radius*0.07);
//minute
minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
drawHand(ctx, minute, radius*0.8, radius*0.07);
// second
second=(second*Math.PI/30);
drawHand(ctx, second, radius*0.9, radius*0.02);
}
function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
