var drops = [];
var video;
var capture;
var vScale = 10;
function setup() {
  frameRate(20);
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  capture = createCapture(VIDEO);
  capture.hide();
  for (var i = 0; i < 400; i++) {
    drops[i] = new Drop();
  }
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / vScale + 10, height / vScale + 10);
  video.hide();
}

function draw() {
  background(0);
  for (var i = 0; i < drops.length; i++) {
    drops[i].fall();
    drops[i].show();
  }

  video.loadPixels();
  loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x + 1 + y * video.width) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];

      var brightness = (r + g + b) / 4;

      var w = map(brightness, 0, 255, 0, vScale);

      if (brightness >= 127) {
        fill(34, 50, 255);
        textSize(14);
        text("☀", x * vScale, y * vScale);
      } else if (brightness < 127) {
        noStroke();
        fill(255);
        rectMode(CENTER);
        rect(x * vScale, y * vScale, w, w);
      }
    }
  }
}

function Drop() {
  this.x = random(width);
  this.y = random(-500, -50);
  this.z = random(0, 30);
  this.len = map(this.z, 0, 20, 10, 20);
  this.yspeed = map(this.z, 0, 20, 1, 20);

  this.fall = function () {
    this.y = this.y + this.yspeed;
    var grav = map(this.z, 0, 20, 0, 0.2);
    this.yspeed = this.yspeed + grav;

    if (this.y > height) {
      this.y = random(-200, -100);
      this.yspeed = map(this.z, 0, 20, 4, 10);
    }
  };

  this.show = function () {
    var thick = map(this.z, 0, 20, 1, 3);
    strokeWeight(thick);
    stroke(201, 249, 0);
    line(this.x, this.y, this.x, this.y + this.len);
  };
}
