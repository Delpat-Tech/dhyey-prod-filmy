const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const storyRouter = require('./routes/storyRoutes');
const searchRouter = require('./routes/searchRoutes');
const adminRouter = require('./routes/adminRoutes');


// Load environment variables
require('dotenv').config({ path: './config.env' });

// Start express app
const app = express();

// app.enable('trust proxy');

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'http://192.168.56.1:3001',
    'https://dhyey.delpat.in',
    'https://api.dhyey.delpat.in',
    'https://dhyey-prod-filmy-frontend.onrender.com',
    'https://dhyey-prod-filmy-6-backend.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files with error handling for missing images
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.url);
  const fs = require('fs');
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, return 404 JSON response instead of HTML error
      return res.status(404).json({
        status: 'fail',
        message: 'Image not found'
      });
    }
    // File exists, serve it normally
    express.static(path.join(__dirname, 'public'))(req, res, next);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter disabled for development
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Ignore root request
app.get('/', (req, res) => res.status(200).json({ message: 'API is running' }));

// Ignore favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Chal Raha hai bhai'
  });
});

// 3) ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/stories', storyRouter);
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/admin', adminRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
