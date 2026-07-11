// Subscription plan defaults for daily send quotas. null = unlimited.
const PLAN_DEFAULTS = {
  free: { messages: 50, files: 5 },
  premium: { messages: null, files: null },
};

// "YYYY-MM-DD" in the server's local timezone (quota days reset at server midnight)
const getTodayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

// Per-user override wins; null/undefined falls back to the plan default.
// 0 is a legal override ("cannot send"), so compare with != null — never ||.
const getEffectiveLimits = (user) => {
  const plan = PLAN_DEFAULTS[user.plan] ? user.plan : "free";
  return {
    plan,
    messages:
      user.messageLimit != null
        ? user.messageLimit
        : PLAN_DEFAULTS[plan].messages,
    files: user.fileLimit != null ? user.fileLimit : PLAN_DEFAULTS[plan].files,
  };
};

module.exports = { PLAN_DEFAULTS, getTodayKey, getEffectiveLimits };
