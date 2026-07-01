import styled, { keyframes } from "styled-components";

// =============================================================================
// Skeleton — shimmer placeholder for loading states (chat list, messages...).
// Width / height / borderRadius are passed via props so it adapts to any slot.
// =============================================================================
const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const Skeleton = styled.div`
  width: ${({ $w }) => $w || "100%"};
  height: ${({ $h }) => $h || "1rem"};
  border-radius: ${({ $radius, theme }) => $radius || theme.radius.sm};
  background: linear-gradient(
    90deg,
    rgba(${({ theme }) => theme.colors.rgb.heading}, 0.06) 25%,
    rgba(${({ theme }) => theme.colors.rgb.heading}, 0.13) 37%,
    rgba(${({ theme }) => theme.colors.rgb.heading}, 0.06) 63%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export default Skeleton;
