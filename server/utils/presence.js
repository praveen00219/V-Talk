// In-memory presence registry: userId -> { sockets: Set<socketId>, visible: boolean }
// Single-process only (matches current deployment); resets on server restart.
const registry = new Map();

// returns true if this is the user's FIRST live socket
const addSocket = (userId, socketId, visible) => {
  let entry = registry.get(userId);
  const isFirst = !entry;
  if (!entry) {
    entry = { sockets: new Set(), visible };
    registry.set(userId, entry);
  }
  entry.sockets.add(socketId);
  entry.visible = visible;
  return isFirst;
};

// returns { isLast, wasVisible }
const removeSocket = (userId, socketId) => {
  const entry = registry.get(userId);
  if (!entry) {
    return { isLast: false, wasVisible: false };
  }
  entry.sockets.delete(socketId);
  if (entry.sockets.size === 0) {
    registry.delete(userId);
    return { isLast: true, wasVisible: entry.visible };
  }
  return { isLast: false, wasVisible: entry.visible };
};

const isOnline = (userId) => registry.has(userId);

// all currently-connected users, regardless of their visibility setting
// (used by admin stats — admins see reality)
const getOnlineCount = () => registry.size;

// returns false when the user has no live sockets (nothing to broadcast)
const setVisibility = (userId, visible) => {
  const entry = registry.get(userId);
  if (entry) {
    entry.visible = visible;
  }
  return !!entry;
};

const getVisibleOnlineUserIds = () => {
  return [...registry.entries()]
    .filter(([, entry]) => entry.visible)
    .map(([userId]) => userId);
};

module.exports = {
  addSocket,
  removeSocket,
  isOnline,
  getOnlineCount,
  setVisibility,
  getVisibleOnlineUserIds,
};
