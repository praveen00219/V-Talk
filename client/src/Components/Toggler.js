import React from "react";
import { useState } from "react";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { TOGGLE_DARKTHEME } from "../Redux/Reducer/Theme/theme.type";

const Toggler = (props) => {
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );
  const [toggle, setToggle] = useState(darkThemeEnabled);
  const dispatch = useDispatch();

  const togglerTheme = () => {
    dispatch({ type: TOGGLE_DARKTHEME });
    setToggle(!darkThemeEnabled);
    if (props && typeof props.setMenuIcon === "function") {
      props.setMenuIcon(false);
    }
  };
  return (
    <Wrapper onClick={togglerTheme} className={props?.className}>
      {toggle === false ? (
        <RiMoonLine className="icon" />
      ) : (
        <RiSunLine className="icon" />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
`;

export default Toggler;
