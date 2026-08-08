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
];

const addedCatalogTracks = [
  ["sharpest-tool", "Sharpest Tool", "sabrina-carpenter", "/images/album-33.png"],
  ["feather", "Feather", "sabrina-carpenter", "/images/album-34.png"],
  ["espresso", "Espresso", "sabrina-carpenter", "/images/album-35.png"],
  ["mans-best-friend", "Man's Best Friend", "sabrina-carpenter", "/images/album-36.png"],
  ["tears", "Tears", "sabrina-carpenter", "/images/album-37.png"],
  ["fruitcake", "fruitcake", "sabrina-carpenter", "/images/album-38.png"],
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
  ["ouch", "OUCH", "honne", "/images/album-58.png"],
  ["dive", "Dive", "olivia-dean", "/images/album-59.png"],
  ["nice-to-each-other", "Nice To Each Other", "olivia-dean", "/images/album-60.png"],
  ["thru-these-tears", "Thru These Tears", "lany", "/images/album-61.png"],
  ["less-than-a-lover", "Less than a Lover", "jennie", "/images/album-62.png"],
  ["pink-and-white", "Pink + White", "frank-ocean", "/images/album-63.png"],
  ["die-with-a-smile", "Die With A Smile", "lady-gaga-bruno-mars", "/images/album-64.png"],
  ["my-way", "My Way", "alan-walker-sabrina-carpenter", "/images/album-65.png"],
  ["try-your-luck", "Try Your Luck", "julia-michaels", "/images/album-66.png"],
  ["scissors", "Scissors", "julia-michaels-maren-morris", "/images/album-67.png"],
  ["34-35", "34+35", "ariana-grande", "/images/album-68.png"],
  ["free-love", "free love", "honne", "/images/album-69.png"],
  ["crying-over-you", "Crying Over You ◐", "honne", "/images/album-70.png"],
  ["two-weeks", "Two Weeks", "fka-twigs", "/images/album-71.png"],
  ["open-arms", "Open Arms", "sza-travis-scott", "/images/album-72.png"],
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
  { id: "hanroro", name: "HANRORO", profile: "/images/artist-03.png", genres: ["Indie Rock", "Singer-Songwriter"] },
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
  { id: "new-jeans", title: "NewJeans 2nd EP 'Get Up'", artistId: "newjeans", cover: "/images/album-04.png", releaseDate: "2023", language: "Korean" },
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
  ["super-shy", "Super Shy", "new-jeans", "02:34"],
  ["blinding-lights", "Blinding Lights", "blinding-lights", "03:20"],
  ["gone-are-the-days", "Gone Are the Days", "gone-are-the-days", "03:42"],
  ["traveler", "Traveler", "traveler", "03:16"],
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
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a0/0c/47/a00c4790-3bbe-c669-fc8b-d8779508b512/mzaf_4170831274187670095.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/us/album/super-shy/1692686264?i=1692686518&uo=4",
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
    audioPreview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/55/a8/50/55a850e4-1f98-75c3-5053-88db6781741a/mzaf_11763890874915213695.plus.aac.p.m4a",
    trackViewUrl: "https://music.apple.com/kr/album/travelers/1479397582?i=1479397875&uo=4",
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
});

// Per-track corrections that must not rename the shared artist everywhere.
const trackMetadataOverrides = Object.freeze({
  traveler: {
    title: "Travelers",
    artist: "OFFICIAL HIGE DANDISM",
  },
});

const artistMap = new Map(artists.map((artist) => [artist.id, artist]));
const albumMap = new Map(albums.map((album) => [album.id, album]));

export const tracks = rawTracks.map(([id, title, albumId, duration]) => {
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
