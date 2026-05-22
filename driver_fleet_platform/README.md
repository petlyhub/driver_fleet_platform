# عالم التوصيل السريع - Driver Fleet Platform

## المتطلبات:
- Node.js 16+
- MongoDB

## التثبيت:
```bash
npm run install:all
```

## التشغيل (Development):
```bash
npm run dev
```

## البناء (Production):
```bash
npm run build
npm start
```

## المتغيرات البيئية:
انظر `.env` للتكوين

| المتغير | الوصف | القيمة الافتراضية |
|---------|--------|-------------------|
| PORT | منفذ الخادم | 5000 |
| NODE_ENV | بيئة التشغيل | development |
| MONGODB_URI | رابط قاعدة البيانات | mongodb://localhost:27017/driver_fleet |
| JWT_SECRET | مفتاح التشفير | your_jwt_secret_key_change_this |

## 🎯 الهدف:
منصة لتسجيل وإدارة السائقين المستقلين في السعودية مع لوحة تحكم للإدارة.

## 📁 هيكل المشروع:
```
driver_fleet_platform/
├── package.json              (في الجذر)
├── server.js                 (ملف Node.js الرئيسي)
├── .env
├── .gitignore
├── README.md
└── client/                   (مجلد React)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── components/
    │       ├── DriverForm.jsx
    │       └── SuccessMessage.jsx
    └── public/
```

## 🔧 التقنيات المستخدمة:
- **Backend**: Node.js, Express.js, Mongoose
- **Frontend**: React, Vite
- **Database**: MongoDB
- **Styling**: Tailwind CSS (via CDN)

## 📊 نموذج البيانات (Driver Schema):
- الاسم الكامل
- البريد الإلكتروني (فريد)
- رقم الجوال (05xxxxxxxx)
- رقم الهوية (10 أرقام)
- المدينة (الرياض، جدة، مكة، المدينة، الدمام، الخبر، الطائف، أبها، القصيم، تبوك)
- المنطقة
- الحي
- نوع المركبة (سيارة، دباب، فان، شاحنة صغيرة)
- موديل المركبة
- رقم اللوحة
- سنة الصنع
- الحالة (pending, under_review, approved, rejected)

## 🌐 API Endpoints:
- `GET /api/health` - فحص صحة الخادم
- `POST /api/drivers/register` - تسجيل سائق جديد
- `GET /api/drivers` - جلب جميع السائقين (للإدارة)

## ⚠️ ملاحظات مهمة:
1. تأكد أن `package.json` في الجذر (Root) - مهم جداً لـ Hostinger
2. `server.js` يجب أن يكون في الجذر أيضاً
3. استخدم `concurrently` لتشغيل Backend و Frontend معاً في التطوير
4. في Production، الـ Backend يخدم ملفات React المبنية
