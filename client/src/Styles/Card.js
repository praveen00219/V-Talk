import styled, { css } from "styled-components";

// =============================================================================
// Card — surface primitive with `solid` (default) and `$glass` variants.
// Used for feature/tech cards, auth panels and chat surfaces.
// =============================================================================
export const Card = styled.div`
  background: ${({ theme }) => theme.colors.bg2.primary};
  border: 1px solid ${({ theme }) => theme.colors.border2.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadow.md};
  transition: transform ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.easeOut},
    box-shadow ${({ theme }) => theme.motion.base}
      ${({ theme }) => theme.motion.ease};

  ${({ $glass }) =>
    $glass &&
    css`
      background: ${({ theme }) => theme.colors.glass};
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      /* graceful fallback handled by the solid background above */
    `}

  ${({ $hover }) =>
    $hover &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 36px ${({ theme }) => theme.colors.boxShadow.primary};
      }
    `}
`;

export default Card;
