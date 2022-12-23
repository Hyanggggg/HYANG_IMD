let d;
let capture;
let pg;
let Mirror;
let Crop;

const simplex = new SimplexNoise();
let bu;
let noiseDensity;
let fur;
let gradientStepQty;
let gradientStepSize;
let brightnessAdjustment;

function setup() {
  frameRate(10);
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  capture = createCapture(VIDEO);
  capture.hide();
  d = pixelDensity();
  speed = 1 / 2 ** 6;
  res = 22;
  gradientStepQty = 20;
  gradientStepSize = 0.4;
  brightnessAdjustment = 4;
  Mirror = true;
  Crop = true;
  reset();
}

function draw() {
  background(0);
  if (!capture.loadedmetadata) {
    fill(255);
    if (frameCount % 30 > 15) {
      circle(width / 2, height / 2, bu / 64);
    }
  } else {
    if (pg === undefined) {
      pg = createGraphics(floor(width / tileSize), floor(height / tileSize));
    } else {
      if (Crop) {
        if (pg.width / pg.height > capture.width / capture.height) {
          let destHeight = (pg.width * capture.height) / capture.width;
          pg.image(
            capture,
            0,
            -(destHeight - pg.height) / 2,
            pg.width,
            destHeight
          );
        } else {
          let destWidth = (pg.height * capture.width) / capture.height;
          pg.image(
            capture,
            -(destWidth - pg.width) / 2,
            0,
            destWidth,
            pg.height
          );
        }
      } else {
        /* stretched to fit */
        pg.image(capture, 0, 0, pg.width, pg.height);
      }
      pg.loadPixels();
      try {
        for (let i = 0; i < floor(height / tileSize); i++) {
          for (let j = 0; j < floor(width / tileSize); j++) {
            let c;
            if (Mirror) {
              c = color(
                pg.pixels[(d * i * pg.width + pg.width - j - 1) * d * 4],
                pg.pixels[(d * i * pg.width + pg.width - j - 1) * d * 4 + 1],
                pg.pixels[(d * i * pg.width + pg.width - j - 1) * d * 4 + 2]
              );
            } else {
              c = color(
                pg.pixels[(d * i * pg.width + j) * d * 4],
                pg.pixels[(d * i * pg.width + j) * d * 4 + 1],
                pg.pixels[(d * i * pg.width + j) * d * 4 + 2]
              );
            }

            fur[i * floor(width / tileSize) + j].rotate(
              2 *
                tileSize *
                simplex.noise3D(
                  i * noiseDensity,
                  j * noiseDensity,
                  frameCount * speed
                ),
              2 *
                tileSize *
                simplex.noise3D(
                  i * noiseDensity,
                  j * noiseDensity,
                  100 + frameCount * speed
                )
            );
            fur[i * floor(width / tileSize) + j].display(c);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
}

function Drift(x, y) {
  this.pos = new createVector(x, y);
  this.dir = new createVector(x, y);
}

Drift.prototype.rotate = function (x, y) {
  this.dir = new createVector(x, y);
};

Drift.prototype.display = function (c) {
  c.setAlpha(
    ((255 * this.dir.mag()) / tileSize / gradientStepQty) * brightnessAdjustment
  );
  stroke(c);

  strokeWeight(this.dir.mag() / 8);
  let start = this.pos.copy();
  let end = p5.Vector.add(this.pos, this.dir.setMag(this.dir.mag() + tileSize));
  // my implementation of gradient
  for (let i = 0; i < gradientStepQty; i++) {
    line(start.x, start.y, end.x, end.y);
    this.dir.mult(gradientStepSize);
    start = p5.Vector.sub(end, this.dir);
  }
  //line(this.pos.x, this.pos.y, dest.x, dest.y);
  c.setAlpha(255 / 2);
  stroke(c);
  point(end.x, end.y);
};

function reset() {
  fur = [];
  bu = width > height ? height : width; // shorter edge of canvas
  noiseDensity = 0.04;
  tileSize = bu / res;
  pg = undefined;
  for (let i = 0; i < floor(height / tileSize); i++) {
    for (let j = 0; j < floor(width / tileSize); j++) {
      fur.push(
        new Drift(j * tileSize + tileSize / 2, i * tileSize + tileSize / 2)
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  reset();
}
