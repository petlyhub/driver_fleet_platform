const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/driver_fleet';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Driver Schema
const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { 
    type: String, 
    required: true, 
    match: [/^05\d{8}$/, 'Phone must be in format 05xxxxxxxx'] 
  },
  nationalId: { 
    type: String, 
    required: true, 
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: 'National ID must be 10 digits'
    }
  },
  city: { 
    type: String, 
    required: true, 
    enum: ['الرياض', 'جدة', 'مكة', 'المدينة', 'الدمام', 'الخبر', 'الطائف', 'أبها', 'القصيم', 'تبوك'] 
  },
  region: { type: String, required: true },
  district: { type: String },
  vehicleType: { 
    type: String, 
    required: true, 
    enum: ['سيارة', 'دباب', 'فان', 'شاحنة صغيرة'] 
  },
  vehicleModel: { type: String, required: true },
  vehiclePlateNumber: { type: String, required: true },
  vehicleYear: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['pending', 'under_review', 'approved', 'rejected'] 
  },
  createdAt: { type: Date, default: Date.now }
});

const Driver = mongoose.model('Driver', driverSchema);

// Simple session storage (in production, use proper session management)
const sessions = new Map();

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const sessionId = Math.random().toString(36).substring(2);
    sessions.set(sessionId, { authenticated: true, timestamp: Date.now() });
    
    res.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      sessionId 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'كلمة المرور غير صحيحة' 
    });
  }
});

// Verify session middleware
const verifySession = (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ 
      success: false, 
      message: 'غير مصرح - يرجى تسجيل الدخول' 
    });
  }
  
  const session = sessions.get(sessionId);
  // Check if session is older than 24 hours
  if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
    sessions.delete(sessionId);
    return res.status(401).json({ 
      success: false, 
      message: 'انتهت الجلسة - يرجى تسجيل الدخول مرة أخرى' 
    });
  }
  
  next();
};

// Get dashboard statistics
app.get('/api/admin/stats', verifySession, async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();
    const pendingCount = await Driver.countDocuments({ status: 'pending' });
    const underReviewCount = await Driver.countDocuments({ status: 'under_review' });
    const approvedCount = await Driver.countDocuments({ status: 'approved' });
    const rejectedCount = await Driver.countDocuments({ status: 'rejected' });
    
    res.json({
      success: true,
      data: {
        totalDrivers,
        pendingCount,
        underReviewCount,
        approvedCount,
        rejectedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register driver
app.post('/api/drivers/register', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      nationalId,
      city,
      region,
      district,
      vehicleType,
      vehicleModel,
      vehiclePlateNumber,
      vehicleYear
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !nationalId || !city || !region || !vehicleType || !vehicleModel || !vehiclePlateNumber || !vehicleYear) {
      return res.status(400).json({ 
        success: false, 
        message: 'جميع الحقول المطلوبة يجب تعبئتها' 
      });
    }

    // Create new driver
    const driver = new Driver({
      fullName,
      email,
      phone,
      nationalId,
      city,
      region,
      district,
      vehicleType,
      vehicleModel,
      vehiclePlateNumber,
      vehicleYear
    });

    await driver.save();

    res.status(201).json({
      success: true,
      message: 'تم تسجيل السائق بنجاح',
      data: driver
    });
  } catch (error) {
    console.error('Error registering driver:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'البريد الإلكتروني مسجل مسبقاً' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ أثناء التسجيل، يرجى المحاولة لاحقاً' 
    });
  }
});

// Get all drivers (for admin)
app.get('/api/drivers', verifySession, async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update driver status
app.put('/api/drivers/:id/status', verifySession, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'حالة غير صالحة' 
      });
    }
    
    const driver = await Driver.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!driver) {
      return res.status(404).json({ 
        success: false, 
        message: 'السائق غير موجود' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'تم تحديث الحالة بنجاح',
      data: driver 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
app.post('/api/admin/logout', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
  }
  res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
