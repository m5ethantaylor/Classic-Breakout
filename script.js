// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- GAME STATE & CONSTANTS ---

// Ball properties
let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4, // x-velocity
    dy: -4, // y-velocity
    radius: 10
};

// Paddle properties
let paddle = {
    height: 15,
    width: 100,
    x: (canvas.width - 100) / 2
};

// Brick properties
const brick = {
    rowCount: 5,
    columnCount: 9,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 40,
    offsetLeft: 30
};

// Game state variables
let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;
let bricks = [];
let gameIsOver = false;

// --- INITIALIZATION ---

// Create the grid of bricks
function initializeBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brick.rowCount; r++) {
            // Position each brick and set it to 'visible'
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// --- DRAWING FUNCTIONS ---

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff4757'; // A bright red color
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    ctx.fillStyle = '#4d94ff'; // A cool blue color
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brick.width + brick.padding) + brick.offsetLeft;
                let brickY = r * (brick.height + brick.padding) + brick.offsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brick.width, brick.height);
                ctx.fillStyle = '#2ed573'; // A vibrant green
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#f0f0f0';
    ctx.fillText('Score: ' + score, 8, 25);
}

function drawLives() {
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#f0f0f0';
    ctx.fillText('Lives: ' + lives, canvas.width - 95, 25);
}

// --- COLLISION DETECTION & GAME LOGIC ---

function collisionDetection() {
    // Ball and brick collision
    for (let c = 0; c < brick.columnCount; c++) {
        for (let r = 0; r < brick.rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brick.width &&
                    ball.y > b.y &&
                    ball.y < b.y + brick.height
                ) {
                    ball.dy = -ball.dy; // Reverse ball direction
                    b.status = 0; // Hide the brick
                    score++;
                    // Check for win condition
                    if (score === brick.rowCount * brick.columnCount) {
                        alert('YOU WIN, CONGRATULATIONS!');
                        document.location.reload();
                    }
                }
            }
        }
    }

    // Ball and wall collision
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
        // Ball hits the paddle
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else {
            // Ball hits the bottom - lose a life
            lives--;
            if (lives <= 0) {
                gameIsOver = true;
            } else {
                // Reset ball and paddle position
                ball.x = canvas.width / 2;
                ball.y = canvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }
}

// --- MAIN GAME LOOP ---

function update() {
    if (gameIsOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '40px "Courier New"';
        ctx.fillStyle = '#ff4757';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px "Courier New"';
        ctx.fillText('Press Enter to Play Again', canvas.width / 2, canvas.height / 2 + 20);
        return; // Stop the game loop
    }

    // Clear the canvas before each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    // Update positions and check for collisions
    collisionDetection();

    // Move the paddle
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += 7;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= 7;
    }

    // Move the ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Request the next frame
    requestAnimationFrame(update);
}

// --- EVENT LISTENERS ---

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === 'Enter' && gameIsOver) {
        document.location.reload(); // Restart the game
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// --- START THE GAME ---
initializeBricks();
update();
