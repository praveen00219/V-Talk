import axios from "axios";
import SERVER_ACCESS_BASE_URL from "./serverConfig";

// The admin portal keeps its own session, fully separate from the chat user's
// ETalkUser token, so both can coexist in one browser.
const ADMIN_KEY = "ETalkAdmin";

export const getAdminToken = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY))?.token || null;
  } catch (e) {
    return null;
  }
};
export const setAdminSession = (token) =>
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ token }));
export const clearAdminSession = () => localStorage.removeItem(ADMIN_KEY);

const adminAxios = axios.create({ baseURL: SERVER_ACCESS_BASE_URL });

// axios.create() copies axios.defaults at create time, so the chat user's
// global Authorization header can leak in — always overwrite (or remove) it.
adminAxios.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// an admin 401 clears ONLY the admin session; AdminPage then shows the login view
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAdminSession();
      if (window.location.pathname.startsWith("/admin")) {
        window.location.assign("/admin");
      }
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
