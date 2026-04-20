@echo off
chcp 65001 > nul
color 0A
cls

echo ========================================
echo       مرحباً بك في لعبة السيارات
echo ========================================
echo.
echo اختر طريقة اللعب:
echo.
echo 1. اللعب مع واجهة الويب (اختيار السيارة)
echo 2. اللعب مباشرة
echo 3. إدارة المستخدمين
echo 4. خروج
echo.
set /p choice="اختيارك (1-4): "

if "%choice%"=="1" (
    echo.
    echo جاري فتح صفحة تسجيل الدخول...
    start "" "index.html"
    echo.
    echo بعد اختيار السيارة، ارجع هنا واضغط أي زر لبدء اللعبة...
    pause > nul
    start "" "car_game.exe"
) else if "%choice%"=="2" (
    echo.
    echo جاري تشغيل اللعبة...
    start "" "car_game.exe"
) else if "%choice%"=="3" (
    echo.
    echo جاري فتح صفحة إدارة المستخدمين...
    start "" "loge in\users_manager.html"
) else if "%choice%"=="4" (
    exit
) else (
    echo اختيار غير صحيح!
    timeout /t 2 > nul
    goto :eof
)

echo.
echo استمتع باللعبة!
timeout /t 2 > nul
