function Now() {
  const queue = [
    {
      image: "/images/album-02.png",
      title: "Drop dead",
      artist: "Only Astrologic",
      time: "19:42",
    },
    {
      image: "/images/album-03.png",
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      time: "19:38",
    },
    {
      image: "/images/album-06.png",
      title: "Confetti Dream",
      artist: "HONNE",
      time: "19:35",
    },
    {
      image: "/images/album-08.png",
      title: "Upside Mood",
      artist: "Ariana Grande",
      time: "19:31",
    },
  ];

  return (
    <main className="now-page">
      <section className="now-page__intro">
        <p className="now-page__eyebrow">LIVE MOMENT</p>
        <h1 className="now-page__title">Now Clock</h1>
        <p className="now-page__description">
          지금 이 시간, 같은 날씨와 위치에서 사람들이 듣고 있는 음악을 만나보세요.
        </p>
        <div className="now-page__tags" aria-label="현재 위치와 날씨">
          <span className="now-page__tag">● 서울 강북구</span>
          <span className="now-page__tag">☂ 비 · 18°C</span>
        </div>
      </section>

      <section className="now-page__content" aria-label="Now Clock music">
        <article className="now-page__selected">
          <div className="now-page__card-heading">
            <div>
              <span>SELECTED NOW</span>
              <h2>19:42</h2>
            </div>
            <span className="now-page__live">LIVE</span>
          </div>

          <div className="now-page__selected-body">
            <div className="now-page__cover-wrap">
              <img
                className="now-page__selected-cover"
                src="/images/album-01.png"
                alt="The Fate of Ophelia album cover"
              />
              <span className="now-page__cover-number">01</span>
            </div>
            <div className="now-page__track-info">
              <p>NOW PLAYING</p>
              <h3>The Fate of Ophelia</h3>
              <span>Taylor Swift</span>
            </div>
          </div>

          <div className="now-page__player">
            <button type="button" aria-label="Previous track">↤</button>
            <button className="now-page__play" type="button" aria-label="Play">▶</button>
            <button type="button" aria-label="Next track">↦</button>
            <div className="now-page__progress"><span /></div>
            <time>03:24</time>
          </div>
        </article>

        <article className="now-page__queue">
          <div className="now-page__queue-heading">
            <div>
              <span>TODAY · 2026.05.16</span>
              <h2>Today&rsquo;s Now Queue</h2>
            </div>
            <span>{queue.length} TRACKS</span>
          </div>

          <div className="now-page__queue-list">
            {queue.map((track, index) => (
              <div className="now-page__queue-item" key={track.title}>
                <span className="now-page__queue-number">{String(index + 2).padStart(2, "0")}</span>
                <img src={track.image} alt={`${track.title} album cover`} />
                <div className="now-page__queue-copy">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>
                <time>{track.time}</time>
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
