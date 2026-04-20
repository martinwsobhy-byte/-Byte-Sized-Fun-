// Snake Game - Customization
console.log('Snake customization loaded');

let selectedSnakeColor = 'green';
let selectedFoodType = 'fruits';
let selectedBackground = 'dark';

// Snake color configurations
const snakeColors = {
    green: { gradient: 'linear-gradient(135deg, #2ecc71, #27ae60)', solid: '#2ecc71' },
    blue: { gradient: 'linear-gradient(135deg, #3498db, #2980b9)', solid: '#3498db' },
    red: { gradient: 'linear-gradient(135deg, #e74c3c, #c0392b)', solid: '#e74c3c' },
    purple: { gradient: 'linear-gradient(135deg, #9b59b6, #8e44ad)', solid: '#9b59b6' },
    orange: { gradient: 'linear-gradient(135deg, #f39c12, #e67e22)', solid: '#f39c12' },
    pink: { gradient: 'linear-gradient(135deg, #ff6b9d, #c44569)', solid: '#ff6b9d' }
};

// Food type configurations
const foodTypes = {
    fruits: ['🍎', '🍊', '🍇', '🍓', '🍌', '🍉', '🍑', '🍒'],
    birds: ['🐦', '🦅', '🦜', '🦆', '🦉', '🐧', '🦚', '🕊️'],
    insects: ['🐛', '🦋', '🐝', '🐞', '🦗', '🦟']
};

// Background configurations
const backgrounds = {
    dark: '#2c3e50',
    light: '#ecf0f1',
    forest: 'linear-gradient(135deg, #1e3c72, #2a5298)',
    sunset: 'linear-gradient(135deg, #ff6b6b, #feca57)',
    ocean: 'linear-gradient(135deg, #667eea, #764ba2)',
    grass: 'linear-gradient(135deg, #56ab2f, #a8e063)'
};

// Select snake color
function selectSnakeColor(color) {
    selectedSnakeColor = color;
    
    // Update UI
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.color-option[data-color="${color}"]`).classList.add('selected');
    
    // Update preview
    updatePreview();
}

// Select food type
function selectFoodType(type) {
    selectedFoodType = type;
    
    // Update UI
    document.querySelectorAll('.food-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.food-option[data-food="${type}"]`).classList.add('selected');
    
    // Update preview
    updatePreview();
}

// Select background
function selectBackground(bg) {
    selectedBackground = bg;
    
    // Update UI
    document.querySelectorAll('.bg-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`.bg-option[data-bg="${bg}"]`).classList.add('selected');
    
    // Update preview
    updatePreview();
}

// Update preview
function updatePreview() {
    const previewBox = document.getElementById('previewBox');
    const previewSnake = document.getElementById('previewSnake');
    const previewFood = document.getElementById('previewFood');
    
    // Update background
    previewBox.style.background = backgrounds[selectedBackground];
    
    // Update snake color
    previewSnake.style.background = snakeColors[selectedSnakeColor].gradient;
    
    // Update food
    const foods = foodTypes[selectedFoodType];
    previewFood.textContent = foods[Math.floor(Math.random() * foods.length)];
}

// Start game
function startGame() {
    // Save settings to localStorage
    localStorage.setItem('snakeColor', selectedSnakeColor);
    localStorage.setItem('foodType', selectedFoodType);
    localStorage.setItem('background', selectedBackground);
    
    // Show loading animation
    showLoadingAnimation();
    
    // Redirect to game
    setTimeout(() => {
        window.location.href = '../snake.html';
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
    
    popup.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        ">
            <h3 style="color: #333; margin-bottom: 20px; font-size: 1.5rem;">🐍 Starting Game...</h3>
            <div style="
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid ${snakeColors[selectedSnakeColor].solid};
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
    // Set default selections
    selectSnakeColor('green');
    selectFoodType('fruits');
    selectBackground('dark');
    
    // Animate elements
    const sections = document.querySelectorAll('.custom-section');
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

console.log('Snake customization initialized');
