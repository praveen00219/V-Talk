// import { fetchUser } from "./chat.action";
import {
  CLEAR_SELECT_CHAT,
  CREATE_CHAT,
  CREATE_GROUP_CHAT,
  FETCH_CHATS,
  FETCH_USER,
  FETCH_USER_CLEAR,
  REMOVE_USER_FROM_GROUP,
  SELECT_CHAT,
  SHOW_USER_LOADING,
  MARK_CHAT_READ_LIVE,
} from "./chat.type";
const initialState = {
  chats: [],
  newUser: [],
  createdChat: {},
  createdGroupChat: {},
  selectedChat: {},
  isUserLoading: false,
  removedUserFromGroup: {},
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CHATS:
      return {
        ...state,
        chats: action.payload,
      };

    case FETCH_USER:
      return {
        ...state,
        newUser: action.payload,
      };

    case FETCH_USER_CLEAR:
      return {
        ...state,
        newUser: [],
      };

    case CREATE_CHAT:
      return {
        ...state,
        createdChat: action.payload,
      };

    case CREATE_GROUP_CHAT:
      return {
        ...state,
        createdGroupChat: action.payload,
      };

    case REMOVE_USER_FROM_GROUP:
      return {
        ...state,
        selectedChat: action.payload,
      };

    case SELECT_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case CLEAR_SELECT_CHAT:
      return {
        ...state,
        selectedChat: action.payload,
      };
    case SHOW_USER_LOADING:
      return {
        ...state,
        isUserLoading: action.payload,
      };

    case MARK_CHAT_READ_LIVE: {
      const { chatId, readerId } = action.payload || {};
      return {
        ...state,
        chats: state.chats.map((c) => {
          if (c._id !== chatId || !c.latestMessage) return c;
          const readBy = c.latestMessage.readBy || [];
          if (readBy.some((id) => String(id) === String(readerId))) return c;
          return {
            ...c,
            latestMessage: {
              ...c.latestMessage,
              readBy: [...readBy, readerId],
            },
          };
        }),
      };
    }

    default:
      return {
        ...state,
      };
  }
};

export default chatReducer;
