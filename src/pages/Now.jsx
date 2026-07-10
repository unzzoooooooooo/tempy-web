import { useEffect, useState } from "react";
import { getTimeLabel, useContextRecommendations } from "../utils/context";

const parseDuration = (duration) => {
  const [minutes = "0", seconds = "0"] = duration.split(":");
  return Number(minutes) * 60 + Number(seconds);
};

function Now() {
  const { context, tracks } = useContextRecommendations(10);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const safeTrackIndex = tracks.length ? selectedTrackIndex % tracks.length : 0;
  const selectedTrack = tracks[safeTrackIndex] || tracks[0];
  const durationSeconds = parseDuration(selectedTrack.duration);
  const progressPercent = durationSeconds ? Math.min((elapsedSeconds / durationSeconds) * 100, 100) : 0;

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const progressTimer = window.setInterval(() => {
      setElapsedSeconds((current) => {
        if (current + 1 >= durationSeconds) {
          window.clearInterval(progressTimer);
          setIsPlaying(false);
          return durationSeconds;
        }

        return current + 1;
      });
    }, 1000);

    return () => window.clearInterval(progressTimer);
  }, [durationSeconds, isPlaying]);

  const moveTrack = (direction) => {
    if (!tracks.length) {
      return;
    }

    setSelectedTrackIndex((current) => {
      const nextIndex = (current + direction + tracks.length) % tracks.length;
      return nextIndex;
    });
    setElapsedSeconds(0);
  };

  const togglePlayback = () => {
    setIsPlaying((current) => {
      if (current) {
        return false;
      }

      setElapsedSeconds(0);
      return true;
    });
  };

  const queue = Array.from({ length: 15 }, (_, index) => {
    const track = tracks[(index + 1) % tracks.length];
    return {
      ...track,
      id: `${track.id}-now-queue-${index + 1}`,
    };
  });
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
            <button
              className="now-page__skip"
              type="button"
              aria-label="Previous track"
              data-now-player-control
              onClick={() => moveTrack(-1)}
            >
              ↤
            </button>
            <button
              className="now-page__play"
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              aria-pressed={isPlaying}
              data-now-player-control
              onClick={togglePlayback}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>
            <button
              className="now-page__skip"
              type="button"
              aria-label="Next track"
              data-now-player-control
              onClick={() => moveTrack(1)}
            >
              ↦
            </button>
            <div className="now-page__progress"><span style={{ width: `${progressPercent}%` }} /></div>
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
