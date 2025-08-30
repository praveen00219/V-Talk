import axios from "axios";
import {
  SEND_MESSAGE,
  GET_ALL_MESSAGE,
  UPDATE_GET_ALL_MESSAGE,
  SHOW_TOOGLE_LOADING,
  SHOW_NETWORK_ERROR,
  UPDATE_MESSAGE,
  REMOVE_MESSAGE,
} from "./message.type";

const SERVER_ACCESS_BASE_URL = "https://v-talk-backend.onrender.com";

// get all messages
export const getAllChats = (selectedChat) => async (dispatch) => {
  try {
    dispatch(loadingToggleAction(true));
    const allMessage = await axios({
      method: "GET",
      url: `${SERVER_ACCESS_BASE_URL}/api/message/${selectedChat._id}`,
    });
    dispatch(loadingToggleAction(false));
    // console.log(allMessage);
    return dispatch({ type: GET_ALL_MESSAGE, payload: allMessage.data });
  } catch (error) {
    dispatch(showNetworkError(true));
    return dispatch({ type: "ERROR", payload: error });
  }
  //   }
};

// updateing get all message
export const updateGetAllChats = (messageRecived) => async (dispatch) => {
  try {
    // console.log(messageRecived);
    if (!messageRecived.sender) {
      return;
    }
    const updatedAllMessage = messageRecived;
    return dispatch({
      type: UPDATE_GET_ALL_MESSAGE,
      payload: updatedAllMessage,
    });
  } catch (error) {
    dispatch(showNetworkError(true));
    return dispatch({ type: "ERROR", payload: error });
  }
};

// send message (supports attachments)
export const sendMessge = (messageData) => async (dispatch) => {
  try {
    // messageData can include: chatId (required), content (optional), attachments (FileList or Array<File>)
    const { chatId, content, attachments } = messageData || {};
    const hasFiles = attachments && (attachments.length || attachments.size);

    let data;
    let headers = {};

    if (hasFiles) {
      const form = new FormData();
      form.append("chatId", chatId);
      if (content !== undefined && content !== null)
        form.append("content", content);
      // attachments may be FileList or array
      const filesArray = Array.from(attachments);
      filesArray.forEach((file) => form.append("attachments", file));
      data = form;
      // Do NOT set Content-Type manually; let axios set the multipart boundary automatically
    } else {
      data = { chatId, content };
    }

    const newMessage = await axios({
      method: "POST",
      url: `${SERVER_ACCESS_BASE_URL}/api/message`,
      data,
      headers,
    });

    return dispatch({ type: SEND_MESSAGE, payload: newMessage.data });
  } catch (error) {
    dispatch(showNetworkError(true));
    return dispatch({ type: "ERROR", payload: error });
  }
};

// clear all message
export const clearSelectedMessage = () => async (dispatch) => {
  try {
    return dispatch({
      type: "CLEAR_ALL_MESSAGE",
      payload: "",
    });
  } catch (error) {
    dispatch(showNetworkError(true));
    return dispatch({ type: "ERROR", payload: error });
  }
};

export const loadingToggleAction = (state) => {
  return {
    type: SHOW_TOOGLE_LOADING,
    payload: state,
  };
};

export const showNetworkError = (state) => {
  return {
    type: SHOW_NETWORK_ERROR,
    payload: state,
  };
};

// NEW: update a single message in store (from socket or API)
export const setUpdatedMessage = (message) => async (dispatch) => {
  try {
    return dispatch({ type: UPDATE_MESSAGE, payload: message });
  } catch (error) {
    return dispatch({ type: "ERROR", payload: error });
  }
};

// NEW: remove a message from local store
export const removeMessageLocal = (messageId) => async (dispatch) => {
  try {
    return dispatch({ type: REMOVE_MESSAGE, payload: messageId });
  } catch (error) {
    return dispatch({ type: "ERROR", payload: error });
  }
};

// NEW: toggle reaction
export const reactToMessage = (messageId, emoji) => async (dispatch) => {
  try {
    const res = await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/message/${messageId}/react`,
      data: { emoji },
    });
    dispatch({ type: UPDATE_MESSAGE, payload: res.data });
    return res.data;
  } catch (error) {
    return dispatch({ type: "ERROR", payload: error });
  }
};

// NEW: delete for me
export const deleteMessageForMe = (messageId) => async (dispatch) => {
  try {
    await axios({
      method: "PUT",
      url: `${SERVER_ACCESS_BASE_URL}/api/message/${messageId}/deleteForMe`,
    });
    // remove locally
    dispatch({ type: REMOVE_MESSAGE, payload: messageId });
    return messageId;
  } catch (error) {
    return dispatch({ type: "ERROR", payload: error });
  }
};

// NEW: delete for everyone (sender)
export const deleteMessageForEveryone = (messageId) => async (dispatch) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${SERVER_ACCESS_BASE_URL}/api/message/${messageId}`,
    });
    dispatch({ type: UPDATE_MESSAGE, payload: res.data });
    return res.data;
  } catch (error) {
    dispatch(showNetworkError(true));
    const payload = error?.response?.data || {
      message: error.message || "Network error",
    };
    return dispatch({ type: "ERROR", payload: payload });
  }
};
