const ICON_SIZE_CLASS = {
  small: "tempy-icon--small",
  medium: "tempy-icon--medium",
  large: "tempy-icon--large",
};

function iconClassName(name, size, className) {
  return [
    "tempy-icon",
    `tempy-icon--${name}`,
    ICON_SIZE_CLASS[size] || ICON_SIZE_CLASS.medium,
    className,
  ].filter(Boolean).join(" ");
}

export function ShuffleIcon({ size = "medium", className = "" }) {
  return (
    <svg
      className={iconClassName("shuffle", size, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 7h2.2c4.45 0 4.95 10 9.6 10H20" />
      <path d="m16.75 13.75 3.25 3.25-3.25 3.25" />
      <path d="M4 17h2.2c1.85 0 3.05-1.72 4.08-3.77" />
      <path d="M13.45 9.45C14.2 8.02 14.92 7 15.8 7H20" />
      <path d="m16.75 3.75 3.25 3.25-3.25 3.25" />
    </svg>
  );
}

export function HeartIcon({ filled = false, size = "medium", className = "" }) {
  return (
    <svg
      className={`${iconClassName("heart", size, className)}${filled ? " is-filled" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 20.25S4.25 15.72 4.25 9.6A4.35 4.35 0 0 1 12 6.88 4.35 4.35 0 0 1 19.75 9.6C19.75 15.72 12 20.25 12 20.25Z" />
    </svg>
  );
}

export function ClockIcon({ size = "medium", className = "" }) {
  return (
    <svg
      className={iconClassName("clock", size, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12h4.5" />
    </svg>
  );
}

export function TrackListIcon({ size = "medium", className = "" }) {
  return (
    <svg
      className={iconClassName("track-list", size, className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 7h12M6 12h12M6 17h12" />
    </svg>
  );
}

export function PlayIcon({ className = "" }) {
  return (
    <svg
      className={["tempy-play-icon", className].filter(Boolean).join(" ")}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.72 4.66Q7.3 3.82 7.3 5.48v13.04q0 1.66 1.42.82l10.62-6.47q1.42-.87 0-1.74L8.72 4.66Z" />
    </svg>
  );
}
