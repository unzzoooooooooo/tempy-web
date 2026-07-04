import { Link } from "react-router-dom";

function Discover() {
  return (
    <main className="discover-page">
      <section className="discover-page__intro">
        <p className="discover-page__eyebrow">DISCOVER</p>
        <h1 className="discover-page__title">Discover Time</h1>
        <p className="discover-page__description">
          같은 순간의 다른 노래, 같은 노래에 남은 서로 다른 순간을 발견해보세요.
        </p>
      </section>

      <div className="discover-page__showcase">
        <section className="discover-page__visual" aria-hidden="true">
          <div className="discover-page__record discover-page__record--left">
            <span className="discover-page__record-hole" />
          </div>
          <div className="discover-page__record discover-page__record--right">
            <span className="discover-page__record-hole" />
          </div>
        </section>

        <section className="discover-page__cards" aria-label="Discover modes">
          <Link className="discover-page__card" to="/discover/time-set">
            <div className="discover-page__card-topline">
              <span>01</span>
              <span>SAME TIME · DIFFERENT SONGS</span>
            </div>
            <div className="discover-page__card-copy">
              <h2>Time Set</h2>
              <p>
                같은 시간과 날씨, 위치 안에서<br />
                다른 사람들이 선택한 음악을 감상해보세요.
              </p>
            </div>
            <div className="discover-page__card-bottom">
              <span>같은 순간의 노래 듣기</span>
              <span className="discover-page__arrow">↗</span>
            </div>
          </Link>

          <Link className="discover-page__card" to="/discover/track-trace">
            <div className="discover-page__card-topline">
              <span>02</span>
              <span>SAME SONG · DIFFERENT MOMENTS</span>
            </div>
            <div className="discover-page__card-copy">
              <h2>Track Trace</h2>
              <p>
                하나의 노래가 다른 사람에게<br />
                어떤 시간과 장면으로 남았는지 따라가보세요.
              </p>
            </div>
            <div className="discover-page__card-bottom">
              <span>같은 노래의 순간 보기</span>
              <span className="discover-page__arrow">↗</span>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Discover;
