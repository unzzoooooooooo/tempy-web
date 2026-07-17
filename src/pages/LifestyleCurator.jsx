import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const lifestylePlaylists = [
  { title: "20년차 카페 사장님의 새벽 플레이리스트", cover: "/images/album-10.png" },
  { title: "비 오는 날 오래 머무는 창가의 음악", cover: "/images/album-11.png" },
  { title: "느린 일요일 아침을 위한 커피와 재즈", cover: "/images/album-12.png" },
  { title: "퇴근 후 혼자 걷는 한강의 저녁", cover: "/images/album-13.png" },
  { title: "작은 서점의 문을 여는 첫 번째 노래", cover: "/images/album-14.png" },
  { title: "늦은 밤 주방에서 만드는 따뜻한 한 끼", cover: "/images/album-15.png" },
  { title: "도시를 벗어나는 주말 드라이브", cover: "/images/album-16.png" },
  { title: "햇빛 좋은 오후의 식물과 레코드", cover: "/images/album-17.png" },
  { title: "집중이 필요한 디자이너의 작업실", cover: "/images/album-18.png" },
  { title: "여행 전날 밤 가방을 싸며 듣는 음악", cover: "/images/album-19.png" },
  { title: "친구들과 나누는 늦은 여름의 식탁", cover: "/images/moment-05.png" },
  { title: "불을 낮춘 방에서 하루를 닫는 순간", cover: "/images/moment-06.png" },
];

const cardTones = ["soft-blue", "slate-blue", "navy", "blue"];

function LifestyleCurator() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const archiveRef = useRef(null);
  const dragState = useRef(null);
  const didDrag = useRef(false);

  const updateProgress = () => {
    const archive = archiveRef.current;
    if (!archive) return;
    const maxScroll = archive.scrollWidth - archive.clientWidth;
    setScrollProgress(maxScroll > 0 ? archive.scrollLeft / maxScroll : 0);
  };

  const handlePointerDown = (event) => {
    if (window.innerWidth < 1101 || (event.pointerType === "mouse" && event.button !== 0)) return;
    didDrag.current = false;
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: archiveRef.current?.scrollLeft ?? 0,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    const archive = archiveRef.current;
    if (!drag || !archive || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 5 && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    didDrag.current = true;
    archive.scrollLeft = drag.startScroll - distance;
  };

  const endDrag = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
  };

  return (
    <main className="lifestyle-curator">
      <aside className="lifestyle-curator__intro">
        <button className="lifestyle-curator__back" type="button" onClick={() => navigate("/curator")}>
          <span aria-hidden="true">←</span>
          <span>BACK TO CURATOR</span>
        </button>

        <div className="lifestyle-curator__intro-copy">
          <p className="lifestyle-curator__eyebrow">MOMENT CURATOR · 01</p>
          <h1>Lifestyle<br />{" "}Curator</h1>
          <p>
            일상의 취향과 장면을 음악으로 기록하는 사람들의 플레이리스트를 만나보세요.
            익숙한 하루가 조금 다르게 들리는 순간을 모았습니다.
          </p>
        </div>

        <span className="lifestyle-curator__count">12 PLAYLISTS</span>
      </aside>

      <div className="lifestyle-curator__archive split-page-panel split-archive-panel">
        <div className="split-page-panel__inner split-archive-panel__inner lifestyle-curator__archive-inner">
          <div className="lifestyle-curator__archive-head split-page-panel__header split-archive-panel__header" aria-hidden="true">
            <span>PLAYLIST ARCHIVE</span>
            <span>01 — 12</span>
          </div>

          <section
            className="lifestyle-curator__grid split-page-panel__content split-archive-panel__viewport"
            ref={archiveRef}
            aria-label="Lifestyle curator playlists"
            onScroll={updateProgress}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            {lifestylePlaylists.map((playlist, index) => (
              <article
                className={`lifestyle-curator__card lifestyle-curator__card--${cardTones[index % cardTones.length]}${index === 0 ? " lifestyle-curator__card--clickable" : ""}`}
                key={`${playlist.title}-${index}`}
                role={index === 0 ? "button" : undefined}
                tabIndex={index === 0 ? 0 : undefined}
                onClick={index === 0 ? () => {
                  if (!didDrag.current) navigate("/curator/lifestyle/playlist");
                } : undefined}
                onKeyDown={index === 0 ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate("/curator/lifestyle/playlist");
                  }
                } : undefined}
              >
                <span className="lifestyle-curator__clip lifestyle-curator__clip--left" />
                <span className="lifestyle-curator__clip lifestyle-curator__clip--right" />
                {index === 0 && <span className="lifestyle-curator__ribbon">EDITOR'S PICK</span>}

                <div className="lifestyle-curator__card-main">
                  <div className="lifestyle-curator__card-copy">
                    <span>PLAYLIST · {String(index + 1).padStart(2, "0")}</span>
                    <h2>{playlist.title}</h2>
                    <div className="lifestyle-curator__host">
                      <span>H</span>
                      <strong>hostless</strong>
                    </div>
                  </div>

                  <div className="lifestyle-curator__lp">
                    <span className="lifestyle-curator__lp-line lifestyle-curator__lp-line--outer" />
                    <span className="lifestyle-curator__lp-line lifestyle-curator__lp-line--inner" />
                    <img src={playlist.cover} alt="" />
                    <span className="lifestyle-curator__lp-hole" />
                  </div>
                </div>

                <div className="lifestyle-curator__play-rail">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <button type="button" aria-label={`${playlist.title} 재생`}>▶</button>
                  <small>TEMPY!</small>
                </div>
              </article>
            ))}
          </section>

          <div className="lifestyle-curator__explore split-page-panel__footer split-archive-panel__footer" aria-hidden="true">
            <div className="lifestyle-curator__scroll-line">
              <span style={{ transform: `scaleX(${0.08 + scrollProgress * 0.92})` }} />
            </div>
            <span>DRAG TO EXPLORE →</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LifestyleCurator;
