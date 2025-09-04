const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let rocketImage = new Image();
let asteroidImage = new Image();
let coinImage = new Image();
let backgroundImage = new Image();

rocketImage.src = 'ship.png';
backgroundImage.src = 'space.png';
asteroidImage.src = 'asteroid.png';
coinImage.src = 'coin.png';

let rocketX = 350, rocketY = 500, rocketWidth = 50, rocketHeight = 80;
let score = 0, lives = 3;
let rocketSpeed = 3;
let moveLeft = false, moveRight = false;

let asteroids = [];
const asteroidWidth = 50, asteroidHeight = 50;
const roadStartX = 50;
const roadEndX = 750;

let coins = [];
const coinWidth = 30, coinHeight = 30;

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') moveLeft = true;
  if (e.key === 'ArrowRight') moveRight = true;
});

document.addEventListener('keyup', function (e) {
  if (e.key === 'ArrowLeft') moveLeft = false;
  if (e.key === 'ArrowRight') moveRight = false;
});

function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawRocket() {
  ctx.drawImage(rocketImage, rocketX, rocketY, rocketWidth, rocketHeight);
}

function generateAsteroids() {
  if (Math.random() < 0.03) {
    const asteroidX = Math.random() * (canvas.width - asteroidWidth);
    asteroids.push({
      x: asteroidX,
      y: -asteroidHeight,
      width: asteroidWidth,
      height: asteroidHeight,
      speed: 1 + Math.random() * 1.5
    });
  }
}

function generateCoins() {
  if (Math.random() < 0.02) {
    const coinX = Math.random() * (canvas.width - coinWidth);
    coins.push({
      x: coinX,
      y: -coinHeight,
      width: coinWidth,
      height: coinHeight,
      speed: 1.5 + Math.random() * 1
    });
  }
}

function drawAsteroids() {
  asteroids.forEach(asteroid => {
    ctx.drawImage(asteroidImage, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
  });
}

function drawCoins() {
  coins.forEach(coin => {
    ctx.drawImage(coinImage, coin.x, coin.y, coin.width, coin.height);
  });
}

function updateAsteroids() {
  asteroids.forEach(asteroid => {
    asteroid.y += asteroid.speed;
  });
  asteroids = asteroids.filter(asteroid => asteroid.y < canvas.height);
}

function updateCoins() {
  coins.forEach(coin => {
    coin.y += coin.speed;
  });
  coins = coins.filter(coin => coin.y < canvas.height);
}

function checkAsteroidCollisions() {
  for (let asteroid of asteroids) {
    if (rocketX < asteroid.x + asteroid.width &&
        rocketX + rocketWidth > asteroid.x &&
        rocketY < asteroid.y + asteroid.height &&
        rocketY + rocketHeight > asteroid.y) {
      lives--;
      rocketX = 350;
      rocketY = 500;
      if (lives <= 0) {
        alert('Game Over! Your score: ' + score);
        resetGame();
      }
      break;
    }
  }
}

function checkCoinCollisions() {
  coins.forEach((coin, index) => {
    if (rocketX < coin.x + coin.width &&
        rocketX + rocketWidth > coin.x &&
        rocketY < coin.y + coin.height &&
        rocketY + rocketHeight > coin.y) {
      score += 10;
      coins.splice(index, 1);
    }
  });
}

function moveRocket() {
  if (moveLeft && rocketX > roadStartX) rocketX -= rocketSpeed;
  if (moveRight && rocketX < roadEndX - rocketWidth) rocketX += rocketSpeed;
}

function updateScoreAndLives() {
  document.getElementById('score').textContent = 'Score: ' + score;
  document.getElementById('lives').textContent = 'Lives: ' + lives;
}

function resetGame() {
  score = 0;
  lives = 3;
  rocketX = 350;
  rocketY = 500;
  moveLeft = false;
  moveRight = false;
  asteroids = [];
  coins = [];
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawRocket();
  generateAsteroids();
  generateCoins();
  drawAsteroids();
  drawCoins();
  updateAsteroids();
  updateCoins();
  moveRocket();
  checkAsteroidCollisions();
  checkCoinCollisions();
  updateScoreAndLives();

  requestAnimationFrame(gameLoop);
}

gameLoop();
