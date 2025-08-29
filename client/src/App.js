import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import AuthPage from "./Pages/AuthPage";
// import HomePage from "./Pages/HomePage";

import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle/GlobalStyle";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./Components/Loading";
import Contact from "./Components/Contact";
import Features from "./Components/Features";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { getMySelf } from "./Redux/Reducer/User/user.action";
import { fetchChats } from "./Redux/Reducer/Chat/chat.action";
import Verification from "./Components/Verification";
import Verify from "./Components/Verify";

import AOS from "aos";
import "aos/dist/aos.css";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import ErrorPage from "./Components/ErrorPage";
const HomePage = React.lazy(() => import("./Pages/HomePage"));

AOS.init({
  once: true,
  duration: 2000,
  offset: 100,
});

// const socket = io.connect("http://localhost:4000");

function App() {
  const [loading, setloading] = useState(true);
  // const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );
  // const user = useSelector((globalState) => globalState.user.userDetails);

  const ThemeColor = useSelector((state) => state.setColorReducer.themeColor);
  const rgb = ThemeColor.split(")")[0].split("(")[1];

  // Brand palette
  const brand = {
    cream: "#EDE7C7",
    red: "#8B0101",
    maroon: "#5B0302",
    espresso: "#200E00",
  };

  const lightTheme = {
    colors: {
      heading: brand.espresso,
      heading2: brand.cream,
      white: "#fff",
      black: " #212529",
      cyan: brand.red,
      green: "#4eac6d",
      danger: "#ff4e2b",
      light: brand.cream,
      primaryRgb: `${ThemeColor}`,

      text: {
        primary: brand.espresso,
        secondary: "rgba(29 ,29, 29, .8)",
      },

      rgb: {
        primary: `${rgb}`,
        secondary: "78,172,109",
        cyan: "139,1,1",
        heading: "32,14,0",
      },

      bg: {
        primary: brand.cream,
        secondary: "#F3EDEA",
      },
      bg2: {
        primary: "#fff",
        secondary: "rgba(139,1,1,.08)",
      },

      btn: {
        primary: `${rgb}`,
        secondary: "22 163 74",
        danger: "255, 78, 43",
        light: "#f6f6f9",
      },
      border2: {
        primary: "#00000026",
      },
      boxShadow: {
        primary: "rgba(139, 1, 1, 0.3)",
      },

      hr: brand.cream,
      border: "181, 181, 181",
      img_border: "255, 255, 255",
      gradient: `linear-gradient(145deg, ${brand.red}, ${brand.maroon})`,
      gradientStrong: `linear-gradient(145deg, ${brand.red} 0%, ${brand.maroon} 60%)`,
      gradientSubtle: `linear-gradient(180deg, ${brand.red}1a, ${brand.maroon}14)`,
    },
    media: {
      mobile: "800px",
      tab: "998px",
    },
  };
  const darkTheme = {
    colors: {
      heading: brand.cream,
      heading2: brand.espresso,
      white: "#ffffff",
      black: "#000000",
      cyan: brand.red,
      green: "#4eac6d",
      danger: "#ff4e2b",
      light: brand.maroon,
      primaryRgb: `${ThemeColor}`,

      text: {
        primary: brand.cream,
        secondary: "#c3bfb2",
      },

      rgb: {
        primary: `${rgb}`,
        secondary: "78,172,109",
        cyan: "139,1,1",
        heading: "255,255,255",
      },

      bg: {
        black: brand.espresso,
        primary: "#262626",
        secondary: "#2e2e2e",
      },
      border2: {
        primary: "#FFFFFF26",
      },

      bg2: {
        primary: brand.espresso,
        secondary: "#2a1613",
      },
      boxShadow: {
        primary: "rgba(139, 1, 1, 0.55)",
      },

      btn: {
        primary: `${rgb}`,
        secondary: "22 163 74",
        danger: "255, 78, 43",
        light: "#25262c",
      },

      hr: "#ffffff",
      border: "65, 66, 72",
      img_border: "31, 41, 55",
      gradient: `linear-gradient(145deg, ${brand.maroon}, ${brand.red})`,
      gradientStrong: `linear-gradient(145deg, ${brand.maroon} 0%, ${brand.red} 60%)`,
      gradientSubtle: `linear-gradient(180deg, ${brand.maroon}26, ${brand.red}14)`,
    },
    media: {
      mobile: "800px",
      tab: "998px",
    },
  };

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
    // eslint-disable-next-line
  }, [localStorage]);

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
    </ThemeProvider>
  );
}

export default App;
