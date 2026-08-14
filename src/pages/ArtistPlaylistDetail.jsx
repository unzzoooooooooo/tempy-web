import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HeartIcon, ShuffleIcon } from "../components/TempyIcons";
import { getArtistDisplayImage, getTracksByIds } from "../data/musicCatalog";

const playlistTracks = getTracksByIds([
  "like-jennie",
  "mantra",
  "you-and-me",
  "toxic-till-the-end",
  "360",
  "whiplash",
  "armageddon",
  "rich-man",
  "puppet-show",
  "blinding-lights",
]);

const fallbackPlaylist = {
  title: "JENNIE'S RUBY MOMENTS",
  artist: "JENNIE",
  meta: "10곡 · 21:03",
  likes: "1.5k",
  author: "JENNIE",
  image: getArtistDisplayImage("JENNIE"),
  date: "2026.05.16",
  theme: "ruby",
  note: "무대 위의 강한 순간과 밤의 감정을 따라 이어지는 아티스트 큐레이션입니다.",
  index: 0,
};

function ArtistPlaylistDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const routePlaylist = location.state?.playlist || fallbackPlaylist;
  const selectedPlaylist = {
    ...routePlaylist,
    image: getArtistDisplayImage(routePlaylist.artist, { trackCover: routePlaylist.image }),
  };
  const [translateX, setTranslateX] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const sequenceRef = useRef(null);
  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const mobileScrollEndTimer = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const pendingWheelDelta = useRef(0);
  const wheelFrame = useRef(null);
  const inputEndTimer = useRef(null);
  const dragState = useRef(null);

  const syncMobileSlide = () => {
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    if (mobileScrollEndTimer.current !== null) window.clearTimeout(mobileScrollEndTimer.current);
    mobileScrollEndTimer.current = window.setTimeout(() => {
      const sequence = sequenceRef.current;
      const slides = [panelRef.current, ...Array.from(trackRef.current?.children ?? [])].filter(Boolean);
      if (!sequence || slides.length === 0) return;
      const center = sequence.scrollLeft + sequence.clientWidth / 2;
      const closestIndex = slides.reduce((closest, slide, index) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const closestCenter = slides[closest].offsetLeft + slides[closest].clientWidth / 2;
        return Math.abs(slideCenter - center) < Math.abs(closestCenter - center) ? index : closest;
      }, 0);
      if (closestIndex > 0) {
        setActiveTrackIndex(closestIndex - 1);
      }
      mobileScrollEndTimer.current = null;
    }, 120);
  };

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

      const nextMax = Math.max(0, track.scrollWidth - viewport.clientWidth);
      maxTranslateRef.current = nextMax;
      moveTo(Math.min(translateRef.current, nextMax));
    };

    updateRange();
    const observer = new ResizeObserver(updateRange);
    observer.observe(viewportRef.current);
    observer.observe(trackRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (mobileScrollEndTimer.current !== null) window.clearTimeout(mobileScrollEndTimer.current);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const handleWheel = (event) => {
      if (window.matchMedia("(max-width: 760px)").matches) return;
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
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateRef.current,
    };
  };

  const handlePointerMove = (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
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

  const activeTrack = playlistTracks[activeTrackIndex] || playlistTracks[0];

  return (
    <main className="artist-playlist-detail playlist-detail-page playlist-detail--artist" data-playlist-theme={selectedPlaylist.theme || "ruby"}>
      <button
        className="artist-playlist-detail__back playlist-detail-back detail-back-link"
        type="button"
        onClick={() => navigate("/curator/artist")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO ARTIST CURATOR</span>
      </button>

      <div className="artist-playlist-detail__page-meta playlist-detail-top-meta" aria-hidden="true">
        <span>PLAYLIST TRACKS</span>
        <span>{playlistTracks.length} TRACKS · 21:03</span>
      </div>

      <div className="artist-playlist-detail__sequence" ref={sequenceRef} onScroll={syncMobileSlide}>
      <aside className="artist-playlist-detail__panel playlist-detail-left" ref={panelRef}>
        <div className="artist-playlist-detail__panel-copy">
          <p>ARTIST CURATOR · PLAYLIST {String((selectedPlaylist.index || 0) + 1).padStart(2, "0")}</p>
          <h1>{selectedPlaylist.title}</h1>
          <div className="artist-playlist-detail__details">
            <div className="artist-playlist-detail__meta">
              <span>{selectedPlaylist.meta} · {selectedPlaylist.date}</span>
              <span className="tempy-icon-stat"><HeartIcon size="small" /> {selectedPlaylist.likes}</span>
            </div>
            <div className="artist-playlist-detail__author">
              <span>{selectedPlaylist.author?.slice(0, 1) || "J"}</span>
              <strong>{selectedPlaylist.author}</strong>
            </div>
          </div>
          <div className="artist-playlist-detail__now">
            <div className="artist-playlist-detail__now-head">
              <span>NOW PLAYING · {String(activeTrackIndex + 1).padStart(2, "0")}</span>
              <span>21:03</span>
            </div>
            <strong>{activeTrack.title}</strong>
            <small>{activeTrack.artist}</small>
            <div className="artist-playlist-detail__progress" aria-hidden="true">
              <span style={{ "--artist-mobile-progress": `${((activeTrackIndex + 1) / playlistTracks.length) * 100}%`, width: `${24 + activeTrackIndex * 5}%` }} />
            </div>
          </div>
        </div>

        <div className="artist-playlist-detail__portrait">
          <img src={selectedPlaylist.image} alt={selectedPlaylist.artist} />
        </div>

        <div className="artist-playlist-detail__actions">
          <button
            className={isPlaying ? "is-playing" : ""}
            type="button"
            aria-pressed={isPlaying}
            onClick={() => {
              if (window.matchMedia("(max-width: 760px)").matches) setIsPlaying((playing) => !playing);
            }}
            data-tempy-playable
            data-tempy-title={activeTrack.title}
            data-tempy-artist={activeTrack.artist}
            data-tempy-cover={activeTrack.cover}
          ><span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span> {isPlaying ? "PAUSE" : "PLAY"}</button>
          <button
            className={`tempy-icon-button${isShuffled ? " is-active" : ""}`}
            type="button"
            aria-label="랜덤 재생"
            aria-pressed={isShuffled}
            onClick={() => {
              if (window.matchMedia("(max-width: 760px)").matches) setIsShuffled((active) => !active);
            }}
          ><ShuffleIcon /></button>
          <button
            className={`tempy-icon-button${isLiked ? " is-active" : ""}`}
            type="button"
            aria-label="좋아요"
            aria-pressed={isLiked}
            onClick={() => {
              if (window.matchMedia("(max-width: 760px)").matches) setIsLiked((active) => !active);
            }}
          >
            <HeartIcon filled={isLiked} />
          </button>
        </div>
      </aside>

      <section
        className="artist-playlist-detail__viewport playlist-detail-right"
        ref={viewportRef}
        aria-label="제니의 플레이리스트 트랙"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`artist-playlist-detail__track playlist-detail-track-row${isDirectInput ? " artist-playlist-detail__track--direct" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {playlistTracks.map((track, index) => (
            <article
              className={`artist-playlist-detail__item playlist-detail-track-item${activeTrackIndex === index ? " is-active" : ""}`}
              data-tempy-playable
              data-tempy-title={track.title}
              data-tempy-artist={track.artist}
              data-tempy-cover={track.cover}
              key={`${track.title}-${index}`}
              style={{ "--artist-playlist-index": index }}
              onClick={() => setActiveTrackIndex(index)}
            >
              <span className="artist-playlist-detail__number playlist-detail-track-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="artist-playlist-detail__lp playlist-detail-lp">
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--outer" />
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--middle" />
                <span className="artist-playlist-detail__groove artist-playlist-detail__groove--inner" />
                <img src={track.cover} alt="" draggable="false" />
                <span className="artist-playlist-detail__hole" />
              </div>
              <h2 className="playlist-detail-track-title">{track.title}</h2>
              <p className="playlist-detail-track-artist">{track.artist}</p>
            </article>
          ))}
        </div>
      </section>
      </div>

      <section className="artist-playlist-detail__note playlist-detail-note" aria-label="Artist curator note">
        <div className="artist-playlist-detail__note-head">
          <span>CURATOR'S NOTE · 21:03</span>
          <span>DRAG TO EXPLORE →</span>
        </div>
        <p>“{selectedPlaylist.note || fallbackPlaylist.note}”</p>
      </section>
    </main>
  );
}

export default ArtistPlaylistDetail;
