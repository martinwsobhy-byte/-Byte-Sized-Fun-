// Snake Game
console.log('Snake game loaded');

// Game variables
let canvas, ctx;
let gridSize = 20;
let tileCount = 30;
let snake = [];
let snakeLength = 1;
let food = { x: 15, y: 15 };
let velocityX = 0;
let velocityY = 0;
let score = 0;
let highScore = 0;
let gameSpeed = 100;
let gameLoop;
let isPaused = false;
let gameOver = false;
let foodEaten = 0;
let gameTime = 0;
let timeInterval;

// Customization settings
let snakeColor = 'green';
let foodType = 'fruits';
let backgroundColor = 'dark';

// Color configurations
const snakeColors = {
    green: { head: '#2ecc71', body: '#27ae60' },
    blue: { head: '#3498db', body: '#2980b9' },
    red: { head: '#e74c3c', body: '#c0392b' },
    purple: { head: '#9b59b6', body: '#8e44ad' },
    orange: { head: '#f39c12', body: '#e67e22' },
    pink: { head: '#ff6b9d', body: '#c44569' }
};

// Food configurations
const foodEmojis = {
    fruits: ['🍎', '🍊', '🍇', '🍓', '🍌', '🍉', '🍑', '🍒'],
    birds: ['🐦', '🦅', '🦜', '🦆', '🦉', '🐧', '🦚', '🕊️'],
    insects: ['🐛', '🦋', '🐝', '🐞', '🦗', '🦟']
};

// Background configurations
const backgrounds = {
    dark: '#2c3e50',
    light: '#ecf0f1',
    forest: '#1e3c72',
    sunset: '#ff6b6b',
    ocean: '#667eea',
    grass: '#56ab2f'
};

let currentFoodEmoji = '🍎';

// Initialize game
function initGame() {
    console.log('Initializing snake game...');
    
    // Get customization from localStorage
    snakeColor = localStorage.getItem('snakeColor') || 'green';
    foodType = localStorage.getItem('foodType') || 'fruits';
    backgroundColor = localStorage.getItem('background') || 'dark';
    
    // Setup canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Load high score
    highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
    document.getElementById('highScore').textContent = highScore;
    
    // Initialize snake
    snake = [{ x: 15, y: 15 }];
    snakeLength = 1;
    velocityX = 0;
    velocityY = 0;
    
    // Place first food
    placeFood();
    
    // Start game loop
    startGameLoop();
    
    // Start timer
    startTimer();
    
    console.log('Snake game initialized');
}

// Start game loop
function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, gameSpeed);
}

// Start timer
function startTimer() {
    if (timeInterval) clearInterval(timeInterval);
    gameTime = 0;
    timeInterval = setInterval(() => {
        if (!isPaused && !gameOver) {
            gameTime++;
            updateTimeDisplay();
        }
    }, 1000);
}

// Update time display
function updateTimeDisplay() {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    document.getElementById('time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update game
function updateGame() {
    if (isPaused || gameOver) return;
    
    // Don't move if no direction set yet
    if (velocityX === 0 && velocityY === 0) return;
    
    // Move snake
    const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame('You hit the wall!');
        return;
    }
    
    // Check self collision (only if snake has more than 1 segment)
    if (snake.length > 1) {
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                endGame('You bit yourself!');
                return;
            }
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        score += 10;
        foodEaten++;
        
        // Update UI
        document.getElementById('score').textContent = score;
        document.getElementById('length').textContent = snakeLength;
        document.getElementById('foodEaten').textContent = foodEaten;
        
        // Increase speed every 5 foods
        if (foodEaten % 5 === 0) {
            gameSpeed = Math.max(50, gameSpeed - 10);
            startGameLoop();
            document.getElementById('speed').textContent = Math.floor((150 - gameSpeed) / 10);
        }
        
        // Place new food
        placeFood();
    }
    
    // Remove tail if not growing
    while (snake.length > snakeLength) {
        snake.pop();
    }
    
    // Draw game
    drawGame();
}

// Draw game
function drawGame() {
    // Clear canvas
    ctx.fillStyle = backgrounds[backgroundColor];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw head
            ctx.fillStyle = snakeColors[snakeColor].head;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Draw eyes
            ctx.fillStyle = 'white';
            const eyeSize = 4;
            const eyeOffset = 5;
            
            if (velocityX === 1) { // Right
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (velocityX === -1) { // Left
                ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + 12, eyeSize, eyeSize);
            } else if (velocityY === 1) { // Down
                ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (velocityY === -1) { // Up
                ctx.fillRect(segment.x * gridSize + 4, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
            } else {
                // Default eyes (right)
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 12, eyeSize, eyeSize);
            }
        } else {
            // Draw body
            ctx.fillStyle = snakeColors[snakeColor].body;
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        }
    });
    
    // Draw food (emoji)
    ctx.font = `${gridSize - 4}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentFoodEmoji, food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2);
}

// Place food
function placeFood() {
    let validPosition = false;
    
    while (!validPosition) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        // Check if food is not on snake
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    // Select random food emoji
    const foods = foodEmojis[foodType];
    currentFoodEmoji = foods[Math.floor(Math.random() * foods.length)];
}

// Change direction
function changeDirection(direction) {
    if (gameOver) return;
    
    switch(direction) {
        case 'up':
            if (velocityY !== 1) {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case 'down':
            if (velocityY !== -1) {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case 'left':
            if (velocityX !== 1) {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case 'right':
            if (velocityX !== -1) {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            e.preventDefault();
            changeDirection('up');
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            e.preventDefault();
            changeDirection('down');
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            e.preventDefault();
            changeDirection('left');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            e.preventDefault();
            changeDirection('right');
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
});

// Toggle pause
function togglePause() {
    if (gameOver) return;
    
    isPaused = !isPaused;
    document.getElementById('pauseOverlay').style.display = isPaused ? 'flex' : 'none';
    
    const pauseBtn = document.querySelector('.pause-btn');
    pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
}

// End game
function endGame(message) {
    gameOver = true;
    clearInterval(gameLoop);
    clearInterval(timeInterval);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('newHighScore').style.display = 'flex';
    }
    
    // Show game over modal
    document.getElementById('gameOverMessage').textContent = message;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLength').textContent = snakeLength;
    document.getElementById('finalTime').textContent = document.getElementById('time').textContent;
    document.getElementById('gameOverModal').style.display = 'flex';
}

// Restart game
function restartGame() {
    gameOver = false;
    isPaused = false;
    score = 0;
    foodEaten = 0;
    gameSpeed = 100;
    
    document.getElementById('score').textContent = 0;
    document.getElementById('length').textContent = 1;
    document.getElementById('foodEaten').textContent = 0;
    document.getElementById('speed').textContent = 1;
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('pauseOverlay').style.display = 'none';
    document.getElementById('newHighScore').style.display = 'none';
    
    const pauseBtn = document.querySelector('.pause-btn');
    pauseBtn.textContent = '⏸️ Pause';
    
    initGame();
}

// Go to customize
function goToCustomize() {
    window.location.href = 'choose_to/choose_to.html';
}

// Go to menu
function goToMenu() {
    window.location.href = '../main_menu.html';
}

// Touch swipe support
(function() {
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', function(e) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        if (Math.abs(dx) > Math.abs(dy)) {
            changeDirection(dx > 0 ? 'right' : 'left');
        } else {
            changeDirection(dy > 0 ? 'down' : 'up');
        }
    }, { passive: true });
})();

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});
