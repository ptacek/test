const board = document.getElementById("board");
const MOVE_STEP = 1;

for (let i = 0; i < 6; i++) {
    generateEnemy();
}


function generateEnemy() {
    const enemy = document.createElement("img");
    enemy.src = "img/enemy.png";
    enemy.classList.add("enemy");

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

function randomMove(obj) {
    const interval = setInterval(() => {
        const direction = Math.floor(Math.random() * 4);
        
        switch (direction) {
            case 0: obj.moveUp(); break;
            case 1: obj.moveRight(); break;
            case 2: obj.moveDown(); break;
            case 3: obj.moveLeft(); break;
        }
    }, 200);

    obj.interval = interval;
}

class Enemy {
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