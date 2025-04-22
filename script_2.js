// foot steps in the snow sketch

// fun variables
const proximity = 10;
const speedMx = 5;
const particleCount = 250000;
const particleSize = 1;

let particles = [];

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  particles.map((p) => {
    if (Math.abs(x - p.x) < proximity && Math.abs(y - p.y) < proximity) {
      p.activate();
    }
  });
});

canvas.addEventListener("click", (e) => {
  particles.map((p) => {
    p.deactivate();
  });
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.isActive = false;
  }

  setDirection(dir) {
    switch (dir) {
      case 1:
        this.vx = Math.floor(Math.random() * speedMx);
        this.vy = 0;
        break;
      case 2:
        this.vx = 0;
        this.vy = Math.floor(Math.random() * speedMx);
        break;
      case 3:
        this.vx = -Math.floor(Math.random() * speedMx);
        this.vy = 0;
        break;
      case 4:
        this.vx = 0;
        this.vy = -Math.floor(Math.random() * speedMx);
        break;
      default:
        this.vx = 0;
        this.vy = 0;
        break;
    }
  }

  activate() {
    this.isActive = true;
    this.setDirection(Math.floor(Math.random() * speedMx));
  }

  deactivate() {
    this.isActive = false;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.map((p) => {
    if (p.isActive) {
      p.setDirection(Math.floor(Math.random() * speedMx));
      p.update();
    }
    p.draw();
  });
  requestAnimationFrame(animate);
}

for (let i = 0; i < particleCount; i++) {
  particles.push(
    new Particle(Math.random() * canvas.width, Math.random() * canvas.height),
  );
}

particles.map((p) => {
  p.draw();
});
animate();
