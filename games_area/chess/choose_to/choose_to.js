// Chess Game - Setup
console.log('Chess setup loaded');

let selectedMode = null;
let selectedDifficulty = 'medium';
let selectedColor = 'white';
let selectedTime = '10'; // Default 10 minutes

// Select game mode
function selectMode(mode) {
    selectedMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.mode-card[data-mode="${mode}"]`).classList.add('selected');
    
    // Show/hide sections based on mode
    if (mode === 'ai') {
        document.getElementById('difficultySection').style.display = 'block';
        document.getElementById('colorSection').style.display = 'block';
        document.getElementById('timeSection').style.display = 'none';
        selectDifficulty('medium'); // Default
        selectColor('white'); // Default
    } else {
        document.getElementById('difficultySection').style.display = 'none';
        document.getElementById('colorSection').style.display = 'none';
        document.getElementById('timeSection').style.display = 'block';
        selectTime('10'); // Default 10 minutes
    }
    
    // Enable start button
    updateStartButton();
}

// Select difficulty
function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    
    // Update UI
    document.querySelectorAll('.difficulty-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.difficulty-card[data-difficulty="${difficulty}"]`).classList.add('selected');
    
    updateStartButton();
}

// Select color
function selectColor(color) {
    selectedColor = color;
    
    // Update UI
    document.querySelectorAll('.color-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.color-card[data-color="${color}"]`).classList.add('selected');
    
    updateStartButton();
}

// Select time control
function selectTime(time) {
    selectedTime = time;
    
    // Update UI
    document.querySelectorAll('.time-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.time-card[data-time="${time}"]`).classList.add('selected');
    
    updateStartButton();
}

// Update start button state
function updateStartButton() {
    const startBtn = document.getElementById('startBtn');
    
    if (selectedMode) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
}

// Start game
function startGame() {
    if (!selectedMode) return;
    
    // Save settings to localStorage
    localStorage.setItem('chessMode', selectedMode);
    localStorage.setItem('chessDifficulty', selectedDifficulty);
    localStorage.setItem('chessPlayerColor', selectedColor);
    localStorage.setItem('chessTimeControl', selectedTime);
    
    // Show loading animation
    showLoadingAnimation();
    
    // Redirect to game
    setTimeout(() => {
        window.location.href = '../chess.html';
    }, 1500);
}

// Show loading animation
function showLoadingAnimation() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modeText = selectedMode === 'ai' ? 
        `Starting game vs AI (${selectedDifficulty})...` : 
        'Starting multiplayer game...';
    
    popup.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        ">
            <h3 style="color: #2c3e50; margin-bottom: 20px; font-size: 1.5rem;">♔♕ ${modeText}</h3>
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #2c3e50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(popup);
}

// Go back to menu
function goBack() {
    window.location.href = '../../main_menu.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections
    const sections = document.querySelectorAll('.setup-section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

console.log('Chess setup initialized');
