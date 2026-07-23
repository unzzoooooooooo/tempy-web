/*
 * Stable music metadata shared by cards, detail views, and the global player.
 * `isMock` marks locally identifiable artwork whose real-world metadata could
 * not be verified from the bundled asset alone.
 */
export const artists = [
  { id: "taylor-swift", name: "Taylor Swift", profile: "/images/album-10.png", genres: ["Pop", "Singer-Songwriter"] },
  { id: "billie-eilish", name: "Billie Eilish", profile: "/images/album-03.png", genres: ["Alternative", "Pop"] },
  { id: "newjeans", name: "NewJeans", profile: "/images/album-04.png", genres: ["K-Pop", "Pop"] },
  { id: "the-weeknd", name: "The Weeknd", profile: "/images/album-05.png", genres: ["Pop", "R&B"] },
  { id: "honne", name: "HONNE", profile: "/images/album-06.png", genres: ["Electronic", "R&B"] },
  { id: "official-hige-dandism", name: "Official HIGE DANDism", profile: "/images/album-07.png", genres: ["J-Pop", "Rock"] },
  { id: "ariana-grande", name: "Ariana Grande", profile: "/images/album-08.png", genres: ["Pop", "R&B"] },
  { id: "jane-and-the-boy", name: "Jane & The Boy", profile: "/images/album-14.png", genres: ["Indie Pop"], isMock: true },
  { id: "charli-xcx", name: "Charli xcx", profile: "/images/album-16.png", genres: ["Pop", "Electronic"] },
  { id: "harry-styles", name: "Harry Styles", profile: "/images/album-17.png", genres: ["Pop", "Rock"] },
  { id: "xg", name: "XG", profile: "/images/album-18.png", genres: ["Pop", "R&B"] },
  { id: "aespa", name: "aespa", profile: "/images/album-24.png", genres: ["K-Pop", "Electronic"] },
  { id: "jennie", name: "JENNIE", profile: "/images/artist-01.png", genres: ["K-Pop", "Hip-Hop"] },
  { id: "akmu", name: "AKMU", profile: "/images/artist-02.png", genres: ["K-Pop", "Folk Pop"] },
  { id: "hanroro", name: "HANRORO", profile: "/images/artist-03.png", genres: ["Indie Rock", "Singer-Songwriter"] },
  { id: "rose", name: "ROSÉ", profile: "/images/album-27.png", genres: ["Pop", "Pop Rock"] },
  { id: "arlie", name: "Arlie", profile: "/images/album-28.png", genres: ["Indie Pop"] },
  { id: "mamas-boy", name: "MAMA'S BOY", profile: "/images/album-22.png", genres: ["Indie Pop"], isMock: true },
  { id: "tempy-archive", name: "Tempy Archive", profile: "/images/profile-03.png", genres: ["Archive Pop"], isMock: true },
];

export const albums = [
  { id: "life-of-a-showgirl", title: "The Life of a Showgirl", artistId: "taylor-swift", cover: "/images/album-01.png", releaseDate: "2025", language: "English" },
  { id: "upside-down-archive", title: "Upside Down Archive", artistId: "tempy-archive", cover: "/images/album-02.png", releaseDate: "2025", language: "English", isMock: true },
  { id: "hit-me-hard-and-soft", title: "HIT ME HARD AND SOFT", artistId: "billie-eilish", cover: "/images/album-03.png", releaseDate: "2024", language: "English" },
  { id: "new-jeans", title: "New Jeans", artistId: "newjeans", cover: "/images/album-04.png", releaseDate: "2023", language: "Korean" },
  { id: "blinding-lights", title: "Blinding Lights", artistId: "the-weeknd", cover: "/images/album-05.png", releaseDate: "2019", language: "English" },
  { id: "gone-are-the-days", title: "Gone Are the Days", artistId: "honne", cover: "/images/album-06.png", releaseDate: "2016", language: "English" },
  { id: "traveler", title: "Traveler", artistId: "official-hige-dandism", cover: "/images/album-07.png", releaseDate: "2019", language: "Japanese" },
  { id: "sweetener", title: "Sweetener", artistId: "ariana-grande", cover: "/images/album-08.png", releaseDate: "2018", language: "English" },
  { id: "tattoo", title: "TATTOO", artistId: "official-hige-dandism", cover: "/images/album-09.png", releaseDate: "2023", language: "Japanese" },
  { id: "midnights", title: "Midnights", artistId: "taylor-swift", cover: "/images/album-10.png", releaseDate: "2022", language: "English" },
  { id: "evermore", title: "evermore", artistId: "taylor-swift", cover: "/images/album-11.png", releaseDate: "2020", language: "English" },
  { id: "lover", title: "Lover", artistId: "taylor-swift", cover: "/images/album-12.png", releaseDate: "2019", language: "English" },
  { id: "reputation", title: "reputation", artistId: "taylor-swift", cover: "/images/album-13.png", releaseDate: "2017", language: "English" },
  { id: "good-feeling", title: "Good Feeling", artistId: "jane-and-the-boy", cover: "/images/album-14.png", releaseDate: "2024", language: "English", isMock: true },
  { id: "catch-me", title: "Catch Me", artistId: "jane-and-the-boy", cover: "/images/album-15.png", releaseDate: "2024", language: "English", isMock: true },
  { id: "brat", title: "BRAT", artistId: "charli-xcx", cover: "/images/album-16.png", releaseDate: "2024", language: "English" },
  { id: "fine-line", title: "Fine Line", artistId: "harry-styles", cover: "/images/album-17.png", releaseDate: "2019", language: "English" },
  { id: "puppet-show", title: "Puppet Show", artistId: "xg", cover: "/images/album-18.png", releaseDate: "2023", language: "English" },
  { id: "1989", title: "1989", artistId: "taylor-swift", cover: "/images/album-19.png", releaseDate: "2014", language: "English" },
  { id: "mood", title: "MOOD", artistId: "jane-and-the-boy", cover: "/images/album-20.png", releaseDate: "2024", language: "English", isMock: true },
  { id: "disco-room", title: "Disco Room", artistId: "tempy-archive", cover: "/images/album-21.png", releaseDate: "2025", language: "English", isMock: true },
  { id: "mamas-boy", title: "MAMA'S BOY", artistId: "mamas-boy", cover: "/images/album-22.png", releaseDate: "2024", language: "English", isMock: true },
  { id: "soft-static", title: "Soft Static", artistId: "tempy-archive", cover: "/images/album-23.png", releaseDate: "2025", language: "English", isMock: true },
  { id: "rich-man", title: "Rich Man", artistId: "aespa", cover: "/images/album-24.png", releaseDate: "2025", language: "Korean" },
  { id: "citrus-glow", title: "Citrus Glow", artistId: "tempy-archive", cover: "/images/album-25.png", releaseDate: "2025", language: "English", isMock: true },
  { id: "you-and-me", title: "You & Me", artistId: "jennie", cover: "/images/album-26.png", releaseDate: "2023", language: "English" },
  { id: "rosie", title: "rosie", artistId: "rose", cover: "/images/album-27.png", releaseDate: "2024", language: "English" },
  { id: "wait", title: "Wait", artistId: "arlie", cover: "/images/album-28.png", releaseDate: "2018", language: "English" },
  { id: "whiplash", title: "Whiplash", artistId: "aespa", cover: "/images/album-29.png", releaseDate: "2024", language: "Korean" },
  { id: "armageddon", title: "Armageddon", artistId: "aespa", cover: "/images/album-30.png", releaseDate: "2024", language: "Korean" },
  { id: "ruby", title: "Ruby", artistId: "jennie", cover: "/images/album-31.png", releaseDate: "2025", language: "English" },
  { id: "mantra", title: "Mantra", artistId: "jennie", cover: "/images/album-32.jpg", releaseDate: "2024", language: "English" },
  { id: "akmu-profile-placeholder", title: "AKMU Artist Playlist", artistId: "akmu", cover: "/images/artist-02.png", releaseDate: "2025", language: "Korean", isPlaceholder: true },
  { id: "hanroro-profile-placeholder", title: "HANRORO Artist Playlist", artistId: "hanroro", cover: "/images/artist-03.png", releaseDate: "2025", language: "Korean", isPlaceholder: true },
];

const rawTracks = [
  ["fate-of-ophelia", "The Fate of Ophelia", "life-of-a-showgirl", "03:24"],
  ["showgirl", "Showgirl", "life-of-a-showgirl", "03:18"],
  ["under-the-spotlight", "Under the Spotlight", "life-of-a-showgirl", "03:42"],
  ["velvet-curtain", "Velvet Curtain", "life-of-a-showgirl", "03:06"],
  ["backstage-heart", "Backstage Heart", "life-of-a-showgirl", "03:31"],
  ["encore", "Encore", "life-of-a-showgirl", "03:27"],
  ["upside-down", "Upside Down", "upside-down-archive", "02:58"],
  ["birds-of-a-feather", "BIRDS OF A FEATHER", "hit-me-hard-and-soft", "03:30"],
  ["super-shy", "Super Shy", "new-jeans", "02:34"],
  ["blinding-lights", "Blinding Lights", "blinding-lights", "03:20"],
  ["gone-are-the-days", "Gone Are the Days", "gone-are-the-days", "03:42"],
  ["traveler", "Traveler", "traveler", "03:16"],
  ["sweetener", "sweetener", "sweetener", "03:28"],
  ["tattoo", "TATTOO", "tattoo", "04:42"],
  ["anti-hero", "Anti-Hero", "midnights", "03:20"],
  ["maroon", "Maroon", "midnights", "03:38"],
  ["midnight-rain", "Midnight Rain", "midnights", "02:54"],
  ["willow", "willow", "evermore", "03:34"],
  ["cruel-summer", "Cruel Summer", "lover", "02:58"],
  ["lover", "Lover", "lover", "03:41"],
  ["delicate", "Delicate", "reputation", "03:52"],
  ["good-feeling", "Good Feeling", "good-feeling", "03:12"],
  ["catch-me", "Catch Me", "catch-me", "02:48"],
  ["360", "360", "brat", "02:13"],
  ["watermelon-sugar", "Watermelon Sugar", "fine-line", "02:54"],
  ["puppet-show", "Puppet Show", "puppet-show", "03:08"],
  ["style", "Style", "1989", "03:51"],
  ["wildest-dreams", "Wildest Dreams", "1989", "03:40"],
  ["mood", "MOOD", "mood", "03:04"],
  ["disco-room", "Disco Room", "disco-room", "03:21"],
  ["mamas-boy", "Mama's Boy", "mamas-boy", "03:11"],
  ["soft-static", "Soft Static", "soft-static", "03:26"],
  ["rich-man", "Rich Man", "rich-man", "03:18"],
  ["citrus-glow", "Citrus Glow", "citrus-glow", "02:57"],
  ["you-and-me", "You & Me", "you-and-me", "02:59"],
  ["toxic-till-the-end", "toxic till the end", "rosie", "02:36"],
  ["wait", "Wait", "wait", "03:27"],
  ["whiplash", "Whiplash", "whiplash", "03:03"],
  ["armageddon", "Armageddon", "armageddon", "03:16"],
  ["like-jennie", "like JENNIE", "ruby", "02:03"],
  ["mantra", "Mantra", "mantra", "02:16"],
  ["love-lee", "Love Lee", "akmu-profile-placeholder", "02:59"],
  ["let-me-love-my-youth", "Let Me Love My Youth", "hanroro-profile-placeholder", "04:09"],
];

const artistMap = new Map(artists.map((artist) => [artist.id, artist]));
const albumMap = new Map(albums.map((album) => [album.id, album]));

export const tracks = rawTracks.map(([id, title, albumId, duration]) => {
  const album = albumMap.get(albumId);
  const artist = artistMap.get(album.artistId);
  return {
    id,
    trackId: id,
    title,
    artistId: artist.id,
    artist: artist.name,
    artistProfile: artist.profile,
    albumId,
    album: album.title,
    cover: album.cover,
    image: album.cover,
    duration,
    isMock: Boolean(album.isMock || artist.isMock),
  };
});

const trackMap = new Map(tracks.map((track) => [track.id, track]));
const coverMap = new Map();
tracks.forEach((track) => {
  if (!coverMap.has(track.cover)) coverMap.set(track.cover, track);
});

export const getArtistById = (id) => artistMap.get(id);
export const getAlbumById = (id) => albumMap.get(id);
export const getTrackById = (id) => trackMap.get(id);
export const getTrackByCover = (cover) => coverMap.get(cover);
export const getTracksByArtist = (artistId) => tracks.filter((track) => track.artistId === artistId);
export const getTracksByAlbum = (albumId) => tracks.filter((track) => track.albumId === albumId);
export const getTracksByIds = (ids) => ids.map(getTrackById).filter(Boolean);

export const normalizeMusicItem = (item) => {
  if (!item) return item;
  const cover = item.cover || item.image;
  const canonical = getTrackById(item.trackId || item.id) || getTrackByCover(cover);
  if (!canonical) return item;

  return {
    ...item,
    ...canonical,
    // Preserve view-only fields while canonicalizing all music metadata.
    comment: item.comment,
    label: item.label,
    tone: item.tone,
    selected: item.selected,
  };
};

export const trackTraceTracks = getTracksByIds([
  "birds-of-a-feather",
  "gone-are-the-days",
  "sweetener",
  "traveler",
  "soft-static",
  "rich-man",
  "citrus-glow",
  "good-feeling",
  "puppet-show",
  "blinding-lights",
  "whiplash",
  "armageddon",
  "like-jennie",
  "mantra",
]);

export const timeSetTracks = getTracksByIds([
  "mamas-boy",
  "soft-static",
  "rich-man",
  "citrus-glow",
  "you-and-me",
  "toxic-till-the-end",
  "wait",
  "whiplash",
  "armageddon",
  "like-jennie",
]);
