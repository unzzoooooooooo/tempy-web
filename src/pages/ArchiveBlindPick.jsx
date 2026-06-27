import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOOP_COUNT = 5;
const MIDDLE_LOOP_INDEX = Math.floor(LOOP_COUNT / 2);
const POSITION_LERP = 0.12;
const SCALE_LERP = 0.22;
const REVEAL_STAGGER = 38;
const REVEAL_DURATION = 760;

const baseBlindPickItems = [
  { id: 1, color: "cream", cover: "/images/album-01.png", title: "It’s Me", artist: "ILLIT(아일릿)", meta: "23:42 · Rain" },
  { id: 2, color: "blue", cover: "/images/album-02.png", title: "Blue Hour", artist: "TXT", meta: "19:12 · Cloud" },
  { id: 3, color: "navy", cover: "/images/album-03.png", title: "BIRDS OF A FEATHER", artist: "Billie Eilish", meta: "00:08 · Fog" },
  { id: 4, color: "red", cover: "/images/album-04.png", title: "Puppet Show", artist: "XG", meta: "17:35 · Clear" },
  { id: 5, color: "sky", cover: "/images/album-05.png", title: "Blinding Lights", artist: "The Weeknd", meta: "21:46 · Wind" },
  { id: 6, color: "cream", cover: "/images/album-06.png", title: "Confetti Dream", artist: "HONNE", meta: "08:20 · Sun" },
  { id: 7, color: "blue", cover: "/images/album-07.png", title: "Traveler", artist: "Wave Club", meta: "14:09 · Clear" },
  { id: 8, color: "navy", cover: "/images/album-08.png", title: "Upside Mood", artist: "Ariana Grande", meta: "11:17 · Cloud" },
  { id: 9, color: "red", cover: "/images/album-09.png", title: "Tattoo City", artist: "Night Loop", meta: "02:32 · Rain" },
  { id: 10, color: "sky", cover: "/images/moment-01.png", title: "Night Walk", artist: "HYUKOH", meta: "22:10 · Rain" },
];

function ArchiveBlindPick() {
  const navigate = useNavigate();
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const barRefs = useRef([]);
  const setWidthRef = useRef(0);
  const middleStartRef = useRef(0);
  const barSizeRef = useRef(160);
  const currentPositionRef = useRef(0);
  const targetPositionRef = useRef(0);
  const pointerXRef = useRef(null);
  const pointerActiveRef = useRef(false);
  const currentScalesRef = useRef([]);
  const targetScalesRef = useRef([]);
  const isRevealedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const closingTimeoutRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  const loopItems = useMemo(() => (
    Array.from({ length: LOOP_COUNT }, (_, loopIndex) => (
      baseBlindPickItems.map((item, itemIndex) => ({
        ...item,
        itemIndex,
        renderIndex: loopIndex * baseBlindPickItems.length + itemIndex,
        loopKey: `${loopIndex}-${item.id}`,
      }))
    )).flat()
  ), []);

  const selectedItem = loopItems.find((item) => item.loopKey === selectedId);

  const applyOffset = useCallback((offset) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }, []);

  const applyScale = useCallback((renderIndex, scale) => {
    const bar = barRefs.current[renderIndex];
    if (!bar) return;
    bar.style.transform = `translate3d(0, 0, 0) scaleY(${scale})`;
  }, []);

  const resetBarScales = useCallback(() => {
    currentScalesRef.current = loopItems.map(() => 1);
    targetScalesRef.current = loopItems.map(() => 1);
    loopItems.forEach((item) => applyScale(item.renderIndex, 1));
  }, [applyScale, loopItems]);

  const updateRevealDelays = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;

    const viewportWidth = window.innerWidth;
    const bars = Array.from(track.querySelectorAll(".archive-blind-page__bar"));
    const positionedBars = bars.map((bar) => ({
      bar,
      rect: bar.getBoundingClientRect(),
    }));

    const visibleBars = positionedBars
      .filter(({ rect }) => rect.right > 0 && rect.left < viewportWidth)
      .sort((a, b) => a.rect.left - b.rect.left);
    const rightSideBars = positionedBars
      .filter(({ rect }) => rect.left >= viewportWidth)
      .sort((a, b) => a.rect.left - b.rect.left);
    const leftSideBars = positionedBars
      .filter(({ rect }) => rect.right <= 0)
      .sort((a, b) => a.rect.left - b.rect.left);

    [...visibleBars, ...rightSideBars, ...leftSideBars].forEach(({ bar }, index) => {
      bar.style.setProperty("--reveal-delay", `${index * REVEAL_STAGGER}ms`);
    });

    return visibleBars.length;
  }, []);

  const applyIntroSpread = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const viewportCenter = window.innerWidth / 2;
    const maxSpread = Math.min(Math.max(window.innerWidth * 0.16, 90), 280);
    const shells = Array.from(track.querySelectorAll(".archive-blind-page__bar-shell"));

    shells.forEach((shell) => {
      const rect = shell.getBoundingClientRect();
      const shellCenter = rect.left + (rect.width / 2);
      const normalized = Math.max(-1, Math.min(1, (shellCenter - viewportCenter) / viewportCenter));
      shell.style.setProperty("--intro-offset", `${normalized * maxSpread}px`);
    });
  }, []);

  const measureAndCenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.children[0];
    const nextSetItem = track.children[baseBlindPickItems.length];
    const middleSetItem = track.children[baseBlindPickItems.length * MIDDLE_LOOP_INDEX];
    if (!firstItem || !nextSetItem || !middleSetItem) return;

    setWidthRef.current = nextSetItem.offsetLeft - firstItem.offsetLeft;
    barSizeRef.current = firstItem.offsetWidth || 160;
    middleStartRef.current = middleSetItem.offsetLeft;
    currentPositionRef.current = middleStartRef.current;
    targetPositionRef.current = middleStartRef.current;
    currentScalesRef.current = loopItems.map(() => 1);
    targetScalesRef.current = loopItems.map(() => 1);
    applyOffset(currentPositionRef.current);
    resetBarScales();
  }, [applyOffset, loopItems, resetBarScales]);

  function normalizePosition() {
    const setWidth = setWidthRef.current;
    if (setWidth === 0) return;

    const lowerBound = setWidth;
    const upperBound = setWidth * (LOOP_COUNT - 2);

    while (currentPositionRef.current < lowerBound) {
      currentPositionRef.current += setWidth;
      targetPositionRef.current += setWidth;
    }

    while (currentPositionRef.current > upperBound) {
      currentPositionRef.current -= setWidth;
      targetPositionRef.current -= setWidth;
    }
  }

  function updateBarScales() {
    if (isRevealedRef.current) return true;

    const pointerX = pointerXRef.current;
    const pointerActive = pointerActiveRef.current;
    const barSize = barSizeRef.current || 160;
    const influenceRadius = barSize * 2.6;
    let isSettled = true;

    loopItems.forEach((item) => {
      const centerX = item.renderIndex * barSize + (barSize / 2) - currentPositionRef.current;
      const distance = !pointerActive || pointerX === null ? Infinity : Math.abs(pointerX - centerX);
      const influence = Math.max(0, 1 - (distance / influenceRadius));
      const targetScale = !pointerActive || pointerX === null ? 1 : 1 + (1.05 * influence);
      const currentScale = currentScalesRef.current[item.renderIndex] ?? 1;
      const nextScale = currentScale + ((targetScale - currentScale) * SCALE_LERP);

      targetScalesRef.current[item.renderIndex] = targetScale;
      currentScalesRef.current[item.renderIndex] = nextScale;
      applyScale(item.renderIndex, Number(nextScale.toFixed(4)));

      if (Math.abs(targetScale - nextScale) > 0.002) {
        isSettled = false;
      }
    });

    return isSettled;
  }

  function animateInteraction() {
    currentPositionRef.current += (targetPositionRef.current - currentPositionRef.current) * POSITION_LERP;
    normalizePosition();
    applyOffset(currentPositionRef.current);

    const scalesSettled = updateBarScales();
    const positionSettled = Math.abs(targetPositionRef.current - currentPositionRef.current) < 0.01;

    if (positionSettled && scalesSettled) {
      animationFrameRef.current = null;
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(animateInteraction);
  }

  function startAnimation() {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(animateInteraction);
  }

  useLayoutEffect(() => {
    isRevealedRef.current = isRevealed;
    if (isRevealed) {
      resetBarScales();
    }
  }, [isRevealed, resetBarScales]);

  useLayoutEffect(() => {
    let secondFrame = null;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsIntroComplete(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame !== null) {
        window.cancelAnimationFrame(secondFrame);
      }
    };
  }, []);

  useLayoutEffect(() => {
    measureAndCenter();
    applyIntroSpread();
    const handleResize = () => {
      measureAndCenter();
      window.requestAnimationFrame(applyIntroSpread);
      if (isRevealedRef.current) {
        window.requestAnimationFrame(updateRevealDelays);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (closingTimeoutRef.current !== null) {
        window.clearTimeout(closingTimeoutRef.current);
        closingTimeoutRef.current = null;
      }
    };
  }, [applyIntroSpread, measureAndCenter, updateRevealDelays]);

  const handleWheel = (event) => {
    event.preventDefault();
    const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    const delta = Math.max(-70, Math.min(70, rawDelta));

    targetPositionRef.current += delta * 0.95;
    startAnimation();
  };

  const handlePointerMove = (event) => {
    const hoveredBar = event.target.closest?.(".archive-blind-page__bar");
    if (!hoveredBar) {
      pointerActiveRef.current = false;
      pointerXRef.current = null;
      startAnimation();
      return;
    }

    pointerActiveRef.current = true;
    pointerXRef.current = event.clientX;
    startAnimation();
  };

  const handlePointerLeave = () => {
    pointerActiveRef.current = false;
    pointerXRef.current = null;
    startAnimation();
  };

  const handleReveal = () => {
    if (isClosing) return;

    setSelectedId(null);
    const visibleCount = updateRevealDelays();
    pointerActiveRef.current = false;
    pointerXRef.current = null;
    resetBarScales();
    startAnimation();

    if (!isRevealed) {
      setIsClosing(false);
      setIsRevealed(true);
      return;
    }

    setIsClosing(true);
    const closeDuration = REVEAL_DURATION + (Math.max(visibleCount, 1) * REVEAL_STAGGER) + 120;
    closingTimeoutRef.current = window.setTimeout(() => {
      setIsRevealed(false);
      setIsClosing(false);
      closingTimeoutRef.current = null;
    }, closeDuration);
  };

  const pageClassName = [
    "archive-blind-page",
    isRevealed ? "archive-blind-page--revealed is-revealed" : "",
    isClosing ? "archive-blind-page--closing is-closing" : "",
    isIntroComplete ? "archive-blind-page--intro-complete is-intro-complete" : "",
  ].filter(Boolean).join(" ");

  return (
    <main
      className={pageClassName}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
    >
      <button className="archive-blind-page__back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span>
        <span>BACK</span>
      </button>

      <section className="archive-blind-page__stage" aria-label="Blind pick interaction">
        <div
          className="archive-blind-page__strip"
          ref={stripRef}
        >
          <div className="archive-blind-page__track" ref={trackRef}>
            {loopItems.map((item) => (
              <button
                className={`archive-blind-page__item archive-blind-page__item--${item.color}${selectedId === item.loopKey ? " archive-blind-page__item--selected" : ""}`}
                type="button"
                key={item.loopKey}
                onClick={() => setSelectedId(item.loopKey)}
                style={{ "--blind-index": item.itemIndex }}
                aria-label={isRevealed ? `${item.title} 선택` : "블라인드 픽 선택"}
              >
                <span className="archive-blind-page__bar-shell">
                  <span
                    className="archive-blind-page__bar"
                    ref={(node) => {
                      barRefs.current[item.renderIndex] = node;
                    }}
                  >
                    <span className="archive-blind-page__bar-color" />
                    <span className="archive-blind-page__cover-mask" aria-hidden={!isRevealed}>
                      <span className="archive-blind-page__cover-inner">
                        <img src={item.cover} alt="" draggable="false" />
                        <span className="archive-blind-page__cover-info">
                          <span>{item.meta}</span>
                          <strong>{item.title}</strong>
                          <small>{item.artist}</small>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>

                {!isRevealed && selectedId === item.loopKey && (
                  <span className="archive-blind-page__pick">
                    <span className="archive-blind-page__pick-meta">{item.meta}</span>
                    <span className="archive-blind-page__play">Play</span>
                    <strong>{item.title}</strong>
                    <small>{item.artist}</small>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isRevealed && selectedItem && (
          <div className="archive-blind-page__revealed-info">
            <span>{selectedItem.meta}</span>
            <button type="button">Play</button>
            <strong>{selectedItem.title}</strong>
            <small>{selectedItem.artist}</small>
          </div>
        )}
      </section>

      <button
        className={`archive-blind-page__eye${isRevealed ? " archive-blind-page__eye--active" : ""}`}
        type="button"
        onClick={handleReveal}
        aria-label={isRevealed ? "블라인드 픽 숨기기" : "앨범 커버 공개하기"}
      >
        <span aria-hidden="true" />
      </button>
    </main>
  );
}

export default ArchiveBlindPick;
