import { Link } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import { getTrackById } from "../data/musicCatalog";
import { createAlbumImageSequence, profileImages } from "../data/imageCatalog";

const profileAlbumImages = createAlbumImageSequence(8, "profile-archive");

const momentCards = [
  {
    title: "Rainy Bus Stop",
    time: "20:39 · Rain",
    location: "서울 성북구",
    tags: ["비", "버스"],
    image: profileAlbumImages[0],
    music: getTrackById("birds-of-a-feather"),
  },
  {
    title: "Late Blue",
    time: "23:10 · Seoul",
    location: "한강 산책",
    tags: ["저녁", "혼자"],
    image: profileAlbumImages[1],
    music: getTrackById("gone-are-the-days"),
  },
  {
    title: "Window Seat",
    time: "07:42 · Cloud",
    location: "창가 자리",
    tags: ["아침", "흐림"],
    image: profileAlbumImages[2],
    music: getTrackById("sweetener"),
  },
  {
    title: "After Office",
    time: "18:25 · Walk",
    location: "퇴근길",
    tags: ["도시", "산책"],
    image: profileAlbumImages[3],
    music: getTrackById("blinding-lights"),
  },
];

const playlists = [
  {
    title: "비 오는 저녁의 방",
    description: "혼자 남은 시간에 천천히 쌓이는 노래",
    time: "12곡 · 42 min",
    tags: ["비", "저녁"],
    image: profileAlbumImages[4],
    music: getTrackById("birds-of-a-feather"),
  },
  {
    title: "버스 창가의 기록",
    description: "창밖 풍경과 같은 속도로 흐르는 플레이리스트",
    time: "10곡 · 35 min",
    tags: ["버스", "창가"],
    image: profileAlbumImages[5],
    music: getTrackById("gone-are-the-days"),
  },
  {
    title: "새벽에 저장한 마음",
    description: "말수가 줄어드는 시간에 어울리는 사운드",
    time: "9곡 · 31 min",
    tags: ["새벽", "혼자"],
    image: profileAlbumImages[6],
    music: getTrackById("sweetener"),
  },
  {
    title: "성북구 흐림",
    description: "흐린 날의 낮은 온도를 담은 음악",
    time: "11곡 · 38 min",
    tags: ["흐림", "성북구"],
    image: profileAlbumImages[7],
    music: getTrackById("blinding-lights"),
  },
];

const profileTags = [
  { tag: "비", count: 38, share: "32%" },
  { tag: "저녁", count: 31, share: "26%" },
  { tag: "혼자", count: 24, share: "20%" },
  { tag: "산책", count: 16, share: "13%" },
  { tag: "새벽", count: 12, share: "10%" },
  { tag: "창가", count: 9, share: "8%" },
];

function ProfileSectionHeader({ index, title, description, actionLabel, actionTo }) {
  return (
    <div className="profile-section-head">
      <div className="profile-section-heading">
        <span className="profile-section-index">{index}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {actionLabel && <Link to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}

function Profile() {
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero__intro">
          <span className="profile-hero__eyebrow">MY MUSIC ARCHIVE</span>
          <h1>My Music Archive</h1>
          <p>내가 어떤 시간에 어떤 음악을 들었는지 나만의 시간 기록으로 돌아보세요.</p>
          <div className="profile-year-block">
            <span>YEAR</span>
            <label className="profile-year-select" aria-label="연도 선택">
              <select defaultValue="2026">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <span aria-hidden="true">⌄</span>
            </label>
          </div>
        </div>

        <div className="profile-hero__identity">
          <div className="profile-hero__panel-head">
            <span>MY PROFILE</span>
            <small>2026 · PROFILE SUMMARY</small>
          </div>
          <div className="profile-hero__avatar">
            <img src={profileImages[8]} alt="만찐두빵 profile" draggable={false} />
          </div>
          <div className="profile-hero__identity-copy">
            <span>TIME CURATOR</span>
            <h2>만찐두빵</h2>
            <small>@ananmola</small>
          </div>
          <div className="profile-hero__stats">
            <span><strong>{momentCards.length}</strong><small>MOMENTS</small></span>
            <span><strong>{playlists.length}</strong><small>PLAYLISTS</small></span>
            <span><strong>126</strong><small>TRACKS</small></span>
          </div>
          <div className="profile-hero__actions">
            <span>PROFILE ACTION</span>
            <button type="button">프로필 편집</button>
            <button type="button">공유하기</button>
          </div>
        </div>
      </section>

      <section className="profile-tags-section">
        <ProfileSectionHeader
          index="01"
          title="Your Time Tags"
          description="만찐두빵님의 음악 기록에 가장 자주 남은 시간과 상황"
        />

        <div className="profile-tags-layout">
          <article className="profile-sentence-card">
            <div className="profile-sentence-card__heading">
              <span>PROFILE SENTENCE</span>
              <small>2026 · LISTENING IDENTITY</small>
            </div>
            <p>비 오는 저녁, 혼자 있는 시간에 가장 많은 음악을 남기는 사람</p>
            <span className="profile-sentence-card__index">01 / 01</span>
          </article>

          <div className="profile-tag-orbits" aria-label="Most selected tags">
            {profileTags.map((item, index) => (
              <article className={`profile-tag-orbit profile-tag-orbit--${index + 1}`} key={item.tag}>
                <span>#{item.tag}</span>
                <strong>{item.count}</strong>
                <p><span>{item.share}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-moment-section">
        <ProfileSectionHeader
          index="02"
          title="Created Moment Cards"
          description="시간과 날씨, 한 곡으로 남긴 나의 순간 기록"
          actionLabel="새 카드 만들기"
          actionTo="/create"
        />

        <div className="profile-moment-grid">
          {momentCards.map((card, index) => (
            <article
              className="profile-moment-card"
              data-tempy-playable
              data-tempy-id={card.music.id}
              data-tempy-title={card.music.title}
              data-tempy-artist={card.music.artist}
              data-tempy-cover={card.music.cover}
              data-tempy-duration={card.music.duration}
              key={card.title}
            >
              <div className="profile-moment-card__top">
                <span>MOMENT · {String(index + 1).padStart(2, "0")}</span>
                <button type="button" aria-label={`${card.title} 좋아요`}>♡</button>
              </div>
              <div className="profile-moment-card__visual">
                <img src={card.image} alt="" draggable={false} />
                <span aria-hidden="true" />
                <button className="profile-moment-card__play" type="button" aria-label={`${card.title} 재생`}>▶</button>
              </div>
              <h3>{card.title}</h3>
              <p>{card.location} · {card.time}</p>
              <div className="profile-moment-card__tags">
                {card.tags.map((tag) => <span key={tag}>#{tag}</span>)}
              </div>
              <div className="profile-moment-card__track">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{card.music.title}</strong>
                  <span>{card.music.artist}</span>
                </div>
                <small>{card.time.split(" · ")[0]}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-playlist-section">
        <ProfileSectionHeader
          index="03"
          title="Created Playlists"
          description="여러 곡을 하나의 시간 맥락으로 묶은 플레이리스트"
          actionLabel="새 플레이리스트 만들기"
          actionTo="/create"
        />

        <div className="profile-playlist-row">
          {playlists.map((playlist, index) => (
            <article
              className="profile-playlist-card"
              data-tempy-playable
              data-tempy-id={playlist.music.id}
              data-tempy-title={playlist.music.title}
              data-tempy-artist={playlist.music.artist}
              data-tempy-cover={playlist.music.cover}
              data-tempy-duration={playlist.music.duration}
              key={playlist.title}
            >
              <div className="profile-playlist-card__lp">
                <span />
                <span />
                <img src={playlist.image} alt="" draggable={false} />
              </div>
              <div className="profile-playlist-card__copy">
                <small>PLAYLIST · {String(index + 1).padStart(2, "0")}</small>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <div className="profile-playlist-card__tags">
                  {playlist.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                </div>
                <div>
                  <span>{playlist.time}</span>
                  <button type="button" aria-label={`${playlist.title} 재생`}>▶</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <TempyFooter className="profile-footer" />
    </main>
  );
}

export default Profile;
