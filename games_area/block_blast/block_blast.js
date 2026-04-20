// Block Blast Game
console.log('Block Blast game loaded');

// Game variables
let board = [];
let score = 0;
let linesCleared = 0;
let level = 1;
let gameOver = false;
let isPaused = false;
let selectedPiece = null;
let currentPieces = [];

// Game constants
const BOARD_SIZE = 8;
const PIECES_COUNT = 3;

// Piece shapes - different Tetris-like pieces
const PIECE_SHAPES = [
    // Single block
    [[1]],
    
    // 2x1 horizontal
    [[1, 1]],
    
    // 2x1 vertical
    [[1], [1]],
    
    // 3x1 horizontal
    [[1, 1, 1]],
    
    // 3x1 vertical
    [[1], [1], [1]],
    
    // L-shape
    [[1, 0], [1, 0], [1, 1]],
    
    // Reverse L-shape
    [[0, 1], [0, 1], [1, 1]],
    
    // T-shape
    [[1, 1, 1], [0, 1, 0]],
    
    // Square 2x2
    [[1, 1], [1, 1]],
    
    // Square 3x3 (removed for 8x8 board)
    // [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    
    // Z-shape
    [[1, 1, 0], [0, 1, 1]],
    
    // Reverse Z-shape
    [[0, 1, 1], [1, 1, 0]],
    
    // Plus shape
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    
    // Corner shape
    [[1, 0, 0], [1, 1, 1]],
    
    // 4x1 horizontal
    [[1, 1, 1, 1]],
    
    // 4x1 vertical
    [[1], [1], [1], [1]],
    
    // Big L
    [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
    
    // Big T
    [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
    
    // 5x1 pieces (removed for 8x8 board)
    // [[1, 1, 1, 1, 1]],
    // [[1], [1], [1], [1], [1]],
    
    // Small cross
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
    
    // Diagonal line
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
];

// Initialize game
function initGame() {
    console.log('Initializing Block Blast game...');
    
    // Initialize board
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    
    // Reset game state
    score = 0;
    linesCleared = 0;
    level = 1;
    gameOver = false;
    isPaused = false;
    selectedPiece = null;
    
    // Create board
    createBoard();
    
    // Generate initial pieces
    generateNewPieces();
    
    // Update display
    updateDisplay();
    
    console.log('Block Blast game initialized');
}

// Create the game board
function createBoard() {
    const boardElement = document.getElementById('gameBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add click event for placing pieces
            cell.addEventListener('click', () => handleCellClick(row, col));
            cell.addEventListener('mouseenter', () => handleCellHover(row, col));
            cell.addEventListener('mouseleave', () => clearPreview());
            
            boardElement.appendChild(cell);
        }
    }
}

// Generate new pieces
function generateNewPieces() {
    currentPieces = [];
    
    for (let i = 0; i < PIECES_COUNT; i++) {
        const randomShape = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
        currentPieces.push({
            shape: randomShape,
            used: false,
            id: i
        });
    }
    
    renderPieces();
}

// Render pieces in the preview area
function renderPieces() {
    for (let i = 0; i < PIECES_COUNT; i++) {
        const piece = currentPieces[i];
        const pieceGrid = document.getElementById(`pieceGrid${i + 1}`);
        const piecePreview = document.getElementById(`piece${i + 1}`);
        
        if (piece.used) {
            piecePreview.classList.add('used');
            pieceGrid.innerHTML = '';
            continue;
        } else {
            piecePreview.classList.remove('used');
        }
        
        // Set grid dimensions
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;
        pieceGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        pieceGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        
        // Clear and populate grid
        pieceGrid.innerHTML = '';
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'piece-cell';
                
                if (piece.shape[row][col] === 1) {
                    cell.classList.add('filled');
                } else {
                    cell.classList.add('empty');
                }
                
                pieceGrid.appendChild(cell);
            }
        }
        
        // Add click event to select piece
        piecePreview.onclick = () => selectPiece(i);
    }
}

// Select a piece
function selectPiece(pieceIndex) {
    if (currentPieces[pieceIndex].used) return;
    
    // Clear previous selection
    document.querySelectorAll('.piece-preview').forEach(p => p.classList.remove('selected'));
    
    // Select new piece
    selectedPiece = pieceIndex;
    document.getElementById(`piece${pieceIndex + 1}`).classList.add('selected');
    
    clearPreview();
}

// Handle cell click
function handleCellClick(row, col) {
    if (gameOver || isPaused || selectedPiece === null) return;
    
    const piece = currentPieces[selectedPiece];
    if (piece.used) return;
    
    if (canPlacePiece(piece.shape, row, col)) {
        placePiece(piece.shape, row, col);
        piece.used = true;
        
        // Play place sound
        playSound('place');
        
        // Clear selection
        selectedPiece = null;
        document.querySelectorAll('.piece-preview').forEach(p => p.classList.remove('selected'));
        
        // Update display
        renderBoard();
        renderPieces();
        
        // Check for completed lines
        checkAndClearLines();
        
        // Check if all pieces are used
        if (currentPieces.every(p => p.used)) {
            generateNewPieces();
        }
        
        // Check game over
        if (isGameOver()) {
            endGame();
        }
        
        updateDisplay();
    }
}

// Handle cell hover for preview
function handleCellHover(row, col) {
    if (gameOver || isPaused || selectedPiece === null) return;
    
    const piece = currentPieces[selectedPiece];
    if (piece.used) return;
    
    clearPreview();
    showPreview(piece.shape, row, col);
}

// Show piece preview
function showPreview(shape, startRow, startCol) {
    const canPlace = canPlacePiece(shape, startRow, startCol);
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col] === 1) {
                const boardRow = startRow + row;
                const boardCol = startCol + col;
                
                if (boardRow >= 0 && boardRow < BOARD_SIZE && boardCol >= 0 && boardCol < BOARD_SIZE) {
                    const cell = document.querySelector(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                    if (cell) {
                        if (canPlace) {
                            cell.classList.add('preview');
                        } else {
                            cell.classList.add('invalid');
                        }
                    }
                }
            }
        }
    }
}

// Clear preview
function clearPreview() {
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.classList.remove('preview', 'invalid');
    });
}

// Check if piece can be placed
function canPlacePiece(shape, startRow, startCol) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col] === 1) {
                const boardRow = startRow + row;
                const boardCol = startCol + col;
                
                // Check bounds
                if (boardRow < 0 || boardRow >= BOARD_SIZE || boardCol < 0 || boardCol >= BOARD_SIZE) {
                    return false;
                }
                
                // Check if cell is already filled
                if (board[boardRow][boardCol] === 1) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Place piece on board
function placePiece(shape, startRow, startCol) {
    let blocksPlaced = 0;
    
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col] === 1) {
                const boardRow = startRow + row;
                const boardCol = startCol + col;
                board[boardRow][boardCol] = 1;
                blocksPlaced++;
            }
        }
    }
    
    // Add score for placing piece
    score += blocksPlaced * 10;
}

// Render board
function renderBoard() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (board[row][col] === 1) {
                cell.classList.add('filled');
            } else {
                cell.classList.remove('filled');
            }
        }
    }
}

// Check and clear completed lines
function checkAndClearLines() {
    const linesToClear = [];
    
    // Check rows
    for (let row = 0; row < BOARD_SIZE; row++) {
        if (board[row].every(cell => cell === 1)) {
            linesToClear.push({ type: 'row', index: row });
        }
    }
    
    // Check columns
    for (let col = 0; col < BOARD_SIZE; col++) {
        let columnFull = true;
        for (let row = 0; row < BOARD_SIZE; row++) {
            if (board[row][col] === 0) {
                columnFull = false;
                break;
            }
        }
        if (columnFull) {
            linesToClear.push({ type: 'col', index: col });
        }
    }
    
    if (linesToClear.length > 0) {
        clearLines(linesToClear);
    }
}

// Clear completed lines
function clearLines(lines) {
    // Play clear sound
    playSound('clear');
    
    // Add clearing animation and particle effects
    lines.forEach(line => {
        if (line.type === 'row') {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = document.querySelector(`[data-row="${line.index}"][data-col="${col}"]`);
                cell.classList.add('clearing');
                // Add particle effect
                setTimeout(() => createParticleEffect(line.index, col), Math.random() * 200);
            }
        } else {
            for (let row = 0; row < BOARD_SIZE; row++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${line.index}"]`);
                cell.classList.add('clearing');
                // Add particle effect
                setTimeout(() => createParticleEffect(row, line.index), Math.random() * 200);
            }
        }
    });
    
    // Clear lines after animation
    setTimeout(() => {
        lines.forEach(line => {
            if (line.type === 'row') {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    board[line.index][col] = 0;
                }
            } else {
                for (let row = 0; row < BOARD_SIZE; row++) {
                    board[row][line.index] = 0;
                }
            }
        });
        
        // Update score with combo bonus
        const linesCount = lines.length;
        linesCleared += linesCount;
        let lineScore = linesCount * 100 * level;
        
        // Combo bonus for multiple lines
        if (linesCount > 1) {
            lineScore *= linesCount; // Double, triple, etc. bonus
        }
        
        score += lineScore;
        
        // Update level (faster progression for 8x8 board)
        level = Math.floor(linesCleared / 8) + 1;
        
        // Remove clearing animation and render board
        document.querySelectorAll('.clearing').forEach(cell => {
            cell.classList.remove('clearing');
        });
        
        renderBoard();
        updateDisplay();
        
        // Show score popup
        showScorePopup(lineScore, linesCount);
    }, 500);
}

// Show score popup
function showScorePopup(points, linesCount) {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #f39c12, #e67e22);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: bold;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: scorePopup 2s ease-out forwards;
        pointer-events: none;
    `;
    
    let message = `+${points} points!`;
    if (linesCount > 1) {
        message = `${linesCount} LINES! +${points} points!`;
    }
    
    popup.textContent = message;
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// Add CSS for score popup animation
const scorePopupStyle = document.createElement('style');
scorePopupStyle.textContent = `
    @keyframes scorePopup {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
        }
    }
`;
document.head.appendChild(scorePopupStyle);

// Check if game is over
function isGameOver() {
    // Check if any remaining piece can be placed anywhere on the board
    for (let piece of currentPieces) {
        if (!piece.used) {
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (canPlacePiece(piece.shape, row, col)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

// Add keyboard controls
document.addEventListener('keydown', function(event) {
    if (gameOver || isPaused) return;
    
    switch(event.key) {
        case '1':
            selectPiece(0);
            break;
        case '2':
            selectPiece(1);
            break;
        case '3':
            selectPiece(2);
            break;
        case 'Escape':
            selectedPiece = null;
            document.querySelectorAll('.piece-preview').forEach(p => p.classList.remove('selected'));
            clearPreview();
            break;
        case ' ':
            event.preventDefault();
            togglePause();
            break;
        case 'r':
        case 'R':
            if (event.ctrlKey) {
                event.preventDefault();
                restartGame();
            }
            break;
        case 'h':
        case 'H':
            showHint();
            break;
    }
});

// Show hint for possible moves
function showHint() {
    if (gameOver || isPaused) return;
    
    // Find first available piece and show where it can be placed
    for (let pieceIndex = 0; pieceIndex < currentPieces.length; pieceIndex++) {
        const piece = currentPieces[pieceIndex];
        if (!piece.used) {
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (canPlacePiece(piece.shape, row, col)) {
                        // Highlight this position briefly
                        showHintAt(piece.shape, row, col);
                        selectPiece(pieceIndex);
                        return;
                    }
                }
            }
        }
    }
}

// Show hint at specific position
function showHintAt(shape, startRow, startCol) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[0].length; col++) {
            if (shape[row][col] === 1) {
                const boardRow = startRow + row;
                const boardCol = startCol + col;
                
                if (boardRow >= 0 && boardRow < BOARD_SIZE && boardCol >= 0 && boardCol < BOARD_SIZE) {
                    const cell = document.querySelector(`[data-row="${boardRow}"][data-col="${boardCol}"]`);
                    if (cell) {
                        cell.style.animation = 'hintPulse 1s ease-in-out 3';
                    }
                }
            }
        }
    }
}

// Add CSS for hint animation
const hintStyle = document.createElement('style');
hintStyle.textContent = `
    @keyframes hintPulse {
        0%, 100% { 
            background-color: #ecf0f1;
            transform: scale(1);
        }
        50% { 
            background-color: #f39c12;
            transform: scale(1.1);
        }
    }
`;
document.head.appendChild(hintStyle);

// Add touch support for mobile
function addTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Reset values
        touchStartX = 0;
        touchStartY = 0;
    });
}

// Add sound effects (placeholder functions)
function playSound(soundType) {
    // Placeholder for sound effects
    // You can add actual sound files later
    switch(soundType) {
        case 'place':
            console.log('🔊 Place sound');
            break;
        case 'clear':
            console.log('🔊 Clear sound');
            break;
        case 'gameOver':
            console.log('🔊 Game over sound');
            break;
    }
}

// Add particle effects for line clearing
function createParticleEffect(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    
    const rect = cell.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width/2}px;
        top: ${rect.top + rect.height/2}px;
        width: 4px;
        height: 4px;
        background: #f39c12;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: particleFloat 1s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Update display
function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('lines').textContent = linesCleared;
    document.getElementById('level').textContent = level;
}

// End game
function endGame() {
    gameOver = true;
    
    // Play game over sound
    playSound('gameOver');
    
    // Save score to localStorage
    saveScore();
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLines').textContent = linesCleared;
    document.getElementById('finalLevel').textContent = level;
    
    document.getElementById('gameOverModal').style.display = 'flex';
}

// Save score to localStorage
function saveScore() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const gameScores = JSON.parse(localStorage.getItem('gameScores')) || [];
    
    const newScore = {
        username: currentUser.username,
        game: 'Block Blast',
        score: score,
        lines: linesCleared,
        level: level,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    gameScores.push(newScore);
    localStorage.setItem('gameScores', JSON.stringify(gameScores));
    
    console.log('Score saved:', newScore);
}

// Restart game
function restartGame() {
    document.getElementById('gameOverModal').style.display = 'none';
    initGame();
}

// Toggle pause
function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        pauseBtn.textContent = '▶️ Resume';
        pauseBtn.classList.add('resume');
    } else {
        pauseBtn.textContent = '⏸️ Pause';
        pauseBtn.classList.remove('resume');
    }
}

// Go to menu
function goToMenu() {
    window.location.href = '../main_menu.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    addTouchSupport();
});

console.log('Block Blast game initialized');