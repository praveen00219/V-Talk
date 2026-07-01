// Helpers to enforce that a user is allowed to act on a chat.
// `chat.users` / `chat.groupAdmin` may be raw ObjectIds or populated docs.

const idOf = (ref) => (ref && ref._id ? ref._id : ref);

const isMember = (chat, userId) =>
  !!chat &&
  Array.isArray(chat.users) &&
  chat.users.some((u) => idOf(u).toString() === userId.toString());

const isGroupAdmin = (chat, userId) =>
  !!chat &&
  !!chat.groupAdmin &&
  idOf(chat.groupAdmin).toString() === userId.toString();

module.exports = { isMember, isGroupAdmin };
