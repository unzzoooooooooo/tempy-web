import { createAlbumImageSequence } from "./imageCatalog";

const lifestyleAlbumImages = createAlbumImageSequence(12, "lifestyle-playlists");

export const lifestylePlaylists = [
  { id: "dawn-cafe", title: "20년차 카페 사장님의 새벽 플레이리스트", tone: "soft-blue" },
  { id: "rainy-window", title: "첫차를 기다리는 방송 작가의 메모", tone: "slate-blue" },
  { id: "slow-sunday", title: "도시락을 싸는 엄마의 조용한 오전", tone: "navy" },
  { id: "han-river-walk", title: "퇴근 후 골목을 천천히 걷는 디자이너", tone: "blue" },
  { id: "bookshop-opening", title: "비 오는 날 서점 문을 여는 사람", tone: "soft-blue" },
  { id: "late-night-kitchen", title: "작은 바에서 마감 불을 끄는 바텐더", tone: "slate-blue" },
  { id: "weekend-drive", title: "낡은 필름 카메라를 들고 떠난 주말", tone: "navy" },
  { id: "plants-and-records", title: "식물을 돌보며 하루를 시작하는 편집자", tone: "blue" },
  { id: "designer-studio", title: "집중이 필요한 디자이너의 작업실", tone: "soft-blue" },
  { id: "packing-night", title: "다음 도시로 떠날 짐을 싸는 여행 작가", tone: "slate-blue" },
  { id: "late-summer-table", title: "손님을 맞이하는 게스트하우스 주인의 식탁", tone: "navy" },
  { id: "closing-the-day", title: "새 프로젝트를 시작하는 개발자의 심야", tone: "blue" },
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
