// Display-only mirror of server/config/planLimits.js — keep in sync manually.
// The server's 429 payload carries the authoritative limit values.
export const FREE_DEFAULTS = { messages: 50, files: 5 };

// same local-date key the server uses for daily quota buckets
export const getTodayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
