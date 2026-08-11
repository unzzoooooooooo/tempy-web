/*
 * Stable music metadata shared by cards, detail views, and the global player.
 * `isMock` marks locally identifiable artwork whose real-world metadata could
 * not be verified from the bundled asset alone.
 */
const addedCatalogArtists = [
  { id: "sabrina-carpenter", name: "Sabrina Carpenter", profile: "/images/album-33.png", genres: [] },
  { id: "maisie-peters", name: "Maisie Peters", profile: "/images/album-41.png", genres: [] },
  { id: "chappell-roan", name: "Chappell Roan", profile: "/images/album-42.png", genres: [] },
  { id: "lauv", name: "Lauv", profile: "/images/album-47.png", genres: [] },
  { id: "jake-scott-john-k", name: "Jake Scott, John K", profile: "/images/album-53.png", genres: [] },
  { id: "john-k", name: "John K", profile: "/images/album-54.png", genres: [] },
  { id: "olivia-dean", name: "Olivia Dean", profile: "/images/album-59.png", genres: [] },
  { id: "frank-ocean", name: "Frank Ocean", profile: "/images/album-63.png", genres: [] },
  { id: "lady-gaga-bruno-mars", name: "Lady Gaga, Bruno Mars", profile: "/images/album-64.png", genres: [] },
  { id: "alan-walker-sabrina-carpenter", name: "Alan Walker, Sabrina Carpenter", profile: "/images/album-65.png", genres: [] },
  { id: "julia-michaels", name: "Julia Michaels", profile: "/images/album-66.png", genres: [] },
  { id: "julia-michaels-maren-morris", name: "Julia Michaels, Maren Morris", profile: "/images/album-67.png", genres: [] },
  { id: "fka-twigs", name: "FKA twigs", profile: "/images/album-71.png", genres: [] },
  { id: "sza-travis-scott", name: "SZA, Travis Scott", profile: "/images/album-72.png", genres: [] },
  { id: "chloe-x-halle", name: "Chloe x Halle", profile: "/images/album-73.jpg", genres: [] },
  { id: "tinashe", name: "Tinashe", profile: "/images/album-74.jpg", genres: [] },
  { id: "sza", name: "SZA", profile: "/images/album-75.jpg", genres: [] },
  { id: "enhypen", name: "ENHYPEN", profile: "/images/album-76.jpg", genres: [] },
  { id: "allday-project", name: "ALLDAY PROJECT", profile: "/images/album-78.jpg", genres: [] },
  { id: "flor", name: "flor", profile: "/images/album-79.jpg", genres: [] },
  { id: "bruno-mars", name: "Bruno Mars", profile: "/images/album-81.png", genres: [] },
];

const addedCatalogTracks = [
  ["sharpest-tool", "Sharpest Tool", "sabrina-carpenter", "/images/album-33.png"],
  ["feather", "Feather", "sabrina-carpenter", "/images/album-34.png"],
  ["espresso", "Espresso", "sabrina-carpenter", "/images/album-35.png"],
  ["mans-best-friend", "Never Getting Laid", "sabrina-carpenter", "/images/album-36.png"],
  ["tears", "Tears", "sabrina-carpenter", "/images/album-37.png"],
  ["fruitcake", "cindy lou who", "sabrina-carpenter", "/images/album-38.png"],
  ["let-me-move-you", "Let Me Move You", "sabrina-carpenter", "/images/album-39.png"],
  ["paris-sabrina-carpenter", "Paris", "sabrina-carpenter", "/images/album-40.png"],
  ["lost-the-breakup", "Lost The Breakup", "maisie-peters", "/images/album-41.png"],
  ["good-luck-babe", "Good Luck, Babe!", "chappell-roan", "/images/album-42.png"],
  ["the-subway", "The Subway", "chappell-roan", "/images/album-43.png"],
  ["the-giver", "The Giver", "chappell-roan", "/images/album-44.png"],
  ["red-wine-supernova", "Red Wine Supernova", "chappell-roan", "/images/album-45.png"],
  ["casual", "Casual", "chappell-roan", "/images/album-46.png"],
  ["sims", "Sims", "lauv", "/images/album-47.png"],
  ["all-4-nothing", "All 4 Nothing (I'm So in Love)", "lauv", "/images/album-48.png"],
  ["feelings", "Feelings", "lauv", "/images/album-49.png"],
  ["i-like-me-better", "I Like Me Better", "lauv", "/images/album-50.png"],
  ["paris-in-the-rain", "Paris in the Rain", "lauv", "/images/album-51.png"],
  ["26", "26", "lauv", "/images/album-52.png"],
  ["burn", "Burn", "jake-scott-john-k", "/images/album-53.png"],
  ["days-like-this", "days like this", "john-k", "/images/album-54.png"],
  ["a-lot", "A LOT", "john-k", "/images/album-55.png"],
  ["xxl", "XXL", "lany", "/images/album-56.png"],
  ["know-you-naked", "Know You Naked", "lany", "/images/album-57.png"],
  ["ouch", "Girl In The Orchestra", "honne", "/images/album-58.png"],
  ["dive", "Dive", "olivia-dean", "/images/album-59.png"],
  ["nice-to-each-other", "Nice To Each Other", "olivia-dean", "/images/album-60.png"],
  ["thru-these-tears", "Thru These Tears", "lany", "/images/album-61.png"],
  ["less-than-a-lover", "Less than a Lover", "jennie", "/images/album-62.png"],
  ["pink-and-white", "Pink + White", "frank-ocean", "/images/album-63.png"],
  ["die-with-a-smile", "Die With A Smile", "lady-gaga-bruno-mars", "/images/album-64.png"],
  ["my-way", "On My Way", "alan-walker-sabrina-carpenter", "/images/album-65.png"],
  ["try-your-luck", "Try Your Luck", "julia-michaels", "/images/album-66.png"],
  ["scissors", "Scissors", "julia-michaels-maren-morris", "/images/album-67.png"],
  ["34-35", "34+35", "ariana-grande", "/images/album-68.png"],
  ["free-love", "free love", "honne", "/images/album-69.png"],
  ["crying-over-you", "Crying Over You ◐", "honne", "/images/album-70.png"],
  ["two-weeks", "Two Weeks", "fka-twigs", "/images/album-71.png"],
  ["open-arms", "Open Arms", "sza-travis-scott", "/images/album-72.png"],
  ["ungodly-hour", "Ungodly Hour", "chloe-x-halle", "/images/album-73.jpg"],
  ["naturally", "Bouncin'", "tinashe", "/images/album-74.jpg"],
  ["bmf", "BMF", "sza", "/images/album-75.jpg"],
  ["upper-side-dreamin", "Upper Side Dreamin", "enhypen", "/images/album-76.jpg"],
  ["paranormal", "Paranormal", "enhypen", "/images/album-77.jpg"],
  ["famous", "FAMOUS", "allday-project", "/images/album-78.jpg"],
  ["future-shine", "Future Shine", "flor", "/images/album-79.jpg"],
  ["imho", "Come Over Now", "flor", "/images/album-80.jpg"],
  ["just-the-way-you-are", "Just the Way You Are", "bruno-mars", "/images/album-81.png"],
];

export const artists = [
  { id: "taylor-swift", name: "Taylor Swift", profile: "/images/album-10.png", genres: ["Pop", "Singer-Songwriter"] },
  { id: "billie-eilish", name: "Billie Eilish", profile: "/images/album-03.png", genres: ["Alternative", "Pop"] },
  { id: "newjeans", name: "NewJeans", profile: "/images/album-04.png", genres: ["K-Pop", "Pop"] },
  { id: "the-weeknd", name: "The Weeknd", profile: "/images/album-05.png", genres: ["Pop", "R&B"] },
  { id: "honne", name: "HONNE", profile: "/images/album-06.png", genres: ["Electronic", "R&B"] },
  { id: "official-hige-dandism", name: "Official HIGE DANDism", profile: "/images/album-07.png", genres: ["J-Pop", "Rock"] },
  { id: "ariana-grande", name: "Ariana Grande", profile: "/images/album-08.png", genres: ["Pop", "R&B"] },
  { id: "jane-and-the-boy", name: "Jane & The Boy", profile: "/images/album-14.png", genres: ["Indie Pop"] },
  { id: "charli-xcx", name: "Charli xcx", profile: "/images/album-16.png", genres: ["Pop", "Electronic"] },
  { id: "harry-styles", name: "Harry Styles", profile: "/images/album-17.png", genres: ["Pop", "Rock"] },
  { id: "xg", name: "XG", profile: "/images/album-18.png", genres: ["Pop", "R&B"] },
  { id: "aespa", name: "aespa", profile: "/images/album-24.png", genres: ["K-Pop", "Electronic"] },
  { id: "jennie", name: "JENNIE", profile: "/images/artist-01.png", genres: ["K-Pop", "Hip-Hop"] },
  { id: "akmu", name: "AKMU", profile: "/images/artist-02.png", genres: ["K-Pop", "Folk Pop"] },
  { id: "hanroro", name: "한로로", profile: "/images/artist-03.png", genres: ["Indie Rock", "Singer-Songwriter"] },
  { id: "rose", name: "ROSÉ", profile: "/images/album-27.png", genres: ["Pop", "Pop Rock"] },
  { id: "arlie", name: "Arlie", profile: "/images/album-28.png", genres: ["Indie Pop"] },
  { id: "lany", name: "LANY", profile: "/images/album-22.png", genres: ["Pop", "Indie Pop"] },
  { id: "the-aces", name: "The Aces", profile: "/images/album-21.png", genres: ["Alternative", "Indie Pop"] },
  { id: "olivia-rodrigo", name: "Olivia Rodrigo", profile: "/images/album-02.png", genres: ["Pop", "Pop Rock"] },
  { id: "tempy-archive", name: "Tempy Archive", profile: "/images/profile-03.png", genres: ["Archive Pop"], isMock: true },
  ...addedCatalogArtists,
];

export const albums = [
  { id: "life-of-a-showgirl", title: "The Life of a Showgirl", artistId: "taylor-swift", cover: "/images/album-01.png", releaseDate: "2025", language: "English" },
  { id: "upside-down-archive", title: "drop dead", artistId: "olivia-rodrigo", cover: "/images/album-02.png", releaseDate: "2025", language: "English" },
  { id: "hit-me-hard-and-soft", title: "HIT ME HARD AND SOFT", artistId: "billie-eilish", cover: "/images/album-03.png", releaseDate: "2024", language: "English" },
  { id: "new-jeans", title: "NEW DNA", artistId: "xg", cover: "/images/album-04.png", releaseDate: "2023", language: "English" },
  { id: "blinding-lights", title: "Blinding Lights", artistId: "the-weeknd", cover: "/images/album-05.png", releaseDate: "2019", language: "English" },
  { id: "gone-are-the-days", title: "Gone Are the Days", artistId: "honne", cover: "/images/album-06.png", releaseDate: "2016", language: "English" },
  { id: "traveler", title: "Traveler", artistId: "official-hige-dandism", cover: "/images/album-07.png", releaseDate: "2019", language: "Japanese" },
  { id: "sweetener", title: "Sweetener", artistId: "ariana-grande", cover: "/images/album-08.png", releaseDate: "2018", language: "English" },
  { id: "tattoo", title: "TATTOO", artistId: "official-hige-dandism", cover: "/images/album-09.png", releaseDate: "2023", language: "Japanese" },
  { id: "midnights", title: "Midnights", artistId: "taylor-swift", cover: "/images/album-10.png", releaseDate: "2022", language: "English" },
  { id: "evermore", title: "evermore", artistId: "taylor-swift", cover: "/images/album-11.png", releaseDate: "2020", language: "English" },
  { id: "lover", title: "Lover", artistId: "taylor-swift", cover: "/images/album-12.png", releaseDate: "2019", language: "English" },
  { id: "reputation", title: "reputation", artistId: "taylor-swift", cover: "/images/album-13.png", releaseDate: "2017", language: "English" },
  { id: "good-feeling", title: "Good Feeling", artistId: "jane-and-the-boy", cover: "/images/album-14.png", releaseDate: "2022", language: "English" },
  { id: "catch-me", title: "Catch Me", artistId: "jane-and-the-boy", cover: "/images/album-15.png", releaseDate: "2022", language: "English" },
  { id: "brat", title: "BRAT", artistId: "charli-xcx", cover: "/images/album-16.png", releaseDate: "2024", language: "English" },
  { id: "fine-line", title: "Fine Line", artistId: "harry-styles", cover: "/images/album-17.png", releaseDate: "2019", language: "English" },
  { id: "puppet-show", title: "NEW DNA (Apple Music Edition) - EP", artistId: "xg", cover: "/images/album-18.png", releaseDate: "2023", language: "English" },
  { id: "1989", title: "1989", artistId: "taylor-swift", cover: "/images/album-19.png", releaseDate: "2014", language: "English" },
  { id: "mood", title: "MOOD", artistId: "jane-and-the-boy", cover: "/images/album-20.png", releaseDate: "2023", language: "English" },
  { id: "disco-room", title: "Can't Wait", artistId: "the-aces", cover: "/images/album-21.png", releaseDate: "2025", language: "English" },
  { id: "mamas-boy", title: "mama's boy", artistId: "lany", cover: "/images/album-22.png", releaseDate: "2020", language: "English" },
  { id: "soft-static", title: "dna", artistId: "lany", cover: "/images/album-23.png", releaseDate: "2025", language: "English" },
  { id: "rich-man", title: "Rich Man", artistId: "aespa", cover: "/images/album-24.png", releaseDate: "2025", language: "Korean" },
  { id: "citrus-glow", title: "LEMONADE", artistId: "aespa", cover: "/images/album-25.png", releaseDate: "2025", language: "English" },
  { id: "you-and-me", title: "You & Me", artistId: "jennie", cover: "/images/album-26.png", releaseDate: "2023", language: "English" },
  { id: "rosie", title: "rosie", artistId: "rose", cover: "/images/album-27.png", releaseDate: "2024", language: "English" },
  { id: "wait", title: "Wait", artistId: "arlie", cover: "/images/album-28.png", releaseDate: "2018", language: "English" },
  { id: "whiplash", title: "Whiplash", artistId: "aespa", cover: "/images/album-29.png", releaseDate: "2024", language: "Korean" },
  { id: "armageddon", title: "Armageddon", artistId: "aespa", cover: "/images/album-30.png", releaseDate: "2024", language: "Korean" },
  { id: "ruby", title: "Ruby", artistId: "jennie", cover: "/images/album-31.png", releaseDate: "2025", language: "English" },
  { id: "mantra", title: "Mantra", artistId: "jennie", cover: "/images/album-32.jpg", releaseDate: "2024", language: "English" },
  { id: "akmu-profile-placeholder", title: "Love Lee - Single", artistId: "akmu", cover: "/images/artist-02.png", releaseDate: "2023", language: "Korean", isPlaceholder: true },
  { id: "hanroro-profile-placeholder", title: "Let Me Love My Youth - Single", artistId: "hanroro", cover: "/images/artist-03.png", releaseDate: "2022", language: "Korean", isPlaceholder: true },
  ...addedCatalogTracks.map(([id, title, artistId, cover]) => ({
    id: `catalog-${id}`,
    title,
    artistId,
    cover,
    releaseDate: "",
    language: "",
  })),
];

const rawTracks = [
  ["fate-of-ophelia", "The Fate of Ophelia", "life-of-a-showgirl", "03:24"],
  ["upside-down", "drop dead", "upside-down-archive", "02:58"],
  ["birds-of-a-feather", "BIRDS OF A FEATHER", "hit-me-hard-and-soft", "03:30"],
  ["super-shy", "NEW DANCE", "new-jeans", "03:18"],
  ["blinding-lights", "Blinding Lights", "blinding-lights", "03:20"],
  ["gone-are-the-days", "Gone Are the Days", "gone-are-the-days", "03:42"],
  ["traveler", "Pretender", "traveler", "05:26"],
  ["sweetener", "sweetener", "sweetener", "03:28"],
  ["tattoo", "TATTOO", "tattoo", "04:42"],
  ["anti-hero", "Anti-Hero", "midnights", "03:20"],
  ["willow", "willow", "evermore", "03:34"],
  ["cruel-summer", "Cruel Summer", "lover", "02:58"],
  ["delicate", "Delicate", "reputation", "03:52"],
  ["good-feeling", "Good Feeling", "good-feeling", "03:12"],
  ["catch-me", "Catch Me", "catch-me", "02:48"],
  ["360", "360", "brat", "02:13"],
  ["watermelon-sugar", "Watermelon Sugar", "fine-line", "02:54"],
  ["puppet-show", "Puppet Show", "puppet-show", "03:08"],
  ["style", "Style", "1989", "03:51"],
  ["mood", "MOOD", "mood", "03:04"],
  ["disco-room", "Can't Wait", "disco-room", "03:21"],
  ["mamas-boy", "you!", "mamas-boy", "04:34"],
  ["soft-static", "dna", "soft-static", "03:26"],
  ["rich-man", "Rich Man", "rich-man", "03:18"],
  ["citrus-glow", "LEMONADE", "citrus-glow", "02:57"],
  ["you-and-me", "You & Me", "you-and-me", "02:59"],
  ["toxic-till-the-end", "toxic till the end", "rosie", "02:36"],
  ["wait", "Big Fat Mouth", "wait", "03:27"],
  ["whiplash", "Whiplash", "whiplash", "03:03"],
  ["armageddon", "Armageddon", "armageddon", "03:16"],
  ["like-jennie", "like JENNIE", "ruby", "02:03"],
  ["mantra", "Mantra", "mantra", "02:16"],
  ...addedCatalogTracks.map(([id, title]) => [id, title, `catalog-${id}`, "--:--"]),
];

// Official iTunes Search API links, matched by normalized title + artist.
// KR results are preferred; US is used only when KR has no exact match.
// Tempy streams these remote previews and does not bundle audio files.
const trackLinksByTrackId = Object.freeze({
  "fate-of-ophelia": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4b/07/28/4b07285f-b50c-7aff-cb40-2d732256b703/mzaf_16739866530441939982.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/the-fate-of-ophelia/1833328839?i=1833328840&uo=4",
  },
  showgirl: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/76/0e/61760e63-e648-f861-b4ba-7a8e6e3df9a8/mzaf_9063253245381858922.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/elizabeth-taylor/1838810949?i=1838810952&uo=4",
  },
  "under-the-spotlight": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f2/05/dd/f205dd86-131f-39f1-2e48-6a16d1099618/mzaf_2963212195811157220.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/opalite/1838810949?i=1838810953&uo=4",
  },
  "velvet-curtain": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/39/f7/2c/39f72c7d-9c4e-a9c3-9441-9bc71969223b/mzaf_7809035169985787132.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/father-figure/1842897453?i=1842897461&uo=4",
  },
  "backstage-heart": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/54/50/bd/5450bdfa-0dd5-55a9-0b9c-92eaaa08b7a8/mzaf_14672443160738867693.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/eldest-daughter/1842897453?i=1842897462&uo=4",
  },
  encore: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e1/bb/5e/e1bb5e74-0c8a-dd39-0bdd-bfc4af21106d/mzaf_15661137690221964276.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/the-life-of-a-showgirl-feat-sabrina-carpenter/1842897453?i=1842897477&uo=4",
  },
  "upside-down": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/89/57/ad/8957adf6-1862-4e4e-bcb5-810d6cf79cc4/mzaf_7752581374620577831.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/drop-dead/1889992111?i=1889992113&uo=4",
  },
  "birds-of-a-feather": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/31/d3/3431d34e-847f-5d66-df83-0bce688d997e/mzaf_18106743962423782018.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/birds-of-a-feather/1739659134?i=1739659142&uo=4",
  },
  "super-shy": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cd/b4/12/cdb41207-dbfe-2a26-af67-89d73425d14e/mzaf_15928103081103994062.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/new-dance/1703356590?i=1703356604&uo=4",
  },
  "blinding-lights": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/d6/60/19d660ff-e3a9-8377-15a3-ce4b28e89cac/mzaf_18422426156481158187.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/blinding-lights/1499378108?i=1499378607&uo=4",
  },
  "gone-are-the-days": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/92/a7/a9/92a7a9e8-a82f-706f-7867-013833167335/mzaf_819369403318584232.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/gone-are-the-days/1107603110?i=1107603297&uo=4",
  },
  traveler: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/ce/0f/9c/ce0f9cf6-edfd-d964-317a-56781936a96b/mzaf_10158629645505453806.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/pretender/1459216693?i=1459216694&uo=4",
  },
  sweetener: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/21/32/e4/2132e4c7-d15a-09d6-7a55-905d05e710ef/mzaf_6065857603198925125.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/sweetener/1399202900?i=1399203813&uo=4",
  },
  tattoo: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/78/c0/6078c0f4-efb2-c2fa-f0cb-74fcfcda8c21/mzaf_912733534683060955.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/tattoo/1754117467?i=1754117752&uo=4",
  },
  "anti-hero": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e6/ee/4e/e6ee4ede-237c-71e2-c90a-56ad414821ce/mzaf_12202654298857745709.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/anti-hero/1645937249?i=1645937257&uo=4",
  },
  maroon: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/df/17/dc/df17dce2-5e56-b2cc-e5bb-2c0c5b74b092/mzaf_5240602371978171573.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/maroon/1645937249?i=1645937255&uo=4",
  },
  "midnight-rain": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/54/f2/6b/54f26bcd-af94-a65e-9861-10c05224e9b1/mzaf_13752008219833128698.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/midnight-rain/1645937249?i=1645937261&uo=4",
  },
  willow: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c8/1f/d0/c81fd0ff-9247-cf6e-14df-6111f790bf1f/mzaf_9111987299197928468.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/willow/1544268281?i=1544268298&uo=4",
  },
  "cruel-summer": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/cruel-summer/1468058165?i=1468058171&uo=4",
  },
  lover: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/db/47/e0db47b0-7f70-0631-0414-cd4777d2fb3e/mzaf_6362891154838442638.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/lover/1468058165?i=1468058173&uo=4",
  },
  delicate: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/24/e8/a724e804-d5df-f7a7-24cc-09df9df57a79/mzaf_4087189896444308455.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/delicate/1440933849?i=1440934254&uo=4",
  },
  "good-feeling": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/81/2a/f1/812af15e-5df8-1024-f994-f216451082a0/mzaf_5760566664236261677.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/good-feeling/1656600335?i=1656600336&uo=4",
  },
  "catch-me": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/ad/2e/b0ad2ef1-6706-b462-5129-954bbd847ffd/mzaf_7781048576059713747.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/catch-me/1639283386?i=1639283389&uo=4",
  },
  360: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ee/24/4c/ee244cd0-a68a-64f1-c41a-fe08318d0b41/mzaf_16963438138883503449.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/360/1762679425?i=1762679426&uo=4",
  },
  "watermelon-sugar": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/16/86/f5/1686f50d-8b77-7e32-85f7-5f0e804d68fe/mzaf_14195633304344507287.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/watermelon-sugar/1485802965?i=1485802967&uo=4",
  },
  "puppet-show": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/dd/ae/d9ddaecf-3f3e-45e8-c5ee-15ccc45fa060/mzaf_12830622419635504873.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/puppet-show/1703356590?i=1703356821&uo=4",
  },
  style: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/28/77/36/28773617-eda4-d33d-70f2-23a9dbb08d65/mzaf_13962566637593274280.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/style/1445888258?i=1445888386&uo=4",
  },
  "wildest-dreams": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b3/71/df/b371df5a-2196-8492-654d-445955b2afc5/mzaf_11948628759419776446.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/wildest-dreams/1445888258?i=1445888403&uo=4",
  },
  mood: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4f/e8/f3/4fe8f38b-4090-34d0-e6b6-fe82e3c99c84/mzaf_5808253253551247130.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/mood/1689195224?i=1689195408&uo=4",
  },
  "disco-room": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bb/76/47/bb7647bf-1495-8b4c-12ba-234077357382/mzaf_16318773758074767824.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/cant-wait/1880586772?i=1880587419&uo=4",
  },
  "mamas-boy": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/8a/5f/31/8a5f3140-6511-83b8-db42-54f57f9fcf9c/mzaf_2978547573649057419.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/you/1525736397?i=1525736398&uo=4",
  },
  "soft-static": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/0d/a7/ce/0da7ce04-7549-8d05-2341-4e7aa32ba803/mzaf_6180989229907276623.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/dna/1575772342?i=1575772346&uo=4",
  },
  "rich-man": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1e/a6/20/1ea6202b-37fd-30a4-2383-6c22c41de762/mzaf_9596143199836663173.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/rich-man/1832407118?i=1832407119&uo=4",
  },
  "citrus-glow": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/92/69/d4/9269d4e3-fde2-bd50-9aa9-594080843e89/mzaf_10216845447511835614.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/lemonade/1893599771?i=1893599773&uo=4",
  },
  "you-and-me": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/92/c8/06/92c806b3-2977-67f5-1463-fd6ceacd36e7/mzaf_9879973441146838578.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/you-me/1710020667?i=1710020675&uo=4",
  },
  "toxic-till-the-end": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/15/49/451549d8-ddd7-dad4-0f3d-588a0c9d1b98/mzaf_17766988925119316702.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/toxic-till-the-end/1771105914?i=1771105929&uo=4",
  },
  wait: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/dd/ec/02/ddec02fb-2394-d75f-92b5-79e671bf519a/mzaf_17409000019741588778.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/big-fat-mouth/1436497346?i=1436497347&uo=4",
  },
  whiplash: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/91/84/e5/9184e5d0-54c8-eccc-e62c-e3175a88b396/mzaf_13467227653896090925.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/whiplash/1772644600?i=1772644601&uo=4",
  },
  armageddon: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f1/d9/40/f1d9406f-b253-80b0-fbf6-72c2dc02576e/mzaf_7682160531840108387.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/armageddon/1745285216?i=1745285228&uo=4",
  },
  "like-jennie": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/42/dc/06/42dc069a-1683-2d2b-6442-b3655f2b2a97/mzaf_15363406353889961611.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/like-jennie/1800280826?i=1800281048&uo=4",
  },
  mantra: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/21/11/91211112-0655-9317-869f-c6c12b21d5dd/mzaf_5377389483986561528.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/mantra/1772760251?i=1772760254&uo=4",
  },
  "love-lee": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/75/42/8e/75428efd-bf7c-922a-253a-dcc9f812eddc/mzaf_9614853286254962096.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/love-lee/1702810041?i=1702810042&uo=4",
  },
  "let-me-love-my-youth": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/83/4e/85/834e85b0-4dde-b22c-7ae6-63692e393b76/mzaf_10616492005222924951.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/let-me-love-my-youth/1613687888?i=1613687889&uo=4",
  },
  "sharpest-tool": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/27/eb/1e/27eb1e5c-6cfb-4e28-32eb-cd42208d8644/mzaf_660528951122919214.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/sharpest-tool/1752214909?i=1752214916&uo=4",
  },
  feather: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/4b/f1/074bf191-a02c-1d76-5d94-49256f99af6f/mzaf_7725821736642193910.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/feather/1677891658?i=1677892279&uo=4",
  },
  espresso: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/99/da/ff/99daffce-cdde-59c6-5ae0-7f922ce411a8/mzaf_5621292401829922816.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/espresso/1752214909?i=1752214923&uo=4",
  },
  tears: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/39/c2/8e39c256-a452-8928-5f45-9a82d6873f5e/mzaf_11132789052180673913.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/tears/1819861154?i=1819861157&uo=4",
  },
  "let-me-move-you": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/bc/12/b3/bc12b320-b359-2a0a-8106-cf6587bf9514/mzaf_7505452830438589013.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/let-me-move-you-from-the-netflix-film-work-it/1523357415?i=1523357416&uo=4",
  },
  "paris-sabrina-carpenter": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c1/68/16/c16816ff-ea23-404a-e87e-84fad000ffcd/mzaf_2837756822827145870.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/paris/1438671104?i=1438671345&uo=4",
  },
  "lost-the-breakup": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/cf/4c/a8/cf4ca8dd-8286-c9e0-05dc-9f332f953e9d/mzaf_1444231746788036017.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/lost-the-breakup/1680968147?i=1680968148&uo=4",
  },
  "good-luck-babe": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/6d/4f/c36d4f23-b87f-046d-7a0e-e3e05d180b2a/mzaf_17235999651335214399.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/good-luck-babe/1737497078?i=1737497080&uo=4",
  },
  "the-subway": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/30/63/993063c9-63b1-3ac4-b558-eb1561f3c7c1/mzaf_4724150376642718672.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/the-subway/1831372118?i=1831372120&uo=4",
  },
  "the-giver": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/72/47/17/724717d8-d2f2-979b-4f23-befb0031e10e/mzaf_13751565621225225258.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/the-giver/1801197841?i=1801197851&uo=4",
  },
  "red-wine-supernova": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/df/34/f1/df34f17a-9222-71d9-c7be-72f425516ba9/mzaf_11637842772411959222.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/red-wine-supernova/1707412988?i=1707413097&uo=4",
  },
  casual: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/a0/15/a4/a015a449-d9ee-bd4d-faa8-ad5a950df10d/mzaf_5668904369452791603.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/casual/1707412988?i=1707413103&uo=4",
  },
  sims: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/f1/6a/95/f16a95b1-eee9-c481-272e-975b11c4e75a/mzaf_2117228302513010519.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/sims/1616957126?i=1616957350&uo=4",
  },
  "all-4-nothing": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/51/55/da/5155da26-48ae-5d5c-2798-25ad61e2a069/mzaf_2980686868836985311.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/all-4-nothing-im-so-in-love/1616908862?i=1616909002&uo=4",
  },
  feelings: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c3/54/c0/c354c042-69ec-1f2f-6970-4d8fea38f23c/mzaf_9826597951158443421.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/feelings/1480846311?i=1480846730&uo=4",
  },
  "i-like-me-better": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1f/f6/8d/1ff68de2-c665-b4da-ff9b-1d813748a50d/mzaf_15362868780074122494.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/i-like-me-better/1771701051?i=1771701062&uo=4",
  },
  "paris-in-the-rain": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0e/c1/fd/0ec1fd20-0f65-e3eb-4134-f8133e74b1c9/mzaf_13950251868834939865.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/paris-in-the-rain/1771701881?i=1771702170&uo=4",
  },
  26: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e0/60/1d/e0601da1-4b3b-ad30-5508-cc5a8ff74588/mzaf_5309914826734332864.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/26/1616908862?i=1616908864&uo=4",
  },
  burn: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/fb/bf/fe/fbbffee1-b8a8-95c9-6119-02e10a8a1bca/mzaf_3808529493438895022.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/burn-feat-john-k/1693022644?i=1693022645&uo=4",
  },
  "days-like-this": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/27/87/602787b5-dc0f-b1d7-bd0b-3dc291ef2845/mzaf_6274906912514500274.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/days-like-this/1534387266?i=1534387292&uo=4",
  },
  "a-lot": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9d/67/6b/9d676b82-45d6-8db5-3958-692489a2a34f/mzaf_128137072641770007.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/a-lot/1817690084?i=1817690100&uo=4",
  },
  xxl: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/c9/13/95/c91395cd-48dc-381a-846e-026565fc95d5/mzaf_16569738922393134252.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/xxl/1696166342?i=1696166346&uo=4",
  },
  "know-you-naked": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cf/6c/03/cf6c0307-34be-0b7b-e7e2-b4b1369d950c/mzaf_12736594477466650043.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/know-you-naked/1828560356?i=1828560359&uo=4",
  },
  dive: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0e/59/93/0e599312-e752-f780-63ac-951680bf6df1/mzaf_9484989385581807309.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/dive/1676252821?i=1676252825&uo=4",
  },
  "nice-to-each-other": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d9/ae/f8/d9aef823-263d-bbd0-cd01-97eba4b0900f/mzaf_14298659467220432482.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/nice-to-each-other/1817609404?i=1817609406&uo=4",
  },
  "thru-these-tears": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/f0/39/a7/f039a7a0-ce5e-803d-7b3a-95c45830f2d0/mzaf_13652505330298211249.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/thru-these-tears/1435482172?i=1435482376&uo=4",
  },
  "less-than-a-lover": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/32/2e/99322e73-d6e0-1b05-75a4-a7b1111d4598/mzaf_5579403588366016062.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/less-than-a-lover/6792226269?i=6792226270&uo=4",
  },
  "pink-and-white": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/a8/a2/45a8a2e0-9516-86b2-66ea-e8b2bf71de68/mzaf_10773372944954067241.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/pink-white/1146195596?i=1146195714&uo=4",
  },
  "die-with-a-smile": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e9/d1/46/e9d14699-9505-493e-cd27-a501095c81ff/mzaf_7283388936457278756.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/die-with-a-smile/1762656724?i=1762656732&uo=4",
  },
  "try-your-luck": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c7/22/45/c7224519-b2e2-cb9b-1af2-0e8d0e2423e8/mzaf_16670762764688546413.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/try-your-luck/1811856920?i=1811856923&uo=4",
  },
  scissors: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b9/48/f5/b948f516-9d4b-3613-ca70-7719de3dd5a2/mzaf_9184699183968476239.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/scissors/1811856920?i=1811856922&uo=4",
  },
  "34-35": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/77/08/a0/7708a05b-a2f0-3b43-e45f-8b1a5828e2d2/mzaf_7652736334376214445.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/34-35/1537486662?i=1537486672&uo=4",
  },
  "free-love": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/8b/e5/c9/8be5c9ef-2962-b77b-eaa9-a187c5c318e0/mzaf_348333335530605825.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/free-love/1518053387?i=1518053392&uo=4",
  },
  "crying-over-you": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/5e/0c/fb/5e0cfbda-d283-9108-468f-1483c93cdd5a/mzaf_3542535554052415576.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/crying-over-you-feat-beka/1426036150?i=1426036291&uo=4",
  },
  "two-weeks": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/5d/e3/d3/5de3d30c-89e7-9586-fb02-b4aee1ed677a/mzaf_8601142887561379104.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/two-weeks/1546107580?i=1546107585&uo=4",
  },
  "open-arms": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4f/4f/8b/4f4f8bba-284d-fcc5-bc0a-0cf873f83904/mzaf_8876993850396612637.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/open-arms-feat-travis-scott/1658650093?i=1658650800&uo=4",
  },
  "mans-best-friend": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5f/67/1f/5f671f91-3b3e-a025-7985-8b3342ad96ac/mzaf_15351220872115902400.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/never-getting-laid/1836002188?i=1836002474&uo=4",
  },
  fruitcake: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ac/bb/38/acbb3896-ef31-2cd7-8b04-e2996fb3c251/mzaf_10411993271624436355.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/cindy-lou-who/1713689507?i=1713689514&uo=4",
  },
  ouch: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/3c/bc/453cbcfb-7e33-d366-3c68-c170923e3e2f/mzaf_6894138948629167953.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/girl-in-the-orchestra/1758022918?i=1758022920&uo=4",
  },
  "my-way": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/21/63/f4/2163f4b2-8e9c-6f1b-e6da-1dd838f0941f/mzaf_952717904460349711.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/on-my-way/1455648995?i=1455648996&uo=4",
  },
  "ungodly-hour": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/cc/4e/5e/cc4e5e19-0d96-29cc-49ab-e0abe6383b61/mzaf_14867092240278762538.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/ungodly-hour/1512283811?i=1512284184&uo=4",
  },
  naturally: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/65/e0/25/65e025b4-46dd-6a6e-dfb6-85b771f66bf9/mzaf_1546794130249884339.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/bouncin/1834854332?i=1834854517&uo=4",
  },
  bmf: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3a/49/12/3a4912e6-ed39-e9e5-fd79-5ec64a6e854c/mzaf_13702222499479449855.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/bmf/1796270264?i=1796270481&uo=4",
  },
  "upper-side-dreamin": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/49/a6/68/49a66800-4e6c-68e6-1e35-3be2919ac57e/mzaf_6950604213995548513.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/upper-side-dreamin/1587989646?i=1587989649&uo=4",
  },
  paranormal: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/07/4a/60/074a60bf-fc46-7ce5-5183-c907db3d3305/mzaf_3171772884638522266.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/paranormal/1752178854?i=1752179036&uo=4",
  },
  famous: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0c/6e/3c/0c6e3cf2-8bf1-9321-7c29-74fadbc76959/mzaf_5360007931296785649.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/famous/1821577351?i=1821577352&uo=4",
  },
  "future-shine": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/88/ef/8d/88ef8df9-ab8b-f5cd-af6a-e20eaa2ac319/mzaf_11358992181994830624.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/future-shine/1613788140?i=1613788507&uo=4",
  },
  imho: {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/8a/65/f1/8a65f1f0-3347-152d-1f45-dae50c157e22/mzaf_5909905582628954207.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/come-over-now/1613788140?i=1613788386&uo=4",
  },
  "just-the-way-you-are": {
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/a5/27/a8/a527a84c-9962-6673-c848-8aeeb05b4a7c/mzaf_7000909875279010673.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/just-the-way-you-are/578054234?i=578054244&uo=4",
  },
});

// Per-track corrections that must not rename the shared artist everywhere.
const trackMetadataOverrides = Object.freeze({
  traveler: {
    title: "Pretender",
    artist: "OFFICIAL HIGE DANDISM",
  },
});

// Fixed, intentionally interleaved catalog order used by every Track lists view.
// Track metadata stays in rawTracks; only its presentation/playback sequence changes.
const fixedTrackOrder = Object.freeze([
  "disco-room",
  "bmf",
  "ungodly-hour",
  "wait",
  "pink-and-white",
  "blinding-lights",
  "paris-sabrina-carpenter",
  "toxic-till-the-end",
  "scissors",
  "i-like-me-better",
  "cruel-summer",
  "casual",
  "watermelon-sugar",
  "feather",
  "soft-static",
  "armageddon",
  "gone-are-the-days",
  "you-and-me",
  "mood",
  "all-4-nothing",
  "mans-best-friend",
  "delicate",
  "the-subway",
  "super-shy",
  "dive",
  "upper-side-dreamin",
  "days-like-this",
  "future-shine",
  "sweetener",
  "traveler",
  "thru-these-tears",
  "citrus-glow",
  "tears",
  "crying-over-you",
  "sims",
  "mantra",
  "willow",
  "red-wine-supernova",
  "birds-of-a-feather",
  "die-with-a-smile",
  "good-feeling",
  "sharpest-tool",
  "open-arms",
  "xxl",
  "26",
  "whiplash",
  "style",
  "ouch",
  "less-than-a-lover",
  "the-giver",
  "fruitcake",
  "puppet-show",
  "nice-to-each-other",
  "paranormal",
  "a-lot",
  "imho",
  "34-35",
  "tattoo",
  "know-you-naked",
  "feelings",
  "anti-hero",
  "catch-me",
  "espresso",
  "rich-man",
  "free-love",
  "like-jennie",
  "good-luck-babe",
  "just-the-way-you-are",
  "mamas-boy",
  "paris-in-the-rain",
  "fate-of-ophelia",
  "let-me-move-you",
  "360",
  "famous",
  "upside-down",
  "two-weeks",
  "burn",
  "my-way",
  "naturally",
  "lost-the-breakup",
  "try-your-luck",
]);

const artistMap = new Map(artists.map((artist) => [artist.id, artist]));
const albumMap = new Map(albums.map((album) => [album.id, album]));
const rawTrackMap = new Map(rawTracks.map((track) => [track[0], track]));

export const tracks = fixedTrackOrder.map((id) => rawTrackMap.get(id)).map(([id, title, albumId, duration]) => {
  const album = albumMap.get(albumId);
  const artist = artistMap.get(album.artistId);
  const links = trackLinksByTrackId[id] || { audioPreview: null, trackViewUrl: null };
  const metadata = trackMetadataOverrides[id];
  return {
    id,
    trackId: id,
    title: metadata?.title || title,
    artistId: artist.id,
    artist: metadata?.artist || artist.name,
    artistProfile: artist.profile,
    albumId,
    album: album.title,
    cover: album.cover,
    image: album.cover,
    duration,
    audioPreview: links.audioPreview,
    trackViewUrl: links.trackViewUrl,
    isMock: Boolean(album.isMock || artist.isMock),
  };
});

const trackMap = new Map(tracks.map((track) => [track.id, track]));
const legacyTrackIdAliases = new Map(Object.entries({
  showgirl: "fate-of-ophelia",
  "under-the-spotlight": "fate-of-ophelia",
  "velvet-curtain": "fate-of-ophelia",
  "backstage-heart": "fate-of-ophelia",
  encore: "fate-of-ophelia",
  maroon: "anti-hero",
  "midnight-rain": "anti-hero",
  lover: "cruel-summer",
  "wildest-dreams": "style",
  "love-lee": "sharpest-tool",
  "let-me-love-my-youth": "feather",
}));
const coverMap = new Map();
tracks.forEach((track) => {
  if (!coverMap.has(track.cover)) coverMap.set(track.cover, track);
});

const normalizeIdentity = (value = "") => String(value)
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9가-힣]+/g, " ")
  .trim();

const getTrackIdentity = (title, artist) => `${normalizeIdentity(title)}::${normalizeIdentity(artist)}`;
const trackIdentityMap = new Map(tracks.map((track) => [getTrackIdentity(track.title, track.artist), track]));

export const trackCoverMap = Object.freeze(Object.fromEntries(
  tracks.map((track) => [track.id, track.cover]),
));

export const artistAlbumCoverMap = Object.freeze(Object.fromEntries(
  artists.map((artist) => {
    const artistCovers = albums
      .filter((album) => album.artistId === artist.id && album.cover.startsWith("/images/album-"))
      .map((album) => album.cover);
    return [artist.id, artistCovers.length ? artistCovers : [artist.profile]];
  }),
));

// Stable same-artist fallbacks for editorial/mock track names without a canonical album entry.
const editorialArtistCoverMap = new Map(Object.entries({
  "10cm": "/images/album-33.png",
  adoy: "/images/album-34.png",
  beabadoobee: "/images/album-35.png",
  crush: "/images/album-36.png",
  "dpr ian": "/images/album-37.png",
  fkj: "/images/album-38.png",
  hozier: "/images/album-39.png",
  hyukoh: "/images/album-40.png",
  "illit 아일릿": "/images/album-41.png",
  jannabi: "/images/album-42.png",
  laufey: "/images/album-43.png",
  leehi: "/images/album-44.png",
  lucy: "/images/album-45.png",
  "mariya takeuchi": "/images/album-46.png",
  "men i trust": "/images/album-47.png",
  "night loop": "/images/album-48.png",
  o3ohn: "/images/album-49.png",
  "rex orange county": "/images/album-50.png",
  "silica gel": "/images/album-51.png",
  "stella jang": "/images/album-52.png",
  "sunset rollercoaster": "/images/album-53.png",
  surl: "/images/album-54.png",
  "the black skirts": "/images/album-55.png",
  "the marias": "/images/album-56.png",
  "the volunteers": "/images/album-57.png",
  txt: "/images/album-58.png",
  "wave club": "/images/album-59.png",
  "wave to earth": "/images/album-60.png",
  "yerin baek": "/images/album-61.png",
  검정치마: "/images/album-55.png",
  백예린: "/images/album-61.png",
}));

const artistByNameMap = new Map(artists.map((artist) => [normalizeIdentity(artist.name), artist]));

export const getArtistCover = (artistName, fallbackCover) => {
  const normalizedArtist = normalizeIdentity(artistName);
  const canonicalArtist = artistByNameMap.get(normalizedArtist);
  if (canonicalArtist) {
    return artistAlbumCoverMap[canonicalArtist.id][0];
  }
  return editorialArtistCoverMap.get(normalizedArtist) || fallbackCover;
};

export const getTrackCover = ({ id, trackId, title, artist, cover, image } = {}) => {
  const canonical = getTrackById(trackId || id) || trackIdentityMap.get(getTrackIdentity(title, artist));
  if (canonical) return canonical.cover;
  return getArtistCover(artist, cover || image);
};

export const getArtistById = (id) => artistMap.get(id);
export const getAlbumById = (id) => albumMap.get(id);
export const getTrackById = (id) => trackMap.get(id) || trackMap.get(legacyTrackIdAliases.get(id));
export const getTrackByCover = (cover) => coverMap.get(cover);
export const getTracksByArtist = (artistId) => tracks.filter((track) => track.artistId === artistId);
export const getTracksByAlbum = (albumId) => tracks.filter((track) => track.albumId === albumId);
export const getTracksByIds = (ids) => ids.map(getTrackById).filter(Boolean);

export const normalizeMusicItem = (item) => {
  if (!item) return item;
  const cover = item.cover || item.image;
  const hasTrackIdentity = Boolean(item.title && item.artist);
  const canonical = getTrackById(item.trackId || item.id)
    || (hasTrackIdentity ? trackIdentityMap.get(getTrackIdentity(item.title, item.artist)) : null)
    || getTrackByCover(cover);
  if (!canonical) {
    const matchedCover = getArtistCover(item.artist, cover);
    return matchedCover ? { ...item, cover: matchedCover, image: matchedCover } : item;
  }

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
