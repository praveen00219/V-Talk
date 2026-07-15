import { SET_WALLPAPER, SET_WALLPAPER_DIM } from "./wallpaper.type";

const STORAGE_KEY = "vtalk_wallpaper";
// matches the app's original hardcoded chat background, so nothing changes
// visually for existing users until they pick something else
const DEFAULT_STATE = { mode: "pattern", url: "/images/pattern-05.png", dim: 0 };

const loadStored = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object" && saved.mode) {
      return { ...DEFAULT_STATE, ...saved };
    }
  } catch (e) {
    // ignore malformed storage
  }
  return DEFAULT_STATE;
};

const persist = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage full or unavailable (e.g. a large custom image) — keep the
    // choice working for this session even if it can't be saved
  }
};

const initialState = loadStored();

const wallpaperReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLPAPER: {
      const next = {
        ...state,
        mode: action.payload.mode,
        url: action.payload.url || "",
      };
      persist(next);
      return next;
    }
    case SET_WALLPAPER_DIM: {
      const next = { ...state, dim: action.payload };
      persist(next);
      return next;
    }
    default:
      return state;
  }
};

export default wallpaperReducer;
