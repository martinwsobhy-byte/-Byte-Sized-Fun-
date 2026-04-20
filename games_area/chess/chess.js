// Chess Game
console.log('Chess game loaded');

// Game variables
let board = [];
let currentTurn = 'white';
let selectedSquare = null;
let validMoves = [];
let moveHistory = [];
let capturedPieces = { white: [], black: [] };
let gameMode = 'ai';
let aiDifficulty = 'medium';
let playerColor = 'white';
let gameOver = false;
let moveCount = 0;
let gameTime = 0;
let timeInterval;

// Player timers (for Player vs Player mode)
let timeControl = 'unlimited'; // '3', '10', '20', or 'unlimited'
let whiteTime = 0; // in seconds
let blackTime = 0; // in seconds
let playerTimerInterval = null;

// Castling tracking
let castlingRights = {
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookKingsideMoved: false,
    whiteRookQueensideMoved: false,
    blackRookKingsideMoved: false,
    blackRookQueensideMoved: false
};

// Piece values for AI
const pieceValues = {
    'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
    'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000
};

// Position values for pieces (encourages better positioning)
const pawnTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const knightTable = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const bishopTable = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const rookTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const queenTable = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const kingTable = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];

// Unicode chess pieces
const pieces = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

// Initialize game
function initGame() {
    console.log('Initializing chess game...');
    
    // Get settings from localStorage
    gameMode = localStorage.getItem('chessMode') || 'ai';
    aiDifficulty = localStorage.getItem('chessDifficulty') || 'medium';
    playerColor = localStorage.getItem('chessPlayerColor') || 'white';
    timeControl = localStorage.getItem('chessTimeControl') || 'unlimited';
    
    // Initialize player timers for Player vs Player mode
    if (gameMode === 'player' && timeControl !== 'unlimited') {
        const timeInMinutes = parseInt(timeControl);
        whiteTime = timeInMinutes * 60; // Convert to seconds
        blackTime = timeInMinutes * 60;
        startPlayerTimers();
    }
    
    // Update UI
    const modeText = gameMode === 'ai' ? `vs AI (${aiDifficulty})` : 
                    (timeControl === 'unlimited' ? 'vs Player' : `vs Player (${timeControl}min)`);
    document.getElementById('gameMode').textContent = modeText;
    
    if (gameMode === 'ai') {
        if (playerColor === 'white') {
            document.getElementById('whitePlayerName').textContent = 'You';
            document.getElementById('blackPlayerName').textContent = 'AI';
        } else {
            document.getElementById('whitePlayerName').textContent = 'AI';
            document.getElementById('blackPlayerName').textContent = 'You';
        }
        // Hide timers in AI mode
        document.getElementById('whiteTimer').style.display = 'none';
        document.getElementById('blackTimer').style.display = 'none';
    } else {
        document.getElementById('whitePlayerName').textContent = 'Player 1';
        document.getElementById('blackPlayerName').textContent = 'Player 2';
        
        // Show timers in Player vs Player mode with time control
        if (timeControl !== 'unlimited') {
            document.getElementById('whiteTimer').style.display = 'block';
            document.getElementById('blackTimer').style.display = 'block';
        } else {
            document.getElementById('whiteTimer').style.display = 'none';
            document.getElementById('blackTimer').style.display = 'none';
        }
    }
    
    // Initialize board
    setupBoard();
    renderBoard();
    updateTurnDisplay();
    
    // Start timer
    startTimer();
    
    // If AI plays white, make first move
    if (gameMode === 'ai' && playerColor === 'black') {
        setTimeout(() => makeAIMove(), 1000);
    }
    
    console.log('Chess game initialized');
}

// Setup initial board
function setupBoard() {
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
}

// Render board
function renderBoard() {
    const boardElement = document.getElementById('chessBoard');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.className += (row + col) % 2 === 0 ? ' light' : ' dark';
            square.dataset.row = row;
            square.dataset.col = col;
            
            const piece = board[row][col];
            if (piece) {
                square.textContent = pieces[piece];
            }
            
            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}

// Handle square click
function handleSquareClick(row, col) {
    if (gameOver) return;
    if (gameMode === 'ai' && currentTurn !== playerColor) return;
    
    const piece = board[row][col];
    
    // If a piece is selected
    if (selectedSquare) {
        // Try to move
        if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
            makeMove(selectedSquare.row, selectedSquare.col, row, col);
            selectedSquare = null;
            validMoves = [];
            renderBoard();
            
            // AI turn
            if (gameMode === 'ai' && !gameOver) {
                setTimeout(() => makeAIMove(), 500);
            }
        } else if (piece && getPieceColor(piece) === currentTurn) {
            // Select different piece
            selectedSquare = { row, col };
            validMoves = getValidMoves(row, col);
            highlightMoves();
        } else {
            // Deselect
            selectedSquare = null;
            validMoves = [];
            renderBoard();
        }
    } else {
        // Select piece
        if (piece && getPieceColor(piece) === currentTurn) {
            selectedSquare = { row, col };
            validMoves = getValidMoves(row, col);
            highlightMoves();
        }
    }
}

// Highlight valid moves
function highlightMoves() {
    renderBoard();
    
    if (selectedSquare) {
        const square = document.querySelector(`[data-row="${selectedSquare.row}"][data-col="${selectedSquare.col}"]`);
        square.classList.add('selected');
    }
    
    validMoves.forEach(move => {
        const square = document.querySelector(`[data-row="${move.row}"][data-col="${move.col}"]`);
        if (move.isCastling) {
            square.classList.add('castling-move');
        } else if (board[move.row][move.col]) {
            square.classList.add('capture-move');
        } else {
            square.classList.add('valid-move');
        }
    });
}

// Get valid moves for a piece (now filters out moves that leave king in check)
function getValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const pieceType = piece.toLowerCase();
    const color = getPieceColor(piece);
    
    switch(pieceType) {
        case 'p':
            moves.push(...getPawnMoves(row, col, color));
            break;
        case 'n':
            moves.push(...getKnightMoves(row, col, color));
            break;
        case 'b':
            moves.push(...getBishopMoves(row, col, color));
            break;
        case 'r':
            moves.push(...getRookMoves(row, col, color));
            break;
        case 'q':
            moves.push(...getQueenMoves(row, col, color));
            break;
        case 'k':
            moves.push(...getKingMoves(row, col, color));
            break;
    }
    
    // Filter out moves that would leave the king in check
    return moves.filter(move => {
        // Try the move
        const originalPiece = board[move.row][move.col];
        board[move.row][move.col] = piece;
        board[row][col] = '';
        
        // Check if king is still in check after this move
        const stillInCheck = isInCheck(color);
        
        // Undo the move
        board[row][col] = piece;
        board[move.row][move.col] = originalPiece;
        
        return !stillInCheck;
    });
}

// Get pawn moves
function getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;
    
    // Forward move
    if (isInBounds(row + direction, col) && !board[row + direction][col]) {
        moves.push({ row: row + direction, col });
        
        // Double move from start
        if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
        }
    }
    
    // Captures
    for (let dc of [-1, 1]) {
        const newRow = row + direction;
        const newCol = col + dc;
        if (isInBounds(newRow, newCol) && board[newRow][newCol] && 
            getPieceColor(board[newRow][newCol]) !== color) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    
    return moves;
}

// Get knight moves
function getKnightMoves(row, col, color) {
    const moves = [];
    const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (let [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isInBounds(newRow, newCol) && 
            (!board[newRow][newCol] || getPieceColor(board[newRow][newCol]) !== color)) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    
    return moves;
}

// Get bishop moves
function getBishopMoves(row, col, color) {
    return getSlidingMoves(row, col, color, [[1,1], [1,-1], [-1,1], [-1,-1]]);
}

// Get rook moves
function getRookMoves(row, col, color) {
    return getSlidingMoves(row, col, color, [[1,0], [-1,0], [0,1], [0,-1]]);
}

// Get queen moves
function getQueenMoves(row, col, color) {
    return getSlidingMoves(row, col, color, [[1,0], [-1,0], [0,1], [0,-1], [1,1], [1,-1], [-1,1], [-1,-1]]);
}

// Get sliding moves (for rook, bishop, queen)
function getSlidingMoves(row, col, color, directions) {
    const moves = [];
    
    for (let [dr, dc] of directions) {
        let newRow = row + dr;
        let newCol = col + dc;
        
        while (isInBounds(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol });
            } else {
                if (getPieceColor(board[newRow][newCol]) !== color) {
                    moves.push({ row: newRow, col: newCol });
                }
                break;
            }
            newRow += dr;
            newCol += dc;
        }
    }
    
    return moves;
}

// Get king moves
function getKingMoves(row, col, color) {
    const moves = [];
    const offsets = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    
    // Normal king moves
    for (let [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isInBounds(newRow, newCol) && 
            (!board[newRow][newCol] || getPieceColor(board[newRow][newCol]) !== color)) {
            moves.push({ row: newRow, col: newCol });
        }
    }
    
    // Castling moves
    const castlingMoves = getCastlingMoves(row, col, color);
    moves.push(...castlingMoves);
    
    return moves;
}

// Get castling moves for the king
function getCastlingMoves(row, col, color) {
    const moves = [];
    
    // Can't castle if king has moved or is in check
    if (isSquareUnderAttack(row, col, color)) return moves;
    
    const kingMoved = color === 'white' ? castlingRights.whiteKingMoved : castlingRights.blackKingMoved;
    if (kingMoved) return moves;
    
    const backRank = color === 'white' ? 7 : 0;
    if (row !== backRank || col !== 4) return moves; // King must be on starting position
    
    // Kingside castling (short castling)
    const kingsideRookMoved = color === 'white' ? 
        castlingRights.whiteRookKingsideMoved : castlingRights.blackRookKingsideMoved;
    
    if (!kingsideRookMoved && board[backRank][7] && 
        board[backRank][7].toLowerCase() === 'r' && getPieceColor(board[backRank][7]) === color) {
        
        // Check if squares between king and rook are empty
        if (!board[backRank][5] && !board[backRank][6]) {
            // Check if king doesn't pass through check
            if (!wouldBeInCheck(color, backRank, 5) && !wouldBeInCheck(color, backRank, 6)) {
                moves.push({ row: backRank, col: 6, isCastling: true, castlingType: 'kingside' });
            }
        }
    }
    
    // Queenside castling (long castling)
    const queensideRookMoved = color === 'white' ? 
        castlingRights.whiteRookQueensideMoved : castlingRights.blackRookQueensideMoved;
    
    if (!queensideRookMoved && board[backRank][0] && 
        board[backRank][0].toLowerCase() === 'r' && getPieceColor(board[backRank][0]) === color) {
        
        // Check if squares between king and rook are empty
        if (!board[backRank][1] && !board[backRank][2] && !board[backRank][3]) {
            // Check if king doesn't pass through check
            if (!wouldBeInCheck(color, backRank, 2) && !wouldBeInCheck(color, backRank, 3)) {
                moves.push({ row: backRank, col: 2, isCastling: true, castlingType: 'queenside' });
            }
        }
    }
    
    return moves;
}

// Check if king would be in check at a specific position
function wouldBeInCheck(color, row, col) {
    // Temporarily move king to test position
    const originalKing = board[row][col];
    const kingPiece = color === 'white' ? 'K' : 'k';
    
    // Find current king position
    let currentKingRow = -1, currentKingCol = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] && board[r][c].toLowerCase() === 'k' && getPieceColor(board[r][c]) === color) {
                currentKingRow = r;
                currentKingCol = c;
                break;
            }
        }
        if (currentKingRow !== -1) break;
    }
    
    // Temporarily place king at new position
    board[row][col] = kingPiece;
    if (currentKingRow !== -1) {
        board[currentKingRow][currentKingCol] = '';
    }
    
    // Check if this position would be under attack
    const wouldBeAttacked = isSquareUnderAttack(row, col, color);
    
    // Restore original positions
    board[row][col] = originalKing;
    if (currentKingRow !== -1) {
        board[currentKingRow][currentKingCol] = kingPiece;
    }
    
    return wouldBeAttacked;
}

// Check if a square is under attack by the opponent
function isSquareUnderAttack(row, col, defendingColor) {
    const attackingColor = defendingColor === 'white' ? 'black' : 'white';
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) === attackingColor) {
                const moves = getRawValidMoves(r, c);
                if (moves.some(move => move.row === row && move.col === col)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Check if position is in bounds
function isInBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Get piece color
function getPieceColor(piece) {
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

// Check if move is valid
function isValidMove(fromRow, fromCol, toRow, toCol) {
    return validMoves.some(move => move.row === toRow && move.col === toCol);
}

// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    const captured = board[toRow][toCol];
    
    // Capture piece
    if (captured) {
        const capturedColor = getPieceColor(captured);
        capturedPieces[capturedColor].push(captured);
        updateCapturedPieces();
        document.getElementById('captures').textContent = 
            capturedPieces.white.length + capturedPieces.black.length;
    }
    
    // Update castling rights
    updateCastlingRights(piece, fromRow, fromCol);
    
    // Check if this is a castling move
    const isCastlingMove = piece.toLowerCase() === 'k' && Math.abs(toCol - fromCol) === 2;
    
    // Move piece
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = '';
    
    // Handle castling - move the rook too
    if (isCastlingMove) {
        const color = getPieceColor(piece);
        const backRank = color === 'white' ? 7 : 0;
        
        if (toCol === 6) { // Kingside castling
            // Move rook from h-file to f-file
            const rook = board[backRank][7];
            board[backRank][5] = rook;
            board[backRank][7] = '';
        } else if (toCol === 2) { // Queenside castling
            // Move rook from a-file to d-file
            const rook = board[backRank][0];
            board[backRank][3] = rook;
            board[backRank][0] = '';
        }
    }
    
    // Pawn promotion
    if (piece.toLowerCase() === 'p' && (toRow === 0 || toRow === 7)) {
        board[toRow][toCol] = getPieceColor(piece) === 'white' ? 'Q' : 'q';
    }
    
    // Update move history
    moveCount++;
    let moveNotation;
    
    if (isCastlingMove) {
        // Special notation for castling
        if (toCol === 6) {
            moveNotation = `${moveCount}. O-O`; // Kingside castling
        } else {
            moveNotation = `${moveCount}. O-O-O`; // Queenside castling
        }
    } else {
        moveNotation = `${moveCount}. ${pieces[piece]} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
    }
    
    moveHistory.push(moveNotation);
    updateMoveHistory();
    
    // Update stats
    document.getElementById('moveCount').textContent = moveCount;
    document.getElementById('totalMoves').textContent = moveCount;
    
    // Switch turn first
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    
    // Check if the new player is in check
    const inCheck = isInCheck(currentTurn);
    
    // Check for checkmate or stalemate
    if (isCheckmate(currentTurn)) {
        endGame(currentTurn === 'white' ? 'black' : 'white');
        return;
    } else if (isStalemate(currentTurn)) {
        endGameDraw('Stalemate');
        return;
    }
    
    // Update display and show check warning if needed
    updateTurnDisplay();
    showCheckWarning(inCheck);
}

// Update castling rights when pieces move
function updateCastlingRights(piece, fromRow, fromCol) {
    const pieceType = piece.toLowerCase();
    const color = getPieceColor(piece);
    
    if (pieceType === 'k') {
        if (color === 'white') {
            castlingRights.whiteKingMoved = true;
        } else {
            castlingRights.blackKingMoved = true;
        }
    } else if (pieceType === 'r') {
        if (color === 'white') {
            if (fromRow === 7 && fromCol === 0) {
                castlingRights.whiteRookQueensideMoved = true;
            } else if (fromRow === 7 && fromCol === 7) {
                castlingRights.whiteRookKingsideMoved = true;
            }
        } else {
            if (fromRow === 0 && fromCol === 0) {
                castlingRights.blackRookQueensideMoved = true;
            } else if (fromRow === 0 && fromCol === 7) {
                castlingRights.blackRookKingsideMoved = true;
            }
        }
    }
}

// Show check warning
function showCheckWarning(inCheck) {
    const checkWarning = document.getElementById('checkWarning');
    if (inCheck) {
        if (!checkWarning) {
            const warning = document.createElement('div');
            warning.id = 'checkWarning';
            warning.className = 'check-warning';
            warning.innerHTML = `
                <span class="check-icon">⚠️</span>
                <span class="check-text">${currentTurn === 'white' ? 'White' : 'Black'} King is in Check!</span>
            `;
            document.querySelector('.game-info').appendChild(warning);
        } else {
            checkWarning.innerHTML = `
                <span class="check-icon">⚠️</span>
                <span class="check-text">${currentTurn === 'white' ? 'White' : 'Black'} King is in Check!</span>
            `;
            checkWarning.style.display = 'block';
        }
        
        // Highlight the king in check
        highlightKingInCheck();
    } else {
        if (checkWarning) {
            checkWarning.style.display = 'none';
        }
    }
}

// Highlight king in check
function highlightKingInCheck() {
    // Find and highlight the king in check
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.toLowerCase() === 'k' && getPieceColor(piece) === currentTurn) {
                const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                square.classList.add('king-in-check');
                setTimeout(() => {
                    square.classList.remove('king-in-check');
                }, 3000);
                break;
            }
        }
    }
}

// Check for stalemate
function isStalemate(color) {
    // If king is in check, it's not stalemate
    if (isInCheck(color)) return false;
    
    // Check if any legal moves exist
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && getPieceColor(piece) === color) {
                const moves = getValidMoves(row, col);
                if (moves.length > 0) {
                    return false; // Found a legal move
                }
            }
        }
    }
    
    return true; // No legal moves and not in check = stalemate
}

// End game with draw
function endGameDraw(reason) {
    gameOver = true;
    clearInterval(timeInterval);
    clearInterval(playerTimerInterval); // Stop player timers
    
    document.getElementById('winnerIcon').textContent = '🤝';
    document.getElementById('winnerName').textContent = 'Draw!';
    document.getElementById('winnerMessage').textContent = reason;
    document.getElementById('finalMoves').textContent = moveCount;
    document.getElementById('finalTime').textContent = document.getElementById('gameTime').textContent;
    
    document.getElementById('gameOverModal').style.display = 'flex';
}

// Update captured pieces display
function updateCapturedPieces() {
    document.getElementById('capturedWhite').innerHTML = 
        capturedPieces.white.map(p => `<span class="captured-piece">${pieces[p]}</span>`).join('');
    document.getElementById('capturedBlack').innerHTML = 
        capturedPieces.black.map(p => `<span class="captured-piece">${pieces[p]}</span>`).join('');
}

// Update move history
function updateMoveHistory() {
    const movesList = document.getElementById('movesList');
    movesList.innerHTML = moveHistory.map(move => 
        `<div class="move-entry">${move}</div>`
    ).join('');
    movesList.scrollTop = movesList.scrollHeight;
}

// Update turn display
function updateTurnDisplay() {
    document.getElementById('currentTurn').textContent = 
        currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1);
    
    const whitePlayer = document.getElementById('whitePlayer');
    const blackPlayer = document.getElementById('blackPlayer');
    
    if (currentTurn === 'white') {
        whitePlayer.classList.add('active');
        blackPlayer.classList.remove('active');
    } else {
        whitePlayer.classList.remove('active');
        blackPlayer.classList.add('active');
    }
}

// Check if king is in check
function isInCheck(color) {
    // Find king position
    let kingPos = null;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.toLowerCase() === 'k' && getPieceColor(piece) === color) {
                kingPos = { row, col };
                break;
            }
        }
        if (kingPos) break;
    }
    
    if (!kingPos) return false;
    
    // Check if any opponent piece can capture king (using raw moves to avoid recursion)
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && getPieceColor(piece) === opponentColor) {
                const moves = getRawValidMoves(row, col);
                if (moves.some(move => move.row === kingPos.row && move.col === kingPos.col)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// Get raw valid moves without checking for king safety (to avoid recursion)
function getRawValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    const moves = [];
    const pieceType = piece.toLowerCase();
    const color = getPieceColor(piece);
    
    switch(pieceType) {
        case 'p':
            moves.push(...getPawnMoves(row, col, color));
            break;
        case 'n':
            moves.push(...getKnightMoves(row, col, color));
            break;
        case 'b':
            moves.push(...getBishopMoves(row, col, color));
            break;
        case 'r':
            moves.push(...getRookMoves(row, col, color));
            break;
        case 'q':
            moves.push(...getQueenMoves(row, col, color));
            break;
        case 'k':
            // Only basic king moves for raw moves (no castling to avoid recursion)
            const offsets = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            
            for (let [dr, dc] of offsets) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (isInBounds(newRow, newCol) && 
                    (!board[newRow][newCol] || getPieceColor(board[newRow][newCol]) !== color)) {
                    moves.push({ row: newRow, col: newCol });
                }
            }
            break;
    }
    
    return moves;
}

// Check if checkmate
function isCheckmate(color) {
    if (!isInCheck(color)) return false;
    
    // Check if any move can get out of check
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && getPieceColor(piece) === color) {
                const moves = getValidMoves(row, col);
                for (let move of moves) {
                    // Try move
                    const originalPiece = board[move.row][move.col];
                    board[move.row][move.col] = piece;
                    board[row][col] = '';
                    
                    const stillInCheck = isInCheck(color);
                    
                    // Undo move
                    board[row][col] = piece;
                    board[move.row][move.col] = originalPiece;
                    
                    if (!stillInCheck) return false;
                }
            }
        }
    }
    
    return true;
}

// AI move
function makeAIMove() {
    if (gameOver) return;
    
    let bestMove = null;
    
    switch(aiDifficulty) {
        case 'easy':
            bestMove = getRandomMove();
            break;
        case 'medium':
            bestMove = getMediumMove();
            break;
        case 'hard':
            bestMove = getBestMove();
            break;
    }
    
    if (bestMove) {
        makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        renderBoard();
    }
}

// Get random move (easy AI)
function getRandomMove() {
    const moves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && getPieceColor(piece) === currentTurn) {
                const pieceMoves = getValidMoves(row, col);
                pieceMoves.forEach(move => {
                    moves.push({ fromRow: row, fromCol: col, toRow: move.row, toCol: move.col });
                });
            }
        }
    }
    return moves.length > 0 ? moves[Math.floor(Math.random() * moves.length)] : null;
}

// Get medium move (improved strategy)
function getMediumMove() {
    const moves = getAllPossibleMoves(currentTurn);
    let bestMoves = [];
    let bestScore = -Infinity;
    
    // Evaluate each move with depth 2
    for (let move of moves) {
        const moveData = makeTemporaryMove(move);
        
        // Look ahead 1 move
        let score = evaluateBoard();
        
        // Add bonus for captures
        if (moveData.capturedPiece) {
            score += pieceValues[moveData.capturedPiece] * 0.5;
        }
        
        // Add bonus for checks
        const opponentColor = currentTurn === 'white' ? 'black' : 'white';
        if (isInCheck(opponentColor)) {
            score += 100;
        }
        
        // Add bonus for center control
        if ((move.toRow === 3 || move.toRow === 4) && (move.toCol === 3 || move.toCol === 4)) {
            score += 50;
        }
        
        undoTemporaryMove(move, moveData);
        
        if (score > bestScore) {
            bestScore = score;
            bestMoves = [move];
        } else if (score === bestScore) {
            bestMoves.push(move);
        }
    }
    
    return bestMoves.length > 0 ? 
        bestMoves[Math.floor(Math.random() * bestMoves.length)] : 
        null;
}

// Get best move (hard AI) - Now uses minimax with alpha-beta pruning
function getBestMove() {
    const depth = aiDifficulty === 'hard' ? 4 : 3; // Look ahead 3-4 moves
    const result = minimax(depth, -Infinity, Infinity, true);
    return result.move;
}

// Minimax algorithm with alpha-beta pruning
function minimax(depth, alpha, beta, maximizingPlayer) {
    if (depth === 0) {
        return { score: evaluateBoard(), move: null };
    }
    
    const moves = getAllPossibleMoves(maximizingPlayer ? currentTurn : (currentTurn === 'white' ? 'black' : 'white'));
    
    if (moves.length === 0) {
        // No moves available - checkmate or stalemate
        const color = maximizingPlayer ? currentTurn : (currentTurn === 'white' ? 'black' : 'white');
        if (isInCheck(color)) {
            return { score: maximizingPlayer ? -50000 : 50000, move: null }; // Checkmate
        } else {
            return { score: 0, move: null }; // Stalemate
        }
    }
    
    let bestMove = null;
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of moves) {
            // Make move
            const moveData = makeTemporaryMove(move);
            
            const eval_result = minimax(depth - 1, alpha, beta, false);
            
            // Undo move
            undoTemporaryMove(move, moveData);
            
            if (eval_result.score > maxEval) {
                maxEval = eval_result.score;
                bestMove = move;
            }
            
            alpha = Math.max(alpha, eval_result.score);
            if (beta <= alpha) {
                break; // Alpha-beta pruning
            }
        }
        return { score: maxEval, move: bestMove };
    } else {
        let minEval = Infinity;
        for (let move of moves) {
            // Make move
            const moveData = makeTemporaryMove(move);
            
            const eval_result = minimax(depth - 1, alpha, beta, true);
            
            // Undo move
            undoTemporaryMove(move, moveData);
            
            if (eval_result.score < minEval) {
                minEval = eval_result.score;
                bestMove = move;
            }
            
            beta = Math.min(beta, eval_result.score);
            if (beta <= alpha) {
                break; // Alpha-beta pruning
            }
        }
        return { score: minEval, move: bestMove };
    }
}

// Get all possible moves for a color (now respects check rules)
function getAllPossibleMoves(color) {
    const moves = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && getPieceColor(piece) === color) {
                const pieceMoves = getValidMoves(row, col); // This now filters illegal moves
                pieceMoves.forEach(move => {
                    moves.push({ fromRow: row, fromCol: col, toRow: move.row, toCol: move.col });
                });
            }
        }
    }
    
    // Sort moves to improve alpha-beta pruning (captures first, then center moves)
    moves.sort((a, b) => {
        const scoreA = getMoveScore(a);
        const scoreB = getMoveScore(b);
        return scoreB - scoreA;
    });
    
    return moves;
}

// Score a move for sorting (higher is better)
function getMoveScore(move) {
    let score = 0;
    
    // Prioritize captures
    if (board[move.toRow][move.toCol]) {
        score += pieceValues[board[move.toRow][move.toCol]] * 10;
    }
    
    // Test the move to see if it gives check
    const moveData = makeTemporaryMove(move);
    const opponentColor = currentTurn === 'white' ? 'black' : 'white';
    if (isInCheck(opponentColor)) {
        score += 200; // Bonus for giving check
    }
    undoTemporaryMove(move, moveData);
    
    // Prioritize center moves
    const centerDistance = Math.abs(move.toRow - 3.5) + Math.abs(move.toCol - 3.5);
    score += (7 - centerDistance) * 5;
    
    // Prioritize piece development in opening
    if (moveCount < 20) {
        const piece = board[move.fromRow][move.fromCol];
        if (piece && (piece.toLowerCase() === 'n' || piece.toLowerCase() === 'b')) {
            const backRank = currentTurn === 'white' ? 7 : 0;
            if (move.fromRow === backRank) {
                score += 30; // Bonus for developing pieces
            }
        }
        
        // Bonus for castling in opening/middlegame
        if (piece && piece.toLowerCase() === 'k' && Math.abs(move.toCol - move.fromCol) === 2) {
            score += 150; // High bonus for castling
        }
    }
    
    return score;
}

// Make a temporary move for evaluation
function makeTemporaryMove(move) {
    const capturedPiece = board[move.toRow][move.toCol];
    const piece = board[move.fromRow][move.fromCol];
    
    // Move the piece
    board[move.toRow][move.toCol] = piece;
    board[move.fromRow][move.fromCol] = '';
    
    // Handle castling in temporary moves
    let rookMove = null;
    if (piece && piece.toLowerCase() === 'k' && Math.abs(move.toCol - move.fromCol) === 2) {
        const color = getPieceColor(piece);
        const backRank = color === 'white' ? 7 : 0;
        
        if (move.toCol === 6) { // Kingside castling
            rookMove = { from: [backRank, 7], to: [backRank, 5] };
            board[backRank][5] = board[backRank][7];
            board[backRank][7] = '';
        } else if (move.toCol === 2) { // Queenside castling
            rookMove = { from: [backRank, 0], to: [backRank, 3] };
            board[backRank][3] = board[backRank][0];
            board[backRank][0] = '';
        }
    }
    
    return { capturedPiece, rookMove };
}

// Undo a temporary move
function undoTemporaryMove(move, moveData) {
    const { capturedPiece, rookMove } = moveData;
    
    // Restore the main piece
    board[move.fromRow][move.fromCol] = board[move.toRow][move.toCol];
    board[move.toRow][move.toCol] = capturedPiece;
    
    // Restore rook if this was a castling move
    if (rookMove) {
        board[rookMove.from[0]][rookMove.from[1]] = board[rookMove.to[0]][rookMove.to[1]];
        board[rookMove.to[0]][rookMove.to[1]] = '';
    }
}

// Evaluate board position - Much more sophisticated evaluation
function evaluateBoard() {
    let score = 0;
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const color = getPieceColor(piece);or = getPieceColor(piece);
                const isWhite = color === 'white';
                const multiplier = (currentTurn === color) ? 1 : -1;
                
                // Basic piece value
                score += pieceValues[piece] * multiplier;
                
                // Position bonus
                const positionBonus = getPositionBonus(piece, row, col, isWhite);
                score += positionBonus * multiplier;
                
                // Mobility bonus (number of possible moves) - using raw moves for performance
                const mobility = getRawValidMoves(row, col).length;
                score += mobility * 10 * multiplier;
                
                // King safety
                if (piece.toLowerCase() === 'k') {
                    const kingSafety = evaluateKingSafety(row, col, color);
                    score += kingSafety * multiplier;
                }
                
                // Pawn structure
                if (piece.toLowerCase() === 'p') {
                    const pawnStructure = evaluatePawnStructure(row, col, color);
                    score += pawnStructure * multiplier;
                }
            }
        }
    }
    
    // Control of center
    score += evaluateCenterControl();
    
    // Piece development (early game)
    if (moveCount < 20) {
        score += evaluateDevelopment();
    }
    
    return score;
}

// Get position bonus for a piece
function getPositionBonus(piece, row, col, isWhite) {
    const pieceType = piece.toLowerCase();
    let table;
    
    switch(pieceType) {
        case 'p': table = pawnTable; break;
        case 'n': table = knightTable; break;
        case 'b': table = bishopTable; break;
        case 'r': table = rookTable; break;
        case 'q': table = queenTable; break;
        case 'k': table = kingTable; break;
        default: return 0;
    }
    
    // Flip table for black pieces
    const tableRow = isWhite ? row : 7 - row;
    return table[tableRow][col];
}

// Evaluate king safety
function evaluateKingSafety(row, col, color) {
    let safety = 0;
    
    // Penalty for exposed king
    const opponentColor = color === 'white' ? 'black' : 'white';
    let attackers = 0;
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) === opponentColor) {
                const moves = getRawValidMoves(r, c);
                if (moves.some(move => Math.abs(move.row - row) <= 1 && Math.abs(move.col - col) <= 1)) {
                    attackers++;
                }
            }
        }
    }
    
    safety -= attackers * 50;
    
    // Bonus for castling rights and completed castling
    const backRank = color === 'white' ? 7 : 0;
    const kingMoved = color === 'white' ? castlingRights.whiteKingMoved : castlingRights.blackKingMoved;
    
    if (!kingMoved) {
        // Bonus for having castling rights
        safety += 30;
    } else if ((row === backRank && (col === 2 || col === 6))) {
        // Bonus for completed castling (king on castled position)
        safety += 50;
        
        // Extra bonus if rook is protecting the king
        if (col === 6 && board[backRank][5] && board[backRank][5].toLowerCase() === 'r') {
            safety += 20;
        } else if (col === 2 && board[backRank][3] && board[backRank][3].toLowerCase() === 'r') {
            safety += 20;
        }
    }
    
    return safety;
}

// Evaluate pawn structure
function evaluatePawnStructure(row, col, color) {
    let score = 0;
    const direction = color === 'white' ? -1 : 1;
    
    // Doubled pawns penalty
    for (let r = 0; r < 8; r++) {
        if (r !== row && board[r][col] && board[r][col].toLowerCase() === 'p' && 
            getPieceColor(board[r][col]) === color) {
            score -= 20;
        }
    }
    
    // Isolated pawn penalty
    let hasSupport = false;
    for (let c = col - 1; c <= col + 1; c += 2) {
        if (c >= 0 && c < 8) {
            for (let r = 0; r < 8; r++) {
                if (board[r][c] && board[r][c].toLowerCase() === 'p' && 
                    getPieceColor(board[r][c]) === color) {
                    hasSupport = true;
                    break;
                }
            }
        }
    }
    if (!hasSupport) score -= 15;
    
    // Passed pawn bonus
    let isPassedPawn = true;
    for (let r = row + direction; r >= 0 && r < 8; r += direction) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (c >= 0 && c < 8 && board[r][c] && board[r][c].toLowerCase() === 'p' && 
                getPieceColor(board[r][c]) !== color) {
                isPassedPawn = false;
                break;
            }
        }
        if (!isPassedPawn) break;
    }
    if (isPassedPawn) {
        const advancement = color === 'white' ? (6 - row) : (row - 1);
        score += advancement * 20;
    }
    
    return score;
}

// Evaluate center control
function evaluateCenterControl() {
    let score = 0;
    const centerSquares = [[3,3], [3,4], [4,3], [4,4]];
    
    for (let [row, col] of centerSquares) {
        const piece = board[row][col];
        if (piece) {
            const multiplier = getPieceColor(piece) === currentTurn ? 1 : -1;
            score += 30 * multiplier;
        }
        
        // Control by pawns
        if (row > 0 && board[row-1][col] && board[row-1][col].toLowerCase() === 'p') {
            const multiplier = getPieceColor(board[row-1][col]) === currentTurn ? 1 : -1;
            score += 20 * multiplier;
        }
        if (row < 7 && board[row+1][col] && board[row+1][col].toLowerCase() === 'p') {
            const multiplier = getPieceColor(board[row+1][col]) === currentTurn ? 1 : -1;
            score += 20 * multiplier;
        }
    }
    
    return score;
}

// Evaluate piece development
function evaluateDevelopment() {
    let score = 0;
    
    // Knights and bishops should be developed
    const backRank = currentTurn === 'white' ? 7 : 0;
    
    // Check if knights are still on back rank
    if (board[backRank][1] && board[backRank][1].toLowerCase() === 'n' && 
        getPieceColor(board[backRank][1]) === currentTurn) {
        score -= 30;
    }
    if (board[backRank][6] && board[backRank][6].toLowerCase() === 'n' && 
        getPieceColor(board[backRank][6]) === currentTurn) {
        score -= 30;
    }
    
    // Check if bishops are still on back rank
    if (board[backRank][2] && board[backRank][2].toLowerCase() === 'b' && 
        getPieceColor(board[backRank][2]) === currentTurn) {
        score -= 25;
    }
    if (board[backRank][5] && board[backRank][5].toLowerCase() === 'b' && 
        getPieceColor(board[backRank][5]) === currentTurn) {
        score -= 25;
    }
    
    return score;
}

// Start timer
function startTimer() {
    if (timeInterval) clearInterval(timeInterval);
    gameTime = 0;
    timeInterval = setInterval(() => {
        if (!gameOver) {
            gameTime++;
            const minutes = Math.floor(gameTime / 60);
            const seconds = gameTime % 60;
            document.getElementById('gameTime').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Start player timers (for Player vs Player with time control)
function startPlayerTimers() {
    if (playerTimerInterval) clearInterval(playerTimerInterval);
    
    playerTimerInterval = setInterval(() => {
        if (!gameOver && gameMode === 'player' && timeControl !== 'unlimited') {
            // Decrease time for current player
            if (currentTurn === 'white') {
                whiteTime--;
                if (whiteTime <= 0) {
                    whiteTime = 0;
                    endGameByTimeout('black'); // Black wins by timeout
                    return;
                }
            } else {
                blackTime--;
                if (blackTime <= 0) {
                    blackTime = 0;
                    endGameByTimeout('white'); // White wins by timeout
                    return;
                }
            }
            
            updatePlayerTimerDisplay();
        }
    }, 1000);
    
    updatePlayerTimerDisplay();
}

// Update player timer display
function updatePlayerTimerDisplay() {
    if (gameMode === 'player' && timeControl !== 'unlimited') {
        const whiteMinutes = Math.floor(whiteTime / 60);
        const whiteSeconds = whiteTime % 60;
        const blackMinutes = Math.floor(blackTime / 60);
        const blackSeconds = blackTime % 60;
        
        // Update white player timer
        const whiteTimerElement = document.getElementById('whiteTimer');
        if (whiteTimerElement) {
            whiteTimerElement.textContent = `${whiteMinutes}:${whiteSeconds.toString().padStart(2, '0')}`;
            // Add warning class if time is low
            if (whiteTime <= 30) {
                whiteTimerElement.classList.add('timer-warning');
            } else if (whiteTime <= 60) {
                whiteTimerElement.classList.add('timer-low');
            } else {
                whiteTimerElement.classList.remove('timer-warning', 'timer-low');
            }
        }
        
        // Update black player timer
        const blackTimerElement = document.getElementById('blackTimer');
        if (blackTimerElement) {
            blackTimerElement.textContent = `${blackMinutes}:${blackSeconds.toString().padStart(2, '0')}`;
            // Add warning class if time is low
            if (blackTime <= 30) {
                blackTimerElement.classList.add('timer-warning');
            } else if (blackTime <= 60) {
                blackTimerElement.classList.add('timer-low');
            } else {
                blackTimerElement.classList.remove('timer-warning', 'timer-low');
            }
        }
    }
}

// End game by timeout
function endGameByTimeout(winner) {
    gameOver = true;
    clearInterval(timeInterval);
    clearInterval(playerTimerInterval);
    
    const winnerName = winner === 'white' ? 'White Wins!' : 'Black Wins!';
    const loserColor = winner === 'white' ? 'black' : 'white';
    
    document.getElementById('winnerIcon').textContent = winner === 'white' ? '♔' : '♚';
    document.getElementById('winnerName').textContent = winnerName;
    document.getElementById('winnerMessage').textContent = `${loserColor === 'white' ? 'White' : 'Black'} ran out of time!`;
    document.getElementById('finalMoves').textContent = moveCount;
    document.getElementById('finalTime').textContent = document.getElementById('gameTime').textContent;
    
    document.getElementById('gameOverModal').style.display = 'flex';
}

// End game
function endGame(winner) {
    gameOver = true;
    clearInterval(timeInterval);
    clearInterval(playerTimerInterval); // Stop player timers
    
    const winnerName = winner === 'white' ? 
        (gameMode === 'ai' && playerColor === 'white' ? 'You Win!' : 'White Wins!') :
        (gameMode === 'ai' && playerColor === 'black' ? 'You Win!' : 'Black Wins!');
    
    document.getElementById('winnerIcon').textContent = winner === 'white' ? '♔' : '♚';
    document.getElementById('winnerName').textContent = winnerName;
    document.getElementById('winnerMessage').textContent = 'Checkmate!';
    document.getElementById('finalMoves').textContent = moveCount;
    document.getElementById('finalTime').textContent = document.getElementById('gameTime').textContent;
    
    document.getElementById('gameOverModal').style.display = 'flex';
}

// Restart game
function restartGame() {
    gameOver = false;
    currentTurn = 'white';
    selectedSquare = null;
    validMoves = [];
    moveHistory = [];
    capturedPieces = { white: [], black: [] };
    moveCount = 0;
    
    // Reset timers
    clearInterval(playerTimerInterval);
    whiteTime = 0;
    blackTime = 0;
    
    document.getElementById('gameOverModal').style.display = 'none';
    document.getElementById('movesList').innerHTML = '';
    document.getElementById('capturedWhite').innerHTML = '';
    document.getElementById('capturedBlack').innerHTML = '';
    
    initGame();
}

// Go to setup
function goToSetup() {
    window.location.href = 'choose_to/choose_to.html';
}

// Go to menu
function goToMenu() {
    window.location.href = '../main_menu.html';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

console.log('Chess game initialized');
