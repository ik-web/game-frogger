let playerMoveX = 101;
let playerMoveY = 80;
// -----------------------------
let borderAreaLeft = 3;
let borderAreaUp = 3;
let borderAreaRight = 404;
let borderAreaDown = 370;
// -----------------------------
let borderCollision = 50;
// -----------------------------
let enemyPosX = -100;

// Generate position Y for enemy character
let enemyPosY = function() {
    let initYPositions = [60, 140, 220];
    let randY = Math.floor( Math.random() * 3);

    return initYPositions[randY];
};
//------------------------------
let counter = document.createElement('div');
counter.style.cssText = `
    position: fixed; 
    top: 10px; 
    left: 50%;
    font-family: sans-serif;
    font-size: 30px; 
    transform: translateX(-50%);
`;

counter.innerHTML = `Level: 1`;
document.body.prepend(counter);

// Generate enemies' speed
function enemySpeed() {
    return Math.floor( Math.random() * (500 - 150) + 150);
}

// Constructor for create enemy
var Enemy = function(x, y, speed, player) {
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
        player.x = 205;
        player.y = 380;

        setTimeout(function() {
            alert(`Game over...\nYou received ${player.lvl} level.`);
            player.lvl = 1;
            clearEnemy();
            counter.innerHTML = `Level: 1`;
        }, 100);
    }
}

// Method for enemies update
Enemy.prototype.update = function(dt) {
    this.enemyCollision();

    if (this.x > 505) {
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
let Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-horn-girl.png';
    this.lvl = 1;
};

// Method for player update
Player.prototype.update = function() {};

//Method for checking victory
Player.prototype.checkWin = function() {
    if (this.y < 0) {

        setTimeout(() => {
            this.x = 205;
            this.y = 380;
            this.lvl++;
            counter.innerHTML = `Level: ${this.lvl}`;
            addEnemy();

            if (this.lvl === 10) {
                alert('Victory!!!');
                this.lvl = 1;
                clearEnemy();
                counter.innerHTML = `Level: 1`;
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
        if (this.x > borderAreaLeft) {
            this.x -= playerMoveX;
        }
    } else if (btn === 'up') {
        if (this.y > borderAreaUp) {
            this.y -= playerMoveY;

            this.checkWin(); 
        }
    } else if (btn === 'right') {
        if (this.x < borderAreaRight) {
            this.x += playerMoveX;
        }
    } else if (btn === 'down') {
        if (this.y < borderAreaDown) { 
            this.y += playerMoveY;
        }
    }
};

// Create player character
let player = new Player(205, 380);

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
let enemy = new Enemy(enemyPosX, enemyPosY(), enemySpeed(), player);
let allEnemies = [enemy];

function addEnemy() {
    let enemy = new Enemy(enemyPosX, enemyPosY(), enemySpeed(), player);
    allEnemies.push(enemy);
}

function clearEnemy() {
    allEnemies = [];
    addEnemy();
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
