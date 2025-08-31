const express = require('express');
const cors = require('cors');

// Import routes and middleware
const cocktailRoutes = require('./src/routes/cocktailRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const logging = require('./src/middleware/logging');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔧 Starting Cocktail API...');
console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 Port: ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(logging);

// Routes
app.use('/api', cocktailRoutes);
app.use('/api/health', healthRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Cocktail API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🍸 Daily cocktail: http://localhost:${PORT}/api/daily-cocktail`);
  console.log('✅ Server is ready to accept connections');
});
