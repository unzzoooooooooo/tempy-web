const RETURN_LOCATION_KEY = "tempyReturnLocation";
const RESTORE_SCROLL_KEY = "tempyRestoreScrollY";

export const saveReturnLocation = () => {
  window.sessionStorage.setItem(
    RETURN_LOCATION_KEY,
    JSON.stringify({
      pathname: window.location.pathname,
      search: window.location.search,
      scrollY: window.scrollY,
    }),
  );
};

export const consumeReturnLocation = () => {
  const storedLocation = window.sessionStorage.getItem(RETURN_LOCATION_KEY);
  if (!storedLocation) return null;

  window.sessionStorage.removeItem(RETURN_LOCATION_KEY);

  try {
    const location = JSON.parse(storedLocation);
    if (!location || typeof location.pathname !== "string") return null;

    return {
      pathname: location.pathname,
      search: typeof location.search === "string" ? location.search : "",
      scrollY: Number(location.scrollY),
    };
  } catch {
    return null;
  }
};

export const setPendingScrollRestore = (scrollY) => {
  window.sessionStorage.setItem(RESTORE_SCROLL_KEY, String(scrollY));
};

export const consumePendingScrollRestore = () => {
  const storedScrollY = window.sessionStorage.getItem(RESTORE_SCROLL_KEY);
  if (storedScrollY === null) return null;

  window.sessionStorage.removeItem(RESTORE_SCROLL_KEY);
  const scrollY = Number(storedScrollY);

  return Number.isFinite(scrollY) ? scrollY : 0;
};
