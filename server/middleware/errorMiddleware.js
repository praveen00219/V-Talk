const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Multer rejects (file too large / unsupported type) are client errors
  if (err.name === "MulterError" || /Unsupported file type/.test(err.message)) {
    statusCode = 400;
  }

  // Only expose stack traces when explicitly in development
  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: isDev ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
