const express = require('express');
const cocktailService = require('../services/cocktailService');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

router.get('/health/detailed', async (req, res) => {
  try {
    // Test API connectivity
    const testStart = Date.now();
    await cocktailService.makeRequest('/random.php');
    const apiResponseTime = Date.now() - testStart;

    const cacheStats = cocktailService.getCacheStats();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      api: {
        status: 'connected',
        responseTime: `${apiResponseTime}ms`
      },
      cache: cacheStats,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime()
    });
  }
});

module.exports = router;