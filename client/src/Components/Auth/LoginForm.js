import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AppButton from "../../Styles/Button";
import Field from "../../Styles/Input";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// Redux
import { clearAuthStore, signIn } from "../../Redux/Reducer/Auth/auth.action";
import { toast } from "react-toastify";
import { fadeInUp } from "../../Styles/motion";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading1, setLoading1] = useState(false);

  const result = useSelector((globalState) => globalState.auth.message);
  const status = useSelector((globalState) => globalState.auth.success);
  const navigateToHome = async () => {
    await navigate("/");
    await dispatch(clearAuthStore());
  };

  useEffect(() => {
    if (result) {
      if (!status) {
        toast.error(result, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(clearAuthStore());
      } else {
        toast.success(result, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigateToHome();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (userData.email && userData.password) {
      setLoading1(true);
      await dispatch(signIn(userData));
      setLoading1(false);
    } else {
      toast.error("Please Fill the Data", {
        autoClose: 1000,
      });
    }
  };

  return (
    <motion.div
      className="auth-page-content col-span-2 flex flex-col justify-center items-center"
      variants={fadeInUp}
      initial="hidden"
      animate="show"
    >
      <div className="xl:min-w-[450px] w-full px-8">
        <div className="mb-6">
          <h3 className="mb-1 text-center">Welcome back!</h3>
          <p className="text-center">Sign in to continue to V-Talk</p>
        </div>
        <div className="p-8 card">
          <form className="form-container vertical" onSubmit={handleLogin}>
            <Field
              id="login-email"
              label="User Name or Email"
              type="email"
              name="email"
              autoComplete="username"
              placeholder="username or email"
              value={userData.email}
              onChange={handleChange}
            />

            <div className="mb-2 flex justify-between items-center">
              <label htmlFor="login-password" className="field-label-inline">
                Password
              </label>
              <NavLink className="auth-link" to="/forgot-password">
                Forgot Password?
              </NavLink>
            </div>
            <Field
              id="login-password"
              name="password"
              password
              autoComplete="current-password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />

            <AppButton
              type="submit"
              $variant="primary"
              $block
              loading={loading1}
              className="h-11"
            >
              {loading1 ? "Signing in…" : "Log In"}
            </AppButton>

            <div className="mt-4 text-center">
              <p>
                <span>Don't have an account yet? </span>
                <NavLink className="auth-link strong" to="/auth/signup">
                  Sign up
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
