import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const visibilityOptions = ["전체 공개", "팔로워만", "비공개"];
const defaultTags = ["비", "버스", "성북구"];
const trackItems = [
  { id: 1, title: "Jane&the boys", time: "2:31" },
  { id: 2, title: "BIRDS OF A FEATHER", time: "3:30" },
  { id: 3, title: "Confetti Dream", time: "3:12" },
  { id: 4, title: "Upside Mood", time: "2:48" },
];

const formatTime = (date = new Date()) => (
  date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
);

const createMomentState = () => ({
  coverImage: "",
  selectedTags: ["비"],
  customTags: [],
  momentText: "",
  visibility: "전체 공개",
  selectedTrack: trackItems[0],
  timeStamp: {
    time: formatTime(),
    location: "서울 성북구",
    weather: "흐림",
    temperature: "18°C",
  },
});

const createPlaylistState = () => ({
  coverImage: "",
  playlistTitle: "",
  playlistDescription: "",
  selectedTags: ["비"],
  customTags: [],
  visibility: "전체 공개",
  selectedTracks: [trackItems[0].id],
});

function Create() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [resultType, setResultType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [momentData, setMomentData] = useState(() => createMomentState());
  const [playlistData, setPlaylistData] = useState(() => createPlaylistState());
  const toastTimeoutRef = useRef(null);

  useEffect(() => (
    () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    }
  ), []);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage("");
      toastTimeoutRef.current = null;
    }, 2000);
  };

  const saveCreatedItem = (type, data) => {
    const storageKey = "tempyCreatedItems";
    const nextItem = {
      id: Date.now(),
      type,
      createdAt: new Date().toISOString(),
      data,
    };

    try {
      const previousItems = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      const items = Array.isArray(previousItems) ? previousItems : [];
      window.localStorage.setItem(storageKey, JSON.stringify([...items, nextItem]));
    } catch {
      window.localStorage.setItem(storageKey, JSON.stringify([nextItem]));
    }
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
    setResultType(null);
    if (type === "moment") {
      setMomentData((current) => ({
        ...current,
        timeStamp: {
          ...current.timeStamp,
          time: formatTime(),
        },
      }));
    }
  };

  const handleBackToChoice = () => {
    setSelectedType(null);
    setResultType(null);
  };

  const handleSaveDraft = () => {
    showToast(selectedType === "moment"
      ? "Moment Card가 임시저장 되었어요."
      : "Playlist가 임시저장 되었어요.");
  };

  const handleCreate = () => {
    if (selectedType === "moment") {
      const data = {
        ...momentData,
        timeStamp: {
          ...momentData.timeStamp,
          time: momentData.timeStamp.time || formatTime(),
        },
      };
      setMomentData(data);
      saveCreatedItem("moment", data);
      setResultType("moment");
      return;
    }

    const data = {
      ...playlistData,
      selectedTracks: playlistData.selectedTracks
        .map((trackId) => trackItems.find((track) => track.id === trackId))
        .filter(Boolean),
    };
    saveCreatedItem("playlist", data);
    setResultType("playlist");
  };

  return (
    <>
      <style>{`
        .create-start-page,
        .create-start-page *,
        .create-detail-page,
        .create-detail-page * {
          box-sizing: border-box !important;
        }

        .create-start-page,
        .create-detail-page {
          --tempy-navy: #07142b;
          --tempy-blue: #2f5bea;
          --tempy-soft-blue: #d9e8ff;
          --tempy-cream: #fbfaf5;
          --tempy-paper: #f3f4f0;
          --tempy-white: #ffffff;
          --tempy-line: rgba(7, 20, 43, 0.12);
          min-height: 100vh !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          color: var(--tempy-navy) !important;
          background: var(--tempy-paper) !important;
          overflow: hidden !important;
          font-family: "Pretendard", "Helvetica Neue", Arial, sans-serif !important;
        }

        .create-start-page .create-start-shell,
        .create-detail-page .create-detail-shell {
          display: grid !important;
          width: 100% !important;
          min-height: 100vh !important;
          grid-template-columns: minmax(360px, 28vw) minmax(0, 1fr) !important;
          background: var(--tempy-paper) !important;
        }

        .create-start-page .create-start-intro,
        .create-detail-page .create-detail-side {
          position: relative !important;
          display: flex !important;
          min-height: 100vh !important;
          padding: 166px 54px 80px 62px !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: flex-start !important;
          background: var(--tempy-paper) !important;
          border-right: 0 !important;
        }

        .create-start-page .create-start-intro h1,
        .create-detail-page .create-detail-side h1 {
          max-width: 620px !important;
          margin: 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(72px, 8.4vw, 150px) !important;
          line-height: 0.8 !important;
          font-weight: 400 !important;
          letter-spacing: var(--galgo-page-title-spacing) !important;
          text-align: left !important;
        }

        .create-start-page .create-start-intro p,
        .create-detail-page .create-detail-side p {
          max-width: 660px !important;
          margin: 10px 0 18px !important;
          color: var(--tempy-navy) !important;
          font-size: 20px !important;
          line-height: 1.6 !important;
          font-weight: 400 !important;
          letter-spacing: 0 !important;
          word-break: keep-all !important;
          text-align: left !important;
        }

        .create-start-page .create-start-options {
          position: relative !important;
          display: grid !important;
          min-height: 100vh !important;
          padding: 216px 78px 120px 120px !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 38px !important;
          align-items: center !important;
          background: var(--tempy-soft-blue) !important;
        }

        .create-start-page .create-start-card {
          position: relative !important;
          display: flex !important;
          width: 100% !important;
          min-height: clamp(500px, 38vw, 650px) !important;
          padding: clamp(105px, 10vw, 170px) clamp(54px, 4.3vw, 78px) !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: flex-start !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: #ffffff !important;
          color: var(--tempy-navy) !important;
          text-align: left !important;
          box-shadow: none !important;
          appearance: none !important;
          cursor: pointer !important;
          overflow: hidden !important;
          transition:
            transform 560ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 560ms cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .create-start-page .create-start-card::before {
          content: "" !important;
          position: absolute !important;
          right: clamp(28px, 3vw, 48px) !important;
          top: clamp(28px, 3vw, 48px) !important;
          width: clamp(58px, 5vw, 86px) !important;
          aspect-ratio: 1 !important;
          border: 1px solid rgba(7, 20, 43, 0.2) !important;
          border-radius: 50% !important;
          background:
            radial-gradient(circle at center, transparent 0 28%, rgba(47, 91, 234, 0.12) 29% 30%, transparent 31% 100%) !important;
          pointer-events: none !important;
        }

        .create-start-page .create-start-card::after {
          position: absolute !important;
          left: clamp(28px, 3vw, 48px) !important;
          top: clamp(28px, 3vw, 48px) !important;
          z-index: 1 !important;
          color: var(--tempy-blue) !important;
          font-size: 12px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          letter-spacing: 0.12em !important;
        }

        .create-start-page .create-start-card:nth-child(1)::after {
          content: "01" !important;
        }

        .create-start-page .create-start-card:nth-child(2) {
          box-shadow: none !important;
        }

        .create-start-page .create-start-card:nth-child(2)::before {
          border-color: rgba(255, 52, 60, 0.28) !important;
          background:
            radial-gradient(circle at center, transparent 0 28%, rgba(255, 52, 60, 0.12) 29% 30%, transparent 31% 100%) !important;
        }

        .create-start-page .create-start-card:nth-child(2)::after {
          content: "02" !important;
          color: #ff343c !important;
        }

        .create-start-page .create-start-card:hover {
          transform: translate3d(0, -5px, 0) !important;
          background: rgba(255, 255, 255, 0.92) !important;
        }

        .create-start-page .create-start-card h2 {
          position: relative !important;
          z-index: 1 !important;
          margin: 28px 0 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(82px, 6.1vw, 118px) !important;
          line-height: 0.8 !important;
          font-weight: 400 !important;
          letter-spacing: -0.008em !important;
          text-align: left !important;
        }

        .create-start-page .create-start-card p {
          position: relative !important;
          z-index: 1 !important;
          max-width: 460px !important;
          margin: 28px 0 0 !important;
          color: var(--tempy-navy) !important;
          font-size: clamp(18px, 1.25vw, 23px) !important;
          line-height: 1.55 !important;
          font-weight: 900 !important;
          letter-spacing: -0.05em !important;
          word-break: keep-all !important;
          text-align: left !important;
        }

        .create-detail-page .create-detail-back {
          position: absolute !important;
          top: 120px !important;
          left: 80px !important;
          display: inline-flex !important;
          width: fit-content !important;
          min-height: 32px !important;
          padding: 0 !important;
          align-items: center !important;
          gap: 12px !important;
          border: 0 !important;
          background: transparent !important;
          color: var(--tempy-navy) !important;
          font-size: 12px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          letter-spacing: 0.09em !important;
          box-shadow: none !important;
          cursor: pointer !important;
          transition: color 230ms ease, transform 230ms ease !important;
        }

        .create-detail-page .create-detail-back span:first-child {
          display: grid !important;
          width: 32px !important;
          height: 32px !important;
          place-items: center !important;
          border: 1px solid var(--tempy-navy) !important;
          border-radius: 50% !important;
          color: var(--tempy-navy) !important;
          background: transparent !important;
          font-size: 16px !important;
          font-weight: 400 !important;
          transition: color 230ms ease, background-color 230ms ease, transform 230ms ease !important;
        }

        .create-detail-page .create-detail-back:hover {
          color: var(--tempy-blue) !important;
          transform: translateX(-1px) !important;
        }

        .create-detail-page .create-detail-back:hover span:first-child {
          color: #ffffff !important;
          background: var(--tempy-navy) !important;
          transform: translateX(-2px) !important;
        }

        .create-detail-page .create-detail-workspace {
          position: relative !important;
          display: flex !important;
          min-height: 100vh !important;
          padding: 128px 72px 120px 78px !important;
          flex-direction: column !important;
          background: var(--tempy-soft-blue) !important;
          overflow: hidden !important;
        }

        .create-detail-page .create-detail-workspace::before {
          content: none !important;
        }

        .create-detail-page .create-detail-workspace::after {
          content: "" !important;
          position: absolute !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          z-index: 0 !important;
          height: 86px !important;
          background: var(--tempy-blue) !important;
          pointer-events: none !important;
        }

        .create-detail-page .create-detail-content {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          min-height: calc(100vh - 254px) !important;
          flex-direction: column !important;
        }

        .create-detail-page .create-detail-header h2 {
          margin: 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(54px, 4vw, 82px) !important;
          line-height: 0.86 !important;
          font-weight: 400 !important;
          letter-spacing: -0.03em !important;
        }

        .create-detail-page .create-detail-header h2::before {
          content: none !important;
        }

        .create-detail-page .create-detail-header p {
          max-width: 680px !important;
          margin: 20px 0 0 !important;
          color: var(--tempy-navy) !important;
          font-size: clamp(16px, 1.05vw, 20px) !important;
          line-height: 1.5 !important;
          font-weight: 850 !important;
          letter-spacing: -0.045em !important;
          word-break: keep-all !important;
        }

        .create-detail-page .create-detail-grid {
          display: grid !important;
          margin-top: 48px !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: 22px !important;
          align-items: stretch !important;
        }

        .create-detail-page .create-detail-grid--playlist {
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.08fr) minmax(0, 1.18fr) !important;
        }

        .create-detail-page .create-detail-card {
          position: relative !important;
          display: flex !important;
          min-height: 370px !important;
          padding: 32px !important;
          flex-direction: column !important;
          background: var(--tempy-cream) !important;
          color: var(--tempy-navy) !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
        }

        .create-detail-page .create-detail-card:nth-child(2) {
          background: #fbfaf5 !important;
          box-shadow: none !important;
        }

        .create-detail-page .create-detail-card:nth-child(3) {
          box-shadow: none !important;
        }

        .create-detail-page .create-detail-card::before {
          content: none !important;
        }

        .create-detail-page .create-detail-card:nth-child(2)::before {
          content: none !important;
        }

        .create-detail-page .create-detail-card:nth-child(3)::before {
          content: none !important;
        }

        .create-detail-page .create-detail-card h3 {
          margin: 10px 0 28px !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(34px, 2.45vw, 48px) !important;
          line-height: 0.88 !important;
          font-weight: 400 !important;
          letter-spacing: -0.02em !important;
        }

        .create-detail-page .create-detail-cover {
          position: relative !important;
          display: grid !important;
          width: 100% !important;
          aspect-ratio: 1 / 1 !important;
          min-height: 190px !important;
          place-items: center !important;
          border: 1px solid rgba(7, 20, 43, 0.14) !important;
          background:
            radial-gradient(circle at center, #ffffff 0 13%, rgba(7, 20, 43, 0.12) 13.5% 14.5%, transparent 15%),
            repeating-radial-gradient(circle at center, rgba(7, 20, 43, 0.075) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, rgba(47, 91, 234, 0.08), rgba(255, 48, 47, 0.04)),
            #fbfaf5 !important;
          color: rgba(7, 20, 43, 0.52) !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          letter-spacing: 0.08em !important;
          overflow: hidden !important;
          appearance: none !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-cover::after {
          content: none !important;
        }

        .create-detail-page .create-detail-cover img,
        .create-result-cover img {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .create-detail-page .create-detail-cover--filled {
          background: #ffffff !important;
        }

        .create-file-input {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }

        .create-detail-page .create-detail-cover-button,
        .create-detail-page .create-detail-action,
        .create-detail-page .create-detail-secondary-action {
          display: inline-flex !important;
          min-height: 42px !important;
          padding: 0 22px !important;
          align-items: center !important;
          justify-content: center !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: var(--tempy-blue) !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          letter-spacing: -0.025em !important;
          box-shadow: none !important;
          cursor: pointer !important;
          transition: transform 180ms ease, background-color 180ms ease, color 180ms ease !important;
        }

        .create-detail-page .create-detail-cover-button:hover,
        .create-detail-page .create-detail-action:hover,
        .create-detail-page .create-detail-secondary-action:hover {
          transform: translate3d(0, -2px, 0) !important;
          background: #244bd0 !important;
          color: #ffffff !important;
        }

        .create-detail-page .create-detail-cover-button {
          width: fit-content !important;
          margin-top: 18px !important;
        }

        .create-detail-page .create-detail-field {
          display: flex !important;
          margin-bottom: 20px !important;
          flex-direction: column !important;
          gap: 8px !important;
        }

        .create-detail-page .create-detail-field label,
        .create-detail-page .create-detail-label {
          color: var(--tempy-navy) !important;
          font-size: 12px !important;
          line-height: 1 !important;
          font-weight: 900 !important;
          letter-spacing: -0.025em !important;
        }

        .create-detail-page .create-detail-field input,
        .create-detail-page .create-detail-field textarea,
        .create-detail-page .create-detail-search,
        .create-tag-add input {
          width: 100% !important;
          border: 1px solid rgba(7, 20, 43, 0.24) !important;
          border-radius: 0 !important;
          background: var(--tempy-white) !important;
          color: var(--tempy-navy) !important;
          font-family: "Pretendard", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 15px !important;
          font-weight: 800 !important;
          letter-spacing: -0.035em !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .create-detail-page .create-detail-field input,
        .create-detail-page .create-detail-search,
        .create-tag-add input {
          height: 46px !important;
          padding: 0 15px !important;
        }

        .create-detail-page .create-detail-field textarea {
          min-height: 150px !important;
          padding: 14px 15px !important;
          resize: none !important;
          background:
            linear-gradient(rgba(7, 20, 43, 0.08) 1px, transparent 1px),
            var(--tempy-white) !important;
          background-size: 100% 34px !important;
        }

        .create-detail-page .create-detail-tags,
        .create-detail-page .create-detail-visibility,
        .create-detail-page .create-detail-stamps {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }

        .create-detail-page .create-detail-pill {
          display: inline-flex !important;
          min-height: 32px !important;
          padding: 0 12px !important;
          align-items: center !important;
          border: 1px solid rgba(7, 20, 43, 0.24) !important;
          border-radius: 0 !important;
          background: var(--tempy-white) !important;
          color: var(--tempy-navy) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          letter-spacing: -0.025em !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-pill--active {
          border-color: var(--tempy-blue) !important;
          background: var(--tempy-blue) !important;
          color: #ffffff !important;
        }

        .create-tag-add {
          display: grid !important;
          margin-top: 10px !important;
          grid-template-columns: minmax(0, 1fr) auto !important;
          gap: 8px !important;
        }

        .create-tag-add button {
          min-height: 46px !important;
          padding: 0 14px !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: var(--tempy-blue) !important;
          color: #ffffff !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-stamps {
          margin-top: auto !important;
          padding-top: 28px !important;
        }

        .create-detail-page .create-detail-track-list {
          display: grid !important;
          margin-top: 18px !important;
          gap: 10px !important;
        }

        .create-detail-page .create-detail-track {
          display: grid !important;
          min-height: 56px !important;
          padding: 8px 10px !important;
          grid-template-columns: 40px 1fr auto !important;
          gap: 12px !important;
          align-items: center !important;
          background: #ffffff !important;
          border: 1px solid rgba(7, 20, 43, 0.12) !important;
          position: relative !important;
          overflow: hidden !important;
          width: 100% !important;
          color: var(--tempy-navy) !important;
          text-align: left !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-track::after {
          content: none !important;
        }

        .create-detail-page .create-detail-track:nth-child(even)::after {
          content: none !important;
        }

        .create-detail-page .create-detail-track-cover {
          display: block !important;
          width: 40px !important;
          height: 40px !important;
          background: #d9e8ff !important;
        }

        .create-detail-page .create-detail-track--active {
          border-color: var(--tempy-blue) !important;
          background: rgba(47, 91, 234, 0.1) !important;
        }

        .create-detail-page .create-detail-track strong {
          overflow: hidden !important;
          color: var(--tempy-navy) !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          letter-spacing: -0.035em !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .create-detail-page .create-detail-track span {
          color: rgba(7, 20, 43, 0.6) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
        }

        .create-detail-page .create-detail-actions {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          margin-top: auto !important;
          padding-top: 44px !important;
          justify-content: flex-end !important;
          gap: 12px !important;
        }

        .create-detail-page .create-detail-secondary-action {
          background: var(--tempy-white) !important;
          color: var(--tempy-navy) !important;
        }

        .create-track-caption {
          margin: 14px 0 0 !important;
          color: rgba(7, 20, 43, 0.66) !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          letter-spacing: -0.025em !important;
        }

        .create-result-preview {
          display: grid !important;
          width: min(760px, 100%) !important;
          margin-top: 48px !important;
          grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.1fr) !important;
          background: var(--tempy-cream) !important;
        }

        .create-result-cover {
          display: grid !important;
          min-height: 380px !important;
          place-items: center !important;
          border-right: 1px solid rgba(7, 20, 43, 0.1) !important;
          background:
            radial-gradient(circle at center, #ffffff 0 13%, rgba(7, 20, 43, 0.12) 13.5% 14.5%, transparent 15%),
            repeating-radial-gradient(circle at center, rgba(7, 20, 43, 0.075) 0 1px, transparent 1px 18px),
            linear-gradient(135deg, rgba(47, 91, 234, 0.08), rgba(255, 48, 47, 0.04)),
            #fbfaf5 !important;
          color: rgba(7, 20, 43, 0.52) !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          letter-spacing: 0.08em !important;
          overflow: hidden !important;
        }

        .create-result-body {
          display: flex !important;
          min-width: 0 !important;
          padding: 34px !important;
          flex-direction: column !important;
        }

        .create-result-kicker {
          color: rgba(7, 20, 43, 0.62) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          letter-spacing: -0.02em !important;
        }

        .create-result-body h3 {
          margin: 18px 0 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(44px, 3.2vw, 66px) !important;
          line-height: 0.9 !important;
          font-weight: 400 !important;
          letter-spacing: -0.025em !important;
        }

        .create-result-body p {
          margin: 22px 0 0 !important;
          color: var(--tempy-navy) !important;
          font-size: 17px !important;
          line-height: 1.55 !important;
          font-weight: 800 !important;
          letter-spacing: -0.04em !important;
          word-break: keep-all !important;
        }

        .create-result-meta,
        .create-result-tags {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }

        .create-result-meta {
          margin-top: 26px !important;
        }

        .create-result-tags {
          margin-top: auto !important;
          padding-top: 24px !important;
        }

        .create-result-track-list {
          display: grid !important;
          margin-top: 28px !important;
          gap: 10px !important;
        }

        .create-result-track {
          display: grid !important;
          min-height: 56px !important;
          padding: 8px 10px !important;
          grid-template-columns: 40px 1fr auto !important;
          gap: 12px !important;
          align-items: center !important;
          background: #ffffff !important;
        }

        .create-result-track strong {
          overflow: hidden !important;
          color: var(--tempy-navy) !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          letter-spacing: -0.035em !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .create-result-track span:last-child {
          color: rgba(7, 20, 43, 0.6) !important;
          font-size: 12px !important;
          font-weight: 900 !important;
        }

        .create-toast {
          position: fixed !important;
          right: 30px !important;
          bottom: 30px !important;
          z-index: 80 !important;
          padding: 14px 18px !important;
          background: #ffffff !important;
          color: var(--tempy-navy, #07142b) !important;
          border: 1px solid rgba(7, 20, 43, 0.16) !important;
          border-radius: 0 !important;
          box-shadow: 0 12px 28px rgba(7, 20, 43, 0.12) !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          letter-spacing: -0.035em !important;
        }

        @media (max-width: 1180px) {
          .create-start-page,
          .create-detail-page {
            overflow: auto !important;
          }

          .create-start-page .create-start-shell,
          .create-detail-page .create-detail-shell {
            display: block !important;
            background: var(--tempy-paper) !important;
          }

          .create-start-page .create-start-intro,
          .create-detail-page .create-detail-side {
            min-height: auto !important;
            padding: 132px 28px 46px !important;
          }

          .create-start-page .create-start-options,
          .create-detail-page .create-detail-workspace {
            min-height: auto !important;
            padding: 58px 28px 112px !important;
          }

          .create-start-page .create-start-options,
          .create-detail-page .create-detail-grid,
          .create-detail-page .create-detail-grid--playlist,
          .create-result-preview {
            grid-template-columns: 1fr !important;
          }

          .create-detail-page .create-detail-back {
            top: 78px !important;
            left: 28px !important;
          }
        }
      `}</style>

      {resultType ? (
        <CreateResult
          type={resultType}
          momentData={momentData}
          playlistData={playlistData}
          onRetry={() => setResultType(null)}
          onBackToCreate={handleBackToChoice}
          onViewArchive={() => navigate("/archive")}
        />
      ) : selectedType === null ? (
        <CreateChoice onSelect={handleSelectType} />
      ) : (
        <CreateDetail
          type={selectedType}
          momentData={momentData}
          playlistData={playlistData}
          onMomentChange={setMomentData}
          onPlaylistChange={setPlaylistData}
          onBack={handleBackToChoice}
          onSaveDraft={handleSaveDraft}
          onCreate={handleCreate}
        />
      )}

      {toastMessage && (
        <div className="create-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </>
  );
}

function CreateChoice({ onSelect }) {
  return (
    <main className="create-start-page">
      <section className="create-start-shell">
        <aside className="create-start-intro">
          <h1>Create Moment</h1>
          <p>
            지금 듣는 노래와 나의 순간을<br />
            나만의 방식으로 남겨 보세요.
          </p>
        </aside>

        <section className="create-start-options" aria-label="Create options">
          <button className="create-start-card" type="button" onClick={() => onSelect("moment")}>
            <h2>Moment Card</h2>
            <p>
              지금의 시간 · 날씨 · 위치를 담아<br />
              1곡짜리 순간 큐레이션을 남겨요
            </p>
          </button>

          <button className="create-start-card" type="button" onClick={() => onSelect("playlist")}>
            <h2>Playlist</h2>
            <p>여러 곡을 하나의 순간 맥락으로 묶어 공유해보세요</p>
          </button>
        </section>
      </section>
    </main>
  );
}

function CreateDetail({
  type,
  momentData,
  playlistData,
  onMomentChange,
  onPlaylistChange,
  onBack,
  onSaveDraft,
  onCreate,
}) {
  const isMoment = type === "moment";

  return (
    <main className="create-detail-page">
      <section className="create-detail-shell">
        <aside className="create-detail-side">
          <button className="create-detail-back" type="button" onClick={onBack} aria-label="선택 화면으로 돌아가기">
            <span aria-hidden="true">←</span>
            <span>BACK</span>
          </button>
          <h1>{isMoment ? "Moment Card" : "Playlist"}</h1>
          <p>
            {isMoment ? (
              <>
                지금의 시간 · 날씨 · 위치를 담아<br />
                1곡짜리 순간 큐레이션을 남겨요
              </>
            ) : (
              <>
                여러 곡을 하나의 순간 맥락으로 묶어<br />
                공유해보세요
              </>
            )}
          </p>
        </aside>

        <section className="create-detail-workspace" aria-label={isMoment ? "Moment Card 작성" : "Playlist 작성"}>
          <div className="create-detail-content">
            <header className="create-detail-header">
              <h2>{isMoment ? "Create Moment Card" : "New Playlist"}</h2>
              <p>
                {isMoment
                  ? "노래 1곡과 지금의 시간, 감정, 날씨를 한 장의 카드로 남겨보세요."
                  : "여러 곡을 하나의 순간 맥락으로 묶어 공유해보세요"}
              </p>
            </header>

            {isMoment ? (
              <MomentCardForm data={momentData} onChange={onMomentChange} />
            ) : (
              <PlaylistForm data={playlistData} onChange={onPlaylistChange} />
            )}

            <div className="create-detail-actions">
              <button className="create-detail-secondary-action" type="button" onClick={onSaveDraft}>임시저장</button>
              <button className="create-detail-action" type="button" onClick={onCreate}>만들기</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function readImageFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      onLoad(reader.result);
    }
  };
  reader.readAsDataURL(file);
}

function toggleValue(values, value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function TagEditor({ selectedTags, customTags, onToggleTag, onAddTag }) {
  const [isAdding, setIsAdding] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tags = [...defaultTags, ...customTags];

  const commitTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag) return;
    onAddTag(nextTag);
    setTagInput("");
    setIsAdding(false);
  };

  return (
    <>
      <div className="create-detail-tags">
        {tags.map((tag) => (
          <button
            className={`create-detail-pill${selectedTags.includes(tag) ? " create-detail-pill--active" : ""}`}
            type="button"
            key={tag}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
        <button className="create-detail-pill" type="button" onClick={() => setIsAdding(true)}>
          + 추가
        </button>
      </div>

      {isAdding && (
        <div className="create-tag-add">
          <input
            type="text"
            value={tagInput}
            placeholder="태그 입력"
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitTag();
              }
            }}
          />
          <button type="button" onClick={commitTag}>추가</button>
        </div>
      )}
    </>
  );
}

function VisibilityPicker({ value, onChange }) {
  return (
    <div className="create-detail-visibility">
      {visibilityOptions.map((option) => (
        <button
          className={`create-detail-pill${value === option ? " create-detail-pill--active" : ""}`}
          type="button"
          key={option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function CoverPicker({ image, onChange }) {
  const inputRef = useRef(null);

  return (
    <>
      <button
        className={`create-detail-cover${image ? " create-detail-cover--filled" : ""}`}
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="커버 이미지 선택"
      >
        {image ? <img src={image} alt="선택한 커버 미리보기" /> : "COVER"}
      </button>
      <input
        ref={inputRef}
        className="create-file-input"
        type="file"
        accept="image/*"
        onChange={(event) => {
          readImageFile(event.target.files?.[0], onChange);
          event.target.value = "";
        }}
      />
      <button className="create-detail-cover-button" type="button" onClick={() => inputRef.current?.click()}>
        커버 선택
      </button>
    </>
  );
}

function MomentCardForm({ data, onChange }) {
  const update = (patch) => onChange((current) => ({ ...current, ...patch }));
  const addCustomTag = (tag) => {
    const allTags = [...defaultTags, ...data.customTags];
    if (allTags.includes(tag)) {
      update({ selectedTags: data.selectedTags.includes(tag) ? data.selectedTags : [...data.selectedTags, tag] });
      return;
    }
    update({
      customTags: [...data.customTags, tag],
      selectedTags: [...data.selectedTags, tag],
    });
  };

  return (
    <section className="create-detail-grid" aria-label="Moment Card fields">
      <article className="create-detail-card">
        <h3>01 Select the Track</h3>
        <CoverPicker image={data.coverImage} onChange={(coverImage) => update({ coverImage })} />
        <p className="create-track-caption">{data.selectedTrack.title} · {data.selectedTrack.time}</p>
      </article>

      <article className="create-detail-card">
        <h3>02 Time Stamp</h3>
        <span className="create-detail-label">대표 태그</span>
        <TagEditor
          selectedTags={data.selectedTags}
          customTags={data.customTags}
          onToggleTag={(tag) => update({ selectedTags: toggleValue(data.selectedTags, tag) })}
          onAddTag={addCustomTag}
        />
        <span className="create-detail-label" style={{ marginTop: "30px" }}>자동 기록</span>
        <div className="create-detail-stamps">
          {[data.timeStamp.time, data.timeStamp.location, data.timeStamp.weather, data.timeStamp.temperature].map((stamp) => (
            <Pill key={stamp}>{stamp}</Pill>
          ))}
        </div>
      </article>

      <article className="create-detail-card">
        <h3>03 One-line Moment</h3>
        <div className="create-detail-field">
          <label htmlFor="moment-line">한 줄 순간</label>
          <textarea
            id="moment-line"
            value={data.momentText}
            placeholder="이 순간을 한 줄로 남겨보세요"
            onChange={(event) => update({ momentText: event.target.value })}
          />
        </div>
        <span className="create-detail-label">공개 범위</span>
        <VisibilityPicker value={data.visibility} onChange={(visibility) => update({ visibility })} />
      </article>
    </section>
  );
}

function PlaylistForm({ data, onChange }) {
  const update = (patch) => onChange((current) => ({ ...current, ...patch }));
  const addCustomTag = (tag) => {
    const allTags = [...defaultTags, ...data.customTags];
    if (allTags.includes(tag)) {
      update({ selectedTags: data.selectedTags.includes(tag) ? data.selectedTags : [...data.selectedTags, tag] });
      return;
    }
    update({
      customTags: [...data.customTags, tag],
      selectedTags: [...data.selectedTags, tag],
    });
  };

  return (
    <section className="create-detail-grid create-detail-grid--playlist" aria-label="Playlist fields">
      <article className="create-detail-card">
        <h3>Cover</h3>
        <CoverPicker image={data.coverImage} onChange={(coverImage) => update({ coverImage })} />
      </article>

      <article className="create-detail-card">
        <h3>Playlist Info</h3>
        <div className="create-detail-field">
          <label htmlFor="playlist-title">제목</label>
          <input
            id="playlist-title"
            type="text"
            value={data.playlistTitle}
            placeholder="플레이리스트 제목"
            onChange={(event) => update({ playlistTitle: event.target.value })}
          />
        </div>
        <div className="create-detail-field">
          <label htmlFor="playlist-description">설명</label>
          <input
            id="playlist-description"
            type="text"
            value={data.playlistDescription}
            placeholder="순간의 맥락을 적어주세요"
            onChange={(event) => update({ playlistDescription: event.target.value })}
          />
        </div>
        <span className="create-detail-label">대표 태그</span>
        <TagEditor
          selectedTags={data.selectedTags}
          customTags={data.customTags}
          onToggleTag={(tag) => update({ selectedTags: toggleValue(data.selectedTags, tag) })}
          onAddTag={addCustomTag}
        />
        <span className="create-detail-label" style={{ marginTop: "26px" }}>공개 범위</span>
        <VisibilityPicker value={data.visibility} onChange={(visibility) => update({ visibility })} />
      </article>

      <article className="create-detail-card">
        <h3>Tracks</h3>
        <input className="create-detail-search" type="search" placeholder="트랙 검색" aria-label="트랙 검색" />
        <div className="create-detail-track-list">
          {trackItems.map((track) => (
            <button
              className={`create-detail-track${data.selectedTracks.includes(track.id) ? " create-detail-track--active" : ""}`}
              type="button"
              key={track.id}
              onClick={() => update({ selectedTracks: toggleValue(data.selectedTracks, track.id) })}
            >
              <span className="create-detail-track-cover" aria-hidden="true" />
              <strong>{track.title}</strong>
              <span>{track.time}</span>
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}

function CreateResult({ type, momentData, playlistData, onRetry, onBackToCreate, onViewArchive }) {
  const isMoment = type === "moment";
  const playlistTracks = playlistData.selectedTracks
    .map((trackId) => trackItems.find((track) => track.id === trackId))
    .filter(Boolean);

  return (
    <main className="create-detail-page">
      <section className="create-detail-shell">
        <aside className="create-detail-side">
          <button className="create-detail-back" type="button" onClick={onRetry} aria-label="작성 화면으로 돌아가기">
            <span aria-hidden="true">←</span>
            <span>BACK</span>
          </button>
          <h1>{isMoment ? "Moment Card" : "Playlist"}</h1>
          <p>
            {isMoment ? (
              <>
                지금의 순간이 카드로 저장되었어요.<br />
                다시 편집하거나 새로 만들 수 있어요.
              </>
            ) : (
              <>
                여러 곡이 하나의 순간으로 묶였어요.<br />
                다시 편집하거나 새로 만들 수 있어요.
              </>
            )}
          </p>
        </aside>

        <section className="create-detail-workspace" aria-label={isMoment ? "Moment Card 결과" : "Playlist 결과"}>
          <div className="create-detail-content">
            <header className="create-detail-header">
              <h2>{isMoment ? "Moment Created" : "Playlist Created"}</h2>
              <p>{isMoment ? "지금의 순간이 카드로 저장되었어요." : "여러 곡이 하나의 순간으로 묶였어요."}</p>
            </header>

            {isMoment ? (
              <article className="create-result-preview create-result-preview--moment">
                <ResultCover image={momentData.coverImage} />
                <div className="create-result-body">
                  <span className="create-result-kicker">
                    {momentData.timeStamp.time} · {momentData.timeStamp.location}
                  </span>
                  <h3>{momentData.selectedTrack.title}</h3>
                  <p>{momentData.momentText || "아직 한 줄 순간이 비어 있어요."}</p>
                  <div className="create-result-meta">
                    {[momentData.timeStamp.weather, momentData.timeStamp.temperature, momentData.visibility].map((item) => (
                      <Pill key={item}>{item}</Pill>
                    ))}
                  </div>
                  <div className="create-result-tags">
                    {momentData.selectedTags.map((tag) => (
                      <Pill key={tag} active>{tag}</Pill>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <article className="create-result-preview create-result-preview--playlist">
                <ResultCover image={playlistData.coverImage} />
                <div className="create-result-body">
                  <span className="create-result-kicker">{playlistData.visibility}</span>
                  <h3>{playlistData.playlistTitle || "Untitled Playlist"}</h3>
                  <p>{playlistData.playlistDescription || "아직 플레이리스트 설명이 비어 있어요."}</p>
                  <div className="create-result-tags">
                    {playlistData.selectedTags.map((tag) => (
                      <Pill key={tag} active>{tag}</Pill>
                    ))}
                  </div>
                  <div className="create-result-track-list">
                    {playlistTracks.length ? (
                      playlistTracks.map((track) => (
                        <div className="create-result-track" key={track.id}>
                          <span className="create-detail-track-cover" aria-hidden="true" />
                          <strong>{track.title}</strong>
                          <span>{track.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="create-result-empty">선택된 트랙이 없어요.</p>
                    )}
                  </div>
                </div>
              </article>
            )}

            <div className="create-detail-actions">
              <button className="create-detail-secondary-action" type="button" onClick={onRetry}>다시 만들기</button>
              <button className="create-detail-action" type="button" onClick={onBackToCreate}>Create로 돌아가기</button>
              <button className="create-detail-action" type="button" onClick={onViewArchive}>Archive에서 보기</button>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function ResultCover({ image }) {
  return (
    <div className={`create-result-cover${image ? " create-result-cover--filled" : ""}`}>
      {image ? <img src={image} alt="생성된 커버" /> : "COVER"}
    </div>
  );
}

function Pill({ active = false, children }) {
  return (
    <span className={`create-detail-pill${active ? " create-detail-pill--active" : ""}`}>
      {children}
    </span>
  );
}

export default Create;
