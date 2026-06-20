function Archive() {
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

      <footer className="archive-page__footer">
        <strong>Tempy!</strong>
        <p>Catch your Tempo, Meet your Moment</p>
        <div><span>TIME SET</span><span>TRACK TRACE</span><span>ARCHIVE</span></div>
        <small>© 2026 TEMPY. ALL RIGHTS RESERVED.</small>
      </footer>
    </main>
  );
}

export default Archive;
