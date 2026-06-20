function Curator() {
  const curatorTypes = [
    {
      number: "01",
      title: "Lifestyle Curator",
      description: "취향과 일상의 장면을 음악으로 기록하는 큐레이터",
      tone: "red",
    },
    {
      number: "02",
      title: "Artist Curator",
      description: "아티스트가 직접 고른 순간과 영감의 플레이리스트",
      tone: "blue",
    },
    {
      number: "03",
      title: "Similar Curator",
      description: "나와 비슷한 시간과 음악 취향을 가진 큐레이터",
      tone: "yellow",
    },
  ];

  return (
    <main className="curator-page">
      <section className="curator-page__intro">
        <p className="curator-page__eyebrow">CURATOR</p>
        <h1 className="curator-page__title">Moment Curator</h1>
        <p className="curator-page__description">
          저마다의 시간과 취향을 음악으로 기록하는 큐레이터를 만나보세요.
        </p>
      </section>

      <section className="curator-page__gallery" aria-label="Moment curator categories">
        <div className="curator-page__track">
          {curatorTypes.map((curator) => (
            <article className="curator-page__item" key={curator.title}>
              <div className={`curator-page__record curator-page__record--${curator.tone}`}>
                <span className="curator-page__groove curator-page__groove--outer" />
                <span className="curator-page__groove curator-page__groove--inner" />
                <div className="curator-page__record-label">
                  <span>{curator.number}</span>
                  <strong>Tempy!</strong>
                  <small>MOMENT CURATOR</small>
                </div>
                <span className="curator-page__record-hole" />
              </div>

              <div className="curator-page__item-copy">
                <span>{curator.number} / 03</span>
                <h2>{curator.title}</h2>
                <p>{curator.description}</p>
                <span className="curator-page__item-arrow" aria-hidden="true">↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Curator;
