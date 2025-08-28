import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { Button } from "../Styles/Button";
import { BiSmile } from "react-icons/bi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import Dropdown from "./Dropdown";
import Picker from "@emoji-mart/react";
import { createRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  getSender,
  getSenderPic,
  isMyMessage,
} from "../HelperFunction/chat.Helper";
import { useDispatch } from "react-redux";
import {
  sendMessge,
  updateGetAllChats,
  setUpdatedMessage,
  reactToMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
} from "../Redux/Reducer/Message/message.action";

import { Dialog, Menu, Transition } from "@headlessui/react";
import UserProfile from "./SlideMenu/UserProfile";
import { MdOutlineArrowBackIos } from "react-icons/md";
import io from "socket.io-client";
import { useRef } from "react";
// import { clearSelectChatAction } from "../Redux/Reducer/Chat/chat.action";
// import { clearSelectChatAction } from "../Redux/Reducer/Chat/chat.action";
import Spinner from "../Styles/Spinner";
import { FiPaperclip, FiX } from "react-icons/fi";
const SERVER_ACCESS_BASE_URL = process.env.REACT_APP_SERVER_ACCESS_BASE_URL;

const ENDPOINT = SERVER_ACCESS_BASE_URL;
var socket, selectedChatCompare;

const ChatWindow = () => {
  const dispatch = useDispatch();
  const inputRef = createRef();

  const messageEndRef = useRef(null);

  // Added: quick emoji list, reaction grouper, and handlers to fix no-undef
  const quickEmojis = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

  // NEW: attachment state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewItems, setPreviewItems] = useState([]);

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // limit to 10 like server
    const limited = files.slice(0, 10);
    setSelectedFiles(limited);

    // build previews for images/videos and generic for others
    const previews = limited.map((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type;
      let kind = "file";
      if (type.startsWith("image/")) kind = "image";
      else if (type.startsWith("video/")) kind = "video";
      return { url, kind, name: file.name, size: file.size, type };
    });
    setPreviewItems(previews);
  };

  const clearSelectedFiles = () => {
    // revoke object URLs
    previewItems.forEach((p) => p.url && URL.revokeObjectURL(p.url));
    setSelectedFiles([]);
    setPreviewItems([]);
    const input = document.getElementById("chat-attachments-input");
    if (input) input.value = "";
  };

  // remove a single selected file
  const removeSelectedFile = (index) => {
    const toRemove = previewItems[index];
    if (toRemove?.url) URL.revokeObjectURL(toRemove.url);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewItems((prev) => prev.filter((_, i) => i !== index));
  };

  const groupReactions = (reactions = []) => {
    const map = new Map();
    reactions.forEach((r) => {
      const key = r.emoji;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([emoji, count]) => ({
      emoji,
      count,
    }));
  };

  // Map a reaction's user id to a display name from the selected chat users
  const getUserNameById = (id) => {
    const uid = typeof id === "string" ? id : id?._id;
    const users = senderUser?.users || [];
    const found = users.find((u) => u._id === uid);
    return found?.name || "Unknown";
  };

  // Group reactions by emoji and collect the list of user display names who reacted with that emoji
  const groupReactionUsers = (reactions = []) => {
    const map = new Map();
    reactions.forEach((r) => {
      const emoji = r.emoji;
      const name = getUserNameById(r.user);
      if (!map.has(emoji)) map.set(emoji, []);
      map.get(emoji).push(name);
    });
    return Array.from(map.entries()).map(([emoji, users]) => ({
      emoji,
      users,
    }));
  };

  // check if the logged-in user has reacted to this message with a given emoji
  const hasMyReaction = (reactions = [], emoji) => {
    const myId = loggedUser?._id;
    return reactions?.some((r) => {
      const uid = typeof r.user === "string" ? r.user : r.user?._id;
      return uid === myId && r.emoji === emoji;
    });
  };

  const onReact = (messageId, emoji) => {
    return dispatch(reactToMessage(messageId, emoji));
  };

  const onDeleteForMe = (messageId) => dispatch(deleteMessageForMe(messageId));
  const onDeleteForEveryone = (messageId) =>
    dispatch(deleteMessageForEveryone(messageId));
  // all the message for a particular chat
  const [message, setMessage] = useState([]);
  // message data require for sending data
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedUserData, setLoggedUserData] = useState(null);
  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    attachment: null,
  });

  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState();

  const senderUser = useSelector(
    (globalState) => globalState.chat.selectedChat
  );

  const loggedUser = useSelector((globalState) => globalState.user.userDetails);
  const theme = useSelector((state) => state.themeReducer.darkThemeEnabled);
  const allMessage = useSelector(
    (globalState) => globalState.message.allMessages
  );
  const createdMessage = useSelector(
    (globalState) => globalState.message.createdMessage
  );

  const loading = useSelector((globalState) => globalState.message.isLoading);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const pickEmoji = (emojiData, event) => {
    const ref = inputRef.current;
    ref.focus();
    const start = newMessage.substring(0, ref.selectionStart);
    const end = newMessage.substring(ref.selectionStart);
    let msg = start + emojiData.native + end;
    setNewMessage(msg);
    setCursorPosition(start.length + emojiData.native.length);
  };

  const userChathidden = () => {
    document.getElementById("user-chat").classList.remove("fadeInRight");
    document.getElementById("user-chat").classList.remove("user-chat-show");
    document.getElementById("user-chat").classList.add("fadeInRight2");
  };

  const closeChat = () => {
    const element = document.querySelectorAll("#chat-box-wrapper");
    element.forEach((element) => {
      element.classList.remove("active");
    });
  };

  const getUserId = () => {
    if (loggedUser._id === sender?.users[0]._id) {
      const arr = sender.users.reverse();
      setUser(arr);
    } else {
      setUser(sender?.users);
    }
  };

  // console.log(user)

  useEffect(() => {
    getUserId();
  });

  //  console.log(sender?.users)

  // for input changing
  const handleChange = (e) => {
    setNewMessage(e.target.value);

    // typing Indicator
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", user[0]._id);
      console.log(typing);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", user[0]._id);
        setTyping(false);
      }
      // console.log(typing);
    }, timerLength);
  };

  // Sending message
  const handleClick = async () => {
    // console.log(newMessage, sender._id);
    // alert("Hello");
    const hasText = newMessage && newMessage.trim().length > 0;
    const hasFiles = selectedFiles && selectedFiles.length > 0;

    if (!hasText && !hasFiles) {
      socket.emit("stop typing", user[0]._id);
      alert("Please type a message or attach at least one file");
      return;
    }
    const messageData = {
      chatId: sender._id,
      content: newMessage,
      ...(hasFiles ? { attachments: selectedFiles } : {}),
    };
    setNewMessage("");
    clearSelectedFiles();
    await dispatch(sendMessge(messageData));
  };
  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.selectionEnd = cursorPosition;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorPosition]);

  useEffect(() => {
    setSender(senderUser);
  }, [senderUser]);

  useEffect(() => {
    socket = io(ENDPOINT, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    socket.emit("setup", loggedUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // listen for message updates (reactions/deletions)
  useEffect(() => {
    const handler = (updatedMessage) => {
      dispatch(setUpdatedMessage(updatedMessage));
    };
    if (socket) socket.on("message updated", handler);
    return () => {
      if (socket) socket.off("message updated", handler);
    };
  }, [dispatch]);

  useEffect(() => {
    const eventHandler = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // we will give notification
        console.log(newMessageRecieved);
      } else {
        setTimeout(() => {
          setCount(count + 1);
        }, 1000);
        // console.log(message);
        dispatch(updateGetAllChats(newMessageRecieved));
        // console.log(message);
      }
    };
    socket.on("message recieved", eventHandler);

    return () => {
      socket.off("message recieved", eventHandler);
    };
  });

  useEffect(() => {
    setSender(senderUser);
  }, [senderUser]);

  useEffect(() => {
    // console.log(sender);
    // dispatch(getAllChats(sender));
    // we will decide we have to give notification to user or render the new msg
    selectedChatCompare = sender;
    // console.log(senderUser);
  }, [sender]);

  useEffect(() => {
    setMessage(allMessage);
    socket.emit("join chat", sender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessage]);

  useEffect(() => {
    // console.log(message);
  }, [message]);

  // for automatic scrolling down last message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [message, newMessage]);

  useEffect(() => {
    socket.emit("new message", createdMessage);
    dispatch(updateGetAllChats(createdMessage));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdMessage]);

  return (
    <Wrapper className="" id="user-chat">
      <div className="chat-window-section">
        {!sender ? (
          <>
            <div className="chat-welcome-section overflow-x-hidden flex justify-center items-center">
              <div className="flex justify-center items-center p-4">
                <div className=" flex flex-col justify-center items-center text-center">
                  <div className="avatar mx-auto mb-4">
                    <div className=" rounded-full">
                      <img
                        src="./images/logo.png"
                        alt="logo"
                        className="w-10"
                      />
                    </div>
                  </div>
                  <h4>Welcome to V-Talk Chat App</h4>
                  <p>Click on user to start chat.</p>
                  {/* <Button>Get Started</Button> */}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="chat-content flex">
              <div className="w-full h-full position-relative">
                {/* user-chat-topbar */}
                <div className="user-chat-topbar p-3 p-lg-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center">
                      <div
                        className="arrow-icon ml-5 mr-5 cursor-pointer text-2xl p-2 rounded-full"
                        onClick={userChathidden}
                      >
                        <MdOutlineArrowBackIos onClick={closeChat} />
                      </div>

                      <div
                        className="flex items-center cursor-pointer"
                        onClick={openModal}
                      >
                        <div className="chat-avatar mr-2 ml-0">
                          <img
                            // src="https://themes.pixelstrap.com/chitchat/assets/images/avtar/2.jpg"
                            src={
                              !sender.isGroupChat
                                ? getSenderPic(loggedUser, sender.users)
                                : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6wQvepXb0gM_Ft1QUOs6UyYJjPOmA-gq5Yw&usqp=CAU"
                            }
                            alt="profile"
                            className=" w-12 h-12 rounded-full"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <h6 className="mb-0">
                            {sender.isGroupChat
                              ? sender.chatName
                              : getSender(loggedUser, sender.users)}
                          </h6>
                          <p className="mb-0 truncate">
                            {/* status to be set later */}
                            <small className="truncate">
                              {sender.isGroupChat ? (
                                sender.users.map((item, index) => (
                                  <>
                                    <span key={index} className="text-sm">
                                      {(index ? ", " : " ") + item.name}
                                    </span>
                                  </>
                                ))
                              ) : (
                                <>
                                  {/* {socketConnected ? (
                                    <>offline</>
                                  ) : (
                                    <>Offline</>
                                  )} */}
                                </>
                              )}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="dropdown relative">
                        <Dropdown openModal={openModal} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chat-conversation p-3 p-lg-4">
                  <ul className="chat-conversation-list">
                    {loading ? (
                      <>
                        <div className="loader flex justify-center items-center">
                          <Spinner />
                        </div>
                      </>
                    ) : (
                      <>
                        {message.map((item, index) =>
                          isMyMessage(loggedUser, item) && item.sender.pic ? (
                            <>
                              <li key={index} className="chat-list right">
                                <div className="conversation-list">
                                  <div className="chat-avatar mr-2">
                                    <img
                                      src={item.sender.pic}
                                      alt=""
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div className="user-chat-content">
                                    <div className="flex mb-1 justify-end items-start gap-2">
                                      <div className="chat-wrap-content relative pb-5">
                                        <span className="mb-0  text-sm font-medium text-left">
                                          {item.isDeletedForEveryone ? (
                                            <em className="opacity-80">
                                              This message was deleted
                                            </em>
                                          ) : (
                                            item.content
                                          )}
                                        </span>
                                        
                                        {/* Attachments Display */}
                                        {item.attachments && item.attachments.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {item.attachments.map((attachment, idx) => (
                                              <div
                                                key={idx}
                                                className="cursor-pointer border rounded-lg bg-white/70 backdrop-blur p-2 hover:bg-white/90 transition-colors"
                                                onClick={() => setAttachmentModal({ open: true, attachment })}
                                              >
                                                {attachment.resourceType === 'image' ? (
                                                  <img
                                                    src={attachment.url}
                                                    alt={attachment.originalFilename}
                                                    className="w-20 h-20 object-cover rounded"
                                                  />
                                                ) : attachment.resourceType === 'video' ? (
                                                  <video
                                                    src={attachment.url}
                                                    className="w-20 h-20 object-cover rounded"
                                                    muted
                                                    playsInline
                                                  />
                                                ) : (
                                                  <div className="w-20 h-20 flex flex-col items-center justify-center bg-slate-100 rounded text-xs text-slate-600">
                                                    <div className="font-medium">FILE</div>
                                                    <div className="truncate w-full text-center px-1" title={attachment.originalFilename}>
                                                      {attachment.originalFilename}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                        {item.reactions &&
                                          item.reactions.length > 0 && (
                                            <Menu as="div" className="">
                                              <Menu.Button className="absolute -bottom-7 right-3 flex gap-1">
                                                {groupReactions(
                                                  item.reactions
                                                ).map((r) => (
                                                  <span
                                                    key={r.emoji}
                                                    className="px-2 py-0.5 rounded-full text-xs bg-white text-slate-700 border border-slate-200 shadow-sm"
                                                  >
                                                    {r.emoji}{" "}
                                                    {r.count > 1 ? r.count : ""}
                                                  </span>
                                                ))}
                                              </Menu.Button>
                                              <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                              >
                                                <Menu.Items className="absolute z-50 bottom-8 right-0 w-64 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                                                  {groupReactionUsers(
                                                    item.reactions
                                                  ).map((grp) => (
                                                    <div
                                                      key={grp.emoji}
                                                      className="mb-1 flex gap-1"
                                                    >
                                                      <div className="flex items-center gap-1 mb-1">
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                ) &&
                                                                onReact(
                                                                  item._id,
                                                                  grp.emoji
                                                                )
                                                              }
                                                              title={
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                )
                                                                  ? "Remove my reaction"
                                                                  : "Only your own reaction can be removed"
                                                              }
                                                              className={`px-2 py-0.5 rounded-full text-xs border border-slate-200 ${
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                )
                                                                  ? `${
                                                                      active
                                                                        ? "bg-red-100"
                                                                        : "bg-red-50"
                                                                    } cursor-pointer`
                                                                  : `${
                                                                      active
                                                                        ? "bg-slate-200"
                                                                        : "bg-slate-100"
                                                                    } cursor-not-allowed opacity-60`
                                                              }`}
                                                            >
                                                              {grp.emoji}{" "}
                                                              {grp.users
                                                                .length > 1
                                                                ? grp.users
                                                                    .length
                                                                : ""}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                      </div>
                                                      <ul className="pl-4 list-disc text-sm text-slate-700">
                                                        {grp.users.map(
                                                          (name, i) => (
                                                            <li key={i}>
                                                              {hasMyReaction(
                                                                item.reactions,
                                                                grp.emoji
                                                              )
                                                                ? "You"
                                                                : name}
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    </div>
                                                  ))}
                                                </Menu.Items>
                                              </Transition>
                                            </Menu>
                                          )}
                                        <div className="conversation-name ">
                                          <small className=" mb-0 text-gray-500">
                                            {moment(item.createdAt)
                                              .format("DD/MMM/YYYY , h:mm a")
                                              .toUpperCase()}
                                          </small>

                                          {/* <span className="ml-2 text-xs user-name">
                                            you
                                          </span> */}
                                        </div>
                                      </div>
                                      {/* per-message menu */}
                                      <Menu
                                        as="div"
                                        className="relative inline-block text-left"
                                      >
                                        <Menu.Button className="p-1 rounded-full hover:bg-slate-200/40">
                                          <BiDotsVerticalRounded />
                                        </Menu.Button>
                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transition opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transition opacity-0 scale-95"
                                        >
                                          <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                                            <div className="flex gap-2 px-2 py-1 border-b">
                                              {quickEmojis.map((emo) => (
                                                <button
                                                  key={emo}
                                                  onClick={() =>
                                                    onReact(item._id, emo)
                                                  }
                                                  className="text-xl"
                                                >
                                                  {emo}
                                                </button>
                                              ))}
                                            </div>
                                            <div className="py-1">
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <button
                                                    onClick={() =>
                                                      onDeleteForMe(item._id)
                                                    }
                                                    className={`${
                                                      active
                                                        ? "bg-gray-100"
                                                        : ""
                                                    } block w-full text-left px-4 py-2 text-sm`}
                                                  >
                                                    Delete for me
                                                  </button>
                                                )}
                                              </Menu.Item>
                                              {isMyMessage(loggedUser, item) &&
                                                !item.isDeletedForEveryone && (
                                                  <Menu.Item>
                                                    {({ active }) => (
                                                      <button
                                                        onClick={() =>
                                                          onDeleteForEveryone(
                                                            item._id
                                                          )
                                                        }
                                                        className={`${
                                                          active
                                                            ? "bg-gray-100"
                                                            : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-red-600`}
                                                      >
                                                        Delete for everyone
                                                      </button>
                                                    )}
                                                  </Menu.Item>
                                                )}
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </Menu>
                                    </div>
                                    {/* reactions summary */}
                                    {/* {item.reactions &&
                                      item.reactions.length > 0 && (
                                        <div className="flex justify-end mt-1 gap-1">
                                          {groupReactions(item.reactions).map(
                                            (r) => (
                                              <span
                                                key={r.emoji}
                                                className="px-2 py-0.5 rounded-full text-xs bg-white/30 text-white border border-white/50"
                                              >
                                                {r.emoji}{" "}
                                                {r.count > 1 ? r.count : ""}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      )} */}
                                  </div>
                                </div>
                              </li>
                            </>
                          ) : (
                            <>
                              <li key={index} className="chat-list">
                                <div className="conversation-list">
                                  <div className="chat-avatar mr-2">
                                    <img
                                      src={item.sender.pic}
                                      alt=""
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div className="user-chat-content">
                                    <div className="flex mb-1 items-start gap-2">
                                      {/* per-message menu */}
                                      <Menu
                                        as="div"
                                        className="relative inline-block text-left"
                                      >
                                        <Menu.Button className="p-1 rounded-full hover:bg-slate-200/40">
                                          <BiDotsVerticalRounded />
                                        </Menu.Button>
                                        <Transition
                                          as={Fragment}
                                          enter="transition ease-out duration-100"
                                          enterFrom="transform opacity-0 scale-95"
                                          enterTo="transition opacity-100 scale-100"
                                          leave="transition ease-in duration-75"
                                          leaveFrom="transform opacity-100 scale-100"
                                          leaveTo="transition opacity-0 scale-95"
                                        >
                                          <Menu.Items className="absolute z-50 left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-2">
                                            <div className="flex gap-2 px-2 py-1 border-b">
                                              {quickEmojis.map((emo) => (
                                                <button
                                                  key={emo}
                                                  onClick={() =>
                                                    onReact(item._id, emo)
                                                  }
                                                  className="text-xl"
                                                >
                                                  {emo}
                                                </button>
                                              ))}
                                            </div>
                                            <div className="py-1">
                                              <Menu.Item>
                                                {({ active }) => (
                                                  <button
                                                    onClick={() =>
                                                      onDeleteForMe(item._id)
                                                    }
                                                    className={`${
                                                      active
                                                        ? "bg-gray-100"
                                                        : ""
                                                    } block w-full text-left px-4 py-2 text-sm`}
                                                  >
                                                    Delete for me
                                                  </button>
                                                )}
                                              </Menu.Item>
                                            </div>
                                          </Menu.Items>
                                        </Transition>
                                      </Menu>
                                      <div className="chat-wrap-content-left relative pb-5">
                                        <span className="mb-0  text-sm font-medium text-left">
                                          {item.isDeletedForEveryone ? (
                                            <em className="opacity-80">
                                              This message was deleted
                                            </em>
                                          ) : (
                                            item.content
                                          )}
                                        </span>
                                        {item.reactions &&
                                          item.reactions.length > 0 && (
                                            <Menu as="div" className="">
                                              <Menu.Button className="absolute -bottom-7 left-3 flex gap-1">
                                                {groupReactions(
                                                  item.reactions
                                                ).map((r) => (
                                                  <span
                                                    key={r.emoji}
                                                    className="px-2 py-0.5 rounded-full text-xs bg-white text-slate-700 border border-slate-200 shadow-sm"
                                                  >
                                                    {r.emoji}{" "}
                                                    {r.count > 1 ? r.count : ""}
                                                  </span>
                                                ))}
                                              </Menu.Button>
                                              <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transition opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transition opacity-0 scale-95"
                                              >
                                                <Menu.Items className="absolute z-50 bottom-8 left-0 w-64 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-3">
                                                  {groupReactionUsers(
                                                    item.reactions
                                                  ).map((grp) => (
                                                    <div
                                                      key={grp.emoji}
                                                      className="mb-2"
                                                    >
                                                      <div className="flex items-center gap-2 mb-1">
                                                        <Menu.Item>
                                                          {({ active }) => (
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                ) &&
                                                                onReact(
                                                                  item._id,
                                                                  grp.emoji
                                                                )
                                                              }
                                                              title={
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                )
                                                                  ? "Remove my reaction"
                                                                  : "Only your own reaction can be removed"
                                                              }
                                                              className={`px-2 py-0.5 rounded-full text-xs border border-slate-200 ${
                                                                hasMyReaction(
                                                                  item.reactions,
                                                                  grp.emoji
                                                                )
                                                                  ? `${
                                                                      active
                                                                        ? "bg-red-100"
                                                                        : "bg-red-50"
                                                                    } cursor-pointer`
                                                                  : `${
                                                                      active
                                                                        ? "bg-slate-200"
                                                                        : "bg-slate-100"
                                                                    } cursor-not-allowed opacity-60`
                                                              }`}
                                                            >
                                                              {grp.emoji}{" "}
                                                              {grp.users
                                                                .length > 1
                                                                ? grp.users
                                                                    .length
                                                                : ""}
                                                            </button>
                                                          )}
                                                        </Menu.Item>
                                                      </div>
                                                      <ul className="pl-4 list-disc text-sm text-slate-700">
                                                        {grp.users.map(
                                                          (name, i) => (
                                                            <li key={i}>
                                                              {name}
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    </div>
                                                  ))}
                                                </Menu.Items>
                                              </Transition>
                                            </Menu>
                                          )}

                                        <div className="conversation-name ">
                                          <small className=" mb-0 text-gray-400">
                                            {moment(item.createdAt)
                                              .format("DD/MMM/YYYY , h:mm a")
                                              .toUpperCase()}
                                          </small>

                                          <span className="ml-2 text-xs user-name"></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </>
                          )
                        )}
                        <div ref={messageEndRef}></div>
                        {/* {
                        isTyping? <>

                        <li className="chat-list">
                              <div className="conversation-list">
                                <div className="chat-avatar mr-4">
                                  <img
                                    src={sender.pic}
                                    alt=""
                                    className="rounded-full"
                                  />
                                </div>
                                <div className="user-chat-content">
                                  <div className="flex mb-3">
                                    <div className="chat-wrap-content w-20 h-12 flex justify-center items-center ">
                                      <span className="relative mb-0  text-sm font-medium text-left ">
                                          <span className="typing-loader"></span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="conversation-name">
                                    <span className="ml-2 text-xs user-name">
                                      {sender.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>

                        </> : <> </>
                      } */}
                      </>
                    )}
                  </ul>
                </div>

                {/* chat input section */}

                <div className="chat-input-section p-5 p-lg-6">
                  {/* attachments preview */}
                  {previewItems.length > 0 && (
                    <div className="mb-3">
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {previewItems.map((p, idx) => (
                          <div
                            key={idx}
                            className="relative border rounded-lg bg-white/70 backdrop-blur p-2 flex items-center gap-2 min-w-[160px]"
                          >
                            {p.kind === "image" ? (
                              <img
                                src={p.url}
                                alt={p.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ) : p.kind === "video" ? (
                              <video
                                src={p.url}
                                className="w-16 h-16 object-cover rounded"
                                muted
                                playsInline
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center bg-slate-100 rounded text-xs text-slate-600">
                                File
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div
                                className="text-xs font-medium truncate"
                                title={p.name}
                              >
                                {p.name}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {(p.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSelectedFile(idx)}
                              className="p-1 rounded hover:bg-red-100 text-red-500"
                              title="Remove"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={clearSelectedFiles}
                        className="mt-2 flex items-center gap-1 text-xs text-red-600 hover:underline"
                        title="Clear all attachments"
                      >
                        <FiX /> Clear all
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="chat-input flex">
                      {/* 3 dot button button */}
                      {/* <div className="links-list-item">
                      <div className="btn dot-btn">
                        <BiDotsHorizontalRounded />
                      </div>
                    </div> */}
                      {/* attachment button */}
                      <div className="links-list-item">
                        <input
                          id="chat-attachments-input"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFilesChange}
                        />
                        <label
                          htmlFor="chat-attachments-input"
                          className="flex justify-center items-center btn emoji-btn mr-2"
                          title="Attach files"
                        >
                          <FiPaperclip />
                        </label>
                      </div>
                      {/* emoji button */}
                      <div className="links-list-item">
                        <Menu>
                          <Menu.Button className="flex justify-center items-center btn emoji-btn mr-2">
                            <BiSmile title="emoji" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transition opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transition opacity-100 scale-100"
                            leaveTo="transition opacity-0 scale-95"
                          >
                            <Menu.Items className="emoji-picker">
                              <Picker
                                theme={!theme ? "light" : "dark"}
                                onEmojiSelect={pickEmoji}
                              />
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                    {/* input field */}
                    <div className="position-relative w-full">
                      <input
                        placeholder="Type Your message..."
                        autoComplete="off"
                        id="chat-input"
                        className="w-full py-3 px-5 focus:outline-none"
                        value={newMessage}
                        onChange={handleChange}
                        ref={inputRef}
                      />
                    </div>

                    <div
                      className="chat-input-links ml-2"
                      onClick={handleClick}
                    >
                      <div className="links-list-items ml-5 ">
                        <Button className="btn submit-btn flex justify-center items-center">
                          <IoMdSend />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="absolute">
          <div className="flex items-center justify-center">
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="user-profile-sidebar absolute z-50"
                onClose={closeModal}
              >
                <div className="dialog-wrapper z-50 fixed inset-0">
                  <div className="dialog-container flex min-h-full items-start justify-end text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300 transform"
                      enterFrom="translate-x-full scale-95"
                      enterTo="translate-x-100 "
                      leave="ease-in-out duration-300 transform"
                      leaveFrom="translate-x-100"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="dialog-panel z-50  h-screen max-w-sm transform  text-white text-left shadow-xl transition-all">
                        <UserProfile closeModal={closeModal} />
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>

        {/* Attachment Modal */}
        <div className="absolute">
          <div className="flex items-center justify-center">
            <Transition appear show={attachmentModal.open} as={Fragment}>
              <Dialog
                as="div"
                className="attachment-modal absolute z-50"
                onClose={() => setAttachmentModal({ open: false, attachment: null })}
              >
                <div className="dialog-wrapper z-50 fixed inset-0 bg-black/80">
                  <div className="dialog-container flex min-h-full items-center justify-center text-center p-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300 transform"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200 transform"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="dialog-panel z-50 max-w-4xl w-full transform bg-white rounded-lg text-left shadow-xl transition-all">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-medium">
                              {attachmentModal.attachment?.originalFilename || 'Attachment'}
                            </Dialog.Title>
                            <button
                              onClick={() => setAttachmentModal({ open: false, attachment: null })}
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <FiX className="w-6 h-6" />
                            </button>
                          </div>
                          
                          {attachmentModal.attachment && (
                            <div className="flex justify-center">
                              {attachmentModal.attachment.resourceType === 'image' ? (
                                <img
                                  src={attachmentModal.attachment.url}
                                  alt={attachmentModal.attachment.originalFilename}
                                  className="max-w-full max-h-[70vh] object-contain rounded"
                                />
                              ) : attachmentModal.attachment.resourceType === 'video' ? (
                                <video
                                  src={attachmentModal.attachment.url}
                                  controls
                                  className="max-w-full max-h-[70vh] object-contain rounded"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded">
                                  <div className="text-6xl mb-4">📄</div>
                                  <div className="text-lg font-medium mb-2">
                                    {attachmentModal.attachment.originalFilename}
                                  </div>
                                  <div className="text-sm text-slate-600 mb-4">
                                    File Type: {attachmentModal.attachment.mimeType}
                                  </div>
                                  <a
                                    href={attachmentModal.attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Download File
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100%;
  height: 100vh;

  .chat-window-section {
    width: 100%;
    height: 100%;
    min-width: auto;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.bg.primary};
  }
  .chat-content {
    width: 100%;
    height: 100vh;
    width: 100%;
    height: 100vh;
    background-color: rgba(${({ theme }) => theme.colors.rgb.primary}, 0.1);
    background-image: url("/images/pattern-05.png");
  }
  .loader {
    width: 100%;
    height: 100%;
  }
  .three-dot-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .three-dot-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn {
    // width: 43px;
    padding: 0;
    font-size: 1.5rem;
    color: #797c8c;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.primaryRgb};
    }
  }
  .emoji-picker {
    position: absolute;
    max-width: 100%;
    overflow-y: auto;
    z-index: 100;
    left: 10px;
    bottom: 100px;
  }
  .submit-btn {
    width: 50px;
    height: 43px;
  }
  .dropdown-menu {
    top: 70px;
    z-index: 101;
    font-size: 1.1rem;
    min-width: 15rem;
    right: 0;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background-color: ${({ theme }) => theme.colors.bg.primary};
    button {
      position: relative;
      width: 100%;
      padding: 1.5rem 1.5rem;
      margin-bottom: 20px;
      height: 30px;
      &:hover {
        background-color: ${({ theme }) => theme.colors.bg.secondary};
      }
      h5 {
        font-size: 1.1rem;
        margin-bottom: 0;
      }
      .icon-btn {
        width: 43px;
        font-size: 0.8rem;
        padding: 10px;
        border-radius: 50%;
      }
      .btn-outline-primary {
        background-color: rgba(
          ${({ theme }) => theme.colors.btn.primary},
          0.15
        );
        color: ${({ theme }) => theme.colors.primaryRgb};
      }
      .btn-outline-danger {
        background-color: rgba(${({ theme }) => theme.colors.btn.danger}, 0.15);
        color: ${({ theme }) => theme.colors.danger};
      }
      .btn-outline-light {
        background-color: #eff1f2;
        color: ${({ theme }) => theme.colors.light};
      }
      .icon {
        font-size: 1.1rem;
      }
    }
  }
  .chat-welcome-section {
    width: 100%;
    height: 100vh;
    position: absolute;
    padding: 30px 30px 0;
  }
  .chat-content {
    .arrow-icon {
      background-color: ${({ theme }) => theme.colors.bg.secondary};
    }
    .user-chat-topbar {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.bg.primary};
      z-index: 50;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      color: ${({ theme }) => theme.colors.heading};
      border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.3);
      animation: fadeInLeft 0.5s;
    }
    .chat-conversation {
      overflow-y: scroll;
      height: calc(100vh - 200px);
      .chat-conversation-list {
        margin-top: 40px;
        padding-bottom: 50px;
        margin-bottom: 0;
        animation: fadeInLeft 0.5s;
        li {
          margin: 0;
          display: flex;
          .conversation-list {
            margin-bottom: 24px;
            display: inline-flex;
            position: relative;
            align-items: flex-start;
            justify-content: center;
            max-width: 80%;
            .user-name {
              color: ${({ theme }) => theme.colors.heading};
            }
            .chat-avatar {
              position: relative;
              overflow: hidden;
              border-radius: 100%;
              width: 2.2rem;
              height: 2.2rem;
            }
            .chat-wrap-content {
              padding: 12px 20px;
              background-color: ${({ theme }) => theme.colors.bg.primary};
              position: relative;
              border-radius: 30px 0 25px 30px;
              box-shadow: 0 2px 4px rgb(15 34 58 / 12%);
              color: ${({ theme }) => theme.colors.heading};
            }
            .chat-wrap-content-left {
              padding: 12px 20px;
              background-color: ${({ theme }) => theme.colors.bg.primary};
              position: relative;
              border-radius: 0 30px 25px 30px;
              box-shadow: 0 2px 4px rgb(15 34 58 / 12%);
              color: ${({ theme }) => theme.colors.heading};
            }
            .conversation-name {
              font-size: 12px;
              font-weight: 500;
              color: ${({ theme }) => theme.colors.text.secondary};
            }
          }
        }
        .chat-list.right {
          justify-content: end;
          .conversation-list {
            text-align: right;
            flex-direction: row-reverse;
            .chat-avatar {
              margin-right: 0;
            }
            .chat-wrap-content {
              color: ${({ theme }) => theme.colors.white};
              background-color: rgba(
                ${({ theme }) => theme.colors.rgb.primary},
                0.7
              );
            }
          }
        }

        .chat-input-section {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: ${({ theme }) => theme.colors.bg.primary};
          border-top: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.3);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
          input {
            color: ${({ theme }) => theme.colors.heading};
            background-color: ${({ theme }) => theme.colors.bg.secondary};
            &:focus {
              background-color: ${({ theme }) => theme.colors.bg.secondary};
            }
          }
          .dot-btn,
          .emoji-btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 3rem;
            height: 3rem;
            &:hover {
              color: ${({ theme }) => theme.colors.primaryRgb};
              background-color: ${({ theme }) => theme.colors.bg.secondary};
            }
            border-radius: 100%;
          }
          .links-list-items {
            .btn {
              color: #fff;
              background-color: ${({ theme }) => theme.colors.primaryRgb};
              &:hover {
                background-color: rgb(
                  ${({ theme }) => theme.colors.rgb.primary},
                  0.8
                );
              }
              border-color: ${({ theme }) => theme.colors.primaryRgb};
            }
          }
        }
      }
    }
  }

  @media screen and (min-width: 800px) {
    .chat-window-section {
      position: relative;
    }
    .arrow-icon {
      display: none;
    }
    .chat-window-section {
      position: relative;
    }
  }
`;

export default ChatWindow;
