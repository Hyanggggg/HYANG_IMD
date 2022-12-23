let streams = [];
let fadeInterval = 0.8;
let symbolSize = 18;
var video;
var capture;
var vScale = 10;
function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  background(0);
  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, random(-3000, 0));
    streams.push(stream);
    x += symbolSize;
  }
  textFont("Consolas");
  textSize(symbolSize);
}

function draw() {
  background(0);
  streams.forEach(function (stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;

  this.switchInterval = round(random(2, 30));

  this.setToRandomSymbol = function () {
    var charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        // 랜덤 불러오기
        this.value = String.fromCharCode(floor(random(0, 50)));
      } else {
        this.value = floor(random(0, 10));
      }
    }
  };

  this.rain = function () {
    this.y = this.y >= height ? 0 : (this.y += this.speed);
  };
}

function Stream() {
  this.symbols = [];
  this.totalSymbols = round(random(2, 65));
  this.speed = random(8, 22);

  this.generateSymbols = function (x, y) {
    var opacity = 255;
    var first = round(random(0, 4)) == 1;
    for (var i = 0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(x, y, this.speed, first, opacity);
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= 255 / this.totalSymbols / fadeInterval;
      y -= symbolSize;
      first = false;
    }
  };

  this.render = function () {
    this.symbols.forEach(function (symbol) {
      if (symbol.first) {
        fill(201, 249, 50, symbol.opacity);
      } else {
        fill(34, 50, 255, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      symbol.setToRandomSymbol();
    });
  };
}
