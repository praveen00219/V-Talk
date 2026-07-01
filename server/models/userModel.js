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
