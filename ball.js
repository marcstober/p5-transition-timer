let nextId = 0

class Ball {
    constructor(x, y, r, v) {
        this.positionVector = createVector(x, y)
        this.r = r
        this.velocityVector = createVector(1) // can't setMag on a zero vector
        this.velocityVector.setMag(v)
        let randomRadians = random(0, TWO_PI)
        this.velocityVector.setHeading(randomRadians)
    }

    get x() {
        return this.positionVector.x
    }

    get y() {
        return this.positionVector.y
    }

    draw() {
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
        push()
        fill(0)
        text(this.id, this.positionVector.x, this.positionVector.y)
        pop()
    }
}

export default Ball