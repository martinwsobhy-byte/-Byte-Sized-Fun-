// متغيرات اللعبة
let canvas, ctx;
let gameRunning = false;
let animationId;

// إعدادات اللاعب
let playerCar = {
    type: 'sedan',
    color: '#ff0000',
    x: 0,
    y: 0,
    width: 40,
    height: 70,
    speed: 5
};

// إعدادات اللعبة
let gameState = {
    score: 0,
    distance: 0,
    speed: 1,
    maxSpeed: 1,
    roadSpeed: 3,
    obstacleSpeed: 3
};

// الطريق والعقبات
let roadLines = [];
let obstacles = [];
let roadWidth = 500;
let laneWidth = roadWidth / 5;  // 5 حارات
let lastObstacleY = -200;  // آخر موضع Y لعقبة تم إنشاؤها

//  إعدادات المسافة بين العقبات (تتغير حسب الصعوبة)
let MIN_OBSTACLE_DISTANCE = 180;  // الحد الأدنى
let MAX_OBSTACLE_DISTANCE = 280;  // الحد الأقصى
let MIN_OBSTACLES_PER_ROW = 2;
let MAX_OBSTACLES_PER_ROW = 4;

// تحميل إعدادات الصعوبة
function loadDifficultySettings() {
    const difficulty = localStorage.getItem('gameDifficulty') || 'normal';
    
    const settings = {
        easy: {
            MIN_OBSTACLE_DISTANCE: 700,
            MAX_OBSTACLE_DISTANCE: 800,
            MIN_OBSTACLES_PER_ROW: 1,
            MAX_OBSTACLES_PER_ROW: 2,
            INITIAL_SPEED: 2  // ضعف السرعة الأصلية (كان 1)
        },
        normal: {
            MIN_OBSTACLE_DISTANCE: 550,
            MAX_OBSTACLE_DISTANCE: 700,
            MIN_OBSTACLES_PER_ROW: 2,
            MAX_OBSTACLES_PER_ROW: 3,
            INITIAL_SPEED: 4 // ضعف السرعة الأصلية (كان 2)
        },
        hard: {
            MIN_OBSTACLE_DISTANCE: 400,
            MAX_OBSTACLE_DISTANCE: 550,
            MIN_OBSTACLES_PER_ROW: 2,
            MAX_OBSTACLES_PER_ROW: 3,
            INITIAL_SPEED: 6 // ضعف السرعة الأصلية (كان 3)
        },
        expert: {
            MIN_OBSTACLE_DISTANCE: 300,
            MAX_OBSTACLE_DISTANCE: 400,
            MIN_OBSTACLES_PER_ROW: 3,
            MAX_OBSTACLES_PER_ROW: 4,
            INITIAL_SPEED:  8   // ضعف السرعة الأصلية (كان 4)
        }
    };
    
    const selected = settings[difficulty];
    MIN_OBSTACLE_DISTANCE = selected.MIN_OBSTACLE_DISTANCE;
    MAX_OBSTACLE_DISTANCE = selected.MAX_OBSTACLE_DISTANCE;
    MIN_OBSTACLES_PER_ROW = selected.MIN_OBSTACLES_PER_ROW;
    MAX_OBSTACLES_PER_ROW = selected.MAX_OBSTACLES_PER_ROW;
    gameState.speed = selected.INITIAL_SPEED;
    gameState.roadSpeed = 6 * selected.INITIAL_SPEED;  // ضعف السرعة (كان 3)
    gameState.obstacleSpeed = 6 * selected.INITIAL_SPEED;  // ضعف السرعة (كان 3)
}

// جلب اسم اللاعب
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('playerName').textContent = currentUser.username;
    }
};

// اختيار نوع السيارة
function selectCarType(type) {
    playerCar.type = type;
    
    document.querySelectorAll('.car-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.target.closest('.car-option').classList.add('selected');
}

// اختيار اللون
function selectColor(color) {
    playerCar.color = color;
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.target.classList.add('selected');
}

// بدء اللعبة
function startGame() {
    // تحميل إعدادات الصعوبة
    loadDifficultySettings();
    
    // حفظ اختيارات اللاعب في ملف لـ C++
    saveCarSettings();
    
    // إخفاء شاشة الاختيار وإظهار شاشة اللعبة
    document.getElementById('carSelection').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'flex';
    
    // إعداد Canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    // حجم متكيف مع الشاشة
    const maxW = Math.min(500, window.innerWidth - 40);
    canvas.width = maxW;
    canvas.height = Math.round(maxW * 1.2);
    roadWidth = canvas.width;
    laneWidth = roadWidth / 5;
    
    // إعادة تعيين حالة اللعبة
    gameState = {
        score: 0,
        distance: 0,
        speed: 2,  // ضعف السرعة الأصلية (كان 1)
        maxSpeed: 2,  // ضعف السرعة الأصلية (كان 1)
        roadSpeed: 6,  // ضعف السرعة الأصلية (كان 3)
        obstacleSpeed: 6  // ضعف السرعة الأصلية (كان 3)
    };
    
    // وضع السيارة في الحارة الوسطى (الحارة 2 من 5)
    playerCar.x = 2 * laneWidth + (laneWidth - playerCar.width) / 2;
    playerCar.y = canvas.height - playerCar.height - 50;
    
    // إنشاء خطوط الطريق
    roadLines = [];
    for (let i = 0; i < 10; i++) {
        roadLines.push({
            y: i * 80
        });
    }
    
    // إنشاء العقبات
    obstacles = [];
    lastObstacleY = -200;  // إعادة تعيين المسافة
    
    gameRunning = true;
    gameLoop();
}

// حفظ إعدادات السيارة لـ C++
function saveCarSettings() {
    const settings = {
        type: playerCar.type,
        color: playerCar.color
    };
    localStorage.setItem('carSettings', JSON.stringify(settings));
    
    // حفظ في ملف نصي أيضاً
    const settingsText = `${playerCar.type}\n${playerCar.color}`;
    const blob = new Blob([settingsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'car_settings.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// حلقة اللعبة الرئيسية
function gameLoop() {
    if (!gameRunning) return;
    
    update();
    draw();
    
    animationId = requestAnimationFrame(gameLoop);
}

// تحديث حالة اللعبة
function update() {
    gameState.distance += gameState.roadSpeed;
    gameState.score = Math.floor(gameState.distance / 10);
    
    // زيادة السرعة كل 200 نقطة (أسرع من قبل)
    if (gameState.score > 0 && gameState.score % 200 === 0) {
        gameState.speed += 0.2;  // ضعف الزيادة (كان 0.1)
        gameState.roadSpeed += 1.0;  // ضعف الزيادة (كان 0.5)
        gameState.obstacleSpeed += 1.0;  // ضعف الزيادة (كان 0.5)
        
        if (gameState.speed > gameState.maxSpeed) {
            gameState.maxSpeed = gameState.speed;
        }
    }
    
    // تحديث خطوط الطريق
    roadLines.forEach(line => {
        line.y += gameState.roadSpeed;
        if (line.y > canvas.height) {
            line.y = -80;
        }
    });
    
    // تحديث العقبات
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += gameState.obstacleSpeed;
        
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        } else if (checkCollision(playerCar, obstacles[i])) {
            gameOver();
        }
    }
    
    // تحديث موضع آخر عقبة
    lastObstacleY += gameState.obstacleSpeed;
    
    // إنشاء عقبات جديدة بناءً على المسافة
    // نحسب المسافة من آخر عقبة تم إنشاؤها
    if (lastObstacleY >= MIN_OBSTACLE_DISTANCE) {
        // إذا وصلنا للحد الأقصى، ننشئ عقبة حتماً
        if (lastObstacleY >= MAX_OBSTACLE_DISTANCE) {
            createObstacle();
            lastObstacleY = 0;
        } 
        // إذا كنا بين الحد الأدنى والأقصى، ننشئ بشكل عشوائي
        else if (Math.random() < 0.3) {
            createObstacle();
            lastObstacleY = 0;
        }
    }
    
    // تحديث واجهة المستخدم
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('speed').textContent = gameState.speed.toFixed(1);
    document.getElementById('distance').textContent = Math.floor(gameState.distance);
    
    // تحديث رقم الحارة الحالية
    let currentLane = Math.round(playerCar.x / laneWidth) + 1; // +1 عشان نبدأ من 1 مش 0
    document.getElementById('currentLane').textContent = currentLane;
}

// رسم اللعبة
function draw() {
    // رسم الطريق
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // تحديد الحارة الحالية للاعب
    let currentLane = Math.round(playerCar.x / laneWidth);
    
    // رسم مؤشرات الحارات (علامات على الحارة الحالية)
    for (let i = 0; i < 5; i++) {
        if (i === currentLane) {
            // رسم الحارة الحالية بلون مختلف (أخضر فاتح)
            ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
            ctx.fillRect(i * laneWidth, 0, laneWidth, canvas.height);
            
            // رسم حدود الحارة الحالية
            ctx.fillStyle = '#2ecc71';
            ctx.fillRect(i * laneWidth, 0, 3, canvas.height);
            ctx.fillRect((i + 1) * laneWidth - 3, 0, 3, canvas.height);
        }
    }
    
    // رسم خطوط الطريق (4 خطوط لـ 5 حارات)
    ctx.fillStyle = '#f39c12';
    roadLines.forEach(line => {
        ctx.fillRect(laneWidth - 2, line.y, 4, 40);
        ctx.fillRect(laneWidth * 2 - 2, line.y, 4, 40);
        ctx.fillRect(laneWidth * 3 - 2, line.y, 4, 40);
        ctx.fillRect(laneWidth * 4 - 2, line.y, 4, 40);
    });
    
    // رسم أرقام الحارات في أعلى الشاشة
    ctx.fillStyle = '#ecf0f1';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    for (let i = 0; i < 5; i++) {
        let laneNumber = i + 1;
        let x = i * laneWidth + laneWidth / 2;
        
        if (i === currentLane) {
            // الحارة الحالية بلون أخضر
            ctx.fillStyle = '#2ecc71';
            ctx.font = 'bold 20px Arial';
            
            // رسم سهم يشير للحارة الحالية
            ctx.fillText('▼', x, 45);
        } else {
            // الحارات الأخرى بلون أبيض
            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 16px Arial';
        }
        
        ctx.fillText(laneNumber.toString(), x, 25);
    }
    
    // رسم مؤشر الحارة الحالية في أسفل الشاشة كمان
    ctx.fillStyle = '#2ecc71';
    ctx.font = 'bold 18px Arial';
    let currentLaneX = currentLane * laneWidth + laneWidth / 2;
    ctx.fillText('▲ YOU ARE HERE ▲', currentLaneX, canvas.height - 10);
    
    // رسم العقبات
    obstacles.forEach(obstacle => {
        drawObstacle(obstacle);
    });
    
    // رسم سيارة اللاعب
    drawCar(playerCar);
}

// رسم السيارة
function drawCar(car) {
    ctx.fillStyle = car.color;
    
    if (car.type === 'sedan') {
        ctx.fillRect(car.x, car.y, car.width, car.height);
        ctx.fillStyle = '#333';
        ctx.fillRect(car.x + 5, car.y + 10, car.width - 10, 20);
        ctx.fillRect(car.x + 5, car.y + 40, car.width - 10, 20);
    } else if (car.type === 'suv') {
        ctx.fillRect(car.x, car.y, car.width, car.height);
        ctx.fillStyle = '#333';
        ctx.fillRect(car.x + 5, car.y + 5, car.width - 10, 25);
        ctx.fillRect(car.x + 5, car.y + 40, car.width - 10, 25);
    } else if (car.type === 'sports') {
        ctx.beginPath();
        ctx.moveTo(car.x + car.width * 0.2, car.y);
        ctx.lineTo(car.x + car.width * 0.8, car.y);
        ctx.lineTo(car.x + car.width, car.y + car.height);
        ctx.lineTo(car.x, car.y + car.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.fillRect(car.x + 8, car.y + 15, car.width - 16, 15);
        ctx.fillRect(car.x + 8, car.y + 40, car.width - 16, 15);
    }
}

// رسم العقبة
function drawObstacle(obstacle) {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    ctx.fillStyle = '#333';
    ctx.fillRect(obstacle.x + 5, obstacle.y + 10, obstacle.width - 10, 15);
}

// إنشاء عقبات جديدة (مع ضمان وجود حارة فارغة)
function createObstacle() {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12'];
    
    // إنشاء مصفوفة للحارات (0-4)
    let lanes = [0, 1, 2, 3, 4];
    
    // عدد العقبات حسب الصعوبة
    let numObstacles = Math.floor(Math.random() * (MAX_OBSTACLES_PER_ROW - MIN_OBSTACLES_PER_ROW + 1)) + MIN_OBSTACLES_PER_ROW;
    
    // خلط الحارات عشوائياً
    lanes.sort(() => Math.random() - 0.5);
    
    // إنشاء العقبات في أول numObstacles حارات
    for (let i = 0; i < numObstacles; i++) {
        obstacles.push({
            x: lanes[i] * laneWidth + (laneWidth - 40) / 2,
            y: -70,
            width: 40,
            height: 70,
            color: colors[Math.floor(Math.random() * colors.length)],
            lane: lanes[i]
        });
    }
}

// التحقق من الاصطدام
function checkCollision(car, obstacle) {
    return car.x < obstacle.x + obstacle.width &&
           car.x + car.width > obstacle.x &&
           car.y < obstacle.y + obstacle.height &&
           car.y + car.height > obstacle.y;
}

// تحريك السيارة لليسار
function moveLeft() {
    let currentLane = Math.round(playerCar.x / laneWidth);
    if (currentLane > 0) {
        currentLane--;
        playerCar.x = currentLane * laneWidth + (laneWidth - playerCar.width) / 2;
    }
}

// تحريك السيارة لليمين
function moveRight() {
    let currentLane = Math.round(playerCar.x / laneWidth);
    if (currentLane < 4) {
        currentLane++;
        playerCar.x = currentLane * laneWidth + (laneWidth - playerCar.width) / 2;
    }
}

// التحكم بلوحة المفاتيح
document.addEventListener('keydown', function(e) {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRight();
    }
});

// Touch swipe support
(function() {
    let touchStartX = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.addEventListener('touchend', function(e) {
        if (!gameRunning) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 30) {
            dx > 0 ? moveRight() : moveLeft();
        }
    }, { passive: true });
})();

// نهاية اللعبة
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // حفظ النتيجة في C++
    saveGameScore();
    
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('gameOver').style.display = 'flex';
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalDistance').textContent = Math.floor(gameState.distance);
    document.getElementById('maxSpeed').textContent = gameState.maxSpeed.toFixed(1);
}

// حفظ النتيجة
function saveGameScore() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const scoreData = {
        username: currentUser ? currentUser.username : 'Guest',
        score: gameState.score,
        distance: Math.floor(gameState.distance),
        speed: gameState.maxSpeed.toFixed(1),
        date: new Date().toLocaleString('ar-EG')
    };
    
    // حفظ في localStorage
    let scores = JSON.parse(localStorage.getItem('gameScores')) || [];
    scores.push(scoreData);
    localStorage.setItem('gameScores', JSON.stringify(scores));
    
    // حفظ في ملف لـ C++
    const scoreText = `${scoreData.username}|${scoreData.score}|${scoreData.distance}|${scoreData.speed}|${scoreData.date}\n`;
    const blob = new Blob([scoreText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_scores.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// إعادة اللعب
function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    startGame();
}

// العودة للقائمة
function backToMenu() {
    window.location.href = 'main_menu.html';
}
