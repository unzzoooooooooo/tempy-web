import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const playlistTracks = [
  { title: "like JENNIE", artist: "JENNIE", cover: "/images/album-11.png" },
  { title: "Mantra", artist: "JENNIE", cover: "/images/album-12.png" },
  { title: "ExtraL", artist: "JENNIE · Doechii", cover: "/images/album-13.png" },
  { title: "Handlebars", artist: "JENNIE · Dua Lipa", cover: "/images/album-14.png" },
  { title: "ZEN", artist: "JENNIE", cover: "/images/album-15.png" },
  { title: "Love Hangover", artist: "JENNIE · Dominic Fike", cover: "/images/album-16.png" },
  { title: "Starlight", artist: "The Supermen Lovers", cover: "/images/album-17.png" },
  { title: "Sports car", artist: "Tate McRae", cover: "/images/album-18.png" },
  { title: "360", artist: "Charli xcx", cover: "/images/album-19.png" },
  { title: "Von dutch", artist: "Charli xcx", cover: "/images/album-20.png" },
];

function ArtistPlaylistDetail() {
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

      const rightPadding = 56;
      const nextMax = Math.max(0, track.scrollWidth - viewport.clientWidth + rightPadding);
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

      const horizontalInput = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.5;
      let movement = horizontalInput ? event.deltaX : event.deltaY;

      if (!horizontalInput && event.deltaMode === WheelEvent.DOM_DELTA_LINE) movement *= 18;
      if (!horizontalInput && event.deltaMode === WheelEvent.DOM_DELTA_PAGE) movement *= viewport.clientWidth;
      if (Math.abs(movement) < 1) return;

      if (horizontalInput) {
        setIsDirectInput(true);
        if (inputEndTimer.current !== null) window.clearTimeout(inputEndTimer.current);
        inputEndTimer.current = window.setTimeout(() => {
          inputEndTimer.current = null;
          setIsDirectInput(false);
        }, 100);
      }

      const eventLimit = horizontalInput ? 120 : 84;
      const frameLimit = horizontalInput ? 185 : 122;
      const limitedMovement = Math.max(-eventLimit, Math.min(eventLimit, movement));
      pendingWheelDelta.current = Math.max(
        -frameLimit,
        Math.min(frameLimit, pendingWheelDelta.current + limitedMovement),
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
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateRef.current,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 5 && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setIsDirectInput(true);
    moveTo(drag.startTranslate - distance);
  };

  const endDrag = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  return (
    <main className="artist-playlist-detail">
      <button
        className="artist-playlist-detail__back"
        type="button"
        onClick={() => navigate("/curator/artist")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO ARTIST CURATOR</span>
      </button>

      <aside className="artist-playlist-detail__panel">
        <div className="artist-playlist-detail__panel-copy">
          <p>ARTIST CURATOR · PLAYLIST 01</p>
          <h1>제니의 무대 전<br />원업 플레이리스트</h1>
          <div className="artist-playlist-detail__meta">
            <span>10곡 · 21:03 · 2026.05.16</span>
            <span>♡ 1.5k</span>
          </div>
          <div className="artist-playlist-detail__author">
            <span>J</span>
            <strong>Jennie</strong>
          </div>
        </div>

        <div className="artist-playlist-detail__portrait">
          <img src="/images/artist-01.png" alt="Jennie" />
        </div>

        <div className="artist-playlist-detail__actions">
          <button type="button"><span aria-hidden="true">▶</span> PLAY</button>
          <button type="button" aria-label="셔플">⌘</button>
          <button type="button" aria-label="좋아요">♡</button>
        </div>
      </aside>

      <section
        className="artist-playlist-detail__viewport"
        ref={viewportRef}
        aria-label="제니의 플레이리스트 트랙"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`artist-playlist-detail__track${isDirectInput ? " artist-playlist-detail__track--direct" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {playlistTracks.map((track, index) => (
            <article
              className="artist-playlist-detail__item"
              key={`${track.title}-${index}`}
              style={{ "--artist-playlist-index": index }}
            >
              <span className="artist-playlist-detail__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="artist-playlist-detail__lp">
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--outer" />
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--middle" />
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--inner" />
                <img src={track.cover} alt="" draggable="false" />
                <span className="artist-playlist-detail__hole" />
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

export default ArtistPlaylistDetail;
