const fs = require("fs/promises");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const jwt = require("jsonwebtoken");

const cloudinary = require("../utils/cloudinary.js");
const sendEmail = require("../utils/sendEmail.js");
const presence = require("../utils/presence.js");

const { JWT_SECRET, CLIENT_ACCESS_URL } = require("../config/keys.js");

const MIN_PASSWORD_LENGTH = 8;
const isStrongPassword = (pw) =>
  typeof pw === "string" && pw.length >= MIN_PASSWORD_LENGTH;

// signup new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, pic } = req.body;

  if (!name || !email || !password || !contact) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      success: false,
    });
  }

  const userExists = await User.findOne({ email });
  const contactExists = await User.findOne({ contact });
  if (userExists) {
    return res.status(400).json({
      message: "Your E-Mail Id is already Registered with V-Talk",
      success: false,
    });
  }
  if (contactExists) {
    return res.status(400).json({
      message: "Your Mobile is already Registered with V-Talk",
      success: false,
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    contact,
    pic,
  });

  if (user) {
    const token = generateToken(user._id, "120s", "verify");
    const url = `${CLIENT_ACCESS_URL}/verify-email/${token}`;
    // console.log(url);
    const options = {
      name: user.name,
      email: user.email,
      subject: "Verify Email",
      verification_Link: url,
      message_Content:
        "<p> Hi " +
        user.name +
        ",<br /> Please verify your V-Talk Account by clicking on the verification link. This Verification link is valid for 2:00 minutes <br /> <a href =" +
        url +
        " >Verify</a></p> ",
    };
    await sendEmail(options);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id, "30d", "auth"),
      message: "An Email is sent to your Email. Please Verify Your Email",
      success: true,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

// Resend verication link
const resendVerificationLink = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(201).json({
        message: "Invalid Email",
      });
      return;
    }

    const token = generateToken(user._id, "120s", "verify");
    const url = `${CLIENT_ACCESS_URL}/verify-email/${token}`;
    const options = {
      name: user.name,
      email: user.email,
      subject: "Verify Email",
      verification_Link: url,
      message_Content:
        "<p> Hi " +
        user.name +
        ",<br /> Please verify your V-Talk Account by clicking on the verification link. This Verification link is valid for 2:00 minutes <br /> <a href =" +
        url +
        " >Verify</a></p> ",
    };
    await sendEmail(options);

    res.status(201).json({
      // verificationURL: url,
      message: `An Email is sent to your Email ${user.email}. Please Verify Your Email`,
    });
  } catch (error) {
    res.status(400).send({ message: "Internal Server Error" });
  }
});

// verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;

    //decodes token id
    const decoded = await jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "verify") {
      return res
        .status(400)
        .send({ message: "Invalid Verification Link", success: false });
    }

    const user = await User.findOne({ _id: decoded.id });
    // console.log(user);
    if (!user) {
      return res.status(400).send({ message: "Invalid link" });
    }
    const data = {
      is_verified: true,
    };
    const updatedUser = await User.findByIdAndUpdate(user._id, data, {
      new: true,
    });

    res.status(200).send({
      message: "Email verified successfully",
      // updatedUser,
      success: true,
    });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Invalid Verification Link", success: false });
  }
});

// sign in user
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password is select:false on the schema, so request it explicitly
  const user = await User.findOne({ email: String(email || "") }).select(
    "+password"
  );

  // generic message avoids leaking which accounts exist
  if (!user || !(await user.matchPassword(password))) {
    return res.status(404).json({
      message: "Invalid Credentials OR User not found",
      success: false,
    });
  }

  // blocked accounts get no token and no verification emails
  if (user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked by the administrator.",
      code: "ACCOUNT_BLOCKED",
      success: false,
    });
  }

  // enforce email verification BEFORE issuing an auth token
  if (!user.is_verified) {
    const token = generateToken(user._id, "120s", "verify");
    const url = `${CLIENT_ACCESS_URL}/verify-email/${token}`;
    const options = {
      name: user.name,
      email: user.email,
      subject: "Verify Email",
      verification_Link: url,
      message_Content:
        "<p> Hi " +
        user.name +
        ",<br /> Please verify your V-Talk Account by clicking on the verification link. This Verification link is valid for 2:00 minutes <br /> <a href =" +
        url +
        " >Verify</a></p> ",
    };
    await sendEmail(options);

    return res.status(403).json({
      message: `Please verify your email first. A new verification link has been sent to ${user.email}.`,
      success: false,
      is_verified: false,
    });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id, "30d", "auth"),
    message: "Login Successful",
    success: true,
  });
});

// Search user
const allUsers = asyncHandler(async (req, res) => {
  try {
    // escape regex metacharacters so user input can't inject a pattern (ReDoS)
    const rawSearch = req.query.search ? String(req.query.search) : "";
    const escaped = rawSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const keyword = escaped
      ? {
          $or: [
            { name: { $regex: escaped, $options: "i" } },
            { email: { $regex: escaped, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
    });
  }
});

// get my self
const getmyself = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.user;
    return res.status(200).json({ user: { userDetails } });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: String(email || "") });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
        success: false,
      });
    }

    const password_Reset_Token = generateToken(user._id, "300s", "reset");
    const password_Reset_URL = `${CLIENT_ACCESS_URL}/reset-password/${password_Reset_Token}`;
    const options = {
      name: user.name,
      email: user.email,
      subject: "Forgot-Password",
      message_Content:
        "<p> Hi " +
        user.name +
        ",<br /> You can Reset your Password by clicking on the Reset password. This password Reset link will be active only for 5:00 minutes <br /> <a href =" +
        password_Reset_URL +
        " >Reset password</a></p> ",
    };

    await sendEmail(options);
    res.status(201).json({
      // passwordResetLink: password_Reset_URL,
      message: `Your Password Reset Link has been sent to your Email ${user.email} . Please check you Spam or Junk Folder.`,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    //decodes token id
    const decoded = await jwt.verify(token, JWT_SECRET);
    if (decoded.purpose !== "reset") {
      return res
        .status(400)
        .send({ message: "Invalid or expired reset link", success: false });
    }

    let user = await User.findOne({ _id: decoded.id }).select("+password");
    if (!user) {
      return res.status(400).send({ message: "Invalid link" });
    }

    // single-use: reject a reset token issued before the last password change
    if (
      user.passwordChangedAt &&
      decoded.iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return res.status(400).send({
        message: "password Reset Link has been expired",
        success: false,
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).send({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        success: false,
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({
      message: "Password changed successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).send({
      message: "password Reset Link has been expired",
      success: false,
    });
  }
});

// update profile name or about status

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, about } = req.body;
    let user = await User.findById(req.user._id).select("-password");
    // console.log(req.user);
    const data = {
      name: name || user.name,
      about: about || user.about,
    };
    user = await User.findByIdAndUpdate(user._id, data, { new: true });
    return res.status(200).json({
      message: "your profile update successfully.",
      // user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// update per-user settings (currently: the showOnlineStatus privacy toggle)
const updateSettings = asyncHandler(async (req, res) => {
  try {
    const { showOnlineStatus } = req.body;
    // explicit boolean check: the "value || user.value" idiom would drop `false`
    if (typeof showOnlineStatus !== "boolean") {
      return res.status(400).json({
        message: "showOnlineStatus must be a boolean",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { showOnlineStatus },
      { new: true }
    ).select("-password");

    // live-flip presence for everyone if the user is currently connected
    const io = req.app.get("io");
    const userId = String(req.user._id);
    if (io && presence.setVisibility(userId, showOnlineStatus)) {
      if (showOnlineStatus) {
        io.emit("user online", userId);
      } else {
        // never leak lastSeen while hidden
        io.emit("user offline", { userId, lastSeen: null });
      }
    }

    return res.status(200).json({
      message: "Settings updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// store the user's E2EE public key (ECDH P-256 JWK, generated in their browser)
const updatePublicKey = asyncHandler(async (req, res) => {
  try {
    const { publicKey } = req.body;
    if (
      typeof publicKey !== "string" ||
      publicKey.length === 0 ||
      publicKey.length > 1024
    ) {
      return res.status(400).json({
        message: "publicKey must be a non-empty string",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { publicKey },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Public key updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// block/unblock another user (personal block list, distinct from admin isBlocked)
const toggleBlockUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user id", success: false });
    }
    if (String(userId) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You cannot block yourself", success: false });
    }
    const target = await User.findById(userId).select("_id");
    if (!target) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const isBlocked = (req.user.blockedUsers || []).some(
      (id) => String(id) === String(userId)
    );
    const user = await User.findByIdAndUpdate(
      req.user._id,
      isBlocked
        ? { $pull: { blockedUsers: userId } }
        : { $addToSet: { blockedUsers: userId } },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      user,
      blocked: !isBlocked,
      message: isBlocked ? "User unblocked" : "User blocked",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

/**
 *  Inviting User
 */

const invitingUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const InvitedUser = await User.findOne({ email });
    // console.log(InvitedUser);
    const senderUser = req.user;
    const websiteUrl = CLIENT_ACCESS_URL;
    // console.log(senderUser);
    if (InvitedUser !== null) {
      return res.status(201).json({
        success: false,
        message: "User Already Exists. You can chat with this user.",
      });
    }

    const options = {
      // name: InvitedUser.name,
      email: email,
      subject: "V-Talk Invitation",
      // verification_Link: url,
      message_Content:
        "<p> Hi " +
        email +
        ",<br /> Your Friend " +
        senderUser.name +
        " is available on the V-Talk. " +
        senderUser.name +
        " is Waitng for you. Please Register yourself and start chatting with " +
        senderUser.name +
        " . Click here to <br /> <a href =" +
        websiteUrl +
        " >Register</a></p> ",
    };

    await sendEmail(options);

    res.status(201).json({
      success: true,
      message: `An Invitation Email is sent to your friend email ${email} `,
    });
  } catch (error) {
    res.status(400).send({ success: false, message: "Internal Server Error" });
  }
});

// upload profile image
const uploadProfileImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    let user = await User.findById(req.user.id);
    // delete exsisting image from cloudinary
    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }

    // upload new image to cloudinary, then remove the multer temp file
    let result;
    try {
      result = await cloudinary.uploader.upload(file.path);
    } finally {
      await fs.unlink(file.path).catch(() => {});
    }

    const data = {
      // name: req.body.name || user.name,
      pic: result.secure_url || user.pic,
      cloudinary_id: result.public_id || user.cloudinary_id,
    };

    user = await User.findByIdAndUpdate(user._id, data, { new: true });
    res.status(200).json({
      message: "image uploaded successfully",
      result,
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  registerUser,
  verifyEmail,
  authUser,
  allUsers,
  getmyself,
  uploadProfileImage,
  resendVerificationLink,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateSettings,
  updatePublicKey,
  toggleBlockUser,
  invitingUser,
};
