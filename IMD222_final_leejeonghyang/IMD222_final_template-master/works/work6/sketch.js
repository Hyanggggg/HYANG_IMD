var video;
var vScale = 20;

var particles = [];

var slider;

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  pixelDensity(10);
  video = createCapture(VIDEO);
  video.size(width / vScale, height / vScale);
  video.hide();
  for (var i = 0; i < 900; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
  slider = createSlider(20, 220, 120);
  slider.size(200, 50);
}

function draw() {
  background(0);
  video.loadPixels();
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
}
function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.r = random(2, 70);

  this.update = function () {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  };

  this.show = function () {
    noStroke();
    var px = floor(this.x / vScale);
    var py = floor(this.y / vScale);
    var col = video.get(px, py);

    fill(col[0], col[1], col[2], slider.value());
    ellipse(this.x, this.y, this.r, this.r);
  };
}
