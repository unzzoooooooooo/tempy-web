import { useCallback, useEffect, useRef } from "react";

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

/**
 * Converts the dominant wheel axis into a damped horizontal position.
 * Position accessors allow the same loop to drive transform-based rails and
 * native scroll containers without coupling the hook to either implementation.
 */
export function useSmoothHorizontalWheel({
  containerRef,
  getPosition,
  getMaxPosition,
  setPosition,
  onMotionChange,
  shouldIgnoreEvent,
  sensitivity = 0.65,
  damping = 0.16,
  disabledMediaQuery = "(max-width: 760px)",
}) {
  const frameRef = useRef(null);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const optionsRef = useRef({
    getPosition,
    getMaxPosition,
    setPosition,
    onMotionChange,
    shouldIgnoreEvent,
    sensitivity,
    damping,
    disabledMediaQuery,
  });

  useEffect(() => {
    optionsRef.current = {
      getPosition,
      getMaxPosition,
      setPosition,
      onMotionChange,
      shouldIgnoreEvent,
      sensitivity,
      damping,
      disabledMediaQuery,
    };
  });

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    const options = optionsRef.current;
    const position = options?.getPosition?.() ?? 0;
    currentRef.current = position;
    targetRef.current = position;
    options?.onMotionChange?.(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const animate = () => {
      const options = optionsRef.current;
      const maximum = Math.max(0, options.getMaxPosition());
      targetRef.current = clamp(targetRef.current, 0, maximum);

      const remaining = targetRef.current - currentRef.current;
      if (Math.abs(remaining) <= 0.35) {
        currentRef.current = targetRef.current;
        options.setPosition(currentRef.current);
        frameRef.current = null;
        options.onMotionChange?.(false);
        return;
      }

      currentRef.current = clamp(
        currentRef.current + remaining * options.damping,
        0,
        maximum,
      );
      options.setPosition(currentRef.current);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    const handleWheel = (event) => {
      const options = optionsRef.current;
      if (window.matchMedia(options.disabledMediaQuery).matches) return;
      if (options.shouldIgnoreEvent?.(event)) return;

      const horizontalInput = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      let delta = horizontalInput ? event.deltaX : event.deltaY;

      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= container.clientWidth;
      if (Math.abs(delta) < 0.1) return;

      event.preventDefault();
      event.stopPropagation();

      const maximum = Math.max(0, options.getMaxPosition());
      if (frameRef.current === null) {
        const position = clamp(options.getPosition(), 0, maximum);
        currentRef.current = position;
        targetRef.current = position;
      }

      targetRef.current = clamp(
        targetRef.current + delta * options.sensitivity,
        0,
        maximum,
      );
      options.onMotionChange?.(true);

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(animate);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [containerRef]);

  return stop;
}
