const logging = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    console.log(`[${new Date().toISOString()}] ${logLevel} ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = logging;