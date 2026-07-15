// =============================================================================
// V-Talk design tokens + theme factory
// -----------------------------------------------------------------------------
// One source of truth for the cool blue/cyan identity shared by the landing
// page, the auth flow and the chat interface. Themes are built from the
// user-selected accent color (Redux `setColorReducer.themeColor`) so that
// customization flows everywhere (CTAs, gradients, focus rings, scrollbars).
//
// NOTE: every token name that already existed in App.js is preserved for
// backward-compatibility (no component refactors required) — we only ADD.
// =============================================================================

// ---- shared scales (independent of mode + accent) --------------------------
export const media = { mobile: "800px", tab: "998px" };

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4.5rem",
};

export const radius = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "1rem",
  xl: "1.5rem",
  pill: "999px",
};

export const motion = {
  fast: "0.15s",
  base: "0.25s",
  slow: "0.4s",
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// ---- helpers ---------------------------------------------------------------
// "rgb(28, 157, 234)" -> "28, 157, 234"
const rgbList = (rgbString) => {
  const m = String(rgbString || "").match(/\(([^)]+)\)/);
  return m ? m[1].trim() : "28, 157, 234";
};

// darken a "r, g, b" list by a factor (used to build the accent gradient end)
const darken = (list, f = 0.78) =>
  list
    .split(",")
    .map((n) => Math.max(0, Math.round(parseFloat(n) * f)))
    .join(", ");

// derive the full accent token set from the picked color
const accentTokens = (accentColor) => {
  const list = rgbList(accentColor); // "28, 157, 234"
  const dark = darken(list);
  return {
    solid: `rgb(${list})`,
    rgb: list,
    soft: `rgba(${list}, 0.12)`,
    softer: `rgba(${list}, 0.06)`,
    ring: `rgba(${list}, 0.45)`,
    gradient: `linear-gradient(145deg, rgb(${list}), rgb(${dark}))`,
  };
};

// semantic feedback colors (shared by both modes) — vivid versions, meant for
// icons, dots and tinted badge backgrounds where they're paired with a
// low-opacity fill, not used as standalone text on a plain page background.
const semantic = {
  success: "#16a34a",
  successRgb: "22, 163, 74",
  warning: "#f59e0b",
  warningRgb: "245, 158, 11",
  info: "#1ca9fe",
  infoRgb: "28, 157, 234",
  danger: "#ff4e2b",
  dangerRgb: "255, 78, 43",
};

// "on-surface" text-safe variants of the semantic colors: the vivid values
// above fail WCAG AA (~3.3:1) as small text directly on a light background,
// so light mode gets darker, accessible shades here; dark mode's near-black
// background already gives the vivid colors plenty of contrast, so it just
// reuses them unchanged.
const lightSemanticText = {
  successText: "#15803d",
  dangerText: "#b91c1c",
};
const darkSemanticText = {
  successText: semantic.success,
  dangerText: semantic.danger,
};

// =============================================================================
// Light theme
// =============================================================================
export const makeLightTheme = (accentColor) => {
  const accent = accentTokens(accentColor);
  return {
    colors: {
      heading: "rgb(24 24 29)",
      heading2: "rgb(255, 255, 255)",
      white: "#fff",
      black: " #212529",
      cyan: "#1ca9fe",
      green: "#4eac6d",
      danger: semantic.danger,
      light: "#223645",
      primaryRgb: `${accentColor}`,

      // new unified accent token set (derived from picker)
      accent,
      ...semantic,
      ...lightSemanticText,

      text: {
        primary: "#000000",
        secondary: "rgba(29 ,29, 29, .8)",
        muted: "rgba(29, 29, 29, 0.55)",
      },

      rgb: {
        primary: accent.rgb, // scrollbars / glows follow accent
        secondary: "78,172,109",
        cyan: "28,157,234",
        heading: "0,0,0",
      },

      bg: {
        primary: "#fff",
        secondary: "#eff7fe",
        elevated: "#ffffff",
        muted: "#f5f8fc",
      },
      bg2: {
        primary: "#fff",
        secondary: "rgba(28,157,234,.05)",
      },

      btn: {
        primary: "28, 157, 234",
        secondary: "22 163 74",
        danger: "255, 78, 43",
        light: "#f6f6f9",
      },
      btnlight: "#f6f6f9",
      border2: {
        primary: "#00000026",
      },
      boxShadow: {
        primary: `rgba(${accent.rgb}, 0.22)`,
      },
      shadow: {
        sm: "0 1px 2px rgba(15, 34, 58, 0.08)",
        md: "0 6px 18px rgba(15, 34, 58, 0.10)",
        lg: "0 18px 40px rgba(15, 34, 58, 0.16)",
      },

      hr: "#ffffff",
      border: "239, 241, 242",
      img_border: "255, 255, 255",
      gradient: accent.gradient,
      gradientStrong: accent.gradient,
      gradientSubtle: `linear-gradient(180deg, rgba(${accent.rgb},0.08), rgba(${accent.rgb},0.04))`,
      glass: "rgba(255, 255, 255, 0.72)",
    },
    media,
    spacing,
    radius,
    motion,
  };
};

// =============================================================================
// Dark theme
// =============================================================================
export const makeDarkTheme = (accentColor) => {
  const accent = accentTokens(accentColor);
  return {
    colors: {
      heading: "rgb(255, 255, 255)",
      heading2: "rgb(24 24 29)",
      white: "#ffffff",
      black: "#000000",
      cyan: "#1ca9fe",
      green: "#4eac6d",
      danger: semantic.danger,
      light: "#223645",
      primaryRgb: `${accentColor}`,

      accent,
      ...semantic,
      ...darkSemanticText,

      text: {
        // was "#212529" (near-black) — invisible against every dark
        // background in this theme; primary body text must be light here.
        primary: "rgba(255, 255, 255, 0.92)",
        secondary: "#8f9198",
        muted: "rgba(255, 255, 255, 0.55)",
      },

      rgb: {
        primary: accent.rgb,
        secondary: "78,172,109",
        cyan: "28,157,234",
        heading: "255,255,255",
      },

      bg: {
        black: "#000000",
        primary: "#0f1320",
        secondary: "#171c2c",
        elevated: "#1b2133",
        muted: "#141826",
      },
      border2: {
        primary: "#FFFFFF26",
      },

      bg2: {
        primary: "#0c1631",
        secondary: "#0e1b38",
      },
      boxShadow: {
        primary: `rgba(${accent.rgb}, 0.42)`,
      },
      shadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
        md: "0 8px 24px rgba(0, 0, 0, 0.45)",
        lg: "0 20px 48px rgba(0, 0, 0, 0.55)",
      },

      btn: {
        primary: "28, 157, 234",
        secondary: "22 163 74",
        danger: "255, 78, 43",
        light: "#25262c",
      },
      btnlight: "#25262c",

      hr: "#ffffff",
      border: "65, 66, 72",
      img_border: "31, 41, 55",
      gradient: accent.gradient,
      gradientStrong: accent.gradient,
      gradientSubtle: `linear-gradient(180deg, rgba(${accent.rgb},0.16), rgba(${accent.rgb},0.08))`,
      glass: "rgba(20, 26, 44, 0.66)",
    },
    media,
    spacing,
    radius,
    motion,
  };
};
