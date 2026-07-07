import { Link, useNavigate } from "react-router-dom";
import { consumeReturnLocation, setPendingScrollRestore } from "../utils/returnLocation";

function DiscoverTrackTrace() {
  const navigate = useNavigate();
  const tracks = [
    {
      image: "/images/album-01.png",
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      comments: 128,
    },
    {
      image: "/images/album-02.png",
      title: "Confetti Dream",
      artist: "HONNE",
      comments: 84,
    },
    {
      image: "/images/album-03.png",
      title: "Upside Mood",
      artist: "Ariana Grande",
      comments: 56,
    },
    {
      image: "/images/album-04.png",
      title: "Traveler",
      artist: "Wave Club",
      comments: 73,
    },
    {
      image: "/images/album-05.png",
      title: "Night Walk",
      artist: "HYUKOH",
      comments: 92,
    },
    {
      image: "/images/album-06.png",
      title: "The Fate of Ophelia",
      artist: "Taylor Swift",
      comments: 141,
    },
    {
      image: "/images/album-07.png",
      title: "Coffee at Dawn",
      artist: "beabadoobee",
      comments: 67,
    },
    {
      image: "/images/album-08.png",
      title: "Puppet Show",
      artist: "XG",
      comments: 88,
    },
    {
      image: "/images/album-09.png",
      title: "City Light",
      artist: "ADOY",
      comments: 61,
    },
    {
      image: "/images/album-10.png",
      title: "Late Blue",
      artist: "Night Loop",
      comments: 49,
    },
  ];

  const handleBackToDiscover = () => {
    const returnLocation = consumeReturnLocation();

    if (!returnLocation) {
      navigate(-1);
      return;
    }

    setPendingScrollRestore(returnLocation.scrollY);
    navigate(`${returnLocation.pathname}${returnLocation.search}`, { replace: true });
  };

  return (
    <main className="track-trace-detail">
      <section className="track-trace-detail__intro">
        <button className="track-trace-detail__back" type="button" aria-label="Discover로 돌아가기" onClick={handleBackToDiscover}>
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
          <span>10 TRACKS</span>
        </div>

        <div className="track-trace-detail__track">
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
                <span className="track-trace-detail__number">{String(index + 1).padStart(2, "0")}</span>
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
