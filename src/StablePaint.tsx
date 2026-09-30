import { useLayoutEffect } from "react";
import { useCurrentFrame, useDelayRender } from "remotion";

/** Wait for the current frame's canvas, fonts and compositor before capture. */
export const StablePaint = () => {
  const frame = useCurrentFrame();
  const { delayRender, continueRender } = useDelayRender();
  useLayoutEffect(() => {
    const handle = delayRender(`Waiting for frame ${frame} to paint`);
    let alive = true;
    let settled = false;
    let first = 0;
    let second = 0;
    const release = () => {
      if (settled) return;
      settled = true;
      continueRender(handle);
    };
    void document.fonts.ready.then(() => {
      if (!alive) return;
      first = requestAnimationFrame(() => {
        second = requestAnimationFrame(release);
      });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
      release();
    };
  }, [frame, delayRender, continueRender]);
  return null;
};
