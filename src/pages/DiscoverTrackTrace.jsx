import { Link, useNavigate } from "react-router-dom";

function DiscoverTrackTrace() {
  const navigate = useNavigate();
  const tracks = [
    {
      image: "/images/album-19.png",
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      comments: 128,
    },
    {
      image: "/images/album-20.png",
      title: "Confetti Dream",
      artist: "HONNE",
      comments: 84,
    },
    {
      image: "/images/album-21.png",
      title: "Upside Mood",
      artist: "Ariana Grande",
      comments: 56,
    },
    {
      image: "/images/album-22.png",
      title: "Night Walk",
      artist: "HYUKOH",
      comments: 72,
    },
    {
      image: "/images/album-23.png",
      title: "Soft Static",
      artist: "Yerin Baek",
      comments: 91,
    },
    {
      image: "/images/album-24.png",
      title: "First Light",
      artist: "Crush",
      comments: 64,
    },
    {
      image: "/images/album-25.png",
      title: "Lazy Orbit",
      artist: "AKMU",
      comments: 77,
    },
    {
      image: "/images/album-26.png",
      title: "Late Checkout",
      artist: "JANNABI",
      comments: 118,
    },
    {
      image: "/images/album-27.png",
      title: "City Bloom",
      artist: "LE SSERAFIM",
      comments: 69,
    },
    {
      image: "/images/album-28.png",
      title: "Warm Noise",
      artist: "Daniel Caesar",
      comments: 83,
    },
    {
      image: "/images/album-29.png",
      title: "Moon Receipt",
      artist: "SZA",
      comments: 95,
    },
    {
      image: "/images/album-30.png",
      title: "Amber Drive",
      artist: "DPR IAN",
      comments: 61,
    },
    {
      image: "/images/album-31.png",
      title: "Rain Check",
      artist: "Keshi",
      comments: 74,
    },
    {
      image: "/images/album-32.jpg",
      title: "Quiet Frame",
      artist: "Laufey",
      comments: 102,
    },
  ];

  return (
    <main className="track-trace-detail">
      <section className="track-trace-detail__intro">
        <button className="track-trace-detail__back detail-back-link" type="button" aria-label="Discover로 돌아가기" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO DISCOVER</span>
        </button>

        <div className="track-trace-detail__copy">
          <p className="track-trace-detail__eyebrow">SAME SONG · DIFFERENT MOMENTS</p>
          <h1 className="track-trace-detail__title">Track Trace</h1>
          <p className="track-trace-detail__description">
            하나의 노래가 다른 사람에게<br />
            어떤 시간과 장면으로 남았는지 따라가보세요.
          </p>
        </div>

        <p className="track-trace-detail__index">02 / 02</p>
      </section>

      <section className="track-trace-detail__gallery split-page-panel split-archive-panel" aria-label="Track Trace albums">
        <div className="split-page-panel__inner split-archive-panel__inner track-trace-detail__gallery-inner">
          <div className="track-trace-detail__gallery-heading split-page-panel__header split-archive-panel__header">
            <span>TRACK ARCHIVE</span>
            <span>14 TRACKS</span>
          </div>

          <div className="track-trace-detail__track split-page-panel__content split-archive-panel__viewport">
            {tracks.map((track, index) => (
              <article
                className="track-trace-detail__card"
                data-tempy-playable
                data-tempy-title={track.title}
                data-tempy-artist={track.artist}
                data-tempy-cover={track.image}
                key={track.title}
              >
              <div className="track-trace-detail__artwork">
                <img src={track.image} alt={`${track.title} album cover`} />
                <div className="track-trace-detail__artwork-meta">
                  <button type="button" aria-label={`${track.title} 재생`}>
                    <span aria-hidden="true">▶</span> PLAY
                  </button>
                  <span>COMMENTS {track.comments}</span>
                </div>
                <span className="track-trace-detail__number">0{index + 1}</span>
              </div>

              <div className="track-trace-detail__card-info">
                <img src={track.image} alt="" aria-hidden="true" />
                <div className="track-trace-detail__card-copy">
                  <p>TRACK TRACE</p>
                  <h2>{track.title}</h2>
                  <span>{track.artist}</span>
                </div>
                {index === 0 ? (
                  <Link
                    className="track-trace-detail__arrow"
                    to="/discover/track-trace/detail"
                    aria-label={`${track.title} 코멘트 보기`}
                  >
                    →
                  </Link>
                ) : (
                  <button className="track-trace-detail__arrow" type="button" aria-label={`${track.title} 보기`}>
                    →
                  </button>
                )}
              </div>
              </article>
            ))}
          </div>

          <p className="track-trace-detail__hint split-page-panel__footer split-archive-panel__footer">DRAG TO EXPLORE&nbsp;&nbsp; →</p>
        </div>
      </section>
    </main>
  );
}

export default DiscoverTrackTrace;
