// X and O Game - Main Logic
console.log('X and O Game loaded');

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let vsAI = true;
let aiDifficulty = 'medium';
let gameStats = {
    gamesPlayed: 0,
    xWins: 0,
    oWins: 0,
    ties: 0
};

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

// Initialize game
function initGame() {
    // Get game mode from localStorage
    const gameMode = localStorage.getItem('gameMode') || 'single';
    vsAI = localStorage.getItem('vsAI') === 'true';
    aiDifficulty = localStorage.getItem('aiDifficulty') || 'medium';
    
    // Update UI
    const difficultyText = vsAI ? `vs AI (${aiDifficulty.charAt(0).toUpperCase() + aiDifficulty.slice(1)})` : 'vs Player';
    document.getElementById('gameMode').textContent = difficultyText;
    updateGameInfo();
    
    // Load stats from localStorage
    loadGameStats();
    
    // Add event listeners to cells
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
    
    console.log(`Game initialized - Mode: ${vsAI ? 'vs AI' : 'vs Player'}, Difficulty: ${aiDifficulty}`);
}

// Handle cell click
function handleCellClick(index) {
    if (!gameActive || board[index] !== '' || (vsAI && currentPlayer === 'O')) {
        return;
    }
    
    makeMove(index, currentPlayer);
    
    if (gameActive && vsAI && currentPlayer === 'O') {
        // AI turn with difficulty-based thinking time
        const thinkingTimes = {
            easy: 300,
            medium: 500, 
            hard: 800,
            expert: 1200
        };
        
        const thinkingTime = thinkingTimes[aiDifficulty] || 500;
        
        setTimeout(() => {
            makeAIMove();
        }, thinkingTime);
    }
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    // Check for win or tie
    if (checkWin()) {
        endGame(`Player ${player} wins!`);
        gameStats[player.toLowerCase() + 'Wins']++;
        highlightWinningCells();
    } else if (board.every(cell => cell !== '')) {
        endGame("It's a tie!");
        gameStats.ties++;
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateGameInfo();
        
        if (vsAI && currentPlayer === 'O') {
            showAIThinking();
        }
    }
}

// AI Move using difficulty-based algorithm
function makeAIMove() {
    hideAIThinking();
    
    const move = getAIMoveByDifficulty();
    if (move !== -1) {
        makeMove(move, 'O');
    }
}

// Get AI move based on difficulty level
function getAIMoveByDifficulty() {
    const difficultySettings = {
        easy: { optimalChance: 0.5, thinkingTime: 300 },
        medium: { optimalChance: 0.7, thinkingTime: 500 },
        hard: { optimalChance: 0.9, thinkingTime: 800 },
        expert: { optimalChance: 1.0, thinkingTime: 1000 }
    };
    
    const settings = difficultySettings[aiDifficulty] || difficultySettings.medium;
    
    // Decide whether to make optimal move or random move
    if (Math.random() < settings.optimalChance) {
        // Make optimal move using minimax
        return getBestMove();
    } else {
        // Make random move (but still block immediate wins)
        return getRandomMove();
    }
}

// Get random move (with basic blocking for medium+ difficulties)
function getRandomMove() {
    // For medium+ difficulties, always block immediate player wins
    if (aiDifficulty !== 'easy') {
        const blockMove = findBlockingMove();
        if (blockMove !== -1) {
            return blockMove;
        }
    }
    
    // Get available moves
    const availableMoves = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            availableMoves.push(i);
        }
    }
    
    // Return random available move
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    return -1;
}

// Find move to block immediate player win
function findBlockingMove() {
    // Check if player can win on next move and block it
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X'; // Simulate player move
            if (checkWinForMinimax() === 'X') {
                board[i] = ''; // Reset
                return i; // Block this move
            }
            board[i] = ''; // Reset
        }
    }
    return -1;
}

// Get best move for AI using Minimax
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    const winner = checkWinForMinimax();
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(cell => cell !== '')) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check win for minimax (returns winner or null)
function checkWinForMinimax() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Check for win
function checkWin() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

// Highlight winning cells
function highlightWinningCells() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.querySelector(`[data-index="${a}"]`).classList.add('winning');
            document.querySelector(`[data-index="${b}"]`).classList.add('winning');
            document.querySelector(`[data-index="${c}"]`).classList.add('winning');
            break;
        }
    }
}

// End game
function endGame(message) {
    gameActive = false;
    gameStats.gamesPlayed++;
    saveGameStats();
    
    setTimeout(() => {
        showGameModal(message);
    }, 1000);
}

// Show game modal
function showGameModal(message) {
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('gamesPlayed').textContent = gameStats.gamesPlayed;
    document.getElementById('xWins').textContent = gameStats.xWins;
    document.getElementById('oWins').textContent = gameStats.oWins;
    document.getElementById('ties').textContent = gameStats.ties;
    document.getElementById('gameModal').style.display = 'flex';
}

// Hide game modal
function hideGameModal() {
    document.getElementById('gameModal').style.display = 'none';
}

// Show AI thinking
function showAIThinking() {
    document.getElementById('statusMessage').textContent = '';
    document.getElementById('aiThinking').style.display = 'flex';
    
    // Disable all cells during AI thinking
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.add('disabled');
    });
}

// Hide AI thinking
function hideAIThinking() {
    document.getElementById('aiThinking').style.display = 'none';
    updateGameInfo();
    
    // Re-enable cells
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('disabled');
    });
}

// Update game info
function updateGameInfo() {
    document.getElementById('currentPlayer').textContent = currentPlayer;
    document.getElementById('score').textContent = `X: ${gameStats.xWins} | O: ${gameStats.oWins}`;
    
    if (gameActive) {
        if (vsAI && currentPlayer === 'O') {
            const difficultyEmojis = {
                easy: '😊',
                medium: '🙂', 
                hard: '😤',
                expert: '🤯'
            };
            const emoji = difficultyEmojis[aiDifficulty] || '🤖';
            document.getElementById('statusMessage').textContent = `${emoji} AI's turn (${aiDifficulty})`;
        } else {
            document.getElementById('statusMessage').textContent = `Player ${currentPlayer}'s turn`;
        }
    }
}

// Reset game
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    // Clear board
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    hideGameModal();
    hideAIThinking();
    updateGameInfo();
    
    console.log('Game reset');
}

// Play again
function playAgain() {
    resetGame();
}

// Change mode
function changeMode() {
    if (vsAI) {
        // Go back to difficulty selection if currently playing vs AI
        window.location.href = 'Levels_AI/Levels_AI.html';
    } else {
        // Go back to mode selection if playing multiplayer
        window.location.href = 'olly_one_or_two/olly_one_or_two.html';
    }
}

// Go back to games menu
function goBack() {
    window.location.href = '../main_menu.html';
}

// Save game stats to localStorage
function saveGameStats() {
    localStorage.setItem('xoGameStats', JSON.stringify(gameStats));
}

// Load game stats from localStorage
function loadGameStats() {
    const savedStats = localStorage.getItem('xoGameStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
    }
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (!gameActive) return;
    
    const keyMap = {
        '1': 0, '2': 1, '3': 2,
        '4': 3, '5': 4, '6': 5,
        '7': 6, '8': 7, '9': 8
    };
    
    if (keyMap.hasOwnProperty(e.key)) {
        handleCellClick(keyMap[e.key]);
    }
    
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
    
    if (e.key === 'Escape') {
        if (document.getElementById('gameModal').style.display === 'flex') {
            hideGameModal();
        } else {
            goBack();
        }
    }
});

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    
    // Add click outside modal to close
    document.getElementById('gameModal').addEventListener('click', function(e) {
        if (e.target === this) {
            hideGameModal();
        }
    });
});

// Export functions for C++ integration (if needed)
window.gameAPI = {
    makeMove: makeMove,
    resetGame: resetGame,
    getCurrentPlayer: () => currentPlayer,
    getBoard: () => board,
    isGameActive: () => gameActive
};