function Circle(x, y, radius, hue) {
  var options = {
    friction: 0.3,
    restitution: 0.5,
  };
  this.body = Bodies.circle(x, y, radius, options);
  this.radius = radius;
  this.hue = hue;

  World.add(world, this.body);

  this.show = function () {
    var pos = this.body.position;
    var angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    strokeWeight(1);
    stroke(249, 255, 255);
    fill(201, 255, 0);
    circle(0, 0, this.radius * 3);
    pop();
  };
}
