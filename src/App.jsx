import { useEffect, useRef } from "react";
import { Link, Route, Routes } from "react-router-dom";
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

function Header() {
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
          <button className="header-logout-button" type="button">로그아웃</button>
          <Link className="top-profile-button" to="/profile" aria-label="Go to My Profile">
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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
