export const albumImages = [
  "/images/album-01.png",
  "/images/album-02.png",
  "/images/album-03.png",
  "/images/album-04.png",
  "/images/album-05.png",
  "/images/album-06.png",
  "/images/album-07.png",
  "/images/album-08.png",
  "/images/album-09.png",
  "/images/album-10.png",
  "/images/album-11.png",
  "/images/album-12.png",
  "/images/album-13.png",
  "/images/album-14.png",
  "/images/album-15.png",
  "/images/album-16.png",
  "/images/album-17.png",
  "/images/album-18.png",
  "/images/album-19.png",
  "/images/album-20.png",
  "/images/album-21.png",
  "/images/album-22.png",
  "/images/album-23.png",
  "/images/album-24.png",
  "/images/album-25.png",
  "/images/album-26.png",
  "/images/album-27.png",
  "/images/album-28.png",
  "/images/album-29.png",
  "/images/album-30.png",
  "/images/album-31.png",
  "/images/album-32.jpg",
  "/images/album-33.png",
  "/images/album-34.png",
  "/images/album-35.png",
  "/images/album-36.png",
  "/images/album-37.png",
  "/images/album-38.png",
  "/images/album-39.png",
  "/images/album-40.png",
  "/images/album-41.png",
  "/images/album-42.png",
  "/images/album-43.png",
  "/images/album-44.png",
  "/images/album-45.png",
  "/images/album-46.png",
  "/images/album-47.png",
  "/images/album-48.png",
  "/images/album-49.png",
  "/images/album-50.png",
  "/images/album-51.png",
  "/images/album-52.png",
  "/images/album-53.png",
  "/images/album-54.png",
  "/images/album-55.png",
  "/images/album-56.png",
  "/images/album-57.png",
  "/images/album-58.png",
  "/images/album-59.png",
  "/images/album-60.png",
  "/images/album-61.png",
  "/images/album-62.png",
  "/images/album-63.png",
  "/images/album-64.png",
  "/images/album-65.png",
  "/images/album-66.png",
  "/images/album-67.png",
  "/images/album-68.png",
  "/images/album-69.png",
  "/images/album-70.png",
  "/images/album-71.png",
  "/images/album-72.png",
];

export const artistImages = [
  "/images/artist-01.png",
  "/images/artist-02.png",
  "/images/artist-03.png",
  "/images/artist-04.png",
  "/images/artist-05.png",
  "/images/artist-06.png",
  "/images/artist-07.png",
  "/images/artist-08.png",
];

export const profileImages = [
  "/images/profile-01.png",
  "/images/profile-02.png",
  "/images/profile-03.png",
  "/images/profile-04.png",
  "/images/profile-05.png",
  "/images/profile-06.png",
  "/images/profile-07.png",
  "/images/profile-08.png",
  "/images/profile-09.jpg",
];

export const lpTextureImage = "/images/lp-texture-overlay.png.png";

const hashSeed = (value) => {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const createSeededRandom = (seed) => {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const createAlbumImageSequence = (count, seed = "tempy") => {
  const result = [];
  let cycle = 0;

  while (result.length < count) {
    const random = createSeededRandom(`${seed}-${cycle}`);
    const shuffled = [...albumImages];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    result.push(...shuffled);
    cycle += 1;
  }

  return result.slice(0, count);
};

export const getAlbumImage = (index, seed = "tempy") => (
  createAlbumImageSequence(index + 1, seed)[index]
);

export const getProfileImage = (index) => profileImages[index % profileImages.length];
export const getArtistImage = (index) => artistImages[index % artistImages.length];

