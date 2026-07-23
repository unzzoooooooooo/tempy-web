import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import { useContextRecommendations } from "../utils/context";
import { calculatePointerRepel } from "../utils/pointerRepel";
import { getTrackById, getTracksByIds } from "../data/musicCatalog";

function Home() {
  const navigate = useNavigate();
  const logoLetterRefs = useRef([]);
  const logoMotionRefs = useRef([]);
  const logoAnimationRef = useRef(null);
  const prefersReducedMotionRef = useRef(false);
  const { context, tracks: tempoTracks } = useContextRecommendations(10);
  const tempoAlbums = tempoTracks.slice(0, 10);

  const navigateOnDesktop = (path) => {
    if (window.matchMedia("(min-width: 1181px)").matches) {
      navigate(path);
    }
  };

  const getLogoMotion = useCallback((index) => {
    if (!logoMotionRefs.current[index]) {
      logoMotionRefs.current[index] = {
        currentX: 0,
        currentY: 0,
        currentRotate: 0,
        targetX: 0,
        targetY: 0,
        targetRotate: 0,
      };
    }

    return logoMotionRefs.current[index];
  }, []);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      prefersReducedMotionRef.current = reducedMotionQuery.matches;
      if (reducedMotionQuery.matches) {
        logoLetterRefs.current.forEach((letter, index) => {
          const motion = getLogoMotion(index);
          motion.currentX = 0;
          motion.currentY = 0;
          motion.currentRotate = 0;
          motion.targetX = 0;
          motion.targetY = 0;
          motion.targetRotate = 0;
          if (letter) {
            letter.style.transform = "none";
          }
        });
      }
    };

    const renderLogoLetters = () => {
      const ease = 0.11;

      logoLetterRefs.current.forEach((letter, index) => {
        if (!letter) return;

        const motion = getLogoMotion(index);
        motion.currentX += (motion.targetX - motion.currentX) * ease;
        motion.currentY += (motion.targetY - motion.currentY) * ease;
        motion.currentRotate += (motion.targetRotate - motion.currentRotate) * ease;

        if (
          Math.abs(motion.currentX) < 0.01
          && Math.abs(motion.currentY) < 0.01
          && Math.abs(motion.currentRotate) < 0.01
          && motion.targetX === 0
          && motion.targetY === 0
          && motion.targetRotate === 0
        ) {
          motion.currentX = 0;
          motion.currentY = 0;
          motion.currentRotate = 0;
        }

        letter.style.transform = `translate(${motion.currentX.toFixed(2)}px, ${motion.currentY.toFixed(2)}px) rotate(${motion.currentRotate.toFixed(2)}deg)`;
      });

      logoAnimationRef.current = window.requestAnimationFrame(renderLogoLetters);
    };

    syncReducedMotion();
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    logoAnimationRef.current = window.requestAnimationFrame(renderLogoLetters);

    return () => {
      reducedMotionQuery.removeEventListener("change", syncReducedMotion);
      if (logoAnimationRef.current !== null) {
        window.cancelAnimationFrame(logoAnimationRef.current);
      }
    };
  }, [getLogoMotion]);

  const resetHeroLogoLetters = () => {
    logoLetterRefs.current.forEach((_, index) => {
      const motion = getLogoMotion(index);
      motion.targetX = 0;
      motion.targetY = 0;
      motion.targetRotate = 0;
    });
  };

  const handleHeroLogoMove = (event) => {
    if (prefersReducedMotionRef.current) return;

    const maxMove = 18;
    const influenceRadius = 190;

    logoLetterRefs.current.forEach((letter, index) => {
      if (!letter) return;

      const rect = letter.getBoundingClientRect();
      const motion = getLogoMotion(index);
      const repel = calculatePointerRepel({
        rect,
        pointerX: event.clientX,
        pointerY: event.clientY,
        influenceRadius,
        maxX: maxMove,
      });

      if (!repel.isActive) {
        motion.targetX = 0;
        motion.targetY = 0;
        motion.targetRotate = 0;
        return;
      }

      const rotate = Math.max(-3, Math.min(3, repel.x * 0.16));

      motion.targetX = repel.x;
      motion.targetY = repel.y;
      motion.targetRotate = rotate;
    });
  };

  const artistCards = [
    {
      image: "/images/artist-01.png",
      title: "제니의 무대 전 워밍업 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Jennie",
      track: getTrackById("like-jennie"),
    },
    {
      image: "/images/artist-02.png",
      title: "악뮤의 작업할 때 영감을 많이 받았던 곡",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "AKMU",
      track: getTrackById("love-lee"),
    },
    {
      image: "/images/artist-03.png",
      title: "한로로의 카페에서 듣는 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Hanroro",
      track: getTrackById("let-me-love-my-youth"),
    },
    {
      image: "/images/artist-01.png",
      title: "공연 전 템포를 맞추는 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Jennie",
      track: getTrackById("mantra"),
    },
    {
      image: "/images/artist-02.png",
      title: "악뮤의 저녁 작업을 위한 플레이리스트",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "AKMU",
      track: getTrackById("love-lee"),
    },
    {
      image: "/images/artist-03.png",
      title: "한로로의 새벽에 남겨둔 순간의 음악",
      meta: "10곡 · 21:03 · 2026.05.16",
      name: "Hanroro",
      track: getTrackById("let-me-love-my-youth"),
    },
  ];

  const playlistItems = [
    { image: null, title: "유독 여유가 필요한 날", artist: "hostless", context: "10 tracks · slow afternoon" },
    { image: "/images/album-19.png", title: "비가 그친 뒤 걷는 밤", artist: "hostless", context: "비 온 뒤의 잔잔한 흐름" },
    { image: "/images/album-20.png", title: "창가에 기대 듣는 노래", artist: "hostless", context: "soft mood · 32 min" },
    { image: "/images/album-21.png", title: "아무 말 없이 머물고 싶은 오후", artist: "hostless", context: "말보다 조용한 9곡" },
    { image: "/images/album-22.png", title: "새벽을 천천히 넘기는 음악", artist: "hostless", context: "late night · low tempo" },
    { image: "/images/album-23.png", title: "집으로 돌아가는 길의 온도", artist: "hostless", context: "퇴근길을 위한 28 min" },
    { image: "/images/moment-04.png", title: "햇살이 길게 남은 방", artist: "hostless", context: "warm light · 11 tracks" },
    { image: "/images/moment-02.png", title: "도시의 불빛이 켜질 무렵", artist: "hostless", context: "blue hour city mood" },
    { image: "/images/album-24.png", title: "혼자 걷기 좋은 저녁", artist: "hostless", context: "가벼운 걸음의 리듬" },
    { image: "/images/album-25.png", title: "생각이 많아지는 늦은 밤", artist: "hostless", context: "deep focus · 36 min" },
    { image: "/images/album-26.png", title: "작은 용기가 필요한 순간", artist: "hostless", context: "조금씩 선명해지는 8곡" },
    { image: "/images/album-27.png", title: "주말 아침을 여는 플레이리스트", artist: "hostless", context: "weekend morning · bright" },
  ];
  const playlistTracks = getTracksByIds([
    "360",
    "style",
    "mood",
    "disco-room",
    "mamas-boy",
    "soft-static",
    "sweetener",
    "blinding-lights",
    "rich-man",
    "citrus-glow",
    "you-and-me",
    "toxic-till-the-end",
  ]);

  const moments = [
    { image: "/images/moment-01.png", title: "비 오는 날 퇴근길에 한 곡", meta: "흐림 · 18°C · 20:59" },
    { image: "/images/moment-02.png", title: "창밖이 흐린 오후의 노래", meta: "비 · 16°C · 19:42" },
    { image: "/images/moment-03.png", title: "바다를 바라보며 남긴 순간", meta: "맑음 · 23°C · 14:18" },
    { image: "/images/moment-04.png", title: "혼자 걷는 저녁의 플레이리스트", meta: "구름 조금 · 20°C · 21:07" },
    { image: "/images/moment-05.png", title: "잠들기 전 다시 찾은 음악", meta: "바람 · 17°C · 23:16" },
    { image: "/images/moment-06.png", title: "햇살 좋은 주말의 한 곡", meta: "맑음 · 24°C · 11:28" },
    { image: "/images/album-28.png", title: "오랜만에 떠오른 장면", meta: "흐림 · 19°C · 18:35" },
    { image: "/images/album-29.png", title: "도시의 밤과 함께 듣는 노래", meta: "맑음 · 21°C · 22:14" },
    { image: "/images/album-30.png", title: "천천히 시작하는 아침의 음악", meta: "구름 조금 · 15°C · 08:12" },
    { image: "/images/album-31.png", title: "노을이 번지는 창가의 순간", meta: "맑음 · 22°C · 17:48" },
    { image: "/images/album-19.png", title: "비가 멈춘 골목에서 듣는 곡", meta: "비 갬 · 18°C · 20:21" },
  ];
  const momentTracks = getTracksByIds([
    "birds-of-a-feather",
    "gone-are-the-days",
    "traveler",
    "watermelon-sugar",
    "delicate",
    "cruel-summer",
    "wait",
    "whiplash",
    "armageddon",
    "like-jennie",
    "style",
  ]);

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

  const desktopCuratorNames = [
    "만두두왕",
    "오늘은까눌레",
    "hostless",
    "새벽버스",
    "느린파도",
    "종이비행기",
    "모과차",
    "귤껍질수집가",
    "비누향",
    "moonletter",
    "작은소음",
    "bluehour",
    "오래된헤드폰",
    "여름끝",
    "midnightnote",
  ];

  const curatorProfileImages = [
    "/images/profile-03.png",
    "/images/profile-07.png",
    "/images/profile-01.png",
    "/images/profile-06.png",
    "/images/profile-04.png",
    "/images/profile-08.png",
    "/images/profile-02.png",
    "/images/profile-05.png",
  ];

  return (
    <>
      <main className="home-page">
        <section id="home" className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <div
                className="hero-wordmark"
                onMouseMove={handleHeroLogoMove}
                onMouseLeave={resetHeroLogoLetters}
                aria-label="Tempy!"
              >
                <svg
                  className="hero-wordmark__svg"
                  width="357"
                  height="234"
                  viewBox="0 0 357 234"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-hidden="true"
                >
                  <path ref={(node) => { logoLetterRefs.current[0] = node; }} className="hero-wordmark__letter" d="M19.1692 17.4665H0V0H57.2035V17.4665H38.3385V181.262H19.1692V17.4665Z" fill="#F62933" />
                  <path ref={(node) => { logoLetterRefs.current[1] = node; }} className="hero-wordmark__letter" d="M101.739 131.353V166.308C101.739 174.61 99.1524 181.118 93.9797 185.856C88.8071 190.593 82.7651 192.962 75.8754 192.962C68.9858 192.962 62.9872 190.638 57.9233 186.011C52.8593 181.384 50.3164 174.898 50.3164 166.618V70.6522C50.3164 62.3507 52.8593 55.8865 57.9233 51.2598C62.9872 46.633 68.9858 44.3086 75.8754 44.3086C82.7651 44.3086 88.8071 46.633 93.9797 51.2598C99.1524 55.9087 101.739 62.4614 101.739 70.9622V117.761H68.8771V166.928C68.8771 170.094 69.6378 172.463 71.1592 174.034C72.6805 175.606 74.4627 176.403 76.484 176.403C78.5052 176.403 80.2222 175.606 81.6566 174.034C83.0693 172.463 83.7865 170.094 83.7865 166.928V131.375H101.739V131.353ZM83.7865 61.443H68.8771V104.102H83.7865V61.443Z" fill="#F62933" />
                  <path ref={(node) => { logoLetterRefs.current[2] = node; }} className="hero-wordmark__letter" d="M113.908 26.3647H132.165V37.6105H133.99C134.186 34.6441 135.512 31.8769 137.946 29.309C140.38 26.741 143.836 25.457 148.291 25.457C156.202 25.457 161.266 29.5082 163.505 37.6105H166.243C166.439 34.6441 168.026 31.8769 170.96 29.309C173.894 26.741 177.61 25.457 182.066 25.457C193.824 25.457 199.714 34.2456 199.714 51.8228V172.959H181.153V51.5129C181.153 48.5465 180.588 46.0228 179.479 43.964C178.371 41.8831 176.48 40.8647 173.85 40.8647C170.807 40.8647 168.721 41.9052 167.613 43.964C166.504 46.0449 165.939 48.6572 165.939 51.8228V172.959H147.378V51.5129C147.378 48.5465 146.813 46.0228 145.705 43.964C144.596 41.8831 142.706 40.8647 140.076 40.8647C137.033 40.8647 135.012 41.9052 133.99 43.964C132.969 46.0449 132.469 48.6572 132.469 51.8228V172.959H113.908V26.3647Z" fill="#F62933" />
                  <path ref={(node) => { logoLetterRefs.current[3] = node; }} className="hero-wordmark__letter" d="M229.86 40.6303V51.8762H231.686C231.882 48.9097 233.251 46.1425 235.794 43.5746C238.337 41.0066 241.923 39.7227 246.595 39.7227C258.354 39.7227 264.243 48.5113 264.243 66.0884V162.342C264.243 179.92 258.354 188.708 246.595 188.708C242.14 188.708 238.684 187.513 236.25 185.144C233.816 182.775 232.49 180.008 232.295 176.842H230.165V234.002H211.908V40.6303H229.86ZM238.076 175.381C240.706 175.381 242.531 174.341 243.553 172.26C244.574 170.179 245.074 167.567 245.074 164.423V64.0075C245.074 60.8419 244.509 58.2296 243.401 56.1487C242.292 54.0678 240.51 53.0494 238.076 53.0494C234.837 53.0494 232.708 54.1342 231.686 56.3037C230.665 58.4731 230.165 61.2403 230.165 64.6052V163.826C230.165 171.529 232.794 175.381 238.076 175.381Z" fill="#F62933" />
                  <path ref={(node) => { logoLetterRefs.current[4] = node; }} className="hero-wordmark__letter" d="M284.033 199.922H295.596L298.943 168.221H296.204C292.14 168.221 288.945 166.693 286.619 163.639C284.294 160.584 282.816 156.377 282.207 151.042L272.471 21.3164H289.814L299.247 151.042H300.464L313.243 21.3164H330.891L312.026 198.151C311.418 203.287 309.483 207.537 306.245 210.88C303.007 214.245 297.53 215.905 289.814 215.905H284.033V199.922Z" fill="#F62933" />
                  <path ref={(node) => { logoLetterRefs.current[5] = node; }} className="hero-wordmark__letter" d="M339.66 88.044V38.8398H357V88.044L354.332 161.6H342.061L339.66 88.044ZM340.194 167.321H356.733V191.17H340.194V167.321Z" fill="#F62933" />
                </svg>
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
            <span className="tag">TODAY · {context.currentDate} {context.dayLabel}</span>
            <span className="tag">{context.currentTime}</span>
            <span className="tag">{context.locationLabel}</span>
            <span className="tag">{context.weatherLabel} · {context.temperature}</span>
          </div>
          <div className="album-row">
            {tempoAlbums.map((album, index) => (
              <article
                className="album-card"
                tabIndex={0}
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
                <button className="small-button" onClick={() => navigateOnDesktop("/discover/time-set")}>같은 순간의 노래 듣기</button>
              </div>
              <div className="discover-art blue"><span></span></div>
            </article>
            <article className="discover-card discover-card-red">
              <div className="discover-copy">
                <h3>Track Trace</h3>
                <span>하나의 노래가 다른 사람에게 어떤 시간과 장면으로 남았는지<br />따라가보세요</span>
                <button className="small-button" onClick={() => navigateOnDesktop("/discover/track-trace")}>같은 노래의 순간 보기</button>
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
                tabIndex={0}
                data-tempy-playable
                data-tempy-id={artist.track.id}
                data-tempy-title={artist.track.title}
                data-tempy-artist={artist.track.artist}
                data-tempy-cover={artist.track.cover}
                data-tempy-duration={artist.track.duration}
                key={`${artist.name}-${index}`}
              >
                <img className="artist-art" src={artist.image} alt={`${artist.name} artist moment`} />
                <div className="artist-copy" style={{ backgroundImage: `url(${artist.image})` }}>
                  <strong>{artist.title}</strong>
                  <span className="artist-meta-primary">{artist.meta}</span>
                  <span className="artist-meta-likes">♡ 1.5k</span>
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
                tabIndex={0}
                data-tempy-playable
                data-tempy-id={playlistTracks[index].id}
                data-tempy-title={playlistTracks[index].title}
                data-tempy-artist={playlistTracks[index].artist}
                data-tempy-cover={playlistTracks[index].cover}
                data-tempy-duration={playlistTracks[index].duration}
                key={`${item.title}-${index}`}
              >
                <div className="playlist-cover-frame">
                  {item.image ? (
                    <img src={item.image} alt="playlist cover" />
                  ) : (
                    <div className="playlist-thumb playlist-green">brat</div>
                  )}
                </div>
                <div>
                  <strong className="home-mobile-copy">유독 여유가 심한 날</strong>
                  <strong className="home-desktop-copy">{item.title}</strong>
                  <span className="playlist-context home-desktop-copy">{item.context}</span>
                  <span className="playlist-author">
                    <img
                      className="home-desktop-avatar"
                      src={curatorProfileImages[index % curatorProfileImages.length]}
                      alt=""
                      aria-hidden="true"
                    />
                    <i aria-hidden="true">○</i>
                    {item.artist}
                  </span>
                  <span className="playlist-stats">♡ 1.5k  ⟲ 3891</span>
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
            {moments.map((moment, index) => (
              <article
                className="leftnow-card"
                tabIndex={0}
                data-tempy-playable
                data-tempy-id={momentTracks[index].id}
                data-tempy-title={momentTracks[index].title}
                data-tempy-artist={momentTracks[index].artist}
                data-tempy-cover={momentTracks[index].cover}
                data-tempy-duration={momentTracks[index].duration}
                key={`${moment.image}-${index}`}
              >
                <div className="leftnow-text">
                  <strong className="home-mobile-copy">비 오는 날 퇴근길에 한 곡</strong>
                  <strong className="home-desktop-copy">{moment.title}</strong>
                  <span className="home-mobile-copy">{context.weatherLabel} · {context.temperature} · {context.currentTime}</span>
                  <span className="home-desktop-copy">{moment.meta}</span>
                  <span className="leftnow-author">
                    <img
                      className="home-desktop-avatar"
                      src={curatorProfileImages[(index + 3) % curatorProfileImages.length]}
                      alt=""
                      aria-hidden="true"
                    />
                    <i aria-hidden="true">●</i>
                    hostless
                  </span>
                </div>
                <img className="leftnow-image" src={moment.image} alt={`Moment card ${index + 1}`} />
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
              <div className="curator-item" tabIndex={0} key={`${curator.image}-${index}`}>
                <img className="curator-circle" src={curator.image} alt={`${curator.name} profile`} />
                <span className="home-mobile-copy">{curator.name}</span>
                <span className="home-desktop-copy">{desktopCuratorNames[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="archive" className="section archive-section">
          <div className="section-head">
            <h2>Archive your Time</h2>
            <p>내가 어떤 시간에 무슨 음악을 들었는지 나만의 시간 기록으로 돌아보세요.</p>
          </div>
          <div className="archive-grid">
            <article className="archive-card archive-identity-card" onClick={() => navigateOnDesktop("/archive")}>
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

      <TempyFooter className="footer" />
    </>
  );
}

export default Home;
