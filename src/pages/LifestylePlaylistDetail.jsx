import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const playlistTracks = [
  { title: "The Fate of Ophelia", artist: "Taylor Swift", cover: "/images/album-20.png" },
  { title: "Blue Hour", artist: "Tomorrow X Together", cover: "/images/album-21.png" },
  { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", cover: "/images/album-22.png" },
  { title: "Confetti Dream", artist: "HONNE", cover: "/images/album-23.png" },
  { title: "Afterglow", artist: "Wave to Earth", cover: "/images/album-24.png" },
  { title: "Velvet Morning", artist: "The Marías", cover: "/images/album-25.png" },
  { title: "Coffee at Dawn", artist: "beabadoobee", cover: "/images/album-26.png" },
  { title: "Slow Motion", artist: "Laufey", cover: "/images/album-27.png" },
  { title: "Window Seat", artist: "Rex Orange County", cover: "/images/album-28.png" },
  { title: "First Light", artist: "Hozier", cover: "/images/album-29.png" },
  { title: "Quiet Hours", artist: "Men I Trust", cover: "/images/album-30.png" },
];

function LifestylePlaylistDetail() {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const pendingWheelDelta = useRef(0);
  const wheelFrame = useRef(null);
  const inputEndTimer = useRef(null);
  const dragState = useRef(null);

  const moveTo = (nextTranslate) => {
    const clamped = Math.min(maxTranslateRef.current, Math.max(0, nextTranslate));
    translateRef.current = clamped;
    setTranslateX(clamped);
  };

  useEffect(() => {
    const updateRange = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const rightMargin = 64;
      const nextMax = Math.max(0, track.offsetLeft + track.scrollWidth - viewport.clientWidth + rightMargin);
      maxTranslateRef.current = nextMax;
      moveTo(Math.min(translateRef.current, nextMax));
    };

    updateRange();
    const observer = new ResizeObserver(updateRange);
    observer.observe(viewportRef.current);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const hasDeltaX = Math.abs(event.deltaX) > 1;
      let movement = hasDeltaX ? event.deltaX * 1.45 : event.deltaY;

      if (!hasDeltaX && event.deltaMode === WheelEvent.DOM_DELTA_LINE) movement *= 18;
      if (!hasDeltaX && event.deltaMode === WheelEvent.DOM_DELTA_PAGE) movement *= viewport.clientWidth;
      if (Math.abs(movement) < 1) return;

      if (hasDeltaX) {
        setIsDirectInput(true);
        if (inputEndTimer.current !== null) window.clearTimeout(inputEndTimer.current);
        inputEndTimer.current = window.setTimeout(() => {
          inputEndTimer.current = null;
          setIsDirectInput(false);
        }, 110);
      }

      const eventLimit = hasDeltaX ? 120 : 88;
      const frameLimit = hasDeltaX ? 190 : 132;
      pendingWheelDelta.current = Math.max(
        -frameLimit,
        Math.min(frameLimit, pendingWheelDelta.current + Math.max(-eventLimit, Math.min(eventLimit, movement))),
      );

      if (wheelFrame.current !== null) return;
      wheelFrame.current = window.requestAnimationFrame(() => {
        moveTo(translateRef.current + pendingWheelDelta.current);
        pendingWheelDelta.current = 0;
        wheelFrame.current = null;
      });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      if (wheelFrame.current !== null) window.cancelAnimationFrame(wheelFrame.current);
      if (inputEndTimer.current !== null) window.clearTimeout(inputEndTimer.current);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, startTranslate: translateRef.current };
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 5 && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);

    setIsDirectInput(true);
    moveTo(drag.startTranslate - distance);
  };

  const endDrag = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  return (
    <main className="lifestyle-playlist-detail">
      <button className="lifestyle-playlist-detail__back" type="button" onClick={() => navigate("/curator/lifestyle")}>
        <span aria-hidden="true">←</span><span>BACK TO LIFESTYLE CURATOR</span>
      </button>

      <aside className="lifestyle-playlist-detail__panel">
        <div>
          <p className="lifestyle-playlist-detail__eyebrow">LIFESTYLE CURATOR · PLAYLIST 01</p>
          <h1>20년차 카페 사장님의 새벽 플레이리스트</h1>
          <p className="lifestyle-playlist-detail__meta">10곡 · 21:03 · 2026.05.16&nbsp;&nbsp; ♡ 1.5k</p>
          <div className="lifestyle-playlist-detail__host"><span>H</span><strong>hostless</strong></div>
        </div>

        <div className="lifestyle-playlist-detail__controller">
          <div className="lifestyle-playlist-detail__progress"><span /></div>
          <div className="lifestyle-playlist-detail__small-controls">
            <button type="button" aria-label="이전 트랙">‹</button>
            <button type="button" aria-label="다음 트랙">›</button>
          </div>
        </div>

        <div className="lifestyle-playlist-detail__actions">
          <button type="button"><span>▶</span> PLAY</button>
          <button type="button" aria-label="셔플">⌘</button>
          <button type="button" aria-label="좋아요">♡</button>
        </div>
      </aside>

      <section
        className="lifestyle-playlist-detail__viewport"
        ref={viewportRef}
        aria-label="Playlist tracks"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`lifestyle-playlist-detail__track${isDirectInput ? " lifestyle-playlist-detail__track--direct" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {playlistTracks.map((track, index) => (
            <article className="lifestyle-playlist-detail__item" key={`${track.title}-${index}`}>
              <span className="lifestyle-playlist-detail__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="lifestyle-playlist-detail__lp">
                <span className="lifestyle-playlist-detail__groove lifestyle-playlist-detail__groove--outer" />
                <span className="lifestyle-playlist-detail__groove lifestyle-playlist-detail__groove--inner" />
                <img src={track.cover} alt="" />
                <span className="lifestyle-playlist-detail__hole" />
              </div>
              <h2>{track.title}</h2>
              <p>{track.artist}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LifestylePlaylistDetail;
