import "./index.css";
import logoMain from "./assets/Tempy!_logo_main.svg";
import logoNav from "./assets/Tempy!_logo_nav.svg";

function App() {
  const albums = [
    { image: "/images/album-01.png", title: "The Fate of Ophelia", artist: "Taylor Swift" },
    { image: "/images/album-02.png", title: "Drop dead", artist: "Only Astrologic" },
    { image: "/images/album-03.png", title: "BIRDS OF A FEATHER", artist: "Billie Eilish" },
    { image: "/images/album-04.png", title: "Puppet Show", artist: "XG" },
    { image: "/images/album-05.png", title: "Blinding Lights", artist: "The Weeknd" },
    { image: "/images/album-06.png", title: "Confetti Dream", artist: "HONNE" },
    { image: "/images/album-07.png", title: "Traveler", artist: "Wave Club" },
    { image: "/images/album-08.png", title: "Upside Mood", artist: "Ariana Grande" },
    { image: "/images/album-09.png", title: "Tattoo City", artist: "Night Loop" },
    { image: "/images/moment-02.png", title: "City Light", artist: "hostless" },
  ];

  const artistCards = [
    {
      image: "/images/artist-01.png",
      title: "제니의 무대 전 워밍업 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Jennie",
    },
    {
      image: "/images/artist-02.png",
      title: "악뮤의 작업할 때 영감을 많이 받았던 곡",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "AKMU",
    },
    {
      image: "/images/artist-03.png",
      title: "한로로의 카페에서 듣는 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Hanroro",
    },
    {
      image: "/images/artist-01.png",
      title: "공연 전 템포를 맞추는 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Jennie",
    },
    {
      image: "/images/artist-02.png",
      title: "악뮤의 저녁 작업을 위한 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "AKMU",
    },
    {
      image: "/images/artist-03.png",
      title: "한로로의 새벽에 남겨둔 순간의 음악",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Hanroro",
    },
  ];

  const playlistItems = [
    { image: null, title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-01.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-02.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-06.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-05.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-08.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/moment-04.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/moment-02.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-03.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-09.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-04.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-07.png", title: "유독 여유가 심한 날", artist: "hostless" },
  ];

  const moments = [
    "/images/moment-01.png",
    "/images/moment-02.png",
    "/images/moment-03.png",
    "/images/moment-04.png",
    "/images/moment-05.png",
    "/images/moment-06.png",
    "/images/album-06.png",
    "/images/album-07.png",
    "/images/album-08.png",
    "/images/album-09.png",
    "/images/album-05.png",
  ];

  const curators = [
    { image: "/images/profile-01.png", name: "만두두왕" },
    { image: "/images/profile-02.png", name: "오늘은까눌레" },
    { image: "/images/profile-03.png", name: "hostless" },
    { image: "/images/profile-04.png", name: "hostless" },
    { image: "/images/profile-05.png", name: "hostless" },
    { image: "/images/profile-06.png", name: "hostless" },
    { image: "/images/profile-07.png", name: "hostless" },
    { image: "/images/profile-08.png", name: "hostless" },
    { image: "/images/profile-06.png", name: "hostless" },
    { image: "/images/profile-01.png", name: "hostless" },
    { image: "/images/profile-04.png", name: "hostless" },
    { image: "/images/profile-07.png", name: "hostless" },
    { image: "/images/profile-08.png", name: "hostless" },
    { image: "/images/profile-03.png", name: "hostless" },
    { image: "/images/profile-05.png", name: "hostless" },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <a className="logo-small" href="#home" aria-label="Go to Home">
            <img src={logoNav} alt="Tempy!" />
          </a>
        </div>
        <div className="header-right">
          <nav className="top-nav">
            <a href="#tempo">Now</a>
            <a href="#discover">Discover</a>
            <a href="#artists">Curator</a>
            <a href="#tempo">Create</a>
            <a href="#archive">Archive</a>
          </nav>
          <div className="top-icons">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
      </header>

      <main className="home-page">
        <section id="home" className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-wordmark">
                <img src={logoMain} alt="Tempy!" />
              </div>
              <p className="hero-subtitle">Catch your Tempo, Meet your Moment</p>
            </div>
            <div className="hero-visual">
              <div className="lp-large">
                <div className="lp-center"></div>
              </div>
            </div>
          </div>
          <div className="hero-bar">
            <div className="hero-bar-text">It&rsquo;s Tempy!</div>
            <div className="hero-bar-text">Same Time, Different Songs</div>
          </div>
        </section>

        <section id="tempo" className="section tempo-section">
          <div className="section-head">
            <h2>Today's Tempo</h2>
            <p>오늘 이 시간·이 날씨·이 위치의 순간의 사람들이 듣고 있는 음악</p>
          </div>
          <div className="tag-row">
            <span className="tag">TODAY · 2026.05.16 토요일</span>
            <span className="tag">19:42</span>
            <span className="tag">서울 강북구</span>
            <span className="tag">비 · 18°C</span>
          </div>
          <div className="album-row">
            {albums.map((album, index) => (
              <article className="album-card" key={`${album.image}-${index}`}>
                <div className="album-image-wrap">
                  <img className="album-image" src={album.image} alt={`${album.title} album cover`} />
                </div>
                <div className="album-meta">
                  <button className="album-play" aria-label={`Play ${album.title}`}>{index === 4 ? 3 : index + 1}</button>
                  <div>
                    <strong>{album.title}</strong>
                    <span>{album.artist}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="discover" className="section discover-section">
          <div className="section-head">
            <h2>Discover by Difference</h2>
            <p>같은 순간의 다른 노래, 같은 노래의 다른 순간 속의 음악을 감상해보세요.</p>
          </div>
          <div className="discover-grid">
            <article className="discover-card discover-card-blue">
              <div className="discover-copy">
                <h3>Time Set</h3>
                <span>같은 순간 · 날씨 · 위치 안에서 다른 사람들이 선택한 음악을<br />감상해보세요</span>
                <button className="small-button">같은 순간의 노래 듣기</button>
              </div>
              <div className="discover-art blue"><span></span></div>
            </article>
            <article className="discover-card discover-card-red">
              <div className="discover-copy">
                <h3>Track Trace</h3>
                <span>하나의 노래가 다른 사람에게 어떤 시간과 장면으로 남았는지<br />따라가보세요</span>
                <button className="small-button">같은 노래의 순간 보기</button>
              </div>
              <div className="discover-art red"><span></span></div>
            </article>
          </div>
        </section>

        <section id="artists" className="section artist-section">
          <div className="section-head">
            <h2>Artist's Moment</h2>
            <p>좋아하는 아티스트들이 선택한 음악을 감상해보세요.</p>
          </div>
          <div className="artist-row">
            {artistCards.map((artist, index) => (
              <article className="artist-card artist-wide-card" key={`${artist.name}-${index}`}>
                <img className="artist-art" src={artist.image} alt={`${artist.name} artist moment`} />
                <div className="artist-copy" style={{ backgroundImage: `url(${artist.image})` }}>
                  <strong>{artist.title}</strong>
                  <span>{artist.meta}</span>
                  <span>♡ 1.5k</span>
                  <span className="artist-name">{artist.name}</span>
                </div>
                <div className="artist-info">
                  <button>▶ Play</button>
                  <button>⤨</button>
                  <button>♡</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section playlist-section">
          <div className="section-head">
            <h2>Moment Playlist</h2>
            <p>시간과 사람의 순간을 따라 새로운 음악을 발견하세요.</p>
          </div>
          <div className="playlist-grid">
            {playlistItems.map((item, index) => (
              <article className="playlist-row" key={`${item.title}-${index}`}>
                {item.image ? (
                  <img src={item.image} alt="playlist cover" />
                ) : (
                  <div className="playlist-thumb playlist-green">brat</div>
                )}
                <div>
                  <strong>{item.title}</strong>
                  <span>○ {item.artist}</span>
                  <span>♡ 1.5k  ⟲ 3891</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section leftnow-section">
          <div className="section-head">
            <h2>Moments Left Now</h2>
            <p>같은 시간과 날씨에 사람들이 선택한 노래를 감상해보세요.</p>
          </div>
          <div className="leftnow-row">
            {moments.map((image, index) => (
              <article className="leftnow-card" key={`${image}-${index}`}>
                <div className="leftnow-text">
                  <strong>비 오는 날 퇴근길에 한 곡</strong>
                  <span>비 · 18°C · 19시</span>
                  <span>● hostless</span>
                </div>
                <img className="leftnow-image" src={image} alt={`Moment card ${index + 1}`} />
                <div className="leftnow-bottom">
                  <button>▶ Play</button>
                  <button>♡</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section curator-section">
          <div className="section-head">
            <h2>Moment Curator</h2>
            <p>현재 가장 인기있는 큐레이터가 만든 플레이리스트를 감상해보세요.</p>
          </div>
          <div className="curator-row">
            {curators.map((curator, index) => (
              <div className="curator-item" key={`${curator.image}-${index}`}>
                <img className="curator-circle" src={curator.image} alt={`${curator.name} profile`} />
                <span>{curator.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="archive" className="section archive-section">
          <div className="section-head">
            <h2>Archive your Time</h2>
            <p>내가 어떤 시간에 어떤 음악을 들었는지 나만의 시간 기록으로 돌아보세요.</p>
          </div>
          <div className="archive-grid">
            <article className="archive-card archive-identity-card">
              <div className="archive-text">
                <h3>Your Music Identity</h3>
                <p>아카이브와 함께 10월의 당신을 돌아보세요.</p>
                <button>아카이브 보러가기</button>
              </div>
              <div className="archive-mosaic">
                <img src="/images/album-09.png" alt="archive album 1" />
                <img src="/images/moment-02.png" alt="archive moment" />
                <img src="/images/album-06.png" alt="archive album 2" />
                <img src="/images/album-07.png" alt="archive album 3" />
                <img src="/images/album-08.png" alt="archive album 4" />
                <img src="/images/album-05.png" alt="archive album 5" />
                <img src="/images/moment-03.png" alt="archive moment 2" />
                <img src="/images/moment-04.png" alt="archive moment 3" />
              </div>
            </article>
            <article className="archive-card archive-similar-card">
              <div className="archive-text">
                <h3>Similar like you</h3>
                <p>당신과 가장 비슷한 큐레이터를 만나보세요.</p>
                <button>큐레이터 보러가기</button>
              </div>
              <div className="similar-stack">
                <img src="/images/profile-03.png" alt="similar curator 1" />
                <img src="/images/profile-01.png" alt="similar curator 2" />
                <img src="/images/profile-02.png" alt="similar curator 3" />
                <img src="/images/profile-06.png" alt="similar curator 4" />
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">Tempy!</div>
        <div className="footer-nav">
          <a href="#tempo">TIME SET</a>
          <a href="#discover">TRACK TRACE</a>
          <a href="#archive">ARCHIVE</a>
        </div>
      </footer>
    </div>
  );
}

export default App;