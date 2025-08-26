require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const personnelRoutes = require('./routes/personnel');
const activityRoutes = require('./routes/activityRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Validate environment variables
if (!MONGO_URI || !process.env.JWT_SECRET || !process.env.FRONTEND_URL) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Initialize Express
const app = express();

// 1. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/personnel', personnelRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/alerts', alertRoutes);

// 3. Enhanced Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV
  });
});

// 4. Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connection successful!');
    
    // Start server only after DB connection
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`🌐 Accepting requests from: ${process.env.FRONTEND_URL}`);
      console.log('📡 Available routes:');
      console.log('  - GET    /api/health');
      console.log('  - POST   /api/auth/register');
      console.log('  - POST   /api/auth/login');
      console.log('  - GET    /api/personnel');
      console.log('  - POST   /api/personnel');
      console.log('  - PATCH  /api/personnel/:id');
      console.log('  - DELETE /api/personnel/:id');
      console.log('  - GET    /api/activities');
      console.log('  - POST   /api/activities');
      console.log('  - GET    /api/alerts');
      console.log('  - POST   /api/alerts');
      console.log('  - PATCH  /api/alerts/:id/status');
      console.log('  - DELETE /api/alerts/:id');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// 5. Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Initialize
connectDB();