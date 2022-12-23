var x, y;
var horiz;
var yoff = 0.0;
var points = 50;
var video;
var pScale = 8;

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  waves1 = new Wave();
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / pScale + 10, height / pScale + 10);
  video.hide();
}

function draw() {
  background(34, 50, 255);
  video.loadPixels();
  loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (x + y * video.width) * 4;
      var r = video.pixels[index + 0];
      var g = video.pixels[index + 1];
      var b = video.pixels[index + 2];

      var bright = (r + g + b) / 3;
      var w = map(bright, 0, 255, pScale, pScale);

      noStroke();
      if (bright > 200) {
        fill(2, 50, 125);
      }
      if (bright <= 200 && bright > 130) {
        fill(201, 249, 0);
      }

      if (bright <= 130 && bright > 100) {
        fill(0, 255, 0);
      }

      if (bright <= 100) {
        fill(random(34, 50, 255), 0, random(255, 0));
      }
      ellipseMode(CENTER);
      ellipse(x * pScale, y * pScale, w, w);
    }
  }
}

class Wave {
  drawShape(vertexX, vertexY, xoffNew, yoffNew, c, strWeight) {}
}
