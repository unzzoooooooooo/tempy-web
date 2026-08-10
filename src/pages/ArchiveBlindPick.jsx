import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getTracksByIds } from "../data/musicCatalog";

const LOOP_COUNT = 5;
const MIDDLE_LOOP_INDEX = Math.floor(LOOP_COUNT / 2);
const POSITION_LERP = 0.12;
const SCALE_LERP = 0.22;
const HINT_LERP = 0.55;
const REVEAL_STAGGER = 38;
const REVEAL_DURATION = 820;

const blindPickPresentation = [
  { color: "cream", meta: "23:42 · Rain", hintMeta: "23:42 · Rain", hintText: "비 오는 밤, 조용히 나를 선명하게 만드는 노래" },
  { color: "blue", meta: "19:12 · Cloud", hintMeta: "Dusk · Cloud", hintText: "하루의 끝에서 마음의 색을 천천히 바꾸는 리듬" },
  { color: "navy", meta: "00:08 · Fog", hintMeta: "00:08 · Fog", hintText: "말수가 줄어드는 새벽에 감정의 윤곽을 남기는 사운드" },
  { color: "red", meta: "17:35 · Clear", hintMeta: "17:35 · Clear", hintText: "선명한 공기 속에서 발걸음을 조금 더 대담하게 만드는 박자" },
  { color: "sky", meta: "21:46 · Wind", hintMeta: "Night Drive · Wind", hintText: "창밖의 불빛이 길게 번질 때 속도를 올려주는 무드" },
  { color: "cream", meta: "08:20 · Sun", hintMeta: "08:20 · Sun", hintText: "가벼운 햇빛 아래 오늘을 조금 부드럽게 시작하는 노래" },
  { color: "blue", meta: "14:09 · Clear", hintMeta: "Afternoon · Clear", hintText: "낯선 동네를 지나며 생각보다 멀리 가고 싶어지는 리듬" },
  { color: "navy", meta: "11:17 · Cloud", hintMeta: "Late Morning · Soft", hintText: "흐린 마음을 가볍게 뒤집어 작은 농담처럼 띄우는 사운드" },
  { color: "red", meta: "02:32 · Rain", hintMeta: "02:32 · Rain", hintText: "잠들지 않는 거리에서 감정을 더 진하게 새기는 비트" },
  { color: "sky", meta: "22:10 · Rain", hintMeta: "Late Night · Soft", hintText: "혼자 걷는 길에 속도를 조금 늦춰주는 리듬" },
];

const baseBlindPickItems = getTracksByIds([
  "mood",
  "disco-room",
  "mamas-boy",
  "soft-static",
  "rich-man",
  "citrus-glow",
  "you-and-me",
  "toxic-till-the-end",
  "wait",
  "traveler",
]).map((track, index) => ({ ...blindPickPresentation[index], ...track }));

function ArchiveBlindPick() {
  const navigate = useNavigate();
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const barRefs = useRef([]);
  const setWidthRef = useRef(0);
  const middleStartRef = useRef(0);
  const barSizeRef = useRef(160);
  const currentPositionRef = useRef(0);
  const targetPositionRef = useRef(0);
  const pointerXRef = useRef(null);
  const pointerActiveRef = useRef(false);
  const hoveredBarRef = useRef(null);
  const hoveredRenderIndexRef = useRef(null);
  const hintRef = useRef(null);
  const hintXRef = useRef(typeof window === "undefined" ? 0 : window.innerWidth / 2);
  const targetHintXRef = useRef(typeof window === "undefined" ? 0 : window.innerWidth / 2);
  const hintVisibleRef = useRef(false);
  const currentScalesRef = useRef([]);
  const targetScalesRef = useRef([]);
  const isRevealedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const closingTimeoutRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hoverHint, setHoverHint] = useState({
    visible: false,
    meta: "",
    text: "",
  });

  const loopItems = useMemo(() => (
    Array.from({ length: LOOP_COUNT }, (_, loopIndex) => (
      baseBlindPickItems.map((item, itemIndex) => ({
        ...item,
        itemIndex,
        renderIndex: loopIndex * baseBlindPickItems.length + itemIndex,
        loopKey: `${loopIndex}-${item.id}`,
      }))
    )).flat()
  ), []);

  const selectedItem = loopItems.find((item) => item.loopKey === selectedId);

  const applyOffset = useCallback((offset) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
  }, []);

  const applyScale = useCallback((renderIndex, scale) => {
    const bar = barRefs.current[renderIndex];
    if (!bar) return;
    bar.style.setProperty("--hover-scale", scale);
  }, []);

  const resetBarScales = useCallback(() => {
    currentScalesRef.current = loopItems.map(() => 1);
    targetScalesRef.current = loopItems.map(() => 1);
    loopItems.forEach((item) => applyScale(item.renderIndex, 1));
  }, [applyScale, loopItems]);

  const updateHintPosition = useCallback((immediate = false) => {
    const bar = hoveredBarRef.current;
    const hint = hintRef.current;
    if (!bar || !hint) return true;

    const rect = bar.getBoundingClientRect();
    targetHintXRef.current = rect.left + (rect.width / 2);

    if (immediate) {
      hintXRef.current = targetHintXRef.current;
    } else {
      hintXRef.current += (targetHintXRef.current - hintXRef.current) * HINT_LERP;
    }

    hint.style.setProperty("--hint-x", `${hintXRef.current}px`);
    return Math.abs(targetHintXRef.current - hintXRef.current) < 0.25;
  }, []);

  const updateHoverHint = useCallback((bar) => {
    if (!bar) {
      hintVisibleRef.current = false;
      hoveredRenderIndexRef.current = null;
      setHoverHint((current) => (current.visible ? { ...current, visible: false } : current));
      return;
    }

    const renderIndex = Number(bar.dataset.renderIndex);
    const item = loopItems[renderIndex];
    if (!item) return;
    if (
      hintVisibleRef.current
      && hoveredRenderIndexRef.current === renderIndex
    ) {
      return;
    }

    hintVisibleRef.current = true;
    hoveredRenderIndexRef.current = renderIndex;
    flushSync(() => {
      setHoverHint((current) => {
        if (
          current.visible
          && current.meta === item.hintMeta
          && current.text === item.hintText
        ) {
          return current;
        }

        return {
          visible: true,
          meta: item.hintMeta,
          text: item.hintText,
        };
      });
    });
  }, [loopItems]);

  const updateRevealDelays = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;

    const viewportWidth = window.innerWidth;
    const bars = Array.from(track.querySelectorAll(".archive-blind-page__bar"));
    const positionedBars = bars.map((bar) => ({
      bar,
      rect: bar.getBoundingClientRect(),
    }));

    const visibleBars = positionedBars
      .filter(({ rect }) => rect.right > 0 && rect.left < viewportWidth)
      .sort((a, b) => a.rect.left - b.rect.left);
    const rightSideBars = positionedBars
      .filter(({ rect }) => rect.left >= viewportWidth)
      .sort((a, b) => a.rect.left - b.rect.left);
    const leftSideBars = positionedBars
      .filter(({ rect }) => rect.right <= 0)
      .sort((a, b) => a.rect.left - b.rect.left);

    [...visibleBars, ...rightSideBars, ...leftSideBars].forEach(({ bar }, index) => {
      bar.style.setProperty("--reveal-delay", `${index * REVEAL_STAGGER}ms`);
    });

    return visibleBars.length;
  }, []);

  const measureAndCenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return false;

    const firstItem = track.children[0];
    const nextSetItem = track.children[baseBlindPickItems.length];
    const middleSetItem = track.children[baseBlindPickItems.length * MIDDLE_LOOP_INDEX];
    if (!firstItem || !nextSetItem || !middleSetItem) return false;

    const measuredBarSize = firstItem.offsetWidth || 160;
    const measuredSetWidth = nextSetItem.offsetLeft - firstItem.offsetLeft;
    const setWidth = measuredSetWidth > 0
      ? measuredSetWidth
      : measuredBarSize * baseBlindPickItems.length;
    const middleStart = middleSetItem.offsetLeft || setWidth * MIDDLE_LOOP_INDEX;

    setWidthRef.current = setWidth;
    barSizeRef.current = measuredBarSize;
    middleStartRef.current = middleStart;
    currentPositionRef.current = middleStartRef.current;
    targetPositionRef.current = middleStartRef.current;
    currentScalesRef.current = loopItems.map(() => 1);
    targetScalesRef.current = loopItems.map(() => 1);
    applyOffset(currentPositionRef.current);
    resetBarScales();
    return true;
  }, [applyOffset, loopItems, resetBarScales]);

  function normalizePosition() {
    const setWidth = setWidthRef.current;
    if (setWidth === 0) return;

    const lowerBound = setWidth;
    const upperBound = setWidth * (LOOP_COUNT - 2);

    while (currentPositionRef.current < lowerBound) {
      currentPositionRef.current += setWidth;
      targetPositionRef.current += setWidth;
    }

    while (currentPositionRef.current > upperBound) {
      currentPositionRef.current -= setWidth;
      targetPositionRef.current -= setWidth;
    }
  }

  function updateBarScales() {
    if (isRevealedRef.current) return true;

    const pointerX = pointerXRef.current;
    const pointerActive = pointerActiveRef.current;
    const barSize = barSizeRef.current || 160;
    const influenceRadius = barSize * 2.6;
    let isSettled = true;

    loopItems.forEach((item) => {
      const centerX = item.renderIndex * barSize + (barSize / 2) - currentPositionRef.current;
      const distance = !pointerActive || pointerX === null ? Infinity : Math.abs(pointerX - centerX);
      const influence = Math.max(0, 1 - (distance / influenceRadius));
      const targetScale = !pointerActive || pointerX === null ? 1 : 1 + (1.05 * influence);
      const currentScale = currentScalesRef.current[item.renderIndex] ?? 1;
      const nextScale = currentScale + ((targetScale - currentScale) * SCALE_LERP);

      targetScalesRef.current[item.renderIndex] = targetScale;
      currentScalesRef.current[item.renderIndex] = nextScale;
      applyScale(item.renderIndex, Number(nextScale.toFixed(4)));

      if (Math.abs(targetScale - nextScale) > 0.002) {
        isSettled = false;
      }
    });

    return isSettled;
  }

  function animateInteraction() {
    currentPositionRef.current += (targetPositionRef.current - currentPositionRef.current) * POSITION_LERP;
    normalizePosition();
    applyOffset(currentPositionRef.current);

    const scalesSettled = updateBarScales();
    const hintSettled = pointerActiveRef.current && hoveredBarRef.current
      ? updateHintPosition()
      : true;
    const positionSettled = Math.abs(targetPositionRef.current - currentPositionRef.current) < 0.01;

    if (positionSettled && scalesSettled && hintSettled) {
      animationFrameRef.current = null;
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(animateInteraction);
  }

  function startAnimation() {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(animateInteraction);
  }

  useLayoutEffect(() => {
    isRevealedRef.current = isRevealed;
    if (isRevealed) {
      resetBarScales();
    }
  }, [isRevealed, resetBarScales]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    pointerActiveRef.current = false;
    hoveredBarRef.current = null;
    hoveredRenderIndexRef.current = null;
    pointerXRef.current = null;
    hintVisibleRef.current = false;
    hintXRef.current = window.innerWidth / 2;
    targetHintXRef.current = window.innerWidth / 2;
    hintRef.current?.style.setProperty("--hint-x", `${hintXRef.current}px`);
    measureAndCenter();

    const firstMeasureFrame = window.requestAnimationFrame(() => {
      measureAndCenter();
    });
    const secondMeasureFrame = window.requestAnimationFrame(() => {
      measureAndCenter();
    });

    const handleResize = () => {
      measureAndCenter();
      if (isRevealedRef.current) {
        window.requestAnimationFrame(updateRevealDelays);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(firstMeasureFrame);
      window.cancelAnimationFrame(secondMeasureFrame);
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (closingTimeoutRef.current !== null) {
        window.clearTimeout(closingTimeoutRef.current);
        closingTimeoutRef.current = null;
      }
    };
  }, [measureAndCenter, updateRevealDelays]);

  const handleWheel = (event) => {
    event.preventDefault();
    const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    const delta = Math.max(-70, Math.min(70, rawDelta));

    targetPositionRef.current += delta * 0.95;
    startAnimation();
  };

  const handlePointerMove = (event) => {
    const hoveredBar = event.target.closest?.(".archive-blind-page__bar");
    if (!hoveredBar) {
      pointerActiveRef.current = false;
      hoveredBarRef.current = null;
      pointerXRef.current = null;
      updateHoverHint(null);
      startAnimation();
      return;
    }

    const isNewBar = hoveredBarRef.current !== hoveredBar;
    pointerActiveRef.current = true;
    hoveredBarRef.current = hoveredBar;
    pointerXRef.current = event.clientX;
    updateHintPosition(isNewBar || !hintVisibleRef.current);
    updateHoverHint(hoveredBar);
    startAnimation();
  };

  const handlePointerLeave = () => {
    pointerActiveRef.current = false;
    hoveredBarRef.current = null;
    hoveredRenderIndexRef.current = null;
    pointerXRef.current = null;
    updateHoverHint(null);
    startAnimation();
  };

  const handleReveal = () => {
    if (isClosing) return;

    setSelectedId(null);
    const visibleCount = updateRevealDelays();
    pointerActiveRef.current = false;
    hoveredBarRef.current = null;
    hoveredRenderIndexRef.current = null;
    pointerXRef.current = null;
    updateHoverHint(null);
    resetBarScales();
    startAnimation();

    if (!isRevealed) {
      setIsClosing(false);
      setIsRevealed(true);
      return;
    }

    setIsClosing(true);
    const closeDuration = REVEAL_DURATION + (Math.max(visibleCount, 1) * REVEAL_STAGGER) + 160;
    closingTimeoutRef.current = window.setTimeout(() => {
      setIsRevealed(false);
      setIsClosing(false);
      closingTimeoutRef.current = null;
    }, closeDuration);
  };

  const pageClassName = [
    "archive-blind-page",
    isRevealed ? "archive-blind-page--revealed is-revealed" : "",
    isClosing ? "archive-blind-page--closing is-closing" : "",
  ].filter(Boolean).join(" ");

  return (
    <main
      className={pageClassName}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
    >
      <button className="archive-blind-page__back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span>
        <span>BACK</span>
      </button>

      <section className="archive-blind-page__stage" aria-label="Blind pick interaction">
        <div
          className="archive-blind-page__strip"
          ref={stripRef}
        >
          <div className="archive-blind-page__track" ref={trackRef}>
            {loopItems.map((item) => (
              <button
                className={`archive-blind-page__item archive-blind-page__item--${item.color}${selectedId === item.loopKey ? " archive-blind-page__item--selected" : ""}`}
                type="button"
                key={item.loopKey}
                onClick={() => setSelectedId(item.loopKey)}
                style={{ "--blind-index": item.itemIndex }}
                aria-label={isRevealed ? `${item.title} 선택` : "블라인드 픽 선택"}
              >
                <span className="archive-blind-page__bar-shell">
                  <span
                    className="archive-blind-page__bar"
                    data-tempy-playable
                    data-tempy-id={item.id}
                    data-tempy-title={item.title}
                    data-tempy-artist={item.artist}
                    data-tempy-cover={item.cover}
                    data-render-index={item.renderIndex}
                    ref={(node) => {
                      barRefs.current[item.renderIndex] = node;
                    }}
                  >
                    <span className="archive-blind-page__bar-color" />
                    <span className="archive-blind-page__cover-mask" aria-hidden={!isRevealed}>
                      <span className="archive-blind-page__cover-inner">
                        <img src={item.cover} alt="" draggable="false" />
                        <span className="archive-blind-page__cover-info">
                          <span>{item.meta}</span>
                          <strong>{item.title}</strong>
                          <small>{item.artist}</small>
                        </span>
                      </span>
                    </span>
                  </span>
                </span>

                {!isRevealed && selectedId === item.loopKey && (
                  <span className="archive-blind-page__pick">
                    <span className="archive-blind-page__pick-meta">{item.meta}</span>
                    <span className="archive-blind-page__play">Play</span>
                    <strong>{item.title}</strong>
                    <small>{item.artist}</small>
                  </span>
                )}

                {isRevealed && selectedId === item.loopKey && (
                  <span className="archive-blind-page__revealed-info archive-blind-page__revealed-info--item">
                    <span>{item.meta}</span>
                    <span className="archive-blind-page__revealed-info-play">Play</span>
                    <strong>{item.title}</strong>
                    <small>{item.artist}</small>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isRevealed && selectedItem && (
          <div className="archive-blind-page__revealed-info archive-blind-page__revealed-info--global">
            <span>{selectedItem.meta}</span>
            <button type="button">Play</button>
            <strong>{selectedItem.title}</strong>
            <small>{selectedItem.artist}</small>
          </div>
        )}

        <div
          className={`archive-blind-page__hover-hint${hoverHint.visible ? " archive-blind-page__hover-hint--visible" : ""}`}
          ref={hintRef}
          aria-hidden={!hoverHint.visible}
        >
          <span className="archive-blind-page__hover-hint-line archive-blind-page__hover-hint-meta">
            {hoverHint.meta}
          </span>
          <span className="archive-blind-page__hover-hint-line archive-blind-page__hover-hint-text">
            {hoverHint.text}
          </span>
        </div>
      </section>

      <button
        className={`archive-blind-page__eye${isRevealed ? " archive-blind-page__eye--active" : ""}`}
        type="button"
        onClick={handleReveal}
        aria-label={isRevealed ? "블라인드 픽 숨기기" : "앨범 커버 공개하기"}
      >
        <span aria-hidden="true" />
      </button>
    </main>
  );
}

export default ArchiveBlindPick;
