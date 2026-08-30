import { useCallback, useEffect, useState } from "react";

const SCROLL_TOLERANCE = 2;

export function useNativeHorizontalScrollArrows({
  containerRef,
  itemSelector,
  stepItems = 2.2,
}) {
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
    const nextState = {
      canScrollLeft: maxScroll > SCROLL_TOLERANCE && container.scrollLeft > SCROLL_TOLERANCE,
      canScrollRight: maxScroll > SCROLL_TOLERANCE
        && maxScroll - container.scrollLeft > SCROLL_TOLERANCE,
    };

    setScrollState((currentState) => (
      currentState.canScrollLeft === nextState.canScrollLeft
      && currentState.canScrollRight === nextState.canScrollRight
        ? currentState
        : nextState
    ));
  }, [containerRef]);

  const scrollByDirection = useCallback((direction) => {
    const container = containerRef.current;
    if (!container) return;

    const firstItem = itemSelector ? container.querySelector(itemSelector) : null;
    const itemWidth = firstItem?.getBoundingClientRect().width;
    const columnGap = Number.parseFloat(window.getComputedStyle(container).columnGap) || 0;
    const distance = itemWidth
      ? (itemWidth + columnGap) * stepItems
      : container.clientWidth * 0.68;

    container.scrollBy({ left: distance * direction, behavior: "smooth" });
  }, [containerRef, itemSelector, stepItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const animationFrame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);
    container.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      container.removeEventListener("scroll", updateScrollState);
    };
  }, [containerRef, updateScrollState]);

  return {
    ...scrollState,
    scrollLeft: () => scrollByDirection(-1),
    scrollRight: () => scrollByDirection(1),
    updateScrollState,
  };
}
