// Fibre Optic Sensation
// Fun numbers
const numberOfParticles = 50000;
const sizeMx = 5; // Particle max size
const speedMx = 10;
const friction = 0.925;
const returnSpeed = 0.0225;
const proximity = 20;

// colours
const inactive = "rgba(232, 237, 245, 0.1)";
const active = "rgba(232, 43, 135, 0.5)";
const returning = "rgba(120, 209, 232, 0.5)";

let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");

let mouse = {
  x: undefined,
  y: undefined,
};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// ---- PARTICLE CLASS ----
class Particle {
  constructor() {
    // Store initial position
    this.initialX = Math.random() * canvas.width;
    this.initialY = Math.random() * canvas.height;

    // Current position (starts at initial position)
    this.x = this.initialX;
    this.y = this.initialY;

    this.size = Math.random() * sizeMx + 1;

    // Initialize velocities to 0
    this.vx = 0;
    this.vy = 0;

    // Maximum velocity when activated
    this.maxVx = 0;
    this.maxVy = 0;

    // Track particle state
    this.activated = false;
    this.returning = false;

    // Friction for slowing
    this.friction = friction;

    this.returnSpeed = returnSpeed;
  }

  // Update position
  update() {
    // Check if mouse proximity (activation check)
    if (!this.activated && !this.returning && mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < proximity) {
        this.activated = true;

        // Set random velocity when activated
        this.maxVx = Math.random() * speedMx - speedMx / 2;
        this.maxVy = Math.random() * speedMx - speedMx / 2;

        // Ensure velocity isn't too close to zero
        if (this.maxVx > -0.2 && this.maxVx < 0.2)
          this.maxVx = Math.random() > 0.5 ? 0.5 : -0.5;
        if (this.maxVy > -0.2 && this.maxVy < 0.2)
          this.maxVy = Math.random() > 0.5 ? 0.5 : -0.5;

        // Set current velocity to max
        this.vx = this.maxVx;
        this.vy = this.maxVy;
      }
    }

    if (this.activated) {
      this.x += this.vx;
      this.y += this.vy;

      // Apply friction
      this.vx *= this.friction;
      this.vy *= this.friction;

      // Check if slowed down enough to start returning
      if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
        this.activated = false;
        this.returning = true;
        this.vx = 0;
        this.vy = 0;
      }
    } else if (this.returning) {
      // Calculate direction to initial position
      const dx = this.initialX - this.x;
      const dy = this.initialY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If very close to initial position, snap to it
      if (distance < 2) {
        this.x = this.initialX;
        this.y = this.initialY;
        this.returning = false;
      } else {
        // Move towards initial position
        this.x += dx * this.returnSpeed;
        this.y += dy * this.returnSpeed;
      }
    }
  }

  draw() {
    // Use colours based on particle state
    if (this.activated) {
      ctx.fillStyle = active;
    } else if (this.returning) {
      ctx.fillStyle = returning;
    } else {
      ctx.fillStyle = inactive;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- PARTICLE MANAGEMENT ----
let particlesArray = [];

function init() {
  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

init();

// ---- EVENT LISTENERS ----
window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  init();
});

window.addEventListener("mousemove", function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

// ---- ANIMATION LOOP ----
function animate() {
  // Clear the background with fade
  ctx.fillStyle = "rgba(232, 237, 245, 0.25)"; // Adjust alpha for trail length
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw each particle
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }

  requestAnimationFrame(animate);
}

animate();
