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
          grid-template-columns: minmax(460px, 34%) minmax(0, 1fr) !important;
          background: var(--tempy-paper) !important;
        }

        .create-start-page .create-start-intro,
        .create-detail-page .create-detail-side {
          position: relative !important;
          display: flex !important;
          min-height: 100vh !important;
          padding: 150px var(--detail-back-inline) 72px !important;
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
        .create-detail-page .create-detail-side p:not(.create-detail-eyebrow):not(.discover-page__eyebrow) {
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

        .create-detail-page .create-detail-eyebrow {
          position: relative !important;
          z-index: 1 !important;
          margin: 0 0 var(--label-title-gap) !important;
          color: var(--tempy-blue) !important;
          font-size: 14px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
        }

        .create-detail-page .create-detail-description {
          max-width: 470px !important;
          margin: 18px 0 0 !important;
          color: rgba(7, 20, 43, 0.72) !important;
          font-size: 18px !important;
          line-height: 1.65 !important;
          font-weight: 400 !important;
          letter-spacing: 0 !important;
        }

        .create-start-page .create-start-options {
          position: relative !important;
          display: grid !important;
          min-height: 100vh !important;
          padding: 150px clamp(42px, 4.1vw, 78px) 58px !important;
          grid-template-columns: minmax(0, 1fr) !important;
          grid-template-rows: auto minmax(0, 1fr) !important;
          gap: 26px !important;
          background: var(--tempy-soft-blue) !important;
        }

        .create-start-page .create-start-shell {
          grid-template-columns: minmax(460px, 34%) minmax(0, 1fr) !important;
        }

        .create-start-page .create-start-intro {
          padding: 86px 5.2vw 0 !important;
          justify-content: center !important;
          overflow: hidden !important;
        }

        .create-start-page .create-start-intro-copy {
          width: 100% !important;
          transform: translateY(-4vh) !important;
        }

        .create-start-page .create-start-intro h1 {
          position: relative !important;
          z-index: 1 !important;
          max-width: 100% !important;
          font-size: clamp(72px, 8.4vw, 150px) !important;
          line-height: 0.8 !important;
          font-weight: 400 !important;
          letter-spacing: var(--galgo-page-title-spacing) !important;
        }

        .create-start-page .create-start-intro p.create-start-eyebrow {
          position: relative !important;
          z-index: 1 !important;
          margin: 0 0 var(--label-title-gap) !important;
          color: #2759ed !important;
          font-family: "Pretendard", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 14px !important;
          line-height: normal !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          text-transform: uppercase !important;
        }

        .create-start-page .create-start-description {
          position: relative !important;
          z-index: 1 !important;
          width: max-content !important;
          max-width: none !important;
          margin: 10px 0 0 !important;
          color: #07142b !important;
          font-family: "Pretendard", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 20px !important;
          line-height: 1.6 !important;
          font-weight: 400 !important;
          letter-spacing: 0 !important;
          white-space: nowrap !important;
        }

        .create-start-page .create-start-options-head {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 20px !important;
          color: rgba(7, 20, 43, 0.66) !important;
          font-size: 11px !important;
          line-height: 1 !important;
          font-weight: 800 !important;
          letter-spacing: 0.12em !important;
        }

        .create-start-page .create-start-options-head {
          padding-bottom: 4px !important;
        }

        .create-start-page .create-start-card-grid {
          display: grid !important;
          width: 100% !important;
          height: min(52vh, 520px) !important;
          min-height: 440px !important;
          align-self: center !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: clamp(22px, 1.8vw, 34px) !important;
          transform: translateY(clamp(-22px, -1.25vw, -14px)) !important;
        }

        .create-start-page .create-start-card {
          position: relative !important;
          display: grid !important;
          width: 100% !important;
          height: 100% !important;
          min-height: 0 !important;
          padding: clamp(28px, 2.1vw, 40px) !important;
          grid-template-rows: auto minmax(0, 1fr) auto !important;
          align-items: stretch !important;
          border: 1px solid rgba(7, 20, 43, 0.18) !important;
          border-radius: 4px !important;
          background: #fbfaf5 !important;
          color: var(--tempy-navy) !important;
          text-align: left !important;
          box-shadow: 0 1px 4px rgba(7, 20, 43, 0.025) !important;
          appearance: none !important;
          cursor: pointer !important;
          overflow: hidden !important;
          transition:
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 360ms ease,
            border-color 360ms ease,
            background-color 360ms ease !important;
        }

        .create-start-page .create-start-card:hover {
          border-color: rgba(7, 20, 43, 0.3) !important;
          background: #fcfbf7 !important;
          box-shadow: 0 13px 28px rgba(7, 20, 43, 0.075) !important;
          transform: translate3d(0, -3px, 0) !important;
        }

        .create-start-page .create-start-card:focus-visible {
          outline: 2px solid var(--tempy-blue) !important;
          outline-offset: 4px !important;
        }

        .create-start-page .create-start-card-topline,
        .create-start-page .create-start-card-select {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 16px !important;
        }

        .create-start-page .create-start-card-topline {
          padding-bottom: 19px !important;
          border-bottom: 1px solid rgba(7, 20, 43, 0.13) !important;
        }

        .create-start-page .create-start-card-topline strong {
          color: rgba(7, 20, 43, 0.86) !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.14em !important;
        }

        .create-start-page .create-start-card-topline small,
        .create-start-page .create-start-card-select small {
          color: rgba(7, 20, 43, 0.5) !important;
          font-size: 10px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          letter-spacing: 0.14em !important;
        }

        .create-start-page .create-start-card-copy {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          align-self: center !important;
          padding: 30px 0 32px !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .create-start-page .create-start-card h2 {
          margin: 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(76px, 5.7vw, 112px) !important;
          line-height: 0.76 !important;
          font-weight: 400 !important;
          letter-spacing: var(--galgo-card-title-spacing) !important;
          text-align: left !important;
        }

        .create-start-page .create-start-card-copy-rule {
          display: block !important;
          width: 100% !important;
          height: 1px !important;
          margin: 28px 0 20px !important;
          background: rgba(7, 20, 43, 0.13) !important;
        }

        .create-start-page .create-start-card p {
          max-width: none !important;
          margin: 0 !important;
          color: rgba(7, 20, 43, 0.72) !important;
          font-size: clamp(11px, 0.78vw, 15px) !important;
          line-height: 1.55 !important;
          font-weight: 500 !important;
          letter-spacing: -0.035em !important;
          word-break: keep-all !important;
          white-space: nowrap !important;
          text-align: left !important;
        }

        .create-start-page .create-start-card-select {
          min-height: 48px !important;
          margin-top: 0 !important;
          padding-top: 18px !important;
          border-top: 1px solid rgba(7, 20, 43, 0.15) !important;
        }

        .create-start-page .create-start-card-select-copy {
          display: flex !important;
          align-items: baseline !important;
          gap: 12px !important;
        }

        .create-start-page .create-start-card-select-copy b {
          color: rgba(7, 20, 43, 0.78) !important;
          font-size: 11px !important;
          line-height: 1 !important;
          font-weight: 600 !important;
          letter-spacing: 0.04em !important;
        }

        .create-start-page .create-start-card-select i {
          color: rgba(7, 20, 43, 0.86) !important;
          font-size: 19px !important;
          font-style: normal !important;
          line-height: 1 !important;
          transition: transform 260ms ease !important;
        }

        .create-start-page .create-start-card:hover .create-start-card-select i {
          transform: translateX(4px) !important;
        }

        @media (min-width: 1181px) and (max-height: 820px) {
          .create-start-page .create-start-options {
            padding-top: 120px !important;
            padding-bottom: 36px !important;
            gap: 18px !important;
          }

          .create-start-page .create-start-card-grid {
            height: min(56vh, 500px) !important;
            min-height: 410px !important;
          }

          .create-start-page .create-start-card {
            padding: 28px !important;
          }

          .create-start-page .create-start-card h2 {
            font-size: clamp(70px, 5.2vw, 94px) !important;
          }

          .create-start-page .create-start-card p {
            font-size: clamp(10px, 0.72vw, 12px) !important;
          }

          .create-start-page .create-start-card-copy {
            padding: 24px 0 26px !important;
          }

          .create-start-page .create-start-card-copy-rule {
            margin: 22px 0 17px !important;
          }
        }

        .create-detail-page .create-detail-back {
          position: absolute !important;
          top: calc(86px + var(--detail-back-block)) !important;
          left: var(--detail-back-inline) !important;
          z-index: 2 !important;
        }

        .create-detail-page .create-detail-workspace {
          position: relative !important;
          display: flex !important;
          min-height: 100vh !important;
          padding: 140px clamp(42px, 4.1vw, 78px) 54px !important;
          flex-direction: column !important;
          background: var(--tempy-soft-blue) !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        .create-detail-page .create-detail-workspace::before {
          content: none !important;
        }

        .create-detail-page .create-detail-workspace::after {
          content: none !important;
        }

        .create-detail-page .create-detail-content {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          min-height: calc(100vh - 194px) !important;
          flex-direction: column !important;
        }

        .create-detail-page .create-detail-header h2 {
          margin: 0 !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(52px, 3.7vw, 74px) !important;
          line-height: 0.88 !important;
          font-weight: 400 !important;
          letter-spacing: -0.03em !important;
        }

        .create-detail-page .create-detail-header h2::before {
          content: none !important;
        }

        .create-detail-page .create-detail-header p {
          max-width: 680px !important;
          margin: 16px 0 0 !important;
          color: rgba(7, 20, 43, 0.72) !important;
          font-size: clamp(15px, 0.95vw, 18px) !important;
          line-height: 1.6 !important;
          font-weight: 500 !important;
          letter-spacing: -0.01em !important;
          word-break: keep-all !important;
        }

        .create-detail-page .create-detail-grid {
          display: grid !important;
          margin-top: 38px !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          gap: clamp(16px, 1.25vw, 24px) !important;
          align-items: stretch !important;
        }

        .create-detail-page .create-detail-grid--playlist {
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.08fr) minmax(0, 1.14fr) !important;
        }

        .create-detail-page .create-detail-card {
          position: relative !important;
          display: flex !important;
          min-height: 440px !important;
          padding: clamp(26px, 1.7vw, 34px) !important;
          flex-direction: column !important;
          background: var(--tempy-cream) !important;
          color: var(--tempy-navy) !important;
          border: 1px solid rgba(7, 20, 43, 0.16) !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(7, 20, 43, 0.035) !important;
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
          margin: 0 0 28px !important;
          color: var(--tempy-navy) !important;
          font-family: "GalgoVF", "Arial Narrow", sans-serif !important;
          font-size: clamp(32px, 2.15vw, 42px) !important;
          line-height: 0.92 !important;
          font-weight: 400 !important;
          letter-spacing: -0.02em !important;
        }

        .create-detail-page .create-detail-cover {
          position: relative !important;
          display: grid !important;
          width: 100% !important;
          aspect-ratio: 1 / 1 !important;
          min-height: 210px !important;
          place-items: center !important;
          border: 1px solid rgba(7, 20, 43, 0.14) !important;
          background: #edf2f4 !important;
          color: rgba(7, 20, 43, 0.52) !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          overflow: hidden !important;
          appearance: none !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-cover::after {
          content: none !important;
        }

        .create-detail-page .create-detail-cover-empty {
          display: flex !important;
          align-items: center !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .create-detail-page .create-detail-cover-empty strong {
          color: rgba(7, 20, 43, 0.5) !important;
          font-size: 26px !important;
          line-height: 1 !important;
          font-weight: 400 !important;
        }

        .create-detail-page .create-detail-cover-empty small {
          color: rgba(7, 20, 43, 0.52) !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
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
          min-height: 46px !important;
          padding: 0 24px !important;
          align-items: center !important;
          justify-content: center !important;
          border: 1px solid var(--tempy-navy) !important;
          border-radius: 4px !important;
          background: var(--tempy-navy) !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: -0.01em !important;
          box-shadow: none !important;
          cursor: pointer !important;
          transition: transform 180ms ease, background-color 180ms ease, color 180ms ease !important;
        }

        .create-detail-page .create-detail-cover-button:hover,
        .create-detail-page .create-detail-action:hover,
        .create-detail-page .create-detail-secondary-action:hover {
          transform: translate3d(0, -1px, 0) !important;
          background: var(--tempy-blue) !important;
          border-color: var(--tempy-blue) !important;
          color: #ffffff !important;
        }

        .create-detail-page .create-detail-cover-button {
          width: fit-content !important;
          margin-top: 16px !important;
          border-color: rgba(7, 20, 43, 0.26) !important;
          background: transparent !important;
          color: var(--tempy-navy) !important;
        }

        .create-detail-page .create-detail-cover-button:hover {
          color: #ffffff !important;
        }

        .create-detail-page .create-detail-field {
          display: flex !important;
          margin-bottom: 22px !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .create-detail-page .create-detail-field label,
        .create-detail-page .create-detail-label {
          color: var(--tempy-navy) !important;
          font-size: 12px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          letter-spacing: 0 !important;
        }

        .create-detail-page .create-detail-label--spaced {
          display: block !important;
          margin-top: 28px !important;
        }

        .create-detail-page .create-detail-field input,
        .create-detail-page .create-detail-field textarea,
        .create-detail-page .create-detail-search,
        .create-tag-add input {
          width: 100% !important;
          border: 1px solid rgba(7, 20, 43, 0.24) !important;
          border-radius: 4px !important;
          background: var(--tempy-white) !important;
          color: var(--tempy-navy) !important;
          font-family: "Pretendard", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          letter-spacing: -0.01em !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .create-detail-page .create-detail-field input,
        .create-detail-page .create-detail-search,
        .create-tag-add input {
          height: 48px !important;
          padding: 0 16px !important;
        }

        .create-detail-page .create-detail-field textarea {
          min-height: 164px !important;
          padding: 15px 16px !important;
          resize: none !important;
          background: var(--tempy-white) !important;
          line-height: 1.65 !important;
        }

        .create-detail-page .create-detail-field input:focus,
        .create-detail-page .create-detail-field textarea:focus,
        .create-detail-page .create-detail-search:focus,
        .create-tag-add input:focus {
          border-color: var(--tempy-blue) !important;
          box-shadow: 0 0 0 3px rgba(47, 91, 234, 0.09) !important;
        }

        .create-detail-page .create-detail-tags,
        .create-detail-page .create-detail-visibility,
        .create-detail-page .create-detail-stamps {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 9px !important;
        }

        .create-detail-page .create-detail-pill {
          display: inline-flex !important;
          min-height: 34px !important;
          padding: 0 13px !important;
          align-items: center !important;
          border: 1px solid rgba(7, 20, 43, 0.24) !important;
          border-radius: 999px !important;
          background: var(--tempy-white) !important;
          color: var(--tempy-navy) !important;
          font-size: 12px !important;
          font-weight: 650 !important;
          letter-spacing: -0.01em !important;
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
          border-radius: 4px !important;
          background: var(--tempy-navy) !important;
          color: #ffffff !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
        }

        .create-detail-page .create-detail-stamps {
          margin-top: 12px !important;
          padding-top: 0 !important;
        }

        .create-detail-page .create-detail-track-list {
          display: grid !important;
          margin-top: 16px !important;
          gap: 9px !important;
        }

        .create-detail-page .create-detail-track {
          display: grid !important;
          min-height: 60px !important;
          padding: 8px 12px !important;
          grid-template-columns: 42px 1fr auto !important;
          gap: 13px !important;
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
          width: 42px !important;
          height: 42px !important;
          border: 1px solid rgba(7, 20, 43, 0.08) !important;
          background: #e5edf4 !important;
        }

        .create-detail-page .create-detail-track--active {
          border-color: var(--tempy-blue) !important;
          background: rgba(47, 91, 234, 0.1) !important;
        }

        .create-detail-page .create-detail-track strong {
          overflow: hidden !important;
          color: var(--tempy-navy) !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          letter-spacing: -0.01em !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .create-detail-page .create-detail-track span {
          color: rgba(7, 20, 43, 0.6) !important;
          font-size: 12px !important;
          font-weight: 600 !important;
        }

        .create-detail-page .create-detail-actions {
          position: relative !important;
          z-index: 1 !important;
          display: flex !important;
          margin-top: auto !important;
          padding-top: 32px !important;
          justify-content: flex-end !important;
          gap: 12px !important;
        }

        .create-detail-page .create-detail-secondary-action {
          border-color: rgba(7, 20, 43, 0.28) !important;
          background: transparent !important;
          color: var(--tempy-navy) !important;
        }

        .create-detail-page .create-detail-secondary-action:hover {
          border-color: var(--tempy-navy) !important;
          background: var(--tempy-navy) !important;
          color: #ffffff !important;
        }

        @media (min-width: 1181px) {
          .create-detail-page--moment .create-detail-shell {
            min-height: 100vh !important;
            padding-top: 86px !important;
          }

          .create-detail-page--moment .create-detail-side {
            min-height: calc(100vh - 86px) !important;
            padding: var(--detail-back-block) var(--detail-back-inline) 38px !important;
            justify-content: flex-start !important;
          }

          .create-detail-page--moment .create-detail-back {
            position: static !important;
          }

          .create-detail-page--moment .create-detail-side-copy {
            width: 100% !important;
            margin: auto 0 !important;
          }

          .create-detail-page--moment .create-detail-side h1 {
            font-size: var(--page-display-size) !important;
            line-height: var(--page-display-line-height) !important;
            letter-spacing: var(--page-display-letter-spacing) !important;
          }

          .create-detail-page--moment .create-detail-description {
            margin-top: 18px !important;
            font-size: var(--page-description-size) !important;
            line-height: var(--page-description-line-height) !important;
          }

          .create-detail-page--moment .create-detail-workspace {
            height: calc(100vh - 86px) !important;
            min-height: calc(100vh - 86px) !important;
            padding: 0 var(--split-panel-inline) !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .create-detail-page--moment .create-detail-content {
            display: grid !important;
            height: 100% !important;
            min-height: 100% !important;
            grid-template-rows: minmax(0, 1fr) auto !important;
          }

          .create-detail-page--moment .create-detail-main {
            display: grid !important;
            min-width: 0 !important;
            min-height: 0 !important;
            padding: var(--detail-back-block) 0 38px !important;
            align-content: safe center !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .create-detail-page--moment .create-detail-header h2 {
            font-size: clamp(86px, 5vw, 96px) !important;
            line-height: 0.84 !important;
          }

          .create-detail-page--moment .create-detail-header p {
            margin-top: 10px !important;
            font-size: 17px !important;
            line-height: 1.6 !important;
          }

          .create-detail-page--moment .create-detail-grid {
            height: 640px !important;
            margin-top: 28px !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: clamp(16px, 1.25vw, 24px) !important;
            align-items: stretch !important;
          }

          .create-detail-page--moment .create-detail-card {
            width: 100% !important;
            height: 640px !important;
            min-width: 0 !important;
            min-height: 0 !important;
            padding: clamp(30px, 1.9vw, 36px) !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .create-detail-page--moment .create-detail-card h3 {
            margin-bottom: 38px !important;
            font-size: clamp(44px, 2.9vw, 56px) !important;
            line-height: 0.88 !important;
            letter-spacing: var(--galgo-display-spacing) !important;
            white-space: nowrap !important;
          }

          .create-detail-page--moment .create-detail-cover-flow {
            display: flex !important;
            width: 100% !important;
            align-self: flex-start !important;
            flex-direction: column !important;
          }

          .create-detail-page--moment .create-detail-card:first-child .create-detail-cover {
            width: 100% !important;
            height: clamp(340px, 36vh, 390px) !important;
            min-height: 0 !important;
            aspect-ratio: auto !important;
            flex: 0 0 auto !important;
          }

          .create-detail-page--moment .create-detail-card:first-child .create-detail-cover-button {
            min-height: 50px !important;
            margin-top: 20px !important;
            padding: 0 26px !important;
            font-size: 14px !important;
          }

          .create-detail-page--moment .create-detail-cover-empty {
            gap: 12px !important;
          }

          .create-detail-page--moment .create-detail-cover-empty strong {
            font-size: 32px !important;
          }

          .create-detail-page--moment .create-detail-cover-empty small {
            font-size: 12px !important;
          }

          .create-detail-page--moment .create-detail-field {
            margin-bottom: 28px !important;
            gap: 12px !important;
          }

          .create-detail-page--moment .create-detail-field label,
          .create-detail-page--moment .create-detail-label {
            font-size: 14px !important;
            line-height: 1.2 !important;
          }

          .create-detail-page--moment .create-detail-label--spaced {
            margin-top: 38px !important;
          }

          .create-detail-page--moment .create-detail-tags,
          .create-detail-page--moment .create-detail-visibility,
          .create-detail-page--moment .create-detail-stamps {
            gap: 10px !important;
          }

          .create-detail-page--moment .create-detail-tags,
          .create-detail-page--moment .create-detail-visibility {
            margin-top: 14px !important;
          }

          .create-detail-page--moment .create-detail-stamps {
            margin-top: 16px !important;
          }

          .create-detail-page--moment .create-detail-pill {
            min-height: 42px !important;
            padding: 0 17px !important;
            font-size: 14px !important;
          }

          .create-detail-page--moment .create-detail-field textarea {
            min-height: 190px !important;
            padding: 17px 18px !important;
            font-size: 16px !important;
          }

          .create-detail-page--moment .create-tag-add {
            margin-top: 12px !important;
            gap: 10px !important;
          }

          .create-detail-page--moment .create-tag-add input {
            height: 50px !important;
            padding: 0 18px !important;
            font-size: 16px !important;
          }

          .create-detail-page--moment .create-tag-add button {
            min-height: 50px !important;
            padding: 0 18px !important;
            font-size: 13px !important;
          }

          .create-detail-page--moment .create-detail-actions {
            min-height: 128px !important;
            margin: 0 calc(var(--split-panel-inline) * -1) !important;
            padding: 28px var(--split-panel-inline) !important;
            flex: 0 0 auto !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 12px !important;
            background: var(--tempy-blue) !important;
          }

          .create-detail-page--moment .create-detail-actions button {
            width: 136px !important;
            min-height: 56px !important;
            padding: 0 28px !important;
            border-radius: 0 !important;
            font-size: 14px !important;
          }

          .create-detail-page--moment .create-detail-secondary-action {
            border-color: rgba(255, 255, 255, 0.72) !important;
            background: transparent !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment .create-detail-action {
            border-color: var(--tempy-navy) !important;
            background: var(--tempy-navy) !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment .create-detail-secondary-action:hover {
            border-color: #ffffff !important;
            background: rgba(255, 255, 255, 0.12) !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment .create-detail-action:hover {
            border-color: #10264a !important;
            background: #10264a !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment-result .create-detail-workspace {
            height: 100vh !important;
            min-height: 100vh !important;
            padding: 140px var(--split-panel-inline) 0 !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .create-detail-page--moment-result .create-detail-content {
            display: grid !important;
            height: 100% !important;
            min-height: 100% !important;
            grid-template-rows: minmax(0, 1fr) auto !important;
          }

          .create-detail-page--moment-result .create-result-stage {
            display: grid !important;
            min-width: 0 !important;
            min-height: 0 !important;
            padding: 70px 0 138px !important;
            align-content: safe center !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }

          .create-detail-page--moment-result .create-detail-header h2 {
            font-size: clamp(86px, 5vw, 96px) !important;
            line-height: 0.84 !important;
          }

          .create-detail-page--moment-result .create-detail-header p {
            margin-top: 10px !important;
            font-size: 17px !important;
            line-height: 1.6 !important;
          }

          .create-detail-page--moment-result .create-result-preview {
            width: min(1020px, 100%) !important;
            margin-top: 30px !important;
            grid-template-columns: minmax(0, 0.46fr) minmax(0, 0.54fr) !important;
          }

          .create-detail-page--moment-result .create-result-cover {
            min-height: 420px !important;
          }

          .create-detail-page--moment-result .create-result-body {
            padding: 44px !important;
          }

          .create-detail-page--moment-result .create-result-kicker {
            font-size: 13px !important;
          }

          .create-detail-page--moment-result .create-result-body h3 {
            margin-top: 20px !important;
            font-size: clamp(48px, 3.5vw, 72px) !important;
          }

          .create-detail-page--moment-result .create-result-body p {
            margin-top: 24px !important;
            font-size: 18px !important;
          }

          .create-detail-page--moment-result .create-result-meta,
          .create-detail-page--moment-result .create-result-tags {
            gap: 10px !important;
          }

          .create-detail-page--moment-result .create-result-meta {
            margin-top: 28px !important;
          }

          .create-detail-page--moment-result .create-result-tags {
            padding-top: 26px !important;
          }

          .create-detail-page--moment-result .create-detail-pill {
            min-height: 36px !important;
            padding: 0 14px !important;
            font-size: 13px !important;
          }

          .create-detail-page--moment-result .create-detail-actions {
            min-height: 128px !important;
            margin: 0 calc(var(--split-panel-inline) * -1) !important;
            padding: 28px var(--split-panel-inline) !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 12px !important;
            background: var(--tempy-blue) !important;
          }

          .create-detail-page--moment-result .create-detail-actions button {
            min-width: 136px !important;
            min-height: 56px !important;
            padding: 0 28px !important;
            border-radius: 0 !important;
            font-size: 14px !important;
          }

          .create-detail-page--moment-result .create-detail-secondary-action {
            border-color: rgba(255, 255, 255, 0.72) !important;
            background: transparent !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment-result .create-detail-action {
            border-color: var(--tempy-navy) !important;
            background: var(--tempy-navy) !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment-result .create-detail-secondary-action:hover {
            border-color: #ffffff !important;
            background: rgba(255, 255, 255, 0.12) !important;
            color: #ffffff !important;
          }

          .create-detail-page--moment-result .create-detail-action:hover {
            border-color: #10264a !important;
            background: #10264a !important;
            color: #ffffff !important;
          }
        }

        .create-track-caption {
          margin: 14px 0 0 !important;
          color: rgba(7, 20, 43, 0.66) !important;
          font-size: 13px !important;
          font-weight: 650 !important;
          letter-spacing: -0.01em !important;
        }

        .create-result-preview {
          display: grid !important;
          width: min(820px, 100%) !important;
          margin-top: 38px !important;
          grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.1fr) !important;
          background: var(--tempy-cream) !important;
          border: 1px solid rgba(7, 20, 43, 0.16) !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 8px rgba(7, 20, 43, 0.035) !important;
          overflow: hidden !important;
        }

        .create-result-cover {
          display: grid !important;
          min-height: 380px !important;
          place-items: center !important;
          border-right: 1px solid rgba(7, 20, 43, 0.1) !important;
          background: #edf2f4 !important;
          color: rgba(7, 20, 43, 0.52) !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          overflow: hidden !important;
        }

        .create-result-body {
          display: flex !important;
          min-width: 0 !important;
          padding: 38px !important;
          flex-direction: column !important;
        }

        .create-result-kicker {
          color: rgba(7, 20, 43, 0.62) !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          letter-spacing: 0.02em !important;
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
          font-weight: 500 !important;
          letter-spacing: -0.01em !important;
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
          min-height: 60px !important;
          padding: 8px 12px !important;
          grid-template-columns: 42px 1fr auto !important;
          gap: 13px !important;
          align-items: center !important;
          background: #ffffff !important;
          border: 1px solid rgba(7, 20, 43, 0.1) !important;
        }

        .create-result-track strong {
          overflow: hidden !important;
          color: var(--tempy-navy) !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          letter-spacing: -0.01em !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        .create-result-track span:last-child {
          color: rgba(7, 20, 43, 0.6) !important;
          font-size: 12px !important;
          font-weight: 600 !important;
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
          border-radius: 4px !important;
          box-shadow: 0 12px 28px rgba(7, 20, 43, 0.12) !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          letter-spacing: -0.01em !important;
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

          .create-start-page .create-start-card-grid {
            height: min(54vw, 590px) !important;
            min-height: 500px !important;
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

          .create-detail-page .create-detail-content {
            min-height: 0 !important;
          }

          .create-detail-page .create-detail-card {
            min-height: auto !important;
          }

          .create-detail-page .create-detail-cover {
            width: min(100%, 420px) !important;
          }

          .create-start-page .create-start-intro-copy {
            transform: none !important;
          }

          .create-start-page .create-start-description {
            width: auto !important;
            max-width: 100% !important;
            white-space: normal !important;
          }

        }

        @media (max-width: 820px) {
          .create-start-page .create-start-options {
            padding: 44px 20px 78px !important;
            gap: 22px !important;
          }

          .create-start-page .create-start-intro {
            padding: 112px 20px 48px !important;
          }

          .create-start-page .create-start-intro h1 {
            font-size: clamp(58px, 16vw, 82px) !important;
          }

          .create-start-page .create-start-description {
            font-size: 16px !important;
          }

          .create-start-page .create-start-card-grid {
            height: auto !important;
            min-height: 0 !important;
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .create-start-page .create-start-card {
            min-height: 430px !important;
            padding: 28px !important;
            grid-template-rows: auto minmax(118px, 1fr) auto !important;
          }

          .create-start-page .create-start-card h2 {
            font-size: clamp(72px, 18vw, 94px) !important;
          }

          .create-start-page .create-start-card p {
            font-size: clamp(11px, 3vw, 14px) !important;
          }

          .create-start-page .create-start-card-select-copy b {
            font-size: 10px !important;
          }

          .create-detail-page .create-detail-side {
            padding: 112px 20px 48px !important;
          }

          .create-detail-page .create-detail-workspace {
            padding: 48px 20px 78px !important;
          }

          .create-detail-page .create-detail-actions {
            align-items: stretch !important;
            flex-direction: column !important;
          }

          .create-detail-page .create-detail-actions button {
            width: 100% !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .create-start-page .create-start-card,
          .create-start-page .create-start-card-select i {
            transition-duration: 1ms !important;
          }

          .create-start-page .create-start-card:hover,
          .create-start-page .create-start-card:hover .create-start-card-select i {
            transform: none !important;
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
          <div className="create-start-intro-copy">
            <p className="create-start-eyebrow discover-page__eyebrow">CREATE</p>
            <h1>Create Moment</h1>
            <p className="create-start-description">
              지금 듣는 노래와 나의 순간을 나만의 방식으로 남겨 보세요.
            </p>
          </div>
        </aside>

        <section className="create-start-options" aria-label="Create options">
          <header className="create-start-options-head" aria-hidden="true">
            <span>CHOOSE YOUR SHAPE</span>
            <span>01 — 02</span>
          </header>

          <div className="create-start-card-grid">
            <button className="create-start-card" type="button" onClick={() => onSelect("moment")}>
              <span className="create-start-card-topline">
                <strong>01</strong>
                <small>ONE TRACK MOMENT</small>
              </span>
              <span className="create-start-card-copy">
                <h2>Moment Card</h2>
                <span className="create-start-card-copy-rule" aria-hidden="true" />
                <p>지금의 시간 · 날씨 · 위치를 담아 1곡짜리 순간 큐레이션을 남겨요</p>
              </span>
              <span className="create-start-card-select" aria-hidden="true">
                <span className="create-start-card-select-copy">
                  <small>SELECT</small>
                  <b>CREATE A MOMENT</b>
                </span>
                <i>→</i>
              </span>
            </button>

            <button className="create-start-card" type="button" onClick={() => onSelect("playlist")}>
              <span className="create-start-card-topline">
                <strong>02</strong>
                <small>MULTI TRACK STORY</small>
              </span>
              <span className="create-start-card-copy">
                <h2>Playlist</h2>
                <span className="create-start-card-copy-rule" aria-hidden="true" />
                <p>여러 곡을 하나의 순간 맥락으로 묶어 공유해보세요</p>
              </span>
              <span className="create-start-card-select" aria-hidden="true">
                <span className="create-start-card-select-copy">
                  <small>SELECT</small>
                  <b>BUILD A PLAYLIST</b>
                </span>
                <i>→</i>
              </span>
            </button>
          </div>

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
    <main className={`create-detail-page${isMoment ? " create-detail-page--moment" : ""}`}>
      <section className="create-detail-shell">
        <aside className="create-detail-side">
          <button className="create-detail-back detail-back-link" type="button" onClick={onBack} aria-label="선택 화면으로 돌아가기">
            <span aria-hidden="true">←</span>
            <span>BACK</span>
          </button>
          <div className="create-detail-side-copy">
            <p className={isMoment ? "discover-page__eyebrow" : "create-detail-eyebrow"}>CREATE STATION</p>
            <h1>{isMoment ? "Moment Card" : "Playlist"}</h1>
            <p className="create-detail-description">
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
          </div>
        </aside>

        <section className="create-detail-workspace" aria-label={isMoment ? "Moment Card 작성" : "Playlist 작성"}>
          <div className="create-detail-content">
            <div className="create-detail-main">
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
            </div>

            <footer className="create-detail-actions">
              <button className="create-detail-secondary-action" type="button" onClick={onSaveDraft}>임시저장</button>
              <button className="create-detail-action" type="button" onClick={onCreate}>만들기</button>
            </footer>
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
        {image ? (
          <img src={image} alt="선택한 커버 미리보기" />
        ) : (
          <span className="create-detail-cover-empty" aria-hidden="true">
            <strong>+</strong>
            <small>ADD COVER IMAGE</small>
          </span>
        )}
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
        <div className="create-detail-cover-flow">
          <CoverPicker image={data.coverImage} onChange={(coverImage) => update({ coverImage })} />
        </div>
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
        <span className="create-detail-label create-detail-label--spaced">자동 기록</span>
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
        <h3>01 Cover</h3>
        <CoverPicker image={data.coverImage} onChange={(coverImage) => update({ coverImage })} />
      </article>

      <article className="create-detail-card">
        <h3>02 Playlist Info</h3>
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
        <span className="create-detail-label create-detail-label--spaced">공개 범위</span>
        <VisibilityPicker value={data.visibility} onChange={(visibility) => update({ visibility })} />
      </article>

      <article className="create-detail-card">
        <h3>03 Tracks</h3>
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
    <main className={`create-detail-page${isMoment ? " create-detail-page--moment-result" : ""}`}>
      <section className="create-detail-shell">
        <aside className="create-detail-side">
          <button className="create-detail-back detail-back-link" type="button" onClick={onRetry} aria-label="작성 화면으로 돌아가기">
            <span aria-hidden="true">←</span>
            <span>BACK</span>
          </button>
          <p className="create-detail-eyebrow">CREATE RESULT</p>
          <h1>{isMoment ? "Moment Card" : "Playlist"}</h1>
          <p className="create-detail-description">
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
            <div className="create-result-stage">
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
            </div>

            <footer className="create-detail-actions">
              <button className="create-detail-secondary-action" type="button" onClick={onRetry}>다시 만들기</button>
              <button className="create-detail-action" type="button" onClick={onBackToCreate}>Create로 돌아가기</button>
              <button className="create-detail-action" type="button" onClick={onViewArchive}>Archive에서 보기</button>
            </footer>
          </div>
        </section>
      </section>
    </main>
  );
}

function ResultCover({ image }) {
  return (
    <div className={`create-result-cover${image ? " create-result-cover--filled" : ""}`}>
      {image ? <img src={image} alt="생성된 커버" /> : <span>NO COVER IMAGE</span>}
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
