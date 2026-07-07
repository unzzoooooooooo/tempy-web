import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { consumeReturnLocation, setPendingScrollRestore } from "../utils/returnLocation";

const timeSetRecords = [
  {
    cover: "/images/album-22.png",
    title: "The Fate of Ophelia",
    artist: "Taylor Swift",
    color: "#2759ed",
  },
  {
    cover: "/images/album-23.png",
    title: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
    color: "#ff343c",
  },
  {
    cover: "/images/album-24.png",
    title: "Confetti Dream",
    artist: "HONNE",
    color: "#f2cb28",
  },
  {
    cover: "/images/album-25.png",
    title: "Upside Mood",
    artist: "Ariana Grande",
    color: "#1f9c75",
  },
];

function DiscoverTimeSet() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAlbum, setShowAlbum] = useState(false);
  const lastWheelTime = useRef(0);
  const activeRecord = timeSetRecords[activeIndex];

  const moveCarousel = (direction) => {
    setShowAlbum(false);
    setActiveIndex((currentIndex) => (
      currentIndex + direction + timeSetRecords.length
    ) % timeSetRecords.length);
  };

  const handleWheel = (event) => {
    const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    if (Math.abs(movement) < 8) return;

    const now = Date.now();
    if (now - lastWheelTime.current < 650) return;

    lastWheelTime.current = now;
    moveCarousel(movement > 0 ? 1 : -1);
  };

  const getRecordPosition = (index) => {
    if (index === activeIndex) return "active";
    if (index === (activeIndex - 1 + timeSetRecords.length) % timeSetRecords.length) return "previous";
    if (index === (activeIndex + 1) % timeSetRecords.length) return "next";
    return "hidden";
  };

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
    <main className="time-set-detail">
      <section className="time-set-detail__intro">
        <button className="time-set-detail__back" type="button" aria-label="Discover로 돌아가기" onClick={handleBackToDiscover}>
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

      <section
        className="time-set-detail__records time-set-carousel"
        aria-label="Time Set records"
        onWheel={handleWheel}
      >
        {timeSetRecords.map((record, index) => {
          const position = getRecordPosition(index);
          const isActive = position === "active";

          return (
            <div
              className={`time-set-detail__main-record time-set-carousel__item time-set-carousel__item--${position}`}
              style={{ "--time-set-lp-color": record.color }}
              aria-hidden={!isActive}
              key={record.title}
            >
              <div className="time-set-detail__vinyl time-set-carousel__vinyl">
                <span className="time-set-detail__groove time-set-detail__groove--outer" />
                <span className="time-set-detail__groove time-set-detail__groove--inner" />

                {isActive ? (
                  <button
                    className={`time-set-detail__record-center time-set-interaction__trigger ${showAlbum ? "time-set-interaction__trigger--active" : ""}`}
                    type="button"
                    aria-label={showAlbum ? `${activeRecord.title} by ${activeRecord.artist}` : "Time Set 앨범 보기"}
                    onClick={() => setShowAlbum(true)}
                  >
                    {showAlbum ? (
                      <span className="time-set-interaction__cover">
                        <img src={activeRecord.cover} alt={`${activeRecord.title} album cover`} />
                        <span className="time-set-interaction__overlay">
                          <strong>{activeRecord.title}</strong>
                          <small>{activeRecord.artist}</small>
                        </span>
                      </span>
                    ) : (
                      <>
                        <span>TIME</span>
                        <strong>SET</strong>
                        <small>ENTER ↗</small>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="time-set-carousel__side-center" aria-hidden="true">
                    <span>TIME</span>
                    <strong>SET</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="time-set-carousel__status" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(timeSetRecords.length).padStart(2, "0")}</span>
        </div>
      </section>
    </main>
  );
}

export default DiscoverTimeSet;
