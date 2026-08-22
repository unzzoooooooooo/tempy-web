import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timeSetTracks } from "../data/musicCatalog";
import { useContextRecommendations } from "../utils/context";

const timeSetColors = ["#2759ed", "#1f9c75", "#ff343c", "#f2cb28", "#07142b"];

function DiscoverTimeSet() {
  const navigate = useNavigate();
  const { tracks } = useContextRecommendations(timeSetTracks.length, "discoverTimeSet");
  const timeSetRecords = tracks.map((track, index) => ({
    ...track,
    color: timeSetColors[index % timeSetColors.length],
  }));
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAlbum, setShowAlbum] = useState(false);
  const lastWheelTime = useRef(0);
  const recordsRef = useRef(null);
  const dragState = useRef(null);
  const suppressCenterClickUntil = useRef(0);
  const activeRecord = timeSetRecords[activeIndex];

  const moveCarousel = (direction) => {
    setShowAlbum(false);
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (window.matchMedia("(max-width: 480px)").matches) {
        return Math.max(0, Math.min(timeSetRecords.length - 1, nextIndex));
      }

      return (nextIndex + timeSetRecords.length) % timeSetRecords.length;
    });
  };

  const handleWheel = (event) => {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    if (Math.abs(movement) < 8) return;

    const now = Date.now();
    if (now - lastWheelTime.current < 650) return;

    lastWheelTime.current = now;
    moveCarousel(movement > 0 ? 1 : -1);
  };

  const handlePointerDown = (event) => {
    if (
      event.pointerType === "mouse"
      || !window.matchMedia("(max-width: 480px)").matches
    ) return;

    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocityX: 0,
      offsetX: 0,
      pendingOffsetX: 0,
      frameId: 0,
      axis: null,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distanceX = event.clientX - drag.startX;
    const distanceY = event.clientY - drag.startY;

    if (!drag.axis && Math.max(Math.abs(distanceX), Math.abs(distanceY)) >= 6) {
      drag.axis = Math.abs(distanceX) > Math.abs(distanceY) ? "x" : "y";
      if (drag.axis === "x") {
        event.currentTarget.classList.add("is-touch-dragging");
      }
    }

    if (drag.axis !== "x") return;

    event.preventDefault();
    const minimumOffset = activeIndex === timeSetRecords.length - 1 ? 0 : -110;
    const maximumOffset = activeIndex === 0 ? 0 : 110;
    const now = performance.now();
    const elapsed = Math.max(1, now - drag.lastTime);
    const instantVelocity = (event.clientX - drag.lastX) / elapsed;
    drag.velocityX = (drag.velocityX * 0.72) + (instantVelocity * 0.28);
    drag.lastX = event.clientX;
    drag.lastTime = now;
    drag.pendingOffsetX = Math.max(minimumOffset, Math.min(maximumOffset, distanceX));

    if (!drag.frameId) {
      const carousel = event.currentTarget;
      drag.frameId = window.requestAnimationFrame(() => {
        drag.frameId = 0;
        drag.offsetX = drag.pendingOffsetX;
        carousel.style.setProperty("--time-set-drag-x", `${drag.offsetX}px`);
      });
    }
  };

  const endPointerDrag = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const carousel = event.currentTarget;
    dragState.current = null;

    if (drag.frameId) {
      window.cancelAnimationFrame(drag.frameId);
      drag.offsetX = drag.pendingOffsetX;
    }

    carousel.classList.remove("is-touch-dragging");
    carousel.style.setProperty("--time-set-drag-x", "0px");

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    const projectedOffset = drag.offsetX + (drag.velocityX * 120);
    const direction = projectedOffset < 0 ? 1 : -1;
    const canMove = activeIndex + direction >= 0
      && activeIndex + direction < timeSetRecords.length;
    const shouldMove = event.type !== "pointercancel"
      && drag.axis === "x"
      && canMove
      && Math.abs(projectedOffset) >= 44;

    if (shouldMove) {
      suppressCenterClickUntil.current = Date.now() + 300;
      moveCarousel(direction);
    }
  };

  const handleRecordCenterClick = (event) => {
    if (Date.now() < suppressCenterClickUntil.current) {
      event.preventDefault();
      return;
    }

    setShowAlbum(true);
  };

  const getRecordPosition = (index) => {
    const offset = getRecordOffset(index);

    if (offset === 0) return "active";
    if (offset === -1) return "previous";
    if (offset === 1) return "next";
    return "distant";
  };

  const getRecordOffset = (index) => {
    let offset = index - activeIndex;
    const half = timeSetRecords.length / 2;

    if (offset > half) offset -= timeSetRecords.length;
    if (offset < -half) offset += timeSetRecords.length;
    return offset;
  };

  return (
    <main className="time-set-detail">
      <section className="time-set-detail__intro">
        <button className="time-set-detail__back detail-back-link" type="button" aria-label="Discover로 돌아가기" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO DISCOVER</span>
        </button>

        <div className="time-set-detail__copy">
          <p className="time-set-detail__eyebrow">SAME TIME · DIFFERENT SONGS</p>
          <h1 className="time-set-detail__title">Time Set</h1>
          <p className="time-set-detail__description">
            같은 시간과 날씨, 위치 안에서<br />
            다른 사람들이 선택한 음악을 감상해보세요.
          </p>
        </div>

        <p className="time-set-detail__index">01 / 02</p>
      </section>

      <section className="time-set-detail__records time-set-mobile-viewport" aria-label="Time Set records">
        <div
          ref={recordsRef}
          className="time-set-carousel time-set-mobile-track"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointerDrag}
          onPointerCancel={endPointerDrag}
        >
          {timeSetRecords.map((record, index) => {
            const position = getRecordPosition(index);
            const isActive = position === "active";

            return (
              <div
                className={`time-set-detail__main-record time-set-carousel__item time-set-carousel__item--${position}`}
                style={{
                  "--time-set-lp-color": record.color,
                  "--time-set-offset": getRecordOffset(index),
                }}
                aria-hidden={!isActive}
                key={record.title}
              >
                <div className="time-set-detail__vinyl time-set-carousel__vinyl">
                  <span className="time-set-detail__groove time-set-detail__groove--outer" />
                  <span className="time-set-detail__groove time-set-detail__groove--inner" />

                  {isActive ? (
                    <button
                      className={`time-set-detail__record-center time-set-interaction__trigger ${showAlbum ? "time-set-interaction__trigger--active" : ""}`}
                      type="button"
                      aria-label={showAlbum ? `${activeRecord.title} by ${activeRecord.artist}` : "Time Set 앨범 보기"}
                      onClick={handleRecordCenterClick}
                    >
                      {showAlbum ? (
                        <span className="time-set-interaction__cover">
                          <img src={activeRecord.cover} alt={`${activeRecord.title} album cover`} />
                          <span className="time-set-interaction__overlay">
                            <strong>{activeRecord.title}</strong>
                            <small>{activeRecord.artist}</small>
                          </span>
                        </span>
                      ) : (
                        <>
                          <span>TIME</span>
                          <strong>SET</strong>
                          <small>ENTER ↗</small>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="time-set-carousel__side-center" aria-hidden="true">
                      <span>TIME</span>
                      <strong>SET</strong>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="time-set-carousel__status" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(timeSetRecords.length).padStart(2, "0")}</span>
        </div>
      </section>
    </main>
  );
}

export default DiscoverTimeSet;
