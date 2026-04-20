# 🟡 Pac-Man Game

A classic Pac-Man game implementation with both C++ console version and enhanced web browser version featuring advanced AI and power mode mechanics.

## 🎮 How to Play

- **Objective**: Collect all dots while avoiding the 4 intelligent ghosts
- **Lives**: You have 3 lives to complete each level
- **Power Mode**: Eat power pellets to turn ghosts scared and edible for 10 seconds
- **Tunnels**: Use horizontal tunnels to escape - enter right side, exit left side
- **Scoring**: 
  - Small dot: 10 points
  - Power pellet: 50 points
  - Eaten ghost: 200 points

## 🕹️ Controls

### C++ Version
- **W** - Move Up
- **S** - Move Down  
- **A** - Move Left
- **D** - Move Right
- **ESC** - Quit Game

### Web Version
- **Arrow Keys** or **WASD** - Move Pac-Man
- **Pause/Resume** - Click pause button
- **Restart** - Click restart button

## 🚀 Getting Started

### Option 1: Web Browser Version (Recommended)

1. **Quick Start**:
   - Open `index.html` in your web browser
   - Click "🌐 Play Web Version"
   - Game starts immediately - no installation required!

2. **Direct Access**:
   - Open `web_game.html` directly in your browser
   - Use WASD or Arrow keys to control Pac-Man

### Option 2: C++ Console Version

1. **Install a C++ Compiler** (if not already installed):
   - Windows: Install MinGW-w64 or Visual Studio with C++ support

2. **Compile and Run**:
   ```bash
   # Manual compilation
   g++ pacman_game.cpp -o pacman_game.exe
   pacman_game.exe
   
   # Or run pre-compiled version
   pacman_game.exe
   ```

## 🎯 Advanced Game Features

### 🤖 Intelligent Ghost AI
- **4 Colored Ghosts**: Red, Pink, Cyan, and Orange
- **Smart Chasing**: Ghosts actively hunt Pac-Man (80% chase, 20% random)
- **Slower Speed**: Ghosts move every 2 cycles (Pac-Man moves every cycle)
- **Scared Behavior**: Run away from Pac-Man during power mode
- **Respawn System**: When eaten, ghosts freeze for 4 seconds then resume

### 🎮 Enhanced Gameplay
- **31x31 Large Maze**: Bigger playing field with more strategic options
- **Horizontal Tunnels**: Escape through sides - enter right, exit left
- **10-Second Power Mode**: Extended power pellet duration
- **Visual Feedback**: Color changes, flashing effects, and status messages
- **3 Lives System**: Multiple chances with life loss feedback
- **Real-time Scoring**: Immediate score updates and win/lose detection

## 🏗️ Technical Details

### C++ Version
- **Platform**: Windows (uses Windows.h for console manipulation)
- **Compiler**: Any C++ compiler (g++, MSVC, etc.)
- **Dependencies**: Standard C++ library + Windows API

### Web Version
- **Platform**: Any modern web browser
- **Technologies**: HTML5 Canvas, JavaScript
- **No installation required**

## 🎨 Game Elements & Visual Effects

### Characters
- 🟡 **Pac-Man**: Yellow (normal) → Red (power mode)
- 👻 **Red Ghost**: Aggressive chaser
- 👻 **Pink Ghost**: Strategic hunter  
- 👻 **Cyan Ghost**: Ambush specialist
- 👻 **Orange Ghost**: Unpredictable movement

### Items & Environment
- **·** **Small Dots**: Yellow dots (10 points each)
- **⚪** **Power Pellets**: Large pulsing dots (50 points each) - 4 corners
- **█** **Blue Walls**: Maze boundaries and obstacles
- **→←** **Tunnel Indicators**: Show horizontal escape routes

### Visual States
- **Scared Ghosts**: White color with red eyes (during power mode)
- **Flashing Ghosts**: White/blue flashing when power mode ending
- **Eaten Ghosts**: Gray color, frozen for 4 seconds
- **Game Messages**: Power mode activation, ghost eaten, life lost notifications

## 🏆 Pro Tips & Strategies

### 🎯 Scoring Strategies
1. **Power Pellet Timing**: Eat power pellets when multiple ghosts are nearby
2. **Ghost Hunting**: During power mode, chase ghosts for 200 points each
3. **Route Planning**: Clear sections systematically to avoid getting trapped
4. **Speed Advantage**: Use your faster movement to outmaneuver ghosts

### 🛡️ Survival Tactics
1. **Tunnel Usage**: Master the horizontal tunnels for quick escapes
2. **Corner Safety**: Use maze corners and dead ends strategically
3. **Ghost Prediction**: Learn ghost movement patterns (they chase 80% of the time)
4. **Power Mode Management**: 10-second window - make it count!
5. **Respawn Knowledge**: Eaten ghosts freeze for 4 seconds - use this time wisely

## 🔧 Troubleshooting

### C++ Version Issues
- **Compiler not found**: Install MinGW-w64 or Visual Studio
- **Game doesn't start**: Make sure you're running on Windows
- **Display issues**: Try running in full-screen console mode

### Web Version Issues
- **Game doesn't load**: Make sure JavaScript is enabled
- **Controls not working**: Click on the game area first
- **Performance issues**: Close other browser tabs

## 📁 File Structure

### 🎯 Essential Files (Currently Used)
```
Pac Man/
├── script.js           # 🎮 Main game engine (31x31 maze, 4 ghosts, AI, power mode)
├── web_game.html       # 🌐 Primary game interface
├── index.html          # 🏠 Game launcher/menu
├── style.css           # 🎨 Visual styling
├── pacman_game.cpp     # 💻 C++ version source code
├── pacman_game.exe     # ⚙️ Compiled C++ executable
└── README.md           # 📖 This documentation
```

### 🗑️ Legacy Files (Can be removed)
- Various test HTML files (GAME.html, TEST.html, etc.)
- Old JavaScript files (simple_pacman.js)
- Batch files (compile_and_run.bat, start_web_game.bat)

## 🎮 Integration with Games Zone

This Pac-Man game is integrated with the main Games Zone menu. Access it through:
1. Login to your account (`index.html`)
2. Go to Games Zone (`games_area/main_menu.html`)
3. Select "🟡 Pac-Man"
4. Choose your preferred version (C++ or Web)

## 🔧 Technical Specifications

### Web Version Performance
- **Canvas Size**: 620x620 pixels (31x31 grid, 20px per cell)
- **Frame Rate**: ~5 FPS (200ms update interval)
- **Ghost Speed**: 50% of Pac-Man speed (moves every 2 cycles)
- **Power Mode Duration**: 10 seconds (10,000ms)
- **Respawn Delay**: 4 seconds (4,000ms)

### Browser Compatibility
- ✅ Chrome, Firefox, Safari, Edge (modern versions)
- ✅ Mobile browsers (touch controls via buttons)
- ✅ No plugins or installations required

## 🏅 Game Statistics
- **Maze Size**: 31x31 = 961 total cells
- **Collectible Dots**: ~400+ dots and 4 power pellets
- **Maximum Score**: Varies based on ghost hunting efficiency
- **Difficulty**: Adaptive AI with intelligent ghost behavior

Enjoy the enhanced Pac-Man experience! 🟡👻🎮