// Snakes and Ladders Game
console.log('Snakes and Ladders loaded');

// Game variables
let canvas, ctx;
let vsAI = true;
let currentPlayer = 1;
let player1Pos = 1;
let player2Pos = 1;
let gameActive = true;
let isRolling = false;

// Game stats
let totalRolls = 0;
let laddersClimbed = 0;
let snakesHit = 0;

// Board settings
const BOARD_SIZE = 10;
const CELL_SIZE = 60;

// Snakes (head -> tail)
const snakes = {
    98: 78,
    95: 75,
    92: 88,
    87: 24,
    83: 42,
    73: 53,
    69: 33,
    64: 60,
    62: 19,
    54: 34,
    49: 11,
    47: 26,
    45: 25,
    17: 7
};

// Ladders (bottom -> top)
const ladders = {
    2: 38,
    7: 14,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    78: 98,
    74:94
};

// Initialize game
function initGame() {
    console.log('Initializing game...');
    
    // Get game mode from localStorage
    const gameMode = localStorage.getItem('snakesGameMode') || 'single';
    vsAI = localStorage.getItem('snakesVsAI') === 'true';
    
    // Update UI
    document.getElementById('gameMode').textContent = vsAI ? 'vs AI' : 'vs Player';
    document.getElementById('player2Name').textContent = vsAI ? 'AI' : 'Player 2';
    
    // Setup canvas
    canvas = document.getElementById('gameBoard');
    ctx = canvas.getContext('2d');
    
    // Draw initial board
    drawBoard();
    drawPlayers();
    
    // Set player 1 as active
    updatePlayerTurn();
    
    console.log('Game initialized');
}

// Draw the game board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells with correct numbering (snake pattern)
    // Bottom row (row 9 on canvas) = 1-10, Top row (row 0 on canvas) = 91-100
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            
            // Calculate which row from bottom (0 = bottom)
            const rowFromBottom = BOARD_SIZE - 1 - row;
            
            // Calculate cell number based on snake pattern
            let cellNumber;
            if (rowFromBottom % 2 === 0) {
                // Even rows from bottom: left to right (1-10, 21-30, etc.)
                cellNumber = rowFromBottom * BOARD_SIZE + col + 1;
            } else {
                // Odd rows from bottom: right to left (11-20, 31-40, etc.)
                cellNumber = rowFromBottom * BOARD_SIZE + (BOARD_SIZE - col);
            }
            
            // Alternate colors
            if ((row + col) % 2 === 0) {
                ctx.fillStyle = '#f0f0f0';
            } else {
                ctx.fillStyle = '#e0e0e0';
            }
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            
            // Draw cell border
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            
            // Draw cell number
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(cellNumber, x + CELL_SIZE / 2, y + 5);
        }
    }
    
    // Draw snakes (All Green colors)
    ctx.strokeStyle = '#2ecc71';  // Bright green snake body
    ctx.lineWidth = 5;
    for (let head in snakes) {
        const tail = snakes[head];
        const headPos = getCellPosition(parseInt(head));
        const tailPos = getCellPosition(tail);
        
        // Draw curved snake line
        ctx.beginPath();
        ctx.moveTo(headPos.x, headPos.y);
        
        // Control point for curve
        const midX = (headPos.x + tailPos.x) / 2;
        const midY = (headPos.y + tailPos.y) / 2;
        const offsetX = (headPos.y - tailPos.y) * 0.2;
        const offsetY = (tailPos.x - headPos.x) * 0.2;
        
        ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, tailPos.x, tailPos.y);
        ctx.stroke();
        
        // Draw snake head (larger circle) - Dark green
        ctx.fillStyle = '#27ae60';
        ctx.beginPath();
        ctx.arc(headPos.x, headPos.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add snake eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(headPos.x - 4, headPos.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headPos.x + 4, headPos.y - 3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Snake pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(headPos.x - 4, headPos.y - 3, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headPos.x + 4, headPos.y - 3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw snake tail - Light green
        ctx.fillStyle = '#58d68d';
        ctx.beginPath();
        ctx.arc(tailPos.x, tailPos.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text "SNAKE" near head - Green
        ctx.fillStyle = '#1e8449';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🐍', headPos.x, headPos.y - 20);
        
        // Reset stroke style for next snake
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 5;
    }
    
    // Draw ladders
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 5;
    for (let bottom in ladders) {
        const top = ladders[bottom];
        const bottomPos = getCellPosition(parseInt(bottom));
        const topPos = getCellPosition(top);
        
        // Draw ladder sides
        ctx.beginPath();
        ctx.moveTo(bottomPos.x - 8, bottomPos.y);
        ctx.lineTo(topPos.x - 8, topPos.y);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(bottomPos.x + 8, bottomPos.y);
        ctx.lineTo(topPos.x + 8, topPos.y);
        ctx.stroke();
        
        // Draw ladder rungs
        const distance = Math.sqrt(Math.pow(topPos.x - bottomPos.x, 2) + Math.pow(topPos.y - bottomPos.y, 2));
        const steps = Math.floor(distance / 20);
        
        ctx.lineWidth = 3;
        for (let i = 1; i <= steps; i++) {
            const ratio = i / (steps + 1);
            const x1 = bottomPos.x + (topPos.x - bottomPos.x) * ratio - 8;
            const y1 = bottomPos.y + (topPos.y - bottomPos.y) * ratio;
            const x2 = x1 + 16;
            const y2 = y1;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Draw text "LADDER" near top
        ctx.fillStyle = '#8B4513';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('LADDER', topPos.x, topPos.y - 15);
    }
}

// Get cell position on canvas
function getCellPosition(cellNumber) {
    // Calculate row (from bottom to top, 1-10 is bottom row)
    const row = BOARD_SIZE - 1 - Math.floor((cellNumber - 1) / BOARD_SIZE);
    
    // Calculate which row from bottom (0 = bottom row with 1-10)
    const rowFromBottom = Math.floor((cellNumber - 1) / BOARD_SIZE);
    
    // Calculate column based on snake pattern
    let col;
    if (rowFromBottom % 2 === 0) {
        // Even rows from bottom: left to right (1-10, 21-30, etc.)
        col = (cellNumber - 1) % BOARD_SIZE;
    } else {
        // Odd rows from bottom: right to left (11-20, 31-40, etc.)
        col = BOARD_SIZE - 1 - ((cellNumber - 1) % BOARD_SIZE);
    }
    
    return {
        x: col * CELL_SIZE + CELL_SIZE / 2,
        y: row * CELL_SIZE + CELL_SIZE / 2
    };
}

// Draw players
function drawPlayers() {
    // Draw player 1 (Red)
    const p1Pos = getCellPosition(player1Pos);
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(p1Pos.x - 8, p1Pos.y + 22, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Player circle
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(p1Pos.x - 8, p1Pos.y + 20, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Player number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1', p1Pos.x - 8, p1Pos.y + 20);
    
    // Draw player 2 (Blue)
    const p2Pos = getCellPosition(player2Pos);
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.arc(p2Pos.x + 8, p2Pos.y + 22, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Player circle
    ctx.fillStyle = '#0000ff';
    ctx.beginPath();
    ctx.arc(p2Pos.x + 8, p2Pos.y + 20, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Player number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2', p2Pos.x + 8, p2Pos.y + 20);
}

// Roll dice
function rollDice() {
    if (!gameActive || isRolling) return;
    
    isRolling = true;
    const rollBtn = document.getElementById('rollBtn');
    rollBtn.disabled = true;
    
    // Animate dice
    const dice = document.getElementById('dice');
    dice.classList.add('rolling');
    
    // Random dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        document.querySelector('.dice-face').textContent = randomNum;
        rollCount++;
        
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            dice.classList.remove('rolling');
            
            // Final roll
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            document.querySelector('.dice-face').textContent = finalRoll;
            
            // Move player
            setTimeout(() => {
                movePlayer(finalRoll);
            }, 500);
        }
    }, 100);
    
    totalRolls++;
    document.getElementById('totalRolls').textContent = totalRolls;
}

// Move player
function movePlayer(steps) {
    const currentPos = currentPlayer === 1 ? player1Pos : player2Pos;
    let newPos = currentPos + steps;
    
    // Check if exceeds 100
    if (newPos > 100) {
        newPos = currentPos; // Stay in place
    }
    
    // Update position
    if (currentPlayer === 1) {
        player1Pos = newPos;
    } else {
        player2Pos = newPos;
    }
    
    // Check for snakes
    if (snakes[newPos]) {
        setTimeout(() => {
            showMessage(`🐍 Snake! Sliding down from ${newPos} to ${snakes[newPos]}`);
            if (currentPlayer === 1) {
                player1Pos = snakes[newPos];
            } else {
                player2Pos = snakes[newPos];
            }
            snakesHit++;
            document.getElementById('snakesHit').textContent = snakesHit;
            updateBoard();
        }, 1000);
    }
    // Check for ladders
    else if (ladders[newPos]) {
        setTimeout(() => {
            showMessage(`🪜 Ladder! Climbing up from ${newPos} to ${ladders[newPos]}`);
            if (currentPlayer === 1) {
                player1Pos = ladders[newPos];
            } else {
                player2Pos = ladders[newPos];
            }
            laddersClimbed++;
            document.getElementById('laddersClimbed').textContent = laddersClimbed;
            updateBoard();
        }, 1000);
    }
    
    // Update board
    updateBoard();
    
    // Check for winner
    if (newPos === 100 || (snakes[newPos] && snakes[newPos] === 100) || (ladders[newPos] && ladders[newPos] === 100)) {
        setTimeout(() => {
            endGame();
        }, 2000);
        return;
    }
    
    // Switch player
    setTimeout(() => {
        switchPlayer();
    }, 2000);
}

// Update board display
function updateBoard() {
    drawBoard();
    drawPlayers();
    
    // Update position displays
    document.getElementById('player1Pos').textContent = player1Pos;
    document.getElementById('player2Pos').textContent = player2Pos;
}

// Switch player turn
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerTurn();
    
    isRolling = false;
    document.getElementById('rollBtn').disabled = false;
    
    // AI turn
    if (vsAI && currentPlayer === 2 && gameActive) {
        setTimeout(() => {
            rollDice();
        }, 1000);
    }
}

// Update player turn display
function updatePlayerTurn() {
    const player1Info = document.getElementById('player1Info');
    const player2Info = document.getElementById('player2Info');
    
    if (currentPlayer === 1) {
        player1Info.classList.add('active');
        player2Info.classList.remove('active');
    } else {
        player1Info.classList.remove('active');
        player2Info.classList.add('active');
    }
}

// Show message
function showMessage(message) {
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 999;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.remove();
    }, 2000);
}

// End game
function endGame() {
    gameActive = false;
    
    const winnerName = currentPlayer === 1 ? 'Player 1' : (vsAI ? 'AI' : 'Player 2');
    const winnerMessage = currentPlayer === 1 ? 'Congratulations! You won!' : (vsAI ? 'AI wins! Try again!' : 'Congratulations! You won!');
    
    document.getElementById('winnerName').textContent = winnerName;
    document.getElementById('winnerMessage').textContent = winnerMessage;
    document.getElementById('winnerRolls').textContent = totalRolls;
    document.getElementById('winnerLadders').textContent = laddersClimbed;
    document.getElementById('winnerSnakes').textContent = snakesHit;
    
    document.getElementById('winnerModal').style.display = 'flex';
}

// Restart game
function restartGame() {
    player1Pos = 1;
    player2Pos = 1;
    currentPlayer = 1;
    gameActive = true;
    isRolling = false;
    totalRolls = 0;
    laddersClimbed = 0;
    snakesHit = 0;
    
    document.getElementById('totalRolls').textContent = 0;
    document.getElementById('laddersClimbed').textContent = 0;
    document.getElementById('snakesHit').textContent = 0;
    document.querySelector('.dice-face').textContent = '?';
    document.getElementById('rollBtn').disabled = false;
    document.getElementById('winnerModal').style.display = 'none';
    
    updateBoard();
    updatePlayerTurn();
}

// Change mode
function changeMode() {
    window.location.href = 'to_choose/to_choose.html';
}

// Go back to main menu
function goBack() {
    window.location.href = '../main_menu.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

console.log('Snakes and Ladders initialized');
