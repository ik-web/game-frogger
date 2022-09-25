const areaWidth = 505;
const indentBorderLeft = 3;
const indentBorderTop = 3;
const indentBorderRight = 404;
const indentBorderBottom = 370;
const levelForWin = 12;

const playerSprite = "img/char-horn-girl.png";
const playerStartLevel = 1;
const playerStartPosX = 205;
const playerStartPosY = 380;
const playerStepX = 101;
const playerStepY = 80;

const borderCollision = 50;

const enemySprite = "img/enemy-bug.png";
const enemySpeedMax = 500;
const enemySpeedMin = 150;

const enemyPosX = -100;
const enemyPosY = function () {
  const initYPositions = [60, 140, 220];
  let randY = Math.floor(Math.random() * 3);

  return initYPositions[randY];
};

const levelCounter = document.createElement("div");

function enemySpeed() {
  return Math.floor(
    Math.random() * (enemySpeedMax - enemySpeedMin) + enemySpeedMin
  );
}

function addEnemy() {
  let enemy = new Enemy(
    enemyPosX,
    enemyPosY(),
    enemySprite,
    enemySpeed(),
    player
  );
  allEnemies.push(enemy);
}

function resetEnemy() {
  allEnemies = [];
  addEnemy();
}

function resetGame() {
  resetEnemy();
  player.level = playerStartLevel;
  setLevel(playerStartLevel);
}

function addLevelCounter() {
  levelCounter.style.cssText = `
      position: fixed; 
      top: 10px; 
      left: 50%;
      font-family: sans-serif;
      font-size: 30px; 
      transform: translateX(-50%);
    `;

  setLevel(playerStartLevel);
  document.body.prepend(levelCounter);
}

function setLevel(level) {
  levelCounter.innerHTML = `Level: ${level}`;
}

const Character = function (x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
};

Character.prototype.update = function () {};

Character.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

const Enemy = function (x, y, sprite, speed, player) {
  Character.call(this, x, y, sprite);
  this.speed = speed;
  this.player = player;
};

Enemy.prototype = Object.create(Character.prototype);

Enemy.prototype.enemyCollision = function () {
  if (
    this.x - borderCollision <= this.player.x && // Left
    this.y - borderCollision <= this.player.y && // Up
    this.x + borderCollision >= this.player.x && // Right
    this.y + borderCollision >= this.player.y
  ) {
    // Down
    this.player.x = playerStartPosX;
    this.player.y = playerStartPosY;

    setTimeout(() => {
      alert(`Game over...\nYou received ${this.player.level} level.`);
      resetGame();
    }, 100);
  }
};

Enemy.prototype.update = function (dt) {
  this.enemyCollision();

  if (this.x > areaWidth) {
    this.x = enemyPosX;
    this.speed = enemySpeed();
  } else {
    this.x += this.speed * dt;
  }
};

const Player = function (x, y, sprite) {
  Character.call(this, x, y, sprite);
  this.level = playerStartLevel;
};

Player.prototype = Object.create(Character.prototype);

Player.prototype.checkProgress = function () {
  if (this.y < 0) {
    setTimeout(() => {
      this.x = playerStartPosX;
      this.y = playerStartPosY;
      this.level++;
      setLevel(this.level);
      addEnemy();

      if (this.level === levelForWin) {
        alert("Victory!!!");
        resetGame();
      } else {
        alert(`Level UP!\nYour level is ${this.level}`);
      }
    }, 100);
  }
};

// Player controls
Player.prototype.handleInput = function (btn) {
  if (btn === "left") {
    if (this.x > indentBorderLeft) {
      this.x -= playerStepX;
    }
  } else if (btn === "up") {
    if (this.y > indentBorderTop) {
      this.y -= playerStepY;

      this.checkProgress();
    }
  } else if (btn === "right") {
    if (this.x < indentBorderRight) {
      this.x += playerStepX;
    }
  } else if (btn === "down") {
    if (this.y < indentBorderBottom) {
      this.y += playerStepY;
    }
  }
};

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

const player = new Player(playerStartPosX, playerStartPosY, playerSprite);

let allEnemies = [];
addEnemy();

addLevelCounter();
