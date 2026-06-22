import { Link } from "react-router-dom";

function DiscoverTrackTrace() {
  const tracks = [
    {
      image: "/images/album-03.png",
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      comments: 128,
    },
    {
      image: "/images/album-06.png",
      title: "Confetti Dream",
      artist: "HONNE",
      comments: 84,
    },
    {
      image: "/images/album-08.png",
      title: "Upside Mood",
      artist: "Ariana Grande",
      comments: 56,
    },
  ];

  return (
    <main className="track-trace-detail">
      <section className="track-trace-detail__intro">
        <button className="track-trace-detail__back" type="button" aria-label="Discover로 돌아가기">
          <span aria-hidden="true">←</span>
          <span>BACK TO DISCOVER</span>
        </button>

        <div className="track-trace-detail__copy">
          <p className="track-trace-detail__eyebrow">SAME SONG · DIFFERENT MOMENTS</p>
          <h1 className="track-trace-detail__title">Track<br />Trace</h1>
          <p className="track-trace-detail__description">
            하나의 노래가 다른 사람에게<br />
            어떤 시간과 장면으로 남았는지 따라가보세요.
          </p>
        </div>

        <p className="track-trace-detail__index">02 / 02</p>
      </section>

      <section className="track-trace-detail__gallery" aria-label="Track Trace albums">
        <div className="track-trace-detail__gallery-heading">
          <span>TRACK ARCHIVE</span>
          <span>03 TRACKS</span>
        </div>

        <div className="track-trace-detail__track">
          {tracks.map((track, index) => (
            <article className="track-trace-detail__card" key={track.title}>
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

        <p className="track-trace-detail__hint">DRAG TO EXPLORE&nbsp;&nbsp; →</p>
      </section>
    </main>
  );
}

export default DiscoverTrackTrace;
