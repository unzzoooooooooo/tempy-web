function DiscoverTimeSet() {
  return (
    <main className="time-set-detail">
      <section className="time-set-detail__intro">
        <button className="time-set-detail__back" type="button" aria-label="Discover로 돌아가기">
          <span aria-hidden="true">←</span>
          <span>BACK TO DISCOVER</span>
        </button>

        <div className="time-set-detail__copy">
          <p className="time-set-detail__eyebrow">SAME TIME · DIFFERENT SONGS</p>
          <h1 className="time-set-detail__title">Time Set</h1>
          <p className="time-set-detail__description">
            같은 시간과 날씨, 위치 안에서<br />
            다른 사람들이 선택한 음악을 감상해보세요.
          </p>
        </div>

        <p className="time-set-detail__index">01 / 02</p>
      </section>

      <section className="time-set-detail__records" aria-label="Time Set records">
        <div className="time-set-detail__side-record time-set-detail__side-record--left" aria-hidden="true">
          <span />
        </div>

        <div className="time-set-detail__main-record">
          <div className="time-set-detail__vinyl">
            <span className="time-set-detail__groove time-set-detail__groove--outer" />
            <span className="time-set-detail__groove time-set-detail__groove--inner" />
            <button className="time-set-detail__record-center" type="button" aria-label="Time Set 선택">
              <span>TIME</span>
              <strong>SET</strong>
              <small>ENTER ↗</small>
            </button>
          </div>
        </div>

        <div className="time-set-detail__side-record time-set-detail__side-record--right" aria-hidden="true">
          <span />
        </div>
      </section>
    </main>
  );
}

export default DiscoverTimeSet;
