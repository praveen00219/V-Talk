import moment from "moment";
import React, { useState, Fragment } from "react";
import { BiSearch } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import {
  AiFillContacts,
  AiFillInfoCircle,
  AiTwotoneMail,
} from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";

// import { getSender, getSenderPic } from "../HelperFunction/chat.Helper";
import {
  removeUserFromGroup,
  createChat,
  selectChatAction,
  fetchChats,
} from "../Redux/Reducer/Chat/chat.action";
import { getAllChats } from "../Redux/Reducer/Message/message.action";
import AppButton from "../Styles/Button";

const GroupProfile = (props) => {
  const dispatch = useDispatch();
  const {
    groupId,
    closeModal,
    groupPic,
    groupName,
    groupCreatedAt,
    groupUsers,
    groupAdmin,
  } = props;
  // console.log(props.sender);
  // console.log(props.loggedUser)
  const [query, setQuary] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [startingChat, setStartingChat] = useState(false);


  const loggedUser = useSelector((globalState) => globalState.user.userDetails);
  // console.log(loggedUser);
  // console.log(groupUsers);
  // console.log(groupAdmin);

  // console.log(groupId);
  const searchUser = (e) => {
    setQuary(e.target.value);
  };

  // start (or re-open) a 1-on-1 chat with this group member and switch to it
  const messageMember = async (member) => {
    setStartingChat(true);
    const res = await dispatch(createChat(member.id));
    setStartingChat(false);
    if (res?.type === "ERROR") {
      toast.error("Could not start the chat");
      return;
    }
    dispatch(selectChatAction(res.payload));
    dispatch(getAllChats(res.payload));
    dispatch(fetchChats());
    setSelectedMember(null);
    closeModal();
  };

  const removeFromGroup = async (user) => {
    // console.log(user);
    const { id } = user;
    if (groupUsers.length >= 4) {
      const data = {
        chatId: groupId,
        userId: id,
      };
      if (loggedUser) {
        if (loggedUser._id === groupAdmin.id) {
          await dispatch(removeUserFromGroup(data));
          toast.success(`${user.name} deleted Successfully`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.warn("your are not admin. Please Ask Admin", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } else {
      toast.warn("group must have at least 3 Members", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Wrapper>
      <div className="group-profile h-full w-full">
        <div>
          {/* {props.sender ? ( */}
          <>
            <div className="group-container">
              <div className="group-details">
                <div className="relative chat-menu flex flex-wrap items-center justify-between w-full ">
                  <div className="title">
                    <h2 className="text-2xl m-0">Profile</h2>
                  </div>
                  <div className="icon p-1 flex items-start h-full justify-start cursor-pointer">
                    <div
                      className="close-x p-1 rounded-full"
                      onClick={closeModal}
                    >
                      <RxCross2 />
                    </div>
                  </div>
                </div>

                <div className="profile py-4 flex flex-col justify-center items-center">
                  <div className="profile-img rounded-full overflow-hidden">
                    <img src={groupPic} alt="group-pic" />
                  </div>

                  <div className="profile-details">
                    <div className="title pt-4 text-center w-full">
                      <h5 className="group-name text-xl font-medium capitalize">
                        {groupName}
                      </h5>
                    </div>

                    <div className="detatils">
                      <div className="pt-4 w-full">
                        <p className="meta-label text-center text-xs">
                          Created At
                        </p>
                      </div>
                      <div className="w-full">
                        <span className="meta-value text-sm">
                          {moment(groupCreatedAt).format("DD-MM-YY , hh:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="Participants w-full h-full">
                <div className="title">
                  <h3 className="participants-title text-lg font-medium">
                    {" "}
                    {`${groupUsers.length} Participants`}{" "}
                  </h3>
                </div>

                <div className="search-field w-full">
                  <div className="search-input flex justify-center items-center ">
                    <input className="w-full" onChange={(e) => searchUser(e)} />
                    <BiSearch className="icon" size={20} />
                  </div>
                </div>

                <div className="participants-list w-full my-4 overflow-y-scroll">
                  {groupUsers
                    .filter((item) => {
                      return query.toLowerCase() === ""
                        ? item
                        : item.name.toLowerCase().includes(query.toLowerCase());
                    })
                    .map((item, index) => {
                      const isSelf = item.id === loggedUser._id;
                      return (
                      <li key={index} className="chat-box-wrapper px-5 py-2">
                        <div
                          className={
                            isSelf
                              ? "chat-box flex items-center"
                              : "chat-box flex items-center cursor-pointer"
                          }
                          onClick={() => !isSelf && setSelectedMember(item)}
                        >
                          <div className="profile">
                            <img
                              src={item.pic}
                              className="w-12 h-12 rounded-full"
                              alt=""
                            />
                          </div>
                          <div className="details w-10/12">
                            <span className="member-name inline-block md:w-32 w-full m-0 truncate text-base font-bold capitalize">
                              {isSelf ? "You" : item.name}
                            </span>
                            <p className="member-about text-xs truncate whitespace-nowrap overflow-hidden">
                              {item.about}
                            </p>
                          </div>
                          <div className="data-status h-full">
                            {item.name === groupAdmin.name ? (
                              <>
                                <span className="admin-tag text-xs">Admin</span>
                              </>
                            ) :
                            <>
                              {
                                groupAdmin.id === loggedUser._id ? <>
                                <span
                                  className="remove-tag text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromGroup(item);
                                  }}
                                >
                                  Remove
                                </span>
                              </>
                              : <></>
                              }
                            </>
                            }
                          </div>
                        </div>
                      </li>
                      );
                    })}
                </div>
              </div>
            </div>
          </>
        </div>
      </div>

      {/* member profile popup: view details + start a personal chat */}
      <Transition appear show={!!selectedMember} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-20"
          onClose={() => setSelectedMember(null)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as={MemberPanel}
                  className="w-full max-w-sm transform overflow-hidden p-6 text-left align-middle transition-all"
                >
                  {selectedMember && (
                    <>
                      <div className="flex flex-col items-center">
                        <img
                          src={selectedMember.pic}
                          alt={selectedMember.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <Dialog.Title
                          as="h3"
                          className="member-name text-lg font-medium mt-3 m-0 capitalize"
                        >
                          {selectedMember.name}
                        </Dialog.Title>
                      </div>

                      <div className="member-info mt-5">
                        <div className="flex justify-between w-full mt-2">
                          <div className="grid place-items-center info-icon text-2xl">
                            <AiFillInfoCircle className="icon" />
                          </div>
                          <div className="w-4/5">
                            <span className="label text-xs">About</span>
                            <p className="w-full break-words m-0">
                              {selectedMember.about}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between w-full mt-3">
                          <div className="grid place-items-center info-icon text-2xl">
                            <AiFillContacts className="icon" />
                          </div>
                          <div className="w-4/5">
                            <span className="label text-xs">Mobile</span>
                            <p className="w-full break-words m-0">
                              {selectedMember.contact}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between w-full mt-3">
                          <div className="grid place-items-center info-icon text-2xl">
                            <AiTwotoneMail className="icon" />
                          </div>
                          <div className="w-4/5">
                            <span className="label text-xs">
                              Email Address
                            </span>
                            <p className="w-full break-words m-0">
                              {selectedMember.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <AppButton
                          $variant="secondary"
                          onClick={() => setSelectedMember(null)}
                        >
                          Close
                        </AppButton>
                        <AppButton
                          $variant="primary"
                          $block
                          loading={startingChat}
                          onClick={() => messageMember(selectedMember)}
                        >
                          Message
                        </AppButton>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Wrapper>
  );
};

export default GroupProfile;

const MemberPanel = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.lg};
  .member-name {
    color: ${({ theme }) => theme.colors.heading};
  }
  .member-info {
    .info-icon {
      color: ${({ theme }) => theme.colors.primaryRgb};
    }
    .label {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }
`;

const Wrapper = styled.div`
  .group-profile {
    .group-container {
      .group-details {
        margin-top: 2rem;
        .chat-menu {
          padding-left: 2rem;
          padding-right: 2rem;
          .close-x {
            cursor: pointer;
            background-color: ${({ theme }) => theme.colors.bg.secondary};
            color: ${({ theme }) => theme.colors.heading};
            transition: background-color 0.2s ${({ theme }) => theme.motion.ease};
            &:hover {
              background-color: ${({ theme }) => theme.colors.accent.soft};
              color: ${({ theme }) => theme.colors.primaryRgb};
            }
          }
        }
        .profile {
          border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border}, 1);
          .profile-img {
            margin: 10px 50px 0px 50px;
            width: 150px;
            height: 150px;
            img {
              min-width: 100%;
            }
          }
          .profile-details {
            padding-left: 2rem;
            padding-right: 2rem;
            .group-name {
              color: ${({ theme }) => theme.colors.heading};
            }
            .meta-label {
              color: ${({ theme }) => theme.colors.text.muted};
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .meta-value {
              color: ${({ theme }) => theme.colors.heading};
            }
          }
        }
      }
      .Participants {
        position: relative;
        .title {
          margin-top: 2rem;
          padding-left: 2rem;
          padding-right: 2rem;
          .participants-title {
            color: ${({ theme }) => theme.colors.heading};
          }
        }
        .search-field {
          padding-left: 1rem;
          padding-right: 1rem;
          .search-input {
            position: relative;
            background-color: ${({ theme }) => theme.colors.bg.secondary};

            input {
              padding: 0.5rem 1rem;
              color: ${({ theme }) => theme.colors.heading};
              border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border}, 1);
              &::placeholder {
                color: ${({ theme }) => theme.colors.text.muted};
              }
            }
            input:focus {
              outline: none;
              border-bottom: 1px solid ${({ theme }) => theme.colors.primaryRgb};
              background-color: ${({ theme }) =>
                theme.colors.bg.primary} !important;
            }
            .icon {
              position: absolute;
              right: 1rem;
              color: ${({ theme }) => theme.colors.heading};
            }
          }
        }
      }

      .participants-list {
        height: calc(100vh - 400px);

        .chat-box-wrapper {
          border-top: 1px solid rgba(${({ theme }) => theme.colors.border}, 1);
          &:nth-child(1) {
            border-top: none;
          }
          .chat-box {
            position: relative;
            .profile {
              position: absolute;
              left: 0;
              width: 50px;
              height: 50px;
            }
            .details {
              padding: 12px 12px 12px 60px;
              .member-name {
                color: ${({ theme }) => theme.colors.heading};
              }
              .member-about {
                color: ${({ theme }) => theme.colors.text.muted};
              }
            }

            .data-status {
              position: absolute;
              right: 0;
              text-align: right;
              padding: 12px 0px 12px 0px;
              .admin-tag {
                color: ${({ theme }) => theme.colors.accent.solid};
                font-weight: 600;
              }
              .remove-tag {
                color: ${({ theme }) => theme.colors.dangerText};
                font-weight: 600;
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }
    }
  }
`;
