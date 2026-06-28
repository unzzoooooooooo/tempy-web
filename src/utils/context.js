import { useEffect, useMemo, useState } from "react";
import { defaultRecommendedTracks, localTracks } from "../data/tracks";

export const fallbackContext = {
  currentTime: "--:--",
  currentDate: "",
  dayLabel: "",
  locationLabel: "서울 성북구",
  weatherLabel: "흐림",
  temperature: "18°C",
  timeTag: "evening",
  weatherTag: "cloudy",
  locationTag: "seongbuk",
  isFallback: true,
};

const weatherLabels = {
  sunny: "맑음",
  cloudy: "흐림",
  rain: "비",
  snow: "눈",
};

const timeLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
};

function formatClock(date) {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(date) {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

function formatDay(date) {
  return new Intl.DateTimeFormat("ko-KR", { weekday: "long" }).format(date);
}

export function getTimeTag(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getTimeLabel(timeTag) {
  return timeLabels[timeTag] || "Now";
}

function getWeatherTag(weatherCode) {
  if (weatherCode === 0) return "sunny";
  if ([1, 2, 3, 45, 48].includes(weatherCode)) return "cloudy";
  if (
    (weatherCode >= 51 && weatherCode <= 67)
    || (weatherCode >= 80 && weatherCode <= 82)
    || [95, 96, 99].includes(weatherCode)
  ) {
    return "rain";
  }
  if ((weatherCode >= 71 && weatherCode <= 77) || [85, 86].includes(weatherCode)) return "snow";
  return "cloudy";
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is unavailable."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 1000 * 60 * 10,
    });
  });
}

async function fetchWeather(latitude, longitude) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,weather_code",
    timezone: "auto",
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Weather request failed.");
    return response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function reverseGeocode(latitude, longitude) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 7000);
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    "accept-language": "ko",
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Reverse geocoding failed.");
    const result = await response.json();
    const address = result.address || {};
    const rawCity = address.city || address.province || address.state || "";
    const city = rawCity.includes("서울") ? "서울" : rawCity;
    const district = address.borough || address.city_district || address.county || address.suburb || "";
    const locationLabel = [city, district].filter(Boolean).join(" ").trim() || fallbackContext.locationLabel;
    const normalized = `${city} ${district}`;
    const locationTag = normalized.includes("성북") ? "seongbuk" : normalized.includes("서울") ? "seoul" : "urban";

    return { locationLabel, locationTag };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function createBaseContext(date) {
  const timeTag = getTimeTag(date);
  return {
    ...fallbackContext,
    currentTime: formatClock(date),
    currentDate: formatDate(date),
    dayLabel: formatDay(date),
    timeTag,
  };
}

export function useLiveContext() {
  const [now, setNow] = useState(() => new Date());
  const [context, setContext] = useState(() => createBaseContext(new Date()));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const nextDate = new Date();
      setNow(nextDate);
      setContext((current) => ({
        ...current,
        currentTime: formatClock(nextDate),
        currentDate: formatDate(nextDate),
        dayLabel: formatDay(nextDate),
        timeTag: getTimeTag(nextDate),
      }));
    }, 30 * 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadContext() {
      const baseContext = createBaseContext(new Date());
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const [weather, place] = await Promise.allSettled([
          fetchWeather(latitude, longitude),
          reverseGeocode(latitude, longitude),
        ]);

        const weatherValue = weather.status === "fulfilled" ? weather.value : null;
        const weatherTag = getWeatherTag(Number(weatherValue?.current?.weather_code));
        const temperatureNumber = Math.round(Number(weatherValue?.current?.temperature_2m));
        const placeValue = place.status === "fulfilled" ? place.value : null;

        if (!isMounted) return;
        setContext({
          ...baseContext,
          locationLabel: placeValue?.locationLabel || fallbackContext.locationLabel,
          locationTag: placeValue?.locationTag || fallbackContext.locationTag,
          weatherLabel: weatherLabels[weatherTag],
          weatherTag,
          temperature: Number.isFinite(temperatureNumber) ? `${temperatureNumber}°C` : fallbackContext.temperature,
          isFallback: weather.status !== "fulfilled" || place.status !== "fulfilled",
        });
      } catch {
        if (isMounted) {
          setContext({ ...baseContext, isFallback: true });
        }
      }
    }

    loadContext();

    return () => {
      isMounted = false;
    };
  }, []);

  return { now, context };
}

export function getRecommendedTracks(context, minimumCount = 6) {
  const selected = [];
  const addUnique = (tracks) => {
    tracks.forEach((track) => {
      if (!selected.some((item) => item.id === track.id)) {
        selected.push({
          ...track,
          moodText: `${context.currentTime} · ${context.weatherLabel} · ${context.locationLabel}에 맞춰 고른 노래`,
        });
      }
    });
  };

  addUnique(localTracks.filter((track) => (
    track.timeTags.includes(context.timeTag)
    && track.weatherTags.includes(context.weatherTag)
    && track.locationTags?.includes(context.locationTag)
  )));
  addUnique(localTracks.filter((track) => (
    track.timeTags.includes(context.timeTag)
    && track.weatherTags.includes(context.weatherTag)
  )));
  addUnique(localTracks.filter((track) => track.timeTags.includes(context.timeTag)));
  addUnique(localTracks.filter((track) => track.weatherTags.includes(context.weatherTag)));
  addUnique(localTracks.filter((track) => track.locationTags?.includes(context.locationTag)));
  addUnique(defaultRecommendedTracks);
  addUnique(localTracks);

  return selected.slice(0, Math.max(minimumCount, 5));
}

export function useContextRecommendations(minimumCount = 6) {
  const { now, context } = useLiveContext();
  const tracks = useMemo(() => getRecommendedTracks(context, minimumCount), [context, minimumCount]);

  return { now, context, tracks };
}
