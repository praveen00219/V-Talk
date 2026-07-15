import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../Styles/Button";
import Field from "../../Styles/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Redux
import { clearAuthStore, signUp } from "../../Redux/Reducer/Auth/auth.action";
import { useNavigate } from "react-router-dom";
import { fadeInUp } from "../../Styles/motion";

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const serverResponse = useSelector((globalState) => globalState.auth);
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );

  useEffect(() => {
    if (!serverResponse) {
      return;
    }
    if (serverResponse.success === false) {
      setLoading(false);
      toast.error(serverResponse.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      dispatch(clearAuthStore());
      return;
    }
    if (serverResponse.success === true) {
      toast.success("Account Created Successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverResponse]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = (e) => {
    if (e) e.preventDefault();

    if (
      !userData.email ||
      !userData.password ||
      !userData.name ||
      !userData.confirmPassword
    ) {
      toast.error("Please Fill the Data", { autoClose: 1000 });
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      toast.error("Password and Confirm Password Does not match", {
        autoClose: 1500,
      });
      return;
    }

    setLoading(true);
    dispatch(signUp(userData));
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
          <h3 className="mb-1 text-center">Create your account</h3>
          <p className="text-center">Get your free V-Talk account now</p>
        </div>
        <div className="px-8 pb-8 card">
          <form className="form-container vertical" onSubmit={handleSignUp}>
            <Field
              id="signup-name"
              label="Name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your name"
              required
              value={userData.name}
              onChange={handleChange}
            />
            <Field
              id="signup-email"
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              required
              value={userData.email}
              onChange={handleChange}
            />
            <Field
              id="signup-contact"
              label="Mobile"
              type="number"
              name="contact"
              autoComplete="tel"
              placeholder="+91-1234567890"
              required
              value={userData.contact}
              onChange={handleChange}
            />
            <Field
              id="signup-password"
              label="Password"
              name="password"
              password
              autoComplete="new-password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
            />
            <Field
              id="signup-confirm"
              label="Confirm Password"
              name="confirmPassword"
              password
              autoComplete="new-password"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleChange}
            />

            <AppButton
              type="submit"
              $variant="primary"
              $block
              loading={loading}
              className="h-11"
            >
              {loading ? "Registering…" : "Register"}
            </AppButton>

            <div className="mt-4 text-center">
              <p>
                <span>Already have an account? </span>
                <NavLink className="auth-link strong" to="/auth">
                  Sign in
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer theme={darkThemeEnabled ? "dark" : "light"} />
    </motion.div>
  );
};

export default SignupForm;
