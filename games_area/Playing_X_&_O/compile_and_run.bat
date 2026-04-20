@echo off
echo ================================
echo    X and O Game - C++ Version
echo ================================
echo.

echo Compiling C++ game...
g++ -o Playing_X_&_O.exe Playing_X_&_O.cpp

if %ERRORLEVEL% EQU 0 (
    echo Compilation successful!
    echo.
    echo Starting X and O Game...
    echo.
    Playing_X_&_O.exe
) else (
    echo.
    echo Compilation failed!
    echo Make sure you have a C++ compiler installed.
    echo.
    echo You can install MinGW-w64 or use Visual Studio.
    echo.
)

echo.
echo Press any key to exit...
pause > nul