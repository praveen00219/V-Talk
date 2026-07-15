const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  toggleFavourite,
  deleteChatForMe,
} = require("../controllers/chatControllers.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/favourite/:chatId").put(protect, toggleFavourite);
router.route("/:chatId").delete(protect, deleteChatForMe);

module.exports = router;
