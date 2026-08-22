import { useEffect, useMemo, useState } from "react";
import { tracks as musicCatalogTracks } from "../data/musicCatalog";
import {
  createRecommendationSeed,
  formatSeedDate,
  getDaypart,
  normalizeWeather,
  recommendTracks,
} from "./recommendations";

export const fallbackContext = {
  currentTime: "--:--",
  currentDate: "",
  dayLabel: "",
  seedDate: "",
  locationLabel: "위치 확인 불가",
  weatherLabel: "흐림",
  temperature: "18°C",
  timeTag: "evening",
  weatherTag: "cloudy",
  locationTag: "urban",
  latitude: null,
  longitude: null,
  coordinateSource: "fallback",
  locationSource: "fallback",
  locationStatus: "loading",
  locationErrorCode: null,
  locationErrorMessage: "",
  isSecureContext: false,
  isFallback: true,
};

const weatherLabels = {
  sunny: "맑음",
  cloudy: "흐림",
  rain: "비",
  snow: "눈",
};

const timeLabels = {
  lateNight: "Late Night",
  dawn: "Dawn",
  earlyMorning: "Early Morning",
  morning: "Morning",
  afternoon: "Afternoon",
  lateAfternoon: "Late Afternoon",
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
  return getDaypart(date.getHours());
}

export function getTimeLabel(timeTag) {
  return timeLabels[timeTag] || "Now";
}

export { getDaypart, normalizeWeather };

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!window.isSecureContext) {
      reject(Object.assign(new Error("Geolocation requires a secure context."), { code: 0 }));
      return;
    }

    if (!navigator.geolocation) {
      reject(Object.assign(new Error("Geolocation is unavailable."), { code: 0 }));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    });
  });
}

function getLocationFailureStatus(error) {
  if (!window.isSecureContext) return "insecure";
  if (!navigator.geolocation) return "unsupported";
  if (error?.code === 1) return "denied";
  if (error?.code === 2) return "unavailable";
  if (error?.code === 3) return "timeout";
  return "unavailable";
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
    addressdetails: "1",
    zoom: "10",
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Reverse geocoding failed.");
    const result = await response.json();
    const address = result.address || {};
    const regionRaw = address.state || address.province || address.city || "";
    const cityRaw = address.city || address.municipality || address.county || "";
    const districtRaw = address.borough || address.city_district || address.district || address.county || "";
    const isMetropolitan = /(특별시|광역시)/.test(`${regionRaw} ${cityRaw}`);
    const region = (regionRaw || cityRaw)
      .replace("서울특별시", "서울")
      .replace("인천광역시", "인천")
      .replace("부산광역시", "부산")
      .replace("대구광역시", "대구")
      .replace("광주광역시", "광주")
      .replace("대전광역시", "대전")
      .replace("울산광역시", "울산")
      .replace("세종특별자치시", "세종")
      .replace("경기도", "경기")
      .replace("강원특별자치도", "강원")
      .replace("충청북도", "충북")
      .replace("충청남도", "충남")
      .replace("전북특별자치도", "전북")
      .replace("전라남도", "전남")
      .replace("경상북도", "경북")
      .replace("경상남도", "경남")
      .replace("제주특별자치도", "제주");
    const locality = isMetropolitan ? districtRaw : cityRaw;
    const locationParts = [region, locality].filter((part, index, parts) => part && parts.indexOf(part) === index);
    const locationLabel = locationParts.join(" ").trim();
    if (!locationLabel) throw new Error("Reverse geocoding returned no administrative area.");
    const locationTag = locationLabel.includes("서울") ? "seoul" : "urban";

    return { locationLabel, locationTag };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

let liveEnvironmentRequest;
let liveEnvironmentRequestedAt = 0;
let liveEnvironmentRetryAllowed = true;

async function requestLiveEnvironment() {
  const cacheLifetime = 5 * 60 * 1000;
  if (
    liveEnvironmentRequest
    && (!liveEnvironmentRetryAllowed || Date.now() - liveEnvironmentRequestedAt < cacheLifetime)
  ) {
    return liveEnvironmentRequest;
  }

  liveEnvironmentRequestedAt = Date.now();
  liveEnvironmentRequest = getCurrentPosition().then(async (position) => {
    const { latitude, longitude } = position.coords;
    const [weather, place] = await Promise.allSettled([
      fetchWeather(latitude, longitude),
      reverseGeocode(latitude, longitude),
    ]);
    const weatherValue = weather.status === "fulfilled" ? weather.value : null;
    const weatherTag = normalizeWeather(weatherValue?.current?.weather_code);
    const temperatureNumber = Math.round(Number(weatherValue?.current?.temperature_2m));
    const placeValue = place.status === "fulfilled" ? place.value : null;

    return {
      locationLabel: placeValue?.locationLabel || fallbackContext.locationLabel,
      locationTag: placeValue?.locationTag || fallbackContext.locationTag,
      latitude,
      longitude,
      coordinateSource: "gps",
      locationSource: placeValue ? "gps" : "fallback",
      locationStatus: placeValue ? "success" : "reverse-error",
      locationErrorCode: null,
      locationErrorMessage: place.status === "rejected" ? String(place.reason?.message || place.reason) : "",
      isSecureContext: window.isSecureContext,
      weatherLabel: weatherLabels[weatherTag],
      weatherTag,
      temperature: Number.isFinite(temperatureNumber) ? `${temperatureNumber}°C` : fallbackContext.temperature,
      isFallback: weather.status !== "fulfilled" || place.status !== "fulfilled",
    };
  }).catch((error) => {
    const locationStatus = getLocationFailureStatus(error);
    if (locationStatus === "denied" || locationStatus === "insecure" || locationStatus === "unsupported") {
      liveEnvironmentRetryAllowed = false;
    }
    return {
      locationLabel: fallbackContext.locationLabel,
      locationTag: fallbackContext.locationTag,
      latitude: null,
      longitude: null,
      coordinateSource: "fallback",
      locationSource: "fallback",
      locationStatus,
      locationErrorCode: Number.isFinite(Number(error?.code)) ? Number(error.code) : null,
      locationErrorMessage: String(error?.message || "Geolocation failed."),
      isSecureContext: window.isSecureContext,
      weatherLabel: fallbackContext.weatherLabel,
      weatherTag: fallbackContext.weatherTag,
      temperature: fallbackContext.temperature,
      isFallback: true,
    };
  });

  return liveEnvironmentRequest;
}

function createBaseContext(date) {
  const timeTag = getTimeTag(date);
  return {
    ...fallbackContext,
    currentTime: formatClock(date),
    currentDate: formatDate(date),
    seedDate: formatSeedDate(date),
    dayLabel: formatDay(date),
    timeTag,
    isSecureContext: window.isSecureContext,
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
        seedDate: formatSeedDate(nextDate),
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
        const environment = await requestLiveEnvironment();

        if (!isMounted) return;
        setContext({
          ...baseContext,
          ...environment,
        });
      } catch {
        if (isMounted) {
          setContext({ ...baseContext, isFallback: true });
        }
      }
    }

    loadContext();
    const refreshId = window.setInterval(loadContext, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshId);
    };
  }, []);

  return { now, context };
}

export function getRecommendedTracks(context, minimumCount = 6) {
  return recommendTracks(
    musicCatalogTracks,
    context,
    Math.max(minimumCount, 5),
    "todaysTempo",
  ).map((track) => ({
    ...track,
    moodText: `${getTimeLabel(context.timeTag)} · ${context.weatherLabel} · ${context.locationLabel}에 맞춰 고른 노래`,
  }));
}

export function useContextRecommendations(minimumCount = 6, section = "todaysTempo") {
  const { now, context } = useLiveContext();
  const recommendationSeed = createRecommendationSeed(context, section);
  const tracks = useMemo(() => (
    recommendTracks(musicCatalogTracks, context, Math.max(minimumCount, 5), section).map((track) => ({
      ...track,
      moodText: `${getTimeLabel(context.timeTag)} · ${context.weatherLabel} · ${context.locationLabel}에 맞춰 고른 노래`,
    }))
  // The seed and location label are stable within the active environment window.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [minimumCount, recommendationSeed, context.locationLabel, context.weatherLabel, section]);

  return { now, context: { ...context, recommendationSeed }, tracks };
}
