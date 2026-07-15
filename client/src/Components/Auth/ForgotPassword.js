import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  clearAuthStore,
  forgotPassword,
} from "../../Redux/Reducer/Auth/auth.action";
import AppButton from "../../Styles/Button";
import Field from "../../Styles/Input";
import Toggler from "../Toggler";
import { fadeInUp } from "../../Styles/motion";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
  });
  const [message, setMessage] = useState("");

  const result = useSelector((globalState) => globalState.auth.message);
  const status = useSelector((globalState) => globalState.auth.success);
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );

  useEffect(() => {
    if (result) {
      setMessage(result);
      if (!status) {
        toast.error(result, { position: "top-right", autoClose: 5000 });
      } else {
        toast.success("Password Reset Link sent Successfully", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendPasswordResetLink = (e) => {
    if (e) e.preventDefault();
    if (!userData.email) {
      toast.warn("Please enter a valid email", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    dispatch(forgotPassword(userData));
  };

  const NavigateToForgotPasswordPage = () => {
    dispatch(clearAuthStore());
    setMessage("");
  };

  const NavigateToHomePage = () => {
    dispatch(clearAuthStore());
    navigate("/");
  };

  return (
    <Wrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkThemeEnabled ? "dark" : "light"}
      />
      <div className="toggle-icon">
        <Toggler />
      </div>
      <motion.div
        className="auth-card"
        variants={fadeInUp}
        initial="hidden"
        animate="show"
      >
        <div className="logo">
          <img src="/images/logo.png" alt="V-Talk logo" />
        </div>
        <h3 className="title">Forgot Password</h3>
        {message ? (
          <div className="result">
            <p className="result-text">{message}</p>
            <div className="actions">
              <AppButton $variant="primary" onClick={NavigateToHomePage}>
                Home
              </AppButton>
              <AppButton
                $variant="secondary"
                onClick={NavigateToForgotPasswordPage}
              >
                Resend Link
              </AppButton>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={sendPasswordResetLink}>
            <p className="subtitle">
              Enter your email and we'll send you a reset link.
            </p>
            <Field
              id="forgot-email"
              label="Your email"
              type="email"
              name="email"
              value={userData.email}
              placeholder="e.g. janedoe@gmail.com"
              required
              onChange={handleChange}
            />
            <AppButton type="submit" $variant="primary" $block>
              Send Reset Link
            </AppButton>
          </form>
        )}
      </motion.div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  padding: 1.5rem;
  background: radial-gradient(
      1200px 600px at 50% -10%,
      ${({ theme }) => theme.colors.accent.softer},
      transparent 60%
    ),
    ${({ theme }) => theme.colors.bg.secondary};

  .toggle-icon {
    position: absolute;
    top: 14px;
    right: 20px;
    z-index: 5;
  }

  .auth-card {
    width: 100%;
    max-width: 26rem;
    padding: 2.25rem;
    background-color: ${({ theme }) => theme.colors.bg.primary};
    border: 1px solid ${({ theme }) => theme.colors.border2.primary};
    border-radius: ${({ theme }) => theme.radius.xl};
    box-shadow: ${({ theme }) => theme.colors.shadow.lg};
  }

  .logo {
    text-align: center;
    margin-bottom: 1rem;
    img {
      height: 48px;
      display: inline-block;
    }
  }

  .title {
    text-align: center;
    margin-bottom: 1.25rem;
  }
  .subtitle {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 1.25rem;
  }

  .result-text {
    text-align: center;
    color: ${({ theme }) => theme.colors.text.muted};
    margin-bottom: 1.25rem;
  }
  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
`;

export default ForgotPassword;
