const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");
const Chat = require("../models/chatModel.js");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId, deletedFor: { $ne: req.user._id } })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    0;
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @description    Toggle reaction for a message for current user
// @route          PUT /api/message/:messageId/react
// @access         Protected
const toggleReaction = asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  const { messageId } = req.params;

  if (!emoji) {
    return res.status(400).json({ message: "emoji is required" });
  }

  let message = await Message.findById(messageId).populate("chat");
  if (!message) return res.status(404).json({ message: "Message not found" });

  // find if user already reacted
  const existing = message.reactions.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (existing) {
    if (existing.emoji === emoji) {
      // remove reaction
      message.reactions = message.reactions.filter(
        (r) => r.user.toString() !== req.user._id.toString()
      );
    } else {
      // update emoji
      existing.emoji = emoji;
    }
  } else {
    message.reactions.push({ user: req.user._id, emoji });
  }

  await message.save();
  message = await Message.findById(messageId)
    .populate("sender", "name pic email")
    .populate("chat");

  res.json(message);
});

// @description    Delete a message for current user (hide locally)
// @route          PUT /api/message/:messageId/deleteForMe
// @access         Protected
const deleteForMe = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  let message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: "Message not found" });

  if (!message.deletedFor.map((id) => id.toString()).includes(req.user._id.toString())) {
    message.deletedFor.push(req.user._id);
  }
  await message.save();
  message = await Message.findById(messageId)
    .populate("sender", "name pic email")
    .populate("chat");
  res.json(message);
});

// @description    Sender deletes message for everyone
// @route          DELETE /api/message/:messageId
// @access         Protected
const deleteForEveryone = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  let message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ message: "Message not found" });

  if (message.sender.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Only sender can delete for everyone" });
  }

  message.isDeletedForEveryone = true;
  message.deletedAt = new Date();
  message.content = ""; // optional: keep empty content

  await message.save();
  message = await Message.findById(messageId)
    .populate("sender", "name pic email")
    .populate("chat");
  res.json(message);
});

module.exports = { allMessages, sendMessage, toggleReaction, deleteForMe, deleteForEveryone };
