import { useState } from "react";
import { useNavigate } from "react-router-dom";

const segmentBars = [18, 24, 28, 23, 32, 42, 38, 52, 68, 92, 100, 86, 64, 48, 36, 31, 26, 20];

const songMetrics = [
  { label: "Melodicness", value: "82%" },
  { label: "Acousticness", value: "18%" },
  { label: "Valence", value: "74%" },
  { label: "Danceability", value: "68%" },
  { label: "Energy", value: "79%" },
  { label: "BPM", value: "120" },
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
  const navigate = useNavigate();

  return (
    <main className="track-comment-detail">
      <aside className="track-comment-detail__song">
        <button className="track-comment-detail__back" type="button" aria-label="Track Trace로 돌아가기" onClick={() => navigate(-1)}>
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
                <h2>01:30 - 01:35</h2>
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
                  {segmentBars.map((height, index) => (
                    <span
                      className={index >= 8 && index <= 11 ? "track-detail-tabs__bar--active" : ""}
                      style={{ height: `${height}%` }}
                      key={`${height}-${index}`}
                    />
                  ))}
                </div>
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
                  <div><dt>Album</dt><dd>The Life of a Showgirl</dd></div>
                  <div><dt>Release Date</dt><dd>October 3, 2025</dd></div>
                  <div><dt>Label</dt><dd>Taylor Swift</dd></div>
                  <div><dt>Language</dt><dd>English</dd></div>
                </dl>
              </div>

              <div className="track-detail-tabs__metrics">
                <p>AUDIO FEATURES</p>
                <div className="track-detail-tabs__metric-grid">
                  {songMetrics.map((metric) => (
                    <div className="track-detail-tabs__metric" key={metric.label}>
                      <span>{metric.label}</span>
                      <strong>{metric.value}</strong>
                      <i style={{ width: metric.label === "BPM" ? "72%" : metric.value }} />
                    </div>
                  ))}
                </div>
              </div>
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
              <article className="track-detail-lower__song-card" key={song.title}>
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

        <footer className="track-detail-lower__footer">
          <div>
            <p>ONE SONG, MANY MOMENTS</p>
            <strong>Keep tracing time.</strong>
          </div>
          <div className="track-detail-lower__footer-links">
            <span>DISCOVER</span>
            <span>CURATOR</span>
            <span>ARCHIVE</span>
          </div>
          <small>© 2026 TEMPY! MUSIC ARCHIVE</small>
        </footer>
      </div>
    </main>
  );
}

export default TrackTraceDetail;
