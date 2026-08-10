import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import { currentUserProfileImage } from "./data/imageCatalog";
import {
  getTrackByCover,
  getTrackById,
  normalizeMusicItem,
  tracks as musicCatalogTracks,
} from "./data/musicCatalog";

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
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const syncMobileLayout = () => {
      setIsMobile(mobileQuery.matches);
      if (!mobileQuery.matches) setIsMobileMenuOpen(false);
    };

    syncMobileLayout();
    mobileQuery.addEventListener("change", syncMobileLayout);
    return () => mobileQuery.removeEventListener("change", syncMobileLayout);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMobileMenuOpen]);

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
        <Link
          className="logo-small"
          to="/"
          aria-label="Go to Home"
          onClick={() => window.dispatchEvent(new CustomEvent("tempy-close-full-player"))}
        >
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
            <img src={currentUserProfileImage} alt="" draggable={false} />
          </Link>
        </div>
        {isMobile && (
          <button
            className={`mobile-menu-toggle${isMobileMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </div>
      {isMobile && (
        <nav
          id="mobile-navigation"
          className={`mobile-navigation${isMobileMenuOpen ? " is-open" : ""}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <Link to="/now" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>Now</Link>
          <Link to="/discover" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>Discover</Link>
          <Link to="/curator" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>Curator</Link>
          <Link to="/create" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>Create</Link>
          <Link to="/archive" tabIndex={isMobileMenuOpen ? 0 : -1} onClick={() => setIsMobileMenuOpen(false)}>Archive</Link>
        </nav>
      )}
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

  const canonicalTrack = getTrackById(element.dataset.tempyId) || getTrackByCover(cover);

  return normalizeMusicItem({
    ...(canonicalTrack || {}),
    id: canonicalTrack?.id || element.dataset.tempyId || `${title}-${artist}`.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-"),
    title: canonicalTrack?.title || title,
    artist: canonicalTrack?.artist || artist,
    cover: canonicalTrack?.cover || cover,
    duration: canonicalTrack?.duration || duration,
  });
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

const PLAYER_RING_CENTER = 50;
const PLAYER_RING_RADIUS = 46;
const getCircularPoint = (progressValue) => {
  const progress = Math.min(1, Math.max(0, progressValue));
  const angle = (progress * 360) - 90;
  const radians = angle * (Math.PI / 180);
  const x = PLAYER_RING_CENTER + (Math.cos(radians) * PLAYER_RING_RADIUS);
  const y = PLAYER_RING_CENTER + (Math.sin(radians) * PLAYER_RING_RADIUS);

  return {
    x,
    y,
  };
};

const getCircularProgressPath = (progress) => {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  if (clampedProgress <= 0) return "";

  const startX = PLAYER_RING_CENTER;
  const startY = PLAYER_RING_CENTER - PLAYER_RING_RADIUS;

  if (clampedProgress >= 1) {
    const bottomY = PLAYER_RING_CENTER + PLAYER_RING_RADIUS;
    return [
      `M ${startX} ${startY}`,
      `A ${PLAYER_RING_RADIUS} ${PLAYER_RING_RADIUS} 0 1 1 ${startX} ${bottomY}`,
      `A ${PLAYER_RING_RADIUS} ${PLAYER_RING_RADIUS} 0 1 1 ${startX} ${startY}`,
    ].join(" ");
  }

  const radians = (clampedProgress * 2 * Math.PI) - (Math.PI / 2);
  const endX = PLAYER_RING_CENTER + (Math.cos(radians) * PLAYER_RING_RADIUS);
  const endY = PLAYER_RING_CENTER + (Math.sin(radians) * PLAYER_RING_RADIUS);
  const largeArcFlag = clampedProgress > 0.5 ? 1 : 0;

  return `M ${startX} ${startY} A ${PLAYER_RING_RADIUS} ${PLAYER_RING_RADIUS} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
};

const getCircularProgressFromPointer = (event, element) => {
  const svg = element.ownerSVGElement || element;
  const rect = svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const angle = Math.atan2(y - PLAYER_RING_CENTER, x - PLAYER_RING_CENTER) * (180 / Math.PI);
  return ((angle + 90 + 360) % 360) / 360;
};

const getNextPlayableCatalogTrack = (trackId) => {
  if (!musicCatalogTracks.length) return null;
  const currentIndex = musicCatalogTracks.findIndex((track) => track.id === trackId);
  const startIndex = currentIndex >= 0 ? currentIndex : -1;

  for (let offset = 1; offset <= musicCatalogTracks.length; offset += 1) {
    const candidate = musicCatalogTracks[(startIndex + offset) % musicCatalogTracks.length];
    if (candidate?.audioPreview) return candidate;
  }

  return null;
};

function PlaybackProgressRing({ audioRef, duration, isPlaying, isReady, momentMarkers, onSeek }) {
  const isSeekingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const resetEndedProgress = () => setProgress(0);
    audio.addEventListener("ended", resetEndedProgress);
    return () => audio.removeEventListener("ended", resetEndedProgress);
  }, [audioRef]);

  useEffect(() => {
    if (!isPlaying || !isReady) return undefined;

    const renderProgress = () => {
      const audio = audioRef.current;
      if (!isSeekingRef.current) {
        const liveDuration = audio?.duration;
        const liveTime = audio?.currentTime;
        const nextProgress = Number.isFinite(liveDuration) && liveDuration > 0 && Number.isFinite(liveTime)
          ? Math.min(1, Math.max(0, liveTime / liveDuration))
          : 0;
        setProgress(nextProgress);
      }
      animationFrameRef.current = window.requestAnimationFrame(renderProgress);
    };

    animationFrameRef.current = window.requestAnimationFrame(renderProgress);
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [audioRef, isPlaying, isReady]);

  const seekFromPointer = (event) => {
    const nextProgress = getCircularProgressFromPointer(event, event.currentTarget);
    const clampedProgress = Math.min(1, Math.max(0, nextProgress));
    setProgress(clampedProgress);
    onSeek(clampedProgress);
  };

  const handlePointerDown = (event) => {
    if (!isReady) return;
    event.preventDefault();
    isSeekingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    seekFromPointer(event);
  };

  const handlePointerMove = (event) => {
    if (!isSeekingRef.current) return;
    seekFromPointer(event);
  };

  const handlePointerEnd = (event) => {
    if (!isSeekingRef.current) return;
    seekFromPointer(event);
    isSeekingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const progressPath = getCircularProgressPath(progress);
  const progressDotPoint = getCircularPoint(progress);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;

  return (
    <svg
      className="full-player__progress-ring"
      viewBox="0 0 100 100"
      aria-label={`Playback progress ${Math.round(progress * 100)}%`}
      role="slider"
      tabIndex="0"
      aria-valuemin="0"
      aria-valuemax={Math.round(safeDuration)}
      aria-valuenow={Math.round(progress * safeDuration)}
    >
      <circle className="progress-base-circle" cx={PLAYER_RING_CENTER} cy={PLAYER_RING_CENTER} r={PLAYER_RING_RADIUS} />
      <path
        className="progress-active-circle"
        d={progressPath}
        strokeOpacity={progress > 0.001 ? 1 : 0}
      />
      <circle className="full-player__start-dot" cx={PLAYER_RING_CENTER} cy={PLAYER_RING_CENTER - PLAYER_RING_RADIUS} r="1.2" aria-hidden="true" />
      <circle
        className="full-player__progress-dot"
        cx={progressDotPoint.x}
        cy={progressDotPoint.y}
        r="1.25"
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
      {momentMarkers.map((moment) => (
        <circle
          className="full-player__moment-dot"
          key={moment.id}
          cx={moment.point.x}
          cy={moment.point.y}
          r="0.85"
          aria-hidden="true"
        />
      ))}
      <circle
        className="full-player__seek-hit"
        cx={PLAYER_RING_CENTER}
        cy={PLAYER_RING_CENTER}
        r={PLAYER_RING_RADIUS}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
    </svg>
  );
}

function GlobalPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const previousPathRef = useRef(location.pathname);
  const pendingSeekTimeRef = useRef(null);
  const audioRef = useRef(null);
  const commentPanelRef = useRef(null);
  const trackTransitionTimerRef = useRef(null);
  const [isDesktopRing, setIsDesktopRing] = useState(() => window.matchMedia("(min-width: 901px)").matches);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioMetadataReady, setIsAudioMetadataReady] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isFullPlayerExpanded, setIsFullPlayerExpanded] = useState(false);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(72);
  const [sidePanelMode, setSidePanelMode] = useState("playlist");
  const [momentInput, setMomentInput] = useState("");
  const [hoveredCommentPoint, setHoveredCommentPoint] = useState(null);
  const [selectedCommentPoint, setSelectedCommentPoint] = useState(null);
  const [trackTransition, setTrackTransition] = useState({ phase: "idle", direction: "next" });
  const [moments, setMoments] = useState([
    {
      id: "moment-01",
      profile: "/images/profile-01.png",
      name: "오늘은까눌레",
      time: "0:42",
      text: "이 부분에서 오늘 하루가 살짝 정리되는 느낌이에요.",
      peopleCount: 4,
      profiles: [
        "/images/profile-01.png",
        "/images/profile-02.png",
        "/images/profile-03.png",
        "/images/profile-04.png",
      ],
      comments: [
        { name: "오늘은까눌레", profile: "/images/profile-01.png", text: "이 부분에서 갑자기 마음이 벅차올라요." },
        { name: "bluehour", profile: "/images/profile-02.png", text: "노을 보면서 들으면 정말 좋아요." },
        { name: "roomtone", profile: "/images/profile-03.png", text: "여기부터 곡의 분위기가 완전히 달라지는 느낌." },
        { name: "hostless", profile: "/images/profile-04.png", text: "이 순간을 오래 기억하고 싶어요." },
      ],
    },
    {
      id: "moment-02",
      profile: "/images/profile-04.png",
      name: "hostless",
      time: "1:18",
      text: "비 오는 퇴근길에 들으면 창밖 색이 더 깊어져요.",
      peopleCount: 3,
      profiles: [
        "/images/profile-04.png",
        "/images/profile-05.png",
        "/images/profile-06.png",
      ],
      comments: [
        { name: "roomtone", profile: "/images/profile-04.png", text: "이어폰으로 들으면 공간감이 더 크게 느껴져요." },
        { name: "bluehour", profile: "/images/profile-05.png", text: "퇴근길에 가장 좋아하는 구간이에요." },
        { name: "hostless", profile: "/images/profile-06.png", text: "비가 오는 날이면 꼭 다시 찾게 돼요." },
      ],
    },
    {
      id: "moment-03",
      profile: "/images/profile-07.png",
      name: "만두두왕",
      time: "2:09",
      text: "후렴 직전의 숨 고르는 순간이 제일 좋아요.",
      peopleCount: 6,
      profiles: [
        "/images/profile-07.png",
        "/images/profile-08.png",
        "/images/profile-02.png",
        "/images/profile-03.png",
        "/images/profile-05.png",
        "/images/profile-06.png",
      ],
      comments: [
        { name: "만두두왕", profile: "/images/profile-07.png", text: "마지막으로 갈수록 감정이 깊어져요." },
        { name: "softstatic", profile: "/images/profile-08.png", text: "계속 반복해서 듣게 되는 부분이에요." },
        { name: "bluehour", profile: "/images/profile-02.png", text: "후렴 직전의 여백이 정말 좋아요." },
        { name: "roomtone", profile: "/images/profile-03.png", text: "여기서 곡의 온도가 달라지는 것 같아요." },
        { name: "hostless", profile: "/images/profile-05.png", text: "밤에 들으면 더 깊게 남아요." },
        { name: "mellowday", profile: "/images/profile-06.png", text: "마지막 음까지 놓치고 싶지 않아요." },
      ],
    },
  ]);
  const selectedSong = currentTrack;

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 901px)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const syncDesktopRing = () => {
      setIsDesktopRing(desktopQuery.matches);
      setIsMobileViewport(mobileQuery.matches);
      if (!mobileQuery.matches) setIsMobilePanelOpen(false);
    };

    syncDesktopRing();
    desktopQuery.addEventListener("change", syncDesktopRing);
    mobileQuery.addEventListener("change", syncDesktopRing);
    return () => {
      desktopQuery.removeEventListener("change", syncDesktopRing);
      mobileQuery.removeEventListener("change", syncDesktopRing);
    };
  }, []);

  useEffect(() => () => {
    window.clearTimeout(trackTransitionTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isDesktopRing || !selectedCommentPoint) return undefined;

    const closeOnOutsidePointer = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (commentPanelRef.current?.contains(target)) return;
      if (target.closest(".full-player__moment-trigger")) return;
      setSelectedCommentPoint(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedCommentPoint(null);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isDesktopRing, selectedCommentPoint]);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    setIsFullPlayerOpen(false);
    setIsFullPlayerExpanded(false);
    setIsMobilePanelOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeFullPlayer = () => {
      setIsFullPlayerOpen(false);
      setIsFullPlayerExpanded(false);
      setIsMobilePanelOpen(false);
    };

    window.addEventListener("tempy-close-full-player", closeFullPlayer);
    return () => window.removeEventListener("tempy-close-full-player", closeFullPlayer);
  }, []);

  useEffect(() => {
    if (!isMobileViewport || !isFullPlayerOpen) return undefined;

    const pageScrollY = window.scrollY;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${pageScrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      window.scrollTo(0, pageScrollY);
    };
  }, [isFullPlayerOpen, isMobileViewport]);

  useEffect(() => {
    const handlePlayRequest = (event) => {
      const requestedTrackInput = event.detail?.track || event.detail;
      const requestedTrack = normalizeMusicItem(requestedTrackInput);
      if (!requestedTrack) return;
      setCurrentTrack(requestedTrack);
      setIsShuffleEnabled(Boolean(event.detail?.shuffle));
      setIsPlaying(Boolean(requestedTrack.audioPreview));
      setCurrentTime(0);
      setDuration(0);
      setIsAudioMetadataReady(false);
      setIsSaved(false);
      setIsMobilePanelOpen(false);
      setHoveredCommentPoint(null);
      setSelectedCommentPoint(null);
    };

    window.addEventListener("tempy-play-track", handlePlayRequest);
    return () => window.removeEventListener("tempy-play-track", handlePlayRequest);
  }, []);

  useEffect(() => {
    const handleShuffleRequest = (event) => {
      setIsShuffleEnabled(Boolean(event.detail?.enabled));
    };

    window.addEventListener("tempy-set-shuffle", handleShuffleRequest);
    return () => window.removeEventListener("tempy-set-shuffle", handleShuffleRequest);
  }, []);

  useEffect(() => {
    const handleSeekRequest = (event) => {
      const trackInput = event.detail?.track;
      const track = normalizeMusicItem(trackInput);
      const requestedTime = Number(event.detail?.startTime);
      if (!track || !Number.isFinite(requestedTime)) return;

      // iTunes previews are standalone 30-second clips, so a full-track
      // editorial timestamp cannot be mapped reliably into the preview.
      const nextTime = 0;
      pendingSeekTimeRef.current = track.audioPreview ? 0 : null;
      setCurrentTrack(track);
      setDuration(0);
      setIsAudioMetadataReady(false);
      setCurrentTime(nextTime);
      setIsPlaying(Boolean(track.audioPreview));
      setIsSaved(false);
      setHoveredCommentPoint(null);
      setSelectedCommentPoint(null);

      const audio = audioRef.current;
      if (audio && track.audioPreview && audio.readyState >= 1) {
        audio.currentTime = nextTime;
        audio.play().catch(() => setIsPlaying(false));
      }
    };

    window.addEventListener("tempy-seek-track", handleSeekRequest);
    return () => window.removeEventListener("tempy-seek-track", handleSeekRequest);
  }, []);

  useEffect(() => {
    const handlePlaybackToggle = () => {
      setIsPlaying((currentlyPlaying) => selectedSong?.audioPreview ? !currentlyPlaying : false);
    };

    window.addEventListener("tempy-toggle-playback", handlePlaybackToggle);
    return () => window.removeEventListener("tempy-toggle-playback", handlePlaybackToggle);
  }, [selectedSong?.audioPreview]);

  useEffect(() => {
    if (!currentTrack) return;
    window.dispatchEvent(new CustomEvent("tempy-player-progress", {
      detail: {
        trackId: currentTrack.id,
        currentTime,
        isPlaying,
      },
    }));
  }, [currentTime, currentTrack, isPlaying]);

  useEffect(() => {
    const handleGlobalClick = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-now-player-control]")) return;
      if (target.closest("[data-tempy-navigation-control]")) return;

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
    if (!audio) return undefined;

    if (!selectedSong?.audioPreview) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return undefined;
    }

    audio.pause();
    audio.src = selectedSong.audioPreview;
    audio.load();
    audio.currentTime = 0;
    return undefined;
  }, [selectedSong?.audioPreview]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedSong?.audioPreview) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, selectedSong?.audioPreview]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = Math.floor(safeSeconds % 60);
    return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
  };

  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.currentTime)) return;
    setCurrentTime(audio.currentTime);
  };

  const handleAudioLoaded = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const loadedDuration = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : 0;
    if (!loadedDuration) return;
    setDuration(loadedDuration);

    if (pendingSeekTimeRef.current !== null) {
      const nextTime = Math.min(loadedDuration, pendingSeekTimeRef.current);
      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
      pendingSeekTimeRef.current = null;
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleAudioCanPlay = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    setDuration(audio.duration);
    setIsAudioMetadataReady(true);
  };

  const handleAudioEnded = () => {
    const nextTrack = getNextPlayableCatalogTrack(currentTrack?.id);
    if (!nextTrack) {
      setIsPlaying(false);
      return;
    }
    transitionToTrack(nextTrack, "next", true);
  };

  const handleClosePlayer = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    if (currentTrack) {
      window.dispatchEvent(new CustomEvent("tempy-player-progress", {
        detail: { trackId: currentTrack.id, currentTime, isPlaying: false },
      }));
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setIsShuffleEnabled(false);
    setCurrentTime(0);
    setIsFullPlayerOpen(false);
    setIsFullPlayerExpanded(false);
    setIsMobilePanelOpen(false);
    setIsRecording(false);
    setHoveredCommentPoint(null);
    setSelectedCommentPoint(null);
  };

  if (!currentTrack) return <audio ref={audioRef} />;

  const playerPlaylist = musicCatalogTracks;

  const currentTrackIndex = Math.max(
    0,
    playerPlaylist.findIndex((track) => track.id === currentTrack.id),
  );

  const selectTrack = (track, shouldPlay = isPlaying) => {
    const selectedTrack = normalizeMusicItem(track);
    if (!selectedTrack) return;
    setCurrentTrack(selectedTrack);
    setCurrentTime(0);
    setDuration(0);
    setIsAudioMetadataReady(false);
    setIsPlaying(Boolean(shouldPlay && selectedTrack.audioPreview));
    setIsSaved(false);
    setHoveredCommentPoint(null);
    setSelectedCommentPoint(null);
  };

  const transitionToTrack = (track, direction, shouldPlay = isPlaying) => {
    const isPhone = window.matchMedia("(max-width: 393px)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isPhone || reduceMotion) {
      selectTrack(track, shouldPlay);
      return;
    }
    if (trackTransition.phase !== "idle") return;

    if (track.cover || track.image) {
      const preload = new Image();
      preload.src = track.cover || track.image;
    }

    setTrackTransition({ phase: "exit", direction });
    trackTransitionTimerRef.current = window.setTimeout(() => {
      selectTrack(track, shouldPlay);
      setTrackTransition({ phase: "enter", direction });
      trackTransitionTimerRef.current = window.setTimeout(() => {
        setTrackTransition({ phase: "idle", direction });
      }, 190);
    }, 150);
  };

  const handlePreviousTrack = () => {
    if (isShuffleEnabled) {
      handleRandomTrack();
      return;
    }
    const nextIndex = (currentTrackIndex - 1 + playerPlaylist.length) % playerPlaylist.length;
    transitionToTrack(playerPlaylist[nextIndex], "previous", isPlaying);
  };

  const handleNextTrack = () => {
    if (isShuffleEnabled) {
      handleRandomTrack();
      return;
    }
    const nextIndex = (currentTrackIndex + 1) % playerPlaylist.length;
    transitionToTrack(playerPlaylist[nextIndex], "next", isPlaying);
  };

  function handleRandomTrack() {
    if (playerPlaylist.length <= 1) return;
    const candidates = playerPlaylist.filter((track) => track.id !== currentTrack.id);
    const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
    transitionToTrack(randomTrack, "next", true);
  }

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
        peopleCount: 1,
        profiles: ["/images/profile-03.png"],
        comments: [{ name: "you", profile: "/images/profile-03.png", text }],
      },
    ]);
    setMomentInput("");
  };

  const vinylStyle = { "--global-player-cover": `url(${currentTrack.cover})` };
  const safeDuration = isAudioMetadataReady && Number.isFinite(duration) && duration > 0 ? duration : 1;
  const isPreviewUnavailable = !selectedSong.audioPreview;
  const momentMarkers = moments.map((moment) => ({
    ...moment,
    point: getCircularPoint(parseTrackDuration(moment.time) / safeDuration),
  }));
  const hoveredMoment = isDesktopRing
    ? momentMarkers.find((moment) => moment.id === hoveredCommentPoint)
    : null;
  const selectedMoment = isDesktopRing
    ? momentMarkers.find((moment) => moment.id === selectedCommentPoint)
    : null;
  const fullPlayerClassName = [
    "full-player",
    isPlaying ? "full-player--playing" : "",
    isFullPlayerExpanded ? "full-player--expanded" : "",
    isMobileViewport && isMobilePanelOpen ? "full-player--mobile-panel-open" : "",
    trackTransition.phase !== "idle" ? `full-player--track-${trackTransition.phase}` : "",
    `full-player--track-${trackTransition.direction}`,
  ].filter(Boolean).join(" ");

  const openMobilePanel = () => {
    if (!isMobileViewport) return;
    setSidePanelMode("playlist");
    setIsMobilePanelOpen(true);
  };

  const handleDiscActivate = (event) => {
    if (!isMobileViewport) return;
    if (event.target.closest?.(".full-player__seek-hit, .full-player__progress-dot")) return;
    openMobilePanel();
  };

  const handleDiscKeyDown = (event) => {
    if (!isMobileViewport || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openMobilePanel();
  };

  const seekToProgress = (progress) => {
    const nextTime = Math.min(safeDuration, Math.max(0, progress * safeDuration));
    const audio = audioRef.current;
    if (audio && selectedSong.audioPreview) {
      audio.currentTime = nextTime;
    }
    setCurrentTime(nextTime);
  };

  const toggleCommentPoint = (event, momentId) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedCommentPoint((selectedId) => selectedId === momentId ? null : momentId);
  };

  const handleCommentPointKeyDown = (event, momentId) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedCommentPoint((selectedId) => selectedId === momentId ? null : momentId);
  };

  return (
    <>
      <audio
        ref={audioRef}
        onLoadedMetadata={handleAudioLoaded}
        onDurationChange={handleAudioLoaded}
        onCanPlay={handleAudioCanPlay}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
        onError={() => {
          setIsPlaying(false);
          setIsAudioMetadataReady(false);
        }}
      />
      {isFullPlayerOpen && (
        <section className={fullPlayerClassName} aria-label="Full music player">
          <div className="full-player__stage">
            <button
              className="full-player__home"
              type="button"
              aria-label="Go to Home"
              onClick={() => {
                setIsFullPlayerOpen(false);
                setIsFullPlayerExpanded(false);
                setIsMobilePanelOpen(false);
                navigate("/");
              }}
            >
              <img src={logoNav} alt="Tempy!" draggable={false} />
            </button>
            <button
              className="full-player__close"
              type="button"
              aria-label="Back to mini player"
              onClick={() => {
                setIsFullPlayerOpen(false);
                setIsMobilePanelOpen(false);
              }}
            >
              ×
            </button>
            <div className="full-player__disc-area">
              <div className="full-player__disc-wrap">
                <div
                  className="full-player__disc-shell full-player-vinyl"
                  role={isMobileViewport ? "button" : undefined}
                  tabIndex={isMobileViewport ? 0 : undefined}
                  aria-label={isMobileViewport ? "Open track lists" : undefined}
                  onClick={handleDiscActivate}
                  onKeyDown={handleDiscKeyDown}
                >
                  <div className="full-player__disc vinyl-rotating-disc" style={vinylStyle}>
                    <div className="full-player__disc-label">
                      <img src={currentTrack.cover} alt="" draggable={false} />
                    </div>
                  </div>
                  <PlaybackProgressRing
                    key={selectedSong.id}
                    audioRef={audioRef}
                    duration={duration}
                    isPlaying={isPlaying}
                    isReady={isAudioMetadataReady}
                    momentMarkers={momentMarkers}
                    onSeek={seekToProgress}
                  />
                  {isDesktopRing && momentMarkers.map((moment) => {
                    const peopleCount = moment.peopleCount || moment.comments?.length || 1;
                    const profiles = moment.profiles?.length ? moment.profiles : [moment.profile];
                    const horizontalDirection = moment.point.x > 68
                      ? "full-player__moment-anchor--left"
                      : moment.point.x < 32
                        ? "full-player__moment-anchor--right"
                        : "full-player__moment-anchor--center";
                    const verticalDirection = moment.point.y < 24
                      ? "full-player__moment-anchor--below"
                      : "full-player__moment-anchor--above";
                    const isHovered = hoveredMoment?.id === moment.id;

                    return (
                      <div
                        className={`full-player__moment-anchor ${horizontalDirection} ${verticalDirection}`}
                        key={`comment-trigger-${moment.id}`}
                        style={{ left: `${moment.point.x}%`, top: `${moment.point.y}%` }}
                        onMouseEnter={() => setHoveredCommentPoint(moment.id)}
                        onMouseLeave={() => setHoveredCommentPoint((hoveredId) => hoveredId === moment.id ? null : hoveredId)}
                      >
                        <button
                          className="full-player__moment-trigger"
                          type="button"
                          aria-label={`${moment.time}에 남겨진 코멘트 ${peopleCount}개 보기`}
                          aria-expanded={selectedCommentPoint === moment.id}
                          aria-controls="full-player-comment-panel"
                          onFocus={() => setHoveredCommentPoint(moment.id)}
                          onBlur={() => setHoveredCommentPoint((hoveredId) => hoveredId === moment.id ? null : hoveredId)}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={(event) => toggleCommentPoint(event, moment.id)}
                          onKeyDown={(event) => handleCommentPointKeyDown(event, moment.id)}
                        >
                          <span className="full-player__moment-trigger-dot" aria-hidden="true" />
                        </button>

                        {isHovered && (
                          <div className="full-player__moment-summary" role="tooltip">
                            <span className="full-player__moment-summary-profiles">
                              {profiles.slice(0, 3).map((profile, profileIndex) => (
                                <img src={profile} alt="" key={`${moment.id}-profile-${profileIndex}`} draggable={false} />
                              ))}
                            </span>
                            {peopleCount > 3 && (
                              <span className="full-player__moment-summary-count">+{peopleCount - 3}</span>
                            )}
                            <span className="full-player__moment-summary-total">{peopleCount} people</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="full-player__disc-copy">
                    <strong>{currentTrack.title}</strong>
                    <p>{currentTrack.artist}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedMoment && (
              <section
                className="full-player__comment-panel"
                id="full-player-comment-panel"
                key={selectedMoment.id}
                ref={commentPanelRef}
                aria-label={`${selectedMoment.time} time moment comments`}
              >
                <header className="full-player__comment-panel-header">
                  <div>
                    <span>TIME MOMENT</span>
                    <strong>{selectedMoment.time}</strong>
                    <p>{selectedMoment.peopleCount || selectedMoment.comments?.length || 1} PEOPLE LEFT A MOMENT</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close time moment comments"
                    onClick={() => setSelectedCommentPoint(null)}
                  >
                    ×
                  </button>
                </header>

                <div className="full-player__comment-panel-list">
                  {(selectedMoment.comments || [{
                    name: selectedMoment.name,
                    profile: selectedMoment.profile,
                    text: selectedMoment.text,
                  }]).slice(0, 3).map((comment, commentIndex) => (
                    <article className="full-player__comment-card" key={`${selectedMoment.id}-comment-${commentIndex}`}>
                      <img src={comment.profile} alt="" draggable={false} />
                      <div>
                        <header>
                          <strong>{comment.name}</strong>
                          <time>{selectedMoment.time}</time>
                        </header>
                        <p>{comment.text}</p>
                      </div>
                    </article>
                  ))}
                </div>

                {(selectedMoment.peopleCount || selectedMoment.comments?.length || 1) > 3 && (
                  <button
                    className="full-player__comment-panel-more"
                    type="button"
                    onClick={() => {
                      setSidePanelMode("moments");
                      setIsFullPlayerExpanded(false);
                      setSelectedCommentPoint(null);
                    }}
                  >
                    View all {selectedMoment.peopleCount || selectedMoment.comments.length} moments →
                  </button>
                )}
              </section>
            )}

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
                <button className="full-player__previous" type="button" aria-label="Previous track" onClick={handlePreviousTrack} disabled={trackTransition.phase !== "idle"}>
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  className="full-player__play"
                  type="button"
                  aria-label={isPreviewUnavailable ? "Preview unavailable" : isPlaying ? "Pause current track" : "Play current track"}
                  disabled={isPreviewUnavailable}
                  onClick={() => setIsPlaying((playing) => selectedSong.audioPreview ? !playing : false)}
                >
                  <span className="full-player__play-label--desktop" aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                  <span className={`full-player__play-icon full-player__play-icon--play${isPlaying ? "" : " is-visible"}`} aria-hidden="true">▶</span>
                  <span className={`full-player__play-icon full-player__play-icon--pause${isPlaying ? " is-visible" : ""}`} aria-hidden="true">Ⅱ</span>
                </button>
                <button className="full-player__next" type="button" aria-label="Next track" onClick={handleNextTrack} disabled={trackTransition.phase !== "idle"}>
                  <span aria-hidden="true">›</span>
                </button>
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
                {!isMobileViewport ? (
                  <button
                    type="button"
                    aria-label={isFullPlayerExpanded ? "Show side panel" : "Hide side panel"}
                    onClick={() => setIsFullPlayerExpanded((expanded) => !expanded)}
                  >
                    ⛶
                  </button>
                ) : (
                  <button
                    className="full-player__list-trigger"
                    type="button"
                    aria-label="Open track lists"
                    aria-expanded={isMobilePanelOpen}
                    onClick={openMobilePanel}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8 6h12M8 12h12M8 18h12" />
                      <circle cx="4" cy="6" r="1" />
                      <circle cx="4" cy="12" r="1" />
                      <circle cx="4" cy="18" r="1" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside
            className="full-player__side"
            aria-label="Player side panel"
            aria-hidden={isMobileViewport ? !isMobilePanelOpen : undefined}
          >
            {isMobileViewport && (
              <button
                className="full-player__mobile-panel-close"
                type="button"
                aria-label="Close track lists"
                onClick={() => setIsMobilePanelOpen(false)}
              >
                ×
              </button>
            )}
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
                <div className="full-player__track-list" aria-label={`${musicCatalogTracks.length} catalog tracks`}>
                  {musicCatalogTracks.map((track, index) => {
                    const isCurrentTrack = track.id === selectedSong.id;
                    const isMockTrack = Boolean(track.isMockTrack || track.isMock);
                    const hasPreview = Boolean(track.audioPreview);
                    const rowClassName = [
                      "full-player__track-row",
                      isCurrentTrack ? "is-current" : "",
                      !hasPreview ? "is-unavailable" : "",
                      isMockTrack ? "is-mock" : "",
                    ].filter(Boolean).join(" ");

                    return (
                      <button
                        className={rowClassName}
                        type="button"
                        key={track.id}
                        aria-current={isCurrentTrack ? "true" : undefined}
                        aria-label={`${track.title} by ${track.artist}${hasPreview ? " 재생" : " Preview unavailable"}`}
                        onClick={() => selectTrack(track, true)}
                      >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <img src={track.cover || track.image} alt="" draggable={false} />
                        <span>
                          <strong>{track.title}</strong>
                          <small>{track.artist}</small>
                        </span>
                        <span className="full-player__track-status">
                          <time>{track.duration}</time>
                          {!hasPreview && <small>No Preview</small>}
                          {isMockTrack && <small>Mock</small>}
                        </span>
                      </button>
                    );
                  })}
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
              <span>{isPreviewUnavailable ? "PREVIEW UNAVAILABLE" : isPlaying ? "NOW PLAYING" : "PREVIEWING"}</span>
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
                aria-label={isPreviewUnavailable ? "Preview unavailable" : isPlaying ? "Pause current track" : "Play current track"}
                disabled={isPreviewUnavailable}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsPlaying((playing) => selectedSong.audioPreview ? !playing : false);
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
        <Route path="/discover/track-trace/detail/:trackId" element={<TrackTraceDetail />} />
        <Route path="/discover/track-trace/album" element={<TrackTraceAlbum />} />
        <Route path="/discover/track-trace/album/:albumId" element={<TrackTraceAlbum />} />
        <Route path="/artist/:artistId" element={<ArtistProfile />} />
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
