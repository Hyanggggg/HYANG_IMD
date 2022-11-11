let anynameRelatedWithWalker;

function setup() {
  createCanvas(500, 500);
  anynameRelatedWithWalker = new Walker();
}

function draw() {
  anynameRelatedWithWalker.step();
  anynameRelatedWithWalker.render();
  print("asdf:" + anynameRelatedWithWalker.asdf);
  print("qwer:" + anynameRelatedWithWalker.qwer);
}

class Walker {
  constructor() {
    this.asdf = height * 0.5;
    this.qwer = width * 0.5;
  }

  render() {
    circle(this.qwer, this.asdf, 1);
  }

  step() {
    // let randomFloat = random(4);
    // let randomInt = floor(randomFloat);
    let randomInt = floor(random(4));
    if (randomInt == 0) {
      this.asdf--;
    } else if (randomInt == 1) {
      this.asdf++;
    } else if (randomInt == 2) {
      this.qwer--;
    } else if (randomInt == 3) {
      this.qwer++;
    }
  }
}
