import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { lifestylePlaylists, lifestylePlaylistThemes } from "../data/lifestylePlaylists";

function LifestyleCurator() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const archiveRef = useRef(null);
  const dragState = useRef(null);
  const didDrag = useRef(false);

  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 480px)").matches) return;
    window.scrollTo(0, 0);
  }, []);

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

  const openPlaylist = (playlist) => {
    navigate(`/curator/lifestyle/playlist?playlist=${playlist.id}`, {
      state: { playlistId: playlist.id },
    });
  };

  return (
    <main className="lifestyle-curator">
      <aside className="lifestyle-curator__intro">
        <button className="lifestyle-curator__back detail-back-link" type="button" onClick={() => navigate("/curator")}>
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
                className={`lifestyle-curator__card lifestyle-curator__card--${playlist.tone} lifestyle-curator__card--clickable`}
                style={{
                  "--archive-bg": lifestylePlaylistThemes[playlist.tone].background,
                  "--archive-ink": lifestylePlaylistThemes[playlist.tone].ink,
                  "--archive-muted": lifestylePlaylistThemes[playlist.tone].muted,
                  "--archive-line": lifestylePlaylistThemes[playlist.tone].line,
                }}
                key={`${playlist.title}-${index}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!didDrag.current) openPlaylist(playlist);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openPlaylist(playlist);
                  }
                }}
              >
                <span className="lifestyle-curator__clip lifestyle-curator__clip--left" />
                <span className="lifestyle-curator__clip lifestyle-curator__clip--right" />

                <div className="lifestyle-curator__card-main">
                  <div className="lifestyle-curator__card-copy">
                    <span>PLAYLIST · {String(index + 1).padStart(2, "0")}</span>
                    <h2 className="lifestyle-curator__card-title">{playlist.title}</h2>
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
