// Snakes and Ladders - Mode Selection
console.log('Mode selection loaded');

let selectedMode = null;

// Select game mode
function selectMode(mode) {
    selectedMode = mode;
    
    // Remove previous selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`.mode-card.${mode}`);
    selectedCard.classList.add('selected');
    
    // Show confirmation message
    showModeConfirmation(mode);
    
    // Start game after delay
    setTimeout(() => {
        startGame(mode);
    }, 1500);
}

// Show mode confirmation
function showModeConfirmation(mode) {
    const message = mode === 'single' ? 
        '🤖 Starting game vs AI...' : 
        '👥 Starting multiplayer game...';
    
    // Create confirmation popup
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>${message}</h3>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    // Add popup styles
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
    
    const popupContent = popup.querySelector('.popup-content');
    popupContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    const spinner = popup.querySelector('.loading-spinner');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    `;
    
    // Add animations
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
    
    // Remove popup after delay
    setTimeout(() => {
        popup.remove();
        style.remove();
    }, 1400);
}

// Start the game
function startGame(mode) {
    // Store game mode in localStorage
    localStorage.setItem('snakesGameMode', mode);
    localStorage.setItem('snakesVsAI', mode === 'single' ? 'true' : 'false');
    
    // Redirect to main game
    window.location.href = '../peace_and_fatigue.html';
}

// Go back to games menu
function goBack() {
    window.location.href = '../../main_menu.html';
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            selectMode('single');
            break;
        case '2':
            selectMode('multiplayer');
            break;
        case 'Escape':
            goBack();
            break;
    }
});

// Add visual effects on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate mode cards
    const cards = document.querySelectorAll('.mode-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate rules
    const rules = document.querySelectorAll('.rule');
    rules.forEach((rule, index) => {
        rule.style.opacity = '0';
        rule.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            rule.style.transition = 'all 0.5s ease';
            rule.style.opacity = '1';
            rule.style.transform = 'translateX(0)';
        }, 800 + index * 100);
    });
});
