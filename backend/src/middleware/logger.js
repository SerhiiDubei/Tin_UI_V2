/**
 * Simple request logger middleware
 */
export function logger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };
    
    console.log(JSON.stringify(log));
  });
  
  next();
}

export default logger;
