import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOOP_COUNT = 5;
const MIDDLE_LOOP_INDEX = Math.floor(LOOP_COUNT / 2);

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
  const setWidthRef = useRef(0);
  const middleStartRef = useRef(0);
  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

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

  const measureAndCenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const firstItem = track.children[0];
    const nextSetItem = track.children[baseBlindPickItems.length];
    const middleSetItem = track.children[baseBlindPickItems.length * MIDDLE_LOOP_INDEX];
    if (!firstItem || !nextSetItem || !middleSetItem) return;

    setWidthRef.current = nextSetItem.offsetLeft - firstItem.offsetLeft;
    middleStartRef.current = middleSetItem.offsetLeft;
    positionRef.current = middleStartRef.current;
    velocityRef.current = 0;
    applyOffset(positionRef.current);
  }, [applyOffset]);

  function normalizePosition() {
    const setWidth = setWidthRef.current;
    if (setWidth === 0) return;

    const lowerBound = setWidth;
    const upperBound = setWidth * (LOOP_COUNT - 2);

    while (positionRef.current < lowerBound) {
      positionRef.current += setWidth;
    }

    while (positionRef.current > upperBound) {
      positionRef.current -= setWidth;
    }
  }

  function animateOffset() {
    positionRef.current += velocityRef.current;
    normalizePosition();
    applyOffset(positionRef.current);

    velocityRef.current *= 0.965;
    if (Math.abs(velocityRef.current) < 0.004) {
      velocityRef.current = 0;
      animationFrameRef.current = null;
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(animateOffset);
  }

  function startAnimation() {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(animateOffset);
  }

  useLayoutEffect(() => {
    measureAndCenter();
    const handleResize = () => measureAndCenter();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isRevealed, measureAndCenter]);

  const handleWheel = (event) => {
    event.preventDefault();
    const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    const delta = Math.max(-70, Math.min(70, rawDelta));

    velocityRef.current += delta * 0.22;
    velocityRef.current = Math.max(-84, Math.min(84, velocityRef.current));
    startAnimation();
  };

  const getWaveClass = (renderIndex) => {
    if (isRevealed || hoveredId === null) return "";

    const distance = Math.abs(renderIndex - hoveredId);
    if (distance === 0) return " archive-blind-page__bar--hovered";
    if (distance === 1) return " archive-blind-page__bar--near";
    if (distance === 2) return " archive-blind-page__bar--far";
    return "";
  };

  const handleReveal = () => {
    setSelectedId(null);
    setHoveredId(null);
    setIsRevealed((current) => !current);
  };

  return (
    <main className="archive-blind-page" onWheel={handleWheel}>
      <button className="archive-blind-page__back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span>
        <span>BACK</span>
      </button>

      <section className="archive-blind-page__stage" aria-label="Blind pick interaction">
        <div
          className={`archive-blind-page__strip${isRevealed ? " archive-blind-page__strip--revealed" : ""}`}
          ref={stripRef}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="archive-blind-page__track" ref={trackRef}>
            {loopItems.map((item) => (
              <button
                className={`archive-blind-page__item archive-blind-page__item--${item.color}${selectedId === item.loopKey ? " archive-blind-page__item--selected" : ""}`}
                type="button"
                key={item.loopKey}
                onMouseEnter={() => setHoveredId(item.renderIndex)}
                onFocus={() => setHoveredId(item.renderIndex)}
                onClick={() => setSelectedId(item.loopKey)}
                style={{ "--blind-index": item.itemIndex }}
                aria-label={isRevealed ? `${item.title} 선택` : "블라인드 픽 선택"}
              >
                {isRevealed ? (
                  <span className="archive-blind-page__cover-wrap">
                    <img src={item.cover} alt="" draggable="false" />
                  </span>
                ) : (
                  <span className={`archive-blind-page__bar${getWaveClass(item.renderIndex)}`} />
                )}

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
