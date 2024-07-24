// This class describes the properties of a single particle.
class Particle {
    constructor(x, y, r, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    createParticle() {
        noStroke();
        fill('rgba(200,169,169,0.5)');
        circle(this.x, this.y, this.r);
    }

    moveParticle() {
        if (this.x < 0 || this.x > width) this.xSpeed *= -1;
        if (this.y < 0 || this.y > height) this.ySpeed *= -1;
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    joinParticles(particles) {
        particles.forEach(element => {
            let dis = dist(this.x, this.y, element.x, element.y);
            if (dis < 85) {
                stroke('rgba(255,255,255,0.04)');
                line(this.x, this.y, element.x, element.y);
            }
        });
    }
}

let particles = [];
let smallestParticlesCount, smallParticlesCount, mediumParticlesCount, largeParticlesCount;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // New data
    const data = {
        "pm01": 21,
        "pm02": 31,
        "pm03": 3690,
        "pm10": 32,
        "time": "Tue May 21 22:37:29 2024"
    };

    // Factors to multiply the PM values
    const pm01Factor = 5;
    const pm02Factor = 3;
    const pm03Factor = 1;
    const pm10Factor = 2;

    // Creating particles based on the data and factors
    smallestParticlesCount = data.pm01 * pm01Factor;
    smallParticlesCount = data.pm02 * pm02Factor;
    mediumParticlesCount = data.pm03 * pm03Factor;
    largeParticlesCount = data.pm10 * pm10Factor;

    createParticles(smallestParticlesCount, 5, -2, 2, -1, 1.5); // Smallest particles (pm01)
    createParticles(smallParticlesCount, 10, -2, 2, -1, 1.5); // Small particles (pm02)
    createParticles(mediumParticlesCount, 15, -1.5, 1.5, -1, 1); // Medium-sized particles (pm03)
    createParticles(largeParticlesCount, 20, -1, 1, -0.5, 0.5); // Largest particles (pm10)

    // Store date and time
    window.dataTime = data.time;
}

function createParticles(count, radius, xSpeedMin, xSpeedMax, ySpeedMin, ySpeedMax) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(
            random(0, width * 0.75),  // Adjusting the width to leave space for the text
            random(0, height),
            radius,
            random(xSpeedMin, xSpeedMax),
            random(ySpeedMin, ySpeedMax)
        ));
    }
}

function draw() {
    background('#0f0f0f');
    for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles);
    }

    // Display the particle counts on the right side
    displayParticleCounts();
}

function displayParticleCounts() {
    fill(255);
    textSize(16);
    let yPos = 50;
    text(`Smallest Particles (pm01 * 5): ${smallestParticlesCount}`, width * 0.8, yPos);
    yPos += 20;
    text(`Small Particles (pm02 * 3): ${smallParticlesCount}`, width * 0.8, yPos);
    yPos += 20;
    text(`Medium Particles (pm03): ${mediumParticlesCount}`, width * 0.8, yPos);
    yPos += 20;
    text(`Large Particles (pm10 * 2): ${largeParticlesCount}`, width * 0.8, yPos);
    yPos += 20;
    text(`Date and Time:`, width * 0.8, yPos);
    yPos += 20;
    text(window.dataTime, width * 0.8, yPos);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}







