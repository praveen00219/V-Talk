import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { technologiesImg } from "../config.js/data";

const techDesc = {
  HTML5: "Semantic structure for robust, accessible pages.",
  CSS3: "Custom variables, gradients and responsive tweaks.",
  "Tailwind CSS": "Utility classes for layout, spacing and responsiveness.",
  "Google Fonts": "Crisp, brand‑aligned typography across the app.",
  React: "Component-driven UI with hooks and state management.",
  "Node.js": "APIs and real‑time services powering chat.",
  MongoDB: "Stores users, messages and group metadata.",
};

const Technologies = () => {
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
            {technologiesImg.map((item, index) => (
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
          .avatar {
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
