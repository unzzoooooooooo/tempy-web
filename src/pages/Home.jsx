import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import { HorizontalScrollArrows } from "../components/HorizontalScrollArrows";
import { HeartIcon, PlayIcon, ShuffleIcon } from "../components/TempyIcons";
import { useContextRecommendations } from "../utils/context";
import { calculatePointerRepel } from "../utils/pointerRepel";
import {
  getArtistDisplayImage,
  getTrackById,
  getTracksByIds,
} from "../data/musicCatalog";
import { artistImages, createAlbumImageSequence, getCuratorProfileImage } from "../data/imageCatalog";
import { homeMomentCurators } from "../data/curatorProfiles";
import { inferTrackTags, seededShuffle, selectContextItems } from "../utils/recommendations";
import { useNativeHorizontalScrollArrows } from "../utils/useNativeHorizontalScrollArrows";

const homeAlbumImages = createAlbumImageSequence(40, "home");

const createArtistMomentItem = ({ artist, artistImage, title, meta, track }) => ({
  artist,
  artistImage: artistImage || getArtistDisplayImage(artist, { trackCover: track.cover }),
  title,
  meta,
  track,
});

const artistMomentMeta = "10곡 · 21:03 · 2026.05.16";

const artistMomentPool = Object.freeze([
  createArtistMomentItem({
    artist: "JENNIE",
    artistImage: artistImages[0],
    title: "JENNIE의 무대 전 워밍업 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("like-jennie"),
  }),
  createArtistMomentItem({
    artist: "AKMU",
    artistImage: artistImages[1],
    title: "AKMU가 작업실에서 꺼내 듣는 곡들",
    meta: artistMomentMeta,
    track: getTrackById("good-feeling"),
  }),
  createArtistMomentItem({
    artist: "한로로",
    artistImage: artistImages[2],
    title: "한로로와 새벽 카페에 남겨둔 음악",
    meta: artistMomentMeta,
    track: getTrackById("feather"),
  }),
  createArtistMomentItem({
    artist: "Chappell Roan",
    artistImage: artistImages[3],
    title: "Chappell Roan이 무대에 오르기 전 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("good-luck-babe"),
  }),
  createArtistMomentItem({
    artist: "flowerovlove",
    artistImage: artistImages[4],
    title: "flowerovlove가 느린 오후에 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("casual-lady"),
  }),
  createArtistMomentItem({
    artist: "Justin Bieber",
    artistImage: artistImages[5],
    title: "Justin Bieber가 늦은 밤에 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("blinding-lights"),
  }),
  createArtistMomentItem({
    artist: "bülow",
    artistImage: artistImages[6],
    title: "bülow가 혼자 걷는 저녁에 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("two-weeks"),
  }),
  createArtistMomentItem({
    artist: "LANY",
    artistImage: artistImages[7],
    title: "LANY가 밤 드라이브할 때 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("xxl"),
  }),
  createArtistMomentItem({
    artist: "Olivia Dean",
    artistImage: artistImages[8],
    title: "Olivia Dean이 햇살 드는 방에서 고른 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("dive"),
  }),
  createArtistMomentItem({
    artist: "XG",
    artistImage: artistImages[9],
    title: "XG가 퍼포먼스 전 에너지를 올리는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("puppet-show"),
  }),
  createArtistMomentItem({
    artist: "Sabrina Carpenter",
    artistImage: artistImages[10],
    title: "Sabrina Carpenter가 준비하는 아침에 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("espresso"),
  }),
  createArtistMomentItem({
    artist: "Lauv",
    artistImage: artistImages[11],
    title: "Lauv가 늦은 귀갓길에 고른 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("i-like-me-better"),
  }),
  createArtistMomentItem({
    artist: "Olivia Rodrigo",
    artistImage: artistImages[12],
    title: "Olivia Rodrigo가 감정을 크게 꺼내는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("vampire"),
  }),
  createArtistMomentItem({
    artist: "Billie Eilish",
    artistImage: artistImages[13],
    title: "Billie Eilish가 조용한 밤에 고른 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("birds-of-a-feather"),
  }),
  createArtistMomentItem({
    artist: "ROSÉ",
    artistImage: artistImages[14],
    title: "ROSÉ가 마음을 정리하는 밤의 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("toxic-till-the-end"),
  }),
  createArtistMomentItem({
    artist: "HONNE",
    artistImage: artistImages[15],
    title: "HONNE가 도시의 불빛과 함께 듣는 플레이리스트",
    meta: artistMomentMeta,
    track: getTrackById("gone-are-the-days"),
  }),
]);

const getArtistMomentHourSeed = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}-${hour}`;
};

function HomeHorizontalCarousel({
  children,
  className,
  itemSelector,
  label,
  stepItems = 2.2,
  variant,
}) {
  const containerRef = useRef(null);
  const controls = useNativeHorizontalScrollArrows({ containerRef, itemSelector, stepItems });

  return (
    <div className={`horizontal-scroll-host home-horizontal-scroll home-horizontal-scroll--${variant}`}>
      <div className={className} ref={containerRef}>
        {children}
      </div>
      <HorizontalScrollArrows
        canScrollLeft={controls.canScrollLeft}
        canScrollRight={controls.canScrollRight}
        onScrollLeft={controls.scrollLeft}
        onScrollRight={controls.scrollRight}
        label={label}
      />
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const logoLetterRefs = useRef([]);
  const logoMotionRefs = useRef([]);
  const logoAnimationRef = useRef(null);
  const prefersReducedMotionRef = useRef(false);
  const { context, tracks: tempoTracks } = useContextRecommendations(10);
  const tempoAlbums = tempoTracks.slice(0, 10);

  const navigateHomeCard = (path) => {
    navigate(path);
  };

  const navigateHomeCardOnMobile = (path) => {
    if (window.matchMedia("(max-width: 768px)").matches) {
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

  const [artistMomentHourSeed, setArtistMomentHourSeed] = useState(() => (
    getArtistMomentHourSeed()
  ));

  useEffect(() => {
    let refreshTimer;

    const scheduleNextHour = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);

      refreshTimer = window.setTimeout(() => {
        setArtistMomentHourSeed(getArtistMomentHourSeed());
        scheduleNextHour();
      }, Math.max(1000, nextHour.getTime() - now.getTime() + 50));
    };

    scheduleNextHour();
    return () => window.clearTimeout(refreshTimer);
  }, []);

  const artistCards = useMemo(() => (
    seededShuffle(artistMomentPool, `home-artist-moment-${artistMomentHourSeed}`).slice(0, 8)
  ), [artistMomentHourSeed]);

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
  const playlistItems = selectContextItems([
    { image: null, title: "유독 여유가 필요한 날", artist: "hostless", context: "10 tracks · slow afternoon", tags: ["slow", "mellow", "afternoon"] },
    { image: homeAlbumImages[0], title: "비가 그친 뒤 걷는 밤", artist: "hostless", context: "비 온 뒤의 잔잔한 흐름", tags: ["rainy", "night", "reflective"] },
    { image: homeAlbumImages[1], title: "창가에 기대 듣는 노래", artist: "hostless", context: "soft mood · 32 min", tags: ["soft", "calm", "reflective"] },
    { image: homeAlbumImages[2], title: "아무 말 없이 머물고 싶은 오후", artist: "hostless", context: "말보다 조용한 9곡", tags: ["quiet", "afternoon", "mellow"] },
    { image: homeAlbumImages[3], title: "새벽을 천천히 넘기는 음악", artist: "hostless", context: "late night · low tempo", tags: ["dawn", "night", "slow", "ambient"] },
    { image: homeAlbumImages[4], title: "집으로 돌아가는 길의 온도", artist: "hostless", context: "퇴근길을 위한 28 min", tags: ["evening", "drive", "warm", "city"] },
    { image: homeAlbumImages[5], title: "햇살이 길게 남은 방", artist: "hostless", context: "warm light · 11 tracks", tags: ["bright", "warm", "light"] },
    { image: homeAlbumImages[6], title: "도시의 불빛이 켜질 무렵", artist: "hostless", context: "blue hour city mood", tags: ["city", "lateAfternoon", "evening", "groove"] },
    { image: homeAlbumImages[7], title: "혼자 걷기 좋은 저녁", artist: "hostless", context: "가벼운 걸음의 리듬", tags: ["evening", "chill", "groove"] },
    { image: homeAlbumImages[8], title: "생각이 많아지는 늦은 밤", artist: "hostless", context: "deep focus · 36 min", tags: ["night", "reflective", "moody"] },
    { image: homeAlbumImages[9], title: "작은 용기가 필요한 순간", artist: "hostless", context: "조금씩 선명해지는 8곡", tags: ["fresh", "bright", "upbeat"] },
    { image: homeAlbumImages[10], title: "주말 아침을 여는 플레이리스트", artist: "hostless", context: "weekend morning · bright", tags: ["morning", "fresh", "bright", "acoustic"] },
  ].map((item, index) => ({ ...item, track: playlistTracks[index] })), context, "momentPlaylist");

  const curatorProfileImages = [
    "/images/profile-03.png",
    "/images/profile-07.png",
    "/images/profile-01.png",
    "/images/profile-06.png",
    "/images/profile-04.png",
    "/images/profile-08.png",
    "/images/profile-02.png",
    "/images/profile-05.png",
  ].map(getCuratorProfileImage);

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
  const moments = selectContextItems([
    { image: homeAlbumImages[11], title: "비 오는 날 퇴근길에 한 곡", meta: "흐림 · 18°C · 20:59", curator: "hostless", tags: ["rainy", "evening", "reflective"] },
    { image: homeAlbumImages[12], title: "창밖이 흐린 오후의 노래", meta: "비 · 16°C · 19:42", curator: "오늘은까눌레", tags: ["cloudy", "mellow", "reflective"] },
    { image: homeAlbumImages[13], title: "바다를 바라보며 남긴 순간", meta: "맑음 · 23°C · 14:18", curator: "bluehour", tags: ["bright", "afternoon", "calm"] },
    { image: homeAlbumImages[14], title: "혼자 걷는 저녁의 플레이리스트", meta: "구름 조금 · 20°C · 21:07", curator: "느린파도", tags: ["evening", "chill", "city"] },
    { image: homeAlbumImages[15], title: "잠들기 전 다시 찾은 음악", meta: "바람 · 17°C · 23:16", curator: "midnightnote", tags: ["night", "dreamy", "slow"] },
    { image: homeAlbumImages[16], title: "햇살 좋은 주말의 한 곡", meta: "맑음 · 24°C · 11:28", curator: "만두두왕", tags: ["sunny", "morning", "bright", "upbeat"] },
    { image: homeAlbumImages[17], title: "오랜만에 떠오른 장면", meta: "흐림 · 19°C · 18:35", curator: "오래된헤드폰", tags: ["cloudy", "reflective", "mellow"] },
    { image: homeAlbumImages[18], title: "도시의 밤과 함께 듣는 노래", meta: "맑음 · 21°C · 22:14", curator: "moonletter", tags: ["night", "city", "electronic"] },
    { image: homeAlbumImages[19], title: "천천히 시작하는 아침의 음악", meta: "구름 조금 · 15°C · 08:12", curator: "새벽버스", tags: ["earlyMorning", "soft", "fresh"] },
    { image: homeAlbumImages[20], title: "노을이 번지는 창가의 순간", meta: "맑음 · 22°C · 17:48", curator: "여름끝", tags: ["lateAfternoon", "warm", "reflective"] },
    { image: homeAlbumImages[21], title: "비가 멈춘 골목에서 듣는 곡", meta: "비 갬 · 18°C · 20:21", curator: "작은소음", tags: ["rainy", "evening", "calm"] },
  ].map((moment, index) => ({
    ...moment,
    track: momentTracks[index],
    curatorImage: curatorProfileImages[(index + 3) % curatorProfileImages.length],
  })), context, "momentsLeftNow");

  const curators = selectContextItems(homeMomentCurators.map((curator, index) => ({
    id: curator.id,
    name: curator.username,
    desktopName: curator.username,
    image: getCuratorProfileImage(curator.profileImage),
    tags: inferTrackTags(tempoAlbums[index % tempoAlbums.length]),
  })), context, "momentCurator");

  return (
    <>
      <main className="home-page">
        <section id="home" className="hero-section">
          <div className="hero-inner">
            <div className="hero-copy">
              <Link
                to="/"
                className="hero-wordmark"
                onMouseMove={handleHeroLogoMove}
                onMouseLeave={resetHeroLogoLetters}
                aria-label="Go to Home"
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
              </Link>
              <p className="hero-subtitle">Catch your Tempo, Meet your Moment</p>
            </div>
            <div className="hero-visual">
              <div className="lp-large">
                <div className="lp-large__disc">
                  <div className="lp-center"></div>
                </div>
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
          <HomeHorizontalCarousel
            className="album-row"
            itemSelector=".album-card"
            label="Today's Tempo"
            stepItems={1.2}
            variant="tempo"
          >
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
          </HomeHorizontalCarousel>
        </section>

        <section id="discover" className="section discover-section">
          <div className="section-head">
            <h2>Discover by Difference</h2>
            <p>같은 순간의 다른 노래, 같은 노래의 다른 순간 속의 음악을 감상해보세요.</p>
          </div>
          <div className="discover-grid">
            <article className="discover-card discover-card-blue" onClick={() => navigateHomeCardOnMobile("/discover/time-set")}>
              <div className="discover-copy">
                <h3>Time Set</h3>
                <span>같은 순간 · 날씨 · 위치 안에서 다른 사람들이 선택한 음악을<br />감상해보세요</span>
                <button className="small-button" onClick={(event) => { event.stopPropagation(); navigateHomeCard("/discover/time-set"); }}>같은 순간의 노래 듣기</button>
              </div>
              <div className="discover-art blue"><span></span></div>
            </article>
            <article className="discover-card discover-card-red" onClick={() => navigateHomeCardOnMobile("/discover/track-trace")}>
              <div className="discover-copy">
                <h3>Track Trace</h3>
                <span>하나의 노래가 다른 사람에게 어떤 시간과 장면으로 남았는지<br />따라가보세요</span>
                <button className="small-button" onClick={(event) => { event.stopPropagation(); navigateHomeCard("/discover/track-trace"); }}>같은 노래의 순간 보기</button>
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
          <HomeHorizontalCarousel
            className="artist-row"
            itemSelector=".artist-card"
            label="Artist's Moment"
            variant="artist"
          >
            {artistCards.map((artist) => (
              <article
                className="artist-card artist-wide-card"
                tabIndex={0}
                data-tempy-playable
                data-tempy-id={artist.track.id}
                data-tempy-title={artist.track.title}
                data-tempy-artist={artist.track.artist}
                data-tempy-cover={artist.track.cover}
                data-tempy-duration={artist.track.duration}
                key={artist.artist}
              >
                <img className="artist-art" src={artist.artistImage} alt={`${artist.artist} artist moment`} />
                <div className="artist-copy" style={{ backgroundImage: `url(${artist.artistImage})` }}>
                  <strong>{artist.title}</strong>
                  <span className="artist-meta-primary">{artist.meta}</span>
                  <span className="artist-meta-likes tempy-icon-stat"><HeartIcon size="small" /> 1.5k</span>
                  <span className="artist-name">
                    <img className="artist-name__avatar" src={artist.artistImage} alt="" aria-hidden="true" />
                    {artist.artist}
                  </span>
                </div>
                <div className="artist-info">
                  <button><PlayIcon /> Play</button>
                  <button className="tempy-icon-button" type="button" aria-label="Shuffle artist moment"><ShuffleIcon size="small" className="tempy-icon--artist-action" /></button>
                  <button className="tempy-icon-button" type="button" aria-label="Like artist moment"><HeartIcon size="small" className="tempy-icon--artist-action" /></button>
                </div>
              </article>
            ))}
          </HomeHorizontalCarousel>
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
                data-tempy-id={item.track.id}
                data-tempy-title={item.track.title}
                data-tempy-artist={item.track.artist}
                data-tempy-cover={item.track.cover}
                data-tempy-duration={item.track.duration}
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
                  <strong className="home-mobile-copy">{item.title}</strong>
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
                  <span className="playlist-stats tempy-icon-stat"><HeartIcon size="small" /> 1.5k&nbsp;&nbsp;⟲ 3891</span>
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
          <HomeHorizontalCarousel
            className="leftnow-row"
            itemSelector=".leftnow-card"
            label="Moments Left Now"
            variant="leftnow"
          >
            {moments.map((moment, index) => (
              <article
                className="leftnow-card"
                tabIndex={0}
                data-tempy-playable
                data-tempy-id={moment.track.id}
                data-tempy-title={moment.track.title}
                data-tempy-artist={moment.track.artist}
                data-tempy-cover={moment.track.cover}
                data-tempy-duration={moment.track.duration}
                key={`${moment.image}-${index}`}
              >
                <div className="leftnow-text">
                  <strong className="home-mobile-copy">{moment.title}</strong>
                  <strong className="home-desktop-copy">{moment.title}</strong>
                  <span className="home-mobile-copy">{context.weatherLabel} · {context.temperature} · {context.currentTime}</span>
                  <span className="home-desktop-copy">{moment.meta}</span>
                  <span className="leftnow-author">
                    <img
                      className="home-desktop-avatar"
                      src={moment.curatorImage}
                      alt=""
                      aria-hidden="true"
                    />
                    <i aria-hidden="true">●</i>
                    {moment.curator}
                  </span>
                </div>
                <img className="leftnow-image" src={moment.image} alt={`Moment card ${index + 1}`} />
                <div className="leftnow-bottom">
                  <button><PlayIcon /> Play</button>
                  <button className="tempy-icon-button" type="button" aria-label="Like moment"><HeartIcon size="small" /></button>
                </div>
              </article>
            ))}
          </HomeHorizontalCarousel>
        </section>

        <section className="section curator-section">
          <div className="section-head">
            <h2>Moment Curator</h2>
            <p>현재 가장 인기있는 큐레이터가 만든 플레이리스트를 감상해보세요.</p>
          </div>
          <HomeHorizontalCarousel
            className="curator-row"
            itemSelector=".curator-item"
            label="Moment Curator"
            variant="curator"
          >
            {curators.map((curator, index) => (
              <Link className="curator-item" to={`/curator/${curator.id}`} key={`${curator.id}-${index}`}>
                <img className="curator-circle" src={curator.image} alt={`${curator.name} profile`} />
                <span className="home-mobile-copy">{curator.name}</span>
                <span className="home-desktop-copy">{curator.desktopName}</span>
              </Link>
            ))}
          </HomeHorizontalCarousel>
        </section>

        <section id="archive" className="section archive-section">
          <div className="section-head">
            <h2>Archive your Time</h2>
            <p>내가 어떤 시간에 무슨 음악을 들었는지 나만의 시간 기록으로 돌아보세요.</p>
          </div>
          <div className="archive-grid">
            <article className="archive-card archive-identity-card" onClick={() => navigateHomeCard("/archive")}>
              <div className="archive-text">
                <h3>Your Music Identity</h3>
                <p>아카이브와 함께 10월의 당신을 돌아보세요.</p>
                <button>아카이브 보러가기</button>
              </div>
              <div className="archive-identity-visual">
                <img src="/images/archive-identity-grid.png" alt="Your Music Identity collage" />
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
