import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Disclosure, Switch } from "@headlessui/react";
import { BiChevronUp } from "react-icons/bi";
import { toast } from "react-toastify";

import {BsCircleHalf} from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux";

import ProfileEdit from "./modal/ProfileEdit";
import ImageEdit from "./modal/ImageEdit";
import { colors } from "../config.js/data";
import { FaCheck } from "react-icons/fa";
import {toggleColor} from "../Redux/Reducer/SetColor/setColorAction"
import { updateUserSettings } from "../Redux/Reducer/User/user.action";

const Setting = () => {
  const user = useSelector((globalState) => globalState.user.userDetails);
  const ThemeColor = useSelector((state) => state.setColorReducer.themeColor);
  const [color, setColor] = useState(ThemeColor);
  

  const dispatch = useDispatch();

  const activeColor = (color)=> {
    setColor(color);
    dispatch(toggleColor(color));
  }

  // privacy: show online status toggle (reads server-confirmed value from redux)
  const showOnlineStatus = user?.showOnlineStatus !== false;
  const [savingPresence, setSavingPresence] = useState(false);

  const handlePresenceToggle = async (value) => {
    setSavingPresence(true);
    const res = await dispatch(updateUserSettings({ showOnlineStatus: value }));
    setSavingPresence(false);
    if (res?.type === "ERROR") {
      toast.error("Could not update setting");
    }
  };

  
  return (
    <Wrapper className="setting-tab dynamic-sidebar">
      <div className="relative flex items-center chat-menu flex-wrap justify-between w-full ">
        <div>
          <h2>Setting</h2>
          <p>Personal Information</p>
        </div>
        <div className="icon text-right"></div>
      </div>
      <div className="details p-4">
        <div className="setting-block">
          <div className="user-profile flex items-center flex-col py-3">
            <ImageEdit/>
            <div className="user-name py-4 text-center w-full">
              <h5 className="text-xl font-medium">{user.name}</h5>
            </div>
          </div>
        </div>

        <div className="setting-block">
          <div className="profile-setting w-full pt-4">
          <ProfileEdit/>
          </div>
        </div>

        <div className="setting-block">
          <div className="theme-setting w-full pt-3">
            <div className="mx-auto w-full max-w-md rounded-2xl py-2">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between items-center rounded-lg py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75">
                      <div className="flex justify-between items-center">
                        <BsCircleHalf className="mb-4 mr-4" />
                        <span>Themes</span>
                      </div>
                      
                      <BiChevronUp
                        className={`${
                          open ? "rotate-180 transform mb-4" : ""
                        } h-5 w-5 mb-4`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="disclosure-Panel pt-2 pb-2 text-sm">
                      
                    <div className="h-full flex justify-start items-center gap-2 flex-wrap w-full" role="radiogroup" aria-label="Accent color">
                    {
                      colors.map((item)=>{
                       const isActive = color === item.color;
                       return <button
                        className={isActive ? "btn-style swatch rounded-full active flex justify-center items-center" : "btn-style swatch rounded-full flex justify-center items-center"}
                        onClick={() => activeColor(item.color)}
                        style={{backgroundColor: item.color}}
                        key={item.id}
                        role="radio"
                        aria-checked={isActive}
                        aria-label={`${item.name} accent`}
                        title={item.name}
                      >
                       {isActive ? <FaCheck className="checkStyle" /> : null}
                        </button>
                      })
                    }
                    </div>

                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>

        <div className="setting-block">
          <div className="privacy-setting w-full pt-3 pb-3">
            <div className="flex w-full justify-between items-center py-2">
              <span className="text-sm font-medium">Show online status</span>
              <Switch
                checked={showOnlineStatus}
                onChange={handlePresenceToggle}
                disabled={savingPresence}
                className={
                  showOnlineStatus ? "presence-switch on" : "presence-switch"
                }
              >
                <span className="presence-thumb" aria-hidden="true" />
              </Switch>
            </div>
            <p className="text-xs presence-caption m-0">
              When off, you won't see others' online status or last seen, and
              they won't see yours.
            </p>
          </div>
        </div>

       {/* <div className="user-name w-4/5">
                        <span className="text-gray-500">Name</span>
                        <p >{user.name}</p>
                      </div>
                      <div className="description w-4/5 ">
                        <span className="text-gray-500">About</span>
                        <p className="text-gray-400">web developer</p>
                      </div> */}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  animation: fadeInLeft 1s;
  .user-profile-img {
    width: 150px;
    height: 150px;
    img {
      min-width: 100%;
    }
  }

  .dialog-box{
    .dialog-box-wrapper .dialog-panel{
      background-color: ${({ theme }) => theme.colors.bg.secondary};
    }
     
  }
  .setting-block{
    border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border});
  }

  .presence-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    width: 42px;
    height: 24px;
    border: none;
    border-radius: 9999px;
    background: rgba(${({ theme }) => theme.colors.border}, 0.6);
    cursor: pointer;
    transition: background 0.2s ease;
    &.on {
      background: ${({ theme }) => theme.colors.accent.solid};
    }
    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .presence-thumb {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      box-shadow: ${({ theme }) => theme.colors.shadow.sm};
      transform: translateX(3px);
      transition: transform 0.2s ease;
    }
    &.on .presence-thumb {
      transform: translateX(21px);
    }
  }
  .presence-caption {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .swatch {
    width: 2rem;
    height: 2rem;
    border: 2px solid transparent;
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
    cursor: pointer;
    transition: transform 0.18s ${({ theme }) => theme.motion.spring},
      box-shadow 0.2s ease;
    &:hover {
      transform: scale(1.12);
    }
    &.active {
      border-color: ${({ theme }) => theme.colors.bg.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent.solid};
    }
    .checkStyle {
      color: #fff;
      font-size: 0.8rem;
    }
  }

  .user-profile {
    position: relative;
    background-color: ${({ theme }) => theme.colors.bg.primary};

   
    .profile-photo-edit {
      position: absolute;
      right: 0;
      left: auto;
      bottom: 0;
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.bg.primary};
      .icon {
        color: ${({ theme }) => theme.colors.text.secondary};
        border-radius: 50%;
      }
    }
  }
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .details {
      margin: 10px 50px 0px 50px;
    }
    .intro {
      padding: 3rem;
    }
  }
`;



export default Setting;
