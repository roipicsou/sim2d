const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Creature {
  constructor(x, y, speed = 2) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.color = 'lime';
    this.energy = 100;
    this.speed = speed;
    this.age = 0;
    this.maxAge = 500 + Math.random() * 500;
  }

  move(foodArray) {
    const closest = this.findClosestFood(foodArray);

    if (closest) {
      const dx = closest.x - this.x;
      const dy = closest.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const directionX = dx / dist;
      const directionY = dy / dist;

      this.x += directionX * this.speed;
      this.y += directionY * this.speed;
    } else {
      this.x += (Math.random() - 0.5) * this.speed * 2;
      this.y += (Math.random() - 0.5) * this.speed * 2;
    }

    this.energy -= this.speed * 0.5;
    this.age += 1;
  }

  findClosestFood(foodArray) {
    let minDist = Infinity;
    let closest = null;

    for (let food of foodArray) {
      const dx = food.x - this.x;
      const dy = food.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100 && dist < minDist) {
        minDist = dist;
        closest = food;
      }
    }

    return closest;
  }

  eatIfNear(foodArray) {
    for (let i = 0; i < foodArray.length; i++) {
      const food = foodArray[i];
      const dx = this.x - food.x;
      const dy = this.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius + food.radius) {
        this.energy += 30;
        foodArray.splice(i, 1);
        break;
      }
    }
  }

  maybeReproduce(creatures) {
    if (this.energy > 150) {
      this.energy -= 50;
      const mutatedSpeed = this.speed * (1 + (Math.random() - 0.5) * 0.2);
      const baby = new Creature(
        this.x + Math.random() * 10 - 5,
        this.y + Math.random() * 10 - 5,
        mutatedSpeed
      );
      const speedColor = Math.min(255, Math.floor(mutatedSpeed * 60));
      baby.color = `rgb(${speedColor},255,${255 - speedColor})`;
      creatures.push(baby);
    }
  }

  isDead() {
    return this.energy <= 0 || this.age > this.maxAge;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Food {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
  }
}

const creatures = [];
const foodArray = [];

// Initial population
for (let i = 0; i < 20; i++) {
  creatures.push(new Creature(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Initial food
for (let i = 0; i < 200; i++){
  foodArray.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
}

// Food generation every second
setInterval(() => {
  for (let i = 0; i < 5; i++) {
    foodArray.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
  }
}, 1000);

// Stats update
function updateStats() {
  const statsDiv = document.getElementById('stats');

  if (creatures.length === 0) {
    statsDiv.innerHTML = "💀 Extinction complète 💀";
    return;
  }

  const totalSpeed = creatures.reduce((sum, c) => sum + c.speed, 0);
  const totalAge = creatures.reduce((sum, c) => sum + c.age, 0);

  const avgSpeed = (totalSpeed / creatures.length).toFixed(2);
  const avgAge = (totalAge / creatures.length).toFixed(1);

  statsDiv.innerHTML = `
    👾 Créatures : ${creatures.length} |
    🧓 Âge moyen : ${avgAge} |
    🚀 Vitesse moyenne : ${avgSpeed}
  `;
}

// Main loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let food of foodArray) {
    food.draw(ctx);
  }

  for (let i = creatures.length - 1; i >= 0; i--) {
    const creature = creatures[i];
    creature.move(foodArray);
    creature.eatIfNear(foodArray);
    creature.maybeReproduce(creatures);
    creature.draw(ctx);
    if (creature.isDead()) {
      creatures.splice(i, 1);
    }
  }

  updateStats();
  requestAnimationFrame(animate);
}

animate();