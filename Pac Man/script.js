// Pac-Man Web Game - Simple Version
console.log('Starting Pac-Man...');

let canvas, ctx;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;

// Power Mode variables
let powerMode = false;
let powerModeTimer = 0;
const POWER_MODE_DURATION = 10000; // 10 seconds

// Game settings
const GRID = 20;
const COLS = 31;
const ROWS = 31;

// Player
let pacman = { x: 15, y: 25, dir: 0 };

// Ghosts - 4 ghosts with different colors
let ghosts = [
    { x: 13, y: 15, dir: 0, color: '#ff0000', originalColor: '#ff0000', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 },
    { x: 14, y: 15, dir: 1, color: '#ffb8ff', originalColor: '#ffb8ff', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 },
    { x: 16, y: 15, dir: 2, color: '#00ffff', originalColor: '#00ffff', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 },
    { x: 17, y: 15, dir: 3, color: '#ffa500', originalColor: '#ffa500', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 }
];
// Simple maze with tunnel (1=wall, 0=empty, 2=dot, 3=power) - 31x31
let maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,1,1,1,0,0,1,1,1,0,1,1,1,0,0,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,2,1,0,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,2,1,1,1,1,1,2,1],
    [0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,2,0,0,0,0,0,0,0],
    [1,1,1,1,1,2,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,2,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,2,1,1,1,2,1,2,1],
    [1,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Directions: right, down, left, up
const directions = [[1,0], [0,1], [-1,0], [0,-1]];

// Initialize game
function initGame() {
    console.log('Initializing game...');
    
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('Canvas not found!');
        return false;
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = COLS * GRID;
    canvas.height = ROWS * GRID;
    
    gameRunning = true;
    updateUI();
    gameLoop();
    
    console.log('Game started!');
    return true;
}

// Game loop
let lastTime = 0;
function gameLoop() {
    if (!gameRunning) return;
    
    const currentTime = Date.now();
    if (currentTime - lastTime > 200 && !gamePaused) {
        update();
        lastTime = currentTime;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game
function update() {
    // Move Pac-Man
    const [dx, dy] = directions[pacman.dir];
    let newX = pacman.x + dx;
    let newY = pacman.y + dy;
    
    // Handle tunnel effect (wrap around horizontally)
    if (newX < 0) {
        newX = COLS - 1;
    } else if (newX >= COLS) {
        newX = 0;
    }
    
    // Check walls (but allow tunnel movement)
    if (newY >= 0 && newY < ROWS && maze[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;
        
        // Collect items
        if (maze[newY][newX] === 2) {
            maze[newY][newX] = 0;
            score += 10;
            updateUI();
        } else if (maze[newY][newX] === 3) {
            maze[newY][newX] = 0;
            score += 50;
            updateUI();
            
            // Activate power mode
            activatePowerMode();
            
            // Show power pellet message briefly
            showPowerMessage();
        }
    }
    
    // Update power mode timer
    if (powerMode) {
        powerModeTimer -= 200; // Decrease by game loop interval
        if (powerModeTimer <= 0) {
            deactivatePowerMode();
        }
    }

    // Move ghosts - behavior depends on power mode and ghost state
    ghosts.forEach(ghost => {
        // Ghosts move slower than Pac-Man (every 2 game cycles)
        ghost.moveCounter++;
        if (ghost.moveCounter < 2) {
            return; // Skip movement this cycle
        }
        ghost.moveCounter = 0; // Reset counter
        // Handle eaten ghosts (they stay in place for 4 seconds)
        if (ghost.eaten) {
            // Handle respawn timer (ghost waiting after being eaten)
            if (ghost.respawnTimer > 0) {
                ghost.respawnTimer -= 200; // Decrease timer
                
                // Check if respawn timer finished
                if (ghost.respawnTimer <= 0) {
                    // Respawn complete - become normal ghost again
                    ghost.eaten = false;
                    ghost.scared = false;
                    ghost.color = ghost.originalColor;
                    ghost.respawnTimer = 0;
                }
            }
            return; // Don't move, just wait in place
        } else if (ghost.scared && powerMode) {
            // Run away from Pac-Man
            const dx = pacman.x - ghost.x;
            const dy = pacman.y - ghost.y;
            
            let bestDir = ghost.dir;
            let bestDistance = 0;
            
            // Try all 4 directions and choose the one that gets furthest from Pac-Man
            for (let dir = 0; dir < 4; dir++) {
                const [testDx, testDy] = directions[dir];
                let testX = ghost.x + testDx;
                let testY = ghost.y + testDy;
                
                // Handle tunnel for testing
                if (testX < 0) testX = COLS - 1;
                if (testX >= COLS) testX = 0;
                
                // Check if this direction is valid
                if (testY >= 0 && testY < ROWS && maze[testY][testX] !== 1) {
                    // Calculate distance from Pac-Man from this position
                    const newDx = pacman.x - testX;
                    const newDy = pacman.y - testY;
                    const distance = Math.abs(newDx) + Math.abs(newDy);
                    
                    // If this gets us further from Pac-Man, use this direction
                    if (distance > bestDistance) {
                        bestDistance = distance;
                        bestDir = dir;
                    }
                }
            }
            
            ghost.dir = bestDir;
        } else {
            // Normal chase behavior
            if (Math.random() < 0.8) {
                // Calculate direction to Pac-Man
                const dx = pacman.x - ghost.x;
                const dy = pacman.y - ghost.y;
                
                // Choose best direction to chase Pac-Man
                let bestDir = ghost.dir;
                let bestDistance = Math.abs(dx) + Math.abs(dy);
                
                // Try all 4 directions
                for (let dir = 0; dir < 4; dir++) {
                    const [testDx, testDy] = directions[dir];
                    let testX = ghost.x + testDx;
                    let testY = ghost.y + testDy;
                    
                    // Handle tunnel for testing
                    if (testX < 0) testX = COLS - 1;
                    if (testX >= COLS) testX = 0;
                    
                    // Check if this direction is valid
                    if (testY >= 0 && testY < ROWS && maze[testY][testX] !== 1) {
                        // Calculate distance to Pac-Man from this position
                        const newDx = pacman.x - testX;
                        const newDy = pacman.y - testY;
                        const distance = Math.abs(newDx) + Math.abs(newDy);
                        
                        // If this gets us closer to Pac-Man, use this direction
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestDir = dir;
                        }
                    }
                }
                
                ghost.dir = bestDir;
            } else {
                // Move randomly sometimes
                ghost.dir = Math.floor(Math.random() * 4);
            }
        }
        
        // Move in the chosen direction
        const [moveX, moveY] = directions[ghost.dir];
        let newX = ghost.x + moveX;
        let newY = ghost.y + moveY;
        
        // Handle tunnel for ghosts
        if (newX < 0) newX = COLS - 1;
        if (newX >= COLS) newX = 0;
        
        // Check walls
        if (newY >= 0 && newY < ROWS && maze[newY][newX] !== 1) {
            ghost.x = newX;
            ghost.y = newY;
        } else {
            // If can't move, try random direction
            ghost.dir = Math.floor(Math.random() * 4);
        }
    });
    
    // Check collision
    ghosts.forEach((ghost, index) => {
        if (ghost.x === pacman.x && ghost.y === pacman.y && !ghost.eaten) {
            if (powerMode && ghost.scared) {
                // Pac-Man eats the ghost
                ghost.eaten = true;
                ghost.scared = false;
                ghost.color = '#666666'; // Gray color when waiting
                ghost.respawnTimer = 4000; // 4 seconds = 4000ms
                score += 200;
                updateUI();
                
                // Show ghost eaten message
                showGhostEatenMessage();
                console.log(`🍽️ Ghost eaten! +200 points`);
            } else if (!ghost.scared) {
                // Ghost catches Pac-Man
                lives--;
                updateUI();
                
                if (lives <= 0) {
                    gameOver();
                } else {
                    // Show quick message and reset positions
                    console.log(`👻 Ghost caught you! Lives remaining: ${lives}`);
                    
                    // Deactivate power mode
                    deactivatePowerMode();
                    
                    // Pause game temporarily (but keep game loop running for drawing)
                    gamePaused = true;
                    
                    // Reset positions immediately
                    pacman.x = 15;
                    pacman.y = 25;
                    pacman.dir = 0; // Reset direction to stop movement
                    resetGhosts();
                    
                    // Show brief visual feedback and resume game after delay
                    showLifeLostMessage();
                    
                    // Resume game after 2 seconds
                    setTimeout(() => {
                        gamePaused = false;
                    }, 2000);
                }
            }
        }
    });
}

// Draw game
function draw() {
    // Clear screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const px = x * GRID;
            const py = y * GRID;
            
            if (maze[y][x] === 1) {
                // Wall
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(px, py, GRID, GRID);
            } else if (maze[y][x] === 2) {
                // Dot
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(px + GRID/2, py + GRID/2, 2, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[y][x] === 3) {
                // Power pellet (animated)
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                const pulseSize = 4 + Math.sin(Date.now() / 200) * 2;
                ctx.arc(px + GRID/2, py + GRID/2, pulseSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    // Draw tunnel indicators
    ctx.fillStyle = '#ffff00';
    ctx.font = '12px Arial';
    ctx.fillText('→', 5, ROWS * GRID / 2 + 5);
    ctx.fillText('←', COLS * GRID - 15, ROWS * GRID / 2 + 5);
    
    // Draw Pac-Man
    const pacX = pacman.x * GRID + GRID/2;
    const pacY = pacman.y * GRID + GRID/2;
    
    // Change Pac-Man color in power mode
    ctx.fillStyle = powerMode ? '#ff0000' : '#ffff00';
    ctx.beginPath();
    ctx.arc(pacX, pacY, GRID/2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw mouth
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(pacX, pacY);
    
    const mouthAngle = Math.PI / 4;
    const startAngle = pacman.dir * Math.PI / 2 - mouthAngle;
    const endAngle = pacman.dir * Math.PI / 2 + mouthAngle;
    
    ctx.arc(pacX, pacY, GRID/2 - 2, startAngle, endAngle);
    ctx.fill();
    
    // Draw ghosts
    ghosts.forEach(ghost => {
        const ghostX = ghost.x * GRID + GRID/2;
        const ghostY = ghost.y * GRID + GRID/2;
        
        // Use scared color if in power mode and scared, otherwise use normal color
        let ghostColor = ghost.color;
        
        // Special handling for respawning ghosts
        if (ghost.respawnTimer > 0) {
            // Flashing effect while respawning
            if (Math.floor(Date.now() / 300) % 2) {
                ghostColor = '#444444'; // Dark gray
            } else {
                ghostColor = ghost.originalColor; // Original color
            }
        } else if (powerMode && ghost.scared && !ghost.eaten) {
            // Flashing white/blue when power mode is about to end
            const timeLeft = powerModeTimer / POWER_MODE_DURATION;
            if (timeLeft < 0.3 && Math.floor(Date.now() / 200) % 2) {
                ghostColor = '#0000ff'; // Flash blue
            } else {
                ghostColor = '#ffffff'; // White when scared
            }
        }
        
        ctx.fillStyle = ghostColor;
        ctx.beginPath();
        ctx.arc(ghostX, ghostY, GRID/2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Ghost eyes (different for scared ghosts and respawning ghosts)
        if (ghost.respawnTimer > 0) {
            // Respawning ghost eyes (closed/sleepy)
            ctx.fillStyle = '#000000';
            ctx.fillRect(ghostX - 6, ghostY - 2, 4, 2);
            ctx.fillRect(ghostX + 2, ghostY - 2, 4, 2);
        } else if (powerMode && ghost.scared && !ghost.eaten) {
            // Scared ghost eyes
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(ghostX - 6, ghostY - 4, 4, 4);
            ctx.fillRect(ghostX + 2, ghostY - 4, 4, 4);
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(ghostX - 4, ghostY - 3, 2, 2);
            ctx.fillRect(ghostX + 4, ghostY - 3, 2, 2);
        } else {
            // Normal ghost eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(ghostX - 6, ghostY - 4, 4, 4);
            ctx.fillRect(ghostX + 2, ghostY - 4, 4, 4);
            
            ctx.fillStyle = '#000000';
            ctx.fillRect(ghostX - 5, ghostY - 3, 2, 2);
            ctx.fillRect(ghostX + 3, ghostY - 3, 2, 2);
        }
    });
}

// Activate power mode
function activatePowerMode() {
    powerMode = true;
    powerModeTimer = POWER_MODE_DURATION;
    
    // Make all ghosts scared
    ghosts.forEach(ghost => {
        if (!ghost.eaten) {
            ghost.scared = true;
            ghost.color = '#ffffff';
        }
    });
    
    console.log('🔥 Power Mode Activated!');
}

// Deactivate power mode
function deactivatePowerMode() {
    powerMode = false;
    powerModeTimer = 0;
    
    // Return ghosts to normal
    ghosts.forEach(ghost => {
        if (!ghost.eaten) {
            ghost.scared = false;
            ghost.color = ghost.originalColor;
        }
    });
    
    console.log('⏰ Power Mode Ended');
}



// Reset ghosts to starting positions
function resetGhosts() {
    ghosts.length = 0; // Clear the array first
    ghosts.push({ x: 13, y: 15, dir: 0, color: '#ff0000', originalColor: '#ff0000', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 });
    ghosts.push({ x: 14, y: 15, dir: 1, color: '#ffb8ff', originalColor: '#ffb8ff', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 });
    ghosts.push({ x: 16, y: 15, dir: 2, color: '#00ffff', originalColor: '#00ffff', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 });
    ghosts.push({ x: 17, y: 15, dir: 3, color: '#ffa500', originalColor: '#ffa500', scared: false, eaten: false, moveCounter: 0, respawnTimer: 0 });
}

// Show power pellet message
function showPowerMessage() {
    const powerMsg = document.createElement('div');
    powerMsg.innerHTML = '🔥 Power Mode! +50<br>Eat the ghosts!';
    powerMsg.style.position = 'fixed';
    powerMsg.style.top = '30%';
    powerMsg.style.left = '50%';
    powerMsg.style.transform = 'translate(-50%, -50%)';
    powerMsg.style.color = '#ff0000';
    powerMsg.style.fontSize = '20px';
    powerMsg.style.fontWeight = 'bold';
    powerMsg.style.zIndex = '1000';
    powerMsg.style.textShadow = '2px 2px 4px #000';
    powerMsg.style.backgroundColor = 'rgba(0,0,0,0.8)';
    powerMsg.style.padding = '15px 25px';
    powerMsg.style.borderRadius = '10px';
    powerMsg.style.border = '2px solid #ff0000';
    powerMsg.style.textAlign = 'center';
    document.body.appendChild(powerMsg);
    
    setTimeout(() => {
        if (document.body.contains(powerMsg)) {
            document.body.removeChild(powerMsg);
        }
    }, 2000);
}

// Show ghost eaten message
function showGhostEatenMessage() {
    const msg = document.createElement('div');
    msg.innerHTML = '🍽️ Ghost Eaten! +200';
    msg.style.position = 'fixed';
    msg.style.top = '40%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.color = '#00ff00';
    msg.style.fontSize = '18px';
    msg.style.fontWeight = 'bold';
    msg.style.zIndex = '1000';
    msg.style.textShadow = '2px 2px 4px #000';
    msg.style.backgroundColor = 'rgba(0,0,0,0.7)';
    msg.style.padding = '10px 20px';
    msg.style.borderRadius = '5px';
    document.body.appendChild(msg);
    
    setTimeout(() => {
        if (document.body.contains(msg)) {
            document.body.removeChild(msg);
        }
    }, 1500);
}

// Show life lost message without stopping game
function showLifeLostMessage() {
    const msg = document.createElement('div');
    msg.innerHTML = `👻 Ghost caught you!<br>❤️ Lives remaining: ${lives}`;
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.color = '#ff4444';
    msg.style.fontSize = '24px';
    msg.style.fontWeight = 'bold';
    msg.style.zIndex = '1000';
    msg.style.textShadow = '2px 2px 4px #000';
    msg.style.backgroundColor = 'rgba(0,0,0,0.8)';
    msg.style.padding = '20px';
    msg.style.borderRadius = '10px';
    msg.style.border = '2px solid #ff4444';
    msg.style.textAlign = 'center';
    document.body.appendChild(msg);
    
    setTimeout(() => {
        if (document.body.contains(msg)) {
            document.body.removeChild(msg);
        }
    }, 2000);
}

// Update UI
function updateUI() {
    const scoreEl = document.getElementById('score');
    const livesEl = document.getElementById('lives');
    const levelEl = document.getElementById('level');
    
    if (scoreEl) scoreEl.textContent = score;
    if (livesEl) livesEl.textContent = lives;
    if (levelEl) levelEl.textContent = '1';
    
    // Check if all dots are collected
    let dotsLeft = 0;
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 2 || maze[y][x] === 3) {
                dotsLeft++;
            }
        }
    }
    
    // Win condition
    if (dotsLeft === 0 && gameRunning) {
        gameRunning = false;
        setTimeout(() => {
            alert(`🎉 Congratulations! You Won!\\n\\n🏆 Final Score: ${score}\\n⭐ You collected all dots!\\n\\n🔄 Click OK to play again`);
            restartGame();
        }, 500);
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`💀 Game Over!\\n\\n🏆 Final Score: ${score}\\n❤️ No lives remaining\\n\\n🔄 Click OK to play again`);
    restartGame();
}

// Restart game
function restartGame() {
    score = 0;
    lives = 3;
    pacman = { x: 15, y: 25, dir: 0 };
    
    // Reset power mode
    deactivatePowerMode();
    
    // Reset ghosts
    resetGhosts();
    
    // Reset maze dots
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (maze[y][x] === 0) {
                // Add dots back
                if ((x === 1 && y === 1) || (x === 29 && y === 1) || 
                    (x === 1 && y === 29) || (x === 29 && y === 29)) {
                    maze[y][x] = 3; // Power pellets
                } else if (y > 0 && y < ROWS-1 && x > 0 && x < COLS-1) {
                    maze[y][x] = 2; // Regular dots
                }
            }
        }
    }
    
    initGame();
}

// Controls
document.addEventListener('keydown', function(e) {
    if (!gameRunning || gamePaused) return;
    
    switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
            pacman.dir = 0; // right
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            pacman.dir = 1; // down
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            pacman.dir = 2; // left
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            pacman.dir = 3; // up
            break;
    }
    e.preventDefault();
});

// Start game when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting game...');
    setTimeout(() => {
        if (initGame()) {
            console.log('Pac-Man started successfully!');
            // No instructions dialog - game starts immediately
        } else {
            console.error('Failed to start Pac-Man!');
        }
    }, 500);
});

console.log('Pac-Man script loaded!');