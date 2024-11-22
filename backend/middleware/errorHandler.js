const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const error = {
    message: err.message || '服务器内部错误',
    status: err.status || 500
  };

  // 开发环境返回错误堆栈
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.status).json(error);
};

module.exports = errorHandler; 