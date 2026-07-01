import React from "react";
import Contact from "./Contact";
import Features from "./Features";
import Footer from "./Footer";

import Header from "./Header";
import HeroSection from "./HeroSection";
import Technologies from "./Technologies";
import ScrollToTopButton from "./ScrollToTopButton";
import styled from "styled-components";

const Welcome = () => {
  return (
    <Wrapper>
      <Header />
      <HeroSection />
      <Features />
      <Technologies />
      <Contact />
      <ScrollToTopButton />
      <Footer />
    </Wrapper>
  );
};

export default Welcome;

const Wrapper = styled.section`
  .top-btn {
    background: ${({ theme }) => theme.colors.accent.gradient};
    color: white;
    width: 3.4rem;
    height: 3.4rem;
    font-size: 2rem;
    padding: 0.25rem;
  }
`;
