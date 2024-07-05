import Ball from './ball.js'
import { parseTimeString } from './utils.js'

const SCITECH_BLUE = "#12B6CA"
const SCITECH_ORANGE = "#F37121"
const SCITECH_DARKBLUE = "#04454C"

const fill1 = SCITECH_BLUE
const fill2 = SCITECH_ORANGE

// // 4th of July colors
// const fill1 = "#6666FF" // #0000FF looks black on my projector
// const fill2 = "#FF0000"

let endTime

let notificationSound
let alarmPlayed = false

function preload() {
  notificationSound = loadSound('simple-notification-152054.mp3');
}

function setup() {
  let v = createVector(3, 4, 0);

  v.setMag(10);

  createCanvas(windowWidth, windowHeight);


  // let endTimeString = prompt("End time (HH:MM)?", `${defaultEndTime.getHours()}:${defaultEndTime.getMinutes()}`)
  // endTime = parseTimeString(endTimeString)

  showSettingsDialog()


  // console.log("balls.length: ", balls.length)
  // balls = [
  //   new Ball(100, 100, 25, 2),
  //   new Ball(200, 200, 25, 3)
  // ]

  textFont('Calibri, Arial, sans-serif')
}

function handleSettingsChange() {
  let timeRemaining = endTime - new Date()
  let timeRemainingInSeconds = Math.ceil(timeRemaining / 1000)
  let timeRemainingInMinutes = Math.ceil(timeRemainingInSeconds / 60)

  for (let i = 0; i < timeRemainingInMinutes; i++) {
    let v = random(1, 5)
    balls.push(new Ball(random(25, width - 25), random(25, height - 25), 25, v
    ))
  }

  loop() // why is this necessary? I didn't call noLoop() 
}


let balls = []

// Collisions:
// * https://codeguppy.com/blog/how-to-implement-collision-detection-between-two-circles-using-p5.js/index.html
// * https://editor.p5js.org/aferriss/sketches/S1Q6Q1J2b
// 


// function getYValue(key) {
//   let _y = balls[0].y
//   if (key == 'w') {
//     return _y - 1
//   }
//   if (key == 's') {
//     return _y + 1
//   }
//   return _y
// }

function draw() {
  let timeRemaining = endTime - new Date()
  let timeRemainingInSeconds = Math.ceil(timeRemaining / 1000);
  let minutes = Math.floor(timeRemainingInSeconds / 60);
  let seconds = timeRemainingInSeconds % 60;
  let timeRemainingFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  if (timeRemaining <= 0 && !alarmPlayed) {
    console.log("Time's up! (should only see this once)") // debugging
    alarmPlayed = true;
    let count = 0
    // play once, then 4 more times at an interval (total 5 times)
    notificationSound.play();
    let intvl = setInterval(() => {

      notificationSound.play();

      alarmPlayed = true;
      count++
      if (count >= 4) {
        clearInterval(intvl)
      }
    }, 2000)
    drawGameOver()
    return
  }

  // I think "> 0" needed to prevent crashing in an infinite loop
  while (balls.length > 0 && balls.length - 1 > minutes) {
    balls.pop()
  }

  background("#D0E0E2");

  fill(fill1)
  strokeWeight(1)
  stroke(SCITECH_DARKBLUE)

  // if (keyIsPressed) {
  //   ball[0].y = getYValue(key)
  // }

  for (let ball of balls) {

    for (let ball2 of balls) {
      if (ball !== ball2 && checkCollision(ball, ball2)) {
        fill(fill2)
      }
    }

    ball.draw()
    fill(fill1)
  }


  push()
  fill(SCITECH_DARKBLUE)
  textSize(24)
  textAlign(LEFT, BOTTOM)
  text((new Date()).toLocaleTimeString(), 10, height - 10)

  if (!endTime) {
    return // hack?
  }

  textAlign(RIGHT, BOTTOM)
  text(`End time: ${endTime.toLocaleTimeString()}`, width - 10, height - 10)
  textSize(72)
  textFont('"Rubik Mono One", monospace')
  textAlign(CENTER, TOP)
  text(timeRemainingFormatted, width / 2, 15)
  pop()
}

function drawGameOver() {
  background(SCITECH_BLUE);
  fill(SCITECH_ORANGE)
  textSize(100)
  textFont('"Rubik Mono One", monospace')
  textAlign(CENTER, CENTER)
  text("Transition\nTime!", width / 2, height / 2)
  noLoop()
}

function mouseClicked() {
  //   let v = random(1, 5)
  //   balls.push(new Ball(mouseX, mouseY, 25, 2))
  //   console.log(balls.length)

}

function checkCollision(ball1, ball2) {
  let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y)
  let sumOfRadii = ball1.r + ball2.r
  return distance <= sumOfRadii
}

function showSettingsDialog() {
  const dialogElement = document.getElementById('settings-dialog')
  const okButton = document.getElementById('ok-button')
  // TODO: all the default end times for workshop
  let defaultEndTime = new Date(Date.parse("1970-01-01T20:20:00.000"))

  document.getElementById('end-time').value = `${defaultEndTime.getHours()}:${defaultEndTime.getMinutes()}`
  okButton.addEventListener('click', () => {
    dialogElement.close();
    endTime = parseTimeString(document.getElementById('end-time').value)
    handleSettingsChange()
  });

  dialogElement.showModal();
}


Object.assign(window, { preload, setup, draw, mouseClicked })