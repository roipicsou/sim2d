// main.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Creature {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.color = 'lime';
    this.energy = 100;
  }

  move() {
    // Simple random movement
    this.x += (Math.random() - 0.5) * 4;
    this.y += (Math.random() - 0.5) * 4;
    this.energy -= 0.5; // Lose energy on each move
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const creatures = [];

// Create initial population
for (let i = 0; i < 20; i++) {
  creatures.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let creature of creatures) {
    creature.move();
    creature.draw(ctx);
  }

  requestAnimationFrame(animate);
}

animate();