import { useEffect, useState } from "react";

const CREATED_ITEMS_KEY = "tempyCreatedItems";
const archiveDefaultTags = ["비", "버스", "성북구"];
const archiveVisibilityOptions = ["전체 공개", "팔로워만", "비공개"];
const archiveTrackItems = [
  { id: 1, title: "Jane&the boys", time: "2:31" },
  { id: 2, title: "BIRDS OF A FEATHER", time: "3:30" },
  { id: 3, title: "Confetti Dream", time: "3:12" },
  { id: 4, title: "Upside Mood", time: "2:48" },
];

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
    .filter(Boolean);
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

  const calendarDays = [
    "", "", "", "1", "2", "3", "4",
    "5", "6", "7", "8", "9", "10", "11",
    "12", "13", "14", "15", "16", "17", "18",
    "19", "20", "21", "22", "23", "24", "25",
    "26", "27", "28", "29", "30", "31", "",
  ];

  const tags = ["비 오는 저녁", "퇴근길", "새벽 감성", "서울", "혼자 걷기", "반복 재생"];

  const recommendedCurators = [
    { image: "/images/profile-01.png", name: "만두두왕" },
    { image: "/images/profile-02.png", name: "오늘은까눌레" },
    { image: "/images/profile-03.png", name: "hostless" },
    { image: "/images/profile-06.png", name: "waveclub" },
    { image: "/images/profile-08.png", name: "nightloop" },
  ];

  const artists = [
    { image: "/images/artist-01.png", name: "Jennie", count: "32 TIMES" },
    { image: "/images/artist-02.png", name: "AKMU", count: "28 TIMES" },
    { image: "/images/artist-03.png", name: "Hanroro", count: "21 TIMES" },
    { image: "/images/album-03.png", name: "Billie Eilish", count: "18 TIMES" },
  ];

  const likedCurators = [
    { image: "/images/profile-04.png", name: "roomtone" },
    { image: "/images/profile-05.png", name: "bluehour" },
    { image: "/images/profile-07.png", name: "slowday" },
    { image: "/images/profile-03.png", name: "hostless" },
    { image: "/images/profile-01.png", name: "만두두왕" },
  ];

  const selectedCreatedItem = createdItems.find((item) => item.id === selectedCreatedId) || null;

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
          <h1 className="archive-page__title">Archive<br />your time</h1>
          <p className="archive-page__description">
            내가 어떤 시간에 어떤 음악을 들었는지<br />
            나만의 시간 기록으로 돌아보세요.
          </p>
          <div className="archive-page__year" aria-label="Selected year">
            <span>YEAR</span>
            <strong>2026</strong>
            <span aria-hidden="true">⌄</span>
          </div>
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
              <div className={day === "16" ? "archive-page__day archive-page__day--active" : "archive-page__day"} key={`${day}-${index}`}>
                {day && <><span>{day}</span>{[3, 8, 12, 16, 21, 24, 29].includes(Number(day)) && <i />}</>}
              </div>
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
          <div><h2>Curators like you</h2><p>나와 가장 비슷한 시간과 취향을 가진 큐레이터</p></div>
        </div>
        <div className="archive-page__people">
          {recommendedCurators.map((curator, index) => (
            <article className="archive-page__person" key={curator.name}>
              <div><img src={curator.image} alt={`${curator.name} profile`} /><span>{92 - index * 4}%</span></div>
              <strong>{curator.name}</strong><small>SIMILAR CURATOR</small>
            </article>
          ))}
        </div>
      </section>

      <section className="archive-page__section">
        <div className="archive-page__section-head">
          <span>03</span>
          <div><h2>Most played artists</h2><p>이번 달 가장 자주 찾은 아티스트</p></div>
        </div>
        <div className="archive-page__artists">
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
          <div><h2>Curators you liked</h2><p>내가 좋아요를 남긴 큐레이터</p></div>
        </div>
        <div className="archive-page__people">
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
          <div><h2>Created Moments</h2><p>Create에서 남긴 Moment Card와 Playlist</p></div>
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

      <footer className="archive-page__footer">
        <strong>Tempy!</strong>
        <p>Catch your Tempo, Meet your Moment</p>
        <div><span>TIME SET</span><span>TRACK TRACE</span><span>ARCHIVE</span></div>
        <small>© 2026 TEMPY. ALL RIGHTS RESERVED.</small>
      </footer>
    </main>
  );
}

function CreatedItemDetail({ item, isEditing, onBack, onEdit, onCancelEdit, onDelete, onSave }) {
  const isPlaylist = item.type === "playlist";

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
        <button className="archive-created-detail__back" type="button" onClick={onBack} aria-label="Archive 목록으로 돌아가기">
          ←
        </button>
        <CreatedCover image={item.data?.coverImage} label={isPlaylist ? "PLAYLIST" : "MOMENT"} />
        <div className="archive-created-detail__info">
          <span>{isPlaylist ? "Created Playlist" : "Created Moment Card"}</span>
          <h1>{getCreatedTitle(item)}</h1>
          <p>{getCreatedDescription(item)}</p>
          <small>{formatCreatedDate(item.createdAt)} · {item.data?.visibility || "전체 공개"}</small>
          <CreatedTagList tags={getCreatedTags(item.data)} />
        </div>
        <div className="archive-created-detail__actions">
          <button type="button" onClick={onEdit}>수정하기</button>
          <button type="button" onClick={onDelete}>삭제하기</button>
        </div>
      </aside>

      <section className="archive-created-detail__main">
        {isPlaylist ? (
          <PlaylistDetailView item={item} />
        ) : (
          <MomentDetailView item={item} />
        )}
      </section>
    </main>
  );
}

function PlaylistDetailView({ item }) {
  const tracks = getCreatedTracks(item);

  return (
    <>
      <header className="archive-created-detail__header">
        <span>PLAYLIST DETAIL</span>
        <h2>{item.data?.playlistTitle || "Untitled Playlist"}</h2>
        <p>{item.data?.playlistDescription || "여러 곡이 하나의 순간으로 묶였어요."}</p>
      </header>
      <div className="archive-created-tracks">
        {(tracks.length ? tracks : [{ id: "empty", title: "선택된 트랙이 없어요", time: "--:--" }]).map((track, index) => (
          <article className="archive-created-track" key={`${track.id}-${index}`}>
            <div className="archive-created-track__disc" aria-hidden="true" />
            <div>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{track.title}</strong>
              <small>{track.time}</small>
            </div>
          </article>
        ))}
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
        top: 34px;
        left: calc((100% - var(--archive-created-left-width)) / 2);
        display: grid;
        width: 48px;
        height: 48px;
        place-items: center;
        border: 1px solid #07142b;
        border-radius: 50%;
        background: #2759ed;
        color: #07142b;
        font-size: 28px;
        line-height: 1;
        font-weight: 900;
        cursor: pointer;
        transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms ease;
      }

      .archive-created-detail .archive-created-detail__back:hover {
        background: #89abe6;
        transform: translate3d(-5px, 0, 0);
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
        font-size: 11px;
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
