const board = document.getElementById("board");
const killCounter = document.querySelector("#killCount span");

const MOVE_STEP = 2;
const enemies = [];
const enemiesCreateOnKill = 2;
let kills = 0;
let player;

const DIRECTION = {
    UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3
}

generatePlayer();

for (let i = 0; i < 6; i++) {
    generateEnemy();
}

function generateEnemy() {
    const enemy = document.createElement("img");
    enemy.src = "img/enemy.png";
    enemy.classList.add("moving");

    board.appendChild(enemy);
    enemy.addEventListener("load", () => {
        const [top, left] = generatePosition(enemy);
        enemyObj = new Enemy(enemy, top, left);
        enemies.push(enemyObj);
        randomMove(enemyObj);
    });
}

function generatePosition(elem) {
    return [Math.floor(Math.random() * (board.clientHeight - elem.clientHeight)), 
            Math.floor(Math.random() * (board.clientWidth - elem.clientWidth))];
}

function generatePlayer() {
    const elem = document.createElement("img");
    elem.src = "img/player.png";
    elem.classList.add("moving");

    board.appendChild(elem);
    elem.addEventListener("load", () => {
        const [top, left] = generatePosition(elem);
        player = new Player(elem, top, left);
        mouseMove(player);
    });
}

function randomMove(obj) {
    let steps = 0;
    let direction = 0;

    const interval = setInterval(() => {
        if (steps === 0) {
            steps = Math.floor(Math.random() * 10) + 1;
            direction = Math.floor(Math.random() * 4);
        }
        
        switch (direction) {
            case DIRECTION.UP: obj.moveUp(); break;
            case DIRECTION.RIGHT: obj.moveRight(); break;
            case DIRECTION.DOWN: obj.moveDown(); break;
            case DIRECTION.LEFT: obj.moveLeft(); break;
        }

        steps--;
        detectCollisions();
    }, 200);

    obj.interval = interval;
}

function mouseMove(obj) {
    document.addEventListener("mousedown", (event) => {
        if (player.lock) {
            return;
        }
        
        player.changeDirection(event.clientX, event.clientY);
        player.lock = true;
        player.interval = setInterval(() => player.move(), 15);
    });

    document.addEventListener("mouseup", (event) => {
        if (player.interval !== null) {
            clearInterval(player.interval);
            player.lock = false;
        }
    });

    document.addEventListener("mousemove", (event) => {
        player.changeDirection(event.clientX, event.clientY);
    });
}

function detectCollisions() {
    for (let i = 0; i < enemies.length; i++) {
        let collision = detectCollision(player, enemies[i]);

        if (collision) {
            onEnemyKill(i);
        }
    }
}

function onEnemyKill(enemyIdx) {
    enemies[enemyIdx].kill();
    enemies.splice(enemyIdx, 1);
    kills++;
    killCounter.textContent = kills;

    for (let i = 0; i < enemiesCreateOnKill; i++) {
        generateEnemy();
    }
}

function detectCollision(first, second) {
    return ((first.top >= second.top && first.top <= second.top + second.height) // Top
                || (first.top + first.height >= second.top && first.top + first.height <= second.top + second.height)) // Bottom
                && ((first.left >= second.left && first.left <= second.left + second.width) // left
                || (first.left + first.width >= second.left && first.left + first.width <= second.left + second.width)); // right
}

class Character {
    constructor(elem, top, left) {
        this.elem = elem;
        this.top = top;
        this.left = left;
        this.height = elem.clientHeight;
        this.width = elem.clientWidth
        
        elem.style.top = top + "px";
        elem.style.left = left + "px";
        elem.style.visibility = "visible";
    }

    moveUp() {
        if (this.top <= 0) {
            this.moveDown();
            return;
        }

        this.top -= MOVE_STEP;
        this.elem.style.top = this.top + "px";
    }

    moveDown() {
        if (this.top >= board.clientHeight - this.elem.clientHeight) {
            this.moveUp();
            return;
        }

        this.top += MOVE_STEP;
        this.elem.style.top = this.top + "px";
    }

    moveLeft() {
        if (this.left <= 0) {
            this.moveRight();
            return;
        }

        this.left -= MOVE_STEP;
        this.elem.style.left = this.left + "px";
    }

    moveRight() {
        if (this.left >= board.clientWidth - this.elem.clientWidth) {
            this.moveLeft();
            return;
        }

        this.left += MOVE_STEP;
        this.elem.style.left = this.left + "px";
    }
}

class Enemy extends Character {
    kill() {
        clearInterval(this.interval);

        let newElem = document.createElement("img")
        newElem.src = 'img/dead.png';
        newElem.classList.add("dead");
        newElem.style.top = this.top + "px";
        newElem.style.left = this.left + "px";
        this.elem.remove();
        this.elem = newElem;

        board.appendChild(newElem);
    }
}

class Player extends Character {
    constructor(elem, top, left) {
        super(elem, top, left);
        this.xDirection = 0;
        this.yDirection = 0;
    }

    changeDirection(x, y) {
        this.xDirection = x;
        this.yDirection = y;
    }

    move() {
        let xCenter = this.left + this.width / 2;
        let yCenter = this.top + this.height / 2;

        this.left += this.xDirection < xCenter ? -MOVE_STEP : MOVE_STEP;
        this.top += this.yDirection < yCenter ? -MOVE_STEP : MOVE_STEP;

        this.elem.style.left = this.left + "px";
        this.elem.style.top = this.top + "px";
    }
}