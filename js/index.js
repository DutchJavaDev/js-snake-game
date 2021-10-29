// Canvas
const clearColor = 'black'
let canvas, canvasContext
let canvasWidth, canvasHeight

// Game
const size = 5
const velocity = size
let frameCount = 0
let gameRunning = false
let gameOver = false

// UI
const textColor = 'white'
const startText = 'Press `S` to start'
const gameOverText = 'Game over, press `S` to start'
const font = '8px'
let score = 0
let startTextX
let startTextY
let gameOverTextX
let gameOverTextY

// Snake
const snakeBody = {
    x: 0,
    y: 160,
    xv: 0,
    yv: 0,
    color: 'white',
    bodyParts: [],
    maxBodyParts: 4
}

// Food
const food = {
    x: 0,
    y: 0,
    color: 'green'
}

// Input
const keyMap = {
    "ArrowLeft": false,
    "ArrowRight": false,
    "ArrowUp": false,
    "ArrowDown": false,
    "Space": false,
    "KeyS": false,
}

window.addEventListener('DOMContentLoaded', function() {

    canvas = document.querySelector("div canvas")
    canvasContext = canvas.getContext("2d");

    canvasWidth = canvas.width
    canvasHeight = canvas.height

    // calculate text position once instead of every frame
    let textWidth = canvasContext.measureText(startText).width
    startTextX = canvasWidth / 2 - textWidth / 2
    startTextY = canvasHeight / 2

    textWidth = canvasContext.measureText(gameOverText)
    gameOverTextX = canvasWidth / 2 - textWidth / 2
    gameOverTextY = canvasHeight

    window.addEventListener("keydown", function(e) {
        if (e.code in keyMap) {
            keyMap[e.code] = true
        }
    })

    window.addEventListener("keyup", function(e) {
        if (e.code in keyMap) {
            keyMap[e.code] = false
        }
    })

    window.requestAnimationFrame(gameLoop)
})

function centerSnake() {
    snakeBody.y = canvasHeight / 2
    snakeBody.x = canvasWidth / 2
}

function spawnFood() {
    food.x = randomIntBetween(10, canvasWidth - 10)
    food.y = randomIntBetween(10, canvasHeight - 10)
}

function stopGame() {
    gameRunning = false
    gameOver = true
        // send score to backend
}

function startGame() {
    centerSnake()
    spawnFood()
    snakeBody.xv = velocity
    gameRunning = true
    gameOver = false
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop)

    // run at 30fps instead of 60
    if (++frameCount < 2) {
        return
    }

    frameCount = 0;

    clearCanvas()
    handleInput()

    // if (gameRunning) {
    //     checkCollision()
    //     drawFood()
    //     drawSnakeBody()
    // } else if (gameOver) {
    //     drawGameOver()
    // } else {
    //     drawStartOverLay()
    // }
    drawGameOver()
}

function clearCanvas() {
    canvasContext.fillStyle = clearColor
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function handleInput() {

    if (keyMap["ArrowLeft"] && !gameOver) {
        snakeBody.xv = velocity * -1
        snakeBody.yv = 0

    } else if (keyMap["ArrowRight"] && !gameOver) {
        snakeBody.xv = velocity
        snakeBody.yv = 0

    } else if (keyMap["ArrowUp"] && !gameOver) {
        snakeBody.yv = velocity * -1
        snakeBody.xv = 0

    } else if (keyMap["ArrowDown"] && !gameOver) {
        snakeBody.yv = velocity
        snakeBody.xv = 0
    } else if (keyMap["KeyS"] && !gameRunning) {
        startGame()
    }

    if (snakeBody.xv != 0 || snakeBody.yv != 0) {
        snakeBody.bodyParts.unshift({ x: snakeBody.x, y: snakeBody.y });
    }

    snakeBody.x += snakeBody.xv;
    snakeBody.y += snakeBody.yv;

    if (snakeBody.bodyParts.length > snakeBody.maxBodyParts)
        snakeBody.bodyParts.pop();
}

function checkCollision() {
    wallCollision()
    foodCollision()
}

function wallCollision() {
    if (snakeBody.x < 0) {
        snakeBody.x = 0
        stopGame()
    }

    if (snakeBody.x + size > canvasWidth) {
        snakeBody.x = canvasWidth - size
        stopGame()
    }

    if (snakeBody.y < 0) {
        snakeBody.y = 0
        stopGame()
    }

    if (snakeBody.y + size > canvasHeight) {
        snakeBody.y = canvasHeight - size
        stopGame()
    }

}

function foodCollision() {
    if (areColliding(snakeBody.x, snakeBody.y, size, size, food.x, food.y, size, size)) {
        spawnFood()
        score++
        snakeBody.maxBodyParts++
    }
}

function drawSnakeBody() {
    canvasContext.fillStyle = snakeBody.color
    for (let i = 0; i < snakeBody.bodyParts.length; i++) {
        let part = snakeBody.bodyParts[i];
        canvasContext.fillRect(part.x, part.y, size - 1, size - 1);
    }
}

function drawFood() {
    canvasContext.fillStyle = food.color;
    canvasContext.fillRect(food.x, food.y, size - 1, size - 1)
}

function drawStartOverLay() {
    canvasContext.fillStyle = textColor
    canvasContext.font = font
    canvasContext.fillText(startText, startTextX, startTextY)
}

function drawGameOver() {
    canvasContext.fillStyle = textColor
    canvasContext.font = font
    canvasContext.fillText(gameOverText, gameOverTextX, gameOverTextY)
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