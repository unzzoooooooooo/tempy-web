import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";

const segmentBars = [
  18, 22, 20, 28, 35, 31, 42, 50, 45, 58, 52, 36, 29,
  44, 61, 55, 48, 33, 27, 41, 68, 82, 91, 100, 94, 84,
  59, 38, 26, 31, 45, 57, 49, 34, 22, 28, 40, 54, 46,
  30, 25, 37, 51, 43, 29, 34, 23, 18, 26, 20, 16, 24,
];

const TRACK_DURATION_SECONDS = 210;
const POPULAR_SEGMENT_START_SECONDS = 90;
const POPULAR_SEGMENT_START_INDEX = 21;
const POPULAR_SEGMENT_END_INDEX = 25;
const TRACK_DETAIL = {
  id: "track-03",
  title: "BIRDS OF A FEATHER",
  artist: "Billie Eilish",
  cover: "/images/album-19.png",
  duration: "03:30",
};

const formatTime = (date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

function getCurrentFiveMinuteRange() {
  const start = new Date();
  start.setSeconds(0, 0);
  start.setMinutes(Math.floor(start.getMinutes() / 5) * 5);

  const end = new Date(start.getTime() + 5 * 60 * 1000);
  return `${formatTime(start)} - ${formatTime(end)}`;
}

const songMetrics = [
  { label: "Melodicness", value: "82%", progress: 82, note: "Clear melodic contour" },
  { label: "Acousticness", value: "18%", progress: 18, note: "Mostly electronic texture" },
  { label: "Valence", value: "74%", progress: 74, note: "Warm and positive tone" },
  { label: "Danceability", value: "68%", progress: 68, note: "Steady, fluid movement" },
  { label: "Energy", value: "79%", progress: 79, note: "Bright dynamic range" },
  { label: "BPM", value: "120", progress: 72, note: "Moderate upbeat tempo" },
];

const songInformation = [
  { label: "Album", value: "The Life of a Showgirl" },
  { label: "Release Date", value: "October 3, 2025" },
  { label: "Label", value: "Taylor Swift" },
  { label: "Language", value: "English" },
];

const trackMoments = [
  {
    number: "01",
    time: "07:42",
    meta: "SEOUL · CLEAR",
    text: "창문을 열자 들어온 차가운 공기와 함께 들었던 아침.",
  },
  {
    number: "02",
    time: "13:18",
    meta: "BUSAN · CLOUDY",
    text: "아무 목적 없이 걷던 오후가 조금 특별해진 순간.",
  },
  {
    number: "03",
    time: "19:35",
    meta: "SEOUL · RAIN",
    text: "비 내리는 퇴근길, 이어폰 너머로 오래 남은 한 구절.",
  },
  {
    number: "04",
    time: "23:51",
    meta: "JEJU · WINDY",
    text: "잠들기 전 불을 끄고 이 노래를 다시 재생했던 밤.",
  },
];

const similarSongs = [
  { image: "/images/album-26.png", title: "The Fate of Ophelia", artist: "Taylor Swift" },
  { image: "/images/album-27.png", title: "Drop dead", artist: "Only Astrologic" },
  { image: "/images/album-28.png", title: "Blue Hour", artist: "Tomorrow X Together" },
  { image: "/images/album-29.png", title: "Slow Motion", artist: "Matt Champion" },
  { image: "/images/album-30.png", title: "Afterglow", artist: "The Marías" },
  { image: "/images/album-31.png", title: "City Lights", artist: "Wave to Earth" },
];

function TrackTraceDetail() {
  const [activeTab, setActiveTab] = useState("popular");
  const [popularTimeRange] = useState(getCurrentFiveMinuteRange);
  const [playingBarIndex, setPlayingBarIndex] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsClosing, setIsDetailsClosing] = useState(false);
  const modalCloseRef = useRef(null);
  const navigate = useNavigate();

  const openDetails = () => {
    setIsDetailsClosing(false);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => setIsDetailsClosing(true);

  useEffect(() => {
    const handlePlayerProgress = (event) => {
      if (event.detail?.trackId !== TRACK_DETAIL.id) return;
      if (!Number.isFinite(event.detail.currentTime)) return;
      const nextIndex = Math.min(
        segmentBars.length - 1,
        Math.floor((event.detail.currentTime / TRACK_DURATION_SECONDS) * segmentBars.length),
      );
      setPlayingBarIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
    };

    window.addEventListener("tempy-player-progress", handlePlayerProgress);
    return () => window.removeEventListener("tempy-player-progress", handlePlayerProgress);
  }, []);

  useEffect(() => {
    if (!isDetailsOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsDetailsClosing(true);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => modalCloseRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDetailsOpen]);

  const playPopularSegment = () => {
    setPlayingBarIndex(Math.floor((POPULAR_SEGMENT_START_SECONDS / TRACK_DURATION_SECONDS) * segmentBars.length));
    window.dispatchEvent(new CustomEvent("tempy-seek-track", {
      detail: {
        track: TRACK_DETAIL,
        startTime: POPULAR_SEGMENT_START_SECONDS,
      },
    }));
  };

  return (
    <main className="track-comment-detail">
      <aside
        className="track-comment-detail__song"
        data-tempy-playable
        data-tempy-title="BIRDS OF A FEATHER"
        data-tempy-artist="Billie Eilish"
        data-tempy-cover="/images/album-19.png"
        data-tempy-id="track-03"
        data-tempy-duration="03:30"
      >
        <button className="track-comment-detail__back detail-back-link" type="button" aria-label="Track Trace로 돌아가기" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO TRACK TRACE</span>
        </button>

        <div className="track-comment-detail__album">
          <img src="/images/album-19.png" alt="BIRDS OF A FEATHER album cover" />
          <span>01</span>
        </div>

        <div className="track-comment-detail__song-copy">
          <p>TRACK TRACE</p>
          <h1>BIRDS OF A FEATHER</h1>
          <span>Billie Eilish</span>
        </div>

        <div className="track-comment-detail__actions">
          <button className="track-comment-detail__play" type="button">
            Track Trace 보기
          </button>
          <button
            className="track-comment-detail__keep"
            type="button"
            onClick={() => navigate("/discover/track-trace/album")}
          >
            앨범 소개 보러가기 <span aria-hidden="true">→</span>
          </button>
        </div>
      </aside>

      <section className="track-comment-detail__comments">
        <div className="track-detail-tabs">
          <div className="track-detail-tabs__nav" role="tablist" aria-label="Track information">
            <button
              className={`track-detail-tabs__button ${activeTab === "popular" ? "track-detail-tabs__button--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "popular"}
              onClick={() => setActiveTab("popular")}
            >
              Popular Segments
            </button>
            <button
              className={`track-detail-tabs__button ${activeTab === "detail" ? "track-detail-tabs__button--active" : ""}`}
              type="button"
              role="tab"
              aria-selected={activeTab === "detail"}
              onClick={() => setActiveTab("detail")}
            >
              Song Detail
            </button>
          </div>

          {activeTab === "popular" ? (
            <div className="track-detail-tabs__panel track-detail-tabs__popular" role="tabpanel">
              <div className="track-detail-tabs__popular-copy">
                <p>Most Popular · Past 7 days</p>
                <h2>{popularTimeRange}</h2>
                <span>
                  가장 많은 사람들이 다시 머문 구간입니다.<br />
                  이 짧은 순간에 서로 다른 기억과 코멘트가 집중되었어요.
                </span>
              </div>

              <div className="track-detail-tabs__chart" aria-label="Popular segment timeline chart">
                <div className="track-detail-tabs__chart-scale">
                  <span>PLAYS</span>
                  <span>2.4K</span>
                </div>
                <div className="track-detail-tabs__bars">
                  {segmentBars.map((height, index) => {
                    const isInteractive = index >= POPULAR_SEGMENT_START_INDEX && index <= POPULAR_SEGMENT_END_INDEX;
                    const BarElement = isInteractive ? "button" : "span";

                    return (
                      <BarElement
                        type={isInteractive ? "button" : undefined}
                        className={[
                          height >= 82 ? "track-detail-tabs__bar--peak" : "",
                          isInteractive ? "track-detail-tabs__bar--active track-detail-tabs__bar--interactive" : "",
                          index === playingBarIndex ? "track-detail-tabs__bar--playing" : "",
                        ].filter(Boolean).join(" ")}
                        style={{ height: `${height}%` }}
                        key={`${height}-${index}`}
                        aria-label={isInteractive ? "핵심 구간 01:30부터 재생" : undefined}
                        onClick={isInteractive ? playPopularSegment : undefined}
                      />
                    );
                  })}
                </div>
                <button className="track-detail-tabs__progress" type="button" onClick={playPopularSegment} aria-label="핵심 구간 01:30부터 재생">
                  <i />
                </button>
                <div className="track-detail-tabs__timeline">
                  <span>00:00</span>
                  <span>01:00</span>
                  <strong>01:30</strong>
                  <span>02:00</span>
                  <span>03:30</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="track-detail-tabs__panel track-detail-tabs__song-detail" role="tabpanel">
              <div className="track-detail-tabs__metadata">
                <p>SONG INFORMATION</p>
                <dl>
                  {songInformation.map((item, index) => (
                    <div key={item.label}>
                      <dt><span>0{index + 1}</span>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="track-detail-tabs__metrics">
                <p>AUDIO FEATURES</p>
                <div className="track-detail-tabs__metric-grid">
                  {songMetrics.map((metric) => (
                    <div className="track-detail-tabs__metric" key={metric.label}>
                      <div className="track-detail-tabs__metric-head">
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                      </div>
                      <p>{metric.note}</p>
                      <div className="track-detail-tabs__metric-rail" aria-hidden="true">
                        <i style={{ width: `${metric.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="track-detail-tabs__more" type="button" onClick={openDetails}>
                <span>MORE DETAILS</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="track-detail-lower">
        <section className="track-detail-lower__moments">
          <div className="track-detail-lower__heading">
            <div>
              <p>TRACK ARCHIVE</p>
              <h2>Moments left on this track</h2>
            </div>
            <span>
              같은 노래 위에 남겨진 서로 다른 시간과 장면을 만나보세요.<br />
              사소했던 순간은 음악과 함께 오래 기억됩니다.
            </span>
          </div>

          <div className="track-detail-lower__moment-grid">
            {trackMoments.map((moment) => (
              <article className="track-detail-lower__moment-card" key={moment.number}>
                <div className="track-detail-lower__moment-top">
                  <span>{moment.number}</span>
                  <span>{moment.meta}</span>
                </div>
                <h3>{moment.time}</h3>
                <p>“{moment.text}”</p>
                <div className="track-detail-lower__moment-foot">
                  <span>LISTENING MOMENT</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="track-detail-lower__similar">
          <div className="track-detail-lower__heading">
            <div>
              <p>KEEP EXPLORING</p>
              <h2>Similar Songs</h2>
            </div>
            <span>
              이 곡과 비슷한 온도와 리듬을 가진 노래들입니다.<br />
              새로운 트랙에 남겨진 순간도 이어서 살펴보세요.
            </span>
          </div>

          <div className="track-detail-lower__song-grid">
            {similarSongs.map((song, index) => (
              <article
                className="track-detail-lower__song-card"
                data-tempy-playable
                data-tempy-title={song.title}
                data-tempy-artist={song.artist}
                data-tempy-cover={song.image}
                key={song.title}
              >
                <div className="track-detail-lower__song-artwork">
                  <img src={song.image} alt={`${song.title} album cover`} />
                  <span>0{index + 1}</span>
                </div>
                <div className="track-detail-lower__song-copy">
                  <div>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                  <span aria-hidden="true">→</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TempyFooter className="track-detail-lower__footer" />
      </div>

      {isDetailsOpen && (
        <div
          className={`track-detail-modal${isDetailsClosing ? " track-detail-modal--closing" : ""}`}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDetails();
          }}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && isDetailsClosing) {
              setIsDetailsOpen(false);
              setIsDetailsClosing(false);
            }
          }}
        >
          <section className="track-detail-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="track-detail-modal-title">
            <header className="track-detail-modal__header">
              <img src="/images/album-19.png" alt="BIRDS OF A FEATHER album cover" />
              <div>
                <p>TRACK INFORMATION</p>
                <h2 id="track-detail-modal-title">BIRDS OF A FEATHER</h2>
                <span>Billie Eilish</span>
              </div>
              <button ref={modalCloseRef} type="button" onClick={closeDetails} aria-label="상세 정보 닫기">×</button>
            </header>

            <div className="track-detail-modal__body">
              <section className="track-detail-modal__insights">
                <div className="track-detail-modal__section-title">
                  <p>SONG SUMMARY</p>
                  <span>01</span>
                </div>
                <p className="track-detail-modal__summary">
                  이 곡은 부드러운 멜로디와 선명한 보컬 라인이 중심이 되는 트랙입니다. 반복되는 후렴과 밝은 질감이 감정의 흐름을 천천히 끌어올립니다.
                </p>

                <div className="track-detail-modal__context">
                  <div className="track-detail-modal__context-title">
                    <p>LISTENING CONTEXT</p>
                    <span>FROM LISTENER ARCHIVE</span>
                  </div>
                  <dl>
                    <div><dt>Most saved moment</dt><dd>01:30 - 01:35</dd></div>
                    <div><dt>Frequent tags</dt><dd>rainy night · alone · recovery</dd></div>
                    <div><dt>Mood</dt><dd>calm · emotional · reflective</dd></div>
                    <div><dt>Best fit</dt><dd>Late-night walk · Quiet commute</dd></div>
                  </dl>
                </div>
              </section>

              <section className="track-detail-modal__features">
                <div className="track-detail-modal__section-title">
                  <p>EXPANDED AUDIO PROFILE</p>
                  <span>02</span>
                </div>
                <div className="track-detail-modal__feature-list">
                  {songMetrics.map((metric) => (
                    <div className="track-detail-modal__feature" key={metric.label}>
                      <div className="track-detail-modal__feature-copy">
                        <div><span>{metric.label}</span><strong>{metric.value}</strong></div>
                        <p>{metric.note}</p>
                      </div>
                      <div className="track-detail-modal__feature-rail" aria-hidden="true"><i style={{ width: `${metric.progress}%` }} /></div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="track-detail-modal__footer">
              <span>MORE ABOUT THIS TRACK</span>
              <button type="button" onClick={closeDetails}>BACK TO DETAIL <span aria-hidden="true">→</span></button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

export default TrackTraceDetail;
