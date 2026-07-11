const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const { isAdmin } = require("../middleware/adminMiddleware.js");
const {
  listUsers,
  getStats,
  updateSubscription,
  setBlocked,
  resetUsage,
  deleteUser,
} = require("../controllers/adminControllers.js");

const router = express.Router();

// every admin route requires a valid auth token AND the admin role
router.use(protect);
router.use(isAdmin);

router.route("/users").get(listUsers);
router.route("/stats").get(getStats);
router.route("/users/:id/subscription").put(updateSubscription);
router.route("/users/:id/block").put(setBlocked);
router.route("/users/:id/reset-usage").put(resetUsage);
router.route("/users/:id").delete(deleteUser);

module.exports = router;
