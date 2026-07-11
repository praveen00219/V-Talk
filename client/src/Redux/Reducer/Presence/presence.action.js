import { SET_ONLINE_USERS, USER_ONLINE, USER_OFFLINE } from "./presence.type";

// full list of visible online user ids (sent by the server on socket setup)
export const setOnlineUsers = (userIds) => {
  return {
    type: SET_ONLINE_USERS,
    payload: userIds || [],
  };
};

export const userOnline = (userId) => {
  return {
    type: USER_ONLINE,
    payload: userId,
  };
};

// payload: { userId, lastSeen } — lastSeen is an ISO string, or null when the
// user hides their status
export const userOffline = (payload) => {
  return {
    type: USER_OFFLINE,
    payload,
  };
};
