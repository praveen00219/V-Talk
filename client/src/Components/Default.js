import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Searchbar from "./Searchbar";
import UserList from "./UserList";
import {
  clearSelectChatAction,
  selectChatAction,
  createChat,
  fetchChats,
  fetchUser,
  fetchUserClear,
  markChatAsRead,
} from "../Redux/Reducer/Chat/chat.action";
import { getAllChats } from "../Redux/Reducer/Message/message.action";
import { inviteNewUser } from "../Redux/Reducer/User/user.action";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Group from "./modal/Group";

const isEmail = (text) => /^\S+@\S+\.\S+$/.test((text || "").trim());

const Default = () => {
  const [query, setQuary] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useDispatch();

  const [selectedChat, setSelectedChat] = useState();
  const [chatList, setchatList] = useState([]);
  const [creating, setCreating] = useState(false);
  const [inviting, setInviting] = useState(false);

  const chat = useSelector((globalState) => globalState.chat.chats);
  const loggedUser = useSelector((globalState) => globalState.user.userDetails);
  const result = useSelector((globalState) => globalState.chat.selectedChat);
  const peopleRaw = useSelector((globalState) => globalState.chat.newUser);
  const peopleLoading = useSelector(
    (globalState) => globalState.chat.isUserLoading
  );

  useEffect(() => {
    setchatList(chat);
  }, [chat]);

  useEffect(() => {
    // dispatch(clearSelectChatAction());
    // if (selectedChat ? dispatch(getAllChats(selectedChat._id)) : "")

    dispatch(selectChatAction(selectedChat));
    // console.log(selectedChat);

    dispatch(getAllChats(selectedChat));
    if (selectedChat?._id) {
      dispatch(markChatAsRead(selectedChat._id));
    }

    // alert(selectedChat._id)
  }, [selectedChat]);

  // unified search: while typing, also look up people to start new chats with
  // (or invite by email); debounced so we don't hit the API per keystroke
  useEffect(() => {
    if (!searchOpen || !query.trim()) {
      dispatch(fetchUserClear());
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchUser(query.trim()));
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchOpen]);

  // users already in a 1-on-1 chat show up in the conversation list above,
  // so the People section only offers genuinely new contacts
  const existingPartnerIds = new Set(
    (chat || [])
      .filter((c) => !c.isGroupChat)
      .flatMap((c) => (c.users || []).map((u) => u._id))
  );
  const people = (peopleRaw || []).filter(
    (u) => !existingPartnerIds.has(u._id)
  );
  const showInvite =
    searchOpen &&
    isEmail(query) &&
    !peopleLoading &&
    (peopleRaw || []).length === 0;

  const startChat = async (item) => {
    if (creating) return;
    setCreating(true);
    await dispatch(createChat(item._id));
    await dispatch(fetchChats());
    setCreating(false);
    toast.success(`Chat started with ${item.name}`);
    setSearchOpen(false);
    setQuary("");
  };

  const sendInvite = async () => {
    const email = query.trim();
    setInviting(true);
    const res = await dispatch(inviteNewUser(email));
    setInviting(false);
    if (res?.type === "ERROR") {
      toast.error(res.payload?.message || "Could not send the invitation");
    } else if (res?.payload?.success === false) {
      toast.info(res.payload.message);
    } else {
      toast.success(`Invitation sent to ${email}`);
    }
  };

  return (
    <Wrapper className="default dynamic-sidebar">
      <div className="chat-menu flex flex-wrap items-center justify-between w-full  ">
        {searchOpen ? (
          <> </>
        ) : (
          <>
            <div>
              <h1 className=" text-2xl m-0">Chat</h1>
              <p className=" text-gray-400 mb-0">Start New Conversation</p>
            </div>
          </>
        )}

        <div
          className={
            searchOpen
              ? "flex justify-center items-center w-full"
              : "flex justify-center items-center"
          }
        >
          <Searchbar
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            setQuary={setQuary}
          />
          <Group />
        </div>
      </div>

      {/* User list  */}
      <UserList
        query={query}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        chatList={chatList}
        loggedUser={loggedUser}
        result={result}
        setSelectedChat={setSelectedChat}
        people={searchOpen && query.trim() ? people : []}
        peopleLoading={searchOpen && query.trim() ? peopleLoading : false}
        onStartChat={startChat}
        inviteEmail={showInvite ? query.trim() : null}
        onInvite={sendInvite}
        inviting={inviting}
      />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  animation: fadeInLeft 1s;
  .group-icon {
    &:hover {
      background-color: ${({ theme }) => theme.colors.bg.secondary};
      color: ${({ theme }) => theme.colors.primaryRgb};
    }
  }
`;
export default Default;
