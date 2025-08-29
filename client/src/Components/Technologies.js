import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { technologiesImg } from "../config.js/data";
import { FiChevronDown, FiChevronUp, FiSettings, FiWifi, FiUpload, FiLock, FiShield, FiMail, FiDatabase, FiBox, FiBell, FiTerminal, FiCpu, FiZap, FiEye, FiLink, FiType, FiHexagon, FiPackage, FiClock, FiCloud } from "react-icons/fi";
import { SiRedux, SiReactrouter, SiFramer, SiStyledcomponents, SiSocketdotio, SiExpress, SiMongodb } from "react-icons/si";

const techDesc = {
  HTML5: "Semantic structure for robust, accessible pages.",
  CSS3: "Custom variables, gradients and responsive tweaks.",
  "Tailwind CSS": "Utility classes for layout, spacing and responsiveness.",
  "Google Fonts": "Crisp, brand‑aligned typography across the app.",
  React: "Component-driven UI with hooks and state management.",
  "Node.js": "APIs and real‑time services powering chat.",
  MongoDB: "Stores users, messages and group metadata.",
};

// Icon fallback for technologies without images
const iconMap = {
  "React Router": <SiReactrouter size={36} />,
  Redux: <SiRedux size={36} />,
  "React Redux": <SiRedux size={36} />,
  "Redux Thunk": <FiTerminal size={36} />,
  "Redux Logger": <FiTerminal size={36} />,
  Axios: <FiLink size={36} />,
  "React Toastify": <FiBell size={36} />,
  "React Icons": <FiPackage size={36} />,
  "Framer Motion": <SiFramer size={36} />,
  AOS: <FiZap size={36} />,
  "Emoji Mart": <FiType size={36} />,
  "Styled‑Components": <SiStyledcomponents size={36} />,
  "Headless UI": <FiSettings size={36} />,
  "React Intersection Observer": <FiEye size={36} />,
  "React Detect Offline": <FiWifi size={36} />,
  "React Highlight Words": <FiType size={36} />,
  "React Scroll": <FiLink size={36} />,
  "React Tooltip": <FiType size={36} />,
  Swiper: <FiBox size={36} />,
  "Web Vitals": <FiCpu size={36} />,
  Moment: <FiClock size={36} />,
  "Socket.io Client": <SiSocketdotio size={36} />,
  "Socket.io": <SiSocketdotio size={36} />,
  Express: <SiExpress size={36} />,
  Mongoose: <FiDatabase size={36} />,
  MongoDB: <SiMongodb size={36} />,
  Cloudinary: <FiCloud size={36} />,
  Nodemailer: <FiMail size={36} />,
  JWT: <FiLock size={36} />,
  bcryptjs: <FiShield size={36} />,
  Helmet: <FiShield size={36} />,
  Multer: <FiUpload size={36} />,
  CORS: <FiLock size={36} />,
  Dotenv: <FiHexagon size={36} />,
  "express-async-handler": <FiTerminal size={36} />,
  colors: <FiPackage size={36} />,
};

const Technologies = () => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? technologiesImg : technologiesImg.slice(0, 12);

  return (
    <Wrapper className="technologies-section" id="technologies">
      <div className="custom-container">
        <div
          className="flex items-start justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="section-header text-center">
            <h5>POWERFUL</h5>
            <h2 className="capitalize">Techonolgies Used</h2>
          </div>
        </div>

        <div className="technologies-list">
          <ul>
            {displayed.map((item, index) => (
              <li
                data-aos="fade-up"
                data-aos-delay={(index + 1) * 100}
                key={item.id}
              >
                <motion.div
                  className="card flex flex-col justify-center items-center p-8"
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                  transition={{ type: "tween", duration: 0.25 }}
                >
                  {item.src ? (
                    <img src={item.src} alt={`${item.name}-logo`} />
                  ) : iconMap[item.name] ? (
                    <div className="icon-fallback" aria-hidden>
                      {iconMap[item.name]}
                    </div>
                  ) : (
                    <div className="avatar" aria-hidden>
                      {item.name?.[0] || "?"}
                    </div>
                  )}
                  <h5 className="mt-5 text-center">{item.name}</h5>

                  <motion.div
                    className="overlay"
                    variants={{
                      rest: { y: "100%", opacity: 0 },
                      hover: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.2, 0.65, 0.3, 0.9] }}
                  >
                    <p className="text-sm leading-snug">
                      {item.desc || techDesc[item.name] || "Used throughout the app for a better experience."}
                    </p>
                  </motion.div>
                </motion.div>
              </li>
            ))}
          </ul>

          <div className="more-toggle" data-aos="fade-up" data-aos-delay="200">
            <button
              className="more-btn"
              type="button"
              onClick={() => setShowAll((s) => !s)}
              aria-expanded={showAll}
              aria-controls="technologies"
            >
              <span>{showAll ? "Less" : "More"}</span>
              {showAll ? (
                <FiChevronUp className="chev" aria-hidden />
              ) : (
                <FiChevronDown className="chev" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* shapes code */}
      <div className="shapes">
      <div className="shape-1">
         <img width="250px" src="/images/shape-1.png" alt="" />
        </div>
        <div className="shape-2">
         <div style={{width: "800px"}}>
         <img width="800px" src="/images/shape-1.png" alt="" />
         </div>
        </div>
        <div className="shape-3">
         <div style={{width: "150px"}}>
         <img width="800px" src="/images/shape-3.png" alt="" />
         </div>
        </div>
        <div className="shape-4">
         <img width="43px" src="/images/shape-5.png" alt="" />
        </div>
        <div className="shape-5">
         <img width="43px" style={{zIndex: "2"}} src="/images/shape-6.png" alt="" />
        </div>
      </div>
    </Wrapper>
  );
};

export default Technologies;

const Wrapper = styled.section`
  position: relative;
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.bg2.primary};
  /* overflow: hidden; */

  .custom-container {
    position: relative;
    max-width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 auto;
    z-index: 20;

    .section-header {
      margin: 0 0 25px;
      h2 {
        font-size: 2.5rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.heading};
        margin: 25px 0;
      }
    }

    .technologies-list {
      text-align: center;
      margin: 25px 0;
      ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        li {
          .card {
            /* Glassmorphism */
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-width: 1px 1px 1px 1px;
            border-color: ${({ theme }) => theme.colors.border2.primary};
            width: 10rem;
            height: 10rem;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 15px 50px;
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            will-change: transform;
            box-shadow: 0 2px 12px ${({ theme }) => theme.colors.boxShadow.primary};
          }
          .card:hover {
            box-shadow: 0px 8px 28px ${({ theme }) => theme.colors.boxShadow.primary};
          }
          img {
            max-width: 100%;
            height: auto;
          }
          .avatar, .icon-fallback {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.14);
            color: ${({ theme }) => theme.colors.white};
            display: grid;
            place-items: center;
            font-weight: 700;
            font-size: 1.25rem;
          }
          .icon-fallback {
            font-size: 0; /* icon size controlled via component */
          }
          .overlay {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 12px 14px;
            background: ${({ theme }) => theme.colors.gradientStrong};
            color: ${({ theme }) => theme.colors.white};
            text-align: left;
          }
        }
      }

      .more-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        .more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid ${({ theme }) => theme.colors.border2.primary};
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: ${({ theme }) => theme.colors.heading};
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 12px ${({ theme }) => theme.colors.boxShadow.primary};
        }
        .more-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px ${({ theme }) => theme.colors.boxShadow.primary};
        }
        .more-btn .chev {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .shapes {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    animation: Zoom-fade 5s infinite linear;
    z-index: 1;
    div {
      position: absolute;
    }
    .shape-1 {
      top: -10%;
      left: -3%;
      opacity: 0.1;
    }
    .shape-2 {
      top: -15%;
      right: 16%;
      opacity: 0.1;
    }
    .shape-3 {
      top: 70%;
      left: -3%;
      transform-origin: center;
      transform: rotate(20deg);
      opacity: 0.1;
    }
    .shape-4 {
      bottom: 0%;
      left: 20%;
      transition: all 0.5s;
      animation: balloonfly-02 12s infinite;
    }
    .shape-5 {
      bottom: 0%;
      right: 20%;
      transition: all 0.5s;
      animation: balloonfly-01 12s infinite;
    }
  }

  @media only screen and (min-width: 1680px) {
    .custom-container {
      max-width: 1450px;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
    }
  }
`;
