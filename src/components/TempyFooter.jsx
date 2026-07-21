import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { calculatePointerRepel } from "../utils/pointerRepel";

const footerLinks = [
  { label: "DISCOVER", to: "/discover" },
  { label: "CURATOR", to: "/curator" },
  { label: "ARCHIVE", to: "/archive" },
];
const footerTitle = "Listen through time.";

function TempyFooter({ className = "" }) {
  const footerClassName = ["tempy-footer", className].filter(Boolean).join(" ");
  const titleLetterRefs = useRef([]);
  const animationFrameRef = useRef(null);
  const isMotionEnabledRef = useRef(false);
  const letterMotionRefs = useRef([]);

  const getLetterMotion = (index) => {
    if (!letterMotionRefs.current[index]) {
      letterMotionRefs.current[index] = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
      };
    }

    return letterMotionRefs.current[index];
  };

  const resetTitleMotion = () => {
    titleLetterRefs.current.forEach((_, index) => {
      const motion = getLetterMotion(index);
      motion.targetX = 0;
      motion.targetY = 0;
    });
  };

  const handleTitleMove = (event) => {
    if (!isMotionEnabledRef.current) return;

    titleLetterRefs.current.forEach((letter, index) => {
      if (!letter) return;

      const repel = calculatePointerRepel({
        rect: letter.getBoundingClientRect(),
        pointerX: event.clientX,
        pointerY: event.clientY,
        influenceRadius: 96,
        maxX: 14,
        maxY: 9,
      });
      const motion = getLetterMotion(index);
      motion.targetX = repel.x;
      motion.targetY = repel.y;
    });
  };

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      isMotionEnabledRef.current = finePointerQuery.matches && !reducedMotionQuery.matches;
      if (!isMotionEnabledRef.current) {
        titleLetterRefs.current.forEach((letter, index) => {
          const motion = getLetterMotion(index);
          motion.currentX = 0;
          motion.currentY = 0;
          motion.targetX = 0;
          motion.targetY = 0;
          if (letter) letter.style.transform = "none";
        });
      }
    };

    const renderTitleMotion = () => {
      const ease = 0.14;

      titleLetterRefs.current.forEach((letter, index) => {
        if (!letter) return;

        const motion = getLetterMotion(index);
        motion.currentX += (motion.targetX - motion.currentX) * ease;
        motion.currentY += (motion.targetY - motion.currentY) * ease;

        if (
          Math.abs(motion.currentX) < 0.01
          && Math.abs(motion.currentY) < 0.01
          && motion.targetX === 0
          && motion.targetY === 0
        ) {
          motion.currentX = 0;
          motion.currentY = 0;
        }

        if (isMotionEnabledRef.current) {
          letter.style.transform = `translate3d(${motion.currentX.toFixed(2)}px, ${motion.currentY.toFixed(2)}px, 0)`;
        }
      });
      animationFrameRef.current = window.requestAnimationFrame(renderTitleMotion);
    };

    syncMotionPreference();
    finePointerQuery.addEventListener("change", syncMotionPreference);
    reducedMotionQuery.addEventListener("change", syncMotionPreference);
    animationFrameRef.current = window.requestAnimationFrame(renderTitleMotion);

    return () => {
      finePointerQuery.removeEventListener("change", syncMotionPreference);
      reducedMotionQuery.removeEventListener("change", syncMotionPreference);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <footer className={footerClassName}>
      <div className="tempy-footer__copy">
        <p>ONE ALBUM. A DAY OF MOMENTS</p>
        <span
          className="tempy-footer__title-motion"
          onMouseMove={handleTitleMove}
          onMouseLeave={resetTitleMotion}
        >
          <strong aria-label={footerTitle}>
            {[...footerTitle].map((character, index) => (
              <span
                className="tempy-footer__title-letter"
                ref={(node) => { titleLetterRefs.current[index] = node; }}
                aria-hidden="true"
                key={`${character}-${index}`}
              >
                {character}
              </span>
            ))}
          </strong>
        </span>
      </div>
      <nav className="tempy-footer__links" aria-label="Footer links">
        {footerLinks.map((link) => (
          <Link key={link.to} to={link.to}>{link.label}</Link>
        ))}
      </nav>
      <small>© 2026 TEMPY! MUSIC ARCHIVE</small>
    </footer>
  );
}

export default TempyFooter;
