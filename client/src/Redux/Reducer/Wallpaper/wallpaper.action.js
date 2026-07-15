import { SET_WALLPAPER, SET_WALLPAPER_DIM } from "./wallpaper.type";

// payload: { mode: "pattern" | "custom" | "gradient" | "none", url?: string }
export const setWallpaper = (payload) => ({
  type: SET_WALLPAPER,
  payload,
});

// payload: number 0-80 (percentage darkness overlay)
export const setWallpaperDim = (payload) => ({
  type: SET_WALLPAPER_DIM,
  payload,
});
