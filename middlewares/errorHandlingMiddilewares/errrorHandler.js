const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'RateLimitError') {
    return res.status(429).json({ message: err.message });
  }
  
  res.status(500).json({ message: err.message });
};

export default errorHandler;
