function ArtistProfile() {
  return (
    <main className="artist-profile">
      <button className="artist-profile__back" type="button">
        <span aria-hidden="true">←</span>
        <span>BACK</span>
      </button>

      <section className="artist-profile__hero">
        <img
          className="artist-profile__image"
          src="/images/album-01.png"
          alt="Taylor Swift"
        />
        <div className="artist-profile__intro">
          <p className="artist-profile__label">ARTIST PROFILE</p>
          <h1>Taylor Swift</h1>
          <p className="artist-profile__description">
            Taylor Swift의 음악과 앨범, 시간에 따라 이어지는 대표 트랙을 소개합니다.
          </p>
        </div>
      </section>

      <section className="artist-profile__works">
        <div className="artist-profile__section">
          <p className="artist-profile__label">SELECTED WORKS</p>
          <h2>Representative Albums</h2>
          <div className="artist-profile__placeholder">앨범 영역</div>
        </div>
        <div className="artist-profile__section">
          <p className="artist-profile__label">ESSENTIAL LISTENING</p>
          <h2>Representative Tracks</h2>
          <div className="artist-profile__placeholder">트랙 영역</div>
        </div>
      </section>
    </main>
  );
}

export default ArtistProfile;
