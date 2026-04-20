# ❌⭕ X and O Game (Tic-Tac-Toe)

A complete implementation of the classic Tic-Tac-Toe game with both C++ console version and advanced web version featuring AI opponent.

## 🎮 Game Features

### 🤖 Intelligent AI Opponent with 4 Difficulty Levels
- **Easy (50% Optimal)** 😊: Perfect for beginners - AI makes random moves half the time
- **Medium (70% Optimal)** 🙂: Balanced challenge - AI blocks obvious wins, good for learning
- **Hard (90% Optimal)** 😤: Serious challenge - AI plays strategically with minimal mistakes
- **Expert (100% Optimal)** 🤯: Ultimate challenge - Perfect minimax algorithm, nearly unbeatable

### 👥 Multiple Game Modes
- **vs AI**: Challenge our smart AI opponent with 4 difficulty levels
- **vs Player**: Play with a friend on the same device
- **Mode Selection**: Easy switching between game modes
- **Difficulty Selection**: Choose AI challenge level before playing

### 📊 Advanced Statistics
- **Game Tracking**: Tracks wins, losses, and ties
- **Persistent Stats**: Statistics saved between sessions
- **Performance Analytics**: Detailed game statistics

## 🕹️ How to Play

### Game Rules
1. **Objective**: Get 3 X's or O's in a row (horizontal, vertical, or diagonal)
2. **Turn-based**: Players alternate placing their marks
3. **Win Conditions**: First to get 3 in a row wins
4. **Tie Game**: If board fills with no winner, it's a tie

### Controls
- **Web Version**: Click on cells or use number keys (1-9)
- **C++ Version**: Enter coordinates (A1, B2, C3, etc.)
- **Keyboard Shortcuts**: 
  - `R` - Reset game
  - `ESC` - Go back/close modal
  - `1-9` - Select cell (web version)

## 🚀 Getting Started

### Option 1: Web Version (Recommended)

1. **Start Game**:
   ```
   Open: olly_one_or_two/olly_one_or_two.html
   Choose: vs AI or vs Player
   If vs AI: Select difficulty level (Easy/Medium/Hard/Expert)
   ```

2. **Direct Play**:
   ```
   Open: Playing_X_&_O.html
   (Uses last selected mode)
   ```

### Option 2: C++ Console Version

1. **Compile and Run**:
   ```bash
   # Method 1: Use batch file
   compile_and_run.bat
   
   # Method 2: Manual compilation
   g++ -o Playing_X_&_O.exe Playing_X_&_O.cpp
   Playing_X_&_O.exe
   ```

2. **Requirements**:
   - Windows OS (uses Windows.h)
   - C++ compiler (MinGW-w64 or Visual Studio)

## 🎯 AI Difficulty System

### 😊 Easy Level (50% Optimal Play)
- **Target Audience**: Complete beginners and children
- **AI Behavior**: Makes random moves 50% of the time
- **Strategy**: Basic blocking of obvious wins
- **Thinking Time**: 300ms (quick decisions)
- **Win Chance**: High - great for building confidence

### 🙂 Medium Level (70% Optimal Play)
- **Target Audience**: Learning players
- **AI Behavior**: Strategic play with occasional mistakes
- **Strategy**: Blocks obvious wins, makes good moves most of the time
- **Thinking Time**: 500ms (moderate thinking)
- **Win Chance**: Fair - balanced challenge

### 😤 Hard Level (90% Optimal Play)
- **Target Audience**: Experienced players
- **AI Behavior**: Strategic play with minimal errors
- **Strategy**: Advanced tactics, rarely makes mistakes
- **Thinking Time**: 800ms (careful consideration)
- **Win Chance**: Low - requires careful planning

### 🤯 Expert Level (100% Optimal Play)
- **Target Audience**: Masters and AI challengers
- **AI Behavior**: Perfect minimax algorithm
- **Strategy**: Always makes the mathematically best move
- **Thinking Time**: 1200ms (deep analysis)
- **Win Chance**: Nearly impossible - best outcome is a tie

## 🎯 Game Modes Explained

### 🤖 vs AI Mode with Difficulty Levels
- **Easy (50%)**: AI makes random moves half the time - perfect for beginners
- **Medium (70%)**: AI blocks obvious wins and plays strategically most of the time
- **Hard (90%)**: AI plays strategically with minimal mistakes - serious challenge
- **Expert (100%)**: Perfect minimax algorithm - nearly impossible to beat
- **Adaptive Thinking**: Higher difficulties take longer to "think"
- **Visual Feedback**: Difficulty level shown during AI turns

### 👥 vs Player Mode
- **Local Multiplayer**: Two players on same device
- **Turn Indication**: Clear visual feedback for current player
- **Fair Play**: Equal opportunity for both players
- **Social Gaming**: Perfect for friends and family

## 🏗️ Technical Implementation

### Web Version Architecture
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **AI Engine**: Minimax algorithm with alpha-beta pruning
- **State Management**: LocalStorage for persistent data
- **Responsive Design**: Works on desktop and mobile
- **Performance**: Optimized for smooth gameplay

### C++ Version Features
- **Console Interface**: Clean text-based UI
- **Smart AI**: Same minimax algorithm as web version
- **Input Validation**: Robust error handling
- **Cross-platform**: Windows-focused but adaptable

### AI Algorithm Details
```cpp
// Minimax with depth optimization
int minimax(board, depth, isMaximizing) {
    if (winner) return score - depth;  // Prefer faster wins
    if (tie) return 0;
    
    // Recursive evaluation of all possible moves
    for each empty cell {
        simulate move
        score = minimax(new_board, depth+1, !isMaximizing)
        undo move
        update best_score
    }
    return best_score;
}
```

## 🎨 Visual Design

### Modern UI Elements
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Visual Feedback**: Clear indication of game state

### Game Board Design
- **3x3 Grid**: Classic tic-tac-toe layout
- **Interactive Cells**: Hover effects and click feedback
- **Winning Animation**: Highlights winning combination
- **Color Coding**: X (red) and O (blue) with distinct styling

## 📊 Statistics & Analytics

### Tracked Metrics
- **Games Played**: Total number of completed games
- **Win Rate**: Percentage of games won
- **X Wins**: Number of victories as X player
- **O Wins**: Number of victories as O player
- **Ties**: Number of tied games

### Data Persistence
- **LocalStorage**: Statistics saved in browser
- **Session Continuity**: Stats persist between visits
- **Reset Option**: Clear statistics when needed

## 🔧 File Structure

```
Playing_X_&_O/
├── Playing_X_&_O.cpp          # C++ game engine
├── Playing_X_&_O.html         # Main game interface
├── Playing_X_&_O.css          # Game styling
├── Playing_X_&_O.js           # Game logic & AI with difficulty levels
├── compile_and_run.bat        # C++ compilation script
├── olly_one_or_two/           # Mode selection
│   ├── olly_one_or_two.html   # Mode selection page
│   ├── olly_one_or_two.css    # Selection styling
│   └── olly_one_or_two.js     # Selection logic
├── Levels_AI/                 # AI difficulty selection
│   ├── Levels_AI.html         # Difficulty selection page
│   ├── Levels_AI.css          # Difficulty styling
│   └── Levels_AI.js           # Difficulty logic
└── README.md                  # This documentation
```

## 🎮 Integration with Games Zone

Access through the main games menu:
1. Login to your account
2. Go to Games Zone (`games_area/main_menu.html`)
3. Select "❌⭕ X and O"
4. Choose your preferred mode

## 🏆 Strategy Tips

### Winning Strategies
1. **Center Control**: Start with center cell when possible
2. **Corner Priority**: Corners offer more winning combinations
3. **Block Opponent**: Always block opponent's winning moves
4. **Fork Creation**: Create multiple winning threats simultaneously

### Against AI Tips
1. **Learn Patterns**: AI is consistent - learn its responses
2. **Force Ties**: Perfect play against perfect AI results in ties
3. **Opening Moves**: Experiment with different opening strategies
4. **Stay Alert**: One mistake against AI usually means defeat

## 🔄 Future Enhancements

### Planned Features
- **Online Multiplayer**: Play against remote opponents
- **Tournament Mode**: Best-of-series gameplay
- **Custom Themes**: Different visual styles
- **Sound Effects**: Audio feedback for moves
- **Replay System**: Review previous games
- **AI Personalities**: Different AI playing styles beyond difficulty

### Technical Improvements
- **Mobile App**: Native mobile versions
- **Cloud Sync**: Cross-device statistics
- **AI Personalities**: Different AI playing styles
- **Performance Metrics**: Detailed analytics

Enjoy the classic game of X and O with modern enhancements! ❌⭕🎮