// Requires protect to have run first (req.user is the sanitized user doc).
// Role is read from the DB per request, so demotion/deletion is instant.
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Admin access required");
};

module.exports = { isAdmin };
