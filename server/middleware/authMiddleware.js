const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const { JWT_SECRET } = require("../config/keys.js");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, JWT_SECRET);

      // only "auth" tokens may access protected APIs (not verify/reset tokens)
      if (decoded.purpose !== "auth") {
        res.status(401);
        throw new Error("Not authorized, invalid token type");
      }

      const user = await User.findById(decoded.id).select("-password");

      // user may have been deleted after the token was issued
      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // invalidate tokens issued before the password was last changed
      if (
        user.passwordChangedAt &&
        decoded.iat * 1000 < user.passwordChangedAt.getTime()
      ) {
        res.status(401);
        throw new Error("Not authorized, please log in again");
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(res.statusCode === 200 ? 401 : res.statusCode);
      throw new Error(error.message || "Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
