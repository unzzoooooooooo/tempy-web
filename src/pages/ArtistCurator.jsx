import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "../components/TempyIcons";
import { artistPlaylists, getArtistPlaylistThemeStyle } from "../data/artistPlaylists";
import { seededShuffle } from "../utils/recommendations";
import { useSmoothHorizontalWheel } from "../utils/useSmoothHorizontalWheel";

const getArtistCuratorHourSeed = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}-${hour}`;
};

function ArtistCurator() {
  const navigate = useNavigate();
  const [hourSeed, setHourSeed] = useState(() => getArtistCuratorHourSeed());
  const [translateX, setTranslateX] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const dragState = useRef(null);
  const didDrag = useRef(false);
  const previousHourSeedRef = useRef(hourSeed);
  const isPhone = window.matchMedia("(max-width: 480px)").matches;
  const displayArtistPlaylists = useMemo(() => (
    seededShuffle(artistPlaylists, `artist-curator-${hourSeed}`)
  ), [hourSeed]);

  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 480px)").matches) return;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let refreshTimer;

    const scheduleNextHour = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);

      refreshTimer = window.setTimeout(() => {
        setHourSeed(getArtistCuratorHourSeed());
        scheduleNextHour();
      }, Math.max(1000, nextHour.getTime() - now.getTime() + 50));
    };

    scheduleNextHour();
    return () => window.clearTimeout(refreshTimer);
  }, []);

  const moveTo = (nextTranslate) => {
    const clamped = Math.min(maxTranslateRef.current, Math.max(0, nextTranslate));
    translateRef.current = clamped;
    setTranslateX(clamped);
    setScrollProgress(maxTranslateRef.current > 0 ? clamped / maxTranslateRef.current : 0);
  };

  useEffect(() => {
    const updateRange = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const rightPadding = 52;
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

  const stopWheelMotion = useSmoothHorizontalWheel({
    containerRef: viewportRef,
    getPosition: () => translateRef.current,
    getMaxPosition: () => maxTranslateRef.current,
    setPosition: moveTo,
    onMotionChange: setIsDirectInput,
  });

  useEffect(() => {
    if (previousHourSeedRef.current === hourSeed) return;

    previousHourSeedRef.current = hourSeed;
    stopWheelMotion();
    translateRef.current = 0;
    setTranslateX(0);
    setScrollProgress(0);
    setIsDirectInput(false);
    if (viewportRef.current) viewportRef.current.scrollLeft = 0;
  }, [hourSeed, stopWheelMotion]);

  const handlePointerDown = (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopWheelMotion();
    didDrag.current = false;
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

    didDrag.current = true;
    setIsDirectInput(true);
    moveTo(drag.startTranslate - distance);
  };

  const endDrag = (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  const openPlaylist = (playlist) => {
    navigate(`/curator/artist/${playlist.id}`);
  };

  const handleCardClick = (event, playlist) => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    if (event.target.closest("button, a, [data-tempy-playable]")) return;
    openPlaylist(playlist);
  };

  return (
    <main className="artist-curator">
      <button
        className="artist-curator__back detail-back-link"
        type="button"
        onClick={() => navigate("/curator")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO CURATOR</span>
      </button>

      <aside className="artist-curator__intro">
        <p className="artist-curator__eyebrow">MOMENT CURATOR · 02</p>
        <h1>Artist Curator</h1>
        <p>당신이 살아보지 못한 순간의 삶을 사는 사람들의<br />{" "}다양한 음악을 감상해보세요</p>
        <span className="artist-curator__wordmark" aria-hidden="true">ARTIST</span>
      </aside>

      <div className="artist-curator__archive split-page-panel split-archive-panel">
        <div className="artist-curator__archive-inner split-page-panel__inner split-archive-panel__inner">
          <div
            className="artist-curator__archive-head split-page-panel__header split-archive-panel__header"
            aria-hidden="true"
          >
            <span>PLAYLIST ARCHIVE</span>
            <span>01 — {String(artistPlaylists.length).padStart(2, "0")}</span>
          </div>

          <section
            className="artist-curator__viewport split-page-panel__content split-archive-panel__viewport"
            ref={viewportRef}
            aria-label="Artist curator playlists"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            <div
              className={`artist-curator__track${isDirectInput ? " artist-curator__track--direct" : ""}`}
              ref={trackRef}
              style={{ transform: isPhone ? undefined : `translateX(${-translateX}px)` }}
            >
              {displayArtistPlaylists.map((playlist, index) => (
                <article
                  className="artist-curator__card"
                  key={playlist.id}
                  style={{
                    ...getArtistPlaylistThemeStyle(playlist),
                    "--artist-card-index": index,
                    cursor: "pointer",
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${playlist.artist}의 아티스트 플레이리스트 상세 보기`}
                  onClick={(event) => handleCardClick(event, playlist)}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPlaylist(playlist);
                    }
                  }}
                >
                  <div className="artist-curator__card-copy">
                    <span className="artist-curator__card-number">
                      {String(index + 1).padStart(2, "0")} / {String(artistPlaylists.length).padStart(2, "0")}
                    </span>
                    <h2>{playlist.title}</h2>
                    <p>{playlist.artist}</p>
                    <div className="artist-curator__card-meta">
                      <span>{playlist.meta}</span>
                      <span className="tempy-icon-stat"><HeartIcon size="small" /> {playlist.likes}</span>
                    </div>
                    <div className="artist-curator__author">
                      <span>{playlist.author.slice(0, 1)}</span>
                      <strong>CURATED BY {playlist.author}</strong>
                    </div>
                  </div>
                  <div className="artist-curator__image">
                    <img src={playlist.image} alt={`${playlist.artist} 아티스트 큐레이터`} draggable="false" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div
            className="artist-curator__explore split-page-panel__footer split-archive-panel__footer"
            aria-hidden="true"
          >
            <div className="artist-curator__scroll-line">
              <span style={{ transform: `scaleX(${0.08 + scrollProgress * 0.92})` }} />
            </div>
            <span>DRAG TO EXPLORE →</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ArtistCurator;
