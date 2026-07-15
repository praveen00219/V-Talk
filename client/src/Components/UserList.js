import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toggleFavouriteChat } from "../Redux/Reducer/User/user.action";
import {
  getSender,
  getSenderPic,
  getOtherUser,
} from "../HelperFunction/chat.Helper";

import moment from "moment";
import Highlighter from "react-highlight-words";

const UserList = ({
  searchOpen,
  query,
  chatList,
  chat,
  loggedUser,
  result,
  setSelectedChat,
  people = [],
  peopleLoading = false,
  onStartChat,
  inviteEmail,
  onInvite,
  inviting,
}) => {

  const dispatch = useDispatch();
  const onlineUserIds = useSelector(
    (globalState) => globalState.presence.onlineUserIds
  );
  // reciprocity: hide everyone's presence when my own toggle is off
  const presenceVisible = loggedUser?.showOnlineStatus !== false;
  const favouriteIds = new Set((loggedUser?.favourites || []).map(String));

  const userChatShow = () => {
    document
      .getElementById("user-chat")
      .classList.add("user-chat-show", "fadeInRight");
    document.getElementById("user-chat").classList.remove("fadeInRight2");
  };

  return (
    // <Wrapper>
    <Wrapper>
      <ul className="chat-main h-full overflow-x-hidden overflow-y-scroll">
        {chatList.length !== 0 ? (
          <div className="mb-4" onClick={() => userChatShow()}>
            {chatList
              .filter((item) => {
                return query.toLowerCase() === "" || searchOpen === false
                  ? item
                  : (!item.isGroupChat
                      ? getSender(loggedUser, item.users)
                      : item.chatName
                    )
                      .toLowerCase()
                      .includes(query.toLowerCase());
              })
              .map((item, index) => (
                <li
                  onClick={() => setSelectedChat(item)}
                  key={item._id}
                  id="chat-box-wrapper"
                  className={
                    result === item
                      ? "chat-box-wrapper active px-5 py-2"
                      : "chat-box-wrapper px-5 py-2"
                  }
                >
                  <div className="chat-box flex items-center cursor-pointer">
                    <div className="profile">
                      <img
                        className=" w-12 h-12 rounded-full"
                        // src={chat[index].users[0].pic}
                        src={
                          !item.isGroupChat
                            ? getSenderPic(loggedUser, item.users)
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6wQvepXb0gM_Ft1QUOs6UyYJjPOmA-gq5Yw&usqp=CAU"
                        }
                        alt="user_logo"
                      />
                      {presenceVisible &&
                      !item.isGroupChat &&
                      onlineUserIds.includes(
                        getOtherUser(loggedUser, item.users)?._id
                      ) ? (
                        <span className="online-dot" aria-label="online" />
                      ) : null}
                    </div>
                    <div className="details w-3/4">
                      <Highlighter
                        searchWords={[query]}
                        autoEscape={true}
                        textToHighlight={
                          !item.isGroupChat
                            ? getSender(loggedUser, item.users)
                            : item.chatName
                        }
                        className="inline-block md:w-36 w-full m-0 truncate text-base"
                      >
                        {!item.isGroupChat
                          ? getSender(loggedUser, item.users)
                          : item.chatName}
                      </Highlighter>
                      <p className=" text-xs truncate whitespace-nowrap overflow-hidden">
                        <span className="text-xs">
                          {item.latestMessage != null
                            ? `${
                                item.latestMessage.sender.name ===
                                loggedUser.name
                                  ? "You"
                                  : item.latestMessage.sender.name
                              }:`
                            : ""}
                        </span>
                        <span className="text-xs truncate">
                          {" "}
                          {item.latestMessage != null
                            ? item.latestMessage.encrypted
                              ? "🔒 Message"
                              : item.latestMessage.content ||
                                (item.latestMessage.attachments &&
                                item.latestMessage.attachments.length > 0
                                  ? "📎 Attachment"
                                  : "")
                            : ""}
                        </span>
                      </p>
                    </div>
                    <div className="data-status h-full avatar-group">
                      {chat[index].isGroupChat ? (
                        <div className="flex -space-x-4">
                          {chat[index].users.slice(0, 3).map((u, i) => (
                            <img
                              key={u?._id || i}
                              className="avatar-chip w-8 h-8 border-2 rounded-full hover:z-10"
                              src={u?.pic}
                              alt={u?.name || "member"}
                              title={u?.name}
                            />
                          ))}
                          {chat[index].users.length > 3 ? (
                            <div className="avatar-more flex items-center justify-center w-8 h-8 text-xs font-medium rounded-full">
                              {`+${chat[index].users.length - 3}`}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        className={
                          favouriteIds.has(String(item._id))
                            ? "fav-btn active"
                            : "fav-btn"
                        }
                        title={
                          favouriteIds.has(String(item._id))
                            ? "Remove from favourites"
                            : "Add to favourites"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleFavouriteChat(item._id));
                        }}
                      >
                        {favouriteIds.has(String(item._id)) ? (
                          <AiFillStar />
                        ) : (
                          <AiOutlineStar />
                        )}
                      </button>
                      <p>
                        {item.latestMessage
                          ? moment(item.latestMessage.createdAt).format(
                              "DD/MM/YY"
                            )
                          : ""}
                      </p>

                      {item.status ? (
                        <span
                          className={
                            item.status === "seen"
                              ? "status status-seen"
                              : "status status-unseen"
                          }
                        >
                          <span className="status-dot" aria-hidden="true" />
                          {item.status}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
          </div>
        ) : (
          <div className="my-4">
            <p className="text-lg text-gray-400 w-full first-letter: mx-auto">
              {" "}
              No Chat availabe
            </p>
          </div>
        )}

        {/* unified search: people you haven't chatted with yet */}
        {peopleLoading ? (
          <p className="people-hint text-xs px-5 py-2 m-0">Searching people…</p>
        ) : people.length > 0 ? (
          <div className="people-section">
            <p className="people-hint text-xs px-5 pt-2 m-0">New contacts</p>
            {people.map((item) => (
              <li
                key={item._id}
                className="chat-box-wrapper px-5 py-2"
                onClick={() => onStartChat && onStartChat(item)}
              >
                <div className="chat-box flex items-center cursor-pointer">
                  <div className="profile">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={item.pic}
                      alt="user_logo"
                    />
                  </div>
                  <div className="details">
                    <span className="inline-block m-0 truncate text-base">
                      {item.name}
                    </span>
                    <p className="text-xs truncate">{item.email}</p>
                  </div>
                  <div className="data-status">
                    <span className="start-chat-hint text-xs">Start chat</span>
                  </div>
                </div>
              </li>
            ))}
          </div>
        ) : null}

        {/* unified search: inline invite when an email matches nobody */}
        {inviteEmail ? (
          <div className="invite-card mx-4 my-3 p-4 text-center">
            <p className="m-0 mb-1 font-medium">No user with this email yet</p>
            <p className="invite-hint text-xs m-0 mb-3">
              Invite them to join you on V-Talk
            </p>
            <button
              className="invite-btn w-full py-2"
              onClick={onInvite}
              disabled={inviting}
            >
              {inviting ? "Inviting…" : `Invite ${inviteEmail}`}
            </button>
          </div>
        ) : null}
      </ul>
    </Wrapper>
  );
};
const Wrapper = styled.section`
  position: relative;

  mark {
    background-color: ${({ theme }) => theme.colors.primaryRgb};
  }
  .chat-main {
    height: calc(100vh - 90px);
    background-color: ${({ theme }) => theme.colors.bg.primary};
    li.active {
      background-color: rgba(${({ theme }) => theme.colors.rgb.primary}, 0.12);
      border-left: 4px solid ${({ theme }) => theme.colors.primaryRgb};
      transition: all 0.3s ease;
    }
    .chat-box-wrapper {
      &:nth-child(1) {
        border-top: none;
      }
      border-top: 1px solid ${({ theme }) => theme.colors.border2.primary};
    }
    .chat-box {
      position: relative;
      h2 {
        overflow: hidden;
        margin: 0;
        padding-top: 8px;
        white-space: nowrap;
      }
      p,
      span {
        font-weight: 600;
        margin: 0;
        padding-top: 8px;
      }
      .profile {
        position: absolute;
        left: 0;
        width: 50px;
        height: 50px;
        .online-dot {
          position: absolute;
          bottom: 0;
          right: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${({ theme }) => theme.colors.success};
          border: 2px solid ${({ theme }) => theme.colors.bg.primary};
        }
      }
      .details {
        padding: 12px 12px 12px 60px;
        p {
          overflow: hidden;
          color: ${({ theme }) => theme.colors.text.secondary};
        }
      }
      .avatar-group {
        img,
        .avatar-chip {
          border-color: ${({ theme }) => theme.colors.bg.primary};
          background: ${({ theme }) => theme.colors.bg.secondary};
        }
        .avatar-more {
          background: ${({ theme }) => theme.colors.accent.soft};
          color: ${({ theme }) => theme.colors.primaryRgb};
          border: 2px solid ${({ theme }) => theme.colors.bg.primary};
        }
      }
      .data-status {
        position: absolute;
        right: 0;
        text-align: right;
        padding: 12px 0px 12px 0px;
        h2,
        p {
          color: ${({ theme }) => theme.colors.text.secondary};
        }
        h2,
        p,
        span {
          font-size: calc(11px + (12 - 11) * ((100vw - 320px) / (1920 - 320)));
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding-top: 8px;
          padding-bottom: 0px;
          letter-spacing: 0.3px;
          font-weight: 600;
          text-transform: capitalize;
          .status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            display: inline-block;
          }
        }
        .status-seen {
          color: ${({ theme }) => theme.colors.successText};
          .status-dot {
            background: ${({ theme }) => theme.colors.success};
          }
        }
        .status-unseen {
          color: ${({ theme }) => theme.colors.text.muted};
          .status-dot {
            background: ${({ theme }) => theme.colors.warning};
          }
        }
      }
    }
  }
  .people-hint {
    color: ${({ theme }) => theme.colors.text.muted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  .fav-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.05rem;
    padding: 2px;
    color: ${({ theme }) => theme.colors.text.muted};
    transition: color 0.15s ease, transform 0.15s ease;
    &:hover {
      color: ${({ theme }) => theme.colors.warning};
      transform: scale(1.15);
    }
    &.active {
      color: ${({ theme }) => theme.colors.warning};
    }
  }
  .start-chat-hint {
    color: ${({ theme }) => theme.colors.accent.solid};
    font-weight: 600;
  }
  .invite-card {
    background: ${({ theme }) => theme.colors.accent.softer};
    border: 1px dashed rgba(${({ theme }) => theme.colors.border}, 1);
    border-radius: ${({ theme }) => theme.radius.lg};
    color: ${({ theme }) => theme.colors.heading};
    .invite-hint {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
    .invite-btn {
      background: ${({ theme }) => theme.colors.accent.solid};
      color: #fff;
      border-radius: ${({ theme }) => theme.radius.md};
      font-weight: 600;
      font-size: 0.85rem;
      word-break: break-all;
      &:disabled {
        opacity: 0.6;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    position: relative;
    max-width: 100vw;
    min-width: 100vw;
    .chat-main {
      width: 100vw;
      height: calc(100vh - 186px);
      li {
        padding: 20px 20px 20px 20px;
        h2 {
          font-size: 1.5rem;
        }
        p {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default UserList;
