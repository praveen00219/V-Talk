import { set_color } from "./setColorType";
import { colors } from "../../../config.js/data";

// Read the stored accent, but fall back to the default (cyan) if it isn't one
// of the current cool presets — this migrates users off the old warm palette.
const storedColor = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem("set_color"));
    const isValid = colors.some((c) => c.color === saved);
    return isValid ? saved : colors[0].color;
  } catch {
    return colors[0].color;
  }
})();

const initialstate = {
  themeColor: storedColor,
};

const setColorReducer = (state = initialstate, action) => {
  switch (action.type) {
    case set_color:
      localStorage.setItem("set_color", JSON.stringify(action.payload));
      return {
        ...state,
        themeColor: action.payload,
      };
    default:
      return state;
  }
};

export default setColorReducer;
