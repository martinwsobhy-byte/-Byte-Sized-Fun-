#include <iostream>
#include <vector>
#include <random>
#include <algorithm>
#include <windows.h>

using namespace std;

class TicTacToe {
private:
    vector<vector<char>> board;
    char currentPlayer;
    bool gameMode; // true = vs AI, false = vs Player
    
public:
    TicTacToe() : board(3, vector<char>(3, ' ')), currentPlayer('X'), gameMode(true) {}
    
    void setGameMode(bool vsAI) {
        gameMode = vsAI;
    }
    
    void displayBoard() {
        system("cls");
        cout << "\n  === X and O Game ===\n\n";
        cout << "     1   2   3\n";
        cout << "   +---+---+---+\n";
        
        for (int i = 0; i < 3; i++) {
            cout << " " << (char)('A' + i) << " | ";
            for (int j = 0; j < 3; j++) {
                cout << board[i][j] << " | ";
            }
            cout << "\n   +---+---+---+\n";
        }
        
        cout << "\nCurrent Player: " << currentPlayer << "\n";
        if (gameMode) {
            cout << "Mode: Player vs AI\n";
        } else {
            cout << "Mode: Player vs Player\n";
        }
    }
    
    bool makeMove(int row, int col) {
        if (row < 0 || row > 2 || col < 0 || col > 2 || board[row][col] != ' ') {
            return false;
        }
        
        board[row][col] = currentPlayer;
        return true;
    }
    
    bool checkWin() {
        // Check rows
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != ' ') {
                return true;
            }
        }
        
        // Check columns
        for (int j = 0; j < 3; j++) {
            if (board[0][j] == board[1][j] && board[1][j] == board[2][j] && board[0][j] != ' ') {
                return true;
            }
        }
        
        // Check diagonals
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') {
            return true;
        }
        if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') {
            return true;
        }
        
        return false;
    }
    
    bool isBoardFull() {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    return false;
                }
            }
        }
        return true;
    }
    
    pair<int, int> getBestMove() {
        // Simple AI using minimax algorithm
        int bestScore = -1000;
        pair<int, int> bestMove = {-1, -1};
        
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == ' ') {
                    board[i][j] = 'O';
                    int score = minimax(0, false);
                    board[i][j] = ' ';
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {i, j};
                    }
                }
            }
        }
        
        return bestMove;
    }
    
    int minimax(int depth, bool isMaximizing) {
        if (checkWin()) {
            return isMaximizing ? -10 + depth : 10 - depth;
        }
        if (isBoardFull()) {
            return 0;
        }
        
        if (isMaximizing) {
            int bestScore = -1000;
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == ' ') {
                        board[i][j] = 'O';
                        int score = minimax(depth + 1, false);
                        board[i][j] = ' ';
                        bestScore = max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            int bestScore = 1000;
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    if (board[i][j] == ' ') {
                        board[i][j] = 'X';
                        int score = minimax(depth + 1, true);
                        board[i][j] = ' ';
                        bestScore = min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }
    
    void switchPlayer() {
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }
    
    void resetGame() {
        board = vector<vector<char>>(3, vector<char>(3, ' '));
        currentPlayer = 'X';
    }
    
    char getCurrentPlayer() {
        return currentPlayer;
    }
    
    vector<vector<char>> getBoard() {
        return board;
    }
    
    void playGame() {
        cout << "=== Welcome to X and O Game ===\n";
        cout << "Choose game mode:\n";
        cout << "1. Play vs AI\n";
        cout << "2. Play vs Player\n";
        cout << "Enter choice (1 or 2): ";
        
        int choice;
        cin >> choice;
        setGameMode(choice == 1);
        
        while (true) {
            displayBoard();
            
            if (gameMode && currentPlayer == 'O') {
                // AI move
                cout << "AI is thinking...\n";
                Sleep(1000);
                auto aiMove = getBestMove();
                makeMove(aiMove.first, aiMove.second);
            } else {
                // Human move
                cout << "Enter your move (e.g., A1, B2, C3): ";
                string input;
                cin >> input;
                
                if (input.length() != 2) {
                    cout << "Invalid input! Press Enter to continue...";
                    cin.ignore();
                    cin.get();
                    continue;
                }
                
                int row = toupper(input[0]) - 'A';
                int col = input[1] - '1';
                
                if (!makeMove(row, col)) {
                    cout << "Invalid move! Press Enter to continue...";
                    cin.ignore();
                    cin.get();
                    continue;
                }
            }
            
            if (checkWin()) {
                displayBoard();
                cout << "\n🎉 Player " << currentPlayer << " wins! 🎉\n";
                break;
            }
            
            if (isBoardFull()) {
                displayBoard();
                cout << "\n🤝 It's a tie! 🤝\n";
                break;
            }
            
            switchPlayer();
        }
        
        cout << "\nPlay again? (y/n): ";
        char playAgain;
        cin >> playAgain;
        if (tolower(playAgain) == 'y') {
            resetGame();
            playGame();
        }
    }
};

int main() {
    TicTacToe game;
    game.playGame();
    return 0;
}