import React from "react";
import styled from "styled-components";
import Profile from "./Profile";
import Favourite from "./Favourite";
import Setting from "./Setting";
import Default from "./Default";

import { useSelector } from "react-redux";

// Tab panes for the sidebar. The old Contacts tab (4) was merged into the
// Chat tab's search bar (people search + invite live in Default/UserList now).
const ChatMenu = () => {
  const tabIndex = useSelector((state) => state.tabReducer);
  const user = useSelector((globalState) => globalState.user.userDetails);

  return (
    <>
      <Wrapper className="chat-menu-section ">
        <div className="tab-content">
         

          <div
            className={
              tabIndex === 3 || tabIndex === 0 || tabIndex === 4
                ? "tab-pane active"
                : "tab-pane"
            }
          >
            <Default />
          </div>
                    <div className={tabIndex === 2 ? "tab-pane active" : "tab-pane "}>
            <Favourite />
          </div>
           <div className={tabIndex === 1 ? "tab-pane active" : "tab-pane "}>
            <Profile
              pic={user.pic}
              name={user.name}
              email={user.email}
              about={user.about}
              contact={user.contact}
            />
          </div>
          <div className={tabIndex === 5 ? "tab-pane active" : "tab-pane "}>
            <Setting />
          </div>
        </div>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.section`
  position: relative;
  max-width: 20rem;
  height: 100vh;
  min-width: 20rem;
  z-index: 9;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-right: 1px solid rgba(${({ theme }) => theme.colors.border}, 0.3);
  animation: fadeInLeft 1s;
  /* overflow-x: hidden;
  overflow-y: scroll; */
  .tab-pane {
    display: none;
  }
  .tab-pane.active {
    display: block;
    animation: fadeInUp 0.35s ${({ theme }) => theme.motion.easeOut};
  }
  @media (prefers-reduced-motion: reduce) {
    .tab-pane.active {
      animation: none;
    }
  }
  .chat-menu {
    padding: 1rem 1rem;
    background-color: ${({ theme }) => theme.colors.bg.primary};
    border-bottom: 1px solid rgba(${({ theme }) => theme.colors.border});
    input {
      color: ${({ theme }) => theme.colors.heading};
      background-color: ${({ theme }) => theme.colors.bg.primary};
      border-bottom: 1px solid ${({ theme }) => theme.colors.heading};
      &:hover {
        background-color: ${({ theme }) => theme.colors.bg.primary};
      }
    }
    .icon {
      font-size: 1.5rem;
      color: ${({ theme }) => theme.colors.heading};
      &:hover{
        color: ${({ theme }) => theme.colors.primaryRgb};
      }
    }
    .search-icon {
      background-color: ${({ theme }) => theme.colors.bg.primary};
      /* background-color: rgb(241, 245, 249); */
      &:hover {
        background-color: ${({ theme }) => theme.colors.bg.primary};
        /* background-color: rgb(226, 232, 240); */
      }
    }
  }
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    padding: 1.5rem 0;
    margin-top: 60px;
    position: relative;
    max-width: 100vw;
    min-width: 100vw;
    .chat-menu {
      padding: 2rem 1.5rem;
      .icon {
        font-size: 2rem;
      }
    }
    input {
      font-size: 1.5rem;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.bg.primary};
      &:hover {
        background-color: ${({ theme }) => theme.colors.bg.primary};
      }
    }
    h1 {
      font-size: 2rem;
    }
    p {
      font-size: 1.5rem;
    }
  }
`;

export default ChatMenu;
