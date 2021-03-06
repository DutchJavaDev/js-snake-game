import api from "./apiService.js";

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
let name

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

window.addEventListener('DOMContentLoaded', async function() {

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

    updateHighScores()

    getUserName()
})

async function getUserName() {
    let _name = prompt("Please enter name")

    if (_name == "" || _name == undefined) {
        getUserName()
    } else {
        let response = await api.nameExists(_name)

        if (response == 'name has been taken, please try another') {
            alert(response)
            getUserName()
        } else {
            name = _name
            window.requestAnimationFrame(gameLoop)
        }
    }
}

function partHit(part) {
    let head = snakeBody.bodyParts[0]
    return areColliding(head.x, head.y, part.x, part.y)
}

function foodHit() {
    let head = snakeBody.bodyParts[0]

    if (head == null)
        return false

    return areColliding(head.x, head.y, food.x, food.y)
}

// aabb collision
function areColliding(x1, y1, x2, y2) {
    return (x1 < x2 + size - 1 && x1 + size - 1 > x2 &&
        y1 < y2 + size - 1 && y1 + size - 1 > y2)
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

async function stopGame() {
    gameRunning = false
    gameOver = true
    snakeBody.bodyParts = []
    snakeBody.xv = 0
    snakeBody.yv = 0
    snakeBody.maxBodyParts = maxBodyParts

    // send score to backend
    if (score > 0) {
        await api.postScore(name, score)
        updateHighScores()
        score = 0
    }
}

function startGame() {
    centerSnake()
    spawnFood()
    snakeBody.xv = velocity
    gameRunning = true
    gameOver = false
}

async function updateHighScores() {
    let data = await api.getHighScore()
    let highscoreRegionDiv = document.getElementById('highscoreRegion')

    highscoreRegionDiv.innerHTML = ""

    if (data == undefined) {
        let error = document.createElement('h2')
        error.innerHTML = 'Failed to fetch from api'
        highscoreRegionDiv.append(error)
    } else if (data.length == 0) {
        highscoreRegionDiv.append('No highscores to display yet..')
    } else {
        for (var i = 0; i < data.length; i++) {
            let div = document.createElement('div')
            div.innerHTML = `#${i+1} Name: ${data[i].name}, Score: ${data[i].score}`;
            highscoreRegionDiv.append(div)
        }
    }
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

    if (snakeBody.bodyParts.length > snakeBody.maxBodyParts)
        snakeBody.bodyParts.pop();

    for (var i = 1; i < snakeBody.bodyParts.length; i++) {
        if (partHit(snakeBody.bodyParts[i]) && snakeBody.maxBodyParts > 1) {
            stopGame()
            return
        }
    }
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
    }
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