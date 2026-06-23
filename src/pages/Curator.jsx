import { useEffect, useRef, useState } from "react";

function Curator() {
  const [translateX, setTranslateX] = useState(0);
  const [isTrackpadActive, setIsTrackpadActive] = useState(false);
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const translateXRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const dragStartX = useRef(null);
  const wheelFrame = useRef(null);
  const pendingWheelDelta = useRef(0);
  const trackpadEndTimer = useRef(null);

  const curatorTypes = [
    {
      number: "01",
      title: "Lifestyle Curator",
      description: "취향과 일상의 장면을 음악으로 기록하는 큐레이터",
      tone: "red",
    },
    {
      number: "02",
      title: "Artist Curator",
      description: "아티스트가 직접 고른 순간과 영감의 플레이리스트",
      tone: "blue",
    },
    {
      number: "03",
      title: "Similar Curator",
      description: "나와 비슷한 시간과 음악 취향을 가진 큐레이터",
      tone: "yellow",
    },
  ];

  useEffect(() => {
    const updateMaxTranslate = () => {
      const gallery = galleryRef.current;
      const track = trackRef.current;
      const firstItem = track?.firstElementChild;
      if (!gallery || !track || !firstItem) return;

      const rightMargin = 64;
      const minimumVisibleFirstItem = 64;
      const translateForRightMargin = track.offsetLeft + track.scrollWidth - gallery.clientWidth + rightMargin;
      const translateKeepingFirstItem = track.offsetLeft + firstItem.offsetWidth - minimumVisibleFirstItem;
      const nextMaxTranslate = Math.max(0, Math.min(translateForRightMargin, translateKeepingFirstItem));

      maxTranslateRef.current = nextMaxTranslate;
      setTranslateX((current) => {
        const nextTranslate = Math.min(current, nextMaxTranslate);
        translateXRef.current = nextTranslate;
        return nextTranslate;
      });
    };

    updateMaxTranslate();
    const resizeObserver = new ResizeObserver(updateMaxTranslate);
    resizeObserver.observe(galleryRef.current);
    resizeObserver.observe(trackRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const moveTo = (nextTranslate) => {
    const clampedTranslate = Math.min(maxTranslateRef.current, Math.max(0, nextTranslate));
    const currentTranslate = translateXRef.current;
    if (Math.abs(clampedTranslate - currentTranslate) < 1) return;

    translateXRef.current = clampedTranslate;
    setTranslateX(clampedTranslate);
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return undefined;

    const handleNativeWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const hasHorizontalDelta = Math.abs(event.deltaX) > 1;
      const isTrackpadInput = hasHorizontalDelta && !event.shiftKey;
      let movement = hasHorizontalDelta ? event.deltaX : event.deltaY;
      if (isTrackpadInput) movement *= 1.5;

      if (!hasHorizontalDelta && event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        movement *= 18;
      } else if (!hasHorizontalDelta && event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        movement *= gallery.clientWidth;
      }

      if (Math.abs(movement) < 1) return;

      if (isTrackpadInput) {
        setIsTrackpadActive(true);
        if (trackpadEndTimer.current !== null) {
          window.clearTimeout(trackpadEndTimer.current);
        }

        trackpadEndTimer.current = window.setTimeout(() => {
          trackpadEndTimer.current = null;
          setIsTrackpadActive(false);

          const nearestPosition = translateXRef.current < maxTranslateRef.current / 2
            ? 0
            : maxTranslateRef.current;
          moveTo(nearestPosition);
        }, 120);
      } else {
        if (trackpadEndTimer.current !== null) {
          window.clearTimeout(trackpadEndTimer.current);
          trackpadEndTimer.current = null;
        }
        setIsTrackpadActive(false);
      }

      const movementLimit = isTrackpadInput ? 110 : 84;
      const frameLimit = isTrackpadInput ? 180 : 126;
      const limitedMovement = Math.max(-movementLimit, Math.min(movementLimit, movement));
      pendingWheelDelta.current = Math.max(
        -frameLimit,
        Math.min(frameLimit, pendingWheelDelta.current + limitedMovement),
      );

      if (wheelFrame.current !== null) return;

      wheelFrame.current = window.requestAnimationFrame(() => {
        const nextTranslate = translateXRef.current + pendingWheelDelta.current;
        pendingWheelDelta.current = 0;
        wheelFrame.current = null;
        moveTo(nextTranslate);
      });
    };

    gallery.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      gallery.removeEventListener("wheel", handleNativeWheel);
      if (wheelFrame.current !== null) {
        window.cancelAnimationFrame(wheelFrame.current);
      }
      if (trackpadEndTimer.current !== null) {
        window.clearTimeout(trackpadEndTimer.current);
      }
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(distance) >= 60) {
      moveTo(distance < 0 ? maxTranslateRef.current : 0);
    }
  };

  const handlePointerCancel = () => {
    dragStartX.current = null;
  };

  return (
    <main className="curator-page">
      <section className="curator-page__intro">
        <p className="curator-page__eyebrow">CURATOR</p>
        <h1 className="curator-page__title">Moment Curator</h1>
        <p className="curator-page__description">
          저마다의 시간과 취향을 음악으로 기록하는 큐레이터를 만나보세요.
        </p>
      </section>

      <section
        className="curator-page__gallery"
        ref={galleryRef}
        aria-label="Moment curator categories"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`curator-page__track${isTrackpadActive ? " curator-page__track--trackpad" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {curatorTypes.map((curator) => (
            <article className="curator-page__item" key={curator.title}>
              <div className="curator-page__item-copy">
                <span>{curator.number} / 03</span>
                <h2>{curator.title}</h2>
                <p>{curator.description}</p>
                <span className="curator-page__item-arrow" aria-hidden="true">↗</span>
              </div>

              <div className={`curator-page__record curator-page__record--${curator.tone}`}>
                <span className="curator-page__groove curator-page__groove--outer" />
                <span className="curator-page__groove curator-page__groove--inner" />
                <div className="curator-page__record-label">
                  <span>{curator.number}</span>
                  <strong>Tempy!</strong>
                  <small>MOMENT CURATOR</small>
                </div>
                <span className="curator-page__record-hole" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Curator;
