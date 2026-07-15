import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;
    scroll-behavior: smooth;
  }

  html { scroll-behavior: smooth; }

  body {
    background-color: ${({ theme }) => theme.colors.bg.primary};
    color: ${({ theme }) => theme.colors.heading};
    transition: background-color 0.4s ${({ theme }) => theme.motion.ease},
      color 0.4s ${({ theme }) => theme.motion.ease};
  }

  /* Accessible focus ring for keyboard users (accent-tinted). */
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.ring};
    border-radius: ${({ theme }) => theme.radius.sm};
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent.soft};
    color: ${({ theme }) => theme.colors.heading};
  }

  ::-webkit-scrollbar {
    background-color: initial;
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(${({ theme }) => theme.colors.rgb.primary}, .25);
    border-radius: 10px;
    transition: background-color 0.2s ease;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(${({ theme }) => theme.colors.rgb.primary}, .45);
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px ${({ theme }) => theme.colors.border};
}

.App{
  position: relative;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  color: ${({ theme }) => theme.colors.heading};
  overflow-x: hidden;
  transition: background-color 0.4s ${({ theme }) => theme.motion.ease},
    color 0.4s ${({ theme }) => theme.motion.ease};
}

.box{
  position: absolute;
  z-index: 100;
}

.dialog-wrapper {
  .dialog-container{
    
    background-color: rgba(${({ theme }) => theme.colors.border},0.5)
  }
  .dialog-panel{
  color: ${({ theme }) => theme.colors.heading};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  .button, .btn{
    background-color: ${({ theme }) => theme.colors.primaryRgb};
  }
  .btn{
    color: ${({ theme }) => theme.colors.white};
  }
  .close-btn{
    color: ${({ theme }) => theme.colors.primaryRgb};
    &:hover{
      color: ${({ theme }) => theme.colors.white} !important;
      background-color: ${({ theme }) => theme.colors.primaryRgb} !important;
    }
  }
  .user-list{
      max-height: 190px;
    }
  .search-user-box {
    .profile {
        position: absolute;
        left: 0;
        width: 50px;
        height: 50px;
      }
      .details {
        padding: 12px 12px 12px 60px;
        }
        .user-add{
          color: ${({ theme }) => theme.colors.heading};
          &:hover{
            background-color: ${({ theme }) => theme.colors.bg.secondary};
          }
        }
  }
  .close-btn{
    &:hover{
      color: black;
      background-color: rgb(6, 182, 212);
    }
  }
  h3,h5,label{
    color: ${({ theme }) => theme.colors.heading}
  }
  input{
    background-color: ${({ theme }) => theme.colors.bg.secondary};
  }
}
  }

  .user-profile-sidebar {
    .dialog-wrapper {
      .dialog-container {
    background: none;
    .dialog-panel{
      background-color: ${({ theme }) => theme.colors.bg.primary};
      box-shadow: 0 0 10px rgb(${({ theme }) => theme.colors.bg.secondary});

      .sidebar{
        color: ${({ theme }) => theme.colors.heading};
        .sidebar-active{
          background-color: ${({ theme }) => theme.colors.bg.primary};
        }
      }
    }
   }
    }
  }

  .disclosure-Panel{
    .btn-style{
     width: 2rem;
     height: 2rem;
     margin-left: 1rem;
     border: none;
     outline: none;
    cursor: pointer;
    }
  }

  button,
  input,
  label,
  select,
  textarea {
    font-size: 100%;
    margin: 0;
    padding: 0;
  }
 
  .input {
    -webkit-appearance: none;
    appearance: none;
    background-color: ${({ theme }) => theme.colors.bg.secondary};
    color: ${({ theme }) => theme.colors.heading};
    border-style: solid;
    border-color: rgba(${({ theme }) => theme.colors.border}, 1);
    border-radius: ${({ theme }) => theme.radius.md};
    border-width: 1px;
    padding: 0.65rem 0.85rem;
    width: 100%;
    transition: border-color 0.2s ${({ theme }) => theme.motion.ease},
      box-shadow 0.2s ${({ theme }) => theme.motion.ease},
      background-color 0.2s ${({ theme }) => theme.motion.ease};
  }
  .input::placeholder { color: ${({ theme }) => theme.colors.text.muted}; }
  .input:focus,
  .input:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.solid};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accent.ring};
  }

  .dropzone {
    border-color: rgba(${({ theme }) => theme.colors.accent.rgb}, 0.5);
    color: ${({ theme }) => theme.colors.heading};
    transition: border-color 0.2s ${({ theme }) => theme.motion.ease},
      background-color 0.2s ${({ theme }) => theme.motion.ease};
  }
  .dropzone:hover {
    border-color: ${({ theme }) => theme.colors.accent.solid};
    background-color: ${({ theme }) => theme.colors.accent.softer};
  }

  .user-badge {
    background: ${({ theme }) => theme.colors.accent.soft};
    color: ${({ theme }) => theme.colors.primaryRgb};
  }
  .badge-remove {
    color: ${({ theme }) => theme.colors.primaryRgb};
    transition: background-color 0.2s ${({ theme }) => theme.motion.ease};
    &:hover {
      background: ${({ theme }) => theme.colors.accent.soft};
    }
  }
  
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0.1rem;
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.heading};
  }

  a {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.heading};
  }

  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  p,span {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.65;
  }

  h1 {
    font-size: clamp(2.25rem, 1.6rem + 2.8vw, 3.25rem);
    font-weight: 800;
    line-height: 1.12;
  }

  h2 {
    font-size: clamp(1.9rem, 1.45rem + 1.9vw, 2.5rem);
    font-weight: 700;
    line-height: 1.18;
  }

  h3 {
    font-size: clamp(1.5rem, 1.2rem + 1.1vw, 2rem);
    font-weight: 600;
    line-height: 1.25;
  }
  h4{
    font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
    font-weight: 600;
    line-height: 1.3;
  }
  
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .btn-light {
    color: ${({ theme }) => theme.colors.heading};
    background-color: ${({ theme }) => theme.colors.btnlight};
    border-color: ${({ theme }) => theme.colors.btnlight};
  }

  

  @keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-70%, 0, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translate3d(0, 18px, 0); }
  100% { opacity: 1; transform: translate3d(0, 0, 0); }
}

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

@keyframes softPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.typing-loader {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    animation: loadertyping .8s ease-in-out infinite alternate;
    animation-delay: .32s;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: -28px;
}

.typing-loader:after, .typing-loader:before {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 100%;
    box-shadow: 0 40px 0 ${({ theme }) => theme.colors.primaryRgb};
    animation: loadertyping .8s ease-in-out infinite alternate;
}
.typing-loader:before {
    left: -17px;
    animation-delay: .48s;
}
.typing-loader:after {
    right: -17px;
    animation-delay: .16s;
}
@keyframes loadertyping {
  0% {
    box-shadow: 0 30px 0 ${({ theme }) => theme.colors.primaryRgb};
}
100% {
    box-shadow: 0 10px 0 ${({ theme }) => theme.colors.primaryRgb};
}
}


  
  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    html {
      font-size: 75%;
    }
  
    .grid {
      gap: 3.2rem;
    }
  
    .grid-cols-2 {
      grid-template-columns: 1fr;
    }
    .user-chat-show{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 40;
    transition: transform 0.25s linear;
    }
  .fadeInRight2{
    transform: translateX(100vw);
  }
.fadeInRight{
    transform: translateX(0);
  }
  }

`;
