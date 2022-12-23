let buffer;
let spots = [];

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  colorMode(HSB);
  ellipseMode(CENTER);

  frameRate(20);
  buffer = new VideoBuffer(width / 4, height / 4);
  for (let i = 0; i < 4000; i++) {
    spots.push(new Spot(canvas, buffer));
  }
}

function draw() {
  buffer.update();
  background(1);

  if (frameCount > 20) {
    for (spot of spots) {
      spot.update();
      spot.show();
    }
  }
}

class Spot {
  constructor(canvas, buffer) {
    this.buffer = buffer;
    this.x = random(canvas.width);
    this.y = random(canvas.height);
    this.xBuffer = int((this.x / canvas.width) * buffer.width);
    this.yBuffer = int((this.y / canvas.height) * buffer.height);

    this.hue = random(360);
    this.saturation = 70;
    this.brightness = 20;
    this.alpha = 1;
    this.maxRadius = random(10, 50);
    this.radius = 10;
  }

  update() {
    let videoColor = this.buffer.getColor(this.xBuffer, this.yBuffer);
    let b = brightness(videoColor);
    this.radius = map(b, 0, 80, this.maxRadius, 1);
    this.brightness = map(b, 0, 100, 100, 20);
  }

  show() {
    noStroke();
    fill(this.hue, this.saturation, this.brightness);
    ellipse(this.x, this.y, this.radius, this.radius);
  }
}

class VideoBuffer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.capture = createCapture(VIDEO);
    this.capture.size(this.width, this.height);
    this.capture.hide();
    this.buffer = createGraphics(this.width, this.height);
    this.buffer.pixelDensity(1);
  }

  getBuffer() {
    return this.buffer;
  }

  update() {
    this.copyWebcamToBuffer();
    this.buffer.loadPixels();
  }

  getColor(x, y) {
    x = int(x);
    y = int(y);
    let index = 4 * (x + y * this.width);
    return this.buffer.color(
      this.buffer.pixels[index],
      this.buffer.pixels[index + 1],
      this.buffer.pixels[index + 2],
      this.buffer.pixels[index + 3],
      this.buffer.pixels[index + 4]
    );
  }

  copyWebcamToBuffer() {
    this.buffer.push();
    this.buffer.translate(this.width, 0);
    this.buffer.scale(-1.1, 1.35);
    this.buffer.image(this.capture, 0, 0);
    this.buffer.pop();
  }
}
