import { Link } from "react-router-dom";
import { useRef } from "react";
import { useContextRecommendations } from "../utils/context";
import { saveReturnLocation } from "../utils/returnLocation";

const heroLogoPaths = [
  "M19.0581 16.7783H0V0H56.8717V16.7783H38.1162V174.12H19.0581V16.7783Z",
  "M101.148 126.181V159.759C101.148 167.734 98.5762 173.986 93.4335 178.536C88.2909 183.087 82.2839 185.363 75.4342 185.363C68.5845 185.363 62.6208 183.13 57.5862 178.685C52.5516 174.241 50.0234 168.01 50.0234 160.057V67.8721C50.0234 59.8976 52.5516 53.6881 57.5862 49.2437C62.6208 44.7993 68.5845 42.5664 75.4342 42.5664C82.2839 42.5664 88.2909 44.7993 93.4335 49.2437C98.5762 53.7094 101.148 60.0039 101.148 68.1698V113.125H68.4765V160.355C68.4765 163.396 69.2328 165.671 70.7453 167.181C72.2579 168.691 74.0297 169.456 76.0392 169.456C78.0488 169.456 79.7558 168.691 81.1819 167.181C82.5864 165.671 83.2995 163.396 83.2995 160.355V126.203H101.148V126.181ZM83.2995 59.0257H68.4765V100.004H83.2995V59.0257Z",
  "M113.25 25.325H131.401V36.1277H133.216C133.41 33.2782 134.728 30.6201 137.148 28.1533C139.568 25.6865 143.004 24.4531 147.434 24.4531C155.299 24.4531 160.333 28.3447 162.559 36.1277H165.282C165.476 33.2782 167.053 30.6201 169.971 28.1533C172.888 25.6865 176.583 24.4531 181.012 24.4531C192.702 24.4531 198.558 32.8954 198.558 49.78V166.143H180.105V49.4823C180.105 46.6328 179.543 44.2085 178.441 42.2309C177.339 40.2319 175.459 39.2537 172.844 39.2537C169.819 39.2537 167.745 40.2532 166.643 42.2309C165.541 44.2298 164.979 46.7391 164.979 49.78V166.143H146.526V49.4823C146.526 46.6328 145.964 44.2085 144.862 42.2309C143.76 40.2319 141.88 39.2537 139.266 39.2537C136.241 39.2537 134.231 40.2532 133.216 42.2309C132.2 44.2298 131.703 46.7391 131.703 49.78V166.143H113.25V25.325Z",
  "M228.52 39.0516V49.8543H230.335C230.529 47.0048 231.891 44.3466 234.419 41.8798C236.947 39.4131 240.512 38.1797 245.158 38.1797C256.848 38.1797 262.704 46.622 262.704 63.5066V155.968C262.704 172.853 256.848 181.295 245.158 181.295C240.728 181.295 237.293 180.147 234.873 177.871C232.453 175.596 231.134 172.938 230.94 169.897H228.822V224.804H210.672V39.0516H228.52ZM236.688 168.493C239.302 168.493 241.117 167.494 242.133 165.495C243.148 163.496 243.645 160.987 243.645 157.967V61.5077C243.645 58.4667 243.084 55.9574 241.982 53.9585C240.88 51.9596 239.108 50.9814 236.688 50.9814C233.468 50.9814 231.351 52.0234 230.335 54.1074C229.319 56.1914 228.822 58.8495 228.822 62.0818V157.393C228.822 164.793 231.437 168.493 236.688 168.493Z",
  "M282.378 192.052H293.874L297.201 161.601H294.479C290.438 161.601 287.262 160.133 284.95 157.199C282.637 154.264 281.168 150.224 280.563 145.099L270.883 20.4844H288.126L297.504 145.099H298.714L311.419 20.4844H328.965L310.209 190.351C309.604 195.285 307.681 199.368 304.461 202.579C301.242 205.811 295.797 207.406 288.126 207.406H282.378V192.052Z",
  "M337.336 67.2887V10.957H356.999V67.2887L353.974 151.499H340.059L337.336 67.2887ZM337.941 158.049H356.697V185.353H337.941V158.049Z",
];

function Home() {
  const { context, tracks: tempoTracks } = useContextRecommendations(10);
  const tempoAlbums = tempoTracks.slice(0, 10);
  const heroLogoFrame = useRef(null);

  const scrollToHomeSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo({ top: target.offsetTop, behavior: "auto" });
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
  };

  const handleHeroLogoMove = (event) => {
    const target = event.currentTarget;

    if (heroLogoFrame.current) {
      cancelAnimationFrame(heroLogoFrame.current);
    }

    heroLogoFrame.current = requestAnimationFrame(() => {
      const letters = target.querySelectorAll(".hero-wordmark__letter");

      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = centerX - event.clientX;
        const deltaY = centerY - event.clientY;
        const distance = Math.hypot(deltaX, deltaY);
        const radius = 165;
        const force = Math.max(0, 1 - distance / radius);

        if (!force) {
          letter.style.transform = "";
          return;
        }

        const angle = Math.atan2(deltaY, deltaX);
        const move = 12 * force;
        const x = Math.cos(angle) * move;
        const y = Math.sin(angle) * move;
        const rotate = (deltaX / radius) * 2 * force;
        const scale = 1 + 0.022 * force;

        letter.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      });
    });
  };

  const handleHeroLogoLeave = (event) => {
    if (heroLogoFrame.current) {
      cancelAnimationFrame(heroLogoFrame.current);
    }

    event.currentTarget.querySelectorAll(".hero-wordmark__letter").forEach((letter) => {
      letter.style.transform = "";
    });
  };

  const artistCards = [
    {
      image: "/images/artist-04.png",
      title: "제니의 무대 전 워밍업 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Jennie",
    },
    {
      image: "/images/artist-05.png",
      title: "악뮤의 작업할 때 영감을 많이 받았던 곡",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "AKMU",
    },
    {
      image: "/images/artist-06.png",
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
    { image: "/images/album-19.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-20.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-21.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-22.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-23.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/moment-04.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/moment-02.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-24.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-25.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-26.png", title: "유독 여유가 심한 날", artist: "hostless" },
    { image: "/images/album-27.png", title: "유독 여유가 심한 날", artist: "hostless" },
  ];

  const moments = [
    "/images/moment-01.png",
    "/images/moment-02.png",
    "/images/moment-03.png",
    "/images/moment-04.png",
    "/images/moment-05.png",
    "/images/moment-06.png",
    "/images/album-28.png",
    "/images/album-29.png",
    "/images/album-30.png",
    "/images/album-31.png",
    "/images/album-19.png",
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
    <>
      <main className="home-page">
        <section id="home" className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <h1 className="hero-wordmark kinetic-logo" onPointerMove={handleHeroLogoMove} onPointerLeave={handleHeroLogoLeave} aria-label="Tempy!">
                <svg className="hero-wordmark__svg" viewBox="0 0 357 225" aria-hidden="true" focusable="false">
                  {heroLogoPaths.map((path) => (
                    <path className="hero-wordmark__letter" d={path} fill="currentColor" key={path.slice(0, 20)} />
                  ))}
                </svg>
              </h1>
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
            <span className="tag">TODAY · {context.currentDate} {context.dayLabel}</span>
            <span className="tag">{context.currentTime}</span>
            <span className="tag">{context.locationLabel}</span>
            <span className="tag">{context.weatherLabel} · {context.temperature}</span>
          </div>
          <div className="album-row">
            {tempoAlbums.map((album, index) => (
              <article
                className="album-card"
                data-tempy-playable
                data-tempy-id={album.id}
                data-tempy-title={album.title}
                data-tempy-artist={album.artist}
                data-tempy-cover={album.cover || album.image}
                data-tempy-duration={album.duration}
                key={`${album.id}-${index}`}
              >
                <div className="album-image-wrap">
                  <img className="album-image" src={album.cover || album.image} alt={`${album.title} album cover`} />
                </div>
                <div className="album-meta">
                  <button className="album-play" aria-label={`Play ${album.title}`}>{index + 1}</button>
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
                <Link className="small-button" to="/discover/time-set" onClick={saveReturnLocation}>같은 순간의 노래 듣기</Link>
              </div>
              <div className="discover-art blue"><span></span></div>
            </article>
            <article className="discover-card discover-card-red">
              <div className="discover-copy">
                <h3>Track Trace</h3>
                <span>하나의 노래가 다른 사람에게 어떤 시간과 장면으로 남았는지<br />따라가보세요</span>
                <Link className="small-button" to="/discover/track-trace" onClick={saveReturnLocation}>같은 노래의 순간 보기</Link>
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
              <article
                className="artist-card artist-wide-card"
                data-tempy-playable
                data-tempy-title={artist.title}
                data-tempy-artist={artist.name}
                data-tempy-cover={artist.image}
                data-tempy-duration="21:03"
                key={`${artist.name}-${index}`}
              >
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
              <article
                className="playlist-row"
                data-tempy-playable
                data-tempy-title={item.title}
                data-tempy-artist={item.artist}
                data-tempy-cover={item.image || "/images/album-10.png"}
                key={`${item.title}-${index}`}
              >
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
              <article
                className="leftnow-card"
                data-tempy-playable
                data-tempy-title="비 오는 날 퇴근길에 한 곡"
                data-tempy-artist="hostless"
                data-tempy-cover={image}
                key={`${image}-${index}`}
              >
                <div className="leftnow-text">
                  <strong>비 오는 날 퇴근길에 한 곡</strong>
                  <span>{context.weatherLabel} · {context.temperature} · {context.currentTime}</span>
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
                <img src="/images/album-28.png" alt="archive album 1" />
                <img src="/images/moment-02.png" alt="archive moment" />
                <img src="/images/album-29.png" alt="archive album 2" />
                <img src="/images/album-30.png" alt="archive album 3" />
                <img src="/images/album-31.png" alt="archive album 4" />
                <img src="/images/album-27.png" alt="archive album 5" />
                <img src="/images/moment-03.png" alt="archive moment 2" />
                <img src="/images/moment-04.png" alt="archive moment 3" />
              </div>
            </article>
            <Link className="archive-card archive-similar-card archive-blind-pick-card" to="/archive/blind-pick">
              <div className="archive-text archive-blind-pick__text">
                <h3>Blind Pick</h3>
                <p>기록된 시간, 날씨, 감정만 보고<br />오늘의 노래를 먼저 골라보세요.</p>
                <span className="archive-blind-pick__button">블라인드 픽 시작하기</span>
              </div>
              <div className="archive-blind-pick__visual" aria-hidden="true">
                <div className="archive-blind-pick__bars">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="archive-blind-pick__album">
                  <span>?</span>
                </div>
                <div className="archive-blind-pick__cover archive-blind-pick__cover--back" />
                <div className="archive-blind-pick__cover archive-blind-pick__cover--front">
                  <span />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">Tempy!</div>
        <div className="footer-nav">
          <button type="button" onClick={() => scrollToHomeSection("tempo")}>TIME SET</button>
          <button type="button" onClick={() => scrollToHomeSection("discover")}>TRACK TRACE</button>
          <button type="button" onClick={() => scrollToHomeSection("archive")}>ARCHIVE</button>
        </div>
      </footer>
    </>
  );
}

export default Home;
