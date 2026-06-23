import { useNavigate } from "react-router-dom";

const lifestylePlaylists = [
  { title: "20년차 카페 사장님의 새벽 플레이리스트", cover: "/images/album-01.png" },
  { title: "비 오는 날 오래 머무는 창가의 음악", cover: "/images/album-02.png" },
  { title: "느린 일요일 아침을 위한 커피와 재즈", cover: "/images/album-03.png" },
  { title: "퇴근 후 혼자 걷는 한강의 저녁", cover: "/images/album-04.png" },
  { title: "작은 서점의 문을 여는 첫 번째 노래", cover: "/images/album-05.png" },
  { title: "늦은 밤 주방에서 만드는 따뜻한 한 끼", cover: "/images/album-06.png" },
  { title: "도시를 벗어나는 주말 드라이브", cover: "/images/album-07.png" },
  { title: "햇빛 좋은 오후의 식물과 레코드", cover: "/images/album-08.png" },
  { title: "집중이 필요한 디자이너의 작업실", cover: "/images/album-09.png" },
  { title: "여행 전날 밤 가방을 싸며 듣는 음악", cover: "/images/album-03.png" },
  { title: "친구들과 나누는 늦은 여름의 식탁", cover: "/images/album-06.png" },
  { title: "불을 낮춘 방에서 하루를 닫는 순간", cover: "/images/album-01.png" },
];

function LifestyleCurator() {
  const navigate = useNavigate();

  return (
    <main className="lifestyle-curator">
      <aside className="lifestyle-curator__intro">
        <button className="lifestyle-curator__back" type="button" onClick={() => navigate("/curator")}>
          <span aria-hidden="true">←</span>
          <span>BACK TO CURATOR</span>
        </button>

        <div className="lifestyle-curator__intro-copy">
          <p className="lifestyle-curator__eyebrow">MOMENT CURATOR · 01</p>
          <h1>Lifestyle<br />Curator</h1>
          <p>
            일상의 취향과 장면을 음악으로 기록하는 사람들의 플레이리스트를 만나보세요.
            익숙한 하루가 조금 다르게 들리는 순간을 모았습니다.
          </p>
        </div>

        <span className="lifestyle-curator__count">12 PLAYLISTS</span>
      </aside>

      <section className="lifestyle-curator__grid" aria-label="Lifestyle curator playlists">
        {lifestylePlaylists.map((playlist, index) => (
          <article className="lifestyle-curator__card" key={`${playlist.title}-${index}`}>
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
    </main>
  );
}

export default LifestyleCurator;
