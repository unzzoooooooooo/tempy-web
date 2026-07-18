import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const similarPlaylists = [
  {
    title: "20년차 카페 사장님의 새벽 플레이리스트",
    author: "새벽의 점장",
    meta: "12곡 · 42 min",
    likes: "1.5k",
    tracks: [
      { title: "Coffee at Dawn", artist: "beabadoobee", cover: "/images/album-10.png" },
      { title: "Velvet Morning", artist: "The Marias", cover: "/images/album-11.png" },
      { title: "Afterglow", artist: "Wave to Earth", cover: "/images/album-12.png" },
    ],
  },
  {
    title: "퇴근 후 골목을 천천히 걷는 디자이너",
    author: "낮은 조도",
    meta: "10곡 · 34 min",
    likes: "982",
    tracks: [
      { title: "City Light", artist: "ADOY", cover: "/images/album-13.png" },
      { title: "Window Seat", artist: "Rex Orange County", cover: "/images/album-14.png" },
      { title: "Night Walk", artist: "HYUKOH", cover: "/images/moment-01.png" },
    ],
  },
  {
    title: "비 오는 날 서점 문을 여는 사람",
    author: "책등 사이",
    meta: "11곡 · 39 min",
    likes: "1.2k",
    tracks: [
      { title: "Paper Rain", artist: "Laufey", cover: "/images/album-15.png" },
      { title: "Quiet Hours", artist: "Men I Trust", cover: "/images/album-16.png" },
      { title: "First Page", artist: "HONNE", cover: "/images/moment-02.png" },
    ],
  },
  {
    title: "첫차를 기다리는 방송 작가의 메모",
    author: "새벽 원고",
    meta: "9곡 · 31 min",
    likes: "744",
    tracks: [
      { title: "Blue Hour", artist: "TXT", cover: "/images/album-17.png" },
      { title: "Slow Motion", artist: "Laufey", cover: "/images/album-18.png" },
      { title: "Last Scene", artist: "Silica Gel", cover: "/images/moment-03.png" },
    ],
  },
  {
    title: "낡은 필름 카메라를 들고 떠난 주말",
    author: "35mm",
    meta: "13곡 · 46 min",
    likes: "1.1k",
    tracks: [
      { title: "Golden Roll", artist: "The Marias", cover: "/images/album-19.png" },
      { title: "Summer Film", artist: "AKMU", cover: "/images/moment-04.png" },
      { title: "Soft Focus", artist: "ADOY", cover: "/images/album-20.png" },
    ],
  },
  {
    title: "식물을 돌보며 하루를 시작하는 편집자",
    author: "초록 문장",
    meta: "10곡 · 36 min",
    likes: "889",
    tracks: [
      { title: "Green Room", artist: "Wave to Earth", cover: "/images/album-21.png" },
      { title: "Sunny Side", artist: "백예린", cover: "/images/moment-05.png" },
      { title: "Bloom", artist: "LUCY", cover: "/images/album-22.png" },
    ],
  },
  {
    title: "작은 바에서 마감 불을 끄는 바텐더",
    author: "마지막 잔",
    meta: "12곡 · 44 min",
    likes: "1.4k",
    tracks: [
      { title: "Last Call", artist: "The Black Skirts", cover: "/images/album-23.png" },
      { title: "Amber Light", artist: "Crush", cover: "/images/moment-06.png" },
      { title: "Goodnight", artist: "DPR IAN", cover: "/images/album-24.png" },
    ],
  },
  {
    title: "도시락을 싸는 엄마의 조용한 오전",
    author: "따뜻한 칸",
    meta: "8곡 · 28 min",
    likes: "638",
    tracks: [
      { title: "Kitchen Light", artist: "Hozier", cover: "/images/album-25.png" },
      { title: "Small Table", artist: "Stella Jang", cover: "/images/album-26.png" },
      { title: "Warm Rice", artist: "10CM", cover: "/images/album-27.png" },
    ],
  },
  {
    title: "혼자 여행 온 밤의 게스트하우스",
    author: "낯선 방",
    meta: "14곡 · 49 min",
    likes: "1.0k",
    tracks: [
      { title: "Hostel Blue", artist: "JANNABI", cover: "/images/moment-01.png" },
      { title: "Map Fold", artist: "The Marias", cover: "/images/album-28.png" },
      { title: "Far Window", artist: "검정치마", cover: "/images/album-29.png" },
    ],
  },
  {
    title: "새 프로젝트를 시작하는 개발자의 심야",
    author: "빌드 완료",
    meta: "11곡 · 41 min",
    likes: "920",
    tracks: [
      { title: "Deep Work", artist: "FKJ", cover: "/images/album-30.png" },
      { title: "Midnight Push", artist: "O3ohn", cover: "/images/moment-02.png" },
      { title: "New Branch", artist: "HONNE", cover: "/images/album-31.png" },
    ],
  },
];

function SimilarCurator() {
  const navigate = useNavigate();
  const [translateX, setTranslateX] = useState(0);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const translateRef = useRef(0);
  const maxTranslateRef = useRef(0);
  const pendingWheelDelta = useRef(0);
  const wheelFrame = useRef(null);
  const inputEndTimer = useRef(null);
  const dragState = useRef(null);

  const moveTo = (nextTranslate) => {
    const clamped = Math.min(maxTranslateRef.current, Math.max(0, nextTranslate));
    translateRef.current = clamped;
    setTranslateX(clamped);
  };

  useEffect(() => {
    const updateRange = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      const rightPadding = 70;
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

      const horizontalInput = Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.45;
      let movement = horizontalInput ? event.deltaX * 1.35 : event.deltaY;

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

      const eventLimit = horizontalInput ? 128 : 90;
      const frameLimit = horizontalInput ? 190 : 136;
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

    setIsDirectInput(true);
    moveTo(drag.startTranslate - distance);
  };

  const endDrag = (event) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDirectInput(false);
  };

  return (
    <main className="similar-curator">
      <button
        className="similar-curator__back detail-back-link"
        type="button"
        onClick={() => navigate("/curator")}
      >
        <span aria-hidden="true">←</span>
        <span>BACK TO CURATOR</span>
      </button>

      <aside className="similar-curator__intro">
        <p className="similar-curator__eyebrow">MOMENT CURATOR · 03</p>
        <h1>Similar Curator</h1>
        <p>당신이 살아보지 못한 순간의 삶을 사는 사람들의 다양한 음악을 감상해보세요</p>
        <span className="similar-curator__watermark" aria-hidden="true">T</span>
      </aside>

      <section
        className="similar-curator__viewport"
        ref={viewportRef}
        aria-label="Similar curator playlists"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          className={`similar-curator__track${isDirectInput ? " similar-curator__track--direct" : ""}`}
          ref={trackRef}
          style={{ transform: `translateX(${-translateX}px)` }}
        >
          {similarPlaylists.map((playlist, index) => (
            <article
              className="similar-curator__card"
              key={`${playlist.title}-${index}`}
              style={{ "--similar-card-index": index }}
            >
              <span className="similar-curator__tab" aria-hidden="true" />
              <div className="similar-curator__card-top">
                <span className="similar-curator__number">
                  {String(index + 1).padStart(2, "0")} / {String(similarPlaylists.length).padStart(2, "0")}
                </span>
                <h2>{playlist.title}</h2>
                <p>CURATED BY {playlist.author}</p>
                <div className="similar-curator__meta">
                  <span>{playlist.meta}</span>
                  <span>♡ {playlist.likes}</span>
                </div>
              </div>

              <div className="similar-curator__card-bottom">
                <div className="similar-curator__tracks">
                  {playlist.tracks.map((track) => (
                    <div className="similar-curator__song" key={`${playlist.title}-${track.title}`}>
                      <img src={track.cover} alt="" draggable="false" />
                      <div>
                        <strong>{track.title}</strong>
                        <span>{track.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="similar-curator__actions">
                  <button type="button" aria-label={`${playlist.title} 재생`}>
                    <span aria-hidden="true">▶</span>
                    PLAY
                  </button>
                  <button type="button" aria-label={`${playlist.title} 셔플`}>⌘</button>
                  <button type="button" aria-label={`${playlist.title} 좋아요`}>♡</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default SimilarCurator;
