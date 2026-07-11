const User = require("../models/userModel.js");
const { ADMIN_EMAIL, ADMIN_PASSWORD } = require("../config/keys.js");

// Creates/repairs the admin account from env vars at startup. This is the ONLY
// way an admin comes to exist: registration cannot set role, and there is no
// role-change API.
const ensureAdminAccount = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return; // feature off
  }
  if (ADMIN_PASSWORD.length < 8) {
    console.warn(
      "ADMIN_PASSWORD must be at least 8 characters; admin bootstrap skipped."
    );
    return;
  }

  let user = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
  if (!user) {
    user = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // pre-save hook hashes
      contact: "0000000000",
      role: "admin",
      is_verified: true,
      plan: "premium",
    });
    await user.save();
    console.log(`Admin account created: ${ADMIN_EMAIL}`.yellow);
    return;
  }

  let changed = false;
  if (user.role !== "admin") {
    user.role = "admin";
    changed = true;
  }
  if (!user.is_verified) {
    user.is_verified = true;
    changed = true;
  }
  if (user.isBlocked) {
    user.isBlocked = false;
    changed = true;
  }
  // re-set the password only when it actually changed — rehashing on every boot
  // would backdate passwordChangedAt and invalidate the admin's live tokens
  if (!(await user.matchPassword(ADMIN_PASSWORD))) {
    user.password = ADMIN_PASSWORD; // pre-save hook re-hashes
    changed = true;
  }
  if (changed) {
    await user.save(); // MUST be save(), not findByIdAndUpdate (hash hook)
    console.log(`Admin account updated: ${ADMIN_EMAIL}`.yellow);
  }
};

module.exports = ensureAdminAccount;
