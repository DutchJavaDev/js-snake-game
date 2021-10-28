// Canvas
let canvas, canvasContext;
let canvasWidth, canvasHeight;
let clearColor = 'red'

// Game
let size = 10;
let velocity = size;
let count = 0;

// Snake
var snakeBody = {
    x: 0,
    y: 160,
    xv: velocity,
    yv: 0,
    bodyParts: [],
    maxBodyParts: 4
}

// Input
let keyMap = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowUp": false,
    "ArrowDown": false,
    "Space": false
}

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

    snakeBody.y = canvasHeight / 2
    snakeBody.x = canvasWidth / 2

    window.requestAnimationFrame(gameLoop)
})

function gameLoop() {
    window.requestAnimationFrame(gameLoop)

    if (++count < 4) {
        return;
    }

    count = 0;

    clearCanvas()

    handleInput()

    drawSnakeBody()
}

function clearCanvas() {
    canvasContext.fillStyle = 'black'
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function handleInput() {
    if (keyMap["ArrowLeft"]) {
        snakeBody.xv = velocity * -1
        snakeBody.yv = 0
    } else if (keyMap["ArrowRight"]) {
        snakeBody.xv = velocity
        snakeBody.yv = 0
    } else if (keyMap["ArrowUp"]) {
        snakeBody.yv = velocity * -1
        snakeBody.xv = 0
    } else if (keyMap["ArrowDown"]) {
        snakeBody.yv = velocity
        snakeBody.xv = 0
    } else if (keyMap["Space"]) {
        snakeBody.xv = 0
        snakeBody.yv = 0
        console.log(snakeBody)
    }

    if (snakeBody.xv != 0 || snakeBody.yv != 0) {
        snakeBody.bodyParts.unshift({ x: snakeBody.x, y: snakeBody.y });
    }

    snakeBody.x += snakeBody.xv;
    snakeBody.y += snakeBody.yv;

    if (snakeBody.bodyParts.length > snakeBody.maxBodyParts)
        snakeBody.bodyParts.pop();
}

function drawSnakeBody() {

    for (let i = 0; i < snakeBody.bodyParts.length; i++) {

        if (i == 0) {
            canvasContext.fillStyle = 'green'
        } else {
            canvasContext.fillStyle = 'red'
        }

        let part = snakeBody.bodyParts[i];

        canvasContext.fillRect(part.x, part.y, size - 1, size - 1);
    }
}

// aabb collision
function areColliding(x1, y1, width1, height1, x2, y2, width2, height2) {
    return (x1 < x2 + width2 && x1 + width1 > x2 &&
        y1 < y2 + height2 && y1 + height1 > y2)
}

// https://stackoverflow.com/a/1527820/2124254
function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}