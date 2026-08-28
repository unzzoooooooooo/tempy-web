import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlayIcon } from "../components/TempyIcons";
import { trackTraceTracks } from "../data/musicCatalog";
import { useLiveContext } from "../utils/context";
import { createRecommendationSeed, hashSeed, seededShuffle } from "../utils/recommendations";

function DiscoverTrackTrace() {
  const navigate = useNavigate();
  const { context } = useLiveContext();
  const shuffleSeed = createRecommendationSeed(context, "trackTrace");
  const tracks = useMemo(() => (
    seededShuffle(trackTraceTracks, shuffleSeed).map((track) => ({
      ...track,
      comments: 48 + (hashSeed(track.id) % 83),
    }))
  ), [shuffleSeed]);

  const getTrackRouteState = (track, index) => ({
    track: {
      id: track.id,
      trackId: track.id,
      albumId: track.albumId,
      artistId: track.artistId,
      title: track.title,
      artist: track.artist,
      cover: track.cover,
      duration: track.duration,
      number: String(index + 1).padStart(2, "0"),
    },
  });

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
            <span>{tracks.length} TRACKS</span>
          </div>

          <div className="track-trace-detail__track split-page-panel__content split-archive-panel__viewport">
            {tracks.map((track, index) => (
              <article
                className="track-trace-detail__card"
                data-tempy-playable
                data-tempy-title={track.title}
                data-tempy-artist={track.artist}
                data-tempy-cover={track.cover}
                data-tempy-id={track.id}
                key={track.id}
              >
                <div className="track-trace-detail__artwork">
                  <img src={track.cover} alt={`${track.title} album cover`} />
                  <div className="track-trace-detail__artwork-meta">
                    <button type="button" aria-label={`${track.title} 재생`}>
                      <PlayIcon /> PLAY
                    </button>
                    <span>COMMENTS {track.comments}</span>
                  </div>
                  <span className="track-trace-detail__number">0{index + 1}</span>
                </div>

                <div className="track-trace-detail__card-info">
                  <img src={track.cover} alt="" aria-hidden="true" />
                  <div className="track-trace-detail__card-copy">
                    <p>TRACK TRACE</p>
                    <h2>{track.title}</h2>
                    <span>{track.artist}</span>
                  </div>
                  <Link
                    className="track-trace-detail__arrow"
                    to={`/discover/track-trace/detail/${track.id}`}
                    state={getTrackRouteState(track, index)}
                    data-tempy-navigation-control
                    aria-label={`${track.title} 코멘트 보기`}
                  >
                    <span aria-hidden="true">→</span>
                  </Link>
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
