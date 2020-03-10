// Front end particles effect

const loading = document.querySelector(".loading");

const particles = [];

function setup() {
  createCanvas(loading.offsetWidth, loading.offsetHeight);
  const particlesLength = Math.floor(loading.offsetWidth / 10);
  console.log(particlesLength);
  for (let i = 0; i < particlesLength; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background("#161616");
  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    particle.checkParticles(particles.slice(index));
  });
}

class Particle {
  constructor() {
    // Position
    this.pos = createVector(random(width), random(height));
    // Velocity
    this.vel = createVector(random(-1, 1), random(-1, 1));
    // Size
    this.size = 2;
  }
  // Update movement by adding velocity
  update() {
    this.pos.add(this.vel);
    this.edges();
  }
  // Draw single particle
  draw() {
    noStroke();
    fill("rgba(255,255,255,0.3)");
    circle(this.pos.x, this.pos.y, this.size);
  }

  // Detect edges
  edges() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }

  // Connect particles
  checkParticles(particles) {
    particles.forEach(particle => {
      const d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);

      if (d < 120) {
        stroke("rgba(255,255,255,0.04)");
        line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      }
    });
  }
}
