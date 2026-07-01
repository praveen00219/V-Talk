import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  clearAuthStore,
  resetPassword,
} from "../../Redux/Reducer/Auth/auth.action";
import AppButton from "../../Styles/Button";
import Field from "../../Styles/Input";
import Toggler from "../Toggler";
import { fadeInUp } from "../../Styles/motion";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [userData, setUserData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const result = useSelector((globalState) => globalState.auth.message);
  const status = useSelector((globalState) => globalState.auth.success);

  useEffect(() => {
    setUserData((prev) => ({ ...prev, token: token }));
  }, [token]);

  useEffect(() => {
    if (result) {
      setMessage(result);
      if (!status) {
        toast.error(result, { position: "top-right", autoClose: 5000, theme: "light" });
      } else {
        toast.success(result, { position: "top-right", autoClose: 5000, theme: "light" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendPasswordResetLink = (e) => {
    if (e) e.preventDefault();
    if (!userData.newPassword && !userData.confirmPassword) {
      toast.warn("Please fill new Password and Confirm Password both", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }
    if (userData.newPassword !== userData.confirmPassword) {
      toast.warn("Password and Confirm Password do not match.", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
      return;
    }
    dispatch(resetPassword(userData));
  };

  const NavigateToForgotPasswordPage = () => {
    dispatch(clearAuthStore());
    navigate("/forgot-password");
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
        theme="light"
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
        <h2 className="title">Reset Password</h2>
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
            <Field
              id="reset-new"
              label="New Password"
              name="newPassword"
              password
              autoComplete="new-password"
              value={userData.newPassword}
              placeholder="New password"
              required
              onChange={handleChange}
            />
            <Field
              id="reset-confirm"
              label="Confirm Password"
              name="confirmPassword"
              password
              autoComplete="new-password"
              value={userData.confirmPassword}
              placeholder="Confirm password"
              required
              onChange={handleChange}
            />
            <AppButton type="submit" $variant="primary" $block>
              Change Password
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
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
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

export default ResetPassword;
