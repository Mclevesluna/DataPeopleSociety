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
        fill('rgba(100,100,100,0.6)'); // Darker grey particles
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
                stroke('rgba(100,100,100,0.15)'); // Darker grey lines
                line(this.x, this.y, element.x, element.y);
            }
        });
    }
}

let particles = [];
let smallestParticlesCount, smallParticlesCount, mediumParticlesCount, largeParticlesCount;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Sample data
    const data = {
        "pm01": 11,
        "pm02": 15,
        "pm03": 2007,
        "pm10": 16,
        "time": "Wed May 22 12:02:49 2024"
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
    background('#f5f5dc'); // Cream background
    for (let i = 0; i < particles.length; i++) {
        particles[i].createParticle();
        particles[i].moveParticle();
        particles[i].joinParticles(particles.slice(i));
    }

    // Display the particle counts on the right side
    displayParticleCounts();
}

function displayParticleCounts() {
    fill('#333'); // Dark grey text
    textSize(16);
    text(`Smallest Particles (pm01 * 5): ${smallestParticlesCount}`, width * 0.8, 50);
    text(`Small Particles (pm02 * 3): ${smallParticlesCount}`, width * 0.8, 80);
    text(`Medium Particles (pm03): ${mediumParticlesCount}`, width * 0.8, 110);
    text(`Large Particles (pm10 * 2): ${largeParticlesCount}`, width * 0.8, 140);
    text(`Date and Time:`, width * 0.8, 170);
    text(window.dataTime, width * 0.8, 190);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}





    




