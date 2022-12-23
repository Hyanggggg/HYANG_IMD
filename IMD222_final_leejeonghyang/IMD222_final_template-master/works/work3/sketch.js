let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

let engine;
let world;
let boxes = [];
let circles = [];

let bowl;

let video;
let poseNet;
let poses = [];
let graphics;

let ground;
let leftWall;
let rightWall;
let bowlX;
let bowlY;
let bowlWidth;
let bowlHeight;
let wallWidth;
let wallHeight;

function setup() {
  let canvas = createCanvas(680, 680);
  canvas.parent("p5Canvas");
  frameRate(30);
  engine = Engine.create();
  world = engine.world;
  Engine.run(engine);

  bowlWidth = 300;
  bowlHeight = 5;
  wallWidth = 5;
  wallHeight = 50;
  bowlX = width / 2;
  bowlY = (height / 4) * 3.5;

  let matterOptions = {
    isStatic: true,
  };
  ground = Bodies.rectangle(bowlX, bowlY, bowlWidth, bowlHeight, matterOptions);
  leftWall = Bodies.rectangle(
    bowlX - bowlWidth / 2,
    bowlY - wallHeight / 2 + wallWidth / 2,
    wallWidth,
    wallHeight,
    matterOptions
  );
  rightWall = Bodies.rectangle(
    bowlX + bowlWidth / 2,
    bowlY - wallHeight / 2 + wallWidth / 2,
    wallWidth,
    wallHeight,
    matterOptions
  );

  World.add(world, [ground, leftWall, rightWall]);

  pixelDensity(1);
  graphics = createGraphics(680, 680);
  graphics.clear();

  video = createCapture(VIDEO);
  video.size(width, height);

  let poseOptions = {
    maxPoseDetections: 5,
  };
  poseNet = ml5.poseNet(video, modelReady, poseOptions);

  poseNet.on("pose", function (results) {
    poses = results;
  });

  video.hide();
}

function modelReady() {
  select("#status").html();
}

function draw() {
  background(0);

  image(video, 0, 0, width, height);

  drawBalls();

  image(graphics, 0, 0);

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].show();
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].show();
  }

  fill(43, 0, 255);
  rectMode(CENTER);
  noStroke();
  rect(ground.position.x, ground.position.y, bowlWidth, bowlHeight);
  rect(
    ground.position.x - bowlWidth / 2,
    ground.position.y - wallHeight / 2 + wallWidth / 2,
    wallWidth,
    wallHeight
  );
  rect(
    ground.position.x + bowlWidth / 2,
    ground.position.y - wallHeight / 2 + wallWidth / 2,
    wallWidth,
    wallHeight
  );
}

function drawBalls() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let leftEyePoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftEye"
      );
      let rightEyePoint = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightEye"
      );

      let d = int(
        dist(
          leftEyePoint.position.x,
          leftEyePoint.position.y,
          rightEyePoint.position.x,
          rightEyePoint.position.y
        )
      );

      let rightWrist = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightWrist"
      );
      let leftWrist = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftWrist"
      );

      let keypoint = pose.keypoints[j];
      let handHue = (leftWrist.position.x / width) * 360;
      let noseSize = 5 + (height - rightWrist.position.y) / 5;
      if (
        keypoint.score > 0.5 &&
        (keypoint.part == "leftEye" || keypoint.part == "rightEye")
      ) {
        circles.push(
          new Circle(
            keypoint.position.x,
            keypoint.position.y + d / 5,
            noseSize,
            handHue
          )
        );
      }
    }
  }
}

function drawKeypoints() {
  if (poses.length > 0) {
    let pose = poses[0].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let rightWrist = pose.keypoints.find(
        (keypoint) => keypoint.part === "rightWrist"
      );
      let leftWrist = pose.keypoints.find(
        (keypoint) => keypoint.part === "leftWrist"
      );

      let keypoint = pose.keypoints[j];
      let handHue = (rightWrist.position.x / width) * 360;
      let noseSize = height - rightWrist.position.y;

      // draw with the nose
      // use the right hand x position for hue
      // use the right hand y position for size
      if (keypoint.score > 0.5 && keypoint.part == "nose") {
        graphics.fill(handHue, 100, 100);
        graphics.noStroke();
        graphics.ellipse(keypoint.position.x, keypoint.position.y, noseSize);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(201, 249, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

function Box(x, y, w, h, hue = 255) {
  // options for a body
  var options = {
    friction: 0.3,
    restitution: 1,
    isStatic: true,
  };
  this.body = Bodies.rectangle(x, y, w, h, options);
  this.w = w;
  this.h = h;
  this.xPos = 0;
  this.yPos = 0;
  this.hue = hue;
  // add the body to the world
  World.add(world, this.body);

  // draw the body to the canvas
  // using p5 and rotate, translate it
  // to the right position/angle
  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    Bodies.translate(this.body, { x: pos.x, y: pos.y });
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(255);
    fill(201, 249, 0);
    rect(0, 0, this.w, this.h);
    pop();
  };
}
