import React, { useEffect, useState, Fragment } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { verifyEmailLink } from "../Redux/Reducer/Auth/auth.action";
// import { GoUnverified, GoVerified, GoMail } from "react-icons/go";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { getMySelf } from "../Redux/Reducer/User/user.action";
import { Dialog, Transition } from "@headlessui/react";
import { userVerification } from "../Redux/Reducer/Auth/auth.action";
import styled from "styled-components";

const Verify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const [userToken, setUserToken] = useState(null);
  const [status, setStatus] = useState(false);
  let [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("We are verifying your Email...");
  const [userData, setUserData] = useState({
    email: "",
  });
  const result = useSelector((globalState) => globalState.auth.message);
  const success = useSelector((globalState) => globalState.auth.success);
  // const user = useSelector((globalState) => globalState.user.userDetails);
  useEffect(() => {
    setUserToken(token);
    dispatch(verifyEmailLink(userToken));
    setMessage(result);
    dispatch(getMySelf());
    // if(user){

    //   setStatus(user.is_verified);
    // }
  }, [userToken]);
  // useEffect(() => {
  //   if (user) {
  //     setStatus(user.is_verified);
  //     // setStatus(true);
  //     // console.log(user.email);
  //     // dispatch(userVerification(user));
  //   }
  // }, [user]);
  useEffect(() => {
    if (success) {
      setStatus(success);
      // setStatus(true);
      // console.log(user.email);
      // dispatch(userVerification(user));
    }
  }, [success]);

  useEffect(() => {
    if (status) {
      navigate("/");
    }
  }, [status]);
  useEffect(() => {
    if (result) {
      setMessage(result);
    }
  }, [result]);
  function closeModal() {
    setUserData({
      email: "",
    });
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const startChatting = () => {
    navigate("/");
  };

  // const resendLink = () => {
  //   navigate("/verification");
  // };

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendMail = () => {
    if (userData.email === null || userData.email === "") {
      alert("please enter a valid email");
      return;
    }
    // alert(userData.email);
    dispatch(userVerification(userData));
    // const infoMessage = `A verification mail is resend to your email ${userData.email} . Kindly Check your Spam or Junk Folder.`;

    setIsOpen(false);
    setUserData({
      email: "",
    });
  };

  return (
    <>
      <Wrapper className=" flex flex-col items-center justify-center">
        {status ? (
          <>
            <div className="flex flex-col items-center justify-center w-3/4">
              <MdOutlineMarkEmailRead className="mail-icon" color="#16a34a" />

              <p className="verify-text my-2 px-2 mx-auto align-middle">
                Your Email is verified.
              </p>
              <div className=" w-2/4 flex item-center justify-center">
                <button
                  className="cta-btn my-2 mx-auto"
                  onClick={() => startChatting()}
                >
                  <span>Start Chatting</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center w-3/4">
              <MdOutlineMarkEmailRead className="mail-icon" color="#f59e0b" />

              <p className="verify-text my-2 px-2 mx-auto align-middle">
                {message}
              </p>
              <button className="cta-btn my-2 mx-auto" onClick={() => openModal()}>
                <span>Resend Verification Link</span>
              </button>
            </div>
            <Transition className="box" appear show={isOpen} as={Fragment}>
              <Dialog
                as="div"
                className="dialog-box relative z-10"
                onClose={closeModal}
              >
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="dialog-wrapper fixed inset-0 overflow-y-auto">
                  <div className="dialog-container flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="dialog-panel w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg text-center font-medium leading-6 text-gray-900"
                        >
                          Resend Verification Mail
                        </Dialog.Title>

                        {/* Resend verification mail  */}

                        <div className="mt-4">
                          <div>
                            <div className="mb-6">
                              <label
                                htmlFor="base-input"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Enter your Email
                              </label>
                              <input
                                type="email"
                                id="base-input"
                                className="input text-sm block w-full"
                                placeholder="e.g. test@gmail.com"
                                value={userData.email}
                                name="email"
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="modal-footer flex justify-end mt-3">
                          <button
                            type="button"
                            className="close-btn mr-4 inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-cyan-500  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn rounded px-4"
                            onClick={() => sendMail()}
                          >
                            Send
                          </button>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Verify;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  h1,
  p {
    color: ${({ theme }) => theme.colors.heading};
  }

  .mail-icon {
    width: clamp(8rem, 22vw, 13rem);
    height: auto;
  }

  .verify-text {
    font-size: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.heading};
  }

  .cta-btn {
    cursor: pointer;
    padding: 0.85rem 1.75rem;
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.accent.gradient};
    box-shadow: ${({ theme }) => theme.colors.shadow.sm};
    transition: transform 0.3s ${({ theme }) => theme.motion.easeOut},
      box-shadow 0.3s ease;
    span {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #fff;
    }
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px ${({ theme }) => theme.colors.boxShadow.primary};
    }
  }
`;
