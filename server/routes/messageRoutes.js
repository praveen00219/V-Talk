const express = require("express");
const {
  allMessages,
  sendMessage,
  toggleReaction,
  deleteForMe,
  deleteForEveryone,
} = require("../controllers/messageControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const { attachmentUpload } = require("../utils/upload.js");

const router = express.Router();

router
  .route("/")
  .post(protect, attachmentUpload.array("attachments", 10), sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/:messageId/react").put(protect, toggleReaction);
router.route("/:messageId/deleteForMe").put(protect, deleteForMe);
router.route("/:messageId").delete(protect, deleteForEveryone);
module.exports = router;
