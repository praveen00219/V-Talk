const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // select: false so the hash is never returned unless explicitly requested
    password: { type: String, required: true, select: false },
    about: { type: String, default: "Hey there! I am using V-Talk" },
    // String, not Number: preserves leading zeros and "+" country codes
    contact: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/002/341/small_2x/man-wearing-sunglasses-avatar-character-isolated-icon-free-vector.jpg",
      //default Image link :  https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg
    },
    cloudinary_id: { type: String },
    is_verified: { type: Boolean, default: false },
    // updated whenever the password changes; used to invalidate older tokens
    passwordChangedAt: { type: Date },
    // privacy: whether others may see this user's online status & last seen
    showOnlineStatus: { type: Boolean, default: true },
    // stamped when the user's last socket disconnects
    lastSeen: { type: Date },
    // E2EE: ECDH P-256 public key (JWK JSON) generated in the user's browser;
    // the matching private key never leaves that browser
    publicKey: { type: String },
    // ---- admin portal + subscription quotas ----
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    // per-user overrides; null = use the plan default (0 = explicitly no sends)
    messageLimit: { type: Number, default: null, min: 0 },
    fileLimit: { type: Number, default: null, min: 0 },
    isBlocked: { type: Boolean, default: false },
    // rolling per-day counters; day is a local-date key "YYYY-MM-DD"
    usage: {
      day: { type: String, default: "" },
      messagesSent: { type: Number, default: 0 },
      filesShared: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // back-date by 1s so a token issued in this same request stays valid
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
