import { createAlbumImageSequence } from "./imageCatalog";

const lifestyleAlbumImages = createAlbumImageSequence(12, "lifestyle-playlists");

export const lifestylePlaylists = [
  { id: "dawn-cafe", title: "20년차 카페 사장님의 새벽 플레이리스트", tone: "soft-blue" },
  { id: "rainy-window", title: "비 오는 날 오래 머무는 창가의 음악", tone: "slate-blue" },
  { id: "slow-sunday", title: "느린 일요일 아침을 위한 커피와 재즈", tone: "navy" },
  { id: "han-river-walk", title: "퇴근 후 혼자 걷는 한강의 저녁", tone: "blue" },
  { id: "bookshop-opening", title: "작은 서점의 문을 여는 첫 번째 노래", tone: "soft-blue" },
  { id: "late-night-kitchen", title: "늦은 밤 주방에서 만드는 따뜻한 한 끼", tone: "slate-blue" },
  { id: "weekend-drive", title: "도시를 벗어나는 주말 드라이브", tone: "navy" },
  { id: "plants-and-records", title: "햇빛 좋은 오후의 식물과 레코드", tone: "blue" },
  { id: "designer-studio", title: "집중이 필요한 디자이너의 작업실", tone: "soft-blue" },
  { id: "packing-night", title: "여행 전날 밤 가방을 싸며 듣는 음악", tone: "slate-blue" },
  { id: "late-summer-table", title: "친구들과 나누는 늦은 여름의 식탁", tone: "navy" },
  { id: "closing-the-day", title: "불을 낮춘 방에서 하루를 닫는 순간", tone: "blue" },
].map((playlist, index) => ({ ...playlist, cover: lifestyleAlbumImages[index] }));

export const lifestylePlaylistThemes = {
  "soft-blue": {
    background: "#adc2e5",
    ink: "#07142b",
    muted: "rgba(7, 20, 43, 0.68)",
    line: "rgba(7, 20, 43, 0.22)",
  },
  "slate-blue": {
    background: "#7d90b2",
    ink: "#07142b",
    muted: "rgba(7, 20, 43, 0.7)",
    line: "rgba(7, 20, 43, 0.24)",
  },
  navy: {
    background: "#0b1a34",
    ink: "#fff1cf",
    muted: "rgba(255, 241, 207, 0.68)",
    line: "rgba(255, 241, 207, 0.22)",
  },
  blue: {
    background: "#496db8",
    ink: "#fff1cf",
    muted: "rgba(255, 241, 207, 0.74)",
    line: "rgba(255, 241, 207, 0.26)",
  },
};

export const getLifestylePlaylist = (playlistId) => (
  lifestylePlaylists.find((playlist) => playlist.id === playlistId) ?? lifestylePlaylists[0]
);
