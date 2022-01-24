const board = document.getElementById("board");
const killCounter = document.querySelector("#killCount span");

const MOVE_STEP = 1;
const enemies = [];
const enemiesCreateOnKill = 2;
let kills = 0;
let player;

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
        keyboardMove(player);
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
            case 0: obj.moveUp(); break;
            case 1: obj.moveRight(); break;
            case 2: obj.moveDown(); break;
            case 3: obj.moveLeft(); break;
        }

        steps--;
        detectCollisions();
    }, 200);

    obj.interval = interval;
}

function keyboardMove(obj) {
    let interval = null;

    document.addEventListener("keydown", (event) => {
        if (interval !== null) {
            clearInterval(interval);
        }
        
        interval = setInterval(() => {
            switch(event.code) {
                case "ArrowUp": obj.moveUp(); break;
                case "ArrowRight": obj.moveRight(); break;
                case "ArrowDown": obj.moveDown(); break;
                case "ArrowLeft": obj.moveLeft(); break;
                default: break;
            }

            detectCollisions();
        }, 5);
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

}