import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import {
  getAlbumById,
  getArtistById,
  getTracksByArtist,
} from "../data/musicCatalog";

const routeTimeToSeconds = (time) => {
  const [minutes, seconds] = time.split(":").map(Number);
  return (minutes * 60) + seconds;
};

const leftTrackFilters = ["ALL", "NIGHT", "LOVE", "MEMORY"];

const reports = [
  {
    number: "01",
    value: "23:10",
    label: "MOST TRACED TIME",
    note: "하루가 고요해진 뒤 가장 많은 리스너의 장면이 겹치는 시간입니다.",
    meta: [["PEAK WINDOW", "22:40—00:20"], ["NIGHT SHARE", "38%"]],
  },
  {
    number: "02",
    value: "12.8K",
    label: "TOTAL MOMENTS",
    note: "이 아티스트의 음악과 함께 축적된 리스너 모먼트의 전체 기록입니다.",
    meta: [["MONTHLY GROWTH", "+18%"], ["MOST SAVED", "OPHELIA"]],
  },
  {
    number: "03",
    value: "NIGHT",
    label: "PRIMARY MOOD",
    note: "기억과 여운이 길어지는 밤의 감정이 가장 선명하게 기록되었습니다.",
    meta: [["ACTIVE WINDOW", "21:00—01:30"], ["NEXT MOOD", "MEMORY"]],
  },
];

function ArtistProfile() {
  const navigate = useNavigate();
  const { artistId = "taylor-swift" } = useParams();
  const artist = getArtistById(artistId) || getArtistById("taylor-swift");
  const artistTracks = getTracksByArtist(artist.id);
  const displayTracks = Array.from({ length: 12 }, (_, index) => artistTracks[index % artistTracks.length]);
  const featuredTracks = displayTracks.map((track, index) => ({
    ...track,
    time: ["23:10", "19:30", "01:20", "07:20", "18:42", "22:05"][index % 6],
    likes: ["12.8K", "10.4K", "9.7K", "8.9K", "8.4K", "7.9K"][index % 6],
  }));
  const routeMoments = displayTracks.slice(0, 7).map((track, index) => ({
    ...track,
    time: ["07:20", "10:40", "12:40", "15:15", "19:30", "23:10", "01:20"][index],
    label: ["MORNING", "LATE MORNING", "NOON", "AFTERNOON", "EVENING", "NIGHT", "DAWN"][index],
  }));
  const makeLeftTracks = (offset = 0) => displayTracks.slice(offset, offset + 4).map((track, index) => ({
    ...track,
    number: String(index + 1).padStart(2, "0"),
    time: ["19:30", "23:10", "01:20", "07:20"][index],
    likes: ["2,481", "2,106", "1,874", "1,522"][index],
  }));
  const leftTracksByFilter = {
    ALL: makeLeftTracks(0),
    NIGHT: makeLeftTracks(2),
    LOVE: makeLeftTracks(4),
    MEMORY: makeLeftTracks(6),
  };
  const rankingTracks = displayTracks.slice(0, 5).map((track, index) => {
    const album = getAlbumById(track.albumId);
    return {
      ...track,
      time: ["23:10", "19:30", "01:20", "07:20", "17:45"][index],
      likes: ["12.8K", "10.4K", "9.7K", "8.9K", "7.2K"][index],
      moments: ["12,842", "10,421", "9,738", "8,904", "7,216"][index],
      peak: ["23:10", "19:30", "01:20", "07:20", "17:45"][index],
      leftMoment: ["After the curtain", "Evening drive", "Quiet room", "First light", "Golden hour"][index],
      album: album.title,
      released: album.releaseDate,
      totalTempy: ["18.4K", "15.7K", "14.2K", "13.6K", "11.9K"][index],
      tags: [["#NIGHT", "#AFTERGLOW", "#MEMORY"], ["#EVENING", "#DRIVE", "#LOVE"], ["#DAWN", "#RAIN", "#MEMORY"], ["#MORNING", "#SELF", "#CITY"], ["#LOVE", "#SUNSET", "#STORY"]][index],
    };
  });
  const latestTrack = artistTracks[0];
  const latestAlbum = getAlbumById(latestTrack.albumId);
  const artistReports = [
    reports[0],
    { ...reports[1], note: `${artist.name}의 음악과 함께 축적된 리스너 모먼트의 전체 기록입니다.` },
    reports[2],
  ];
  const [expandedTrackIndex, setExpandedTrackIndex] = useState(null);
  const [activeTrackFilter, setActiveTrackFilter] = useState("ALL");
  const [isPhone, setIsPhone] = useState(() => window.matchMedia("(max-width: 480px)").matches);

  useEffect(() => {
    const phoneQuery = window.matchMedia("(max-width: 480px)");
    const syncPhone = () => setIsPhone(phoneQuery.matches);

    syncPhone();
    phoneQuery.addEventListener("change", syncPhone);
    return () => phoneQuery.removeEventListener("change", syncPhone);
  }, []);

  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 480px)").matches) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    let secondFrame = 0;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const firstFrame = window.requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      secondFrame = window.requestAnimationFrame(() => window.scrollTo(0, 0));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  const toggleTrack = (index) => {
    setExpandedTrackIndex((currentIndex) => currentIndex === index ? null : index);
  };

  const playRouteMoment = (moment) => {
    window.dispatchEvent(new CustomEvent("tempy-seek-track", {
      detail: {
        track: {
          id: moment.id,
          title: moment.title,
          artist: moment.artist,
          cover: moment.cover,
          duration: moment.duration,
          artistId: artist.id,
          albumId: moment.albumId,
          momentTime: moment.time,
        },
        startTime: routeTimeToSeconds(moment.time),
      },
    }));
  };

  return (
    <main className="artist-profile">
      <section className="artist-profile__top">
        <button className="artist-profile__back detail-back-link" type="button" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK</span>
        </button>

        <div className="artist-profile__hero">
          <div className="artist-profile__hero-main">
            <div className="artist-profile__image-frame">
              <img className="artist-profile__image" src={artist.profile} alt={artist.name} />
            </div>
            <div className="artist-profile__intro">
              <p className="artist-profile__label">ARTIST PROFILE · {artist.genres[0].toUpperCase()}</p>
              <h1>{artist.name}</h1>
              <div className="artist-profile__popularity">
                <strong>18.4K</strong><span>LIKED MOMENTS</span>
              </div>
              <div className="artist-profile__tags">
                <span>#NIGHT</span><span>#AFTERGLOW</span><span>#STORYTELLING</span>
              </div>
              <p className="artist-profile__description">
                선명한 장면과 섬세한 감정을 노래로 기록하는 아티스트. {artist.name}의 음악은
                아침의 첫 빛부터 늦은 밤의 고요까지, 서로 다른 순간의 기억을 하나의 이야기로 이어줍니다.
                한 곡 안에서도 시간과 감정의 결이 섬세하게 바뀌며, 듣는 사람마다 각자의 장면을 떠올리게 합니다.
                Tempy에서는 그 순간들이 언제 시작되고 어떤 기억으로 남는지 더 입체적으로 탐색할 수 있습니다.
              </p>
              <div className="artist-profile__actions">
                <button type="button">View Track Trace <span>↗</span></button>
                <button type="button">Add Moment <span>＋</span></button>
              </div>
            </div>
          </div>

          <aside className="artist-profile__portrait" aria-label={`${artist.name} listening portrait`}>
            <div className="artist-profile__portrait-head">
              <div>
                <p className="artist-profile__label">LISTENING PORTRAIT</p>
                <h2>Afterglow Hours</h2>
              </div>
              <span aria-hidden="true">TS · 01</span>
            </div>

            <div className="artist-profile__portrait-time">
              <span>MOST ACTIVE TIME</span>
              <strong>23:10</strong>
              <p>하루가 조용해진 뒤, 가장 많은 기억이 이 음악에 머뭅니다.</p>
            </div>

            <div className="artist-profile__portrait-moods">
              <div>
                <span>REFLECTIVE</span><strong>64%</strong>
                <i><b style={{ width: "64%" }} /></i>
              </div>
              <div>
                <span>ROMANTIC</span><strong>48%</strong>
                <i><b style={{ width: "48%" }} /></i>
              </div>
              <div>
                <span>ENERGETIC</span><strong>31%</strong>
                <i><b style={{ width: "31%" }} /></i>
              </div>
            </div>

            <div className="artist-profile__portrait-foot">
              <span>RECENT MOMENT WORDS</span>
              <div><b>rainy drive</b><b>midnight</b><b>recovery</b></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="artist-profile__summary artist-profile__content-section">
        <div className="artist-profile__heading">
          <p className="artist-profile__label">LISTENER ARCHIVE</p>
          <h2>Artist Moment Summary</h2>
          <p className="artist-profile__section-description">리스너들이 {artist.name}의 음악과 함께 남긴 시간과 감정의 기록입니다.</p>
        </div>
        <div className="artist-profile__summary-grid">
          <article>
            <div className="artist-profile__summary-card-head"><small>ARTIST MOMENT SUMMARY</small><span>01</span></div>
            <div className="artist-profile__summary-card-body">
              <strong>12,842</strong><p>moments collected</p>
              <div className="artist-profile__summary-meter"><i style={{ width: "78%" }} /></div>
            </div>
            <div className="artist-profile__summary-card-foot"><span>+ 18% THIS MONTH</span><small>LISTENER ARCHIVE</small></div>
          </article>
          <article>
            <div className="artist-profile__summary-card-head"><small>MOST REMEMBERED TIME</small><span>02</span></div>
            <div className="artist-profile__summary-card-body">
              <strong>23:10</strong><p>late night listening</p>
              <div className="artist-profile__summary-time-dots" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            </div>
            <div className="artist-profile__summary-card-foot"><span>NIGHT · AFTERGLOW</span><small>PEAK LISTENING</small></div>
          </article>
          <article>
            <div className="artist-profile__summary-card-head"><small>ARTIST MOMENT TAGS</small><span>03</span></div>
            <div className="artist-profile__summary-card-body artist-profile__summary-card-body--tags">
              <div className="artist-profile__tag-cloud"><b>#NIGHT</b><b>#LOVE</b><b>#MEMORY</b><b>#DRIVE</b></div>
              <p>기억과 밤의 장면이 가장 자주 함께 기록됩니다.</p>
            </div>
            <div className="artist-profile__summary-card-foot"><span>42 ACTIVE TAGS</span><small>UPDATED TODAY</small></div>
          </article>
        </div>
      </section>

      <section className="artist-profile__featured artist-profile__content-section">
        <div className="artist-profile__heading artist-profile__heading--row">
          <div>
            <p className="artist-profile__label">FROM LISTENER MOMENTS</p>
            <h2>Featured Tracks in Moments</h2>
            <p className="artist-profile__section-description">리스너들의 순간 속에서 자주 재생된 {artist.name}의 곡들을 모았습니다.</p>
          </div>
          {!isPhone && <span>DRAG TO EXPLORE →</span>}
        </div>
        <div className="artist-profile__track-flow" aria-label="Featured tracks horizontal list">
          {featuredTracks.map((track, index) => (
            <article
              className="artist-profile__track-card"
              data-tempy-playable
              data-tempy-id={track.id}
              data-tempy-title={track.title}
              data-tempy-artist={track.artist}
              data-tempy-cover={track.cover}
              data-tempy-duration={track.duration}
              key={`${track.id}-${index}`}
            >
              <img src={track.cover} alt="" />
              <div className="artist-profile__track-copy"><small>{String(index + 1).padStart(2, "0")} · FEATURED TRACK</small><h3>{track.title}</h3><p>{track.artist}</p></div>
              <div className="artist-profile__track-meta">
                <span>{track.time}<small>MOMENT</small></span>
                <div className="artist-profile__track-meta-bottom"><span>♥ {track.likes}</span><button type="button">PLAY <b aria-hidden="true">▶</b></button></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-profile__route artist-profile__content-section">
        <div className="artist-profile__heading">
          <p className="artist-profile__label">A DAY WITH THE ARTIST</p><h2>Artist Route</h2>
          <p className="artist-profile__section-description">시간의 흐름을 따라 {artist.name}의 서로 다른 장면을 만나보세요.</p>
        </div>
        <div className="artist-profile__timeline">
          {routeMoments.map((moment, index) => (
            <article key={moment.time}>
              <span className="artist-profile__timeline-number">0{index + 1}</span>
              <button
                className="artist-profile__route-play"
                type="button"
                aria-label={`${moment.title}, ${moment.time} moment 재생`}
                onClick={() => playRouteMoment(moment)}
              >
                <img src={moment.cover} alt={`${moment.title} album cover`} />
              </button>
              <div><small>{moment.label}</small><strong>{moment.time}</strong></div>
            </article>
          ))}
        </div>
      </section>

      <section className="artist-profile__library">
        <article className="artist-profile__release">
          <div className="artist-profile__heading">
            <p className="artist-profile__label">NEW FROM {artist.name.toUpperCase()}</p>
            <h2>Latest Release</h2>
            <p className="artist-profile__section-description">{artist.name}의 새로운 발매작과 함께 이어지는 감정의 흐름을 확인해보세요.</p>
          </div>
          <div
            className="artist-profile__release-card"
            data-tempy-playable
            data-tempy-id={latestTrack.id}
            data-tempy-title={latestTrack.title}
            data-tempy-artist={latestTrack.artist}
            data-tempy-cover={latestTrack.cover}
            data-tempy-duration={latestTrack.duration}
          >
            <img src={latestAlbum.cover} alt={latestAlbum.title} />
            <div className="artist-profile__release-copy"><small>ALBUM · {latestAlbum.releaseDate}</small><h3>{latestAlbum.title}</h3><p>{artistTracks.length} Songs</p><button type="button">PLAY ALBUM <span>▶</span></button></div>
          </div>
        </article>

        <article className="artist-profile__most-left">
          <div className="artist-profile__heading">
            <p className="artist-profile__label">LISTENER ARCHIVE</p>
            <h2>Most Left Tracks</h2>
            <p className="artist-profile__section-description">리스너들이 가장 많이 남긴 곡과 순간의 기록을 순서대로 보여줍니다.</p>
          </div>
          <div className="artist-profile__filters" role="tablist" aria-label="Most left track filters">
            {leftTrackFilters.map((filter) => (
              <button
                className={activeTrackFilter === filter ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={activeTrackFilter === filter}
                aria-controls="artist-most-left-tracks"
                key={filter}
                onClick={() => setActiveTrackFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <ol className="artist-profile__track-list" id="artist-most-left-tracks" role="tabpanel">
            {leftTracksByFilter[activeTrackFilter].map((track) => <li data-tempy-playable data-tempy-id={track.id} data-tempy-title={track.title} data-tempy-artist={track.artist} data-tempy-cover={track.cover} data-tempy-duration={track.duration} key={`${activeTrackFilter}-${track.number}`}><span>{track.number}</span><strong>{track.title}<small>{track.artist}</small></strong><time>{track.time}</time><span>♥ {track.likes}</span><button type="button">▶</button></li>)}
          </ol>
        </article>
      </section>

      <section className="artist-profile__report artist-profile__content-section">
        <div className="artist-profile__heading">
          <p className="artist-profile__label">FROM THE ARCHIVE</p>
          <h2>Artist Moment Report</h2>
          <p className="artist-profile__section-description">시간, 감정, 태그를 바탕으로 {artist.name}의 리스닝 흐름을 정리했습니다.</p>
        </div>
        <div className="artist-profile__report-grid">
          <div className="artist-profile__trace-reports">
            {artistReports.map((report) => (
              <article key={report.number}>
                <header className="artist-profile__report-card-head">
                  <span>{report.number}</span>
                  <span>ARCHIVE SIGNAL</span>
                </header>
                <div className="artist-profile__report-card-core">
                  <small>{report.label}</small>
                  <strong>{report.value}</strong>
                </div>
                <div className="artist-profile__report-card-note">
                  <span>ARCHIVE NOTE</span>
                  <p>{report.note}</p>
                </div>
                <div className="artist-profile__report-card-meta">
                  {report.meta.map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}
                </div>
                <footer className="artist-profile__report-card-foot">
                  <span>{artist.name.toUpperCase()} LISTENER ARCHIVE</span>
                  <small>UPDATED TODAY</small>
                </footer>
              </article>
            ))}
          </div>
          <div className="artist-profile__ranking">
            <div className="artist-profile__ranking-heading"><p className="artist-profile__label">TOP 05</p><h3>Track Moment Ranking</h3></div>
            {rankingTracks.map((track, index) => {
              const isExpanded = expandedTrackIndex === index;

              return (
                <div className={`artist-profile__ranking-accordion${isExpanded ? " artist-profile__ranking-accordion--open" : ""}`} key={track.title}>
                  <article className="artist-profile__ranking-row" data-tempy-playable data-tempy-id={track.id} data-tempy-title={track.title} data-tempy-artist={track.artist} data-tempy-cover={track.cover} data-tempy-duration={track.duration}>
                    <span>0{index + 1}</span>
                    <img src={track.cover} alt="" />
                    <strong>{track.title}<small>{track.artist}</small></strong>
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
                      <div className="artist-profile__ranking-detail-media">
                        <img className="artist-profile__ranking-cover" src={track.cover} alt={`${track.title} album cover`} />
                        <p className="artist-profile__ranking-kicker">TRACK MOMENT · 0{index + 1}</p>
                        <h4>{track.title}</h4>
                        <p className="artist-profile__ranking-artist">{track.artist}</p>
                      </div>

                      <div className="artist-profile__ranking-detail-copy">
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

      <TempyFooter className="artist-profile__footer" />
    </main>
  );
}

export default ArtistProfile;
