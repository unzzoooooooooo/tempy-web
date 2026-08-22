const DAYPART_TAGS = Object.freeze({
  lateNight: ["dreamy", "reflective", "calm", "slow", "night"],
  dawn: ["soft", "quiet", "ambient", "reflective"],
  earlyMorning: ["fresh", "soft", "light", "calm"],
  morning: ["bright", "fresh", "upbeat", "acoustic"],
  afternoon: ["energetic", "pop", "bright", "groove"],
  lateAfternoon: ["mellow", "drive", "warm", "city", "reflective"],
  evening: ["romantic", "groove", "city", "chill", "drive"],
  night: ["night", "dreamy", "moody", "reflective", "electronic"],
});

const WEATHER_TAGS = Object.freeze({
  rain: ["rainy", "reflective", "calm", "mellow", "night", "acoustic"],
  cloudy: ["soft", "mellow", "reflective", "indie"],
  sunny: ["bright", "upbeat", "drive", "energetic"],
  snow: ["calm", "warm", "dreamy", "acoustic"],
});

const ARTIST_TAGS = Object.freeze({
  "taylor swift": ["pop", "reflective", "dreamy", "bright"],
  "billie eilish": ["moody", "dreamy", "night", "slow"],
  "the weeknd": ["groove", "city", "night", "drive", "electronic"],
  honne: ["mellow", "romantic", "chill", "electronic"],
  lany: ["mellow", "romantic", "drive", "city"],
  "ariana grande": ["pop", "bright", "groove", "upbeat"],
  "harry styles": ["pop", "bright", "upbeat", "warm"],
  aespa: ["energetic", "pop", "electronic", "groove"],
  jennie: ["energetic", "pop", "groove", "city"],
  xg: ["energetic", "pop", "electronic", "groove"],
  akmu: ["acoustic", "fresh", "soft", "warm"],
  "한로로": ["indie", "reflective", "mellow", "dreamy"],
});

const FALLBACK_TAG_PROFILES = Object.freeze([
  ["bright", "fresh", "upbeat", "pop"],
  ["mellow", "soft", "reflective", "indie"],
  ["groove", "city", "drive", "electronic"],
  ["dreamy", "calm", "night", "ambient"],
  ["warm", "romantic", "acoustic", "slow"],
  ["energetic", "light", "pop", "drive"],
]);

export function hashSeed(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(items, seed) {
  const random = createSeededRandom(seed);
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function getDaypart(hour) {
  const normalizedHour = Math.max(0, Math.min(23, Math.floor(Number(hour) || 0)));
  return [
    "lateNight",
    "dawn",
    "earlyMorning",
    "morning",
    "afternoon",
    "lateAfternoon",
    "evening",
    "night",
  ][Math.floor(normalizedHour / 3)];
}

export function normalizeWeather(condition) {
  const weatherCode = Number(condition);
  if (Number.isFinite(weatherCode)) {
    if (weatherCode === 0) return "sunny";
    if ([1, 2, 3, 45, 48].includes(weatherCode)) return "cloudy";
    if ((weatherCode >= 71 && weatherCode <= 77) || [85, 86].includes(weatherCode)) return "snow";
    if (
      (weatherCode >= 51 && weatherCode <= 67)
      || (weatherCode >= 80 && weatherCode <= 82)
      || [95, 96, 99].includes(weatherCode)
    ) return "rain";
  }

  const normalized = String(condition || "").toLowerCase();
  if (/snow|눈/.test(normalized)) return "snow";
  if (/rain|drizzle|storm|비|소나기/.test(normalized)) return "rain";
  if (/clear|sun|맑/.test(normalized)) return "sunny";
  return "cloudy";
}

export function formatSeedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createRecommendationSeed(context, suffix = "base") {
  const date = context.seedDate || String(context.currentDate || "").replaceAll(".", "-");
  return `${date}-${context.timeTag}-${context.weatherTag}-${suffix}`;
}

export function getContextMoodTags(context) {
  return {
    daypart: DAYPART_TAGS[context.timeTag] || DAYPART_TAGS.afternoon,
    weather: WEATHER_TAGS[context.weatherTag] || WEATHER_TAGS.cloudy,
  };
}

export function inferTrackTags(track) {
  if (track.recommendationTags?.length) return track.recommendationTags;

  const artist = String(track.artist || "").toLowerCase();
  const text = `${track.title || ""} ${track.album || ""} ${artist}`.toLowerCase();
  const tags = new Set(ARTIST_TAGS[artist] || []);

  if (/night|midnight|moon|dream|밤|새벽/.test(text)) tags.add("night").add("dreamy");
  if (/rain|tear|cry|lost|wait|비/.test(text)) tags.add("reflective").add("mellow");
  if (/love|lover|heart|kiss/.test(text)) tags.add("romantic").add("warm");
  if (/dance|disco|whiplash|360|bmf/.test(text)) tags.add("groove").add("energetic");
  if (/light|sun|lemon|sweet|good|feather/.test(text)) tags.add("bright").add("upbeat");

  const fallbackProfile = FALLBACK_TAG_PROFILES[hashSeed(track.id) % FALLBACK_TAG_PROFILES.length];
  fallbackProfile.forEach((tag) => tags.add(tag));
  return [...tags];
}

export function selectContextItems(items, context, suffix, getTags = (item) => item.tags || []) {
  const { daypart, weather } = getContextMoodTags(context);
  const daypartSet = new Set(daypart);
  const weatherSet = new Set(weather);
  const random = createSeededRandom(createRecommendationSeed(context, suffix));

  return items
    .map((item) => {
      const tags = getTags(item);
      const daypartMatches = tags.filter((tag) => daypartSet.has(tag)).length;
      const weatherMatches = tags.filter((tag) => weatherSet.has(tag)).length;
      const weight = 1 + (daypartMatches * 2.5) + (weatherMatches * 1.25);
      return { item, key: -Math.log(Math.max(random(), Number.EPSILON)) / weight };
    })
    .sort((left, right) => left.key - right.key)
    .map(({ item }) => item);
}

export function recommendTracks(tracks, context, count, suffix = "tracks") {
  return selectContextItems(tracks, context, suffix, inferTrackTags).slice(0, count);
}
