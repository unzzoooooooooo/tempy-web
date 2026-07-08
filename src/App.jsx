import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./index.css";
import logoNav from "./assets/Tempy!_logo_nav.svg";
import Home from "./pages/Home";
import Now from "./pages/Now";
import Discover from "./pages/Discover";
import DiscoverTimeSet from "./pages/DiscoverTimeSet";
import DiscoverTrackTrace from "./pages/DiscoverTrackTrace";
import TrackTraceDetail from "./pages/TrackTraceDetail";
import TrackTraceAlbum from "./pages/TrackTraceAlbum";
import ArtistProfile from "./pages/ArtistProfile";
import Curator from "./pages/Curator";
import LifestyleCurator from "./pages/LifestyleCurator";
import LifestylePlaylistDetail from "./pages/LifestylePlaylistDetail";
import ArtistCurator from "./pages/ArtistCurator";
import ArtistPlaylistDetail from "./pages/ArtistPlaylistDetail";
import SimilarCurator from "./pages/SimilarCurator";
import Create from "./pages/Create";
import Archive from "./pages/Archive";
import ArchiveBlindPick from "./pages/ArchiveBlindPick";
import Profile from "./pages/Profile";
import Login, { LoginSuccess } from "./pages/Login";
import { localTracks } from "./data/tracks";

const AUTH_STORAGE_KEY = "isLoggedIn";

const readLoginState = () => {
  try {
    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => readLoginState());

  useEffect(() => {
    const syncLoginState = () => {
      setIsLoggedIn(readLoginState());
    };

    window.addEventListener("storage", syncLoginState);
    window.addEventListener("tempy-auth-change", syncLoginState);
    window.addEventListener("focus", syncLoginState);

    return () => {
      window.removeEventListener("storage", syncLoginState);
      window.removeEventListener("tempy-auth-change", syncLoginState);
      window.removeEventListener("focus", syncLoginState);
    };
  }, []);

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("tempy-auth-change"));
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link className="logo-small" to="/" aria-label="Go to Home">
          <img src={logoNav} alt="Tempy!" draggable={false} />
        </Link>
      </div>
      <div className="header-right">
        <nav className="top-nav">
          <Link to="/now">Now</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/curator">Curator</Link>
          <Link to="/create">Create</Link>
          <Link to="/archive">Archive</Link>
        </nav>
        <div className="header-profile-actions">
          <button className="header-auth-button" type="button" onClick={handleAuthClick}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
          <Link className="top-profile-button" to={isLoggedIn ? "/my" : "/login"} aria-label="Go to My Profile">
            <img src="/images/artist-04.png" alt="" draggable={false} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function TempyCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const canUseCursor = window.matchMedia("(pointer: fine)").matches
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canUseCursor) return undefined;

    const cursor = cursorRef.current;
    if (!cursor) return undefined;

    let targetX = -50;
    let targetY = -50;
    let currentX = -50;
    let currentY = -50;
    let animationFrame = null;
    const interactiveSelector = [
      "a",
      "button",
      "[role='button']",
      "input",
      "textarea",
      "select",
      "label",
      "summary",
      ".header",
      ".header *",
      ".nav a",
      ".top-nav a",
      ".archive-page__created-card",
      ".archive-card",
      ".archive-card *",
      ".archive-blind-page__bar",
      ".archive-blind-page__bar *",
      ".blind-pick-bar",
      ".blind-pick-bar *",
      ".create-card",
      ".create-start-card",
      ".create-detail-action",
      ".create-detail-secondary-action",
      ".track-card",
      ".album-card",
      ".album-card *",
      ".artist-card",
      ".playlist-row",
      ".leftnow-card",
      ".curator-item",
    ].join(",");

    const render = () => {
      currentX += (targetX - currentX) * 0.32;
      currentY += (targetY - currentY) * 0.32;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-hovering", Boolean(event.target.closest?.(interactiveSelector)));
    };

    const handlePointerEnter = () => {
      cursor.classList.add("is-visible");
    };

    const handlePointerLeave = () => {
      cursor.classList.remove("is-visible", "is-hovering");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerenter", handlePointerEnter);
    window.addEventListener("pointerleave", handlePointerLeave);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return <div className="tempy-cursor" ref={cursorRef} aria-hidden="true" />;
}

const PLAYABLE_SELECTOR = [
  "[data-tempy-playable]",
  ".album-card",
  ".now-page__selected",
  ".now-page__queue-item",
  ".artist-wide-card",
  ".playlist-row",
  ".leftnow-card",
  ".track-trace-detail__card",
  ".track-comment-detail__song",
  ".track-detail-lower__song-card",
  ".artist-profile__track-card",
  ".artist-profile__release-card",
  ".artist-profile__track-list li",
  ".artist-profile__ranking-row",
  ".artist-playlist-detail__item",
  ".lifestyle-playlist-detail__item",
  ".profile-moment-card",
  ".profile-playlist-card",
  ".archive-blind-page__bar",
  ".archive-created-track",
  ".create-result-track",
].join(",");

const getText = (element, selectors) => {
  for (const selector of selectors) {
    const node = element.querySelector(selector);
    const text = node?.textContent?.replace(/\s+/g, " ").trim();
    if (text) return text;
  }
  return "";
};

const normalizeTrackFromElement = (element) => {
  const cover = element.dataset.tempyCover
    || element.querySelector("img")?.getAttribute("src")
    || "/images/album-10.png";
  const title = element.dataset.tempyTitle
    || getText(element, ["[data-tempy-title]", "h1", "h2", "h3", "strong"])
    || "Tempy Preview";
  const artist = element.dataset.tempyArtist
    || getText(element, ["[data-tempy-artist]", ".artist-name", "strong small", "p", "span"])
    || "Tempy";
  const duration = element.dataset.tempyDuration
    || getText(element, ["time", ".duration"])
    || "00:15";

  return {
    id: element.dataset.tempyId || `${title}-${artist}`.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-"),
    title,
    artist,
    cover,
    duration,
  };
};

const parseTrackDuration = (durationValue) => {
  if (typeof durationValue === "number" && Number.isFinite(durationValue)) return durationValue;
  if (typeof durationValue !== "string") return 15;

  const timeParts = durationValue.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (timeParts) {
    return Number(timeParts[1]) * 60 + Number(timeParts[2]);
  }

  const numericDuration = Number.parseFloat(durationValue);
  return Number.isFinite(numericDuration) ? numericDuration : 15;
};

const getCircularPointStyle = (seconds, totalSeconds) => {
  const safeTotal = Number.isFinite(totalSeconds) && totalSeconds > 0 ? totalSeconds : 1;
  const progress = Math.min(1, Math.max(0, seconds / safeTotal));
  const angle = (progress * 360) - 90;
  const radians = (angle * Math.PI) / 180;
  const radius = 47;
  const x = 50 + (Math.cos(radians) * radius);
  const y = 50 + (Math.sin(radians) * radius);

  return {
    left: `${x}%`,
    top: `${y}%`,
  };
};

function GlobalPlayer() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progressTime, setProgressTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isFullPlayerExpanded, setIsFullPlayerExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(72);
  const [sidePanelMode, setSidePanelMode] = useState("playlist");
  const [momentInput, setMomentInput] = useState("");
  const [moments, setMoments] = useState([
    {
      id: "moment-01",
      profile: "/images/profile-01.png",
      name: "오늘은까눌레",
      time: "0:42",
      text: "이 부분에서 오늘 하루가 살짝 정리되는 느낌이에요.",
    },
    {
      id: "moment-02",
      profile: "/images/profile-04.png",
      name: "hostless",
      time: "1:18",
      text: "비 오는 퇴근길에 들으면 창밖 색이 더 깊어져요.",
    },
    {
      id: "moment-03",
      profile: "/images/profile-07.png",
      name: "만두두왕",
      time: "2:09",
      text: "후렴 직전의 숨 고르는 순간이 제일 좋아요.",
    },
  ]);

  const playlist = localTracks.map((track) => ({
    ...track,
    cover: track.cover || track.image || "/images/album-10.png",
  }));

  useEffect(() => {
    const handlePlayRequest = (event) => {
      setCurrentTrack(event.detail);
      setIsPlaying(true);
      setCurrentTime(0);
      setProgressTime(0);
      setDuration(parseTrackDuration(event.detail?.duration));
      setIsSaved(false);
    };

    window.addEventListener("tempy-play-track", handlePlayRequest);
    return () => window.removeEventListener("tempy-play-track", handlePlayRequest);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const action = target.closest("button, [role='button']");
      const actionText = action?.textContent?.trim().toLowerCase() || "";
      const actionLabel = action?.getAttribute("aria-label")?.toLowerCase() || "";
      const looksLikePlayAction = Boolean(action)
        && (
          actionText.includes("play")
          || actionText.includes("▶")
          || actionLabel.includes("play")
          || actionLabel.includes("재생")
        )
        && !actionLabel.includes("previous")
        && !actionLabel.includes("next")
        && !actionLabel.includes("이전")
        && !actionLabel.includes("다음");
      const playable = target.closest(PLAYABLE_SELECTOR);

      if (!playable || (action && !looksLikePlayAction && !target.closest("[data-tempy-playable]"))) return;

      window.dispatchEvent(new CustomEvent("tempy-play-track", {
        detail: normalizeTrackFromElement(playable),
      }));
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioSrc) return undefined;

    audio.src = currentTrack.audioSrc;
    audio.volume = volume / 100;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    return undefined;
  }, [currentTrack, isPlaying, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioSrc) return;

    audio.volume = volume / 100;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!currentTrack || currentTrack.audioSrc) return undefined;
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setCurrentTime((time) => {
        const nextTime = time + 0.5;
        return nextTime >= duration ? 0 : nextTime;
      });
    }, 500);

    return () => window.clearInterval(timer);
  }, [currentTrack, duration, isPlaying]);

  useEffect(() => {
    if (!currentTrack) return undefined;
    if (!isPlaying) return undefined;

    let animationFrame = null;
    let lastFrameAt = performance.now();
    const safeTotal = Number.isFinite(duration) && duration > 0 ? duration : 1;

    const renderProgress = (now) => {
      const audio = audioRef.current;

      if (currentTrack.audioSrc && audio) {
        setProgressTime(audio.currentTime);
      } else {
        const elapsed = (now - lastFrameAt) / 1000;
        lastFrameAt = now;
        setProgressTime((time) => (time + elapsed) % safeTotal);
      }

      animationFrame = window.requestAnimationFrame(renderProgress);
    };

    animationFrame = window.requestAnimationFrame(renderProgress);

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [currentTrack, currentTrack?.audioSrc, duration, isPlaying]);

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = Math.floor(safeSeconds % 60);
    return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
  };

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgressTime(audio.currentTime);
  };

  const handleAudioLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 15);
  };

  const handleClosePlayer = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setProgressTime(0);
    setIsFullPlayerOpen(false);
    setIsFullPlayerExpanded(false);
    setIsRecording(false);
  };

  if (!currentTrack) return <audio ref={audioRef} />;

  const currentTrackIndex = Math.max(
    0,
    playlist.findIndex((track) => track.id === currentTrack.id),
  );

  const selectTrack = (track, shouldPlay = isPlaying) => {
    setCurrentTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover || track.image,
      duration: track.duration,
      audioSrc: track.audioSrc,
    });
    setCurrentTime(0);
    setProgressTime(0);
    setDuration(parseTrackDuration(track.duration));
    setIsPlaying(shouldPlay);
    setIsSaved(false);
  };

  const handlePreviousTrack = () => {
    const nextIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    selectTrack(playlist[nextIndex], isPlaying);
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    selectTrack(playlist[nextIndex], isPlaying);
  };

  const handleRandomTrack = () => {
    if (playlist.length <= 1) return;
    const candidates = playlist.filter((track) => track.id !== currentTrack.id);
    const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
    selectTrack(randomTrack, true);
  };

  const handleMomentSubmit = (event) => {
    event.preventDefault();
    const text = momentInput.trim();
    if (!text) return;

    setMoments((currentMoments) => [
      ...currentMoments,
      {
        id: `moment-${Date.now()}`,
        profile: "/images/profile-03.png",
        name: "you",
        time: formatTime(currentTime),
        text,
      },
    ]);
    setMomentInput("");
  };

  const vinylStyle = { "--global-player-cover": `url(${currentTrack.cover})` };
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : parseTrackDuration(currentTrack.duration);
  const playProgress = Math.min(1, Math.max(0, progressTime / safeDuration));
  const progressStyle = {
    "--full-player-progress": `${playProgress * 360}deg`,
  };
  const progressDotStyle = getCircularPointStyle(progressTime, safeDuration);
  const momentMarkers = moments.map((moment) => ({
    ...moment,
    pointStyle: getCircularPointStyle(parseTrackDuration(moment.time), safeDuration),
  }));
  const fullPlayerClassName = [
    "full-player",
    isPlaying ? "full-player--playing" : "",
    isFullPlayerExpanded ? "full-player--expanded" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleAudioLoaded}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      {isFullPlayerOpen && (
        <section className={fullPlayerClassName} aria-label="Full music player">
          <div className="full-player__stage">
            <button
              className="full-player__close"
              type="button"
              aria-label="Back to mini player"
              onClick={() => setIsFullPlayerOpen(false)}
            >
              ×
            </button>
            <div className="full-player__disc-area">
              <div className="full-player__disc-wrap">
                <div className="full-player__disc-shell">
                  <div className="full-player__disc" style={vinylStyle}>
                    <div className="full-player__disc-label">
                      <img src={currentTrack.cover} alt="" draggable={false} />
                    </div>
                  </div>
                  <div
                    className="full-player__progress-ring"
                    style={progressStyle}
                    aria-label={`Playback progress ${Math.round(playProgress * 100)}%`}
                  >
                    <span className="full-player__start-dot" aria-hidden="true" />
                    <span className="full-player__progress-dot" style={progressDotStyle} aria-hidden="true" />
                    {momentMarkers.map((moment) => (
                      <span
                        className="full-player__moment-dot"
                        key={moment.id}
                        style={moment.pointStyle}
                        title={`${moment.name} · ${moment.time}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="full-player__disc-copy">
                    <strong>{currentTrack.title}</strong>
                    <p>{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="full-player__controls" aria-label="Playback controls">
              <div className="full-player__control-group">
                <button type="button" aria-label="Shuffle track" onClick={handleRandomTrack}>↝</button>
                <button
                  className={isSaved ? "full-player__heart full-player__heart--active" : "full-player__heart"}
                  type="button"
                  aria-label={isSaved ? "Remove from saved" : "Save track"}
                  onClick={() => setIsSaved((saved) => !saved)}
                >
                  ♥
                </button>
                <button
                  className={isRecording ? "full-player__record full-player__record--active" : "full-player__record"}
                  type="button"
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                  onClick={() => setIsRecording((recording) => !recording)}
                >
                  ●
                </button>
              </div>

              <div className="full-player__transport">
                <button type="button" aria-label="Previous track" onClick={handlePreviousTrack}>‹</button>
                <button
                  className="full-player__play"
                  type="button"
                  aria-label={isPlaying ? "Pause current track" : "Play current track"}
                  onClick={() => setIsPlaying((playing) => !playing)}
                >
                  {isPlaying ? "Ⅱ" : "▶"}
                </button>
                <button type="button" aria-label="Next track" onClick={handleNextTrack}>›</button>
              </div>

              <div className="full-player__control-group full-player__right-tools">
                <label className="full-player__volume">
                  <span aria-hidden="true">◒</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    aria-label="Volume"
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                </label>
                <button
                  type="button"
                  aria-label={isFullPlayerExpanded ? "Show side panel" : "Hide side panel"}
                  onClick={() => setIsFullPlayerExpanded((expanded) => !expanded)}
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>

          <aside className="full-player__side" aria-label="Player side panel">
            <div className="full-player__tabs" role="tablist" aria-label="Player panel mode">
              <button
                className={sidePanelMode === "playlist" ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={sidePanelMode === "playlist"}
                onClick={() => setSidePanelMode("playlist")}
              >
                Playlist
              </button>
              <button
                className={sidePanelMode === "moments" ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={sidePanelMode === "moments"}
                onClick={() => setSidePanelMode("moments")}
              >
                Time Moment
              </button>
            </div>

            {sidePanelMode === "playlist" ? (
              <div className="full-player__panel-content">
                <h2>Track lists</h2>
                <div className="full-player__track-list">
                  {playlist.map((track, index) => (
                    <button
                      className={track.id === currentTrack.id ? "full-player__track-row is-current" : "full-player__track-row"}
                      type="button"
                      key={track.id}
                      onClick={() => selectTrack(track, true)}
                    >
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <img src={track.cover} alt="" draggable={false} />
                      <span>
                        <strong>{track.title}</strong>
                        <small>{track.artist}</small>
                      </span>
                      <time>{track.duration}</time>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="full-player__panel-content full-player__moments">
                <h2>Time Moment</h2>
                <p>노래가 흐르는 시간 위에 떠오른 순간을 남겨보세요.</p>
                <div className="full-player__moment-list">
                  {moments.map((moment) => (
                    <article className="full-player__moment" key={moment.id}>
                      <img src={moment.profile} alt="" draggable={false} />
                      <div>
                        <header>
                          <strong>{moment.name}</strong>
                          <time>{moment.time}</time>
                        </header>
                        <p>{moment.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <form className="full-player__moment-form" onSubmit={handleMomentSubmit}>
                  <input
                    type="text"
                    value={momentInput}
                    placeholder="이 순간을 남겨보세요"
                    aria-label="Time moment comment"
                    onChange={(event) => setMomentInput(event.target.value)}
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
            )}
          </aside>
        </section>
      )}

      {!isFullPlayerOpen && (
        <aside className={`global-player${isPlaying ? " global-player--playing" : ""}`} aria-label="Global music player">
          <div className="global-player__card" onClick={() => setIsFullPlayerOpen(true)}>
            <div className="global-player__copy">
              <span>{isPlaying ? "NOW PLAYING" : "PREVIEWING"}</span>
              <strong>{currentTrack.title}</strong>
              <p>{currentTrack.artist}</p>
            </div>

            <div className="global-player__vinyl-clip">
              <button
                className="global-player__vinyl-wrap"
                type="button"
                aria-label="Open full player"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsFullPlayerOpen(true);
                }}
              >
                <div
                  className="global-player__vinyl"
                  style={vinylStyle}
                />
                <div className="global-player__vinyl-center">
                  <img src={currentTrack.cover} alt="" />
                </div>
              </button>
            </div>

            <div className="global-player__controls">
              <time>{formatTime(currentTime)} / {formatTime(duration)}</time>
              <button
                className="global-player__toggle"
                type="button"
                aria-label={isPlaying ? "Pause current track" : "Play current track"}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsPlaying((playing) => !playing);
                }}
              >
                {isPlaying ? "Ⅱ" : "▶"}
              </button>
            </div>

            <button
              className="global-player__close"
              type="button"
              aria-label="Close player"
              onClick={(event) => {
                event.stopPropagation();
                handleClosePlayer();
              }}
            >
              ×
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

function App() {
  return (
    <div className="app">
      <TempyCursor />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/now" element={<Now />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/discover/time-set" element={<DiscoverTimeSet />} />
        <Route path="/discover/track-trace" element={<DiscoverTrackTrace />} />
        <Route path="/discover/track-trace/detail" element={<TrackTraceDetail />} />
        <Route path="/discover/track-trace/album" element={<TrackTraceAlbum />} />
        <Route path="/artist/taylor-swift" element={<ArtistProfile />} />
        <Route path="/curator" element={<Curator />} />
        <Route path="/curator/lifestyle" element={<LifestyleCurator />} />
        <Route path="/curator/lifestyle/playlist" element={<LifestylePlaylistDetail />} />
        <Route path="/curator/artist" element={<ArtistCurator />} />
        <Route path="/curator/artist/playlist" element={<ArtistPlaylistDetail />} />
        <Route path="/curator/similar" element={<SimilarCurator />} />
        <Route path="/create" element={<Create />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/blind-pick" element={<ArchiveBlindPick />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/success" element={<LoginSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my" element={<Profile />} />
      </Routes>
      <GlobalPlayer />
    </div>
  );
}

export default App;
