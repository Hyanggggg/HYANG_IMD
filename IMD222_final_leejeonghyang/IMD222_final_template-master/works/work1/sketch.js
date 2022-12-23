let tiles = [];
let capture;
let circles = [];
let timeToChangeSeconds = 0.3;
let changeColorTime;

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  capture = createCapture(VIDEO);
  capture.size(480, 150);
  capture.hide();
  changeColorTime = timeToChange();
}

function drawCircle({ x, y, size, c }) {
  fill(c);
  circle(x, y, size);
}

function timeToChange() {
  return Date.now() + 1000 * timeToChangeSeconds;
}

function draw() {
  image(capture, 0, 0, 680, 680);
  circle(mouseX, mouseY, 10);
  circles.forEach(drawCircle);
  if (changeColorTime < Date.now()) {
    circles = circles.map((c) => {
      return {
        x: c.x,
        y: c.y,
        size: c.size,
        c: createColor(),
      };
    });
    changeColorTime = timeToChange();
  }
}

function createColor() {
  let red = random(0, 255);
  let green = random(0, 255);
  let blue = random(0, 255);

  let c = color(red, green, blue);
  c.setAlpha(random(15, 100));
  noStroke();
  return c;
}

function mousePressed() {
  circles.push({
    x: mouseX,
    y: mouseY,
    size: random(5, 250),
    c: createColor(),
  });
}
