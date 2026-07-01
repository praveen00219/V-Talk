import React from "react";
import styled, { keyframes } from "styled-components";

// Full-screen, theme-aware app loader (accent ring + wordmark).
const Loading = () => {
  return (
    <Wrapper className="flex flex-col justify-center items-center" role="status" aria-live="polite">
      <div className="ring" aria-hidden="true" />
      <span className="brand">
        V<span className="dot">·</span>Talk
      </span>
      <span className="sr-only">Loading…</span>
    </Wrapper>
  );
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Wrapper = styled.section`
  width: 100vw;
  height: 100vh;
  gap: 1.5rem;
  background-color: ${({ theme }) => theme.colors.bg.primary};

  .ring {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 4px solid ${({ theme }) => theme.colors.accent.soft};
    border-top-color: ${({ theme }) => theme.colors.accent.solid};
    animation: ${spin} 0.85s linear infinite;
  }

  .brand {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.heading};
    animation: ${pulse} 1.6s ease-in-out infinite;
  }
  .dot {
    color: ${({ theme }) => theme.colors.accent.solid};
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .ring,
    .brand {
      animation: none;
    }
  }
`;

export default Loading;
