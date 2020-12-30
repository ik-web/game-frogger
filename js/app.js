const areaWidth = 505;
const indentBorderLeft = 3;
const indentBorderTop = 3;
const indentBorderRight = 404;
const indentBorderBottom = 370;
const levelForWin = 10;
// ---------------------------------------------
const playerStartPosX = 205;
const playerStartPosY = 380;
const playerStepX = 101;
const playerStepY = 80;
// ---------------------------------------------
const borderCollision = 50;
// ---------------------------------------------
const enemySpeedMax = 500;
const enemySpeedMin = 150;
//----------------------------------------------
const enemyPosX = -100;
const enemyPosY = function() {
    const initYPositions = [60, 140, 220];
    let randY = Math.floor( Math.random() * 3);

    return initYPositions[randY];
};
//----------------------------------------------
const levelCounter = document.createElement('div');
//----------------------------------------------

// Generate enemies' speed
function enemySpeed() {
    return Math.floor( Math.random() * (enemySpeedMax - enemySpeedMin) + enemySpeedMin);
}

// Add a new enemy after level up
function addEnemy() {
    let enemy = new Enemy(enemyPosX, enemyPosY(), enemySpeed(), player);
    allEnemies.push(enemy);
}

// Clear enemies if the player won or lose
function clearEnemy() {
    allEnemies = [];
    addEnemy();
}

//Create level counter
function addLevelCounter() {
    levelCounter.style.cssText = `
        position: fixed; 
        top: 10px; 
        left: 50%;
        font-family: sans-serif;
        font-size: 30px; 
        transform: translateX(-50%);
    `;

    levelCounter.innerHTML = `Level: 1`;
    document.body.prepend(levelCounter);
}

// Constructor for create enemy
const Enemy = function(x, y, speed, player) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

//Check characters collision
Enemy.prototype.enemyCollision = function() {
    if (this.x - borderCollision <= player.x        // Left
        && this.y - borderCollision <= player.y     // Up
        && this.x + borderCollision >= player.x     // Right
        && this.y + borderCollision >= player.y) {  // Down
        player.x = playerStartPosX;
        player.y = playerStartPosY;

        setTimeout(function() {
            alert(`Game over...\nYou received ${player.lvl} level.`);
            player.lvl = 1;
            clearEnemy();
            levelCounter.innerHTML = `Level: 1`;
        }, 100);
    }
};

// Method for enemies update
Enemy.prototype.update = function(dt) {
    this.enemyCollision();

    if (this.x > areaWidth) {
        this.x = enemyPosX;
        this.speed = enemySpeed();
    } else {
        this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Constructor for create player
const Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-horn-girl.png';
    this.lvl = 1;
};

// Method for player update
Player.prototype.update = function() {};

//Method for checking game progress
Player.prototype.checkProgress = function() {
    if (this.y < 0) {

        setTimeout(() => {
            this.x = playerStartPosX;
            this.y = playerStartPosY;
            this.lvl++;
            levelCounter.innerHTML = `Level: ${this.lvl}`;
            addEnemy();

            if (this.lvl === levelForWin) {
                alert('Victory!!!');
                this.lvl = 1;
                clearEnemy();
                levelCounter.innerHTML = `Level: 1`;              
            } else {
                alert(`Level UP!\nYour level is ${this.lvl}`);
            }

        }, 100);
    }
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player controls
Player.prototype.handleInput = function(btn) {
    if (btn === 'left') {
        if (this.x > indentBorderLeft) {
            this.x -= playerStepX;
        }
    } else if (btn === 'up') {
        if (this.y > indentBorderTop) {
            this.y -= playerStepY;

            this.checkProgress(); 
        }
    } else if (btn === 'right') {
        if (this.x < indentBorderRight) {
            this.x += playerStepX;
        }
    } else if (btn === 'down') {
        if (this.y < indentBorderBottom) { 
            this.y += playerStepY;
        }
    }
};

// This listens for key presses and sends the keys to Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------
// Create player character
const player = new Player(playerStartPosX, playerStartPosY);

// Create first enemy
let enemy = new Enemy(enemyPosX, enemyPosY(), enemySpeed(), player);
let allEnemies = [enemy];

// Add level counter
addLevelCounter();
