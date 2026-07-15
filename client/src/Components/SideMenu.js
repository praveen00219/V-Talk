import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { AiOutlineSetting, AiOutlineStar } from "react-icons/ai";
import { BsChatSquareDots } from "react-icons/bs";
import { CgClose, CgMenu } from "react-icons/cg";

import { IoLogOutOutline } from "react-icons/io5";

// redux
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../Redux/Reducer/Auth/auth.action";
import { toggleTab } from "../Redux/Reducer/Tab/tabAction";

// Profile and the light/dark toggle now live inside Settings (tabId 5), so
// they no longer have their own sidebar icons. The nav is split into a top
// group (Chats, Favourite) and a bottom group (Setting, Logout) pinned to
// the bottom of the rail.
const topIconsList = [
  {
    tabId: 3,
    icon: BsChatSquareDots,
    title: "Chats",
  },
  {
    tabId: 2,
    icon: AiOutlineStar,
    title: "Favourite",
  },
];

const SideMenu = () => {
  const [menuIcon, setMenuIcon] = useState();

  const tabIndex = useSelector((state) => state.tabReducer);
  const dispatch = useDispatch();

  const activeTab = (index) => {
    dispatch(toggleTab(index));
  };

  const handleLogout = () => {
    dispatch(signOut());
  };

  const renderNavButton = (items) => {
    const isActive =
      (items.tabId === 3 && tabIndex === 0) || tabIndex === items.tabId;
    return (
      <li key={items.tabId} className="side-menu-item">
        <button
          type="button"
          aria-label={items.title}
          aria-current={isActive ? "page" : undefined}
          title={items.title}
          className={isActive ? "nav-link active" : "nav-link"}
          onClick={() => {
            activeTab(items.tabId);
            setMenuIcon(false);
          }}
        >
          <items.icon className="icon" />
        </button>
      </li>
    );
  };

  return (
    <Wrapper>
      <div
        className={
          menuIcon
            ? " side-menu active flex justify-between"
            : " side-menu flex justify-between"
        }
      >
        <div className=" mobile-navbar overflow-y-auto">
          <div className="sideMenu-brand-logo">
            <NavLink to="/" className="logo">
              <span>
                <img src="images/logo.png" alt="logo" />
              </span>
            </NavLink>
          </div>
          <div className="mobile-sideMenu-btn justify-center items-center">
            <CgMenu
              name="menu-outline"
              className="mobile-nav-icon"
              onClick={() => setMenuIcon(true)}
            />
            <CgClose
              name="close-outline"
              className="mobile-nav-icon close-outline"
              onClick={() => setMenuIcon(false)}
            />
          </div>
        </div>

        <div className="side-menu-bar overflow-y-auto">
          <div className="sideMenu-brand-box">
            <NavLink to="/" className="logo">
              <span>
                <img src="images/logo.png" alt="logo" />
              </span>
            </NavLink>
          </div>
          <div className="side-menu-list">
            <ul className="nav-top flex flex-col gap-4">
              {topIconsList.map(renderNavButton)}
            </ul>

            {/* Setting + Logout pinned to the bottom of the rail */}
            <ul className="nav-bottom flex flex-col gap-4">
              {renderNavButton({
                tabId: 5,
                icon: AiOutlineSetting,
                title: "Setting",
              })}
              <li className="side-menu-item">
                <button
                  type="button"
                  aria-label="Logout"
                  title="Logout"
                  className="nav-link"
                  onClick={handleLogout}
                >
                  <IoLogOutOutline className="icon" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .side-menu {
    max-width: 100px;
    height: 100vh;
    min-width: 100px;
    flex-direction: column;
    border-right: 1px solid rgba(${({ theme }) => theme.colors.border});
    background-color: ${({ theme }) => theme.colors.bg.primary};
    animation: fadeInLeft 1s ease-in-out;
  }
  .side-menu-bar {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .sideMenu-brand-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    flex-shrink: 0;
    .logo {
      img {
        vertical-align: middle;
        height: 50px;
      }
    }
  }
  .side-menu-list {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 1rem;
    .side-menu-item {
      margin: 7px auto;
      cursor: pointer;
      .nav-link.active {
        background-color: ${({ theme }) => theme.colors.accent.soft};
        color: ${({ theme }) => theme.colors.primaryRgb};
      }
      /* accent indicator bar for the active tab */
      .nav-link.active::before {
        content: "";
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 26px;
        border-radius: 4px;
        background: ${({ theme }) => theme.colors.primaryRgb};
      }
      .nav-link {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 52px;
        font-size: 1.6rem;
        margin: 0 auto;
        width: 52px;
        background: transparent;
        border: none;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.text.secondary};
        border-radius: ${({ theme }) => theme.radius.md};
        transition: background-color 0.2s ${({ theme }) => theme.motion.ease},
          color 0.2s ${({ theme }) => theme.motion.ease},
          transform 0.15s ${({ theme }) => theme.motion.easeOut};
        &:hover {
          color: ${({ theme }) => theme.colors.primaryRgb};
          background-color: ${({ theme }) => theme.colors.accent.softer};
        }
        &:active {
          transform: scale(0.92);
        }
        .icon {
          display: inline;
        }
        .profile-user {
          border: 3px solid ${({ theme }) => theme.colors.primaryRgb};
        }
      }
    }
  }
  .mobile-navbar {
    display: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
  .mobile-sideMenu-btn {
    background-color: transparent;
    cursor: pointer;
    border: none;
  }
  .mobile-nav-icon[name="close-outline"] {
    display: none;
  }
  .close-outline {
    display: none;
  }
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .side-menu {
      position: absolute;
      top: 0;
      left: 0;
      max-height: 80px;
      max-width: 100vw;
      min-height: 80px;
      z-index: 30;
    }
    .side-menu-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding-bottom: 0;
      ul {
        height: auto;
        .nav-link {
          font-size: 3rem !important;
        }
      }
    }
    .side-menu-bar {
      background-color: ${({ theme }) => theme.colors.bg.primary};
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      transition: transform 0.3s ${({ theme }) => theme.motion.easeOut};
      z-index: 20;
      max-width: 100px;
      box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.35);
      height: 100vh;
      min-width: 100px;
    }
    .sideMenu-brand-box {
      display: none;
    }
    //mobile-navbar
    .sideMenu-brand-logo {
      display: inline;
      height: auto;
      .logo {
        img {
          vertical-align: middle;
          height: 40px;
        }
      }
    }
    .active .side-menu-bar {
      transform: translateX(0%);
      transform-origin: left;
      transition: transform 0.3s ${({ theme }) => theme.motion.easeOut};
    }
    .mobile-navbar {
      position: relative;
      width: 100vw;
      height: 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 3.2rem;
      z-index: 10;
    }
    .mobile-sideMenu-btn {
      display: inline-block;
      z-index: 20;
      border: ${({ theme }) => theme.colors.heading};
      .mobile-nav-icon {
        font-size: 2.2rem;
        color: ${({ theme }) => theme.colors.heading};
      }
    }
    .active .mobile-navbar .mobile-nav-icon {
      display: none;
      font-size: 2.2rem;
      color: ${({ theme }) => theme.colors.heading};
      z-index: 20;
    }
    .active .mobile-navbar .close-outline {
      display: inline-block;
    }
  }
`;

export default SideMenu;
