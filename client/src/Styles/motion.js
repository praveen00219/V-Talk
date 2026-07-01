// =============================================================================
// Shared framer-motion presets so entrance / hover motion is consistent and
// reused across landing, auth and chat instead of re-defined per component.
// framer-motion already respects `prefers-reduced-motion` via <MotionConfig>,
// and the global CSS guard neutralizes transitions too.
// =============================================================================
const EASE_OUT = [0.16, 1, 0.3, 1];

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

// Parent container that staggers its children's `show` state.
export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const springConfig = { type: "spring", stiffness: 320, damping: 30 };

// Convenience for whileInView usage.
export const viewportOnce = { once: true, amount: 0.2 };
