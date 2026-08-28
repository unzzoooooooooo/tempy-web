import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import TempyFooter from "../components/TempyFooter";
import { PlayIcon } from "../components/TempyIcons";
import {
  getAlbumById,
  getArtistById,
  getArtistDisplayImage,
  getTracksByAlbum,
} from "../data/musicCatalog";

const albumFlow = [
  { number: "01", label: "OPENING", title: "First Light", length: "00:00 — 11:42" },
  { number: "02", label: "SPOTLIGHT", title: "Main Stage", length: "11:43 — 27:18" },
  { number: "03", label: "AFTERGLOW", title: "Final Scene", length: "27:19 — 41:06" },
];

const listeningOrder = [
  { time: "07:20", label: "MORNING", text: "A quiet opening" },
  { time: "10:40", label: "LATE MORNING", text: "A gentle lift" },
  { time: "14:10", label: "AFTERNOON", text: "Into the spotlight" },
  { time: "18:20", label: "EVENING", text: "The brightest scene" },
  { time: "21:35", label: "NIGHT", text: "After the curtain" },
  { time: "00:15", label: "LATE NIGHT", text: "The final afterglow" },
];

function TrackTraceAlbum() {
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { albumId } = useParams();
  const album = getAlbumById(albumId || location.state?.albumId) || getAlbumById("life-of-a-showgirl");
  const artist = getArtistById(album.artistId);
  const artistImage = getArtistDisplayImage(artist.name, { trackCover: album.cover });
  const albumTracks = useMemo(() => getTracksByAlbum(album.id), [album.id]);
  const totalDuration = albumTracks.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(":").map(Number);
    return total + (minutes * 60) + seconds;
  }, 0);
  const runtime = `${Math.floor(totalDuration / 60)} min ${String(totalDuration % 60).padStart(2, "0")} sec`;

  useEffect(() => {
    const handlePlayerProgress = (event) => {
      const trackId = event.detail?.trackId;
      setActiveTrackId(albumTracks.some((track) => track.id === trackId) ? trackId : null);
      setIsTrackPlaying(Boolean(event.detail?.isPlaying));
    };

    window.addEventListener("tempy-player-progress", handlePlayerProgress);
    return () => window.removeEventListener("tempy-player-progress", handlePlayerProgress);
  }, [albumTracks]);

  return (
    <main className="track-trace-album">
      <section className="track-trace-album__hero">
        <button className="track-trace-album__back detail-back-link" type="button" aria-label="Track detail로 돌아가기" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>BACK TO TRACK DETAIL</span>
        </button>

        <div className="track-trace-album__hero-grid">
          <div className="track-trace-album__cover">
            <img src={album.cover} alt={`${album.title} album cover`} />
            <span>ALBUM · {album.releaseDate}</span>
          </div>

          <div className="track-trace-album__intro">
            <Link className="track-trace-album__artist-link" to={`/artist/${artist.id}`}>
              <img src={artistImage} alt={artist.name} />
              <span>{artist.name}</span>
              <span aria-hidden="true">›</span>
            </Link>
            <p className="track-trace-album__eyebrow">{artist.name} · Studio Album</p>
            <h1>{album.title}</h1>

            <dl className="track-trace-album__meta">
              <div><dt>RELEASE</dt><dd>{album.releaseDate}</dd></div>
              <div><dt>TRACKS</dt><dd>{albumTracks.length} Songs</dd></div>
              <div><dt>RUN TIME</dt><dd>{runtime}</dd></div>
              <div><dt>LANGUAGE</dt><dd>{album.language}</dd></div>
            </dl>

            <p className="track-trace-album__description">
              무대 위의 찬란한 순간과 막이 내린 뒤의 고요함을 하나의 흐름으로 엮은 앨범입니다.
              화려한 장면 사이에 남겨진 감정과 시간의 결을 따라 천천히 감상해보세요.
            </p>

            <div className="track-trace-album__actions">
              <button
                type="button"
                data-tempy-playable
                data-tempy-id={albumTracks[0].id}
                data-tempy-title={albumTracks[0].title}
                data-tempy-artist={albumTracks[0].artist}
                data-tempy-cover={albumTracks[0].cover}
                data-tempy-duration={albumTracks[0].duration}
              >
                <PlayIcon /> PLAY ALBUM
              </button>
              <button type="button">KEEP ALBUM <span aria-hidden="true">＋</span></button>
            </div>
          </div>
        </div>
      </section>

      <section className="track-trace-album__overview">
        <div className="track-trace-album__flow">
          <div className="track-trace-album__section-head">
            <p>LISTENING STRUCTURE</p>
            <h2>Album Flow</h2>
          </div>

          <div className="track-trace-album__flow-list">
            {albumFlow.map((flow) => (
              <article key={flow.number}>
                <span>{flow.number}</span>
                <div><p>{flow.label}</p><h3>{flow.title}</h3></div>
                <time>{flow.length}</time>
              </article>
            ))}
          </div>
        </div>

        <div className="track-trace-album__tracks">
          <div className="track-trace-album__section-head">
            <p>{albumTracks.length} SONGS · {runtime.toUpperCase()}</p>
            <h2>Tracklist</h2>
          </div>

          <ol className="track-trace-album__tracklist">
            {albumTracks.map((track, index) => {
              const number = String(index + 1).padStart(2, "0");
              const isActive = activeTrackId === track.id;

              return (
              <li
                className={isActive ? "track-trace-album__track--active" : ""}
                data-tempy-playable
                data-tempy-id={track.id}
                data-tempy-title={track.title}
                data-tempy-artist={track.artist}
                data-tempy-cover={track.cover}
                data-tempy-duration={track.duration}
                key={track.id}
              >
                <span>{number}</span>
                <strong>{track.title}</strong>
                <time>{track.duration}</time>
                <button
                  type="button"
                  data-now-player-control
                  aria-label={`${track.title} ${isActive && isTrackPlaying ? "일시정지" : "재생"}`}
                  aria-pressed={isActive && isTrackPlaying}
                  onClick={() => {
                    if (isActive) {
                      window.dispatchEvent(new CustomEvent("tempy-toggle-playback"));
                      return;
                    }

                    window.dispatchEvent(new CustomEvent("tempy-play-track", {
                      detail: {
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        cover: track.cover,
                        albumId: track.albumId,
                        artistId: track.artistId,
                        duration: track.duration,
                      },
                    }));
                  }}
                >
                  <span aria-hidden="true">{isActive && isTrackPlaying ? "Ⅱ" : <PlayIcon />}</span>
                </button>
              </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="track-trace-album__timeline">
        <div className="track-trace-album__section-head">
          <p>FROM MORNING TO NIGHT</p>
          <h2>Moment Listening Order</h2>
        </div>
        <p className="track-trace-album__timeline-description">
          하루의 시간에 따라 달라지는 앨범의 장면을 순서대로 만나보세요.
        </p>

        <div className="track-trace-album__timeline-track">
          {listeningOrder.map((moment, index) => (
            <article key={moment.time}>
              <span className="track-trace-album__timeline-dot" />
              <small>0{index + 1} · {moment.label}</small>
              <h3>{moment.time}</h3>
              <p>{moment.text}</p>
            </article>
          ))}
        </div>
      </section>

      <TempyFooter className="track-trace-album__footer" />
    </main>
  );
}

export default TrackTraceAlbum;
