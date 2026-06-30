import { Link } from "react-router-dom";
import logoNav from "../assets/Tempy!_logo_nav.svg";

const momentCards = [
  {
    title: "Rainy Bus Stop",
    track: "BIRDS OF A FEATHER",
    artist: "Billie Eilish",
    time: "20:39 · Rain",
    image: "/images/moment-01.png",
  },
  {
    title: "Late Blue",
    track: "Night Walk",
    artist: "HYUKOH",
    time: "23:10 · Seoul",
    image: "/images/moment-02.png",
  },
  {
    title: "Window Seat",
    track: "Coffee at Dawn",
    artist: "beabadoobee",
    time: "07:42 · Cloud",
    image: "/images/moment-03.png",
  },
  {
    title: "After Office",
    track: "City Light",
    artist: "ADOY",
    time: "18:25 · Walk",
    image: "/images/moment-04.png",
  },
];

const playlists = [
  {
    title: "비 오는 저녁의 방",
    description: "혼자 남은 시간에 천천히 쌓이는 노래",
    time: "12곡 · 42 min",
    image: "/images/album-20.png",
  },
  {
    title: "버스 창가의 기록",
    description: "창밖 풍경과 같은 속도로 흐르는 플레이리스트",
    time: "10곡 · 35 min",
    image: "/images/album-21.png",
  },
  {
    title: "새벽에 저장한 마음",
    description: "말수가 줄어드는 시간에 어울리는 사운드",
    time: "9곡 · 31 min",
    image: "/images/album-22.png",
  },
  {
    title: "성북구 흐림",
    description: "흐린 날의 낮은 온도를 담은 음악",
    time: "11곡 · 38 min",
    image: "/images/album-23.png",
  },
];

function Profile() {
  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero__intro">
          <h1>My</h1>
          <p>
            내가 어떤 시간에 어떤 음악을 들었는지<br />
            나만의 시간 기록으로 돌아보세요
          </p>
          <button type="button">2026</button>
        </div>

        <div className="profile-hero__identity">
          <div className="profile-hero__avatar">
            <img src="/images/artist-04.png" alt="만찐두빵 profile" draggable={false} />
          </div>
          <div>
            <h2>만찐두빵</h2>
            <span>@ananmola</span>
          </div>
        </div>

        <div className="profile-hero__actions">
          <button type="button">프로필 편집</button>
          <button type="button">공유하기</button>
        </div>
      </section>

      <section className="profile-tags-section">
        <div className="profile-section-head">
          <h2>만찐두빵님이 가장 많이 선택한 태그</h2>
        </div>

        <div className="profile-tags-layout">
          <article className="profile-sentence-card">
            <span>Profile Sentence</span>
            <p>비 오는 저녁, 혼자 있는 시간에 가장 많은 음악을 남기는 사람</p>
          </article>

          <div className="profile-tag-orbits" aria-label="Most selected tags">
            <div><span>#비</span></div>
            <div><span>#저녁</span></div>
            <div><span>#혼자</span></div>
          </div>
        </div>
      </section>

      <section className="profile-moment-section">
        <div className="profile-section-head profile-section-head--row">
          <h2 className="profile-section-title">
            <span className="profile-section-title__kr">내가 만든</span>
            <span className="profile-section-title__en">Moment Card</span>
          </h2>
          <Link to="/create">새 카드 만들기</Link>
        </div>

        <div className="profile-moment-grid">
          {momentCards.map((card, index) => (
            <article className="profile-moment-card" key={card.title}>
              <div className="profile-moment-card__top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <button type="button" aria-label={`${card.title} 좋아요`}>♡</button>
              </div>
              <h3>{card.title}</h3>
              <button className="profile-moment-card__play" type="button" aria-label={`${card.title} 재생`}>▶</button>
              <div className="profile-moment-card__track">
                <img src={card.image} alt="" draggable={false} />
                <div>
                  <strong>{card.track}</strong>
                  <span>{card.artist}</span>
                  <small>{card.time}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-playlist-section">
        <div className="profile-section-head profile-section-head--row">
          <h2 className="profile-section-title">
            <span className="profile-section-title__kr">내가 만든</span>
            <span className="profile-section-title__en">Playlist</span>
          </h2>
          <Link to="/create">새 플레이리스트 만들기</Link>
        </div>

        <div className="profile-playlist-row">
          {playlists.map((playlist, index) => (
            <article className="profile-playlist-card" key={playlist.title}>
              <div className="profile-playlist-card__lp">
                <span />
                <span />
                <img src={playlist.image} alt="" draggable={false} />
              </div>
              <div className="profile-playlist-card__copy">
                <small>PLAYLIST · {String(index + 1).padStart(2, "0")}</small>
                <h3>{playlist.title}</h3>
                <p>{playlist.description}</p>
                <div>
                  <span>{playlist.time}</span>
                  <button type="button" aria-label={`${playlist.title} 재생`}>▶</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="profile-footer">
        <div className="profile-footer__brand">
          <img src={logoNav} alt="Tempy!" draggable={false} />
        </div>
        <nav aria-label="Footer links">
          <a href="#service">서비스 소개</a>
          <a href="#terms">이용약관</a>
          <a href="#privacy">개인정보 처리방침</a>
          <a href="#contact">문의하기</a>
        </nav>
      </footer>
    </main>
  );
}

export default Profile;
