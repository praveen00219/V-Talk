const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getmyself,
  uploadProfileImage,
  verifyEmail,
  resendVerificationLink,
  forgotPassword,
  updateProfile,
  resetPassword,
  invitingUser,
} = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const { imageUpload } = require("../utils/upload.js");
const {
  authLimiter,
  emailLimiter,
} = require("../middleware/rateLimiters.js");

const router = express.Router();

router.route("/").post(authLimiter, registerUser).get(protect, allUsers);
router.route("/getmyself").get(protect, getmyself);
router.route("/login").post(authLimiter, authUser);
router
  .route("/resend/verificationlink")
  .post(emailLimiter, resendVerificationLink);
router.route("/verify").put(verifyEmail);
router.route("/forgotpassword").post(emailLimiter, forgotPassword);
router.route("/resetpassword").post(authLimiter, resetPassword);
router.route("/updateprofile").put(protect, updateProfile);
router.route("/invitefriends").post(protect, emailLimiter, invitingUser);
router
  .route("/profilepic")
  .put(protect, imageUpload.single("image"), uploadProfileImage);
module.exports = router;
