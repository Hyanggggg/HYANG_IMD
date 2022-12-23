let capture;
let posenet;
let lefteyex = 0;
let lefteyey = 0;
let righteyex = 0;
let righteyey = 0;
let lefttears = [];
let righttears = [];

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  capture = createCapture(VIDEO);
  capture.hide();
  posenet = ml5.poseNet(capture);
  posenet.on("pose", gotposes);
}

function gotposes(poses) {
  if (poses.length > 0) {
    let newlefteyex = poses[0].pose.keypoints[1].position.x;
    let newlefteyey = poses[0].pose.keypoints[1].position.y;
    lefteyex = lerp(lefteyex, newlefteyex + 20, 0.2);
    lefteyey = lerp(lefteyey, newlefteyey + 80, 0.2);

    let newrighteyex = poses[0].pose.keypoints[2].position.x;
    let newrighteyey = poses[0].pose.keypoints[1].position.y;
    righteyex = lerp(righteyex, newrighteyex + 20, 0.2);
    righteyey = lerp(righteyey, newrighteyey + 80, 0.2);
  }
}

function draw() {
  background(0);
  image(capture, 0, 0, 680, 680);
  noStroke();
  ellipse(mouseX, mouseY, 30);
  ellipse;

  let tleft = new lefttear();
  lefttears.push(tleft);
  for (let i = 0; i < lefttears.length; i++) {
    lefttears[i].show();
    lefttears[i].move();
  }

  let tright = new righttear();
  righttears.push(tright);
  for (let i = 0; i < righttears.length; i++) {
    righttears[i].show();
    righttears[i].move();
  }

  for (let t of lefttears) {
    if (t.overlap()) {
      lefttears.splice(t, 1);
    }
  }

  for (let d of righttears) {
    if (d.overlap()) {
      righttears.splice(d, 1);
    }
  }
}

class lefttear {
  constructor() {
    this.x = lefteyex;
    this.y = lefteyey;
    this.vx = random(-1, 2);
    this.vy = random(1, 5);
    this.alpha = 250;
  }

  show() {
    fill(255, this.alpha);
    ellipse(this.x, this.y, 15, 15);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }
  overlap() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    return d < 50;
  }
}

class righttear {
  constructor() {
    this.x = righteyex;
    this.y = righteyey;
    this.vx = random(-2, 1);
    this.vy = random(1, 5);
    this.alpha = 250;
  }

  show() {
    fill(255, this.alpha);
    ellipse(this.x, this.y, 15, 15);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
  }

  overlap() {
    let d = dist(this.x, this.y, mouseX, mouseY);
    return d < 50;
  }
}
