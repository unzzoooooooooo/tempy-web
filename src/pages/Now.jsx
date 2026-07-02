import { getTimeLabel, useContextRecommendations } from "../utils/context";

function Now() {
  const { context, tracks } = useContextRecommendations(6);
  const selectedTrack = tracks[0];
  const queue = tracks.slice(1, 6);
  const weatherSummary = `${context.weatherLabel} · ${context.temperature}`;

  return (
    <main className="now-page">
      <section className="now-page__intro">
        <p className="now-page__eyebrow">LIVE MOMENT</p>
        <h1 className="now-page__title">Now Clock</h1>
        <p className="now-page__description">
          지금 이 시간, 같은 날씨와 위치에서 사람들이 듣고 있는 음악을 만나보세요.
        </p>
        <div className="now-page__tags" aria-label="시간, 위치, 날씨 기반 추천 정보">
          <span className="now-page__tag">{context.currentTime}</span>
          <span className="now-page__tag">{context.currentDate}</span>
          <span className="now-page__tag">{context.locationLabel}</span>
          <span className="now-page__tag">{weatherSummary}</span>
          <span className="now-page__tag">{getTimeLabel(context.timeTag)}</span>
        </div>
      </section>

      <section className="now-page__content" aria-label="Now Clock music">
        <article
          className="now-page__selected"
          data-tempy-playable
          data-tempy-id={selectedTrack.id}
          data-tempy-title={selectedTrack.title}
          data-tempy-artist={selectedTrack.artist}
          data-tempy-cover={selectedTrack.cover || selectedTrack.image}
          data-tempy-duration={selectedTrack.duration}
        >
          <div className="now-page__card-heading">
            <div>
              <span>SELECTED NOW</span>
              <h2>{context.currentTime}</h2>
            </div>
            <span className="now-page__live">LIVE</span>
          </div>

          <div className="now-page__selected-body">
            <div className="now-page__cover-wrap">
              <img
                className="now-page__selected-cover"
                src={selectedTrack.cover || selectedTrack.image}
                alt={`${selectedTrack.title} album cover`}
              />
              <span className="now-page__cover-number">01</span>
            </div>
            <div className="now-page__track-info">
              <p>{selectedTrack.moodText}</p>
              <h3>{selectedTrack.title}</h3>
              <span>{selectedTrack.artist}</span>
            </div>
          </div>

          <div className="now-page__player">
            <button type="button" aria-label="Previous track">↤</button>
            <button className="now-page__play" type="button" aria-label="Play">▶</button>
            <button type="button" aria-label="Next track">↦</button>
            <div className="now-page__progress"><span /></div>
            <time>{selectedTrack.duration}</time>
          </div>
        </article>

        <article className="now-page__queue">
          <div className="now-page__queue-heading">
            <div>
              <span>TODAY · {context.currentDate} {context.dayLabel}</span>
              <h2>Today&rsquo;s Now Queue</h2>
            </div>
            <span>{queue.length} TRACKS</span>
          </div>

          <div className="now-page__queue-list">
            {queue.map((track, index) => (
              <div
                className="now-page__queue-item"
                data-tempy-playable
                data-tempy-id={track.id}
                data-tempy-title={track.title}
                data-tempy-artist={track.artist}
                data-tempy-cover={track.cover || track.image}
                data-tempy-duration={track.duration}
                key={track.id}
              >
                <span className="now-page__queue-number">{String(index + 2).padStart(2, "0")}</span>
                <img src={track.cover || track.image} alt={`${track.title} album cover`} />
                <div className="now-page__queue-copy">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>
                <time>{track.duration}</time>
                <button type="button" aria-label={`Play ${track.title}`}>▶</button>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default Now;
