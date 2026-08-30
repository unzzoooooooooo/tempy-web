import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HorizontalScrollArrows } from "../components/HorizontalScrollArrows";
import { ClockIcon, HeartIcon, PlayIcon, ShuffleIcon, TrackListIcon } from "../components/TempyIcons";
import {
  getLifestylePlaylist,
  lifestylePlaylists,
  lifestylePlaylistThemes,
} from "../data/lifestylePlaylists";
import { getTracksByIds } from "../data/musicCatalog";
import { useSmoothHorizontalWheel } from "../utils/useSmoothHorizontalWheel";

const playlistTracks = getTracksByIds([
  "fate-of-ophelia",
  "birds-of-a-feather",
  "gone-are-the-days",
  "sweetener",
  "traveler",
  "style",
  "willow",
  "watermelon-sugar",
  "wait",
  "rich-man",
  "soft-static",
]);

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
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const sequenceRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const selectedTrackRef = useRef(0);
  const mobileScrollEndTimer = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const dragState = useRef(null);
  const didDrag = useRef(false);

  const selectMobileTrack = (nextIndex) => {
    if (!window.matchMedia("(max-width: 760px)").matches) return;

    const normalizedIndex = (nextIndex + playlistTracks.length) % playlistTracks.length;
    selectedTrackRef.current = normalizedIndex;
    setSelectedTrack(normalizedIndex);

    window.requestAnimationFrame(() => {
      const viewport = sequenceRef.current;
      const item = trackRef.current?.children[normalizedIndex];
      if (!viewport || !item) return;
      viewport.scrollTo({
        left: item.offsetLeft - (viewport.clientWidth - item.clientWidth) / 2,
        behavior: "smooth",
      });
    });
  };

  const syncMobileTrack = () => {
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    if (mobileScrollEndTimer.current !== null) window.clearTimeout(mobileScrollEndTimer.current);
    mobileScrollEndTimer.current = window.setTimeout(() => {
      const viewport = sequenceRef.current;
      const items = Array.from(trackRef.current?.children ?? []);
      if (!viewport || items.length === 0) return;

      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      const closestIndex = items.reduce((closest, item, index) => {
        const itemCenter = item.offsetLeft + item.clientWidth / 2;
        const closestItem = items[closest];
        const closestCenter = closestItem.offsetLeft + closestItem.clientWidth / 2;
        return Math.abs(itemCenter - viewportCenter) < Math.abs(closestCenter - viewportCenter) ? index : closest;
      }, 0);
      selectedTrackRef.current = closestIndex;
      setSelectedTrack(closestIndex);
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

      const rightMargin = 0;
      const nextMax = Math.max(0, track.offsetLeft + track.scrollWidth - viewport.clientWidth + rightMargin);
      maxTranslateRef.current = nextMax;
      setMaxTranslate(nextMax);
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

  const stopWheelMotion = useSmoothHorizontalWheel({
    containerRef: viewportRef,
    getPosition: () => translateRef.current,
    getMaxPosition: () => maxTranslateRef.current,
    setPosition: moveTo,
    onMotionChange: setIsDirectInput,
  });

  const scrollTrackList = (direction) => {
    stopWheelMotion();
    const distance = (viewportRef.current?.clientWidth || 0) * 0.68;
    moveTo(translateRef.current + distance * direction);
  };

  const handlePointerDown = (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopWheelMotion();
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
    <main className="lifestyle-playlist-detail playlist-detail-page playlist-detail--lifestyle">
      <button className="lifestyle-playlist-detail__back playlist-detail-back detail-back-link" type="button" onClick={() => navigate("/curator/lifestyle")}>
        <span aria-hidden="true">←</span><span>BACK TO LIFESTYLE CURATOR</span>
      </button>

      <div className="lifestyle-playlist-detail__page-meta playlist-detail-top-meta" aria-hidden="true">
        <span>PLAYLIST ARCHIVE</span>
        <span>{String(playlistTracks.length).padStart(2, "0")} TRACKS&nbsp;&nbsp;·&nbsp;&nbsp;21:03</span>
      </div>

      <div
        className="lifestyle-playlist-detail__sequence"
        ref={sequenceRef}
        onScroll={syncMobileTrack}
      >
        <aside
          className={`lifestyle-playlist-detail__panel playlist-detail-left lifestyle-playlist-detail__panel--${playlist.tone}`}
          style={panelStyle}
        >
        <div>
          <p className="lifestyle-playlist-detail__eyebrow">
            LIFESTYLE CURATOR · PLAYLIST {String(playlistIndex + 1).padStart(2, "0")}
          </p>
          <h1>{playlist.title}</h1>
          <p className="lifestyle-playlist-detail__meta tempy-icon-stat">{playlistTracks.length}곡 · 21:03 · 2026.05.16&nbsp;&nbsp; <HeartIcon size="small" /> 1.5k</p>
          <div className="lifestyle-playlist-detail__host"><span>H</span><strong>hostless</strong></div>
          <div className="lifestyle-playlist-detail__now-playing">
            <span>NOW PLAYING · {String(selectedTrack + 1).padStart(2, "0")}</span>
            <strong>{playlistTracks[selectedTrack].title}</strong>
            <small>{playlistTracks[selectedTrack].artist}</small>
          </div>
        </div>

        <div className="lifestyle-playlist-detail__controller">
          <div className="lifestyle-playlist-detail__progress">
            <span style={{ "--mobile-track-progress": `${((selectedTrack + 1) / playlistTracks.length) * 100}%` }} />
          </div>
          <div className="lifestyle-playlist-detail__small-controls">
            <button type="button" aria-label="이전 트랙" onClick={() => selectMobileTrack(selectedTrackRef.current - 1)}>‹</button>
            <button type="button" aria-label="다음 트랙" onClick={() => selectMobileTrack(selectedTrackRef.current + 1)}>›</button>
          </div>
        </div>

        <div className="lifestyle-playlist-detail__actions">
          <button
            className={isPlaying ? "is-playing" : ""}
            type="button"
            aria-pressed={isPlaying}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            <span>{isPlaying ? "Ⅱ" : <PlayIcon />}</span> {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button
            className={`tempy-icon-button${isShuffled ? " is-active" : ""}`}
            type="button"
            aria-label="랜덤 재생"
            aria-pressed={isShuffled}
            onClick={() => {
              if (window.matchMedia("(max-width: 760px)").matches) setIsShuffled((active) => !active);
            }}
          >
            <ShuffleIcon />
          </button>
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
          className="lifestyle-playlist-detail__viewport playlist-detail-right horizontal-scroll-host"
          ref={viewportRef}
          aria-label="Playlist tracks"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDragStart={(event) => event.preventDefault()}
        >
          <div
            className={`lifestyle-playlist-detail__track playlist-detail-track-row${isDirectInput ? " lifestyle-playlist-detail__track--direct" : ""}`}
            ref={trackRef}
            style={{ transform: `translateX(${-translateX}px)` }}
          >
            {playlistTracks.map((track, index) => (
              <article
                className={`lifestyle-playlist-detail__item playlist-detail-track-item${selectedTrack === index ? " lifestyle-playlist-detail__item--active" : ""}`}
                data-tempy-playable
                data-tempy-title={track.title}
                data-tempy-artist={track.artist}
                data-tempy-cover={track.cover}
                key={`${track.title}-${index}`}
                role="button"
                tabIndex={0}
                aria-current={selectedTrack === index ? "true" : undefined}
                onClick={() => {
                  if (!didDrag.current) {
                    selectedTrackRef.current = index;
                    setSelectedTrack(index);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectedTrackRef.current = index;
                    setSelectedTrack(index);
                  }
                }}
              >
                <span className="lifestyle-playlist-detail__number playlist-detail-track-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="lifestyle-playlist-detail__lp playlist-detail-lp">
                  <span className="lifestyle-playlist-detail__groove lifestyle-playlist-detail__groove--outer" />
                  <span className="lifestyle-playlist-detail__groove lifestyle-playlist-detail__groove--inner" />
                  <img src={track.cover} alt="" />
                  <span className="lifestyle-playlist-detail__hole" />
                </div>
                <h2 className="playlist-detail-track-title">{track.title}</h2>
                <p className="playlist-detail-track-artist">{track.artist}</p>
              </article>
            ))}
          </div>

          <HorizontalScrollArrows
            canScrollLeft={maxTranslate > 2 && translateX > 2}
            canScrollRight={maxTranslate > 2 && maxTranslate - translateX > 2}
            onScrollLeft={() => scrollTrackList(-1)}
            onScrollRight={() => scrollTrackList(1)}
            label="Lifestyle playlist tracks"
          />

        </section>
      </div>

      <div className="lifestyle-playlist-detail__pagination" aria-hidden="true">
        {playlistTracks.map((track, index) => (
          <span
            className={selectedTrack === index ? "is-active" : ""}
            key={track.id}
          />
        ))}
      </div>

      <section className="lifestyle-playlist-detail__archive-meta playlist-detail-note" aria-label="Lifestyle curator note">
          <div className="lifestyle-playlist-detail__archive-copy">
            <span>CURATOR&apos;S NOTE · 04:00 AM</span>
            <blockquote>
              “새벽 4시의 조용한 카페. 커피 향과 함께 흘러나오는 음악이 하루를 시작하게 만들어줍니다.”
            </blockquote>
          </div>
          <div className="lifestyle-playlist-detail__stats" aria-label="플레이리스트 통계">
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true"><ClockIcon size="small" className="tempy-icon--playlist-stat" /></span>
              <strong>21:03</strong>
              <small>TOTAL TIME</small>
            </div>
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true"><TrackListIcon size="small" className="tempy-icon--playlist-stat" /></span>
              <strong>{playlistTracks.length}</strong>
              <small>TRACKS</small>
            </div>
            <div className="lifestyle-playlist-detail__stat">
              <span aria-hidden="true"><HeartIcon size="small" className="tempy-icon--playlist-stat" /></span>
              <strong>1.5K</strong>
              <small>LIKES</small>
            </div>
          </div>
          <p className="lifestyle-playlist-detail__drag-hint" aria-hidden="true">DRAG TO EXPLORE →</p>
      </section>
    </main>
  );
}

export default LifestylePlaylistDetail;
