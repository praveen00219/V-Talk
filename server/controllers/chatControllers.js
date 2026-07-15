const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel.js");
const User = require("../models/userModel.js");
const Message = require("../models/messageModel.js");
const { isMember, isGroupAdmin } = require("../utils/chatAuth.js");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    // console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    // re-opening a chat un-hides it if this user had deleted it for themselves
    await Chat.updateOne(
      { _id: isChat[0]._id },
      { $pull: { hiddenFor: req.user._id } }
    );
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
      hiddenFor: { $ne: req.user._id },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  // console.log(req);
  // console.log(req.body.name, req.body.users);
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the fields" });
  }

  var users = JSON.parse(req.body.users);
  // console.log(users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    // console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("chat Not Found");
  }
  if (!isMember(chat, req.user._id)) {
    return res.status(403).json({ message: "Not authorized for this chat" });
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("chat Not Found");
  }
  if (!isGroupAdmin(chat, req.user._id)) {
    return res
      .status(403)
      .json({ message: "Only the group admin can modify members" });
  }

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("chat Not Found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("chat Not Found");
  }
  // a group admin can remove anyone; a member may remove only themselves (leave)
  if (
    !isGroupAdmin(chat, req.user._id) &&
    req.user._id.toString() !== String(userId)
  ) {
    return res
      .status(403)
      .json({ message: "Only the group admin can remove other members" });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("chat Not Found");
  } else {
    res.json(removed);
  }
});
//@description     Toggle a chat in the logged-in user's favourites
//@route           PUT /api/chat/favourite/:chatId
//@access          Protected
const toggleFavourite = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  if (!mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({ message: "Invalid chat id", success: false });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found", success: false });
  }
  if (!isMember(chat, req.user._id)) {
    return res
      .status(403)
      .json({ message: "Not a member of this chat", success: false });
  }

  const isFavourite = (req.user.favourites || []).some(
    (id) => String(id) === String(chatId)
  );
  const user = await User.findByIdAndUpdate(
    req.user._id,
    isFavourite
      ? { $pull: { favourites: chatId } }
      : { $addToSet: { favourites: chatId } },
    { new: true }
  ).select("-password");

  return res.status(200).json({
    user,
    message: isFavourite ? "Removed from favourites" : "Added to favourites",
    success: true,
  });
});

//@description     Delete a chat for the current user only (hide + clear history)
//@route           DELETE /api/chat/:chatId
//@access          Protected
const deleteChatForMe = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  if (!mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({ message: "Invalid chat id", success: false });
  }
  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found", success: false });
  }
  if (!isMember(chat, req.user._id)) {
    return res
      .status(403)
      .json({ message: "Not a member of this chat", success: false });
  }

  // hide the conversation and clear its history for THIS user only;
  // a new message in the chat un-hides it for everyone (fresh thread)
  await Promise.all([
    Chat.updateOne({ _id: chatId }, { $addToSet: { hiddenFor: req.user._id } }),
    Message.updateMany(
      { chat: chatId },
      { $addToSet: { deletedFor: req.user._id } }
    ),
  ]);

  return res.status(200).json({ message: "Chat deleted for you", success: true });
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  toggleFavourite,
  deleteChatForMe,
};
