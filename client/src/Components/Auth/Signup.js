import React from "react";
import styled from "styled-components";
import SignupForm from "./SignupForm";
import Toggler from "../Toggler";

const Signup = () => {
  return (
    <Wrapper className="login-page-bg">
      <div className="toggle-icon">
        <Toggler />
      </div>
      <div className="h-full flex justify-center items-center">
        <div className="py-6">
          <div className="px-4 flex flex-col justify-center items-center">
            <div className="logo">
              <img src="/images/logo.png" alt="V-Talk logo" />
            </div>
            <SignupForm />
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

export default Signup;
