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

function GlobalPlayer() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);

  useEffect(() => {
    const handlePlayRequest = (event) => {
      setCurrentTrack(event.detail);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(parseTrackDuration(event.detail?.duration));
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
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    return undefined;
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack?.audioSrc) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

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
  };

  if (!currentTrack) return <audio ref={audioRef} />;

  return (
    <aside className={`global-player${isPlaying ? " global-player--playing" : ""}`} aria-label="Global music player">
      <audio
        ref={audioRef}
        onLoadedMetadata={handleAudioLoaded}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="global-player__card">
        <div className="global-player__copy">
          <span>{isPlaying ? "NOW PLAYING" : "PREVIEWING"}</span>
          <strong>{currentTrack.title}</strong>
          <p>{currentTrack.artist}</p>
        </div>

        <div className="global-player__vinyl-clip" aria-hidden="true">
          <div className="global-player__vinyl-wrap">
            <div
              className="global-player__vinyl"
              style={{ "--global-player-cover": `url(${currentTrack.cover})` }}
            />
            <div className="global-player__vinyl-center">
              <img src={currentTrack.cover} alt="" />
            </div>
          </div>
        </div>

        <div className="global-player__controls">
          <time>{formatTime(currentTime)} / {formatTime(duration)}</time>
          <button
            className="global-player__toggle"
            type="button"
            aria-label={isPlaying ? "Pause current track" : "Play current track"}
            onClick={() => setIsPlaying((playing) => !playing)}
          >
            {isPlaying ? "Ⅱ" : "▶"}
          </button>
        </div>

        <button
          className="global-player__close"
          type="button"
          aria-label="Close player"
          onClick={handleClosePlayer}
        >
          ×
        </button>
      </div>
    </aside>
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
