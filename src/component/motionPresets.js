export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  duration: 0.7,
  ease: EASE,
};

export const revealInitial = { opacity: 0, y: 32 };
export const revealFinal = { opacity: 1, y: 0 };

export const viewportOnce = { once: true };

export const revealWithDelay = (delay) => ({ ...fadeUp, delay });