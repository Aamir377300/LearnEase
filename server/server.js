const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');


// Routes
const authRoutes = require('./src/routes/auth.routes');
const courseRoutes = require('./src/routes/course.routes');
const lectureRoutes = require('./src/routes/lecture.routes');
const assignmentRoutes = require('./src/routes/assignment.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const adminRoutes = require('./src/routes/admin.routes');
const chatRoutes = require('./src/routes/chat.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const liveRoutes = require('./src/routes/live.routes');


// Middleware
const { notFound, errorHandler } = require('./src/middleware/error.middleware');


// Config
const { connectDB } = require('./src/config/db');
const { configureCloudinary } = require('./src/config/cloudinary');


dotenv.config();
configureCloudinary();


const app = express();


// Core middleware
const allowedOrigins = [
  'https://edunexus-lms.vercel.app',
  'http://localhost:5173'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));


// Healthcheck
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'edunexus-api' });
});


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/live', liveRoutes);


// ===== ADD THIS NEW ROUTE =====
// Google OAuth Callback Route
app.get('/api/google/oauth/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      return res.status(400).json({ error: `User denied: ${error}` });
    }

    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      }).toString()
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error });
    }

    // Log tokens (save these!)
    console.log('✅ OAuth Success!');
    console.log('Refresh Token:', tokenData.refresh_token);
    console.log('Access Token:', tokenData.access_token);

    res.json({
      success: true,
      message: '✅ Authorization successful!',
      refresh_token: tokenData.refresh_token,
      access_token: tokenData.access_token
    });

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).json({ error: error.message });
  }
});
// ===== END NEW ROUTE =====


// 404 and error handlers
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT;


async function start() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}


start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


module.exports = app;
