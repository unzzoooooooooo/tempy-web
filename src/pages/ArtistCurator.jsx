import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const artistPlaylists = [
  {
    title: "JENNIE'S RUBY MOMENTS",
    artist: "JENNIE",
    meta: "12곡 · 38 min",
    likes: "2.8k",
    author: "JENNIE",
    image: "/images/artist-01.png",
  },
  {
    title: "SAILING THROUGH SUMMER",
    artist: "AKMU",
    meta: "10곡 · 31 min",
    likes: "2.1k",
    author: "AKMU",
    image: "/images/artist-02.png",
  },
  {
    title: "THE WAY I SEE THE NIGHT",
    artist: "한로로",
    meta: "11곡 · 42 min",
    likes: "1.7k",
    author: "HANRORO",
    image: "/images/artist-03.png",
  },
  {
    title: "CITY LIGHTS AFTER MIDNIGHT",
    artist: "Wave to Earth",
    meta: "13곡 · 47 min",
    likes: "1.5k",
    author: "WAVE TO EARTH",
    image: "/images/artist-04.png",
  },
  {
    title: "A QUIET SUNDAY MORNING",
    artist: "Laufey",
    meta: "9곡 · 29 min",
    likes: "1.3k",
    author: "LAUFEY",
    image: "/images/artist-05.png",
  },
  {
    title: "WINDOWS DOWN, MUSIC UP",
    artist: "The Marías",
    meta: "14곡 · 51 min",
    likes: "1.1k",
    author: "THE MARÍAS",
    image: "/images/artist-06.png",
  },
  {
    title: "BLUE HOUR DIARY",
    artist: "ADOY",
    meta: "10곡 · 36 min",
    likes: "984",
    author: "ADOY",
    image: "/images/artist-07.png",
  },
  {
    title: "SONGS FOR LONG WALKS",
    artist: "백예린",
    meta: "12곡 · 44 min",
    likes: "912",
    author: "YERIN BAEK",
    image: "/images/moment-03.png",
  },
  {
    title: "OUR LITTLE ESCAPE",
    artist: "HYUKOH",
    meta: "8곡 · 27 min",
    likes: "845",
    author: "HYUKOH",
    image: "/images/moment-04.png",
  },
  {
    title: "FIRST LIGHT, LAST SONG",
    artist: "검정치마",
    meta: "11곡 · 40 min",
    likes: "806",
    author: "THE BLACK SKIRTS",
    image: "/images/moment-06.png",
  },
];

function ArtistCurator() {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const pendingWheelDelta = useRef(0);
  const wheelFrame = useRef(null);
  const inputEndTimer = useRef(null);
  const dragState = useRef(null);
  const didDrag = useRef(false);

  const moveTo = (nextTranslate) => {
    const clamped = Math.min(maxTranslateRef.current, Math.max(0, nextTranslate));
    translateRef.current = clamped;
    setTranslateX(clamped);
    setScrollProgress(maxTranslateRef.current > 0 ? clamped / maxTranslateRef.current : 0);
  };

  useEffect(() => {
    const updateRange = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const rightPadding = 52;
      const nextMax = Math.max(0, track.scrollWidth - viewport.clientWidth + rightPadding);
      maxTranslateRef.current = nextMax;
      moveTo(Math.min(translateRef.current, nextMax));
    };

    updateRange();
    const observer = new ResizeObserver(updateRange);
    observer.observe(viewportRef.current);
    observer.observe(trackRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const horizontalInput = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.5;
      let movement = horizontalInput ? event.deltaX : event.deltaY;

      if (!horizontalInput && event.deltaMode === WheelEvent.DOM_DELTA_LINE) movement *= 18;
      if (!horizontalInput && event.deltaMode === WheelEvent.DOM_DELTA_PAGE) movement *= viewport.clientWidth;
      if (Math.abs(movement) < 1) return;

      if (horizontalInput) {
        setIsDirectInput(true);
        if (inputEndTimer.current !== null) window.clearTimeout(inputEndTimer.current);
        inputEndTimer.current = window.setTimeout(() => {
          inputEndTimer.current = null;
          setIsDirectInput(false);
        }, 100);
      }

      const eventLimit = horizontalInput ? 120 : 82;
      const frameLimit = horizontalInput ? 180 : 116;
      const limitedMovement = Math.max(-eventLimit, Math.min(eventLimit, movement));
      pendingWheelDelta.current = Math.max(
        -frameLimit,
        Math.min(frameLimit, pendingWheelDelta.current + limitedMovement),
      );

      if (wheelFrame.current !== null) return;
      wheelFrame.current = window.requestAnimationFrame(() => {
        moveTo(translateRef.current + pendingWheelDelta.current);
        pendingWheelDelta.current = 0;
        wheelFrame.current = null;
      });
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", handleWheel);
      if (wheelFrame.current !== null) window.cancelAnimationFrame(wheelFrame.current);
      if (inputEndTimer.current !== null) window.clearTimeout(inputEndTimer.current);
    };
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    didDrag.current = false;
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTranslate: translateRef.current,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragState.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) < 5 && !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    didDrag.current = true;
    setIsDirectInput(true);
    moveTo(drag.startTranslate - distance);
  };

  const endDrag = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  return (
    <main className="artist-curator">
      <button
        className="artist-curator__back detail-back-link"
        type="button"
        onClick={() => navigate("/curator")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO CURATOR</span>
      </button>

      <aside className="artist-curator__intro">
        <p className="artist-curator__eyebrow">MOMENT CURATOR · 02</p>
        <h1>Artist Curator</h1>
        <p>당신이 살아보지 못한 순간의 삶을 사는 사람들의<br />{" "}다양한 음악을 감상해보세요</p>
        <span className="artist-curator__wordmark" aria-hidden="true">ARTIST</span>
      </aside>

      <div className="artist-curator__archive split-page-panel split-archive-panel">
        <div className="artist-curator__archive-inner split-page-panel__inner split-archive-panel__inner">
          <div
            className="artist-curator__archive-head split-page-panel__header split-archive-panel__header"
            aria-hidden="true"
          >
            <span>PLAYLIST ARCHIVE</span>
            <span>01 — {String(artistPlaylists.length).padStart(2, "0")}</span>
          </div>

          <section
            className="artist-curator__viewport split-page-panel__content split-archive-panel__viewport"
            ref={viewportRef}
            aria-label="Artist curator playlists"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onDragStart={(event) => event.preventDefault()}
          >
            <div
              className={`artist-curator__track${isDirectInput ? " artist-curator__track--direct" : ""}`}
              ref={trackRef}
              style={{ transform: `translateX(${-translateX}px)` }}
            >
              {artistPlaylists.map((playlist, index) => (
                <article
                  className="artist-curator__card"
                  key={`${playlist.artist}-${playlist.title}`}
                  style={{
                    "--artist-card-index": index,
                    cursor: index === 0 ? "pointer" : undefined,
                  }}
                  role={index === 0 ? "button" : undefined}
                  tabIndex={index === 0 ? 0 : undefined}
                  aria-label={index === 0 ? "제니의 아티스트 플레이리스트 상세 보기" : undefined}
                  onClick={index === 0 ? () => {
                    if (didDrag.current) {
                      didDrag.current = false;
                      return;
                    }
                    navigate("/curator/artist/playlist");
                  } : undefined}
                  onKeyDown={index === 0 ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate("/curator/artist/playlist");
                    }
                  } : undefined}
                >
                  <div className="artist-curator__card-copy">
                    <span className="artist-curator__card-number">
                      {String(index + 1).padStart(2, "0")} / {String(artistPlaylists.length).padStart(2, "0")}
                    </span>
                    <h2>{playlist.title}</h2>
                    <p>{playlist.artist}</p>
                    <div className="artist-curator__card-meta">
                      <span>{playlist.meta}</span>
                      <span>♡ {playlist.likes}</span>
                    </div>
                    <div className="artist-curator__author">
                      <span>{playlist.author.slice(0, 1)}</span>
                      <strong>CURATED BY {playlist.author}</strong>
                    </div>
                  </div>
                  <div className="artist-curator__image">
                    <img src={playlist.image} alt={`${playlist.artist} 아티스트 큐레이터`} draggable="false" />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div
            className="artist-curator__explore split-page-panel__footer split-archive-panel__footer"
            aria-hidden="true"
          >
            <div className="artist-curator__scroll-line">
              <span style={{ transform: `scaleX(${0.08 + scrollProgress * 0.92})` }} />
            </div>
            <span>DRAG TO EXPLORE →</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ArtistCurator;
