const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
module.exports = router;
