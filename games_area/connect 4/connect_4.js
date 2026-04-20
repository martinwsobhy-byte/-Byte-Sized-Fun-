// Connect 4 Game
console.log('Connect 4 game loaded');

// Game variables
let vsAI = true;
let currentPlayer = 1; // 1 = Red, 2 = Yellow
let gameActive = true;
let board = [];
const ROWS = 6;
const COLS = 7;
let aiDifficulty = 'medium'; // easy, medium, impossible

// Game stats
let totalMoves = 0;
let player1Wins = 0;
let player2Wins = 0;

// Initialize game
function initGame() {
    console.log('Initializing Connect 4...');
    
    // Get game mode from localStorage
    const gameMode = localStorage.getItem('connect4GameMode') || 'single';
    vsAI = localStorage.getItem('connect4VsAI') === 'true';
    aiDifficulty = localStorage.getItem('connect4Difficulty') || 'medium';
    
    // Update UI
    const difficultyText = vsAI ? ` (${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)})` : '';
    document.getElementById('gameMode').textContent = vsAI ? `vs AI${difficultyText}` : 'vs Player';
    document.getElementById('player2Name').textContent = vsAI ? 'AI' : 'Player 2';
    
    // Initialize board array
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    
    // Create board UI
    createBoard();
    
    // Set player 1 as active
    updatePlayerTurn();
    
    console.log('Connect 4 initialized with difficulty:', aiDifficulty);
}

// Create board UI
function createBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    // Create columns
    for (let col = 0; col < COLS; col++) {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.col = col;
        
        // Add click handler
        column.addEventListener('click', () => handleColumnClick(col));
        
        // Create cells in column (from top to bottom: row 0 to row 5)
        for (let row = 0; row < ROWS; row++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            column.appendChild(cell);
        }
        
        boardElement.appendChild(column);
    }
}

// Handle column click
function handleColumnClick(col) {
    if (!gameActive) return;
    if (vsAI && currentPlayer === 2) return; // Don't allow clicks during AI turn
    
    makeMove(col);
}

// Make a move
function makeMove(col) {
    // Find lowest empty row in column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            row = r;
            break;
        }
    }
    
    // Column is full
    if (row === -1) {
        showMessage('Column is full! Choose another column.');
        return;
    }
    
    // Place disc
    board[row][col] = currentPlayer;
    totalMoves++;
    document.getElementById('totalMoves').textContent = totalMoves;
    
    // Update UI
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add(currentPlayer === 1 ? 'red' : 'yellow');
    
    // Check for win
    if (checkWin(row, col)) {
        setTimeout(() => {
            endGame(currentPlayer);
        }, 1000);
        return;
    }
    
    // Check for draw
    if (totalMoves === ROWS * COLS) {
        setTimeout(() => {
            showMessage('Game is a draw!');
            setTimeout(() => restartGame(), 2000);
        }, 500);
        return;
    }
    
    // Switch player
    switchPlayer();
}

// Check for win
function checkWin(row, col) {
    const player = board[row][col];
    
    // Check horizontal
    if (checkDirection(row, col, 0, 1, player) || 
        checkDirection(row, col, 0, -1, player)) {
        return true;
    }
    
    // Check vertical
    if (checkDirection(row, col, 1, 0, player) || 
        checkDirection(row, col, -1, 0, player)) {
        return true;
    }
    
    // Check diagonal (top-left to bottom-right)
    if (checkDirection(row, col, 1, 1, player) || 
        checkDirection(row, col, -1, -1, player)) {
        return true;
    }
    
    // Check diagonal (top-right to bottom-left)
    if (checkDirection(row, col, 1, -1, player) || 
        checkDirection(row, col, -1, 1, player)) {
        return true;
    }
    
    return false;
}

// Check direction for 4 in a row
function checkDirection(row, col, rowDir, colDir, player) {
    let count = 1; // Count the current disc
    const winningCells = [[row, col]];
    
    // Check in positive direction
    let r = row + rowDir;
    let c = col + colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        winningCells.push([r, c]);
        r += rowDir;
        c += colDir;
    }
    
    // Check in negative direction
    r = row - rowDir;
    c = col - colDir;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        winningCells.push([r, c]);
        r -= rowDir;
        c -= colDir;
    }
    
    // If 4 or more in a row, highlight winning cells
    if (count >= 4) {
        winningCells.forEach(([r, c]) => {
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
            cell.classList.add('winning');
        });
        return true;
    }
    
    return false;
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerTurn();
    
    // AI turn
    if (vsAI && currentPlayer === 2 && gameActive) {
        setTimeout(() => {
            makeAIMove();
        }, 800);
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

// AI move logic
function makeAIMove() {
    if (!gameActive) return;
    
    let col;
    
    switch(aiDifficulty) {
        case 'easy':
            col = makeEasyMove();
            break;
        case 'medium':
            col = makeMediumMove();
            break;
        case 'impossible':
            col = makeImpossibleMove();
            break;
        default:
            col = makeMediumMove();
    }
    
    if (col !== -1) {
        makeMove(col);
    }
}

// Easy AI - mostly random with occasional blocking
function makeEasyMove() {
    // 30% chance to block player
    if (Math.random() < 0.3) {
        for (let col = 0; col < COLS; col++) {
            if (canWin(col, 1)) {
                return col;
            }
        }
    }
    
    // Random move
    const availableCols = [];
    for (let col = 0; col < COLS; col++) {
        if (isColumnAvailable(col)) {
            availableCols.push(col);
        }
    }
    
    if (availableCols.length > 0) {
        return availableCols[Math.floor(Math.random() * availableCols.length)];
    }
    
    return -1;
}

// Medium AI - strategic but not perfect
function makeMediumMove() {
    // Try to win
    for (let col = 0; col < COLS; col++) {
        if (canWin(col, 2)) {
            return col;
        }
    }
    
    // Block player from winning
    for (let col = 0; col < COLS; col++) {
        if (canWin(col, 1)) {
            return col;
        }
    }
    
    // Prefer center columns
    const centerCols = [3, 2, 4, 1, 5, 0, 6];
    for (let col of centerCols) {
        if (isColumnAvailable(col)) {
            return col;
        }
    }
    
    return -1;
}

// Impossible AI - uses minimax algorithm
function makeImpossibleMove() {
    let bestScore = -Infinity;
    let bestCol = -1;
    
    // Try each column
    for (let col = 0; col < COLS; col++) {
        if (!isColumnAvailable(col)) continue;
        
        // Find row
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                row = r;
                break;
            }
        }
        
        if (row === -1) continue;
        
        // Make move
        board[row][col] = 2;
        
        // Evaluate
        let score = minimax(board, 4, false, -Infinity, Infinity);
        
        // Undo move
        board[row][col] = 0;
        
        if (score > bestScore) {
            bestScore = score;
            bestCol = col;
        }
    }
    
    return bestCol;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, isMaximizing, alpha, beta) {
    // Check terminal states
    const winner = checkBoardWinner();
    if (winner === 2) return 1000;
    if (winner === 1) return -1000;
    if (isBoardFull() || depth === 0) return evaluateBoard();
    
    if (isMaximizing) {
        let maxScore = -Infinity;
        for (let col = 0; col < COLS; col++) {
            if (!isColumnAvailable(col)) continue;
            
            let row = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r][col] === 0) {
                    row = r;
                    break;
                }
            }
            
            if (row === -1) continue;
            
            board[row][col] = 2;
            let score = minimax(board, depth - 1, false, alpha, beta);
            board[row][col] = 0;
            
            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxScore;
    } else {
        let minScore = Infinity;
        for (let col = 0; col < COLS; col++) {
            if (!isColumnAvailable(col)) continue;
            
            let row = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r][col] === 0) {
                    row = r;
                    break;
                }
            }
            
            if (row === -1) continue;
            
            board[row][col] = 1;
            let score = minimax(board, depth - 1, true, alpha, beta);
            board[row][col] = 0;
            
            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minScore;
    }
}

// Evaluate board position
function evaluateBoard() {
    let score = 0;
    
    // Center column preference
    for (let row = 0; row < ROWS; row++) {
        if (board[row][3] === 2) score += 3;
        if (board[row][3] === 1) score -= 3;
    }
    
    // Check all possible 4-in-a-row positions
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            // Horizontal
            if (col <= COLS - 4) {
                score += evaluateWindow([board[row][col], board[row][col+1], board[row][col+2], board[row][col+3]]);
            }
            // Vertical
            if (row <= ROWS - 4) {
                score += evaluateWindow([board[row][col], board[row+1][col], board[row+2][col], board[row+3][col]]);
            }
            // Diagonal /
            if (row <= ROWS - 4 && col <= COLS - 4) {
                score += evaluateWindow([board[row][col], board[row+1][col+1], board[row+2][col+2], board[row+3][col+3]]);
            }
            // Diagonal \
            if (row >= 3 && col <= COLS - 4) {
                score += evaluateWindow([board[row][col], board[row-1][col+1], board[row-2][col+2], board[row-3][col+3]]);
            }
        }
    }
    
    return score;
}

// Evaluate a window of 4 cells
function evaluateWindow(window) {
    let score = 0;
    let ai = 0, player = 0, empty = 0;
    
    for (let cell of window) {
        if (cell === 2) ai++;
        else if (cell === 1) player++;
        else empty++;
    }
    
    if (ai === 4) score += 100;
    else if (ai === 3 && empty === 1) score += 5;
    else if (ai === 2 && empty === 2) score += 2;
    
    if (player === 4) score -= 100;
    else if (player === 3 && empty === 1) score -= 4;
    
    return score;
}

// Check if board is full
function isBoardFull() {
    for (let col = 0; col < COLS; col++) {
        if (board[0][col] === 0) return false;
    }
    return true;
}

// Check board winner without UI
function checkBoardWinner() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] === 0) continue;
            
            const player = board[row][col];
            
            // Check horizontal
            if (col <= COLS - 4) {
                if (board[row][col] === player && board[row][col+1] === player && 
                    board[row][col+2] === player && board[row][col+3] === player) {
                    return player;
                }
            }
            
            // Check vertical
            if (row <= ROWS - 4) {
                if (board[row][col] === player && board[row+1][col] === player && 
                    board[row+2][col] === player && board[row+3][col] === player) {
                    return player;
                }
            }
            
            // Check diagonal /
            if (row <= ROWS - 4 && col <= COLS - 4) {
                if (board[row][col] === player && board[row+1][col+1] === player && 
                    board[row+2][col+2] === player && board[row+3][col+3] === player) {
                    return player;
                }
            }
            
            // Check diagonal \
            if (row >= 3 && col <= COLS - 4) {
                if (board[row][col] === player && board[row-1][col+1] === player && 
                    board[row-2][col+2] === player && board[row-3][col+3] === player) {
                    return player;
                }
            }
        }
    }
    return 0;
}

// Check if a move in column would result in a win for player
function canWin(col, player) {
    // Find lowest empty row
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            row = r;
            break;
        }
    }
    
    if (row === -1) return false;
    
    // Temporarily place disc
    board[row][col] = player;
    
    // Check if this creates a win
    const wins = checkWinSimulation(row, col, player);
    
    // Remove disc
    board[row][col] = 0;
    
    return wins;
}

// Check win without modifying UI
function checkWinSimulation(row, col, player) {
    // Check horizontal
    if (countDirection(row, col, 0, 1, player) + countDirection(row, col, 0, -1, player) >= 3) return true;
    
    // Check vertical
    if (countDirection(row, col, 1, 0, player) + countDirection(row, col, -1, 0, player) >= 3) return true;
    
    // Check diagonal
    if (countDirection(row, col, 1, 1, player) + countDirection(row, col, -1, -1, player) >= 3) return true;
    if (countDirection(row, col, 1, -1, player) + countDirection(row, col, -1, 1, player) >= 3) return true;
    
    return false;
}

// Count consecutive discs in a direction
function countDirection(row, col, rowDir, colDir, player) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;
    
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r += rowDir;
        c += colDir;
    }
    
    return count;
}

// Check if column has space
function isColumnAvailable(col) {
    return board[0][col] === 0;
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
    }, 1500);
}

// End game
function endGame(winner) {
    gameActive = false;
    
    const winnerName = winner === 1 ? 'Player 1' : (vsAI ? 'AI' : 'Player 2');
    const winnerMessage = winner === 1 ? 'Congratulations! You won!' : (vsAI ? 'AI wins! Try again!' : 'Congratulations! You won!');
    
    // Update wins
    if (winner === 1) {
        player1Wins++;
        document.getElementById('player1Wins').textContent = player1Wins;
    } else {
        player2Wins++;
        document.getElementById('player2Wins').textContent = player2Wins;
    }
    
    // Show winner modal
    document.getElementById('winnerName').textContent = winnerName;
    document.getElementById('winnerMessage').textContent = winnerMessage;
    document.getElementById('winnerMoves').textContent = totalMoves;
    
    // Set winner disc color
    const winnerDisc = document.getElementById('winnerDisc');
    if (winner === 1) {
        winnerDisc.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a6f)';
    } else {
        winnerDisc.style.background = 'linear-gradient(135deg, #ffd93d, #f6c23e)';
    }
    
    document.getElementById('winnerModal').style.display = 'flex';
}

// Restart game
function restartGame() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    currentPlayer = 1;
    gameActive = true;
    totalMoves = 0;
    
    document.getElementById('totalMoves').textContent = 0;
    document.getElementById('winnerModal').style.display = 'none';
    
    createBoard();
    updatePlayerTurn();
}

// Change mode
function changeMode() {
    window.location.href = 'choose_to/choose_to.html';
}

// Go back to main menu
function goBack() {
    window.location.href = '../main_menu.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

console.log('Connect 4 game initialized');
