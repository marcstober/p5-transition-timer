import Ball from "./ball.js"
import { parseTimeString } from "./utils.js"

const SCITECH_BLUE = "#12B6CA"
const SCITECH_ORANGE = "#F37121"
const SCITECH_DARKBLUE = "#04454C"

let fill1 = SCITECH_BLUE
let fill2 = SCITECH_ORANGE

// // 4th of July colors
// const fill1 = "#6666FF" // #0000FF looks black on my projector
// const fill2 = "#FF0000"

let endTime
let isOption3 = false

let notificationSound
let alarmPlayed = false

let warningMode = false
let warningPlayed = false

function preload() {
    notificationSound = loadSound("simple-notification-152054.mp3")
}

function setup() {
    let v = createVector(3, 4, 0)

    v.setMag(10)

    createCanvas(windowWidth, windowHeight)

    // ensure radio button checked if associated text input changed
    let textInputs = document.querySelectorAll('input[type="text"]')
    for (let input of textInputs) {
        input.addEventListener("change", (e) => {
            let previousSibling = e.target.previousElementSibling
            while (
                previousSibling &&
                previousSibling.tagName !== "INPUT" &&
                previousSibling.type !== "radio"
            ) {
                previousSibling = previousSibling.previousElementSibling
            }
            if (previousSibling && previousSibling.type === "radio") {
                previousSibling.checked = true
            }
        })
    }

    showSettingsDialog()

    textFont("Calibri, Arial, sans-serif")
}

function handleSettingsChange() {
    let timeRemaining = endTime - new Date()
    let timeRemainingInSeconds = Math.ceil(timeRemaining / 1000)
    let timeRemainingInMinutes = Math.ceil(timeRemainingInSeconds / 60)

    for (let i = 0; i < timeRemainingInMinutes; i++) {
        let v = random(1, 5)
        balls.push(
            new Ball(random(25, width - 25), random(25, height - 25), 25, v)
        )
    }
}

let balls = []

// Collisions:
// * https://codeguppy.com/blog/how-to-implement-collision-detection-between-two-circles-using-p5.js/index.html
// * https://editor.p5js.org/aferriss/sketches/S1Q6Q1J2b
//

function draw() {
    let timeRemaining = endTime - new Date()
    let timeRemainingInSeconds = Math.ceil(timeRemaining / 1000)
    let minutes = Math.floor(timeRemainingInSeconds / 60)
    let seconds = timeRemainingInSeconds % 60
    let timeRemainingFormatted = `${minutes}:${
        seconds < 10 ? "0" : ""
    }${seconds}`

    if (minutes < 5) {
        warningMode = true
        fill1 = SCITECH_ORANGE
        fill2 = SCITECH_BLUE
        if (!warningPlayed) {
            notificationSound.play()
            warningPlayed = true
        }
    }

    if (timeRemaining <= 0 && !alarmPlayed) {
        alarmPlayed = true
        let count = 0
        // play once, then 4 more times at an interval (total 5 times)
        notificationSound.play()
        let intvl = setInterval(() => {
            notificationSound.play()

            alarmPlayed = true
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

    background("#D0E0E2")

    fill(fill1)
    strokeWeight(2)
    stroke(SCITECH_DARKBLUE)

    for (let ball of balls) {
        for (let ball2 of balls) {
            if (ball !== ball2 && checkCircleCircleCollision(ball, ball2)) {
                fill(fill2)
            }
        }

        ball.draw()
        fill(fill1)
    }

    push()
    fill(SCITECH_DARKBLUE)
    strokeWeight(0)
    textSize(24)
    textAlign(LEFT, BOTTOM)
    text(new Date().toLocaleTimeString(), 10, height - 10)

    if (endTime) {
        textAlign(RIGHT, BOTTOM)
        text(
            `End time: ${endTime.toLocaleTimeString()}`,
            width - 10,
            height - 10
        )
        textSize(72)
        if (warningMode) {
            fill(SCITECH_ORANGE)
            strokeWeight(10)
            textSize(100)
        }
        textFont('"Rubik Mono One", monospace')
        textAlign(CENTER, TOP)
        text(timeRemainingFormatted, width / 2, 15)
    }
    pop()
}

function drawGameOver() {
    background(SCITECH_BLUE)
    fill(SCITECH_ORANGE)
    textSize(100)
    textFont('"Rubik Mono One", monospace')
    textAlign(CENTER, CENTER)
    push()
    strokeWeight(10)
    text("Transition\nTime!", width / 2, height / 2)
    pop()
    noLoop()
}

function mouseClicked() {
    if (isOption3) {
        let v = random(1, 5)
        balls.push(new Ball(mouseX, mouseY, 25, v))
        console.log(balls.length)
    }
}

function checkCircleCircleCollision(ball1, ball2) {
    let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y)
    let sumOfRadii = ball1.r + ball2.r
    return distance <= sumOfRadii
}

function showSettingsDialog() {
    const dialogElement = document.getElementById("settings-dialog")
    const okButton = document.getElementById("ok-button")
    // TODO: all the default end times for workshop
    let now = new Date()
    let defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000)
    let hour = defaultEndTime.getHours() % 12 || 12
    document.getElementById("end-time").value = `${hour}:${defaultEndTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`

    const dlg = document.getElementById("settings-dialog")
    dlg.addEventListener("submit", (e) => {
        // dialogElement.close();
        const fd = new FormData(e.target)
        const opt = fd.get("radio")

        if (opt == 1) {
            // end time
            endTime = parseTimeString(document.getElementById("end-time").value)
            // infer AM/PM as follows:
            // if current time is later than end time AM, make it PM
            // if current time is later than end time PM, make it AM the next day
            while (endTime < new Date()) {
                endTime.setHours(endTime.getHours() + 12)
            }
        } else if (opt == 2) {
            // minutes
            let addMinutes = parseInt(fd.get("minutes"))
            endTime = new Date(Date.now() + addMinutes * 60 * 1000)
        } else if (opt == 3) {
            isOption3 = true // click to spawn
        }

        handleSettingsChange()
    })

    dialogElement.showModal()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    // Move balls on screen if resizing smaller
    for (let ball of balls) {
        // Clamp x and y so the ball stays fully visible
        ball.x = constrain(ball.x, ball.r, width - ball.r)
        ball.y = constrain(ball.y, ball.r, height - ball.r)
    }
}

Object.assign(window, { preload, setup, draw, mouseClicked, windowResized })
