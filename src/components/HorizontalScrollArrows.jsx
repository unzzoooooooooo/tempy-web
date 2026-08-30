export function HorizontalScrollArrows({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  label = "콘텐츠",
}) {
  const stopPointerPropagation = (event) => event.stopPropagation();

  const renderChevron = () => (
    <svg aria-hidden="true" viewBox="0 0 14 44">
      <path d="M4 3L10 22L4 41" />
    </svg>
  );

  return (
    <div className="horizontal-scroll-arrows" aria-hidden={!canScrollLeft && !canScrollRight}>
      <button
        className={`horizontal-scroll-arrow horizontal-scroll-arrow--previous${canScrollLeft ? " is-available" : ""}`}
        type="button"
        aria-label={`${label} 이전 항목 보기`}
        disabled={!canScrollLeft}
        onPointerDown={stopPointerPropagation}
        onClick={onScrollLeft}
      >
        {renderChevron()}
      </button>
      <button
        className={`horizontal-scroll-arrow horizontal-scroll-arrow--next${canScrollRight ? " is-available" : ""}`}
        type="button"
        aria-label={`${label} 다음 항목 보기`}
        disabled={!canScrollRight}
        onPointerDown={stopPointerPropagation}
        onClick={onScrollRight}
      >
        {renderChevron()}
      </button>
    </div>
  );
}
