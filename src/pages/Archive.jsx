import { useEffect, useRef, useState } from "react";
import TempyFooter from "../components/TempyFooter";
import { getTracksByIds, normalizeMusicItem } from "../data/musicCatalog";
import { artistImages, profileImages } from "../data/imageCatalog";

const CREATED_ITEMS_KEY = "tempyCreatedItems";
const archiveDefaultTags = ["비", "버스", "성북구"];
const archiveVisibilityOptions = ["전체 공개", "팔로워만", "비공개"];
const archiveTrackItems = getTracksByIds([
  "fate-of-ophelia",
  "birds-of-a-feather",
  "gone-are-the-days",
  "super-shy",
]).map((track, index) => ({
  ...track,
  id: index + 1,
  trackId: track.id,
  time: track.duration.replace(/^0/, ""),
}));
const archiveTrackVisuals = Object.fromEntries(archiveTrackItems.map((track, index) => [
  track.id,
  {
    artist: track.artist,
    cover: track.cover,
    moment: ["RAINY EVENING", "NIGHT WALK", "CITY WINDOW", "SLOW AFTERNOON"][index],
  },
]));

const archiveDayRecords = {
  3: {
    date: "2026.05.03 SUN",
    tags: ["늦은오후", "한강", "산책"],
    summary: "바람이 느리게 불던 오후, 강변을 걸으며 오래 들은 곡들",
    totalTracks: 18,
    mood: "느긋함",
    situation: "한강 산책",
    tracks: [
      { title: "Jane&the boys", artist: "The Volunteers", cover: "/images/album-01.png" },
      { title: "Wave", artist: "wave to earth", cover: "/images/album-20.png" },
    ],
  },
  8: {
    date: "2026.05.08 FRI",
    tags: ["퇴근길", "버스", "노을"],
    summary: "노을이 길게 남은 퇴근길, 창밖을 보며 반복해 들은 음악",
    totalTracks: 21,
    mood: "차분함",
    situation: "버스 창가",
    tracks: [
      { title: "Confetti Dream", artist: "Sunset Rollercoaster", cover: "/images/album-03.png" },
      { title: "Warm on a Cold Night", artist: "HONNE", cover: "/images/album-21.png" },
    ],
  },
  12: {
    date: "2026.05.12 TUE",
    tags: ["집중", "작업실", "반복재생"],
    summary: "해야 할 일에 몰입하기 위해 리듬을 낮게 이어 붙인 오후",
    totalTracks: 27,
    mood: "몰입",
    situation: "작업 시간",
    tracks: [
      { title: "Upside Mood", artist: "HYUKOH", cover: "/images/album-04.png" },
      { title: "Square", artist: "Yerin Baek", cover: "/images/album-22.png" },
    ],
  },
  16: {
    date: "2026.05.16 SAT",
    tags: ["퇴근길", "비오는저녁", "서울", "혼자걷기"],
    summary: "비 오는 저녁, 혼자 걷는 순간에 가장 많이 들은 곡들",
    totalTracks: 24,
    mood: "고요함",
    situation: "비 오는 산책",
    tracks: [
      { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", cover: "/images/album-02.png" },
      { title: "Love Lee", artist: "AKMU", cover: "/images/album-06.png" },
      { title: "Let Me Go!", artist: "한로로", cover: "/images/album-17.png" },
    ],
  },
  21: {
    date: "2026.05.21 THU",
    tags: ["새벽", "방안", "블루아워"],
    summary: "잠들기 전 불을 낮추고 조용히 정리한 하루의 마지막 음악",
    totalTracks: 16,
    mood: "포근함",
    situation: "늦은 밤",
    tracks: [
      { title: "Only", artist: "LeeHi", cover: "/images/album-11.png" },
      { title: "From The Start", artist: "Laufey", cover: "/images/album-25.png" },
    ],
  },
  24: {
    date: "2026.05.24 SUN",
    tags: ["카페", "오후", "친구"],
    summary: "오래 머문 카페에서 대화 사이사이 함께 흘렀던 플레이리스트",
    totalTracks: 19,
    mood: "명랑함",
    situation: "주말 카페",
    tracks: [
      { title: "Super Shy", artist: "NewJeans", cover: "/images/album-14.png" },
      { title: "Plastic Love", artist: "Mariya Takeuchi", cover: "/images/album-23.png" },
    ],
  },
  29: {
    date: "2026.05.29 FRI",
    tags: ["월말", "귀가", "서울"],
    summary: "길었던 한 달을 마무리하며 천천히 집으로 돌아오던 밤의 기록",
    totalTracks: 21,
    mood: "후련함",
    situation: "늦은 귀가",
    tracks: [
      { title: "HOMESICK", artist: "wave to earth", cover: "/images/album-24.png" },
      { title: "Everything", artist: "The Black Skirts", cover: "/images/album-05.png" },
    ],
  },
};

const normalizedArchiveDayRecords = Object.fromEntries(
  Object.entries(archiveDayRecords).map(([day, record]) => [
    day,
    { ...record, tracks: record.tracks.map(normalizeMusicItem) },
  ]),
);

const readCreatedItems = () => {
  try {
    const items = JSON.parse(window.localStorage.getItem(CREATED_ITEMS_KEY) || "[]");
    return Array.isArray(items) ? items.slice().reverse() : [];
  } catch {
    return [];
  }
};

const formatCreatedDate = (createdAt) => {
  if (!createdAt) return "방금 전";
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "방금 전";

  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getCreatedTags = (data = {}) => (
  Array.isArray(data.selectedTags) && data.selectedTags.length ? data.selectedTags : ["Create"]
);

const getCreatedTitle = (item) => {
  if (item.type === "playlist") {
    return item.data?.playlistTitle || "Untitled Playlist";
  }

  return item.data?.selectedTrack?.title || "Moment Card";
};

const getCreatedDescription = (item) => {
  if (item.type === "playlist") {
    return item.data?.playlistDescription || "여러 곡이 하나의 순간으로 묶였어요.";
  }

  return item.data?.momentText || "지금의 순간이 카드로 저장되었어요.";
};

const getCreatedTracks = (item) => {
  const tracks = item.data?.selectedTracks;
  if (!Array.isArray(tracks)) return [];
  return tracks
    .map((track) => {
      if (typeof track === "object" && track !== null) return track;
      return archiveTrackItems.find((candidate) => candidate.id === track) || null;
    })
    .map((track) => normalizeMusicItem({ ...track, legacyId: track.id }))
    .filter(Boolean);
};

const getTrackDurationSeconds = (time = "") => {
  const [minutes, seconds] = String(time).split(":").map(Number);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0;
  return (minutes * 60) + seconds;
};

const formatPlaylistDuration = (tracks) => {
  const totalSeconds = tracks.reduce((total, track) => total + getTrackDurationSeconds(track.time), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const writeCreatedItems = (items) => {
  window.localStorage.setItem(CREATED_ITEMS_KEY, JSON.stringify(items));
};

const getStorageOrderItems = () => {
  try {
    const items = JSON.parse(window.localStorage.getItem(CREATED_ITEMS_KEY) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const readImageFile = (file, onLoad) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") onLoad(reader.result);
  };
  reader.readAsDataURL(file);
};

const toggleValue = (values, value) => (
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
);

function Archive() {
  const [createdItems, setCreatedItems] = useState(() => readCreatedItems());
  const [selectedCreatedId, setSelectedCreatedId] = useState(null);
  const [isEditingCreated, setIsEditingCreated] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedArchiveDate, setSelectedArchiveDate] = useState(null);
  const curatorScrollerRef = useRef(null);
  const artistScrollerRef = useRef(null);

  useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || event.key === CREATED_ITEMS_KEY) {
        setCreatedItems(readCreatedItems());
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!selectedArchiveDate) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedArchiveDate(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedArchiveDate]);

  const calendarDays = [
    "", "", "", "1", "2", "3", "4",
    "5", "6", "7", "8", "9", "10", "11",
    "12", "13", "14", "15", "16", "17", "18",
    "19", "20", "21", "22", "23", "24", "25",
    "26", "27", "28", "29", "30", "31", "",
  ];

  const tags = ["비 오는 저녁", "퇴근길", "새벽 감성", "서울", "혼자 걷기", "반복 재생"];

  const recommendedCurators = [
    { image: "/images/profile-01.png", name: "만두두왕", match: "92%", note: "RAINY EVENING" },
    { image: "/images/profile-02.png", name: "오늘은까눌레", match: "88%", note: "SOFT TEMPO" },
    { image: "/images/profile-03.png", name: "hostless", match: "84%", note: "CITY WALK" },
    { image: "/images/profile-06.png", name: "waveclub", match: "80%", note: "NIGHT LOOP" },
    { image: "/images/profile-08.png", name: "nightloop", match: "76%", note: "LATE MOOD" },
    { image: "/images/profile-04.png", name: "dawnzip", match: "72%", note: "DAWN ARCHIVE" },
    { image: "/images/profile-05.png", name: "rainyroom", match: "69%", note: "RAIN CURATOR" },
    { image: "/images/profile-07.png", name: "bluehour", match: "67%", note: "BLUE HOUR" },
    { image: profileImages[8], name: "slowtempo", match: "64%", note: "SLOW TEMPO" },
    { image: profileImages[1], name: "cloudtea", match: "61%", note: "CLOUD TEA" },
  ];

  const artists = [
    { image: artistImages[0], name: "Jennie", count: "32 TIMES" },
    { image: artistImages[1], name: "AKMU", count: "28 TIMES" },
    { image: artistImages[2], name: "한로로", count: "21 TIMES" },
    { image: artistImages[6], name: "Billie Eilish", count: "18 TIMES" },
    { image: artistImages[3], name: "Wave to Earth", count: "16 TIMES" },
    { image: artistImages[7], name: "HONNE", count: "15 TIMES" },
    { image: artistImages[5], name: "HYUKOH", count: "13 TIMES" },
    { image: artistImages[5], name: "The Marías", count: "12 TIMES" },
    { image: artistImages[4], name: "Men I Trust", count: "10 TIMES" },
    { image: artistImages[4], name: "Laufey", count: "9 TIMES" },
  ];

  const likedCurators = [
    { image: "/images/profile-04.png", name: "roomtone" },
    { image: "/images/profile-05.png", name: "bluehour" },
    { image: "/images/profile-07.png", name: "slowday" },
    { image: "/images/profile-03.png", name: "hostless" },
    { image: "/images/profile-01.png", name: "만두두왕" },
  ];

  const selectedCreatedItem = createdItems.find((item) => item.id === selectedCreatedId) || null;

  const scrollHorizontal = (scroller, event) => {
    if (!scroller) return;

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 2) return;

    event.preventDefault();
    const limitedDelta = Math.max(-140, Math.min(140, delta));
    scroller.scrollBy({ left: limitedDelta * 0.9, behavior: "smooth" });
  };

  const handleCuratorWheel = (event) => {
    scrollHorizontal(curatorScrollerRef.current, event);
  };

  const handleArtistWheel = (event) => {
    scrollHorizontal(artistScrollerRef.current, event);
  };

  const refreshCreatedItems = () => {
    setCreatedItems(readCreatedItems());
  };

  const handleSelectCreatedItem = (item) => {
    setSelectedCreatedId(item.id);
    setIsEditingCreated(false);
    window.scrollTo(0, 0);
  };

  const handleBackToArchive = () => {
    setSelectedCreatedId(null);
    setIsEditingCreated(false);
  };

  const handleDeleteCreatedItem = (itemId) => {
    if (!window.confirm("이 항목을 삭제할까요?")) return;
    const nextItems = getStorageOrderItems().filter((item) => item.id !== itemId);
    writeCreatedItems(nextItems);
    refreshCreatedItems();
    handleBackToArchive();
  };

  const handleSaveEditedItem = (itemId, data) => {
    const nextItems = getStorageOrderItems().map((item) => (
      item.id === itemId ? { ...item, data } : item
    ));
    writeCreatedItems(nextItems);
    refreshCreatedItems();
    setIsEditingCreated(false);
  };

  if (selectedCreatedItem) {
    return (
      <CreatedItemDetail
        item={selectedCreatedItem}
        isEditing={isEditingCreated}
        onBack={handleBackToArchive}
        onEdit={() => setIsEditingCreated(true)}
        onCancelEdit={() => setIsEditingCreated(false)}
        onDelete={() => handleDeleteCreatedItem(selectedCreatedItem.id)}
        onSave={(data) => handleSaveEditedItem(selectedCreatedItem.id, data)}
      />
    );
  }

  return (
    <main className="archive-page">
      <section className="archive-page__hero">
        <div className="archive-page__intro">
          <p className="archive-page__eyebrow">MY MUSIC ARCHIVE</p>
          <h1 className="archive-page__title">
            <span className="archive-title-label archive-title-label--desktop">Archive your time</span>
            <span className="archive-title-label archive-title-label--mobile">My Music Archive</span>
          </h1>
          <p className="archive-page__description">
            내가 어떤 시간에 어떤 음악을 들었는지 나만의 시간 기록으로 돌아보세요.
          </p>
          <label className="archive-page__year" aria-label="Selected year">
            <span>YEAR</span>
            <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <span aria-hidden="true">⌄</span>
          </label>
        </div>

        <div className="archive-page__calendar">
          <div className="archive-page__calendar-head">
            <div>
              <span>MAY</span>
              <strong>05</strong>
            </div>
            <p>31 DAYS · 146 TRACKS</p>
          </div>
          <div className="archive-page__weekdays">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="archive-page__days">
            {calendarDays.map((day, index) => (
              normalizedArchiveDayRecords[day] ? (
                <button
                  className={`archive-page__day archive-page__day--marked${day === "16" ? " archive-page__day--active" : ""}${selectedArchiveDate === day ? " archive-page__day--selected" : ""}`}
                  type="button"
                  key={`${day}-${index}`}
                  aria-label={`2026년 5월 ${day}일 음악 기록 보기`}
                  onClick={() => setSelectedArchiveDate(day)}
                >
                  <span>{day}</span>
                  <i aria-hidden="true" />
                </button>
              ) : (
                <div className="archive-page__day" key={`${day}-${index}`}>
                  {day && <span>{day}</span>}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="archive-page__section archive-page__tags-section">
        <div className="archive-page__section-head">
          <span>01</span>
          <div><h2>Your time tags</h2><p>이번 달 음악과 함께 가장 많이 남긴 순간</p></div>
        </div>
        <div className="archive-page__tags">
          {tags.map((tag, index) => <span key={tag}>{String(index + 1).padStart(2, "0")} · {tag}</span>)}
        </div>
      </section>

      <section className="archive-page__section">
        <div className="archive-page__section-head">
          <span>02</span>
          <div><h2 className="archive-page__section-title--galgo-mobile">Curators like you</h2><p>나와 가장 비슷한 시간과 취향을 가진 큐레이터</p></div>
        </div>
        <div
          className="archive-page__people archive-page__people--scroll"
          ref={curatorScrollerRef}
          onWheel={handleCuratorWheel}
        >
          {recommendedCurators.map((curator) => (
            <article className="archive-page__person" key={curator.name}>
              <div><img src={curator.image} alt={`${curator.name} profile`} /><span>{curator.match}</span></div>
              <strong>{curator.name}</strong><small>{curator.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-page__section">
        <div className="archive-page__section-head">
          <span>03</span>
          <div><h2 className="archive-page__section-title--galgo-mobile">Most played artists</h2><p>이번 달 가장 자주 찾은 아티스트</p></div>
        </div>
        <div
          className="archive-page__artists"
          ref={artistScrollerRef}
          onWheel={handleArtistWheel}
        >
          {artists.map((artist, index) => (
            <article className="archive-page__artist" key={artist.name}>
              <img src={artist.image} alt={artist.name} />
              <div><span>0{index + 1}</span><h3>{artist.name}</h3><small>{artist.count}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-page__section">
        <div className="archive-page__section-head">
          <span>04</span>
          <div><h2 className="archive-page__section-title--galgo-mobile">Curators you liked</h2><p>내가 좋아요를 남긴 큐레이터</p></div>
        </div>
        <div className="archive-page__people archive-page__people--liked">
          {likedCurators.map((curator) => (
            <article className="archive-page__person" key={curator.name}>
              <div><img src={curator.image} alt={`${curator.name} profile`} /><span>♡</span></div>
              <strong>{curator.name}</strong><small>MOMENT CURATOR</small>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-page__section archive-page__created-section">
        <div className="archive-page__section-head">
          <span>05</span>
          <div><h2 className="archive-page__section-title--galgo-mobile">Created Moments</h2><p>Create에서 남긴 Moment Card와 Playlist</p></div>
        </div>

        {createdItems.length > 0 ? (
          <div className="archive-page__created-grid">
            {createdItems.map((item) => (
              <button className="archive-page__created-card" type="button" key={item.id} onClick={() => handleSelectCreatedItem(item)}>
                <div className="archive-page__created-cover">
                  {item.data?.coverImage ? (
                    <img src={item.data.coverImage} alt="" />
                  ) : (
                    <span>{item.type === "playlist" ? "PLAYLIST" : "MOMENT"}</span>
                  )}
                </div>
                <div className="archive-page__created-body">
                  <div className="archive-page__created-meta">
                    <span>{item.type === "playlist" ? "Playlist" : "Moment Card"}</span>
                    <span>{formatCreatedDate(item.createdAt)}</span>
                  </div>
                  <h3>{getCreatedTitle(item)}</h3>
                  <p>{getCreatedDescription(item)}</p>
                  {item.type === "moment" && item.data?.timeStamp && (
                    <small>
                      {item.data.timeStamp.time} · {item.data.timeStamp.location} · {item.data.timeStamp.weather} {item.data.timeStamp.temperature}
                    </small>
                  )}
                  {item.type === "playlist" && getCreatedTracks(item).length > 0 && (
                    <small>{getCreatedTracks(item).length} tracks · {getCreatedTracks(item)[0].title}</small>
                  )}
                  <div className="archive-page__created-tags">
                    {getCreatedTags(item.data).slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                    <span>{item.data?.visibility || "전체 공개"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="archive-page__created-empty">
            아직 만든 순간이 없어요. Create에서 첫 순간을 남겨보세요.
          </div>
        )}
      </section>

      <TempyFooter className="archive-page__footer" />

      {selectedArchiveDate && (
        <ArchiveDayModal
          record={normalizedArchiveDayRecords[selectedArchiveDate]}
          onClose={() => setSelectedArchiveDate(null)}
        />
      )}
    </main>
  );
}

function ArchiveDayModal({ record, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="archive-day-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="archive-day-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="archive-day-modal-title">
        <header className="archive-day-modal__header">
          <div>
            <span>DAILY LISTENING RECORD</span>
            <h2 id="archive-day-modal-title">{record.date}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="날짜 기록 닫기">×</button>
        </header>

        <div className="archive-day-modal__content">
          <aside className="archive-day-modal__summary">
            <p>{record.summary}</p>
            <div className="archive-day-modal__stats">
              <span><small>TOTAL TRACKS</small><strong>{record.totalTracks}</strong></span>
              <span><small>MOOD</small><strong>{record.mood}</strong></span>
              <span><small>SCENE</small><strong>{record.situation}</strong></span>
            </div>
            <div className="archive-day-modal__tags">
              {record.tags.map((tag) => <span key={tag}>#{tag}</span>)}
            </div>
          </aside>

          <div className="archive-day-modal__tracks">
            <div className="archive-day-modal__tracks-head">
              <span>TRACK HIGHLIGHTS</span>
              <small>{String(record.tracks.length).padStart(2, "0")} SELECTED</small>
            </div>
            {record.tracks.map((track, index) => (
              <article className="archive-day-modal__track" key={`${record.date}-${track.title}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <img src={track.cover} alt="" />
                <div><strong>{track.title}</strong><small>{track.artist}</small></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CreatedItemDetail({ item, isEditing, onBack, onEdit, onCancelEdit, onDelete, onSave }) {
  const isPlaylist = item.type === "playlist";
  const playlistTracks = isPlaylist ? getCreatedTracks(item) : [];

  if (isEditing) {
    return (
      <CreatedItemEditor
        item={item}
        onCancel={onCancelEdit}
        onSave={onSave}
      />
    );
  }

  return (
    <main className={`archive-created-detail archive-created-detail--${isPlaylist ? "playlist" : "moment"}`}>
      <ArchiveCreatedDetailStyle />
      <aside className="archive-created-detail__side">
        <button className="archive-created-detail__back detail-back-link" type="button" onClick={onBack} aria-label="Archive 목록으로 돌아가기">
          <span aria-hidden="true">←</span>
          <span>BACK TO ARCHIVE</span>
        </button>
        <div className="archive-created-detail__object">
          <CreatedCover image={item.data?.coverImage} label={isPlaylist ? "PLAYLIST" : "MOMENT"} />
          <div className="archive-created-detail__info">
            <span>{isPlaylist ? "Created Playlist" : "Created Moment Card"}</span>
            <h1>{getCreatedTitle(item)}</h1>
            <p>{getCreatedDescription(item)}</p>
            {isPlaylist ? (
              <div className="archive-created-detail__side-meta">
                <span><small>CREATED</small><strong>{formatCreatedDate(item.createdAt)}</strong></span>
                <span><small>VISIBILITY</small><strong>{item.data?.visibility || "전체 공개"}</strong></span>
                <span><small>TRACKS</small><strong>{String(playlistTracks.length).padStart(2, "0")}</strong></span>
                <span><small>DURATION</small><strong>{formatPlaylistDuration(playlistTracks)}</strong></span>
              </div>
            ) : (
              <small>{formatCreatedDate(item.createdAt)} · {item.data?.visibility || "전체 공개"}</small>
            )}
            <CreatedTagList tags={getCreatedTags(item.data)} />
            {isPlaylist && (
              <div className="archive-created-detail__actions">
                <button type="button" onClick={onEdit}>수정하기</button>
                <button type="button" onClick={onDelete}>삭제하기</button>
              </div>
            )}
          </div>
        </div>
        {!isPlaylist && (
          <div className="archive-created-detail__actions">
            <button type="button" onClick={onEdit}>수정하기</button>
            <button type="button" onClick={onDelete}>삭제하기</button>
          </div>
        )}
      </aside>

      <section className="archive-created-detail__main">
        {isPlaylist ? (
          <PlaylistDetailView item={item} tracks={playlistTracks} />
        ) : (
          <MomentDetailView item={item} />
        )}
      </section>
    </main>
  );
}

function PlaylistDetailView({ item, tracks }) {
  const tags = getCreatedTags(item.data);
  const duration = formatPlaylistDuration(tracks);

  return (
    <>
      <header className="archive-created-detail__header">
        <span>PLAYLIST DETAIL</span>
        <h2>{item.data?.playlistTitle || "Untitled Playlist"}</h2>
        <p>{item.data?.playlistDescription || "여러 곡이 하나의 순간으로 묶였어요."}</p>
        <div className="archive-created-detail__overview">
          <span><small>CREATED</small><strong>{formatCreatedDate(item.createdAt)}</strong></span>
          <span><small>VISIBILITY</small><strong>{item.data?.visibility || "전체 공개"}</strong></span>
          <span><small>TRACKS</small><strong>{String(tracks.length).padStart(2, "0")}</strong></span>
          <span><small>TOTAL TIME</small><strong>{duration}</strong></span>
        </div>
        <CreatedTagList tags={tags} />
      </header>
      <div className="archive-created-tracks">
        <div className="archive-created-tracks__head">
          <span>TRACK LIST</span>
          <small>{String(tracks.length).padStart(2, "0")} TRACKS · {duration}</small>
        </div>
        {tracks.length ? tracks.map((track, index) => {
          const visual = archiveTrackVisuals[track.id] || archiveTrackVisuals[track.legacyId] || {};
          return (
            <article
              className="archive-created-track"
              data-tempy-playable
              data-tempy-id={track.trackId || track.id}
              data-tempy-title={track.title}
              data-tempy-artist={track.artist}
              data-tempy-cover={track.cover}
              data-tempy-duration={track.duration || track.time}
              key={`${track.id}-${index}`}
            >
              <span className="archive-created-track__index">{String(index + 1).padStart(2, "0")}</span>
              <div className="archive-created-track__visual">
                {track.cover ? <img src={track.cover} alt="" /> : <div className="archive-created-track__disc" aria-hidden="true" />}
              </div>
              <div className="archive-created-track__copy">
                <strong>{track.title}</strong>
                <span>{track.artist}</span>
              </div>
              <small>{visual.moment || "ARCHIVE MOMENT"}</small>
              <time>{track.duration || track.time || "--:--"}</time>
              <button type="button" aria-label={`${track.title} 재생`}>▶</button>
            </article>
          );
        }) : (
          <p className="archive-created-tracks__empty">선택된 트랙이 없어요.</p>
        )}
      </div>
    </>
  );
}

function MomentDetailView({ item }) {
  const timeStamp = item.data?.timeStamp || {};

  return (
    <>
      <header className="archive-created-detail__header">
        <span>MOMENT CARD DETAIL</span>
        <h2>{item.data?.selectedTrack?.title || "Moment Card"}</h2>
        <p>{item.data?.momentText || "지금의 순간이 카드로 저장되었어요."}</p>
      </header>
      <article className="archive-created-moment-card">
        <CreatedCover image={item.data?.coverImage} label="MOMENT" />
        <div>
          <span>{timeStamp.time || "--:--"}</span>
          <h3>{item.data?.selectedTrack?.title || "Moment Card"}</h3>
          <p>{item.data?.momentText || "아직 한 줄 순간이 비어 있어요."}</p>
          <small>
            {timeStamp.location || "서울 성북구"} · {timeStamp.weather || "흐림"} · {timeStamp.temperature || "18°C"} · {item.data?.visibility || "전체 공개"}
          </small>
          <CreatedTagList tags={getCreatedTags(item.data)} />
        </div>
      </article>
    </>
  );
}

function CreatedItemEditor({ item, onCancel, onSave }) {
  const isPlaylist = item.type === "playlist";
  const [draft, setDraft] = useState(() => normalizeDraftData(item));

  const update = (patch) => setDraft((current) => ({ ...current, ...patch }));
  const addTag = (tag) => {
    const nextTag = tag.trim();
    if (!nextTag) return;
    const allTags = [...archiveDefaultTags, ...(draft.customTags || [])];
    if (allTags.includes(nextTag)) {
      update({ selectedTags: draft.selectedTags.includes(nextTag) ? draft.selectedTags : [...draft.selectedTags, nextTag] });
      return;
    }
    update({
      customTags: [...(draft.customTags || []), nextTag],
      selectedTags: [...draft.selectedTags, nextTag],
    });
  };

  const save = () => {
    if (isPlaylist) {
      onSave({
        ...draft,
        selectedTracks: draft.selectedTracks
          .map((trackId) => archiveTrackItems.find((track) => track.id === trackId))
          .filter(Boolean),
      });
      return;
    }

    onSave(draft);
  };

  return (
    <main className="archive-created-detail archive-created-detail--edit">
      <ArchiveCreatedDetailStyle />
      <aside className="archive-created-detail__side">
        <CreatedCoverPicker image={draft.coverImage} onChange={(coverImage) => update({ coverImage })} />
        <div className="archive-created-detail__info">
          <span>{isPlaylist ? "Edit Playlist" : "Edit Moment Card"}</span>
          <h1>{isPlaylist ? "Playlist" : "Moment Card"}</h1>
          <p>Archive에 저장된 항목을 수정하고 다시 저장해요.</p>
        </div>
        <div className="archive-created-detail__actions">
          <button type="button" onClick={save}>수정 저장</button>
          <button type="button" onClick={onCancel}>수정 취소</button>
        </div>
      </aside>

      <section className="archive-created-detail__main">
        <header className="archive-created-detail__header">
          <span>{isPlaylist ? "PLAYLIST EDIT" : "MOMENT EDIT"}</span>
          <h2>{isPlaylist ? "Edit Playlist" : "Edit Moment Card"}</h2>
          <p>기존 입력값을 유지한 상태에서 필요한 부분만 바꿀 수 있어요.</p>
        </header>

        <div className="archive-created-edit-grid">
          {isPlaylist ? (
            <>
              <label>
                제목
                <input value={draft.playlistTitle} onChange={(event) => update({ playlistTitle: event.target.value })} />
              </label>
              <label>
                설명
                <textarea value={draft.playlistDescription} onChange={(event) => update({ playlistDescription: event.target.value })} />
              </label>
            </>
          ) : (
            <label>
              한 줄 순간
              <textarea value={draft.momentText} onChange={(event) => update({ momentText: event.target.value })} />
            </label>
          )}

          <div>
            <span className="archive-created-edit-label">태그</span>
            <ArchiveTagEditor
              selectedTags={draft.selectedTags}
              customTags={draft.customTags || []}
              onToggleTag={(tag) => update({ selectedTags: toggleValue(draft.selectedTags, tag) })}
              onAddTag={addTag}
            />
          </div>

          <div>
            <span className="archive-created-edit-label">공개 범위</span>
            <div className="archive-created-edit-pills">
              {archiveVisibilityOptions.map((option) => (
                <button
                  className={draft.visibility === option ? "is-active" : ""}
                  type="button"
                  key={option}
                  onClick={() => update({ visibility: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {isPlaylist && (
            <div>
              <span className="archive-created-edit-label">트랙</span>
              <div className="archive-created-edit-tracks">
                {archiveTrackItems.map((track) => (
                  <button
                    className={draft.selectedTracks.includes(track.id) ? "is-active" : ""}
                    type="button"
                    key={track.id}
                    onClick={() => update({ selectedTracks: toggleValue(draft.selectedTracks, track.id) })}
                  >
                    <strong>{track.title}</strong>
                    <span>{track.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function normalizeDraftData(item) {
  const data = item.data || {};
  if (item.type === "playlist") {
    return {
      coverImage: data.coverImage || "",
      playlistTitle: data.playlistTitle || "",
      playlistDescription: data.playlistDescription || "",
      selectedTags: getCreatedTags(data),
      customTags: Array.isArray(data.customTags) ? data.customTags : [],
      visibility: data.visibility || "전체 공개",
      selectedTracks: getCreatedTracks(item).map((track) => track.id),
    };
  }

  return {
    coverImage: data.coverImage || "",
    selectedTags: getCreatedTags(data),
    customTags: Array.isArray(data.customTags) ? data.customTags : [],
    momentText: data.momentText || "",
    visibility: data.visibility || "전체 공개",
    selectedTrack: data.selectedTrack || archiveTrackItems[0],
    timeStamp: data.timeStamp || {
      time: "--:--",
      location: "서울 성북구",
      weather: "흐림",
      temperature: "18°C",
    },
  };
}

function CreatedCover({ image, label }) {
  return (
    <div className="archive-created-detail__cover">
      {image ? <img src={image} alt="" /> : <span>{label}</span>}
    </div>
  );
}

function ArchiveCreatedDetailStyle() {
  return (
    <style>{`
      .archive-created-detail .archive-created-detail__side {
        position: relative;
        --archive-created-left-width: min(100%, 390px);
        min-height: calc(100vh - 86px);
        padding-top: 126px;
        padding-bottom: 32px;
        align-items: center;
      }

      .archive-created-detail .archive-created-detail__back {
        position: absolute;
        top: var(--detail-back-block);
        left: var(--detail-back-inline);
        z-index: 2;
      }

      .archive-created-detail .archive-created-detail__info,
      .archive-created-detail .archive-created-moment-card,
      .archive-created-detail .archive-created-track,
      .archive-created-detail .archive-created-edit-grid input,
      .archive-created-detail .archive-created-edit-grid textarea,
      .archive-created-detail .archive-created-edit-add input {
        background: #fbfaf5;
      }

      .archive-created-detail .archive-created-detail__info {
        padding: 16px;
        border: 1px solid rgba(7, 20, 43, 0.1);
        width: var(--archive-created-left-width);
      }

      .archive-created-detail .archive-created-detail__cover {
        width: var(--archive-created-left-width);
        max-height: 390px;
        justify-self: center;
      }

      .archive-created-detail .archive-created-detail__cover {
        background:
          radial-gradient(circle at center, rgba(7, 20, 43, 0.12) 0 7%, transparent 8%),
          radial-gradient(circle at center, transparent 0 35%, rgba(7, 20, 43, 0.09) 36% 36.8%, transparent 37.5%),
          radial-gradient(circle at center, transparent 0 48%, rgba(7, 20, 43, 0.065) 49% 49.6%, transparent 50.5%),
          #fbfaf5;
        color: rgba(7, 20, 43, 0.34);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.12em;
      }

      .archive-created-detail .archive-created-cover-picker > span {
        background: #2759ed;
      }

      .archive-created-detail .archive-created-moment-card > div:last-child {
        background: #fbfaf5;
      }

      .archive-created-detail .archive-created-detail__info {
        margin-top: 14px;
      }

      .archive-created-detail .archive-created-detail__info h1 {
        margin-top: 10px;
        font-size: clamp(40px, 3.3vw, 66px);
      }

      .archive-created-detail .archive-created-detail__info p {
        margin-top: 14px;
        font-size: 13px;
        line-height: 1.42;
      }

      .archive-created-detail .archive-created-detail__info small {
        margin-top: 8px;
      }

      .archive-created-detail .archive-created-detail__tags {
        margin-top: 10px;
      }

      .archive-created-detail .archive-created-detail__tags span {
        padding: 6px 9px;
      }

      .archive-created-detail .archive-created-detail__actions {
        width: var(--archive-created-left-width);
        margin-top: auto;
        padding-top: 12px;
        gap: 8px;
      }

      .archive-created-detail .archive-created-detail__actions button {
        min-height: 38px;
      }

      .archive-created-detail .archive-created-detail__main {
        min-height: calc(100vh - 86px);
        padding-top: 126px;
        padding-bottom: 44px;
        overflow: hidden;
      }

      .archive-created-detail .archive-created-detail__header h2 {
        margin-top: 8px;
        font-size: clamp(50px, 5vw, 92px);
      }

      .archive-created-detail .archive-created-detail__header p {
        margin-top: 14px;
        font-size: 15px;
      }

      .archive-created-detail .archive-created-tracks,
      .archive-created-detail .archive-created-moment-card {
        margin-top: 30px;
      }

      .archive-created-detail .archive-created-track {
        min-height: 116px;
        padding: 16px;
        grid-template-columns: 74px 1fr;
      }

      .archive-created-detail .archive-created-track__disc {
        border-width: 12px;
        box-shadow: inset 0 0 0 10px #d9e8ff;
      }

      .archive-created-detail .archive-created-track strong {
        margin-top: 8px;
        font-size: clamp(18px, 1.6vw, 28px);
      }

      .archive-created-detail .archive-created-moment-card {
        max-width: 760px;
      }

      .archive-created-detail .archive-created-moment-card .archive-created-detail__cover {
        width: 100%;
        max-height: none;
      }

      .archive-created-detail .archive-created-moment-card > div:last-child {
        padding: 28px;
      }

      .archive-created-detail .archive-created-moment-card h3 {
        font-size: clamp(40px, 3.4vw, 66px);
      }

      .archive-created-detail .archive-created-moment-card p {
        margin-top: 16px;
        font-size: 16px;
      }

      .archive-created-detail .archive-created-edit-grid {
        margin-top: 30px;
        gap: 16px;
      }

      @media (max-width: 560px) {
        .archive-created-detail .archive-created-detail__side {
          padding-top: 112px;
        }

        .archive-created-detail .archive-created-detail__back {
          top: 34px;
          left: 20px;
        }
      }
    `}</style>
  );
}

function CreatedCoverPicker({ image, onChange }) {
  return (
    <label className="archive-created-cover-picker">
      <CreatedCover image={image} label="COVER" />
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          readImageFile(event.target.files?.[0], onChange);
          event.target.value = "";
        }}
      />
      <span>커버 변경</span>
    </label>
  );
}

function ArchiveTagEditor({ selectedTags, customTags, onToggleTag, onAddTag }) {
  const [isAdding, setIsAdding] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tags = [...archiveDefaultTags, ...customTags];

  const commitTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    onAddTag(nextTag);
    setTagInput("");
    setIsAdding(false);
  };

  return (
    <>
      <div className="archive-created-edit-pills">
        {tags.map((tag) => (
          <button
            className={selectedTags.includes(tag) ? "is-active" : ""}
            type="button"
            key={tag}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
        <button type="button" onClick={() => setIsAdding(true)}>+ 추가</button>
      </div>
      {isAdding && (
        <div className="archive-created-edit-add">
          <input
            value={tagInput}
            placeholder="태그 입력"
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitTag();
              }
            }}
          />
          <button type="button" onClick={commitTag}>추가</button>
        </div>
      )}
    </>
  );
}

function CreatedTagList({ tags }) {
  return (
    <div className="archive-created-detail__tags">
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}

export default Archive;
