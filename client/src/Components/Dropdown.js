import React, { useEffect, useState, Fragment } from "react";
import { ImBlocked, ImExit } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";

import { Menu, Transition } from "@headlessui/react";
import UserProfile from "./SlideMenu/UserProfile";
import { MdFavorite } from "react-icons/md";
import { toast } from "react-toastify";

const Dropdown = (props) => {
  const [sender, setSender] = useState();

  const senderUser = useSelector(
    (globalState) => globalState.chat.selectedChat
  );

  const handleClickMarkAsFavourites = () => {
    toast.success("We are working this feature. Available Soon", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleClickDeleteChat = () => {
    toast.success("We are working this feature. Available Soon", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const handleClickLeaveGroup = () => {
    toast.success("We are working this feature. Available Soon", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  useEffect(() => {
    setSender(senderUser);
  }, [senderUser]);
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
                  onClick={handleClickMarkAsFavourites}
                >
                  <div className="icon-btn btn-outline-danger mr-4">
                    <MdFavorite
                      className="icon inline"
                      style={{ fontSize: "14px" }}
                    />
                  </div>{" "}
                  <h6
                    style={{ fontSize: "13px", fontWeight: "400" }}
                    className=" relative w-full text-left"
                  >
                    Mark As Favourites
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
                  onClick={handleClickDeleteChat}
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
                  onClick={handleClickLeaveGroup}
                >
                  <div className="icon-btn btn-outline-light mr-4">
                    {/* <ImBlocked className="icon inline" style={{fontSize:"14px"}} /> */}
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
                    {sender.isGroupChat ? "Leave Group " : "Block"}
                  </h6>
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default Dropdown;
