import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import LoginForm from "./LoginForm";
import Toggler from "../Toggler";
import { ToastContainer } from "react-toastify";

const Login = () => {
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );
  return (
    <Wrapper className="login-page-bg">
      <ToastContainer theme={darkThemeEnabled ? "dark" : "light"} />
      <div className="toggle-icon">
        <Toggler />
      </div>
      <div className="relative h-full flex justify-center items-center">
        <div className="h-full py-6">
          <div className="px-4 flex flex-col justify-center items-center">
            <div className="logo">
              <img src="/images/logo.png" alt="V-Talk logo" />
            </div>
            <LoginForm />
            <div className="mt-2 text-center">
              <p className="copy">© {new Date().getFullYear()} V-Talk</p>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: radial-gradient(
      1200px 600px at 50% -10%,
      ${({ theme }) => theme.colors.accent.softer},
      transparent 60%
    ),
    ${({ theme }) => theme.colors.bg.secondary};

  .logo {
    margin-bottom: 0.5rem;
    img {
      height: 52px;
    }
  }
  .toggle-icon {
    position: absolute;
    top: 14px;
    right: 20px;
    display: flex;
    font-size: 2rem;
    justify-content: flex-end;
    z-index: 5;
  }

  .copy {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.85rem;
  }

  .auth-page-content {
    width: 100%;

    .card {
      border-radius: ${({ theme }) => theme.radius.xl};
      background-color: ${({ theme }) => theme.colors.bg.primary};
      border: 1px solid ${({ theme }) => theme.colors.border2.primary};
      box-shadow: ${({ theme }) => theme.colors.shadow.lg};
    }

    .field-label-inline {
      font-size: 0.85rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.heading};
    }

    .auth-link {
      font-size: 0.85rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.accent.solid};
      transition: opacity 0.2s ease;
      &:hover {
        text-decoration: underline;
        opacity: 0.85;
      }
      &.strong {
        font-weight: 700;
      }
    }
  }
`;

export default Login;
