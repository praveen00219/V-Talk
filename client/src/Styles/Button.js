import React from "react";
import styled, { css, keyframes } from "styled-components";

// =============================================================================
// Button — theme-driven base + optional variants + loading state.
//
// `Button` (named export) stays a styled.button so existing usages that pass
// Tailwind color classes keep working; it now adds focus rings + micro-
// interactions for free. Pass `$variant` for a fully themed look:
//   primary | secondary | ghost | danger | icon
//
// `AppButton` (default export) wraps Button with a built-in `loading` spinner.
// =============================================================================

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.accent.gradient};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
    &:hover:not(:disabled) {
      box-shadow: 0 8px 22px ${({ theme }) => theme.colors.boxShadow.primary};
      transform: translateY(-1px);
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.bg.elevated};
    color: ${({ theme }) => theme.colors.heading};
    border-color: ${({ theme }) => theme.colors.border2.primary};
    &:hover:not(:disabled) {
      border-color: ${({ theme }) => theme.colors.accent.solid};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.heading};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accent.soft};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: ${({ theme }) => theme.colors.white};
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(${({ theme }) => theme.colors.dangerRgb}, 0.35);
    }
  `,
  icon: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.heading};
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.radius.pill};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.accent.soft};
      color: ${({ theme }) => theme.colors.accent.solid};
    }
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: 0.6rem 1.1rem;
  font-size: 0.9375rem;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  transition: color ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease},
    background-color ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease},
    border-color ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease},
    transform ${({ theme }) => theme.motion.fast}
      ${({ theme }) => theme.motion.ease};

  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.99);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant }) => $variant && variants[$variant]}
  ${({ $block }) => $block && css`width: 100%;`}
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const InlineSpinner = styled.span`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const AppButton = ({ loading = false, disabled, children, ...props }) => (
  <Button disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
    {loading && <InlineSpinner aria-hidden="true" />}
    {children}
  </Button>
);

export default AppButton;
