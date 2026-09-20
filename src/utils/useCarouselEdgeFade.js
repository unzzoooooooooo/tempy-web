import { useEffect } from "react";

// Audited content carousels only. Moments Left Now keeps its original implementation.
// Intentionally excluded: Archive Blind Pick's color bars and the Lifestyle,
// Artist, and Similar Curator playlist archives preserve their hard-cut edges.
// The Moment Curator landing also keeps its large LPs fully unmasked.
const CAROUSELS = [
  [".home-page .album-row"],
  [".home-page .artist-row"],
  [".home-page .curator-row"],
  [".home-page .playlist-grid"],
  [".archive-page__people--scroll"],
  [".archive-page__people--liked"],
  [".archive-page__artists"],
  [".profile-playlist-row"],
  [".profile-moment-grid"],
  [".curator-profile__moment-grid"],
  [".curator-profile__playlist-grid"],
  [".curator-profile__similar-list"],
  [".artist-profile__track-flow"],
  [".artist-profile__timeline"],
  [".track-trace-detail__track"],
  [".track-trace-album__timeline-track"],
  [".track-detail-lower__moment-grid"],
  [".track-detail-lower__song-grid"],
  [".artist-playlist-detail__viewport", ".artist-playlist-detail__track"],
  [".lifestyle-playlist-detail__viewport", ".lifestyle-playlist-detail__track"],
  [".artist-playlist-detail__sequence"],
  [".lifestyle-playlist-detail__sequence"],
];
const PROPERTIES = ["--carousel-edge-start", "--carousel-edge-end", "--carousel-fade-left", "--carousel-fade-right"];

export function useCarouselEdgeFade(routeKey) {
  useEffect(() => {
    const root = document.querySelector(".app");
    if (!root) return undefined;
    const entries = new Map();
    let frame = 0;

    const clear = (target) => {
      target.classList.remove("carousel-edge-fade");
      PROPERTIES.forEach((property) => target.style.removeProperty(property));
    };

    const update = () => {
      frame = 0;
      let animating = false;
      for (const [viewport, { target, track }] of entries) {
        const style = getComputedStyle(viewport);
        const rect = viewport.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const native = /^(auto|scroll)$/.test(style.overflowX);
        const transformed = track && /^(hidden|clip)$/.test(style.overflowX);
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        if (!rect.width || !rect.height || (!native && !transformed)) {
          clear(target);
          continue;
        }

        // Account for full-bleed rows and any clipping panel without changing widths.
        let left = Math.max(0, rect.left);
        let right = Math.min(document.documentElement.clientWidth, rect.right);
        for (let parent = viewport.parentElement; parent; parent = parent.parentElement) {
          if (/^(hidden|clip|auto|scroll)$/.test(getComputedStyle(parent).overflowX)) {
            const bounds = parent.getBoundingClientRect();
            left = Math.max(left, bounds.left);
            right = Math.min(right, bounds.right);
          }
        }
        const canLeft = native ? maxScroll > 2 && viewport.scrollLeft > 2 : targetRect.left < left - 2;
        const canRight = native ? maxScroll > 2 && maxScroll - viewport.scrollLeft > 2 : targetRect.right > right + 2;
        if (right <= left || (!canLeft && !canRight)) {
          clear(target);
        } else {
          const values = [left - targetRect.left, right - targetRect.left, canLeft ? 64 : 0, canRight ? 64 : 0];
          PROPERTIES.forEach((property, index) => {
            const value = `${values[index]}px`;
            if (target.style.getPropertyValue(property) !== value) target.style.setProperty(property, value);
          });
          target.classList.add("carousel-edge-fade");
        }
        // Keep the mask fixed to the viewport during existing transform transitions.
        if (track?.getAnimations().some((animation) => animation.playState === "running")) animating = true;
      }
      if (animating) schedule();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resizeObserver = new ResizeObserver(schedule);
    const discover = () => {
      for (const [viewport, entry] of entries) {
        if (!root.contains(viewport)) {
          entry.disconnect();
          entries.delete(viewport);
        }
      }
      for (const [selector, trackSelector] of CAROUSELS) {
        root.querySelectorAll(selector).forEach((viewport) => {
          if (entries.has(viewport)) return;
          const track = trackSelector ? viewport.querySelector(trackSelector) : null;
          const target = track || viewport;
          let transform = track?.style.transform;
          const observer = new MutationObserver(() => {
            // Ignore our own mask properties; react only to carousel movement.
            if (track?.style.transform !== transform) {
              transform = track?.style.transform;
              schedule();
            }
          });
          if (track) observer.observe(track, { attributes: true, attributeFilter: ["style"] });
          viewport.addEventListener("scroll", schedule, { passive: true });
          resizeObserver.observe(viewport);
          if (track) resizeObserver.observe(track);
          entries.set(viewport, {
            target,
            track,
            disconnect() {
              observer.disconnect();
              resizeObserver.unobserve(viewport);
              if (track) resizeObserver.unobserve(track);
              viewport.removeEventListener("scroll", schedule);
              clear(target);
            },
          });
        });
      }
      schedule();
    };
    const contentObserver = new MutationObserver(discover);
    contentObserver.observe(root, { childList: true, subtree: true });
    root.addEventListener("load", schedule, true);
    window.addEventListener("resize", schedule);
    discover();
    return () => {
      contentObserver.disconnect();
      resizeObserver.disconnect();
      entries.forEach((entry) => entry.disconnect());
      root.removeEventListener("load", schedule, true);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [routeKey]);
}
