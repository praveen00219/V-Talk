import axios from "axios";
import { CLEAR_USER, INVITE_FRIENDS, SELF, UPDATE_PROFILE } from "./user.type";
import SERVER_ACCESS_BASE_URL from "../../../config/serverConfig";

export const getMySelf = () => async (dispatch) => {
  try {
    const User = await axios({
      method: "GET",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/getmyself`,
    });
    return dispatch({ type: SELF, payload: { ...User.data.user } });
  } catch (error) {
    return dispatch({ type: "ERROR", payload: error });
  }
};

// updating user profile
export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    const User = await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/updateprofile`,
      data: { ...userData },
    });
    return dispatch({ type: UPDATE_PROFILE, payload: User.data });
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};
// update per-user settings (e.g. the showOnlineStatus privacy toggle)
export const updateUserSettings = (settings) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/settings`,
      data: { ...settings },
    });
    // the endpoint returns the updated user; refresh userDetails without a refetch
    return dispatch({ type: SELF, payload: { userDetails: res.data.user } });
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};

// star/unstar a chat for the Favourites tab
export const toggleFavouriteChat = (chatId) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/chat/favourite/${chatId}`,
    });
    // endpoint returns the updated user; refresh userDetails in place
    return dispatch({ type: SELF, payload: { userDetails: res.data.user } });
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};

// block/unblock another user (personal block list)
export const toggleBlockUser = (userId) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/block/${userId}`,
    });
    dispatch({ type: SELF, payload: { userDetails: res.data.user } });
    return {
      success: true,
      message: res.data.message,
      blocked: res.data.blocked,
    };
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    dispatch({ type: "ERROR", payload });
    return { error: true, data: payload };
  }
};

// Inviting User
export const inviteNewUser = (email) => async (dispatch) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${SERVER_ACCESS_BASE_URL}/api/user/invitefriends`,
      data: { email },
    });
    return dispatch({ type: INVITE_FRIENDS, payload: res.data });
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};

export const clearUser = () => async (dispatch) => {
  try {
    return dispatch({ type: CLEAR_USER, payload: {} });
  } catch (error) {
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};
