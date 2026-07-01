import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { CgChevronDoubleUp } from "react-icons/cg";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    const listenToScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      setVisible(winScroll > 250);
    };
    listenToScroll();
    window.addEventListener("scroll", listenToScroll, { passive: true });
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <Wrapper
          as={motion.button}
          type="button"
          className="top-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.8 }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <CgChevronDoubleUp className="up-icon" />
        </Wrapper>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;

const Wrapper = styled.button`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 2rem;
  right: 2rem;
  cursor: pointer;
  border: none;
  padding: 0.25rem;
  z-index: 999;
  border-radius: 50%;
  box-shadow: 0px 8px 24px ${({ theme }) => theme.colors.boxShadow.primary};

  .up-icon {
    transition: transform 0.3s ${({ theme }) => theme.motion.easeOut};
  }
`;
