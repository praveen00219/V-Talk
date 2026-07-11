import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import AuthPage from "./Pages/AuthPage";
// import HomePage from "./Pages/HomePage";

import { ThemeProvider } from "styled-components";
import { MotionConfig } from "framer-motion";
import { GlobalStyle } from "./GlobalStyle/GlobalStyle";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./Components/Loading";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { getMySelf } from "./Redux/Reducer/User/user.action";
import { fetchChats } from "./Redux/Reducer/Chat/chat.action";
import { ensureE2EEKeys } from "./HelperFunction/e2ee.Helper";
import Verification from "./Components/Verification";
import Verify from "./Components/Verify";

import AOS from "aos";
import "aos/dist/aos.css";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import ErrorPage from "./Components/ErrorPage";
import { makeLightTheme, makeDarkTheme } from "./Components/Themes";
const HomePage = React.lazy(() => import("./Pages/HomePage"));

// Honour the OS "reduce motion" preference for scroll-entrance animations.
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

AOS.init({
  once: true,
  duration: prefersReducedMotion ? 0 : 800,
  offset: 80,
  easing: "ease-out-cubic",
  disable: prefersReducedMotion,
});

function App() {
  const [loading, setloading] = useState(true);
  // const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );
  const user = useSelector((globalState) => globalState.user.userDetails);

  const ThemeColor = useSelector((state) => state.setColorReducer.themeColor);

  // Themes are built from the user-selected accent color so the picker drives
  // CTAs, gradients, focus rings and scrollbars across every surface.
  const lightTheme = makeLightTheme(ThemeColor);
  const darkTheme = makeDarkTheme(ThemeColor);

  const getUserData = async () => {
    await dispatch(getMySelf());
    await dispatch(fetchChats());
  };

  useEffect(() => {
    if (localStorage.ETalkUser) {
      getUserData();
      setloading(false);
    } else {
      setTimeout(() => {
        setloading(false);
      }, 1000);
    }
    // run once on mount; localStorage is a stable reference, not a real dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // E2EE bootstrap: once logged in, make sure this browser has a keypair and
  // the server has its public key
  useEffect(() => {
    if (user && user._id) {
      ensureE2EEKeys(user).catch((error) =>
        console.error("E2EE key setup failed:", error)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user._id]);

  // useEffect(() => {
  //   if (user) {
  //     setStatus(user.is_verified);
  //   }
  //   if (status !== true) {
  //     navigate("/verification");
  //   }
  // }, [user]);

  return (
    <ThemeProvider theme={darkThemeEnabled ? darkTheme : lightTheme}>
      <MotionConfig reducedMotion="user">
      <GlobalStyle />
      <div className="App w-screen">
        {loading ? (
          <Loading />
        ) : (
          <Suspense
            fallback={
              <>
                <Loading />
              </>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/verify-email/:token" element={<Verify />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<AuthPage />}>
                <Route path="" element={<Login />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route path="/*" element={<ErrorPage />} />
            </Routes>
          </Suspense>
        )}
      </div>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
