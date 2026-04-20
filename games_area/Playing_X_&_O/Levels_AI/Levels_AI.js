// AI Difficulty Selection Logic
console.log('AI Difficulty Selection loaded');

let selectedDifficulty = null;

// Select difficulty level
function selectLevel(difficulty) {
    selectedDifficulty = difficulty;
    
    // Store difficulty in localStorage
    localStorage.setItem('aiDifficulty', difficulty);
    localStorage.setItem('gameMode', 'single');
    localStorage.setItem('vsAI', 'true');
    
    // Show selection feedback
    showLevelSelection(difficulty);
    
    // Start game after delay
    setTimeout(() => {
        startGameWithDifficulty(difficulty);
    }, 2000);
}

// Show level selection feedback
function showLevelSelection(difficulty) {
    // Remove previous selections
    document.querySelectorAll('.level-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`.level-card.${difficulty}`);
    selectedCard.classList.add('selected');
    
    // Add selection styles
    selectedCard.style.transform = 'scale(1.05)';
    selectedCard.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
    
    // Show confirmation message
    const difficultyNames = {
        easy: 'Easy (50% Optimal)',
        medium: 'Medium (70% Optimal)', 
        hard: 'Hard (90% Optimal)',
        expert: 'Expert (100% Optimal)'
    };
    
    const difficultyEmojis = {
        easy: '😊',
        medium: '🙂',
        hard: '😤',
        expert: '🤯'
    };
    
    showConfirmationPopup(
        `${difficultyEmojis[difficulty]} ${difficultyNames[difficulty]} Selected!`,
        'Starting game...'
    );
}

// Show confirmation popup
function showConfirmationPopup(title, message) {
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>${title}</h3>
            <p>${message}</p>
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
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    const popupContent = popup.querySelector('.popup-content');
    popupContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
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
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
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
    }, 1900);
}

// Start game with selected difficulty
function startGameWithDifficulty(difficulty) {
    console.log(`Starting game with ${difficulty} difficulty`);
    
    // Store all game settings
    localStorage.setItem('aiDifficulty', difficulty);
    localStorage.setItem('gameMode', 'single');
    localStorage.setItem('vsAI', 'true');
    
    // Redirect to main game
    window.location.href = '../Playing_X_&_O.html';
}

// Go back to mode selection
function goBack() {
    window.location.href = '../olly_one_or_two/olly_one_or_two.html';
}

// Show info modal
function showInfo() {
    document.getElementById('infoModal').style.display = 'flex';
}

// Close info modal
function closeInfo() {
    document.getElementById('infoModal').style.display = 'none';
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            selectLevel('easy');
            break;
        case '2':
            selectLevel('medium');
            break;
        case '3':
            selectLevel('hard');
            break;
        case '4':
            selectLevel('expert');
            break;
        case 'Escape':
            if (document.getElementById('infoModal').style.display === 'flex') {
                closeInfo();
            } else {
                goBack();
            }
            break;
        case 'i':
        case 'I':
            showInfo();
            break;
    }
});

// Add visual effects on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate difficulty cards
    const cards = document.querySelectorAll('.level-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // Animate tips
    const tips = document.querySelectorAll('.tip');
    tips.forEach((tip, index) => {
        tip.style.opacity = '0';
        tip.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            tip.style.transition = 'all 0.5s ease';
            tip.style.opacity = '1';
            tip.style.transform = 'translateX(0)';
        }, 1000 + index * 100);
    });
    
    // Animate difficulty bars
    setTimeout(() => {
        document.querySelectorAll('.difficulty-fill').forEach(fill => {
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.transition = 'width 1.5s ease';
                if (fill.classList.contains('easy-fill')) fill.style.width = '25%';
                if (fill.classList.contains('medium-fill')) fill.style.width = '50%';
                if (fill.classList.contains('hard-fill')) fill.style.width = '75%';
                if (fill.classList.contains('expert-fill')) fill.style.width = '100%';
            }, 100);
        });
    }, 800);
    
    // Close modal when clicking outside
    document.getElementById('infoModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeInfo();
        }
    });
});

// Add hover effects
document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add subtle animation on hover
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        // Reset if not selected
        if (!this.classList.contains('selected')) {
            this.style.transform = '';
            this.style.boxShadow = '';
        }
    });
});

// Difficulty information
const difficultyInfo = {
    easy: {
        name: 'Easy',
        percentage: 50,
        description: 'AI makes random moves half the time. Perfect for beginners.',
        strategy: 'Random moves with basic blocking'
    },
    medium: {
        name: 'Medium', 
        percentage: 70,
        description: 'AI blocks obvious wins and makes good moves most of the time.',
        strategy: 'Strategic play with occasional mistakes'
    },
    hard: {
        name: 'Hard',
        percentage: 90, 
        description: 'AI plays strategically and rarely makes mistakes.',
        strategy: 'Advanced tactics with minimal errors'
    },
    expert: {
        name: 'Expert',
        percentage: 100,
        description: 'Perfect AI using minimax algorithm. Nearly impossible to beat.',
        strategy: 'Perfect play - best outcome is a tie'
    }
};

// Export for use in other files
window.difficultyAPI = {
    selectLevel: selectLevel,
    getDifficultyInfo: (level) => difficultyInfo[level],
    getCurrentDifficulty: () => selectedDifficulty
};

console.log('AI Difficulty Selection initialized');