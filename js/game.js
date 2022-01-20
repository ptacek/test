const board = document.getElementById("board");
const MOVE_STEP = 1;

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
        }, 10);
    });
}

class Character {
    constructor(elem, top, left) {
        this.elem = elem;
        this.top = top;
        this.left = left;
        
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

}

class Player extends Character {
    
}