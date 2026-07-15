// Built-in chat wallpaper options. "pattern" tiles a small image (classic
// chat-bubble background); "gradient" and "none" don't need a url — they're
// rendered from the current theme's tokens so they always match the accent
// color and light/dark mode.
export const WALLPAPER_PRESETS = [
  {
    id: "pattern-classic",
    label: "Classic",
    mode: "pattern",
    url: "/images/pattern-05.png",
  },
  {
    id: "pattern-dots",
    label: "Dots",
    mode: "pattern",
    url: "/images/pattern-bg.png",
  },
  {
    id: "gradient",
    label: "Accent tint",
    mode: "gradient",
  },
  {
    id: "none",
    label: "None",
    mode: "none",
  },
];

// custom uploads are capped to keep them well within localStorage's ~5MB quota
export const MAX_WALLPAPER_UPLOAD_BYTES = 2 * 1024 * 1024; // 2MB
