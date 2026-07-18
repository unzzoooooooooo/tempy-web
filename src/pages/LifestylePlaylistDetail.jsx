import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getLifestylePlaylist,
  lifestylePlaylists,
  lifestylePlaylistThemes,
} from "../data/lifestylePlaylists";

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
  const location = useLocation();
  const playlistId = new URLSearchParams(location.search).get("playlist") ?? location.state?.playlistId;
  const playlist = getLifestylePlaylist(playlistId);
  const playlistIndex = lifestylePlaylists.findIndex((item) => item.id === playlist.id);
  const playlistTheme = lifestylePlaylistThemes[playlist.tone];
  const panelStyle = {
    "--playlist-panel-bg": playlistTheme.background,
    "--playlist-panel-ink": playlistTheme.ink,
    "--playlist-panel-muted": playlistTheme.muted,
    "--playlist-panel-line": playlistTheme.line,
  };
  const [translateX, setTranslateX] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const pendingWheelDelta = useRef(0);
  const wheelFrame = useRef(null);
  const inputEndTimer = useRef(null);
  const dragState = useRef(null);
  const didDrag = useRef(false);

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

      const rightMargin = 0;
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
    didDrag.current = false;
    dragState.current = { pointerId: event.pointerId, startX: event.clientX, startTranslate: translateRef.current };
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 5 && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);

    didDrag.current = true;
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

      <div className="lifestyle-playlist-detail__page-meta" aria-hidden="true">
        <span>PLAYLIST ARCHIVE</span>
        <span>{String(playlistTracks.length).padStart(2, "0")} TRACKS&nbsp;&nbsp;·&nbsp;&nbsp;21:03</span>
      </div>

      <aside
        className={`lifestyle-playlist-detail__panel lifestyle-playlist-detail__panel--${playlist.tone}`}
        style={panelStyle}
      >
        <div>
          <p className="lifestyle-playlist-detail__eyebrow">
            LIFESTYLE CURATOR · PLAYLIST {String(playlistIndex + 1).padStart(2, "0")}
          </p>
          <h1>{playlist.title}</h1>
          <p className="lifestyle-playlist-detail__meta">{playlistTracks.length}곡 · 21:03 · 2026.05.16&nbsp;&nbsp; ♡ 1.5k</p>
          <div className="lifestyle-playlist-detail__host"><span>H</span><strong>hostless</strong></div>
          <div className="lifestyle-playlist-detail__now-playing">
            <span>NOW PLAYING · {String(selectedTrack + 1).padStart(2, "0")}</span>
            <strong>{playlistTracks[selectedTrack].title}</strong>
            <small>{playlistTracks[selectedTrack].artist}</small>
          </div>
        </div>

        <div className="lifestyle-playlist-detail__controller">
          <div className="lifestyle-playlist-detail__progress"><span /></div>
          <div className="lifestyle-playlist-detail__small-controls">
            <button type="button" aria-label="이전 트랙">‹</button>
            <button type="button" aria-label="다음 트랙">›</button>
          </div>
        </div>

        <div className="lifestyle-playlist-detail__actions">
          <button
            className={isPlaying ? "is-playing" : ""}
            type="button"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            <span>{isPlaying ? "Ⅱ" : "▶"}</span> {isPlaying ? "PAUSE" : "PLAY"}
          </button>
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
        <p className="lifestyle-playlist-detail__drag-hint" aria-hidden="true">DRAG TO EXPLORE →</p>

        <div
          className={`lifestyle-playlist-detail__track${isDirectInput ? " lifestyle-playlist-detail__track--direct" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {playlistTracks.map((track, index) => (
            <article
              className={`lifestyle-playlist-detail__item${selectedTrack === index ? " lifestyle-playlist-detail__item--active" : ""}`}
              data-tempy-playable
              data-tempy-title={track.title}
              data-tempy-artist={track.artist}
              data-tempy-cover={track.cover}
              key={`${track.title}-${index}`}
              role="button"
              tabIndex={0}
              aria-current={selectedTrack === index ? "true" : undefined}
              onClick={() => {
                if (!didDrag.current) setSelectedTrack(index);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedTrack(index);
                }
              }}
            >
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

        <div className="lifestyle-playlist-detail__archive-meta">
          <div className="lifestyle-playlist-detail__archive-copy">
            <span>CURATOR&apos;S NOTE · 04:00 AM</span>
            <blockquote>
              “새벽 4시의 조용한 카페. 커피 향과 함께 흘러나오는 음악이 하루를 시작하게 만들어줍니다.”
            </blockquote>
          </div>
          <div className="lifestyle-playlist-detail__stats" aria-label="플레이리스트 통계">
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true">◷</span>
              <strong>21:03</strong>
              <small>TOTAL TIME</small>
            </div>
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true">≡</span>
              <strong>{playlistTracks.length}</strong>
              <small>TRACKS</small>
            </div>
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true">♡</span>
              <strong>1.5K</strong>
              <small>LIKES</small>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LifestylePlaylistDetail;
