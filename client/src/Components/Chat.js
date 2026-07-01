import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import ChatMenu from "./ChatMenu";
import ChatWindow from "./ChatWindow";
import SideMenu from "./SideMenu";
import { ToastContainer} from "react-toastify";
import NetworkError from "./modal/NetworkError";
import { useSelector } from "react-redux";
const Chat = () => {

  const isNetworkError = useSelector((globalstate)=> globalstate.message.NetworkError)
  
  return (
    <NetworkError>
     <ToastContainer />
      <Wrapper className="flex justify-start w-screen">
        <SideMenu />
        <ChatMenu />
        <ChatWindow />
      </Wrapper>
    </NetworkError>
  );
};
const Wrapper = styled.section`
  overflow: hidden;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  transition: background-color 0.4s ${({ theme }) => theme.motion.ease};
`;

export default Chat;
