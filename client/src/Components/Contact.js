import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Wave from "react-wavify";
import { toast, ToastContainer } from "react-toastify";
import AppButton from "../Styles/Button";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const darkThemeEnabled = useSelector(
    (state) => state.themeReducer.darkThemeEnabled
  );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.warn("Please fill in all fields.", { autoClose: 2000 });
      return;
    }
    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address.", {
        autoClose: 2000,
      });
      return;
    }
    // No backend endpoint yet — acknowledge locally. (Wire to an API later.)
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks for your feedback! 💙", {
        autoClose: 2500,
      });
      setForm({ name: "", email: "", message: "" });
    }, 600);
  };

  return (
    <Wrapper id="contact">
      <ToastContainer theme={darkThemeEnabled ? "dark" : "light"} />
      <div className="custom-container">
        <div className="wrapper w-full flex lg:flex-row flex-col lg:space-x-[30px] justify-center items-center">
          <div className="feedback-content lg:w-1/2 w-full">
            <div className="title" data-aos="fade-right">
              <span className="eyebrow">We'd love to hear from you</span>
              <h1>Feel free to drop us your feedback</h1>
              <p className="lead">
                Questions, ideas or bug reports — send them our way and help make
                V‑Talk better.
              </p>
            </div>
          </div>

          {/* feedback form */}
          <div className="feedback-content" data-aos="fade-left">
            <div className="shape-container absolute" aria-hidden="true">
              <img
                src="/images/contact-shape-1.png"
                alt=""
                loading="lazy"
              />
            </div>

            <form
              className="feedback-form flex-1 sm:p-10 py-5 px-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="title">
                <h2>Send us your feedback</h2>
              </div>

              <div className="form-field mt-5">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field mt-4">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  className="input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field suggestion mt-4 w-full">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="input w-full p-4"
                  name="message"
                  rows="5"
                  placeholder="Share your suggestion…"
                  value={form.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <AppButton
                type="submit"
                $variant="primary"
                $block
                loading={submitting}
                className="mt-5"
              >
                {submitting ? "Sending…" : "Send Feedback"}
              </AppButton>
            </form>
          </div>
        </div>
      </div>

      <div className="shapes" aria-hidden="true">
        <div className="svg-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fillOpacity="1"
              d="M0,0L48,32C96,64,192,128,288,133.3C384,139,480,85,576,64C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <Wave
          className="svg-2"
          paused={prefersReducedMotion}
          options={{ height: 20, amplitude: 50, speed: 0.2, points: 3 }}
          opacity={0.03}
        />
        <Wave
          className="svg-3"
          paused={prefersReducedMotion}
          options={{ height: 20, amplitude: 50, speed: 0.3, points: 3 }}
          opacity={0.02}
        />
        <Wave
          className="svg-4"
          paused={prefersReducedMotion}
          options={{ height: 20, amplitude: 50, speed: 0.4, points: 3 }}
          opacity={0.01}
        />
      </div>
    </Wrapper>
  );
};

export default Contact;

const Wrapper = styled.section`
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100%;
  background: radial-gradient(
      900px 500px at 80% 10%,
      rgba(${({ theme }) => theme.colors.accent.rgb}, 0.18),
      transparent 60%
    ),
    #0b1327;
  overflow: hidden;
  padding: 9rem 0;

  .shapes {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    .svg-1 {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0%;
      left: 0%;
      svg {
        fill: ${({ theme }) => theme.colors.bg2.secondary};
      }
    }

    .svg-2,
    .svg-3,
    .svg-4 {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    .svg-2 {
      top: 80%;
      left: 0%;
    }

    .svg-3 {
      top: 75%;
      left: 0%;
    }
    .svg-4 {
      top: 70%;
      left: 0%;
    }
  }

  .custom-container {
    position: relative;
    height: 100%;
    padding: 6rem 5rem;
    z-index: 5;
    .wrapper {
      .feedback-content {
        height: 100%;
        position: relative;
        margin-right: 20px;
        padding-right: 20px;
        .title {
          text-align: center;
          .eyebrow {
            display: inline-block;
            color: ${({ theme }) => theme.colors.accent.solid};
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }
          h1 {
            line-height: 1.2;
            color: ${({ theme }) => theme.colors.white};
          }
          .lead {
            color: rgba(255, 255, 255, 0.72);
            margin-top: 1rem;
            font-size: 1.05rem;
            line-height: 1.7;
          }
        }
        .feedback-form {
          background: ${({ theme }) => theme.colors.bg.primary};
          box-shadow: ${({ theme }) => theme.colors.shadow.lg};

          .form-field {
            display: flex;
            flex-direction: column;
            text-align: left;
            label {
              font-size: 0.85rem;
              font-weight: 600;
              margin-bottom: 0.4rem;
              color: ${({ theme }) => theme.colors.heading};
            }
          }
          textarea.input {
            resize: vertical;
            min-height: 120px;
          }
          .title {
            text-align: center;
            h2 {
              line-height: 1.3;
              color: ${({ theme }) => theme.colors.heading};
            }
          }
        }
      }
      .feedback-content {
        .shape-container {
          top: -50px;
          right: -60px;
          opacity: 0.5;
          img {
            width: 100%;
          }
        }
        .feedback-form {
          border-radius: ${({ theme }) => theme.radius.xl};
        }
      }
    }
  }

  @media only screen and (max-width: 992px) {
    padding: 6rem 0;
    h1 {
      margin-bottom: 1rem;
    }
    .custom-container {
      padding: 3rem 1.5rem;
      .wrapper {
        .feedback-content {
          margin: 0;
          padding: 0;
        }
      }
    }
    .feedback-content {
      margin-bottom: 2.5rem;
    }
  }
`;
