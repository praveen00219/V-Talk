const User = require("../models/userModel.js");
const { getTodayKey, getEffectiveLimits } = require("../config/planLimits.js");

// Quota logic never reads message content (which may be E2EE ciphertext) —
// it only counts send events and attachment counts.

const getTodayUsage = (user, today) =>
  user.usage && user.usage.day === today
    ? {
        messagesSent: user.usage.messagesSent || 0,
        filesShared: user.usage.filesShared || 0,
      }
    : { messagesSent: 0, filesShared: 0 }; // day rolled over → counts read as 0

// Runs AFTER protect, BEFORE multer — rejections never write temp files.
const checkMessageQuota = (req, res, next) => {
  // blocked users cannot send at all (403, distinct from quota 429)
  if (req.user.isBlocked) {
    return res.status(403).json({
      message: "Your account has been blocked by the administrator.",
      code: "ACCOUNT_BLOCKED",
      success: false,
    });
  }

  const today = getTodayKey();
  const limits = getEffectiveLimits(req.user);
  const used = getTodayUsage(req.user, today);

  if (limits.messages !== null && used.messagesSent >= limits.messages) {
    return res.status(429).json({
      message: `Daily message limit reached (${limits.messages}/day). Upgrade to Premium or try again tomorrow.`,
      code: "MESSAGE_LIMIT_REACHED",
      limit: limits.messages,
      used: used.messagesSent,
      plan: limits.plan,
      success: false,
    });
  }

  req.quota = { today, limits, used }; // reused inside sendMessage
  next();
};

// Called inside sendMessage after multer populated req.files.
// Returns a 429 payload when over the file limit, else null.
const checkFileQuota = (req, fileCount) => {
  const { limits, used } = req.quota;
  if (
    fileCount > 0 &&
    limits.files !== null &&
    used.filesShared + fileCount > limits.files
  ) {
    return {
      message: `Daily file limit reached (${limits.files}/day). ${Math.max(
        0,
        limits.files - used.filesShared
      )} remaining today.`,
      code: "FILE_LIMIT_REACHED",
      limit: limits.files,
      used: used.filesShared,
      plan: limits.plan,
      success: false,
    };
  }
  return null;
};

// Increment counters ONLY after Message.create succeeded.
// Two-step conditional update: matched-day $inc, else $set a fresh day bucket.
// Tolerated race: two concurrent "first sends of a new day" can both take the
// $set branch and one increment is lost — acceptable here. (Strict alternative:
// retry the $inc once after a day-guarded $set fails to match.)
const recordUsage = async (userId, filesCount = 0) => {
  const today = getTodayKey();
  const inc = { "usage.messagesSent": 1 };
  if (filesCount > 0) {
    inc["usage.filesShared"] = filesCount;
  }
  const result = await User.updateOne(
    { _id: userId, "usage.day": today },
    { $inc: inc }
  );
  if (result.matchedCount === 0) {
    // first send today (or legacy doc without usage)
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          usage: { day: today, messagesSent: 1, filesShared: filesCount },
        },
      }
    );
  }
};

module.exports = { checkMessageQuota, checkFileQuota, recordUsage };
