import { useState } from "react";
import { useNavigate } from "react-router-dom";

const featuredTracks = [
  { cover: "/images/album-01.png", title: "The Fate of Ophelia", time: "23:10", likes: "12.8K" },
  { cover: "/images/album-04.png", title: "Cruel Summer", time: "19:30", likes: "10.4K" },
  { cover: "/images/album-07.png", title: "cardigan", time: "01:20", likes: "9.7K" },
  { cover: "/images/album-03.png", title: "Anti-Hero", time: "07:20", likes: "8.9K" },
];

const routeMoments = [
  { time: "07:20", label: "MORNING", cover: "/images/album-03.png" },
  { time: "12:40", label: "NOON", cover: "/images/album-06.png" },
  { time: "19:30", label: "EVENING", cover: "/images/album-04.png" },
  { time: "23:10", label: "NIGHT", cover: "/images/album-01.png" },
  { time: "01:20", label: "DAWN", cover: "/images/album-07.png" },
];

const leftTracks = [
  { number: "01", title: "Cruel Summer", time: "19:30", likes: "2,481" },
  { number: "02", title: "The Fate of Ophelia", time: "23:10", likes: "2,106" },
  { number: "03", title: "cardigan", time: "01:20", likes: "1,874" },
  { number: "04", title: "Anti-Hero", time: "07:20", likes: "1,522" },
];

const reports = [
  { number: "01", value: "23:10", label: "MOST TRACED TIME" },
  { number: "02", value: "12.8K", label: "TOTAL MOMENTS" },
  { number: "03", value: "NIGHT", label: "PRIMARY MOOD" },
];

const rankingTracks = [
  { cover: "/images/album-01.png", title: "The Fate of Ophelia", time: "23:10", likes: "12.8K", moments: "12,842", peak: "23:10", leftMoment: "After the curtain", album: "The Life of A Showgirl", released: "2025", totalTempy: "18.4K", tags: ["#NIGHT", "#AFTERGLOW", "#MEMORY"] },
  { cover: "/images/album-04.png", title: "Cruel Summer", time: "19:30", likes: "10.4K", moments: "10,421", peak: "19:30", leftMoment: "Summer drive", album: "Lover", released: "2019", totalTempy: "15.7K", tags: ["#SUMMER", "#DRIVE", "#LOVE"] },
  { cover: "/images/album-07.png", title: "cardigan", time: "01:20", likes: "9.7K", moments: "9,738", peak: "01:20", leftMoment: "Quiet room", album: "folklore", released: "2020", totalTempy: "14.2K", tags: ["#DAWN", "#RAIN", "#MEMORY"] },
  { cover: "/images/album-03.png", title: "Anti-Hero", time: "07:20", likes: "8.9K", moments: "8,904", peak: "07:20", leftMoment: "First light", album: "Midnights", released: "2022", totalTempy: "13.6K", tags: ["#MORNING", "#SELF", "#CITY"] },
  { cover: "/images/album-09.png", title: "Love Story", time: "17:45", likes: "7.2K", moments: "7,216", peak: "17:45", leftMoment: "Golden hour", album: "Fearless", released: "2008", totalTempy: "11.9K", tags: ["#LOVE", "#SUNSET", "#STORY"] },
];

function ArtistProfile() {
  const navigate = useNavigate();
  const [expandedTrackIndex, setExpandedTrackIndex] = useState(null);

  const toggleTrack = (index) => {
    setExpandedTrackIndex((currentIndex) => currentIndex === index ? null : index);
  };

  return (
    <main className="artist-profile">
      <section className="artist-profile__top">
        <button className="artist-profile__back" type="button" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK</span>
        </button>

        <div className="artist-profile__hero">
          <img className="artist-profile__image" src="/images/album-01.png" alt="Taylor Swift" />
          <div className="artist-profile__intro">
            <p className="artist-profile__label">ARTIST PROFILE · POP</p>
            <h1>Taylor Swift</h1>
            <div className="artist-profile__popularity">
              <strong>18.4K</strong><span>LIKED MOMENTS</span>
            </div>
            <div className="artist-profile__tags">
              <span>#NIGHT</span><span>#AFTERGLOW</span><span>#STORYTELLING</span>
            </div>
            <p className="artist-profile__description">
              선명한 장면과 섬세한 감정을 노래로 기록하는 아티스트. Taylor Swift의 음악은
              아침의 첫 빛부터 늦은 밤의 고요까지, 서로 다른 순간의 기억을 하나의 이야기로 이어줍니다.
            </p>
            <div className="artist-profile__actions">
              <button type="button">View Track Trace <span>↗</span></button>
              <button type="button">Add Moment <span>＋</span></button>
            </div>
          </div>
        </div>
      </section>

      <section className="artist-profile__summary artist-profile__content-section">
        <div className="artist-profile__heading">
          <p className="artist-profile__label">LISTENER ARCHIVE</p>
          <h2>Artist Moment Summary</h2>
          <p>리스너들이 Taylor Swift의 음악과 함께 남긴 시간과 감정의 기록입니다.</p>
        </div>
        <div className="artist-profile__summary-grid">
          <article><small>ARTIST MOMENT SUMMARY</small><strong>12,842</strong><p>moments collected</p><span>+ 18% THIS MONTH</span></article>
          <article><small>MOST REMEMBERED TIME</small><strong>23:10</strong><p>late night listening</p><span>NIGHT · AFTERGLOW</span></article>
          <article><small>ARTIST MOMENT TAGS</small><div className="artist-profile__tag-cloud"><b>#NIGHT</b><b>#LOVE</b><b>#MEMORY</b><b>#DRIVE</b></div><span>42 ACTIVE TAGS</span></article>
        </div>
      </section>

      <section className="artist-profile__featured artist-profile__content-section">
        <div className="artist-profile__heading artist-profile__heading--row">
          <div><p className="artist-profile__label">FROM LISTENER MOMENTS</p><h2>Featured Tracks in Moments</h2></div>
          <span>DRAG TO EXPLORE →</span>
        </div>
        <div className="artist-profile__track-flow">
          {featuredTracks.map((track, index) => (
            <article className="artist-profile__track-card" key={track.title}>
              <img src={track.cover} alt="" />
              <div className="artist-profile__track-copy"><small>0{index + 1} · FEATURED TRACK</small><h3>{track.title}</h3><p>Taylor Swift</p></div>
              <div className="artist-profile__track-meta"><span>{track.time}<small>MOMENT</small></span><span>♥ {track.likes}</span><button type="button">PLAY ▶</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-profile__route artist-profile__content-section">
        <div className="artist-profile__heading">
          <p className="artist-profile__label">A DAY WITH THE ARTIST</p><h2>Artist Route</h2>
          <p>시간의 흐름을 따라 Taylor Swift의 서로 다른 장면을 만나보세요.</p>
        </div>
        <div className="artist-profile__timeline">
          {routeMoments.map((moment, index) => (
            <article key={moment.time}>
              <span className="artist-profile__timeline-number">0{index + 1}</span>
              <img src={moment.cover} alt="" />
              <div><small>{moment.label}</small><strong>{moment.time}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-profile__library">
        <article className="artist-profile__release">
          <div className="artist-profile__heading"><p className="artist-profile__label">NEW FROM TAYLOR</p><h2>Latest Release</h2></div>
          <div className="artist-profile__release-card">
            <img src="/images/album-01.png" alt="The Life of A Showgirl" />
            <div><small>ALBUM · 2025</small><h3>The Life of<br />A Showgirl</h3><p>12 Songs · 41 min 06 sec</p><button type="button">PLAY ALBUM <span>▶</span></button></div>
          </div>
        </article>

        <article className="artist-profile__most-left">
          <div className="artist-profile__heading"><p className="artist-profile__label">LISTENER ARCHIVE</p><h2>Most Left Tracks</h2></div>
          <div className="artist-profile__filters"><button type="button">ALL</button><button type="button">NIGHT</button><button type="button">LOVE</button><button type="button">MEMORY</button></div>
          <ol className="artist-profile__track-list">
            {leftTracks.map((track) => <li key={track.number}><span>{track.number}</span><strong>{track.title}<small>Taylor Swift</small></strong><time>{track.time}</time><span>♥ {track.likes}</span><button type="button">▶</button></li>)}
          </ol>
        </article>
      </section>

      <section className="artist-profile__report artist-profile__content-section">
        <div className="artist-profile__heading"><p className="artist-profile__label">FROM THE ARCHIVE</p><h2>Artist Moment Report</h2></div>
        <div className="artist-profile__report-grid">
          <div className="artist-profile__trace-reports">
            {reports.map((report) => <article key={report.number}><span>{report.number}</span><small>{report.label}</small><strong>{report.value}</strong><p>Taylor Swift listener archive</p></article>)}
          </div>
          <div className="artist-profile__ranking">
            <div><p className="artist-profile__label">TOP 05</p><h3>Track Moment Ranking</h3></div>
            {rankingTracks.map((track, index) => {
              const isExpanded = expandedTrackIndex === index;

              return (
                <div className={`artist-profile__ranking-accordion${isExpanded ? " artist-profile__ranking-accordion--open" : ""}`} key={track.title}>
                  <article className="artist-profile__ranking-row">
                    <span>0{index + 1}</span>
                    <img src={track.cover} alt="" />
                    <strong>{track.title}<small>Taylor Swift</small></strong>
                    <time>{track.time}</time>
                    <span>♥ {track.likes}</span>
                    <button
                      className="artist-profile__ranking-toggle"
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={`${track.title} 상세 ${isExpanded ? "접기" : "펼치기"}`}
                      onClick={() => toggleTrack(index)}
                    >
                      <span aria-hidden="true">{isExpanded ? "↑" : "↓"}</span>
                    </button>
                  </article>

                  {isExpanded && (
                    <div className="artist-profile__ranking-detail">
                      <img className="artist-profile__ranking-cover" src={track.cover} alt={`${track.title} album cover`} />
                      <div className="artist-profile__ranking-detail-copy">
                        <p className="artist-profile__ranking-kicker">TRACK MOMENT · 0{index + 1}</p>
                        <h4>{track.title}</h4>
                        <p className="artist-profile__ranking-artist">Taylor Swift</p>

                        <div className="artist-profile__ranking-stats">
                          <div><small>MOMENTS</small><strong>{track.moments}</strong></div>
                          <div><small>PEAK TIME</small><strong>{track.peak}</strong></div>
                          <div><small>MOST LEFT MOMENT</small><strong>{track.leftMoment}</strong></div>
                        </div>

                        <p className="artist-profile__ranking-description">
                          이 트랙과 함께 남겨진 시간과 감정의 기록입니다. 가장 많이 기억된 순간과
                          리스너들이 반복해서 돌아온 장면을 한눈에 살펴보세요.
                        </p>

                        <dl className="artist-profile__ranking-info">
                          <div><dt>ALBUMS</dt><dd>{track.album}</dd></div>
                          <div><dt>RELEASED</dt><dd>{track.released}</dd></div>
                          <div><dt>TOTAL TEMPY</dt><dd>{track.totalTempy}</dd></div>
                        </dl>

                        <div className="artist-profile__ranking-tags">
                          {track.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="artist-profile__footer">
        <div><p>ONE ARTIST, COUNTLESS MOMENTS</p><strong>Leave your moment.</strong></div>
        <div><span>DISCOVER</span><span>CURATOR</span><span>ARCHIVE</span></div>
        <small>© 2026 TEMPY! MUSIC ARCHIVE</small>
      </footer>
    </main>
  );
}

export default ArtistProfile;
