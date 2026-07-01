import React from "react";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { TOGGLE_DARKTHEME } from "../Redux/Reducer/Theme/theme.type";

const Toggler = (props) => {
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );
  const dispatch = useDispatch();

  const togglerTheme = () => {
    dispatch({ type: TOGGLE_DARKTHEME });
    if (props && typeof props.setMenuIcon === "function") {
      props.setMenuIcon(false);
    }
  };

  return (
    <Wrapper
      onClick={togglerTheme}
      className={props?.className}
      type="button"
      role="switch"
      aria-checked={darkThemeEnabled}
      aria-label={darkThemeEnabled ? "Switch to light mode" : "Switch to dark mode"}
      title={darkThemeEnabled ? "Light mode" : "Dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={darkThemeEnabled ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="icon-wrap"
        >
          {darkThemeEnabled ? (
            <RiSunLine className="icon" />
          ) : (
            <RiMoonLine className="icon" />
          )}
        </motion.span>
      </AnimatePresence>
    </Wrapper>
  );
};

const Wrapper = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.radius.pill};
  cursor: pointer;
  color: inherit;
  width: 2.4rem;
  height: 2.4rem;
  transition: background-color 0.2s ${({ theme }) => theme.motion.ease};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent.soft};
  }

  .icon-wrap {
    display: inline-flex;
  }
  .icon {
    font-size: 1.25rem;
  }
`;

export default Toggler;
