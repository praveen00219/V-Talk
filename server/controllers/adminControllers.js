const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");
const cloudinary = require("../utils/cloudinary.js");
const presence = require("../utils/presence.js");
const { getTodayKey } = require("../config/planLimits.js");

const ADMIN_USER_FIELDS =
  "name email pic contact role plan messageLimit fileLimit isBlocked is_verified usage lastSeen createdAt cloudinary_id";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/users?search=&page=&limit=
const listUsers = asyncHandler(async (req, res) => {
  const search = String(req.query.search || "").trim();
  const { plan, status } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

  const query = search
    ? {
        $or: [
          { name: { $regex: escapeRegex(search), $options: "i" } },
          { email: { $regex: escapeRegex(search), $options: "i" } },
        ],
      }
    : {};
  // optional filters; legacy docs without `plan`/`isBlocked` count as free/active
  if (plan === "premium") query.plan = "premium";
  if (plan === "free") query.plan = { $ne: "premium" };
  if (status === "blocked") query.isBlocked = true;
  if (status === "active") query.isBlocked = { $ne: true };

  const [users, total] = await Promise.all([
    User.find(query)
      .select(ADMIN_USER_FIELDS)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return res.status(200).json({
    // append the live presence flag for the table's online indicator
    users: users.map((u) => ({
      ...u.toObject(),
      online: presence.isOnline(String(u._id)),
    })),
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    success: true,
  });
});

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  // same local-time day basis as the usage day key
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalUsers, premiumUsers, blockedUsers, messagesToday] =
    await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ plan: "premium" }),
      User.countDocuments({ isBlocked: true }),
      Message.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

  return res.status(200).json({
    totalUsers,
    premiumUsers,
    freeUsers: totalUsers - premiumUsers, // counts legacy docs missing `plan`
    blockedUsers,
    messagesToday,
    onlineNow: presence.getOnlineCount(),
    success: true,
  });
});

// blank/null -> null (use plan default); integer >= 0 -> number; else undefined (invalid)
const normalizeLimit = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const n = Number(value);
  if (Number.isInteger(n) && n >= 0) {
    return n;
  }
  return undefined;
};

// shared :id validation + fetch; writes the error response itself and returns null
const findTargetUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: "Invalid user id", success: false });
    return null;
  }
  const user = await User.findById(id).select(ADMIN_USER_FIELDS);
  if (!user) {
    res.status(404).json({ message: "User not found", success: false });
    return null;
  }
  return user;
};

// PUT /api/admin/users/:id/subscription   { plan, messageLimit, fileLimit }
const updateSubscription = asyncHandler(async (req, res) => {
  const target = await findTargetUser(req, res);
  if (!target) return;

  const { plan } = req.body;
  if (!["free", "premium"].includes(plan)) {
    return res.status(400).json({
      message: 'plan must be "free" or "premium"',
      success: false,
    });
  }
  const messageLimit = normalizeLimit(req.body.messageLimit);
  const fileLimit = normalizeLimit(req.body.fileLimit);
  if (messageLimit === undefined || fileLimit === undefined) {
    return res.status(400).json({
      message: "Limits must be blank (plan default) or a whole number >= 0",
      success: false,
    });
  }

  const user = await User.findByIdAndUpdate(
    target._id,
    { plan, messageLimit, fileLimit },
    { new: true, runValidators: true }
  ).select(ADMIN_USER_FIELDS);

  return res
    .status(200)
    .json({ user, message: "Subscription updated", success: true });
});

// PUT /api/admin/users/:id/block   { isBlocked }
const setBlocked = asyncHandler(async (req, res) => {
  const { isBlocked } = req.body;
  if (typeof isBlocked !== "boolean") {
    return res
      .status(400)
      .json({ message: "isBlocked must be a boolean", success: false });
  }
  if (String(req.params.id) === String(req.user._id)) {
    return res
      .status(400)
      .json({ message: "You cannot block your own account", success: false });
  }
  const target = await findTargetUser(req, res);
  if (!target) return;

  const user = await User.findByIdAndUpdate(
    target._id,
    { isBlocked },
    { new: true }
  ).select(ADMIN_USER_FIELDS);

  return res.status(200).json({
    user,
    message: isBlocked ? "User blocked" : "User unblocked",
    success: true,
  });
});

// PUT /api/admin/users/:id/reset-usage
const resetUsage = asyncHandler(async (req, res) => {
  const target = await findTargetUser(req, res);
  if (!target) return;

  const user = await User.findByIdAndUpdate(
    target._id,
    { $set: { usage: { day: getTodayKey(), messagesSent: 0, filesShared: 0 } } },
    { new: true }
  ).select(ADMIN_USER_FIELDS);

  return res.status(200).json({ user, message: "Usage reset", success: true });
});

// DELETE /api/admin/users/:id  — messages/chats intentionally remain
const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) {
    return res
      .status(400)
      .json({ message: "You cannot delete your own account", success: false });
  }
  const target = await findTargetUser(req, res);
  if (!target) return;
  if (target.role === "admin") {
    return res
      .status(400)
      .json({ message: "Admin accounts cannot be deleted", success: false });
  }

  // best-effort profile image cleanup
  if (target.cloudinary_id) {
    try {
      await cloudinary.uploader.destroy(target.cloudinary_id);
    } catch (e) {
      // ignore cleanup errors
    }
  }

  await User.findByIdAndDelete(target._id);
  return res.status(200).json({ message: "User deleted", success: true });
});

module.exports = {
  listUsers,
  getStats,
  updateSubscription,
  setBlocked,
  resetUsage,
  deleteUser,
};
