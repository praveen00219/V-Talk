const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./keys.js");

// purpose scopes a token to one use only ("auth" | "verify" | "reset")
// so a login token cannot be replayed to reset a password, and vice-versa.
const generateToken = (id, tokenValidity = "30d", purpose = "auth") => {
  return jwt.sign({ id, purpose }, JWT_SECRET, {
    expiresIn: tokenValidity,
  });
};

module.exports = generateToken;
