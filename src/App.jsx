import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import logoNav from "./assets/Tempy!_logo_nav.svg";
import { HeartIcon, PlayIcon, ShuffleIcon } from "./components/TempyIcons";
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
          <NavLink to="/now">
            <span className="top-nav__label"><span className="top-nav__label-current">Now</span><span className="top-nav__label-next" aria-hidden="true">Now</span></span>
          </NavLink>
          <NavLink to="/discover">
            <span className="top-nav__label"><span className="top-nav__label-current">Discover</span><span className="top-nav__label-next" aria-hidden="true">Discover</span></span>
          </NavLink>
          <NavLink to="/curator">
            <span className="top-nav__label"><span className="top-nav__label-current">Curator</span><span className="top-nav__label-next" aria-hidden="true">Curator</span></span>
          </NavLink>
          <NavLink to="/create">
            <span className="top-nav__label"><span className="top-nav__label-current">Create</span><span className="top-nav__label-next" aria-hidden="true">Create</span></span>
          </NavLink>
          <NavLink to="/archive">
            <span className="top-nav__label"><span className="top-nav__label-current">Archive</span><span className="top-nav__label-next" aria-hidden="true">Archive</span></span>
          </NavLink>
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
const MOMENT_CLUSTER_WINDOW_SECONDS = 3;
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

const formatMomentTime = (seconds) => {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = Math.floor(safeSeconds % 60);
  return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
};

const MOCK_MOMENT_USERS = [
  ["오늘은까눌레", "/images/profile-01.png"],
  ["bluehour", "/images/profile-02.png"],
  ["roomtone", "/images/profile-03.png"],
  ["hostless", "/images/profile-04.png"],
  ["mellowday", "/images/profile-05.png"],
  ["softstatic", "/images/profile-06.png"],
  ["만두두왕", "/images/profile-07.png"],
  ["moonletter", "/images/profile-08.png"],
];

const MOCK_MOMENT_COMMENTS = [
  "첫 소절부터 공기가 부드럽게 열리는 느낌이에요.",
  "해 질 무렵에 들으면 더 잘 어울리는 구간 같아요.",
  "여기서 악기 사이의 여백이 갑자기 선명해져요.",
  "이어폰으로 들으면 작은 숨소리까지 오래 남아요.",
  "오늘 지나온 장면들이 천천히 겹쳐지는 것 같아요.",
  "이 리듬이 시작되면 걷는 속도도 자연스럽게 달라져요.",
  "후렴 직전의 잠깐 멈추는 감각이 가장 좋아요.",
  "비 오는 창밖을 보고 있을 때 떠오를 것 같은 순간이에요.",
  "목소리가 가까워지는 이 부분을 자꾸 다시 듣게 돼요.",
  "마지막 음이 사라지기 전의 온도를 기억하고 싶어요.",
  "밤이 조금 깊어진 뒤에 들으면 더 크게 와닿아요.",
  "갑자기 오래된 사진 한 장이 떠오르는 구간이에요.",
];

const createMomentSeed = (value) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededMomentRandom = (initialSeed) => {
  let seed = initialSeed;
  return () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const createMockTrackMoments = (trackId) => {
  const random = createSeededMomentRandom(createMomentSeed(trackId));
  const clusterCount = 3 + Math.floor(random() * 3);
  const generatedMoments = [];

  for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex += 1) {
    const interval = clusterCount === 1 ? 0 : 24 / (clusterCount - 1);
    const centerTimestamp = 4 + (clusterIndex * interval) + ((random() - 0.5) * 1.4);
    const peopleCount = 1 + Math.floor(random() * 5);

    for (let personIndex = 0; personIndex < peopleCount; personIndex += 1) {
      const timestampOffset = personIndex === 0 ? 0 : (random() - 0.5) * 2.4;
      const timestamp = Math.min(29.5, Math.max(1.5, centerTimestamp + timestampOffset));
      const userIndex = Math.floor(random() * MOCK_MOMENT_USERS.length);
      const commentIndex = (
        Math.floor(random() * MOCK_MOMENT_COMMENTS.length)
        + clusterIndex
        + personIndex
      ) % MOCK_MOMENT_COMMENTS.length;
      const [user, profileImage] = MOCK_MOMENT_USERS[userIndex];

      generatedMoments.push({
        id: `${trackId}-moment-${clusterIndex + 1}-${personIndex + 1}`,
        trackId,
        timestamp,
        user,
        profileImage,
        comment: MOCK_MOMENT_COMMENTS[commentIndex],
      });
    }
  }

  return generatedMoments;
};

const clusterTrackMoments = (moments, duration) => {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 30;
  const sortedMoments = moments
    .filter((moment) => Number.isFinite(moment.timestamp))
    .map((moment) => ({ ...moment, timestamp: Math.min(safeDuration, Math.max(0, moment.timestamp)) }))
    .sort((left, right) => left.timestamp - right.timestamp);

  const clusters = [];
  sortedMoments.forEach((moment) => {
    const activeCluster = clusters.at(-1);
    if (activeCluster && moment.timestamp - activeCluster.startTimestamp <= MOMENT_CLUSTER_WINDOW_SECONDS) {
      activeCluster.comments.push(moment);
      activeCluster.totalTimestamp += moment.timestamp;
      return;
    }

    clusters.push({
      id: `moment-cluster-${moment.id}`,
      startTimestamp: moment.timestamp,
      totalTimestamp: moment.timestamp,
      comments: [moment],
    });
  });

  return clusters.map((cluster) => {
    const timestamp = cluster.totalTimestamp / cluster.comments.length;
    const firstComment = cluster.comments[0];
    return {
      id: cluster.id,
      trackId: firstComment.trackId,
      timestamp,
      time: formatMomentTime(timestamp),
      comments: cluster.comments,
      peopleCount: cluster.comments.length,
      profiles: cluster.comments.map((comment) => comment.profileImage),
      point: getCircularPoint(timestamp / safeDuration),
    };
  });
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

function PlaybackProgressRing({
  audioRef,
  duration,
  isPlaying,
  isReady,
  momentMarkers,
  onScrubStart,
  onSeek,
}) {
  const isScrubbingRef = useRef(false);
  const scrubProgressRef = useRef(0);
  const animationFrameRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncProgress = () => {
      if (isScrubbingRef.current) return;
      const liveDuration = audio.duration;
      const liveTime = audio.currentTime;
      const nextProgress = Number.isFinite(liveDuration) && liveDuration > 0 && Number.isFinite(liveTime)
        ? Math.min(1, Math.max(0, liveTime / liveDuration))
        : 0;
      setProgress(nextProgress);
    };

    const stopProgressLoop = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };

    const renderProgress = () => {
      syncProgress();
      const shouldKeepAnimating = !audio.ended && !audio.paused;
      if (shouldKeepAnimating) {
        animationFrameRef.current = window.requestAnimationFrame(renderProgress);
      } else {
        animationFrameRef.current = null;
      }
    };

    const startProgressLoop = () => {
      syncProgress();
      const shouldAnimate = !audio.ended && !audio.paused;
      if (animationFrameRef.current === null && shouldAnimate) {
        animationFrameRef.current = window.requestAnimationFrame(renderProgress);
      }
    };

    const finishSeek = () => {
      syncProgress();
      startProgressLoop();
    };

    const stopAndSyncProgress = () => {
      stopProgressLoop();
      syncProgress();
    };
    const resetEndedProgress = () => {
      stopProgressLoop();
      setProgress(0);
    };

    audio.addEventListener("playing", startProgressLoop);
    audio.addEventListener("pause", stopAndSyncProgress);
    audio.addEventListener("seeking", syncProgress);
    audio.addEventListener("seeked", finishSeek);
    audio.addEventListener("timeupdate", syncProgress);
    audio.addEventListener("loadedmetadata", syncProgress);
    audio.addEventListener("durationchange", syncProgress);
    audio.addEventListener("ended", resetEndedProgress);
    audio.addEventListener("emptied", resetEndedProgress);

    syncProgress();
    if (isPlaying && isReady && !audio.paused) startProgressLoop();

    return () => {
      stopProgressLoop();
      audio.removeEventListener("playing", startProgressLoop);
      audio.removeEventListener("pause", stopAndSyncProgress);
      audio.removeEventListener("seeking", syncProgress);
      audio.removeEventListener("seeked", finishSeek);
      audio.removeEventListener("timeupdate", syncProgress);
      audio.removeEventListener("loadedmetadata", syncProgress);
      audio.removeEventListener("durationchange", syncProgress);
      audio.removeEventListener("ended", resetEndedProgress);
      audio.removeEventListener("emptied", resetEndedProgress);
    };
  }, [audioRef, isPlaying, isReady]);

  const getProgressFromPointer = (event) => {
    const nextProgress = getCircularProgressFromPointer(event, event.currentTarget);
    return Math.min(1, Math.max(0, nextProgress));
  };

  const previewFromPointer = (event) => {
    const clampedProgress = getProgressFromPointer(event);
    scrubProgressRef.current = clampedProgress;
    setProgress(clampedProgress);
    return clampedProgress;
  };

  const handlePointerDown = (event) => {
    if (!isReady) return;
    event.preventDefault();
    isScrubbingRef.current = true;
    onScrubStart();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    previewFromPointer(event);
  };

  const handlePointerMove = (event) => {
    if (!isScrubbingRef.current) return;
    previewFromPointer(event);
  };

  const handlePointerEnd = (event) => {
    if (!isScrubbingRef.current) return;
    const finalProgress = event.type === "pointercancel"
      ? scrubProgressRef.current
      : previewFromPointer(event);
    isScrubbingRef.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    onSeek(finalProgress);
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
      {momentMarkers.map((moment) => (
        <circle
          className="full-player__moment-dot"
          key={moment.id}
          cx={moment.point.x}
          cy={moment.point.y}
          r="0.72"
          aria-hidden="true"
        />
      ))}
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
  const audioDeckRefs = useRef([null, null]);
  const activeAudioDeckRef = useRef(0);
  const preloadedTrackRef = useRef(null);
  const promotedTrackIdRef = useRef(null);
  const previewWarmupsRef = useRef(new Map());
  const isPlaybackScrubbingRef = useRef(false);
  const commentPanelRef = useRef(null);
  const currentTrackRef = useRef(null);
  const [isDesktopRing, setIsDesktopRing] = useState(() => window.matchMedia("(min-width: 901px)").matches);
  const [isMobileViewport, setIsMobileViewport] = useState(() => window.matchMedia("(max-width: 768px)").matches);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaybackRequested, setIsPlaybackRequested] = useState(false);
  const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioMetadataReady, setIsAudioMetadataReady] = useState(false);
  const [playbackSourceTrackId, setPlaybackSourceTrackId] = useState(null);
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
  const setFirstAudioDeckRef = useCallback((audio) => {
    audioDeckRefs.current[0] = audio;
    if (activeAudioDeckRef.current === 0) audioRef.current = audio;
  }, []);
  const setSecondAudioDeckRef = useCallback((audio) => {
    audioDeckRefs.current[1] = audio;
    if (activeAudioDeckRef.current === 1) audioRef.current = audio;
  }, []);
  const [momentsByTrack, setMomentsByTrack] = useState({});
  const selectedSong = currentTrack;
  currentTrackRef.current = currentTrack;
  const togglePlayback = useCallback(() => {
    setIsPlaybackRequested((requested) => selectedSong?.audioPreview ? !requested : false);
  }, [selectedSong?.audioPreview]);
  const warmPreviewResource = useCallback((previewUrl) => {
    if (!previewUrl) return Promise.resolve(null);
    const cachedWarmup = previewWarmupsRef.current.get(previewUrl);
    if (cachedWarmup) return cachedWarmup.request;

    const controller = new AbortController();
    const warmup = { controller, objectUrl: null, request: null };
    const request = window.fetch(previewUrl, {
      cache: "force-cache",
      mode: "cors",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Preview request failed: ${response.status}`);
        return response.blob();
      })
      .then((blob) => {
        if (controller.signal.aborted) return previewUrl;
        warmup.objectUrl = URL.createObjectURL(blob);
        return warmup.objectUrl;
      })
      .catch(() => previewUrl);

    warmup.request = request;
    previewWarmupsRef.current.set(previewUrl, warmup);
    return request;
  }, []);

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
    previewWarmupsRef.current.forEach(({ controller, objectUrl }) => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });
    previewWarmupsRef.current.clear();
    audioDeckRefs.current.forEach((audio) => audio?.pause());
  }, []);

  useEffect(() => {
    const isPlayerBarOpen = Boolean(currentTrack && !isFullPlayerOpen);
    document.documentElement.classList.toggle("tempy-player-bar-open", isPlayerBarOpen);
    window.dispatchEvent(new CustomEvent("tempy-player-visibility", {
      detail: { isOpen: isPlayerBarOpen },
    }));
  }, [currentTrack, isFullPlayerOpen]);

  useEffect(() => () => {
    document.documentElement.classList.remove("tempy-player-bar-open");
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
    if (!isDesktopRing || !hoveredCommentPoint) return undefined;

    const frameId = window.requestAnimationFrame(() => {
      const preview = document.querySelector(".full-player__moment-summary");
      if (!(preview instanceof HTMLElement)) return;

      const previewRect = preview.getBoundingClientRect();
      const headerRect = document.querySelector(".header")?.getBoundingClientRect();
      const sidePanelRect = document.querySelector(".full-player__side")?.getBoundingClientRect();
      const safeInset = 12;
      const safeTop = Math.max(safeInset, (headerRect?.bottom || 0) + safeInset);
      const safeRight = sidePanelRect && sidePanelRect.left > 0
        ? Math.min(window.innerWidth - safeInset, sidePanelRect.left - safeInset)
        : window.innerWidth - safeInset;
      const safeBottom = window.innerHeight - safeInset;
      let correctionX = 0;
      let correctionY = 0;

      if (previewRect.left < safeInset) correctionX = safeInset - previewRect.left;
      else if (previewRect.right > safeRight) correctionX = safeRight - previewRect.right;

      if (previewRect.top < safeTop) correctionY = safeTop - previewRect.top;
      else if (previewRect.bottom > safeBottom) correctionY = safeBottom - previewRect.bottom;

      preview.style.translate = `${correctionX}px ${correctionY}px`;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [hoveredCommentPoint, isDesktopRing]);

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
    if (!isFullPlayerOpen) return undefined;

    const scrollingElement = document.scrollingElement || document.documentElement;
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const pageScrollX = scrollingElement.scrollLeft;
    const pageScrollY = scrollingElement.scrollTop;
    const scrollLockTargets = [...new Set([scrollingElement, bodyElement])];
    const lockProperties = ["overflow", "overscroll-behavior"];
    const previousLockStyles = scrollLockTargets.map((element) => ({
      element,
      properties: lockProperties.map((property) => ({
        property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property),
      })),
    }));
    const previousBodyPosition = bodyElement.style.position;
    const previousBodyTop = bodyElement.style.top;
    const previousBodyLeft = bodyElement.style.left;
    const previousBodyWidth = bodyElement.style.width;
    const previousBodyPaddingRight = bodyElement.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(bodyElement).paddingRight) || 0;

    scrollLockTargets.forEach((element) => {
      element.style.setProperty("overflow", "hidden", "important");
      element.style.setProperty("overscroll-behavior", "none");
    });
    bodyElement.style.position = "fixed";
    bodyElement.style.top = `-${pageScrollY}px`;
    bodyElement.style.left = `-${pageScrollX}px`;
    bodyElement.style.width = "100%";
    if (scrollbarWidth > 0) {
      bodyElement.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    }

    return () => {
      previousLockStyles.forEach(({ element, properties }) => {
        properties.forEach(({ property, value, priority }) => {
          if (value) element.style.setProperty(property, value, priority);
          else element.style.removeProperty(property);
        });
      });
      bodyElement.style.position = previousBodyPosition;
      bodyElement.style.top = previousBodyTop;
      bodyElement.style.left = previousBodyLeft;
      bodyElement.style.width = previousBodyWidth;
      bodyElement.style.paddingRight = previousBodyPaddingRight;

      const previousScrollBehavior = htmlElement.style.getPropertyValue("scroll-behavior");
      const previousScrollBehaviorPriority = htmlElement.style.getPropertyPriority("scroll-behavior");
      htmlElement.style.setProperty("scroll-behavior", "auto", "important");
      window.scrollTo(pageScrollX, pageScrollY);
      if (previousScrollBehavior) {
        htmlElement.style.setProperty(
          "scroll-behavior",
          previousScrollBehavior,
          previousScrollBehaviorPriority,
        );
      } else {
        htmlElement.style.removeProperty("scroll-behavior");
      }
    };
  }, [isFullPlayerOpen]);

  useEffect(() => {
    const handlePlayRequest = (event) => {
      const requestedTrackInput = event.detail?.track || event.detail;
      const requestedTrack = normalizeMusicItem(requestedTrackInput);
      if (!requestedTrack || requestedTrack.id === currentTrackRef.current?.id) return;
      currentTrackRef.current = requestedTrack;
      setCurrentTrack(requestedTrack);
      setIsShuffleEnabled(Boolean(event.detail?.shuffle));
      setIsPlaybackRequested(Boolean(requestedTrack.audioPreview));
      setIsPlaying(false);
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
      setIsPlaybackRequested(Boolean(track.audioPreview));
      setIsPlaying(false);
      setIsSaved(false);
      setHoveredCommentPoint(null);
      setSelectedCommentPoint(null);

    };

    window.addEventListener("tempy-seek-track", handleSeekRequest);
    return () => window.removeEventListener("tempy-seek-track", handleSeekRequest);
  }, []);

  useEffect(() => {
    window.addEventListener("tempy-toggle-playback", togglePlayback);
    return () => window.removeEventListener("tempy-toggle-playback", togglePlayback);
  }, [togglePlayback]);

  useEffect(() => {
    if (!isFullPlayerOpen || !selectedSong?.audioPreview) return undefined;

    const handleSpaceShortcut = (event) => {
      if ((event.code !== "Space" && event.key !== " ") || event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement) {
        const isEditable = target.isContentEditable
          || Boolean(target.closest("input, textarea, select, button, [contenteditable]:not([contenteditable='false'])"));
        if (isEditable) return;
      }
      event.preventDefault();
      togglePlayback();
    };

    window.addEventListener("keydown", handleSpaceShortcut);
    return () => window.removeEventListener("keydown", handleSpaceShortcut);
  }, [isFullPlayerOpen, selectedSong?.audioPreview, togglePlayback]);

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
      const isMobileBlindHintTap = Boolean(
        playable?.matches(".archive-blind-page__bar")
        && playable.closest(".archive-blind-page:not(.archive-blind-page--revealed)")
        && window.matchMedia("(max-width: 768px)").matches
      );

      if (
        !playable
        || isMobileBlindHintTap
        || (action && !looksLikePlayAction && !target.closest("[data-tempy-playable]"))
      ) return;

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
    let cancelled = false;

    isPlaybackScrubbingRef.current = false;
    setPlaybackSourceTrackId(null);

    if (!selectedSong?.audioPreview) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return undefined;
    }

    const nextPlayableTrack = getNextPlayableCatalogTrack(selectedSong.id);
    const retainedPreviewUrls = new Set([
      selectedSong.audioPreview,
      nextPlayableTrack?.audioPreview,
    ].filter(Boolean));
    previewWarmupsRef.current.forEach((warmup, previewUrl) => {
      if (retainedPreviewUrls.has(previewUrl)) return;
      warmup.controller.abort();
      if (warmup.objectUrl) URL.revokeObjectURL(warmup.objectUrl);
      previewWarmupsRef.current.delete(previewUrl);
    });

    warmPreviewResource(selectedSong.audioPreview);

    if (promotedTrackIdRef.current === selectedSong.id) {
      promotedTrackIdRef.current = null;
      const promotedDuration = Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : 0;
      setDuration(promotedDuration);
      setIsAudioMetadataReady(promotedDuration > 0 && audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
      setPlaybackSourceTrackId(selectedSong.id);
      return undefined;
    }

    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    const trackId = selectedSong.id;
    warmPreviewResource(selectedSong.audioPreview).then((playbackUrl) => {
      if (
        cancelled
        || !playbackUrl
        || currentTrackRef.current?.id !== trackId
        || audioRef.current !== audio
      ) return;
      audio.src = playbackUrl;
      audio.load();
      audio.currentTime = 0;
      setPlaybackSourceTrackId(trackId);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedSong?.audioPreview, selectedSong?.id, warmPreviewResource]);

  useEffect(() => {
    const audio = audioRef.current;
    if (
      !audio
      || !selectedSong?.audioPreview
      || playbackSourceTrackId !== selectedSong.id
    ) return;

    if (isPlaybackRequested) {
      if (audio.paused) {
        audio.play().catch(() => {
          setIsPlaybackRequested(false);
          setIsPlaying(false);
        });
      }
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [isPlaybackRequested, playbackSourceTrackId, selectedSong?.audioPreview, selectedSong?.id]);

  useEffect(() => {
    if (!selectedSong?.audioPreview) {
      preloadedTrackRef.current = null;
      return;
    }

    const nextTrack = getNextPlayableCatalogTrack(selectedSong.id);
    const standbyDeck = activeAudioDeckRef.current === 0 ? 1 : 0;
    const standbyAudio = audioDeckRefs.current[standbyDeck];
    if (!nextTrack?.audioPreview || !standbyAudio) {
      preloadedTrackRef.current = null;
      return;
    }

    standbyAudio.pause();
    standbyAudio.preload = "auto";
    standbyAudio.volume = volume / 100;
    if (standbyAudio.getAttribute("src") !== nextTrack.audioPreview) {
      standbyAudio.src = nextTrack.audioPreview;
      standbyAudio.load();
    }
    preloadedTrackRef.current = { track: nextTrack, deck: standbyDeck };
    warmPreviewResource(nextTrack.audioPreview);
  }, [selectedSong?.audioPreview, selectedSong?.id, volume, warmPreviewResource]);

  useEffect(() => {
    audioDeckRefs.current.forEach((audio) => {
      if (audio) audio.volume = volume / 100;
    });
  }, [volume]);

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = Math.floor(safeSeconds % 60);
    return `${minutes}:${String(restSeconds).padStart(2, "0")}`;
  };

  const handleAudioTimeUpdate = (event) => {
    const audio = event.currentTarget;
    if (
      !audio
      || audio !== audioRef.current
      || !Number.isFinite(audio.currentTime)
      || isPlaybackScrubbingRef.current
    ) return;
    setCurrentTime(audio.currentTime);
  };

  const handleAudioSeeked = (event) => {
    const audio = event.currentTarget;
    if (audio !== audioRef.current || !Number.isFinite(audio.currentTime)) return;
    setCurrentTime(audio.currentTime);
  };

  const handleAudioLoaded = (event) => {
    const audio = event.currentTarget;
    if (audio !== audioRef.current) return;
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
    }
  };

  const handleAudioCanPlay = (event) => {
    const audio = event.currentTarget;
    if (audio !== audioRef.current || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    setDuration(audio.duration);
    setIsAudioMetadataReady(true);
  };

  const promotePreloadedTrack = (track) => {
    const preload = preloadedTrackRef.current;
    if (!preload || preload.track.id !== track.id) return false;

    const nextAudio = audioDeckRefs.current[preload.deck];
    if (!nextAudio || nextAudio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return false;

    activeAudioDeckRef.current = preload.deck;
    audioRef.current = nextAudio;
    preloadedTrackRef.current = null;
    promotedTrackIdRef.current = track.id;
    isPlaybackScrubbingRef.current = false;
    currentTrackRef.current = track;

    if (nextAudio.currentTime !== 0) nextAudio.currentTime = 0;
    nextAudio.volume = volume / 100;
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(Number.isFinite(nextAudio.duration) ? nextAudio.duration : 0);
    setIsAudioMetadataReady(true);
    setIsPlaybackRequested(true);
    setIsPlaying(true);
    setIsSaved(false);
    setHoveredCommentPoint(null);
    setSelectedCommentPoint(null);

    nextAudio.play().catch(() => {
      setIsPlaybackRequested(false);
      setIsPlaying(false);
    });
    return true;
  };

  const handleAudioPlaying = (event) => {
    if (event.currentTarget !== audioRef.current) return;
    setIsPlaying(true);
  };

  const handleAudioPause = (event) => {
    const audio = event.currentTarget;
    if (audio !== audioRef.current) return;
    const isNaturalEnding = audio.ended
      || (Number.isFinite(audio.duration) && audio.duration - audio.currentTime < 0.05 && isPlaybackRequested);
    if (!isNaturalEnding) setIsPlaying(false);
  };

  const handleAudioEnded = (event) => {
    if (event.currentTarget !== audioRef.current) return;
    const nextTrack = getNextPlayableCatalogTrack(currentTrack?.id);
    if (!nextTrack) {
      setIsPlaybackRequested(false);
      setIsPlaying(false);
      return;
    }
    if (promotePreloadedTrack(nextTrack)) return;
    selectTrack(nextTrack, true);
  };

  const handleAudioError = (event) => {
    if (event.currentTarget !== audioRef.current) return;
    setIsPlaybackRequested(false);
    setIsPlaying(false);
    setIsAudioMetadataReady(false);
  };

  const handleClosePlayer = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
    audioDeckRefs.current.forEach((deckAudio) => {
      if (deckAudio && deckAudio !== audio) deckAudio.pause();
    });
    preloadedTrackRef.current = null;
    promotedTrackIdRef.current = null;
    isPlaybackScrubbingRef.current = false;
    if (currentTrack) {
      window.dispatchEvent(new CustomEvent("tempy-player-progress", {
        detail: { trackId: currentTrack.id, currentTime, isPlaying: false },
      }));
    }
    setIsPlaying(false);
    setIsPlaybackRequested(false);
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

  if (!currentTrack) {
    return (
      <>
        <audio key="audio-deck-0" ref={setFirstAudioDeckRef} preload="auto" />
        <audio key="audio-deck-1" ref={setSecondAudioDeckRef} preload="auto" />
      </>
    );
  }

  const playerPlaylist = musicCatalogTracks;

  const selectTrack = (track, shouldPlay = isPlaybackRequested) => {
    const selectedTrack = normalizeMusicItem(track);
    if (!selectedTrack || selectedTrack.id === currentTrackRef.current?.id) return false;
    currentTrackRef.current = selectedTrack;
    setCurrentTrack(selectedTrack);
    setCurrentTime(0);
    setDuration(0);
    setIsAudioMetadataReady(false);
    setIsPlaybackRequested(Boolean(shouldPlay && selectedTrack.audioPreview));
    setIsPlaying(false);
    setIsSaved(false);
    setHoveredCommentPoint(null);
    setSelectedCommentPoint(null);
    return true;
  };

  const handlePreviousTrack = () => {
    if (isShuffleEnabled) {
      handleRandomTrack();
      return;
    }
    const navigationBase = currentTrackRef.current;
    const navigationBaseIndex = Math.max(0, playerPlaylist.findIndex((track) => track.id === navigationBase?.id));
    const nextIndex = (navigationBaseIndex - 1 + playerPlaylist.length) % playerPlaylist.length;
    selectTrack(playerPlaylist[nextIndex], isPlaybackRequested);
  };

  const handleNextTrack = () => {
    if (isShuffleEnabled) {
      handleRandomTrack();
      return;
    }
    const navigationBase = currentTrackRef.current;
    const navigationBaseIndex = Math.max(0, playerPlaylist.findIndex((track) => track.id === navigationBase?.id));
    const nextIndex = (navigationBaseIndex + 1) % playerPlaylist.length;
    selectTrack(playerPlaylist[nextIndex], isPlaybackRequested);
  };

  function handleRandomTrack() {
    if (playerPlaylist.length <= 1) return;
    const candidates = playerPlaylist.filter((track) => track.id !== currentTrack.id);
    const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
    selectTrack(randomTrack, true);
  }

  const moments = momentsByTrack[currentTrack.id] || createMockTrackMoments(currentTrack.id);

  const handleMomentSubmit = (event) => {
    event.preventDefault();
    const text = momentInput.trim();
    if (!text) return;

    const trackId = currentTrack.id;
    const timestamp = Number.isFinite(currentTime) ? Number(currentTime.toFixed(2)) : 0;
    const newMoment = {
      id: `${trackId}-moment-${Date.now()}`,
      trackId,
      timestamp,
      user: "you",
      profileImage: "/images/profile-03.png",
      comment: text,
    };

    setMomentsByTrack((currentMomentsByTrack) => ({
      ...currentMomentsByTrack,
      [trackId]: [
        ...(currentMomentsByTrack[trackId] || createMockTrackMoments(trackId)),
        newMoment,
      ],
    }));
    setMomentInput("");
  };

  const vinylStyle = { "--global-player-cover": `url(${currentTrack.cover})` };
  const safeDuration = isAudioMetadataReady && Number.isFinite(duration) && duration > 0 ? duration : 1;
  const markerDuration = isAudioMetadataReady && Number.isFinite(duration) && duration > 0
    ? duration
    : selectedSong.audioPreview
      ? 30
      : parseTrackDuration(currentTrack.duration);
  const isPreviewUnavailable = !selectedSong.audioPreview;
  const momentMarkers = clusterTrackMoments(moments, markerDuration);
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

  const handleScrubStart = () => {
    isPlaybackScrubbingRef.current = true;
  };

  const seekToProgress = (progress) => {
    const nextTime = Math.min(safeDuration, Math.max(0, progress * safeDuration));
    const audio = audioRef.current;
    isPlaybackScrubbingRef.current = false;

    if (!audio || !selectedSong.audioPreview) {
      return false;
    }

    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
    return true;
  };

  const toggleCommentPoint = (event, momentId) => {
    event.preventDefault();
    event.stopPropagation();
    const marker = momentMarkers.find((moment) => moment.id === momentId);
    if (marker && isAudioMetadataReady) {
      seekToProgress(marker.timestamp / safeDuration);
    }
    setSidePanelMode("moments");
    setSelectedCommentPoint((selectedId) => selectedId === momentId ? null : momentId);
  };

  const handleCommentPointKeyDown = (event, momentId) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    toggleCommentPoint(event, momentId);
  };

  return (
    <>
      <audio
        key="audio-deck-0"
        ref={setFirstAudioDeckRef}
        preload="auto"
        onLoadedMetadata={handleAudioLoaded}
        onDurationChange={handleAudioLoaded}
        onCanPlay={handleAudioCanPlay}
        onTimeUpdate={handleAudioTimeUpdate}
        onSeeked={handleAudioSeeked}
        onPlaying={handleAudioPlaying}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />
      <audio
        key="audio-deck-1"
        ref={setSecondAudioDeckRef}
        preload="auto"
        onLoadedMetadata={handleAudioLoaded}
        onDurationChange={handleAudioLoaded}
        onCanPlay={handleAudioCanPlay}
        onTimeUpdate={handleAudioTimeUpdate}
        onSeeked={handleAudioSeeked}
        onPlaying={handleAudioPlaying}
        onPause={handleAudioPause}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
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
                    <div className="full-player__disc-texture" aria-hidden="true" />
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
                    onScrubStart={handleScrubStart}
                    onSeek={seekToProgress}
                  />
                  {isDesktopRing && momentMarkers.map((moment) => {
                    const peopleCount = moment.comments.length;
                    const profiles = moment.profiles;
                    const firstComment = moment.comments[0];
                    const deltaX = moment.point.x - PLAYER_RING_CENTER;
                    const deltaY = moment.point.y - PLAYER_RING_CENTER;
                    const isNavbarCollisionZone = moment.point.y < 24;
                    const outwardDirection = isNavbarCollisionZone
                      ? deltaX < 0
                        ? "top-safe-left"
                        : "top-safe-right"
                      : Math.abs(deltaX) >= Math.abs(deltaY)
                        ? deltaX >= 0
                          ? "right"
                          : "left"
                        : deltaY >= 0
                          ? "bottom"
                          : "top";
                    const verticalHemisphere = deltaY < 0 ? "upper" : "lower";
                    const isHovered = hoveredMoment?.id === moment.id;

                    return (
                      <div
                        className={`full-player__moment-anchor full-player__moment-anchor--out-${outwardDirection} full-player__moment-anchor--${verticalHemisphere}`}
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
                            <span className="full-player__moment-summary-head">
                              <time>{moment.time}</time>
                              <strong>{firstComment.user}{peopleCount > 1 ? ` 외 ${peopleCount - 1}명` : ""}</strong>
                            </span>
                            <span className="full-player__moment-summary-people">
                              <span className="full-player__moment-summary-profiles">
                                {profiles.slice(0, 3).map((profile, profileIndex) => (
                                  <img src={profile} alt="" key={`${moment.id}-profile-${profileIndex}`} draggable={false} />
                                ))}
                              </span>
                              {peopleCount > 3 && (
                                <span className="full-player__moment-summary-count">+{peopleCount - 3}</span>
                              )}
                            </span>
                            <span className="full-player__moment-summary-comment">“{firstComment.comment}”</span>
                            {peopleCount > 1 && (
                              <small className="full-player__moment-summary-more">+{peopleCount - 1} more</small>
                            )}
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
                  {selectedMoment.comments.slice(0, 3).map((comment, commentIndex) => (
                    <article className="full-player__comment-card" key={`${selectedMoment.id}-comment-${commentIndex}`}>
                      <img src={comment.profileImage} alt="" draggable={false} />
                      <div>
                        <header>
                          <strong>{comment.user}</strong>
                          <time>{selectedMoment.time}</time>
                        </header>
                        <p>{comment.comment}</p>
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
                <button className="tempy-icon-button" type="button" aria-label="Shuffle track" onClick={handleRandomTrack}>
                  <ShuffleIcon />
                </button>
                <button
                  className={`tempy-icon-button full-player__heart${isSaved ? " full-player__heart--active" : ""}`}
                  type="button"
                  aria-label={isSaved ? "Remove from saved" : "Save track"}
                  onClick={() => setIsSaved((saved) => !saved)}
                >
                  <HeartIcon filled={isSaved} />
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
                <button className="full-player__previous" type="button" aria-label="Previous track" onClick={handlePreviousTrack}>
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  className="full-player__play"
                  type="button"
                  aria-label={isPreviewUnavailable ? "Preview unavailable" : isPlaying ? "Pause current track" : "Play current track"}
                  disabled={isPreviewUnavailable}
                  onClick={togglePlayback}
                >
                  <span className="full-player__play-label--desktop" aria-hidden="true">{isPlaying ? "Ⅱ" : <PlayIcon />}</span>
                  <span className={`full-player__play-icon full-player__play-icon--play${isPlaying ? "" : " is-visible"}`} aria-hidden="true"><PlayIcon /></span>
                  <span className={`full-player__play-icon full-player__play-icon--pause${isPlaying ? " is-visible" : ""}`} aria-hidden="true">Ⅱ</span>
                </button>
                <button className="full-player__next" type="button" aria-label="Next track" onClick={handleNextTrack}>
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
                      <img src={moment.profileImage} alt="" draggable={false} />
                      <div>
                        <header>
                          <strong>{moment.user}</strong>
                          <time>{formatMomentTime(moment.timestamp)}</time>
                        </header>
                        <p>{moment.comment}</p>
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
                  togglePlayback();
                }}
              >
                {isPlaying ? "Ⅱ" : <PlayIcon />}
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
        <Route path="/curator/artist/:playlistId" element={<ArtistPlaylistDetail />} />
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
