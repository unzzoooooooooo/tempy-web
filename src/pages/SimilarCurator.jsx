import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HorizontalScrollArrows } from "../components/HorizontalScrollArrows";
import { HeartIcon, PlayIcon, ShuffleIcon } from "../components/TempyIcons";
import { tracks as musicCatalogTracks } from "../data/musicCatalog";
import { useSmoothHorizontalWheel } from "../utils/useSmoothHorizontalWheel";

const similarPlaylists = [
  {
    title: "20년차 카페 사장님의 새벽 플레이리스트",
    author: "새벽의 점장",
    meta: "12곡 · 42 min",
    likes: "1.5k",
    tracks: [
      { title: "Coffee at Dawn", artist: "beabadoobee", cover: "/images/album-10.png" },
      { title: "Velvet Morning", artist: "The Marias", cover: "/images/album-11.png" },
      { title: "Afterglow", artist: "Wave to Earth", cover: "/images/album-12.png" },
      { title: "First Light", artist: "Hozier", cover: "/images/album-13.png" },
      { title: "Quiet Hours", artist: "Men I Trust", cover: "/images/album-14.png" },
    ],
  },
  {
    title: "퇴근 후 골목을 천천히 걷는 디자이너",
    author: "낮은 조도",
    meta: "10곡 · 34 min",
    likes: "982",
    tracks: [
      { title: "City Light", artist: "ADOY", cover: "/images/album-13.png" },
      { title: "Window Seat", artist: "Rex Orange County", cover: "/images/album-14.png" },
      { title: "Night Walk", artist: "HYUKOH", cover: "/images/album-40.png" },
      { title: "Neon Signs", artist: "The Black Skirts", cover: "/images/album-15.png" },
      { title: "Last Train", artist: "ADOY", cover: "/images/album-16.png" },
    ],
  },
  {
    title: "비 오는 날 서점 문을 여는 사람",
    author: "책등 사이",
    meta: "11곡 · 39 min",
    likes: "1.2k",
    tracks: [
      { title: "Paper Rain", artist: "Laufey", cover: "/images/album-15.png" },
      { title: "Quiet Hours", artist: "Men I Trust", cover: "/images/album-16.png" },
      { title: "First Page", artist: "HONNE", cover: "/images/album-06.png" },
      { title: "Bookshop Window", artist: "Laufey", cover: "/images/album-17.png" },
      { title: "Blue Bookmark", artist: "wave to earth", cover: "/images/album-18.png" },
    ],
  },
  {
    title: "첫차를 기다리는 방송 작가의 메모",
    author: "새벽 원고",
    meta: "9곡 · 31 min",
    likes: "744",
    tracks: [
      { title: "Blue Hour", artist: "TXT", cover: "/images/album-17.png" },
      { title: "Slow Motion", artist: "Laufey", cover: "/images/album-18.png" },
      { title: "Last Scene", artist: "Silica Gel", cover: "/images/album-51.png" },
      { title: "Morning Script", artist: "O3ohn", cover: "/images/album-19.png" },
      { title: "Platform No. 4", artist: "JANNABI", cover: "/images/album-20.png" },
    ],
  },
  {
    title: "낡은 필름 카메라를 들고 떠난 주말",
    author: "35mm",
    meta: "13곡 · 46 min",
    likes: "1.1k",
    tracks: [
      { title: "Golden Roll", artist: "The Marias", cover: "/images/album-19.png" },
      { title: "Summer Film", artist: "AKMU", cover: "/images/artist-02.png" },
      { title: "Soft Focus", artist: "ADOY", cover: "/images/album-20.png" },
      { title: "Weekend Roll", artist: "The Marías", cover: "/images/album-21.png" },
      { title: "Silver Grain", artist: "HYUKOH", cover: "/images/album-22.png" },
    ],
  },
  {
    title: "식물을 돌보며 하루를 시작하는 편집자",
    author: "초록 문장",
    meta: "10곡 · 36 min",
    likes: "889",
    tracks: [
      { title: "Green Room", artist: "Wave to Earth", cover: "/images/album-21.png" },
      { title: "Sunny Side", artist: "백예린", cover: "/images/album-61.png" },
      { title: "Bloom", artist: "LUCY", cover: "/images/album-22.png" },
      { title: "Morning Leaves", artist: "백예린", cover: "/images/album-23.png" },
      { title: "Green Window", artist: "Hozier", cover: "/images/album-24.png" },
    ],
  },
  {
    title: "작은 바에서 마감 불을 끄는 바텐더",
    author: "마지막 잔",
    meta: "12곡 · 44 min",
    likes: "1.4k",
    tracks: [
      { title: "Last Call", artist: "The Black Skirts", cover: "/images/album-23.png" },
      { title: "Amber Light", artist: "Crush", cover: "/images/album-36.png" },
      { title: "Goodnight", artist: "DPR IAN", cover: "/images/album-24.png" },
      { title: "Blue Glass", artist: "Crush", cover: "/images/album-25.png" },
      { title: "Closing Time", artist: "The Black Skirts", cover: "/images/album-26.png" },
    ],
  },
  {
    title: "도시락을 싸는 엄마의 조용한 오전",
    author: "따뜻한 칸",
    meta: "8곡 · 28 min",
    likes: "638",
    tracks: [
      { title: "Kitchen Light", artist: "Hozier", cover: "/images/album-25.png" },
      { title: "Small Table", artist: "Stella Jang", cover: "/images/album-26.png" },
      { title: "Warm Rice", artist: "10CM", cover: "/images/album-27.png" },
      { title: "Small Morning", artist: "Stella Jang", cover: "/images/album-28.png" },
      { title: "Apron Song", artist: "SURL", cover: "/images/album-29.png" },
    ],
  },
  {
    title: "혼자 여행 온 밤의 게스트하우스",
    author: "낯선 방",
    meta: "14곡 · 49 min",
    likes: "1.0k",
    tracks: [
      { title: "Hostel Blue", artist: "JANNABI", cover: "/images/album-42.png" },
      { title: "Map Fold", artist: "The Marias", cover: "/images/album-28.png" },
      { title: "Far Window", artist: "검정치마", cover: "/images/album-29.png" },
      { title: "Foreign Ceiling", artist: "The Marías", cover: "/images/album-30.png" },
      { title: "Night Map", artist: "JANNABI", cover: "/images/album-31.png" },
    ],
  },
  {
    title: "새 프로젝트를 시작하는 개발자의 심야",
    author: "빌드 완료",
    meta: "11곡 · 41 min",
    likes: "920",
    tracks: [
      { title: "Deep Work", artist: "FKJ", cover: "/images/album-30.png" },
      { title: "Midnight Push", artist: "O3ohn", cover: "/images/album-49.png" },
      { title: "New Branch", artist: "HONNE", cover: "/images/album-31.png" },
      { title: "Merge at Dawn", artist: "FKJ", cover: "/images/album-30.png" },
      { title: "Blue Terminal", artist: "O3ohn", cover: "/images/album-29.png" },
    ],
  },
];

const similarTrackAdditions = [
  [
    { title: "Window Seat", artist: "Rex Orange County", cover: "/images/album-15.png" },
    { title: "Sunday Coffee", artist: "Laufey", cover: "/images/album-16.png" },
  ],
  [
    { title: "Street Lamp", artist: "O3ohn", cover: "/images/album-17.png" },
    { title: "Homebound", artist: "HONNE", cover: "/images/album-18.png" },
  ],
  [
    { title: "Paper Moon", artist: "백예린", cover: "/images/album-19.png" },
    { title: "Rain on Glass", artist: "The Marías", cover: "/images/album-20.png" },
  ],
  [
    { title: "First Train", artist: "ADOY", cover: "/images/album-21.png" },
    { title: "Unsent Pages", artist: "Silica Gel", cover: "/images/album-22.png" },
  ],
  [
    { title: "Sun Bleached", artist: "HYUKOH", cover: "/images/album-23.png" },
    { title: "Frame by Frame", artist: "AKMU", cover: "/images/album-24.png" },
  ],
  [
    { title: "Soft Green", artist: "Wave to Earth", cover: "/images/album-25.png" },
    { title: "A New Leaf", artist: "LUCY", cover: "/images/album-26.png" },
  ],
  [
    { title: "Amber Room", artist: "DPR IAN", cover: "/images/album-27.png" },
    { title: "One More Glass", artist: "Crush", cover: "/images/album-28.png" },
  ],
  [
    { title: "Kitchen Radio", artist: "10CM", cover: "/images/album-29.png" },
    { title: "Quiet Table", artist: "Stella Jang", cover: "/images/album-30.png" },
  ],
  [
    { title: "Postcard Blue", artist: "검정치마", cover: "/images/album-31.png" },
    { title: "Shared Balcony", artist: "JANNABI", cover: "/images/album-10.png" },
  ],
  [
    { title: "Night Compile", artist: "FKJ", cover: "/images/album-11.png" },
    { title: "Dawn Release", artist: "O3ohn", cover: "/images/album-12.png" },
  ],
];

const normalizedSimilarPlaylists = similarPlaylists.map((playlist, index) => ({
  ...playlist,
  tracks: [...playlist.tracks, ...(similarTrackAdditions[index] || [])].map((_, trackIndex) => (
    musicCatalogTracks[((index * 7) + trackIndex) % musicCatalogTracks.length]
  )),
}));

function SimilarCurator() {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(null);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);
  const [shuffledPlaylistIndex, setShuffledPlaylistIndex] = useState(null);
  const [likedPlaylistIndexes, setLikedPlaylistIndexes] = useState(() => new Set());
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const activePlaylistIndexRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const dragState = useRef(null);
  const isMobile = window.matchMedia("(max-width: 760px)").matches;

  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePlayerProgress = (event) => {
      const playlistIndex = activePlaylistIndexRef.current;
      if (playlistIndex === null) return;
      const playlist = normalizedSimilarPlaylists[playlistIndex];
      const nextTrackId = event.detail?.trackId || null;
      const belongsToPlaylist = playlist?.tracks.some((track) => track.id === nextTrackId);
      setActiveTrackId(nextTrackId);
      if (!belongsToPlaylist) {
        setIsPlaylistPlaying(false);
        return;
      }
      setIsPlaylistPlaying(Boolean(event.detail.isPlaying));
    };

    window.addEventListener("tempy-player-progress", handlePlayerProgress);
    return () => window.removeEventListener("tempy-player-progress", handlePlayerProgress);
  }, []);

  const togglePlaylistPlayback = (event, playlistIndex) => {
    event.stopPropagation();
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    const playlist = normalizedSimilarPlaylists[playlistIndex];
    const isCurrentPlaylist = activePlaylistIndexRef.current === playlistIndex
      && playlist.tracks.some((track) => track.id === activeTrackId);

    if (isCurrentPlaylist) {
      window.dispatchEvent(new CustomEvent("tempy-toggle-playback"));
      setIsPlaylistPlaying((playing) => !playing);
      return;
    }

    const firstTrack = playlist.tracks[0];
    activePlaylistIndexRef.current = playlistIndex;
    setActivePlaylistIndex(playlistIndex);
    setActiveTrackId(firstTrack.id);
    setIsPlaylistPlaying(true);
    window.dispatchEvent(new CustomEvent("tempy-play-track", {
      detail: {
        track: firstTrack,
        playlist: playlist.tracks,
        shuffle: shuffledPlaylistIndex === playlistIndex,
      },
    }));
  };

  const togglePlaylistShuffle = (event, playlistIndex) => {
    event.stopPropagation();
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    const nextIndex = shuffledPlaylistIndex === playlistIndex ? null : playlistIndex;
    setShuffledPlaylistIndex(nextIndex);

    if (activePlaylistIndexRef.current === playlistIndex) {
      window.dispatchEvent(new CustomEvent("tempy-set-shuffle", {
        detail: {
          enabled: nextIndex === playlistIndex,
          playlist: normalizedSimilarPlaylists[playlistIndex].tracks,
        },
      }));
    }
  };

  const togglePlaylistLike = (event, playlistIndex) => {
    event.stopPropagation();
    if (!window.matchMedia("(max-width: 760px)").matches) return;
    setLikedPlaylistIndexes((currentIndexes) => {
      const nextIndexes = new Set(currentIndexes);
      if (nextIndexes.has(playlistIndex)) nextIndexes.delete(playlistIndex);
      else nextIndexes.add(playlistIndex);
      return nextIndexes;
    });
  };

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

      const rightPadding = 70;
      const nextMax = Math.max(0, track.scrollWidth - viewport.clientWidth + rightPadding);
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

  const stopWheelMotion = useSmoothHorizontalWheel({
    containerRef: viewportRef,
    getPosition: () => translateRef.current,
    getMaxPosition: () => maxTranslateRef.current,
    setPosition: moveTo,
    onMotionChange: setIsDirectInput,
    shouldIgnoreEvent: (event) => {
      const internalTrackList = event.target.closest(".similar-curator__tracks");
      if (!internalTrackList || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return false;

      const canScrollUp = event.deltaY < 0 && internalTrackList.scrollTop > 0;
      const canScrollDown = event.deltaY > 0
        && internalTrackList.scrollTop + internalTrackList.clientHeight < internalTrackList.scrollHeight - 1;
      return canScrollUp || canScrollDown;
    },
  });

  const scrollArchive = (direction) => {
    stopWheelMotion();
    const distance = (viewportRef.current?.clientWidth || 0) * 0.68;
    moveTo(translateRef.current + distance * direction);
  };

  const handlePointerDown = (event) => {
    if (isMobile) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest(".similar-curator__tracks")) return;
    stopWheelMotion();
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateRef.current,
    };
  };

  const handlePointerMove = (event) => {
    if (isMobile) return;
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
    if (isMobile) return;
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  return (
    <main className="similar-curator">
      <button
        className="similar-curator__back detail-back-link"
        type="button"
        onClick={() => navigate("/curator")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO CURATOR</span>
      </button>

      <aside className="similar-curator__intro">
        <p className="similar-curator__eyebrow">MOMENT CURATOR · 03</p>
        <h1>Similar Curator</h1>
        <p>당신이 살아보지 못한 순간의 삶을 사는 사람들의 다양한 음악을 감상해보세요</p>
        <span className="similar-curator__watermark" aria-hidden="true">T</span>
      </aside>

      <div className="similar-curator__archive split-page-panel split-archive-panel">
        <div className="similar-curator__archive-inner split-page-panel__inner split-archive-panel__inner">
          <div
            className="similar-curator__archive-head split-page-panel__header split-archive-panel__header"
            aria-hidden="true"
          >
            <span>PLAYLIST ARCHIVE</span>
            <span>01 — {String(similarPlaylists.length).padStart(2, "0")}</span>
          </div>

          <section
            className="similar-curator__viewport split-page-panel__content split-archive-panel__viewport horizontal-scroll-host"
            ref={viewportRef}
            aria-label="Similar curator playlists"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            <div
              className={`similar-curator__track${isDirectInput ? " similar-curator__track--direct" : ""}`}
              ref={trackRef}
              style={{ transform: isMobile ? undefined : `translateX(${-translateX}px)` }}
            >
              {normalizedSimilarPlaylists.map((playlist, index) => (
                <article
                  className="similar-curator__card"
                  key={`${playlist.title}-${index}`}
                  style={{ "--similar-card-index": index }}
                >
                  <span className="similar-curator__tab" aria-hidden="true" />
                  <div className="similar-curator__card-top">
                    <div className="similar-curator__card-index">
                      <span className="similar-curator__number">
                        {String(index + 1).padStart(2, "0")} / {String(similarPlaylists.length).padStart(2, "0")}
                      </span>
                      <span>PLAYLIST ARCHIVE</span>
                    </div>
                    <h2>{playlist.title}</h2>
                    <p className="similar-curator__byline">CURATED BY {playlist.author}</p>
                    <div className="similar-curator__meta">
                      <span>{playlist.meta}</span>
                      <span className="tempy-icon-stat"><HeartIcon size="small" /> {playlist.likes}</span>
                    </div>
                  </div>

                  <div className="similar-curator__card-bottom">
                    <div className="similar-curator__tracks" data-similar-track-scroll>
                      {playlist.tracks.map((track) => (
                        <div className="similar-curator__song" key={`${playlist.title}-${track.title}`}>
                          <img src={track.cover} alt="" draggable="false" />
                          <div>
                            <strong>{track.title}</strong>
                            <span>{track.artist}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="similar-curator__actions">
                      <button
                        className={`similar-curator__play${activePlaylistIndex === index && isPlaylistPlaying ? " is-playing" : ""}`}
                        type="button"
                        aria-label={`${playlist.title} ${activePlaylistIndex === index && isPlaylistPlaying ? "일시정지" : "재생"}`}
                        aria-pressed={activePlaylistIndex === index && isPlaylistPlaying}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => togglePlaylistPlayback(event, index)}
                      >
                        {activePlaylistIndex === index && isPlaylistPlaying ? (
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M4.25 3h2.5v10h-2.5zM9.25 3h2.5v10h-2.5z" />
                          </svg>
                        ) : <PlayIcon />}
                        {activePlaylistIndex === index && isPlaylistPlaying ? "PAUSE" : "PLAY"}
                      </button>
                      <button
                        className={`tempy-icon-button similar-curator__icon-action${shuffledPlaylistIndex === index ? " is-shuffled" : ""}`}
                        type="button"
                        aria-label={`${playlist.title} 셔플`}
                        aria-pressed={shuffledPlaylistIndex === index}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => togglePlaylistShuffle(event, index)}
                      >
                        <ShuffleIcon />
                      </button>
                      <button
                        className={`tempy-icon-button similar-curator__icon-action${likedPlaylistIndexes.has(index) ? " is-liked" : ""}`}
                        type="button"
                        aria-label={`${playlist.title} 좋아요`}
                        aria-pressed={likedPlaylistIndexes.has(index)}
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => togglePlaylistLike(event, index)}
                      >
                        <HeartIcon filled={likedPlaylistIndexes.has(index)} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <HorizontalScrollArrows
              canScrollLeft={maxTranslate > 2 && translateX > 2}
              canScrollRight={maxTranslate > 2 && maxTranslate - translateX > 2}
              onScrollLeft={() => scrollArchive(-1)}
              onScrollRight={() => scrollArchive(1)}
              label="Similar Curator"
            />
          </section>

          <div
            className="similar-curator__explore split-page-panel__footer split-archive-panel__footer"
            aria-hidden="true"
          >
            <div className="similar-curator__scroll-line">
              <span style={{ transform: `scaleX(${0.08 + scrollProgress * 0.92})` }} />
            </div>
            <span>DRAG TO EXPLORE →</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SimilarCurator;
