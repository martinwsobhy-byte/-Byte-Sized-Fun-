// ⚙️ إعدادات اللعبة - يمكنك تعديل هذه القيم حسب رغبتك

const GAME_SETTINGS = {
    // إعدادات الطريق
    ROAD_WIDTH: 500,           // عرض الطريق (بكسل)
    NUM_LANES: 5,              // عدد الحارات
    
    // إعدادات العقبات
    MIN_OBSTACLES_PER_ROW: 2,  // الحد الأدنى لعدد العقبات في كل صف
    MAX_OBSTACLES_PER_ROW: 4,  // الحد الأقصى لعدد العقبات في كل صف
    
    // المسافة بين العقبات (بكسل)
    MIN_OBSTACLE_DISTANCE: 180,  // الحد الأدنى للمسافة (أقرب مسافة)
    MAX_OBSTACLE_DISTANCE: 280,  // الحد الأقصى للمسافة (أبعد مسافة)
    
    // إعدادات السرعة
    INITIAL_SPEED: 1.0,        // السرعة الابتدائية
    SPEED_INCREMENT: 0.1,      // زيادة السرعة
    SPEED_INCREASE_SCORE: 500, // النقاط المطلوبة لزيادة السرعة
    
    // إعدادات السيارة
    CAR_WIDTH: 40,             // عرض السيارة
    CAR_HEIGHT: 70,            // ارتفاع السيارة
    
    // إعدادات النقاط
    POINTS_PER_OBSTACLE: 10,   // النقاط لكل عقبة يتم تجنبها
    
    // ألوان العقبات
    OBSTACLE_COLORS: [
        '#e74c3c',  // أحمر
        '#3498db',  // أزرق
        '#2ecc71',  // أخضر
        '#9b59b6',  // بنفسجي
        '#f39c12'   // برتقالي
    ]
};

// 📝 ملاحظات للتعديل:
// 
// 1. المسافة بين العقبات:
//    - قيمة أقل = عقبات أكثر تقارباً (أصعب)
//    - قيمة أكبر = عقبات أكثر تباعداً (أسهل)
//    - الموصى به: 150-300 بكسل
//
// 2. عدد العقبات في الصف:
//    - MIN: 1-3 (يترك حارات أكثر)
//    - MAX: 3-4 (يترك حارة واحدة على الأقل)
//
// 3. السرعة:
//    - INITIAL_SPEED: 0.5-2.0 (أبطأ إلى أسرع)
//    - SPEED_INCREMENT: 0.05-0.2 (زيادة تدريجية)
//
// 4. عدد الحارات:
//    - 3 حارات: سهل
//    - 5 حارات: متوسط (الحالي)
//    - 7 حارات: صعب

// مثال للصعوبات المختلفة:

// 🟢 سهل
const EASY_MODE = {
    MIN_OBSTACLE_DISTANCE: 250,
    MAX_OBSTACLE_DISTANCE: 350,
    MIN_OBSTACLES_PER_ROW: 1,
    MAX_OBSTACLES_PER_ROW: 3,
    INITIAL_SPEED: 0.8
};

// 🟡 متوسط (الافتراضي)
const NORMAL_MODE = {
    MIN_OBSTACLE_DISTANCE: 180,
    MAX_OBSTACLE_DISTANCE: 280,
    MIN_OBSTACLES_PER_ROW: 2,
    MAX_OBSTACLES_PER_ROW: 4,
    INITIAL_SPEED: 1.0
};

// 🔴 صعب
const HARD_MODE = {
    MIN_OBSTACLE_DISTANCE: 120,
    MAX_OBSTACLE_DISTANCE: 200,
    MIN_OBSTACLES_PER_ROW: 3,
    MAX_OBSTACLES_PER_ROW: 4,
    INITIAL_SPEED: 1.2
};

// 💀 خبير
const EXPERT_MODE = {
    MIN_OBSTACLE_DISTANCE: 100,
    MAX_OBSTACLE_DISTANCE: 150,
    MIN_OBSTACLES_PER_ROW: 3,
    MAX_OBSTACLES_PER_ROW: 4,
    INITIAL_SPEED: 1.5
};

// لتطبيق صعوبة معينة، استبدل قيم GAME_SETTINGS بقيم الصعوبة المطلوبة
// مثال: Object.assign(GAME_SETTINGS, HARD_MODE);
