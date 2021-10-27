// Canvas
let canvas, canvasContext;
let canvasWidth, canvasHeight;

// Snake
let snakeWidth = 4;
let snakeHeight = 4;
let velocity = 1;
let xVelocity = 0;
let yVelocity = 0;
let snakeBody = [{ x: 0, y: 0, width: snakeWidth, height: snakeHeight }, { x: 0, y: 0, width: snakeWidth, height: snakeHeight }]

let foodX;
let foodY;
let foodWidth = 3;
let foodHeight = 3;

// Input
let keyMap = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowUp": false,
    "ArrowDown": false
}

// Gameloop
let start, previousTimeStamp;

// Game
let gameOver = false;
let points = 0;

// UI
let colors = ['red', 'yellow', 'pink'];

window.addEventListener('DOMContentLoaded', function() {

    canvas = document.querySelector("div canvas")
    canvasContext = canvas.getContext("2d");

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    createSnake();

    window.addEventListener("keydown", function(e) {
        if (e.code in keyMap) {
            keyMap[e.code] = true;
        }
    })

    window.addEventListener("keyup", function(e) {
        if (e.code in keyMap) {
            keyMap[e.code] = false;
        }
    })

    spawnFood();
    window.requestAnimationFrame(gameLoop)
})

function createSnake() {
    snakeBody[0].x = canvasWidth / 2 - snakeWidth / 2;
    snakeBody[0].y = canvasHeight / 2 - snakeHeight / 2;

    snakeBody[1].x = snakeBody[0].x + snakeWidth;
    snakeBody[1].y = snakeBody[0].y;

    console.log(snakeBody);
}

function spawnFood() {
    foodX = randomIntBetween(foodWidth * 2, canvasWidth - foodWidth * 2)
    foodY = randomIntBetween(foodHeight * 2, canvasHeight - foodHeight * 2)
}

function gameLoop() {

    clear();

    handleInput();

    checkCollision();

    drawFood();

    drawSnakeBody();

    window.requestAnimationFrame(gameLoop);
}


function handleInput() {

    if (keyMap["ArrowLeft"]) {
        xVelocity = velocity * -1;
        yVelocity = 0;
    }

    if (keyMap["ArrowRight"]) {
        xVelocity = velocity * 1;
        yVelocity = 0;
    }

    if (keyMap["ArrowUp"]) {
        yVelocity = velocity * -1;
        xVelocity = 0;
    }

    if (keyMap["ArrowDown"]) {
        yVelocity = velocity * 1;
        xVelocity = 0;
    }

    snakeBody[0].x += xVelocity;
    snakeBody[0].y += yVelocity;

    if (xVelocity != 0 || yVelocity != 0)
        updateBody();
}

function checkCollision() {
    borderCollision();
    foodCollison();
}

function borderCollision() {
    let head = snakeBody[0];

    if (head.x < 0) {
        head.x = 0;
        gameOver = true;
    }

    if (head.x + snakeWidth > canvasWidth) {
        head.x = canvasWidth - snakeWidth;
        gameOver = true;
    }

    if (head.y < 0) {
        head.y = 0;
        gameOver = true;
    }

    if (head.y + snakeHeight > canvasHeight) {
        head.y = canvasHeight - snakeHeight;
        gameOver = true;
    }

}

function foodCollison() {
    let head = snakeBody[0];

    if (areColliding(head.x, head.y, snakeWidth, snakeHeight, foodX, foodY, foodWidth, foodHeight)) {
        if (xVelocity < 0) {
            snakeBody.unshift({ x: head.x - snakeWidth, y: head.y, width: snakeWidth, height: snakeHeight })
        } else if (xVelocity > 0) {
            snakeBody.unshift({ x: head.x + snakeWidth, y: head.y, width: snakeWidth, height: snakeHeight })
        } else if (yVelocity < 0) {
            snakeBody.unshift({ x: head.x, y: head.y - snakeHeight, width: snakeWidth, height: snakeHeight })
        } else if (yVelocity > 0) {
            snakeBody.unshift({ x: head.x, y: head.y + snakeHeight, width: snakeWidth, height: snakeHeight })
        } else {
            // do nothing
        }

        points++;

        spawnFood();
    }
}

function updateBody() {
    for (let i = 1; i < snakeBody.length; i++) {
        snakeBody[i].x += xVelocity;
        snakeBody[i].y += yVelocity;
    }
}

function clear() {
    canvasContext.fillStyle = 'black';
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawSnakeBody() {
    canvasContext.fillStyle = 'white'

    for (let i = 0; i < snakeBody.length; i++) {
        let bodyPart = snakeBody[i];
        canvasContext.fillRect(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height);
    }
}

function drawFood() {
    canvasContext.fillStyle = 'orange'
    canvasContext.fillRect(foodX, foodY, foodWidth, foodHeight)
}

// aabb collision
function areColliding(x1, y1, width1, height1, x2, y2, width2, height2) {
    return (x1 < x2 + width2 && x1 + width1 > x2 &&
        y1 < y2 + height2 && y1 + height1 > y2)
}

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}