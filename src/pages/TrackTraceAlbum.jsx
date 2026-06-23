import { Link, useNavigate } from "react-router-dom";

const albumFlow = [
  { number: "01", label: "OPENING", title: "First Light", length: "00:00 — 11:42" },
  { number: "02", label: "SPOTLIGHT", title: "Main Stage", length: "11:43 — 27:18" },
  { number: "03", label: "AFTERGLOW", title: "Final Scene", length: "27:19 — 41:06" },
];

const tracklist = [
  { number: "01", title: "The Fate of Ophelia", duration: "03:24" },
  { number: "02", title: "Showgirl", duration: "03:18" },
  { number: "03", title: "Under the Spotlight", duration: "03:42" },
  { number: "04", title: "Velvet Curtain", duration: "03:06" },
  { number: "05", title: "Backstage Heart", duration: "03:31" },
  { number: "06", title: "Encore", duration: "03:27" },
];

const listeningOrder = [
  { time: "07:20", label: "MORNING", text: "A quiet opening" },
  { time: "13:45", label: "AFTERNOON", text: "Into the spotlight" },
  { time: "19:30", label: "EVENING", text: "The brightest scene" },
  { time: "23:10", label: "NIGHT", text: "After the curtain" },
];

function TrackTraceAlbum() {
  const navigate = useNavigate();

  return (
    <main className="track-trace-album">
      <section className="track-trace-album__hero">
        <button className="track-trace-album__back" type="button" aria-label="Track detail로 돌아가기" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO TRACK DETAIL</span>
        </button>

        <div className="track-trace-album__hero-grid">
          <div className="track-trace-album__cover">
            <img src="/images/album-01.png" alt="The Life of A Showgirl album cover" />
            <span>ALBUM · 2025</span>
          </div>

          <div className="track-trace-album__intro">
            <Link className="track-trace-album__artist-link" to="/artist/taylor-swift">
              <img src="/images/album-01.png" alt="Taylor Swift" />
              <span>Taylor Swift</span>
              <span aria-hidden="true">›</span>
            </Link>
            <p className="track-trace-album__eyebrow">Taylor Swift · Studio Album</p>
            <h1>The Life of<br />A Showgirl</h1>

            <dl className="track-trace-album__meta">
              <div><dt>RELEASE</dt><dd>October 3, 2025</dd></div>
              <div><dt>TRACKS</dt><dd>12 Songs</dd></div>
              <div><dt>RUN TIME</dt><dd>41 min 06 sec</dd></div>
              <div><dt>LANGUAGE</dt><dd>English</dd></div>
            </dl>

            <p className="track-trace-album__description">
              무대 위의 찬란한 순간과 막이 내린 뒤의 고요함을 하나의 흐름으로 엮은 앨범입니다.
              화려한 장면 사이에 남겨진 감정과 시간의 결을 따라 천천히 감상해보세요.
            </p>

            <div className="track-trace-album__actions">
              <button type="button"><span aria-hidden="true">▶</span> PLAY ALBUM</button>
              <button type="button">KEEP ALBUM <span aria-hidden="true">＋</span></button>
            </div>
          </div>
        </div>
      </section>

      <section className="track-trace-album__overview">
        <div className="track-trace-album__flow">
          <div className="track-trace-album__section-head">
            <p>LISTENING STRUCTURE</p>
            <h2>Album Flow</h2>
          </div>

          <div className="track-trace-album__flow-list">
            {albumFlow.map((flow) => (
              <article key={flow.number}>
                <span>{flow.number}</span>
                <div><p>{flow.label}</p><h3>{flow.title}</h3></div>
                <time>{flow.length}</time>
              </article>
            ))}
          </div>
        </div>

        <div className="track-trace-album__tracks">
          <div className="track-trace-album__section-head">
            <p>12 SONGS · 41:06</p>
            <h2>Tracklist</h2>
          </div>

          <ol className="track-trace-album__tracklist">
            {tracklist.map((track) => (
              <li key={track.number}>
                <span>{track.number}</span>
                <strong>{track.title}</strong>
                <time>{track.duration}</time>
                <span aria-hidden="true">▶</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="track-trace-album__timeline">
        <div className="track-trace-album__section-head">
          <p>FROM MORNING TO NIGHT</p>
          <h2>Moment Listening Order</h2>
        </div>
        <p className="track-trace-album__timeline-description">
          하루의 시간에 따라 달라지는 앨범의 장면을 순서대로 만나보세요.
        </p>

        <div className="track-trace-album__timeline-track">
          {listeningOrder.map((moment, index) => (
            <article key={moment.time}>
              <span className="track-trace-album__timeline-dot" />
              <small>0{index + 1} · {moment.label}</small>
              <h3>{moment.time}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="track-trace-album__footer">
        <div>
          <p>ONE ALBUM, A DAY OF MOMENTS</p>
          <strong>Listen through time.</strong>
        </div>
        <div className="track-trace-album__footer-links">
          <span>DISCOVER</span>
          <span>CURATOR</span>
          <span>ARCHIVE</span>
        </div>
        <small>© 2026 TEMPY! MUSIC ARCHIVE</small>
      </footer>
    </main>
  );
}

export default TrackTraceAlbum;
