const clusters = [
  {
    time: "07:00 — 10:00",
    label: "MORNING",
    count: 642,
    quote: "창문으로 들어오는 아침빛과 가장 잘 어울렸던 노래.",
  },
  {
    time: "12:00 — 15:00",
    label: "AFTERNOON",
    count: 518,
    quote: "평범한 오후를 영화의 한 장면처럼 바꿔주었어요.",
  },
  {
    time: "18:00 — 21:00",
    label: "EVENING",
    count: 731,
    quote: "집으로 돌아가는 길, 오래 기억하고 싶은 순간.",
  },
  {
    time: "22:00 — 02:00",
    label: "NIGHT",
    count: 414,
    quote: "잠들지 못한 밤에 조용히 곁을 지켜준 음악.",
  },
];

function TrackTraceDetail() {
  return (
    <main className="track-comment-detail">
      <aside className="track-comment-detail__song">
        <button className="track-comment-detail__back" type="button" aria-label="Track Trace로 돌아가기">
          <span aria-hidden="true">←</span>
          <span>BACK TO TRACK TRACE</span>
        </button>

        <div className="track-comment-detail__album">
          <img src="/images/album-03.png" alt="BIRDS OF A FEATHER album cover" />
          <span>01</span>
        </div>

        <div className="track-comment-detail__song-copy">
          <p>TRACK TRACE</p>
          <h1>BIRDS OF A FEATHER</h1>
          <span>Billie Eilish</span>
        </div>

        <div className="track-comment-detail__actions">
          <button className="track-comment-detail__play" type="button">
            <span aria-hidden="true">▶</span> PLAY
          </button>
          <button className="track-comment-detail__keep" type="button">
            KEEP <span aria-hidden="true">＋</span>
          </button>
        </div>
      </aside>

      <section className="track-comment-detail__comments">
        <header className="track-comment-detail__header">
          <p>SAME SONG · DIFFERENT MOMENTS</p>
          <h2>2,305 Comments</h2>
          <span>
            같은 노래에 머문 서로 다른 시간들을 살펴보세요.<br />
            코멘트는 비슷한 시간대의 장면끼리 모여 있습니다.
          </span>
        </header>

        <div className="track-comment-detail__cluster">
          <div className="track-comment-detail__filters" aria-label="Comment filters">
            <span className="track-comment-detail__filter track-comment-detail__filter--active">ALL TIME</span>
            <span className="track-comment-detail__filter">WEATHER</span>
            <span className="track-comment-detail__filter">LOCATION</span>
            <span className="track-comment-detail__filter">MOOD</span>
          </div>

          <div className="track-comment-detail__cluster-grid">
            {clusters.map((cluster, index) => (
              <article className="track-comment-detail__cluster-card" key={cluster.label}>
                <div className="track-comment-detail__cluster-top">
                  <span>0{index + 1}</span>
                  <span>{cluster.count} COMMENTS</span>
                </div>
                <div className="track-comment-detail__cluster-time">
                  <p>{cluster.label}</p>
                  <h3>{cluster.time}</h3>
                </div>
                <p className="track-comment-detail__quote">“{cluster.quote}”</p>
                <div className="track-comment-detail__cluster-foot">
                  <span>TIME CLUSTER</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default TrackTraceDetail;
