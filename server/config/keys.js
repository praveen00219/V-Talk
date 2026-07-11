const dotenv = require("dotenv");
dotenv.config();

const keys = {
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,

  // optional: when BOTH are set, an admin account is created/updated at startup
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  SMPT_SERVICES: process.env.SMPT_SERVICES,
  SMPT_MAIL: process.env.SMPT_MAIL,
  SMPT_PASSWORD: process.env.SMPT_PASSWORD,
  SMPT_HOST: process.env.SMPT_HOST,
  SMPT_PORT: process.env.SMPT_PORT,

  PORT: process.env.PORT,
  CLIENT_ACCESS_URL: process.env.CLIENT_ACCESS_URL || "http://localhost:3000",
};

// Fail fast if critical secrets are missing so we never boot in an insecure state.
const REQUIRED = ["MONGO_URL", "JWT_SECRET"];
const missing = REQUIRED.filter((k) => !keys[k]);
if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(
      ", "
    )}. Copy server/.env.example to server/.env and fill in the values.`
  );
}

module.exports = keys;
