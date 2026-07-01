// Single source of truth for the backend base URL used by both REST (axios)
// and the realtime socket. Override per-environment with
// REACT_APP_SERVER_ACCESS_BASE_URL (set in client/.env). Falls back to local dev.
const SERVER_ACCESS_BASE_URL =
  process.env.REACT_APP_SERVER_ACCESS_BASE_URL || "http://localhost:4000";

export default SERVER_ACCESS_BASE_URL;
