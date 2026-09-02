import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import { PlayIcon } from "../components/TempyIcons";
import { getCuratorProfile } from "../data/curatorProfiles";
import { getTrackById } from "../data/musicCatalog";

const FOLLOWED_CURATORS_KEY = "tempy-followed-curators";

const readFollowedCurators = () => {
  try {
    return new Set(JSON.parse(window.localStorage.getItem(FOLLOWED_CURATORS_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const getTrackActivity = (trackId) => {
  const hash = [...trackId].reduce((total, character) => total + character.charCodeAt(0), 0);
  const likes = 760 + (hash % 1750);
  return {
    likes: likes >= 1000 ? `${(likes / 1000).toFixed(1).replace(".0", "")}K` : String(likes),
    listening: 8 + (hash % 34),
  };
};

function CuratorProfile() {
  const navigate = useNavigate();
  const { curatorId } = useParams();
  const curator = getCuratorProfile(curatorId);
  const [followedCurators, setFollowedCurators] = useState(readFollowedCurators);

  const tracks = useMemo(() => {
    if (!curator) return null;
    return {
      moments: curator.recentMoments.map((moment) => ({ ...moment, track: getTrackById(moment.trackId) })).filter((moment) => moment.track),
      rotation: curator.currentRotationTrackIds.map(getTrackById).filter(Boolean),
      favorites: curator.favoriteTrackIds.map(getTrackById).filter(Boolean),
      playlists: curator.playlists.map((playlist) => ({
        ...playlist,
        tracks: playlist.trackIds.map(getTrackById).filter(Boolean),
      })),
    };
  }, [curator]);

  if (!curator || !tracks) return <Navigate to="/curator" replace />;

  const isFollowing = followedCurators.has(curator.id);
  const rotationLead = tracks.rotation[0];
  const curatorSummary = `${curator.tags.slice(0, 2).join("와 ")}의 결을 오래 기록하는 사람`;
  const similarCurators = curator.similarCurators
    .map(getCuratorProfile)
    .filter((profile) => profile && profile.id !== curator.id);

  const toggleFollow = () => {
    setFollowedCurators((current) => {
      const next = new Set(current);
      if (next.has(curator.id)) next.delete(curator.id);
      else next.add(curator.id);
      window.localStorage.setItem(FOLLOWED_CURATORS_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const playTrack = (track) => {
    if (!track) return;
    window.dispatchEvent(new CustomEvent("tempy-play-track", { detail: { track } }));
  };

  return (
    <main className="curator-profile">
      <section className="curator-profile__hero">
        <button className="curator-profile__back detail-back-link" type="button" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO CURATOR</span>
        </button>

        <div className="curator-profile__hero-grid">
          <div className="curator-profile__identity-band">
            <div className="curator-profile__portrait-wrap">
              <img src={curator.profileImage} alt={`${curator.username} profile`} />
              <span>MOMENT CURATOR</span>
            </div>

            <div className="curator-profile__intro">
              <p>CURATOR PROFILE · MUSIC ARCHIVE</p>
              <h1 className={/[가-힣]/.test(curator.username) ? "curator-profile__name--korean" : undefined}>
                {curator.username}
              </h1>
              <p className="curator-profile__bio">{curator.bio}</p>
              <div className="curator-profile__tags">
                {curator.tags.map((tag) => <span key={tag}>#{tag.toUpperCase()}</span>)}
              </div>
              <button
                className={`curator-profile__follow curator-profile__follow--profile${isFollowing ? " is-following" : ""}`}
                type="button"
                aria-pressed={isFollowing}
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <div className="curator-profile__summary">
            <p className="curator-profile__summary-copy">
              <span className="curator-profile__summary-time">{curator.musicIdentity.activeTime} 사이,</span>{" "}
              <span className="curator-profile__summary-statement">{curatorSummary}</span>
            </p>
            <div className="curator-profile__rotation" aria-label="Current rotation">
              <span>CURRENT ROTATION</span>
              {rotationLead && (
                <button
                  className="curator-profile__rotation-lead"
                  type="button"
                  aria-label={`${rotationLead.title} by ${rotationLead.artist} 재생`}
                  onClick={() => playTrack(rotationLead)}
                >
                  <img src={rotationLead.cover} alt="" />
                  <span>
                    <strong>{rotationLead.title}</strong>
                    <small>{rotationLead.artist}</small>
                    <small className="curator-profile__rotation-more">+ {Math.max(0, tracks.rotation.length - 1)} more in rotation</small>
                  </span>
                </button>
              )}
              <div className="curator-profile__rotation-context">
                <span>FAVORITE WINDOW</span>
                <strong>{curator.musicIdentity.activeTime}</strong>
              </div>
            </div>

            <div className="curator-profile__aside">
              <button
                className={`curator-profile__follow curator-profile__follow--summary${isFollowing ? " is-following" : ""}`}
                type="button"
                aria-pressed={isFollowing}
                onClick={toggleFollow}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <dl className="curator-profile__stats">
                <div><dt>{curator.stats.moments}</dt><dd>Moments</dd></div>
                <div><dt>{curator.stats.playlists}</dt><dd>Playlists</dd></div>
                <div><dt>{curator.stats.followers}</dt><dd>Followers</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="curator-profile__identity curator-profile__section">
        <header><span>01</span><div><h2>Music Identity</h2><p>이 큐레이터의 시간과 취향을 이루는 네 가지 단서</p></div></header>
        <div className="curator-profile__identity-grid">
          <article><span>Most active time</span><strong>{curator.musicIdentity.activeTime}</strong></article>
          <article><span>Favorite mood</span><strong>{curator.musicIdentity.mood}</strong></article>
          <article><span>Most played genre</span><strong>{curator.musicIdentity.genre}</strong></article>
          <article><span>Listening style</span><strong>{curator.musicIdentity.listeningStyle}</strong></article>
        </div>
      </section>

      <section className="curator-profile__section curator-profile__moments">
        <header><span>02</span><div><h2>Recent Moments</h2><p>최근 음악과 함께 남겨 둔 시간과 장면</p></div></header>
        <div className="curator-profile__moment-grid">
          {tracks.moments.map((moment) => (
            <article className="leftnow-card curator-profile__moment-card" key={`${curator.id}-${moment.track.id}`}>
              <div className="leftnow-text">
                <strong>{moment.title}</strong>
                <span>{moment.time} · {moment.scene}</span>
                <p>{moment.text}</p>
              </div>
              <img className="leftnow-image" src={moment.track.cover} alt={`${moment.track.title} cover`} />
              <div className="leftnow-bottom">
                <button type="button" onClick={() => playTrack(moment.track)}><PlayIcon /> Play</button>
                <span>{moment.track.title} · {moment.track.artist}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="curator-profile__section curator-profile__playlists">
        <header><span>03</span><div><h2>Curated Playlists</h2><p>한 순간의 결을 길게 이어 만든 플레이리스트</p></div></header>
        <div className="curator-profile__playlist-grid">
          {tracks.playlists.map((playlist, index) => (
            <article className="curator-profile__playlist-card" key={playlist.id}>
              <div className="curator-profile__playlist-covers">
                {playlist.tracks.map((track) => <img src={track.cover} alt="" key={track.id} />)}
              </div>
              <span>PLAYLIST · {String(index + 1).padStart(2, "0")}</span>
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
              <footer>
                <span>{playlist.tracks.length} tracks · {playlist.duration}</span>
                <button type="button" aria-label={`${playlist.title} 재생`} onClick={() => playTrack(playlist.tracks[0])}><PlayIcon /> PLAY</button>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="curator-profile__section curator-profile__favorites">
        <header><span>04</span><div><h2>Tracks on Repeat</h2><p>이 큐레이터의 취향을 가장 선명하게 보여주는 곡</p></div></header>
        <div className="curator-profile__track-list">
          {tracks.favorites.map((track, index) => {
            const activity = getTrackActivity(track.id);
            return (
              <button type="button" onClick={() => playTrack(track)} key={track.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <img src={track.cover} alt="" />
                <span><strong>{track.title}</strong><small>{track.artist}</small></span>
                <span className="curator-profile__track-activity" aria-label={`${activity.likes} likes, ${activity.listening} listening now`}>
                  <span><i aria-hidden="true">♡</i>{activity.likes}</span>
                  <span><i className="is-live" aria-hidden="true" />{activity.listening}</span>
                </span>
                <time>{track.duration}</time>
                <span className="curator-profile__track-play" aria-hidden="true"><PlayIcon /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="curator-profile__section curator-profile__similar">
        <header><span>05</span><div><h2>Similar Curators</h2><p>비슷한 시간과 음악의 결을 가진 사람들</p></div></header>
        <div className="curator-profile__similar-list">
          {similarCurators.map((similar) => (
            <Link className="curator-item" to={`/curator/${similar.id}`} key={similar.id}>
              <img className="curator-circle" src={similar.profileImage} alt={`${similar.username} profile`} />
              <span>{similar.username}</span>
            </Link>
          ))}
        </div>
      </section>

      <TempyFooter label={`${curator.username} · Curator Archive`} />
    </main>
  );
}

export default CuratorProfile;
