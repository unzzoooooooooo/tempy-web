const curatorTrackPool = [
  "gone-are-the-days",
  "birds-of-a-feather",
  "traveler",
  "style",
  "wait",
  "free-love",
  "two-weeks",
  "casual-lady",
  "take-a-bite",
  "take-a-chance-with-me",
  "blinding-lights",
  "delicate",
  "whiplash",
  "future-shine",
  "you-and-me",
  "drivers-license",
  "like-jennie",
  "good-feeling",
];

const momentScenes = [
  ["23:42", "비가 멈춘 골목", "젖은 도로에 불빛이 길게 남을 때 다시 찾는 곡이에요.", "RAINY NIGHT"],
  ["01:16", "마지막 버스를 놓친 밤", "서두르지 않아도 된다는 기분을 이 구간에서 기억해요.", "LATE BUS"],
  ["18:34", "퇴근 뒤 강변 산책", "도시의 소리가 조금씩 낮아질 때 가장 잘 들려요.", "EVENING WALK"],
  ["07:48", "커튼을 여는 아침", "첫 햇빛과 함께 들으면 하루의 속도가 부드러워져요.", "SLOW MORNING"],
  ["15:22", "오래 머문 창가", "말없이 시간을 보내고 싶은 오후에 남긴 순간이에요.", "WINDOW LIGHT"],
  ["21:09", "불빛이 켜지는 시간", "익숙한 길도 이 노래와 걸으면 조금 다르게 보여요.", "CITY LIGHT"],
];

const curatorSeeds = [
  { id: "mandudu-king", username: "만두두왕", profileImage: "/images/profile-01.png", bio: "햇빛 좋은 주말과 가벼운 산책에 어울리는 음악을 모아요.", tags: ["sunny", "walk", "indie", "bright"], activeTime: "09:00 – 12:00", mood: "Bright / Easy", genre: "Indie Pop", style: "Weekend Wanderer", stats: [31, 8, "2.1k"], offset: 3 },
  { id: "canele-today", username: "오늘은까눌레", profileImage: "/images/profile-02.png", bio: "작은 카페의 온도와 천천히 식는 오후를 음악으로 기록해요.", tags: ["cafe", "warm", "acoustic", "slow"], activeTime: "14:00 – 18:00", mood: "Warm / Mellow", genre: "Acoustic Pop", style: "Window-seat Listener", stats: [27, 6, "1.8k"], offset: 5 },
  { id: "hostless", username: "hostless", profileImage: "/images/profile-03.png", bio: "늦은 밤 혼자 걷거나 이동할 때 듣는 음악을 자주 남겨요.", tags: ["night", "city", "slow", "indie", "rainy"], activeTime: "23:00 – 02:00", mood: "Night / Calm", genre: "Indie Pop", style: "Late-night Walker", stats: [24, 7, "1.5k"], offset: 0 },
  { id: "dawn-bus", username: "새벽버스", profileImage: "/images/profile-04.png", bio: "도시가 깨어나기 전, 첫차 창문에 겹치는 음악을 기록합니다.", tags: ["dawn", "bus", "ambient", "blue"], activeTime: "05:00 – 08:00", mood: "Dawn / Quiet", genre: "Ambient Pop", style: "First-bus Observer", stats: [19, 5, "980"], offset: 8 },
  { id: "slow-wave", username: "느린파도", profileImage: "/images/profile-05.png", bio: "바다와 긴 호흡, 서두르지 않는 리듬을 좋아해요.", tags: ["ocean", "calm", "slow", "dreamy"], activeTime: "16:00 – 20:00", mood: "Calm / Open", genre: "Dream Pop", style: "Slow-wave Collector", stats: [38, 9, "2.4k"], offset: 2 },
  { id: "paper-plane", username: "종이비행기", profileImage: "/images/profile-06.png", bio: "짧은 여행과 낯선 동네에서 발견한 멜로디를 접어 둡니다.", tags: ["travel", "breeze", "folk", "day"], activeTime: "11:00 – 15:00", mood: "Light / Curious", genre: "Folk Pop", style: "Day-trip Listener", stats: [22, 6, "1.2k"], offset: 11 },
  { id: "quince-tea", username: "모과차", profileImage: "/images/profile-07.png", bio: "따뜻한 차 한 잔처럼 오래 남는 목소리와 가사를 모아요.", tags: ["warm", "voice", "lyrics", "home"], activeTime: "20:00 – 23:00", mood: "Warm / Reflective", genre: "Singer-Songwriter", style: "Quiet-room Reader", stats: [29, 8, "1.9k"], offset: 6 },
  { id: "tangerine-peel", username: "귤껍질수집가", profileImage: "/images/profile-08.png", bio: "선명한 색과 장난스러운 리듬이 있는 팝을 좋아합니다.", tags: ["citrus", "pop", "playful", "fresh"], activeTime: "12:00 – 17:00", mood: "Fresh / Playful", genre: "Alternative Pop", style: "Colorful Digger", stats: [34, 10, "2.7k"], offset: 13 },
  { id: "soap-scent", username: "비누향", profileImage: "/images/profile-06.png", bio: "깨끗한 아침 공기와 여백이 많은 사운드를 기록해요.", tags: ["clean", "morning", "soft", "minimal"], activeTime: "07:00 – 10:00", mood: "Soft / Clear", genre: "Minimal Pop", style: "Morning Minimalist", stats: [17, 4, "840"], offset: 4 },
  { id: "moonletter", username: "moonletter", profileImage: "/images/profile-01.png", bio: "달빛 아래 쓰다 만 편지처럼 여운이 긴 곡을 남깁니다.", tags: ["moon", "letter", "r&b", "midnight"], activeTime: "00:00 – 03:00", mood: "Intimate / Deep", genre: "Alternative R&B", style: "Midnight Letterer", stats: [41, 11, "3.2k"], offset: 9 },
  { id: "little-noise", username: "작은소음", profileImage: "/images/profile-04.png", bio: "일상의 작은 소리 사이에서 발견한 리듬을 아카이브합니다.", tags: ["field", "texture", "city", "quiet"], activeTime: "17:00 – 21:00", mood: "Textured / Calm", genre: "Electronic Indie", style: "Everyday Recorder", stats: [26, 7, "1.4k"], offset: 14 },
  { id: "bluehour", username: "bluehour", profileImage: "/images/profile-07.png", bio: "낮과 밤 사이, 색이 가장 깊어지는 시간의 음악을 모아요.", tags: ["bluehour", "sunset", "drive", "dreamy"], activeTime: "18:00 – 20:00", mood: "Blue / Dreamy", genre: "Synth Pop", style: "Twilight Driver", stats: [45, 12, "3.8k"], offset: 1 },
  { id: "old-headphones", username: "오래된헤드폰", profileImage: "/images/profile-08.png", bio: "오래 들을수록 좋아지는 앨범과 기억의 결을 기록합니다.", tags: ["memory", "album", "analog", "deep"], activeTime: "21:00 – 01:00", mood: "Nostalgic / Deep", genre: "Alternative", style: "Album Archivist", stats: [52, 14, "4.1k"], offset: 7 },
  { id: "end-of-summer", username: "여름끝", profileImage: "/images/profile-03.png", bio: "계절이 바뀌기 직전의 빛과 온도를 음악으로 남겨요.", tags: ["summer", "afterglow", "warm", "memory"], activeTime: "16:30 – 19:30", mood: "Warm / Bittersweet", genre: "Indie Rock", style: "Season Keeper", stats: [33, 9, "2.3k"], offset: 10 },
  { id: "midnightnote", username: "midnightnote", profileImage: "/images/profile-05.png", bio: "잠들기 전에만 선명해지는 생각과 음악을 짧게 적어 둡니다.", tags: ["midnight", "note", "slow", "intimate"], activeTime: "00:30 – 03:30", mood: "Quiet / Intimate", genre: "Bedroom Pop", style: "After-hours Writer", stats: [36, 10, "2.9k"], offset: 12 },
  { id: "waveclub", username: "waveclub", profileImage: "/images/profile-06.png", bio: "리듬이 반복될수록 선명해지는 밤의 에너지를 모읍니다.", tags: ["wave", "loop", "night", "rhythm"], activeTime: "22:00 – 01:00", mood: "Night / Flow", genre: "Electronic Pop", style: "Night-loop Digger", stats: [28, 7, "1.7k"], offset: 15 },
  { id: "nightloop", username: "nightloop", profileImage: "/images/profile-08.png", bio: "한밤중에 반복해서 듣게 되는 짧고 강한 훅을 기록해요.", tags: ["night", "loop", "synth", "drive"], activeTime: "23:30 – 02:30", mood: "Dark / Focused", genre: "Synth Pop", style: "Repeat Listener", stats: [32, 8, "2.2k"], offset: 16 },
  { id: "dawnzip", username: "dawnzip", profileImage: "/images/profile-04.png", bio: "새벽의 장면을 짧게 압축해 음악과 함께 보관합니다.", tags: ["dawn", "archive", "soft", "city"], activeTime: "04:30 – 07:00", mood: "Pale / Quiet", genre: "Ambient Indie", style: "Dawn Archivist", stats: [21, 5, "1.1k"], offset: 17 },
  { id: "rainyroom", username: "rainyroom", profileImage: "/images/profile-05.png", bio: "비 오는 방 안에서 더 또렷하게 들리는 목소리를 좋아해요.", tags: ["rain", "room", "voice", "slow"], activeTime: "19:00 – 23:00", mood: "Rainy / Intimate", genre: "Indie Ballad", style: "Indoor Listener", stats: [37, 9, "2.6k"], offset: 1 },
  { id: "slowtempo", username: "slowtempo", profileImage: "/images/profile-09.jpg", bio: "빠르게 지나가는 하루에서 속도를 낮춰 주는 곡을 고릅니다.", tags: ["slow", "tempo", "rest", "warm"], activeTime: "13:00 – 17:00", mood: "Slow / Restful", genre: "Chill Pop", style: "Tempo Keeper", stats: [25, 6, "1.3k"], offset: 4 },
  { id: "cloudtea", username: "cloudtea", profileImage: "/images/profile-02.png", bio: "흐린 날과 따뜻한 차 사이에 어울리는 부드러운 선곡을 남겨요.", tags: ["cloud", "tea", "mellow", "acoustic"], activeTime: "14:00 – 18:30", mood: "Cloudy / Warm", genre: "Acoustic Indie", style: "Cloudy-day Sipper", stats: [23, 6, "1.2k"], offset: 6 },
  { id: "roomtone", username: "roomtone", profileImage: "/images/profile-04.png", bio: "공간의 잔향과 작은 숨소리까지 들리는 음악을 모읍니다.", tags: ["room", "tone", "ambient", "detail"], activeTime: "20:30 – 00:30", mood: "Detailed / Quiet", genre: "Ambient R&B", style: "Room-tone Observer", stats: [30, 8, "2.0k"], offset: 8 },
  { id: "slowday", username: "slowday", profileImage: "/images/profile-07.png", bio: "아무 일정 없는 날처럼 느슨하고 편안한 음악을 좋아합니다.", tags: ["slowday", "easy", "home", "sunset"], activeTime: "10:30 – 16:00", mood: "Easy / Soft", genre: "Soft Pop", style: "Unhurried Listener", stats: [20, 5, "960"], offset: 10 },
];

const getRotatedTracks = (offset, count) => Array.from(
  { length: count },
  (_, index) => curatorTrackPool[(offset + index) % curatorTrackPool.length],
);

const getCurrentRotationTracks = (offset, curatorIndex) => [
  curatorTrackPool[offset % curatorTrackPool.length],
  curatorTrackPool[(offset + (curatorIndex % 8) + 1) % curatorTrackPool.length],
  curatorTrackPool[(offset + ((curatorIndex * 5) % 9) + 9) % curatorTrackPool.length],
];

export const curatorProfiles = curatorSeeds.map((curator, curatorIndex, allCurators) => {
  const recentTrackIds = getRotatedTracks(curator.offset, 4);
  const playlistTrackIds = getRotatedTracks(curator.offset + 2, 9);
  const playlistTitles = [
    `${curator.tags[0]}의 온도로 걷는 시간`,
    `${curator.musicIdentity?.mood || curator.mood} 사이에 머무는 곡`,
    `${curator.activeTime.split(" – ")[0]} 이후의 작은 아카이브`,
  ];

  return {
    id: curator.id,
    username: curator.username,
    profileImage: curator.profileImage,
    bio: curator.bio,
    tags: curator.tags,
    stats: {
      moments: curator.stats[0],
      playlists: curator.stats[1],
      followers: curator.stats[2],
    },
    musicIdentity: {
      activeTime: curator.activeTime,
      mood: curator.mood,
      genre: curator.genre,
      listeningStyle: curator.style,
    },
    recentMoments: recentTrackIds.map((trackId, index) => {
      const scene = momentScenes[(curator.offset + index) % momentScenes.length];
      return { trackId, time: scene[0], title: scene[1], text: scene[2], scene: scene[3] };
    }),
    playlists: playlistTitles.map((title, index) => ({
      id: `${curator.id}-playlist-${index + 1}`,
      title,
      description: ["걷는 속도에 맞춰 천천히 이어지는 곡들", "빛과 공기가 바뀌는 순간을 위한 선곡", "한 장면을 오래 기억하게 하는 음악"][index],
      trackIds: playlistTrackIds.slice(index * 3, (index + 1) * 3),
      duration: ["38 min", "42 min", "35 min"][index],
    })),
    currentRotationTrackIds: getCurrentRotationTracks(curator.offset, curatorIndex),
    favoriteTrackIds: getRotatedTracks(curator.offset + 5, 6),
    similarCurators: [1, 3, 6, 9].map((step) => allCurators[(curatorIndex + step) % allCurators.length].id),
  };
});

export const homeMomentCurators = curatorProfiles.slice(0, 15);

const curatorProfileMap = new Map(curatorProfiles.map((curator) => [curator.id, curator]));

export const getCuratorProfile = (curatorId) => curatorProfileMap.get(curatorId);

export const getCuratorProfileByUsername = (username) => curatorProfiles.find(
  (curator) => curator.username.toLocaleLowerCase() === String(username).toLocaleLowerCase(),
);
