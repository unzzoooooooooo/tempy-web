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
