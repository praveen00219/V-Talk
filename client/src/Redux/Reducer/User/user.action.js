import axios from "axios";
import { CLEAR_USER, INVITE_FRIENDS, SELF, UPDATE_PROFILE } from "./user.type";

const SERVER_ACCESS_BASE_URL = process.env.REACT_APP_SERVER_ACCESS_BASE_URL || "http://localhost:4000";

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
    const payload = error?.response?.data || { message: error.message || "Network error" };
    return dispatch({ type: "ERROR", payload: payload });
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
    const payload = error?.response?.data || { message: error.message || "Network error" };
    return dispatch({ type: "ERROR", payload: payload });
  }
};

export const clearUser = () => async (dispatch) => {
  try {
    return dispatch({ type: CLEAR_USER, payload: {} });
  } catch (error) {
    const payload = error?.response?.data || { message: error.message || "Network error" };
    return dispatch({ type: "ERROR", payload: payload });
  }
};
