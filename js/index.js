// Canvas
const clearColor = 'black'
let canvas, canvasContext
let canvasWidth, canvasHeight

// Game
const size = 5
const velocity = size
const maxBodyParts = 1
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
    maxBodyParts: 1
}

// Food
const food = {
    x: 0,
    y: 0,
    color: 'green'
}

// Input
const keyPressed = {
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

    textWidth = canvasContext.measureText(gameOverText).width
    gameOverTextX = canvasWidth / 2 - textWidth / 2
    gameOverTextY = canvasHeight / 2

    window.addEventListener("keydown", function(e) {
        if (e.code in keyPressed) {
            keyPressed[e.code] = !keyPressed[e.code]
        }
    })

    window.addEventListener("keyup", function(e) {
        if (e.code in keyPressed) {
            keyPressed[e.code] = !keyPressed[e.code]
        }
    })

    window.requestAnimationFrame(gameLoop)
})

// aabb collision
function partHit(part) {
    let head = snakeBody.bodyParts[0]
    return ((head.x < part.x + size - 1 && head.x + size - 1 > part.x &&
        head.y < part.y + size - 1 && head.y + size - 1 > part.y))
}

function foodHit() {
    let head = snakeBody.bodyParts[0]

    if (head == null)
        return false

    return ((head.x < food.x + size - 1 && head.x + size - 1 > food.x &&
        head.y < food.y + size - 1 && head.y + size - 1 > food.y))
}

function randomIntBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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
    snakeBody.bodyParts = []
    snakeBody.xv = 0
    snakeBody.yv = 0
    snakeBody.maxBodyParts = maxBodyParts
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

    clearScreen()
    handleInput()

    if (gameRunning)
        checkCollision()

    drawScreen()
}

function clearScreen() {
    canvasContext.fillStyle = clearColor
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

function handleInput() {

    if (keyPressed["ArrowLeft"] && !gameOver) {
        snakeBody.xv = velocity * -1
        snakeBody.yv = 0

    } else if (keyPressed["ArrowRight"] && !gameOver) {
        snakeBody.xv = velocity
        snakeBody.yv = 0

    } else if (keyPressed["ArrowUp"] && !gameOver) {
        snakeBody.yv = velocity * -1
        snakeBody.xv = 0

    } else if (keyPressed["ArrowDown"] && !gameOver) {
        snakeBody.yv = velocity
        snakeBody.xv = 0
    } else if (keyPressed["KeyS"] && !gameRunning) {
        startGame()
    }

    if (snakeBody.xv != 0 || snakeBody.yv != 0) {
        snakeBody.bodyParts.unshift({ x: snakeBody.x, y: snakeBody.y });
    }

    snakeBody.x += snakeBody.xv;
    snakeBody.y += snakeBody.yv;

    for (var i = 1; i < snakeBody.bodyParts.length; i++) {
        if (partHit(snakeBody.bodyParts[i]) && snakeBody.maxBodyParts > 1) {
            stopGame()
            return
        }
    }

    if (snakeBody.bodyParts.length > snakeBody.maxBodyParts)
        snakeBody.bodyParts.pop();
}

function checkCollision() {
    wallCollision()
    foodCollision()
}

function wallCollision() {

    if ((snakeBody.x < 0) ||
        (snakeBody.x + size > canvasWidth) ||
        (snakeBody.y < 0) ||
        (snakeBody.y + size > canvasHeight)) {
        stopGame()
        return true
    }
    return false
}

function foodCollision() {
    if (foodHit()) {
        spawnFood()
        score++
        snakeBody.maxBodyParts++
    }
}

function drawScreen() {
    if (gameRunning) {
        checkCollision()
        drawFood()
        drawSnakeBody()
    } else if (gameOver) {
        drawGameOver()
    } else {
        drawStartOverLay()
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