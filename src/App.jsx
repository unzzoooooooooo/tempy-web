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

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link className="logo-small" to="/" aria-label="Go to Home">
          <img src={logoNav} alt="Tempy!" />
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
        <div className="top-icons">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </header>
  );
}

function App() {
  return (
    <div className="app">
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
      </Routes>
    </div>
  );
}

export default App;
