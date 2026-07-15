import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineStar } from "react-icons/ai";
import UserList from "./UserList";
import { selectChatAction } from "../Redux/Reducer/Chat/chat.action";
import { getAllChats } from "../Redux/Reducer/Message/message.action";

// Starred conversations: chats the user favourited via the ☆ in the chat list.
const Favourite = () => {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState();

  const chat = useSelector((globalState) => globalState.chat.chats);
  const loggedUser = useSelector((globalState) => globalState.user.userDetails);
  const result = useSelector((globalState) => globalState.chat.selectedChat);

  const favouriteIds = new Set((loggedUser?.favourites || []).map(String));
  const favouriteChats = (chat || []).filter((c) =>
    favouriteIds.has(String(c._id))
  );

  useEffect(() => {
    if (!selectedChat) return;
    dispatch(selectChatAction(selectedChat));
    dispatch(getAllChats(selectedChat));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  return (
    <Wrapper className="favourite-tab dynamic-sidebar">
      <div className="relative chat-menu flex flex-wrap items-center justify-between w-full ">
        <div>
          <h2 className="text-2xl m-0">Favourites</h2>
          <p>Your starred conversations</p>
        </div>
        <div className="icon text-right"></div>
      </div>
      {favouriteChats.length === 0 ? (
        <div className="empty p-6 text-center">
          <AiOutlineStar className="empty-icon mx-auto mb-2" />
          <p className="m-0 mb-1 font-medium">No favourites yet</p>
          <p className="hint text-xs m-0">
            Open the Chats tab and click the star on any conversation to pin it
            here.
          </p>
        </div>
      ) : (
        <UserList
          query=""
          searchOpen={false}
          chatList={favouriteChats}
          chat={favouriteChats}
          loggedUser={loggedUser}
          result={result}
          setSelectedChat={setSelectedChat}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  animation: fadeInLeft 1s;
  .empty {
    color: ${({ theme }) => theme.colors.heading};
    .empty-icon {
      font-size: 2rem;
      color: ${({ theme }) => theme.colors.warning};
    }
    .hint {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

export default Favourite;
