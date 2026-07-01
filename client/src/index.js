import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Redux
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import axios from "axios";

if (localStorage.ETalkUser) {
  const { token } = JSON.parse(localStorage.ETalkUser);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Global handling for expired/invalid auth tokens: clear session and send the
// user back to the auth screen instead of silently failing.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("ETalkUser");
      delete axios.defaults.headers.common["Authorization"];
      if (window.location.pathname !== "/auth") {
        window.location.assign("/auth");
      }
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={Store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
