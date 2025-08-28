const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    // reactions will store one reaction per user
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: { type: String },
      },
    ],
    // deletedFor stores users who have deleted this message for themselves
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // if sender deletes for everyone
    isDeletedForEveryone: { type: Boolean, default: false },
    deletedAt: { type: Date },
    // attachments: files/photos sent with the message
    attachments: [
      {
        url: { type: String },
        publicId: { type: String },
        resourceType: { type: String },
        format: { type: String },
        bytes: { type: Number },
        width: { type: Number },
        height: { type: Number },
        originalFilename: { type: String },
        mimeType: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
