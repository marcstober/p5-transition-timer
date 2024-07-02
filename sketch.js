
class Ball {
  constructor(x, y, r, v) {
    this.positionVector = createVector(x, y)
    this.r = r
    this.velocityVector = createVector(1) // can't setMag on a zero vector
    this.velocityVector.setMag(v)
    let randomRadians = random(0, TWO_PI)
    this.velocityVector.setHeading(randomRadians)
  }

  draw() {
    console.log("drawing ball")
    // check for collision with side walls
    if (this.positionVector.x < this.r || this.positionVector.x > width - this.r) {
      let horizontalVector = createVector(1)
      this.velocityVector.reflect(horizontalVector)
    }

    if (this.positionVector.y < this.r || this.positionVector.y > height - this.r) {
      let verticalVector = createVector(0, 1)
      this.velocityVector.reflect(verticalVector)
    }

    this.positionVector.add(this.velocityVector)

    circle(this.positionVector.x, this.positionVector.y, this.r * 2)
  }
}

function setup() {
  // Create a p5.Vector object.
  let v = createVector(3, 4, 0);

  // Prints "5" to the console.
  print(v.mag());

  // Set its magnitude to 10.
  v.setMag(10);

  // Prints "p5.Vector Object : [6, 8, 0]" to the console.
  print(v.toString());


  createCanvas(windowWidth, windowHeight);

  balls = [
    new Ball(100, 100, 25, 2),
    new Ball(200, 200, 25, 3)
  ]
}

let balls

// Collisions:
// * https://codeguppy.com/blog/how-to-implement-collision-detection-between-two-circles-using-p5.js/index.html
// * https://editor.p5js.org/aferriss/sketches/S1Q6Q1J2b
// 


function getYValue(key) {
  let _y = balls[0].y
  if (key == 'w') {
    return _y - 1
  }
  if (key == 's') {
    return _y + 1
  }
  return _y
}

function draw() {
  background("#D0E0E2");

  fill("#F37121")

  if (keyIsPressed) {
    ball[0].y = getYValue(key)
  }

  for (ball of balls) {
    ball.draw()
  }
}

