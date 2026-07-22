import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Curator() {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState(0);
  const [isTrackpadActive, setIsTrackpadActive] = useState(false);
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const translateXRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const dragStartX = useRef(null);
  const dragPointerId = useRef(null);
  const isDragging = useRef(false);
  const wheelFrame = useRef(null);
  const pendingWheelDelta = useRef(0);
  const trackpadEndTimer = useRef(null);
  const isPhone = window.matchMedia("(max-width: 480px)").matches;

  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 480px)").matches) return;
    window.scrollTo(0, 0);
  }, []);

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
    if (isPhone) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStartX.current = event.clientX;
    dragPointerId.current = event.pointerId;
    isDragging.current = false;
  };

  const handlePointerMove = (event) => {
    if (isPhone) return;
    if (dragStartX.current === null || dragPointerId.current !== event.pointerId) return;

    if (!isDragging.current && Math.abs(event.clientX - dragStartX.current) >= 8) {
      isDragging.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerUp = (event) => {
    if (isPhone) return;
    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;
    dragPointerId.current = null;
    isDragging.current = false;

    if (Math.abs(distance) >= 60) {
      moveTo(distance < 0 ? maxTranslateRef.current : 0);
    }
  };

  const handlePointerCancel = () => {
    if (isPhone) return;
    dragStartX.current = null;
    dragPointerId.current = null;
    isDragging.current = false;
  };

  const goToLifestyleCurator = () => navigate("/curator/lifestyle");
  const goToArtistCurator = () => navigate("/curator/artist");
  const goToSimilarCurator = () => navigate("/curator/similar");

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
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`curator-page__track${isTrackpadActive ? " curator-page__track--trackpad" : ""}`}
          ref={trackRef}
          style={{ transform: isPhone ? undefined : `translateX(${-translateX}px)` }}
        >
          {curatorTypes.map((curator) => (
            <article className="curator-page__item" key={curator.title}>
              <div className="curator-page__item-copy">
                <span>{curator.number} / 03</span>
                <h2 className="curator-page__card-title">{curator.title}</h2>
                <p className="curator-page__card-description">{curator.description}</p>
                {curator.number === "01" || curator.number === "02" || curator.number === "03" ? (
                  <button
                    className="curator-page__item-arrow"
                    type="button"
                    aria-label={`${curator.title} 상세 보기`}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (curator.number === "01") goToLifestyleCurator();
                      if (curator.number === "02") goToArtistCurator();
                      if (curator.number === "03") goToSimilarCurator();
                    }}
                  >
                    <span aria-hidden="true">↗</span>
                  </button>
                ) : (
                  <span className="curator-page__item-arrow" aria-hidden="true">↗</span>
                )}
              </div>

              <div
                className={`curator-page__record curator-page__record--${curator.tone}`}
                role={curator.number === "01" || curator.number === "02" || curator.number === "03" ? "button" : undefined}
                tabIndex={curator.number === "01" || curator.number === "02" || curator.number === "03" ? 0 : undefined}
                aria-label={curator.number === "01" || curator.number === "02" || curator.number === "03" ? `${curator.title} 상세 보기` : undefined}
                style={curator.number === "01" || curator.number === "02" || curator.number === "03" ? { cursor: "pointer" } : undefined}
                onClick={curator.number === "01"
                  ? goToLifestyleCurator
                  : curator.number === "02"
                    ? goToArtistCurator
                    : curator.number === "03"
                      ? goToSimilarCurator
                      : undefined}
                onKeyDown={curator.number === "01" || curator.number === "02" || curator.number === "03" ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (curator.number === "01") goToLifestyleCurator();
                    if (curator.number === "02") goToArtistCurator();
                    if (curator.number === "03") goToSimilarCurator();
                  }
                } : undefined}
              >
                <span className="curator-page__groove curator-page__groove--outer" />
                <span className="curator-page__groove curator-page__groove--inner" />
                <div className="curator-page__record-label">
                  <span>{curator.number}</span>
                  <strong>Tempy!</strong>
                  <small className="curator-page__record-label-desktop">MOMENT CURATOR</small>
                  <small className="curator-page__record-label-mobile">{curator.title}</small>
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
