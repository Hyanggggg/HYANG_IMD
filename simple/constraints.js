// let Engine = Matter.Engine,
//   Render = Matter.Render,
//   Composites = Matter.Composites,
//   Constraint = Matter.Constraint,
//   MouseConstraint = Matter.MouseConstraint,
//   Mouse = Matter.Mouse,
//   Composite = Matter.Composite,
//   Bodies = Matter.Bodies;

Matter.use("matter-attractors");
Matter.use("matter-wrap");

var Engine = Matter.Engine,
    Events = Matter.Events,
    Runner = Matter.Runner,
    Render = Matter.Render,
    World = Matter.World,
    Body = Matter.Body,
    Mouse = Matter.Mouse,
    Common = Matter.Common,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint, //가져온거
    MouseConstraint = Matter.MouseConstraint; //가져온거
    Bodies = Matter.Bodies;
// create engine
let engine;

// add mouse control
let mouse;

let canvas;
let matterBodies = [];
let matterConstraints = [];
let walls = [];

function createWalls(thickness) {
  let walls = [
    new P5Rect(width * 0.5, 0, width, thickness, {
      isStatic: true,
    }),
    new P5Rect(width * 0.5, height, width, thickness, {
      isStatic: true,
    }),
    new P5Rect(width, height * 0.5, thickness, height, {
      isStatic: true,
    }),
    new P5Rect(0, height * 0.5, thickness, height, {
      isStatic: true,
    }),
  ];
  walls.forEach((wall) => matterBodies.push(wall));
  return walls;
}

function setup() {
  let dom = document.getElementById("sketch");
  canvas = createCanvas(
    dom.getBoundingClientRect().width,
    dom.getBoundingClientRect().height
  );
  canvas.parent("sketch");
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;
  engine.world.gravity.x = 0;
  engine.world.gravity.scale = 0.1;

  // var render = Render.create({
  //   element: canvas,
  //   engine: engine,
  //   options: {
  //     showVelocity: false,
  //     //showAngleIndicator: true,//추가
  //     width: dimensions.width,
  //     height: dimensions.height,
  //     wireframes: false,
  //     background: "rgb(240,240,240)",
  //   },
  // });
  

  walls = createWalls(70);
  
  Matter.use("matter-attractors");
  Matter.use("matter-wrap");
  
  let rockOptions = { density: 0.005,
    // render: {
    //   fillStyle: `#F469FF`,
    //   strokeStyle: `#EF5AFF`,
    //   lineWidth: 0,
    // },
    plugin: {//달라붙는거
      attractors: [
        function (bodyA, bodyB) {
          return {
            x: (bodyA.position.x - bodyB.position.x) * 1e-6,
            y: (bodyA.position.y - bodyB.position.y) * 1e-6,
          };
        },
      ],
    },
  }//무게감
  // add damped soft global constraint
  let bodyx = new P5Polygon(width/2, height/2, 8, 140, rockOptions).setFillColor("#F469FF").setStrokeColor("#EF5AFF");
  matterBodies.push(bodyx);
  let constraint2 = new P5Constraint({
    pointA: { x: width/2, y: height/2 },
    bodyB: bodyx.getBody(),
    stiffness: 0.01,
    damping: 0.01,
  });
  matterConstraints.push(constraint2);

  for (var i = 0; i < 90; i += 1) {
    let x = Common.random(0, width);
    let y = Common.random(0, height);
    let s =
      Common.random() > 0.6 ? Common.random(10, 80) : Common.random(4, 60);
    let poligonNumber = Common.random(3, 8);
    //다각형

    let body2 = new P5Polygon(x, y, poligonNumber, s,
      {
        mass: s / 80,
        friction: 0,
        frictionAir: 0.02,
        //
        angle: Math.round(Math.random() * 360),
        
        render:{
          lineWidth: 10,
          
        }
      }).setFillColor("#FFFFFF").setStrokeColor("#2FFC61");
    matterBodies.push(body2);

    let r = Common.random(0, 4);
    let body3 = new P5Circle(x, y, Common.random(2, 30), {
      //원에 가까이
      mass: 0.2,
    }).setFillColor( r > 2 ? "#2FFC61" : "rgb(240,240,240)").setStrokeColor("#00FF36F");
    matterBodies.push(body3);

    let body4 = new P5Circle(x, y, Common.random(2, 40), {
      mass: 0.5,
      friction: 0,
      frictionAir: 0,
    }).setFillColor(r > 1 ? "#2727FF" : "rgb(240,240,240)").setStrokeColor("#4A4AFF");
    matterBodies.push(body4);


    let body5 = new P5Circle(x, y, Common.random(2, 40), {
      mass: 0.5,
      friction: 0,
      frictionAir: 0,
    }).setFillColor("rgb(240,240,240)").setStrokeColor("#F6B6FF");
    matterBodies.push(body5);
  
  }
  // add damped soft global constraint
  let body7A = new P5Polygon(500, 400, 6, 30).setFillColor("#ffffff").setStrokeColor("#FFFB69");
  let body7B = new P5Polygon(600, 400, 7, 60).setFillColor("#FFFB69");
  matterBodies.push(body7A);
  matterBodies.push(body7B);
  let constraint7 = new P5Constraint({
    bodyA: body7A.getBody(),
    pointA: { x: -10, y: -10 },
    bodyB: body7B.getBody(),
    pointB: { x: -10, y: -10 },
    stiffness: 0.001,
    damping: 0.1,
  });
  matterConstraints.push(constraint7);

  let body8A = new P5Polygon(1400, 1000,5, 30).setFillColor("#ffffff").setStrokeColor("#FFFB69");
  let body8B = new P5Polygon(1600, 1000, 3, 60).setFillColor("#FFFB69");
  matterBodies.push(body8A);
  matterBodies.push(body8B);
  let constraint8 = new P5Constraint({
    bodyA: body8A.getBody(),
    pointA: { x: -10, y: -10 },
    bodyB: body8B.getBody(),
    pointB: { x: -10, y: -10 },
    stiffness: 0.001,
    damping: 0.1,
  });
  matterConstraints.push(constraint8);

  console.log(constraint7);

  console.log(constraint7.getConstraint().bodyA.position.x);

  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  Composite.add(world, mouseConstraint);

  // let data = {
  //   engine: engine,
  //   runner: runner,
  //   render: render,
  //   canvas: render.canvas,
  //   stop: function () {
  //     Matter.Render.stop(render);
  //     Matter.Runner.stop(runner);
  //   },
  //   play: function () {
  //     Matter.Runner.run(runner, engine);
  //     Matter.Render.run(render);
  //   },
  // };

  // Matter.Runner.run(runner, engine);
  // Matter.Render.run(render);
  // return data;

}


function draw() {

  Matter.use("matter-attractors");
  Matter.use("matter-wrap");

  background("rgb(240,240,240)");
  Engine.update(engine);
  matterBodies.forEach((body) => {
    body.render();
  });
  matterConstraints.forEach((constraint) => constraint.render());
  // matterBodies.forEach((body) => {
  //   body.renderDirVector();
  // });
}