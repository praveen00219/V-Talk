const rateLimit = require("express-rate-limit");

const common = { standardHeaders: true, legacyHeaders: false };

// Brute-force protection for credential endpoints (login/register/reset).
const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { message: "Too many attempts. Please try again later." },
});

// Tight cap for endpoints that send email to (possibly arbitrary) addresses,
// to prevent using the server as a spam/email-bombing relay.
const emailLimiter = rateLimit({
  ...common,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { message: "Too many requests. Please try again later." },
});

// Coarse limiter for the whole API surface.
const apiLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  max: 600,
});

module.exports = { authLimiter, emailLimiter, apiLimiter };
