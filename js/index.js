let canvas, canvasContext;
let canvasWidth, canvasHeight;

// Snake
let snakeWidth = 4;
let snakeHeight = 4;
let snakeX;
let snakeY;
let xVelocity = 2;
let yVelocity = 2;
let tail = {};

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
let eggX;
let eggY;
let eggWidth = 3;
let eggHeight = 3;

window.addEventListener('DOMContentLoaded', function() {

    canvas = document.querySelector("div canvas")
    canvasContext = canvas.getContext("2d");

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

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

    spawnHead();
    spawnEgg();
    window.requestAnimationFrame(gameLoop)
})

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function gameLoop() {

    clearScreen();

    handleInput();

    drawHead();

    drawEgg();

    // update tail

    checkCollision();

    window.requestAnimationFrame(gameLoop);
}

function spawnHead() {
    snakeX = canvasWidth / 2 - snakeWidth / 2;
    snakeY = canvasHeight / 2 - snakeHeight / 2;
}

function spawnEgg() {
    eggX = randomIntBetween(eggWidth, canvasWidth - eggWidth);
    eggY = randomIntBetween(eggHeight, canvasHeight - eggHeight);
}

function handleInput() {

    if (gameOver)
        return;

    if (keyMap["ArrowLeft"]) {
        snakeX -= xVelocity;
    } else if (keyMap["ArrowRight"]) {
        snakeX += xVelocity;
    } else if (keyMap["ArrowUp"]) {
        snakeY -= yVelocity;
    } else if (keyMap["ArrowDown"]) {
        snakeY += yVelocity;
    }
}

function checkCollision() {
    snakeCollision();
    eggCollision();
}

function snakeCollision() {
    if (snakeX <= 0) {
        snakeX = 0;
        gameOver = true;
    } else if (snakeX + snakeWidth > canvasWidth) {
        snakeX = canvasWidth - snakeWidth;
        gameOver = true;
    } else if (snakeY <= 0) {
        snakeY = 0;
        gameOver = true;
    } else if (snakeY + snakeHeight > canvasHeight) {
        snakeY = canvasHeight - snakeHeight;
        gameOver = true;
    }
}

function eggCollision() {
    if (areColliding(snakeX, snakeY, snakeWidth, snakeHeight, eggX, eggY, eggWidth, eggHeight)) {
        // add tail
    }
}

function clearScreen() {
    canvasContext.fillStyle = 'black';
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function drawHead() {
    canvasContext.fillStyle = '#4361ee';
    canvasContext.fillRect(snakeX, snakeY, snakeWidth, snakeHeight);
}

function drawEgg() {
    canvasContext.fillStyle = '#ffa631';
    canvasContext.fillRect(eggX, eggY, eggWidth, eggHeight);
}

// aabb collision
function areColliding(x1, y1, width1, height1, x2, y2, width2, height2) {
    return (x1 < x2 + width2 && x1 + width1 > x2 &&
        y1 < y2 + height2 && y1 + height1 > y2)
}