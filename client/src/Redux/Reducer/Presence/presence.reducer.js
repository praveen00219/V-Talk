import { SET_ONLINE_USERS, USER_ONLINE, USER_OFFLINE } from "./presence.type";

const initialState = {
  onlineUserIds: [],
  // live lastSeen overrides received via socket; a null value means the user
  // hides their lastSeen. Wins over the fetch-time snapshot on chat.users.
  lastSeenById: {},
};

const presenceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ONLINE_USERS:
      return {
        ...state,
        onlineUserIds: [...action.payload],
      };

    case USER_ONLINE: {
      const { [action.payload]: removed, ...lastSeenById } = state.lastSeenById;
      return {
        ...state,
        onlineUserIds: state.onlineUserIds.includes(action.payload)
          ? state.onlineUserIds
          : [...state.onlineUserIds, action.payload],
        lastSeenById,
      };
    }

    case USER_OFFLINE: {
      const { userId, lastSeen } = action.payload || {};
      if (!userId) {
        return state;
      }
      return {
        ...state,
        onlineUserIds: state.onlineUserIds.filter((id) => id !== userId),
        lastSeenById: { ...state.lastSeenById, [userId]: lastSeen || null },
      };
    }

    default:
      return state;
  }
};

export default presenceReducer;
