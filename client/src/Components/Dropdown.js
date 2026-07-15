import React, { useEffect, useState, Fragment } from "react";
import { ImBlocked, ImExit } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Transition } from "@headlessui/react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { toast } from "react-toastify";
import {
  clearSelectChatAction,
  fetchChats,
  removeUserFromGroup,
  deleteChatForMe,
} from "../Redux/Reducer/Chat/chat.action";
import {
  toggleFavouriteChat,
  toggleBlockUser,
} from "../Redux/Reducer/User/user.action";
import { getOtherUser } from "../HelperFunction/chat.Helper";
import ConfirmDialog from "./Admin/ConfirmDialog";

const Dropdown = (props) => {
  const dispatch = useDispatch();
  const [sender, setSender] = useState();
  const [confirm, setConfirm] = useState(null); // "delete" | "block" | "leave"
  const [busy, setBusy] = useState(false);

  const senderUser = useSelector(
    (globalState) => globalState.chat.selectedChat
  );
  const loggedUser = useSelector((globalState) => globalState.user.userDetails);

  useEffect(() => {
    setSender(senderUser);
  }, [senderUser]);

  const otherUser =
    sender && !sender.isGroupChat
      ? getOtherUser(loggedUser, sender.users)
      : null;
  const isFavourite = sender
    ? (loggedUser?.favourites || []).map(String).includes(String(sender._id))
    : false;
  const isBlocked = otherUser
    ? (loggedUser?.blockedUsers || [])
        .map(String)
        .includes(String(otherUser._id))
    : false;

  const handleFavourite = async () => {
    await dispatch(toggleFavouriteChat(sender._id));
    toast.success(
      isFavourite ? "Removed from favourites" : "Added to favourites",
      { autoClose: 1200 }
    );
  };

  const handleBlockToggle = async () => {
    if (!isBlocked) {
      setConfirm("block"); // blocking is confirm-gated; unblocking is instant
      return;
    }
    const res = await dispatch(toggleBlockUser(otherUser._id));
    if (res?.error) {
      toast.error(res.data?.message || "Action failed");
    } else {
      toast.success(res.message, { autoClose: 1200 });
    }
  };

  const closeChatAndRefresh = async () => {
    await dispatch(clearSelectChatAction());
    await dispatch(fetchChats());
  };

  const handleConfirm = async () => {
    setBusy(true);
    if (confirm === "delete") {
      const res = await dispatch(deleteChatForMe(sender._id));
      if (res?.error) {
        toast.error(res.data?.message || "Could not delete chat");
      } else {
        toast.success("Chat deleted", { autoClose: 1200 });
        await closeChatAndRefresh();
      }
    } else if (confirm === "block") {
      const res = await dispatch(toggleBlockUser(otherUser._id));
      if (res?.error) {
        toast.error(res.data?.message || "Action failed");
      } else {
        toast.success(res.message, { autoClose: 1200 });
      }
    } else if (confirm === "leave") {
      const res = await dispatch(
        removeUserFromGroup({ chatId: sender._id, userId: loggedUser._id })
      );
      if (res?.type === "ERROR") {
        toast.error("Could not leave the group");
      } else {
        toast.success("You left the group", { autoClose: 1200 });
        await closeChatAndRefresh();
      }
    }
    setBusy(false);
    setConfirm(null);
  };

  const confirmCopy = {
    delete: {
      title: "Delete chat",
      body: "This deletes the conversation and its history for you only — other participants keep their copy. A new message starts a fresh thread.",
      label: "Delete",
    },
    block: {
      title: `Block ${otherUser?.name || "this user"}`,
      body: "They won't be able to message you, and you won't be able to message them, until you unblock.",
      label: "Block",
    },
    leave: {
      title: "Leave group",
      body: `Leave "${sender?.chatName}"? You'll stop receiving its messages.`,
      label: "Leave",
    },
  };

  if (!sender || !loggedUser) {
    return null;
  }

  return (
    <>
      <Menu>
        <Menu.Button className="btn three-dot-btn">
          <BiDotsVerticalRounded />
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
          <Menu.Items className="dropdown-menu absolute py-4">
            <Menu.Item>
              {({ active }) => (
                <button
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    marginBottom: "0",
                  }}
                  className={`${
                    active
                      ? "active flex items-center justify-between"
                      : " flex items-center justify-between"
                  }`}
                  onClick={props.openModal}
                >
                  <div className="icon-btn btn-outline-primary mr-4">
                    <CgProfile
                      className="icon inline"
                      style={{ fontSize: "14px" }}
                    />
                  </div>{" "}
                  <h6
                    style={{ fontSize: "13px", fontWeight: "400" }}
                    className=" relative w-full text-left"
                  >
                    view contact
                  </h6>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    marginBottom: "0",
                  }}
                  className={`${
                    active
                      ? "active flex items-center justify-between"
                      : "flex items-center justify-between"
                  }`}
                  onClick={handleFavourite}
                >
                  <div className="icon-btn btn-outline-danger mr-4">
                    {isFavourite ? (
                      <MdFavorite
                        className="icon inline"
                        style={{ fontSize: "14px" }}
                      />
                    ) : (
                      <MdFavoriteBorder
                        className="icon inline"
                        style={{ fontSize: "14px" }}
                      />
                    )}
                  </div>{" "}
                  <h6
                    style={{ fontSize: "13px", fontWeight: "400" }}
                    className=" relative w-full text-left"
                  >
                    {isFavourite ? "Remove From Favourites" : "Mark As Favourites"}
                  </h6>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    marginBottom: "0",
                  }}
                  className={`${
                    active
                      ? "active flex items-center justify-between"
                      : "flex items-center justify-between"
                  }`}
                  onClick={() => setConfirm("delete")}
                >
                  <div className="icon-btn btn-outline-danger mr-4">
                    <RiDeleteBin6Line
                      className="icon inline"
                      style={{ fontSize: "14px" }}
                    />
                  </div>{" "}
                  <h6
                    style={{ fontSize: "13px", fontWeight: "400" }}
                    className=" relative w-full text-left"
                  >
                    Delete Chat
                  </h6>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  style={{
                    fontSize: "13px",
                    fontWeight: "400",
                    marginBottom: "0",
                  }}
                  className={`${
                    active
                      ? "active flex items-center justify-between"
                      : "flex items-center justify-between"
                  }`}
                  onClick={
                    sender.isGroupChat
                      ? () => setConfirm("leave")
                      : handleBlockToggle
                  }
                >
                  <div className="icon-btn btn-outline-light mr-4">
                    {sender.isGroupChat ? (
                      <ImExit
                        className="icon inline"
                        style={{ fontSize: "14px" }}
                      />
                    ) : (
                      <ImBlocked
                        className="icon inline"
                        style={{ fontSize: "14px" }}
                      />
                    )}
                  </div>{" "}
                  <h6
                    style={{ fontSize: "13px", fontWeight: "400" }}
                    className=" relative w-full text-left"
                  >
                    {sender.isGroupChat
                      ? "Leave Group "
                      : isBlocked
                      ? "Unblock"
                      : "Block"}
                  </h6>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <ConfirmDialog
        open={!!confirm}
        loading={busy}
        title={confirm ? confirmCopy[confirm].title : ""}
        body={confirm ? confirmCopy[confirm].body : ""}
        confirmLabel={confirm ? confirmCopy[confirm].label : "Confirm"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
};

export default Dropdown;
