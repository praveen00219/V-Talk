import React, { useId, useState } from "react";
import styled from "styled-components";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// =============================================================================
// Field — a single, theme-aware input with optional label, error state and a
// built-in password-visibility toggle (accessible). Replaces the scattered
// input markup + the ShowPasswordToggle hook across the auth forms.
// =============================================================================
const Field = ({
  label,
  id,
  type = "text",
  password = false,
  error,
  icon,
  className,
  ...props
}) => {
  const autoId = useId();
  const inputId = id || autoId;
  const [show, setShow] = useState(false);
  const inputType = password ? (show ? "text" : "password") : type;

  return (
    <Wrapper className={className} $hasError={!!error}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <div className="field-control">
        {icon && <span className="field-icon">{icon}</span>}
        <input
          id={inputId}
          type={inputType}
          className={icon ? "with-icon" : ""}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {password && (
          <button
            type="button"
            className="toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 1.1rem;

  .field-label {
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.colors.heading};
  }

  .field-control {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field-icon {
    position: absolute;
    left: 0.85rem;
    display: flex;
    color: ${({ theme }) => theme.colors.text.muted};
    pointer-events: none;
  }

  input {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.heading};
    border: 1px solid
      ${({ theme, $hasError }) =>
        $hasError
          ? theme.colors.danger
          : `rgba(${theme.colors.border}, 1)`};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
    transition: border-color 0.2s ${({ theme }) => theme.motion.ease},
      box-shadow 0.2s ${({ theme }) => theme.motion.ease};

    &.with-icon {
      padding-left: 2.5rem;
    }
    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
    &:focus,
    &:focus-visible {
      outline: none;
      border-color: ${({ theme, $hasError }) =>
        $hasError ? theme.colors.danger : theme.colors.accent.solid};
      box-shadow: 0 0 0 3px
        ${({ theme, $hasError }) =>
          $hasError
            ? `rgba(${theme.colors.dangerRgb}, 0.35)`
            : theme.colors.accent.ring};
    }
  }

  .toggle {
    position: absolute;
    right: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.35rem;
    font-size: 1.15rem;
    color: ${({ theme }) => theme.colors.text.muted};
    border-radius: ${({ theme }) => theme.radius.sm};
    transition: color 0.2s ease;
    &:hover {
      color: ${({ theme }) => theme.colors.accent.solid};
    }
  }

  .field-error {
    margin-top: 0.4rem;
    font-size: 0.78rem;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

export default Field;
